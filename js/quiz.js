// モード保存用変数

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let consecutiveCorrect = 0;
let categoryStats = {};
let answered = false;
let currentCategory = null;

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
  currentCategory = category;

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

// 問題表示
function showQuestion() {
  answered = false;

  const container = document.getElementById("quiz-container");
  const progressInfo = document.getElementById("progress-info");
  const progressBar = document.getElementById("progress-bar");

  const q = questions[currentQuestionIndex];

  progressInfo.innerHTML = `問題 ${currentQuestionIndex + 1} / ${questions.length}`;

  const percent = Math.round(
    ((currentQuestionIndex + 1) / questions.length) * 100,
  );

  progressBar.style.width = percent + "%";
  progressBar.innerText = percent + "%";

  // 選択肢
  let options = q.choices;

  if (!options) {
    options = [q.choice1, q.choice2, q.choice3, q.choice4];
  }

  let html = `
    <div class="col-12">

      <h3 class="q-title">
        問題 ${currentQuestionIndex + 1}
        <span class="ms-2">(${q.category})</span>
      </h3>

      <p class="mt-3">${q.question}</p>

      <div class="my-3 options">
  `;

  // 選択肢ボタン
  options.forEach((opt, index) => {
    html += `
      <button
        class="btn btn-outline-light w-100 mb-2 option-btn"
        data-index="${index}"
      >
        ${opt}
      </button>
    `;
  });

  html += `
      </div>

      <div id="answer-result" class="mt-3 fw-bold text-center"></div>

    </div>
  `;

  container.innerHTML = html;

  // ボタンイベント
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (answered) return;

      answered = true;

      const selected = parseInt(this.dataset.index);

      checkAnswer(selected);
    });
  });
}

// 回答チェック
function checkAnswer(selectedIndex) {
  const q = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll(".option-btn");

  const correctIndex = q.correct;

  const result = document.getElementById("answer-result");

  buttons.forEach((btn, index) => {
    if (index === correctIndex) {
      btn.classList.remove("btn-outline-light");
      btn.classList.add("btn-success");
    }

    if (index === selectedIndex && index !== correctIndex) {
      btn.classList.remove("btn-outline-light");
      btn.classList.add("btn-danger");
    }
  });

  if (selectedIndex === correctIndex) {
    score++;
    result.innerHTML = "✔ 正解！";
    result.style.color = "#4caf50";

    setTimeout(() => {
      nextQuestion();
    }, 800);
  } else {
    result.innerHTML = "✖ 不正解";
    result.style.color = "#ff5252";

    const explanation = q.explanation;

    const modalText = document.getElementById("explanation-text");
    modalText.innerHTML = explanation;

    const modalElement = document.getElementById("explanationModal");

    const modal = new bootstrap.Modal(modalElement);

    modalElement.addEventListener(
      "hidden.bs.modal",
      function () {
        nextQuestion();
      },
      { once: true },
    );

    modal.show();
  }
  buttons.forEach((btn) => {
    btn.disabled = true;
  });
}

// 最終結果
function showFinalResultWithCategoryBreakdown(score, questions, stats) {
  // 追加：問題エリアを隠す
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("next-button").style.display = "none";
  document.getElementById("progress-info").style.display = "none";
  document.querySelector(".progress").style.display = "none";

  const result = document.getElementById("final-result");

  const percent = Math.round((score / questions.length) * 100);

  let html = `
    <h3>結果</h3>

    <p>
      ${score} / ${questions.length} 正解
      （${percent}%）
    </p>
  `;

  if (!currentCategory) {
    html += `<hr><h5>カテゴリー別結果</h5>`;

    for (let cat in stats) {
      const s = stats[cat];
      const p = Math.round((s.correct / s.total) * 100);

      html += `
      <p>
        ${cat} ： ${s.correct}/${s.total} （${p}%）
      </p>
    `;
    }
  }

  result.innerHTML = html;

  result.style.display = "block";

  document.getElementById("retry-button").style.display = "block";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
