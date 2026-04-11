import CalendarView from "./calendarView"
import appState, { useAppState } from "../../appState";
import { useEffect, useState } from "react";

/**
 * calendarWrapper connects appState with the calendar UI.
 * 
 * It uses the useAppState() hook to subscribe to appState changes.
 * Whenever appState changes (view changed, date changed, event added/edited/deleted),
 * React automatically re-renders this component with the latest values.
 */

export default function calendarWrapper() {
	/**
	 * Subscribe to appState changes.
	 * snapshot contains: { allEventsByDate, calendarView, dateView }
	 * 
	 * React will automatically re-render this component whenener
	 * appState.notifyListeners() is called (on every state change).
	 */
	const snapshot = useAppState();

	const [slotDuration, setSlotDuration] = useState<number>(60);

	/**
	 * Listen to the slot duration dropdown that lives in index.html.
	 *
	 * This useEffect runs once on mount and registers a change listener.
	 * Because CalendarWrapper is only mounted once, this listener stays
	 * alive for the entire lifetime of the app — it never needs to be
	 * re-registered, and the slot duration toggle always works.
	 *
	 * If we let calendar-ui.tsx re-mount CalendarWrapper on every
	 * renderCalendar() call, this listener would be destroyed and
	 * recreated on every navigation click, causing the toggle to break.
	 */
	useEffect(() => {
		const select = document.getElementById(
			"slotDurationSelect",
		) as HTMLSelectElement | null;

		if (!select) return;

		// Set the initial value from the current dropdown selection
		setSlotDuration(Number(select.value));

		// Update slot duration whenever the dropdown changes
		const handleChange = () => {
			setSlotDuration(Number(select.value));
		};

		select.addEventListener("change", handleChange);

		// remove the listener if this component ever unmounts
		return () => {
			select.removeEventListener("change", handleChange);
		};
	}, []);

	// Get only the events for the currently viewed day.
	const eventsForViewDate = appState.getEventsByDate(snapshot.dateView);

	return (
		<CalendarView 
			view={snapshot.calendarView}
			events={eventsForViewDate}
			viewDate={appState.dateViewObject} 
			slotDuration={slotDuration}
		/>
	);
}