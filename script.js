// 星の値を取得
function getRating() {
  const active = document.querySelector('.stars span.active');
  return active ? Number(active.dataset.value) : 0;
}

// 星選択：クリックで active を付ける
document.querySelectorAll('.stars span').forEach(star => {
  star.addEventListener('click', () => {
    document.querySelectorAll('.stars span').forEach(s => s.classList.remove('active'));
    star.classList.add('active');
  });
});

// 口コミ生成（外部AIを使用）
async function generateReview() {
  const selectedGoodPoints = getCheckedValues("goodPoints");
  const selectedImprovements = document.getElementById("improvement").value.trim();
  const message = document.getElementById("message").value.trim();

  // ★ API が期待しているキー名に合わせる！
  const userData = {
    menu: "", // 今メニュー使ってないなら空でOK（必要なら追加）
    selectedGoodPoints,
    selectedImprovements,
    message
  };

  // 「生成中…」表示
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
  return [...document.querySelectorAll(`#${id} input:checked`)]
    .map(el => el.value);
}

function copyText() {
  const text = document.getElementById("reviewText").innerText;
  navigator.clipboard.writeText(text);
  alert("コピーしました！");
}
