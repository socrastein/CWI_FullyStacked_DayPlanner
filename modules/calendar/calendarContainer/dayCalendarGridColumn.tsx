import DayCalendarHourGridLines from "./dayCalendarHourGridLines";
import DayCalendarCurrentTimeLine from "./dayCalendarCurrentTimeLine";
import DayCalendarEventsLayer from "./dayCalendarEventsLayer";
import { handleLongPress, endLongPress } from "./tapToAddEvent";

// Event handlers attached to listen for long press and show event creation form
export default function DayCalendarGridColumn() {
  return (
    <div
      id="calendarDayGridColumn"
      className="calendarDayGridColumn"
      onPointerDown={(event) => handleLongPress(event)}
      onPointerUp={endLongPress}
      onPointerCancel={endLongPress}
      onPointerLeave={endLongPress}
    >
      <DayCalendarHourGridLines />
      <DayCalendarCurrentTimeLine />
      <DayCalendarEventsLayer />
    </div>
  );
}
