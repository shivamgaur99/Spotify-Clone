const sidebar = document.querySelector(".sidebar");
const resizeHandle = document.querySelector(".resize-handle");

let isResizing = false;

resizeHandle.addEventListener("mousedown", (e) => {
  isResizing = true;
  document.body.style.userSelect = "none"; // Prevent text selection during drag
  document.body.style.cursor = "ew-resize"; // Change cursor during resize
});

document.addEventListener("mousemove", (e) => {
  if (isResizing) {
    const newWidth = e.clientX; // Get the mouse position for resizing
    sidebar.style.width = newWidth + "px"; // Set new width
  }
});

document.addEventListener("mouseup", () => {
  isResizing = false;
  document.body.style.userSelect = ""; // Re-enable text selection after drag
  document.body.style.cursor = ""; // Reset cursor
});
