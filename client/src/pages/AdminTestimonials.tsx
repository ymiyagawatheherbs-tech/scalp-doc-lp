/**
 * お客様の声管理ページ
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

/** デバイスから画像を選択してS3にアップロードするボタン */
function ImageUploadButton({ label, currentUrl, folder, onUploaded }: { label: string; currentUrl: string; folder: string; onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const uploadMutation = trpc.storage.uploadContentImage.useMutation({
    onError: (e: { message?: string }) => { toast.error(e.message || "アップロードに失敗しました"); setUploading(false); },
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("ファイルサイズは10MB以下にしてください"); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      try {
        const result = await uploadMutation.mutateAsync({ dataUrl, originalName: file.name, folder });
        onUploaded(result.url);
        toast.success("アップロードしました");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleChange} />
      {currentUrl && <img src={currentUrl} alt={label} style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e8ddd0", marginBottom: "8px" }} />}
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
        style={{ background: uploading ? "#d4c5b0" : "#f3ede4", color: "#2C1810", border: "1px dashed #c9a96e", padding: "10px 16px", borderRadius: "6px", fontSize: "13px", cursor: uploading ? "not-allowed" : "pointer", fontFamily: "Noto Sans JP, sans-serif", width: "100%", textAlign: "center" }}>
        {uploading ? "アップロード中..." : currentUrl ? `📷 ${label}を変更` : `📷 ${label}を選択`}
      </button>
    </div>
  );
}

const GENDER_OPTIONS = [
  { value: "both", label: "共通" },
  { value: "women", label: "レディース" },
  { value: "men", label: "メンズ" },
];
const GENDER_LABELS: Record<string, string> = { both: "共通", women: "レディース", men: "メンズ" };

type FormState = {
  customerName: string;
  customerAge: string;
  concern: string;
  rating: number;
  content: string;
  imageUrl: string;
  gender: "women" | "men" | "both";
  sortOrder: number;
  published: number;
};
const EMPTY: FormState = { customerName: "", customerAge: "", concern: "", rating: 5, content: "", imageUrl: "", gender: "both", sortOrder: 0, published: 1 };

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated: isManusAuth, loading: manusLoading } = useAuth();
  const { data: staffUser, isLoading: staffLoading } = trpc.staff.me.useQuery(undefined, { refetchOnWindowFocus: false, retry: false });
  const isAuthenticated = isManusAuth || !!staffUser;
  const loading = manusLoading || staffLoading;
  if (loading) return <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#2C1810" }}>読み込み中...</p></div>;
  if (!isAuthenticated) return <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}><p style={{ color: "#2C1810" }}>ログインが必要です</p><Link href="/staff-login" style={{ background: "#2C1810", color: "#F5F0E8", padding: "10px 24px", borderRadius: "6px", textDecoration: "none" }}>ログイン</Link></div>;
  return <>{children}</>;
}

export default function AdminTestimonials() {
  const { data: items = [], isLoading, refetch } = trpc.testimonial.listAdmin.useQuery(undefined, { refetchOnWindowFocus: false });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const createMutation = trpc.testimonial.create.useMutation({ onSuccess: () => { toast.success("追加しました"); refetch(); reset(); }, onError: e => toast.error(e.message) });
  const updateMutation = trpc.testimonial.update.useMutation({ onSuccess: () => { toast.success("更新しました"); refetch(); reset(); }, onError: e => toast.error(e.message) });
  const deleteMutation = trpc.testimonial.delete.useMutation({ onSuccess: () => { toast.success("削除しました"); refetch(); }, onError: e => toast.error(e.message) });

  function reset() { setForm(EMPTY); setEditId(null); setShowForm(false); }
  function startEdit(item: typeof items[0]) {
    setForm({ customerName: item.customerName, customerAge: item.customerAge ?? "", concern: item.concern ?? "", rating: item.rating, content: item.content, imageUrl: item.imageUrl ?? "", gender: item.gender, sortOrder: item.sortOrder, published: item.published });
    setEditId(item.id); setShowForm(true);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName || !form.content) { toast.error("お名前と内容は必須です"); return; }
    if (editId !== null) updateMutation.mutate({ id: editId, ...form });
    else createMutation.mutate(form);
  }

  const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #d4c5b0", borderRadius: "6px", fontSize: "14px", fontFamily: "Noto Sans JP, sans-serif", background: "#fff", color: "#2C1810", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { display: "block", fontSize: "13px", color: "#6b4c2a", marginBottom: "4px", fontWeight: "600" };

  return (
    <AdminGuard>
      <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "Noto Sans JP, sans-serif" }}>
        <div style={{ background: "#2C1810", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/content" style={{ color: "#c9a96e", fontSize: "12px", textDecoration: "none" }}>← 管理メニュー</Link>
          <span style={{ color: "#c9a96e", opacity: 0.4 }}>|</span>
          <h1 style={{ color: "#F5F0E8", fontSize: "16px", fontWeight: "600", margin: 0 }}>お客様の声管理</h1>
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
                  <div>
                    <label style={lbl}>お名前 *（例：A様、田中様）</label>
                    <input style={inp} value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="A様" />
                  </div>
                  <div>
                    <label style={lbl}>年代</label>
                    <input style={inp} value={form.customerAge} onChange={e => setForm(f => ({ ...f, customerAge: e.target.value }))} placeholder="40代女性" />
                  </div>
                  <div>
                    <label style={lbl}>お悩みタグ</label>
                    <input style={inp} value={form.concern} onChange={e => setForm(f => ({ ...f, concern: e.target.value }))} placeholder="うねり・薄毛" />
                  </div>
                  <div>
                    <label style={lbl}>評価（1〜5）</label>
                    <select style={inp} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{"★".repeat(n)} ({n})</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>お客様の声 *</label>
                    <textarea style={{ ...inp, minHeight: "100px", resize: "vertical" }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="お客様のコメントを入力してください" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>写真（任意）</label>
                    <ImageUploadButton
                      label="お客様の写真"
                      currentUrl={form.imageUrl}
                      folder="testimonials"
                      onUploaded={(url) => setForm(f => ({ ...f, imageUrl: url }))}
                    />
                  </div>
                  <div>
                    <label style={lbl}>対象</label>
                    <select style={inp} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value as any }))}>
                      {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map(item => (
                <div key={item.id} style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{ color: "#2C1810", fontWeight: "700", fontSize: "15px" }}>{item.customerName}</span>
                      {item.customerAge && <span style={{ color: "#6b4c2a", fontSize: "13px" }}>{item.customerAge}</span>}
                      <span style={{ color: "#c9a96e", fontSize: "13px" }}>{"★".repeat(item.rating)}</span>
                      <span style={{ background: item.published ? "#d1fae5" : "#fee2e2", color: item.published ? "#065f46" : "#991b1b", fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }}>{item.published ? "公開" : "非公開"}</span>
                      <span style={{ background: "#f3ede4", color: "#6b4c2a", fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }}>{GENDER_LABELS[item.gender]}</span>
                    </div>
                    {item.concern && <p style={{ color: "#c9a96e", fontSize: "12px", margin: "0 0 4px" }}>お悩み：{item.concern}</p>}
                    <p style={{ color: "#6b4c2a", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>{item.content.length > 100 ? item.content.slice(0, 100) + "…" : item.content}</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button onClick={() => startEdit(item)} style={{ background: "#f3ede4", color: "#2C1810", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>編集</button>
                    <button onClick={() => { if (confirm(`「${item.customerName}」の声を削除しますか？`)) deleteMutation.mutate({ id: item.id }); }} style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>削除</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
