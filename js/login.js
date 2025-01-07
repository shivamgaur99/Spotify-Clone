// Toggle dropdown menu visibility when clicking on the profile icon
document
  .getElementById("profileIcon")
  .addEventListener("click", function (event) {
    var dropdownMenu = document.getElementById("dropdownMenu");
    // Prevent closing the dropdown when clicking inside the dropdown
    event.stopPropagation();
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });

// Close dropdown if clicked anywhere outside of the dropdown
document.addEventListener("click", function (event) {
  var dropdownMenu = document.getElementById("dropdownMenu");
  var profileIcon = document.getElementById("profileIcon");

  // If the click was outside the profile icon and dropdown, hide the dropdown
  if (!dropdownMenu.contains(event.target) && event.target !== profileIcon) {
    dropdownMenu.style.display = "none";
  }
});

// Handle login state using localStorage
document.getElementById("loginOption").addEventListener("click", function () {
  // Simulate login (you can replace this with actual login logic)
  console.log("Login clicked");
  localStorage.setItem("isLoggedIn", "true");
  updateLibraryState(); // Update UI based on the new login state
});

document.getElementById("logoutOption").addEventListener("click", function () {
  // Simulate logout (you can replace this with actual logout logic)
  console.log("Logout clicked");
  localStorage.setItem("isLoggedIn", "false");
  updateLibraryState(); // Update UI based on the new logout state
});

function updateLibraryState() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    // Show elements for logged-in users
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
    // Show elements for logged-out users
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

// On page load, update based on stored state
document.addEventListener("DOMContentLoaded", function () {
  updateLibraryState();
});
