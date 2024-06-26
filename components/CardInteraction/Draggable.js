// Component for making a card draggable through the use of interact.js library.

const positionLS = { x: 0, y: 0 };
const positionTimeChanger = { x: 0, y: 0 };
const positionInfo = { x: 0, y: 0 };

interact("#draggableLayerSwitcherCard").draggable({
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "parent",
      endOnly: true,
    }),
  ],
  ignoreFrom: ".ignoreCameraDrag",
  autoScroll: true,
  listeners: {
    move(event) {
      const target = event.target;
      positionLS.x += event.dx;
      positionLS.y += event.dy;

      target.style.transform = `translate(${positionLS.x}px, ${positionLS.y}px)`;
    },
  },
});
interact("#timeChangerCard").draggable({
  // enable inertial throwing
  inertia: true,
  // keep the element within the area of it's parent
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "parent",
      endOnly: true,
    }),
  ],
  // enable autoScroll
  autoScroll: true,
  ignoreFrom: ".ignoreSliderDrag",
  listeners: {
    move: dragMoveListener,
    move(event) {
      positionTimeChanger.x += event.dx;
      positionTimeChanger.y += event.dy;

      event.target.style.transform = `translate(${positionTimeChanger.x}px, ${positionTimeChanger.y}px)`;
    },
  },
});
interact("#infoTable").draggable({
  // enable inertial throwing
  inertia: true,
  // keep the element within the area of it's parent
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "parent",
      endOnly: true,
    }),
  ],
  // enable autoScroll
  autoScroll: true,
  listeners: {
    move: dragMoveListener,
    move(event) {
      positionInfo.x += event.dx;
      positionInfo.y += event.dy;

      event.target.style.transform = `translate(${positionInfo.x}px, ${positionInfo.y}px)`;
    },
  },
});
function dragMoveListener(event) {
  let target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.transform = "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;
