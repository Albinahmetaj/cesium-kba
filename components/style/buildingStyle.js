// Define a global object to store building color names
const buildingColorNames = {
  "Kungsbacka Kommun": "Kungsbacka Kommun",
  Parkering: "Parkering",
  Hus: "Hus",
  Lägenheter: "Lägenheter",
  Skola: "Skola",
  Affärer: "Affärer",
};

// Define a global object to store building color values
const buildingColors = {
  "Kungsbacka Kommun": "purple",
  Parkering: "blue",
  Hus: "pink",
  Lägenheter: "yellow",
  Skola: "brown",
  Affärer: "red",
};

export function applyBasicStyle(defaultTileSetStyle) {
  try {
    defaultTileSetStyle.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          [
            "${operator} === 'Kungsbacka Kommun'",
            `color('${buildingColors["Kungsbacka Kommun"]}')`,
          ],
          [
            "${building} === 'parking'",
            `color('${buildingColors["Parkering"]}')`,
          ],
          ["${building} === 'house'", `color('${buildingColors["Hus"]}')`],
          [
            "${building} === 'apartments'",
            `color('${buildingColors["Lägenheter"]}')`,
          ],
          ["${building} === 'school'", `color('${buildingColors["Skola"]}')`],
          ["${shop}", `color('${buildingColors["Affärer"]}')`],
          ["true", "color('white')"],
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
}

// Function to get building color names with translations
export function getBuildingColorNames() {
  try {
    let translatedBuildingColorNames = {};
    for (const [key, value] of Object.entries(buildingColorNames)) {
      translatedBuildingColorNames[key] = i18next.t("buildingColors." + value);
    }
    return translatedBuildingColorNames;
  } catch (error) {
    console.log(error);
  }
}
// Function to get building colors
export function getBuildingColors() {
  try {
    return buildingColors;
  } catch (error) {
    console.log(error);
  }
}
