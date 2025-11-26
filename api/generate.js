import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      menu,
      selectedGoodPoints = [],   // ← デフォルトで空の配列
      selectedImprovements = "",
      message = "",
    } = req.body || {};            // ← req.body が undefined の場合にも対応

    const prompt = `
以下の内容からGoogle口コミ用の文章を丁寧に作成してください。

【メニュー】
${menu || ""}

【良かった点】
${Array.isArray(selectedGoodPoints) ? selectedGoodPoints.join("、") : ""}

【改善点】
${selectedImprovements}

【その他メッセージ】
${message}
    `;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const text = completion.output_text;

    return res.status(200).json({ text });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "口コミ生成に失敗しました。" });
  }
}
