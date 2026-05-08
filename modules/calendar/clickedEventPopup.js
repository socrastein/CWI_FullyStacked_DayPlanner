import "../../styling/clickedEventPopup.css";
import dateUtils from "../dateUtils";
import { showEventManager } from "../eventManager";

// Creates a popup for the event clicked that shows more info about it.
// Displays popup at position clicked

export function showClickedEventPopup(event) {
  const clickedEventPopup = document.getElementById("clickedEventPopup");

  document.getElementById("clickedEventPopupTitle").textContent = event.title;
  document.getElementById("clickedEventPopupTime").textContent =
    `${dateUtils.militaryToStandard(event.timeStart)} - ${dateUtils.militaryToStandard(event.timeEnd)}`;
  document.getElementById("clickedEventPopupDescriptionText").textContent =
    event.description;
  document.getElementById("clickedEventPopupAddressText").textContent =
    event.address;
  document.getElementById("editEventButton").onclick = () => {
    editClickedEventPopup(event);
  };
  document.addEventListener("click", isClickOutsideEvent);
  clickedEventPopup.style.display = "flex";
  clickedEventPopup.style.borderTopColor = `${event.color}`;
}

// Closes the event popup by clicking anywhere outside the popup
function isClickOutsideEvent(clickEvent) {
  const clickedEventPopup = document.getElementById("clickedEventPopup");
  if (!clickedEventPopup.contains(clickEvent.target)) {
    closeClickedEventPopup();
  }
}

function closeClickedEventPopup() {
  const clickedEventPopup = document.getElementById("clickedEventPopup");
  clickedEventPopup.style.display = "none";
  document.removeEventListener("click", isClickOutsideEvent);
}

// Will open the editor for the selected event
function editClickedEventPopup(event) {
  showEventManager(event.UID);
  closeClickedEventPopup();
}
