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
