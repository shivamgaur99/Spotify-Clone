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
const cardsContainer = document.getElementById("cards-container");
const albumPicture = document.getElementById("album-picture");
const albumTitle = document.getElementById("album-title");
const albumArtist = document.getElementById("album-artist");

const tracks = [
  {
    title: "Top 50 - Global",
    info: "Your daily updates of the most played...",
    image: "./assets/card1img.jpeg",
    audio: "./assets/sample.mp3",
  },
  {
    title: "Top 50 - India",
    info: "The most trending music in India.",
    image: "./assets/card2img.jpeg",
    audio: "./assets/sample1.mp3",
  },
  {
    title: "Top 50 - USA",
    info: "The top charts from USA.",
    image: "./assets/card3img.jpeg",
    audio: "./assets/sample2.mp3",
  },
  {
    title: "Top 50 - UK",
    info: "The UK’s hottest tracks of the week.",
    image: "./assets/card4img.jpeg",
    audio: "./assets/sample.mp3",
  },
  {
    title: "Top 50 - Australia",
    info: "Australia's trending music.",
    image: "./assets/card5img.jpeg",
    audio: "./assets/sample1.mp3",
  },
  {
    title: "Top 50 - France",
    info: "The top French songs right now.",
    image: "./assets/card6img.jpeg",
    audio: "./assets/sample2.mp3",
  },
];

let activePlayPauseButton = null;

function generateCards() {
  tracks.forEach((track, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = track.image;
    img.alt = track.title;
    img.classList.add("card-image");

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const title = document.createElement("h3");
    title.textContent = track.title;
    title.classList.add("card-title");

    const info = document.createElement("p");
    info.textContent = track.info;
    info.classList.add("card-info");

    const playPauseButton = document.createElement("button");
    playPauseButton.textContent = "Play";
    playPauseButton.classList.add("play-icon");

    playPauseButton.addEventListener("click", () => {
      if (isPlaying && currentTrackIndex === index) {
        currentAudio.pause();
        playPauseButton.textContent = "Play";
        playButton.src = "./assets/player_icon3.png";
        isPlaying = false;
      } else {
        // Reset the previous play/pause button if it exists
        if (
          activePlayPauseButton &&
          activePlayPauseButton !== playPauseButton
        ) {
          activePlayPauseButton.textContent = "Play";
        }

        currentTrackIndex = index; // Update track index
        loadTrack(); // Load and play the selected track
        playPauseButton.textContent = "Pause"; // Update button text
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
    cardsContainer.appendChild(card);
  });
}

// Call the function to generate the cards
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

  // Always reset to unmuted state after page refresh
  isMuted = false;
  currentAudio.muted = isMuted;

  // Update the mute button to show "unmute" icon
  muteButton.src = "./assets/controls_icon_unmute.png";

  soundBar.value = volume * 100; // Set saved volume
  currentAudio.volume = volume;

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
  currTime.textContent = formatTime(currentAudio.currentTime);
  localStorage.setItem("currentTime", currentAudio.currentTime);
});

// Seek functionality
progressBar.addEventListener("input", () => {
  const seekTime = (progressBar.value / 100) * currentAudio.duration;
  currentAudio.currentTime = seekTime;
  localStorage.setItem("currentTime", currentAudio.currentTime);
});

// Volume control
soundBar.addEventListener("input", () => {
  if (!isMuted) {
    currentAudio.volume = soundBar.value / 100;
    localStorage.setItem("volume", currentAudio.volume);
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
  currentAudio.pause();
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

  currentAudio.addEventListener("loadedmetadata", () => {
    totTime.textContent = formatTime(currentAudio.duration);
    currentAudio.play();
    playButton.src = isPlaying
      ? "./assets/pause-button-icon.png"
      : "./assets/player_icon3.png";
    updateMuteButtonIcon(); // Update mute button state
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
