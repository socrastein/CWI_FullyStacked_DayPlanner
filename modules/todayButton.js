import appState from "./appState";
/**
 * initializes the Today Button, which sets the shared appState dateView to todays date, then runs onRender();
 * @param { Function } onRender - Re-renders the calender UI after updating the state
 */
export default function initTodayButton(onRender) {
  const goToTodayButton = document.getElementById("goToTodayButton");

  if (!goToTodayButton) {
    console.error('Could not find button with ID="goToTodayButton".');
    return;
  }

  //listener for onclick, sets time to midnight on today's date.
  goToTodayButton.addEventListener("click", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // store in appState for YYYY-MM-DD
    appState.dateView = today.toLocaleDateString("en-CA"); //england CAMAROON!

    //forces to date view
    appState.calendarView = "day";

    //render and note
    onRender();
    console.log("Today clicked. New apstate.dateView", appState.dateView);
  });
}
