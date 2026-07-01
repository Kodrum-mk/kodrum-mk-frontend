import { NextResponse } from "next/server";

const STRAPI_BASE_URL = `${process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"}/api`;

type StrapiSubject = {
  id: number;
  documentId?: string;
  name?: string;
  slug?: string;
  faculty?: { name?: string };
  instructors?: { name?: string }[];
};

type StrapiPrepSession = {
  id: number;
  documentId?: string;
  title?: string;
  subjects?: StrapiSubject[];
};

function mapSubject(subject: StrapiSubject) {
  return {
    id: subject.documentId ?? String(subject.id),
    name: subject.name ?? "",
    slug: subject.slug ?? "",
    faculty: subject.faculty?.name ?? "",
    instructors: (subject.instructors ?? []).map((instructor) => instructor.name ?? ""),
  };
}

export async function GET() {
  try {
    const activeResponse = await fetch(
      `${STRAPI_BASE_URL}/prep-sessions?filters[active][$eq]=true&populate[subjects][populate][0]=faculty&populate[subjects][populate][1]=instructors&sort[0]=title:asc&pagination[page]=1&pagination[pageSize]=200`,
      { next: { revalidate: 60 } },
    );

    if (!activeResponse.ok) {
      return NextResponse.json(
        { error: "Неуспешно читање предмети." },
        { status: 502 },
      );
    }

    const activePayload = (await activeResponse.json()) as {
      data?: StrapiPrepSession[];
    };
    const activePrepSessions = activePayload.data ?? [];
    const activePrepSession =
      activePrepSessions.find(
        (session) => (session.subjects ?? []).length > 0,
      ) ??
      activePrepSessions[0] ??
      null;
    const activeSubjects = Array.from(
      new Map(
        activePrepSessions
          .flatMap((session) => (session.subjects ?? []).map(mapSubject))
          .map((subject) => [subject.id, subject]),
      ).values(),
    );

    if (activeSubjects.length > 0) {
      return NextResponse.json({
        prepSession: activePrepSession
          ? {
              id: activePrepSession.documentId ?? String(activePrepSession.id),
              title: activePrepSession.title ?? "",
            }
          : null,
        subjects: activeSubjects,
      });
    }

    const fallbackResponse = await fetch(
      `${STRAPI_BASE_URL}/subjects?populate[0]=faculty&populate[1]=instructors&sort[0]=name:asc`,
      { next: { revalidate: 60 } },
    );

    if (!fallbackResponse.ok) {
      return NextResponse.json(
        { error: "Неуспешно читање предмети." },
        { status: 502 },
      );
    }

    const fallbackPayload = (await fallbackResponse.json()) as {
      data?: StrapiSubject[];
    };
    const subjects = (fallbackPayload.data ?? []).map(mapSubject);

    return NextResponse.json({ subjects });
  } catch {
    return NextResponse.json(
      { error: "Се случи грешка при читање предмети." },
      { status: 500 },
    );
  }
}
