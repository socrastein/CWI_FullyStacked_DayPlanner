import { useSyncExternalStore } from "react";
import CalendarEvent from "./classCalendarEvent";
import StorageManager from "./dataStorage";
import { CalendarViews } from "./enumCalendarViews";

import { createMockEvents, registerCheatCode } from "./mockEvents";

import { getHolidayEvents } from "./holidayEvent";

import { getRecurringEventsForDate } from "./recurringEvents";

// Helper functions to map events by UID and by Date for efficient access

/**
 * Creates a map with {key: value} pairs of {UID: CalendarEvent} for all events passed in.
 * @param events Array of CalendarEvent objects loaded from storage
 * @returns
 */
function mapEventsByUID(events: CalendarEvent[]): Map<string, CalendarEvent> {
  const mappedEvents = new Map<string, CalendarEvent>();

  events.forEach((event) => {
    mappedEvents.set(event.UID, event);
  });

  return mappedEvents;
}

/**
 * Creates a map with {key: value} pairs of {date: CalendarEvent[]} for all events passed in.
 * Each key is a date string in "YYYY-MM-DD" format, and the value is an array
 * of CalendarEvent objects that occur on that date.
 * @param events Array of CalendarEvent objects loaded from storage
 * @returns
 */
function mapEventsByDate(
  events: CalendarEvent[],
): Map<string, CalendarEvent[]> {
  const mappedDates = new Map<string, CalendarEvent[]>();

  events.forEach((event) => {
    const dateKey = event.date;

    if (!mappedDates.has(dateKey)) {
      mappedDates.set(dateKey, []);
    }

    mappedDates.get(dateKey)?.push(event);
  });

  return mappedDates;
}

/**
 * Pulls all events with a recurrence setting into a separate array.
 * Events with recurrence set to "none" are not treated as recurring.
 * @param events Array of CalendarEvent objects loaded from storage
 * @returns
 */
function mapRecurringEvents(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter((event) => event.recurrence !== "none");
}

class AppState {
  private _loadedEvents = StorageManager.loadAllEvents();

  private _eventsByUID = mapEventsByUID(this._loadedEvents);
  private _eventsByDate = mapEventsByDate(this._loadedEvents);
  private _recurringEvents = mapRecurringEvents(this._loadedEvents);

  // Set date view to current date in "YYYY-MM-DD" format
  private _dateView = new Date().toLocaleDateString("en-CA");

  // Load calendar view from storage; defaults to "day" if not saved
  private _calendarView = StorageManager.loadCalendarView();

  // Holiday event set year tester
  private _loadedHolidayYears = new Set<number>();

  // Set of listener functions to call whenever the app state changes
  private listeners = new Set<() => void>();

  // This constructor loads the current year's holidays on startup.
  constructor() {
    this.loadHolidayEventsForYear(this.dateViewObject.getFullYear());
  }

  /**
   * Loads holiday events for the specified year into memory if they have not already been loaded.
   * Creates a copy of the _eventsByDate map, adds each holiday into the matching date array,
   * then writes the updated map back to _eventsByDate.
   * @param year Four-digit year to load holiday events for
   */
  loadHolidayEventsForYear(year: number): void {
    if (this.areHolidaysLoadedForYear(year)) {
      return;
    }

    const holidayEvents = getHolidayEvents(year);
    const updatedEventsByDate = new Map(this._eventsByDate);

    holidayEvents.forEach((holidayEvent) => {
      const dateKey = holidayEvent.date;
      const existingEvents = updatedEventsByDate.get(dateKey) ?? [];

      updatedEventsByDate.set(dateKey, [...existingEvents, holidayEvent]);
    });

    this._eventsByDate = updatedEventsByDate;
    this._loadedHolidayYears.add(year);
    this.notifyListeners();
  }

  /**
   * Returns true if holiday events have already been loaded for the given year.
   * @param year Four-digit year to check
   * @returns true if year is already loaded into holiday map, otherwise false
   */
  areHolidaysLoadedForYear(year: number): boolean {
    return this._loadedHolidayYears.has(year);
  }

