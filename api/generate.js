import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      menu,
      selectedGoodPoints,
      selectedImprovements,
      message,
    } = req.body;

    const prompt = `
以下の内容からGoogle口コミ用の文章を丁寧に作成してください。

【メニュー】
${menu}

【良かった点】
${selectedGoodPoints.join("、")}

【改善点】
${selectedImprovements}

【その他メッセージ】
${message}
    `;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    // ← ここが重要！
    const text = response.choices[0].message;

    return res.status(200).json({ text });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "口コミ生成に失敗しました。" });
  }
}
