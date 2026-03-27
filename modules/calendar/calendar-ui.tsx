import { createRoot, type Root } from "react-dom/client";
import CalendarDisplayButtonsGroup from "./navigation/calendar-display-buttons-group";
import CalendarNavButtonsGroup from "./navigation/calendar-nav-buttons-group";
import { renderCalendarView } from "./calendar";
import CalendarEvent from "../classCalendarEvent";
import { CalendarHeaderDisplay } from "./calendar-header-display";

// State of the calendar UI. Update this interface to add or remove properties needed for the calendar UI. Don't forget to update the calendarState in main.js for now. Until we have a better way.
type CalendarUIState = {
  calendarView: "day" | "week" | "month" | string;
  viewDate: Date;
  allEvents: CalendarEvent[];
};

// Initializes the calendar UI
function initializeCalendarUI(calendarState: CalendarUIState) {
  console.log("Initializing calendar UI with state:", calendarState);
  renderCalendarViewButtons(calendarState);
  renderCalendarNavigationButtons(calendarState);

  renderCalendar(calendarState);

  document
    .getElementById("slotDurationSelect")
    ?.addEventListener("change", () => renderCalendar(calendarState)); // Event listener for the slot duration select
}

// Renders the calendar
function renderCalendar(calendarState: CalendarUIState) {
  renderCalendarView(
    calendarState.allEvents,
    calendarState.viewDate,
    calendarState.calendarView,
  );

  renderCalendarHeaderDisplay(calendarState);
}

// Renders the calendar view buttons
function renderCalendarViewButtons(calendarState: CalendarUIState) {
  const displayButtonsRootElement = document.getElementById(
    "calendarDisplayButtonsRoot",
  );
  if (displayButtonsRootElement) {
    const displayButtonsRoot = createRoot(displayButtonsRootElement);
    const renderDisplayButtons = () => {
      displayButtonsRoot.render(
        <CalendarDisplayButtonsGroup
          activeView={calendarState.calendarView}
          onSelectView={(view) => {
            calendarState.calendarView = view;
            renderCalendar(calendarState);
            renderDisplayButtons();
          }}
        />,
      );
    };

    renderDisplayButtons();
  }
}

// Renders the calendar navigation buttons
function renderCalendarNavigationButtons(calendarState: CalendarUIState) {
  const calendarNavigationButtonsRootElement = document.getElementById(
    "calendarNavButtonsContainer",
  );
  if (calendarNavigationButtonsRootElement) {
    const calendarNavigationButtonsRoot = createRoot(
      calendarNavigationButtonsRootElement,
    );
    
    const renderCalendarNavButtons = () => {
      calendarNavigationButtonsRoot.render(
        <CalendarNavButtonsGroup
          state={calendarState}
          onRender={() => {
            renderCalendar(calendarState);
          }}
        />,
      );
    };

    renderCalendarNavButtons();
  }
}

// Renders the calendar header display
let headerDateContainerRoot: Root | null = null;
function renderCalendarHeaderDisplay(calendarState: CalendarUIState) {
  const headerDateContainer = document.getElementById("headerDateContainer");
  if (headerDateContainer) {
    if (headerDateContainerRoot === null) {
      headerDateContainerRoot = createRoot(headerDateContainer);
    }

    const renderHeaderDateDisplay = () => {
      headerDateContainerRoot!.render(
        <CalendarHeaderDisplay state={calendarState} />,
      );
    };

    renderHeaderDateDisplay();
  }
}

export { initializeCalendarUI };
