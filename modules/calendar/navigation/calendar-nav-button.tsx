import React from "react";
import appState from "../../appState";
import { CalendarViews } from "../../enumCalendarViews";

type CalendarNavButtonProps = {
  direction?: "subtract" | "add"; // "add" means go to next day/week/month; "subtract" means go to previous day/week/month
  onRender: () => void;
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
  onRender,
}: CalendarNavButtonProps) {
  // Handle click event to navigate the calendar by one day, week, or month
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent the default behavior of the button

    const delta = direction === "add" ? 1 : -1;
    let currentDate = appState.dateViewObject;

    // Read view mode at click time so Day/Week/Month toggles apply even if this subtree was not re-rendered.
    switch (appState.calendarView) {
      case CalendarViews.Day:
        appState.dateView = navigateDay(currentDate, delta);
        break;
      case CalendarViews.Week:
        appState.dateView = navigateWeek(currentDate, delta);
        break;
      case CalendarViews.Month:
        appState.dateView = navigateMonth(currentDate, delta);
        break;
      default:
        appState.dateView = navigateDay(currentDate, delta);
    }

    onRender();
  };

  return (
    <button
      type="button"
      id="calendarNavButton"
      className="btn btn-sm btn-primary d-flex justify-content-center align-items-center"
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

// Adds a single day to the view date
function navigateDay(date: Date, delta: number) {
  const newDate = new Date(date.getTime());
  newDate.setDate(newDate.getDate() + delta);
  return newDate.toLocaleDateString("en-CA");
}

// Adds a single week to the view date
function navigateWeek(date: Date, delta: number) {
  return navigateDay(date, delta * 7);
}

// Adds a single month to the view date. Clamps the day (e.g. Mar 31 + 1 → Apr 30) so
// setMonth does not overflow into the next month.
function navigateMonth(date: Date, delta: number) {
  const day = date.getDate();
  const newDate = new Date(date.getTime());
  // Set the day to the first day of the month
  newDate.setDate(1);
  // Add the delta months
  newDate.setMonth(newDate.getMonth() + delta);
  // Get the last day of the month
  const lastDay = new Date(
    newDate.getFullYear(),
    newDate.getMonth() + 1,
    0,
  ).getDate();

  // Set the day to the minimum of the current day and the last day of the month
  newDate.setDate(Math.min(day, lastDay));
  return newDate.toLocaleDateString("en-CA");
}

export default CalendarNavButton;
