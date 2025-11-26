import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      menu = "",
      goodPoints = [],
      changes = [],
      impressions = [],
      improvement = "",
      message = "",
    } = req.body || {};

    const prompt = `
あなたは【ヘッドスパ専門店の口コミ文章を作成するプロライター】です。

以下のお客様のアンケート内容をもとに、
【ヘッドスパの口コミとして自然・丁寧・具体的な文章】を作成してください。

絶対に飲食店・レストラン・美容院の内容にはしないこと。
ヘッドスパ・頭浸浴・リラックス・首肩コリ・空間・接客に限定すること。

-----------------------------
■メニュー
${menu}

■良かった点
${goodPoints.join("、")}

■変化を感じた点
${changes.join("、")}

■体感した印象
${impressions.join("、")}

■改善点
${improvement}

■その他メッセージ
${message}
-----------------------------

【条件】
・50〜120文字
・優しい口調
・初めての人でもイメージしやすい内容
・「また利用したい」で自然に締める
・過剰な宣伝は禁止
・飲食店の要素が入った場合は自動でヘッドスパ内容に修正する
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices?.[0]?.message?.content?.trim() || "";

    return res.status(200).json({ review: text });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "口コミ生成に失敗しました。" });
  }
}
