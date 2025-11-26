function getCheckedValues(id) {
  return [...document.querySelectorAll(`#${id} input:checked`)].map(el => el.value);
}

function generateReview() {
  const good = getCheckedValues("goodPoints");
  const changes = getCheckedValues("changes");
  const feels = getCheckedValues("impressions");

  const improvement = document.getElementById("improvement").value.trim();
  const message = document.getElementById("message").value.trim();

  // イントロ
  const introTemplates = [
    "本日は素敵な施術をありがとうございました。",
    "今日は丁寧に施術していただき、とても癒されました。",
    "しっかり整えていただき、心からリラックスできました。"
  ];
  const intro = pick(introTemplates);

  // 良かった施術
  const goodPhrases = {
    "頭浸浴": [
      "頭浸浴の温かさが身体にスッと染み込んで",
      "頭浸浴で一気に力が抜けて",
      "頭浸浴のリラックス感が本当に心地よくて"
    ],
    "デコルテ": [
      "デコルテの圧加減が絶妙で",
      "デコルテ周りの流れが良くなるのを感じて",
      "デコルテの丁寧な施術がとても気持ちよくて"
    ],
    "フェイスマッサージ": [
      "フェイスマッサージの優しい圧が心地よくて",
      "フェイスラインがスッキリして",
      "表情が軽くなるようなフェイスマッサージで"
    ],
    "ヘッドマッサージ": [
      "ヘッドマッサージの圧がちょうど良くて",
      "頭皮がしっかり動くのを感じて",
      "コリにピンポイントで届くヘッドマッサージが最高で"
    ],
    "リンパケア": [
      "リンパケアで巡りが良くなり",
      "むくみがスッと流れていく感じがあって",
      "リンパの流れが整う感覚が心地よくて"
    ],
    "足湯": [
      "足湯で全身がふわっと温まり",
      "足湯でリラックスモードに切り替わって",
      "足湯の心地よさで一気に力が抜けて"
    ],
    "鎖骨ほぐし": [
      "鎖骨まわりがスッと軽くなり",
      "鎖骨のつまりが流れていくようで",
      "鎖骨周りの流れが良くなるのを感じて"
    ],
    "深層筋アプローチ": [
      "深層筋までしっかり届く圧で",
      "深いところまでじんわりほぐれて",
      "深層筋のコリが和らぐのを感じて"
    ],
    "眼精疲労ケア": [
      "眼の周りの疲れがスッと抜けて",
      "視界が明るくなるようで",
      "眼精疲労が軽くなって"
    ],
    "マイクロスコープ": [
      "マイクロスコープで状態を知れたのも良くて",
      "頭皮状態を見ながら施術してもらえて安心感があり",
      "説明がとても分かりやすくて"
    ]
  };

  // 変化
  const changePhrases = {
    "頭が軽くなった": "施術後は頭がふわっと軽くなり",
    "目が開きやすくなった": "視界も明るくなったように感じて",
    "顔色が明るくなった": "顔色もワントーン明るくなり",
    "姿勢が良くなった": "自然と姿勢が整ったような感覚があり",
    "呼吸が深くなった": "呼吸が深くスッと入るようになり",
    "むくみが取れた": "むくみもスッキリして",
    "熟睡できた": "その日の夜はぐっすり眠れて",
    "体がポカポカした": "身体が内側からぽかぽか温まり",
    "頭皮が柔らかくなった": "頭皮も柔らかくなり",
    "顔が上がった": "フェイスラインもキュッと上がり",
    "首肩のコリが楽になった": "首肩の重さもふっと軽くなりました"
  };

  // 印象
  const feelPhrases = {
    "清潔感がある": "サロン全体もとても清潔で、",
    "落ち着いた照明": "照明の柔らかさが心地よく、",
    "香りが良い": "ふわっと広がるアロマがとても良い香りで、",
    "丁寧なカウンセリング": "カウンセリングも丁寧で、",
    "上品な空間": "上品で落ち着いた空間が広がっていて、",
    "プライベート感がある": "完全プライベートの特別感があって、",
    "気遣いが良い": "細やかな気遣いも嬉しくて、",
    "静かでリラックスできた": "静かで心からリラックスできて、",
    "温度や湿度がちょうど良い": "室温も湿度も心地よく、",
    "時間配分がちょうど良い": "時間配分もちょうど良くて、"
  };

  // --- 組み立て ---
  let review = intro + "\n\n";

  if (good.length > 0) {
    const goodText = good
      .map(g => pick(goodPhrases[g]))
      .join("、");

    review += `特に、${goodText}ところが印象的でした。\n`;
  }

  if (changes.length > 0) {
    const changeText = changes.map(c => changePhrases[c]).join("、");
    review += `${changeText}。\n`;
  }

  if (feels.length > 0) {
    const feelText = feels.map(f => feelPhrases[f]).join("");
    review += `${feelText}とても快適に過ごせました。\n`;
  }

  if (improvement) {
    review += `\n【改善点】${improvement}\n`;
  }

  if (message) {
    review += `\n【メッセージ】${message}\n`;
  }

  const ending = [
    "またぜひお願いしたいと思います。",
    "次回伺うのが今から楽しみです。",
    "また利用させていただきます。"
  ];
  review += "\n" + pick(ending);

  document.getElementById("reviewText").innerText = review;
  document.getElementById("resultSection").classList.remove("hidden");
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function copyText() {
  navigator.clipboard.writeText(
    document.getElementById("reviewText").innerText
  );
  alert("コピーしました！");
}
