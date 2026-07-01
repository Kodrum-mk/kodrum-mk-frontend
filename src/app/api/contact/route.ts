import { NextResponse } from "next/server";
import { rateLimit } from "@/utils/rateLimit";

const TELEGRAM_API_BASE = "https://api.telegram.org";

type ContactPayload = {
  ime?: string;
  prezime?: string;
  email?: string;
  predmet?: string;
  poraka?: string;
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
    return NextResponse.json({ error: "Премногу барања. Обидете се повторно подоцна." }, { status: 429 });
  }

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
    const topicId = process.env.TELEGRAM_TOPIC_ID?.trim();
    const parsedTopicId = topicId ? Number(topicId) : null;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: "Telegram не е сетирано." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as ContactPayload;

    const ime = getString(body.ime);
    const prezime = getString(body.prezime);
    const email = getString(body.email);
    const predmet = getString(body.predmet);
    const poraka = getString(body.poraka);

    if (!ime || !prezime || !email || !poraka) {
      return NextResponse.json(
        { error: "Недостасуваат задолжителни полиња." },
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
              "Нова порака од контакт форма",
              `Име: ${ime} ${prezime}`,
              `Email: ${email}`,
              `Предмет: ${predmet || "-"}`,
              `Порака: ${poraka}`,
            ].join("\n"),
          ),
        }),
      },
    );

    if (!telegramResponse.ok) {
      return NextResponse.json(
        { error: "Неуспешно праќање кон Telegram." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Се случи грешка при праќање." },
      { status: 500 },
    );
  }
}
