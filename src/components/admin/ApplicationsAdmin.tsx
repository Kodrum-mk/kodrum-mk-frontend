"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  documentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  discordUsername?: string;
  prepSessionId?: string;
  prepSessionTitle?: string;
  faculty?: string;
  attendancePreference?: "online" | "physical";
  subject?: string;
  subjectPrice?: number;
  paid: boolean;
  paidAmount: number;
  viberMessaged: boolean;
  adminNote?: string;
  createdAt: string;
};

type Total = {
  course: string;
  paidCount: number;
  totalPaid: number;
  totalApplications: number;
};

type PrepSessionOption = {
  id: string;
  title: string;
  active: boolean;
  spotsLeft: number;
  subjectNames: string[];
};

type DashboardData = {
  rows: Row[];
  prepSessions: PrepSessionOption[];
  activePrepSessionId?: string | null;
  totals: Total[];
  grandTotal: number;
};

function formatMkd(value: number) {
  return `${value.toLocaleString("mk-MK")} МКД`;
}

function getSubject(row: Row) {
  return row.prepSessionTitle || row.subject || "Друго";
}

function getFaculty(row: Row) {
  return row.faculty || "Без факултет";
}

function matchesSearch(row: Row, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  return [
    row.firstName,
    row.lastName,
    row.email,
    row.discordUsername,
  ].some((value) => value?.toLowerCase().includes(needle));
}

function matchesPrepSession(
  row: Row,
  prepSessionId: string,
  prepSession?: PrepSessionOption,
) {
  if (prepSessionId === "all") return true;
  if (!prepSession) return false;

  return (
    row.prepSessionId === prepSession.id ||
    prepSession.subjectNames.includes(row.subject ?? "") ||
    prepSession.subjectNames.includes(row.prepSessionTitle ?? "")
  );
}

