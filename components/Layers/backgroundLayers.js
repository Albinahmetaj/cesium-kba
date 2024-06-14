import { viewer } from "../../index.js";

// This file is responsible for handling the background layers of the application.
// It fetches the WMS layers from the server and displays them in the layer switcher.
// It also handles the selection of layers and updates the imagery provider accordingly.

// Function to create a WMS Imagery Provider dynamically
function createWMSImageryProvider(layerName) {
  return new Cesium.WebMapServiceImageryProvider({
    url: "https://ikarta.kungsbacka.se/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap",
    layers: layerName,
    parameters: {
      format: "image/png",
      transparent: "true",
    },
  });
}
// URL to fetch the WMS layers
const getCapabilitiesUrl =
  "https://ikarta.kungsbacka.se/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities";

const fallbackUrl =
  "https://karta.kungsbacka.se/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities";

// Get the necessary elements
const loaderElement = document.getElementById("loader");
const imageContainer = document.getElementById("imgContainer");
const imageElement = document.getElementById("layerImage");
const backgroundLayerUl = document.getElementById("blbItemsUl");
const backgroundLayerBar = document.getElementById("backGroundLayerContainer");

// Custom logging function to control the severity level of logs
function logMessage(level, message) {
  switch (level) {
    case "info":
      console.info(message);
      break;
    case "warn":
      console.warn(message);
      break;
    case "error":
      console.error(message);
      break;
    default:
      console.log(message);
  }
}

