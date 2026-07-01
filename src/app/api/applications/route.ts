import { NextResponse } from "next/server";
import { rateLimit } from "@/utils/rateLimit";

const STRAPI_BASE_URL = `${process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"}/api`;

type ApplicationPayload = {
  ime?: string;
  prezime?: string;
  email?: string;
  telefon?: string;
  discordUsername?: string;
  subjectId?: string;
  subjectName?: string;
  prepSessionId?: string;
  prepSessionTitle?: string;
  faculty?: string;
  attendanceText?: string;
  attendancePreference?: string;
  coursePrice?: string;
  poraka?: string;
};

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Премногу барања. Обидете се повторно подоцна." }, { status: 429 });
  }

  try {
    const body = (await request.json()) as ApplicationPayload;
    const ime = getString(body.ime);
    const prezime = getString(body.prezime);
    const email = getString(body.email);
    const telefon = getString(body.telefon);
    const discordUsername = getString(body.discordUsername);
    const subjectId = getString(body.subjectId);
    const subjectName = getString(body.subjectName);
    const prepSessionId = getString(body.prepSessionId);
    const prepSessionTitle = getString(body.prepSessionTitle);
    const faculty = getString(body.faculty);
    const attendanceText = getString(body.attendanceText);
    const attendancePreference = getString(body.attendancePreference);
    const coursePrice = getString(body.coursePrice);
    const poraka = getString(body.poraka);

    if (!ime || !prezime || !email || !telefon || (!subjectId && !subjectName)) {
      return NextResponse.json(
        { error: "Недостасуваат задолжителни полиња." },
        { status: 400 },
      );
    }

    if (attendancePreference === "online" && !discordUsername) {
      return NextResponse.json(
        { error: "Discord корисничко име е задолжително за онлајн припреми." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Внесете валиден email." },
        { status: 400 },
      );
    }

    const response = await fetch(`${STRAPI_BASE_URL}/applications/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          firstName: ime,
          lastName: prezime,
          email,
          phone: telefon,
          discordUsername,
          message: poraka,
          subjectId,
          subjectName,
          prepSessionId,
          prepSessionTitle,
          faculty,
          attendanceText,
          attendancePreference,
          coursePrice,
        },
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Неуспешно зачувување во Strapi." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Се случи грешка при зачувување." },
      { status: 500 },
    );
  }
}
