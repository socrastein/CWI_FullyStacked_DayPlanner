import { getHolidayEvents } from "../modules/holidayEvent";

function holidayTests() {
  let passed = 0;
  let failed = 0;
  function assert(label, actual, expected) {
    if (actual !== expected) {
      console.error(
        `❌ FAIL — "${label}": expected "${expected}", got "${actual}"`,
      );
      failed++;
      return;
    }
    passed++;
  }

  console.log("🧪 Testing Holiday Events for 2026...");
  const holidays2026 = getHolidayEvents(2026);

  const expectedHolidayDates = {
    //use objects to set title for the key and date becomes the value.
    "New Year's Day": "2026-01-01",
    "Martin Luther King Jr. Day": "2026-01-19",
    "Valentine's Day": "2026-02-14",
    "Presidents Day": "2026-02-16",
    "St. Patrick's Day": "2026-03-17",
    "Mother's Day": "2026-05-10",
    "Memorial Day": "2026-05-25",
    "Father's Day": "2026-06-21",
    Juneteenth: "2026-06-19", //prettier force removes "" around these three as they are valid objects. "" are removed everytime I hit save anywhere in the project.  Not sure how to override prettier on this so they aren't uniform and I hate it.
    "Independence Day": "2026-07-04",
    "Labor Day": "2026-09-07",
    "Columbus Day": "2026-10-12",
    Halloween: "2026-10-31",
    "Veterans Day": "2026-11-11",
    Thanksgiving: "2026-11-26",
    "Christmas Eve": "2026-12-24",
    "Christmas Day": "2026-12-25",
    "New Year's Eve": "2026-12-31",
  };

  assert(
    "holiday count for 2026",
    holidays2026.length,
    Object.keys(expectedHolidayDates).length,
  );
  Object.entries(expectedHolidayDates).forEach(([title, expectedDate]) => {
    const matchingHoliday = holidays2026.find(
      (holiday) => holiday.title === title,
    );

    if (!matchingHoliday) {
      console.error(`❌ FAIL — "${title}": holiday was not returned at all.`);
      failed++;
      return;
    }

    assert(`${title} date`, matchingHoliday.date, expectedDate);
  });

  holidays2026.forEach((holiday) => {
    if (!(holiday.title in expectedHolidayDates)) {
      console.error(
        `❌ FAIL — unexpected holiday title "${holiday.title}" was returned.`,
      );
      failed++;
    }
  });

  const total = passed + failed;

  if (failed === 0) {
    console.log(`✅ HolidayTests — ${passed}/${total} tests passed!`);
  } else {
    console.warn(
      `⚠️ HolidayTests — ${passed}/${total} passed, ${failed} failed. See above for details.`,
    );
  }
}

export default holidayTests;
