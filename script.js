// -----------------------------
// チェックされた値を取得
// -----------------------------
function getCheckedValues(id) {
  return [...document.querySelectorAll(`#${id} input:checked`)].map(el => el.value);
}

// -----------------------------
// 口コミ生成のメイン処理
// -----------------------------
function generateReview() {
  const good = getCheckedValues("goodPoints");
  const changes = getCheckedValues("changes");
  const feels = getCheckedValues("impressions");

  const improvement = document.getElementById("improvement").value.trim();
  const message = document.getElementById("message").value.trim();

  // ---- ランダム文章 ----
  const introTemplates = [
    "本日は素敵な施術をありがとうございました。",
    "今日は丁寧な施術をしていただき、とても癒されました。",
    "落ち着いた空間で受けた施術がとても心地よかったです。"
  ];

  const endTemplates = [
    "またぜひお願いしたいと思います。",
    "次回も楽しみにしています。",
    "また伺わせていただきます。"
  ];

  const connectWords = [
    "また、", "そして、", "その上で、",
    "特に印象的だったのは、", "気づいたら、", "さらに、"
  ];
  const randomConnect = () => connectWords[Math.floor(Math.random() * connectWords.length)];

  // ---- 良かった施術フレーズ ----
  const goodPhrases = {
    "頭浸浴": ["頭浸浴の温かさがとても心地よく", "頭浸浴のリラックス感が素晴らしく", "頭浸浴で一気に呼吸が深くなり"],
    "デコルテ": ["デコルテの圧が絶妙で", "デコルテケアがとても丁寧で", "デコルテまわりの流れが良くなって"],
    "フェイスマッサージ": ["フェイスマッサージが本当に気持ちよく", "フェイスラインがスッキリして", "優しいフェイスマッサージが心地よく"],
    "ヘッドマッサージ": ["ヘッドマッサージがとても丁寧で", "頭皮のほぐされ方が絶妙で", "ヘッドマッサージの圧が最高で"],
    "リンパケア": ["リンパの流れが整っていく感覚があり", "リンパケアでむくみがスッと引いて", "巡りが良くなったのを感じて"],
    "足湯": ["足湯で全身が温まり", "足湯の温度が心地よくて", "足湯でリラックスモードに切り替わり"],
    "鎖骨ほぐし": ["鎖骨まわりがスッと軽くなり", "鎖骨のつまりが流れていく感覚があり", "鎖骨ほぐしが特に気持ちよく"],
    "深層筋アプローチ": ["深層筋にしっかり届く圧で", "深いところまでほぐれるのが心地よく", "深層筋のコリがじんわり和らぎ"],
    "眼精疲労ケア": ["眼のまわりの疲れがスッと抜けて", "眼精疲労が軽くなり", "視界が明るくなるようで"],
    "マイクロスコープ": ["マイクロスコープの説明がわかりやすく", "頭皮状態を見ながら施術してもらえて", "マイクロスコープで状態を知れたのも良くて"]
  };

  // ---- 変化フレーズ ----
  const changePhrases = {
    "頭が軽くなった": "施術後は頭がふわっと軽くなり",
    "目が開きやすくなった": "視界が明るくなったように感じ",
    "顔色が明るくなった": "顔色もワントーン明るくなり",
    "姿勢が良くなった": "自然と姿勢が整ったような感覚があり",
    "呼吸が深くなった": "呼吸が深くスッと入るようになり",
    "むくみが取れた": "むくみもスッキリして",
    "熟睡できた": "施術後はぐっすり眠れて",
    "体がポカポカした": "身体が内側から温まり",
    "頭皮が柔らかくなった": "頭皮も柔らかくなり",
    "顔が上がった": "フェイスラインがキュッと上がり",
    "首肩のコリが楽になった": "首肩の重さもふっと軽くなりました"
  };

  // ---- 印象フレーズ ----
  const feelPhrases = {
    "清潔感がある": "サロン全体もとても清潔で、",
    "落ち着いた照明": "照明の明るさがちょうど良く、",
    "香りが良い": "ふわっと香るアロマが心地よく、",
    "丁寧なカウンセリング": "カウンセリングもとても丁寧で、",
    "上品な空間": "上品で落ち着いた空間で、",
    "プライベート感がある": "完全プライベートの特別感があり、",
    "気遣いが良い": "細やかな気遣いも嬉しく、",
    "静かでリラックスできた": "静かで心からリラックスでき、",
    "温度や湿度がちょうど良い": "室温も湿度も心地よく、",
    "時間配分がちょうど良い": "時間配分も絶妙で、"
  };

  // -----------------------------
  // 文の組み立て
  // -----------------------------
  const intro = introTemplates[Math.floor(Math.random() * introTemplates.length)];

  const goodSentences = good.map(g =>
    goodPhrases[g][Math.floor(Math.random() * goodPhrases[g].length)]
  );

  const changeSentences = changes.map(c => changePhrases[c]);
  const feelSentences = feels.map(f => feelPhrases[f]);

  // 段落 1
  let paragraph1 = intro;
  if (goodSentences.length > 0) {
    paragraph1 += "\n\n" + randomConnect() + goodSentences.join("、") + "ところが良かったです。";
  }

  // 段落 2
  let paragraph2 = "";
  if (changeSentences.length > 0) {
    paragraph2 += randomConnect() + changeSentences.join("、") + "と感じました。";
  }

  // 段落 3
  let paragraph3 = "";
  if (feelSentences.length > 0) {
    paragraph3 += feelSentences.join("") + "とても快適に過ごせました。";
  }

  // 最終文章
  let review = `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}\n`;

  if (improvement) review += `\n【改善点】${improvement}`;
  if (message) review += `\n【メッセージ】${message}`;

  review += `\n${endTemplates[Math.floor(Math.random() * endTemplates.length)]}`;

  // 出力
  document.getElementById("reviewText").innerText = review;
  document.getElementById("resultSection").classList.remove("hidden");
}

// -----------------------------
// コピー処理
// -----------------------------
function copyText() {
  const text = document.getElementById("reviewText").innerText;
  navigator.clipboard.writeText(text);
  alert("コピーしました！");
}
