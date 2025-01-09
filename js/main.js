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
const albumImage = document.getElementById("album-image");
const albumTitle = document.getElementById("album-title");
const albumArtist = document.getElementById("album-artist");
const albumIcon = document.getElementById("album-icon1");
const carousel = document.getElementById("carousel");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const trackVideo = document.getElementById("track-video");
const videoSource = document.getElementById("video-source");
const songTitle = document.getElementById("song-title");
const songInfo = document.getElementById("song-info");

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
        trackVideo.pause();
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
let videoCurrentTime =
  parseFloat(localStorage.getItem("videoCurrentTime")) || 0;
let volume = parseFloat(localStorage.getItem("volume")) || 1.0; // Load saved volume
// Create a new audio element
let currentAudio = new Audio(tracks[currentTrackIndex].audio);
currentAudio.currentTime = currentTime;
currentAudio.volume = volume; // Set initial volume from localStorage
trackVideo.currentTime = videoCurrentTime;
// Load metadata for the first track and set mute state
currentAudio.addEventListener("loadedmetadata", () => {
  totTime.textContent = formatTime(currentAudio.duration);

  if (isPlaying) {
    currentAudio.play(); // Ensure it plays if it's in play state
    trackVideo.play();
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

function updateCardPlayPauseButtons() {
  // Get all card play/pause buttons
  const cardPlayPauseButtons = document.querySelectorAll(".card .play-icon");

  // Loop through each card's play/pause button and update its state
  cardPlayPauseButtons.forEach((button, index) => {
    if (isPlaying && currentTrackIndex === index) {
      button.innerHTML = '<i class="fas fa-pause"></i>'; // Show pause icon
    } else {
      button.innerHTML = '<i class="fas fa-play"></i>'; // Show play icon
    }
  });
}

trackVideo.addEventListener("play", () => {
  isPlaying = true;
  localStorage.setItem("isPlaying", isPlaying);
});

trackVideo.addEventListener("pause", () => {
  isPlaying = false;
  localStorage.setItem("isPlaying", isPlaying);
});

playButton.addEventListener("click", () => {
  if (isPlaying) {
    currentAudio.pause();
    trackVideo.pause(); // Ensure the video is also paused
    playButton.src = "./assets/player_icon3.png"; // Show play icon on mini player
  } else {
    currentAudio.play();
    trackVideo.play(); // Play video if it exists
    playButton.src = "./assets/pause-button-icon.png"; // Show pause icon on mini player
  }

  isPlaying = !isPlaying;
  localStorage.setItem("isPlaying", isPlaying);

  // Update all card play/pause buttons
  updateCardPlayPauseButtons();
});

trackVideo.addEventListener("timeupdate", () => {
  videoCurrentTime = trackVideo.currentTime;
  localStorage.setItem("videoCurrentTime", videoCurrentTime);
});

// Update progress bar
currentAudio.addEventListener("timeupdate", () => {
  const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
  progressBar.value = progress;
  progressBar.style.background = `linear-gradient(to right, white ${progress}%, #333 ${progress}%)`;
  currTime.textContent = formatTime(currentAudio.currentTime);
  localStorage.setItem("currentTime", currentAudio.currentTime);
});

// Seek functionality
progressBar.addEventListener("input", () => {
  const seekTime = (progressBar.value / 100) * currentAudio.duration;
  currentAudio.currentTime = seekTime;
  localStorage.setItem("currentTime", currentAudio.currentTime);
});

// Hover effect for progress bar
progressBar.addEventListener("mouseenter", () => {
  const progress = progressBar.value; // Current progress (0 to 100)
  progressBar.style.transition = "background 0.3s ease"; // Smooth transition
  progressBar.style.background = `linear-gradient(to right, #1bd760 ${progress}%, #555 ${progress}%)`; // Hover effect color
});

progressBar.addEventListener("mouseleave", () => {
  const progress = progressBar.value; // Current progress (0 to 100)
  progressBar.style.transition = "background 0.3s ease"; // Smooth transition
  progressBar.style.background = `linear-gradient(to right, white ${progress}%, #333 ${progress}%)`; // Default color
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

soundBar.addEventListener("mouseenter", () => {
  const volumeProgress = soundBar.value; // Current volume (0 to 100)
  soundBar.style.transition = "background 0.3s ease"; // Smooth transition
  soundBar.style.background = `linear-gradient(to right, #1bd760 ${volumeProgress}%, #555 ${volumeProgress}%)`;
});

soundBar.addEventListener("mouseleave", () => {
  const volumeProgress = soundBar.value; // Current volume (0 to 100)
  soundBar.style.transition = "background 0.3s ease"; // Smooth transition
  soundBar.style.background = `linear-gradient(to right, white ${volumeProgress}%, #333 ${volumeProgress}%)`;
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

  const getFileName = (url) => {
    if (!url) {
      return "";
    }
    return url.split("/").pop();
  };

  if (getFileName(videoSource.src) !== getFileName(track.video)) {
    videoSource.src = track.video || "";
    trackVideo.load();
  }
  if (track.video && track.video.trim() !== "") {
    // Video is valid, show video and hide album image
    trackVideo.style.display = "block"; // Ensure video is visible
    albumImage.style.display = "none"; // Hide album image
  } else {
    // Video is invalid or unavailable, show album image
    trackVideo.style.display = "none"; // Hide video
    albumImage.style.display = "block"; // Show album image
  }

  // Update album image, title, and artist info
  albumImage.src = track.image || ""; // Fallback to empty string if image is missing

  songTitle.textContent = track.title;
  songInfo.textContent = track.info;

  // Update album picture, title, and artist info
  albumPicture.src = track.image;
  albumTitle.textContent = track.title;
  albumArtist.textContent = track.info;
}

// Load and play current track
// After loading the track, apply all the saved states
function loadTrack() {
  // Load and play the selected track
  if (
    currentTrackIndex !== parseInt(localStorage.getItem("currentTrackIndex"))
  ) {
    localStorage.setItem("currentTime", 0);
    videoSource.src = tracks[currentTrackIndex].video || "";
    trackVideo.load();
  }
  if (currentAudio) {
    currentAudio.pause();
    trackVideo.pause();
  }
  currentAudio = new Audio(tracks[currentTrackIndex].audio);
  const savedTime = parseFloat(localStorage.getItem("currentTime")) || 0;
  currentAudio.currentTime = savedTime;
  currentAudio.muted = isMuted;
  localStorage.setItem("currentTrackIndex", currentTrackIndex);

  updatePlayerUI(currentTrackIndex);

  // function normalizeURL(url) {
  //   const a = document.createElement('a');
  //   a.href = url;
  //   return a.href;
  // }

  // if (videoSource.src !== normalizeURL(tracks[currentTrackIndex].video)) {
  //   videoSource.src = tracks[currentTrackIndex].video || "";
  //   trackVideo.load();
  // }

  // Update the play button based on the saved isPlaying state
  if (isPlaying) {
    playButton.src = "./assets/pause-button-icon.png";
    currentAudio.play();
    trackVideo.play();
  } else {
    trackVideo.pause();
    playButton.src = "./assets/player_icon3.png";
  }

  trackVideo.loop = true;

  // Update volume from localStorage
  let volume = parseFloat(localStorage.getItem("volume")) || 0;
  soundBar.value = volume * 100; // Set sound bar position
  currentAudio.volume = volume; // Set the audio element's volume
  const volumeProgress = soundBar.value;
  soundBar.style.background = `linear-gradient(to right, white ${volumeProgress}%, #333 ${volumeProgress}%)`;
  currentAudio.addEventListener("loadedmetadata", () => {
    totTime.textContent = formatTime(currentAudio.duration);
    if (isPlaying) {
      currentAudio.play(); // Ensure it plays if it's in play state
      trackVideo.play();
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
    localStorage.setItem("currentTime", currentAudio.currentTime);
  });

  trackVideo.addEventListener("timeupdate", () => {
    videoCurrentTime = trackVideo.currentTime;
    localStorage.setItem("videoCurrentTime", videoCurrentTime);
  });

  currentAudio.addEventListener("ended", () => {
    localStorage.setItem("currentTime", 0); // Reset saved time
    if (repeatMode === 1) {
      currentAudio.currentTime = 0; // Repeat the current track
      currentAudio.play();
      trackVideo.play();
    } else if (repeatMode === 2) {
      nextTrack(); // Repeat playlist mode
    } else if (isShuffle) {
      nextTrack(); // Shuffle mode
    } else if (currentTrackIndex < tracks.length - 1) {
      nextTrack(); // Regular progression to the next track
    }
  });

  trackVideo.addEventListener("ended", () => {
    if (repeatMode === 1) {
      trackVideo.currentTime = 0;
      trackVideo.play(); // Loop the video
    } else {
      nextTrack(); // Move to the next track
    }
  });

  // Update shuffle button
  shuffleButton.classList.toggle("active", isShuffle);
  shuffleButton.src = isShuffle
    ? "./assets/shuffle_active.png"
    : "./assets/player_icon1.png";

  // Update repeat button
  updateRepeatButtonIcon();
  updateCardPlayPauseButtons();
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
  localStorage.setItem("currentTime", 0);
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
  localStorage.setItem("currentTime", 0);
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
// forwardButton.addEventListener("click", () => {
//   currentAudio.currentTime = Math.min(
//     currentAudio.currentTime + 10,
//     currentAudio.duration
//   );
// });

// Backward Button: Skip 10 seconds
// backwardButton.addEventListener("click", () => {
//   currentAudio.currentTime = Math.max(currentAudio.currentTime - 10, 0);
// });

// Format time utility
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}
