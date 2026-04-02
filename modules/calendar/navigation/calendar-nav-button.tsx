import React from "react";
import { useCalendarNavButtonHandler } from "../../hooks/use-calendar-nav-button";

type CalendarNavButtonProps = {
  direction?: "subtract" | "add"; // "add" means go to next day/week/month; "subtract" means go to previous day/week/month
  onAfterNavigate: () => void;
  children: React.ReactNode;
};

/**
 * A component that represents a button to navigate the calendar by one day, week, or month.
 * @param children - The icon to be displayed on the button.
 * @param direction - The direction to navigate the calendar.
 * @param onRender - Function to call when the button is clicked.
 * @returns The JSX element
 */
function CalendarNavButton({
  children, // This allows the parent component to pass in the icon to be displayed on the button
  direction = "add", // Default to going to next day/week/month
  onAfterNavigate,
}: CalendarNavButtonProps) {
  // Handle click event to navigate the calendar by one day, week, or month
  const handleClick = useCalendarNavButtonHandler(direction, onAfterNavigate);

  return (
    <button
      type="button"
      id={`calendarNavButton-${direction}`}
      className="btn btn-sm btn-primary d-flex justify-content-center align-items-center"
      aria-label={`Navigate to ${direction === "add" ? "next" : "previous"} date`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default CalendarNavButton;
