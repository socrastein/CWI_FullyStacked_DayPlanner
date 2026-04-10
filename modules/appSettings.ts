import { useSyncExternalStore } from "react";
import { renderCalendarView } from "./calendar/calendar";
import appState from "./appState";

const colorThemes = {
  blue: { hex: "#0d6efd", rgb: "13, 110, 253" },
  purple: { hex: "#6c5a91", rgb: "108, 90, 145" },
  pink: { hex: "#8f5173", rgb: "143, 81, 115" },
  red: { hex: "#c15b58", rgb: "193, 91, 88" },
  orange: { hex: "#b7613f", rgb: "157, 119, 81" },
  yellow: { hex: "#c8ac69", rgb: "200, 172, 105" },
  green: { hex: "#378e3c", rgb: "114, 132, 97" },
};

/**
 * Manages application settings, including saving to and loading from localStorage.
 * Each binary setting has a getter and a toggle method.
 * The color theme setting has a getter and a setter that validates the assigned value
 * against a predefined list of valid options.
 *
 * The restoreDefaults() method resets all settings to their default values.
 *
 * The class also implements a simple subscription mechanism
 * to notify React listeners when settings change.
 */
class AppSettings {
  private _lightMode: "light" | "dark" = "light";
  private _tempUnit: "Celsius" | "Fahrenheit" = "Fahrenheit";
  private _firstDayOfWeek: "Sunday" | "Monday" = "Sunday";
  private _displayHolidays: boolean = true;
  private _colorTheme: keyof typeof colorThemes = "blue";

  // For setting CSS variables related to color themes
  private root = document.documentElement;

  private snapshot = this.buildSnapshot();
  private listeners = new Set<() => void>();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot() {
    return this.snapshot;
  }

  private buildSnapshot() {
    return {
      lightMode: this._lightMode,
      tempUnit: this._tempUnit,
      firstDayOfWeek: this._firstDayOfWeek,
      displayHolidays: this._displayHolidays,
      colorTheme: this._colorTheme,
    };
  }

  private notifyListeners() {
    this.snapshot = this.buildSnapshot();
    this.listeners.forEach((listener) => listener());
  }

  get lightMode() {
    return this._lightMode;
  }
  // Sets bootstrap theme and body class based on light mode setting
  toggleLightMode = () => {
    if (this._lightMode === "light") {
      this._lightMode = "dark";
      document.documentElement.setAttribute("data-bs-theme", "dark");
      document.body.classList.add("dark-mode");
    } else {
      this._lightMode = "light";
      document.documentElement.setAttribute("data-bs-theme", "light");
      document.body.classList.remove("dark-mode");
    }
    this.saveSettings();
  };

  get tempUnit() {
    return this._tempUnit;
  }
  toggleTempUnit = () => {
    if (this._tempUnit === "Fahrenheit") {
      this._tempUnit = "Celsius";
    } else {
      this._tempUnit = "Fahrenheit";
    }
    this.notifyListeners();
    this.saveSettings();
  };

  get firstDayOfWeek() {
    return this._firstDayOfWeek;
  }
  toggleFirstDayOfWeek = () => {
    if (this._firstDayOfWeek === "Sunday") {
      this._firstDayOfWeek = "Monday";
    } else {
      this._firstDayOfWeek = "Sunday";
    }
    this.notifyListeners();
    this.saveSettings();
  };

  get displayHolidays() {
    return this._displayHolidays;
  }
  toggleDisplayHolidays = () => {
    if (this._displayHolidays === true) {
      this._displayHolidays = false;
    } else {
      this._displayHolidays = true;
    }
    this.notifyListeners();
    renderCalendarView(
      appState.allEventsByDate,
      appState.dateViewObject,
      appState.calendarView,
    );
    this.saveSettings();
  };

  get colorTheme() {
    return this._colorTheme;
  }
  set colorTheme(value) {
    if (value in colorThemes) {
      this._colorTheme = value;
      // Update Bootstrap primary color CSS variables based on selected theme
      this.root.style.setProperty("--bs-primary", colorThemes[value].hex);
      this.root.style.setProperty("--bs-primary-rgb", colorThemes[value].rgb);
    } else {
      throw new Error(
        `Invalid color theme: ${value}. Valid options are: ${Object.keys(
          colorThemes,
        ).join(", ")}.`,
      );
    }
    this.saveSettings();
  }

  restoreDefaults() {
    document.documentElement.setAttribute("data-bs-theme", "light");
    document.body.classList.remove("dark-mode");
    this._lightMode = "light";
    this._tempUnit = "Fahrenheit";
    this._firstDayOfWeek = "Sunday";
    this._displayHolidays = true;
    this._colorTheme = "blue";
    this.notifyListeners();
    this.saveSettings();
  }

  saveSettings() {
    const settings = {
      lightMode: this._lightMode,
      tempUnit: this._tempUnit,
      firstDayOfWeek: this._firstDayOfWeek,
      displayHolidays: this._displayHolidays,
      colorTheme: this._colorTheme,
    };
    localStorage.setItem("DayPlannerSettings", JSON.stringify(settings));
  }

  loadSettings() {
    const settingsString = localStorage.getItem("DayPlannerSettings");
    if (!settingsString) return;
    try {
      const settings = JSON.parse(settingsString);
      this._lightMode = settings.lightMode;
      this._tempUnit = settings.tempUnit;
      this._firstDayOfWeek = settings.firstDayOfWeek;
      this._displayHolidays = settings.displayHolidays;
      this._colorTheme = settings.colorTheme;
    } catch (error) {
      console.warn("Error parsing settings from localStorage:", error);
    }
    if (this._lightMode === "dark") {
      document.documentElement.setAttribute("data-bs-theme", "dark");
      document.body.classList.add("dark-mode");
    }
  }
}

export function useAppSettings() {
  return useSyncExternalStore(
    (listener) => appSettings.subscribe(listener),
    () => appSettings.getSnapshot(),
  );
}

const appSettings = new AppSettings();
export default appSettings;
