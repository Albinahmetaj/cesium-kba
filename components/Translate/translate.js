import { updateDate } from "../Timechanger/timeChanger.js";
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
  try {
    document.getElementById("layer-switcher-title").innerText =
      i18next.t("lsTitle");
    document.getElementById("default-content").innerText =
      i18next.t("lsDefaultContent");
    document.getElementById("layer-switcher-content").innerText =
      i18next.t("lsKbaContent");
    document.getElementById("timeDateTogglev").innerText =
      i18next.t("timeChangerTitle");
    document.getElementById("monthLabel").innerText =
      i18next.t("timeChangerMonth");
    document.getElementById("dayLabel").innerText = i18next.t("timeChangerDay");
    document.getElementById("hourLabel").innerText =
      i18next.t("timeChangerHour");
    const tableHeader = document.getElementById("tableHeader");
    if (tableHeader) {
      tableHeader.innerText = i18next.t("infoTableHeader");
    } else {
      console.log("Element with id 'tableHeader' not found.");
    }
    const tableHeaderColor = document.getElementById("tableHeaderColor");
    if (tableHeaderColor) {
      tableHeaderColor.innerText = i18next.t("infoTableHeaderColor");
    } else {
      console.log("Element with id 'tableHeaderColor' not found.");
    }
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

    // Close the info box
    i18next.changeLanguage(lang, function (err, t) {
      // Update UI after language change
      if (err) return console.log("something went wrong loading", err);
      updateContent();
      updateDate();

      // Trigger updateDate function to update the displayed month name
    });
  } catch (error) {
    console.log(error);
  }
};

initializeApp();
