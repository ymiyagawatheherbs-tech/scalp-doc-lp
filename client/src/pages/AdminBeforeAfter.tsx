/**
 * ビフォーアフター管理ページ
 * スタッフが施術前後の写真をデバイスからアップロードして管理できる画面
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const GENDER_OPTIONS = [
  { value: "both", label: "共通（レディース・メンズ両方）" },
  { value: "women", label: "レディース" },
  { value: "men", label: "メンズ" },
];

const GENDER_LABELS: Record<string, string> = {
  both: "共通",
  women: "レディース",
  men: "メンズ",
};

type FormState = {
  title: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  period: string;
  gender: "women" | "men" | "both";
  description: string;
  sortOrder: number;
  published: number;
};

const EMPTY_FORM: FormState = {
  title: "",
  beforeImageUrl: "",
  afterImageUrl: "",
  period: "",
  gender: "both",
  description: "",
  sortOrder: 0,
  published: 1,
};

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated: isManusAuth, loading: manusLoading } = useAuth();
  const { data: staffUser, isLoading: staffLoading } = trpc.staff.me.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
  });
  const isAuthenticated = isManusAuth || !!staffUser;
  const loading = manusLoading || staffLoading;

  if (loading) return <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#2C1810" }}>読み込み中...</p></div>;
  if (!isAuthenticated) return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
      <p style={{ color: "#2C1810" }}>ログインが必要です</p>
      <Link href="/staff-login"><a style={{ background: "#2C1810", color: "#F5F0E8", padding: "10px 24px", borderRadius: "6px", textDecoration: "none" }}>ログイン</a></Link>
    </div>
  );
  return <>{children}</>;
}

/** デバイスから画像を選択してS3にアップロードするボタン */
function ImageUploadButton({
  label,
  currentUrl,
  folder,
  onUploaded,
}: {
  label: string;
  currentUrl: string;
  folder: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const uploadMutation = trpc.storage.uploadContentImage.useMutation({
    onError: (e: { message?: string }) => {
      toast.error(e.message || "アップロードに失敗しました");
      setUploading(false);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ファイルサイズは10MB以下にしてください");
      return;
    }
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
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {currentUrl && (
          <img src={currentUrl} alt={label} style={{ width: "100%", maxHeight: "160px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e8ddd0" }} />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            background: uploading ? "#d4c5b0" : "#f3ede4",
            color: "#2C1810",
            border: "1px dashed #c9a96e",
            padding: "10px 16px",
            borderRadius: "6px",
            fontSize: "13px",
            cursor: uploading ? "not-allowed" : "pointer",
            fontFamily: "Noto Sans JP, sans-serif",
            textAlign: "center",
          }}
        >
          {uploading ? "アップロード中..." : currentUrl ? `📷 ${label}を変更` : `📷 ${label}を選択`}
        </button>
        {currentUrl && (
          <p style={{ fontSize: "11px", color: "#9b7a5a", margin: 0, wordBreak: "break-all" }}>{currentUrl.split("/").pop()}</p>
        )}
      </div>
    </div>
  );
}

export default function AdminBeforeAfter() {
  const { data: items = [], isLoading, refetch } = trpc.beforeAfter.listAdmin.useQuery(undefined, { refetchOnWindowFocus: false });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const createMutation = trpc.beforeAfter.create.useMutation({
    onSuccess: () => { toast.success("追加しました"); refetch(); resetForm(); },
    onError: (e: { message?: string }) => toast.error(e.message || "追加に失敗しました"),
  });
  const updateMutation = trpc.beforeAfter.update.useMutation({
    onSuccess: () => { toast.success("更新しました"); refetch(); resetForm(); },
    onError: (e: { message?: string }) => toast.error(e.message || "更新に失敗しました"),
  });
  const deleteMutation = trpc.beforeAfter.delete.useMutation({
    onSuccess: () => { toast.success("削除しました"); refetch(); },
    onError: (e: { message?: string }) => toast.error(e.message || "削除に失敗しました"),
  });

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
  }

  function startEdit(item: typeof items[0]) {
    setForm({
      title: item.title,
      beforeImageUrl: item.beforeImageUrl,
      afterImageUrl: item.afterImageUrl,
      period: item.period ?? "",
      gender: item.gender,
      description: item.description ?? "",
      sortOrder: item.sortOrder,
      published: item.published,
    });
    setEditId(item.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.beforeImageUrl || !form.afterImageUrl) {
      toast.error("タイトル・ビフォー画像・アフター画像は必須です");
      return;
    }
    if (editId !== null) {
      updateMutation.mutate({ id: editId, ...form });
    } else {
      createMutation.mutate(form);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", border: "1px solid #d4c5b0", borderRadius: "6px",
    fontSize: "14px", fontFamily: "Noto Sans JP, sans-serif", background: "#fff", color: "#2C1810", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "13px", color: "#6b4c2a", marginBottom: "4px", fontWeight: "600" };

  return (
    <AdminGuard>
      <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "Noto Sans JP, sans-serif" }}>
        {/* ヘッダー */}
        <div style={{ background: "#2C1810", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/content"><a style={{ color: "#c9a96e", fontSize: "12px", textDecoration: "none" }}>← 管理メニュー</a></Link>
          <span style={{ color: "#c9a96e", opacity: 0.4 }}>|</span>
          <h1 style={{ color: "#F5F0E8", fontSize: "16px", fontWeight: "600", margin: 0 }}>ビフォーアフター管理</h1>
        </div>

        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>
          {/* 追加ボタン */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ color: "#2C1810", fontSize: "18px", fontWeight: "700", margin: 0 }}>
              登録件数：{items.length}件
            </h2>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              style={{ background: "#c9a96e", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "14px", cursor: "pointer", fontFamily: "Noto Sans JP, sans-serif" }}
            >
              ＋ 新規追加
            </button>
          </div>

          {/* フォーム */}
          {showForm && (
            <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ color: "#2C1810", fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                {editId !== null ? "編集" : "新規追加"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>タイトル *</label>
                    <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="例：うねり・広がりケア" />
                  </div>

                  {/* ビフォー画像：デバイスからアップロード */}
                  <div>
                    <label style={labelStyle}>ビフォー画像 *</label>
                    <ImageUploadButton
                      label="ビフォー画像"
                      currentUrl={form.beforeImageUrl}
                      folder="before-after"
                      onUploaded={(url) => setForm(f => ({ ...f, beforeImageUrl: url }))}
                    />
                  </div>

                  {/* アフター画像：デバイスからアップロード */}
                  <div>
                    <label style={labelStyle}>アフター画像 *</label>
                    <ImageUploadButton
                      label="アフター画像"
                      currentUrl={form.afterImageUrl}
                      folder="before-after"
                      onUploaded={(url) => setForm(f => ({ ...f, afterImageUrl: url }))}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>施術期間</label>
                    <input style={inputStyle} value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} placeholder="例：7ヶ月後" />
                  </div>
                  <div>
                    <label style={labelStyle}>対象</label>
                    <select style={inputStyle} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value as "women" | "men" | "both" }))}>
                      {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>説明文</label>
                    <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="施術内容の詳細説明（任意）" />
                  </div>
                  <div>
                    <label style={labelStyle}>表示順（小さいほど上位）</label>
                    <input type="number" style={inputStyle} value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>公開設定</label>
                    <select style={inputStyle} value={form.published} onChange={e => setForm(f => ({ ...f, published: Number(e.target.value) }))}>
                      <option value={1}>公開</option>
                      <option value={0}>非公開</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                  <button type="submit" style={{ background: "#2C1810", color: "#F5F0E8", border: "none", padding: "10px 24px", borderRadius: "6px", fontSize: "14px", cursor: "pointer", fontFamily: "Noto Sans JP, sans-serif" }}>
                    {editId !== null ? "更新する" : "追加する"}
                  </button>
                  <button type="button" onClick={resetForm} style={{ background: "transparent", color: "#6b4c2a", border: "1px solid #d4c5b0", padding: "10px 24px", borderRadius: "6px", fontSize: "14px", cursor: "pointer", fontFamily: "Noto Sans JP, sans-serif" }}>
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 一覧 */}
          {isLoading ? (
            <p style={{ color: "#6b4c2a" }}>読み込み中...</p>
          ) : items.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "12px", padding: "48px", textAlign: "center" }}>
              <p style={{ color: "#6b4c2a", fontSize: "14px" }}>まだ登録されていません。「新規追加」から追加してください。</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map(item => (
                <div key={item.id} style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {item.beforeImageUrl && <img src={item.beforeImageUrl} alt="before" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e8ddd0" }} />}
                    {item.afterImageUrl && <img src={item.afterImageUrl} alt="after" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e8ddd0" }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ color: "#2C1810", fontWeight: "700", fontSize: "15px" }}>{item.title}</span>
                      <span style={{ background: item.published ? "#d1fae5" : "#fee2e2", color: item.published ? "#065f46" : "#991b1b", fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }}>
                        {item.published ? "公開" : "非公開"}
                      </span>
                      <span style={{ background: "#f3ede4", color: "#6b4c2a", fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }}>
                        {GENDER_LABELS[item.gender]}
                      </span>
                    </div>
                    <p style={{ color: "#6b4c2a", fontSize: "13px", margin: 0 }}>
                      {item.period && `施術期間：${item.period}　`}表示順：{item.sortOrder}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => startEdit(item)} style={{ background: "#f3ede4", color: "#2C1810", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>編集</button>
                    <button
                      onClick={() => { if (confirm(`「${item.title}」を削除しますか？`)) deleteMutation.mutate({ id: item.id }); }}
                      style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
                    >削除</button>
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
