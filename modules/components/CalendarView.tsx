import DayView from './DayView';
import WeekView from './WeekView';


type Props = {
    view: "day" | "week" | "month";
    viewDate: Date;
};

export default function CalendarView({ view, viewDate }: Props) {
    return (
        <div id="calendarViewArea">
            {view === "day" && <DayView viewDate={viewDate} />}
            {view === "week" && <WeekView />}
        </div>
    )
}