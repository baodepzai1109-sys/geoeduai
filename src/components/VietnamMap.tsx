"use client";
import { useEffect, useState, useRef } from "react";;
import provinceInfo from "@/data/provinceInfo.json";
import provinces34 from "@/data/provinces34.json";
import ProvinceLabels from "./ProvinceLabels";
import { MapContainer, GeoJSON } from "react-leaflet";
import { Search } from "lucide-react";
import "leaflet/dist/leaflet.css";
export default function VietnamMap() {
const [search, setSearch] = useState("");
const provinceLayers = useRef<Record<string, any>>({});
const [suggestions, setSuggestions] = useState<string[]>([]);
const [geoData, setGeoData] = useState<any>(null);
const [geo34, setGeo34] = useState<any>(null);
const provinceColors: Record<string, string> = {};

const colors = [
  "#e6194b","#3cb44b","#ffe119","#4363d8","#f58231",
  "#911eb4","#46f0f0","#f032e6","#bcf60c","#fabebe",
  "#008080","#e6beff","#9a6324","#fffac8","#800000",
  "#aaffc3","#808000","#ffd8b1","#000075","#808080",
  "#ff6b6b","#4ecdc4","#45b7d1","#96ceb4","#feca57",
  "#ff9ff3","#54a0ff","#5f27cd","#00d2d3","#ff9f43",
  "#10ac84","#ee5253","#2e86de","#341f97"
];
const provinceList = Object.keys(provinceInfo);
Object.values(provinces34).forEach((province: any, index) => {
  provinceColors[province.name] = colors[index];
});
useEffect(() => {
  fetch("/vn_geo.json")
    .then((res) => res.json())
    .then((data) => setGeoData(data));

  fetch("/vn_geo_34.json")
    .then((res) => res.json())
    .then((data) => setGeo34(data));
}, []);
return (
<MapContainer
  center={[16.2, 106.5]}
  zoom={6}
  style={{
  height: "calc(100vh - 120px)",
  width: "100%",
}}
>
<div
  style={{
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 9999,
    width: "calc(100vw - 30px)",
maxWidth: "340px",
  }}
>
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>
  <input
    type="text"
    placeholder="🔍 Tìm kiếm tỉnh/thành..."
    value={search}
    onChange={(e) => {
      const value = e.target.value;

      setSearch(value);

      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      setSuggestions(
        provinceList
          .filter((p) =>
            p.toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 8)
      );
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        const layer =
          provinceLayers.current[search];

        if (layer) {
          layer.openPopup();

          layer._map.fitBounds(
            layer.getBounds(),
            {
              padding: [50, 50],
            }
          );
        }
      }
    }}
    style={{
      flex: 1,
      padding: "14px 18px",
      borderRadius: "18px",
      border: "1px solid rgba(59,130,246,.4)",
      background: "rgba(15,23,42,.95)",
      color: "white",
      outline: "none",
      backdropFilter: "blur(10px)",
      boxShadow:
        "0 0 25px rgba(37,99,235,.25)",
    }}
  />

  <button
  onClick={() => {
    const layer = provinceLayers.current[search];

    if (layer) {
      layer.openPopup();

      layer._map.fitBounds(
        layer.getBounds(),
        {
          padding: [50, 50],
        }
      );
    }
  }}
  style={{
    width: "52px",
    height: "52px",

    borderRadius: "16px",
    border: "1px solid rgba(59,130,246,.5)",

    background:
      "linear-gradient(135deg,#0f172a,#1d4ed8)",

    color: "#60a5fa",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    cursor: "pointer",

    boxShadow:
      "0 0 20px rgba(59,130,246,.35)"
  }}
>
  <Search
    size={22}
    strokeWidth={2.5}
  />
</button>
</div>

  {suggestions.length > 0 && (
    <div
      style={{
        marginTop: 8,
        background: "#0f172a",
        borderRadius: 16,
        overflow: "hidden",
        border:
          "1px solid rgba(59,130,246,.3)",
      }}
    >
      {suggestions.map((item) => (
        <div
          key={item}
          onClick={() => {
  setSearch(item);
  setSuggestions([]);

  const layer = provinceLayers.current[item];

  if (layer) {
    layer.openPopup();

    layer._map.fitBounds(
      layer.getBounds(),
      {
        padding: [50, 50],
      }
    );
  }
}}
          style={{
            padding: "12px 16px",
            cursor: "pointer",
            borderBottom:
              "1px solid rgba(255,255,255,.05)",
          }}
        >
           {item}
        </div>
      ))}
    </div>
  )}
</div>
{geo34 && (
<>
<GeoJSON
  data={geo34}
  style={(feature: any) => {
    const provinceName =
      feature?.properties?.name ||
      feature?.properties?.oldName ||
      "";
    const aliasMap: Record<string, string> = {
      "TP Hồ Chí Minh": "Hồ Chí Minh",
      "Thừa Thiên Huế": "Huế",
      "Hoàng Sa (Đà Nẵng)": "Đà Nẵng",
      "Trường Sa (Khánh Hòa)": "Khánh Hòa",
    };

    const mappedName =
      aliasMap[provinceName] || provinceName;

    const color =
      provinceColors[mappedName] || "#94a3b8";

    return {
      fillColor: color,
      color: "#f8fafc",
      weight: 0.5,
      opacity: 0.5,
      fillOpacity: 0.92,
    };
  }}
  onEachFeature={(feature: any, layer: any) => {

  const rawProvinceName =
    feature.properties?.name ||
    feature.properties?.oldName ||
    "Không rõ";
  const provinceName = rawProvinceName.trim();
  provinceLayers.current[provinceName] = layer;
  const aliasMap: Record<string, string> = {
    "Thừa Thiên Huế": "Huế",
    "Hoàng Sa (Đà Nẵng)": "Đà Nẵng",
    "Trường Sa (Khánh Hòa)": "Khánh Hòa",
  };

  const lookupName =
    aliasMap[provinceName] || provinceName;

  const info =
    (provinceInfo as any)[lookupName];

layer.bindPopup(
`
<div style="
  width:100%;
  max-width:100%;
  box-sizing:border-box;
  font-size:12px;
  background:linear-gradient(135deg,#0b1220,#102a5c);
  color:white;
  border-radius:20px;
  font-family:Inter,sans-serif;
  box-shadow:0 20px 40px rgba(0,0,0,.4);
">

  <div style="
    background:linear-gradient(90deg,#0f172a,#1d4ed8);
    padding:12px;
    border-bottom:1px solid rgba(255,255,255,.15);
  ">

    <h2 style="
      margin:0;
      font-size:16px;
      font-weight:700;
    ">
      🗺 ${info?.ten || provinceName}
    </h2>

    <div style="
      margin-top:6px;
      opacity:.85;
      font-size:13px;
    ">
      ${info?.vungMien || ""}
    </div>

  </div>

  <div style="padding:12px">

    <div style="
      display:grid;
      grid-template-columns:1fr 95px;
      gap:14px;
      align-items:start;
    ">

      <div>

        <div style="margin-bottom:10px">
          <b>🏛 Trung tâm:</b><br>
          ${info?.trungTam || "Chưa có dữ liệu"}
        </div>

        <div style="margin-bottom:10px">
          <b>🔄 Sáp nhập từ:</b><br>
          ${info?.sapNhapTu || "Chưa có dữ liệu"}
        </div>

        <div>
          <b>📍 Vị trí:</b><br>
          ${info?.viTriDiaLy || "Chưa có dữ liệu"}
        </div>

      </div>

      <!-- LOGO TỈNH -->
<!-- LOGO TỈNH -->
<div style="
  width:85px;
  height:85px;
  border-radius:18px;
  overflow:hidden;
  position:relative;
  border:1px solid rgba(59,130,246,.45);
  background:radial-gradient(circle, rgba(59,130,246,.18), rgba(59,130,246,.03));
  box-shadow:0 0 25px rgba(59,130,246,.25);
">

  <img
    src="/logos/${provinceName}.png"
    alt="${provinceName}"
    onerror="this.style.display='none'"
    style="
      width:100%;
      height:100%;
      object-fit:cover;
      border-radius:18px;
      display:block;
    "
  />

</div>

    </div>

    <div style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
      margin-top:16px;
    ">

      <div style="
        background:rgba(255,255,255,.08);
        padding:12px;
        border-radius:12px;
      ">
        <div style="
          font-size:11px;
          opacity:.7;
        ">
          DIỆN TÍCH
        </div>

        <div style="
          margin-top:4px;
          font-weight:700;
        ">
          ${info?.dienTich || ""}
        </div>
      </div>

      <div style="
        background:rgba(255,255,255,.08);
        padding:12px;
        border-radius:12px;
      ">
        <div style="
          font-size:11px;
          opacity:.7;
        ">
          DÂN SỐ
        </div>

        <div style="
          margin-top:4px;
          font-weight:700;
        ">
          ${info?.danSo || ""}
        </div>
      </div>

    </div>

    <div 
    class="custom-scroll"
    style="
margin-top:12px;
padding-top:10px;
border-top:1px solid rgba(255,255,255,.15);
max-height:110px;
overflow-y:auto;
padding-right:4px;
">

      <div style="
        font-weight:700;
        margin-bottom:10px;
      ">
        🌟 Địa danh nổi bật
      </div>

      ${
        (info?.diaDanhNoiTieng || [])
          .map((item: any) => {

            if (typeof item === "string") {
              return `
                <div style="
                  background:rgba(255,255,255,.08);
                  padding:8px 10px;
                  border-radius:10px;
                  margin-bottom:8px;
                ">
                  📍 ${item}
                </div>
              `;
            }

            return `
              <a
                href="${item.link}"
                target="_blank"
                style="
                  display:block;
                  background:rgba(255,255,255,.08);
                  padding:8px 10px;
                  border-radius:10px;
                  margin-bottom:8px;
                  color:white;
                  text-decoration:none;
                "
              >
                📍 ${item.ten}
              </a>
            `;
          })
          .join("")
          
      }
    </div>

  </div>
      
</div>
`,
{
  
  maxWidth: 260,
  minWidth: 180,
  autoPan: true,
}
);
  layer.on({
    mouseover: (e: any) => {
      e.target.setStyle({
        weight: 2,
        color: "#111827",
        fillOpacity: 1,
      });

      e.target.bringToFront();
    },

    mouseout: (e: any) => {
      e.target.setStyle({
        weight: 0.5,
        color: "#f8fafc",
        fillOpacity: 0.92,
      });
    },

click: (e: any) => {
  console.log("CLICK", provinceName);

  e.target.openPopup();
}
  });
}}
/>

{ geo34 && (
  <GeoJSON
    data={geo34}
    interactive={false}
    style={{
      fillOpacity: 0,
      color: "#000000",
      weight: 1,
      opacity: 1,
      dashArray: "",
    }}
  />
)}


      <ProvinceLabels geoData={geo34} />
    </>
  )}
</MapContainer>

);
}
