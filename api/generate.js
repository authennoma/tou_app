import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { menu, selectedGoodPoints, selectedImprovements, message } = req.body;

    const prompt = `
以下の内容からGoogle口コミ用の文章を丁寧に作成してください。

【メニュー】
${menu}

【良かった点】
${selectedGoodPoints?.join("、") || "なし"}

【改善点】
${selectedImprovements || "なし"}

【その他メッセージ】
${message || "なし"}
    `;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    // ★最新の正しい取り方（これが最重要）
    const text = completion.output_text;

    return res.status(200).json({ text });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "口コミ生成に失敗しました。" });
  }
}
