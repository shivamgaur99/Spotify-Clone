import { tracks } from "./tracks.js";
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
const albumPicture = document.getElementById("album-picture");
const albumTitle = document.getElementById("album-title");
const albumArtist = document.getElementById("album-artist");
const albumIcon = document.getElementById("album-icon1");
const carousel = document.getElementById("carousel");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let activePlayPauseButton = null;

const tracksPerScroll = 1;

function generateCards() {
  carousel.innerHTML = "";

  tracks.forEach((track, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = track.image;
    img.alt = track.title;
    img.classList.add("card-img");

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const title = document.createElement("h3");
    title.textContent = track.title;
    title.classList.add("card-title");

    const info = document.createElement("p");
    info.textContent = track.info;
    info.classList.add("card-info");

    const playPauseButton = document.createElement("button");
    playPauseButton.classList.add("play-icon");
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';

    playPauseButton.addEventListener("click", () => {
      if (isPlaying && currentTrackIndex === index) {
        currentAudio.pause();
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Show play icon
        playButton.src = "./assets/player_icon3.png";
        isPlaying = false;
      } else {
        // Reset the previous play/pause button if it exists
        if (
          activePlayPauseButton &&
          activePlayPauseButton !== playPauseButton
        ) {
          activePlayPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Show play icon
        }

        currentTrackIndex = index; // Update track index
        loadTrack(); // Load and play the selected track
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Show pause icon
        playButton.src = "./assets/pause-button-icon.png";
        isPlaying = true;

        activePlayPauseButton = playPauseButton; // Update the active button
      }
      localStorage.setItem("currentTrackIndex", currentTrackIndex);
    });

    cardContent.appendChild(title);
    cardContent.appendChild(info);
    cardContent.appendChild(playPauseButton);
    card.appendChild(img);
    card.appendChild(cardContent);
    carousel.appendChild(card);
  });

  updateButtons();
}

// Scroll carousel to the next set of cards
nextBtn.addEventListener("click", () => {
  const cardWidth = document.querySelector(".card").offsetWidth;
  const scrollAmount = cardWidth * tracksPerScroll + 20 * tracksPerScroll; // Include gap
  carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  setTimeout(updateButtons, 500); // Update buttons after scrolling
});

// Scroll carousel to the previous set of cards
prevBtn.addEventListener("click", () => {
  const cardWidth = document.querySelector(".card").offsetWidth;
  const scrollAmount = cardWidth * tracksPerScroll + 20 * tracksPerScroll; // Include gap
  carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  setTimeout(updateButtons, 500); // Update buttons after scrolling
});

// Disable/enable navigation buttons based on the scroll position
function updateButtons() {
  prevBtn.disabled = carousel.scrollLeft === 0;
  nextBtn.disabled =
    Math.ceil(carousel.scrollLeft + carousel.offsetWidth) >=
    carousel.scrollWidth;
}

// Generate the initial carousel
generateCards();

let shuffledTracks = [...tracks];
let playedTracks = [];
let currentTrackIndex =
  parseInt(localStorage.getItem("currentTrackIndex")) || 0;
let isMuted = localStorage.getItem("isMuted") === "true";
let isPlaying = false;
let isShuffle = localStorage.getItem("isShuffle") === "true"; // Load shuffle state
let repeatMode = parseInt(localStorage.getItem("repeatMode")) || 0; // Load repeat mode state
let currentTime = parseFloat(localStorage.getItem("currentTime")) || 0;
let volume = parseFloat(localStorage.getItem("volume")) || 1; // Load saved volume
// Create a new audio element
let currentAudio = new Audio(tracks[currentTrackIndex].audio);
currentAudio.currentTime = currentTime;
currentAudio.volume = volume; // Set initial volume from localStorage

// Load metadata for the first track and set mute state
currentAudio.addEventListener("loadedmetadata", () => {
  totTime.textContent = formatTime(currentAudio.duration);

  if (isPlaying) {
    currentAudio.play(); // Ensure it plays if it's in play state
  }
  // Always reset to unmuted state after page refresh
  isMuted = false;
  currentAudio.muted = isMuted;

  // Update the mute button to show "unmute" icon
  muteButton.src = "./assets/controls_icon_unmute.png";

  soundBar.value = volume * 100; // Set saved volume
  currentAudio.volume = volume;
  const volumeProgress = soundBar.value; // Get the current value (0 to 100)
  soundBar.style.background = `linear-gradient(to right, white ${volumeProgress}%, #333 ${volumeProgress}%)`;
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
  localStorage.setItem("isPlaying", isPlaying);
});

// Update progress bar
currentAudio.addEventListener("timeupdate", () => {
  const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
  progressBar.value = progress;
  progressBar.style.background = `linear-gradient(to right, white ${progress}%, #333 ${progress}%)`;
  currTime.textContent = formatTime(currentAudio.currentTime);
  localStorage.setItem("currentTime", currentAudio.currentTime);
});

