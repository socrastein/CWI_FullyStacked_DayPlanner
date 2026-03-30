import { CalendarEvent } from '../types';
import * as Calendar from '../calendar/calendar';
import DayCalendarGridColumn from './DayCalendarGridColumn';
import DayCalendarTimeSlotColumn from './DayCalendarTimeSlotColumn';
import createAllSlotsForDay from '../calendar/dailyCalendar';


type Props = {
    events: CalendarEvent[];
    viewDate: Date;
    slotDuration: number;
};

export default function DayView({ events, viewDate, slotDuration }: Props) {
    const currentMinutesFromMidnight = Calendar.isToday(viewDate)
        ? Calendar.calculateTheCurrentMinutesFromMidnight()
        : null;

    const slotHeight = slotDuration * Calendar.PIXELS_PER_MINUTE;
    const slots = createAllSlotsForDay(slotDuration);

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