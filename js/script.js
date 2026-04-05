// ===============================
// LOAD COMPONENTS
// ===============================
function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return Promise.resolve();

  return fetch(file)
    .then(res => res.text())
    .then(data => el.innerHTML = data);
}

// ===============================
// PAGE LOAD (FIXED)
// ===============================
window.addEventListener("DOMContentLoaded", async () => {

  // Wait for navbar & footer
  await loadComponent("navbar", "components/navbar.html");
  await loadComponent("footer", "components/footer.html");

  startCounter();
  loadResults();
  setupScrollAnimation();
  loadSheetData();
});

// ===============================
// SCROLL ANIMATION
// ===============================
function setupScrollAnimation() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(sec => observer.observe(sec));
}

// ===============================
// COUNTER
// ===============================
function startCounter() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

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

        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(counters[0]);
}

// ===============================
// LOGIN (simple)
// ===============================
function login() {
  const username = document.getElementById("username")?.value;
  const password = document.getElementById("password")?.value;

  if (username === "admin" && password === "1234") {

    // ✅ Save login
    localStorage.setItem("loggedIn", "true");

    // ✅ Redirect
    window.location.href = "dashboard.html";

  } else {
    alert("Invalid username or password");
  }
}

// ===============================
// LOGOUT
// ===============================
function logout() {
  sessionStorage.removeItem("auth");
  window.location.href = "login.html";
}

// ===============================
// LOAD RESULTS
// ===============================
function loadResults() {
  const table = document.getElementById("resultTable");
  if (!table) return;

  const results = JSON.parse(localStorage.getItem("results")) || [];

  let html = "";

  results.forEach((r, index) => {
    html += `
      <tr>
        <td>${r.name}</td>
        <td>Class ${r.class}</td>
        <td>${r.score}/${r.total}</td>
        <td>${r.date}</td>
        <td>
          <button onclick="deleteResult(${index})" class="btn btn-sm btn-danger">
            Delete
          </button>
        </td>
      </tr>
    `;
  });

  table.innerHTML = html;
}

function deleteResult(index) {
  let results = JSON.parse(localStorage.getItem("results")) || [];
  results.splice(index, 1);
  localStorage.setItem("results", JSON.stringify(results));
  loadResults();
}

// ===============================
// GOOGLE SHEET DATA
// ===============================
let chartInstance = null;

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
      const classCount = {};

      rows.forEach(row => {
        if (!row.trim()) return;

        const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

        if (cols && cols.length >= 9) {
          count++;

          const name = clean(cols[1]);
          const phone = clean(cols[5]);
          const studentClass = clean(cols[8]);

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

      // Latest class
      const validRows = rows.filter(r => r.trim());
      if (validRows.length > 0) {
        const lastRow = validRows[validRows.length - 1];
        const lastCols = lastRow.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

        if (lastCols) {
          document.getElementById("latestClass").innerText = clean(lastCols[8]);
        }
      }

      showChart(classCount);

    })
    .catch(() => {
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
// FILTER
// ===============================
function setupFilters() {
  const filter = document.getElementById("classFilter");
  if (!filter) return;

  filter.addEventListener("change", filterTable);
}

// ===============================
// SEARCH
// ===============================
function setupSearch() {
  const search = document.getElementById("searchInput");
  if (!search) return;

  search.addEventListener("input", filterTable);
}

// ===============================
// FILTER LOGIC
// ===============================
function filterTable() {
  const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const selected = document.getElementById("classFilter")?.value || "";

  const rows = document.querySelectorAll("#studentTable tr");

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    const cls = row.children[2]?.innerText;

    const matchSearch = text.includes(search);
    const matchClass = !selected || cls === selected;

    row.style.display = (matchSearch && matchClass) ? "" : "none";
  });
}

// ===============================
// CHART (PIE)
// ===============================
function showChart(classCount) {
  const ctx = document.getElementById("chart");
  if (!ctx) return;

  // destroy old chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(classCount),
      datasets: [{
        data: Object.values(classCount)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // 👈 IMPORTANT
    }
  });
}
