import "../../../styling/weekView.css";

import { useAppSettings } from "../../appSettings";
import { useAppState } from "../../appState";
import {
  assignLanesForEvents,
  calculateTotalConcurrentEvents,
} from "../dailyCalendar";
import { showClickedEventPopup } from "../clickedEventPopup";
import { CalendarViews } from "../../enumCalendarViews";
import CalendarEvent from "../../classCalendarEvent";
import appState from "../../appState";
import dateUtils from "../../dateUtils";
import DayCalendarCurrentTimeLine from "./dayCalendarCurrentTimeLine";
import { useEffect } from "react";
import DayCalendarTimeSlotColumn from "./dayCalendarTimeSlotColumn";

// Helper type definitions for the events to make sure the types are consistent with what is expected.

type PositionedCalendarEvent = {
  event: CalendarEvent;
  top: number;
  height: number;
  laneIndex: number;
  totalLanes: number;
};

// Helper function
function getPositionedEvents(
  dayEvents: CalendarEvent[],
): PositionedCalendarEvent[] {
  const minimumEventHeight = 18;
  const lanesByEventUID = assignLanesForEvents(dayEvents) as Map<
    string,
    number
  >;

  return dayEvents.map((event) => {
    const start = dateUtils.militaryToMinutes(event.timeStart);
    const end = dateUtils.militaryToMinutes(event.timeEnd);
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

// Displays the days of the week and the date (DD format)
// in the header of the week view.
function WeekDayHeader({ columnDate, day }: { columnDate: Date; day: string }) {
  const isCurrentDay = dateUtils.isToday(columnDate);

  return (
    <div
      className={`weekDayHeader ${isCurrentDay ? "weekDayCurrentDay" : ""}`}
      role="button"
      onClick={() => {
        appState.dateView = dateUtils.dateToString(columnDate);
        appState.calendarView = CalendarViews.Day;
      }}
    >
      <p className="weekDayName">{day}</p>
      <span className="weekDayDate">{columnDate.getDate()}</span>
    </div>
  );
}

function WeekDayAllDayEvents({ daysDate }: { daysDate: string }) {
  const { getEventsByDate } = useAppState();
  const { displayHolidays } = useAppSettings();

  const allDayEvents = getEventsByDate(daysDate).filter(
    (event) => event.isAllDay || (displayHolidays && event.isHoliday),
  );
  if (allDayEvents.length === 0) return <div className="weekAllDayContainer" />;

  return (
    <div className="weekAllDayContainer">
      {allDayEvents.map((event) => (
        <span key={event.UID} className="weekAllDayEvent">
          {event.title}
        </span>
      ))}
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
  event: CalendarEvent;
  top: number;
  height: number;
  laneIndex: number;
  totalLanes: number;
}) {
  const widthPercent = 100 / totalLanes;
  const leftPercent = widthPercent * laneIndex;
  const leftPosition =
    totalLanes <= 1 ? "2px" : `calc(${leftPercent}% + ${laneIndex * 2}px)`;
  const width =
    totalLanes <= 1 ? "calc(100% - 4px)" : `calc(${widthPercent}% - 2px)`;
  const borderColor = event.color ? `${event.color}CC` : "#1a73e8CC";

  return (
    <button
      key={event.UID}
      className="weekEventButton btn btn-sm px-1"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        left: leftPosition,
        width: width,
        borderLeftColor: borderColor,
      }}
      title={event.titleAndTime}
      onClick={(e) => {
        e.stopPropagation();
        showClickedEventPopup(event);
      }}
    >
      <span className="eventTitle">{event.title}</span>
    </button>
  );
}

function WeekDayEventContainer({ daysDate }: { daysDate: string }) {
  const { displayHolidays } = useAppSettings();
  const { getEventsByDate } = useAppState();

  const events = getEventsByDate(daysDate).filter(
    (event) => !event.isAllDay && !event.isHoliday,
  );

  return (
    <>
      {dateUtils.isToday(daysDate) && <DayCalendarCurrentTimeLine />}
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

function WeekDayColumn({
  day,
  index,
  weekStart,
}: {
  day: string;
  index: number;
  weekStart: Date;
}) {
  const columnDate = dateUtils.addDays(weekStart, index);
  const daysDate = dateUtils.dateToString(columnDate);

  return (
    <div>
      <WeekDayAllDayEvents daysDate={daysDate} />
      <WeekDayHeader columnDate={columnDate} day={day} />
      <div className="weekEventsContainer">
        <WeekDayHourGridLines />
        <WeekDayEventContainer daysDate={daysDate} />
      </div>
    </div>
  );
}

// Weekly calendar container component that displays
// the whole week of events in a column layout.
const WeekView = () => {
  const { dateView } = useAppState();
  const { firstDayOfWeek } = useAppSettings();

  const dateViewObject = dateUtils.stringToDate(dateView);
  const weekStart = dateUtils.weekRangeStartDate(
    dateViewObject,
    firstDayOfWeek,
  );

  const dayLabels =
    firstDayOfWeek === "Monday"
      ? dateUtils.daysOfWeekMon
      : dateUtils.daysOfWeekSun;

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
    <div className="h-100 overflow-auto">
      <div className="weekViewGridContainer h-100">
        <div className="weekViewTimeSlotContainer">
          <div></div>
          <div className="weekViewTimeSlotFiller"></div>
          <DayCalendarTimeSlotColumn />
        </div>

        {dayLabels.map((day, index) => (
          <WeekDayColumn
            key={day}
            day={day}
            index={index}
            weekStart={weekStart}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekView;
