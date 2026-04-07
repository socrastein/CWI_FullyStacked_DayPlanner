import  * as Calendar from '../calendar/calendar';

type Props = {
	slots: number[],
	currentMinutesFromMidnight: number | null,
	slotDuration: number,
	slotHeight: number,
}

export default function DayCalendarTimeSlotColumn({
	slots,
	currentMinutesFromMidnight,
	slotDuration,
	slotHeight
}: Props) {
	return (
		<div id="calendarTimeLabelsColumn" className="calendarTimeLabelsColumn">
			{slots.map((slotStart) => {
				const slotEnd = slotStart + slotDuration;
				const isActiveSlot = 
					currentMinutesFromMidnight != null &&
					currentMinutesFromMidnight >= slotStart &&
					currentMinutesFromMidnight < slotEnd;

					return (
						<div 
							key={slotStart}
							className="calendarTimeSlotRow"
							style={{ height: `${slotHeight}px`}}
							data-active={isActiveSlot ? "true" : "false"}
						>
							<span className="calendarTimeLabel">
								{Calendar.formatSlotTime(slotStart)}
							</span>
						</div>
					);
			})}
		</div>
	);
}