  /**
   * Returns a Map of all events keyed by their UID,
   * where each value is a CalendarEvent object.
   */
  get allEventsByUID(): Map<string, CalendarEvent> {
    return this._eventsByUID;
  }

  /**
   * Returns a Map of all events keyed by their date (YYYY-MM-DD),
   * where each value is an array of CalendarEvent objects for that date.
   */
  get allEventsByDate(): Map<string, CalendarEvent[]> {
    return this._eventsByDate;
  }

  /**
   * Returns the CalendarEvent object with the specified UID,
   * or undefined if no event with that UID exists.
   * @param uid Unique identifier of the event to retrieve
   * @returns
   */
  getEventByUID(uid: string): CalendarEvent | undefined {
    return this._eventsByUID.get(uid);
  }

  /**
   * Returns an array of CalendarEvent objects for the specified date.
   * This includes one-time events saved directly on that date and recurring events
   * that should appear on that date.
   * @param date "YYYY-MM-DD" formatted date string to retrieve events for
   * @returns Array of CalendarEvent objects for the specified date, or [] if no events exist
   */
  getEventsByDate(date: string): CalendarEvent[] {
    const oneTime = this._eventsByDate.get(date) ?? [];
    const recurring = getRecurringEventsForDate(this._recurringEvents, date);

    return [...oneTime, ...recurring];
  }

  /**
   * Adds a new event to the app state if one doesn't already exist,
   * replaces event with same UID if it exists, and saves to localStorage.
   *
   * @param event CalendarEvent object to add
   */
  addEvent(event: CalendarEvent): void {
    // Replace map instead of mutating
    this._eventsByUID = new Map(this._eventsByUID).set(event.UID, event);

    // If it's already in recurringEvents, replace the existing event.
    // If it is new and recurring, add it to recurringEvents.
    const alreadyInRecurring = this._recurringEvents.some(
      (e) => e.UID === event.UID,
    );

    if (event.recurrence !== "none") {
      this._recurringEvents = alreadyInRecurring
        ? this._recurringEvents.map((e) => (e.UID === event.UID ? event : e))
        : [...this._recurringEvents, event];

      // If a recurring event has been modified to now be a single occurrence,
      // remove it from recurringEvents.
    } else if (alreadyInRecurring) {
      this._recurringEvents = this._recurringEvents.filter(
        (e) => e.UID !== event.UID,
      );
    }

    // If it's already in eventsByDate, replace the existing event.
    // If it is new, add it to eventsByDate.
    const existingEvents = this._eventsByDate.get(event.date) ?? [];
    const alreadyExists = existingEvents.some((e) => e.UID === event.UID);

    const updatedEvents = alreadyExists
      ? existingEvents.map((e) => (e.UID === event.UID ? event : e))
      : [...existingEvents, event];

    // Replace map instead of mutating
    this._eventsByDate = new Map(this._eventsByDate).set(
      event.date,
      updatedEvents,
    );

    StorageManager.saveEvent(event);
    this.notifyListeners();
  }

  /**
   * Removes an event with the specified UID from the app state
   * and deletes the event from localStorage.
   *
   * If no event with the specified UID exists, throws an error.
   * @param uid Unique identifier of the event to remove
   */
  removeEvent(uid: string): void {
    const event = this._eventsByUID.get(uid);

    if (!event) {
      throw new Error(`No event found with UID: ${uid}`);
    }

    // Replace map instead of mutating
    this._eventsByUID = new Map(this._eventsByUID);
    this._eventsByUID.delete(uid);

    // Remove from recurringEvents if needed
    if (event.recurrence !== "none") {
      this._recurringEvents = this._recurringEvents.filter(
        (e) => e.UID !== uid,
      );
    }

    // Remove the event from the array of events for that date
    const remainingEvents = (this._eventsByDate.get(event.date) ?? []).filter(
      (e) => e.UID !== uid,
    );

    this._eventsByDate = new Map(this._eventsByDate);

    if (remainingEvents.length === 0) {
      this._eventsByDate.delete(event.date);
    } else {
      this._eventsByDate.set(event.date, remainingEvents);
    }

    StorageManager.deleteEvent(uid);
    this.notifyListeners();
  }

