import CalendarNavButton from "../navigation/calendar-nav-button";

type CalendarNavButtonsGroupProps = {
  state: {
    viewDate: Date;
    calendarView: string;
  };
  onRender: () => void;
};

// Renders the calendar navigation buttons
function CalendarNavButtonsGroup({
  state,
  onRender,
}: CalendarNavButtonsGroupProps) {
  return (
    <>
      {/* Go to previous day/week/month */}
      <CalendarNavButton state={state} direction="subtract" onRender={onRender}>
        <img src="./assets/icons/chevron-left.svg" />
      </CalendarNavButton>
      {/* Go to next day/week/month */}
      <CalendarNavButton state={state} onRender={onRender}>
        <img src="./assets/icons/chevron-right.svg"/>
      </CalendarNavButton>
    </>
  );
}

export default CalendarNavButtonsGroup;
