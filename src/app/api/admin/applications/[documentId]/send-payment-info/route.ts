import { NextResponse } from "next/server";

const STRAPI_BASE_URL = `${process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"}/api`;
const ADMIN_KEY = process.env.ADMIN_DASHBOARD_KEY?.trim();
const STRAPI_KEY = process.env.STRAPI_DASHBOARD_KEY?.trim();

function isAllowed(request: Request) {
  return Boolean(ADMIN_KEY) && request.headers.get("x-admin-key") === ADMIN_KEY;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ documentId: string }> },
) {
  if (!isAllowed(request)) {
    return NextResponse.json({ error: "Bad admin key." }, { status: 401 });
  }
  if (!STRAPI_KEY) {
    return NextResponse.json({ error: "Missing Strapi admin key." }, { status: 500 });
  }

  try {
    const { documentId } = await context.params;
    const response = await fetch(
      `${STRAPI_BASE_URL}/applications-dashboard/${documentId}/send-payment-info`,
      {
        method: "POST",
        headers: { "x-admin-key": STRAPI_KEY },
      },
    );
    
    let payload: any = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const errorMsg =
        payload?.error?.message ??
        (typeof payload?.error === "string" ? payload.error : null) ??
        `Strapi server error (${response.status}).`;
      return NextResponse.json({ error: errorMsg }, { status: response.status });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Send payment info email failed." },
      { status: 500 },
    );
  }
}
