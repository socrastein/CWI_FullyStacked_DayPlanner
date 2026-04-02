import CalendarNavButton from "../navigation/calendar-nav-button";
import { useNavigateWithArrows } from "../../hooks/use-navigate-with-arrows";

type CalendarNavButtonsGroupProps = {
  onRender: () => void;
};

/**
 * A component that represents a group of buttons to navigate the calendar by one day, week, or month.
 * @param onRender - Function to call when a button is clicked.
 * @returns The JSX element
 */
function CalendarNavButtonsGroup({ onRender }: CalendarNavButtonsGroupProps) {
  useNavigateWithArrows(onRender);
  
  return (
    <>
      {/* Go to previous day/week/month */}
      <CalendarNavButton direction="subtract" onAfterNavigate={onRender}>
        <img src="./assets/icons/chevron-left.svg" />
      </CalendarNavButton>
      {/* Go to next day/week/month */}
      <CalendarNavButton direction="add" onAfterNavigate={onRender}>
        <img src="./assets/icons/chevron-right.svg" />
      </CalendarNavButton>
    </>
  );
}

export default CalendarNavButtonsGroup;
