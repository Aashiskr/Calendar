'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import styles from '@/styles/calendar.module.css';

interface MonthNavigationProps {
  monthLabel: string;
  currentMonth: number;
  currentYear: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onMonthSelect: (month: number, year: number) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

export default function MonthNavigation({
  monthLabel,
  currentMonth,
  currentYear,
  onPrev,
  onNext,
  onToday,
  onMonthSelect,
}: MonthNavigationProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(currentYear);

  const handleOpenPicker = () => {
    setPickerYear(currentYear);
    setShowPicker(true);
  };

  const handleMonthClick = (month: number) => {
    onMonthSelect(month, pickerYear);
    setShowPicker(false);
  };

  return (
    <>
      <nav className={styles.monthNav} aria-label="Month navigation">
        <span
          className={styles.monthNavLabel}
          onClick={handleOpenPicker}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleOpenPicker()}
          aria-label={`${monthLabel}. Click to select month and year.`}
        >
          {monthLabel}
        </span>

        <div className={styles.navButtons}>
          <button
            className={styles.navBtn}
            onClick={onPrev}
            aria-label="Previous month"
            type="button"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className={styles.navBtn}
            onClick={onNext}
            aria-label="Next month"
            type="button"
          >
            <ChevronRight size={18} />
          </button>
          <button
            className={styles.todayBtn}
            onClick={onToday}
            aria-label="Go to today"
            type="button"
          >
            <CalendarDays size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Today
          </button>
        </div>
      </nav>

      {/* Month/Year Picker Modal */}
      {showPicker && (
        <div
          className={styles.pickerOverlay}
          onClick={() => setShowPicker(false)}
          role="dialog"
          aria-label="Select month and year"
        >
          <div
            className={styles.pickerModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.pickerTitle}>Select Month & Year</h3>

            {/* Year Selector */}
            <div className={styles.yearSelector}>
              <button
                className={styles.navBtn}
                onClick={() => setPickerYear(prev => prev - 1)}
                aria-label="Previous year"
                type="button"
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.yearLabel}>{pickerYear}</span>
              <button
                className={styles.navBtn}
                onClick={() => setPickerYear(prev => prev + 1)}
                aria-label="Next year"
                type="button"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Month Grid */}
            <div className={styles.monthGrid}>
              {MONTH_NAMES.map((name, index) => (
                <button
                  key={name}
                  className={`${styles.monthPickerBtn} ${
                    index === currentMonth && pickerYear === currentYear
                      ? styles.monthPickerBtnActive
                      : ''
                  }`}
                  onClick={() => handleMonthClick(index)}
                  type="button"
                >
                  {name.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
