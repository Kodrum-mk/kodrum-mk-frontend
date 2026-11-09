import { NextResponse } from "next/server";
import { rateLimit } from "@/utils/rateLimit";

const TELEGRAM_API_BASE = "https://api.telegram.org";

type ContactPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function truncateMessage(message: string) {
  return message.length > 3900 ? `${message.slice(0, 3900)}...` : message;
}

// Mattermost (chat.kodrum.dev) first when MATTERMOST_WEBHOOK_URL is set; Telegram when it is not,
// or when the Mattermost post fails (Mattermost runs on one home server, so it can be down).
async function postToMattermost(text: string) {
  const hookUrl = process.env.MATTERMOST_WEBHOOK_URL?.trim();
  if (!hookUrl) return false;
  try {
    const response = await fetch(hookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "kodrum-mk-frontend" },
      body: JSON.stringify({ text }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
    const topicId = process.env.TELEGRAM_TOPIC_ID?.trim();
    const parsedTopicId = topicId ? Number(topicId) : null;

    const hasMattermost = Boolean(process.env.MATTERMOST_WEBHOOK_URL?.trim());
    if (!hasMattermost && (!botToken || !chatId)) {
      return NextResponse.json(
        { error: "Notifications are not configured." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as ContactPayload;

    const firstName = getString(body.firstName);
    const lastName = getString(body.lastName);
    const email = getString(body.email);
    const subject = getString(body.subject);
    const message = getString(body.message);

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    const text = truncateMessage(
      [
        "Нова порака од контакт форма (New Contact Form Message)",
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        `Subject: ${subject || "-"}`,
        `Message: ${message}`,
      ].join("\n"),
    );

    if (await postToMattermost(text)) {
      return NextResponse.json({ ok: true });
    }

    if (!botToken || !chatId) {
      return NextResponse.json({ error: "Failed to send." }, { status: 502 });
    }

    const telegramResponse = await fetch(
      `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          ...(parsedTopicId != null && !isNaN(parsedTopicId) ? { message_thread_id: parsedTopicId } : {}),
          text,
        }),
      },
    );

    if (!telegramResponse.ok) {
      return NextResponse.json(
        { error: "Failed to send to Telegram." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "An error occurred while sending." },
      { status: 500 },
    );
  }
}
