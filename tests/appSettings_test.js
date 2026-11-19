import appSettings from "../modules/appSettings";

export default function appSettingsTests() {
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

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function assertEqual(actual, expected, label = "") {
    if (actual !== expected)
      throw new Error(
        `${label ? label + ": " : ""}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
      );
  }

  // Save all initial values so we can restore them after the suite
  const initialLightMode = appSettings.lightMode;
  const initialTempUnit = appSettings.tempUnit;
  const initialFirstDayOfWeek = appSettings.firstDayOfWeek;
  const initialDisplayHolidays = appSettings.displayHolidays;
  const initialColorTheme = appSettings.colorTheme;

  // ── toggleLightMode ─────────────────────────────────────────────────────────

  test("toggleLightMode switches light to dark", () => {
    if (appSettings.lightMode !== "light") appSettings.toggleLightMode();
    appSettings.toggleLightMode();
    assertEqual(appSettings.lightMode, "dark");
  });

  test("toggleLightMode switches dark to light", () => {
    if (appSettings.lightMode !== "dark") appSettings.toggleLightMode();
    appSettings.toggleLightMode();
    assertEqual(appSettings.lightMode, "light");
  });

  // ── toggleTempUnit ──────────────────────────────────────────────────────────

  test("toggleTempUnit switches Fahrenheit to Celsius", () => {
    if (appSettings.tempUnit !== "Fahrenheit") appSettings.toggleTempUnit();
    appSettings.toggleTempUnit();
    assertEqual(appSettings.tempUnit, "Celsius");
  });

  test("toggleTempUnit switches Celsius to Fahrenheit", () => {
    if (appSettings.tempUnit !== "Celsius") appSettings.toggleTempUnit();
    appSettings.toggleTempUnit();
    assertEqual(appSettings.tempUnit, "Fahrenheit");
  });

  test("toggleTempUnit notifies listeners", () => {
    let notified = false;
    const unsub = appSettings.subscribe(() => {
      notified = true;
    });
    appSettings.toggleTempUnit();
    appSettings.toggleTempUnit(); // restore
    unsub();
    assert(notified, "listener should have been called");
  });

  // ── toggleFirstDayOfWeek ────────────────────────────────────────────────────

  test("toggleFirstDayOfWeek switches Sunday to Monday", () => {
    if (appSettings.firstDayOfWeek !== "Sunday") appSettings.toggleFirstDayOfWeek();
    appSettings.toggleFirstDayOfWeek();
    assertEqual(appSettings.firstDayOfWeek, "Monday");
  });

  test("toggleFirstDayOfWeek switches Monday to Sunday", () => {
    if (appSettings.firstDayOfWeek !== "Monday") appSettings.toggleFirstDayOfWeek();
    appSettings.toggleFirstDayOfWeek();
    assertEqual(appSettings.firstDayOfWeek, "Sunday");
  });

  test("toggleFirstDayOfWeek notifies listeners", () => {
    let notified = false;
    const unsub = appSettings.subscribe(() => {
      notified = true;
    });
    appSettings.toggleFirstDayOfWeek();
    appSettings.toggleFirstDayOfWeek(); // restore
    unsub();
    assert(notified, "listener should have been called");
  });

  // ── toggleDisplayHolidays ───────────────────────────────────────────────────

  test("toggleDisplayHolidays switches true to false", () => {
    if (appSettings.displayHolidays !== true) appSettings.toggleDisplayHolidays();
    appSettings.toggleDisplayHolidays();
    assertEqual(appSettings.displayHolidays, false);
  });

  test("toggleDisplayHolidays switches false to true", () => {
    if (appSettings.displayHolidays !== false) appSettings.toggleDisplayHolidays();
    appSettings.toggleDisplayHolidays();
    assertEqual(appSettings.displayHolidays, true);
  });

  test("toggleDisplayHolidays notifies listeners", () => {
    let notified = false;
    const unsub = appSettings.subscribe(() => {
      notified = true;
    });
    appSettings.toggleDisplayHolidays();
    appSettings.toggleDisplayHolidays(); // restore
    unsub();
    assert(notified, "listener should have been called");
  });

  // ── colorTheme ──────────────────────────────────────────────────────────────

  test("colorTheme accepts all valid themes", () => {
    const validThemes = ["blue", "purple", "pink", "red", "orange", "yellow", "green"];
    for (const theme of validThemes) {
      appSettings.colorTheme = theme;
      assertEqual(appSettings.colorTheme, theme);
    }
  });

  test("colorTheme throws on invalid value", () => {
    let threw = false;
    try {
      appSettings.colorTheme = "magenta";
    } catch {
      threw = true;
    }
    assert(threw, "should throw for invalid theme");
  });

  // ── restoreDefaults ─────────────────────────────────────────────────────────

  test("restoreDefaults notifies listeners", () => {
    let notified = false;
    const unsub = appSettings.subscribe(() => {
      notified = true;
    });
    appSettings.restoreDefaults();
    unsub();
    assert(notified, "listener should have been called");
  });

  test("restoreDefaults resets all settings to defaults", () => {
    // Put everything in a non-default state first
    if (appSettings.lightMode !== "dark") appSettings.toggleLightMode();
    if (appSettings.tempUnit !== "Celsius") appSettings.toggleTempUnit();
    if (appSettings.firstDayOfWeek !== "Monday") appSettings.toggleFirstDayOfWeek();
    if (appSettings.displayHolidays !== false) appSettings.toggleDisplayHolidays();
    appSettings.colorTheme = "green";

    appSettings.restoreDefaults();

    const docBody = document.body;
    assertEqual(appSettings.lightMode, "light", "lightMode");
    assertEqual(
      docBody.classList.contains("dark-mode"),
      false,
      "body should not have dark-mode class",
    );
    assertEqual(appSettings.tempUnit, "Fahrenheit", "tempUnit");
    assertEqual(appSettings.firstDayOfWeek, "Sunday", "firstDayOfWeek");
    assertEqual(appSettings.displayHolidays, true, "displayHolidays");
    assertEqual(appSettings.colorTheme, "blue", "colorTheme");
  });

  // ── getSnapshot ─────────────────────────────────────────────────────────────

  test("getSnapshot reflects current settings", () => {
    if (appSettings.tempUnit !== "Celsius") appSettings.toggleTempUnit();
    const snap = appSettings.getSnapshot();
    assertEqual(snap.tempUnit, "Celsius", "tempUnit");
    appSettings.toggleTempUnit(); // restore
  });

  test("getSnapshot updates after a toggle", () => {
    const before = appSettings.getSnapshot().firstDayOfWeek;
    appSettings.toggleFirstDayOfWeek();
    const after = appSettings.getSnapshot().firstDayOfWeek;
    assert(before !== after, "snapshot should reflect the change");
    appSettings.toggleFirstDayOfWeek(); // restore
  });

  // ── subscribe / unsubscribe ─────────────────────────────────────────────────

  test("unsubscribe stops further notifications", () => {
    let count = 0;
    const unsub = appSettings.subscribe(() => {
      count++;
    });
    appSettings.toggleTempUnit();
    unsub();
    appSettings.toggleTempUnit(); // restore — should not increment count
    assertEqual(count, 1, "should only have been notified once");
  });

  test("multiple listeners all notified on change", () => {
    let a = 0,
      b = 0;
    const unsubA = appSettings.subscribe(() => a++);
    const unsubB = appSettings.subscribe(() => b++);
    appSettings.toggleDisplayHolidays();
    appSettings.toggleDisplayHolidays(); // restore
    unsubA();
    unsubB();
    assert(a >= 1, "listener A should have been called");
    assert(b >= 1, "listener B should have been called");
  });

  // ─── Restore all settings ─────────────────────────────────────────────────

  if (appSettings.lightMode !== initialLightMode) appSettings.toggleLightMode();
  if (appSettings.tempUnit !== initialTempUnit) appSettings.toggleTempUnit();
  if (appSettings.firstDayOfWeek !== initialFirstDayOfWeek) appSettings.toggleFirstDayOfWeek();
  if (appSettings.displayHolidays !== initialDisplayHolidays) appSettings.toggleDisplayHolidays();
  appSettings.colorTheme = initialColorTheme;

  // ─── Results ─────────────────────────────────────────────────────────────────

  console.log(`✅ AppSettings — ${passed}/${total} Tests Passed!`);
}
