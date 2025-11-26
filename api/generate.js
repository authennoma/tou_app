// /api/generate.js
import OpenAI from "openai";

// クライアントは関数の外で1回だけ作成
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // body が undefined でも落ちないように保険をかける
    const {
      menu = "",
      selectedGoodPoints = [],
      selectedImprovements = "",
      message = "",
    } = req.body || {};

    const goodPointsText = Array.isArray(selectedGoodPoints)
      ? selectedGoodPoints.join("、")
      : String(selectedGoodPoints || "");

    const prompt = `
以下の内容からGoogle口コミ用の文章を、自然で丁寧な日本語で作成してください。

【メニュー】
${menu}

【良かった点】
${goodPointsText}

【改善点】
${selectedImprovements}

【その他メッセージ】
${message}

【条件】
・過度に褒めすぎず、実際に体験したお客様目線
・200文字以内
・2〜3文程度で読みやすく
`;

    // ★ ここを responses ではなく chat.completions に変更 ★
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices?.[0]?.message?.content?.trim() || "";

    // フロントが data.review を読む想定に合わせる
    return res.status(200).json({ review: text });
  } catch (error) {
    console.error("API Error:", error);
    return res
      .status(500)
      .json({ error: "口コミ生成に失敗しました。" });
  }
}
