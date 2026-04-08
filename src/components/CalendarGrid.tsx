'use client';

import React from 'react';
import styles from '@/styles/calendar.module.css';
import DayCell from './DayCell';
import type { CalendarDay } from '@/hooks/useCalendar';

interface CalendarGridProps {
  days: CalendarDay[];
  currentMonth: number;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date) => void;
  isStartDate: (date: Date) => boolean;
  isEndDate: (date: Date) => boolean;
  isDateInRange: (date: Date) => boolean;
  isHoveredEnd: (date: Date) => boolean;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({
  days,
  currentMonth,
  onDateClick,
  onDateHover,
  isStartDate,
  isEndDate,
  isDateInRange,
  isHoveredEnd,
}: CalendarGridProps) {
  return (
    <div className={styles.calendarGrid} role="grid" aria-label="Calendar dates">
      {/* Weekday Headers */}
      <div className={styles.weekdayHeader} role="row">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`${styles.weekdayLabel} ${i === 0 || i === 6 ? styles.weekdayLabelWeekend : ''}`}
            role="columnheader"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className={styles.daysGrid} role="rowgroup">
        {days.map((day) => {
          const isStart = isStartDate(day.date);
          const isEnd = isEndDate(day.date);
          const inRange = isDateInRange(day.date);
          const hovered = isHoveredEnd(day.date);

          return (
            <DayCell
              key={day.date.toISOString()}
              day={day.day}
              month={currentMonth}
              year={day.year}
              date={day.date}
              isCurrentMonth={day.isCurrentMonth}
              isToday={day.isToday}
              isWeekend={day.isWeekend}
              isSelected={isStart || isEnd}
              isInRange={inRange}
              isRangeStart={isStart}
              isRangeEnd={isEnd}
              isHoveredEnd={hovered}
              onClick={onDateClick}
              onHover={onDateHover}
            />
          );
        })}
      </div>
    </div>
  );
}
