import { useState, useEffect } from "react";

const SUPABASE_URL = "https://fnbmtwplgkvwwoznhtek.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuYm10d3BsZ2t2d3dvem5odGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTcxNTAsImV4cCI6MjA5MjU3MzE1MH0.VQZfFLfFLVFlR7rk4D6Z9ST-MNt8UPLj4Ve3cs-7UB8";

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.method === "POST" ? "return=representation" : "return=representation",
      ...options.headers,
    },
    ...options,
  });
  if (res.status === 204) return [];
  const text = await res.text();
  if (!text) return [];
  try { return JSON.parse(text); } catch { return []; }
}

const ADMIN_PASSWORD = "mudao2024";
const BG_IMG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAQQAeADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzmb/XSf7x/nTaWX/Wv/vH+dJQAtFFFAC0UUUAFFFFABRRRQAUUUUAFFFLQAlFLSUAFFLRQAlLRRQAUUUUAFFFFAC0UUUAJS0lFAC0UUUAFFFFABRRRQAUlLRQAUUUUAFFFFABSUUUAFFLRQAUlFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFJRQAUo60lL3oAbJ/rG/3j/OkpX++31NJQAtFFLQAUUUUAFFFFABRRRQAUUtFABSUtFABRRRQAUUUUAFLSUtACUUtFABRRRQAUUUUAJS0UUAFFFFABRS0UAJRS0UAJRS0UAJRS0UAJRRRQAUUtJQAUUUUAFFFFACUtFFABSUtFACUUtFACUUtJQAUUUUAFFFFACUveiigBrfeP1ooPU/WigBaKKKACiiigAopaKAEpaKKACiiigAopaSgBaKKKAEopaKACiiigAoopaAEopaKAEopaKAEpaKKAEopaKACiiigAooooAKKKKACiiigAooooAKSlooASilooASiiigAooooAKKKKACiiigBKKWkoAKKKKACiiigAooooAaepooPWloAKKKKACilooAKMUUtACUUtFABRRRQAUUtFACUUtFACUUUUAFFLRQAUUUUALRRRQAlLRRQAlLRRQAlFLRQAUUUUAFJS0UAFFFFABRRRQAUUUUAJRS0UAJRS0lABRS0lABRRRQAUlLRQAlFLRQAlFFFABSUtFACUUtFACUUUUAJ3ooooAKWkpaACiiloASlopaAEopaKACiiigAopaKAEoopaAEoopaAEpaKKACiiigAooooAKKKWgBKKKWgApKWigBKWiigAooooASloooAKKKKAEopaKAEopaKAEoopaAEopaSgApKWigBKKKKACilpKACkpaKAEooooAKKKKACiiigBtFFLQAUUUUAFLRRQAtFApaAEopaKAEopaKACiiigAooooASloooAKWkpaACiiigAooooAKKKKACilooAKKKKACiiigBKKWigBKWiigApKWigBKKKKACilooASilooASiiigBKKWigBKSlooAKKKKAEopaKAEopaSgBKKWigBKKKKAG0tJS0AFLRRQAUUUtACiigUtACUUtFACUtFFABRS0lABRS0UANpaKWgBMUUtFABRRRQAUUUUAFFLSUAFLRRQAlFLRQAUUUtACUUtJQAUUUtACUlLRQAlFLRQAlFLRQAlFLRQAlFFFABRRRQAlFLSUAFFFFACUUtJQAUlLRQAlFFLQAlFFFADaKKKAFoopaACiiigBwooFLQAlLRS0AJRS0YoASiloxQAmKWlooAbRRRQAUUUtACUUtFACUtFFABRRS0AFJS0UAFFLRQAlFLRQAUlLRQAlFFLQAlFLRQA2loxRQAmKWiigAooxRQAlFLRQAlJTqSgBKKKKACkp1JQAlFFFABSUtFACUUtJQAUlLSUAJRRS0AJS0UUALRRS0AKOlLSClxQAUtFFABRRS0AFFFFABSU7FJ2oAZRS0UAJS0UtACUUtFABRS0UAJRS0UAJRS0UAFFLRQAlApaKACiiigAxRRRQAlFLRQAlFLRQAlFLRQAlGKWigBKKWkoASilooAbRS4ooASig0UAJRS0lACUUtFACUUUUAJSU6igBlLRRigApaKWgAooooAcvSloXpS0AFFLRQAlFLRQAlLRRQAUHpS0HpQBHRRRQAUtFFAC0UUUAFFFLQAlFLRQAYooooAKKWigAooooAKMUUUAFFLRQAlGKWigBMUUUtACUlLRQAlFLSUAFFLRQAlJTqSgBKKWigBuKKWigBpopaKAEpKWigBKKKKAEopaSgBtLSUtABS0UUAFFLRQA5OlOpE6U6gBKMU6igBKSloxQAUUCloAKQ9KWlI4oAhpaKKAClpKWgAopaKACilooASlooxQAUUuKKAEFLRRQAUUUUAFFLRQAlLiiloAbRS0UAJRS0lABRRRQAUlLS0ANopaKAEopaSgBKKWkoAKSlooASkpaKAEpKWkNACUUtFACUlOpMUANoopaAClpKWgAooooAkT7tOpI/u06gBKKWjFACYoxTsUYoAbilpaMUAIBSkcGlxQehoAhooooAWkpaKACigUtABRRS0AFFFLQAlLRRQAYpKWigAFFFLQAlFLRQAlLRRQAUlLRQAlFLRQAlFLRigBKWkpaAEpKdijFADaMUuKSgBMUUtFADaKXFFADTRilooASkpaKAEooooASkpaKAG0UUtABS0UUAFJS0UASx/dp1JF9z8adigBKUClxS4oATFJinYoxQA2lopRQAUh6GlxQehoAr0tFFABRQKWgApcUUUAFLRRQAUUtFACUtFLigBKSlNFABRS4ooAKKKUUANxTgKKWgBKSlooASiigUAFGKXFJQAlLRRQAlLRRQAhpKdSYoASkpxFJigBKKWigBtFL3pKAEpKWigBKSnUlACUlLRQA2iiloAKWkooAWkoooAsQKSnHrUmw023/1f41NQBFtOaXGKd70HpQAyinYpO9ACEUlPxTcUALihh8p+lLQ33T9KAKtFFLQAUUUtABRRS0AFLSCloAKWkpaAExSiilFACUUtFABiiiigAopcUUAFFFFABRRRQAlFLRQAlFFFACUtFLikAmKKKKAEopaKYCUlLRQA2ilxSUAJRS0lACUUtJQAlFFFACUhpaSgBtLRRQAUtFFACUUtJQBbtxmMfWpcVFbf6v8AE1N9aAEA59qRhxTuhobp+NADMUgFOxR3oATHFJin02gAxQ33T9KUdaG+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hoAsGOT+4ab5b/3T+VWy1MLGkBW2P/dP5U3Y3901ZLdqaW5oArlG/umk2t/dNTk00mmBCUb0NNKt6GpyaaTQBFtPoaTB9DUuaTNAFWQHeeKbg1JL/rDTKAExSYp1FACYpMUtLQAgHzCndTSU9V4znAoAAAPfFDHrzye1K3y/WmdqAEo9qWigBO+KDzRSd6AFopKWgApaSigBaKKKAFopKKAHUU2loAWikooAWjNJRQA6kpKWgApabS0ALmlzTaKAHZozSUlADqM02lzQA7NGabRQAuaCaSkoAUmkzSUlAC0UlFAC0maKSgBc1NaH/SB9DUFT2n/HwPoaAL+7imlqDTTSATNJuHrSGkoAUsKaWpDj0pOKAFzSZpKKYBmjNITSUARS/fNMp0n3zTKAFpKKKACiiigBV5YVYO1BjPNV1+8PrTySxJzQAmeTmk6fjQeDRQAUhpe1GDmgBD60lKaQ+1AC0UlFAC0UlLQAUtJS0AFFFFABS0lFAC0UUlAC0UlFAC0UlFAC0UlLQAUtJRQAtFJRQAtFJRQAtFJRmgBaSkzRmgAopKKACiiigAoopKAFqa0P78fQ1BUtr/rx9DQBfJphNBNNJpAGaTNBptMAJpKWkoASkopKACjNFJmgCKT79Np0n3qbQAUUlFAC0UlFADl+8PrTs0xfvCpGxxtoATqMUlKPeg46CgBKM+9FIelABSGl780hoAKKSloAKWkooAWikpaACiiigBaKSigBaKKSgBaSiigApaSigBaKSloAKKKKACikzRQAtGaTNGaAFpKKSgBaKSigAoopKAFopKKAFpKKKACpbf8A1w+hqGpbc/vR+NAFwmkoyMUhIoAKSgn3puaAFppNBNJmgApKM0maACikzSZoAY/3qbSv96m0ALRSUtABRRRQAq8sPrUlRL94fWpfegBp9KD60uKQ8jFABu9OKO9GMUe2KAENJS45pKAEopKWgAooooAWikooAWikpaACiiigAopKKAFoopKAFpKKKACiiigAooooAKKKKACiiigAopKKACiiigAooooAKKKKACikooAKkg/1oqOpIP8AWigCzmkJpTTTQAZpKKSgANJSmmmgANFJRQAUUlFADG60lK33qSgAooooAKKKKAFX7wqTBwajX7w+tTc9qAGjg0pGKCOeKOh5oAQiijkGigBtJTjzSECgD//Z";

