// imports
import { viewer } from "../../index.js";

// selects the toolbar and the mode button
const toolbar = document.querySelector("div.cesium-viewer-toolbar");
const modeButton = document.querySelector(
  "span.cesium-sceneModePicker-wrapper"
);
// creates the element for the timechanger button in the toolbar
const timeChangerButton = document.createElement("button");
timeChangerButton.classList.add("cesium-button", "cesium-toolbar-button");
timeChangerButton.setAttribute("title", "Solstudie");

// Function to update the tooltip title of the time changer button based on the current language
export function updateTimeChangerTooltipTitle() {
  if (timeChangerButton) {
    timeChangerButton.setAttribute(
      "title",
      i18next.t("timeChangerTooltipTitle")
    );
  }
}

// Create a <span> element for the Iconify icon
const iconSpan = document.createElement("span");
iconSpan.classList.add("timeChangerNavBtn");
iconSpan.setAttribute("data-icon", "mdi:camera");

// Append the icon to the button
timeChangerButton.appendChild(iconSpan);
toolbar.insertBefore(timeChangerButton, modeButton);

let tableShown = false;
const timeChanger = document.getElementById("timeChangerCard");

// Event listener to toggle the time changer card
timeChangerButton.addEventListener("click", function () {
  if (tableShown) {
    timeChanger.style.display = "none"; // Hide the time changer
  } else {
    timeChanger.style.display = "block"; // Show the time changer
  }
  tableShown = !tableShown; // Toggle the timechanger card
});

// different variables for the solstice dates, buttons and sliders
const winterSolstice = new Date(2023, 12, 21); // December 21st, 2023
const summerSolstice = new Date(2024, 6, 21); // June 21st, 2024
const summerButton = document.getElementById("summerButton");
const winterButton = document.getElementById("winterButton");
const monthSlider = document.getElementById("monthSlider");
const monthOutput = document.getElementById("monthOutput");
const daySlider = document.getElementById("daySlider");
const dayOutput = document.getElementById("dayOutput");
const hourSlider = document.getElementById("hourSlider");
const hourOutput = document.getElementById("hourOutput");
let isSummer = false;

// Event listeners toggle the summer icon and set the date to summer solstice
summerButton.addEventListener("click", function () {
  isSummer = true;
  summerButton.classList.add("active");
  winterButton.classList.remove("active");
  // Set specific date for summer
  setDate(6, 21); // June 21st
});

// Event listeners toggle the winter icon and set the date to winter solstice
winterButton.addEventListener("click", function () {
  isSummer = false;
  winterButton.classList.add("active");
  summerButton.classList.remove("active");
  // Set specific date for winter
  setDate(12, 21); // December 21st
});

// Array of month names
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Update month, day, and hour based on sliders
monthSlider.addEventListener("input", updateDays);
daySlider.addEventListener("input", updateDate);
hourSlider.addEventListener("input", updateDate);

// Function to pad numbers with leading zeros
function pad(num) {
  return num < 10 ? "0" + num : num;
}
export function updateDate() {
  let monthIndex = monthSlider.value - 1; // Adjusting month index to start from 0

  // Fetch translated month name from i18next
  let monthName = i18next.t("months." + monthNames[monthIndex]);

  let day = pad(daySlider.value);
  let hour = pad(hourSlider.value);

  let currentTimeString;
  // Check if the current date is after the winter solstice and before the summer solstice
  if (new Date() > winterSolstice && new Date() < summerSolstice) {
    // Set time for summer
    currentTimeString =
      "2024-" + pad(monthSlider.value) + "-" + day + "T" + hour + ":00:00Z";
  } else {
    // Set time for winter
    currentTimeString =
      "2023-" + pad(monthSlider.value) + "-" + day + "T" + hour + ":00:00Z";
  }

  // Set the current time of the viewer
  viewer.clockViewModel.currentTime =
    Cesium.JulianDate.fromIso8601(currentTimeString);

  // Update output display with translated month name
  monthOutput.textContent = monthName || "Januari";
  dayOutput.textContent = day;
  hourOutput.textContent = hour + ":00";
}

function setDate(month, day) {
  // Set the month and day sliders to the specified values
  monthSlider.value = month;
  daySlider.value = day;
  // Update the date based on the specified values
  updateDate();
}

function updateDays() {
  // Get the maximum number of days for the selected month
  let maxDays = new Date(2023, monthSlider.value, 0).getDate();

  // Set the max attribute of the daySlider
  daySlider.setAttribute("max", maxDays);

  // Ensure the current day value doesn't exceed the maximum days
  if (parseInt(daySlider.value) > maxDays) {
    daySlider.value = maxDays;
  }

  // Call updateDate function to update the date
  updateDate();
}

// Initialize with default values
updateDate();
updateDays();
