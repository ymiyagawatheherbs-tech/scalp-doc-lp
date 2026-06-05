/*
 * 植物美容サロン 予約カレンダー管理画面
 * BOTANICAL CHARM カラー: #A9C0A6 / #F5EDE3 / #707862 / #DDD5CC / #C5D3C4
 */
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

const C = {
  bg:        "#F5EDE3",
  bgLight:   "#faf7f3",
  header:    "#707862",
  accent:    "#A9C0A6",
  accentDk:  "#5a6b57",
  muted:     "#DDD5CC",
  mutedDk:   "#C5D3C4",
  text:      "#3a3d30",
  textLight: "#7a7d6a",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending:   { bg: "bg-[#e8f0e7]", text: "text-[#5a6b57]", dot: "bg-[#A9C0A6]" },
  confirmed: { bg: "bg-[#b8ddb5]", text: "text-[#2d5a27]", dot: "bg-[#5a6b57]" },
  cancelled: { bg: "bg-[#f0d0d0]", text: "text-[#7a3a3a]", dot: "bg-[#d08080]" },
};

const STATUS_LABELS: Record<string, string> = { pending: "受付中", confirmed: "確定", cancelled: "キャンセル" };
const SOURCE_LABELS: Record<string, string> = { web: "Web", phone: "電話", walkin: "来店" };
const SOURCE_COLORS: Record<string, string> = {
  web: "bg-[#d4e8d1] text-[#5a6b57]",
  phone: "bg-[#C5D3C4] text-[#707862]",
  walkin: "bg-[#DDD5CC] text-[#7a7d6a]",
};

const TIMES = [
  "10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30",
  "14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30","19:00","19:30",
];

type Reservation = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  desiredDate: string;
  desiredTime: string;
  plan: string;
  message: string | null;
  gender: string;
  source: string;
  status: string;
  createdAt: Date;
};

