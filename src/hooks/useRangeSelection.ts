'use client';

import { useState, useCallback } from 'react';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

type SelectionState = 'idle' | 'selecting' | 'selected';

export function useRangeSelection() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [selectionState, setSelectionState] = useState<SelectionState>('idle');
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const handleDateClick = useCallback((date: Date) => {
    setRange(prev => {
      if (prev.start === null || selectionState === 'selected') {
        // Starting a new selection
        setSelectionState('selecting');
        return { start: date, end: null };
      }

      // Completing the selection
      let start = prev.start;
      let end = date;

      // Auto-swap if end is before start
      if (end < start) {
        [start, end] = [end, start];
      }

      setSelectionState('selected');
      return { start, end };
    });
  }, [selectionState]);

  const handleDateHover = useCallback((date: Date) => {
    setHoveredDate(date);
  }, []);

  const clearSelection = useCallback(() => {
    setRange({ start: null, end: null });
    setSelectionState('idle');
    setHoveredDate(null);
  }, []);

  const isDateInRange = useCallback((date: Date): boolean => {
    if (!range.start) return false;

    const effectiveEnd = range.end || (selectionState === 'selecting' ? hoveredDate : null);
    if (!effectiveEnd) return false;

    let start = range.start;
    let end = effectiveEnd;
    if (end < start) [start, end] = [end, start];

    return date >= start && date <= end;
  }, [range, selectionState, hoveredDate]);

  const isStartDate = useCallback((date: Date): boolean => {
    if (!range.start) return false;
    return isSameDate(date, range.start);
  }, [range.start]);

  const isEndDate = useCallback((date: Date): boolean => {
    if (!range.end) return false;
    return isSameDate(date, range.end);
  }, [range.end]);

  const isHoveredEnd = useCallback((date: Date): boolean => {
    if (selectionState !== 'selecting' || !hoveredDate) return false;
    return isSameDate(date, hoveredDate);
  }, [selectionState, hoveredDate]);

  const getDayCount = useCallback((): number => {
    if (!range.start || !range.end) return 0;
    const diffTime = Math.abs(range.end.getTime() - range.start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [range]);

  const getRangeLabel = useCallback((): string => {
    if (!range.start) return '';
    const startStr = formatDate(range.start);
    if (!range.end) return startStr;
    const endStr = formatDate(range.end);
    const days = getDayCount();
    return `${startStr} — ${endStr} (${days} day${days !== 1 ? 's' : ''})`;
  }, [range, getDayCount]);

  return {
    range,
    selectionState,
    hoveredDate,
    handleDateClick,
    handleDateHover,
    clearSelection,
    isDateInRange,
    isStartDate,
    isEndDate,
    isHoveredEnd,
    getDayCount,
    getRangeLabel,
  };
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
