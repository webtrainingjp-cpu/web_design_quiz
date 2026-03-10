// Fisher-Yatesで配列をシャッフルする関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let consecutiveCorrect = 0; // 連続正解数をカウント

document.getElementById("start-button").addEventListener("click", function () {
    document.getElementById("start-container").style.display = "none";  // スタート画面を非表示

    // クイズ画面の要素を表示
    document.getElementById("progress-info").style.display = "block";
    document.querySelector(".progress").style.display = "block";
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("next-button").style.display = "block";

    startQuiz(); // クイズ開始
});

function startQuiz() {
    // https://fukuokamiyako.com/wp-content/js/
    fetch("questions_with_categories.json")
        .then(response => response.json())
        .then(data => {
            const questions = shuffleArray(data).slice(0, 25); // 25問をランダムに選択
            let currentQuestionIndex = 0;
            let score = 0;

            function updateProgress() {
                const total = questions.length;
                const answeredCount = currentQuestionIndex + 1;
                const accuracy = Math.round((score / answeredCount) * 100);
                const progressPercent = Math.round((answeredCount / total) * 100);

                let fireIcons = "🔥".repeat(Math.min(consecutiveCorrect, 25));
                // Safari対策 → textContent に代入
                setTimeout(() => {
                    document.getElementById("fire-effect").textContent = fireIcons;
                }, 10);

                // let fireIcons = "";
                // if (consecutiveCorrect >= 10) {
                //     fireIcons = "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"; // 10連続なら超燃える
                // } else if (consecutiveCorrect >= 5) {
                //     fireIcons = "🔥🔥🔥🔥🔥"; // 5連続なら炎の演出
                // } else if (consecutiveCorrect >= 4) {
                //     fireIcons = "🔥🔥🔥🔥"; // 5連続なら炎の演出
                // }else if (consecutiveCorrect >= 3) {
                //     fireIcons = "🔥🔥🔥"; // 5連続なら炎の演出
                // }else if (consecutiveCorrect >= 2) {
                //     fireIcons = "🔥🔥"; // 5連続なら炎の演出
                // }else if (consecutiveCorrect >= 1) {
                //     fireIcons = "🔥"; // 5連続なら炎の演出
                // }


                document.getElementById("progress-info").innerHTML =
                    `現在 ${answeredCount} / ${total} 問  (正解数: <span class="text-success fw-bold"> ${score}</span>, 正答率:<span class="text-primary fw-bold"> ${accuracy}%</span>)`;

                document.getElementById("progress-bar").style.width = progressPercent + "%";
                document.getElementById("progress-bar").textContent = progressPercent + "%";

                // 🔥の表示場所を「次の問題へ」ボタンの上に変更
                document.getElementById("fire-effect").innerHTML = `<span class="fs-2 fw-bold fire-animation">${fireIcons}</span>`;
            }

            function showQuestion() {
                const quizContainer = document.getElementById("quiz-container");
                quizContainer.innerHTML = "";
                const questionData = questions[currentQuestionIndex];

                // ラッパー：PCで2カラム、SPで縦
                const quizWrapper = document.createElement("div");
                quizWrapper.classList.add("d-block", "d-md-flex", "gap-4");

                // 左：問題・選択肢・正誤
                const leftCol = document.createElement("div");
                leftCol.classList.add("col-md-7", "quiz-left");

                const questionBox = document.createElement("div");
                questionBox.classList.add("mb-3");
                questionBox.innerHTML = `
        <h3 class="mb-3">問題 第${currentQuestionIndex + 1}問（${questionData.category || "カテゴリー不明"}）</h3>
        <p class="mb-3">${questionData.question}</p>
    `;

                const choicesDiv = document.createElement("div");
                choicesDiv.classList.add("mb-3", "row", "mx-auto");

                const resultDiv = document.createElement("p");
                resultDiv.classList.add("fw-bold", "mt-2", "text-center");

                let isAnswered = false;

                questionData.choices.forEach((choice, index) => {
                    const choiceWrapper = document.createElement("div");
                    choiceWrapper.classList.add("col", "mb-2");

                    const button = document.createElement("button");
                    button.textContent = choice;
                    button.classList.add("btn", "btn-outline-primary", "d-block", "w-100");

                    button.onclick = () => {
                        if (!isAnswered) {
                            checkAnswer(index);
                            isAnswered = true;
                        }
                    };

                    choiceWrapper.appendChild(button);
                    choicesDiv.appendChild(choiceWrapper);
                });

                leftCol.appendChild(questionBox);
                leftCol.appendChild(choicesDiv);
                leftCol.appendChild(resultDiv);

                // 右：解説・ボタン
                const rightCol = document.createElement("div");
                rightCol.classList.add("col-md-5", "quiz-right", "d-flex", "flex-column", "align-items-center", "justify-content-start");

                const explanationButton = document.createElement("button");
                explanationButton.textContent = "解説を見る";
                explanationButton.classList.add("btn", "btn-secondary", "mt-1", "w-75");
                explanationButton.onclick = () => {
                    explanationDiv.style.display = "block";
                };

                const explanationDiv = document.createElement("div");
                explanationDiv.classList.add("text-muted", "mt-2", "w-75");
                explanationDiv.style.display = "none";

                rightCol.appendChild(explanationButton);
                rightCol.appendChild(explanationDiv);

                // まとめて追加
                quizWrapper.appendChild(leftCol);
                quizWrapper.appendChild(rightCol);
                quizContainer.appendChild(quizWrapper);

                // 回答処理
                function checkAnswer(selectedIndex) {
                    const correctIndex = questionData.correct;
                    const correctAnswer = questionData.choices[correctIndex];

                    if (selectedIndex === correctIndex) {
                        resultDiv.textContent = "正解です！";
                        resultDiv.classList.add("text-success");
                        score++;
                        consecutiveCorrect++;
                    } else {
                        resultDiv.textContent = "不正解です。";
                        resultDiv.classList.add("text-danger");
                        consecutiveCorrect = 0;
                    }

                    explanationDiv.innerHTML = `<strong>正解は「${correctAnswer}」です。</strong> ${questionData.explanation}`;
                    document.getElementById("next-button").style.display = "inline-block";

                    updateProgress();
                }
            }



            document.getElementById("next-button").addEventListener("click", () => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion();
                } else {
                    showFinalResult();
                }
            });

            function showFinalResult() {
                document.getElementById("quiz-container").innerHTML = "";
                document.getElementById("next-button").style.display = "none";

                const accuracy = Math.round((score / questions.length) * 100);

                //  **正答率ごとの評価メッセージ**
                let resultMessage = "";
                if (accuracy === 100) {
                    resultMessage = "パーフェクト！ 🎯";
                } else if (accuracy >= 90) {
                    resultMessage = "かなり余裕で合格！ 🎉";
                } else if (accuracy >= 80) {
                    resultMessage = "余裕で合格！ 😊";
                } else if (accuracy >= 70) {
                    resultMessage = "合格！ 👍";
                } else {
                    resultMessage = "残念！もっと頑張ろう！ 😢";
                }

                document.getElementById("final-result").style.display = "block";
                document.getElementById("final-result").innerHTML =
                    `全25問中 ${score}問正解でした！ (正答率: ${accuracy}%)<br><span class="fs-4 fw-bold text-primary">${resultMessage}</span>`;

                document.getElementById("retry-button").style.display = "block";
            }

            document.getElementById("retry-button").addEventListener("click", () => {
                location.reload();
            });

            showQuestion();
        })
        .catch(error => console.error("問題データの読み込みに失敗しました:", error));
}

