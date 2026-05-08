import { useEffect } from "react";
import { useAppState } from "../../appState";
import DayCalendarGridColumn from "./dayCalendarGridColumn";
import DayCalendarTimeSlotColumn from "./dayCalendarTimeSlotColumn";
import dateUtils from "../../dateUtils";

/**
 * Builds the calendar screen for a single day

 * Renders:
 * - DayCalendarTimeSlotColumn - time labels on the left
 * - DayCalendarGridColumn - grid lines, current-time line, and events on the right
 */
export default function DayView() {
  const { dateView } = useAppState();

  // When viewing today, scroll the active slot row into view
  useEffect(() => {
    if (!dateUtils.isToday(dateView)) return;

    const currentTimeLine = document.getElementById(
      "calendarCurrentTimeLineContainer",
    );
    if (currentTimeLine)
      currentTimeLine.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }, [dateView]);

  return (
    <div id="calendarDayContentWrapper" className="calendarDayContent">
      <DayCalendarTimeSlotColumn />
      <DayCalendarGridColumn />
    </div>
  );
}
