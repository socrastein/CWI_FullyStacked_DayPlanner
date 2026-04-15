import "../styling/settingsMenu.css";

import appSettings from "./appSettings";
import { colorThemes } from "./appSettings";

// Icons for menuItems
import moonIcon from "../assets/icons/moon.svg";
import thermIcon from "../assets/icons/thermometer.svg";
import calIcon from "../assets/icons/calendar-1.svg";
import giftIcon from "../assets/icons/gift.svg";
import paletteIcon from "../assets/icons/palette.svg";

let menuIsOpen = false;

// Props objects passed to createMenuItem for setting
// text, icons, and functionality to each menu item
const menuItems = [
  {
    name: "Light Mode",
    id: "lightModeButton",
    icon: moonIcon,
    setting: function () {
      return appSettings.lightMode;
    },
    click: appSettings.toggleLightMode,
  },
  {
    name: "Temp Unit",
    id: "tempUnitButton",
    icon: thermIcon,
    setting: function () {
      return appSettings.tempUnit[0] + "°";
    },
    click: appSettings.toggleTempUnit,
  },
  {
    name: "Week Start",
    id: "weekStartButton",
    icon: calIcon,
    setting: function () {
      // Get first 3 letters of day, e.g. "Mon"
      return appSettings.firstDayOfWeek.slice(0, 3);
    },
    click: appSettings.toggleFirstDayOfWeek,
  },
  {
    name: "Show Holidays",
    id: "displayHolidaysButton",
    icon: giftIcon,
    setting: function () {
      return appSettings.displayHolidays;
    },
    click: appSettings.toggleDisplayHolidays,
  },
  {
    name: "Color Theme",
    id: "colorThemeButton",
    icon: paletteIcon,
    setting: () => "",
    click: toggleColorThemesMenu,
  },
];

// This creates the hamburger-style menu icon in the upper right of
// the app that opens/closes the menu when pressed.
function createMenuButton() {
  const menuButton = document.createElement("div");
  menuButton.classList.add("settingsMenuButton");
  menuButton.onclick = () => {
    menuIsOpen ? closeMenu() : openMenu();
  };

  return menuButton;
}

let settingsMenuItemsContainer;
// This is the main container that holds the list of menu setting items.
// It opens when the menu button is pressed, and closes when the menu button
// is pressed again or the user clicks somewhere outside of the menu container
function createMenuContainer() {
  // This is the menuContainer that opens/shows when the menu button is pressed
  const menuContainer = document.createElement("div");
  menuContainer.classList.add("settingsMenuContainer");
  menuContainer.classList.add("hidden"); // not showing initially

  const itemsContainer = document.createElement("div");
  itemsContainer.classList.add("settingsMenuItemsContainer", "bg-body");
  itemsContainer.id = "settingsMenuItemsContainer";
  settingsMenuItemsContainer = itemsContainer;
  menuContainer.append(itemsContainer);

  // Iterate through menuItems creating a display element for each one
  // based on the object properties
  menuItems.forEach((item) => {
    const element = createMenuItem(item);
    itemsContainer.append(element);
  });

  return menuContainer;
}

// This creates each line in the menu based on the values in menuItems
function createMenuItem(props) {
  const container = document.createElement("div");
  container.classList.add("menuItemContainer");
  container.id = props.id;

  const name = document.createElement("p");
  name.classList.add("menuItemName");
  name.textContent = props.name;

  const icon = document.createElement("img");
  icon.classList.add("menuItemIcon");
  icon.src = props.icon;

  const setting = document.createElement("p");
  setting.classList.add("menuItemSetting");
  setting.textContent = props.setting();

  container.append(icon);
  container.append(name);
  container.append(setting);

  // Change setting in appSettings and update setting text
  container.onclick = () => {
    props.click();
    setting.textContent = props.setting();
  };

  return container;
}

function openMenu() {
  menuButton.classList.toggle("settingsMenuClose");
  menuContainer.classList.toggle("hidden");
  menuIsOpen = true;
  document.addEventListener("click", outsideClickListener);
}

