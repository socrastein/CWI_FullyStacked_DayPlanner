import DayView from "./DayView";
import CalendarEvent from "../classCalendarEvent";
import { CalendarViews } from "../enumCalendarViews";

type Props = {
	view: CalendarViews;
	events: CalendarEvent[];
	viewDate: Date;
	slotDuration: number;
};

// Determines which calendar screen to show; Day | Week | Month
export default function CalendarView({ 
	view, 
	events, 
	viewDate, 
	slotDuration 
}: Props) {
	if (view === CalendarViews.Day) {
		return (
			<DayView 
				events={events}
				viewDate={viewDate}
				slotDuration={slotDuration}
			/>
		);
	}

	if (view === CalendarViews.Week) {
		return (
			<div 
			id="calendarWeekContentWrapper"
			className="calendarWeekContent"
			/>
		);
	}

	if (view === CalendarViews.Month) {
		return (
			<div 
				id="calendarMonthContentWrapper"
				className="calendarMonthContent"
			/>
		);
	}

	return null;
}