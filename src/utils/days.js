export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const DAYS_TRANSLATIONS = {
  en: {
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
    Sunday: 'Sunday',
  },
  fr: {
    Monday: 'Lundi',
    Tuesday: 'Mardi',
    Wednesday: 'Mercredi',
    Thursday: 'Jeudi',
    Friday: 'Vendredi',
    Saturday: 'Samedi',
    Sunday: 'Dimanche',
  }
};

/**
 * Returns today's day name in English (e.g., 'Monday')
 */
export function getCurrentDay() {
  const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday ...
  // Convert 0 (Sunday) to index 6, 1 (Monday) to index 0, etc.
  const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return DAYS_OF_WEEK[mappedIndex] || 'Monday';
}

/**
 * Returns localized day name
 */
export function getDayLabel(day, lang = 'en') {
  return DAYS_TRANSLATIONS[lang]?.[day] || day;
}
