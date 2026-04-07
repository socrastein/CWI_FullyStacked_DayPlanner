import { useState, useEffect } from 'react';
import CalendarView from './CalendarView';
import appState from "../appState";
import { CalendarViews } from "../enumCalendarViews";
import CalendarEvent  from '../classCalendarEvent';

/**
 * Reads from appState, Controls react state, 
 * and updates UI when things change
 */

export default function CalendarWrapper() {

	// Current calendar view
	const [calendarView, setCalendarView] = useState<CalendarViews>(
		appState.calendarView,
	);

	// Events for the current day being viewed
	const [events, setEvents] = useState<CalendarEvent[]> (
		appState.getEventsByDate(appState.dateView)
	);

	// Current date being viewed
	const [viewDate, setViewDate] = useState<Date>(
		appState.dateViewObject,
	);

	const [slotDuration, setSlotDuration] = useState<number>(60);

	// sync react state from appState
	const syncFromAppState = () => {
		setCalendarView(appState.calendarView);
		setViewDate(appState.dateViewObject);
		setEvents(appState.getEventsByDate(appState.dateView));
	};

	useEffect(() => {
		syncFromAppState();
	}, []);

	useEffect(() => {
		const slotSelect = document.getElementById(
			"slotDurationSelect",
		) as HTMLSelectElement | null;

		if (!slotSelect) return;

		// Set the initial value from the DOM
		setSlotDuration(Number(slotSelect.value));

		// Update React state whenever the select changes
		const handleChange = () => {
			setSlotDuration(Number(slotSelect.value));
			syncFromAppState();
		};

		slotSelect.addEventListener("change", handleChange);

		return () => {
			slotSelect.removeEventListener("change", handleChange);
		};
	}, []);

	// Renders the calendar content
	return (
		<>
			<CalendarView
				view={calendarView}
				events={events}
				viewDate={viewDate}
				slotDuration={slotDuration}
			/>
		</>
	);
}