import { applyBasicStyle } from "./components/style.js";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNDQ3MDgxZC02OWU2LTRiNTMtYjUyNS1hYmRiMGRjMGE2N2EiLCJpZCI6MTkxOTM0LCJpYXQiOjE3MDc5MTU1NzF9.wwiBhBlO6d9r53a5uOWZkATR5tZGFzUpbt-I1ewTP1w";

export const viewer = new Cesium.Viewer("cesiumContainer");
let defaultTileset, kbaTileset;

const toggleCheck = {
  defaultTileset: false,
  kbaTileset: true,
};

const state = { ...toggleCheck };

const defaultCheckbox = document.getElementById("toggleDefaultTileset");
const kbaCheckbox = document.getElementById("toggleKBATileset");

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

    // Add the default and KBA tilesets to the viewer's scene
    viewer.scene.primitives.add(defaultTileset);
    viewer.scene.primitives.add(kbaTileset);

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

    // Update terrain provider based on which tileset is shown
    if (state.defaultTileset) {
      // Set terrainProvider for default tileset
      viewer.terrainProvider =
        await Cesium.CesiumTerrainProvider.fromIonAssetId(1);
    } else {
      // Set terrainProvider for KBA tileset
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    }
  } catch (error) {
    console.log(error);
  }
  render();
}

function render() {
  // test render console state
  // console.log("State:", state);
}

function updateCheckboxState() {
  defaultCheckbox.disabled = state.defaultTileset && !state.kbaTileset;
  kbaCheckbox.disabled = state.kbaTileset && !state.defaultTileset;
}

defaultCheckbox.addEventListener("change", function (event) {
  if (event.target.checked) {
    // If the default checkbox is checked, uncheck the KBA checkbox
    kbaCheckbox.checked = false;
    state.defaultTileset = true;
    state.kbaTileset = false;
  } else {
    // If the default checkbox is unchecked, prevent it from being turned off if KBA is off
    if (!kbaCheckbox.checked) {
      event.preventDefault();
      return;
    }
    state.defaultTileset = false;
  }
  updateTilesetVisibility();
  updateCheckboxState();
});

kbaCheckbox.addEventListener("change", function (event) {
  if (event.target.checked) {
    // If the KBA checkbox is checked, uncheck the default checkbox
    defaultCheckbox.checked = false;
    state.defaultTileset = false;
    state.kbaTileset = true;
  } else {
    // If the KBA checkbox is unchecked, prevent it from being turned off if default is off
    if (!defaultCheckbox.checked) {
      event.preventDefault();
      return;
    }
    state.kbaTileset = false;
  }
  updateTilesetVisibility();
  updateCheckboxState();
});

// Initially set checkbox state
updateCheckboxState();
applyViewer();
