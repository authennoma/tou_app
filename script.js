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
  const good = getCheckedValues("goodPoints");
  const changes = getCheckedValues("changes");
  const feels = getCheckedValues("impressions");
  const improvement = document.getElementById("improvement").value.trim();
  const message = document.getElementById("message").value.trim();
  const rating = getRating();  // ★ 星の点数

  if (rating === 0) {
    alert("満足度の星を選んでください✨");
    return;
  }

  // ★ 星3以下 → 投稿誘導なし
  if (rating <= 3) {
    document.getElementById("reviewText").innerText =
      "アンケートのご回答ありがとうございました。いただいた内容はスタッフ全員で共有し、改善に努めてまいります。";
    document.getElementById("resultSection").classList.remove("hidden");
    document.querySelector(".goto").style.display = "none";
    return;
  }

  // ★ 星4〜5 → 口コミ生成
  const userData = {
    rating,
    goodPoints: good,
    changes,
    impressions: feels,
    improvement,
    message
  };

  document.getElementById("reviewText").innerText = "口コミ文章を生成中です…";
  document.getElementById("resultSection").classList.remove("hidden");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    document.getElementById("reviewText").innerText = data.review;

    // ★ 投稿誘導ボタンを表示
    document.querySelector(".goto").style.display = "block";

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
