'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/calendar.module.css';
import { getMonthInfo } from '@/data/monthData';

interface HeroImageProps {
  month: number;
  year: number;
  direction: number;
}

export default function HeroImage({ month, year, direction }: HeroImageProps) {
  const info = getMonthInfo(month);

  return (
    <div className={styles.heroSection}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${month}-${year}`}
          className={styles.heroImageWrapper}
          initial={{ opacity: 0, y: direction > 0 ? -40 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: direction > 0 ? 40 : -40 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={info.image}
            alt={`${info.name} seasonal landscape`}
            className={styles.heroImage}
            loading="lazy"
          />
        </motion.div>
      </AnimatePresence>

      {/* Curved SVG overlay at bottom */}
      <div className={styles.heroDiagonalOverlay}>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path d="M 0 15 L 35 32 Q 40 36 45 30 L 75 6 Q 80 2 85 7 L 100 20 L 100 40 L 0 40 Z" fill="var(--color-primary)" opacity="1" />
        </svg>
      </div>

      {/* Month/Year label on diagonal */}
      <motion.div
        className={styles.heroMonthLabel}
        key={`label-${month}-${year}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        <div className={styles.heroYear}>{year}</div>
        <div className={styles.heroMonth}>{info.name}</div>
      </motion.div>
    </div>
  );
}
