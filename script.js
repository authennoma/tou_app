let selectedRating = 0;

// ⭐ 星クリック処理
document.querySelectorAll("#rating span").forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = Number(star.dataset.value);
    updateStars();
  });
});

function updateStars() {
  document.querySelectorAll("#rating span").forEach(s => {
    s.classList.toggle("active", Number(s.dataset.value) <= selectedRating);
  });
}

// チェックされた値
function getCheckedValues(id) {
  return [...document.querySelectorAll(`#${id} input:checked`)].map(el => el.value);
}

// 口コミ生成
async function generateReview() {
  const good = getCheckedValues("goodPoints");
  const changes = getCheckedValues("changes");
  const feels = getCheckedValues("impressions");
  const improvement = document.getElementById("improvement").value.trim();
  const message = document.getElementById("message").value.trim();

  const userData = {
    goodPoints: good,
    changes,
    impressions: feels,
    improvement,
    message
  };

  document.getElementById("reviewText").innerText = "生成中です…";
  document.getElementById("resultSection").classList.remove("hidden");

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const data = await res.json();
    document.getElementById("reviewText").innerText = data.review;

    // ⭐ 星4以上で投稿ボタンを出す
    if (selectedRating >= 4) {
      document.getElementById("reviewLink").style.display = "block";
    } else {
      document.getElementById("reviewLink").style.display = "none";
    }

  } catch {
    document.getElementById("reviewText").innerText = "エラーが発生しました。もう一度お試しください。";
  }
}

// コピー
function copyText() {
  const btn = document.querySelector(".copy");
  const text = document.getElementById("reviewText").innerText;

  navigator.clipboard.writeText(text).then(() => {

    // ✔ アニメーション開始
    btn.classList.add("copied");

    // ボタンの元のテキストを退避
    const originalText = btn.innerText;

    // 一時的にテキストを空にして "✔ コピーしました" を出す
    btn.innerText = "";

    // 2秒後に元に戻す
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerText = originalText;
    }, 2000);

  });
}