// progressBar.addEventListener("mouseenter", () => {
//   const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
//   const thumbPosition = progressBar.value;
//   progressBar.style.transition = "background 0.3s ease"; // Smooth transition
//   progressBar.style.background = `linear-gradient(to right, #1bd760 ${thumbPosition}%, #333 ${thumbPosition}%, #1bd760 ${progress}%, #333 ${progress}%)`;
// });

// progressBar.addEventListener("mouseleave", () => {
//   const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
//   const thumbPosition = progressBar.value;
//   progressBar.style.transition = "background 0.3s ease"; // Smooth transition
//   progressBar.style.background = `linear-gradient(to right, white ${thumbPosition}%, #333 ${thumbPosition}%, #333 ${progress}%)`;
// });

// Seek functionality
progressBar.addEventListener("input", () => {
  const seekTime = (progressBar.value / 100) * currentAudio.duration;
  currentAudio.currentTime = seekTime;
  const progress = progressBar.value; // Get the current value (0 to 100)
  progressBar.style.background = `linear-gradient(to right, #1bd760 ${progress}%, #333 ${progress}%)`;
  localStorage.setItem("currentTime", currentAudio.currentTime);
});

// Volume control
soundBar.addEventListener("input", () => {
  if (!isMuted) {
    currentAudio.volume = soundBar.value / 100;
    localStorage.setItem("volume", currentAudio.volume);
  }
  const volumeProgress = soundBar.value; // Get the current value (0 to 100)
  soundBar.style.background = `linear-gradient(to right, #1bd760 ${volumeProgress}%, #333 ${volumeProgress}%)`;
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

if (localStorage.getItem("heartState") === "filled") {
  albumIcon.classList.remove("far");
  albumIcon.classList.add("fas");
  albumIcon.style.color = "#1bd760"; // Spotify Green
} else {
  albumIcon.classList.remove("fas");
  albumIcon.classList.add("far");
  albumIcon.style.color = "#ccc"; // Default color
}

// Event listener for heart icon click
albumIcon.addEventListener("click", () => {
  // Toggle between filled and hollow heart
  if (albumIcon.classList.contains("far")) {
    albumIcon.classList.remove("far");
    albumIcon.classList.add("fas");
    albumIcon.style.color = "#1bd760"; // Spotify Green
    // Store the filled state in localStorage
    localStorage.setItem("heartState", "filled");
  } else {
    albumIcon.classList.remove("fas");
    albumIcon.classList.add("far");
    albumIcon.style.color = "#ccc"; // Default color
    // Store the hollow state in localStorage
    localStorage.setItem("heartState", "hollow");
  }
});

function updatePlayerUI(trackIndex) {
  const track = tracks[trackIndex];

  // Update album picture, title, and artist info
  albumPicture.src = track.image;
  albumTitle.textContent = track.title;
  albumArtist.textContent = track.info;
}

// Load and play current track
// After loading the track, apply all the saved states
function loadTrack() {
  // Load and play the selected track
  if (currentAudio) {
    currentAudio.pause();
  }
  currentAudio = new Audio(tracks[currentTrackIndex].audio);
  currentAudio.muted = isMuted;
  localStorage.setItem("currentTrackIndex", currentTrackIndex);

  updatePlayerUI(currentTrackIndex);

  // Update the play button based on the saved isPlaying state
  if (isPlaying) {
    playButton.src = "./assets/pause-button-icon.png";
    currentAudio.play();
  } else {
    playButton.src = "./assets/player_icon3.png";
  }

  // Update volume from localStorage
  currentAudio.volume = volume;
  soundBar.value = volume * 100;
  const volumeProgress = soundBar.value; // Get the current value (0 to 100)
  soundBar.style.background = `linear-gradient(to right, white ${volumeProgress}%, #333 ${volumeProgress}%)`;
  currentAudio.addEventListener("loadedmetadata", () => {
    totTime.textContent = formatTime(currentAudio.duration);
    if (isPlaying) {
      currentAudio.play(); // Ensure it plays if it's in play state
    }
    playButton.src = isPlaying
      ? "./assets/pause-button-icon.png"
      : "./assets/player_icon3.png";
    updateMuteButtonIcon(); // Update mute button state
  });

  currentAudio.addEventListener("timeupdate", () => {
    const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
    progressBar.value = progress;
    progressBar.style.background = `linear-gradient(to right, white ${progress}%, #333 ${progress}%)`;
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

  // Update shuffle button
  shuffleButton.classList.toggle("active", isShuffle);
  shuffleButton.src = isShuffle
    ? "./assets/shuffle_active.png"
    : "./assets/player_icon1.png";

  // Update repeat button
  updateRepeatButtonIcon();
}

// Ensure all settings (volume, track, mute, etc.) are initialized correctly on page load
window.addEventListener("load", () => {
  loadTrack();
});

// Shuffle functionality
shuffleButton.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleButton.classList.toggle("active", isShuffle); // Indicate active state visually
  if (isShuffle) {
    shufflePlaylist(); // Shuffle tracks when shuffle is enabled
  }
  localStorage.setItem("isShuffle", isShuffle);
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
  localStorage.setItem("repeatMode", repeatMode);
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
