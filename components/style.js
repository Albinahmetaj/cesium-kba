export function applyBasicStyle(defaultTileSetStyle) {
  defaultTileSetStyle.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${operator} === 'Kungsbacka Kommun'", "color('purple')"],
        ["${building} === 'parking'", "color('blue')"],
        ["${building} === 'house'", "color('pink')"],
        ["${building} === 'apartments'", "color('yellow')"],
        ["${building} === 'school'", "color('brown')"],
        ["${shop}", "color('red')"],

        ["true", "color('white')"],
      ],
    },
  });
}
