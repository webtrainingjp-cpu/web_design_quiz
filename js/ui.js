function showQuizUI() {
  const startContainer = document.getElementById("start-container");
  const progressInfo = document.getElementById("progress-info");
  const progress = document.querySelector(".progress");
  const quizContainer = document.getElementById("quiz-container");
  const nextBtn = document.getElementById("next-button");

  if (startContainer) {
    startContainer.style.display = "none";
  }

  if (progressInfo) {
    progressInfo.style.display = "block";
  }

  if (progress) {
    progress.style.display = "block";
  }

  if (quizContainer) {
    quizContainer.style.display = "block";
  }

  // 自動遷移に変更したため、次へ進むボタンは常に非表示にする
  if (nextBtn) {
    nextBtn.style.display = "none";
  }
}

function updateTitle() {
  const title = document.querySelector(".bk_title");
  const params = new URLSearchParams(location.search);
  const set = params.get("set") || "07";
  const label = set === "0506" ? "過去問 05-06" : "過去問 07";

  if (!title) return;

  title.innerHTML = `
    <a href="index.html" id="title-reload">
      ウェブデザイン技能検定3級問題
    </a>
    <br><small>（${label}）</small>
  `;
}
