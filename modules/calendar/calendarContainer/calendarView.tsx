import { useAppState } from "../../appState";
import { CalendarViews } from "../../enumCalendarViews";
import WeekView from "./weekView";
import DayView from "./dayView";
import MonthView from "./monthView";

// Decides which calendar content to show; Day | Week | Month
export default function CalendarView() {
  const { calendarView } = useAppState();
  if (calendarView === CalendarViews.Day) {
    return <DayView />;
  }

  if (calendarView === CalendarViews.Week) {
    return <WeekView />;
  }

  if (calendarView === CalendarViews.Month) {
    return <MonthView />;
  }

  return null;
}
