import generateUID from "./UIDGenerator";

type RecurrenceType = "none" | "weekly" | "monthly" | "yearly";

type RecurrenceDay = "SU" | "MO" | "TU" | "WE" | "TH" | "FR" | "SA";

interface CalendarEventOptions {
  UID?: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  title: string;
  description?: string | undefined;
  address?: string | undefined;
  color?: string | undefined;
  recurrence?: RecurrenceType;
  recurrenceDays?: RecurrenceDay[];
  exceptions?: string[];
}

/**
 * Event class represents a calendar event and includes validation for date and time formats.
 */
export default class CalendarEvent {
  #UID: string;
  #date!: string;
  #timeStart!: string;
  #timeEnd!: string;
  #title!: string;
  #description: string | undefined;
  #address: string | undefined;
  #color: string | undefined;
  #recurrence: RecurrenceType = "none";
  #recurrenceDays: RecurrenceDay[] = [];
  #exceptions: string[] = [];

  constructor({
    UID,
    date,
    timeStart,
    timeEnd,
    title,
    description,
    address,
    color,
    recurrence,
    recurrenceDays = [],
    exceptions = [],
  }: CalendarEventOptions) {
    if (!date || !timeStart || !timeEnd || !title) {
      throw new Error(
        "Event construction error: date, timeStart, timeEnd, and title fields are required.",
      );
    }

    this.#UID = UID ?? generateUID();

    this.date = date;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    validateTimeOrder(timeStart, timeEnd);

    this.title = title;
    this.description = description;
    this.address = address;
    this.color = color;
    this.recurrence = recurrence ?? "none";
    this.recurrenceDays = recurrenceDays;
    this.#exceptions = exceptions;
  }

  get UID(): string {
    return this.#UID;
  }

  get length(): number {
    const [startHour, startMinute] = this.timeStart.split(":").map(Number) as [
      number,
      number,
    ];
    const [endHour, endMinute] = this.timeEnd.split(":").map(Number) as [
      number,
      number,
    ];

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    return endTotalMinutes - startTotalMinutes;
  }

  get date(): string {
    return this.#date;
  }

  set date(newDate: string) {
    validateDate(newDate);
    this.#date = newDate;
  }

  get timeStart(): string {
    return this.#timeStart;
  }

