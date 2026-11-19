import { formatHeaderDate } from "../modules/calendar/calendar-header-display";

export default function calendarHeaderDisplayTests() {
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      passed++;
    } catch (err) {
      console.log(`  ❌ FAIL: ${name}`);
      console.log(`     ${err.message}`);
    }
  }

  function assertEqual(actual, expected, label = "") {
    if (actual !== expected) {
      throw new Error(
        `${label ? label + ": " : ""}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
      );
    }
  }

  // ✅ LOCAL date helper (avoids timezone bugs)
  function date(y, m, day) {
    return new Date(y, m - 1, day);
  }

  // ── DAY VIEW ─────────────────────────────

  test("day view formats mid-month date", () => {
    assertEqual(formatHeaderDate("day", "Sunday", date(2026, 4, 9)), "Apr 9, 2026");
  });

  test("day view formats first of month", () => {
    assertEqual(formatHeaderDate("day", "Sunday", date(2026, 3, 1)), "Mar 1, 2026");
  });

  test("day view formats last of month", () => {
    assertEqual(formatHeaderDate("day", "Sunday", date(2026, 1, 31)), "Jan 31, 2026");
  });

  // ── WEEK VIEW (SUNDAY START) ─────────────────────────────

  test("week (Sun start) — Sunday input", () => {
    assertEqual(formatHeaderDate("week", "Sunday", date(2026, 4, 5)), "Apr 5 - Apr 11, 2026");
  });

  test("week (Sun start) — mid-week", () => {
    assertEqual(formatHeaderDate("week", "Sunday", date(2026, 4, 8)), "Apr 5 - Apr 11, 2026");
  });

  test("week (Sun start) — wraps month", () => {
    assertEqual(formatHeaderDate("week", "Sunday", date(2026, 3, 30)), "Mar 29 - Apr 4, 2026");
  });

  test("week (Sun start) — wraps year", () => {
    assertEqual(formatHeaderDate("week", "Sunday", date(2026, 1, 3)), "Dec 28 - Jan 3, 2026");
  });

  // ── WEEK VIEW (MONDAY START) ─────────────────────────────

  test("week (Mon start) — Monday input", () => {
    assertEqual(formatHeaderDate("week", "Monday", date(2026, 4, 6)), "Apr 6 - Apr 12, 2026");
  });

  test("week (Mon start) — Sunday is end of week", () => {
    assertEqual(formatHeaderDate("week", "Monday", date(2026, 4, 12)), "Apr 6 - Apr 12, 2026");
  });

  test("week (Mon start) — wraps month", () => {
    assertEqual(formatHeaderDate("week", "Monday", date(2026, 3, 31)), "Mar 30 - Apr 5, 2026");
  });

  test("week (Mon start) — wraps year", () => {
    assertEqual(formatHeaderDate("week", "Monday", date(2026, 1, 4)), "Dec 29 - Jan 4, 2026");
  });

  // ── MONTH VIEW ─────────────────────────────

  test("month view formats correctly", () => {
    assertEqual(formatHeaderDate("month", "Sunday", date(2026, 4, 9)), "April 2026");
  });

  test("month view January", () => {
    assertEqual(formatHeaderDate("month", "Sunday", date(2026, 1, 15)), "January 2026");
  });

  test("month view December", () => {
    assertEqual(formatHeaderDate("month", "Sunday", date(2025, 12, 1)), "December 2025");
  });

  // ── DESIGN INTENT ─────────────────────────────

  test("week format repeats month (intentional)", () => {
    assertEqual(formatHeaderDate("week", "Sunday", date(2026, 4, 9)), "Apr 5 - Apr 11, 2026");
  });

  // ── ERROR CASE ─────────────────────────────

  test("unsupported view throws", () => {
    let threw = false;
    try {
      formatHeaderDate("yearly", "Sunday", date(2026, 4, 9));
    } catch {
      threw = true;
    }
    if (!threw) throw new Error("should throw");
  });

  console.log(`✅ formatHeaderDate — ${passed}/${total} Tests Passed!`);
}
