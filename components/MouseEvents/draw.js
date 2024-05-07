import { viewer } from "../../index.js";

let distanceDisplay = document.getElementById("distanceDisplay");

viewer.screenSpaceEventHandler.removeInputAction(
  Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
);
function createPoint(worldPosition) {
  const point = viewer.entities.add({
    position: worldPosition,
    point: {
      color: Cesium.Color.WHITE,
      pixelSize: 5,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
  return point;
}

// Function to calculate distance between two Cartesian3 positions in kilometers
function calculateDistance(position1, position2) {
  const distance = Cesium.Cartesian3.distance(position1, position2);
  return distance * 0.001; // Convert to kilometers
}

// Function to update the distance display above the mouse cursor
function updateDistanceDisplay(distance, movement) {
  if (!distanceDisplay) {
    distanceDisplay = document.createElement("div");
    distanceDisplay.id = "distanceDisplay";
    distanceDisplay.style.position = "absolute";
    distanceDisplay.style.fontSize = "smaller";
    distanceDisplay.style.color = "white";
    document.body.appendChild(distanceDisplay);
  }
  distanceDisplay.textContent = `${distance.toFixed(2)} km`;

  // Set position based on mouse movement
  distanceDisplay.style.left = movement.endPosition.x + 10 + "px"; // Add 10px offset
  distanceDisplay.style.top = movement.endPosition.y + 10 + "px"; // Add 10px offset
}
let drawingMode = "line";
function drawShape(positionData) {
  let shape;
  if (drawingMode === "line") {
    shape = viewer.entities.add({
      polyline: {
        positions: positionData,
        clampToGround: true,
        width: 3,
      },
    });
  } else if (drawingMode === "polygon") {
    shape = viewer.entities.add({
      polygon: {
        hierarchy: positionData,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.WHITE.withAlpha(0.7)
        ),
      },
    });
  }
  return shape;
}
let activeShapePoints = [];
let activeShape;
let floatingPoint;
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

const activateDraw = () => {
  handler.setInputAction(function (event) {
    // We use `viewer.scene.globe.pick here instead of `viewer.camera.pickEllipsoid` so that
    // we get the correct point when mousing over terrain.
    const ray = viewer.camera.getPickRay(event.position);
    const earthPosition = viewer.scene.globe.pick(ray, viewer.scene);
    // `earthPosition` will be undefined if our mouse is not over the globe.
    if (Cesium.defined(earthPosition)) {
      if (activeShapePoints.length === 0) {
        floatingPoint = createPoint(earthPosition);
        activeShapePoints.push(earthPosition);
        const dynamicPositions = new Cesium.CallbackProperty(function () {
          if (drawingMode === "polygon") {
            return new Cesium.PolygonHierarchy(activeShapePoints);
          }
          return activeShapePoints;
        }, false);
        activeShape = drawShape(dynamicPositions);
      }
      activeShapePoints.push(earthPosition);
      createPoint(earthPosition);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(function (event) {
    if (Cesium.defined(floatingPoint)) {
      const ray = viewer.camera.getPickRay(event.endPosition);
      const newPosition = viewer.scene.globe.pick(ray, viewer.scene);
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition);
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
      }

      updateDistanceDisplay(
        calculateDistance(
          activeShapePoints[activeShapePoints.length - 1],
          activeShapePoints[activeShapePoints.length - 2]
        ),
        event
      );
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction(function (event) {
    terminateShape();
    // remove updateDistanceDisplay
    if (distanceDisplay) {
      document.body.removeChild(distanceDisplay);
      distanceDisplay = undefined;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
};

// Redraw the shape so it's not dynamic and remove the dynamic shape.
function terminateShape() {
  activeShapePoints.pop();
  drawShape(activeShapePoints);
  viewer.entities.remove(floatingPoint);
  viewer.entities.remove(activeShape);
  floatingPoint = undefined;
  activeShape = undefined;
  activeShapePoints = [];
}

const options = [
  {
    text: "Draw Lines",
    onselect: function () {
      if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
        window.alert("This browser does not support polylines on terrain.");
      }

      terminateShape();
      drawingMode = "line";
    },
  },
  {
    text: "Draw Polygons",
    onselect: function () {
      terminateShape();
      drawingMode = "polygon";
    },
  },
];

// Zoom in to an area with mountains
viewer.camera.lookAt(
  Cesium.Cartesian3.fromDegrees(-122.2058, 46.1955, 1000.0),
  new Cesium.Cartesian3(5000.0, 5000.0, 5000.0)
);
viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

const activateDrawButton = document.getElementById("toggleDrawButton");
let isDrawingActive = false;

activateDrawButton.addEventListener("click", () => {
  if (!isDrawingActive) {
    activateDraw();
    activateDrawButton.style.backgroundColor = "lightgreen";
    isDrawingActive = true;
  } else {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    // Remove the shape
    terminateShape();

    if (distanceDisplay) {
      document.body.removeChild(distanceDisplay);
      distanceDisplay = undefined;
    }

    activateDrawButton.style.backgroundColor = "white";
    isDrawingActive = false;
  }
});
