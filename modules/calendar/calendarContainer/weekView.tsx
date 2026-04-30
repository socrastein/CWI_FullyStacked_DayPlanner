import "../../../styling/weekView.css";

import { useAppSettings } from "../../appSettings";
import appState from "../../appState";
import {
  assignLanesForEvents,
  calculateTotalConcurrentEvents,
  showClickedEventPopup,
} from "../dailyCalendar";
import { isToday, timeStringToMinutes } from "../calendar";
import { CalendarViews } from "../../enumCalendarViews";
import { getWeekRangeStartDate } from "../calendar-header-display";

// Helper type definitions for the events to make sure the types are consistent with what is expected.
type TimedEvent = {
  UID: string;
  timeStart: string;
  timeEnd: string;
  title: string;
  color?: string;
};

type PositionedEvent = {
  event: TimedEvent;
  top: number;
  height: number;
  laneIndex: number;
  totalLanes: number;
};

// Helper function
function getPositionedEvents(dayEvents: TimedEvent[]): PositionedEvent[] {
  const minimumEventHeight = 18;
  const lanesByEventUID = assignLanesForEvents(dayEvents) as Map<
    string,
    number
  >;

  return dayEvents.map((event) => {
    const start = timeStringToMinutes(event.timeStart);
    const end = timeStringToMinutes(event.timeEnd);
    const laneIndex = lanesByEventUID.get(event.UID) ?? 0;
    const totalLanes = calculateTotalConcurrentEvents(event, dayEvents);

    return {
      event,
      top: start,
      height: Math.max(minimumEventHeight, end - start),
      laneIndex,
      totalLanes,
    };
  });
}

function filterEventsForDay(daysDate: string) {
  const { displayHolidays } = useAppSettings();
  // Filter out holidays if the displayHolidays setting is false.
  return appState
    .getEventsByDate(daysDate)
    .filter((event) =>
      displayHolidays
        ? true
        : !event.UID.startsWith("allDay-") && !event.UID.startsWith("holiday-"),
    );
}

// Displays the days of the week and the date (DD format) in the header of the week view.
function WeekDayHeader({ columnDate, day }: { columnDate: Date; day: string }) {
  const isCurrentDay = isToday(columnDate);

  return (
    <div
      className={`weekDayHeader ${isCurrentDay ? "bg-primary text-white" : ""}`}
      role="button"
      onClick={() => {
        appState.dateView = columnDate.toLocaleDateString("en-CA");
        appState.calendarView = CalendarViews.Day;
      }}
    >
      <h6 className="text-uppercase">{day}</h6>
      <span>{columnDate.getDate()}</span>
    </div>
  );
}

function WeekDayEvent({
  event,
  top,
  height,
  laneIndex,
  totalLanes,
}: {
  event: TimedEvent;
  top: number;
  height: number;
  laneIndex: number;
  totalLanes: number;
}) {
  const widthPercent = 100 / totalLanes;
  const leftPercent = widthPercent * laneIndex;
  const leftPosition =
    totalLanes <= 1 ? "2px" : `calc(${leftPercent}% + ${laneIndex * 2}px)`; // left padding of 2px or a certain percentage of the width of the event
  const width =
    totalLanes <= 1 ? "calc(100% - 4px)" : `calc(${widthPercent}% - 2px)`;
  const borderColor = event.color ? `${event.color}CC` : "#1a73e8CC"; // CC = 80% opacity

  return (
    <button
      key={event.UID}
      className="weekEventButton btn btn-sm px-1 bg-secondary-subtle"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        left: leftPosition,
        width: width,
        borderColor: borderColor,
      }}
      onClick={(e) => {
        e.stopPropagation();
        showClickedEventPopup(event);
      }}
    >
      <span title={event.title} className="eventTitle">
        {event.title}
      </span>
    </button>
  );
}

function WeekDayEventContainer({ daysDate }: { daysDate: string }) {
  const events = filterEventsForDay(daysDate);

  return (
    <>
      {/* Render the events for the given day */}
      {getPositionedEvents(events).map(
        ({ event, top, height, laneIndex, totalLanes }) => (
          <WeekDayEvent
            key={event.UID}
            event={event}
            top={top}
            height={height}
            laneIndex={laneIndex}
            totalLanes={totalLanes}
          />
        ),
      )}
    </>
  );
}

function WeekDayHourGridLines() {
  return (
    <>
      {Array.from({ length: 24 }).map((_, hour) => (
        <div key={hour} className="weekHourGridLine" />
      ))}
    </>
  );
}

// Displays the events for the given day in the week view.
function WeekEventsDisplay({ daysDate }: { daysDate: string }) {
  return (
    <div className="weekEventsContainer">
      <WeekDayHourGridLines />
      <WeekDayEventContainer daysDate={daysDate} />
    </div>
  );
}

function WeekDayColumn({
  day,
  index,
  firstDayOfWeek,
}: {
  day: string;
  index: number;
  firstDayOfWeek: string;
}) {
  const dateViewObject = appState.dateViewObject;
  const weekStart = getWeekRangeStartDate(dateViewObject, firstDayOfWeek);

  const columnDate = new Date(weekStart);
  columnDate.setDate(weekStart.getDate() + index);
  const daysDate = columnDate.toLocaleDateString("en-CA");

  return (
    <div className="min-w-0 h-100 border border-secondary border-opacity-25">
      <WeekDayHeader columnDate={columnDate} day={day} />
      <WeekEventsDisplay daysDate={daysDate} />
    </div>
  );
}

// Weekly calendar container component that displays the whole week of events in a column layout.
const WeekView = () => {
  const { firstDayOfWeek } = useAppSettings();
  const dayLabels =
    firstDayOfWeek === "Monday"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="h-100 overflow-auto">
      <div className="weekViewGridContainer h-100">
        {dayLabels.map((day, index) => (
          <WeekDayColumn
            key={day}
            day={day}
            index={index}
            firstDayOfWeek={firstDayOfWeek}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekView;
