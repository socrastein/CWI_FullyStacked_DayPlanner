type CalendarNavigationFunctions = {
  navigateDay: (date: Date, delta: number) => string;
  navigateWeek: (date: Date, delta: number) => string;
  navigateMonth: (date: Date, delta: number) => string;
};

// Use calendar dates in the local timezone (not ISO date strings) so expectations match toLocaleDateString("en-CA") output.
function setDate(year: number, monthIndex: number, day: number): Date {
  return new Date(year, monthIndex, day);
}

/**
 * Runs assertions against injected navigate helpers (same implementations as the calendar nav button).
 *
 * Example patterns:
 * - Day/week: +1 / -1 / 0 (zero delta keeps the same calendar day).
 * - Month: clamp end-of-month (Mar 31 + 1 month → Apr 30).
 * - Month: moving across January (Jan 15 − 1 month → Dec 15 prior year).
 */
export function calendarNavigationFunctionsTest({
  navigateDay,
  navigateWeek,
  navigateMonth,
}: CalendarNavigationFunctions) {
  let passed = 0;
  let failed = 0;

  function assert(label: string, fn: () => string, expected: string) {
    try {
      const actual = fn();
      if (actual !== expected) {
        console.error(
          `❌ FAIL — "${label}": expected "${expected}", got "${actual}"`,
        );
        failed++;
        return;
      }
      console.log(`✅ PASS — "${label}": ${actual}`);
      passed++;
    } catch (e) {
      console.error(
        `❌ FAIL — "${label}": ${e instanceof Error ? e.message : String(e)}`,
      );
      failed++;
    }
  }

  console.group("calendarNavigationFunctionsTest");

  console.log("Testing navigateDay");
  assert(
    "next day from 2026-03-31",
    () => navigateDay(setDate(2026, 2, 31), 1),
    "2026-04-01",
  );
  assert(
    "previous day from 2026-03-31",
    () => navigateDay(setDate(2026, 2, 31), -1),
    "2026-03-30",
  );
  assert(
    "delta 0 leaves day unchanged",
    () => navigateDay(setDate(2026, 2, 31), 0),
    "2026-03-31",
  );
  assert(
    "year rollover backward",
    () => navigateDay(setDate(2026, 0, 1), -1),
    "2025-12-31",
  );

  console.log("Testing navigateWeek");
  assert(
    "next week from 2026-03-31",
    () => navigateWeek(setDate(2026, 2, 31), 1),
    "2026-04-07",
  );
  assert(
    "previous week from 2026-03-31",
    () => navigateWeek(setDate(2026, 2, 31), -1),
    "2026-03-24",
  );
  assert(
    "delta 0 leaves week anchor day unchanged",
    () => navigateWeek(setDate(2026, 2, 31), 0),
    "2026-03-31",
  );

  console.log("Testing navigateMonth");
  assert(
    "Mar 31 + 1 month clamps to Apr 30",
    () => navigateMonth(setDate(2026, 2, 31), 1),
    "2026-04-30",
  );
  assert(
    "Mar 31 - 1 month clamps to Feb 28 (non-leap 2026)",
    () => navigateMonth(setDate(2026, 2, 31), -1),
    "2026-02-28",
  );
  assert(
    "delta 0 keeps same calendar day",
    () => navigateMonth(setDate(2026, 2, 31), 0),
    "2026-03-31",
  );
  assert(
    "Jan 15 - 1 month → Dec 15 prior year",
    () => navigateMonth(setDate(2026, 0, 15), -1),
    "2025-12-15",
  );

  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.groupEnd();
}
