'use client';

import React, { memo, useState } from 'react';
import styles from '@/styles/calendar.module.css';
import { getHolidayForDate } from '@/data/holidays';

interface DayCellProps {
  day: number;
  month: number;
  year: number;
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isHoveredEnd: boolean;
  onClick: (date: Date) => void;
  onHover: (date: Date) => void;
}

const DayCell = memo(function DayCell({
  day,
  month,
  isCurrentMonth,
  isToday,
  isWeekend,
  isSelected,
  isInRange,
  isRangeStart,
  isRangeEnd,
  isHoveredEnd,
  date,
  onClick,
  onHover,
}: DayCellProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const holiday = isCurrentMonth ? getHolidayForDate(month, day) : undefined;

  const classNames = [
    styles.dayCell,
    !isCurrentMonth && styles.dayCellOtherMonth,
    isCurrentMonth && isWeekend && styles.dayCellWeekend,
    isToday && styles.dayCellToday,
    isSelected && styles.dayCellSelected,
    isInRange && !isSelected && styles.dayCellInRange,
    isRangeStart && isRangeEnd && styles.dayCellRangeStartEnd,
    isRangeStart && !isRangeEnd && styles.dayCellRangeStart,
    isRangeEnd && !isRangeStart && styles.dayCellRangeEnd,
    isHoveredEnd && !isSelected && styles.dayCellHoveredEnd,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      onClick={() => onClick(date)}
      onMouseEnter={() => {
        onHover(date);
        if (holiday) setShowTooltip(true);
      }}
      onMouseLeave={() => setShowTooltip(false)}
      aria-label={`${day} ${date.toLocaleDateString('en-US', { month: 'long' })} ${date.getFullYear()}${holiday ? ` - ${holiday.name}` : ''}`}
      tabIndex={isCurrentMonth ? 0 : -1}
      type="button"
    >
      {day}
      {holiday && (
        <span className={styles.holidayDot} aria-hidden="true">
          {holiday.emoji}
        </span>
      )}
      {holiday && showTooltip && (
        <span className={styles.holidayTooltip} role="tooltip">
          {holiday.emoji} {holiday.name}
        </span>
      )}
    </button>
  );
});

export default DayCell;
