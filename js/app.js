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

  const menuToggle = document.getElementById("menu-toggle");
  const hamburgerMenu = document.getElementById("hamburger-menu");

  if (menuToggle && hamburgerMenu) {
    menuToggle.addEventListener("click", () => {
      hamburgerMenu.classList.toggle("active");
    });
  }

  // ランダムスタート
  const startButton = document.getElementById("start-button");

  if (startButton) {
    startButton.addEventListener("click", () => {
      showQuizUI();
      startQuiz();
    });
  }

  // もう一度挑戦
  const retryButton = document.getElementById("retry-button");

  if (retryButton) {
    retryButton.addEventListener("click", () => {
      location.reload();
    });
  }
});
