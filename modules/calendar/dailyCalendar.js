"use strict";
import dateUtils from "../dateUtils";
import { showEventManager } from "../eventManager";

// Assigns a lane to each event based on the duration of the event and the other events that are happening at the same time.
export function assignLanesForEvents(events) {
  const assignedLanes = new Map();
  // Inline functions to calculate the duration and tranlsate time strings to minutes
  const durationMinutes = (event) =>
    dateUtils.militaryToMinutes(event.timeEnd) -
    dateUtils.militaryToMinutes(event.timeStart);
  const startMinutes = (event) => dateUtils.militaryToMinutes(event.timeStart);
  // Sort the events by duration and start time
  const sortedEvents = [...events].sort(
    (event1, event2) =>
      durationMinutes(event2) - durationMinutes(event1) ||
      startMinutes(event1) - startMinutes(event2),
  );

  // Loop through the sortedevents and assign a lane to each event
  sortedEvents.forEach((event) => {
    const eventStart = dateUtils.militaryToMinutes(event.timeStart);
    const eventEnd = dateUtils.militaryToMinutes(event.timeEnd);
    const usedLanes = new Set();
    // Loop through the other events and add the lane of the other event to the used lanes set if it overlaps with the current event
    events.forEach((otherEvent) => {
      if (otherEvent.UID === event.UID || !assignedLanes.has(otherEvent.UID))
        return;
      const otherStart = dateUtils.militaryToMinutes(otherEvent.timeStart);
      const otherEnd = dateUtils.militaryToMinutes(otherEvent.timeEnd);
      const overlaps = eventStart < otherEnd && eventEnd > otherStart;
      if (overlaps) usedLanes.add(assignedLanes.get(otherEvent.UID));
    });

    // Find the lowest available lane
    let lowestAvailableLane = 0;
    while (usedLanes.has(lowestAvailableLane)) {
      lowestAvailableLane++;
    }

    // Set the lane of the event (the key is the event UID and the value is the lane)
    assignedLanes.set(event.UID, lowestAvailableLane);
  });

  return assignedLanes;
}

// Calculates the total number of concurrent events overlapping the given event's time range.
export function calculateTotalConcurrentEvents(event, events) {
  const eventStart = dateUtils.militaryToMinutes(event.timeStart);
  const eventEnd = dateUtils.militaryToMinutes(event.timeEnd);
  // Filter the events to only include events that overlap with the given event's time range
  const concurrentEvents = events.filter((other) => {
    const otherStart = dateUtils.militaryToMinutes(other.timeStart);
    const otherEnd = dateUtils.militaryToMinutes(other.timeEnd);
    return eventStart < otherEnd && eventEnd > otherStart;
  });
  // If there are no concurrent events, return 1
  if (concurrentEvents.length === 0) return 1;

  // Create an array of points (time and delta)
  const points = [];
  // Loop through the concurrent events and add the start and end points to the points array
  concurrentEvents.forEach((concurrentEvent) => {
    points.push({
      time: dateUtils.militaryToMinutes(concurrentEvent.timeStart),
      delta: 1,
    });
    points.push({
      time: dateUtils.militaryToMinutes(concurrentEvent.timeEnd),
      delta: -1,
    });
  });

  // Sort the points by time
  points.sort(
    (point1, point2) =>
      point1.time - point2.time || point1.delta - point2.delta,
  );

  // Count the number of concurrent events
  let count = 0;
  // Find the maximum number of concurrent events
  let maxCount = 0;
  points.forEach((point) => {
    count += point.delta;
    maxCount = Math.max(maxCount, count);
  });
  return Math.max(1, maxCount);
}
