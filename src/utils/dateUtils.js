// Date utility functions for task management

/**
 * Format date for display in task cards
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatTaskDate = (date) => {
  if (!date) return '';
  const taskDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Reset time for comparison
  const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  
  if (taskDateOnly.getTime() === todayOnly.getTime()) {
    return 'Today';
  } else if (taskDateOnly.getTime() === tomorrowOnly.getTime()) {
    return 'Tomorrow';
  } else {
    return taskDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: taskDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
};

/**
 * Check if a date is overdue
 * @param {string|Date} date - Date to check
 * @param {string} status - Task status
 * @returns {boolean} True if overdue
 */
export const isOverdue = (date, status) => {
  if (!date || status === 'Done') return false;
  const taskDate = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  return taskDate < today;
};

/**
 * Get default due date (7 days from now)
 * @returns {string} ISO date string for date input
 */
export const getDefaultDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
};

/**
 * Format date for HTML date input
 * @param {string|Date} date - Date to format
 * @returns {string} YYYY-MM-DD format
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Get relative time description
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time description
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  const taskDate = new Date(date);
  const now = new Date();
  const diffMs = taskDate - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return formatTaskDate(date);
  }
};
