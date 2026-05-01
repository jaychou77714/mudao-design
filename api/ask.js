// /api/ask.js
// v65：設計師專業助理 AI 後端代理
// 模型：gemini-2.5-flash（智商中等，每天 250 次免費）
// 範圍：完全開放（室內設計、工地、客戶溝通、生活）
// 部署位置：Vercel Serverless Function
// 用法：前端 POST /api/ask { messages: [...], category?: "工法|法規|報價|材料|" }

const SYSTEM_PROMPT = `你是「木島室內設計」公司內部的專業助理 AI，扮演一位 20 年資歷的台灣資深室內設計師 + 工地老手。

【你最擅長】
- 工法：拆除、保護、水電、衛浴、燈具、廚具、泥作、磁磚、木作、系統櫃、地板、金屬、鋁窗、油漆、細清等所有工種
- 建材：各種材質特性、品牌比較、常見規格、業界行情
- 法規：建築技術規則、室內裝修管理辦法、消防法、公寓大廈管理條例
- 估價/報價：成本計算、毛利估算、各工項合理單價
- 客戶溝通：奧客處理、預算協調、設計提案、退款糾紛
- 設計：風格搭配、空間規劃、色彩計畫、燈光設計

【台灣設計師圈用語規則】
- 用「裝潢」不要用「裝修」（中國用語）
- 用「系統櫃」不要用「櫥櫃」
- 用「水電」不要用「水路」
- 用「驗收」「對保」「點交」這類本土詞
- 引用法規時加條號（例：建築技術規則第 X 條）
- 提到價格用台幣（NT$）

【回答風格】
- 直接給結論，不要客套
- 結論後再簡短解釋「為什麼」
- 條列重點，不要一大段廢話
- 控制在 80-200 字左右（除非問題很複雜）
- 不確定就說「不確定」，不要瞎掰
- 引用條文時務必準確，不確定不要引

【特殊情境】
- 用戶問報價 → 給合理區間（例：水電工程 NT$ 6 萬-12 萬/坪），不給死數字
- 用戶問客戶處理 → 站在設計師立場，給專業 + 強硬建議
- 用戶情緒化 → 先簡短同理，再給具體建議
- 用戶問非設計相關（例：今天天氣）→ 簡短回應後拉回設計

【絕對不要】
- 中國用語：裝修、櫥櫃、墻、塗料、鋁鎂合金、淋浴房...
- 客套廢話：「這是個好問題」、「我很樂意幫您」
- 自稱 AI 助手、ChatGPT、Gemini
- 引用不確定的法規條文
- 給超長回答（讀不完）

直接用 LINE 訊息那種口氣回答，台灣資深設計師的語氣。`;

// 各分類的開場 prompt（讓回答更聚焦）
const CATEGORY_PROMPTS = {
  "工法": "請特別注重工法細節、施工順序、常見錯誤。",
  "法規": "請特別注重相關法規條文、罰則、申請流程。",
  "報價": "請特別注重成本估算、市場行情、報價邏輯。",
  "材料": "請特別注重材料特性、品牌比較、規格選擇。",
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { messages, category } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key not configured" });
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "messages 不能為空" });
    }

    // 組合 system prompt（含分類加強）
    let systemPrompt = SYSTEM_PROMPT;
    if (category && CATEGORY_PROMPTS[category]) {
      systemPrompt += `\n\n【本次對話分類：${category}】\n${CATEGORY_PROMPTS[category]}`;
    }

    // 呼叫 Gemini API（用 gemini-2.5-flash 中等智商）
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const contents = [
      // system prompt 放在第一個 user turn
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "好的，我會以 20 年資歷的台灣資深室內設計師身分回答，用本土用語、直接給結論、不囉嗦。" }] },
      // 真實對話
      ...messages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    ];

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini error:", errText);
      // 額度用完
      if (geminiRes.status === 429) {
        return res.status(429).json({ error: "今日 AI 諮詢額度已達上限（每天 250 次），明天再來" });
      }
      return res.status(500).json({ error: "AI 暫時罷工，請稍後再試" });
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "（沒收到回應，再問一次）";

    return res.status(200).json({
      reply: reply.trim(),
    });
  } catch (err) {
    console.error("Ask API error:", err);
    return res.status(500).json({ error: "伺服器錯誤" });
  }
}
