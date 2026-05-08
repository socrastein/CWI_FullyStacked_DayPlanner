import dateUtils from "../../dateUtils";
// Takes time in total minutes into the day, rounds it
// to the nearest hour, and labels it AM or PM
function formatSlotTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours} ${ampm}`;
}

function isCurrentHour(slotMinutes: number): boolean {
  const currentMinutes = new Date().getHours() * 60;
  return slotMinutes === currentMinutes;
}

const hourSlots = dateUtils.hourSlotsArray;

/**
 * Renders the left column of the day view.
 * Shows one row per time slot with a formatted time label (e.g. "9:00AM").
 * The slot that contains the current time gets data-active="true"
 * so DayView can scroll it into view.
 */
export default function DayCalendarTimeSlotColumn() {
  return (
    <div id="calendarTimeLabelsColumn" className="calendarTimeLabelsColumn">
      {hourSlots.map((slotStart) => {
        return (
          <div key={slotStart} className="calendarTimeSlotRow">
            <span
              className={`calendarTimeLabel ${isCurrentHour(slotStart) ? "calendarCurrentTimeHighlight" : ""}`}
            >
              {formatSlotTime(slotStart)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
