function showQuizUI() {
  document.getElementById("start-container").style.display = "none";

  document.getElementById("progress-info").style.display = "block";
  document.querySelector(".progress").style.display = "block";
  document.getElementById("quiz-container").style.display = "block";

  // 自動遷移に変更したため、次へ進むボタンは常に非表示にする
  document.getElementById("next-button").style.display = "none";
}

function updateTitle() {
  const title = document.querySelector(".bk_title");
  const params = new URLSearchParams(location.search);
  const set = params.get("set") || "07";
  const label = set === "0506" ? "過去問（05-06）" : "令和7年度";

  if (!title) return;

  title.innerHTML = `
    <a href="index.html" id="title-reload">
      ウェブデザイン技能検定3級対策問題
    </a>
    <br><small>（${label}）</small>
  `;
}
