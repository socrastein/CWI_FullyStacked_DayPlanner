import CalendarEvent from "../../classCalendarEvent";
import { CalendarViews } from "../../enumCalendarViews";

type Props = {
	view: CalendarViews;
	events: CalendarEvent[];
	viewDate: Date;
	slotDuration: number;
};

// Decides which calendar content to show; Day | Week | Month
export default function CalendarView({
	view,
	events,
	viewDate,
	slotDuration
}: Props) {
	if (view === CalendarViews.Day) {
		return (
			<div id="calendarDayContentWrapper" className="calendarDayContent" />
		);
	}

	if (view === CalendarViews.Week) {
		return (
			<div id="calendarWeekContentWrapper" className="calendarWeekContent" />
		);
	}

	if (view === CalendarViews.Month) {
		return (
			<div id="calendarMonthContentWrapper" className="calendarMonthContent" />
		);
	}

	return null;
}