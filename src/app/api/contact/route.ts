import { NextResponse } from "next/server";

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1504853032498888704/6QyyDW2CtihvXC85ktLwG8DIMXDibVLbG_k6_3DQ0ogkx2PHr1QZrH6oBYY8Sf5w7Mx2";

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

export async function POST(request: Request) {
  try {
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

    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: [
          "Нова порака од контакт форма",
          `Име: ${ime} ${prezime}`,
          `Email: ${email}`,
          `Предмет: ${predmet || "-"}`,
          `Порака: ${poraka}`,
        ].join("\n"),
      }),
    });

    if (!discordResponse.ok) {
      return NextResponse.json(
        { error: "Неуспешно праќање кон Discord." },
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
