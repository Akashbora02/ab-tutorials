// ===============================
// LOAD NAVBAR + FOOTER
// ===============================
function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  fetch(file)
    .then(res => res.text())
    .then(data => el.innerHTML = data);
}

// ===============================
// PAGE LOAD
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  loadComponent("navbar", "components/navbar.html");
  loadComponent("footer", "components/footer.html");

  loadSheetData();
  setupFilters();
});

// ===============================
// GOOGLE SHEET DATA
// ===============================
function loadSheetData() {
  const table = document.getElementById("studentTable");
  if (!table) return;

  const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTy7rxJ4jHwrDtTbfXXnJIabVXYbbZrUCM6SrQg-DiFrrhuaAzWSqP-rswa1EHDQrTHT24BsH4VhSCU/pub?output=csv";

  fetch(sheetURL)
    .then(res => res.text())
    .then(data => {

      const rows = data.split("\n").slice(1);

      let html = "";
      let count = 0;

      const classCount = {}; // for chart

      rows.forEach(row => {
        if (!row.trim()) return;

        const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

        if (cols && cols.length >= 5) {
          count++;

          // ✅ CORRECT INDEXES
          const name = clean(cols[1]);
          const phone = clean(cols[5]);
          const studentClass = clean(cols[8]);

          // count classes
          classCount[studentClass] = (classCount[studentClass] || 0) + 1;

          html += `
            <tr>
              <td>${name}</td>
              <td>${phone}</td>
              <td>${studentClass}</td>
              <td><span class="badge bg-success">Active</span></td>
            </tr>
          `;
        }
      });

      table.innerHTML = html || "<tr><td colspan='4'>No Data</td></tr>";
      document.getElementById("totalStudents").innerText = count;

      // ✅ Latest class (last row)
      if (rows.length > 0) {
        const validRows = rows.filter(r => r.trim());

        const lastRow = validRows[validRows.length - 1];

        const cols = lastRow.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

        if (cols && cols.length >= 9) {
          const latestClass = clean(cols[8]); // ✅ CORRECT
          document.getElementById("latestClass").innerText = latestClass;
        }
      }
      function formatClass(cls) {
        return cls.replace("Class ", "").replace(" (Grade ", "").replace(")", "") + "th";
      }
      // ✅ Show chart
      showChart(classCount);

    })
    .catch(err => {
      console.error(err);
      table.innerHTML =
        "<tr><td colspan='4' class='text-danger text-center'>Error loading data</td></tr>";
    });
}

// ===============================
// CLEAN FUNCTION
// ===============================
function clean(value) {
  return value.replace(/"/g, "").trim();
}

// ===============================
// FILTER SYSTEM
// ===============================
function setupFilters() {
  const filter = document.getElementById("classFilter");
  if (!filter) return;

  filter.addEventListener("change", () => {
    filterByClass(filter.value);
  });
}

function filterByClass(selected) {
  const rows = document.querySelectorAll("#studentTable tr");

  rows.forEach(row => {
    const cls = row.children[2]?.innerText;
    row.style.display = (!selected || cls === selected) ? "" : "none";
  });
}

// ===============================
// CHART (CLASS COUNT)
// ===============================
function showChart(classCount) {
  const canvas = document.getElementById("chart");
  if (!canvas) return;

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: Object.keys(classCount),
      datasets: [{
        label: "Students per Class",
        data: Object.values(classCount)
      }]
    }
  });
}

// ===============================
// LOGIN
// ===============================
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "1234") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password");
  }
}

// ===============================
// LOGOUT
// ===============================
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

// ===============================
// COUNTER ANIMATION
// ===============================
function startCounter() {
  const counters = document.querySelectorAll('.counter');
  let started = false;

  function runCounter() {
    if (started) return;

    counters.forEach(counter => {
      counter.innerText = '0';
      const target = +counter.getAttribute('data-target');

      const update = () => {
        const count = +counter.innerText;
        const increment = target / 100;

        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(update, 20);
        } else {
          counter.innerText = target;
        }
      };

      update();
    });

    started = true;
  }

  window.addEventListener("scroll", () => {
    const section = document.querySelector(".counter");
    if (!section) return;

    const sectionTop = section.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (sectionTop < screenHeight - 100) {
      runCounter();
    }
  });
}