import CalendarEvent from "./classCalendarEvent";

const dayCodes = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

function dateStringToDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year!, month! - 1, day!);
}

function getDay(dateString: string): string {
  const date = dateStringToDate(dateString);
  return dayCodes[date.getDay()]!;
}

function isTargetDateAfterStartDate(
  eventDate: string,
  targetDate: string,
): boolean {
  return dateStringToDate(targetDate) > dateStringToDate(eventDate);
}

function occursWeekly(event: CalendarEvent, targetDate: string): boolean {
  if (event.recurrenceDays.length > 0) {
    return event.recurrenceDays.includes(getDay(targetDate));
  }

  return getDay(event.date) === getDay(targetDate);
}

function occursMonthly(event: CalendarEvent, targetDate: string): boolean {
  const eventDate = dateStringToDate(event.date);
  const target = dateStringToDate(targetDate);

  return eventDate.getDate() === target.getDate();
}

function occursYearly(event: CalendarEvent, targetDate: string): boolean {
  const eventDate = dateStringToDate(event.date);
  const target = dateStringToDate(targetDate);

  return (
    eventDate.getMonth() === target.getMonth() &&
    eventDate.getDate() === target.getDate()
  );
}

export function doesEventRepeatOnDate(
  event: CalendarEvent,
  targetDate: string,
): boolean {
  if (event.recurrence === "none") {
    return false;
  }

  if (!isTargetDateAfterStartDate(event.date, targetDate)) {
    return false;
  }

  switch (event.recurrence) {
    case "weekly":
      return occursWeekly(event, targetDate);

    case "monthly":
      return occursMonthly(event, targetDate);

    case "yearly":
      return occursYearly(event, targetDate);

    default:
      return false;
  }
}

export function getRecurringEventsForDate(
  events: CalendarEvent[],
  targetDate: string,
): CalendarEvent[] {
  return events.filter((event) => doesEventRepeatOnDate(event, targetDate));
}
