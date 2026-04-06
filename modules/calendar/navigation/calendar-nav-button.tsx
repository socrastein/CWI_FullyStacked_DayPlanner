import React from "react";
import { useCalendarNavButtonHandler } from "../../hooks/use-calendar-nav-button";

type CalendarNavButtonProps = {
  directionType?: "previous" | "next";
  onAfterNavigate: () => void;
  children: React.ReactNode;
};

/**
 * A component that represents a button to navigate the calendar by one day, week, or month.
 * @param children - The icon to be displayed on the button.
 * @param directionType - The direction to navigate the calendar.
 * @param onAfterNavigate - Function to call when the button is clicked.
 * @returns The JSX element
 */
function CalendarNavButton({
  children, // This allows the parent component to pass in the icon to be displayed on the button
  directionType = "next", // Default to going to next day/week/month
  onAfterNavigate,
}: CalendarNavButtonProps) {
  // Handle click event to navigate the calendar by one day, week, or month
  const handleClick = useCalendarNavButtonHandler(
    directionType,
    onAfterNavigate,
  );

  return (
    <button
      type="button"
      id={`calendarNavButton-${directionType}`}
      aria-label={`Navigate to ${directionType === "next" ? "next" : "previous"} day/week/month`}
      className="btn btn-sm btn-primary d-flex justify-content-center align-items-center"
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default CalendarNavButton;
