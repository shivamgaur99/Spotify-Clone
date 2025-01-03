// Select elements
const playButton = document.querySelector(".player-control-icon:nth-child(3)");
const progressBar = document.querySelector(".progress-bar");
const soundBar = document.querySelector(".sound-bar");
const currTime = document.getElementById("curr-time");
const totTime = document.getElementById("tot-time");
const muteButton = document.getElementById("mute-button");
const backwardButton = document.getElementById("backward-button");
const forwardButton = document.getElementById("forward-button");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const shuffleButton = document.getElementById("shuffle-button");
const repeatButton = document.getElementById("repeat-button");

// Array of tracks
const tracks = [
  "./assets/sample.mp3",
  "./assets/sample1.mp3",
  "./assets/sample2.mp3",
];
let shuffledTracks = [...tracks]; // Copy of the original tracks
let playedTracks = []; // To keep track of played songs
// Get saved state from localStorage
let currentTrackIndex =
  parseInt(localStorage.getItem("currentTrackIndex")) || 0;
let isMuted = localStorage.getItem("isMuted") === "true";
let isPlaying = false;
let isShuffle = false; // Shuffle mode state
let repeatMode = 0; // Repeat mode: 0 - no repeat, 1 - repeat track, 2 - repeat playlist

// Create a new audio element
let currentAudio = new Audio(tracks[currentTrackIndex]);

// Load metadata for the first track and set mute state
currentAudio.addEventListener("loadedmetadata", () => {
  totTime.textContent = formatTime(currentAudio.duration);

  // Always reset to unmuted state after page refresh
  isMuted = false;
  currentAudio.muted = isMuted;

  // Update the mute button to show "unmute" icon
  muteButton.src = "./assets/controls_icon_unmute.png";

  // Save the unmuted state in localStorage
  localStorage.setItem("isMuted", isMuted);
});

// Play/Pause toggle
playButton.addEventListener("click", () => {
  if (isPlaying) {
    currentAudio.pause();
    playButton.src = "./assets/player_icon3.png";
  } else {
    currentAudio.play();
    playButton.src = "./assets/pause-button-icon.png";
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
  isMuted = !isMuted;
  currentAudio.muted = isMuted;
  updateMuteButtonIcon();
  localStorage.setItem("isMuted", isMuted);
});

// Update mute button icon
function updateMuteButtonIcon() {
  muteButton.src = isMuted
    ? "./assets/controls_icon_mute.png"
    : "./assets/controls_icon_unmute.png";
}

// Load and play current track
function loadTrack() {
  currentAudio.pause();
  currentAudio = new Audio(tracks[currentTrackIndex]);
  currentAudio.muted = isMuted;
  localStorage.setItem("currentTrackIndex", currentTrackIndex);

  currentAudio.addEventListener("loadedmetadata", () => {
    totTime.textContent = formatTime(currentAudio.duration);
    currentAudio.play();
    playButton.src = "./assets/pause-button-icon.png";
    isPlaying = true;
    updateMuteButtonIcon();
  });

  currentAudio.addEventListener("timeupdate", () => {
    const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
    progressBar.value = progress;
    currTime.textContent = formatTime(currentAudio.currentTime);
  });

  currentAudio.addEventListener("ended", () => {
    if (repeatMode === 1) {
      currentAudio.currentTime = 0; // Repeat the current track
      currentAudio.play();
    } else if (repeatMode === 2) {
      nextTrack(); // Repeat playlist mode
    } else if (isShuffle) {
      nextTrack(); // Shuffle mode
    } else if (currentTrackIndex < tracks.length - 1) {
      nextTrack(); // Regular progression to the next track
    }
  });
}

// Shuffle functionality
shuffleButton.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleButton.classList.toggle("active", isShuffle); // Indicate active state visually
  if (isShuffle) {
    shufflePlaylist(); // Shuffle tracks when shuffle is enabled
  }
  shuffleButton.src = isShuffle
    ? "./assets/shuffle_active.png"
    : "./assets/player_icon1.png";
});

// Shuffle an array
function shufflePlaylist() {
  shuffledTracks = [...tracks];
  playedTracks = []; // Reset played tracks when shuffling
  for (let i = shuffledTracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledTracks[i], shuffledTracks[j]] = [
      shuffledTracks[j],
      shuffledTracks[i],
    ];
  }
}

// Repeat functionality
repeatButton.addEventListener("click", () => {
  repeatMode = (repeatMode + 1) % 3; // Cycle through repeat modes
  updateRepeatButtonIcon();
});

// Update repeat button icon
function updateRepeatButtonIcon() {
  if (repeatMode === 0) {
    repeatButton.src = "./assets/repeat_off_icon.png";
  } else if (repeatMode === 1) {
    repeatButton.src = "./assets/repeat_one_icon.png";
  } else {
    repeatButton.src = "./assets/repeat_playlist_icon.png";
  }
}

// Next track (modified for shuffle)
nextButton.addEventListener("click", nextTrack);

function nextTrack() {
  if (isShuffle) {
    if (playedTracks.length === shuffledTracks.length) {
      // All tracks have been played, shuffle again
      shufflePlaylist();
    }

    // Pick a random track that hasn't been played yet
    let randomTrackIndex;
    do {
      randomTrackIndex = Math.floor(Math.random() * shuffledTracks.length);
    } while (playedTracks.includes(randomTrackIndex));

    playedTracks.push(randomTrackIndex); // Add the track to played list
    currentTrackIndex = randomTrackIndex;
  } else {
    // Regular next track progression
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  }

  loadTrack();
}

// Previous track (modified for shuffle)
prevButton.addEventListener("click", () => {
  if (isShuffle) {
    if (playedTracks.length === shuffledTracks.length) {
      // All tracks have been played, shuffle again
      shufflePlaylist();
    }

    // Pick a random track that hasn't been played yet
    let randomTrackIndex;
    do {
      randomTrackIndex = Math.floor(Math.random() * shuffledTracks.length);
    } while (playedTracks.includes(randomTrackIndex));

    playedTracks.push(randomTrackIndex); // Add to played list
    currentTrackIndex = randomTrackIndex;
  } else {
    // Regular previous track progression
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  }

  loadTrack();
});

// Forward Button: Skip 10 seconds
forwardButton.addEventListener("click", () => {
  currentAudio.currentTime = Math.min(
    currentAudio.currentTime + 10,
    currentAudio.duration
  );
});

// Backward Button: Skip 10 seconds
backwardButton.addEventListener("click", () => {
  currentAudio.currentTime = Math.max(currentAudio.currentTime - 10, 0);
});

// Format time utility
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

// Load initial track
loadTrack();
