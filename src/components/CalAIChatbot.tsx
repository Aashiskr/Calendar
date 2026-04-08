'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Bot, Sparkles, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/chatbot.module.css';
import type { Note } from '@/hooks/useNotes';
import { holidays } from '@/data/holidays';
import { monthData } from '@/data/monthData';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface CalAIChatbotProps {
  getNotes: (month: number, year: number) => Note[];
  currentMonth: number;
  currentYear: number;
}

// month names for parsing
const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

const MONTH_SHORT = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

function parseMonthFromQuery(query: string): number | null {
  const lower = query.toLowerCase();
  for (let i = 0; i < MONTH_NAMES.length; i++) {
    if (lower.includes(MONTH_NAMES[i]) || lower.includes(MONTH_SHORT[i])) {
      return i;
    }
  }
  // Check "this month", "current month"
  if (lower.includes('this month') || lower.includes('current month')) {
    return new Date().getMonth();
  }
  // Check "next month"
  if (lower.includes('next month')) {
    return (new Date().getMonth() + 1) % 12;
  }
  // Check "last month", "previous month"
  if (lower.includes('last month') || lower.includes('previous month')) {
    return (new Date().getMonth() - 1 + 12) % 12;
  }
  return null;
}

function getHolidaysForMonth(monthIndex: number) {
  const monthStr = String(monthIndex + 1).padStart(2, '0');
  return holidays.filter(h => h.date.startsWith(monthStr));
}

