import DayView from './DayView';
import { CalendarEvent } from '../types';

type Props = {
    view: "day" | "week" | "month";
    events: CalendarEvent[];
    viewDate: Date;
    slotDuration: number;
};

export default function CalendarView({ view, events, viewDate, slotDuration }: Props) {
    return (
        <div id="calendarViewArea">
            {view === "day" && (
                <DayView 
                    events={events} 
                    viewDate={viewDate}
                    slotDuration={slotDuration} 
                />
            )}

            {view === "week" && <div id="calendarWeekContentWrapper" className="calendarWeekContent" />}
            {view === "month" && <div id="calendarMonthContentWrapper" className="calendarMonthContent" />}
        </div>
    );
}