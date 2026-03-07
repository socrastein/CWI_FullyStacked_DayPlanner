import { renderCalendarView, CalendarView } from "./calendar/calendar.js";
import { updateHeaderDate } from "./calendar/headerDate.js";
import { initializeCalendarNavigation } from "./calendar/calendarNavigationButtons.js";
import { initializeCalendarDisplayButtons } from "./calendar/calendarDisplayButtons.js";
import StorageManager from "./dataStorage.js";
import { initializeEventManager } from "./eventManager.js";
import appSettings from "./settings.js";

appSettings.loadSettings();
const allEvents = StorageManager.loadAllEvents();
initializeEventManager();

{
    const viewDate = new Date();
    viewDate.setHours(0, 0, 0, 0);
    const calendarState = { viewDate, calendarView: CalendarView.DAY };

    // Renders the calendar
    function render() {
        console.log("Rendering calendar...", calendarState.viewDate, calendarState.calendarView);
        renderCalendarView(allEvents, calendarState.viewDate, calendarState.calendarView);
        updateHeaderDate(calendarState); // Updates the header date
    }

    render();
    document.getElementById("slotDurationSelect")?.addEventListener("change", render); // Event listener for the slot duration select
    initializeCalendarNavigation(calendarState, render); // Initializes the calendar navigation buttons
    initializeCalendarDisplayButtons(calendarState, render); // Initializes the calendar display buttons
}
