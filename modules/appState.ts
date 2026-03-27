import CalendarEvent from "./classCalendarEvent";
import StorageManager from "./dataStorage";
import { CalendarViews } from "./enumCalendarViews";

class AppState {
  private _allEvents: CalendarEvent[];
  private _calendarView: CalendarViews;
  private _dateView: Date;

  constructor() {
    this._allEvents = StorageManager.loadAllEvents();
    this._calendarView = StorageManager.loadCalendarView();
    this._dateView = new Date();
  }
}

/**
 * Class that holds allEvents, calendarView, and dateView.
 * Initially loads allEvents and calendarView from localStorage, sets dateView to current date.
 */
const appState = new AppState();

export default appState;
