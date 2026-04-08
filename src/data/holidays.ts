export interface Holiday {
  date: string; // MM-DD format
  name: string;
  type: 'national' | 'international' | 'observance';
  emoji: string;
}

export const holidays: Holiday[] = [
  // January
  { date: '01-01', name: 'New Year\'s Day', type: 'international', emoji: '🎉' },
  { date: '01-14', name: 'Makar Sankranti', type: 'national', emoji: '🪁' },
  { date: '01-26', name: 'Republic Day', type: 'national', emoji: '🇮🇳' },

  // February
  { date: '02-14', name: 'Valentine\'s Day', type: 'international', emoji: '❤️' },

  // March
  { date: '03-08', name: 'International Women\'s Day', type: 'international', emoji: '👩' },
  { date: '03-17', name: 'Holi', type: 'national', emoji: '🎨' },

  // April
  { date: '04-14', name: 'Ambedkar Jayanti', type: 'national', emoji: '📘' },
  { date: '04-22', name: 'Earth Day', type: 'international', emoji: '🌍' },

  // May
  { date: '05-01', name: 'Labour Day', type: 'international', emoji: '⚒️' },
  { date: '05-11', name: 'Mother\'s Day', type: 'international', emoji: '💐' },

  // June
  { date: '06-05', name: 'World Environment Day', type: 'international', emoji: '🌱' },
  { date: '06-15', name: 'Father\'s Day', type: 'international', emoji: '👔' },
  { date: '06-21', name: 'Yoga Day', type: 'national', emoji: '🧘' },

  // July
  { date: '07-04', name: 'Independence Day (US)', type: 'international', emoji: '🇺🇸' },

  // August
  { date: '08-15', name: 'Independence Day', type: 'national', emoji: '🇮🇳' },
  { date: '08-19', name: 'Janmashtami', type: 'national', emoji: '🪈' },

  // September
  { date: '09-05', name: 'Teachers\' Day', type: 'national', emoji: '📚' },

  // October
  { date: '10-02', name: 'Gandhi Jayanti', type: 'national', emoji: '🕊️' },
  { date: '10-12', name: 'Dussehra', type: 'national', emoji: '🏹' },
  { date: '10-31', name: 'Halloween', type: 'international', emoji: '🎃' },

  // November
  { date: '11-01', name: 'Diwali', type: 'national', emoji: '🪔' },
  { date: '11-14', name: 'Children\'s Day', type: 'national', emoji: '👧' },

  // December
  { date: '12-25', name: 'Christmas', type: 'international', emoji: '🎄' },
  { date: '12-31', name: 'New Year\'s Eve', type: 'international', emoji: '🥂' },
];

export function getHolidaysForMonth(month: number): Holiday[] {
  const monthStr = String(month + 1).padStart(2, '0');
  return holidays.filter(h => h.date.startsWith(monthStr));
}

export function getHolidayForDate(month: number, day: number): Holiday | undefined {
  const dateStr = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return holidays.find(h => h.date === dateStr);
}
