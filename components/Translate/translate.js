// imports
import {
  updateDate,
  updateTimeChangerTooltipTitle,
} from "../Timechanger/timeChanger.js";
import { updateTableContent, updateToolTipTitles } from "../style/navStyle.js";
import { updateLayerSwitcherToolTipTitle } from "../../index.js";

// This file is responsible for handling the translation of the application.
// It uses the i18next library to load the translation files and update the content of the application.
// It also handles the language change event and updates the content accordingly between swedish and english.
// There are two json files in the components/Translate folder, sv.json and en.json, that contain the translations for the application.
function initializeApp() {
  i18next.use(i18nextXHRBackend).init(
    {
      fallbackLng: "sv",
      backend: {
        loadPath: "./components/Translate/{{lng}}.json",
      },
    },
    function (err, t) {
      if (err) return console.log("something went wrong loading", err);
      updateContent();
    }
  );
}
function updateContent() {
  try {
    document.getElementById("layer-switcher-title").innerText =
      i18next.t("lsTitle");
    document.getElementById("default-content").innerText =
      i18next.t("lsDefaultContent");
    document.getElementById("kba-content").innerText =
      i18next.t("lsKbaContent");
    document.getElementById("timeDateTogglev").innerText =
      i18next.t("timeChangerTitle");
    document.getElementById("monthLabel").innerText =
      i18next.t("timeChangerMonth");
    document.getElementById("dayLabel").innerText = i18next.t("timeChangerDay");
    document.getElementById("hourLabel").innerText =
      i18next.t("timeChangerHour");
    document.getElementById("nidingen-content").innerText =
      i18next.t("lsNidingenContent");
    document.getElementById("bolsheden-content").innerText =
      i18next.t("lsBolShedenContent");
    document.getElementById("hospital-content").innerText =
      i18next.t("lsHospitalContent");
    document.getElementById("tooltipZoomInText").innerText = i18next.t(
      "lsToolTipZoomInText"
    );
    document.getElementById("tooltipZoomOutText").innerText = i18next.t(
      "lsToolTipZoomOutText"
    );
    document.getElementById("tooltipInfoClickHighlightText").innerText =
      i18next.t("lsToolTipInfoClickHighlightText");
    document.getElementById("tooltipDrawText").innerText =
      i18next.t("lsToolTipDrawText");
    document.getElementById("backgroundLayerLabel").innerText =
      i18next.t("blLabel");
    document.getElementById("spinnerLabel").innerText =
      i18next.t("spinnerLabel");
  } catch (error) {
    console.log(error);
  }
}

// set the sv-lang flag as selected by default
document.getElementById("sv-flag").classList.add("selected");

window.changeLanguage = function (lang) {
  try {
    // Remove the 'selected' class from all flag divs
    let flagDivs = document.querySelectorAll(".country-flags > div");
    flagDivs.forEach(function (div) {
      div.classList.remove("selected");
    });

    // Add the 'selected' class to the clicked flag div
    let selectedFlagDiv = document.getElementById(lang + "-flag");
    selectedFlagDiv.classList.add("selected");

    i18next.changeLanguage(lang, function (err, t) {
      // Update UI after language change
      if (err) return console.log("something went wrong loading", err);
      updateContent();
      updateDate();
      updateTableContent();
      updateTimeChangerTooltipTitle();
      updateLayerSwitcherToolTipTitle();
      updateToolTipTitles();
    });
  } catch (error) {
    console.log(error);
  }
};
initializeApp();
