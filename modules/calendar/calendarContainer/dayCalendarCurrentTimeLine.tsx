import { useAppState } from "../../appState";
import dateUtils from "../../dateUtils";

// Renders the horizontal "now" line that shows the current time position on the day grid.
export default function DayCalendarCurrentTimeLine() {
  const { dateView } = useAppState();
  const isVisible = dateUtils.isToday(dateView);

  return (
    <div
      id="calendarCurrentTimeLineContainer"
      className="calendarNowLine"
      aria-hidden="true"
      style={{
        visibility: isVisible ? "visible" : "hidden",
        top: isVisible
          ? `${dateUtils.currentMinutesFromMidnight()}px`
          : undefined,
      }}
    />
  );
}
