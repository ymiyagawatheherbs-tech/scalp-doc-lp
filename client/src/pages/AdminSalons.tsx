/**
 * パートナーサロン管理ページ
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const SALON_SERVICES = [
  "頭皮チェック",
  "定期ケア（ボタニカルミスト）",
  "パーソナルケア",
];

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

type FormState = {
  name: string;
  prefecture: string;
  city: string;
  address: string;
  phone: string;
  websiteUrl: string;
  snsUrl: string;
  description: string;
  imageUrl: string;
  services: string;
  sortOrder: number;
  published: number;
};
const EMPTY: FormState = { name: "", prefecture: "", city: "", address: "", phone: "", websiteUrl: "", snsUrl: "", description: "", imageUrl: "", services: "", sortOrder: 0, published: 1 };

const PREFECTURES = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated: isManusAuth, loading: manusLoading } = useAuth();
  const { data: staffUser, isLoading: staffLoading } = trpc.staff.me.useQuery(undefined, { refetchOnWindowFocus: false, retry: false });
  const isAuthenticated = isManusAuth || !!staffUser;
  const loading = manusLoading || staffLoading;
  if (loading) return <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#2C1810" }}>読み込み中...</p></div>;
  if (!isAuthenticated) return <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}><p style={{ color: "#2C1810" }}>ログインが必要です</p><Link href="/staff-login" style={{ background: "#2C1810", color: "#F5F0E8", padding: "10px 24px", borderRadius: "6px", textDecoration: "none" }}>ログイン</Link></div>;
  return <>{children}</>;
}

export default function AdminSalons() {
  const { data: items = [], isLoading, refetch } = trpc.salon.listAdmin.useQuery(undefined, { refetchOnWindowFocus: false });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const createMutation = trpc.salon.create.useMutation({ onSuccess: () => { toast.success("追加しました"); refetch(); reset(); }, onError: e => toast.error(e.message) });
  const updateMutation = trpc.salon.update.useMutation({ onSuccess: () => { toast.success("更新しました"); refetch(); reset(); }, onError: e => toast.error(e.message) });
  const deleteMutation = trpc.salon.delete.useMutation({ onSuccess: () => { toast.success("削除しました"); refetch(); }, onError: e => toast.error(e.message) });

  function reset() { setForm(EMPTY); setEditId(null); setShowForm(false); }
  function startEdit(item: typeof items[0]) {
    setForm({ name: item.name, prefecture: item.prefecture, city: item.city, address: item.address ?? "", phone: item.phone ?? "", websiteUrl: item.websiteUrl ?? "", snsUrl: item.snsUrl ?? "", description: item.description ?? "", imageUrl: item.imageUrl ?? "", services: item.services ?? "", sortOrder: item.sortOrder, published: item.published });
    setEditId(item.id); setShowForm(true);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.prefecture || !form.city) { toast.error("サロン名・都道府県・市区町村は必須です"); return; }
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
          <h1 style={{ color: "#F5F0E8", fontSize: "16px", fontWeight: "600", margin: 0 }}>パートナーサロン管理</h1>
        </div>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ color: "#2C1810", fontSize: "18px", fontWeight: "700", margin: 0 }}>登録件数：{items.length}件</h2>
            <button onClick={() => { reset(); setShowForm(true); }} style={{ background: "#c9a96e", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>＋ サロン追加</button>
          </div>

          {showForm && (
            <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ color: "#2C1810", fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>{editId !== null ? "サロン情報を編集" : "新規サロン追加"}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>サロン名 *</label>
                    <input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="例：スカルプラボ神戸サロン" />
                  </div>
                  <div>
                    <label style={lbl}>都道府県 *</label>
                    <select style={inp} value={form.prefecture} onChange={e => setForm(f => ({ ...f, prefecture: e.target.value }))}>
                      <option value="">選択してください</option>
                      {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>市区町村 *</label>
                    <input style={inp} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="例：神戸市灘区" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>住所（番地まで）</label>
                    <input style={inp} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="例：六甲道南町1-1" />
                  </div>
                  <div>
                    <label style={lbl}>電話番号</label>
                    <input style={inp} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="078-000-0000" />
                  </div>
                  <div>
                    <label style={lbl}>公式サイトURL</label>
                    <input style={inp} value={form.websiteUrl} onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))} placeholder="https://..." />
                  </div>
                  <div>
                    <label style={lbl}>Instagram・SNS URL</label>
                    <input style={inp} value={form.snsUrl} onChange={e => setForm(f => ({ ...f, snsUrl: e.target.value }))} placeholder="https://instagram.com/..." />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>サロン画像</label>
                    <ImageUploadButton
                      label="サロン画像"
                      currentUrl={form.imageUrl}
                      folder="salons"
                      onUploaded={(url) => setForm(f => ({ ...f, imageUrl: url }))}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>対応メニュー（複数選択可）</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", padding: "12px", background: "#faf7f3", borderRadius: "6px", border: "1px solid #d4c5b0" }}>
                      {SALON_SERVICES.map(svc => {
                        const selected = form.services.split(",").map(s => s.trim()).filter(Boolean).includes(svc);
                        return (
                          <label key={svc} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "14px", color: "#2C1810", fontFamily: "Noto Sans JP, sans-serif" }}>
                            <input type="checkbox" checked={selected} onChange={() => {
                              const current = form.services.split(",").map(s => s.trim()).filter(Boolean);
                              const next = selected ? current.filter(s => s !== svc) : [...current, svc];
                              setForm(f => ({ ...f, services: next.join(",") }));
                            }} style={{ width: "16px", height: "16px", accentColor: "#c9a96e" }} />
                            {svc}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>サロン紹介文</label>
                    <textarea style={{ ...inp, minHeight: "80px", resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="サロンの特徴や施術内容を入力してください" />
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
              <p style={{ color: "#6b4c2a", fontSize: "14px" }}>まだ登録されていません。「サロン追加」から追加してください。</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map(item => (
                <div key={item.id} style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ color: "#2C1810", fontWeight: "700", fontSize: "15px" }}>{item.name}</span>
                      <span style={{ background: item.published ? "#d1fae5" : "#fee2e2", color: item.published ? "#065f46" : "#991b1b", fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }}>{item.published ? "公開" : "非公開"}</span>
                    </div>
                    <p style={{ color: "#6b4c2a", fontSize: "13px", margin: "0 0 4px" }}>{item.prefecture} {item.city} {item.address ?? ""}</p>
                    {item.phone && <p style={{ color: "#9ca3af", fontSize: "12px", margin: 0 }}>📞 {item.phone}</p>}
                    {item.services && <p style={{ color: "#c9a96e", fontSize: "12px", margin: "4px 0 0" }}>対応：{item.services}</p>}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button onClick={() => startEdit(item)} style={{ background: "#f3ede4", color: "#2C1810", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>編集</button>
                    <button onClick={() => { if (confirm(`「${item.name}」を削除しますか？`)) deleteMutation.mutate({ id: item.id }); }} style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>削除</button>
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
