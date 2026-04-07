import appState from "./appState";
import CalendarEvent from "./classCalendarEvent";

function getDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const mockEvents = [
  // Today
  {
    date: getDate(0),
    timeStart: "08:00",
    timeEnd: "08:30",
    title: "Morning Standup",
    description:
      "Daily sync with the engineering team. Review blockers and sprint progress.",
    color: "#4A90D9",
  },
  {
    date: getDate(0),
    timeStart: "09:00",
    timeEnd: "10:30",
    title: "Q2 Planning Session",
    description:
      "Roadmap review and priority alignment with product and design leads.",
    color: "#7B68EE",
  },
  {
    date: getDate(0),
    timeStart: "11:00",
    timeEnd: "11:45",
    title: "1:1 with Manager",
    description:
      "Weekly check-in. Discuss career goals and current project status.",
    color: "#E8A838",
  },
  {
    date: getDate(0),
    timeStart: "12:30",
    timeEnd: "13:15",
    title: "Lunch with Sarah",
    description:
      "Catch up over lunch at the new place on 5th. Discuss the design collab.",
    color: "#50C878",
  },
  {
    date: getDate(0),
    timeStart: "14:00",
    timeEnd: "15:00",
    title: "Code Review",
    description:
      "Review PRs for the authentication refactor. Focus on the token refresh logic.",
    color: "#FF6B6B",
  },
  {
    date: getDate(0),
    timeStart: "15:30",
    timeEnd: "16:00",
    title: "Deploy to Staging",
    description:
      "Push the v2.4 release candidate to staging and run smoke tests.",
    color: "#20B2AA",
  },
  {
    date: getDate(0),
    timeStart: "17:00",
    timeEnd: "18:00",
    title: "Gym — Leg Day",
    description:
      "Squats, lunges, leg press. Don't skip the stretching this time.",
    color: "#FF8C00",
  },

  // Tomorrow
  {
    date: getDate(1),
    timeStart: "08:30",
    timeEnd: "09:00",
    title: "Morning Standup",
    description:
      "Daily sync with the engineering team. Review blockers and sprint progress.",
    color: "#4A90D9",
  },
  {
    date: getDate(1),
    timeStart: "09:30",
    timeEnd: "11:00",
    title: "Client Presentation",
    description:
      "Present the new dashboard prototype to the Acme Corp stakeholders.",
    color: "#C71585",
  },
  {
    date: getDate(1),
    timeStart: "11:15",
    timeEnd: "12:00",
    title: "Debrief — Acme Presentation",
    description:
      "Internal debrief after the client call. Document feedback and next steps.",
    color: "#7B68EE",
  },
  {
    date: getDate(1),
    timeStart: "13:00",
    timeEnd: "14:00",
    title: "Lunch & Learn: AI Tools",
    description:
      "Team session on integrating AI-assisted workflows into the dev cycle.",
    color: "#50C878",
  },
  {
    date: getDate(1),
    timeStart: "14:30",
    timeEnd: "15:30",
    title: "Bug Bash",
    description:
      "Team-wide effort to triage and close out P1/P2 bugs before the release.",
    color: "#FF6B6B",
  },
  {
    date: getDate(1),
    timeStart: "16:00",
    timeEnd: "16:30",
    title: "Dentist Appointment",
    description:
      "Annual cleaning at Riverside Dental. Arrive 10 minutes early for paperwork.",
    color: "#E8A838",
  },
  {
    date: getDate(1),
    timeStart: "19:00",
    timeEnd: "21:00",
    title: "Book Club",
    description:
      "Discussing chapters 10–18 of 'The Midnight Library'. Hosted at Marcus's place.",
    color: "#FF8C00",
  },

  // Day after tomorrow
  {
    date: getDate(2),
    timeStart: "07:30",
    timeEnd: "08:30",
    title: "Morning Run",
    description: "5K loop through the park. Aim for sub-28 minutes.",
    color: "#20B2AA",
  },
  {
    date: getDate(2),
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Architecture Review",
    description:
      "Review the proposed microservices split with the platform team.",
    color: "#4A90D9",
  },
  {
    date: getDate(2),
    timeStart: "10:30",
    timeEnd: "11:30",
    title: "Interview — Frontend Engineer",
    description:
      "Technical screen with candidate for the senior frontend role. Focus on React/TypeScript.",
    color: "#C71585",
  },
  {
    date: getDate(2),
    timeStart: "13:00",
    timeEnd: "13:30",
    title: "Monthly Expenses Review",
    description:
      "Go through March spending, reconcile receipts, and update the budget sheet.",
    color: "#E8A838",
  },
  {
    date: getDate(2),
    timeStart: "14:00",
    timeEnd: "15:30",
    title: "Deep Work Block",
    description:
      "Focused time to finish the notification service. No meetings, no Slack.",
    color: "#7B68EE",
  },
  {
    date: getDate(2),
    timeStart: "18:00",
    timeEnd: "20:00",
    title: "Dinner — Mom's Birthday",
    description:
      "Birthday dinner at Carmine's. Don't forget to pick up the cake beforehand.",
    color: "#50C878",
  },
];

function createMockEvents() {
  return mockEvents.map((props) => new CalendarEvent(props));
}

function registerCheatCode(callback, key = "F2", times = 3, timeout = 2000) {
  let presses = 0;
  let timer = null;

  window.addEventListener("keydown", (e) => {
    if (e.key !== key) return;

    presses++;
    clearTimeout(timer);

    if (presses >= times) {
      callback();
      presses = 0;
      return;
    }

    timer = setTimeout(() => {
      presses = 0;
    }, timeout);
  });
}

export { createMockEvents, registerCheatCode };
