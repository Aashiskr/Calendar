'use client';

import { useState, useCallback, useMemo } from 'react';

export interface CalendarDay {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  dayOfWeek: number;
}

export function useCalendar(initialDate?: Date) {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(() => {
    const d = initialDate || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToMonth = useCallback((month: number, year: number) => {
    setCurrentDate(new Date(year, month, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }, [today]);

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentYear, currentMonth]);

  const calendarDays: CalendarDay[] = useMemo(() => {
    const days: CalendarDay[] = [];

    // Previous month trailing days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      days.push({
        date,
        day,
        month: currentMonth - 1,
        year: currentMonth === 0 ? currentYear - 1 : currentYear,
        isCurrentMonth: false,
        isToday: isSameDate(date, today),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        dayOfWeek: date.getDay(),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        date,
        day,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isToday: isSameDate(date, today),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        dayOfWeek: date.getDay(),
      });
    }

    // Next month leading days
    const remainingCells = 42 - days.length; // 6 rows * 7 columns
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      days.push({
        date,
        day,
        month: currentMonth + 1,
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
        isCurrentMonth: false,
        isToday: isSameDate(date, today),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        dayOfWeek: date.getDay(),
      });
    }

    return days;
  }, [currentYear, currentMonth, daysInMonth, firstDayOfMonth, today]);

  // Only show 5 rows if possible
  const visibleDays = useMemo(() => {
    const lastRow = calendarDays.slice(35);
    const hasCurrentMonthInLastRow = lastRow.some(d => d.isCurrentMonth);
    return hasCurrentMonthInLastRow ? calendarDays : calendarDays.slice(0, 35);
  }, [calendarDays]);

  const monthLabel = useMemo(() => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  return {
    currentMonth,
    currentYear,
    calendarDays: visibleDays,
    daysInMonth,
    firstDayOfMonth,
    monthLabel,
    goToNextMonth,
    goToPrevMonth,
    goToMonth,
    goToToday,
    today,
  };
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