  set timeStart(newStart: string) {
    validateTime(newStart);

    if (this.#timeEnd !== undefined) {
      validateTimeOrder(newStart, this.#timeEnd);
    }

    this.#timeStart = newStart;
  }

  get timeEnd(): string {
    return this.#timeEnd;
  }

  set timeEnd(newEnd: string) {
    validateTime(newEnd);

    if (this.#timeStart !== undefined) {
      validateTimeOrder(this.#timeStart, newEnd);
    }

    this.#timeEnd = newEnd;
  }

  get title(): string {
    return this.#title;
  }

  set title(newTitle: string) {
    validateStringProperty(newTitle, "title");
    this.#title = newTitle;
  }

  get description(): string | undefined {
    return this.#description;
  }

  set description(newDescription: string | undefined) {
    validateStringProperty(newDescription, "description");
    this.#description = newDescription;
  }

  get address(): string | undefined {
    return this.#address;
  }

  set address(newAddress: string | undefined) {
    validateStringProperty(newAddress, "address");
    this.#address = newAddress;
  }

  get color(): string | undefined {
    return this.#color;
  }

  set color(newColor: string | undefined) {
    validateColor(newColor);
    this.#color = newColor;
  }

  get recurrence(): RecurrenceType {
    return this.#recurrence;
  }

  set recurrence(newRecurrence: RecurrenceType) {
    validateRecurrence(newRecurrence);
    this.#recurrence = newRecurrence;
  }

  get recurrenceDays(): RecurrenceDay[] {
    return this.#recurrenceDays;
  }

  set recurrenceDays(newRecurrenceDays: RecurrenceDay[]) {
    validateRecurrenceDays(newRecurrenceDays);
    this.#recurrenceDays = newRecurrenceDays;
  }

  get exceptions(): string[] {
    return this.#exceptions;
  }

  addException(date: string): void {
    validateDate(date);

    if (!this.#exceptions.includes(date)) {
      this.#exceptions.push(date);
    }
  }

  removeException(date: string): void {
    this.#exceptions = this.#exceptions.filter((d) => d !== date);
  }

  toJSON(): CalendarEventOptions {
    return {
      UID: this.#UID,
      date: this.#date,
      timeStart: this.#timeStart,
      timeEnd: this.#timeEnd,
      title: this.#title,
      description: this.#description,
      address: this.#address,
      color: this.#color,
      recurrence: this.#recurrence,
      recurrenceDays: this.#recurrenceDays,
      exceptions: this.#exceptions,
    };
  }
}

function validateDate(date: string): void {
  if (isNaN(Date.parse(date))) {
    throw new Error(`Event assignment error: invalid date format ${date}`);
  }

  const dateRegex = /^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  if (!dateRegex.test(date)) {
    throw new Error(
      `Event assignment error: date string ${date} is not in "YYYY-MM-DD" format.`,
    );
  }
}

function validateTime(time: string): void {
  const timeRegex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;

  if (!timeRegex.test(time)) {
    throw new Error(
      `Event assignment error: time string ${time} is not in 24-hour format (HH:MM).`,
    );
  }

  const minutes = time.split(":")[1] as string;

  if (!["00", "15", "30", "45"].includes(minutes)) {
    throw new Error(
      `Event assignment error: time string ${time} has invalid minutes. Minutes must be in 15 minute increments (00, 15, 30, 45).`,
    );
  }
}

function validateTimeOrder(timeStart: string, timeEnd: string): boolean {
  const [startHour, startMinute] = timeStart.split(":").map(Number) as [
    number,
    number,
  ];
  const [endHour, endMinute] = timeEnd.split(":").map(Number) as [
    number,
    number,
  ];

  if (
    endHour < startHour ||
    (endHour === startHour && endMinute <= startMinute)
  ) {
    throw new Error(
      `Event assignment error: timeEnd ${timeEnd} must be after timeStart ${timeStart}.`,
    );
  }

  return true;
}

function validateStringProperty(
  prop: string | undefined,
  propName: string,
): void {
  if (propName === "title") {
    if (typeof prop !== "string") {
      throw new Error(
        `Event assignment error: ${propName} must be a string. Received type ${typeof prop}.`,
      );
    }

    return;
  }

  if (typeof prop !== "string" && typeof prop !== "undefined") {
    throw new Error(
      `Event assignment error: ${propName} must be a string. Received type ${typeof prop}.`,
    );
  }
}

function validateColor(color: string | undefined): void {
  if (color === undefined) return;

  if (typeof color !== "string") {
    throw new Error(
      `Event assignment error: color must be a string. Received type ${typeof color}.`,
    );
  }

  const testEl = document.createElement("div");
  testEl.style.color = color;

  if (testEl.style.color === "") {
    throw new Error(
      `Event assignment error: "${color}" is not a valid CSS color.`,
    );
  }
}

function validateRecurrence(recurrence: RecurrenceType): void {
  const validRecurrenceOptions: RecurrenceType[] = [
    "none",
    "weekly",
    "monthly",
    "yearly",
  ];

  if (!validRecurrenceOptions.includes(recurrence)) {
    throw new Error(
      `Event assignment error: recurrence must be one of: ${validRecurrenceOptions.join(", ")}.`,
    );
  }
}

function validateRecurrenceDays(recurrenceDays: RecurrenceDay[]): void {
  if (!Array.isArray(recurrenceDays)) {
    throw new Error("Event assignment error: recurrenceDays must be an array.");
  }

  const validDayOptions: RecurrenceDay[] = [
    "SU",
    "MO",
    "TU",
    "WE",
    "TH",
    "FR",
    "SA",
  ];

  recurrenceDays.forEach((day) => {
    if (!validDayOptions.includes(day)) {
      throw new Error(
        `Event assignment error: ${day} is not a valid recurrence day.`,
      );
    }
  });
}
