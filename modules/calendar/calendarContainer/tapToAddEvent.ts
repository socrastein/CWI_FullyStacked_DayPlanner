// Lets you do a long press anywhere on the day calandar (week/month later?)
// and it automatically fills out date and time

let selectedDateTime: { date: string; startTime: string; endTime: string } | null = null;

let pressTimer: ReturnType<typeof setTimeout> | null = null;

const LONG_PRESS_DURATION = 500; // Time in milliseconds
const DEFAULT_EVENT_DURATION = 60; // Time in minutes

function formatTime(totalMinutes: number): string {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const mins = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${mins}`;
}

// My laptop for some reason is not recognizing "mouse" and recognizes "pen".
// It's not even a touch screen.
// I left all of them in for other devices.
function isValidInput(event: React.PointerEvent<HTMLDivElement>): boolean {
  const { pointerType, button } = event;

  switch (pointerType) {
    case "touch": 
      return true; // Mobile tap

    case "mouse":
      return button === 0; // Mouse button, 0 for only left clicks

    case "pen":
      return button === 0; // Pen tap, 0 for only left clicks

    default:
      // Unknown pointer type
      return false;
  }
}

function calcDateTime(
  dayGridColumn: HTMLDivElement,
  yPosition: number,
  viewDate: Date
) {
  const elementRectangle = dayGridColumn.getBoundingClientRect();
  const y = yPosition - elementRectangle.top;

  const minutes = Math.floor((y / elementRectangle.height) * 1440); // 1440 minutes in a day

  // Changes starting interval when clicking on calandar, value in minutes,
  // both numbers in formula should match if changed
  const startMinutes = Math.floor(minutes / 60) * 60;

  // "% 1440" makes times close to midnight loop back to start Ex: (11pm to 12am)
  // Calandar currently does not support events going into multiple days Ex:(11pm to 12am)
  // Add "% 1440" to the end of the formula if that gets added later
  const endMinutes = (startMinutes + DEFAULT_EVENT_DURATION); 
  selectedDateTime = {
    date: viewDate.toLocaleDateString("en-CA"),
    startTime: formatTime(startMinutes),
    endTime: formatTime(endMinutes),
  };

  window.dispatchEvent(new Event("openAddEvent"));
}

// Long Press
export function handleLongPress(
  event: React.PointerEvent<HTMLDivElement>,
  viewDate: Date
): void {
  if (!isValidInput(event)) return;

  if (pressTimer) clearTimeout(pressTimer);

  const dayGridColumn = event.currentTarget;
  const clientY = event.clientY;

  pressTimer = setTimeout(() => {
    calcDateTime(dayGridColumn, clientY, viewDate);
  }, LONG_PRESS_DURATION);
}

// Cancels long press if long press is too short or interrupted 
export function endLongPress(): void {
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
}

export function getTimeSlot(): { date: string; startTime: string; endTime: string } | null {
  return selectedDateTime;
}

// Prevents the add event button from autofilling with previous data
export function clearTimeSlot(): void {
  selectedDateTime = null;
}