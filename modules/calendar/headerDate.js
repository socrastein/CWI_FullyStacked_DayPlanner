"use strict";

import { CalendarView } from "./calendar.js";

/**
 * Updates the header date element to reflect the current view date and calendar view.
 * @param {{ viewDate: Date, calendarView: string }} state
 */
export function updateHeaderDate(state) {
    const headerElement = document.getElementById("headerDateContainer");
    if (!headerElement) return;
    const viewingDate = state.viewDate;
    if (state.calendarView === CalendarView.DAY) {
        headerElement.textContent = viewingDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
    } else if (state.calendarView === CalendarView.WEEK) {
        const end = new Date(viewingDate);
        end.setDate(end.getDate() + 6);
        headerElement.textContent = `${viewingDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else if (state.calendarView === CalendarView.MONTH) {
        headerElement.textContent = viewingDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } else {
        headerElement.textContent = viewingDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    }
}
