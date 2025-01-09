const resizeHandle = document.querySelector('.playing-view-resize-handle');
const playingView = document.querySelector('.now-playing-view');

let isResizing = false;
let initialMouseX = 0;
let initialWidth = 0;

resizeHandle.addEventListener("mousedown", (e) => {
  isResizing = true;
  initialMouseX = e.clientX;
  initialWidth = playingView.offsetWidth;
  document.body.style.userSelect = "none";
  document.body.style.cursor = "ew-resize";
});

document.addEventListener("mousemove", (e) => {
  if (isResizing) {
    const mouseDelta = initialMouseX - e.clientX; // Reverse the delta to shrink when dragging right, expand when dragging left
    const newWidth = Math.max(100, Math.min(initialWidth + mouseDelta, 800)); // Apply min/max width constraints
    playingView.style.width = newWidth + "px";
  }
});

document.addEventListener("mouseup", () => {
  isResizing = false;
  document.body.style.userSelect = "";
  document.body.style.cursor = "";
});