export default function SalonAdminCalendar() {
  const { isAuthenticated: isManusAuth, loading: manusLoading } = useAuth();
  const { data: staffUser, isLoading: staffLoading } = trpc.staff.me.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
  });
  const isAuthenticated = isManusAuth || !!staffUser;
  const loading = manusLoading || staffLoading;

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    desiredDate: "",
    desiredTime: "12:00",
    plan: "",
    message: "",
    gender: "women" as "women" | "men",
    source: "phone" as "web" | "phone" | "walkin",
  });

  const { data: dbMenus } = trpc.menu.list.useQuery(
    { salonId: "salon" },
    { enabled: isAuthenticated, staleTime: 60_000 }
  );

  const planLabels: Record<string, string> = useMemo(() => {
    if (dbMenus && dbMenus.length > 0) {
      const map: Record<string, string> = {};
      dbMenus.forEach((m: any) => { map[String(m.id)] = m.name; });
      return map;
    }
    return {};
  }, [dbMenus]);

  const { data: reservations, refetch } = trpc.reservation.adminListByMonth.useQuery(
    { year: currentYear, month: currentMonth, salonId: "salon" },
    { enabled: isAuthenticated, refetchOnWindowFocus: false }
  );

  const utils = trpc.useUtils();
  const updateStatus = trpc.reservation.updateStatus.useMutation({
    onSuccess: () => { refetch(); utils.reservation.adminList.invalidate(); },
    onError: (err) => toast.error(err.message || "更新失敗"),
  });
  const adminCreate = trpc.reservation.adminCreate.useMutation({
    onSuccess: () => {
      toast.success("予約を登録しました");
      setShowForm(false);
      setForm({ name: "", phone: "", email: "", desiredDate: selectedDate || "", desiredTime: "12:00", plan: "", message: "", gender: "women", source: "phone" });
      refetch();
    },
    onError: (err) => toast.error(err.message || "登録失敗"),
  });
  const adminDelete = trpc.reservation.adminDelete.useMutation({
    onSuccess: () => {
      toast.success("予約を削除しました");
      setSelectedReservation(null);
      refetch();
    },
    onError: (err) => toast.error(err.message || "削除失敗"),
  });

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [currentYear, currentMonth]);

  const reservationsByDate = useMemo(() => {
    const map: Record<string, Reservation[]> = {};
    (reservations ?? []).forEach((r: Reservation) => {
      if (!map[r.desiredDate]) map[r.desiredDate] = [];
      map[r.desiredDate].push(r);
    });
    return map;
  }, [reservations]);

  const prevMonth = () => {
    if (currentMonth === 1) { setCurrentYear(y => y - 1); setCurrentMonth(12); }
    else setCurrentMonth(m => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (currentMonth === 12) { setCurrentYear(y => y + 1); setCurrentMonth(1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDate(null);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setSelectedReservation(null);
    setShowForm(false);
  };

  const handleNewReservation = () => {
    setForm(f => ({ ...f, desiredDate: selectedDate || "" }));
    setShowForm(true);
    setSelectedReservation(null);
  };

  if (loading) {
    return <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}><p style={{ color: C.textLight, fontFamily: "'Noto Sans JP', sans-serif" }}>読み込み中...</p></div>;
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "'Noto Sans JP', sans-serif", gap: "1rem" }}>
        <p style={{ color: C.text }}>ログインが必要です</p>
        <a href={getLoginUrl()} style={{ padding: "0.75rem 2.5rem", background: C.header, color: "#fff", borderRadius: "6px", textDecoration: "none" }}>ログイン</a>
        <Link href="/staff-login" style={{ fontSize: "0.85rem", color: C.accentDk, textDecoration: "underline" }}>スタッフログイン</Link>
      </div>
    );
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const selectedReservations = selectedDate ? (reservationsByDate[selectedDate] ?? []) : [];

  return (
    <div style={{ minHeight: "100dvh", background: C.bg, fontFamily: "'Noto Sans JP', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* ヘッダー */}
      <header style={{ background: C.header, padding: "0.9rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.06em" }}>植物美容サロン</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginLeft: "0.5rem" }}>
            <Link href="/salon-admin" style={{ color: "#fff", fontSize: "0.78rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "6px", padding: "0.25rem 0.75rem", textDecoration: "none" }}>一覧</Link>
            <span style={{ color: "#fff", background: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: "6px", padding: "0.25rem 0.75rem", fontSize: "0.78rem", fontWeight: 600 }}>カレンダー</span>
            <Link href="/salon-admin/menus" style={{ color: "#fff", fontSize: "0.78rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "6px", padding: "0.25rem 0.75rem", textDecoration: "none" }}>メニュー管理</Link>
          </div>
        </div>
        <Link href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", textDecoration: "none" }}>サイトへ戻る</Link>
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.5rem 1rem" }}>
        {/* 月ナビゲーション */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <button onClick={prevMonth} style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "none", background: C.mutedDk, color: C.text, fontSize: "1.1rem", cursor: "pointer" }}>‹</button>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: C.text }}>{currentYear}年 {currentMonth}月</h2>
          <button onClick={nextMonth} style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "none", background: C.mutedDk, color: C.text, fontSize: "1.1rem", cursor: "pointer" }}>›</button>
        </div>

        {/* カレンダー */}
        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 12px rgba(112,120,98,0.08)", border: `1px solid ${C.muted}`, overflow: "hidden", marginBottom: "1rem" }}>
          {/* 曜日ヘッダー */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: C.mutedDk }}>
            {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
              <div key={d} style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: 700, padding: "0.5rem 0", color: i === 0 ? "#c05050" : i === 6 ? "#5070c0" : C.header }}>
                {d}
              </div>
            ))}
          </div>
          {/* 日付グリッド */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {calendarDays.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} style={{ minHeight: 72, background: C.bgLight, borderRight: `1px solid ${C.muted}`, borderBottom: `1px solid ${C.muted}` }} />;
              const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayReservations = reservationsByDate[dateStr] ?? [];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const dow = new Date(currentYear, currentMonth - 1, day).getDay();
              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  style={{
                    minHeight: 72,
                    padding: "0.25rem",
                    cursor: "pointer",
                    background: isSelected ? "#e8f5e5" : "white",
                    outline: isSelected ? `2px solid ${C.accent}` : "none",
                    outlineOffset: "-2px",
                    borderRight: `1px solid ${C.muted}`,
                    borderBottom: `1px solid ${C.muted}`,
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    marginBottom: "0.25rem",
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: isToday ? C.accentDk : "transparent",
                    color: isToday ? "#fff" : dow === 0 ? "#c05050" : dow === 6 ? "#5070c0" : C.text,
                  }}>
                    {day}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {dayReservations.slice(0, 3).map((r: Reservation) => {
                      const sc = STATUS_COLORS[r.status];
                      return (
                        <div key={r.id} style={{ fontSize: "10px", padding: "1px 4px", borderRadius: 3, background: r.status === "confirmed" ? "#b8ddb5" : r.status === "cancelled" ? "#f0d0d0" : "#e8f0e7", color: r.status === "confirmed" ? "#2d5a27" : r.status === "cancelled" ? "#7a3a3a" : "#5a6b57", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                          <span style={{ fontWeight: 700 }}>{r.desiredTime} {r.name}</span>
                        </div>
                      );
                    })}
                    {dayReservations.length > 3 && (
                      <div style={{ fontSize: "10px", color: C.textLight, paddingLeft: 4 }}>+{dayReservations.length - 3}件</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 凡例 */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", fontSize: "0.75rem", color: C.textLight, flexWrap: "wrap" }}>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: k === "confirmed" ? "#5a6b57" : k === "cancelled" ? "#d08080" : C.accent, display: "inline-block" }} />
              {v}
            </div>
          ))}
          <span style={{ margin: "0 0.5rem", color: C.muted }}>|</span>
          {Object.entries(SOURCE_LABELS).map(([k, v]) => (
            <span key={k} style={{ padding: "1px 6px", borderRadius: 4, fontSize: "10px", background: k === "web" ? "#d4e8d1" : k === "phone" ? "#C5D3C4" : "#DDD5CC", color: C.header }}>{v}</span>
          ))}
        </div>

        {/* 選択日の詳細パネル */}
        {selectedDate && (
          <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 12px rgba(112,120,98,0.08)", border: `1px solid ${C.muted}`, padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h3 style={{ fontWeight: 700, color: C.text, fontSize: "1rem", margin: 0 }}>
                {selectedDate.replace(/-/g, "/")} の予約
                <span style={{ marginLeft: "0.5rem", fontSize: "0.85rem", color: C.textLight }}>（{selectedReservations.length}件）</span>
              </h3>
              <button
                onClick={handleNewReservation}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "0.4rem 0.9rem", background: C.accent, color: "white", border: "none", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 600 }}
              >
                予約を追加
              </button>
            </div>

            {/* 手動予約フォーム */}
            {showForm && (
              <div style={{ marginBottom: "1rem", padding: "1rem", background: "#e8f5e5", borderRadius: "8px", border: `1px solid ${C.accent}` }}>
                <h4 style={{ fontWeight: 700, color: C.accentDk, marginBottom: "0.75rem", fontSize: "0.9rem" }}>新規予約登録（植物美容サロン）</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem" }}>
                  {[
                    { label: "お名前 *", type: "text", key: "name", placeholder: "山田 花子" },
                    { label: "電話番号 *", type: "tel", key: "phone", placeholder: "090-0000-0000" },
                    { label: "メールアドレス", type: "email", key: "email", placeholder: "example@email.com" },
                    { label: "希望日 *", type: "date", key: "desiredDate", placeholder: "" },
                  ].map(({ label, type, key, placeholder }) => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: "0.75rem", color: C.accentDk, marginBottom: "0.25rem", fontWeight: 600 }}>{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={(form as any)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        style={{ width: "100%", border: `1px solid ${C.muted}`, borderRadius: "6px", padding: "0.4rem 0.6rem", fontSize: "0.85rem", fontFamily: "'Noto Sans JP', sans-serif", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: C.accentDk, marginBottom: "0.25rem", fontWeight: 600 }}>希望時間 *</label>
                    <select value={form.desiredTime} onChange={e => setForm(f => ({ ...f, desiredTime: e.target.value }))} style={{ width: "100%", border: `1px solid ${C.muted}`, borderRadius: "6px", padding: "0.4rem 0.6rem", fontSize: "0.85rem", fontFamily: "'Noto Sans JP', sans-serif" }}>
                      {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: C.accentDk, marginBottom: "0.25rem", fontWeight: 600 }}>コース *</label>
                    <select value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))} style={{ width: "100%", border: `1px solid ${C.muted}`, borderRadius: "6px", padding: "0.4rem 0.6rem", fontSize: "0.85rem", fontFamily: "'Noto Sans JP', sans-serif" }}>
                      <option value="">選択してください</option>
                      {dbMenus && dbMenus.length > 0 ? (
                        dbMenus.map((m: any) => <option key={m.id} value={String(m.id)}>{m.name}</option>)
                      ) : (
                        <option value="scalp-check">頭皮チェック</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: C.accentDk, marginBottom: "0.25rem", fontWeight: 600 }}>予約経路 *</label>
                    <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value as typeof form.source }))} style={{ width: "100%", border: `1px solid ${C.muted}`, borderRadius: "6px", padding: "0.4rem 0.6rem", fontSize: "0.85rem", fontFamily: "'Noto Sans JP', sans-serif" }}>
                      <option value="phone">電話予約</option>
                      <option value="walkin">来店予約</option>
                      <option value="web">Web予約</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: C.accentDk, marginBottom: "0.25rem", fontWeight: 600 }}>性別</label>
                    <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value as typeof form.gender }))} style={{ width: "100%", border: `1px solid ${C.muted}`, borderRadius: "6px", padding: "0.4rem 0.6rem", fontSize: "0.85rem", fontFamily: "'Noto Sans JP', sans-serif" }}>
                      <option value="women">女性</option>
                      <option value="men">男性</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", color: C.accentDk, marginBottom: "0.25rem", fontWeight: 600 }}>備考</label>
                    <textarea
                      placeholder="気になる症状など"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={2}
                      style={{ width: "100%", border: `1px solid ${C.muted}`, borderRadius: "6px", padding: "0.4rem 0.6rem", fontSize: "0.85rem", fontFamily: "'Noto Sans JP', sans-serif", resize: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                  <button
                    onClick={() => adminCreate.mutate({
                      name: form.name, phone: form.phone, email: form.email || undefined,
                      desiredDate: form.desiredDate, desiredTime: form.desiredTime,
                      plan: form.plan, message: form.message || undefined,
                      gender: form.gender, source: form.source, salonId: "salon",
                    })}
                    disabled={!form.name || !form.phone || !form.desiredDate || !form.plan || adminCreate.isPending}
                    style={{ padding: "0.5rem 1.25rem", background: C.accentDk, color: "white", border: "none", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif", opacity: (!form.name || !form.phone || !form.desiredDate || !form.plan || adminCreate.isPending) ? 0.5 : 1 }}
                  >
                    {adminCreate.isPending ? "登録中..." : "登録する"}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    style={{ padding: "0.5rem 1.25rem", background: C.muted, color: C.text, border: "none", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            {/* 予約リスト */}
            {selectedReservations.length === 0 && !showForm ? (
              <p style={{ color: "#aaa", fontSize: "0.85rem", textAlign: "center", padding: "1.5rem 0" }}>この日の予約はありません</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {selectedReservations.map((r: Reservation) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReservation(selectedReservation?.id === r.id ? null : r)}
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: `1px solid ${selectedReservation?.id === r.id ? C.accent : C.muted}`,
                      background: selectedReservation?.id === r.id ? "#e8f5e5" : "white",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700, color: C.text, fontSize: "0.9rem" }}>{r.desiredTime}</span>
                        <span style={{ fontWeight: 600, color: C.text }}>{r.name}</span>
                        <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: 4, background: r.source === "web" ? "#d4e8d1" : r.source === "phone" ? "#C5D3C4" : "#DDD5CC", color: C.header }}>
                          {SOURCE_LABELS[r.source] ?? r.source}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: "12px", background: r.status === "confirmed" ? "#b8ddb5" : r.status === "cancelled" ? "#f0d0d0" : "#e8f0e7", color: r.status === "confirmed" ? "#2d5a27" : r.status === "cancelled" ? "#7a3a3a" : "#5a6b57", fontWeight: 700 }}>
                        {STATUS_LABELS[r.status] ?? r.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: C.textLight, marginTop: "0.25rem" }}>
                      {planLabels[r.plan] ?? r.plan} ・ {r.phone}
                      {r.email && ` ・ ${r.email}`}
                    </div>

                    {selectedReservation?.id === r.id && (
                      <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: `1px solid ${C.muted}` }} onClick={e => e.stopPropagation()}>
                        {r.message && <p style={{ fontSize: "0.78rem", color: C.textLight, marginBottom: "0.5rem" }}>備考: {r.message}</p>}
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                          {r.status !== "confirmed" && (
                            <button onClick={() => updateStatus.mutate({ id: r.id, status: "confirmed" })} style={{ padding: "0.3rem 0.7rem", background: "#b8ddb5", color: "#2d5a27", border: "1px solid #a0c89d", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}>確定</button>
                          )}
                          {r.status !== "pending" && (
                            <button onClick={() => updateStatus.mutate({ id: r.id, status: "pending" })} style={{ padding: "0.3rem 0.7rem", background: "#e8f0e7", color: "#5a6b57", border: `1px solid ${C.accent}`, borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}>受付中に戻す</button>
                          )}
                          {r.status !== "cancelled" && (
                            <button onClick={() => updateStatus.mutate({ id: r.id, status: "cancelled" })} style={{ padding: "0.3rem 0.7rem", background: "#f0d0d0", color: "#7a3a3a", border: "1px solid #e0b0b0", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}>キャンセル</button>
                          )}
                          <button
                            onClick={() => { if (confirm(`${r.name}様の予約を削除しますか？`)) adminDelete.mutate({ id: r.id }); }}
                            style={{ padding: "0.3rem 0.7rem", background: "#f0d0d0", color: "#7a3a3a", border: "1px solid #e0b0b0", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif", marginLeft: "auto" }}
                          >削除</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedDate && (
          <div style={{ textAlign: "center", color: C.textLight, fontSize: "0.85rem", padding: "2rem 0" }}>
            日付をクリックすると予約詳細が表示されます
          </div>
        )}
      </div>
    </div>
  );
}