function generateResponse(
  query: string,
  getNotes: (month: number, year: number) => Note[],
  currentMonth: number,
  currentYear: number,
): string {
  const lower = query.toLowerCase().trim();
  const targetMonth = parseMonthFromQuery(query);
  const monthIdx = targetMonth !== null ? targetMonth : currentMonth;
  const monthName = monthData[monthIdx].name;

  // Greeting
  if (/^(hi|hello|hey|hola|namaste|sup|yo|greetings)/i.test(lower)) {
    return `Hey there! 👋 I'm Cal AI, your calendar assistant. I can help you with:\n\n📅 **Events & holidays** — Ask me "What events are in April?"\n📝 **Your notes** — Ask me "Show my notes"\n📆 **Date info** — Ask me "What's special about today?"\n\nHow can I help you?`;
  }

  // Thanks
  if (/^(thanks|thank you|thx|ty)/i.test(lower)) {
    return `You're welcome! 😊 Let me know if you need anything else.`;
  }

  // Help
  if (/^(help|what can you do|commands|features)/i.test(lower)) {
    return `Here's what I can do:\n\n🗓️ **"Events in [month]"** — List holidays/events\n📝 **"My notes"** or **"Show notes"** — View your saved notes\n📝 **"Notes for [month]"** — Notes for a specific month\n🔍 **"What's on [date]?"** — Check a specific date\n📆 **"Today"** — Info about today\n📊 **"Summary"** — Current month overview\n🌸 **"What season?"** — Current season info\n\nTry asking something!`;
  }

  // Events / holidays query
  if (/event|holiday|festival|celebration|special day|what.*happening/i.test(lower)) {
    const monthHolidays = getHolidaysForMonth(monthIdx);
    if (monthHolidays.length === 0) {
      return `There are no major holidays listed for **${monthName}**. But that doesn't mean it's not special! 🌟`;
    }
    let response = `📅 **Events & Holidays in ${monthName}:**\n\n`;
    monthHolidays.forEach(h => {
      const day = parseInt(h.date.split('-')[1]);
      response += `${h.emoji} **${h.name}** — ${monthName} ${day}\n`;
    });
    response += `\nThat's ${monthHolidays.length} event${monthHolidays.length > 1 ? 's' : ''} in ${monthName}!`;
    return response;
  }

  // Notes query
  if (/note|memo|reminder|what.*wrote|what.*saved|what.*written/i.test(lower)) {
    const notes = getNotes(monthIdx, currentYear);
    if (notes.length === 0) {
      return `📝 You don't have any notes for **${monthName} ${currentYear}** yet. Click the **+** button in the notes section to add one!`;
    }
    let response = `📝 **Your notes for ${monthName} ${currentYear}** (${notes.length}):\n\n`;
    notes.forEach((note, i) => {
      const timeStr = note.time ? `🕐 ${note.time} — ` : '';
      response += `${i + 1}. ${timeStr}${note.content}\n`;
    });
    return response;
  }

  // Today query
  if (/today|what.*today|what's today/i.test(lower)) {
    const today = new Date();
    const dayStr = today.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    const monthHolidays = getHolidaysForMonth(today.getMonth());
    const todayHoliday = monthHolidays.find(h => {
      const day = parseInt(h.date.split('-')[1]);
      return day === today.getDate();
    });

    let response = `📆 **Today is ${dayStr}**\n\n`;
    if (todayHoliday) {
      response += `${todayHoliday.emoji} It's **${todayHoliday.name}** today!\n\n`;
    }
    const todayNotes = getNotes(today.getMonth(), today.getFullYear());
    if (todayNotes.length > 0) {
      response += `📝 You have ${todayNotes.length} note${todayNotes.length > 1 ? 's' : ''} this month.`;
    } else {
      response += `No notes for this month yet.`;
    }
    return response;
  }

  // Summary / overview query
  if (/summary|overview|status|this month|current month|what.*month/i.test(lower)) {
    const info = monthData[currentMonth];
    const monthHolidays = getHolidaysForMonth(currentMonth);
    const notes = getNotes(currentMonth, currentYear);

    let response = `📊 **${info.name} ${currentYear} — Summary**\n\n`;
    response += `🌿 Season: **${info.season.charAt(0).toUpperCase() + info.season.slice(1)}**\n`;
    response += `📅 Events: **${monthHolidays.length}** holidays\n`;
    response += `📝 Notes: **${notes.length}** saved\n\n`;

    if (monthHolidays.length > 0) {
      response += `**Upcoming events:**\n`;
      monthHolidays.slice(0, 3).forEach(h => {
        response += `${h.emoji} ${h.name}\n`;
      });
      if (monthHolidays.length > 3) {
        response += `...and ${monthHolidays.length - 3} more\n`;
      }
    }

    response += `\n_"${info.quote}"_`;
    return response;
  }

  // Season query
  if (/season|weather|climate/i.test(lower)) {
    const info = monthData[currentMonth];
    const seasonEmoji = {
      spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️'
    };
    return `We're currently in **${info.season.charAt(0).toUpperCase() + info.season.slice(1)}** ${seasonEmoji[info.season]}\n\n_"${info.quote}"_`;
  }

  // How many days/weeks query
  if (/how many days|days in|how many weeks/i.test(lower)) {
    const daysInMonth = new Date(currentYear, monthIdx + 1, 0).getDate();
    const weeks = Math.ceil(daysInMonth / 7);
    return `📆 **${monthName} ${currentYear}** has **${daysInMonth} days** (about ${weeks} weeks).`;
  }

  // Weekend query
  if (/weekend|saturday|sunday/i.test(lower)) {
    const daysInMonth = new Date(currentYear, monthIdx + 1, 0).getDate();
    let weekends = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const day = new Date(currentYear, monthIdx, d).getDay();
      if (day === 0 || day === 6) weekends++;
    }
    return `📅 **${monthName} ${currentYear}** has **${weekends} weekend days** (Saturdays + Sundays). Perfect for relaxation! 😎`;
  }

  // Count notes query
  if (/count|how many|total/i.test(lower) && /note/i.test(lower)) {
    let total = 0;
    for (let m = 0; m < 12; m++) {
      total += getNotes(m, currentYear).length;
    }
    const current = getNotes(currentMonth, currentYear).length;
    return `📝 You have **${current} notes** in ${monthData[currentMonth].name} and **${total} notes total** across all months in ${currentYear}.`;
  }

  // Fun / joke
  if (/joke|funny|make me laugh|humor/i.test(lower)) {
    const jokes = [
      `Why did the calendar go to therapy? Because it had too many dates! 📅😄`,
      `What's a calendar's favorite food? Dates! 🌴😂`,
      `I'm reading a book about calendars... It's about time! ⏰😆`,
      `Why don't calendars ever get lonely? They always have a date! 💑📅`,
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Motivation
  if (/motivat|inspire|quote|uplift/i.test(lower)) {
    const quotes = [
      `✨ "The secret of getting ahead is getting started." — Mark Twain`,
      `🌟 "Today is a good day to have a great day."`,
      `💪 "Every day is a new beginning. Take a deep breath and start again."`,
      `🔥 "Don't watch the clock; do what it does. Keep going." — Sam Levenson`,
      `🌈 _"${monthData[currentMonth].quote}"_`,
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Fallback
  return `I'm not sure I understand that. 🤔 Try asking me about:\n\n📅 **"Events in [month]"**\n📝 **"My notes"**\n📆 **"Today"**\n📊 **"Summary"**\n❓ **"Help"** for all commands\n\nI'll do my best to help!`;
}

export default function CalAIChatbot({ getNotes, currentMonth, currentYear }: CalAIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // scroll to bottom on new msg
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // greeting on first open
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'bot',
        text: `Hi! 👋 I'm **Cal AI**, your calendar assistant.\n\nI know about your notes and all the events for every month. Ask me anything!\n\n💡 Try: _"Events in April"_ or _"Show my notes"_`,
        timestamp: new Date(),
      }]);
    }
  }, [messages.length]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // add typing delay for realism
    setTimeout(() => {
      const response = generateResponse(trimmed, getNotes, currentMonth, currentYear);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 500);
  }, [input, getNotes, currentMonth, currentYear]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // basic markdown renderer
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      processed = processed.replace(/_(.*?)_/g, '<em>$1</em>');

      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: processed }} />
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className={styles.fabButton}
            onClick={handleOpen}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            aria-label="Open Cal AI chatbot"
            type="button"
          >
            <div className={styles.fabIcon}>
              <Sparkles size={18} />
            </div>
            <span className={styles.fabLabel}>Cal AI</span>
            <div className={styles.fabPulse} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderInfo}>
                <div className={styles.chatAvatar}>
                  <Bot size={18} />
                </div>
                <div>
                  <div className={styles.chatTitle}>Cal AI</div>
                  <div className={styles.chatSubtitle}>
                    <span className={styles.onlineDot} />
                    Calendar Assistant
                  </div>
                </div>
              </div>
              <button
                className={styles.chatCloseBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className={styles.chatMessages}>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`${styles.message} ${msg.role === 'user' ? styles.messageUser : styles.messageBot}`}
                >
                  {msg.role === 'bot' && (
                    <div className={styles.msgAvatar}>
                      <Sparkles size={12} />
                    </div>
                  )}
                  <div className={`${styles.msgBubble} ${msg.role === 'user' ? styles.msgBubbleUser : styles.msgBubbleBot}`}>
                    {renderText(msg.text)}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className={`${styles.message} ${styles.messageBot}`}>
                  <div className={styles.msgAvatar}>
                    <Sparkles size={12} />
                  </div>
                  <div className={`${styles.msgBubble} ${styles.msgBubbleBot}`}>
                    <div className={styles.typingDots}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            {messages.length <= 1 && (
              <div className={styles.quickActions}>
                {[
                  { icon: <CalendarDays size={12} />, label: 'Events this month', query: 'Events this month' },
                  { icon: '📝', label: 'My notes', query: 'Show my notes' },
                  { icon: '📊', label: 'Summary', query: 'Summary' },
                ].map((action) => (
                  <button
                    key={action.query}
                    className={styles.quickActionBtn}
                    onClick={() => {
                      setInput(action.query);
                      setTimeout(() => {
                        const userMsg: Message = {
                          id: Date.now().toString(),
                          role: 'user',
                          text: action.query,
                          timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, userMsg]);
                        setIsTyping(true);
                        setTimeout(() => {
                          const response = generateResponse(action.query, getNotes, currentMonth, currentYear);
                          setMessages(prev => [...prev, {
                            id: (Date.now() + 1).toString(),
                            role: 'bot',
                            text: response,
                            timestamp: new Date(),
                          }]);
                          setIsTyping(false);
                        }, 600);
                      }, 100);
                      setInput('');
                    }}
                    type="button"
                  >
                    <span>{typeof action.icon === 'string' ? action.icon : action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className={styles.chatInputArea}>
              <input
                ref={inputRef}
                className={styles.chatInput}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Cal AI anything..."
                aria-label="Chat message"
              />
              <button
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={!input.trim()}
                aria-label="Send message"
                type="button"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
