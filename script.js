// 口コミ生成（外部AIを使用）
async function generateReview() {
  const good = getCheckedValues("goodPoints");
  const changes = getCheckedValues("changes");
  const feels = getCheckedValues("impressions");

  const improvement = document.getElementById("improvement").value.trim();
  const message = document.getElementById("message").value.trim();

  // お客様の回答を AI へ渡すためのデータ
  const userData = {
    goodPoints: good,
    changes,
    impressions: feels,
    improvement,
    message
  };

  // 画面上に「生成中…」を表示
  document.getElementById("reviewText").innerText = "生成中です…数秒お待ちください。";
  document.getElementById("resultSection").classList.remove("hidden");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

   const data = await response.json();

document.getElementById("reviewText").innerText = data.review;
  } catch (error) {
    document.getElementById("reviewText").innerText =
      "口コミ生成中にエラーが発生しました。もう一度お試しください。";
  }
}

// チェックされた値を取得
function getCheckedValues(id) {
  return [...document.querySelectorAll(`#${id} input:checked`)].map(el => el.value);
}

// コピー機能
function copyText() {
  const text = document.getElementById("reviewText").innerText;
  navigator.clipboard.writeText(text);
  alert("コピーしました！");
}
