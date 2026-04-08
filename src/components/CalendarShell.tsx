'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/calendar.module.css';
import { useCalendar } from '@/hooks/useCalendar';
import { useRangeSelection } from '@/hooks/useRangeSelection';
import { useNotes } from '@/hooks/useNotes';
import { useTheme } from '@/hooks/useTheme';
import { getSeason } from '@/data/monthData';
import HeroImage from './HeroImage';
import MonthNavigation from './MonthNavigation';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import ThemeSwitcher from './ThemeSwitcher';
import SelectionSummary from './SelectionSummary';
import CalAIChatbot from './CalAIChatbot';

const SPIRAL_COUNT = 15;

export default function CalendarShell() {
  const {
    currentMonth,
    currentYear,
    calendarDays,
    monthLabel,
    goToNextMonth,
    goToPrevMonth,
    goToMonth,
    goToToday,
  } = useCalendar();

  const {
    range,
    selectionState,
    handleDateClick,
    handleDateHover,
    clearSelection,
    isDateInRange,
    isStartDate,
    isEndDate,
    isHoveredEnd,
    getRangeLabel,
  } = useRangeSelection();

  const {
    getNotesForMonth,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const { theme, toggleTheme, setSeasonalAccent } = useTheme();

  // direction for page flip
  const [direction, setDirection] = useState(0);
  const prevMonthRef = useRef(currentMonth);

  useEffect(() => {
    if (currentMonth !== prevMonthRef.current) {
      setDirection(currentMonth > prevMonthRef.current ? 1 : -1);
      prevMonthRef.current = currentMonth;
    }
  }, [currentMonth]);

  // season color accent
  useEffect(() => {
    const season = getSeason(currentMonth);
    setSeasonalAccent(season);
  }, [currentMonth, setSeasonalAccent]);

  // swipe support
  const touchStartRef = useRef<number>(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goToNextMonth();
      else goToPrevMonth();
    }
  }, [goToNextMonth, goToPrevMonth]);

  const notes = getNotesForMonth(currentMonth, currentYear);
  const rangeLabel = getRangeLabel();

  const handleAddNote = useCallback((content: string, time: string, rangeStart?: Date, rangeEnd?: Date) => {
    addNote(currentMonth, currentYear, content, time, rangeStart, rangeEnd);
  }, [currentMonth, currentYear, addNote]);

  const handleUpdateNote = useCallback((noteId: string, content: string) => {
    updateNote(currentMonth, currentYear, noteId, content);
  }, [currentMonth, currentYear, updateNote]);

  const handleDeleteNote = useCallback((noteId: string) => {
    deleteNote(currentMonth, currentYear, noteId);
  }, [currentMonth, currentYear, deleteNote]);

  // page flip variants
  const pageFlipVariants = {
    enter: (dir: number) => ({
      rotateX: dir > 0 ? -90 : 90,
      opacity: 0,
      transformOrigin: dir > 0 ? 'top center' : 'bottom center',
    }),
    center: {
      rotateX: 0,
      opacity: 1,
      transformOrigin: 'top center',
    },
    exit: (dir: number) => ({
      rotateX: dir > 0 ? 90 : -90,
      opacity: 0,
      transformOrigin: dir > 0 ? 'top center' : 'bottom center',
    }),
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>
          <span className={styles.pageTitleAccent}>✦</span> Wall Calendar
        </h2>
        <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
      </header>

      {/* Calendar Shell */}
      <div
        className={styles.calendarShell}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Wall nail */}
        <div className={styles.wallNail}>
          <div className={styles.nailString} />
        </div>

        {/* Wall shadow (depth) */}
        <div className={styles.wallShadow} />

        {/* Spiral Binding */}
        <div className={styles.spiralBinding}>
          {Array.from({ length: SPIRAL_COUNT }, (_, i) => (
            <div key={i} className={styles.spiralRing} />
          ))}
        </div>

        {/* Calendar Page with flip animation */}
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={`${currentMonth}-${currentYear}`}
            className={styles.calendarPage}
            custom={direction}
            variants={pageFlipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.45,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{ perspective: '1200px' }}
          >
            {/* Hero Image */}
            <HeroImage month={currentMonth} year={currentYear} direction={direction} />

            {/* Bottom: Notes + Calendar */}
            <div className={styles.calendarBottom}>
              {/* Notes (left) */}
              <NotesPanel
                notes={notes}
                currentMonth={currentMonth}
                currentYear={currentYear}
                rangeLabel={selectionState === 'selected' ? rangeLabel : ''}
                rangeStart={range.start}
                rangeEnd={range.end}
                onAdd={handleAddNote}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
              />

              {/* Calendar Grid (right) */}
              <div className={styles.calendarContent}>
                <MonthNavigation
                  monthLabel={monthLabel}
                  currentMonth={currentMonth}
                  currentYear={currentYear}
                  onPrev={goToPrevMonth}
                  onNext={goToNextMonth}
                  onToday={goToToday}
                  onMonthSelect={goToMonth}
                />

                <CalendarGrid
                  days={calendarDays}
                  currentMonth={currentMonth}
                  onDateClick={handleDateClick}
                  onDateHover={handleDateHover}
                  isStartDate={isStartDate}
                  isEndDate={isEndDate}
                  isDateInRange={isDateInRange}
                  isHoveredEnd={isHoveredEnd}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Selection Summary Bar */}
      <SelectionSummary
        rangeLabel={selectionState === 'selected' ? rangeLabel : ''}
        onClear={clearSelection}
        onAddNote={() => {}}
      />

      {/* Cal AI Chatbot */}
      <CalAIChatbot
        getNotes={getNotesForMonth}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </div>
  );
}
