import * as Calendar from "../calendar/calendar";

type Props = {
    currentMinutesFromMidnight: number | null;
};

export default function DayCalendarCurrentTimeLine({
    currentMinutesFromMidnight,
}: Props) {
    const isVisible = currentMinutesFromMidnight !== null;

    return (
        <div
            id="calendarCurrentTimeLineContainer"
            className="calendarNowLine"
            aria-hidden="true"
            style={{
                visibility: isVisible ? "visible" : "hidden",
                top: isVisible
                ? `${currentMinutesFromMidnight * Calendar.PIXELS_PER_MINUTE}px`
                : undefined,
            }}
        />
    );
}