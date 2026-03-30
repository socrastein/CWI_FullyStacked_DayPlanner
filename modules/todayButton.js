// C-7-Today: Button switches the shared calendar state to today's date in day view and triggers the normal dayView rendering.
import { CalendarView } from "./calendar/calendar.js";

export default function initTodayButton(calendarState, render) {
  //button name tag call
  const goToTodayButton = document.getElementById("goToTodayButton");

  //error guardrail
  if (!goToTodayButton) {
    console.error('could not find button with id="goToTodayButton".');
    return;
  }

  /**listener for onclick, switch the shared calendar state to today's date in day view and re-render. */
  goToTodayButton.addEventListener("click", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    calendarState.viewDate = today;
    calendarState.calendarView = CalendarView.DAY;

    render();

    console.log("today clicked. New viewDate:", today);
  });

  //testers
  console.log("viewController Init");
}
