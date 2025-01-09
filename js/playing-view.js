// Select the control icon and playing view
const controlIcon = document.getElementById('controlIcon');
const playingView = document.getElementById('playingView');
const closeBtn = document.getElementById('close-playing-view');

// Function to toggle the visibility of the playing view
controlIcon.addEventListener('click', () => {
  playingView.classList.toggle('hidden'); // Toggle the hidden class on click
});

// Close button event listener
closeBtn.addEventListener('click', () => {
  playingView.classList.add('hidden'); // Add the hidden class to hide the playing view
});
