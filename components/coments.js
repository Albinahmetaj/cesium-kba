// // Your access token can be found at: https://ion.cesium.com/tokens.
// // This is the default access token from your ion account
// Cesium.Ion.defaultAccessToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNDQ3MDgxZC02OWU2LTRiNTMtYjUyNS1hYmRiMGRjMGE2N2EiLCJpZCI6MTkxOTM0LCJpYXQiOjE3MDc5MTU1NzF9.wwiBhBlO6d9r53a5uOWZkATR5tZGFzUpbt-I1ewTP1w";

// const viewer = new Cesium.Viewer("cesiumContainer", {
//   terrain: Cesium.Terrain.fromWorldTerrain(),
// });

// let buildingTileset = await Cesium.createOsmBuildingsAsync();
// buildingTileset.height = 0; // Render the tileset at ground level
// viewer.scene.globe.depthTestAgainstTerrain = false;

// viewer.scene.globe.terrainProviderChanged.addEventListener(function () {
//   // Add the tileset once the terrain has changed
//   viewer.scene.primitives.add(buildingTileset);
// });
// function applyViewer() {
//   // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
//   const extras = buildingTileset.asset.extras;
//   if (
//     Cesium.defined(extras) &&
//     Cesium.defined(extras.ion) &&
//     Cesium.defined(extras.ion.defaultStyle)
//   ) {
//     buildingTileset.style = new Cesium.Cesium3DTileStyle(
//       extras.ion.defaultStyle
//     );
//   }
//   // Fly the camera to kba at the given longitude, latitude, and height.
//   viewer.camera.flyTo({
//     destination: Cesium.Cartesian3.fromDegrees(12.1242, 57.447464, 3000),
//     orientation: {
//       heading: Cesium.Math.toRadians(-30),
//       pitch: Cesium.Math.toRadians(-30),
//     },
//   });
// }

// async function buildTileset() {
//   applyBasicStyle(buildingTileset);
//   viewer.scene.primitives.add(buildingTileset);
// }

// // Add mouse move event listener
// function applyMouseHoverEvent() {
//   let lastHoveredObject = null;
//   let lastHoveredColor = null;
//   let clickedObject = null;

//   viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
//     let pickedObject = viewer.scene.pick(movement.endPosition);
//     if (Cesium.defined(pickedObject)) {
//       // If a different object is being hovered over, revert the color of the last hovered object
//       if (pickedObject !== lastHoveredObject) {
//         if (
//           Cesium.defined(lastHoveredObject) &&
//           lastHoveredObject !== clickedObject
//         ) {
//           lastHoveredObject.color = lastHoveredColor;
//         }
//         // Save the color and object being hovered over
//         lastHoveredObject = pickedObject;
//         lastHoveredColor = pickedObject.color.clone();
//       }
//       // Change the color of the hovered object to blue
//       if (pickedObject !== clickedObject) {
//         pickedObject.color = Cesium.Color.LIGHTBLUE;
//       }
//     } else {
//       // If no object is being hovered over, revert the color of the last hovered object
//       if (
//         Cesium.defined(lastHoveredObject) &&
//         lastHoveredObject !== clickedObject
//       ) {
//         lastHoveredObject.color = lastHoveredColor;
//       }
//       // Reset the last hovered object and color
//       lastHoveredObject = null;
//       lastHoveredColor = null;
//     }
//   }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

//   // Mouse event when clicked on the building tileset set the color to green
//   viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
//     let pickedObject = viewer.scene.pick(movement.position);
//     if (Cesium.defined(pickedObject)) {
//       // Remove lime color from previously clicked object
//       if (Cesium.defined(clickedObject)) {
//         clickedObject.color = lastHoveredColor;
//       }

//       // Change the color of the clicked object to lime
//       clickedObject = pickedObject;
//       pickedObject.color = Cesium.Color.LIME;

//       // Show the infobox for the clicked object
//       viewer.selectedEntity = pickedObject;
//     }
//   }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//   // Listen for the infobox to close and revert the color
//   viewer.infoBox.viewModel.isClosed.addEventListener(function () {
//     if (Cesium.defined(clickedObject)) {
//       clickedObject.color = lastHoveredColor;
//       clickedObject = null;
//     }
//   });
// }
// applyViewer();
// buildTileset();
// applyMouseHoverEvent();
