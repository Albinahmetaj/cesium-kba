// imports
import { viewer } from "../../index.js";

// This component represents the logic for highlighting a tile when clicked on and hovered over.
// It also displays the name of the tile in an overlay when hovered over.
// With dynamic translations in the info box body.
// Note: This only works for the default tileset as of now. Since there are missing pieces in the other tilesets.
const nameOverlay = document.createElement("div");
viewer.container.appendChild(nameOverlay);
nameOverlay.className = "backdrop";
nameOverlay.style.display = "none";
nameOverlay.style.position = "absolute";
nameOverlay.style.bottom = "0";
nameOverlay.style.left = "0";
nameOverlay.style["pointer-events"] = "none";
nameOverlay.style.padding = "4px";
nameOverlay.style.backgroundColor = "black";
nameOverlay.style.color = "white";
const selected = {
  feature: undefined,
  originalColor: new Cesium.Color(),
};
const selectedEntity = new Cesium.Entity();
const clickHandler = viewer.screenSpaceEventHandler.getInputAction(
  Cesium.ScreenSpaceEventType.LEFT_CLICK
);

let lastPickedFeature = null;

function updateNameOverlay(pickedFeature, position) {
  try {
    if (!Cesium.defined(pickedFeature)) {
      nameOverlay.style.display = "none";
      return;
    }

    // A feature was picked, so show its overlay content
    nameOverlay.style.display = "block";
    nameOverlay.style.bottom = `${viewer.canvas.clientHeight - position.y}px`;
    nameOverlay.style.left = `${position.x}px`;

    const name = pickedFeature?.getProperty("name");
    nameOverlay.textContent = name;

    // Check if name is undefined or null, and set backgroundColor accordingly
    if (name === undefined || name === null) {
      nameOverlay.style.backgroundColor = ""; // Empty string to reset to default
    } else {
      nameOverlay.style.backgroundColor = "black";
    }
  } catch (error) {
    console.log("error", error);
  }
}

// Function to create picked feature description with translated content
function createPickedFeatureDescription(pickedFeature) {
  const properties = [
    { name: "name", displayNameKey: "propertyName.name" },
    { name: "operator", displayNameKey: "propertyName.operator" },
    { name: "building", displayNameKey: "propertyName.building" },
    { name: "shop", displayNameKey: "propertyName.shop" },
    { name: "opening_hours", displayNameKey: "propertyName.opening_hours" },
    {
      name: "cesium#longitude",
      displayNameKey: "propertyName.cesium_longitude",
    },
    {
      name: "cesium#latitude",
      displayNameKey: "propertyName.cesium_latitude",
    },
    { name: "addr:city", displayNameKey: "propertyName.addr_city" },
    { name: "addr:street", displayNameKey: "propertyName.addr_street" },
  ];

  // Function to translate displayName
  const translateDisplayName = (displayNameKey) => i18next.t(displayNameKey);

  const rows = properties.map((property) => {
    try {
      const value = pickedFeature?.getProperty(property?.name);
      if (value !== undefined && value !== null) {
        const translatedDisplayName = translateDisplayName(
          property.displayNameKey
        );
        return `<tr><th>${translatedDisplayName}</th><td>${value}</td></tr>`;
      }
      return ""; // Return an empty string for undefined values
    } catch (error) {
      console.log("error", error);
    }
  });

  const description = `
  <table class="cesium-infoBox-defaultTable">
    <tbody>
      ${rows.join("")}
    </tbody>
  </table>`;
  return description;
}
const silhouetteBlue =
  Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
silhouetteBlue.uniforms.length = 0.01;
silhouetteBlue.selected = [];

const silhouetteGreen =
  Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
silhouetteGreen.uniforms.color = Cesium.Color.LIME;
silhouetteGreen.uniforms.length = 0.01;
silhouetteGreen.selected = [];

