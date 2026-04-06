import calendarNavigationFunctionsTest from "./calendar-navigation-test";
import eventTests from "./classCalendarEvent_test";
import storageTests from "./dataStorage_test";
import settingsTests from "./settings_test";

function runTests() {
  eventTests();
  storageTests();
  settingsTests();
  calendarNavigationFunctionsTest();
}

export default runTests;
