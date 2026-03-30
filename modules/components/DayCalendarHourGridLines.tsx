import * as Calendar from '../calendar/calendar';

type Props = {
    slots: number[];
    slotHeight: number;
};

export default function DayCalendarHourGridLines({
    slots,
    slotHeight,
}: Props) {
    return (
        <div
            id="calendarHourGridLinesContainer"
            className="calendarHourGridLines"
            style={{ height: `${Calendar.DAY_TOTAL_HEIGHT}px`}}
        >
            {slots.map((slotStart) => (
                <div
                    key={slotStart}
                    className="calendarHourGridLine"
                    style={{ height: `${slotHeight}px`}}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
}