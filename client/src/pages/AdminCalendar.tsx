/**
 * 予約カレンダー管理画面
 * スタッフ向け：月カレンダーで予約を一覧表示 + 手動予約登録
 */
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
 pending: { bg: "bg-amber-50", text: "text-amber-800", dot: "bg-amber-400" },
 confirmed: { bg: "bg-emerald-50", text: "text-emerald-800", dot: "bg-emerald-500" },
 cancelled: { bg: "bg-red-50", text: "text-red-800", dot: "bg-red-400" },
};

const STATUS_LABELS: Record<string, string> = {
 pending: "受付中",
 confirmed: "確定",
 cancelled: "キャンセル",
};

const SOURCE_LABELS: Record<string, string> = {
 web: "Web",
 phone: "電話",
 walkin: "来店",
};

const SOURCE_COLORS: Record<string, string> = {
 web: "bg-blue-100 text-blue-700",
 phone: "bg-purple-100 text-purple-700",
 walkin: "bg-orange-100 text-orange-700",
};

// フォールバック用の固定メニューラベル
const FALLBACK_PLAN_LABELS: Record<string, string> = {
 free: "無料チェック",
 standard: "定期ケア",
 personal: "パーソナル",
 consult: "相談",
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

export default function AdminCalendar() {
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
 const [showBlockForm, setShowBlockForm] = useState(false);
 const [blockTime, setBlockTime] = useState<string>("");
 const [blockReason, setBlockReason] = useState<string>("");

 // 手動予約フォームの状態
 const [form, setForm] = useState({
 name: "",
 phone: "",
 email: "",
 desiredDate: "",
 desiredTime: "12:00",
 plan: "free" as "free" | "standard" | "personal" | "consult",
 message: "",
 gender: "women" as "women" | "men",
 source: "phone" as "web" | "phone" | "walkin",
 });

 // DBからメニューを取得してラベルマップを動的生成
 const { data: dbMenus } = trpc.menu.list.useQuery(
 {},
 { enabled: isAuthenticated, staleTime: 60_000 }
 );
 const planLabels: Record<string, string> = useMemo(() => {
 if (dbMenus && dbMenus.length > 0) {
 const map: Record<string, string> = {};
 dbMenus.forEach((m: any) => { map[String(m.id)] = m.name; });
 return map;
 }
 return FALLBACK_PLAN_LABELS;
 }, [dbMenus]);

 const { data: reservations, refetch } = trpc.reservation.adminListByMonth.useQuery(
 { year: currentYear, month: currentMonth },
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
 setForm({ name: "", phone: "", email: "", desiredDate: selectedDate || "", desiredTime: "12:00", plan: "free", message: "", gender: "women", source: "phone" });
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

 // ブロック管理
 const { data: blocksForMonth, refetch: refetchBlocks } = trpc.block.list.useQuery(
 { salonId: "hankyu" },
 { enabled: isAuthenticated, refetchOnWindowFocus: false }
 );
 const blocksByDate = useMemo(() => {
 const map: Record<string, typeof blocksForMonth> = {};
 (blocksForMonth ?? []).forEach((b: any) => {
 if (!map[b.blockDate]) map[b.blockDate] = [];
 (map[b.blockDate] as any[]).push(b);
 });
 return map;
 }, [blocksForMonth]);
 const createBlock = trpc.block.create.useMutation({
 onSuccess: () => {
 toast.success("ブロックしました");
 setShowBlockForm(false);
 setBlockTime("");
 setBlockReason("");
 refetchBlocks();
 },
 onError: (err) => toast.error(err.message || "ブロック失敗"),
 });
 const deleteBlock = trpc.block.delete.useMutation({
 onSuccess: () => { toast.success("ブロックを解除しました"); refetchBlocks(); },
 onError: (err) => toast.error(err.message || "解除失敗"),
 });

 // カレンダー構築
 const calendarDays = useMemo(() => {
 const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
 const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
 const days: (number | null)[] = [];
 for (let i = 0; i < firstDay; i++) days.push(null);
 for (let d = 1; d <= daysInMonth; d++) days.push(d);
 return days;
 }, [currentYear, currentMonth]);

 // 日付ごとの予約マップ
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
 setShowBlockForm(false);
 };

 const handleNewReservation = () => {
 setForm(f => ({ ...f, desiredDate: selectedDate || "" }));
 setShowForm(true);
 setSelectedReservation(null);
 };

 if (loading) {
 return <div className="flex items-center justify-center min-h-screen text-gray-500">読み込み中...</div>;
 }

 if (!isAuthenticated) {
 return (
 <div className="flex flex-col items-center justify-center min-h-screen gap-4">
 <p className="text-gray-600">ログインが必要です</p>
 <a href={getLoginUrl()} className="px-4 py-2 bg-amber-700 text-white rounded-lg text-sm">ログイン</a>
 <Link href="/staff-login" className="text-sm text-amber-700 underline">スタッフログイン</Link>
 </div>
 );
 }

 const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
 const selectedReservations = selectedDate ? (reservationsByDate[selectedDate] ?? []) : [];

 return (
 <div className="min-h-screen bg-stone-50">
 {/* ヘッダー */}
 <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
 <div className="flex items-center gap-2">
 <Link
 href="/admin"
 className="text-amber-800 text-sm px-3 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-50 font-medium"
 >
 一覧
 </Link>
 <span
 className="text-amber-800 text-sm px-3 py-1.5 rounded-lg border border-amber-600 bg-amber-100 font-semibold"
 >
 カレンダー
 </span>
 </div>
 <Link href="/" className="text-xs text-stone-400 hover:text-stone-600">サイトへ戻る</Link>
 </header>

 <div className="max-w-5xl mx-auto px-3 py-4">
 {/* 月ナビゲーション */}
 <div className="flex items-center justify-between mb-4">
 <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-stone-200 text-stone-600 text-lg">‹</button>
 <h2 className="text-lg font-bold text-stone-800">
 {currentYear}年 {currentMonth}月
 </h2>
 <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-stone-200 text-stone-600 text-lg">›</button>
 </div>

 {/* カレンダー */}
 <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden mb-4">
 {/* 曜日ヘッダー */}
 <div className="grid grid-cols-7 bg-stone-100">
 {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
 <div key={d} className={`text-center text-xs font-semibold py-2 ${i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-stone-600"}`}>
 {d}
 </div>
 ))}
 </div>
 {/* 日付グリッド */}
 <div className="grid grid-cols-7 divide-x divide-y divide-stone-100">
 {calendarDays.map((day, idx) => {
 if (!day) return <div key={`empty-${idx}`} className="min-h-[72px] bg-stone-50" />;
 const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
 const dayReservations = reservationsByDate[dateStr] ?? [];
 const dayBlocks = (blocksByDate[dateStr] ?? []) as any[];
 const isAllDayBlocked = dayBlocks.some((b: any) => !b.blockTime);
 const isToday = dateStr === todayStr;
 const isSelected = dateStr === selectedDate;
 const dow = (new Date(currentYear, currentMonth - 1, day).getDay());
 return (
 <div
 key={day}
 onClick={() => handleDayClick(day)}
 className={`min-h-[72px] p-1 cursor-pointer transition-colors ${
 isAllDayBlocked ? "bg-red-50" :
 isSelected ? "bg-amber-50 ring-2 ring-amber-400 ring-inset" : "hover:bg-stone-50"
 }`}
 >
 <div className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
 isToday ? "bg-amber-700 text-white" :
 dow === 0 ? "text-red-500" :
 dow === 6 ? "text-blue-500" : "text-stone-700"
 }`}>
 {day}
 </div>
 <div className="space-y-0.5">
 {dayReservations.slice(0, 3).map((r: Reservation) => (
 <div
 key={r.id}
 className={`text-[10px] px-1 py-0.5 rounded ${STATUS_COLORS[r.status]?.bg ?? "bg-gray-100"} ${STATUS_COLORS[r.status]?.text ?? "text-gray-700"}`}
 >
 <div className="font-bold truncate">{r.desiredTime} {r.name}</div>
 <div className="truncate opacity-80" style={{ fontSize: "9px" }}>{planLabels[r.plan] ?? r.plan}</div>
 </div>
 ))}
 {dayReservations.length > 3 && (
 <div className="text-[10px] text-stone-400 pl-1">+{dayReservations.length - 3}件</div>
 )}
 {isAllDayBlocked && (
 <div className="text-[9px] bg-red-100 text-red-600 rounded px-1 mt-0.5 font-semibold">予約不可</div>
 )}
 {!isAllDayBlocked && dayBlocks.length > 0 && (
 <div className="text-[9px] bg-orange-100 text-orange-600 rounded px-1 mt-0.5">一部ブロック</div>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* 凡例 */}
 <div className="flex gap-3 mb-4 text-xs text-stone-500 flex-wrap">
 {Object.entries(STATUS_LABELS).map(([k, v]) => (
 <div key={k} className="flex items-center gap-1">
 <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[k]?.dot}`} />
 {v}
 </div>
 ))}
 <span className="mx-2 text-stone-300">|</span>
 {Object.entries(SOURCE_LABELS).map(([k, v]) => (
 <span key={k} className={`px-1.5 py-0.5 rounded text-[10px] ${SOURCE_COLORS[k]}`}>{v}</span>
 ))}
 </div>

 {/* 選択日の詳細パネル */}
 {selectedDate && (
 <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
 <div className="flex items-center justify-between mb-3">
 <h3 className="font-semibold text-stone-800">
 {selectedDate.replace(/-/g, "/")} の予約
 <span className="ml-2 text-sm text-stone-500">（{selectedReservations.length}件）</span>
 </h3>
 <div className="flex gap-2">
 <button
 onClick={() => { setShowBlockForm(b => !b); setShowForm(false); }}
 className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 border border-red-200"
 >
 ブロック設定
 </button>
 <button
 onClick={handleNewReservation}
 className="flex items-center gap-1 px-3 py-1.5 bg-amber-700 text-white text-sm rounded-lg hover:bg-amber-800"
 >
 ＋ 予約を追加
 </button>
 </div>
 </div>

 {/* ブロック設定パネル */}
 {showBlockForm && (
 <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
 <h4 className="font-semibold text-red-800 mb-3 text-sm">予約ブロック設定</h4>
 {/* 現在のブロック一覧 */}
 {selectedDate && (blocksByDate[selectedDate] ?? []).length > 0 && (
 <div className="mb-3">
 <p className="text-xs text-red-700 font-semibold mb-1">設定済ブロック</p>
 <div className="space-y-1">
 {((blocksByDate[selectedDate] ?? []) as any[]).map((b: any) => (
 <div key={b.id} className="flex items-center justify-between bg-white rounded px-2 py-1 border border-red-100">
 <span className="text-xs text-red-700">
 {b.blockTime ? b.blockTime : "終日"}
 {b.reason && ` — ${b.reason}`}
 </span>
 <button
 onClick={() => deleteBlock.mutate({ id: b.id })}
 className="text-xs text-red-500 hover:text-red-700 ml-2"
 >
 解除
 </button>
 </div>
 ))}
 </div>
 </div>
 )}
 {/* 新規ブロック追加 */}
 <div className="grid grid-cols-2 gap-3 text-sm">
 <div>
 <label className="block text-xs text-red-700 mb-1">時間帯（空白の場合は終日ブロック）</label>
 <select
 value={blockTime}
 onChange={e => setBlockTime(e.target.value)}
 className="w-full border border-red-200 rounded px-2 py-1.5 text-sm"
 >
 <option value="">終日ブロック</option>
 {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
 </select>
 </div>
 <div>
 <label className="block text-xs text-red-700 mb-1">メモ（任b意）</label>
 <input
 type="text" placeholder="休業日・満席など"
 value={blockReason}
 onChange={e => setBlockReason(e.target.value)}
 className="w-full border border-red-200 rounded px-2 py-1.5 text-sm"
 />
 </div>
 </div>
 <div className="flex gap-2 mt-3">
 <button
 onClick={() => createBlock.mutate({
 salonId: "hankyu",
 blockDate: selectedDate!,
 blockTime: blockTime || null,
 reason: blockReason || null,
 })}
 disabled={createBlock.isPending}
 className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
 >
 {createBlock.isPending ? "登録中..." : "ブロック登録"}
 </button>
 <button
 onClick={() => setShowBlockForm(false)}
 className="px-4 py-2 bg-stone-200 text-stone-700 text-sm rounded-lg hover:bg-stone-300"
 >
 閉じる
 </button>
 </div>
 </div>
 )}

 {/* 手動予約フォーム */}
 {showForm && (
 <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
 <h4 className="font-semibold text-amber-900 mb-3 text-sm">新規予約登録</h4>
 <div className="grid grid-cols-2 gap-3 text-sm">
 <div>
 <label className="block text-xs text-stone-600 mb-1">お名前 *</label>
 <input
 type="text" placeholder="山田 花子"
 value={form.name}
 onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
 className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm"
 />
 </div>
 <div>
 <label className="block text-xs text-stone-600 mb-1">電話番号 *</label>
 <input
 type="tel" placeholder="090-0000-0000"
 value={form.phone}
 onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
 className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm"
 />
 </div>
 <div>
 <label className="block text-xs text-stone-600 mb-1">メールアドレス</label>
 <input
 type="email" placeholder="example@email.com"
 value={form.email}
 onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
 className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm"
 />
 </div>
 <div>
 <label className="block text-xs text-stone-600 mb-1">希望日 *</label>
 <input
 type="date"
 value={form.desiredDate}
 onChange={e => setForm(f => ({ ...f, desiredDate: e.target.value }))}
 className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm"
 />
 </div>
 <div>
 <label className="block text-xs text-stone-600 mb-1">希望時間 *</label>
 <select
 value={form.desiredTime}
 onChange={e => setForm(f => ({ ...f, desiredTime: e.target.value }))}
 className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm"
 >
 {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
 </select>
 </div>
 <div>
 <label className="block text-xs text-stone-600 mb-1">コース *</label>
 <select
 value={form.plan}
 onChange={e => setForm(f => ({ ...f, plan: e.target.value as typeof form.plan }))}
 className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm"
 >
 {dbMenus && dbMenus.length > 0 ? (
 dbMenus.map((m: any) => (
 <option key={m.id} value={String(m.id)}>{m.name}</option>
 ))
 ) : (
 <>
 <option value="free">無料スカルプチェック</option>
 <option value="standard">定期ケア</option>
 <option value="personal">パーソナルケア</option>
 <option value="consult">相談希望</option>
 </>
 )}
 </select>
 </div>
 <div>
 <label className="block text-xs text-stone-600 mb-1">予約経路 *</label>
 <select
 value={form.source}
 onChange={e => setForm(f => ({ ...f, source: e.target.value as typeof form.source }))}
 className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm"
 >
 <option value="phone">電話予約</option>
 <option value="walkin">来店予約</option>
 <option value="web">Web予約</option>
 </select>
 </div>
 <div>
 <label className="block text-xs text-stone-600 mb-1">性別</label>
 <select
 value={form.gender}
 onChange={e => setForm(f => ({ ...f, gender: e.target.value as typeof form.gender }))}
 className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm"
 >
 <option value="women">女性</option>
 <option value="men">男性</option>
 </select>
 </div>
 <div className="col-span-2">
 <label className="block text-xs text-stone-600 mb-1">備考</label>
 <textarea
 placeholder="気になる症状など"
 value={form.message}
 onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
 rows={2}
 className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm resize-none"
 />
 </div>
 </div>
 <div className="flex gap-2 mt-3">
 <button
 onClick={() => adminCreate.mutate({
 name: form.name,
 phone: form.phone,
 email: form.email || undefined,
 desiredDate: form.desiredDate,
 desiredTime: form.desiredTime,
 plan: form.plan,
 message: form.message || undefined,
 gender: form.gender,
 source: form.source,
 })}
 disabled={!form.name || !form.phone || !form.desiredDate || adminCreate.isPending}
 className="px-4 py-2 bg-amber-700 text-white text-sm rounded-lg hover:bg-amber-800 disabled:opacity-50"
 >
 {adminCreate.isPending ? "登録中..." : "登録する"}
 </button>
 <button
 onClick={() => setShowForm(false)}
 className="px-4 py-2 bg-stone-200 text-stone-700 text-sm rounded-lg hover:bg-stone-300"
 >
 キャンセル
 </button>
 </div>
 </div>
 )}

 {/* 予約リスト */}
 {selectedReservations.length === 0 && !showForm ? (
 <p className="text-stone-400 text-sm py-4 text-center">この日の予約はありません</p>
 ) : (
 <div className="space-y-2">
 {selectedReservations.map((r: Reservation) => (
 <div
 key={r.id}
 onClick={() => setSelectedReservation(selectedReservation?.id === r.id ? null : r)}
 className={`p-3 rounded-lg border cursor-pointer transition-colors ${
 selectedReservation?.id === r.id
 ? "border-amber-400 bg-amber-50"
 : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
 }`}
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="font-semibold text-stone-800 text-sm">{r.desiredTime}</span>
 <span className="font-medium text-stone-800">{r.name}</span>
 <span className={`text-[10px] px-1.5 py-0.5 rounded ${SOURCE_COLORS[r.source] ?? "bg-gray-100 text-gray-600"}`}>
 {SOURCE_LABELS[r.source] ?? r.source}
 </span>
 </div>
 <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status]?.bg} ${STATUS_COLORS[r.status]?.text}`}>
 {STATUS_LABELS[r.status] ?? r.status}
 </span>
 </div>
 <div className="text-xs text-stone-500 mt-1">
 {planLabels[r.plan] ?? r.plan} ・ {r.phone}
 {r.email && ` ・ ${r.email}`}
 </div>

 {/* 詳細・操作パネル */}
 {selectedReservation?.id === r.id && (
 <div className="mt-3 pt-3 border-t border-stone-200" onClick={e => e.stopPropagation()}>
 {r.message && (
 <p className="text-xs text-stone-600 mb-2">備考: {r.message}</p>
 )}
 <div className="flex gap-2 flex-wrap">
 {r.status !== "confirmed" && (
 <button
 onClick={() => updateStatus.mutate({ id: r.id, status: "confirmed" })}
 className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700"
 >
 確定
 </button>
 )}
 {r.status !== "pending" && (
 <button
 onClick={() => updateStatus.mutate({ id: r.id, status: "pending" })}
 className="px-3 py-1 bg-amber-500 text-white text-xs rounded-lg hover:bg-amber-600"
 >
 受付中に戻す
 </button>
 )}
 {r.status !== "cancelled" && (
 <button
 onClick={() => updateStatus.mutate({ id: r.id, status: "cancelled" })}
 className="px-3 py-1 bg-stone-400 text-white text-xs rounded-lg hover:bg-stone-500"
 >
 キャンセル
 </button>
 )}
 <button
 onClick={() => {
 if (confirm(`${r.name}様の予約を削除しますか？`)) {
 adminDelete.mutate({ id: r.id });
 }
 }}
 className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200 ml-auto"
 >
 削除
 </button>
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {/* 日付未選択時のガイド */}
 {!selectedDate && (
 <div className="text-center text-stone-400 text-sm py-8">
 日付をクリックすると予約詳細が表示されます
 </div>
 )}
 </div>
 </div>
 );
}
