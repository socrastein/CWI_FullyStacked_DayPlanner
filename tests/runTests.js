import eventTests from "./classCalendarEvent_test";
import storageTests from "./dataStorage_test";
import appStateTests from "./appState_test";
import appSettingsTests from "./appSettings_test";
import dateUtilsTests from "./dateUtils_test";
import calendarHeaderDisplayTests from "./calendar-header-display_test";
import holidayTests from "./holidayTesting";

// Records the time taken to run each test suite and logs it in ms
function runWithTiming(label, testFn) {
  const startTime = performance.now();
  console.group(label);
  try {
    testFn();
  } finally {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed();

    console.log(`⏱ Completed in ${duration}ms`);
    console.groupEnd();
  }
}

function runTests() {
  const startTime = performance.now();
  runWithTiming("CalendarEvent Tests", eventTests);
  runWithTiming("StorageManager Tests", storageTests);
  runWithTiming("AppState Tests", appStateTests);
  runWithTiming("AppSettings Tests", appSettingsTests);
  runWithTiming("DateUtils Tests", dateUtilsTests);
  runWithTiming("CalendarHeaderDisplay Tests", calendarHeaderDisplayTests);
  runWithTiming("Holiday Tests", holidayTests);
  const endTime = performance.now();
  const totalDuration = (endTime - startTime).toFixed();
  console.log(`🏁 All tests completed in ${totalDuration}ms`);
}

export default runTests;
