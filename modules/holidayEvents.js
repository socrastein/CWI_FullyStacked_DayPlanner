import CalendarEvent from "./classCalendarEvent";
/**
 * returns holiday events
 * these events are generated and not stored in local storage
 * @param {number} year - the year to generate holiday events for
 * @returns {CalendarEvent[]} Array of generated holiday events
 */
export function getHolidayEvents(year) {
  const holidayEvents = [];

  /**
   * Creates a generated holiday event using the CalendarEvent format.
   * For now, holidays are temporarily placed from 00:00 to 01:00
   * until the separate all-day display area is built.
   * @param {{ title: string, date: string }} param0 - Holiday title and YYYY-MM-DD date
   * @returns {CalendarEvent} A generated holiday event
   */
  function createHolidayEvent({ title, date }) {
    return new CalendarEvent({
      UID: `holiday-${title.toLowerCase().replaceAll(" ", "-")}-${date}`,
      date,
      timeStart: "00:00",
      timeEnd: "01:00",
      title,
      description: "",
      address: "",
      //not adding color because it caused validation issues if a color wasn't chosen.  revisit and figure how to set properly
    });
  }
  /**
   * this helper function is a helper that formats the date into a string that CalendarEvent can use
   * used for holidays with a set date
   * @param {number} year
   * @param {number} month
   * @param {number} day
   * @returns {string}
   */
  function formatDate(year, month, day) {
    const monthString = String(month).padStart(2, "0");
    const dayString = String(day).padStart(2, "0");
    return `${year}-${monthString}-${dayString}`;
  }

  /**
   * helper function to calculate holidays with a variable date that is a specific day of a specific week AKA Thanksgiving is Fourth Thursday of November
   */
  function getNthWeekdayOfMonth(year, month, weekday, week) {
    //added validation to make sure numbers work with JS Date objects which roll over to next year,month,week, if outside bounds
    if (!Number.isInteger(year) || year < 2000 || year > 2099) {
      /* set dates based on eventManager date validaiton */
      throw new Error(
        "Event year is out of the allowed range. Allowed range is from 2000 through 2099",
      );
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error(
        "Event month is out of the allowed range. Allowed range is from 1 through 12",
      );
    }
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
      throw new Error(
        "Event day is out of the allowed range. Allowed range is from 0 through 6 with 0 being sunday.",
      );
    }
    if (!Number.isInteger(week) || week < 1 || week > 5) {
      throw new Error(
        "Event week is out of the allowed range. Allowed range is from 1 through 5.",
      );
    }

    const date = new Date(year, month - 1, 1); // month -1 so that 1 through 12 translates properly to 0-11 in JS value
    let count = 0;

    while (true) {
      if (date.getDay() === weekday) {
        count++;
        if (count === week) {
          break;
        }
      }
      date.setDate(date.getDate() + 1);
    }

    const monthString = String(date.getMonth() + 1).padStart(2, "0");
    const dayString = String(date.getDate()).padStart(2, "0");

    return `${date.getFullYear()}-${monthString}-${dayString}`;
  }

  /**
   * Calculates Memorial Day as the last Monday of the month.
   * This uses a separate helper because Memorial Day is not a fixed nth weekday,
   * and using getNthWeekdayOfMonth could roll into the next month.
   */
  function memorialDayCalculator(year, month, weekday) {
    //added validation
    if (!Number.isInteger(year) || year < 2000 || year > 2099) {
      /* set dates based on eventManager date validaiton */
      throw new Error(
        "Event year is out of the allowed range. Allowed range is from 2000 through 2099",
      );
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error(
        "Event month is out of the allowed range. Allowed range is from 1 through 12",
      );
    }
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
      throw new Error(
        "Event day is out of the allowed range. Allowed range is from 0 through 6 with 0 being sunday.",
      );
    }

    const date = new Date(year, month, 0); //sets to last day of the month

    while (date.getDay() !== weekday) {
      /*Checks if it's monday and if not walks backwards till it hits a monday (1)*/
      date.setDate(date.getDate() - 1);
    }
    const monthString = String(date.getMonth() + 1).padStart(2, "0");
    const dayString = String(date.getDate()).padStart(2, "0");

    return `${date.getFullYear()}-${monthString}-${dayString}`;
  }

  //this section is for storing holidays and calcing their date by year.
  holidayEvents.push(
    createHolidayEvent({
      title: "New Year's Day",
      date: formatDate(year, 1, 1),
    }),

    createHolidayEvent({
      title: "Martin Luther King Jr. Day",
      date: getNthWeekdayOfMonth(year, 1, 1, 3),
    }),

    createHolidayEvent({
      title: "Valentine's Day",
      date: formatDate(year, 2, 14),
    }),

    createHolidayEvent({
      title: "Presidents Day",
      date: getNthWeekdayOfMonth(year, 2, 1, 3),
    }),

    createHolidayEvent({
      title: "St. Patrick's Day",
      date: formatDate(year, 3, 17),
    }),

    createHolidayEvent({
      title: "Mother's Day",
      date: getNthWeekdayOfMonth(year, 5, 0, 2),
    }),

    createHolidayEvent({
      title: "Memorial Day",
      date: memorialDayCalculator(year, 5, 1),
    }),

    createHolidayEvent({
      title: "Father's Day",
      date: getNthWeekdayOfMonth(year, 6, 0, 3),
    }),

    createHolidayEvent({
      title: "Juneteenth",
      date: formatDate(year, 6, 19),
    }),

    createHolidayEvent({
      title: "Independence Day",
      date: formatDate(year, 7, 4),
    }),

    createHolidayEvent({
      title: "Labor Day",
      date: getNthWeekdayOfMonth(year, 9, 1, 1),
    }),

    createHolidayEvent({
      title: "Columbus Day",
      date: getNthWeekdayOfMonth(year, 10, 1, 2),
    }),

    createHolidayEvent({
      title: "Halloween",
      date: formatDate(year, 10, 31),
    }),

    createHolidayEvent({
      title: "Veterans Day",
      date: formatDate(year, 11, 11),
    }),

    createHolidayEvent({
      title: "Thanksgiving",
      date: getNthWeekdayOfMonth(year, 11, 4, 4),
    }),

    createHolidayEvent({
      title: "Christmas Eve",
      date: formatDate(year, 12, 24),
    }),

    createHolidayEvent({
      title: "Christmas Day",
      date: formatDate(year, 12, 25),
    }),

    createHolidayEvent({
      title: "New Year's Eve",
      date: formatDate(year, 12, 31),
    }),
  );
  return holidayEvents;
}