// Function to fetch WMS layers from the server
function fetchWMSLayers(url) {
  // Show the loader and hide the container element for background layers
  loaderElement.classList.remove("hidden");
  backgroundLayerBar.classList.add("hidden");
  imageContainer.classList.add("hidden");

  // Fetch the WMS layers
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      return response.text();
    })
    .then((data) => {
      // Parse the XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      // Get all Layer elements
      const layers = xmlDoc.getElementsByTagName("Layer");
      // Array to store titles, names, and abstracts
      const layerArray = [];
      // Iterate through each Layer element
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];

        // Get the Name, Title, and Abstract elements within each Layer
        const nameElement = layer.getElementsByTagName("Name")[0];
        const titleElement = layer.getElementsByTagName("Title")[0];
        const abstractElement = layer.getElementsByTagName("Abstract")[0];

        // Check if all elements are present
        if (nameElement && titleElement && abstractElement) {
          const layerName = nameElement.textContent.trim();
          const layerTitle = titleElement.textContent.trim();
          const layerAbstract = abstractElement.textContent.trim();
          // Include layers where the title contains 'cesium_'
          if (layerTitle.startsWith("cesium_")) {
            const displayTitle = layerTitle.replace("cesium_", ""); // Remove 'cesium_' prefix
            layerArray.push({ displayTitle, layerName, layerAbstract });
          }
        }
      }

      // Loop through the layerArray and create the list items in background layers for each item
      layerArray.forEach(({ displayTitle, layerName, layerAbstract }) => {
        const li = document.createElement("li");
        const buttonForEachLi = document.createElement("button");
        const imageForEachLi = document.createElement("img");
        const labelButton = document.createElement("span");

        // Add classes to elements
        li.classList.add("blbItemLi");
        buttonForEachLi.classList.add("blbItemButton");
        imageForEachLi.classList.add("blbItemImage");
        labelButton.classList.add("blbItemLabel");
        // Set image source
        imageForEachLi.src = `${"../../assets/" + displayTitle}.png`;

        // Add an error handler to use the emptyImageError image if the specified image is not found
        imageForEachLi.onerror = (event) => {
          console.log(`Failed to load image: ${event.target.src}`);
          imageForEachLi.src = "../../assets/emptyImageError.png";
        };
        // Process layer names
        const trimLayerName = layerName.replace("ikba:", "");
        const replaceLayerAbstract = layerAbstract.replace("cesium_", "");
        const layerNameCut = trimLayerName.slice(0, 11) + "...";
        // Set labelButton innerHTML
        labelButton.innerHTML = replaceLayerAbstract
          ? replaceLayerAbstract
          : layerNameCut;
        labelButton.dataset.trimLayerName = layerName;

        // Append elements appropriately
        li.appendChild(buttonForEachLi);
        buttonForEachLi.appendChild(imageForEachLi);
        buttonForEachLi.appendChild(labelButton);
        backgroundLayerUl.appendChild(li);
      });

      // Set the classlist selected as flygfoto by default
      const liElements = document.querySelectorAll(".blbItemButton");

      liElements.forEach((li) => {
        if (
          li.querySelector("span").dataset.trimLayerName ===
          "ikba:flygfoto_kba_2023_8cm_geotiff"
        ) {
          li.classList.add("selected");
        }
      });

      // An event listener to handle the click event on the background layers, and update the imagery provider
      backgroundLayerUl.addEventListener("click", function (event) {
        const target = event.target;

        const liElements = document.querySelectorAll(".blbItemButton");
        // Displays the currently selected background layer
        liElements.forEach((li) => {
          li.classList.remove("selected");
        });
        if (target.classList.contains("blbItemButton")) {
          target.classList.add("selected");
        } else if (target.closest(".blbItemButton")) {
          target.closest(".blbItemButton").classList.add("selected");
        }

        // Check if the clicked element is a button or a child of a button
        if (
          target.classList.contains("blbItemButton") ||
          target.closest(".blbItemButton")
        ) {
          const button = target.closest(".blbItemButton");
          const labelButton = button.querySelector(".blbItemLabel");
          const selectedLayerName = labelButton.dataset.trimLayerName;

          // Remove the current imagery layer
          const layers = viewer.imageryLayers;
          layers.removeAll();

          // Check if a layer is selected
          if (selectedLayerName) {
            // Add the selected layer to the viewer
            const imageryProvider = createWMSImageryProvider(selectedLayerName);
            layers.addImageryProvider(imageryProvider);

            // Remove the 'ikba:' prefix from the layer name
            const trimSelectedLayerName = selectedLayerName.replace(
              "ikba:",
              ""
            );
            // Set the image source to the selected layer
            if (trimSelectedLayerName) {
              imageElement.src = `${
                "../../assets/" + trimSelectedLayerName
              }.png`;
            } else {
              imageElement.src = "../../assets/default.png";
            }
          }
        }
      });

      // Set the default layer to 'flygfoto_kba_2023_8cm_geotiff'
      const defaultLayerTitle = "flygfoto_kba_2023_8cm_geotiff";
      // Find the default layer in the layer array
      const defaultLayer = layerArray.find(
        (layer) => layer.displayTitle === defaultLayerTitle
      );
      // Check if the default layer is found
      if (defaultLayer) {
        // This part of the code is responsible for setting the background layer
        // to the main background container element (the hover element)
        // It also sets the image source to the selected layer
        // and handles the error if the image is not found
        // It's the exact same code as the one above, but for the main container element
        const selectElement = document.getElementById("blbItemsUl");
        selectElement.value = defaultLayer.layerName;
        const imageryProvider = createWMSImageryProvider(
          defaultLayer.layerName
        );
        viewer.imageryLayers.addImageryProvider(imageryProvider);
        const trimDefaultLayerName = defaultLayer.layerName.replace(
          "ikba:",
          ""
        );
        imageElement.src = `${"../../assets/" + trimDefaultLayerName}.png`
          ? `${"../../assets/" + trimDefaultLayerName}.png`
          : "../../assets/default.png";
      } else {
        const url = "https://karta.kungsbacka.se/geoserver/wms?";
        const imageryProvider = new Cesium.WebMapServiceImageryProvider({
          url: url,
          parameters: {
            format: "image/png",
            transparent: "true",
          },
          layers: "kba:flygfoto_kba_2023_8cm_geotiff",
        });
        viewer.imageryLayers.addImageryProvider(imageryProvider);
        imageElement.src = "../../assets/flygfoto_kba_2023_8cm_geotiff.png";
      }

      imageElement.onerror = (event) => {
        console.log(`Failed to load image: ${event.target.src}`);
        imageElement.src = "../../assets/emptyImageError.png";
      };

      if (url !== fallbackUrl) {
        backgroundLayerBar.classList.remove("hidden");
      }

      // Hide the loader and show the container element for background layers
      loaderElement.classList.add("hidden");
      imageContainer.classList.remove("hidden");
    })
    // Handle fetch errors
    .catch((error) => {
      logMessage("info", `Fetch error: ${error.message} server: ${url}`);
      loaderElement.classList.add("hidden");

      // Retry with the fallback URL
      if (url !== fallbackUrl) {
        fetchWMSLayers(fallbackUrl);
      } else {
        // Handle failure when both URLs fail
        // Add the default cesium imagery provider to the viewer
        logMessage("info", "Both primary and fallback URLs failed.");
        loaderElement.classList.add("hidden");
        imageContainer.classList.remove("hidden");
        const defaultImageryProvider = Cesium.ImageryLayer.fromProviderAsync(
          Cesium.IonImageryProvider.fromAssetId(2)
        );

        viewer.imageryLayers.add(defaultImageryProvider);
        imageElement.src = "../../assets/default.png";
      }
    });
}

// Event listener to handle the mouseenter and mouseleave events on the background layer bar
document.addEventListener("DOMContentLoaded", () => {
  const parent = document.querySelector(".container");
  const child = document.querySelector(".backgroundLayerBar");

  let timer;

  parent.addEventListener("mouseenter", () => {
    clearTimeout(timer);
    child.style.display = "block";
  });

  parent.addEventListener("mouseleave", () => {
    timer = setTimeout(() => {
      child.style.display = "none";
    }, 200);
  });
});

// Call the function with the primary URL
fetchWMSLayers(getCapabilitiesUrl);
