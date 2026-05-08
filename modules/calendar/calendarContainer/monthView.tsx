import "../../../styling/monthView.css";
import { useAppSettings } from "../../appSettings";
import appState, { useAppState } from "../../appState";
import CalendarEvent from "../../classCalendarEvent";
import dateUtils from "../../dateUtils";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

// ─── Helpers ───

function getOrderedDayNames(weekStartsOn: 0 | 1): readonly string[] {
  return weekStartsOn === 1 ? [...DAY_NAMES.slice(1), DAY_NAMES[0]] : DAY_NAMES;
}

/**
 * Returns 42 days for a 6-row calendar grid, padding the first and last weeks with
 * days from the previous and following month
 */
function getCalendarGridDays(
  year: number, // Year passed in to account for leap years
  month: number, // 1-based (Jan = 1), from "YYYY-MM-DD"
  weekStartsOn: 0 | 1 = 0, // 0 = Sunday, 1 = Monday
): CalendarDay[] {
  const zeroBasedMonth = month - 1;
  const firstOfMonth = new Date(year, zeroBasedMonth, 1);
  const offset = (firstOfMonth.getDay() - weekStartsOn + 7) % 7;
  const gridStart = new Date(year, zeroBasedMonth, 1 - offset);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return {
      date,
      isCurrentMonth: date.getMonth() === zeroBasedMonth,
      isToday: dateUtils.isToday(date),
    };
  });
}

// Filter out holidays of appSettings isn't showing them then sort the array
function getSortedEvents(
  getEventsByDate: (date: string) => CalendarEvent[],
  dateKey: string,
  displayHolidays: boolean,
): CalendarEvent[] {
  return (getEventsByDate(dateKey) ?? [])
    .filter((e) => displayHolidays || !e.isHoliday)
    .sort((a, b) => {
      const getRank = (event: CalendarEvent) => {
        if (event.isHoliday) return 1;
        if (event.isAllDay) return 2;
        return 3; // Normal events
      };

      const rankA = getRank(a);
      const rankB = getRank(b);

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      return a.timeStart.localeCompare(b.timeStart);
    });
}

// For when day cell is clicked, switch to day view and date of day selected
function switchToDayView(dateString: string) {
  appState.switchToDay(dateString);
}

// ─── React Components ───

// Days of the week displayed at the top of each column in the month grid
function DayNameHeader({ names }: { names: readonly string[] }) {
  return (
    <>
      {names.map((name) => (
        <div key={name} className="dayNameCell">
          {name}
        </div>
      ))}
    </>
  );
}

// Small, color-coded event elements that just show the title
function EventChip({ event }: { event: CalendarEvent }) {
  return (
    <div
      key={event.UID}
      className={`dayCellEvent ${event.isHoliday ? "dayCellEventHoliday" : ""} ${event.isAllDay ? "dayCellEventAllDay" : ""}`}
      style={{ borderLeftColor: event.color }}
      title={event.titleAndTime}
    >
      {event.title}
    </div>
  );
}

// Individual day containers, tagged with isCurrentMonth and isToday for styling emphasis
interface DayCellProps {
  day: CalendarDay;
  events: CalendarEvent[];
}

function DayCell({
  day: { date, isCurrentMonth, isToday },
  events,
}: DayCellProps) {
  const dateKey = dateUtils.dateToString(date);
  const classNames = [
    "dayCell",
    isCurrentMonth && "currentMonthDayCell",
    isToday && "todayCell",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} onClick={() => switchToDayView(dateKey)}>
      <span className="dayCellNumber">{date.getDate()}</span>
      {events.map((event) => (
        <EventChip key={event.UID} event={event} />
      ))}
    </div>
  );
}

export default function MonthView() {
  const { getEventsByDate, dateView } = useAppState();
  const { firstDayOfWeek, displayHolidays } = useAppSettings();

  const weekStartsOn: 0 | 1 = firstDayOfWeek === "Sunday" ? 0 : 1;
  const [year, month] = dateView.split("-").map(Number) as [
    number,
    number,
    number,
  ];

  const dayNames = getOrderedDayNames(weekStartsOn);
  const days = getCalendarGridDays(year, month, weekStartsOn);

  return (
    <div className="monthGrid">
      {/* Names of days across top of grid */}
      <DayNameHeader names={dayNames} />
      {/* Fill all 6 week rows with appropriate days */}
      {days.map((day) => (
        <DayCell
          key={dateUtils.dateToString(day.date)}
          day={day}
          events={getSortedEvents(
            getEventsByDate,
            dateUtils.dateToString(day.date),
            displayHolidays,
          )}
        />
      ))}
    </div>
  );
}
