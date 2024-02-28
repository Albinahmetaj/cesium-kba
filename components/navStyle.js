document.addEventListener("DOMContentLoaded", function () {
  const toolbar = document.querySelector("div.cesium-viewer-toolbar");
  const modeButton = document.querySelector(
    "span.cesium-sceneModePicker-wrapper"
  );
  const myButton = document.createElement("button");
  myButton.classList.add("cesium-button", "cesium-toolbar-button");

  // Create a <span> element for the Iconify icon
  const iconSpan = document.createElement("span");
  iconSpan.classList.add("infoNavBtn");
  iconSpan.setAttribute("data-icon", "mdi:camera");

  // Append the icon to the button
  myButton.appendChild(iconSpan);
  const draggableCard = document.getElementById("draggableCard");

  // Insert the button into the toolbar
  toolbar.insertBefore(myButton, modeButton);

  let tableShown = false;
  let table = null;
  makeDraggable(draggableCard);

  // Function to create and toggle the table
  function toggleTable() {
    if (!tableShown) {
      // Create the table element
      table = document.createElement("table");
      table.classList.add("infoTable");
      // Add your table content here
      table.innerHTML = `
            <thead>
                <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Data 1</td>
                    <td>Data 2</td>
                </tr>
                <tr>
                    <td>Data 3</td>
                    <td>Data 4</td>
                </tr>
            </tbody>
        `;

      // Append the table to the document body or any other desired location
      document.body.appendChild(table);
      tableShown = true;

      // Make the table draggable
      makeDraggable(table);
    } else {
      // Remove the table
      if (table) {
        table.remove();
        table = null;
      }
      tableShown = false;
    }
  }

  // Add event listener to the icon span to toggle the table when clicked
  iconSpan.addEventListener("click", toggleTable);

  // Function to make an element draggable
  function makeDraggable(element) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    // Function to handle mouse/touch events for dragging
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function touchDragStart(e) {
      e.preventDefault();
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
      document.addEventListener("touchend", closeDragElement);
      document.addEventListener("touchmove", touchElementDrag);
    }

    function touchElementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.touches[0].clientX;
      pos2 = pos4 - e.touches[0].clientY;
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
      element.style.top = element.offsetTop - pos2 + "px";
      element.style.left = element.offsetLeft - pos1 + "px";
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      element.style.top = element.offsetTop - pos2 + "px";
      element.style.left = element.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
      document.removeEventListener("touchend", closeDragElement);
      document.removeEventListener("touchmove", touchElementDrag);
    }

    // Event listeners for starting the drag
    element.onmousedown = dragMouseDown;
    element.ontouchstart = touchDragStart;
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const pathElement = document.querySelector(
    'path[d="M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z M17.328,24.371h-2.707v-2.596h2.707V24.371zM17.328,19.003v0.858h-2.707v-1.057c0-3.19,3.63-3.696,3.63-5.963c0-1.034-0.924-1.826-2.134-1.826c-1.254,0-2.354,0.924-2.354,0.924l-1.541-1.915c0,0,1.519-1.584,4.137-1.584c2.487,0,4.796,1.54,4.796,4.136C21.156,16.208,17.328,16.627,17.328,19.003z"]'
  );

  // New path data
  const newPathData =
    "M12,22 q-2.9,0 -4.95,-2.05 t-2.05,-4.95 v-6 q0,-2.9 2.05,-4.95 t4.95,-2.05 q2.9,0 4.95,2.05 t2.05,4.95 v6 q0,2.9 -2.05,4.95 t-4.95,2.05 m1,-13 h4 q0,-1.8 -1.137,-3.175 t-2.863,-1.725zM7,9 h4 v-5.1 q-1.725,0.35 -2.863,1.725 t-1.137,3.175 m5,11 q2.075,0 3.538,-1.463 t1.463,-3.538 v-4 H7 v4 q0,2.075 1.463,3.538 t3.538,1.463 m0,-9";

  // Create a new path element
  const newPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  // Set attributes for the new path
  newPath.setAttribute("d", newPathData);
  newPath.setAttribute("fill", "currentColor");
  newPath.setAttribute("transform", "scale(1.4)"); // Scale the path by 2

  // Replace the existing path with the new one
  pathElement.parentNode.replaceChild(newPath, pathElement);
});
