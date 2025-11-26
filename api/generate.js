// /api/generate.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ← ここが重要（Vercel は req.body を自動でパースしない）
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const rawBody = Buffer.concat(buffers).toString();
    const body = JSON.parse(rawBody);

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { goodPoints, changes, impressions, improvement, message } = body;

    const prompt = `
あなたは高級ヘッドスパサロン「蕩 -tou- Head Spa」のお客様です。
以下の体験内容を元に、Google 口コミ用の自然で丁寧な文章を作成してください。

● 良かった施術: ${goodPoints.join("、")}
● 感じた変化: ${changes.join("、")}
● サロンの印象: ${impressions.join("、")}
● 改善点（任意）: ${improvement || "なし"}
● メッセージ（任意）: ${message || "なし"}

【条件】
・不自然な褒めすぎは禁止
・丁寧で柔らかい日本語
・200文字以内
・段落は2〜3個
・固くならず自然な口コミ文にする

口コミ文を作成してください。
`;

    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const reviewText = completion.output_text;

    return res.status(200).json({ review: reviewText });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "生成エラー" });
  }
}
