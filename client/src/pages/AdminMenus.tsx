/**
 * メニュー・料金管理ページ
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const GENDER_OPTIONS = [
  { value: "both", label: "共通" },
  { value: "women", label: "レディース" },
  { value: "men", label: "メンズ" },
];
const GENDER_LABELS: Record<string, string> = { both: "共通", women: "レディース", men: "メンズ" };

type FormState = {
  name: string;
  category: string;
  durationMin: number | "";
  price: number | "";
  priceLabel: string;
  description: string;
  gender: "women" | "men" | "both";
  sortOrder: number;
  published: number;
};
const EMPTY: FormState = { name: "", category: "", durationMin: "", price: "", priceLabel: "税込", description: "", gender: "both", sortOrder: 0, published: 1 };

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated: isManusAuth, loading: manusLoading } = useAuth();
  const { data: staffUser, isLoading: staffLoading } = trpc.staff.me.useQuery(undefined, { refetchOnWindowFocus: false, retry: false });
  const isAuthenticated = isManusAuth || !!staffUser;
  const loading = manusLoading || staffLoading;
  if (loading) return <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#2C1810" }}>読み込み中...</p></div>;
  if (!isAuthenticated) return <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}><p style={{ color: "#2C1810" }}>ログインが必要です</p><Link href="/staff-login"><a style={{ background: "#2C1810", color: "#F5F0E8", padding: "10px 24px", borderRadius: "6px", textDecoration: "none" }}>ログイン</a></Link></div>;
  return <>{children}</>;
}

export default function AdminMenus() {
  const { data: items = [], isLoading, refetch } = trpc.menu.listAdmin.useQuery(undefined, { refetchOnWindowFocus: false });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const createMutation = trpc.menu.create.useMutation({ onSuccess: () => { toast.success("追加しました"); refetch(); reset(); }, onError: e => toast.error(e.message) });
  const updateMutation = trpc.menu.update.useMutation({ onSuccess: () => { toast.success("更新しました"); refetch(); reset(); }, onError: e => toast.error(e.message) });
  const deleteMutation = trpc.menu.delete.useMutation({ onSuccess: () => { toast.success("削除しました"); refetch(); }, onError: e => toast.error(e.message) });

  function reset() { setForm(EMPTY); setEditId(null); setShowForm(false); }
  function startEdit(item: typeof items[0]) {
    setForm({ name: item.name, category: item.category, durationMin: item.durationMin ?? "", price: item.price, priceLabel: item.priceLabel ?? "税込", description: item.description ?? "", gender: item.gender, sortOrder: item.sortOrder, published: item.published });
    setEditId(item.id); setShowForm(true);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.category || form.price === "") { toast.error("メニュー名・カテゴリ・料金は必須です"); return; }
    const payload = { ...form, price: Number(form.price), durationMin: form.durationMin !== "" ? Number(form.durationMin) : undefined };
    if (editId !== null) updateMutation.mutate({ id: editId, ...payload });
    else createMutation.mutate(payload as any);
  }

  const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #d4c5b0", borderRadius: "6px", fontSize: "14px", fontFamily: "Noto Sans JP, sans-serif", background: "#fff", color: "#2C1810", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { display: "block", fontSize: "13px", color: "#6b4c2a", marginBottom: "4px", fontWeight: "600" };

  // カテゴリ別にグループ化
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const cat = item.category || "その他";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <AdminGuard>
      <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "Noto Sans JP, sans-serif" }}>
        <div style={{ background: "#2C1810", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/content"><a style={{ color: "#c9a96e", fontSize: "12px", textDecoration: "none" }}>← 管理メニュー</a></Link>
          <span style={{ color: "#c9a96e", opacity: 0.4 }}>|</span>
          <h1 style={{ color: "#F5F0E8", fontSize: "16px", fontWeight: "600", margin: 0 }}>メニュー・料金管理</h1>
        </div>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ color: "#2C1810", fontSize: "18px", fontWeight: "700", margin: 0 }}>登録件数：{items.length}件</h2>
            <button onClick={() => { reset(); setShowForm(true); }} style={{ background: "#c9a96e", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>＋ 新規追加</button>
          </div>

          {showForm && (
            <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ color: "#2C1810", fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>{editId !== null ? "編集" : "新規追加"}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>メニュー名 *</label>
                    <input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="例：スカルプラボ定期ケア" />
                  </div>
                  <div>
                    <label style={lbl}>カテゴリ *</label>
                    <input style={inp} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="例：スカルプケア、育毛、ヘッドスパ" />
                  </div>
                  <div>
                    <label style={lbl}>所要時間（分）</label>
                    <input type="number" style={inp} value={form.durationMin} onChange={e => setForm(f => ({ ...f, durationMin: e.target.value === "" ? "" : Number(e.target.value) }))} placeholder="60" />
                  </div>
                  <div>
                    <label style={lbl}>料金（円）*</label>
                    <input type="number" style={inp} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value === "" ? "" : Number(e.target.value) }))} placeholder="8800" />
                  </div>
                  <div>
                    <label style={lbl}>料金表示テキスト</label>
                    <input style={inp} value={form.priceLabel} onChange={e => setForm(f => ({ ...f, priceLabel: e.target.value }))} placeholder="税込" />
                  </div>
                  <div>
                    <label style={lbl}>対象</label>
                    <select style={inp} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value as any }))}>
                      {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>説明文</label>
                    <textarea style={{ ...inp, minHeight: "80px", resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="メニューの詳細説明" />
                  </div>
                  <div>
                    <label style={lbl}>表示順</label>
                    <input type="number" style={inp} value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <label style={lbl}>公開設定</label>
                    <select style={inp} value={form.published} onChange={e => setForm(f => ({ ...f, published: Number(e.target.value) }))}>
                      <option value={1}>公開</option>
                      <option value={0}>非公開</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                  <button type="submit" style={{ background: "#2C1810", color: "#F5F0E8", border: "none", padding: "10px 24px", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>{editId !== null ? "更新する" : "追加する"}</button>
                  <button type="button" onClick={reset} style={{ background: "transparent", color: "#6b4c2a", border: "1px solid #d4c5b0", padding: "10px 24px", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>キャンセル</button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? <p style={{ color: "#6b4c2a" }}>読み込み中...</p> : items.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "12px", padding: "48px", textAlign: "center" }}>
              <p style={{ color: "#6b4c2a", fontSize: "14px" }}>まだ登録されていません。「新規追加」から追加してください。</p>
            </div>
          ) : (
            Object.entries(grouped).map(([cat, catItems]) => (
              <div key={cat} style={{ marginBottom: "24px" }}>
                <h3 style={{ color: "#2C1810", fontSize: "15px", fontWeight: "700", marginBottom: "12px", paddingBottom: "8px", borderBottom: "2px solid #c9a96e" }}>{cat}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {catItems.map(item => (
                    <div key={item.id} style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "10px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                          <span style={{ color: "#2C1810", fontWeight: "700", fontSize: "15px" }}>{item.name}</span>
                          <span style={{ color: "#c9a96e", fontWeight: "700", fontSize: "15px" }}>¥{item.price.toLocaleString()}</span>
                          {item.priceLabel && <span style={{ color: "#9ca3af", fontSize: "12px" }}>{item.priceLabel}</span>}
                          {item.durationMin && <span style={{ color: "#6b4c2a", fontSize: "12px" }}>{item.durationMin}分</span>}
                          <span style={{ background: item.published ? "#d1fae5" : "#fee2e2", color: item.published ? "#065f46" : "#991b1b", fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }}>{item.published ? "公開" : "非公開"}</span>
                          <span style={{ background: "#f3ede4", color: "#6b4c2a", fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }}>{GENDER_LABELS[item.gender]}</span>
                        </div>
                        {item.description && <p style={{ color: "#6b4c2a", fontSize: "13px", margin: 0 }}>{item.description.slice(0, 80)}{item.description.length > 80 ? "…" : ""}</p>}
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <button onClick={() => startEdit(item)} style={{ background: "#f3ede4", color: "#2C1810", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>編集</button>
                        <button onClick={() => { if (confirm(`「${item.name}」を削除しますか？`)) deleteMutation.mutate({ id: item.id }); }} style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>削除</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
