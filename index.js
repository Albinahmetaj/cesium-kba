// imports
import { applyBasicStyle } from "./components/style/buildingStyle.js";

// Description: This file contains the main logic for the Cesium application.
// It initializes the Cesium viewer and adds the default, KBA tilesets, Bolsheden, hospital and later Nidingen tilesets to the viewer's scene
// It also adds event listeners to the checkboxes to toggle the visibility of the tilesets.

// Access token for Cesium Ion
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNDQ3MDgxZC02OWU2LTRiNTMtYjUyNS1hYmRiMGRjMGE2N2EiLCJpZCI6MTkxOTM0LCJpYXQiOjE3MDc5MTU1NzF9.wwiBhBlO6d9r53a5uOWZkATR5tZGFzUpbt-I1ewTP1w";

export const viewer = new Cesium.Viewer("cesiumContainer", {
  infoBox: false,
  selectionIndicator: false,
  shadows: true,
  terrainShadows: Cesium.ShadowMode.ENABLED,
  timeline: false,
  animation: false,
  sceneModePicker: true,
  baseLayerPicker: false,
  imageryProvider: false,
});

let spinner = document.getElementById("spinnerContainer");
// an event listener to toggle between on and off for the visibility of the layer switcher card.
const toolbar = document.querySelector("div.cesium-viewer-toolbar");
const modeButton = document.querySelector(
  "span.cesium-sceneModePicker-wrapper"
);

const layerSwitcherButton = document.createElement("button");
layerSwitcherButton.classList.add("cesium-button", "cesium-toolbar-button");
layerSwitcherButton.setAttribute("title", "Lagerhanteraren");

const helpInstructionButton = document.querySelector(
  ".cesium-navigation-help-button"
);
helpInstructionButton.setAttribute("title", "Hjälp och instruktioner");

// The different tiles that can be shown
let defaultTileset,
  kbaTileset,
  nidingenTileset,
  bolshedenTileSet,
  hospitalTileSet;
// Set the maximum distance for the shadow map
const shadowMap = viewer.shadowMap;
shadowMap.maximumDistance = 5000.0;
shadowMap.size = 4096;
shadowMap.darkness = 0.6;

// Set the initial state of the tilesets
const toggleCheck = {
  defaultTileset: false,
  kbaTileset: true,
  nidingenTileset: false,
  bolshedenTileSet: false,
  hospitalTileSet: false,
};

// Create a copy of the initial state
const state = { ...toggleCheck };

let defaultTerrainProvider = null;
let kbaTerrainProvider = null;
let bolshedenTerrainProvider = null;
let hospitalTerrainProvider = null;

// Get the checkboxes from the DOM
const defaultCheckbox = document.getElementById("toggleDefaultTileset");
const kbaCheckbox = document.getElementById("toggleKBATileset");
const nidingenCheckbox = document.getElementById("toggleNidingenTileset");
const bolshedenCheckbox = document.getElementById("toggleBolshedenTileset");
const hospitalCheckbox = document.getElementById("toggleHospitalTileset");

// Function to apply the viewer settings and add the tilesets
async function applyViewer() {
  try {
    // Fly to a specific location and orientation, in this case, Kungsbacka.
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(12.1082, 57.462464, 1600),
      orientation: {
        heading: Cesium.Math.toRadians(-30),
        pitch: Cesium.Math.toRadians(-30),
      },
    });

    // Add a listener to the home button to fly to a specific location and orientation
    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
      function (e) {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(12.1082, 57.462464, 1600),
          orientation: {
            heading: Cesium.Math.toRadians(-30),
            pitch: Cesium.Math.toRadians(-30),
          },
        });
        e.cancel = true;
      }
    );

    // Load the default and KBA tilesets from Cesium Ion
    defaultTileset = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
    kbaTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2564547);
    // nidingenTileset = await Cesium.Cesium3DTileset.fromIonAssetId(75343);
    bolshedenTileSet = await Cesium.Cesium3DTileset.fromIonAssetId(2563001);
    hospitalTileSet = await Cesium.Cesium3DTileset.fromIonAssetId(2563140);

    // Add the default and KBA tilesets to the viewer's scene
    viewer.scene.primitives.add(defaultTileset);
    viewer.scene.primitives.add(kbaTileset);
    // viewer.scene.primitives.add(nidingenTileset);
    viewer.scene.primitives.add(bolshedenTileSet);
    viewer.scene.primitives.add(hospitalTileSet);

    // Apply the default style if it exists
    const kbaExtras = kbaTileset.asset.extras;
    if (
      Cesium.defined(kbaExtras) &&
      Cesium.defined(kbaExtras.ion) &&
      Cesium.defined(kbaExtras.ion.defaultStyle)
    ) {
      kbaTileset.style = new Cesium.Cesium3DTileStyle(
        kbaExtras.ion.defaultStyle
      );
    }
    // Apply the basic style to the default tileset
    applyBasicStyle(defaultTileset);

    // Initially show the default tileset (assuming it's visible by default)
    if (defaultTileset) {
      defaultTileset.show = state.defaultTileset;
    }

    // Initially show the KBA tileset (assuming it's visible by default)
    if (kbaTileset) {
      kbaTileset.show = state.kbaTileset;
    }
    // Initially show the Nidingen tileset (assuming it's visible by default)
    // if (nidingenTileset) {
    //   nidingenTileset.show = state.nidingenTileset;
    // }
    if (bolshedenTileSet) {
      bolshedenTileSet.show = state.bolshedenTileSet;
    }
    if (hospitalTileSet) {
      hospitalTileSet.show = state.hospitalTileSet;
    }
  } catch (error) {
    console.log(error);
  }
}

