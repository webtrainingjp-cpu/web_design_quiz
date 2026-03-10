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

  // 次の問題
  document.getElementById("next-button").addEventListener("click", () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showFinalResultWithCategoryBreakdown(score, questions, categoryStats);
    }
  });
});
