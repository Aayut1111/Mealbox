export function getWeekDates(startDate = new Date()) {
  const day = startDate.getDay(); // 0 = Sunday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(startDate);
  monday.setDate(startDate.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

export function formatDayLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}