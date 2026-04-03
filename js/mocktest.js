// START TEST
function startTest(cls) {
  const name = document.getElementById("studentName").value;

  if (!name) {
    alert("Enter your name");
    return;
  }

  localStorage.setItem("studentName", name);
  localStorage.setItem("testClass", cls);

  window.location.href = "test.html";
}

// QUESTION BANK (10 EACH)
const questionBank = {

  "9": [
    { q: "3² = ?", options: ["6", "9", "12", "15"], answer: 1 },
    { q: "10/2?", options: ["2", "3", "5", "8"], answer: 2 },
    { q: "5*3?", options: ["10", "15", "20", "25"], answer: 1 },
    { q: "Square of 4?", options: ["8", "16", "20", "12"], answer: 1 },
    { q: "9-3?", options: ["3", "6", "9", "12"], answer: 1 },
    { q: "Cube of 2?", options: ["4", "8", "6", "10"], answer: 1 },
    { q: "15+5?", options: ["10", "20", "25", "30"], answer: 1 },
    { q: "12/3?", options: ["2", "4", "6", "3"], answer: 1 },
    { q: "7*2?", options: ["12", "14", "16", "18"], answer: 1 },
    { q: "20-5?", options: ["10", "15", "20", "25"], answer: 1 }
  ],

  "8": [
    { q: "2+2?", options: ["3", "4", "5", "6"], answer: 1 },
    { q: "5+5?", options: ["8", "9", "10", "11"], answer: 2 },
    { q: "8-3?", options: ["3", "5", "6", "7"], answer: 1 },
    { q: "6*2?", options: ["10", "12", "14", "16"], answer: 1 },
    { q: "9/3?", options: ["2", "3", "4", "5"], answer: 1 },
    { q: "4+6?", options: ["8", "9", "10", "12"], answer: 2 },
    { q: "10-2?", options: ["6", "7", "8", "9"], answer: 2 },
    { q: "3*3?", options: ["6", "9", "12", "15"], answer: 1 },
    { q: "12/4?", options: ["2", "3", "4", "5"], answer: 1 },
    { q: "7+2?", options: ["8", "9", "10", "11"], answer: 1 }
  ],

  "10": [
    { q: "H2O is?", options: ["Water", "Gas", "Oxygen", "Hydrogen"], answer: 0 },
    { q: "Speed formula?", options: ["d/t", "t/d", "m*v", "none"], answer: 0 },
    { q: "Force unit?", options: ["Newton", "Joule", "Watt", "Pascal"], answer: 0 },
    { q: "10²?", options: ["20", "50", "100", "200"], answer: 2 },
    { q: "5³?", options: ["25", "50", "125", "100"], answer: 2 },
    { q: "Gravity?", options: ["9.8", "10", "8", "7"], answer: 0 },
    { q: "Light speed?", options: ["3x10^8", "2x10^8", "1x10^8", "5x10^8"], answer: 0 },
    { q: "Symbol of Na?", options: ["Sodium", "Nitrogen", "Neon", "None"], answer: 0 },
    { q: "Energy unit?", options: ["Joule", "Volt", "Ampere", "Meter"], answer: 0 },
    { q: "pH neutral?", options: ["7", "5", "10", "3"], answer: 0 }
  ]

};

let current = 0;
let answers = [];

window.onload = function () {
  const cls = localStorage.getItem("testClass");
  if (!cls) return;

  window.questions = questionBank[cls];
  answers = new Array(questions.length).fill(null);

  document.getElementById("testTitle").innerText =
    "Class " + cls + " Test";

  loadQuestion();
};

// LOAD QUESTION
function loadQuestion() {
  const q = questions[current];

  document.getElementById("question").innerText = q.q;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;

    if (answers[current] === i) btn.classList.add("selected");

    btn.onclick = () => {
      answers[current] = i;
      loadQuestion();
    };

    optionsDiv.appendChild(btn);
  });
}

// NAVIGATION
function nextQuestion() { if (current < questions.length - 1) { current++; loadQuestion(); } }
function prevQuestion() { if (current > 0) { current--; loadQuestion(); } }

// SUBMIT
function submitTest() {
  let score = 0;

  questions.forEach((q, i) => {
    if (answers[i] === q.answer) score++;
  });

  const result = {
    name: localStorage.getItem("studentName"),
    class: localStorage.getItem("testClass"),
    score: score,
    total: questions.length,
    date: new Date().toLocaleString()
  };

  let results = JSON.parse(localStorage.getItem("results")) || [];
  results.push(result);
  localStorage.setItem("results", JSON.stringify(results));

  document.getElementById("resultBox").innerHTML =
    `🎉 ${result.name}<br>Score: ${score}/${questions.length}`;

  showLeaderboard();
}

// LEADERBOARD
function showLeaderboard() {
  const results = JSON.parse(localStorage.getItem("results")) || [];

  results.sort((a, b) => b.score - a.score);

  let html = "<h3>🏆 Leaderboard</h3>";

  results.slice(0, 5).forEach((r, i) => {
    html += `<p>${i + 1}. ${r.name} - ${r.score}/${r.total}</p>`;
  });

  document.getElementById("resultBox").innerHTML += html;
}