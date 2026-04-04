// ==============================
// モード保存用変数
// ==============================

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let consecutiveCorrect = 0;
let answered = false;
const DEFAULT_QUESTION_SET = "07";
const DEFAULT_QUESTION_FILE = `data/questions_${DEFAULT_QUESTION_SET}.json`;
const QUESTION_SET_ALIASES = {
  "0506": "data/questions_05_06.json",
};

// ==============================
// 遷移タイミング設定
// ==============================

// 正解時は少し余韻を持たせてから次の問題へ進む
const CORRECT_RESULT_DELAY = 2000;

// 不正解時はモーダルを閉じた後に少し待ってから進む
const INCORRECT_RESULT_DELAY = 350;

// フェードアウト / フェードインの長さ
const QUIZ_FADE_DURATION = 350;

// ==============================
// シャッフル
// ==============================

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// ==============================
// 共通待機処理
// ==============================

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// ==============================
// フェード処理
// ==============================

function getQuizContainer() {
  return document.getElementById("quiz-container");
}

async function fadeOutQuizContainer() {
  const container = getQuizContainer();

  if (!container) return;

  container.classList.add("is-fading-out");

  await wait(QUIZ_FADE_DURATION);
}

async function fadeInQuizContainer() {
  const container = getQuizContainer();

  if (!container) return;

  // クラスの切り替えを確実に反映させるために再描画を挟む
  container.classList.remove("is-fading-out");
  void container.offsetWidth;

  await wait(QUIZ_FADE_DURATION);
}

// ==============================
// 次の問題へ進む前の演出
// ==============================

async function moveToNextQuestionWithFade(delayBeforeFade = 0) {
  if (delayBeforeFade > 0) {
    await wait(delayBeforeFade);
  }

  await fadeOutQuizContainer();
  await wait(50);

  nextQuestion();

  await fadeInQuizContainer();
}

function getQuestionSet() {
  const params = new URLSearchParams(location.search);
  return params.get("set") || DEFAULT_QUESTION_SET;
}

function getQuestionFile() {
  const set = getQuestionSet();

  if (QUESTION_SET_ALIASES[set]) {
    return QUESTION_SET_ALIASES[set];
  }

  if (/^\d+$/.test(set)) {
    return `data/questions_${set}.json`;
  }

  return DEFAULT_QUESTION_FILE;
}

function initializeQuestions(data) {
  questions = shuffleArray(data);

  while (questions.length < 25) {
    questions = questions.concat(shuffleArray(data));
  }

  questions = questions.slice(0, 25);

  currentQuestionIndex = 0;
  score = 0;
  consecutiveCorrect = 0;

  updateTitle();

  showQuestion();
}

function resetQuestionUI() {
  const buttons = document.querySelectorAll(".choice-btn, .option-btn");

  buttons.forEach((btn) => {
    btn.classList.remove(
      "correct",
      "wrong",
      "selected",
      "btn-success",
      "btn-danger",
    );
    btn.classList.add("btn-outline-light");
    btn.disabled = false;
  });

  const result =
    document.getElementById("result") ||
    document.getElementById("answer-result");

  if (result) {
    result.textContent = "";
    result.className = "mt-3 fw-bold text-center";
  }
}

// ==============================
// クイズ開始
// ==============================

