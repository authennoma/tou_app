// ⭐ グローバル変数（どこでも使える）
let ratingValue = 0;

// ⭐ 星評価（1〜クリックした星まで全点灯）
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll("#rating span");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      ratingValue = index + 1;

      // 全星リセット
      stars.forEach((s) => s.classList.remove("active"));

      // クリックした星まで光らせる
      for (let i = 0; i <= index; i++) {
        stars[i].classList.add("active");
      }

      console.log("Selected Rating:", ratingValue);
    });
  });
});

// ⭐ チェックボックス値を取得
function getCheckedValues(id) {
  return [...document.querySelectorAll(`#${id} input:checked`)].map(
    (el) => el.value
  );
}

// ⭐ 口コミ生成
async function generateReview() {
  const good = getCheckedValues("goodPoints");
  const changes = getCheckedValues("changes");
  const feels = getCheckedValues("impressions");

  const improvement = document.getElementById("improvement").value.trim();
  const message = document.getElementById("message").value.trim();

  // ⭐ 評価が未選択なら警告
  if (ratingValue === 0) {
    alert("満足度の星を選択してください。");
    return;
  }

  // API に送るデータ
  const userData = {
    goodPoints: good,
    changes,
    impressions: feels,
    improvement,
    message,
    rating: ratingValue,
  };

  // 「生成中…」を表示
  document.getElementById("reviewText").innerText =
    "生成中です…数秒お待ちください。";
  document.getElementById("resultSection").classList.remove("hidden");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    document.getElementById("reviewText").innerText = data.review;

    // ⭐ 星4以上 → Google口コミボタン表示
    const gotoBtn = document.querySelector(".goto");

    if (ratingValue >= 4) {
      gotoBtn.style.display = "block";
    } else {
      gotoBtn.style.display = "none";
    }
  } catch (error) {
    console.error(error);
    document.getElementById("reviewText").innerText =
      "口コミ生成中にエラーが発生しました。もう一度お試しください。";
  }
}

// ⭐ コピー機能
function copyText() {
  const text = document.getElementById("reviewText").innerText;
  navigator.clipboard.writeText(text);
  alert("コピーしました！");
}
<script>
let selectedRating = 0;

// ⭐ 星クリック
document.querySelectorAll("#rating span").forEach(star => {
  star.addEventListener("click", function () {
    selectedRating = Number(this.dataset.value);

    // 前の星も全部色をつける
    document.querySelectorAll("#rating span").forEach(s => {
      s.classList.remove("active");
      if (Number(s.dataset.value) <= selectedRating) {
        s.classList.add("active");
      }
    });

    // ⭐ 星4以上 → Google口コミボタン表示
    if (selectedRating >= 4) {
      document.querySelector(".goto").style.display = "block";
    } else {
      document.querySelector(".goto").style.display = "none";
    }
  });
});
</script>
