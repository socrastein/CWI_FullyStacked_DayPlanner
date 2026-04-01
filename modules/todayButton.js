import appState from "./appState";
import { CalendarViews } from "./enumCalendarViews";
import { renderCalendar } from "./calendar/calendar-ui";

/**
 * initializes the Today button
 * when clicked it switches to dayView and sets the viewed date to current day
 * re-renders the calendar & header from appState
 */
export default function initTodayButton() {
  const goToTodayButton = document.getElementById("goToTodayButton");
  //error guardrail
  if (!goToTodayButton) {
    console.error('Could not find button with id="goToTodayButton".');
    return;
  }

  //today button styling.  this will change when this is converted to work in calendar-display-button.tsx on another refactor that sould remove todayButton.js all together if I am right.
  goToTodayButton.classList.add("btn", "btn-sm", "btn-secondary");

  goToTodayButton.style.marginLeft = "0.375rem";

  //listener for onclick, set appState to today in dayView and rerender the calendar
  goToTodayButton.addEventListener("click", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    appState.dateView = today.toLocaleDateString("en-CA"); //not Camarroon
    appState.calendarView = CalendarViews.Day;

    renderCalendar();

    console.log("Today clicked. appState.dateView:", appState.dateView);
  });
}
