


export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const getPastDates = (count: number): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  return dates;
};

export const getPastWeeks = (count: number): string[] => {
  const weeks: string[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() - i * 7); // week starts on Sunday
    weeks.push(formatDate(weekStart));
  }
  return weeks;
};

export const getPastMonths = (count: number): string[] => {
  const months: string[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(formatDate(monthStart));
  }
  return months;
};