function closeMenu() {
  const menuItemsContainer = document.getElementsByClassName(
    "settingsMenuItemsContainer",
  )[0];
  menuItemsContainer.classList.add("closing");

  // Wait for the closing animation to finish before hiding the menu and toggling the menu button
  menuItemsContainer.addEventListener(
    "animationend",
    () => {
      menuItemsContainer.classList.remove("closing");
      menuButton.classList.toggle("settingsMenuClose");
      menuContainer.classList.toggle("hidden");
      menuIsOpen = false;
      document.removeEventListener("click", outsideClickListener);
      closeColorThemesMenu();
    },
    { once: true },
  ); // 'once' ensures the event listener is removed after it runs
  colorThemeChevronDown();
}

function outsideClickListener(event) {
  if (event.target === menuButton) return;

  const menu = document.getElementById("settingsMenuItemsContainer");
  // Check if event.target is within the menu container
  if (menu.contains(event.target)) return;
  closeMenu();
}

function toggleColorThemesMenu() {
  if (colorThemesMenuIsOpen) {
    closeColorThemesMenu();
  } else {
    expandColorThemesMenu();
  }
}

const colorThemeTimeoutDelay = 30; // ms delay between each color option appearing/disappearing in the menu

/**
 * Iterates through the color themes and creates a menu option for each one with a staggered delay
 * to create an appearing animation effect when the color theme menu is opened.
 * Currently set color is assigned a highlight class to visually indicate which theme is active.
 */
function expandColorThemesMenu() {
  const colorNames = Object.keys(colorThemes);

  for (let i = 0; i < colorNames.length; i++) {
    setTimeout(() => {
      const color = colorNames[i];
      const colorOption = document.createElement("div");
      colorOption.id = `colorThemeOption-${color}`;
      colorOption.classList.add("menuItemContainer", "colorThemeOption");
      if (color === appSettings.colorTheme) {
        colorOption.classList.add("colorThemeHighlight");
        highlightedColorOption = colorOption;
      }
      colorOption.style.backgroundColor = colorThemes[color].hex;
      colorOption.onclick = () => handleColorThemeChange(color);
      settingsMenuItemsContainer.append(colorOption);
    }, i * colorThemeTimeoutDelay); // Stagger the appearance of each color option by 40ms
  }
  colorThemeChevronUp();
  colorThemesMenuIsOpen = true;
}

/**
 * Iterates backwards through the color theme options and removes them with a staggered delay
 * to create a disappearing animation effect when the color theme menu is closed.
 */
function closeColorThemesMenu() {
  const colorThemeOptions = document.getElementsByClassName("colorThemeOption");
  const length = colorThemeOptions.length;
  // We need to iterate backwards when removing elements from a live HTMLCollection
  for (let i = length - 1; i >= 0; i--) {
    setTimeout(
      () => {
        colorThemeOptions[i].remove();
        colorThemesMenuIsOpen = false;
      },
      (length - 1 - i) * colorThemeTimeoutDelay,
    ); // Stagger the disappearance of each color option by 40ms
  }
  colorThemeChevronDown();
  colorThemesMenuIsOpen = false;
}

// This function is called whenever the color theme is changed in appSettings.
function handleColorThemeChange(color) {
  if (color === appSettings.colorTheme) return;
  appSettings.colorTheme = color;

  // Remove highlight from previously selected color theme option
  highlightedColorOption.classList.remove("colorThemeHighlight");

  // Add highlight to currently selected color theme option and assign it to highlightedColorOption
  const newHighlight = document.getElementById(`colorThemeOption-${color}`);
  newHighlight.classList.add("colorThemeHighlight");
  highlightedColorOption = newHighlight;

  // Change the setting text for the color theme menu item to the newly selected color theme
}

function colorThemeChevronUp() {
  const colorThemeMenuIcon = document
    .getElementById("colorThemeButton")
    .querySelector(".menuItemSetting")
    .classList.add("flipped");
}

function colorThemeChevronDown() {
  const colorThemeMenuIcon = document
    .getElementById("colorThemeButton")
    .querySelector(".menuItemSetting")
    .classList.remove("flipped");
}

let colorThemesMenuIsOpen = false;
let highlightedColorOption = null;

let menuButton;
let menuContainer;

/**
 * Places the menu button and (initially hidden) menu container
 * first in the list of children for the document body.
 * These elements have 'position: absolute' so they will display
 * in the upper right corner of the app regardless of how the rest
 * of the elements are styled.
 */
function createSettingsMenu() {
  menuButton = createMenuButton();
  menuContainer = createMenuContainer();

  document.body.prepend(menuContainer);
  document.body.prepend(menuButton);
}

export default createSettingsMenu;
