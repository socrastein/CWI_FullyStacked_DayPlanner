import { useEffect } from "react";
import CalendarEvent from '../classCalendarEvent';
import * as Calendar from '../calendar/calendar';
import DayCalendarGridColumn from './DayCalendarGridColumn';
import DayCalendarTimeSlotColumn from './DayCalendarTimeSlotColumn';
import createAllSlotsForDay from '../calendar/dailyCalendar';


type Props = {
	events: CalendarEvent[];
	viewDate: Date;
	slotDuration: number;
};

/**
 * Builds the calendar for a single day
 * Calculates:
 * - which time slots to show
 * - how tall each slot should be
 * - whether the current day is today
 * 
 * Then renders:
 * - the time labels column
 * - the day grid column
 */
export default function DayView({ events, viewDate, slotDuration }: Props) {
	const currentMinutesFromMidnight = Calendar.isToday(viewDate)
		? Calendar.calculateTheCurrentMinutesFromMidnight()
		: null;

	const slotHeight = slotDuration * Calendar.PIXELS_PER_MINUTE;
	const slots = createAllSlotsForDay(slotDuration);

	useEffect(() => {
		if (!Calendar.isToday(viewDate)) return;

		const activeRow = document.querySelector(
			'.calendarTimeSlotRow[data-active="true"]',
		);

		if (activeRow instanceof HTMLElement) {
			activeRow.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}, [viewDate, slotDuration]);

	return (
		<div id="calendarDayContentWrapper" className="calendarDayContent">
			<DayCalendarTimeSlotColumn 
				slots={slots}
				currentMinutesFromMidnight={currentMinutesFromMidnight}
				slotDuration={slotDuration}
				slotHeight={slotHeight}
			/>
			<DayCalendarGridColumn
				events={events}
				slots={slots}
				slotHeight={slotHeight}
				currentMinutesFromMidnight={currentMinutesFromMidnight}
			/>
		</div>
	);
}