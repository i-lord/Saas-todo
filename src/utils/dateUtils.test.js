import {
  formatTaskDate,
  isOverdue,
  getDefaultDueDate,
  formatDateForInput,
  getRelativeTime
} from './dateUtils.js';

describe('dateUtils', () => {
  describe('formatTaskDate', () => {
    it('returns Today for today\'s date', () => {
      const today = new Date();
      expect(formatTaskDate(today)).toBe('Today');
    });
    it('returns Tomorrow for tomorrow\'s date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(formatTaskDate(tomorrow)).toBe('Tomorrow');
    });
    it('returns formatted date for other dates', () => {
      const date = new Date('2022-12-25');
      expect(formatTaskDate(date)).toMatch(/Dec 25/);
    });
  });

  describe('isOverdue', () => {
    it('returns false if status is Done', () => {
      expect(isOverdue('2020-01-01', 'Done')).toBe(false);
    });
    it('returns false if date is today', () => {
      const today = new Date();
      expect(isOverdue(today, 'Todo')).toBe(false);
    });
    it('returns true if date is in the past and not Done', () => {
      const past = new Date();
      past.setDate(past.getDate() - 2);
      expect(isOverdue(past, 'Todo')).toBe(true);
    });
  });

  describe('getDefaultDueDate', () => {
    it('returns a date 7 days from now in YYYY-MM-DD format', () => {
      const result = getDefaultDueDate();
      const expected = new Date();
      expected.setDate(expected.getDate() + 7);
      const expectedStr = expected.toISOString().split('T')[0];
      expect(result).toBe(expectedStr);
    });
  });

  describe('formatDateForInput', () => {
    it('formats a date to YYYY-MM-DD', () => {
      const date = new Date('2023-05-15T12:34:56Z');
      expect(formatDateForInput(date)).toBe('2023-05-15');
    });
    it('returns empty string for falsy input', () => {
      expect(formatDateForInput(null)).toBe('');
    });
  });

  describe('getRelativeTime', () => {
    it('returns overdue for past dates', () => {
      const past = new Date();
      past.setDate(past.getDate() - 2);
      expect(getRelativeTime(past)).toMatch(/overdue/);
    });
    it('returns Due today for today', () => {
      const today = new Date();
      expect(getRelativeTime(today)).toBe('Due today');
    });
    it('returns Due tomorrow for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(getRelativeTime(tomorrow)).toBe('Due tomorrow');
    });
    it('returns Due in X days for future dates within a week', () => {
      const future = new Date();
      future.setDate(future.getDate() + 3);
      expect(getRelativeTime(future)).toBe('Due in 3 days');
    });
    it('returns formatted date for dates further in the future', () => {
      const future = new Date();
      future.setDate(future.getDate() + 10);
      expect(getRelativeTime(future)).toMatch(/[A-Za-z]{3} [0-9]{1,2}/);
    });
  });
});
