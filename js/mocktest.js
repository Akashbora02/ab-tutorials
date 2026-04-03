// STORE SELECTED CLASS
function startTest(cls) {
  localStorage.setItem("testClass", cls);
  window.location.href = "test.html";
}

// QUESTION BANK
const questionBank = {

  "8": [
    { q: "2+2?", options: ["3","4","5","6"], answer: 1 },
    { q: "5+5?", options: ["8","9","10","11"], answer: 2 }
  ],

  "9": [
    { q: "What is 3²?", options: ["6","9","12","15"], answer: 1 },
    { q: "10/2?", options: ["2","3","5","6"], answer: 2 }
  ],

  "10": [
    { q: "H2O is?", options: ["Oxygen","Hydrogen","Water","Gas"], answer: 2 },
    { q: "Speed formula?", options: ["d/t","t/d","m*v","none"], answer: 0 }
  ]

};

let current = 0;
let answers = [];

// INIT TEST
window.onload = function () {

  const cls = localStorage.getItem("testClass");

  if (!cls) return;

  document.getElementById("testTitle").innerText =
    "Class " + cls + " Mock Test";

  window.questions = questionBank[cls];
  answers = new Array(questions.length).fill(null);

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

    if (answers[current] === i) {
      btn.style.background = "#0d6efd";
      btn.style.color = "white";
    }

    btn.onclick = () => {
      answers[current] = i;
      loadQuestion();
    };

    optionsDiv.appendChild(btn);
  });
}

// NAVIGATION
function nextQuestion() {
  if (current < questions.length - 1) {
    current++;
    loadQuestion();
  }
}

function prevQuestion() {
  if (current > 0) {
    current--;
    loadQuestion();
  }
}

// SUBMIT + SAVE RESULT
function submitTest() {
  let score = 0;

  questions.forEach((q, i) => {
    if (answers[i] === q.answer) score++;
  });

  const cls = localStorage.getItem("testClass");

  const result = {
    class: cls,
    score: score,
    total: questions.length,
    date: new Date().toLocaleString()
  };

  // SAVE IN LOCAL STORAGE
  let results = JSON.parse(localStorage.getItem("results")) || [];
  results.push(result);
  localStorage.setItem("results", JSON.stringify(results));

  document.getElementById("resultBox").innerHTML =
    `Score: ${score}/${questions.length}`;
}