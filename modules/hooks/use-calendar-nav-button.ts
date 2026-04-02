import { useCallback } from "react";
import appState from "../appState";
import { CalendarViews } from "../enumCalendarViews";
import { calendarNavigationFunctionsTest } from "../../tests/calendar-navigation-tests";

/**
 * A hook that handles the click event for a calendar navigation button.
 * @param direction - The direction to navigate the calendar.
 * @param onAfterNavigate - The function to call after the calendar is navigated.
 * @returns The function to handle the click event.
 */
export function useCalendarNavButtonHandler(
  direction: "add" | "subtract",
  onAfterNavigate: () => void,
) {
  // https://react.dev/reference/react/useCallback
  // useCallback returns the same function reference across renders until a dependency changes.
  // That stable identity is useful if this handler is passed to memoized children. Here the
  // important behavior is inside the handler: we read appState.calendarView and
  // appState.dateViewObject when the user clicks, not from a stale render-time snapshot.
  // That matches our multi-root setup—Day/Week/Month lives in another root and may not
  // re-render this tree—so the correct view mode is always applied on each click.
  // Recreate the handler when `direction` or `onAfterNavigate` change (step sign and post-click refresh).
  return useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const delta = direction === "add" ? 1 : -1;
      applyCalendarNavigation(delta);

      onAfterNavigate();
    },
    [direction, onAfterNavigate],
  );
}

export function applyCalendarNavigation(delta: number): void {
  const currentDate = appState.dateViewObject;

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
}

// Adds a single day to the view date
function navigateDay(date: Date, delta: number): string {
  const newDate = new Date(date.getTime());
  newDate.setDate(newDate.getDate() + delta);
  return newDate.toLocaleDateString("en-CA");
}

// Adds a single week to the view date
function navigateWeek(date: Date, delta: number): string {
  return navigateDay(date, delta * 7);
}

// Adds a single month to the view date. Clamps the day (e.g. Mar 31 + 1 → Apr 30) so
// setMonth does not overflow into the next month.
function navigateMonth(date: Date, delta: number): string {
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

// Test the calendar navigation functions. Comment out when not testing.
// calendarNavigationFunctionsTest({ navigateDay, navigateWeek, navigateMonth });
