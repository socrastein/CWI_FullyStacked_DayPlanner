import React from "react";
import appState from "./appState";
import CalendarEvent from "./classCalendarEvent";
import { getTimeSlot } from "./calendar/calendarContainer/tapToAddEvent";

type eventFormProps = {
  UID: string | null;
  onCancel: () => void;
  onDelete: (UID: any) => void;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
};

type SelectedRecurrence = "weekly" | "monthly" | "yearly";

export default function EventForm({
  UID,
  onCancel,
  onDelete,
  onSubmit,
}: eventFormProps) {
  // Form variables
  const title: string = UID ? "Edit Event" : "Add Event";

  // Pull the target event from appState if an event UID was provided.
  const targetEvent: CalendarEvent | undefined = UID
    ? appState.getEventByUID(UID)
    : undefined;

  const [isRecurring, setIsRecurring] = React.useState(
    Boolean(targetEvent && targetEvent.recurrence !== "none"),
  );

  const [selectedRecurrence, setSelectedRecurrence] =
    React.useState<SelectedRecurrence>(
      targetEvent?.recurrence && targetEvent.recurrence !== "none"
        ? targetEvent.recurrence
        : "weekly",
    );

  // Existing all-day events should stay all-day when edited.
  const isExistingAllDayEvent = Boolean(
    targetEvent?.UID?.startsWith("allDay-"),
  );

  const [isAllDay, setIsAllDay] = React.useState(isExistingAllDayEvent);

  return (
    <div
      id="eventPopupContainer"
      // Close form if user clicks outside of it.
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <form id="eventForm" className="bg-body" onSubmit={onSubmit}>
        <h2 id="eventFormTitle">{title}</h2>

        <div>
          <label htmlFor="eventTitle">
            Event Name <span className="text-danger">*</span>
          </label>

          <input
            type="text"
            id="eventTitle"
            name="title"
            defaultValue={targetEvent?.title}
            required
          />

          <input
            type="color"
            id="eventColor"
            name="color"
            defaultValue={targetEvent?.color ?? "#ffffff"}
            list="colorOptions"
            disabled={isAllDay}
          />

          <datalist id="colorOptions">
            <option value="#ffffff">White</option>
            <option value="#ff0000">Red</option>
            <option value="#00ff00">Green</option>
            <option value="#0000ff">Blue</option>
            <option value="#ffff00">Yellow</option>
            <option value="#ff00ff">Magenta</option>
            <option value="#00ffff">Cyan</option>
          </datalist>
        </div>

        <div>
          <div className="inputPair">
            <label htmlFor="eventDate">
              Date <span className="text-danger">*</span>
            </label>

            <input
              type="date"
              id="eventDate"
              name="date"
              defaultValue={targetEvent?.date ?? appState.dateView}
              required
            />
          </div>

          <div className="inputPair">
            <label htmlFor="eventStartTime">
              Start <span className="text-danger">*</span>
            </label>

            <input
              type="time"
              id="eventStartTime"
              name="timeStart"
              defaultValue={targetEvent?.timeStart ?? getTimeSlot()?.startTime}
              step={900}
              required={!isAllDay}
              disabled={isAllDay}
            />
          </div>

          <div className="inputPair">
            <label htmlFor="eventEndTime">
              End <span className="text-danger">*</span>
            </label>

            <input
              type="time"
              id="eventEndTime"
              name="timeEnd"
              defaultValue={targetEvent?.timeEnd ?? getTimeSlot()?.endTime}
              step={900}
              required={!isAllDay}
              disabled={isAllDay}
            />
          </div>
        </div>

        <div id="recurringEventContainer">
          <label htmlFor="isRecurringEvent">
            <input
              type="checkbox"
              id="isRecurringEvent"
              name="isRecurring"
              checked={isRecurring}
              onChange={(event) => setIsRecurring(event.target.checked)}
            />
            Recurring event
          </label>

          {isRecurring && (
            <div id="recurrenceOptionsContainer">
              <label htmlFor="eventRecurrence">Repeat</label>

              <select
                id="eventRecurrence"
                name="recurrence"
                value={selectedRecurrence}
                onChange={(event) =>
                  setSelectedRecurrence(
                    event.target.value as SelectedRecurrence,
                  )
                }
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              {selectedRecurrence === "weekly" && (
                <fieldset id="eventRecurrenceDays">
                  <legend>Repeat Days</legend>

                  <label>
                    <input
                      type="checkbox"
                      name="recurrenceDays"
                      value="SU"
                      defaultChecked={targetEvent?.recurrenceDays?.includes(
                        "SU",
                      )}
                    />{" "}
                    Sunday
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      name="recurrenceDays"
                      value="MO"
                      defaultChecked={targetEvent?.recurrenceDays?.includes(
                        "MO",
                      )}
                    />{" "}
                    Monday
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      name="recurrenceDays"
                      value="TU"
                      defaultChecked={targetEvent?.recurrenceDays?.includes(
                        "TU",
                      )}
                    />{" "}
                    Tuesday
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      name="recurrenceDays"
                      value="WE"
                      defaultChecked={targetEvent?.recurrenceDays?.includes(
                        "WE",
                      )}
                    />{" "}
                    Wednesday
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      name="recurrenceDays"
                      value="TH"
                      defaultChecked={targetEvent?.recurrenceDays?.includes(
                        "TH",
                      )}
                    />{" "}
                    Thursday
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      name="recurrenceDays"
                      value="FR"
                      defaultChecked={targetEvent?.recurrenceDays?.includes(
                        "FR",
                      )}
                    />{" "}
                    Friday
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      name="recurrenceDays"
                      value="SA"
                      defaultChecked={targetEvent?.recurrenceDays?.includes(
                        "SA",
                      )}
                    />{" "}
                    Saturday
                  </label>
                </fieldset>
              )}
            </div>
          )}
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="allDay"
            name="allDay"
            checked={isAllDay}
            disabled={isExistingAllDayEvent}
            onChange={(event) =>
              setSelectedRecurrence(event.target.value as SelectedRecurrence)
            }
          />

          <label className="form-check-label" htmlFor="allDay">
            All-Day
          </label>
        </div>

        <label htmlFor="eventAddress">Address</label>

        <input
          type="text"
          id="eventAddress"
          name="address"
          autoComplete="street-address"
          defaultValue={targetEvent?.address}
        />

        <label htmlFor="eventDescription">Description</label>

        <textarea
          id="eventDescription"
          name="description"
          defaultValue={targetEvent?.description}
          rows={3}
          cols={50}
        />

        <div id="eventFormButtonsContainer">
          <button type="submit" className="btn btn-success btn-sm">
            Save
          </button>

          <button
            type="button"
            className="btn btn-sm"
            onClick={onCancel}
            id="cancelEventButton"
          >
            Cancel
          </button>

          {UID ? (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(UID)}
              id="deleteEventButton"
            >
              Delete
            </button>
          ) : undefined}
        </div>
      </form>
    </div>
  );
}
