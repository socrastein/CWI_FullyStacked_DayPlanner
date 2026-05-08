const dateUtils = {
  /**
   * Array of shortened weekday names starting with Sunday or "Sun"
   */
  daysOfWeekSun: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  /**
   * Array of shortened weekday names starting with Monday or "Mon"
   */
  daysOfWeekMon: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

  /**
   * Array of 24 numbers representing each hour
   * from midnight (0) in 60 minute increments
   *
   * This is an Immediately Invoked Function Expression,
   * meaning the function runs one time, upon app load,
   * and the return is assigned to hourSlotsArray
   */
  hourSlotsArray: (() => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(i * 60);
    }
    return slots;
  })(),

  /**
   * Calculates the day that a date occurs on and returns it
   * as an abbreviated string
   * @param date Date or date string
   * @returns String with abbreviated day name, i.e. "Mon"
   */
  getDayString(date: Date | string): string {
    date = typeof date === "string" ? this.stringToDate(date) : date;
    return this.daysOfWeekSun[date.getDay()]!;
  },

  /**
   * Parses a date string into a date object
   * @param dateString ISO standard "YYYY-MM-DD" string
   * @returns
   */
  stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number) as [
      number,
      number,
      number,
    ];
    return new Date(year, month - 1, day);
  },

  /**
   * Parses a Date object into an ISO standard string.
   * Uses today's date if no date is passed.
   * @param date Date object you want as "YYYY-MM-DD" string
   * @returns
   */
  dateToString(date?: Date | undefined): string {
    if (!date) date = new Date();
    return date.toLocaleDateString("en-CA");
  },

  /**
   * Checks if the passed Date object or date string represent's today's date
   * @param date Date object or ISO string you want to check against today's date
   * @returns True if the date you passed is today
   */
  isToday(date: Date | string): boolean {
    const dateString = date instanceof Date ? this.dateToString(date) : date;
    return dateString === this.dateToString(new Date());
  },

  /**
   * Takes a date and returns a copy with days added (or subtracted)
   * @param date Date object you want to add days to
   * @param add The number of days you want to add (or subtract)
   * @returns New Date X days later (or earlier)
   */
  addDays(date: Date | string, add: number): Date {
    const dateCopy = new Date(
      typeof date === "string" ? this.stringToDate(date) : date,
    );
    dateCopy.setDate(dateCopy.getDate() + add);
    return dateCopy;
  },

  /**
   * Takes a date and returns a copy with months added (or subtracted)
   *
   * If current day is greater than total days in the resulting month,
   * the date will be set to the last day of that month,
   * e.g. January 31 + 1 month gives you February 28
   * @param date Date object or string you are adding months to
   * @param add Number of months to add (or subtract)
   * @returns New Date X months later (or earlier)
   */
  addMonths(date: Date | string, add: number): Date {
    const dateCopy = new Date(
      typeof date === "string" ? this.stringToDate(date) : date,
    );
    const dayOfMonth = dateCopy.getDate();
    dateCopy.setDate(1);
    dateCopy.setMonth(dateCopy.getMonth() + add);
    const lastDayOfMonth = new Date(
      dateCopy.getFullYear(),
      dateCopy.getMonth() + 1,
      0,
    ).getDate();
    dateCopy.setDate(Math.min(dayOfMonth, lastDayOfMonth));
    return dateCopy;
  },

  /**
   * Formats a date with shortened month, e.g. "Apr 5, 2026"
   * @param date Date object or date string to be formatted
   * @returns
   */
  getReadableDateString(date: Date | string): string {
    date = typeof date === "string" ? this.stringToDate(date) : date;
    return date.toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  },

  /**
   * Takes a Date object and calculates the first day of the week which contains that Date
   * @param date Date object or string that falls on the week you want the starting day of
   * @param firstDayOfWeek Do you want the first day of the week to be Monday or Sunday
   * @returns Date that starts the week your date parameter belongs to
   */
  weekRangeStartDate(date: Date | string, firstDayOfWeek: "Monday" | "Sunday") {
    date = typeof date === "string" ? this.stringToDate(date) : date;
    const firstDayIndex = firstDayOfWeek === "Monday" ? 1 : 0;
    const dayOfWeek = date.getDay();
    const daysFromStart = (dayOfWeek - firstDayIndex + 7) % 7;

    const startDate = new Date(date);
    startDate.setDate(date.getDate() - daysFromStart);
    return startDate;
  },

  /**
   * Takes a date and gives a readable format showing the range of the week that
   * date is in, starting with Monday or Sunday per the appSettings.
   * @param date Date object or string that falls on the week you want the range of
   * @param firstDayOfWeek String "Monday" or "Sunday"
   * @returns String showing week range, e.g. "Apr 6 - Apr 12, 2026"
   */
  getReadableWeekRangeString(
    date: Date | string,
    firstDayOfWeek: "Monday" | "Sunday",
  ) {
    date = typeof date === "string" ? this.stringToDate(date) : date;
    const startDate = dateUtils.weekRangeStartDate(date, firstDayOfWeek);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const startString = startDate.toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
    });
    const endString = endDate.toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${startString} - ${endString}`;
  },

  /**
   * Takes a date and returns a string with the full month and year
   * @param date Date object or string you want to get the month of
   * @returns String with month and year, e.g. "April 2026"
   */
  getReadableMonthString(date: Date | string): string {
    date = typeof date === "string" ? this.stringToDate(date) : date;
    return date.toLocaleDateString("en-CA", {
      month: "long",
      year: "numeric",
    });
  },

  /**
   * Takes a time string in 24 hour format and gives you
   * the total minutes into the day that time represents
   * @param timeString String representing 24 hour time, e.g. "14:00"
   * @returns Number of minutes since midnight for the time given, e.g. 840
   */
  militaryToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(":").map(Number) as [
      number,
      number,
    ];
    return hours * 60 + minutes;
  },

  /**
   * Takes a time string in 24 hour format and gives you
   * a string in standard time with AM or PM
   * @param timeString String representing 24 hour time, e.g. "14:00"
   * @returns String representing standard time, e.g. "2:00 PM"
   */
  militaryToStandard(timeString: string): string {
    const [hours, minutes] = timeString.split(":").map(Number) as [
      number,
      number,
    ];
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  },

  /**
   * Converts the current time of day into total minutes since midnight
   * @returns Number of minutes passed since 12:00 AM today
   */
  currentMinutesFromMidnight() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  },

  minutesPerDay: 24 * 60,
};

export default dateUtils;
