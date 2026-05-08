import CalendarEventButton from "./calendarEventButton";
import {
  assignLanesForEvents,
  calculateTotalConcurrentEvents,
} from "../dailyCalendar";
import dateUtils from "../../dateUtils";
import { useAppState } from "../../appState";

export default function DayCalendarEventsLayer() {
  const { dateView, getEventsByDate } = useAppState();
  const events = getEventsByDate(dateView);
  const filteredEvents = events.filter((e) => !e.isAllDay && !e.isHoliday);
  const assignedLanes = assignLanesForEvents(filteredEvents);

  return (
    <div
      id="calendarEventsLayer"
      className="calendarEventsLayer"
      style={{ height: `${dateUtils.minutesPerDay}px` }}
    >
      {filteredEvents.map((event) => {
        const laneIndex = assignedLanes.get(event.UID) ?? 0;
        const totalLanes = calculateTotalConcurrentEvents(
          event,
          filteredEvents,
        );

        return (
          <CalendarEventButton
            key={event.UID}
            event={event}
            laneIndex={laneIndex}
            totalLanes={totalLanes}
          />
        );
      })}
    </div>
  );
}
