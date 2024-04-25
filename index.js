// imports
import { applyBasicStyle } from "./components/style/buildingStyle.js";

// Description: This file contains the main logic for the Cesium application.
// It initializes the Cesium viewer and adds the default and KBA tilesets to the scene.
// It also adds event listeners to the checkboxes to toggle the visibility of the tilesets.

// Access token for Cesium Ion
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNDQ3MDgxZC02OWU2LTRiNTMtYjUyNS1hYmRiMGRjMGE2N2EiLCJpZCI6MTkxOTM0LCJpYXQiOjE3MDc5MTU1NzF9.wwiBhBlO6d9r53a5uOWZkATR5tZGFzUpbt-I1ewTP1w";

// Create a new Cesium viewer
export const viewer = new Cesium.Viewer("cesiumContainer", {
  infoBox: true,
  selectionIndicator: true,
  shadows: true,
  terrainShadows: Cesium.ShadowMode.ENABLED,
  timeline: false,
  animation: false,
  baseLayerPicker: false,
  navigationHelpButton: false,
});
// The different tiles that can be shown
let defaultTileset, kbaTileset, nidingenTileset;
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
};

// Create a copy of the initial state
const state = { ...toggleCheck };

// Get the checkboxes from the DOM
const defaultCheckbox = document.getElementById("toggleDefaultTileset");
const kbaCheckbox = document.getElementById("toggleKBATileset");
const nidingenCheckbox = document.getElementById("toggleNidingenTileset");

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
    kbaTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2459461);
    // nidingenTileset = await Cesium.Cesium3DTileset.fromIonAssetId(75343);

    // Add the default and KBA tilesets to the viewer's scene
    viewer.scene.primitives.add(defaultTileset);
    viewer.scene.primitives.add(kbaTileset);
    // viewer.scene.primitives.add(nidingenTileset);

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
  } catch (error) {
    console.log(error);
  }
}

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

    // Update Nidingen tileset visibility
    // if (nidingenTileset) {
    //   nidingenTileset.show = state.nidingenTileset;

    //   // close the infobox when the tileset is hidden
    //   if (!state.nidingenTileset) {
    // close the infobox when the tileset is hidden
    //     viewer.selectedEntity = undefined;
    //   }
    // }

    // Update terrain provider based on which tileset is shown
    if (state.defaultTileset) {
      // Set terrainProvider for default tileset
      viewer.terrainProvider =
        await Cesium.CesiumTerrainProvider.fromIonAssetId(1);
    }
    if (state.kbaTileset) {
      // Set terrainProvider for KBA tileset
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    }
    // if (state.nidingenTileset) {
    //   // Set terrainProvider for Nidingen tileset
    //   viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    // }
    document.dispatchEvent(new CustomEvent("stateChanged", { detail: state }));
  } catch (error) {
    console.log(error);
  }
}

// an event listener to update the defaulttileset visibility when the state changes
defaultCheckbox.addEventListener("change", function () {
  state.defaultTileset = defaultCheckbox.checked;
  updateTilesetVisibility();
});

// an event listener to update the kbatileset visibility when the state changes
kbaCheckbox.addEventListener("change", function () {
  state.kbaTileset = kbaCheckbox.checked;
  updateTilesetVisibility();
});

// an event listener to update the nidingentileset visibility when the state changes
// nidingenCheckbox.addEventListener("change", function () {
//   state.nidingenTileset = nidingenCheckbox.checked;
//   updateTilesetVisibility();
// });

// an event listener to toggle between on and off for the visibility of the layer switcher card.
const toolbar = document.querySelector("div.cesium-viewer-toolbar");
const modeButton = document.querySelector(
  "span.cesium-sceneModePicker-wrapper"
);
const layerSwitcherButton = document.createElement("button");
layerSwitcherButton.classList.add("cesium-button", "cesium-toolbar-button");
layerSwitcherButton.setAttribute("title", "Lagerhanteraren");

// Function to update the tooltip title of the time changer button based on the current language
export function updateLayerSwitcherToolTipTitle() {
  if (layerSwitcherButton) {
    layerSwitcherButton.setAttribute("title", i18next.t("lsTooltipTitle"));
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
// Initially set checkbox state
applyViewer();
