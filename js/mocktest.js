const TEST_DURATION = 600;
let timeLeft = TEST_DURATION;
let timerInterval;

function clean(value) {
  return value ? value.replace(/"/g, "").trim() : "";
}

function getStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function startTest(cls) {

  const name = document.getElementById("studentName").value.trim();

  if (!name) {
    alert("Enter your name");
    return;
  }

  const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTy7rxJ4jHwrDtTbfXXnJIabVXYbbZrUCM6SrQg-DiFrrhuaAzWSqP-rswa1EHDQrTHT24BsH4VhSCU/pub?output=csv";

  try {

    const res = await fetch(sheetURL);

    // ✅ FIX 1: Check response
    if (!res.ok) throw new Error("Network response failed");

    const data = await res.text();

    if (!data) throw new Error("Empty sheet data");

    const rows = data.split("\n").slice(1);

    let found = false;

    for (let row of rows) {

      if (!row.trim()) continue;

      const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      if (!cols) continue;

      const studentName = clean(cols[1]).toLowerCase();
      const studentClass = clean(cols[8]);

      // ✅ FIX 2: Normalize class
      const normalizedClass = studentClass
        .replace(/\s+/g, "")
        .toLowerCase();

      const expectedClass = `class${cls}`;

      if (
        studentName === name.toLowerCase() &&
        normalizedClass.includes(expectedClass)
      ) {
        found = true;
        break; // ✅ IMPORTANT
      }
    }

    // ✅ FIX 3: If not found
    if (!found) {
      alert("❌ You are not registered OR class mismatch!\nPlease take admission first.");
      window.location.href = "contact.html";
      return;
    }

    // ✅ PASS → START TEST
    localStorage.setItem("studentName", name);
    localStorage.setItem("testClass", cls);
    localStorage.removeItem("answers");
    localStorage.removeItem("questions");

    window.location.href = "test.html";

  } catch (err) {

    console.error("FETCH ERROR:", err);

    // ✅ Better user message
    alert("⚠️ Unable to verify registration.\nPlease check internet or try again.");
  }
}

/* SAMPLE QUESTIONS (10 EACH) */
const questionBank = {
  "8": [
    { q: "2+2=?", options: ["3", "4", "5", "6"], answer: 1 },
    { q: "5+5=?", options: ["8", "9", "10", "11"], answer: 2 },
    { q: "6*2=?", options: ["10", "12", "14", "16"], answer: 1 },
    { q: "9/3=?", options: ["2", "3", "4", "5"], answer: 1 },
    { q: "Square of 3?", options: ["6", "9", "12", "15"], answer: 1 },
    { q: "Cube of 2?", options: ["4", "8", "6", "10"], answer: 1 },
    { q: "7+8=?", options: ["14", "15", "16", "17"], answer: 1 },
    { q: "10-4=?", options: ["5", "6", "7", "8"], answer: 1 },
    { q: "3*4=?", options: ["10", "11", "12", "13"], answer: 2 },
    { q: "12/4=?", options: ["2", "3", "4", "5"], answer: 1 }
  ],

  "9": [
    { q: "3²=?", options: ["6", "9", "12", "15"], answer: 1 },
    { q: "10/2=?", options: ["2", "3", "5", "8"], answer: 2 },
    { q: "5*3=?", options: ["10", "15", "20", "25"], answer: 1 },
    { q: "Square of 4?", options: ["8", "16", "20", "12"], answer: 1 },
    { q: "9-3=?", options: ["3", "6", "9", "12"], answer: 1 },
    { q: "Cube of 2?", options: ["4", "8", "6", "10"], answer: 1 },
    { q: "15+5=?", options: ["10", "20", "25", "30"], answer: 1 },
    { q: "12/3=?", options: ["2", "4", "6", "3"], answer: 1 },
    { q: "7*2=?", options: ["12", "14", "16", "18"], answer: 1 },
    { q: "20-5=?", options: ["10", "15", "20", "25"], answer: 1 }
  ],

  "10": [
    { q: "H2O is?", options: ["Water", "Gas", "Oxygen", "Hydrogen"], answer: 0 },
    { q: "Speed formula?", options: ["d/t", "t/d", "m*v", "none"], answer: 0 },
    { q: "Force unit?", options: ["Newton", "Joule", "Watt", "Pascal"], answer: 0 },
    { q: "10²=?", options: ["20", "50", "100", "200"], answer: 2 },
    { q: "5³=?", options: ["25", "50", "125", "100"], answer: 2 },
    { q: "Gravity value?", options: ["9.8", "10", "8", "7"], answer: 0 },
    { q: "Light speed?", options: ["3x10^8", "2x10^8", "1x10^8", "5x10^8"], answer: 0 },
    { q: "Na is?", options: ["Sodium", "Nitrogen", "Neon", "None"], answer: 0 },
    { q: "Energy unit?", options: ["Joule", "Volt", "Ampere", "Meter"], answer: 0 },
    { q: "pH neutral?", options: ["7", "5", "10", "3"], answer: 0 }
  ]
};

let current = 0, answers = [];


function initTest() {
  timeLeft = TEST_DURATION; // 👈 FIX
  current = 0;
  const cls = localStorage.getItem("testClass");

  // ✅ STEP 9 included here
  if (!cls) {
    window.location.href = "mocktest.html";
    return;
  }

  const savedName = localStorage.getItem("studentName");

  const nameInput = document.getElementById("studentName");
  if (nameInput && savedName) {
    nameInput.value = savedName;
  }

  let storedQuestions = JSON.parse(localStorage.getItem("questions"));

  if (storedQuestions) {
    window.questions = storedQuestions;
  } else {
    window.questions = [...questionBank[cls]];
    questions.sort(() => Math.random() - 0.5);
    localStorage.setItem("questions", JSON.stringify(questions));
  }

  const savedAnswers = JSON.parse(localStorage.getItem("answers"));
  answers = savedAnswers || new Array(questions.length).fill(null);

  const titleEl = document.getElementById("testTitle");
  if (titleEl) {
    titleEl.innerText = "Class " + cls + " Test";
  }

  loadQuestion();
  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    document.getElementById("timer").innerText =
      `⏱ Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    timeLeft--;

    // Auto submit when time ends
    if (timeLeft < 0) {
      clearInterval(timerInterval);
      alert("Time up!");
      submitTest();
    }

  }, 1000);
}

function loadQuestion() {

  const q = questions[current];
  document.getElementById("question").innerText = q.q;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  // 🔁 Create options
  q.options.forEach((opt, i) => {

    const btn = document.createElement("button");
    btn.innerText = opt;

    // ✅ Highlight selected option
    if (answers[current] === i) {
      btn.classList.add("selected");
    }

    // ✅ Handle click
    btn.onclick = () => {
      answers[current] = i;

      // Save progress
      localStorage.setItem("answers", JSON.stringify(answers));

      loadQuestion();
    };

    optionsDiv.appendChild(btn);
  });

  const attempted = answers.filter(a => a !== null).length;

  document.getElementById("progressBar").style.width =
    ((current + 1) / questions.length) * 100 + "%";

  document.getElementById("progressText").innerText =
    `${attempted}/${questions.length} Attempted`;
}

function nextQuestion() { if (current < questions.length - 1) { current++; loadQuestion(); } }
function prevQuestion() { if (current > 0) { current--; loadQuestion(); } }

function submitTest() {

  if (!confirm("Are you sure you want to submit?")) return;

  if (document.querySelector(".submit-btn").disabled) return;

  clearInterval(timerInterval);

  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.answer) score++;
  });

  const name = localStorage.getItem("studentName");
  const cls = localStorage.getItem("testClass");

  // ✅ UNIQUE ID
  const id = Date.now();

  const resultData = {
    id: id,
    name: name,
    class: cls,
    score: score,
    total: questions.length,
    date: new Date().toLocaleString()
  };

  document.getElementById("resultBox").innerHTML =
    `<h3>🎉 Score: ${score}/${questions.length}</h3>`;

  // ✅ SAVE TO GOOGLE SHEET
  fetch("https://script.google.com/macros/s/AKfycbzKJtUGjkMVRIOkJ7AcXSYLlZSDzdoDqPm7rUV0fIWExWSqqZD_FftHi_1Y2tzy6JnQ/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(resultData)
  })
    .then(() => console.log("Saved with ID:", id))
    .catch(err => console.error(err));

  document.querySelectorAll("#options button").forEach(btn => {
    btn.disabled = true;
  });

  localStorage.removeItem("answers");
  localStorage.removeItem("testClass");
  localStorage.removeItem("questions");
}

document.addEventListener("DOMContentLoaded", () => {

  // ✅ Run ONLY on test page
  if (document.getElementById("question")) {
    initTest();
  }

});