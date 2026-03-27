import CalendarDisplayButton from "../navigation/calendar-display-button";
import { CalendarView } from "../calendar";

type CalendarDisplayButtonsGroupProps = {
  activeView: "day" | "week" | "month" | string;
  onSelectView: (view: string) => void;
};

// Renders the calendar display buttons
function CalendarDisplayButtonsGroup({
  activeView,
  onSelectView,
}: CalendarDisplayButtonsGroupProps) {
  return (
    <>
      {/* Day view button */}
      <CalendarDisplayButton
        calendarView={CalendarView.DAY}
        isActive={activeView === CalendarView.DAY}
        onClick={() => onSelectView(CalendarView.DAY)}
      />
      {/* Week view button */}
      <CalendarDisplayButton
        calendarView={CalendarView.WEEK}
        isActive={activeView === CalendarView.WEEK}
        onClick={() => onSelectView(CalendarView.WEEK)}
      />
      {/* Month view button */}
      <CalendarDisplayButton
        calendarView={CalendarView.MONTH}
        isActive={activeView === CalendarView.MONTH}
        onClick={() => onSelectView(CalendarView.MONTH)}
      />
    </>
  );
}

export default CalendarDisplayButtonsGroup;
