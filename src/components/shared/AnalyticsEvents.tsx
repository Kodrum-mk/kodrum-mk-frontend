"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { safeUrl, storeUtmParamsFromUrl, trackEvent } from "@/utils/analytics";

const scrollMarks = [25, 50, 75, 90];
const engagedMarks = [30, 60, 180];
const bookingWords = [
  "book",
  "reserve",
  "schedule",
  "apply",
  "start",
  "пријав",
  "закаж",
  "резерв",
  "започ",
];
const socialHosts = [
  "instagram.",
  "facebook.",
  "linkedin.",
  "tiktok.",
  "youtube.",
  "x.com",
  "twitter.",
];

function getText(element: Element) {
  return (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 100);
}

function isExternal(url: URL) {
  return url.origin !== window.location.origin;
}

function isSocial(url: URL) {
  return socialHosts.some((host) => url.hostname.toLowerCase().includes(host));
}

export function AnalyticsEvents() {
  const pathname = usePathname();

  useEffect(() => {
    storeUtmParamsFromUrl();

    // subject_view: route-level view for subject/course listing pages.
    if (pathname === "/pripremi") {
      trackEvent("subject_view", { subject_name: "Припреми" });
    }
  }, [pathname]);

  useEffect(() => {
    const fired = new Set<number>();
    let ticking = false;

    function getScrollPercent() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height <= 0) return 100;
      return Math.min(100, Math.round((scrollTop / height) * 100));
    }

    function checkScroll() {
      ticking = false;
      const percent = getScrollPercent();

      scrollMarks.forEach((mark) => {
        if (percent >= mark && !fired.has(mark)) {
          fired.add(mark);
          // scroll_depth: fire once per page at useful depth marks.
          trackEvent("scroll_depth", { scroll_percent: mark });
        }
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(checkScroll);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    checkScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const timers = engagedMarks.map((seconds) =>
      window.setTimeout(() => {
        // engaged_time: fire once per page after sustained time on page.
        trackEvent("engaged_time", { engagement_seconds: seconds });
      }, seconds * 1000),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [pathname]);

  useEffect(() => {
    const seen = new Set<Element>();

    function trackVisibleSections() {
      const targets = document.querySelectorAll<HTMLElement>(
        "[data-analytics-section]",
      );
      if (targets.length === 0) return () => undefined;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || seen.has(entry.target)) return;

            const target = entry.target as HTMLElement;
            seen.add(target);
            const sectionName = target.dataset.analyticsSection;

            if (sectionName === "pricing") {
              // pricing_view: pricing section became visible.
              trackEvent("pricing_view", { section_name: "pricing" });
            }

            if (sectionName === "faq") {
              // faq_view: FAQ section became visible.
              trackEvent("faq_view", { section_name: "faq" });
            }

            observer.unobserve(target);
          });
        },
        { threshold: 0.35 },
      );

      targets.forEach((target) => observer.observe(target));
      return () => observer.disconnect();
    }

    let cleanup = trackVisibleSections();
    const mutationObserver = new MutationObserver(() => {
      cleanup();
      cleanup = trackVisibleSections();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      cleanup();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const subject = target.closest<HTMLElement>("[data-analytics-subject]");
      if (subject) {
        // subject_click: subject/course card or link clicked.
        trackEvent("subject_click", {
          subject_name: subject.dataset.analyticsSubject,
          link_url:
            subject instanceof HTMLAnchorElement
              ? safeUrl(subject.href)
              : undefined,
        });
      }

      const clickable = target.closest<HTMLElement>("a, button");
      if (!clickable) return;

      const ctaText = getText(clickable);
      const ctaTextLower = ctaText.toLowerCase();
      const link =
        clickable instanceof HTMLAnchorElement
          ? clickable
          : clickable.closest("a");
      const href = link?.getAttribute("href");

      if (href?.startsWith("tel:")) {
        // phone_click: telephone link clicked. Number is not sent to GA.
        trackEvent("phone_click", { link_url: "tel", cta_text: "phone" });
        return;
      }

      if (href?.startsWith("mailto:")) {
        // email_click: email link clicked. Email address is not sent to GA.
        trackEvent("email_click", { link_url: "mailto", cta_text: "email" });
        return;
      }

      const shouldTrackBooking =
        clickable.dataset.analyticsCta === "booking" ||
        bookingWords.some((word) => ctaTextLower.includes(word));

      if (shouldTrackBooking) {
        // booking_click: high-intent CTA clicked.
        trackEvent("booking_click", {
          link_url: link ? safeUrl(link.href) : undefined,
          cta_text: ctaText,
        });
      }

      if (!link?.href) return;

      try {
        const url = new URL(link.href);
        if (!isExternal(url)) return;

        if (isSocial(url)) {
          // social_click: social profile/community link clicked.
          trackEvent("social_click", {
            link_url: safeUrl(url.href),
            cta_text: ctaText,
          });
        } else {
          // outbound_click: external non-social link clicked.
          trackEvent("outbound_click", {
            link_url: safeUrl(url.href),
            cta_text: ctaText,
          });
        }
      } catch {
        // Analytics must never break the site.
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
}
