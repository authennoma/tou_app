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
    const {
      goodPoints = [],
      changes = [],
      impressions = [],
      improvement = "",
      message = "",
    } = req.body || {};

    const goodPointsText = Array.isArray(goodPoints)
      ? goodPoints.join("、")
      : String(goodPoints || "");

    const changesText = Array.isArray(changes)
      ? changes.join("、")
      : String(changes || "");

    const impressionsText = Array.isArray(impressions)
      ? impressions.join("、")
      : String(impressions || "");

    const prompt = `
あなたは【ヘッドスパ専門店の口コミ文章を作成するプロライター】です。

以下のお客様アンケートをもとに、
【ヘッドスパの口コミとして自然で丁寧・具体的な文章】を作成してください。

※絶対に飲食店・美容院・レストランの内容を書かないこと。
※必ずアンケート内容を反映し、架空の内容を追加しないこと。
※ヘッドスパに関する内容（頭浸浴・首肩コリ・リラックス・空間など）に限定する。

--------------------------------
■良かった点
${goodPointsText}

■感じた変化
${changesText}

■印象・感想
${impressionsText}

■改善点
${improvement}

■その他メッセージ
${message}
--------------------------------

【書き方の条件】
・自然で読みやすい日本語
・初めて読む人にも内容が伝わる
・過度に誇張しない
・ヘッドスパ体験に関する内容のみ
・80〜140文字程度

では上記をもとに、ヘッドスパの口コミ文を1つ作成してください。
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
