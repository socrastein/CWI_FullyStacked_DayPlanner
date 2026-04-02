import { useEffectEvent, useEffect } from "react";
import { applyCalendarNavigation } from "./use-calendar-nav-button";

/**
 * A hook that navigates the calendar with the arrow keys.
 * @param onAfterRender - Function to call when the navigation is complete.
 */
export const useNavigateWithArrows = (onAfterRender: () => void) => {
  // https://react.dev/reference/react/useEffectEvent
  // useEffectEvent (React 19): wraps logic you will run later (here: when a key is pressed).
  // Each time that logic runs, it sees the latest props/state (for example, the current `onRender`)
  // without listing them in the useEffect dependency array below. That lets us keep the
  // keyboard listener registered only once while still always calling the parent's
  // newest refresh callback after stepping the date.
  const handleArrowStep = useEffectEvent(
    (delta: number, onAfterRender: () => void) => {
      applyCalendarNavigation(delta); // Apply the navigation.
      onAfterRender(); // Call the function that will refresh the calendar.
    },
  );

  // https://react.dev/reference/react/useEffect
  // useEffect: runs after this component is shown on screen. Use it for setup that talks
  // to the outside world (here: `window` keyboard events) and return a cleanup function
  // to undo that setup when the component is removed or before the effect re-runs.
  // We use an empty dependency array so this subscribe/unsubscribe pair runs once per mount.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (shouldNotAllowKeyNav(event.target)) return;
      event.preventDefault();
      handleArrowStep(event.key === "ArrowLeft" ? -1 : 1, onAfterRender); // Call the function that will handle the navigation.
    };

    window.addEventListener("keydown", onKeyDown); // Register the keyboard listener.
    return () => window.removeEventListener("keydown", onKeyDown); // Unregister the keyboard listener.
  }, []);
};

function shouldNotAllowKeyNav(target: EventTarget | null): boolean {
  // If the target is not a regular HTML element, return false.
  if (!(target instanceof HTMLElement)) return false;

  const tag = target.tagName.toLowerCase();
  // If the tag is an input or another form element, return true.
  if (tag === "input" || tag === "textarea" || tag === "select") return true;

  // If the target is content editable, return true. This is to prevent the calendar navigation buttons from being focused when the user is typing in an input or textarea.
  return target.isContentEditable;
}
