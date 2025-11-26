import OpenAI from "openai";

export default async function handler(req, res) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const { goodPoints, changes, impressions, improvement, message } = req.body;

  const prompt = `
あなたは高級ヘッドスパサロン「蕩 -tou- Head Spa」のお客様です。
以下の施術内容と感想に基づいて、Googleの口コミとして自然で丁寧な文章を作成してください。

● 良かった施術: ${goodPoints.join("、")}
● 感じた変化: ${changes.join("、")}
● サロンの印象: ${impressions.join("、")}
● 改善点（任意）: ${improvement || "なし"}
● メッセージ（任意）: ${message || "なし"}

【条件】
・不自然な繋がりは避ける
・丁寧で柔らかい日本語
・400文字以内
・段落は2〜4個
・宣伝っぽさは出さない
・本当にお客様が書いたように自然に

口コミ文を作成してください。
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 350
  });

  const review = completion.choices[0].message.content;

  return res.status(200).json({ review });
}
