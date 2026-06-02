"use client";

type AnalyticsParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
const LATEST_UTM_KEY = "kodrum_latest_utm";
const FIRST_UTM_KEY = "kodrum_first_utm";
const isDev = process.env.NODE_ENV === "development";
const isEnvDebug = process.env.NEXT_PUBLIC_GA_DEBUG === "true";

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function readSessionJson<T>(key: string): T | null {
  if (!isBrowser()) return null;

  try {
    const value = window.sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function writeSessionJson(key: string, value: unknown) {
  if (!isBrowser()) return;

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Analytics must never break the site.
  }
}

function cleanParams(params: AnalyticsParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
}

function isDebugEnabled() {
  if (!isDev || !isBrowser()) return false;

  try {
    return (
      isEnvDebug || window.sessionStorage.getItem("kodrum_ga_debug") === "true"
    );
  } catch {
    return isEnvDebug;
  }
}

export function storeUtmParamsFromUrl() {
  if (!isBrowser()) return;

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const urlUtm = UTM_KEYS.reduce<UtmParams>((result, key) => {
      const value = searchParams.get(key);
      if (value) result[key] = value.slice(0, 150);
      return result;
    }, {});

    if (Object.keys(urlUtm).length === 0) return;

    writeSessionJson(LATEST_UTM_KEY, urlUtm);

    if (!readSessionJson<UtmParams>(FIRST_UTM_KEY)) {
      writeSessionJson(FIRST_UTM_KEY, urlUtm);
    }
  } catch {
    // Analytics must never break the site.
  }
}

export function getStoredUtmParams() {
  const latest = readSessionJson<UtmParams>(LATEST_UTM_KEY) ?? {};
  const first = readSessionJson<UtmParams>(FIRST_UTM_KEY) ?? {};

  return {
    ...latest,
    first_utm_source: first.utm_source,
    first_utm_medium: first.utm_medium,
    first_utm_campaign: first.utm_campaign,
    first_utm_content: first.utm_content,
    first_utm_term: first.utm_term,
  };
}

function baseParams() {
  if (!isBrowser()) return {};

  return cleanParams({
    page_path: window.location.pathname,
    page_title: document.title,
    referrer: document.referrer ? safeUrl(document.referrer) : undefined,
    ...getStoredUtmParams(),
  });
}

export function safeUrl(url: string) {
  try {
    if (url.startsWith("mailto:")) return "mailto";
    if (url.startsWith("tel:")) return "tel";

    const parsed = new URL(url, window.location.origin);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return undefined;
  }
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (!isBrowser()) return;

  try {
    const debugEnabled = isDebugEnabled();
    const payload = cleanParams({
      ...baseParams(),
      ...params,
      debug_mode: debugEnabled || undefined,
    });

    if (debugEnabled) {
      console.info("[analytics]", eventName, payload);
    }

    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, payload);
  } catch {
    // Analytics must never break the site.
  }
}

export function trackPageView(path?: string) {
  if (!isBrowser()) return;

  try {
    storeUtmParamsFromUrl();

    const pagePath = path ?? window.location.pathname;
    const debugEnabled = isDebugEnabled();
    const payload = cleanParams({
      ...baseParams(),
      page_path: pagePath,
      debug_mode: debugEnabled || undefined,
    });

    if (debugEnabled) {
      console.info("[analytics] page_view", payload);
    }

    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", payload);
  } catch {
    // Analytics must never break the site.
  }
}
