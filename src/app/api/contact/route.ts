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

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: "Telegram is not configured." },
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

    const telegramResponse = await fetch(
      `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          ...(parsedTopicId != null && !isNaN(parsedTopicId) ? { message_thread_id: parsedTopicId } : {}),
          text: truncateMessage(
            [
              "Нова порака од контакт форма (New Contact Form Message)",
              `Name: ${firstName} ${lastName}`,
              `Email: ${email}`,
              `Subject: ${subject || "-"}`,
              `Message: ${message}`,
            ].join("\n"),
          ),
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
