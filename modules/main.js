// import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import CalendarWrapper from "./components/CalendarWrapper";
import "../styling/baseStyling.css";
import "../styling/calendar.css";
import "../styling/dayCalendar.css";
import "../styling/eventForm.css";
import "../styling/weeklyCalendar.css";

import StorageManager from "./dataStorage.js";
import appSettings from "./settings.js";
import createSettingsMenu from "./settingsMenu.js";

import { updateHeaderDate } from "./calendar/headerDate.js";
import { renderCalendarView, CalendarView } from "./calendar/calendar.js";
import { initializeCalendarNavigation } from "./calendar/calendarNavigationButtons.js";
import { initializeCalendarDisplayButtons } from "./calendar/calendarDisplayButtons.js";
import initTodayButton from "./todayButton.js";

import { initializeEventManager } from "./eventManager.js";

import { loadWeatherDisplay } from "./weatherDisplay.js";

import runTests from "../tests/runTests.js";

// Load events and user settings from localStorage when the application starts
const allEvents = StorageManager.loadAllEvents();
appSettings.loadSettings();

createSettingsMenu();

initializeEventManager();
// initTodayButton();

const reactRootElement = document.getElementById('react-root');

if (reactRootElement) {
  const root = createRoot(reactRootElement);

  const plainEvents = allEvents.map((event) => ({
    UID: event.UID,
    title: event.title,
    timeStart: event.timeStart,
    timeEnd: event.timeEnd,
    description: event.description,
    color: event.color,
    address: event.address,
  }));

  root.render(
    React.createElement(CalendarWrapper, {
      initialEvents: plainEvents,
    })
  );
}

// {
//   const viewDate = new Date();
//   viewDate.setHours(0, 0, 0, 0);

//   renderCalendarView(allEvents, viewDate);
//   const slotDurationSelect = document.getElementById("slotDurationSelect");
//   if (slotDurationSelect) {
//     slotDurationSelect.addEventListener("change", () => {
//       renderCalendarView(allEvents, viewDate);
//     });
//   }
// }

{
//   const viewDate = new Date();
//   viewDate.setHours(0, 0, 0, 0);
//   const calendarState = { viewDate, calendarView: CalendarView.DAY };

//   // Renders the calendar
//   function render() {
//     renderCalendarView(
//       allEvents,
//       calendarState.viewDate,
//       calendarState.calendarView,
//     );
//     updateHeaderDate(calendarState); // Updates the header date
//   }

  render();
  document
    .getElementById("slotDurationSelect")
    ?.addEventListener("change", render); // Event listener for the slot duration select
  // initializeCalendarNavigation(calendarState, render); // Initializes the calendar navigation buttons
  // initializeCalendarDisplayButtons(calendarState, render); // Initializes the calendar display buttons
}

loadWeatherDisplay();

// runTests();
