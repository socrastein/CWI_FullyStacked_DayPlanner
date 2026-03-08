"use strict";

import { CalendarView } from "./calendar.js";

/**
 * Initializes Day / Week / Month display buttons to switch calendar view and re-render.
 * @param {{ viewDate: Date, calendarView: string }} state - Mutable; calendarView is updated on button click
 * @param {() => void} onRender - Called after view change to re-render the calendar
 */
export function initializeCalendarDisplayButtons(state, onRender) {
    const displayButtons = document.querySelectorAll(".displayChangeButton");
    const views = [CalendarView.DAY, CalendarView.WEEK, CalendarView.MONTH];
    displayButtons.forEach((btn, i) => {
        btn.addEventListener("click", () => {
            state.calendarView = views[i];
            displayButtons.forEach((displayButton) => displayButton.classList.remove("highlightDisplayButton"));
            btn.classList.add("highlightDisplayButton");
            onRender();
        });
    });
}
