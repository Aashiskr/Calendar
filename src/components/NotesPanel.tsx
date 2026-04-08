'use client';

import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit3, X, Clock, StickyNote } from 'lucide-react';
import styles from '@/styles/calendar.module.css';
import type { Note } from '@/hooks/useNotes';

interface NotesPanelProps {
  notes: Note[];
  currentMonth: number;
  currentYear: number;
  rangeLabel: string;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onAdd: (content: string, time: string, rangeStart?: Date, rangeEnd?: Date) => void;
  onUpdate: (noteId: string, content: string) => void;
  onDelete: (noteId: string) => void;
  externalAddTrigger?: number;
}

const MAX_CHARS = 500;
const EMPTY_LINES = 10;

export default function NotesPanel({
  notes,
  rangeLabel,
  rangeStart,
  rangeEnd,
  onAdd,
  onUpdate,
  onDelete,
  externalAddTrigger,
}: NotesPanelProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'view' | 'edit'>('add');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTime, setNewNoteTime] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editContent, setEditContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleOpenAdd = () => {
    setModalMode('add');
    setNewNoteContent('');
    setNewNoteTime('');
    setShowModal(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  React.useEffect(() => {
    if (externalAddTrigger && externalAddTrigger > 0) {
      handleOpenAdd();
    }
  }, [externalAddTrigger]);

  const handleOpenView = () => {
    setModalMode('view');
    setShowModal(true);
  };

  const handleSaveNew = () => {
    if (!newNoteContent.trim()) return;
    onAdd(
      newNoteContent.trim(),
      newNoteTime,
      rangeStart || undefined,
      rangeEnd || undefined,
    );
    setNewNoteContent('');
    setNewNoteTime('');
    setShowModal(false);
  };

  const handleStartEdit = (note: Note) => {
    setEditingNote(note);
    setEditContent(note.content);
    setModalMode('edit');
  };

  const handleSaveEdit = () => {
    if (!editingNote || !editContent.trim()) return;
    onUpdate(editingNote.id, editContent.trim());
    setEditingNote(null);
    setEditContent('');
    setModalMode('view');
  };

  const formatTime = (note: Note): string => {
    if (note.time) return note.time;
    return '';
  };

  const getNoteDateString = (note: Note) => {
    if (note.rangeStart && note.rangeEnd) {
      const startStr = new Date(note.rangeStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = new Date(note.rangeEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (startStr === endStr) return startStr;
      return `${startStr} - ${endStr}`;
    }
    if (note.rangeStart) {
      return new Date(note.rangeStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Build the note lines for the left sidebar
  const noteLines = [];
  for (let i = 0; i < Math.max(EMPTY_LINES, notes.length); i++) {
    const note = notes[i];
    noteLines.push(
      <div
        key={i}
        className={`${styles.noteLine} ${!note ? styles.noteLineEmpty : ''}`}
        onClick={() => note ? handleOpenView() : handleOpenAdd()}
      >
        {note ? (
          <>
            {note.time && <span className={styles.noteLineTime}>{note.time}</span>}
            <span className={styles.noteLineDot} />
            <span className={styles.noteLineContent}>{note.content}</span>
            {(note.rangeStart || note.rangeEnd) && <span className={styles.noteLineDateRange}>📅 {getNoteDateString(note)}</span>}
          </>
        ) : null}
      </div>
    );
  }

  return (
    <>
      {/* Left sidebar notes section */}
      <section className={styles.notesSection} aria-label="Notes">
        <div className={styles.notesHeader}>
          <h2 className={styles.notesTitle}>
            Notes
            {notes.length > 0 && (
              <span className={styles.notesCount}>{notes.length}</span>
            )}
          </h2>
          <button
            className={styles.addNoteBtn}
            onClick={handleOpenAdd}
            type="button"
            aria-label="Add note"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className={styles.noteLines}>
          {noteLines}
        </div>
      </section>

      {/* Note Modal */}
      {showModal && (
        <div className={styles.noteModal}>
          <div
            className={styles.noteModalBackdrop}
            onClick={() => { setShowModal(false); setEditingNote(null); setModalMode('add'); }}
          />
          <div className={styles.noteModalContent}>
            <button
              className={styles.noteModalClose}
              onClick={() => { setShowModal(false); setEditingNote(null); setModalMode('add'); }}
              type="button"
            >
              <X size={14} />
            </button>

            {/* ADD mode */}
            {modalMode === 'add' && (
              <>
                <h3 className={styles.noteModalTitle}>
                  <StickyNote size={18} />
                  Add Note
                </h3>

                {rangeLabel && (
                  <div className={styles.noteRangeTag}>📅 {rangeLabel}</div>
                )}

                {/* Time picker */}
                <div className={styles.noteTimeRow}>
                  <Clock size={16} style={{ color: 'var(--color-text-muted)' }} />
                  <span className={styles.noteTimeLabel}>Time:</span>
                  <input
                    type="time"
                    className={styles.noteTimeInput}
                    value={newNoteTime}
                    onChange={(e) => setNewNoteTime(e.target.value)}
                    aria-label="Note time"
                  />
                </div>

                <textarea
                  ref={textareaRef}
                  className={styles.noteInput}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="Write your note here..."
                  aria-label="Note content"
                  rows={4}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSaveNew();
                  }}
                />
                <div className={styles.noteInputActions}>
                  <span className={styles.noteInputCharCount}>
                    {newNoteContent.length}/{MAX_CHARS}
                  </span>
                  <button className={styles.noteCancelBtn} onClick={() => setShowModal(false)} type="button">
                    Cancel
                  </button>
                  <button
                    className={styles.noteSaveBtn}
                    onClick={handleSaveNew}
                    disabled={!newNoteContent.trim()}
                    type="button"
                  >
                    Save Note
                  </button>
                </div>
              </>
            )}

            {/* VIEW mode */}
            {modalMode === 'view' && (
              <>
                <h3 className={styles.noteModalTitle}>
                  <StickyNote size={18} />
                  Notes
                  {notes.length > 0 && <span className={styles.notesCount}>{notes.length}</span>}
                </h3>

                {notes.length > 0 ? (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notes.map((note) => (
                      <div key={note.id} className={styles.noteDetailCard}>
                        <div className={styles.noteDetailHeader}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {formatTime(note) && (
                              <span className={styles.noteDetailTime}>🕐 {formatTime(note)}</span>
                            )}
                            <span className={styles.noteDetailDate} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                              📅 {getNoteDateString(note)}
                            </span>
                          </div>
                          <div className={styles.noteDetailActions}>
                            <button
                              className={styles.noteActionBtn}
                              onClick={() => handleStartEdit(note)}
                              aria-label="Edit note"
                              type="button"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              className={`${styles.noteActionBtn} ${styles.noteActionBtnDelete}`}
                              onClick={() => onDelete(note.id)}
                              aria-label="Delete note"
                              type="button"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className={styles.noteDetailContent}>{note.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyNotes}>
                    <div className={styles.emptyNotesIcon}>📝</div>
                    <p className={styles.emptyNotesText}>No notes yet!</p>
                  </div>
                )}
              </>
            )}

            {/* EDIT mode */}
            {modalMode === 'edit' && editingNote && (
              <>
                <h3 className={styles.noteModalTitle}>
                  <Edit3 size={18} />
                  Edit Note
                </h3>
                <textarea
                  className={styles.noteInput}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value.slice(0, MAX_CHARS))}
                  rows={4}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSaveEdit();
                  }}
                />
                <div className={styles.noteInputActions}>
                  <span className={styles.noteInputCharCount}>
                    {editContent.length}/{MAX_CHARS}
                  </span>
                  <button
                    className={styles.noteCancelBtn}
                    onClick={() => { setEditingNote(null); setModalMode('view'); }}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.noteSaveBtn}
                    onClick={handleSaveEdit}
                    disabled={!editContent.trim()}
                    type="button"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
