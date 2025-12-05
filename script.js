// ------------------------------
// ⭐ 星の選択処理
// ------------------------------
let ratingValue = 0;
const stars = document.querySelectorAll(".stars span");

stars.forEach(star => {
  star.addEventListener("click", () => {
    ratingValue = Number(star.dataset.value);

    // 全星の active をリセット
    stars.forEach(s => s.classList.remove("active"));

    // ★ 押された番号まで全て active
    for (let i = 0; i < ratingValue; i++) {
      stars[i].classList.add("active");
    }
  });
});


// ------------------------------
// 🔥 口コミ生成
// ------------------------------
async function generateReview() {
  const good = getCheckedValues("goodPoints");
  const changes = getCheckedValues("changes");
  const feels = getCheckedValues("impressions");

  const improvement = document.getElementById("improvement").value.trim();
  const message = document.getElementById("message").value.trim();

  // API に渡す内容
  const userData = {
    goodPoints: good,
    changes,
    impressions: feels,
    improvement,
    message,
    rating: ratingValue
  };

  // 生成中テキスト
  document.getElementById("reviewText").innerText = "生成中です…数秒お待ちください。";
  document.getElementById("resultSection").classList.remove("hidden");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!data.review) {
      document.getElementById("reviewText").innerText =
        "口コミ生成に失敗しました。（データが空）";
      return;
    }

    document.getElementById("reviewText").innerText = data.review;

    // ⭐ 星4以上で Google口コミ誘導ボタン表示
    if (ratingValue >= 4) {
      document.querySelector(".goto").style.display = "block";
    } else {
      document.querySelector(".goto").style.display = "none";
    }

  } catch (error) {
    document.getElementById("reviewText").innerText =
      "口コミ生成中にエラーが発生しました。もう一度お試しください。";
  }
}


// ------------------------------
// 📌 チェックボックス取得
// ------------------------------
function getCheckedValues(id) {
  return [...document.querySelectorAll(`#${id} input:checked`)].map(el => el.value);
}


// ------------------------------
// 📋 コピーボタン（アニメ付き）
// ------------------------------
function copyText() {
  const btn = document.querySelector(".copy");
  const text = document.getElementById("reviewText").innerText;

  navigator.clipboard.writeText(text).then(() => {

    btn.classList.add("copied");
    const originalText = btn.innerText;
    btn.innerText = "";

    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerText = originalText;
    }, 1800);
  });
}
