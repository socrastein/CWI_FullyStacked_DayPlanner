import CalendarNavButton from "../navigation/calendar-nav-button";

type CalendarNavButtonsGroupProps = {
  onRender: () => void;
};

/**
 * A component that represents a group of buttons to navigate the calendar by one day, week, or month.
 * @param onRender - Function to call when a button is clicked.
 * @returns The JSX element
 */
function CalendarNavButtonsGroup({ onRender }: CalendarNavButtonsGroupProps) {
  return (
    <>
      {/* Go to previous day/week/month */}
      <CalendarNavButton direction="subtract" onRender={onRender}>
        <img src="./assets/icons/chevron-left.svg" />
      </CalendarNavButton>
      {/* Go to next day/week/month */}
      <CalendarNavButton direction="add" onRender={onRender}>
        <img src="./assets/icons/chevron-right.svg" />
      </CalendarNavButton>
    </>
  );
}

export default CalendarNavButtonsGroup;
