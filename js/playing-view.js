// Select the control icon and playing view
const controlIcon = document.getElementById('controlIcon');
const playingView = document.getElementById('playingView');
const closeBtn = document.getElementById('close-playing-view');


const isSmallDevice = window.innerWidth <= 600; // Check if the device is small

// Initially hide the playing view on small devices
if (isSmallDevice) {
  playingView.classList.add('hidden');
} else {
  playingView.classList.remove('hidden');
}

controlIcon.addEventListener('click', () => {
  playingView.classList.toggle('hidden'); 
  if (playingView.classList.contains('hidden')) {
    controlIcon.src = './assets/playing-view.png'; 
  } else {
    controlIcon.src = './assets/now-playing-view.png';
  }
});

// Close button event listener
closeBtn.addEventListener('click', () => {
  playingView.classList.add('hidden'); 
});