function startQuiz() {
  const file = getQuestionFile();

  fetch(file)
    .then((response) => response.json())

    .then((data) => {
      initializeQuestions(data);
    })

    .catch((error) => {
      console.error("問題データ読み込みエラー", error);

      fetch(DEFAULT_QUESTION_FILE)
        .then((response) => response.json())
        .then((data) => {
          initializeQuestions(data);
        })
        .catch((fallbackError) => {
          console.error("デフォルト問題データ読み込みエラー", fallbackError);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);

  if (!params.has("set")) return;

  showQuizUI();
  startQuiz();
});

// ==============================
// 問題表示
// ==============================

function showQuestion() {
  answered = false;
  resetQuestionUI();

  const container = document.getElementById("quiz-container");
  const progressInfo = document.getElementById("progress-info");
  const progressBar = document.getElementById("progress-bar");
  const q = questions[currentQuestionIndex];

  if (!container || !progressInfo || !progressBar || !q) return;

  progressInfo.innerHTML = `問題 ${currentQuestionIndex + 1} / ${questions.length}`;

  const percent = Math.round(
    ((currentQuestionIndex + 1) / questions.length) * 100,
  );

  progressBar.style.width = percent + "%";
  progressBar.innerText = percent + "%";

  // =====================
  // 選択肢
  // =====================

  let options = q.choices;

  if (!options) {
    options = [q.choice1, q.choice2, q.choice3, q.choice4];
  }

  let html = `

    <div class="col-12">

      <h3 class="q-title">

        問題 ${currentQuestionIndex + 1}

      </h3>

      <p class="mt-3">${q.question}</p>

      <div class="my-3 options">

  `;

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

  // =====================
  // ボタンイベント
  // =====================

  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (answered) return;

      answered = true;

      const selected = parseInt(this.dataset.index);

      checkAnswer(selected);
    });
  });
}

// ==============================
// 回答チェック
// ==============================

function checkAnswer(selectedIndex) {
  const q = questions[currentQuestionIndex];

  const buttons = document.querySelectorAll(".option-btn");
  if (!q) return;

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

    // 結果表示を見やすくするため、正解用の見た目クラスを付ける
    if (result) {
      result.className = "answer-result-box answer-result-correct";
      result.innerHTML = "✔ 正解！";
    }

    // 正解表示を少し見せてから、ゆっくり次の問題へ切り替える
    moveToNextQuestionWithFade(CORRECT_RESULT_DELAY);
  } else {
    // 結果表示を見やすくするため、不正解用の見た目クラスを付ける
    if (result) {
      result.className = "answer-result-box answer-result-incorrect";
      result.innerHTML = "✖ 不正解";
    }

    const explanation = q.explanation;

    const modalText = document.getElementById("explanation-text");
    if (modalText) {
      modalText.innerHTML = explanation;
    }

    const modalElement = document.getElementById("explanationModal");
    if (!modalElement) {
      moveToNextQuestionWithFade(INCORRECT_RESULT_DELAY);
      return;
    }

    const modal = new bootstrap.Modal(modalElement);

    modalElement.addEventListener(
      "hidden.bs.modal",
      function () {
        // 解説モーダルを閉じたあと、少し間を置いてから次へ進む
        moveToNextQuestionWithFade(INCORRECT_RESULT_DELAY);
      },
      { once: true },
    );

    modal.show();
  }

  buttons.forEach((btn) => {
    btn.disabled = true;
  });
}

// ==============================
// 次の問題
// ==============================

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showFinalResult();
  }
}

// ==============================
// 最終結果 → recordページ
// ==============================

function showFinalResult() {
  const container = document.getElementById("quiz-container");
  const progressInfo = document.getElementById("progress-info");
  const progressBar = document.getElementById("progress-bar");
  const progress = document.querySelector(".progress");
  const result = document.getElementById("final-result");

  if (!result) return;

  if (container) {
    container.style.display = "none";
  }

  if (progressInfo) {
    progressInfo.style.display = "none";
  }

  if (progressBar) {
    progressBar.style.width = "0%";
  }

  if (progress) {
    progress.style.display = "none";
  }

  const percent = Math.round((score / questions.length) * 100);

  result.innerHTML = `
  
  <div class="final-box">

  <h3>お疲れ様でした！</h3>

  <p class="final-score">
  ${score} / ${questions.length} 正解
  （${percent}%）
  </p>

  <p>
  記録を保存しておきましょう
  </p>

  <a href="record.html?score=${score}" class="btn mt-3">
  記録を見る
  </a>

  <br>

  <a href="index.html" class="btn mt-2">
  もう一度挑戦
  </a>

  </div>
  `;

  result.style.display = "block";
}
