import { viewer } from "../../index.js";

function initializeApp() {
  i18next.use(i18nextXHRBackend).init(
    {
      fallbackLng: "sv",
      backend: {
        loadPath: "./components/Translate/{{lng}}.json",
      },
    },
    function (err, t) {
      // Initialize elements with translations
      if (err) return console.log("something went wrong loading", err);
      updateContent();
    }
  );
}

function updateContent() {
  document.getElementById("layer-switcher-title").innerText =
    i18next.t("lsTitle");
  document.getElementById("default-content").innerText =
    i18next.t("lsDefaultContent");
  document.getElementById("layer-switcher-content").innerText =
    i18next.t("lsKbaContent");
}

// set the sv-lang flag as selected by default
document.getElementById("sv-flag").classList.add("selected");

window.changeLanguage = function (lang) {
  // Remove the 'selected' class from all flag divs
  let flagDivs = document.querySelectorAll(".country-flags > div");
  flagDivs.forEach(function (div) {
    div.classList.remove("selected");
  });

  // Add the 'selected' class to the clicked flag div
  let selectedFlagDiv = document.getElementById(lang + "-flag");
  selectedFlagDiv.classList.add("selected");

  // Close the info box
  i18next.changeLanguage(lang, function (err, t) {
    // Update UI after language change
    if (err) return console.log("something went wrong loading", err);
    updateContent();
    // prevent opening infobox when changing language
  });
};

initializeApp();