  /**
   * Returns the current calendar view as a string ("day", "week", or "month").
   * @returns "day", "week", or "month" string representing the current calendar view
   */
  get calendarView(): CalendarViews {
    return this._calendarView;
  }

  /**
   * Sets the current calendar view. The view must be "day", "week", or "month".
   * If the view is not valid, throws an error.
   *
   * Also saves the new calendar view to localStorage so that it persists across page reloads.
   * @param view "day", "week", or "month" string to set as the current calendar view
   */
  set calendarView(view: CalendarViews) {
    if (!Object.values(CalendarViews).includes(view)) {
      throw new Error(
        `Invalid calendar view. Valid views are: ${Object.values(CalendarViews).join(", ")}`,
      );
    }

    this._calendarView = view;
    StorageManager.saveCalendarView(view);
    this.notifyListeners();
  }

  /**
   * Returns the current date view as a string.
   * @returns "YYYY-MM-DD" formatted date string
   */
  get dateView(): string {
    return this._dateView;
  }

  /**
   * Returns the current date view as a Date object.
   * @returns Date object representing the current date view
   */
  get dateViewObject(): Date {
    const [year, month, day] = this._dateView.split("-").map(Number);

    // TypeScript thinks this._dateView.split("-") could be undefined,
    // but dateView is always validated through the setter.
    return new Date(year!, month! - 1, day!);
  }

  /**
   * Sets the current date view. The date must be in "YYYY-MM-DD" format for the year 2000-2099.
   * If the date is not in the correct format, throws an error.
   * @param date "YYYY-MM-DD" formatted date string to set as the current date view
   */
  set dateView(date: string) {
    const dateRegex = /^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (!dateRegex.test(date)) {
      throw new Error(
        `Invalid date format. Date must be in "YYYY-MM-DD" format for the year 2000-2099.`,
      );
    }

    this._dateView = date;

    const year = this.dateViewObject.getFullYear();

    if (!this.areHolidaysLoadedForYear(year)) {
      this.loadHolidayEventsForYear(year);
    } else {
      this.notifyListeners();
    }
  }

  switchToDay(date: string) {
    this._calendarView = CalendarViews.Day;
    StorageManager.saveCalendarView(CalendarViews.Day);
    this._dateView = date;

    const year = this.dateViewObject.getFullYear();

    if (!this.areHolidaysLoadedForYear(year)) {
      this.loadHolidayEventsForYear(year);
    } else {
      this.notifyListeners();
    }
  }

  /**
   * Allows components to subscribe to changes in the app state.
   * Whenever the app state changes, all subscribed listener functions will be called
   * so that they can update their UI accordingly.
   *
   * Returns an unsubscribe function that React uses when the component unmounts.
   */
  subscribe(listener: () => void) {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  }

  /**
   * Calls all subscribed listener functions to notify them that app state has changed.
   * This replaces extra calls to rerender elsewhere in the code.
   */
  private notifyListeners() {
    this.snapshot = this.buildSnapshot();
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Snapshot of the current app state that is passed to subscribed listener functions whenever app state changes.
   * This is how React decides if a component needs to rerender.
   * @returns
   */
  getSnapshot() {
    return this.snapshot;
  }

  private snapshot = this.buildSnapshot();

  private buildSnapshot() {
    return {
      allEventsByDate: this._eventsByDate,
      calendarView: this._calendarView,
      dateView: this._dateView,
    };
  }
}

/**
 * Single source of truth for all event data and calendar state in the app.
 */
const appState = new AppState();

// Tapping F2 3x within a couple seconds will load mock events for testing purposes.
registerCheatCode(() => {
  console.log("Loading mock events...");
  const mockEvents = createMockEvents();

  mockEvents.forEach((event) => appState.addEvent(event));

  // Reload the page to update the UI with the new events
  location.reload();
});

/**
 * Function that React components can import and call to subscribe to changes in the app state.
 * Whenever the app state changes, the subscribed component will receive a new snapshot
 * of the app state and can update its UI if needed.
 */
export function useAppState() {
  return useSyncExternalStore(
    (listener) => appState.subscribe(listener),
    () => appState.getSnapshot(),
  );
}

export default appState;
