import CalendarView from './CalendarView';

type Props = {
    view: "day" | "week" | "month";
    viewDate: Date;
    setView: (v: "day" | "week" | "month") => void;
    setViewDate: (d: Date) => void;
};

export default function CalendarContainer({
    view,
    viewDate,
    setView,
}: Props) {
    return (
        <div id="calendarContainer">
            <div id="calendarSettingsContainer">
                <select>
                    <option value="60">1 hour</option>
                    <option value="30">30 minutes</option>
                </select>
            </div>

            {/* view buttons */}
            <div>
                <button onClick={() => setView("day")}>Day</button>
                <button onClick={() => setView("week")}>Week</button>
                <button onClick={() => setView("month")}>Month</button>
            </div>

            {/* Main calendar */}
            <CalendarView view={view} viewDate={viewDate} />
        </div>
    );
}