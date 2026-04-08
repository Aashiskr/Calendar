'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, StickyNote, Copy } from 'lucide-react';
import styles from '@/styles/calendar.module.css';

interface SelectionSummaryProps {
  rangeLabel: string;
  onClear: () => void;
  onAddNote: () => void;
}

export default function SelectionSummary({
  rangeLabel,
  onClear,
  onAddNote,
}: SelectionSummaryProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rangeLabel);
    } catch {
      // Silently fail if clipboard API not available
    }
  };

  return (
    <AnimatePresence>
      {rangeLabel && (
        <motion.div
          className={styles.selectionSummary}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <span className={styles.selectionLabel}>{rangeLabel}</span>

          <span className={styles.selectionDivider} />

          <div className={styles.selectionActions}>
            <button
              className={styles.selectionActionBtn}
              onClick={onAddNote}
              type="button"
              aria-label="Add note for selected range"
            >
              <StickyNote size={14} />
              Note
            </button>
            <button
              className={styles.selectionActionBtn}
              onClick={handleCopy}
              type="button"
              aria-label="Copy range to clipboard"
            >
              <Copy size={14} />
              Copy
            </button>
          </div>

          <button
            className={styles.selectionClearBtn}
            onClick={onClear}
            type="button"
            aria-label="Clear selection"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
