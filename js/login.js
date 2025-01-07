document
  .getElementById("profileIcon")
  .addEventListener("click", function (event) {
    var dropdownMenu = document.getElementById("dropdownMenu");
    event.stopPropagation();
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });

document.addEventListener("click", function (event) {
  var dropdownMenu = document.getElementById("dropdownMenu");
  var profileIcon = document.getElementById("profileIcon");

  if (!dropdownMenu.contains(event.target) && event.target !== profileIcon) {
    dropdownMenu.style.display = "none";
  }
});

document.getElementById("loginOption").addEventListener("click", function () {
  console.log("Login clicked");
  localStorage.setItem("isLoggedIn", "true");
  updateLibraryState();
});

document.getElementById("logoutOption").addEventListener("click", function () {
  console.log("Logout clicked");
  localStorage.setItem("isLoggedIn", "false");
  updateLibraryState();
});

function updateLibraryState() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    document.querySelectorAll(".islogin").forEach(function (element) {
      element.classList.remove("hidden");
    });
    document.querySelectorAll(".islogout").forEach(function (element) {
      element.classList.add("hidden");
    });
    document.getElementById("loginOption").style.display = "none";
    document.getElementById("logoutOption").style.display = "block";
    document.getElementById("profileOption").style.display = "block";
  } else {
    document.querySelectorAll(".islogin").forEach(function (element) {
      element.classList.add("hidden");
    });
    document.querySelectorAll(".islogout").forEach(function (element) {
      element.classList.remove("hidden");
    });
    document.getElementById("loginOption").style.display = "block";
    document.getElementById("logoutOption").style.display = "none";
    document.getElementById("profileOption").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateLibraryState();
});

document.addEventListener("DOMContentLoaded", () => {
  const hasVisited = localStorage.getItem("hasVisited");

  if (!hasVisited) {
    document.getElementById("login-modal").classList.remove("hidden");
    localStorage.setItem("hasVisited", "true");
  }

  document.getElementById("login-button").addEventListener("click", () => {
    // Redirect to login page
    // window.location.href = "/login";
    window.location.href = "";
    localStorage.setItem("isLoggedIn", "true");
  });

  document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("login-modal").classList.add("hidden");
  });
});
