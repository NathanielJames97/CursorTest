var cursorTrail;
var lastActivityTime = new Date().getTime();
var inactiveTime = 0;
var trailDuration = 5000; // 5 seconds
var trailPoints = []; // Array to store cursor positions for trail

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
  cursorTrail.style.backgroundColor = "#000";
  document.body.appendChild(cursorTrail);
});

// Update cursor trail position
function updateCursorTrail(event) {
  var x = event.clientX;
  var y = event.clientY;

  // Update cursor trail position
  cursorTrail.style.top = y + "px";
  cursorTrail.style.left = x + "px";

  // Add current position to trailPoints array
  trailPoints.push({ x: x, y: y });

  // Update trail points positions
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
      trailPoint.style.backgroundColor = "#000";
      trailPoint.style.pointerEvents = "none";
      trailPoint.style.zIndex = "9998"; // Ensure trail points are below the cursor trail
      document.body.appendChild(trailPoint);
    }

    // Update trail point position
    trailPoint.style.top = point.y + "px";
    trailPoint.style.left = point.x + "px";
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
  } else {
    // Update cursor trail color based on inactivity time
    var color = getColorFromHeatmap(inactiveTime);
    cursorTrail.style.backgroundColor = color;
  }
}

// Get color from heatmap based on time
function getColorFromHeatmap(time) {
  var maxInactiveTime = trailDuration; // Maximum inactivity time for full heatmap color
  var hueRange = 240; // Range of hues to use for heatmap colors

  // Calculate the hue based on the ratio of inactive time to max inactive time
  var ratio = Math.min(time / maxInactiveTime, 1);
  var hue = Math.floor(ratio * hueRange);

  // Convert hue to RGB color
  var rgb = hsvToRgb(hue / 360, 1, 1);

  // Return the RGB color as CSS value
  return "rgb(" + rgb.join(",") + ")";
}

// Add event listener for mousemove to update cursor trail position and color
document.addEventListener("mousemove", function (event) {
  updateCursorTrail(event);
  updateCursorTrailColor();
});
