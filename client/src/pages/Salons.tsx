/**
 * パートナーサロン一覧ページ（公開）
 * /salons — 地図付きサロン一覧
 */
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { MapView } from "@/components/Map";
import { Link } from "wouter";

const SERVICE_COLORS: Record<string, string> = {
  "頭皮チェック": "#c9a96e",
  "定期ケア（ボタニカルミスト）": "#7a9e7e",
  "パーソナルケア": "#9b7ea6",
};

type Salon = {
  id: number;
  name: string;
  prefecture: string;
  city: string;
  address: string | null;
  phone: string | null;
  websiteUrl: string | null;
  snsUrl: string | null;
  description: string | null;
  imageUrl: string | null;
  services: string | null;
  sortOrder: number;
  published: number;
  createdAt: Date;
  updatedAt: Date;
};

function SalonCard({ salon, isSelected, onClick }: { salon: Salon; isSelected: boolean; onClick: () => void }) {
  const services = salon.services ? salon.services.split(",").map(s => s.trim()).filter(Boolean) : [];
  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? "#2C1810" : "#fff",
        border: isSelected ? "2px solid #c9a96e" : "1px solid #e8ddd0",
        borderRadius: "12px",
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
      }}
    >
      {salon.imageUrl && (
        <img
          src={salon.imageUrl}
          alt={salon.name}
          style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: isSelected ? "#c9a96e" : "#2C1810", fontWeight: "700", fontSize: "15px", margin: "0 0 4px", fontFamily: "Noto Sans JP, sans-serif" }}>{salon.name}</p>
        <p style={{ color: isSelected ? "#d4c5b0" : "#6b4c2a", fontSize: "12px", margin: "0 0 6px", fontFamily: "Noto Sans JP, sans-serif" }}>
          {salon.prefecture} {salon.city}{salon.address ? ` ${salon.address}` : ""}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {services.map(svc => (
            <span key={svc} style={{
              background: SERVICE_COLORS[svc] || "#c9a96e",
              color: "#fff",
              fontSize: "10px",
              padding: "2px 8px",
              borderRadius: "20px",
              fontFamily: "Noto Sans JP, sans-serif",
            }}>{svc}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Salons() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterService, setFilterService] = useState<string>("");
  const [filterPref, setFilterPref] = useState<string>("");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const { data: salons = [], isLoading } = trpc.salon.list.useQuery({ prefecture: filterPref || undefined }, { refetchOnWindowFocus: false });

  const selectedSalon = salons.find(s => s.id === selectedId) ?? null;

  const filtered = salons.filter(s => {
    const svcMatch = !filterService || (s.services ?? "").includes(filterService);
    const prefMatch = !filterPref || s.prefecture === filterPref;
    return svcMatch && prefMatch;
  });

  const prefectures = Array.from(new Set(salons.map(s => s.prefecture))).sort();

  function handleMapReady(map: google.maps.Map) {
    setMapInstance(map);
    // 住所からジオコーディングしてマーカーを配置
    const geocoder = new google.maps.Geocoder();
    const bounds = new google.maps.LatLngBounds();
    let geocodedCount = 0;
    salons.forEach(salon => {
      const fullAddress = `${salon.prefecture}${salon.city}${salon.address ?? ""}`;
      geocoder.geocode({ address: fullAddress, region: "JP" }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const pos = results[0].geometry.location;
          const marker = new google.maps.Marker({
            position: pos,
            map,
            title: salon.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#c9a96e",
              fillOpacity: 1,
              strokeColor: "#2C1810",
              strokeWeight: 2,
            },
          });
          marker.addListener("click", () => setSelectedId(salon.id));
          bounds.extend(pos);
          geocodedCount++;
          if (geocodedCount === salons.length && !bounds.isEmpty()) {
            map.fitBounds(bounds);
          }
        }
      });
    });
  }

  // 選択サロンが変わったら地図を移動
  function handleSelectSalon(salon: Salon) {
    setSelectedId(salon.id);
    if (mapInstance) {
      const geocoder = new google.maps.Geocoder();
      const fullAddress = `${salon.prefecture}${salon.city}${salon.address ?? ""}`;
      geocoder.geocode({ address: fullAddress, region: "JP" }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          mapInstance.panTo(results[0].geometry.location);
          mapInstance.setZoom(15);
        }
      });
    }
  }

  const inp: React.CSSProperties = {
    padding: "8px 12px",
    border: "1px solid #d4c5b0",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: "Noto Sans JP, sans-serif",
    background: "#fff",
    color: "#2C1810",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "Noto Sans JP, sans-serif" }}>
      {/* ヘッダー */}
      <div style={{ background: "#2C1810", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <Link href="/"><a style={{ color: "#c9a96e", fontSize: "12px", textDecoration: "none" }}>← スカルプラボ TOP</a></Link>
            <h1 style={{ color: "#F5F0E8", fontSize: "20px", fontWeight: "700", margin: "4px 0 0", letterSpacing: "0.05em" }}>
              パートナーサロン一覧
            </h1>
          </div>
          <p style={{ color: "#d4c5b0", fontSize: "13px", margin: 0 }}>認定サロン {salons.length}店舗</p>
        </div>
      </div>

      {/* サブヘッダー */}
      <div style={{ background: "#3d2010", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#d4c5b0", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
            スカルプラボ認定パートナーサロンは、専門の頭皮ケアトレーニングを受けたスタッフが在籍しています。
            お近くのサロンで定期的な頭皮チェックをお受けください。
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {/* フィルター */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <select style={inp} value={filterPref} onChange={e => setFilterPref(e.target.value)}>
            <option value="">都道府県で絞り込み</option>
            {prefectures.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select style={inp} value={filterService} onChange={e => setFilterService(e.target.value)}>
            <option value="">対応メニューで絞り込み</option>
            <option value="頭皮チェック">頭皮チェック</option>
            <option value="定期ケア（ボタニカルミスト）">定期ケア（ボタニカルミスト）</option>
            <option value="パーソナルケア">パーソナルケア</option>
          </select>
          {(filterPref || filterService) && (
            <button onClick={() => { setFilterPref(""); setFilterService(""); }}
              style={{ background: "transparent", color: "#6b4c2a", border: "1px solid #d4c5b0", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
              絞り込みを解除
            </button>
          )}
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "#6b4c2a" }}>読み込み中...</p>
          </div>
        ) : salons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "#6b4c2a", fontSize: "16px" }}>現在、認定パートナーサロンを準備中です。</p>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginTop: "8px" }}>サロン認定についてのお問い合わせは、公式LINEよりお気軽にどうぞ。</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px", alignItems: "start" }}>
            {/* サロンリスト */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "600px", overflowY: "auto", paddingRight: "4px" }}>
              <p style={{ color: "#6b4c2a", fontSize: "13px", margin: "0 0 8px" }}>{filtered.length}件のサロン</p>
              {filtered.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>条件に一致するサロンがありません。</p>
              ) : (
                filtered.map(salon => (
                  <SalonCard
                    key={salon.id}
                    salon={salon}
                    isSelected={selectedId === salon.id}
                    onClick={() => handleSelectSalon(salon)}
                  />
                ))
              )}
            </div>

            {/* 地図 + 選択サロン詳細 */}
            <div>
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e8ddd0", height: "400px" }}>
                <MapView
                  className="w-full h-full"
                  initialCenter={{ lat: 34.6937, lng: 135.5023 }}
                  initialZoom={10}
                  onMapReady={handleMapReady}
                />
              </div>

              {/* 選択サロン詳細 */}
              {selectedSalon && (
                <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: "12px", padding: "20px", marginTop: "16px" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    {selectedSalon.imageUrl && (
                      <img src={selectedSalon.imageUrl} alt={selectedSalon.name}
                        style={{ width: "100px", height: "80px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: "#2C1810", fontSize: "18px", fontWeight: "700", margin: "0 0 6px" }}>{selectedSalon.name}</h3>
                      <p style={{ color: "#6b4c2a", fontSize: "13px", margin: "0 0 4px" }}>
                        📍 {selectedSalon.prefecture} {selectedSalon.city}{selectedSalon.address ? ` ${selectedSalon.address}` : ""}
                      </p>
                      {selectedSalon.phone && <p style={{ color: "#6b4c2a", fontSize: "13px", margin: "0 0 4px" }}>📞 {selectedSalon.phone}</p>}
                      {selectedSalon.description && (
                        <p style={{ color: "#6b4c2a", fontSize: "13px", margin: "8px 0", lineHeight: 1.7 }}>{selectedSalon.description}</p>
                      )}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                        {(selectedSalon.services ?? "").split(",").map((s: string) => s.trim()).filter(Boolean).map((svc: string) => (
                          <span key={svc} style={{ background: SERVICE_COLORS[svc] || "#c9a96e", color: "#fff", fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}>{svc}</span>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                        {selectedSalon.websiteUrl && (
                          <a href={selectedSalon.websiteUrl} target="_blank" rel="noopener noreferrer"
                            style={{ background: "#2C1810", color: "#F5F0E8", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", textDecoration: "none" }}>
                            公式サイト
                          </a>
                        )}
                        {selectedSalon.snsUrl && (
                          <a href={selectedSalon.snsUrl} target="_blank" rel="noopener noreferrer"
                            style={{ background: "#f3ede4", color: "#2C1810", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", textDecoration: "none", border: "1px solid #d4c5b0" }}>
                            Instagram
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
