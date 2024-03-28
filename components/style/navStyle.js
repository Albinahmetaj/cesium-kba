// imports
import { getBuildingColors, getBuildingColorNames } from "./buildingStyle.js";

let buttonAdded = false; // Flag to track whether the button has been added
let buildingTypesButton = null; // Reference to the button element
let tableShown = false; // Flag to track whether the table is shown
let table = null; // Reference to the table element
const colors = getBuildingColors(); // Get the building colors

// Function to update the buildings information body with the building colors
export function updateTableContent() {
  const tableTitle = document.createElement("h4");
  tableTitle.id = "infoTableTitle";
  tableTitle.style.textDecoration = "underline";
  tableTitle.style.margin = "0 0 10px 0";

  const translatedTitle = i18next.t("tableTitleKey");
  tableTitle.textContent = translatedTitle;
  const tbody = document.createElement("tbody");
  tbody.appendChild(tableTitle);
  const buildingColorNamesWithTranslations = getBuildingColorNames();
  for (const key in buildingColorNamesWithTranslations) {
    const tr = document.createElement("tr");
    const tdValue = document.createElement("td");
    tdValue.textContent = buildingColorNamesWithTranslations[key];
    const tdColor = document.createElement("td");
    const colorCircle = document.createElement("span");
    colorCircle.classList.add("color-circle");
    colorCircle.style.backgroundColor = colors[key]; // Assuming buildingColors contains the color values

    tdColor.appendChild(colorCircle);
    tr.appendChild(tdValue);
    tr.appendChild(tdColor);
    tbody.appendChild(tr);
  }

  // Clear existing table content before adding new rows
  while (table?.firstChild) {
    table?.removeChild(table?.firstChild);
  }

  table?.appendChild(tbody);
}
// Event listener to toggle the table content when the tilesstate changes
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("stateChanged", function (event) {
    const newState = event.detail;

    if (buttonAdded && !newState.defaultTileset) {
      if (buildingTypesButton && buildingTypesButton.parentNode) {
        buildingTypesButton.parentNode.removeChild(buildingTypesButton);
        buildingTypesButton = null; // Clear the reference
        buttonAdded = false; // Reset the flag
      }

      // Hide or remove the table if kbaTileset is true
      if (table) {
        table.remove();
        table = null;
        tableShown = false;
      }

      return;
    }

    // If the button has already been added, do nothing
    if (buttonAdded) {
      return;
    }

    // Add the buildingInfo button to the toolbar
    const toolbar = document.querySelector("div.cesium-viewer-toolbar");
    const modeButton = document.querySelector(
      "span.cesium-sceneModePicker-wrapper"
    );
    buildingTypesButton = document.createElement("button");
    buildingTypesButton.classList.add("cesium-button", "cesium-toolbar-button");
    buildingTypesButton.setAttribute("title", "Information om byggnadstyper");

    const iconSpan = document.createElement("span");
    iconSpan.classList.add("infoNavBtn");
    iconSpan.setAttribute("data-icon", "mdi:camera");

    buildingTypesButton.appendChild(iconSpan);

    if (newState.defaultTileset) {
      toolbar.insertBefore(buildingTypesButton, modeButton);
      buttonAdded = true;
    }

    // Function to toggle the table visibility
    function toggleTable() {
      if (newState.defaultTileset) {
        if (!tableShown) {
          // Create the table if it's not already shown
          table = document.createElement("table");
          table.id = "infoTable";
          table.classList.add("draggable-element");
          updateTableContent();
          document.body.appendChild(table);
          tableShown = true;
        } else {
          // Hide the table if it's already shown
          table.style.display = "none";
          tableShown = false;
        }
      } else {
        // Remove the table if defaultTileset is false
        if (table) {
          table.remove();
          table = null;
        }
        tableShown = false;
      }
    }

    iconSpan.addEventListener("click", function () {
      toggleTable(newState);
    });
  });
});

// Eventlistener to replace the Navigation instructions toolbar icon with a mouse icon
document.addEventListener("DOMContentLoaded", function () {
  const pathElement = document.querySelector(
    'path[d="M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z M17.328,24.371h-2.707v-2.596h2.707V24.371zM17.328,19.003v0.858h-2.707v-1.057c0-3.19,3.63-3.696,3.63-5.963c0-1.034-0.924-1.826-2.134-1.826c-1.254,0-2.354,0.924-2.354,0.924l-1.541-1.915c0,0,1.519-1.584,4.137-1.584c2.487,0,4.796,1.54,4.796,4.136C21.156,16.208,17.328,16.627,17.328,19.003z"]'
  );

  // New path data
  const newPathData =
    "M12,22 q-2.9,0 -4.95,-2.05 t-2.05,-4.95 v-6 q0,-2.9 2.05,-4.95 t4.95,-2.05 q2.9,0 4.95,2.05 t2.05,4.95 v6 q0,2.9 -2.05,4.95 t-4.95,2.05 m1,-13 h4 q0,-1.8 -1.137,-3.175 t-2.863,-1.725zM7,9 h4 v-5.1 q-1.725,0.35 -2.863,1.725 t-1.137,3.175 m5,11 q2.075,0 3.538,-1.463 t1.463,-3.538 v-4 H7 v4 q0,2.075 1.463,3.538 t3.538,1.463 m0,-9";

  // Create a new path element
  const newPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  // Set attributes for the new path
  newPath.setAttribute("d", newPathData);
  newPath.setAttribute("fill", "currentColor");
  newPath.setAttribute("transform", "scale(1.4)"); // Scale the path by 2

  // Replace the existing path with the new one
  pathElement.parentNode.replaceChild(newPath, pathElement);
});
