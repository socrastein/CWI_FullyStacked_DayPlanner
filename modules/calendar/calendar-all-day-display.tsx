import { useAppState } from "../appState";
import { useAppSettings } from "../appSettings";
import { getAllDayDisplayItems } from "./all-day-display-items";

function CalendarAllDayDisplay() {
  /*Tie into useAppState and useAppSettings so the component can re-render
  when the view date or holiday display setting are changed*/
  //these should
  useAppState();
  useAppSettings();

  const items = getAllDayDisplayItems();

  //if there aren't any holiday/allDay events to display, don't render.
  if (items.length === 0) {
    return null;
  }

  //this slice should keep it small and we can add nav later to move through more then 2.
  //currently no day has more then one holiday.  Add testing for multiple events on wednesday. ***
  const visibleItems = items.slice(0, 2);

  return (
    <div className="allDayDisplay w-100 px-1 py-1">
      <div className="d-flex flex-column gap-2 w-100">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="px-2 py-1 border rounded bg-body-tertiary text-center fw-bold"
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export { CalendarAllDayDisplay };
