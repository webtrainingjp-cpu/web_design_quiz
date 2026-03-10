// quiz.js

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let consecutiveCorrect = 0;
let categoryStats = {};

// シャッフル
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// クイズ開始
function startQuiz(category = null) {
  fetch("data/questions_with_categories.json")
    .then((response) => response.json())
    .then((data) => {
      const filtered = category
        ? data.filter((q) => q.category === category)
        : data;

      questions = shuffleArray(filtered);

      while (questions.length < 25) {
        questions = questions.concat(shuffleArray(filtered));
      }

      questions = questions.slice(0, 25);

      currentQuestionIndex = 0;
      score = 0;
      consecutiveCorrect = 0;
      categoryStats = {};

      updateTitle(category);
      showQuestion();
    })
    .catch((error) => {
      console.error("問題データ読み込みエラー", error);
    });
}
