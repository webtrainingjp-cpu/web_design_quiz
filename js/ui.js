// ui.js

function showQuizUI() {
  document.querySelector(".category_box").style.display = "none";
  document.getElementById("start-container").style.display = "none";

  document.getElementById("progress-info").style.display = "block";
  document.querySelector(".progress").style.display = "block";
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("next-button").style.display = "block";
}

function updateTitle(category) {
  document.querySelector(".title").innerHTML =
    `<a href="#" id="title-reload">
        ウェブデザイン技能検定<br>3級AI対策問題
        </a>` + (category ? `<br><small>（${category}）</small>` : "");
}
