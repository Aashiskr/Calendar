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

      {/* Diagonal overlay at bottom */}
      <div className={styles.heroDiagonalOverlay} />

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
