// imports
import { viewer } from "../../index.js";

// This is the draw component that allows the user to draw lines and polygons on the map.
// It uses the Cesium library to draw the shapes and calculate the distance and area of the shapes.
// The user can draw lines and polygons by clicking on the map and double-clicking to finish the shape.
// The distance and area of the shapes are displayed on the map as the user draws the shapes.
// The user can also switch between drawing lines and polygons using the buttons on the toolbar.

let distanceDisplay = document.getElementById("distanceDisplay");
const activateDrawButton = document.getElementById("toggleDrawButton");
const toolBar = document.getElementById("toolbar");

// Function to check if the device is a mobile or tablet
function isMobileOrTablet() {
  let check = false;
  (function (a) {
    if (
      /(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

// Function to hide or show the button based on the device type
function toggleButtonVisibility() {
  if (isMobileOrTablet()) {
    toolBar.style.display = "none";
  } else {
    toolBar.style.display = "flex";
  }
}

// Call the function when the page loads
toggleButtonVisibility();
// Add event listener for changes in viewport size or orientation
addEventListener("resize", toggleButtonVisibility);

// Array to store the points of the shape being drawn
let activeShapePoints = [];
// Variables to store the active shape and floating point
let activeShape;
let floatingPoint;

// Remove the default double-click event handler
viewer.screenSpaceEventHandler.removeInputAction(
  Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
);

// Function to create a point on the map at the given position
// Displays the distance between the two points if the distance is greater than 0.001
function createPoint(worldPosition, position1, position2) {
  viewer.selectedEntity = undefined;
  const distance = calculateDistance(position1, position2);
  const distanceUnit = distance >= 1000 ? "km" : "m";
  const showTextCondition = distance > 0.001;
  const distanceToKm = distance * 0.001;

  // Create a point entity with a label to display the distance
  const point = viewer.entities.add({
    position: worldPosition,
    label:
      drawType === "line"
        ? {
            text: showTextCondition
              ? `${
                  distanceToKm >= 1
                    ? distanceToKm.toFixed(2)
                    : distance.toFixed(2)
                } ` + distanceUnit
              : "",
            font: "14px",
            fillColor: Cesium.Color.AQUA,
            outlineColor: Cesium.Color.BLACK,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
          }
        : null,

    point: {
      color: Cesium.Color.BLACK,
      pixelSize: 5,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });

  return point;
}

// Function to calculate the distance between two points currently used for line drawing
function calculateDistance(position1, position2) {
  try {
    const distance = Cesium.Cartesian3.distance(position1, position2);

    return distance;
  } catch (error) {
    console.log("Distance error: ", error);
  }
}

// Function to calculate the area of the draw type polygon
function calculateArea(activeShapePoints) {
  const points = activeShapePoints.map((cartesian) =>
    Cesium.Cartographic.fromCartesian(cartesian)
  );

  let totalArea = 0;
  const numPoints = points.length;
  for (let i = 0; i < numPoints; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % numPoints];
    totalArea +=
      (Cesium.Math.toDegrees(p2.longitude) -
        Cesium.Math.toDegrees(p1.longitude)) *
      (Cesium.Math.toDegrees(p2.latitude) + Cesium.Math.toDegrees(p1.latitude));
  }

  totalArea = (totalArea / 2) * 6378137.0;
  const area = Math.abs(totalArea / 1000.0);

  let unit = "km²";
  let displayArea = area;

  if (area <= 0.2) {
    // Convert to m²
    displayArea *= 1000000;
    unit = "m²";
  }

  return { area: displayArea, unit: unit };
}

// Function to create the distance display div element above the mouse cursor
function createDistanceDisplay() {
  if (!distanceDisplay) {
    distanceDisplay = document.createElement("div");
    distanceDisplay.id = "distanceDisplay";
    distanceDisplay.style.position = "absolute";
    distanceDisplay.style.fontSize = "medium";
    distanceDisplay.style.fontWeight = "bold";
    distanceDisplay.style.webkitTextStroke = "0.8px black";
    distanceDisplay.style.color = "turquoise";
    document.body.appendChild(distanceDisplay);
  }
}

// Function to update the distance display above the mouse cursor
function updateDistanceDisplay(area, unit, movement) {
  createDistanceDisplay();
  distanceDisplay.textContent = `${area.toFixed(2)} ${unit}`;

  // Set position based on mouse movement
  distanceDisplay.style.left = movement.endPosition.x + 10 + "px";
  distanceDisplay.style.top = movement.endPosition.y + 10 + "px";
}

// Variable to store the drawing type
let drawType = "line";

// Function to draw the shape on the map based on the drawing mode
function drawShape(positionData) {
  activateDrawButton.innerHTML = "";
  let shape;
  if (drawType === "line") {
    shape = viewer.entities.add({
      polyline: {
        positions: positionData,
        clampToGround: true,
        width: 3,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.AQUA.withAlpha(0.7)
        ),
      },
    });
  } else if (drawType === "polygon") {
    shape = viewer.entities.add({
      polygon: {
        hierarchy: positionData,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.AQUA.withAlpha(0.7)
        ),
      },
    });
  }
  return shape;
}

// Create a new screen space event handler, used to handle different mouse events
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

// Function to activate the draw mode
const activateDraw = () => {
  // This first handler is used to draw the shape on the map when the user clicks on the map
  handler.setInputAction(function (event) {
    const ray = viewer.camera.getPickRay(event.position);
    const earthPosition = viewer.scene.globe.pick(ray, viewer.scene);
    if (Cesium.defined(earthPosition)) {
      if (activeShapePoints.length === 0) {
        floatingPoint = createPoint(earthPosition);
        activeShapePoints.push(earthPosition);
        const dynamicPositions = new Cesium.CallbackProperty(function () {
          if (drawType === "polygon") {
            return new Cesium.PolygonHierarchy(activeShapePoints);
          }
          return activeShapePoints;
        }, false);
        activeShape = drawShape(dynamicPositions);
      }

      activeShapePoints.push(earthPosition);
      if (activeShapePoints.length > 1) {
        const lastIndex = activeShapePoints.length - 1;
        if (lastIndex > 1) {
          createPoint(
            earthPosition,
            activeShapePoints[lastIndex],
            activeShapePoints[lastIndex - 2]
          );
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // This handler is used to update the shape and distance display as the user moves the mouse
  handler.setInputAction(function (event) {
    const { area, unit } = calculateArea(activeShapePoints);

    if (Cesium.defined(floatingPoint)) {
      const ray = viewer.camera.getPickRay(event.endPosition);
      const newPosition = viewer.scene.globe.pick(ray, viewer.scene);
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition);
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
      }

      const distance = calculateDistance(
        activeShapePoints[activeShapePoints.length - 1],
        activeShapePoints[activeShapePoints.length - 2]
      );

      const distanceUnit = distance >= 1000 ? "km" : "m";
      const distanceToKm = distance * 0.001;

      if (drawType === "line") {
        updateDistanceDisplay(
          distance >= 1000 ? distanceToKm : distance,
          distanceUnit,
          event
        );
      } else if (drawType === "polygon") {
        updateDistanceDisplay(area, unit, event);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // This handler is used to finish the shape when the user double-clicks on the map
  handler.setInputAction(function (event) {
    terminateShape();
    if (distanceDisplay) {
      document.body.removeChild(distanceDisplay);
      distanceDisplay = undefined;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
};

// Function to terminate the shape drawing and display the area of the polygon as a label
function terminateShape() {
  // Display the area of the polygon as a label
  if (drawType === "polygon") {
    const center = Cesium.BoundingSphere.fromPoints(activeShapePoints).center;
    const { area, unit } = calculateArea(activeShapePoints);
    viewer.entities.add({
      position: center,
      label: {
        text: `${area.toFixed(2)} ${unit}`,
        font: "16px",
        fillColor: Cesium.Color.AQUA,
        outlineColor: Cesium.Color.BLACK,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -9),
      },
    });
  }
  activeShapePoints.pop();
  drawShape(activeShapePoints);
  viewer.entities.remove(floatingPoint);
  viewer.entities.remove(activeShape);
  floatingPoint = undefined;
  activeShape = undefined;
  activeShapePoints = [];
}

// Variable to store the state of the drawing mode
let isDrawingActive = false;

// Event listener for the draw button to activate or deactivate the draw mode
// It indicates the state of the drawing mode by changing the background color of the button
// It also displays the child buttons for selecting the drawing type (line or polygon)
// The user can switch between drawing lines and polygons using the buttons
// The user can also delete the drawing shapes using the delete button
activateDrawButton.addEventListener("click", () => {
  if (!isDrawingActive) {
    activateDraw();
    activateDrawButton.style.backgroundColor = "lightgreen";

    const childButtonsContainer = document.createElement("div");
    childButtonsContainer.classList.add("childButtonsContainer");

    isDrawingActive = true;

    viewer.canvas.style.cursor =
      "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%222em%22 height=%222em%22 viewBox=%220 0 24 24%22%3E%3Cpath fill=%22white%22 d=%22M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12m0-1.5a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9%22/%3E%3C/svg%3E') 12 12, auto";

    const lineButton = document.createElement("button");
    lineButton.onclick = (e) => {
      e.stopPropagation();
      drawType = "line";
      polygonButton.style.backgroundColor = "white";
      lineButton.style.backgroundColor = "lightgreen";
      lineButton.classList.add("selectedToolBtn");
      polygonButton.classList.remove("selectedToolBtn");
    };
    lineButton.id = "lineButton";
    drawType = "line";
    lineButton.style.backgroundColor = "lightgreen";

    const polygonButton = document.createElement("button");
    polygonButton.onclick = (e) => {
      e.stopPropagation();
      drawType = "polygon";
      lineButton.style.backgroundColor = "white";
      polygonButton.style.backgroundColor = "lightgreen";
      polygonButton.classList.add("selectedToolBtn");
      lineButton.classList.remove("selectedToolBtn");
    };
    polygonButton.id = "polygonButton";

    const deleteButton = document.createElement("button");
    deleteButton.onclick = () => {
      clearDrawing();
    };
    deleteButton.id = "deleteButton";

    childButtonsContainer.appendChild(deleteButton);
    childButtonsContainer.appendChild(polygonButton);
    childButtonsContainer.appendChild(lineButton);

    activateDrawButton.appendChild(childButtonsContainer);

    activateDrawButton.classList.add("active");

    isDrawingActive = true;
  } else {
    activateDrawButton.innerHTML = "";
    activateDrawButton.classList.remove("active");
    viewer.canvas.style.cursor = "auto";
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    terminateShape();
    activateDrawButton.style.backgroundColor = "white";
    if (distanceDisplay) {
      document.body.removeChild(distanceDisplay);
      distanceDisplay = undefined;
    }
    isDrawingActive = false;
  }
});

// Remove all drawing shapes and points
function clearDrawing() {
  viewer.entities.removeAll();
  if (distanceDisplay) {
    document.body.removeChild(distanceDisplay);
    distanceDisplay = undefined;
  }
  activeShapePoints = [];
  activeShape = undefined;
  floatingPoint = undefined;
}
