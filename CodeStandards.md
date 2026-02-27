# CWI Planner Code Standards

## CalendarEvent Object Shape

All calendar events must follow this structure. Any code that creates or modifies events needs to use these exact property names and string formats so everything works correctly with `StorageManager` and any other parts of the app that use or modify events.

```javascript
{
  UID: string,         // Unique identifier created with generateUID()
  date: string,        // YYYY-MM-DD format, e.g. "2025-04-15"
  timeStart: string,   // 24 hr time, e.g. "14:30" - use 15 minute increments
  timeEnd: string,     // 24 hr time, e.g. "15:00" - use 15 minute increments
  title: string,       // Display name of the event
  description: string, // Additional details about the event
  address: string,     // Location of the event
  color: string        // Hex code, e.g. "#ff5733"
}
```

`StorageManager` uses `UID` in the storage key, so every event must have a unique `UID`. I've created a UIDGenerator module with a generateUID() function that you can import to use in any code that creates new calendar events.

---

## Comments

Please comment your code. This project has contributors at different experience levels, so comments explaining _what the code does_ are encouraged. When in doubt, over-comment.

**Good example:**

```javascript
// Loop through each event and add it to the calendar display
events.forEach((event) => {
  renderEvent(event);
});
```

JSDoc comments are especially appreciated on functions as you can specify the parameters and return types.

```javascript
/**
 * Returns all events for a given date.
 * @param {string} date - Date string in "YYYY-MM-DD" format
 * @returns {CalendarEvent[]} Array of events on that date
 */
function getEventsByDate(date) { ... }
```

---

## Formatting

I strongly suggest installing the `Prettier` code formatting extension on your IDE.

VSCode has a `>Format Document` command in the command palette. The first time you use it, it may ask you to designate a default formatter: you can select Prettier if you have it installed.

I have format document bound to `shift+alt+f` so I can easily clean up and standardize the files I'm working on. If everyone is using it on files they submit, then the whole codebase stays consistent and readable.

## Naming Conventions

- Variables and functions: `camelCase`
- CSS classes: `kebab-case`

---

## Understand Everything You Submit

We're here to learn and grow, so don't `copy + paste` code from a website or LLM output that you don't understand. I expect that you can explain what your code is doing and how.

---

_More standards may be added as the project develops. I'll let everyone know in Discord if I update this._
