import { applyBasicStyle } from "./components/buildingStyle.js";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNDQ3MDgxZC02OWU2LTRiNTMtYjUyNS1hYmRiMGRjMGE2N2EiLCJpZCI6MTkxOTM0LCJpYXQiOjE3MDc5MTU1NzF9.wwiBhBlO6d9r53a5uOWZkATR5tZGFzUpbt-I1ewTP1w";

export const viewer = new Cesium.Viewer("cesiumContainer", {
  infoBox: true,
  selectionIndicator: true,
  shadows: true,
  terrainShadows: Cesium.ShadowMode.ENABLED,
  timeline: false,
  animation: false,
});
let defaultTileset, kbaTileset, nidingenTileset;

const shadowMap = viewer.shadowMap;
shadowMap.maximumDistance = 5000.0;
shadowMap.size = 4096;
shadowMap.darkness = 0.6;

const toggleCheck = {
  defaultTileset: false,
  kbaTileset: true,
  nidingenTileset: false,
};

const state = { ...toggleCheck };

const defaultCheckbox = document.getElementById("toggleDefaultTileset");
const kbaCheckbox = document.getElementById("toggleKBATileset");
const nidingenCheckbox = document.getElementById("toggleNidingenTileset");

async function applyViewer() {
  try {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(12.1082, 57.462464, 1600),
      orientation: {
        heading: Cesium.Math.toRadians(-30),
        pitch: Cesium.Math.toRadians(-30),
      },
    });

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

    defaultTileset = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
    kbaTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2459461);
    nidingenTileset = await Cesium.Cesium3DTileset.fromIonAssetId(96188);

    // Add the default and KBA tilesets to the viewer's scene
    viewer.scene.primitives.add(defaultTileset);
    viewer.scene.primitives.add(kbaTileset);
    viewer.scene.primitives.add(nidingenTileset);

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

    applyBasicStyle(defaultTileset);

    // Initially hide the default tileset (assuming it's not visible by default)
    if (defaultTileset) {
      defaultTileset.show = state.defaultTileset;
    }
    // Initially show the KBA tileset (assuming it's visible by default)
    if (kbaTileset) {
      kbaTileset.show = state.kbaTileset;
    }
    if (nidingenTileset) {
      nidingenTileset.show = state.nidingenTileset;
    }
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

    if (nidingenTileset) {
      nidingenTileset.show = state.nidingenTileset;
      viewer.flyTo;
      // close the infobox when the tileset is hidden
      if (!state.nidingenTileset) {
        viewer.selectedEntity = undefined;
      }
    }

    // Update terrain provider based on which tileset is shown
    if (state.defaultTileset || state.nidingenTileset) {
      // Set terrainProvider for default tileset

      viewer.terrainProvider =
        await Cesium.CesiumTerrainProvider.fromIonAssetId(1);
    } else {
      // Set terrainProvider for KBA tileset
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    }
    document.dispatchEvent(new CustomEvent("stateChanged", { detail: state }));
  } catch (error) {
    console.log(error);
  }
}

// function updateCheckboxState() {
//   defaultCheckbox.disabled = state.defaultTileset && !state.kbaTileset;
//   kbaCheckbox.disabled = state.kbaTileset && !state.defaultTileset;
// }

// defaultCheckbox.addEventListener("change", function (event) {
//   if (event.target.checked) {
//     // If the default checkbox is checked, uncheck the KBA checkbox
//     kbaCheckbox.checked = false;
//     state.defaultTileset = true;
//     state.kbaTileset = false;
//   } else {
//     // If the default checkbox is unchecked, prevent it from being turned off if KBA is off
//     if (!kbaCheckbox.checked) {
//       event.preventDefault();
//       return;
//     }
//     state.defaultTileset = false;
//   }

//   updateTilesetVisibility();
//   updateCheckboxState();
// });

// kbaCheckbox.addEventListener("change", function (event) {
//   if (event.target.checked) {
//     // If the KBA checkbox is checked, uncheck the default checkbox
//     defaultCheckbox.checked = false;
//     state.defaultTileset = false;
//     state.kbaTileset = true;
//   } else {
//     // If the KBA checkbox is unchecked, prevent it from being turned off if default is off
//     if (!defaultCheckbox.checked) {
//       event.preventDefault();
//       return;
//     }
//     state.kbaTileset = false;
//   }

//   updateTilesetVisibility();
//   updateCheckboxState();
// });

defaultCheckbox.addEventListener("change", function () {
  state.defaultTileset = defaultCheckbox.checked;
  updateTilesetVisibility();
});

kbaCheckbox.addEventListener("change", function () {
  state.kbaTileset = kbaCheckbox.checked;
  updateTilesetVisibility();
});

nidingenCheckbox.addEventListener("change", function () {
  state.nidingenTileset = nidingenCheckbox.checked;
  updateTilesetVisibility();
});

document.addEventListener("DOMContentLoaded", function () {
  const toolbar = document.querySelector("div.cesium-viewer-toolbar");
  const modeButton = document.querySelector(
    "span.cesium-sceneModePicker-wrapper"
  );
  const myButton = document.createElement("button");
  myButton.classList.add("cesium-button", "cesium-toolbar-button");
  myButton.setAttribute("title", "Lagerhanteraren");

  // Create a <span> element for the Iconify icon
  const iconSpan = document.createElement("span");
  iconSpan.classList.add("lsNavBtn");
  iconSpan.setAttribute("data-icon", "mdi:camera");

  // Append the icon to the button
  myButton.appendChild(iconSpan);
  toolbar.insertBefore(myButton, modeButton);

  let tableShown = false;
  const layerSwitcherCard = document.getElementById(
    "draggableLayerSwitcherCard"
  );

  myButton.addEventListener("click", function () {
    if (tableShown) {
      layerSwitcherCard.style.display = "none"; // Hide the time changer
    } else {
      layerSwitcherCard.style.display = "block"; // Show the time changer
    }
    tableShown = !tableShown; // Toggle the visibility flag
  });
});
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
// Initially set checkbox state
// updateCheckboxState();
applyViewer();
