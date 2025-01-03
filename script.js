// Select elements
const playButton = document.querySelector(".player-control-icon:nth-child(3)");
const progressBar = document.querySelector(".progress-bar");
const soundBar = document.querySelector(".sound-bar");
const currTime = document.getElementById("curr-time");
const totTime = document.getElementById("tot-time");

// Variables
let isPlaying = false;
let currentAudio = new Audio("./assets/sample.mp3"); // Replace with your audio file path
currentAudio.addEventListener("loadedmetadata", () => {
  totTime.textContent = formatTime(currentAudio.duration);
});

// Play/Pause toggle
playButton.addEventListener("click", () => {
  if (isPlaying) {
    currentAudio.pause();
    playButton.src = "./assets/player_icon3.png"; // Replace with play icon
  } else {
    currentAudio.play();
    playButton.src = "./assets/pause-button-icon.png"; // Replace with pause icon
  }
  isPlaying = !isPlaying;
});

// Update progress bar
currentAudio.addEventListener("timeupdate", () => {
  const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
  progressBar.value = progress;
  currTime.textContent = formatTime(currentAudio.currentTime);
});

// Seek functionality
progressBar.addEventListener("input", () => {
  const seekTime = (progressBar.value / 100) * currentAudio.duration;
  currentAudio.currentTime = seekTime;
});

// Volume control
soundBar.addEventListener("input", () => {
  currentAudio.volume = soundBar.value / 100;
});

// Utility function to format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}
