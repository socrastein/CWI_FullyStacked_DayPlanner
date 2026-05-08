import { CalendarViews } from "../enumCalendarViews";
import appState, { useAppState } from "../appState";
import { useAppSettings } from "../appSettings";
import dateUtils from "../dateUtils";

/**
 * A component that represents the header date display (e.g. "March 28, 2026").
 * @returns The JSX element
 */
function CalendarHeaderDisplay() {
  const { calendarView } = useAppState();
  const { firstDayOfWeek } = useAppSettings();
  return (
    <span className="fs-5 fw-bold">
      {formatHeaderDate(calendarView, firstDayOfWeek, appState.dateViewObject)}
    </span>
  );
}

/**
 * Takes current calendar view, first day of week, and view date and returns
 * a readable string for that day, week range, or month.
 * @param calendarView Current CalendarViews setting, e.g. Day, Week, Month
 * @param firstDayOfWeek String "Monday" or "Sunday"
 * @param date Date object or string of the date being viewed
 * @returns A readable string for a day, week range, or month
 */
function formatHeaderDate(
  calendarView: CalendarViews,
  firstDayOfWeek: "Monday" | "Sunday",
  date: Date | string,
): string {
  switch (calendarView) {
    case "day":
      return dateUtils.getReadableDateString(date);
    case "week":
      return dateUtils.getReadableWeekRangeString(date, firstDayOfWeek);
    case "month":
      return dateUtils.getReadableMonthString(date);
    default:
      throw new Error(`Unsupported calendar view: ${calendarView}`);
  }
}

export { CalendarHeaderDisplay, formatHeaderDate };