export function ApplicationsAdmin() {
  const [adminKey, setAdminKey] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [paidFilter, setPaidFilter] = useState("all");
  const [prepSessionFilter, setPrepSessionFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    if (!data) return;
    setPrepSessionFilter((current) => {
      if (
        current !== "all" &&
        data.prepSessions.some((session) => session.id === current)
      ) {
        return current;
      }

      return data.activePrepSessionId ?? "all";
    });
  }, [data]);

  const subjectsWithPrices = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, number | undefined>();
    for (const row of data.rows) {
      const subj = getSubject(row);
      if (subj !== "Друго" && !map.has(subj)) {
        map.set(subj, row.subjectPrice);
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, price]) => ({ name, price }));
  }, [data]);

  const selectedPrepSession = useMemo(() => {
    return data?.prepSessions.find((session) => session.id === prepSessionFilter);
  }, [data, prepSessionFilter]);

  const prepSessionRows = useMemo(() => {
    if (!data) return [];
    return data.rows.filter((row) =>
      matchesPrepSession(row, prepSessionFilter, selectedPrepSession),
    );
  }, [data, prepSessionFilter, selectedPrepSession]);

  const rows = useMemo(() => {
    if (!data) return [];
    return data.rows.filter((row) => {
      const matchesSubject =
        courseFilter === "all" || getSubject(row) === courseFilter;
      const matchesPaid =
        paidFilter === "all" ||
        (paidFilter === "paid" && row.paid) ||
        (paidFilter === "unpaid" && !row.paid);
      const matchesUser = matchesSearch(row, userSearch);
      const matchesPrep = matchesPrepSession(
        row,
        prepSessionFilter,
        selectedPrepSession,
      );

      return matchesSubject && matchesPaid && matchesUser && matchesPrep;
    });
  }, [
    courseFilter,
    data,
    paidFilter,
    prepSessionFilter,
    selectedPrepSession,
    userSearch,
  ]);

  const totalPaidForRows = useMemo(() => {
    return rows.reduce((sum, row) => sum + row.paidAmount, 0);
  }, [rows]);

  const totalPaidForPrepSession = useMemo(() => {
    return prepSessionRows.reduce((sum, row) => sum + row.paidAmount, 0);
  }, [prepSessionRows]);

  const facultyTotals = useMemo(() => {
    const totals = new Map<
      string,
      { faculty: string; paidCount: number; totalPaid: number; totalApplications: number }
    >();

    for (const row of data?.rows ?? []) {
      const faculty = getFaculty(row);
      const current = totals.get(faculty) ?? {
        faculty,
        paidCount: 0,
        totalPaid: 0,
        totalApplications: 0,
      };

      current.totalApplications += 1;
      current.totalPaid += row.paidAmount;
      if (row.paid) current.paidCount += 1;
      totals.set(faculty, current);
    }

    return Array.from(totals.values()).sort((a, b) =>
      a.faculty.localeCompare(b.faculty),
    );
  }, [data]);

  async function loadRows() {
    setStatus("Loading...");
    try {
      const response = await fetch("/api/admin/applications", {
        headers: { "x-admin-key": adminKey },
        cache: "no-store",
      });
      if (!response.ok) {
        let errorMsg = "Load failed.";
        try {
          const payload = await response.json();
          if (payload.error) errorMsg = payload.error;
        } catch {}
        setStatus(errorMsg);
        return;
      }
      const payload = await response.json();
      setData(payload);
      setStatus("");
    } catch (e) {
      setStatus("Load failed.");
    }
  }

  async function saveRow(row: Row, paid: boolean, paidAmount: number) {
    setStatus("Saving...");
    try {
      const response = await fetch(`/api/admin/applications/${row.documentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          paid,
          paidAmount,
          viberMessaged: row.viberMessaged,
          adminNote: row.adminNote ?? "",
        }),
      });
      if (!response.ok) {
        let errorMsg = "Save failed.";
        try {
          const payload = await response.json();
          if (payload.error) errorMsg = payload.error;
        } catch {}
        setStatus(errorMsg);
        return;
      }
      await loadRows();
    } catch (e) {
      setStatus("Save failed.");
    }
  }

  async function deleteRow(row: Row) {
    if (!window.confirm(`Delete ${row.firstName} ${row.lastName}?`)) return;

    setStatus("Deleting...");
    try {
      const response = await fetch(`/api/admin/applications/${row.documentId}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      if (!response.ok) {
        let errorMsg = "Delete failed.";
        try {
          const payload = await response.json();
          if (payload.error) errorMsg = payload.error;
        } catch {}
        setStatus(errorMsg);
        return;
      }
      await loadRows();
    } catch (e) {
      setStatus("Delete failed.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F7F1] px-4 py-6 text-[#1E424A]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-sm text-[#1E424A]/60">
              Paid amount table and course totals.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Admin key"
              className="rounded border border-[#1E424A]/20 bg-white px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={loadRows}
              className="rounded bg-[#008081] px-4 py-2 text-sm font-bold text-white"
            >
              Load
            </button>
          </div>
        </div>

        {status && (
          <div className="mb-4 rounded border border-[#FACC0B]/50 bg-[#FACC0B]/15 px-4 py-3 text-sm">
            {status}
          </div>
        )}

        {data && (
          <>
            <div className="mb-4 grid gap-3 md:grid-cols-4">
              <div className="rounded border border-[#1E424A]/10 bg-white p-4">
                <p className="text-xs font-bold uppercase text-[#1E424A]/50">
                  {selectedPrepSession ? selectedPrepSession.title : "All paid"}
                </p>
                <p className="text-2xl font-bold">
                  {formatMkd(totalPaidForPrepSession)}
                </p>
                <p className="text-xs text-[#1E424A]/60">
                  {prepSessionRows.filter((row) => row.paid).length}/
                  {prepSessionRows.length} paid
                </p>
              </div>
              <div className="rounded border border-[#1E424A]/10 bg-white p-4">
                <p className="text-xs font-bold uppercase text-[#1E424A]/50">
                  {courseFilter === "all" ? "Shown rows" : courseFilter}
                </p>
                <p className="text-2xl font-bold">
                  {formatMkd(totalPaidForRows)}
                </p>
                <p className="text-xs text-[#1E424A]/60">
                  {rows.filter((row) => row.paid).length}/{rows.length} paid
                </p>
              </div>

              {facultyTotals.slice(0, 2).map((total) => (
                <div
                  key={total.faculty}
                  className="rounded border border-[#1E424A]/10 bg-white p-4"
                >
                  <p className="truncate text-xs font-bold uppercase text-[#1E424A]/50">
                    {total.faculty}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatMkd(total.totalPaid)}
                  </p>
                  <p className="text-xs text-[#1E424A]/60">
                    {total.paidCount}/{total.totalApplications} paid
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-3 grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-4">
              <div>
                <label
                  htmlFor="prep-session-filter"
                  className="mb-1 block text-xs font-bold uppercase text-[#1E424A]/60"
                >
                  Prep session
                </label>
                <select
                  id="prep-session-filter"
                  value={prepSessionFilter}
                  onChange={(event) => setPrepSessionFilter(event.target.value)}
                  className="w-full rounded border border-[#1E424A]/20 bg-white px-3 py-2 text-sm font-bold text-[#1E424A]"
                >
                  <option value="all">All prep sessions</option>
                  {data.prepSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.title}
                      {session.active ? " (active)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="user-search"
                  className="mb-1 block text-xs font-bold uppercase text-[#1E424A]/60"
                >
                  User
                </label>
                <input
                  id="user-search"
                  type="search"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                  placeholder="Name, surname, email, Discord"
                  className="w-full rounded border border-[#1E424A]/20 bg-white px-3 py-2 text-sm font-bold text-[#1E424A]"
                />
              </div>

              <div>
                <label
                  htmlFor="subject-filter"
                  className="mb-1 block text-xs font-bold uppercase text-[#1E424A]/60"
                >
                  Subject
                </label>
                <select
                  id="subject-filter"
                  value={courseFilter}
                  onChange={(event) => setCourseFilter(event.target.value)}
                  className="w-full rounded border border-[#1E424A]/20 bg-white px-3 py-2 text-sm font-bold text-[#1E424A]"
                >
                  <option value="all">All subjects</option>
                  {subjectsWithPrices.map((subject) => (
                    <option key={subject.name} value={subject.name}>
                      {subject.name}
                      {subject.price ? ` - ${subject.price} МКД` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="paid-filter"
                  className="mb-1 block text-xs font-bold uppercase text-[#1E424A]/60"
                >
                  Paid
                </label>
                <select
                  id="paid-filter"
                  value={paidFilter}
                  onChange={(event) => setPaidFilter(event.target.value)}
                  className="w-full rounded border border-[#1E424A]/20 bg-white px-3 py-2 text-sm font-bold text-[#1E424A]"
                >
                  <option value="all">All</option>
                  <option value="paid">Paid only</option>
                  <option value="unpaid">Unpaid only</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded border border-[#1E424A]/10 bg-white">
              <table className="w-full min-w-[1200px] border-collapse text-sm">
                <thead className="bg-[#1E424A] text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Course</th>
                    <th className="px-3 py-2 text-left">Faculty</th>
                    <th className="px-3 py-2 text-left">Mode</th>
                    <th className="px-3 py-2 text-left">Email</th>
                    <th className="px-3 py-2 text-left">Phone</th>
                    <th className="px-3 py-2 text-left">Discord</th>
                    <th className="px-3 py-2 text-left">Paid</th>
                    <th className="px-3 py-2 text-left">Amount</th>
                    <th className="px-3 py-2 text-left">Viber</th>
                    <th className="px-3 py-2 text-left">Save</th>
                    <th className="px-3 py-2 text-left">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <AdminRow
                      key={row.documentId}
                      row={row}
                      onDelete={deleteRow}
                      onSave={saveRow}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function AdminRow({
  row,
  onSave,
  onDelete,
}: {
  row: Row;
  onSave: (row: Row, paid: boolean, paidAmount: number) => Promise<void>;
  onDelete: (row: Row) => Promise<void>;
}) {
  const [paid, setPaid] = useState(row.paid);
  const [paidAmount, setPaidAmount] = useState(row.paidAmount);
  const [viberMessaged, setViberMessaged] = useState(row.viberMessaged);
  
  useEffect(() => {
    setPaid(row.paid);
    setPaidAmount(row.paidAmount);
    setViberMessaged(row.viberMessaged);
  }, [row.paid, row.paidAmount, row.viberMessaged]);

  const nextRow = { ...row, viberMessaged };

  return (
    <tr
      className={`border-t ${
        paid
          ? "border-l-4 border-l-emerald-600 bg-emerald-50"
          : "border-[#1E424A]/10"
      }`}
    >
      <td className="px-3 py-2 font-bold">
        {row.firstName} {row.lastName}
      </td>
      <td className="px-3 py-2">{row.prepSessionTitle || row.subject}</td>
      <td className="px-3 py-2">{row.faculty || "-"}</td>
      <td className="px-3 py-2">
        {row.attendancePreference === "online" ? "Онлајн" : "Физичко"}
      </td>
      <td className="px-3 py-2">{row.email}</td>
      <td className="px-3 py-2">{row.phone || "-"}</td>
      <td className="px-3 py-2">{row.discordUsername || "-"}</td>
      <td className="px-3 py-2">
        <input
          type="checkbox"
          checked={paid}
          onChange={(event) => setPaid(event.target.checked)}
          className="h-5 w-5"
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          min="0"
          value={paidAmount}
          onChange={(event) => setPaidAmount(Number(event.target.value))}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void onSave(nextRow, paid, paidAmount);
            }
          }}
          className="amount-input w-28 rounded border border-[#1E424A]/20 px-2 py-1"
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="checkbox"
          checked={viberMessaged}
          onChange={(event) => setViberMessaged(event.target.checked)}
          className="h-5 w-5"
        />
      </td>
      <td className="px-3 py-2">
        <button
          type="button"
          onClick={() => onSave(nextRow, paid, paidAmount)}
          className="rounded bg-[#008081] px-3 py-1.5 text-xs font-bold text-white"
        >
          Save
        </button>
      </td>
      <td className="px-3 py-2">
        <button
          type="button"
          onClick={() => onDelete(row)}
          className="rounded bg-red-700 px-3 py-1.5 text-xs font-bold text-white"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