// Add the tileLoadProgressEvent listener
viewer.scene.globe.tileLoadProgressEvent.addEventListener(function (
  remainingTiles
) {
  // Show the spinner while the tiles are loading
  if (remainingTiles === 0) {
    // Hide the spinner when all tiles are loaded
    spinner.style.display = "none";
  } else {
    spinner.style.display = "block";
  }
});

// Function to update tileset visibility based on state
async function updateTilesetVisibility() {
  try {
    // Update default tileset visibility
    if (defaultTileset) {
      defaultTileset.show = state.defaultTileset;
      // close the infobox when the tileset is hidden
      if (!state.defaultTileset) {
        viewer.selectedEntity = undefined;
      }
    }

    // Update KBA tileset visibility
    if (kbaTileset) {
      kbaTileset.show = state.kbaTileset;
      // close the infobox when the tileset is hidden
      if (!state.kbaTileset) {
        viewer.selectedEntity = undefined;
      }
    }

    // Update KBA tileset visibility
    if (bolshedenTileSet) {
      bolshedenTileSet.show = state.bolshedenTileSet;

      // close the infobox when the tileset is hidden
      if (!state.bolshedenTileSet) {
        viewer.selectedEntity = undefined;
      }
    }

    // Update Hospital tileset visibility
    if (hospitalTileSet) {
      hospitalTileSet.show = state.hospitalTileSet;
      // close the infobox when the tileset is hidden
      if (!state.hospitalTileSet) {
        viewer.selectedEntity = undefined;
      }
    }

    if (state.defaultTileset) {
      // Set terrainProvider for default tileset if not already set
      if (!defaultTerrainProvider) {
        spinner.style.display = "block";

        // show a loading spinner while the terrain is loading
        defaultTerrainProvider =
          await Cesium.CesiumTerrainProvider.fromIonAssetId(1);
      }
      viewer.terrainProvider = defaultTerrainProvider;
    }

    if (state.kbaTileset) {
      // Set terrainProvider for KBA tileset if not already set
      if (!kbaTerrainProvider) {
        spinner.style.display = "block";

        kbaTerrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(
          2564535
        );
      }
      viewer.terrainProvider = kbaTerrainProvider;
    }
    if (state.bolshedenTileSet) {
      // Set terrainProvider for Bolsheden tileset if not already set
      if (!bolshedenTerrainProvider) {
        spinner.style.display = "block";

        bolshedenTerrainProvider =
          await Cesium.CesiumTerrainProvider.fromIonAssetId(2563037);
      }
      viewer.terrainProvider = bolshedenTerrainProvider;
    }
    if (state.hospitalTileSet) {
      // Set terrainProvider for Hospital tileset if not already set
      if (!hospitalTerrainProvider) {
        spinner.style.display = "block";

        hospitalTerrainProvider =
          await Cesium.CesiumTerrainProvider.fromIonAssetId(2563139);
      }
      viewer.terrainProvider = hospitalTerrainProvider;
    }
    // Dispatch event indicating state change
    document.dispatchEvent(new CustomEvent("stateChanged", { detail: state }));
  } catch (error) {
    console.log(error);
  }
}

