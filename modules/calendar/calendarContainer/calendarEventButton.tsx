import CalendarEvent from "../../classCalendarEvent";
import dateUtils from "../../dateUtils";
import { showClickedEventPopup } from "../clickedEventPopup";

type Props = {
  event: CalendarEvent;
  totalLanes: number;
  laneIndex: number;
};

export default function CalendarEventButton({
  event,
  totalLanes,
  laneIndex,
}: Props) {
  // Button calculations
  const startTimeMinutes = dateUtils.militaryToMinutes(event.timeStart);
  const endTimeMinutes = dateUtils.militaryToMinutes(event.timeEnd);
  const duration = endTimeMinutes - startTimeMinutes;
  const topPosition = startTimeMinutes;
  const durationHeight = duration;
  const maxHeight = Math.max(18, durationHeight);
  const isShort = durationHeight <= 44;

  // Lane calculations
  const width = 100 / totalLanes;
  const leftPosition = width * laneIndex;

  return (
    <button
      className={
        isShort
          ? "calendarEventContainer calendarEventContainer--compact"
          : "calendarEventContainer"
      }
      style={{
        ["--event-color" as any]: event.color ?? "#1a73e8",
        top: `${topPosition}px`,
        height: `${maxHeight}px`,
        left:
          totalLanes <= 1 ? "0" : `calc(${leftPosition}% + ${laneIndex * 2}px)`,
        width: totalLanes <= 1 ? "100%" : `calc(${width}% - 2px)`,
      }}
      title={event.titleAndTime}
      onClick={(e) => {
        e.stopPropagation(); // Stops popup from instantly closing
        showClickedEventPopup(event);
      }}
    >
      {isShort ? (
        <span className="calendarEventHeader">
          <span className="calendarEventTitle">{event.title}</span>
        </span>
      ) : (
        <>
          <span className="calendarEventTitle">{event.title}</span>
          <span className="calendarEventDescription">{event.description}</span>
        </>
      )}
    </button>
  );
}
