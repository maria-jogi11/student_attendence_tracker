// LocalStorage management for AttendEase
import { INITIAL_STUDENTS, generateInitialAttendance } from './sampleData';

const STUDENTS_STORAGE_KEY = 'attendease_students_data_v1';
const ATTENDANCE_STORAGE_KEY = 'attendease_attendance_data_v1';

/**
 * Load students from localStorage or initialize with sample data
 */
export const loadStudents = () => {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) {
      // First run: save and return initial sample data
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_STUDENTS;
  } catch (error) {
    console.error('Error reading students from localStorage:', error);
    return INITIAL_STUDENTS;
  }
};

/**
 * Save students array to localStorage
 */
export const saveStudents = (students) => {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students to localStorage:', error);
  }
};

/**
 * Load attendance mapping from localStorage or initialize with sample data
 * Structure: { [YYYY-MM-DD]: { [studentId]: 'present' | 'absent' } }
 */
export const loadAttendance = () => {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!raw) {
      const initial = generateInitialAttendance();
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (error) {
    console.error('Error reading attendance from localStorage:', error);
    return {};
  }
};

/**
 * Save attendance records mapping to localStorage
 */
export const saveAttendance = (attendance) => {
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendance));
  } catch (error) {
    console.error('Error saving attendance to localStorage:', error);
  }
};

/**
 * Reset application data back to default sample records
 */
export const resetToSampleData = () => {
  try {
    const initialAtt = generateInitialAttendance();
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(initialAtt));
    return { students: INITIAL_STUDENTS, attendance: initialAtt };
  } catch (error) {
    console.error('Error resetting demo data:', error);
    return { students: INITIAL_STUDENTS, attendance: {} };
  }
};

