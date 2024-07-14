export default function datesBetween(startDate: string, endDate: string, intervalMinutes: number): string[] {
  const timestamps: string[] = [];
  let currentDate: Date = new Date(startDate);
  const end: Date = new Date(endDate);
  const intervalMilliseconds: number = intervalMinutes * 60 * 1000;

  while (currentDate <= end) {
    timestamps.push(currentDate.toISOString());
    currentDate = new Date(currentDate.getTime() + intervalMilliseconds);
  }

  return timestamps;
}
