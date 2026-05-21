import { NextResponse } from "next/server";

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
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
    const topicId = process.env.TELEGRAM_TOPIC_ID?.trim();
    const messageThreadId = topicId ? Number(topicId) : undefined;

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
          ...(messageThreadId ? { message_thread_id: messageThreadId } : {}),
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