function saveCheckboxState() {
  // Save the state of the checkboxes to local storage
  localStorage.setItem("defaultTileset", state.defaultTileset);
  localStorage.setItem("kbaTileset", state.kbaTileset);
  localStorage.setItem("bolshedenTileSet", state.bolshedenTileSet);
  localStorage.setItem("hospitalTileSet", state.hospitalTileSet);
}

// Load the state of the checkboxes from local storage
function loadCheckboxState() {
  state.defaultTileset = localStorage.getItem("defaultTileset") === "true";
  state.kbaTileset =
    localStorage.getItem("kbaTileset") !== null
      ? localStorage.getItem("kbaTileset") === "true"
      : true;
  state.bolshedenTileSet = localStorage.getItem("bolshedenTileSet") === "true";
  state.hospitalTileSet = localStorage.getItem("hospitalTileSet") === "true";

  defaultCheckbox.checked = state.defaultTileset;
  kbaCheckbox.checked = state.kbaTileset;
  bolshedenCheckbox.checked = state.bolshedenTileSet;
  hospitalCheckbox.checked = state.hospitalTileSet;
}

window.addEventListener("load", () => {
  loadCheckboxState();
  updateTilesetVisibility().then(() => {
    // Attach event listeners after initial terrain setup
    defaultCheckbox.addEventListener("change", function () {
      state.defaultTileset = defaultCheckbox.checked;
      updateTilesetVisibility();
      saveCheckboxState();
    });

    kbaCheckbox.addEventListener("change", function () {
      state.kbaTileset = kbaCheckbox.checked;
      updateTilesetVisibility();
      saveCheckboxState();
    });

    bolshedenCheckbox.addEventListener("change", function () {
      state.bolshedenTileSet = bolshedenCheckbox.checked;
      updateTilesetVisibility();
      saveCheckboxState();
    });

    hospitalCheckbox.addEventListener("change", function () {
      state.hospitalTileSet = hospitalCheckbox.checked;
      updateTilesetVisibility();
      saveCheckboxState();
    });
  });
});

// Function to update the tooltip title of the time changer button based on the current language
export function updateLayerSwitcherToolTipTitle() {
  if (layerSwitcherButton) {
    layerSwitcherButton.setAttribute("title", i18next.t("lsTooltipTitle"));
  }
  if (helpInstructionButton) {
    helpInstructionButton.setAttribute("title", i18next.t("helpTooltipTitle"));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const iconSpan = document.createElement("span");
  iconSpan.classList.add("lsNavBtn");
  iconSpan.setAttribute("data-icon", "mdi:camera");

  layerSwitcherButton.appendChild(iconSpan);
  toolbar.insertBefore(layerSwitcherButton, modeButton);

  let tableShown = false;
  const layerSwitcherCard = document.getElementById(
    "draggableLayerSwitcherCard"
  );

  layerSwitcherButton.addEventListener("click", function () {
    if (tableShown) {
      layerSwitcherCard.style.display = "none";
    } else {
      layerSwitcherCard.style.display = "block";
    }
    tableShown = !tableShown;
  });
});

// Function to fly the camera to a specific location and orientation (Nidingen)
window.flyCameraToNidingen = function () {
  try {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(11.913, 57.295, 700),
      orientation: {
        heading: Cesium.Math.toRadians(-30),
        pitch: Cesium.Math.toRadians(-30),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

window.flyCameraToBolsheden = function () {
  try {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(11.968, 57.553, 700),
      orientation: {
        heading: Cesium.Math.toRadians(-30),
        pitch: Cesium.Math.toRadians(-30),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

window.flyCameraToHospital = function () {
  try {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(12.092, 57.488, 500),
      orientation: {
        heading: Cesium.Math.toRadians(-30),
        pitch: Cesium.Math.toRadians(-30),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

function zoomIn() {
  viewer.camera.zoomIn(viewer.camera.positionCartographic.height / 2.0);
}
function zoomOut() {
  viewer.camera.zoomOut(viewer.camera.positionCartographic.height * 0.5);
}
document
  .getElementById("zoom-in-button")
  .addEventListener("click", zoomIn, false);
document
  .getElementById("zoom-out-button")
  .addEventListener("click", zoomOut, false);

// Load the state of the checkboxes from local storage
applyViewer();
