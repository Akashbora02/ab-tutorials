// ✅ LOAD NAVBAR + FOOTER
function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  fetch(file)
    .then(res => res.text())
    .then(data => {
      el.innerHTML = data;
    });
}

// RUN AFTER PAGE LOAD
window.addEventListener("DOMContentLoaded", () => {
  loadComponent("navbar", "components/navbar.html");
  loadComponent("footer", "components/footer.html");

  startCounter();
  loadSheetData();
});

// ✅ COUNTER ANIMATION
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

// ✅ LOAD GOOGLE SHEET DATA
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

      rows.forEach(row => {
        const cols = row.split(",");

        if (cols.length > 3) {
          count++;

          html += `
            <tr>
              <td>${cols[1]}</td>
              <td>${cols[2]}</td>
              <td>${cols[3]}</td>
              <td><span class="badge bg-success">New</span></td>
            </tr>
          `;
        }
      });

      table.innerHTML = html;
      document.getElementById("totalStudents").innerText = count;

      if (rows.length > 0) {
        const last = rows[rows.length - 1].split(",");
        document.getElementById("latestClass").innerText = last[3];
      }

    })
    .catch(() => {
      table.innerHTML =
        "<tr><td colspan='4' class='text-danger text-center'>Error loading data</td></tr>";
    });
}

// ✅ LOGIN
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

// ✅ LOGOUT
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}