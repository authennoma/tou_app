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
あなたは【ヘッドスパ専門店の口コミ文章を作成するプロライター】です。

以下のお客様のアンケート内容をもとに、
【ヘッドスパの口コミとして自然・丁寧・具体的な文章】を作成してください。

絶対に飲食店・レストラン・美容院の内容にはしないこと。
スパ施術・リラックス・頭浸浴・首肩コリ・接客・空間など
ヘッドスパに関する内容に限定してください。

--------------------------------

■良かった点
${goodPointsText}

■改善点
${selectedImprovements}

■その他メッセージ
${message}
--------------------------------

【書き方の条件】
・実際に受けたヘッドスパの口コミとして自然に
・飲食店・料理などには絶対触れない
・50〜120文字程度
・優しい口調で
・初めての人が読んでもイメージできる内容
・「また利用したい」と自然に思える締め方
・過剰な宣伝は禁止

では、上記情報をもとにヘッドスパの口コミ文を1つ作成してください。
`;
