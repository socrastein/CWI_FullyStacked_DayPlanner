type Props = {
    viewDate: Date;
};

export default function DayView({ viewDate }: Props) {
    return (
        <div className="calendarDayContent">
            <div className="calendarTimeLabelsColumn" />

            <div className="calendarDayGridColumn">
                <div className="calendarHourlyGridLines" />
                <div className="calendarNowLine" />
                <div className="calendarEventsLayer" />
            </div>
        </div>
    );
}