export function formatDisplayDate(
  year: number | null,
  month: number | null,
  day: number | null,
): string {
  if (!year && !month && !day) return "Chưa rõ";

  const parts = [];
  if (day) parts.push(day.toString().padStart(2, "0"));
  if (month) parts.push(month.toString().padStart(2, "0"));
  if (year) parts.push(year.toString());

  return parts.join("/");
}