const STAGES = ["提案中", "已簽約", "施工中", "完工"];
const STAGE_COLORS = { "提案中": "#f0a850", "已簽約": "#5b8af0", "施工中": "#50c878", "完工": "#a0a0a0" };
const STAGE_BG = { "提案中": "#f0a85018", "已簽約": "#5b8af018", "施工中": "#50c87818", "完工": "#a0a0a018" };

const WORK_ITEMS = [
  "保護、拆除工程","水電工程","水電工程（燈具）","衛浴設備",
  "廚具工程","磁磚工程","木作工程","櫃體工程",
  "地板工程","金屬、玻璃、鋁窗工程","油漆工程","家飾工程","細清","工程管理費",
];
const DEFAULT_QUOTE = () => WORK_ITEMS.reduce((a, k) => ({ ...a, [k]: { price: "", cost: "" } }), {});
const DEFAULT_BILLING = () => WORK_ITEMS.reduce((a, k) => ({ ...a, [k]: "" }), {});
const DEFAULT_DEFECTS = ["木作修補","油漆補色","磁磚填縫","五金調整","衛浴漏水確認","燈具更換","地板修補","門片調整"];

const EMPTY_PROJECT = {
  id: null, name: "", address: "", client: "", designNeeds: "",
  consultDate: "", budget: "", designer: "", assistant: "", notes: "",
  stage: "提案中", startDate: "", endDate: "", progress: 0,
  contractor: "", materials: "", inspection: "未驗收", siteNotes: "",
  quote: DEFAULT_QUOTE(),
  defects: DEFAULT_DEFECTS.map((d, i) => ({ id: i + 1, text: d, done: false })),
  billing: DEFAULT_BILLING(), payments: [], closedDate: "",
};

const SAMPLE = [
  {
    id: 1, name: "信義區豪宅室內設計", address: "台北市信義區松仁路100號",
    client: "王大明", designNeeds: "現代風格，開放式廚房，主臥更衣室",
    consultDate: "2026-04-10", budget: "350萬", designer: "李設計師", assistant: "陳助理",
    notes: "客戶偏好深色系", stage: "提案中",
    startDate: "", endDate: "", progress: 0, contractor: "", materials: "",
    inspection: "未驗收", siteNotes: "", quote: DEFAULT_QUOTE(),
    defects: DEFAULT_DEFECTS.map((d, i) => ({ id: i + 1, text: d, done: false })),
    billing: DEFAULT_BILLING(), payments: [], closedDate: "",
  },
  {
    id: 2, name: "中山區餐廳設計", address: "台北市中山區中山北路一段50號",
    client: "陳老闆", designNeeds: "日式風格，座位60席，開放式廚房",
    consultDate: "2026-02-15", budget: "220萬", designer: "李設計師", assistant: "陳助理",
    notes: "5月底完工", stage: "施工中",
    startDate: "2026-03-01", endDate: "2026-05-31", progress: 60,
    contractor: "優質工程行 0912-345-678", materials: "日本進口木材、石英磚",
    inspection: "部分驗收", siteNotes: "二樓廁所磁磚需重貼",
    quote: { ...DEFAULT_QUOTE(), "木作工程": { price: "450000", cost: "320000" }, "磁磚工程": { price: "280000", cost: "190000" }, "油漆工程": { price: "120000", cost: "80000" }, "工程管理費": { price: "85000", cost: "0" } },
    defects: DEFAULT_DEFECTS.map((d, i) => ({ id: i + 1, text: d, done: i < 3 })),
    billing: { ...DEFAULT_BILLING(), "木作工程": "300000", "磁磚工程": "190000", "油漆工程": "80000" },
    payments: [], closedDate: "",
  },
];

const EMPTY_MEMO = { id: null, title: "", content: "", date: "", color: "#1e1e24" };
const MEMO_COLORS = ["#1e1e24","#1a2535","#1a2520","#2a1a1a","#251a2a"];
const SAMPLE_MEMOS = [
  { id: 1, title: "供應商聯絡清單", content: "木材：永豐木業 02-2345-6789\n磁磚：美觀建材 02-3456-7890", date: "2026-04-20", color: "#1a2535" },
];

const MATERIAL_CATS = ["全部", "磁磚", "木作", "金屬", "石材", "玻璃", "塗料", "衛浴", "燈具", "家飾", "其他"];
const MATERIAL_CAT_COLORS = { "磁磚": "#f0a850", "木作": "#a07850", "金屬": "#8090b0", "石材": "#909090", "玻璃": "#70b0c0", "塗料": "#c084f5", "衛浴": "#5b8af0", "燈具": "#f0d050", "家飾": "#e07080", "其他": "#666" };

const EMPTY_MATERIAL = { id: null, name: "", brand: "", model: "", category: "磁磚", supplier: "", phone: "", price: "", unit: "", notes: "", color: "" };

const SAMPLE_MATERIALS = [
  { id: 1, name: "義大利木紋磚", brand: "Florim", model: "Nest Silver 60x120", category: "磁磚", supplier: "美觀建材", phone: "02-3456-7890", price: "2800", unit: "才", notes: "防滑係數R10，適合浴室", color: "#c8b89a" },
  { id: 2, name: "橡木實木皮", brand: "永豐木業", model: "OAK-NAT-3mm", category: "木作", supplier: "永豐木業", phone: "02-2345-6789", price: "1200", unit: "才", notes: "自然紋路，需訂製", color: "#a07850" },
  { id: 3, name: "黑鐵件收邊條", brand: "鐵藝工坊", model: "BK-T15", category: "金屬", supplier: "鐵藝工坊", phone: "02-5678-9012", price: "350", unit: "米", notes: "烤漆霧黑", color: "#555" },
];

const num = (v) => parseFloat(v) || 0;
const fmtMoney = (n) => (!n && n !== 0) ? "—" : Math.round(n).toLocaleString();

function calcProfit(p) {
  const totalPrice = Object.values(p.quote || {}).reduce((s, v) => s + num(v.price), 0);
  const totalCost = Object.values(p.quote || {}).reduce((s, v) => s + num(v.cost), 0);
  const totalBilling = Object.values(p.billing || {}).reduce((s, v) => s + num(v), 0);
  const profit = totalPrice - totalBilling;
  const finalProfit = profit - totalCost;
  const totalPayments = (p.payments || []).reduce((s, v) => s + num(v.amount), 0);
  const collectRate = totalPrice > 0 ? totalPayments / totalPrice : 0;
  const profitPct = totalPrice > 0 ? (finalProfit / totalPrice) * 100 : 0;
  return { totalPrice, totalCost, totalBilling, profit, finalProfit, totalPayments, collectRate, profitPct };
}

