// ⭐ 星の操作
let selectedRating = 0;

document.querySelectorAll("#rating span").forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = Number(star.dataset.value);

    document.querySelectorAll("#rating span").forEach(s => {
      s.classList.toggle("active", Number(s.dataset.value) <= selectedRating);
    });
  });
});

// ================================
// ⭐ 口コミ生成
// ================================
async function generateReview() {
  const good = getCheckedValues("goodPoints");
  const changes = getCheckedValues("changes");
  const impressions = getCheckedValues("impressions");
  const improvement = document.getElementById("improvement").value.trim();
  const message = document.getElementById("message").value.trim();

  if (selectedRating === 0) {
    alert("満足度を選択してください。");
    return;
  }

  const payload = {
    good,
    changes,
    impressions,
    improvement,
    message,
    rating: selectedRating,
  };

  // APIへ送信
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  document.getElementById("reviewText").textContent = data.review;

  // 結果表示
  document.getElementById("resultSection").classList.remove("hidden");

  // 星4以上 → 口コミ投稿ボタン表示
  if (selectedRating >= 4) {
    document.querySelector(".goto").style.display = "block";
  } else {
    document.querySelector(".goto").style.display = "none";
  }
}

// ================================
// ⭐ チェックボックス取得
// ================================
function getCheckedValues(id) {
  return [...document.querySelectorAll(`#${id} input:checked`)].map(el => el.value);
}

// ================================
// ⭐ コピーアニメーション
// ================================
function copyText() {
  const text = document.getElementById("reviewText").innerText;
  navigator.clipboard.writeText(text);

  const btn = document.querySelector(".copy");
  btn.classList.add("copied");

  setTimeout(() => {
    btn.classList.remove("copied");
  }, 1500);
}
