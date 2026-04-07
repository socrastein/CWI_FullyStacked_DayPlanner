import CalendarEventButton from './CalendarEventButton';
import CalendarEvent from '../classCalendarEvent';

import {
	assignLanesForEvents,
	calculateTotalConcurrentEvents,
} from '../calendar/dailyCalendar';

import * as Calendar from '../calendar/calendar';

type Props = {
	events: CalendarEvent[];
};

export default function DayCalendarEventsLayer({ events }: Props) {
	const assignedLanes = assignLanesForEvents(events);

	return (
		<div 
			id="calendarEventsLayer"
			className="calendarEventsLayer"
			style={{ height: `${Calendar.DAY_TOTAL_HEIGHT}px` }}
		>
			{events.map((event, index) => {
				const laneIndex = assignedLanes.get(event.UID) ?? 0;
				const totalLanes = calculateTotalConcurrentEvents(event, events);

				return (
					<CalendarEventButton
						key={event.UID}
						event={event}
						index={index}
						laneIndex={laneIndex}
						totalLanes={totalLanes}
					/>
				);
			})}
		</div>
	);
}