// app.js

document.addEventListener("DOMContentLoaded", () => {
  // ロゴクリック
  const logoLink = document.getElementById("logo-link");

  if (logoLink) {
    logoLink.addEventListener("click", (e) => {
      e.preventDefault();
      location.reload();
    });
  }

  // カテゴリークリック
  document.querySelectorAll(".category-link").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      const category = this.textContent.trim();

      showQuizUI();
      startQuiz(category);
    });
  });

  // ランダムスタート
  document.getElementById("start-button").addEventListener("click", () => {
    showQuizUI();
    startQuiz();
  });

  // もう一度挑戦
  document.getElementById("retry-button").addEventListener("click", () => {
    location.reload();
  });
});
