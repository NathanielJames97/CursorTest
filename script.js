var cursorTrail;
var lastActivityTime = new Date().getTime();
var inactiveTime = 0;
var trailDuration = 5000; // 5 seconds

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

// HSV to RGB color conversion
function hsvToRgb(h, s, v) {
  var r, g, b;
  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Add event listener for mousemove to update cursor trail position and color
document.addEventListener("mousemove", function (event) {
  updateCursorTrail(event);
  updateCursorTrailColor();
});
