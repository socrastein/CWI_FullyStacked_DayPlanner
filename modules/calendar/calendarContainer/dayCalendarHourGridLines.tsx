import dateUtils from "../../dateUtils";

const hourSlots = dateUtils.hourSlotsArray;

// Renders the horizontal background lines that divide the day grid into time slots
export default function DayCalendarHourGridLines() {
  return (
    <div
      id="calendarHourGridLinesContainer"
      className="calendarHourGridLines"
      style={{ height: `${dateUtils.minutesPerDay}px` }}
    >
      {hourSlots.map((slotStart) => (
        <div
          key={slotStart}
          className="calendarHourGridLine"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
