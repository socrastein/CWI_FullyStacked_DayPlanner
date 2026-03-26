import { useState } from 'react';
import CalendarContainer from './components/CalendarContainer';

type CalendarViewType = "day" | "week" | "month";

export default function App() {
    const [viewDate, setViewDate] = useState(new Date());
    const [view, setView] = useState<CalendarViewType>("day");

    return (
        <div>
            <CalendarContainer
                view={view}
                viewDate={viewDate}
                setView={setView}
                setViewDate={setViewDate}
            />
        </div>
    );
}