// Select elements
const playButton = document.querySelector(".player-control-icon:nth-child(3)");
const progressBar = document.querySelector(".progress-bar");
const soundBar = document.querySelector(".sound-bar");
const currTime = document.getElementById("curr-time");
const totTime = document.getElementById("tot-time");
const muteButton = document.getElementById("mute-button"); 
const backwardButton = document.getElementById("backward-button"); // Backward button
const forwardButton = document.getElementById("forward-button"); // Forward button

// Variables
let isPlaying = false;
let isMuted = false;  // Keep track of mute state
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
  if (!isMuted) {
    currentAudio.volume = soundBar.value / 100;
  }
});

// Mute/Unmute functionality
muteButton.addEventListener("click", () => {
  if (isMuted) {
    currentAudio.muted = false; // Unmute
    muteButton.src = "./assets/controls_icon_mute.png"; // Replace with unmute icon
    soundBar.value = currentAudio.volume * 100; // Restore previous volume
  } else {
    currentAudio.muted = true; // Mute
    muteButton.src = "./assets/controls_icon_unmute.png"; // Replace with mute icon
    soundBar.value = 0; // Set volume to 0 when muted
  }
  isMuted = !isMuted;
});

forwardButton.addEventListener("click", () => {
  currentAudio.currentTime = Math.min(currentAudio.currentTime + 10, currentAudio.duration); 
  // Ensure it doesn't exceed the duration
});

// Backward Button: Skip 10 seconds backward
backwardButton.addEventListener("click", () => {
  currentAudio.currentTime = Math.max(currentAudio.currentTime - 10, 0); 
  // Ensure it doesn't go below 0
});

// Utility function to format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}
