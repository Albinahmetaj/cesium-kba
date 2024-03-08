// Define a global object to store building colors
const buildingColors = {};

export function applyBasicStyle(defaultTileSetStyle) {
  try {
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
  } catch (error) {
    console.log(error);
  }

  // Update buildingColors object with the colors applied
  buildingColors["Kungsbacka Kommun"] = "purple";
  buildingColors["Parkering"] = "blue";
  buildingColors["Hus"] = "pink";
  buildingColors["Lägenheter"] = "yellow";
  buildingColors["Skola"] = "brown";
  buildingColors["Affärer"] = "red";
  // You can add more entries here if needed
}

// Function to get building colors
export function getBuildingColors() {
  try {
    return buildingColors;
  } catch (error) {
    console.log(error);
  }
}
