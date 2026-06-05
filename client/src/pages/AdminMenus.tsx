/**
 * メニュー・料金管理ページ
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const GENDER_OPTIONS = [
  { value: "both", label: "共通" },
  { value: "women", label: "レディース" },
  { value: "men", label: "メンズ" },
];
const GENDER_LABELS: Record<string, string> = { both: "共通", women: "レディース", men: "メンズ" };

const SALON_OPTIONS = [
  { value: "both", label: "両店舗共通" },
  { value: "hankyu", label: "神戸阪急店のみ" },
  { value: "salon", label: "植物美容サロンのみ" },
];
const SALON_LABELS: Record<string, string> = { both: "両店舗", hankyu: "阪急店", salon: "サロン" };

type FormState = {
  name: string;
  nameKana: string;
  category: string;
  durationMin: number | "";
  price: number | "";
  priceLabel: string;
  description: string;
  treatmentContent: string;
  targetCustomer: string;
  imageUrl: string;
  gender: "women" | "men" | "both";
  salonId: "hankyu" | "salon" | "both";
  sortOrder: number;
  published: number;
};
const EMPTY: FormState = { name: "", nameKana: "", category: "", durationMin: "", price: "", priceLabel: "税込", description: "", treatmentContent: "", targetCustomer: "", imageUrl: "", gender: "both", salonId: "both", sortOrder: 0, published: 1 };

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated: isManusAuth, loading: manusLoading } = useAuth();
  const { data: staffUser, isLoading: staffLoading } = trpc.staff.me.useQuery(undefined, { refetchOnWindowFocus: false, retry: false });
  const isAuthenticated = isManusAuth || !!staffUser;
  const loading = manusLoading || staffLoading;
  if (loading) return <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#2C1810" }}>読み込み中...</p></div>;
  if (!isAuthenticated) return <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}><p style={{ color: "#2C1810" }}>ログインが必要です</p><Link href="/staff-login" style={{ background: "#2C1810", color: "#F5F0E8", padding: "10px 24px", borderRadius: "6px", textDecoration: "none" }}>ログイン</Link></div>;
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
  const uploadImageMutation = trpc.storage.uploadContentImage.useMutation({
    onSuccess: (data: { url: string }) => { setForm(f => ({ ...f, imageUrl: data.url })); setUploading(false); },
    onError: () => { toast.error("画像のアップロードに失敗しました"); setUploading(false); },
  });

  function reset() { setForm(EMPTY); setEditId(null); setShowForm(false); }
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(file: File) {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      uploadImageMutation.mutate({ dataUrl, originalName: file.name, folder: "service-menus" });
    };
    reader.readAsDataURL(file);
  }

  function startEdit(item: typeof items[0]) {
    setForm({ name: item.name, nameKana: (item as any).nameKana ?? "", category: item.category, durationMin: item.durationMin ?? "", price: item.price, priceLabel: item.priceLabel ?? "税込", description: item.description ?? "", treatmentContent: (item as any).treatmentContent ?? "", targetCustomer: (item as any).targetCustomer ?? "", imageUrl: (item as any).imageUrl ?? "", gender: item.gender, salonId: (item as any).salonId ?? "both", sortOrder: item.sortOrder, published: item.published });
    setEditId(item.id); setShowForm(true);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.category || form.price === "") { toast.error("メニュー名・カテゴリ・料金は必須です"); return; }
    const payload = { ...form, price: Number(form.price), durationMin: form.durationMin !== "" ? Number(form.durationMin) : undefined, nameKana: form.nameKana || undefined, treatmentContent: form.treatmentContent || undefined, targetCustomer: form.targetCustomer || undefined, imageUrl: form.imageUrl || undefined };
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
        <div style={{ background: "#2C1810", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/admin" style={{ color: "#c9a96e", fontSize: "0.78rem", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)", borderRadius: "6px", padding: "0.25rem 0.75rem", textDecoration: "none" }}>☰ 一覧</Link>
          <Link href="/admin/calendar" style={{ color: "#c9a96e", fontSize: "0.78rem", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)", borderRadius: "6px", padding: "0.25rem 0.75rem", textDecoration: "none" }}>📅 カレンダー</Link>
          <span style={{ color: "#c9a96e", background: "rgba(201,169,110,0.25)", border: "1px solid rgba(201,169,110,0.6)", borderRadius: "6px", padding: "0.25rem 0.75rem", fontSize: "0.78rem", fontWeight: 600 }}>🌿 メニュー管理</span>
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
                  {/* 画像アップロード */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>サービス画像</label>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      {form.imageUrl ? (
                        <img src={form.imageUrl} alt="preview" style={{ width: "96px", height: "96px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e8ddd0" }} />
                      ) : (
                        <div style={{ width: "96px", height: "96px", background: "#f3ede4", borderRadius: "8px", border: "1px dashed #d4c5b0", display: "flex", alignItems: "center", justifyContent: "center", color: "#b0a090", fontSize: "12px" }}>画像なし</div>
                      )}
                      <div>
                        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                          style={{ background: "#f3ede4", color: "#2C1810", border: "1px solid #d4c5b0", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
                          {uploading ? "アップロード中..." : "画像を選択"}
                        </button>
                        {form.imageUrl && (
                          <button type="button" onClick={() => setForm(f => ({ ...f, imageUrl: "" }))}
                            style={{ marginLeft: "8px", background: "transparent", color: "#991b1b", border: "none", fontSize: "12px", cursor: "pointer" }}>削除</button>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                          onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                        <p style={{ color: "#9ca3af", fontSize: "11px", marginTop: "4px" }}>JPG・PNG・WEBP（推奨：600×400px）</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>メニュー名 *</label>
                    <input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="例：スカルプラボ定期ケア" />
                  </div>
                  <div>
                    <label style={lbl}>フリガナ</label>
                    <input style={inp} value={form.nameKana} onChange={e => setForm(f => ({ ...f, nameKana: e.target.value }))} placeholder="例：スカルプラボテイキケア" />
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
                    <label style={lbl}>対象性別</label>
                    <select style={inp} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value as any }))}>
                      {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>対象店舗 *</label>
                    <select style={inp} value={form.salonId} onChange={e => setForm(f => ({ ...f, salonId: e.target.value as any }))}>
                      {SALON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>説明文（予約フォームに表示）</label>
                    <textarea style={{ ...inp, minHeight: "80px", resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="メニューの詳細説明" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>施術内容（詳細）</label>
                    <textarea style={{ ...inp, minHeight: "80px", resize: "vertical" }} value={form.treatmentContent} onChange={e => setForm(f => ({ ...f, treatmentContent: e.target.value }))} placeholder="例：マイクロスコープによる頭皮チェック、ハーブスチーマーによるケア" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>こんな方におすすめ（対象者）</label>
                    <textarea style={{ ...inp, minHeight: "60px", resize: "vertical" }} value={form.targetCustomer} onChange={e => setForm(f => ({ ...f, targetCustomer: e.target.value }))} placeholder="例：頭皮のべたつきやフケが気になる方、薄毛が心配な方" />
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
                          <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }}>{SALON_LABELS[(item as any).salonId ?? "both"]}</span>
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
