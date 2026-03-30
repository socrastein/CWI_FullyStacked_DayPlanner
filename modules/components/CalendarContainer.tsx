import { useState } from 'react';
import CalendarView from './CalendarView';
import { CalendarEvent } from '../types';

type Props = {
    view: "day" | "week" | "month";
    viewDate: Date;
    // setView: (v: "day" | "week" | "month") => void;
    // setViewDate: (d: Date) => void;
    events: CalendarEvent[];
};

export default function CalendarContainer({
    view,
    viewDate,
    events,
}: Props) {
    const [slotDuration, setSlotDuration] = useState<number>(60);

    return (
        <div id="calendarContainer">
            <div id="calendarSettingsContainer">
                <select 
                    id="slotDurationSelect"
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(Number(e.target.value))}
                >
                    <option value="60">1 hour</option>
                    <option value="30">30 minutes</option>
                </select>
            </div>

            {/* Main calendar */}
            <CalendarView 
                view={view} 
                viewDate={viewDate} 
                events={events} 
                slotDuration={slotDuration}
            />
        </div>
    );
}