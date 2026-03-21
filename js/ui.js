function showQuizUI() {
  document.querySelector(".category_box").style.display = "none";
  document.getElementById("start-container").style.display = "none";

  document.getElementById("progress-info").style.display = "block";
  document.querySelector(".progress").style.display = "block";
  document.getElementById("quiz-container").style.display = "block";

  // 自動遷移に変更したため、次へ進むボタンは常に非表示にする
  document.getElementById("next-button").style.display = "none";
}

function updateTitle(category) {
  const title = document.querySelector(".bk_title");

  if (!title) return;

  title.innerHTML =
    `<a href="index.html" id="title-reload">
      ウェブデザイン技能検定3級対策問題
     </a>` + (category ? `<br><small>（${category}）</small>` : "");
}
