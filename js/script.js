// LOAD COMPONENTS
function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => document.getElementById(id).innerHTML = data);
}

window.addEventListener("DOMContentLoaded", () => {
  loadComponent("navbar", "components/navbar.html");
  loadComponent("footer", "components/footer.html");

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

  // 👇 SCROLL DETECTION
  window.addEventListener("scroll", () => {
    const section = document.querySelector(".counter");

    if (!section) return;

    const sectionTop = section.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (sectionTop < screenHeight - 100) {
      runCounter();
    }
  });
});

// LOGIN FUNCTION
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

// LOGOUT FUNCTION
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}