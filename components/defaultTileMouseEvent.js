// import { viewer } from "../index.js";

// function applyColor() {
//   let lastHoveredObject = null;
//   let lastHoveredColor = null;
//   let clickedObject = null;

//   try {
//     viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
//       movement
//     ) {
//       let pickedObject = viewer.scene.pick(movement.endPosition);
//       if (Cesium.defined(pickedObject)) {
//         // If a different object is being hovered over, revert the color of the last hovered object
//         if (pickedObject !== lastHoveredObject) {
//           if (
//             Cesium.defined(lastHoveredObject) &&
//             lastHoveredObject !== clickedObject
//           ) {
//             lastHoveredObject.color = lastHoveredColor;
//           }
//           // Save the color and object being hovered over
//           lastHoveredObject = pickedObject;
//           lastHoveredColor = pickedObject.color.clone();
//         }
//         // Change the color of the hovered object to blue
//         if (pickedObject !== clickedObject) {
//           pickedObject.color = Cesium.Color.LIGHTBLUE;
//         }
//       } else {
//         // If no object is being hovered over, revert the color of the last hovered object
//         if (
//           Cesium.defined(lastHoveredObject) &&
//           lastHoveredObject !== clickedObject
//         ) {
//           lastHoveredObject.color = lastHoveredColor;
//         }
//         // Reset the last hovered object and color
//         lastHoveredObject = null;
//         lastHoveredColor = null;
//       }
//     },
//     Cesium.ScreenSpaceEventType.MOUSE_MOVE);

//     // Mouse event when clicked on the building tileset set the color to green
//     viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
//       movement
//     ) {
//       let pickedObject = viewer.scene.pick(movement.position);
//       if (Cesium.defined(pickedObject)) {
//         // Remove lime color from previously clicked object
//         if (Cesium.defined(clickedObject)) {
//           clickedObject.color = lastHoveredColor;
//         }

//         // Change the color of the clicked object to lime
//         clickedObject = pickedObject;
//         pickedObject.color = Cesium.Color.LIME;
//         // Get the default entity from the picked object
//         let customEntity = new Cesium.Entity();
//         customEntity.name = "Building Information";
//         customEntity.description = `Building ID: ${pickedObject._batchId}`;
//         customEntity.position = pickedObject.position;

//         // Show the default infobox values for the picked object
//         viewer.selectedEntity = customEntity;

//         //   var bluePin = viewer.entities.add({
//         //     name : 'Blank blue pin',
//         //     position : Cesium.Cartesian3.fromDegrees(-75.170726, 39.9208667),

//         //       description :'<table class="cesium-infoBox-defaultTable"><tbody>' +
//         //                                  '<tr><th>POLE LOCATION</th><td>' +  ('-75.170726, 39.9208667') + '</td></tr>' +
//         //                                  '<tr><th>HOUSE ID</th><td>' +  ('A/64') + '</td></tr>' +
//         //                                  '<tr><th>FILE COMPLAINT</th><td>' +
//         //                                   ('<form id="form1">name:<input name="name" type="text" size="20"></form>') +
//         //                                   ('<div style="text-align:center; padding:15px"><button class="click-test-button">Click here</button></div>') +
//         //                                   '</td></tr>' + //adding click button
//         //                                   '</tbody></table>',
//         //       billboard : {
//         //         image : pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL(),
//         //         verticalOrigin : Cesium.VerticalOrigin.BOTTOM
//         //     }

//         // });
//       }
//     },
//     Cesium.ScreenSpaceEventType.LEFT_CLICK);

//     // Listen for the infobox to close and revert the color
//     viewer.infoBox.viewModel.closeClicked.addEventListener(function () {
//       console.log("Infobox closeClicked event fired.");
//       if (Cesium.defined(clickedObject)) {
//         console.log(
//           "Infobox closed. Reverting color for clicked object:",
//           clickedObject
//         );
//         clickedObject._color = null;
//         clickedObject.color = Cesium.Color.fromCssColorString("white");
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// applyColor();
