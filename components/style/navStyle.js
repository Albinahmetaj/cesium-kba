// imports
import { getBuildingColors, getBuildingColorNames } from "./buildingStyle.js";

let buttonAdded = false; // Flag to track whether the button has been added
let buildingTypesButton = null; // Reference to the button element
let tableShown = false; // Flag to track whether the table is shown
let table = null; // Reference to the table element
const colors = getBuildingColors(); // Get the building colors

// Get the home button element
const homeButton = document.querySelector(".cesium-home-button");
homeButton.title = "Återställ vy till startposition";

// Get the search bar element
const searchBar = document.querySelector(".cesium-geocoder-input");
searchBar.placeholder = "Ange en adress eller ett landmärke...";

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
    buildingTypesButton.setAttribute("title", "Byggnadsinformation");

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

// Function to update the toolbar tooltip titles of the home button, searchbar placeholder and
// building information button based on the current language
export function updateToolTipTitles() {
  if (homeButton) {
    homeButton.setAttribute("title", i18next.t("homeButtonToolTipTitle"));
  }
  if (searchBar) {
    searchBar.setAttribute("placeholder", i18next.t("searchBarPlaceholder"));
  }
  if (buildingTypesButton) {
    buildingTypesButton.setAttribute(
      "title",
      i18next.t("buildingInfoToolTipTitle")
    );
  }
}