function hightlightFeature(pickedFeature) {
  if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
    viewer.scene.postProcessStages.add(
      Cesium.PostProcessStageLibrary.createSilhouetteStage([
        silhouetteBlue,
        silhouetteGreen,
      ])
    );

    viewer.infoBox.viewModel.closeClicked.addEventListener(function () {
      silhouetteBlue.selected = [];
      silhouetteGreen.selected = [];
    });

    // Silhouette a feature blue on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
      movement
    ) {
      // If a feature was previously highlighted, undo the highlight
      silhouetteBlue.selected = [];

      // Pick a new feature
      const pickedFeature = viewer.scene.pick(movement.endPosition);

      updateNameOverlay(pickedFeature, movement.endPosition);

      if (!Cesium.defined(pickedFeature)) {
        return;
      }

      // Highlight the feature if it's not already selected.
      if (pickedFeature !== selected.feature) {
        silhouetteBlue.selected = [pickedFeature];
      }
    },
    Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Silhouette a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
      movement
    ) {
      // If a feature was previously selected, undo the highlight
      silhouetteGreen.selected = [];

      // Pick a new feature
      const pickedFeature = viewer.scene.pick(movement.position);
      if (!Cesium.defined(pickedFeature)) {
        clickHandler(movement);
        return;
      }

      // Select the feature if it's not already selected
      if (silhouetteGreen.selected[0] === pickedFeature) {
        return;
      }

      // Save the selected feature's original color
      const highlightedFeature = silhouetteBlue.selected[0];
      if (pickedFeature === highlightedFeature) {
        silhouetteBlue.selected = [];
      }

      // Highlight newly selected feature
      silhouetteGreen.selected = [pickedFeature];

      // // Set custom feature infobox description
      // viewer.selectedEntity = selectedEntity;
      // viewer.selectedEntity.name = `ID: ${pickedFeature._batchId}`;
      // selectedEntity.description = createPickedFeatureDescription(pickedFeature);
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK);
  } else {
    // Information about the currently highlighted feature
    const highlighted = {
      feature: undefined,
      originalColor: new Cesium.Color(),
    };

    // Color a feature yellow on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
      movement
    ) {
      // If a feature was previously highlighted, undo the highlight
      if (Cesium.defined(highlighted.feature)) {
        highlighted.feature.color = highlighted.originalColor;
        highlighted.feature = undefined;
      }
      // Pick a new feature
      const pickedFeature = viewer.scene.pick(movement.endPosition);
      updateNameOverlay(pickedFeature, movement.endPosition);

      if (!Cesium.defined(pickedFeature)) {
        return;
      }

      // Highlight the feature if it's not already selected.
      if (pickedFeature !== selected.feature) {
        highlighted.feature = pickedFeature;
        Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
        pickedFeature.color = Cesium.Color.YELLOW;
      }
    },
    Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Color a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
      movement
    ) {
      // If a feature was previously selected, undo the highlight
      if (Cesium.defined(selected.feature)) {
        selected.feature.color = selected.originalColor;
        selected.feature = undefined;
      }
      // Pick a new feature
      const pickedFeature = viewer.scene.pick(movement.position);
      if (!Cesium.defined(pickedFeature)) {
        clickHandler(movement);
        return;
      }
      // Select the feature if it's not already selected
      if (selected.feature === pickedFeature) {
        return;
      }
      selected.feature = pickedFeature;
      // Save the selected feature's original color
      if (pickedFeature === highlighted.feature) {
        Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
        highlighted.feature = undefined;
      } else {
        Cesium.Color.clone(pickedFeature.color, selected.originalColor);
      }
      // Highlight newly selected feature
      pickedFeature.color = Cesium.Color.LIME;

      // Set feature infobox description
      viewer.selectedEntity = selectedEntity;
      selectedEntity.description =
        createPickedFeatureDescription(pickedFeature);
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  // Function to update info box content based on picked feature and current language
  function updateInfoBoxContent(pickedFeature) {
    if (!Cesium.defined(pickedFeature)) {
      return;
    }
    selectedEntity.description = createPickedFeatureDescription(pickedFeature);
    viewer.selectedEntity = selectedEntity;
    viewer.selectedEntity.name = `ID: ${pickedFeature._batchId}`;
  }

  // Function to handle language change and update info box content
  function handleLanguageChange() {
    if (lastPickedFeature && viewer.selectedEntity === selectedEntity) {
      updateInfoBoxContent(lastPickedFeature);
    }
  }

  // Add an event listener for language change
  i18next.on("languageChanged", handleLanguageChange);

  // Call handleLanguageChange once to update the content initially
  handleLanguageChange();

  // Function to handle mouse click
  function handleMouseClick(movement) {
    const pickedFeature = viewer.scene.pick(movement.position);
    if (Cesium.defined(pickedFeature)) {
      lastPickedFeature = pickedFeature;

      // Clear any existing selections
      silhouetteBlue.selected = [];
      silhouetteGreen.selected = [];

      // Highlight the picked feature with silhouette effect in LIME color
      silhouetteGreen.selected = [pickedFeature];

      // Update the infobox content
      updateInfoBoxContent(pickedFeature);
    }
  }
  // Add event listener for mouse click
  viewer.screenSpaceEventHandler.setInputAction(
    handleMouseClick,
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  );
}

hightlightFeature();
