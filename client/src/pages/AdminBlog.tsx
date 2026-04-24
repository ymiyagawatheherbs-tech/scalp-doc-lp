/**
 * ブログ・コラム管理ページ
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const BLOG_CATEGORIES = [
  { value: "", label: "カテゴリを選択" },
  { value: "頭皮ケア", label: "頭皮ケア" },
  { value: "スキンケア", label: "スキンケア" },
  { value: "製品紹介", label: "製品紹介" },
  { value: "ライフスタイル", label: "ライフスタイル" },
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
  title: string;
  slug: string;
  thumbnailUrl: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  authorName: string;
  status: "draft" | "published";
};
const EMPTY: FormState = { title: "", slug: "", thumbnailUrl: "", excerpt: "", content: "", category: "", tags: "", authorName: "", status: "draft" };

const STATUS_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  draft: { label: "下書き", bg: "#f3f4f6", color: "#374151" },
  published: { label: "公開中", bg: "#d1fae5", color: "#065f46" },
};

function slugify(title: string) {
  return title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 60) + "-" + Date.now().toString(36);
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated: isManusAuth, loading: manusLoading } = useAuth();
  const { data: staffUser, isLoading: staffLoading } = trpc.staff.me.useQuery(undefined, { refetchOnWindowFocus: false, retry: false });
  const isAuthenticated = isManusAuth || !!staffUser;
  const loading = manusLoading || staffLoading;
  if (loading) return <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#2C1810" }}>読み込み中...</p></div>;
  if (!isAuthenticated) return <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}><p style={{ color: "#2C1810" }}>ログインが必要です</p><Link href="/staff-login"><a style={{ background: "#2C1810", color: "#F5F0E8", padding: "10px 24px", borderRadius: "6px", textDecoration: "none" }}>ログイン</a></Link></div>;
  return <>{children}</>;
}

export default function AdminBlog() {
  const { data: items = [], isLoading, refetch } = trpc.blog.listAdmin.useQuery(undefined, { refetchOnWindowFocus: false });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const createMutation = trpc.blog.create.useMutation({ onSuccess: () => { toast.success("追加しました"); refetch(); reset(); }, onError: e => toast.error(e.message) });
  const updateMutation = trpc.blog.update.useMutation({ onSuccess: () => { toast.success("更新しました"); refetch(); reset(); }, onError: e => toast.error(e.message) });
  const deleteMutation = trpc.blog.delete.useMutation({ onSuccess: () => { toast.success("削除しました"); refetch(); }, onError: e => toast.error(e.message) });

  function reset() { setForm(EMPTY); setEditId(null); setShowForm(false); }
  function startEdit(item: typeof items[0]) {
    setForm({ title: item.title, slug: item.slug, thumbnailUrl: item.thumbnailUrl ?? "", excerpt: item.excerpt ?? "", content: item.content, category: item.category ?? "", tags: item.tags ?? "", authorName: item.authorName ?? "", status: item.status });
    setEditId(item.id); setShowForm(true);
  }
  function handleTitleChange(title: string) {
    setForm(f => ({ ...f, title, slug: editId === null ? slugify(title) : f.slug }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.content) { toast.error("タイトルと本文は必須です"); return; }
    if (!form.slug) { toast.error("スラッグは必須です"); return; }
    if (editId !== null) updateMutation.mutate({ id: editId, ...form });
    else createMutation.mutate(form);
  }

  const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #d4c5b0", borderRadius: "6px", fontSize: "14px", fontFamily: "Noto Sans JP, sans-serif", background: "#fff", color: "#2C1810", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { display: "block", fontSize: "13px", color: "#6b4c2a", marginBottom: "4px", fontWeight: "600" };

  return (
    <AdminGuard>
      <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "Noto Sans JP, sans-serif" }}>
        <div style={{ background: "#2C1810", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/content"><a style={{ color: "#c9a96e", fontSize: "12px", textDecoration: "none" }}>← 管理メニュー</a></Link>
          <span style={{ color: "#c9a96e", opacity: 0.4 }}>|</span>
          <h1 style={{ color: "#F5F0E8", fontSize: "16px", fontWeight: "600", margin: 0 }}>ブログ・コラム管理</h1>
        </div>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ color: "#2C1810", fontSize: "18px", fontWeight: "700", margin: 0 }}>記事数：{items.length}件</h2>
            <button onClick={() => { reset(); setShowForm(true); }} style={{ background: "#c9a96e", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>＋ 新規記事</button>
          </div>

          {showForm && (
            <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ color: "#2C1810", fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>{editId !== null ? "記事を編集" : "新規記事"}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={lbl}>タイトル *</label>
                    <input style={inp} value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="記事タイトル" />
                  </div>
                  <div>
                    <label style={lbl}>スラッグ（URL用）*</label>
                    <input style={inp} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="article-slug" />
                    <p style={{ fontSize: "12px", color: "#9ca3af", margin: "4px 0 0" }}>公開URL: /blog/{form.slug || "..."}</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={lbl}>カテゴリ</label>
                      <select style={inp} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                        {BLOG_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>投稿者名</label>
                      <input style={inp} value={form.authorName} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))} placeholder="スタッフ名" />
                    </div>
                    <div>
                      <label style={lbl}>サムネイル画像</label>
                      <ImageUploadButton
                        label="サムネイル"
                        currentUrl={form.thumbnailUrl}
                        folder="blog"
                        onUploaded={(url) => setForm(f => ({ ...f, thumbnailUrl: url }))}
                      />
                    </div>
                    <div>
                      <label style={lbl}>タグ（カンマ区切り）</label>
                      <input style={inp} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="頭皮,育毛,ケア" />
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>概要（一覧表示用）</label>
                    <textarea style={{ ...inp, minHeight: "60px", resize: "vertical" }} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="記事の概要を入力（省略可）" />
                  </div>
                  <div>
                    <label style={lbl}>本文（Markdown対応）*</label>
                    <textarea style={{ ...inp, minHeight: "200px", resize: "vertical", fontFamily: "monospace" }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="# 見出し&#10;&#10;本文をMarkdown形式で入力してください。" />
                  </div>
                  <div>
                    <label style={lbl}>公開設定</label>
                    <select style={inp} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                      <option value="draft">下書き（非公開）</option>
                      <option value="published">公開する</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                  <button type="submit" style={{ background: "#2C1810", color: "#F5F0E8", border: "none", padding: "10px 24px", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>{editId !== null ? "更新する" : "保存する"}</button>
                  <button type="button" onClick={reset} style={{ background: "transparent", color: "#6b4c2a", border: "1px solid #d4c5b0", padding: "10px 24px", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>キャンセル</button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? <p style={{ color: "#6b4c2a" }}>読み込み中...</p> : items.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "12px", padding: "48px", textAlign: "center" }}>
              <p style={{ color: "#6b4c2a", fontSize: "14px" }}>まだ記事がありません。「新規記事」から作成してください。</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map(item => (
                <div key={item.id} style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  {item.thumbnailUrl && <img src={item.thumbnailUrl} alt="" style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ color: "#2C1810", fontWeight: "700", fontSize: "15px" }}>{item.title}</span>
                      <span style={{ background: STATUS_LABELS[item.status]?.bg, color: STATUS_LABELS[item.status]?.color, fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }}>
                        {STATUS_LABELS[item.status]?.label}
                      </span>
                      {item.category && <span style={{ background: "#f3ede4", color: "#6b4c2a", fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }}>{item.category}</span>}
                    </div>
                    <p style={{ color: "#9ca3af", fontSize: "12px", margin: "0 0 4px" }}>/blog/{item.slug}</p>
                    {item.excerpt && <p style={{ color: "#6b4c2a", fontSize: "13px", margin: 0 }}>{item.excerpt.slice(0, 80)}{item.excerpt.length > 80 ? "…" : ""}</p>}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button onClick={() => startEdit(item)} style={{ background: "#f3ede4", color: "#2C1810", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>編集</button>
                    <button onClick={() => { if (confirm(`「${item.title}」を削除しますか？`)) deleteMutation.mutate({ id: item.id }); }} style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>削除</button>
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
