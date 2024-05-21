// Component for resizing the card/s through the use of interact.js library.
interact("#draggableLayerSwitcherCard").resizable({
  edges: { top: true, left: true, bottom: true, right: true },
  listeners: {
    move(event) {
      const rect = event.rect;

      Object.assign(event.target.style, {
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        transform: `translate(${rect.left}px, ${rect.top}px)`, // Update position during resizing
      });

      Object.assign(event.target.dataset, { x: rect.left, y: rect.top });
    },
  },
});
