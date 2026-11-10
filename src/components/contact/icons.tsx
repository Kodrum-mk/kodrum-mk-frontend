/** Line icons for the contact buttons (24x24, currentColor). */
export type ContactIconName =
  | "call"
  | "whatsapp"
  | "viber"
  | "instagram"
  | "facebook"
  | "discord"
  | "email"
  | "chat";

export default function ContactIcon({
  name,
  className = "h-5 w-5",
}: {
  name: ContactIconName;
  className?: string;
}) {
  const s = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {name === "call" && (
        <path
          {...s}
          d="M5 4.5h3.2l1.6 4-2 1.3a11 11 0 0 0 5.4 5.4l1.3-2 4 1.6V18a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3 6.7 2 2 0 0 1 5 4.5Z"
        />
      )}
      {(name === "whatsapp" || name === "viber") && (
        <>
          <path {...s} d="M4 20l1.2-4A8.5 8.5 0 1 1 8.2 19L4 20Z" />
          <path
            {...s}
            d="M9.3 8.8c.2-.4.6-.4.9-.1l.8 1.1c.2.3.1.6-.1.9l-.4.5c.7 1.3 1.7 2.2 3 2.9l.5-.5c.3-.3.6-.3.9-.1l1.1.8c.3.2.3.6 0 .9-.6.8-1.5 1-2.4.7-2.4-.8-4.4-2.8-5-5.2-.1-.5 0-1.1.7-1.9Z"
          />
        </>
      )}
      {name === "instagram" && (
        <>
          <rect {...s} x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle {...s} cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
        </>
      )}
      {name === "facebook" && (
        <path
          {...s}
          d="M14.5 8H17V4.5h-2.7C11.6 4.5 10 6.2 10 8.8V11H7.5v3.5H10V21h3.5v-6.5H16l.5-3.5h-3V9.1c0-.7.4-1.1 1-1.1Z"
        />
      )}
      {name === "discord" && (
        <>
          <path
            {...s}
            d="M7.5 6.5C9 5.8 10.5 5.5 12 5.5s3 .3 4.5 1c1.7 2.4 2.5 5 2.5 8.2-1.3 1-2.7 1.6-4.2 2l-.9-1.5M7.5 6.5C6 8.9 5 11.5 5 14.7c1.3 1 2.7 1.6 4.2 2l.9-1.5"
          />
          <path {...s} d="M8.5 15.2c2 .8 5 .8 7 0" />
          <circle cx="9.6" cy="12" r="1.15" fill="currentColor" />
          <circle cx="14.4" cy="12" r="1.15" fill="currentColor" />
        </>
      )}
      {name === "email" && (
        <>
          <rect {...s} x="3" y="5.5" width="18" height="13" rx="2.5" />
          <path {...s} d="m4 7.5 8 6 8-6" />
        </>
      )}
      {name === "chat" && <path {...s} d="M4 5.5h16v10.5H10.5L6 19.5V16H4Z" />}
    </svg>
  );
}
