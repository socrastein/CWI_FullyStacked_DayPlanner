import appState from "../appState";
import { CalendarViews } from "../enumCalendarViews";

/**
 * A component that represents the header date display (e.g. "March 28, 2026").
 * @returns The JSX element
 */
function CalendarHeaderDisplay() {
  return <span>{formatHeaderDate(appState.calendarView)}</span>;
}

// Formats the header date based on the viewing date and calendar view
function formatHeaderDate(calendarView: CalendarViews): string {
  let headerDateString = appState.dateView;
  const viewingDate = appState.dateViewObject;
  if (calendarView === CalendarViews.Day) {
    // Format the viewing date as a full date for day view
    headerDateString = viewingDate.toLocaleDateString("en-CA", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } else if (calendarView === CalendarViews.Week) {
    // Format the viewing date as a range of dates for week view
    const end = new Date(viewingDate);
    end.setDate(end.getDate() + 6);
    headerDateString = `${viewingDate.toLocaleDateString("en-CA", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}`;
  } else if (calendarView === CalendarViews.Month) {
    // Format the viewing date as a full month for month view
    headerDateString = viewingDate.toLocaleDateString("en-CA", {
      month: "long",
      year: "numeric",
    });
  } else {
    headerDateString = viewingDate.toLocaleDateString("en-CA", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return headerDateString;
}

export { CalendarHeaderDisplay };
