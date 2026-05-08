import { useCallback } from "react";
import appState from "../appState";
import { CalendarViews } from "../enumCalendarViews";
import dateUtils from "../dateUtils";

/**
 * A hook that handles the click event for a calendar navigation button that navigates the calendar by day, week, or month.
 * @param navDirectionType - The direction to navigate the calendar.
 * @param onAfterNavigate - The function to call after the calendar is navigated (e.g to re-render the calendar with the new date).
 * @returns The function to handle the click event.
 */
export function useCalendarNavButtonHandler(
  navDirectionType: "next" | "previous",
  onAfterNavigate: () => void,
) {
  return useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const navDirection = navDirectionType === "next" ? 1 : -1;
      applyCalendarNavigation(navDirection);

      onAfterNavigate();
    },
    [navDirectionType, onAfterNavigate],
  );
}

/**
 * Calculates and applies the new date to the `appState.dateView` based on the navigation direction and current view.
 * @param navDirection - The direction to navigate the calendar.
 */
export function applyCalendarNavigation(navDirection: number): void {
  let currentDate = appState.dateViewObject;

  // Check that the navigation direction is valid.
  if (navDirection !== 1 && navDirection !== -1) {
    throw new Error("Invalid navigation direction. Must be 1 or -1.");
  }

  // Read view mode at click time so Day/Week/Month toggles apply even if this subtree was not re-rendered.
  switch (appState.calendarView) {
    case CalendarViews.Day:
      currentDate = dateUtils.addDays(currentDate, navDirection);
      appState.dateView = dateUtils.dateToString(currentDate);
      break;
    case CalendarViews.Week:
      currentDate = dateUtils.addDays(currentDate, navDirection * 7);
      appState.dateView = dateUtils.dateToString(currentDate);
      break;
    case CalendarViews.Month:
      currentDate = dateUtils.addMonths(currentDate, navDirection);
      appState.dateView = dateUtils.dateToString(currentDate);
      break;
    default:
      throw new Error(
        `Calendar view ${appState.calendarView} is not supported. Please add support for this view.`,
      );
  }
}
