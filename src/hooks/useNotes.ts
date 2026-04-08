'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export interface Note {
  id: string;
  content: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  rangeStart?: string;
  rangeEnd?: string;
}

interface NotesState {
  [monthKey: string]: Note[];
}

const STORAGE_KEY = 'wall-calendar-notes';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function loadNotes(): NotesState {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    console.warn('Failed to load notes from localStorage');
    return {};
  }
}

function saveNotes(notes: NotesState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    console.warn('Failed to save notes to localStorage');
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<NotesState>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    setNotes(loadNotes());
    setIsLoaded(true);
  }, []);

  // Debounced save
  const debouncedSave = useCallback((newNotes: NotesState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveNotes(newNotes);
    }, 500);
  }, []);

  const getMonthKey = useCallback((month: number, year: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}`;
  }, []);

  const getNotesForMonth = useCallback((month: number, year: number): Note[] => {
    const key = getMonthKey(month, year);
    return notes[key] || [];
  }, [notes, getMonthKey]);

  const addNote = useCallback((
    month: number,
    year: number,
    content: string,
    time: string,
    rangeStart?: Date,
    rangeEnd?: Date,
  ): Note => {
    const key = getMonthKey(month, year);
    const now = new Date().toISOString();
    const note: Note = {
      id: generateId(),
      content,
      time,
      createdAt: now,
      updatedAt: now,
      rangeStart: rangeStart?.toISOString(),
      rangeEnd: rangeEnd?.toISOString(),
    };

    setNotes(prev => {
      const updated = {
        ...prev,
        [key]: [...(prev[key] || []), note],
      };
      debouncedSave(updated);
      return updated;
    });

    return note;
  }, [getMonthKey, debouncedSave]);

  const updateNote = useCallback((
    month: number,
    year: number,
    noteId: string,
    content: string,
  ) => {
    const key = getMonthKey(month, year);
    setNotes(prev => {
      const monthNotes = prev[key] || [];
      const updated = {
        ...prev,
        [key]: monthNotes.map(n =>
          n.id === noteId
            ? { ...n, content, updatedAt: new Date().toISOString() }
            : n
        ),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [getMonthKey, debouncedSave]);

  const deleteNote = useCallback((month: number, year: number, noteId: string) => {
    const key = getMonthKey(month, year);
    setNotes(prev => {
      const monthNotes = prev[key] || [];
      const updated = {
        ...prev,
        [key]: monthNotes.filter(n => n.id !== noteId),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [getMonthKey, debouncedSave]);

  const getNotesCount = useCallback((month: number, year: number): number => {
    return getNotesForMonth(month, year).length;
  }, [getNotesForMonth]);

  return {
    isLoaded,
    getNotesForMonth,
    addNote,
    updateNote,
    deleteNote,
    getNotesCount,
  };
}
