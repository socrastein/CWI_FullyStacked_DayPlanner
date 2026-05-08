import dateUtils from "../modules/dateUtils";

export default function dateUtilsTests() {
  function assert(label, fn, expected) {
    let passed = 0;
    let failed = 0;

    try {
      const actual = fn();
      if (actual !== expected) {
        console.error(
          `❌ FAIL — "${label}": expected "${expected}", got "${actual}"`,
        );
        failed++;
      } else {
        passed++;
      }
    } catch (e) {
      console.error(
        `❌ FAIL — "${label}": ${e instanceof Error ? e.message : String(e)}`,
      );
      failed++;
    }

    return { passed, failed };
  }

  let totalPassed = 0;
  let totalFailed = 0;

  function runSuite(suiteName, cases) {
    for (const { label, fn, expected } of cases) {
      const result = assert(label, fn, expected);
      totalPassed += result.passed;
      totalFailed += result.failed;
    }
  }

  // ---------------------------------------------------------------------------
  // getDayString
  // ---------------------------------------------------------------------------
  runSuite("getDayString", [
    {
      label: "returns 'Mon' for a known Monday (Date object)",
      fn: () => dateUtils.getDayString(new Date(2026, 3, 6)), // Apr 6 2026 is Monday
      expected: "Mon",
    },
    {
      label: "returns 'Sun' for a known Sunday (Date object)",
      fn: () => dateUtils.getDayString(new Date(2026, 3, 5)), // Apr 5 2026 is Sunday
      expected: "Sun",
    },
    {
      label: "accepts a date string",
      fn: () => dateUtils.getDayString("2026-04-10"), // Friday
      expected: "Fri",
    },
    {
      label: "returns 'Sat' for a Saturday",
      fn: () => dateUtils.getDayString("2026-04-11"),
      expected: "Sat",
    },
  ]);

  // ---------------------------------------------------------------------------
  // stringToDate
  // ---------------------------------------------------------------------------
  runSuite("stringToDate", [
    {
      label: "parses YYYY-MM-DD into a local Date",
      fn: () => {
        const d = dateUtils.stringToDate("2026-04-06");
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      },
      expected: "2026-3-6", // month is 0-indexed
    },
    {
      label: "month boundary: Dec 31",
      fn: () => {
        const d = dateUtils.stringToDate("2025-12-31");
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      },
      expected: "2025-11-31",
    },
    {
      label: "returns a Date instance",
      fn: () =>
        dateUtils.stringToDate("2026-01-01") instanceof Date ? "yes" : "no",
      expected: "yes",
    },
  ]);

  // ---------------------------------------------------------------------------
  // dateToString
  // ---------------------------------------------------------------------------
  runSuite("dateToString", [
    {
      label: "formats a Date as YYYY-MM-DD",
      fn: () => dateUtils.dateToString(new Date(2026, 3, 6)), // Apr 6 2026
      expected: "2026-04-06",
    },
    {
      label: "pads single-digit month and day",
      fn: () => dateUtils.dateToString(new Date(2026, 0, 5)), // Jan 5 2026
      expected: "2026-01-05",
    },
    {
      label: "no argument returns today's date string",
      fn: () => dateUtils.dateToString(),
      expected: dateUtils.dateToString(new Date()),
    },
  ]);

  // ---------------------------------------------------------------------------
  // isToday
  // ---------------------------------------------------------------------------
  runSuite("isToday", [
    {
      label: "returns true for today (Date object)",
      fn: () => String(dateUtils.isToday(new Date())),
      expected: "true",
    },
    {
      label: "returns true for today (string)",
      fn: () => String(dateUtils.isToday(dateUtils.dateToString(new Date()))),
      expected: "true",
    },
    {
      label: "returns false for yesterday",
      fn: () => String(dateUtils.isToday(dateUtils.addDays(new Date(), -1))),
      expected: "false",
    },
    {
      label: "returns false for tomorrow",
      fn: () => String(dateUtils.isToday("2099-01-01")),
      expected: "false",
    },
  ]);

  // ---------------------------------------------------------------------------
  // addDays
  // ---------------------------------------------------------------------------
  runSuite("addDays", [
    {
      label: "adds 1 day across month boundary",
      fn: () =>
        dateUtils.dateToString(dateUtils.addDays(new Date(2026, 2, 31), 1)),
      expected: "2026-04-01",
    },
    {
      label: "subtracts 1 day across year boundary",
      fn: () =>
        dateUtils.dateToString(dateUtils.addDays(new Date(2026, 0, 1), -1)),
      expected: "2025-12-31",
    },
    {
      label: "delta 0 leaves date unchanged",
      fn: () =>
        dateUtils.dateToString(dateUtils.addDays(new Date(2026, 2, 31), 0)),
      expected: "2026-03-31",
    },
    {
      label: "adds 7 days (one week)",
      fn: () =>
        dateUtils.dateToString(dateUtils.addDays(new Date(2026, 2, 31), 7)),
      expected: "2026-04-07",
    },
    {
      label: "accepts a date string",
      fn: () => dateUtils.dateToString(dateUtils.addDays("2026-04-01", -1)),
      expected: "2026-03-31",
    },
  ]);

  // ---------------------------------------------------------------------------
  // addMonths
  // ---------------------------------------------------------------------------
  runSuite("addMonths", [
    {
      label: "Mar 31 + 1 month clamps to Apr 30",
      fn: () =>
        dateUtils.dateToString(dateUtils.addMonths(new Date(2026, 2, 31), 1)),
      expected: "2026-04-30",
    },
    {
      label: "Mar 31 - 1 month clamps to Feb 28 (non-leap 2026)",
      fn: () =>
        dateUtils.dateToString(dateUtils.addMonths(new Date(2026, 2, 31), -1)),
      expected: "2026-02-28",
    },
    {
      label: "Jan 15 - 1 month crosses year boundary to Dec 15",
      fn: () =>
        dateUtils.dateToString(dateUtils.addMonths(new Date(2026, 0, 15), -1)),
      expected: "2025-12-15",
    },
    {
      label: "delta 0 keeps same calendar day",
      fn: () =>
        dateUtils.dateToString(dateUtils.addMonths(new Date(2026, 2, 31), 0)),
      expected: "2026-03-31",
    },
    {
      label: "accepts a date string",
      fn: () => dateUtils.dateToString(dateUtils.addMonths("2026-01-31", 1)),
      expected: "2026-02-28",
    },
  ]);

  // ---------------------------------------------------------------------------
  // getReadableDateString
  // ---------------------------------------------------------------------------
  runSuite("getReadableDateString", [
    {
      label: "formats Apr 5 2026 with abbreviated month",
      fn: () => dateUtils.getReadableDateString(new Date(2026, 3, 5)),
      expected: "Apr 5, 2026",
    },
    {
      label: "accepts a date string",
      fn: () => dateUtils.getReadableDateString("2026-01-01"),
      expected: "Jan 1, 2026",
    },
    {
      label: "formats a double-digit day correctly",
      fn: () => dateUtils.getReadableDateString("2026-12-25"),
      expected: "Dec 25, 2026",
    },
  ]);

  // ---------------------------------------------------------------------------
  // weekRangeStartDate
  // ---------------------------------------------------------------------------
  runSuite("weekRangeStartDate", [
    {
      label: "Wednesday with Sunday start → previous Sunday",
      fn: () =>
        dateUtils.dateToString(
          dateUtils.weekRangeStartDate(new Date(2026, 3, 8), "Sunday"),
        ),
      expected: "2026-04-05",
    },
    {
      label: "Wednesday with Monday start → previous Monday",
      fn: () =>
        dateUtils.dateToString(
          dateUtils.weekRangeStartDate(new Date(2026, 3, 8), "Monday"),
        ),
      expected: "2026-04-06",
    },
    {
      label: "Sunday with Sunday start → same day",
      fn: () =>
        dateUtils.dateToString(
          dateUtils.weekRangeStartDate(new Date(2026, 3, 5), "Sunday"),
        ),
      expected: "2026-04-05",
    },
    {
      label: "Monday with Monday start → same day",
      fn: () =>
        dateUtils.dateToString(
          dateUtils.weekRangeStartDate(new Date(2026, 3, 6), "Monday"),
        ),
      expected: "2026-04-06",
    },
    {
      label: "Sunday with Monday start → previous Monday (6 days back)",
      fn: () =>
        dateUtils.dateToString(
          dateUtils.weekRangeStartDate(new Date(2026, 3, 5), "Monday"),
        ),
      expected: "2026-03-30",
    },
    {
      label: "accepts a date string",
      fn: () =>
        dateUtils.dateToString(
          dateUtils.weekRangeStartDate("2026-04-08", "Sunday"),
        ),
      expected: "2026-04-05",
    },
  ]);

  // ---------------------------------------------------------------------------
  // getReadableWeekRangeString
  // ---------------------------------------------------------------------------
  runSuite("getReadableWeekRangeString", [
    {
      label: "week range with Sunday start (same month)",
      fn: () =>
        dateUtils.getReadableWeekRangeString(new Date(2026, 3, 8), "Sunday"),
      expected: "Apr 5 - Apr 11, 2026",
    },
    {
      label: "week range with Monday start (same month)",
      fn: () =>
        dateUtils.getReadableWeekRangeString(new Date(2026, 3, 8), "Monday"),
      expected: "Apr 6 - Apr 12, 2026",
    },
    {
      label: "week range spanning two months",
      fn: () =>
        dateUtils.getReadableWeekRangeString(new Date(2026, 2, 31), "Monday"),
      expected: "Mar 30 - Apr 5, 2026",
    },
    {
      label: "cross-year week range (Dec into Jan)",
      fn: () =>
        dateUtils.getReadableWeekRangeString(new Date(2025, 11, 29), "Monday"),
      expected: "Dec 29 - Jan 4, 2026",
    },
    {
      label: "accepts a date string",
      fn: () => dateUtils.getReadableWeekRangeString("2026-04-08", "Sunday"),
      expected: "Apr 5 - Apr 11, 2026",
    },
  ]);

  // ---------------------------------------------------------------------------
  // getReadableMonthString
  // ---------------------------------------------------------------------------
  runSuite("getReadableMonthString", [
    {
      label: "returns full month name and year",
      fn: () => dateUtils.getReadableMonthString(new Date(2026, 3, 6)),
      expected: "April 2026",
    },
    {
      label: "accepts a date string",
      fn: () => dateUtils.getReadableMonthString("2026-01-15"),
      expected: "January 2026",
    },
    {
      label: "December",
      fn: () => dateUtils.getReadableMonthString("2025-12-01"),
      expected: "December 2025",
    },
  ]);

  // ---------------------------------------------------------------------------
  // militaryToMinutes
  // ---------------------------------------------------------------------------
  runSuite("militaryToMinutes", [
    {
      label: "midnight → 0 minutes",
      fn: () => String(dateUtils.militaryToMinutes("00:00")),
      expected: "0",
    },
    {
      label: "14:00 → 840 minutes",
      fn: () => String(dateUtils.militaryToMinutes("14:00")),
      expected: "840",
    },
    {
      label: "23:59 → 1439 minutes",
      fn: () => String(dateUtils.militaryToMinutes("23:59")),
      expected: "1439",
    },
    {
      label: "09:30 → 570 minutes",
      fn: () => String(dateUtils.militaryToMinutes("09:30")),
      expected: "570",
    },
  ]);

  // ---------------------------------------------------------------------------
  // militaryToStandard
  // ---------------------------------------------------------------------------
  runSuite("militaryToStandard", [
    {
      label: "14:00 → 2:00 PM",
      fn: () => dateUtils.militaryToStandard("14:00"),
      expected: "2:00 PM",
    },
    {
      label: "00:00 → 12:00 AM",
      fn: () => dateUtils.militaryToStandard("00:00"),
      expected: "12:00 AM",
    },
    {
      label: "12:00 → 12:00 PM",
      fn: () => dateUtils.militaryToStandard("12:00"),
      expected: "12:00 PM",
    },
    {
      label: "09:30 → 9:30 AM",
      fn: () => dateUtils.militaryToStandard("09:30"),
      expected: "9:30 AM",
    },
  ]);

  // ---------------------------------------------------------------------------
  // currentMinutesFromMidnight
  // ---------------------------------------------------------------------------
  runSuite("currentMinutesFromMidnight", [
    {
      label: "returns a number between 0 and 1439",
      fn: () => {
        const minutes = dateUtils.currentMinutesFromMidnight();
        return typeof minutes === "number" && minutes >= 0 && minutes < 1440
          ? "yes"
          : "no";
      },
      expected: "yes",
    },
    {
      label: "matches manual calculation from current time",
      fn: () => {
        const now = new Date();
        const expected = now.getHours() * 60 + now.getMinutes();
        return String(dateUtils.currentMinutesFromMidnight() === expected);
      },
      expected: "true",
    },
  ]);

  // ---------------------------------------------------------------------------
  // Static properties
  // ---------------------------------------------------------------------------
  runSuite("Static properties", [
    {
      label: "daysOfWeekSun starts with Sun",
      fn: () => dateUtils.daysOfWeekSun[0],
      expected: "Sun",
    },
    {
      label: "daysOfWeekSun ends with Sat",
      fn: () => dateUtils.daysOfWeekSun[6],
      expected: "Sat",
    },
    {
      label: "daysOfWeekMon starts with Mon",
      fn: () => dateUtils.daysOfWeekMon[0],
      expected: "Mon",
    },
    {
      label: "daysOfWeekMon ends with Sun",
      fn: () => dateUtils.daysOfWeekMon[6],
      expected: "Sun",
    },
    {
      label: "hourSlotsArray has 24 entries",
      fn: () => String(dateUtils.hourSlotsArray.length),
      expected: "24",
    },
    {
      label: "hourSlotsArray first entry is 0 (midnight)",
      fn: () => String(dateUtils.hourSlotsArray[0]),
      expected: "0",
    },
    {
      label: "hourSlotsArray last entry is 1380 (23:00)",
      fn: () => String(dateUtils.hourSlotsArray[23]),
      expected: "1380",
    },
    {
      label: "minutesPerDay equals 1440",
      fn: () => String(dateUtils.minutesPerDay),
      expected: "1440",
    },
  ]);

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  const total = totalPassed + totalFailed;
  if (totalFailed === 0) {
    console.log(`✅ dateUtils — ${totalPassed}/${total} Tests Passed!`);
  } else {
    console.warn(
      `⚠️  dateUtils — ${totalPassed}/${total} passed, ${totalFailed} failed. See above for details.`,
    );
  }
}