function batteryColor(pct) {
  if (pct >= 100) return "#50c878";
  if (pct >= 60) return "#5b8af0";
  if (pct >= 30) return "#f0a850";
  return "#e05b5b";
}

// ── Shared styles ──
const dateStyle = {
  width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "10px 12px", color: "#e8e4dc", fontSize: 14, outline: "none",
};

// ── Sub-components ──
function StageTag({ stage }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: STAGE_COLORS[stage], background: STAGE_BG[stage], border: `1px solid ${STAGE_COLORS[stage]}44`, borderRadius: 6, padding: "2px 9px" }}>
      {stage}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: "#555", marginBottom: 5, letterSpacing: 1 }}>{label}</div>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, multiline }) {
  const s = { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px", color: "#e8e4dc", fontSize: 14, outline: "none", fontFamily: "'Noto Sans TC',sans-serif", resize: multiline ? "vertical" : "none" };
  return multiline
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3} style={s} />
    : <input value={value} onChange={onChange} placeholder={placeholder} style={s} />;
}

function DetailRow({ label, value, highlight }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: 10, display: "flex", gap: 10 }}>
      <span style={{ fontSize: 11, color: "#555", minWidth: 64, paddingTop: 1, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: highlight ? "#50c878" : "#ccc", flex: 1, lineHeight: 1.6 }}>{value}</span>
    </div>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, overflowY: "auto", background: "rgba(8,7,6,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
      <div style={{ minHeight: "100vh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", paddingBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", padding: "52px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 0, background: "rgba(8,7,6,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", zIndex: 10 }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "8px 14px", color: "#aaa", fontSize: 14, cursor: "pointer", marginRight: 12 }}>← 返回</button>
          {title && <div style={{ fontSize: 15, fontWeight: 600, color: "#f0ead8" }}>{title}</div>}
        </div>
        <div style={{ padding: "20px 20px 0" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
function ProjectCard({ p, onClick }) {
  const { totalPrice, collectRate, profitPct } = calcProfit(p);
  const pct = p.stage === "完工" ? Math.round(collectRate * 100) : p.progress;
  const bColor = batteryColor(pct);
  return (
    <div onClick={onClick} className="glass-card" style={{ borderLeft: `3px solid ${STAGE_COLORS[p.stage]}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ flex: 1, paddingRight: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#f0ead8", marginBottom: 2 }}>{p.name}</div>
          <div style={{ fontSize: 12, color: "#555" }}>{p.client} · {p.address}</div>
        </div>
        <StageTag stage={p.stage} />
      </div>
      {(p.stage === "施工中" || p.stage === "完工") && (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: "#444" }}>{p.stage === "完工" ? "收款進度" : "施工進度"}</span>
            <span style={{ fontSize: 11, color: bColor, fontWeight: 600 }}>{pct}%{pct >= 100 && p.stage === "完工" ? " 結案 ✓" : ""}</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: bColor, borderRadius: 3, transition: "width 0.4s" }} />
          </div>
          {p.stage === "完工" && totalPrice > 0 && (
            <div style={{ marginTop: 5, fontSize: 11, color: profitPct < 20 ? "#50c878" : profitPct < 25 ? "#888" : "#f0a850" }}>
              利潤率 {profitPct.toFixed(1)}% {profitPct < 20 ? "⚠️ 危險" : profitPct >= 25 ? "🔥 暴利" : ""}
            </div>
          )}
        </div>
      )}
      <div style={{ fontSize: 11, color: "#2a2a2e", marginTop: 6 }}>諮詢：{p.consultDate} · 預算：{p.budget}</div>
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [projects, setProjects] = useState(() => {
    try { const s = localStorage.getItem("mudao_projects"); return s ? JSON.parse(s) : SAMPLE; } catch { return SAMPLE; }
  });
  const [memos, setMemos] = useState(() => {
    try { const s = localStorage.getItem("mudao_memos"); return s ? JSON.parse(s) : SAMPLE_MEMOS; } catch { return SAMPLE_MEMOS; }
  });
  const [materials, setMaterials] = useState(() => {
    try { const s = localStorage.getItem("mudao_materials"); return s ? JSON.parse(s) : SAMPLE_MATERIALS; } catch { return SAMPLE_MATERIALS; }
  });
  const [matModal, setMatModal] = useState(null);

  // 自動儲存到 LocalStorage
  useEffect(() => { try { localStorage.setItem("mudao_projects", JSON.stringify(projects)); } catch {} }, [projects]);
  useEffect(() => { try { localStorage.setItem("mudao_memos", JSON.stringify(memos)); } catch {} }, [memos]);
  useEffect(() => { try { localStorage.setItem("mudao_materials", JSON.stringify(materials)); } catch {} }, [materials]);
  useEffect(() => { try { localStorage.setItem("mudao_username", userName); } catch {} }, [userName]);

  // 公告相關 state（必須在 useEffect 前面）
  const [announcements, setAnnouncements] = useState([]);
  const [annLoading, setAnnLoading] = useState(true);
  const [annModal, setAnnModal] = useState(null);
  const [annForm, setAnnForm] = useState({ title: "", content: "", date: new Date().toISOString().split("T")[0], pinned: false });
  const [isAdmin, setIsAdmin] = useState(() => { try { return localStorage.getItem("mudao_admin") === "1"; } catch { return false; } });
  const [adminInput, setAdminInput] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // 載入公告
  useEffect(() => {
    async function loadAnn() {
      try {
        const data = await sbFetch("announcements?select=*&order=pinned.desc,created_at.desc");
        setAnnouncements(data);
      } catch (e) { console.error(e); }
      setAnnLoading(false);
    }
    loadAnn();
  }, []);

  // 公告操作
  async function saveAnnouncement() {
    if (!annForm.title.trim()) return;
    try {
      if (annForm.id) {
        const updated = await sbFetch(`announcements?id=eq.${annForm.id}`, { method: "PATCH", body: JSON.stringify({ title: annForm.title, content: annForm.content, date: annForm.date, pinned: annForm.pinned }) });
        setAnnouncements(announcements.map(a => a.id === annForm.id ? updated[0] : a));
      } else {
        const created = await sbFetch("announcements", { method: "POST", body: JSON.stringify({ title: annForm.title, content: annForm.content, date: annForm.date, pinned: annForm.pinned }) });
        setAnnouncements([...(annForm.pinned ? [created[0]] : []), ...announcements.filter(a => !annForm.pinned || !a.pinned), ...(annForm.pinned ? [] : [created[0]])]);
        const refreshed = await sbFetch("announcements?select=*&order=pinned.desc,created_at.desc");
        setAnnouncements(refreshed);
      }
    } catch (e) { console.error(e); }
    setAnnModal(null);
  }

  async function deleteAnnouncement(id) {
    try {
      await sbFetch(`announcements?id=eq.${id}`, { method: "DELETE" });
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (e) { console.error(e); }
    setAnnModal(null);
  }

  function loginAdmin() {
    if (adminInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try { localStorage.setItem("mudao_admin", "1"); } catch {}
      setShowAdminLogin(false);
      setAdminInput("");
    } else {
      alert("密碼錯誤");
    }
  }
  const [tab, setTab] = useState("home");
  const [search, setSearch] = useState("");

  // modal state
  const [modal, setModal] = useState(null); // null | "detail" | "new" | "edit" | "memo_new" | "memo_edit"
  const [activeProject, setActiveProject] = useState(null);
  const [activeMemo, setActiveMemo] = useState(null);

  // detail section
  const [detailSection, setDetailSection] = useState("info");

  // form state
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [formTab, setFormTab] = useState("basic");

  // memo form
  const [memoForm, setMemoForm] = useState(EMPTY_MEMO);

  // payment form (inside detail)
  const [payAmt, setPayAmt] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().split("T")[0]);
  const [payNote, setPayNote] = useState("");

  // ── helpers ──
  const stageProjects = (stage) => projects.filter(p =>
    p.stage === stage && (search === "" || p.name.includes(search) || p.client.includes(search) || p.address.includes(search))
  );

  function openDetail(p) {
    setActiveProject(p);
    setDetailSection("info");
    setModal("detail");
  }

  function openNew(stage = "提案中") {
    setForm({ ...EMPTY_PROJECT, id: null, stage, quote: DEFAULT_QUOTE(), billing: DEFAULT_BILLING(), defects: DEFAULT_DEFECTS.map((d, i) => ({ id: i + 1, text: d, done: false })), payments: [] });
    setFormTab("basic");
    setModal("new");
  }

  function openEdit(p) {
    setForm({ ...p, quote: p.quote || DEFAULT_QUOTE(), billing: p.billing || DEFAULT_BILLING(), defects: p.defects || DEFAULT_DEFECTS.map((d, i) => ({ id: i + 1, text: d, done: false })), payments: p.payments || [] });
    setFormTab("basic");
    setModal("edit");
  }

  function saveProject() {
    if (!form.name.trim()) return;
    if (form.id) setProjects(projects.map(p => p.id === form.id ? { ...form } : p));
    else setProjects([{ ...form, id: Date.now() }, ...projects]);
    setModal(null);
  }

  function deleteProject(id) {
    setProjects(projects.filter(p => p.id !== id));
    setModal(null);
  }

  function advanceStage(id) {
    setProjects(projects.map(p => {
      if (p.id !== id) return p;
      const idx = STAGES.indexOf(p.stage);
      if (idx >= STAGES.length - 1) return p;
      const next = STAGES[idx + 1];
      return { ...p, stage: next, closedDate: next === "完工" ? new Date().toISOString().split("T")[0] : p.closedDate };
    }));
    setModal(null);
  }

  function toggleDefect(projectId, defectId) {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, defects: p.defects.map(d => d.id === defectId ? { ...d, done: !d.done } : d) };
    }));
    // update activeProject ref
    setActiveProject(prev => {
      if (!prev || prev.id !== projectId) return prev;
      return { ...prev, defects: prev.defects.map(d => d.id === defectId ? { ...d, done: !d.done } : d) };
    });
  }

  function addPayment() {
    if (!payAmt || !activeProject) return;
    const newPayment = { id: Date.now(), amount: payAmt, date: payDate, note: payNote };
    setProjects(prev => prev.map(p => {
      if (p.id !== activeProject.id) return p;
      const payments = [...(p.payments || []), newPayment];
      const { totalPrice } = calcProfit(p);
      const totalPaid = payments.reduce((s, v) => s + num(v.amount), 0);
      const progress = totalPrice > 0 ? Math.min(100, Math.round((totalPaid / totalPrice) * 100)) : p.progress;
      const closedDate = progress >= 100 ? (p.closedDate || new Date().toISOString().split("T")[0]) : p.closedDate;
      return { ...p, payments, progress, closedDate };
    }));
    setActiveProject(prev => {
      if (!prev) return prev;
      const payments = [...(prev.payments || []), newPayment];
      const { totalPrice } = calcProfit(prev);
      const totalPaid = payments.reduce((s, v) => s + num(v.amount), 0);
      const progress = totalPrice > 0 ? Math.min(100, Math.round((totalPaid / totalPrice) * 100)) : prev.progress;
      const closedDate = progress >= 100 ? (prev.closedDate || new Date().toISOString().split("T")[0]) : prev.closedDate;
      return { ...prev, payments, progress, closedDate };
    });
    setPayAmt(""); setPayNote("");
  }

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));
  const mf = (k) => (e) => setMemoForm(prev => ({ ...prev, [k]: e.target.value }));

  function setQuote(item, field, val) {
    setForm(prev => ({ ...prev, quote: { ...prev.quote, [item]: { ...prev.quote[item], [field]: val } } }));
  }
  function setBilling(item, val) {
    setForm(prev => ({ ...prev, billing: { ...prev.billing, [item]: val } }));
  }

  // material helpers
  function openNewMat() { setMatForm({ ...EMPTY_MATERIAL }); setMatModal("new"); }
  function openEditMat(m) { setMatForm({ ...m }); setMatModal("edit"); }
  function saveMat() {
    if (!matForm.name.trim()) return;
    if (matForm.id) setMaterials(materials.map(m => m.id === matForm.id ? { ...matForm } : m));
    else setMaterials([{ ...matForm, id: Date.now() }, ...materials]);
    setMatModal(null);
  }
  function deleteMat(id) { setMaterials(materials.filter(m => m.id !== id)); setMatModal(null); }
  const maf = (k) => (e) => setMatForm(prev => ({ ...prev, [k]: e.target.value }));

  const filteredMaterials = materials.filter(m =>
    (matCatFilter === "全部" || m.category === matCatFilter) &&
    (matSearch === "" || m.name.includes(matSearch) || m.brand.includes(matSearch) || m.model.includes(matSearch))
  );

  function openNewMemo() { setMemoForm({ ...EMPTY_MEMO }); setModal("memo_new"); }
  function openEditMemo(m) { setMemoForm({ ...m }); setActiveMemo(m); setModal("memo_edit"); }
  function saveMemo() {
    if (!memoForm.title.trim() && !memoForm.content.trim()) return;
    if (memoForm.id) setMemos(memos.map(m => m.id === memoForm.id ? { ...memoForm } : m));
    else setMemos([{ ...memoForm, id: Date.now() }, ...memos]);
    setModal(null);
  }
  function deleteMemo(id) { setMemos(memos.filter(m => m.id !== id)); setModal(null); }

  const allTabs = ["home", "公告", ...STAGES, "建材庫", "備忘錄"];

  // current project for detail (always fresh from state)
  const detailProject = activeProject ? (projects.find(x => x.id === activeProject.id) || activeProject) : null;

  return (
    <div style={{ minHeight: "100vh", background: "rgba(255,255,255,0.04)", color: "#e8e4dc", fontFamily: "'Noto Sans TC',sans-serif", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Fixed background image */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `url(${BG_IMG})`,
        backgroundSize: "cover", backgroundPosition: "center top",
        maxWidth: 480, margin: "0 auto",
      }} />
      {/* Dark overlay for readability */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(10,9,8,0.72) 0%, rgba(10,9,8,0.55) 40%, rgba(10,9,8,0.80) 100%)", maxWidth: 480, margin: "0 auto" }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input,textarea,select { font-family:'Noto Sans TC',sans-serif; }
        ::-webkit-scrollbar { width:3px; } ::-webkit-scrollbar-thumb { background:#ffffff22; }
        .btn { cursor:pointer; transition:opacity 0.15s; } .btn:hover { opacity:0.8; }
        .nav-tab { cursor:pointer; transition:all 0.18s; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }
        .fade-up { animation:fadeUp 0.22s ease; }
        .check-row:active { background:rgba(255,255,255,0.05); }
        .glass-card {
          background: rgba(18, 16, 14, 0.55) !important;
          backdrop-filter: blur(18px) !important;
          -webkit-backdrop-filter: blur(18px) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
        }
        .glass-card:hover {
          background: rgba(28, 24, 20, 0.68) !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.5) !important;
        }
        .glass-nav {
          background: rgba(10,9,8,0.7) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border-bottom: 1px solid rgba(255,255,255,0.07) !important;
        }
        .glass-header {
          background: rgba(10,9,8,0.6) !important;
          backdrop-filter: blur(24px) !important;
          -webkit-backdrop-filter: blur(24px) !important;
          border-bottom: 1px solid rgba(255,255,255,0.07) !important;
        }
        .glass-modal {
          background: rgba(14,12,10,0.88) !important;
          backdrop-filter: blur(28px) !important;
          -webkit-backdrop-filter: blur(28px) !important;
        }
        .glass-input {
          background: rgba(255,255,255,0.06) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #e8e4dc !important;
        }
        .glass-input::placeholder { color: rgba(200,190,175,0.35); }
        .glass-input:focus { border-color: rgba(255,255,255,0.22) !important; outline: none; }
        .glass-stat {
          background: rgba(18,16,14,0.5) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(255,255,255,0.07) !important;
          cursor: pointer;
          transition: all 0.18s;
        }
        .glass-stat:hover { background: rgba(30,26,22,0.65) !important; transform: translateY(-2px); }
      `}</style>

      {/* HEADER */}
      <div className="glass-header" style={{ padding: "48px 20px 16px", position: "relative", zIndex: 10 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#444", textTransform: "uppercase", marginBottom: 4 }}>Interior Design Studio</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#f0ead8", letterSpacing: 1 }}>MU DAO</span>
          <span style={{ fontSize: 13, color: "#5b8af0", fontWeight: 600 }}>DESIGN</span>
          {editingName ? (
            <input
              autoFocus
              value={userName}
              onChange={e => setUserName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={e => { if (e.key === "Enter") setEditingName(false); }}
              placeholder="輸入你的名稱"
              style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8, padding: "3px 10px", color: "#f0ead8",
                fontSize: 13, outline: "none", marginLeft: 8, width: 120,
                fontFamily: "'Noto Sans TC', sans-serif",
              }}
            />
          ) : (
            <span
              onClick={() => setEditingName(true)}
              style={{
                fontSize: 12, color: userName ? "#c8b89a" : "#444",
                marginLeft: 8, cursor: "pointer",
                borderBottom: "1px dashed rgba(200,184,154,0.3)",
                paddingBottom: 1,
              }}
            >{userName || "點此輸入名稱"}</span>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#444", fontSize: 13 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋案件名稱、客戶、地址..."
            style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 12px 10px 34px", color: "#e8e4dc", fontSize: 13, outline: "none" }} />
        </div>
      </div>

      {/* NAV */}
      <div className="glass-nav" style={{ display: "flex", overflowX: "auto", position: "relative", zIndex: 10 }}>
        {allTabs.map(t => {
          const color = t === "home" ? "#e8e4dc" : t === "備忘錄" ? "#c084f5" : t === "建材庫" ? "#50c8c8" : t === "公告" ? "#f0d050" : STAGE_COLORS[t];
          const active = tab === t;
          const iconColor = active ? color : "#3a3a3e";
          const icons = {
            home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
            "公告": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
            "提案中": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>,
            "已簽約": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
            "施工中": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 13V9M12 13V7M18 13V10"/></svg>,
            "完工": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></svg>,
            "建材庫": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>,
            "備忘錄": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
          };
          const labels = { home: "總覽", "公告": "公告", "提案中": "提案", "已簽約": "簽約", "施工中": "施工", "完工": "完工", "建材庫": "建材", "備忘錄": "備忘" };
          const tabColors = { ...Object.fromEntries(STAGES.map(s => [s, STAGE_COLORS[s]])), home: "#e8e4dc", "公告": "#f0d050", "建材庫": "#50c8c8", "備忘錄": "#c084f5" };
          return (
            <button key={t} className="nav-tab" onClick={() => setTab(t)} style={{
              flex: 1, padding: "8px 2px 10px", fontSize: 10, fontWeight: active ? 700 : 400,
              color: active ? color : "#3a3a3e", background: "none", border: "none",
              borderBottom: active ? `2px solid ${color}` : "2px solid transparent",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            }}>
              {icons[t]}
              <span>{labels[t]}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", position: "relative", zIndex: 5 }}>

        {tab === "home" && (
          <div className="fade-up">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {STAGES.map(s => {
                const stageIcons = {
                  "提案中": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={STAGE_COLORS[s]} strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>,
                  "已簽約": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={STAGE_COLORS[s]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
                  "施工中": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={STAGE_COLORS[s]} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 13V9M12 13V7M18 13V10"/></svg>,
                  "完工": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={STAGE_COLORS[s]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></svg>,
                };
                return (
                  <div key={s} onClick={() => setTab(s)} className="glass-stat" style={{ borderRadius: 14, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontSize: 26, fontWeight: 700, color: STAGE_COLORS[s] }}>{stageProjects(s).length}</div>
                      {stageIcons[s]}
                    </div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>{s}</div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${projects.length > 0 ? (stageProjects(s).length / projects.length) * 100 : 0}%`, background: STAGE_COLORS[s], borderRadius: 2, opacity: 0.7 }} />
                    </div>
                  </div>
                );
              })}
              <div onClick={() => setTab("建材庫")} className="glass-stat" style={{ borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: "#50c8c8" }}>{materials.length}</div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#50c8c8" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>建材庫</div>
              </div>
              <div onClick={() => setTab("備忘錄")} className="glass-stat" style={{ borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: "#c084f5" }}>{memos.length}</div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c084f5" strokeWidth="1.8" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>備忘錄</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 10 }}>最近案件</div>
            {projects.slice(0, 4).map(p => <ProjectCard key={p.id} p={p} onClick={() => openDetail(p)} />)}
          </div>
        )}

        {STAGES.includes(tab) && (
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: "#555" }}>{stageProjects(tab).length} 件案件</span>
              {tab !== "完工" && (
                <button className="btn" onClick={() => openNew(tab)} style={{ background: STAGE_COLORS[tab], color: "#0c0c0e", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700 }}>+ 新增案件</button>
              )}
            </div>
            {stageProjects(tab).length === 0 && (
              <div style={{ textAlign: "center", color: "#333", padding: "60px 0", fontSize: 14 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📂</div>目前沒有{tab}的案件
              </div>
            )}
            {stageProjects(tab).map(p => <ProjectCard key={p.id} p={p} onClick={() => openDetail(p)} />)}
          </div>
        )}

        {/* 建材庫 TAB */}
        {/* 公告 TAB */}
        {tab === "公告" && (
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: "#555" }}>{announcements.length} 則公告</span>
              {isAdmin ? (
                <button className="btn" onClick={() => { setAnnForm({ title: "", content: "", date: new Date().toISOString().split("T")[0], pinned: false }); setAnnModal("new"); }}
                  style={{ background: "#f0d050", color: "#0c0c0e", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700 }}>+ 新增公告</button>
              ) : (
                <button className="btn" onClick={() => setShowAdminLogin(true)}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "6px 12px", fontSize: 12, color: "#666" }}>🔑 管理員</button>
              )}
            </div>

            {annLoading && <div style={{ textAlign: "center", color: "#444", padding: "40px 0", fontSize: 13 }}>載入中...</div>}

            {!annLoading && announcements.length === 0 && (
              <div style={{ textAlign: "center", color: "#333", padding: "60px 0", fontSize: 14 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📢</div>目前沒有公告
              </div>
            )}

            {announcements.map(a => (
              <div key={a.id} className="glass-card" style={{
                borderLeft: `3px solid ${a.pinned ? "#f0d050" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 14, padding: "16px", marginBottom: 10,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    {a.pinned && <span style={{ fontSize: 10, color: "#f0d050", marginRight: 6 }}>📌 置頂</span>}
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#f0ead8" }}>{a.title}</div>
                  </div>
                  {isAdmin && (
                    <button className="btn" onClick={() => { setAnnForm({ ...a }); setAnnModal("edit"); }}
                      style={{ background: "none", border: "none", color: "#666", fontSize: 12, cursor: "pointer" }}>編輯</button>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.7, marginBottom: 10, whiteSpace: "pre-wrap" }}>{a.content}</p>
                <div style={{ fontSize: 11, color: "#444" }}>{a.date}</div>
              </div>
            ))}

            {/* 管理員登入 */}
            {showAdminLogin && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={e => e.target === e.currentTarget && setShowAdminLogin(false)}>
                <div style={{ background: "#141416", borderRadius: 16, padding: "24px", width: "80%", maxWidth: 300, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#f0ead8", marginBottom: 16 }}>管理員登入</div>
                  <input type="password" value={adminInput} onChange={e => setAdminInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && loginAdmin()}
                    placeholder="輸入管理員密碼" autoFocus
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px", color: "#e8e4dc", fontSize: 14, outline: "none", marginBottom: 12 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" onClick={() => setShowAdminLogin(false)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, padding: "10px", color: "#666", fontSize: 13 }}>取消</button>
                    <button className="btn" onClick={loginAdmin} style={{ flex: 1, background: "#f0d050", border: "none", borderRadius: 10, padding: "10px", color: "#0c0c0e", fontSize: 13, fontWeight: 700 }}>登入</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "建材庫" && (
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: "#555" }}>{filteredMaterials.length} 項建材</span>
              <button className="btn" onClick={openNewMat} style={{ background: "#50c8c8", color: "#0c0c0e", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700 }}>+ 新增建材</button>
            </div>
            {/* 搜尋 */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#444", fontSize: 13 }}>🔍</span>
              <input value={matSearch} onChange={e => setMatSearch(e.target.value)} placeholder="搜尋品牌、型號..."
                style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "9px 12px 9px 34px", color: "#e8e4dc", fontSize: 13, outline: "none" }} />
            </div>
            {/* 分類篩選 */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
              {MATERIAL_CATS.map(c => (
                <button key={c} onClick={() => setMatCatFilter(c)} style={{
                  background: matCatFilter === c ? (MATERIAL_CAT_COLORS[c] || "#50c8c8") : "rgba(255,255,255,0.06)",
                  color: matCatFilter === c ? "#0c0c0e" : "#666",
                  border: "none", borderRadius: 20, padding: "5px 14px",
                  fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontWeight: matCatFilter === c ? 700 : 400,
                }}>{c}</button>
              ))}
            </div>
            {filteredMaterials.length === 0 && (
              <div style={{ textAlign: "center", color: "#333", padding: "60px 0", fontSize: 14 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🧱</div>還沒有建材，點右上角新增
              </div>
            )}
            {filteredMaterials.map(m => (
              <div key={m.id} onClick={() => openEditMat(m)} className="glass-card"
                style={{ borderLeft: `3px solid ${MATERIAL_CAT_COLORS[m.category] || "#50c8c8"}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#f0ead8", marginBottom: 2 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{m.brand} · {m.model}</div>
                  </div>
                  <span style={{ fontSize: 11, color: MATERIAL_CAT_COLORS[m.category] || "#50c8c8", background: `${MATERIAL_CAT_COLORS[m.category] || "#50c8c8"}18`, border: `1px solid ${MATERIAL_CAT_COLORS[m.category] || "#50c8c8"}33`, borderRadius: 6, padding: "2px 9px", flexShrink: 0 }}>{m.category}</span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                  {m.price && <span style={{ color: "#50c878" }}>$ {m.price} / {m.unit}</span>}
                  {m.supplier && <span style={{ color: "#666" }}>📦 {m.supplier}</span>}
                </div>
                {m.notes && <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>{m.notes}</div>}
              </div>
            ))}
          </div>
        )}

        {tab === "備忘錄" && (
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: "#555" }}>{memos.length} 則備忘錄</span>
              <button className="btn" onClick={openNewMemo} style={{ background: "#c084f5", color: "#0c0c0e", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700 }}>+ 新增備忘錄</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {memos.map(m => (
                <div key={m.id} onClick={() => openEditMemo(m)} style={{ background: `${m.color}cc`, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "14px", minHeight: 110, cursor: "pointer", transition: "transform 0.15s" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#f0ead8", marginBottom: 6 }}>{m.title || "無標題"}</div>
                  <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{m.content}</div>
                  {m.date && <div style={{ fontSize: 10, color: "#555", marginTop: 8 }}>{m.date}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      {modal === "detail" && detailProject && (() => {
        const p = detailProject;
        const nextStage = STAGES[STAGES.indexOf(p.stage) + 1];
        const { totalPrice, totalBilling, profit, finalProfit, totalPayments, collectRate, profitPct } = calcProfit(p);
        const doneDefects = (p.defects || []).filter(d => d.done).length;
        const totalDefects = (p.defects || []).length;
        const profitColor = profitPct < 20 ? "#50c878" : profitPct < 25 ? "#e8e4dc" : "#f0a850";
        const profitWeight = profitPct >= 25 ? 700 : 400;
        const profitLabel = profitPct < 20 ? "⚠️ 危險" : profitPct < 25 ? "正常" : "🔥 暴利";
        const progressPct = p.stage === "完工" ? Math.round(collectRate * 100) : p.progress;
        const bColor = batteryColor(progressPct);

        const sectionTabs = ["info", "報價單",
          ...(p.stage === "施工中" || p.stage === "完工" ? ["驗收缺失"] : []),
          ...(p.stage === "完工" ? ["收款"] : [])
        ];

        return (
          <Modal onClose={() => setModal(null)}>
            {/* 案件標題區 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <StageTag stage={p.stage} />
                <div style={{ display: "flex", gap: 8 }}>
                  {p.stage !== "完工" && (
                    <button className="btn" onClick={() => openEdit(p)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "6px 14px", color: "#ccc", fontSize: 13 }}>✏️ 編輯</button>
                  )}
                  <button className="btn" onClick={() => deleteProject(p.id)} style={{ background: "rgba(224,91,91,0.12)", border: "1px solid rgba(224,91,91,0.3)", borderRadius: 8, padding: "6px 14px", color: "#e05b5b", fontSize: 13 }}>刪除</button>
                </div>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0ead8", lineHeight: 1.3, marginBottom: 4 }}>{p.name}</h2>
              <div style={{ fontSize: 13, color: "#666" }}>{p.client} · {p.address}</div>

              {/* 轉移按鈕放在標題下方，明顯位置 */}
              {nextStage && (
                <button className="btn" onClick={() => advanceStage(p.id)} style={{
                  width: "100%", marginTop: 14,
                  background: `linear-gradient(135deg, ${STAGE_COLORS[nextStage]}22, ${STAGE_COLORS[nextStage]}11)`,
                  border: `1px solid ${STAGE_COLORS[nextStage]}55`,
                  borderRadius: 12, padding: "13px",
                  color: STAGE_COLORS[nextStage], fontSize: 15, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <span>轉移至「{nextStage}」</span>
                  <span style={{ fontSize: 18 }}>→</span>
                </button>
              )}
            </div>

            {/* Section tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 16 }}>
              {sectionTabs.map(s => (
                <button key={s} onClick={() => setDetailSection(s)} style={{
                  background: detailSection === s ? "#5b8af0" : "rgba(255,255,255,0.07)",
                  color: detailSection === s ? "#fff" : "#666",
                  border: "none", borderRadius: 8, padding: "7px 14px",
                  fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                  fontWeight: detailSection === s ? 600 : 400,
                }}>{s === "info" ? "📋 基本資料" : s === "報價單" ? "💰 報價單" : s === "驗收缺失" ? "✅ 驗收缺失" : "💵 收款"}</button>
              ))}
            </div>

            {/* INFO */}
            {detailSection === "info" && (
              <div>
                <DetailRow label="設計需求" value={p.designNeeds} />
                <DetailRow label="諮詢日期" value={p.consultDate} />
                <DetailRow label="預算" value={p.budget} />
                <DetailRow label="設計師" value={p.designer} />
                <DetailRow label="配合助理" value={p.assistant} />
                {p.notes && <DetailRow label="備註" value={p.notes} />}
                {(p.stage === "施工中" || p.stage === "完工") && (
                  <>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "12px 0" }} />
                    <DetailRow label="施工開始" value={p.startDate} />
                    <DetailRow label="預計完工" value={p.endDate} />
                    {p.closedDate && <DetailRow label="結案日期" value={p.closedDate} highlight />}
                    <DetailRow label="工班" value={p.contractor} />
                    <DetailRow label="材料" value={p.materials} />
                    <DetailRow label="驗收" value={p.inspection} />
                    {p.siteNotes && <DetailRow label="現場備註" value={p.siteNotes} />}
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: "#555" }}>{p.stage === "完工" ? "收款進度" : "施工進度"}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: bColor }}>{progressPct}%{progressPct >= 100 && p.stage === "完工" ? " ✓ 結案" : ""}</span>
                      </div>
                      <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 5, overflow: "hidden", border: "1px solid #2a2a2e" }}>
                        <div style={{ height: "100%", width: `${progressPct}%`, background: bColor, borderRadius: 5, transition: "width 0.4s" }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 報價單 */}
            {detailSection === "報價單" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: 4, marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "#555" }}>項目</div>
                  <div style={{ fontSize: 10, color: "#555", textAlign: "right" }}>報價</div>
                  <div style={{ fontSize: 10, color: "#555", textAlign: "right" }}>成本</div>
                </div>
                {WORK_ITEMS.map(item => {
                  const q = (p.quote || {})[item] || { price: "", cost: "" };
                  if (!q.price && !q.cost) return null;
                  return (
                    <div key={item} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: 4, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ fontSize: 12, color: "#ccc" }}>{item}</div>
                      <div style={{ fontSize: 12, color: "#50c878", textAlign: "right" }}>{q.price ? fmtMoney(num(q.price)) : "—"}</div>
                      <div style={{ fontSize: 12, color: "#f0a850", textAlign: "right" }}>{q.cost ? fmtMoney(num(q.cost)) : "—"}</div>
                    </div>
                  );
                })}
                <div style={{ marginTop: 12, padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#555" }}>報價總計</span>
                    <span style={{ fontSize: 13, color: "#50c878", fontWeight: 600 }}>$ {fmtMoney(totalPrice)}</span>
                  </div>
                  {p.stage === "完工" && (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#555" }}>工班請款</span>
                        <span style={{ fontSize: 13, color: "#e05b5b" }}>－ $ {fmtMoney(totalBilling)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#555" }}>報價 - 請款</span>
                        <span style={{ fontSize: 13, color: "#f0ead8" }}>$ {fmtMoney(profit)}</span>
                      </div>
                      <div style={{ height: 1, background: "#222", margin: "8px 0" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#555" }}>最終獲利</span>
                        <span style={{ fontSize: 14, color: profitColor, fontWeight: profitWeight }}>$ {fmtMoney(finalProfit)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "#555" }}>利潤率</span>
                        <span style={{ fontSize: 14, color: profitColor, fontWeight: profitWeight }}>{profitPct.toFixed(1)}% {profitLabel}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 驗收缺失 */}
            {detailSection === "驗收缺失" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: "#555" }}>已處理 {doneDefects} / {totalDefects}</span>
                  <div style={{ height: 6, width: 100, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${totalDefects > 0 ? (doneDefects / totalDefects) * 100 : 0}%`, background: "#50c878", borderRadius: 3 }} />
                  </div>
                </div>
                {(p.defects || []).map(d => (
                  <div key={d.id} className="check-row" onClick={() => toggleDefect(p.id, d.id)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 8, cursor: "pointer" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, border: `2px solid ${d.done ? "#50c878" : "#333"}`, background: d.done ? "#50c878" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {d.done && <span style={{ fontSize: 11, color: "#0c0c0e", fontWeight: 900 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 14, color: d.done ? "#555" : "#ccc", textDecoration: d.done ? "line-through" : "none", flex: 1 }}>{d.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 收款 */}
            {detailSection === "收款" && (
              <div>
                <div style={{ marginBottom: 12, padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#555" }}>報價總計</span>
                    <span style={{ fontSize: 13, color: "#50c878" }}>$ {fmtMoney(totalPrice)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#555" }}>已收款</span>
                    <span style={{ fontSize: 13, color: "#5b8af0" }}>$ {fmtMoney(totalPayments)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#555" }}>待收款</span>
                    <span style={{ fontSize: 13, color: "#f0a850" }}>$ {fmtMoney(totalPrice - totalPayments)}</span>
                  </div>
                </div>
                {(p.payments || []).map(pay => (
                  <div key={pay.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#ccc" }}>{pay.note || "收款"}</div>
                      <div style={{ fontSize: 11, color: "#444" }}>{pay.date}</div>
                    </div>
                    <div style={{ fontSize: 14, color: "#50c878", fontWeight: 600 }}>$ {fmtMoney(num(pay.amount))}</div>
                  </div>
                ))}
                <div style={{ marginTop: 14, padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>新增收款記錄</div>
                  <input value={payAmt} onChange={e => setPayAmt(e.target.value)} placeholder="金額" type="number"
                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 10px", color: "#e8e4dc", fontSize: 13, outline: "none", marginBottom: 6 }} />
                  <input value={payNote} onChange={e => setPayNote(e.target.value)} placeholder="備註（訂金、工程款、尾款...）"
                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 10px", color: "#e8e4dc", fontSize: 13, outline: "none", marginBottom: 6 }} />
                  <input type="date" value={payDate} onChange={e => setPayDate(e.target.value)}
                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 10px", color: "#e8e4dc", fontSize: 13, outline: "none", marginBottom: 10 }} />
                  <button className="btn" onClick={addPayment} style={{ width: "100%", background: "#50c878", border: "none", borderRadius: 8, padding: "10px", color: "#0c0c0e", fontSize: 13, fontWeight: 700 }}>
                    確認新增收款
                  </button>
                </div>
              </div>
            )}

          </Modal>
        );
      })()}

      {/* ── FORM MODAL ── */}
      {(modal === "new" || modal === "edit") && (
        <Modal onClose={() => setModal(null)} title={form.id ? "編輯案件" : `新增${form.stage}案件`}>
          <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
            {["basic", ...(form.stage === "施工中" || form.stage === "完工" ? ["施工", "報價", "工班請款"] : [])].map(s => (
              <button key={s} onClick={() => setFormTab(s)} style={{
                background: formTab === s ? "#5b8af0" : "rgba(255,255,255,0.07)", color: formTab === s ? "#fff" : "#666",
                border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
              }}>{s === "basic" ? "基本資料" : s}</button>
            ))}
          </div>

          {formTab === "basic" && (
            <>
              <Field label="案件名稱 *"><TextInput value={form.name} onChange={f("name")} placeholder="案件名稱" /></Field>
              <Field label="案件地址"><TextInput value={form.address} onChange={f("address")} placeholder="地址" /></Field>
              <Field label="客戶名稱"><TextInput value={form.client} onChange={f("client")} placeholder="客戶姓名" /></Field>
              <Field label="設計需求"><TextInput value={form.designNeeds} onChange={f("designNeeds")} placeholder="風格、需求描述..." multiline /></Field>
              <Field label="諮詢日期"><input type="date" value={form.consultDate} onChange={f("consultDate")} style={dateStyle} /></Field>
              <Field label="預算"><TextInput value={form.budget} onChange={f("budget")} placeholder="例：300萬" /></Field>
              <Field label="專案設計師"><TextInput value={form.designer} onChange={f("designer")} placeholder="設計師姓名" /></Field>
              <Field label="配合助理"><TextInput value={form.assistant} onChange={f("assistant")} placeholder="助理姓名" /></Field>
              <Field label="備註"><TextInput value={form.notes} onChange={f("notes")} placeholder="其他備註" multiline /></Field>
            </>
          )}

          {formTab === "施工" && (
            <>
              <Field label="施工開始日期"><input type="date" value={form.startDate} onChange={f("startDate")} style={dateStyle} /></Field>
              <Field label="預計完工日期"><input type="date" value={form.endDate} onChange={f("endDate")} style={dateStyle} /></Field>
              <Field label={`施工進度：${form.progress}%`}>
                <input type="range" min={0} max={100} step={5} value={form.progress} onChange={f("progress")} style={{ width: "100%", accentColor: "#50c878" }} />
              </Field>
              <Field label="工班聯絡人"><TextInput value={form.contractor} onChange={f("contractor")} placeholder="姓名 / 電話" /></Field>
              <Field label="材料清單"><TextInput value={form.materials} onChange={f("materials")} placeholder="材料項目..." multiline /></Field>
              <Field label="驗收狀態">
                <select value={form.inspection} onChange={f("inspection")} style={dateStyle}>
                  {["未驗收","部分驗收","驗收完成"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="工地現場備註"><TextInput value={form.siteNotes} onChange={f("siteNotes")} placeholder="現場問題、注意事項..." multiline /></Field>
            </>
          )}

          {formTab === "報價" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px", gap: 6, marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: "#555" }}>工項</div>
                <div style={{ fontSize: 10, color: "#50c878", textAlign: "center" }}>報價金額</div>
                <div style={{ fontSize: 10, color: "#f0a850", textAlign: "center" }}>成本</div>
              </div>
              {WORK_ITEMS.map(item => (
                <div key={item} style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px", gap: 6, marginBottom: 8, alignItems: "center" }}>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{item}</div>
                  <input value={(form.quote[item] || {}).price || ""} onChange={e => setQuote(item, "price", e.target.value)} placeholder="0" type="number"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 8px", color: "#50c878", fontSize: 12, outline: "none", textAlign: "right" }} />
                  <input value={(form.quote[item] || {}).cost || ""} onChange={e => setQuote(item, "cost", e.target.value)} placeholder="0" type="number"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 8px", color: "#f0a850", fontSize: 12, outline: "none", textAlign: "right" }} />
                </div>
              ))}
              <div style={{ marginTop: 10, padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#555" }}>報價總計</span>
                <span style={{ fontSize: 14, color: "#50c878", fontWeight: 700 }}>$ {fmtMoney(Object.values(form.quote).reduce((s, v) => s + num(v.price), 0))}</span>
              </div>
            </>
          )}

          {formTab === "工班請款" && (
            <>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>填入各工項實際支付給工班的金額</div>
              {WORK_ITEMS.map(item => (
                <div key={item} style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 8, marginBottom: 8, alignItems: "center" }}>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{item}</div>
                  <input value={(form.billing[item]) || ""} onChange={e => setBilling(item, e.target.value)} placeholder="0" type="number"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 8px", color: "#e05b5b", fontSize: 12, outline: "none", textAlign: "right" }} />
                </div>
              ))}
              <div style={{ marginTop: 10, padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#555" }}>請款總計</span>
                <span style={{ fontSize: 14, color: "#e05b5b", fontWeight: 700 }}>$ {fmtMoney(Object.values(form.billing).reduce((s, v) => s + num(v), 0))}</span>
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button className="btn" onClick={() => setModal(null)} style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, padding: "13px", color: "#666", fontSize: 14 }}>取消</button>
            <button className="btn" onClick={saveProject} style={{ flex: 2, background: STAGE_COLORS[form.stage] || "#5b8af0", border: "none", borderRadius: 12, padding: "13px", color: "#0c0c0e", fontSize: 14, fontWeight: 700 }}>儲存案件</button>
          </div>
        </Modal>
      )}

      {/* 公告 MODAL */}
      {(annModal === "new" || annModal === "edit") && (
        <Modal onClose={() => setAnnModal(null)} title={annForm.id ? "編輯公告" : "新增公告"}>
          <Field label="公告標題 *"><TextInput value={annForm.title} onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))} placeholder="公告標題" /></Field>
          <Field label="內容"><TextInput value={annForm.content} onChange={e => setAnnForm(p => ({ ...p, content: e.target.value }))} placeholder="公告內容..." multiline /></Field>
          <Field label="日期"><input type="date" value={annForm.date} onChange={e => setAnnForm(p => ({ ...p, date: e.target.value }))} style={dateStyle} /></Field>
          <Field label="置頂">
            <div onClick={() => setAnnForm(p => ({ ...p, pinned: !p.pinned }))} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${annForm.pinned ? "#f0d050" : "#333"}`, background: annForm.pinned ? "#f0d050" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {annForm.pinned && <span style={{ fontSize: 11, color: "#0c0c0e", fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, color: "#aaa" }}>置頂顯示</span>
            </div>
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {annForm.id && <button className="btn" onClick={() => deleteAnnouncement(annForm.id)} style={{ background: "rgba(224,91,91,0.12)", border: "1px solid rgba(224,91,91,0.3)", borderRadius: 12, padding: "13px 14px", color: "#e05b5b", fontSize: 13 }}>刪除</button>}
            <button className="btn" onClick={() => setAnnModal(null)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, padding: "13px", color: "#666", fontSize: 14 }}>取消</button>
            <button className="btn" onClick={saveAnnouncement} style={{ flex: 2, background: "#f0d050", border: "none", borderRadius: 12, padding: "13px", color: "#0c0c0e", fontSize: 14, fontWeight: 700 }}>儲存公告</button>
          </div>
        </Modal>
      )}

      {/* 建材 MODAL */}
      {(matModal === "new" || matModal === "edit") && (
        <Modal onClose={() => setMatModal(null)} title={matForm.id ? "編輯建材" : "新增建材"}>
          <Field label="建材名稱 *"><TextInput value={matForm.name} onChange={maf("name")} placeholder="例：義大利木紋磚" /></Field>
          <Field label="材質分類">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {MATERIAL_CATS.filter(c => c !== "全部").map(c => (
                <button key={c} onClick={() => setMatForm(p => ({ ...p, category: c }))} style={{
                  background: matForm.category === c ? (MATERIAL_CAT_COLORS[c] || "#50c8c8") : "rgba(255,255,255,0.06)",
                  color: matForm.category === c ? "#0c0c0e" : "#888",
                  border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: matForm.category === c ? 700 : 400,
                }}>{c}</button>
              ))}
            </div>
          </Field>
          <Field label="品牌"><TextInput value={matForm.brand} onChange={maf("brand")} placeholder="例：Florim" /></Field>
          <Field label="型號"><TextInput value={matForm.model} onChange={maf("model")} placeholder="例：Nest Silver 60x120" /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="單價"><TextInput value={matForm.price} onChange={maf("price")} placeholder="例：2800" /></Field>
            <Field label="單位"><TextInput value={matForm.unit} onChange={maf("unit")} placeholder="才 / 米 / 片" /></Field>
          </div>
          <Field label="廠商名稱"><TextInput value={matForm.supplier} onChange={maf("supplier")} placeholder="例：美觀建材" /></Field>
          <Field label="廠商電話"><TextInput value={matForm.phone} onChange={maf("phone")} placeholder="02-xxxx-xxxx" /></Field>
          <Field label="備註"><TextInput value={matForm.notes} onChange={maf("notes")} placeholder="特性、注意事項..." multiline /></Field>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {matForm.id && <button className="btn" onClick={() => deleteMat(matForm.id)} style={{ background: "rgba(224,91,91,0.12)", border: "1px solid rgba(224,91,91,0.3)", borderRadius: 12, padding: "13px 14px", color: "#e05b5b", fontSize: 13 }}>刪除</button>}
            <button className="btn" onClick={() => setMatModal(null)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, padding: "13px", color: "#666", fontSize: 14 }}>取消</button>
            <button className="btn" onClick={saveMat} style={{ flex: 2, background: "#50c8c8", border: "none", borderRadius: 12, padding: "13px", color: "#0c0c0e", fontSize: 14, fontWeight: 700 }}>儲存建材</button>
          </div>
        </Modal>
      )}

      {/* MEMO MODAL */}
      {(modal === "memo_new" || modal === "memo_edit") && (
        <Modal onClose={() => setModal(null)} title={memoForm.id ? "編輯備忘錄" : "新增備忘錄"}>
          <Field label="顏色">
            <div style={{ display: "flex", gap: 8 }}>
              {MEMO_COLORS.map(c => (
                <div key={c} onClick={() => setMemoForm(p => ({ ...p, color: c }))}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: memoForm.color === c ? "2px solid #fff" : "2px solid transparent" }} />
              ))}
            </div>
          </Field>
          <Field label="標題"><TextInput value={memoForm.title} onChange={mf("title")} placeholder="備忘錄標題" /></Field>
          <Field label="內容"><TextInput value={memoForm.content} onChange={mf("content")} placeholder="內容..." multiline /></Field>
          <Field label="日期"><input type="date" value={memoForm.date} onChange={mf("date")} style={dateStyle} /></Field>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            {memoForm.id && <button className="btn" onClick={() => deleteMemo(memoForm.id)} style={{ background: "rgba(224,91,91,0.15)", border: "none", borderRadius: 12, padding: "13px 14px", color: "#e05b5b", fontSize: 13 }}>刪除</button>}
            <button className="btn" onClick={() => setModal(null)} style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, padding: "13px", color: "#666", fontSize: 14 }}>取消</button>
            <button className="btn" onClick={saveMemo} style={{ flex: 2, background: "#c084f5", border: "none", borderRadius: 12, padding: "13px", color: "#0c0c0e", fontSize: 14, fontWeight: 700 }}>儲存</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
