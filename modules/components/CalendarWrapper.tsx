import { useState, useEffect } from 'react';
import CalendarView from './CalendarView';
import { CalendarEvent } from '../types';

import "../../styling/baseStyling.css";
import "../../styling/calendar.css";
import "../../styling/dayCalendar.css";
import "../../styling/eventForm.css";
import "../../styling/weeklyCalendar.css";


type Props = {
    initialEvents: CalendarEvent[];
};

export default function CalendarWrapper({ initialEvents }: Props) {
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    const [viewDate, setViewDate] = useState(new Date());
    const [view] = useState<"day" | "week" | "month">("day");
    const [slotDuration, setSlotDuration] = useState<number>(60);

    useEffect(() => {
        const slotSelect = document.getElementById(
            "slotDurationSelect",
        ) as HTMLSelectElement | null;

        if (!slotSelect) return;

        setSlotDuration(Number(slotSelect.value));

        const handleChange = () => {
            setSlotDuration(Number(slotSelect.value));
        };

        slotSelect.removeEventListener("change", handleChange);

        return () => {
            slotSelect.removeEventListener("change", handleChange);
        };
    }, []);

    return (
        <CalendarView
            view={view}
            events={events}
            viewDate={viewDate}
            slotDuration={slotDuration}
        />
    );
}