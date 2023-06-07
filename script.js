var cursorTrail;
var lastActivityTime = new Date().getTime();
var inactiveTime = 0;
var trailDuration = 5000; // 5 seconds
var trailPoints = []; // Array to store cursor positions and colors for trail
var cursorStartPosition = { x: 0, y: 0 }; // Store the initial cursor position
var cursorMovedDistance = 0; // Distance moved by the cursor
var maxHue = 240; // Maximum hue value for heatmap color
var bufferZoneDistance = 100; // Distance threshold to enter the buffer zone
var inBufferZone = false;
var lastColor = getColorFromHeatmap(inactiveTime);

// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", function () {
  cursorTrail = document.createElement("div");
  cursorTrail.style.position = "fixed";
  cursorTrail.style.top = "0";
  cursorTrail.style.left = "0";
  cursorTrail.style.pointerEvents = "none";
  cursorTrail.style.zIndex = "9999"; // Ensure the trail is above other elements
  cursorTrail.style.width = "20px";
  cursorTrail.style.height = "20px";
  cursorTrail.style.borderRadius = "100%";
  cursorTrail.style.opacity = "0.5";
  cursorTrail.style.filter = "blur(10px)"; // Add a blur effect
  document.body.appendChild(cursorTrail);
});

// Update cursor trail position
function updateCursorTrail(event) {
  var x = event.clientX;
  var y = event.clientY;

  // Update cursor trail position
  cursorTrail.style.top = y + "px";
  cursorTrail.style.left = x + "px";

  // Calculate the distance moved by the cursor
  var deltaX = x - cursorStartPosition.x;
  var deltaY = y - cursorStartPosition.y;
  cursorMovedDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Reset inactive time and cursor trail position if the cursor moved beyond the threshold distance
  if (cursorMovedDistance >= bufferZoneDistance) {
    inactiveTime = 0;
    cursorTrail.style.top = "-100px";
    cursorTrail.style.left = "-100px";
    cursorStartPosition.x = x;
    cursorStartPosition.y = y;
    cursorMovedDistance = 0;

    // Set inBufferZone to false when cursor moves outside the buffer zone
    inBufferZone = false;
  }

  // Add current position and color to trailPoints array
  var color = getColorFromHeatmap(inactiveTime);
  trailPoints.push({ x: x, y: y, color: color, time: new Date().getTime() });

  // Update trail points positions and fade out effect
  for (var i = 0; i < trailPoints.length; i++) {
    var point = trailPoints[i];
    var trailPoint = document.getElementById("trail-point-" + i);

    if (!trailPoint) {
      // Create new trail point element if it doesn't exist
      trailPoint = document.createElement("div");
      trailPoint.id = "trail-point-" + i;
      trailPoint.style.position = "fixed";
      trailPoint.style.width = "20px";
      trailPoint.style.height = "20px";
      trailPoint.style.borderRadius = "100%";
      trailPoint.style.opacity = "0.5";
      trailPoint.style.pointerEvents = "none";
      trailPoint.style.zIndex = "9998"; // Ensure the trail points are below the main cursor trail
      document.body.appendChild(trailPoint);
    }

    // Update trail point position
    trailPoint.style.top = point.y + "px";
    trailPoint.style.left = point.x + "px";

    // Update trail point color
    trailPoint.style.backgroundColor = point.color;

    // Calculate the elapsed time since the point was added
    var now = new Date().getTime();
    var elapsed = now - point.time;
    var opacity = 0.5 - elapsed / trailDuration; // Gradually fade out the trail point
    trailPoint.style.opacity = opacity;

    // Remove the trail point if its opacity reaches 0
    if (opacity <= 0) {
      document.body.removeChild(trailPoint);
      trailPoints.splice(i, 1);
      i--;
    }
  }
}

// Update cursor trail color based on inactivity
function updateCursorTrailColor() {
  var now = new Date().getTime();
  var elapsed = now - lastActivityTime;
  inactiveTime += elapsed;
  lastActivityTime = now;

  // Reset inactive time and cursor trail position if the trail duration has passed
  if (inactiveTime >= trailDuration) {
    inactiveTime = 0;
    cursorTrail.style.top = "-100px";
    cursorTrail.style.left = "-100px";
    cursorStartPosition.x = 0;
    cursorStartPosition.y = 0;
    cursorMovedDistance = 0;
  }

  // Update cursor trail color based on inactivity time and cursor movement
  var currentColor;
  if (cursorMovedDistance > bufferZoneDistance) {
    // Cursor has moved far enough, reset the color cycle
    currentColor = getColorFromHeatmap(inactiveTime);
  } else {
    // Cursor hasn't moved far enough, keep the last color
    currentColor = lastColor;
  }

  cursorTrail.style.backgroundColor = currentColor;
  lastColor = currentColor;
}

// Get color from heatmap based on time
function getColorFromHeatmap(time) {
  if (time >= trailDuration) {
    return lastColor; // Return last color if cursor is idle beyond trail duration
  }

  // Calculate color values based on time
  var hue = (time / trailDuration) * 240;
  var rgb = hsvToRgb(hue / 360, 1, 1);
  return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
}

// Convert HSV color to RGB
function hsvToRgb(h, s, v) {
  var r, g, b;
  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Add event listener to update cursor trail position
document.addEventListener("mousemove", updateCursorTrail);

// Update cursor trail color at regular intervals
setInterval(updateCursorTrailColor, 100);
