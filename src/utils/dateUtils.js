// Utility functions for dates, percentages, and attendance computations

export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

export const getPreviousDay = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export const getNextDay = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

/**
 * Calculate attendance metrics for an individual student across all saved dates
 */
export const calculateStudentStats = (studentId, attendanceRecords) => {
  let totalClasses = 0;
  let presentDays = 0;
  let absentDays = 0;

  Object.values(attendanceRecords).forEach((dayRecord) => {
    if (dayRecord && dayRecord[studentId]) {
      totalClasses += 1;
      if (dayRecord[studentId] === 'present') {
        presentDays += 1;
      } else if (dayRecord[studentId] === 'absent') {
        absentDays += 1;
      }
    }
  });

  const percentage = totalClasses > 0 ? Number(((presentDays / totalClasses) * 100).toFixed(1)) : 0;

  let status = 'No Data';
  let statusColor = 'gray';

  if (totalClasses > 0) {
    if (percentage >= 85) {
      status = 'Excellent';
      statusColor = 'emerald';
    } else if (percentage >= 75) {
      status = 'Good';
      statusColor = 'blue';
    } else if (percentage >= 60) {
      status = 'Warning';
      statusColor = 'amber';
    } else {
      status = 'Critical';
      statusColor = 'rose';
    }
  }

  return {
    totalClasses,
    presentDays,
    absentDays,
    percentage,
    status,
    statusColor
  };
};

/**
 * Get sorted day-by-day attendance history for a single student
 */
export const getStudentHistory = (studentId, attendanceRecords) => {
  const dates = Object.keys(attendanceRecords).sort().reverse();
  return dates.map(date => {
    const status = attendanceRecords[date]?.[studentId] || 'unmarked';
    return {
      date,
      formattedDate: formatDateDisplay(date),
      status
    };
  });
};

/**
 * Calculate overall metrics across the entire college student dataset
 */
export const calculateOverallMetrics = (students, attendanceRecords, targetDate = null) => {
  const dateToInspect = targetDate || getTodayDateString();
  const dayRecord = attendanceRecords[dateToInspect] || {};

  let presentCount = 0;
  let absentCount = 0;
  let unmarkedCount = 0;

  students.forEach((student) => {
    const status = dayRecord[student.id];
    if (status === 'present') {
      presentCount += 1;
    } else if (status === 'absent') {
      absentCount += 1;
    } else {
      unmarkedCount += 1;
    }
  });

  const markedTotal = presentCount + absentCount;
  const dayPercentage = markedTotal > 0 ? Number(((presentCount / markedTotal) * 100).toFixed(1)) : 0;

  // Cumulative overall percentage across all recorded sessions
  let totalInstances = 0;
  let totalPresentInstances = 0;

  Object.values(attendanceRecords).forEach((record) => {
    students.forEach((student) => {
      const s = record[student.id];
      if (s === 'present') {
        totalInstances += 1;
        totalPresentInstances += 1;
      } else if (s === 'absent') {
        totalInstances += 1;
      }
    });
  });

  const overallPercentage =
    totalInstances > 0 ? Number(((totalPresentInstances / totalInstances) * 100).toFixed(1)) : 0;

  // Count students with low attendance (< 75%)
  let lowAttendanceCount = 0;
  students.forEach((student) => {
    const { percentage, totalClasses } = calculateStudentStats(student.id, attendanceRecords);
    if (totalClasses > 0 && percentage < 75) {
      lowAttendanceCount += 1;
    }
  });

  return {
    totalStudents: students.length,
    presentToday: presentCount,
    absentToday: absentCount,
    unmarkedToday: unmarkedCount,
    dayPercentage,
    overallPercentage,
    totalDatesRecorded: Object.keys(attendanceRecords).length,
    lowAttendanceCount,
    activeDate: dateToInspect
  };
};

/**
 * Compute daily percentage trend for recent dates (for dashboard visual chart)
 */
export const getAttendanceTrend = (students, attendanceRecords, count = 7) => {
  // Sort all unique recorded dates chronologically
  const dates = Object.keys(attendanceRecords).sort();
  // Take last N dates
  const recentDates = dates.slice(-count);

  if (recentDates.length === 0) {
    return [];
  }

  return recentDates.map(dateKey => {
    const dayRecord = attendanceRecords[dateKey] || {};
    let present = 0;
    let absent = 0;

    students.forEach(s => {
      if (dayRecord[s.id] === 'present') present++;
      if (dayRecord[s.id] === 'absent') absent++;
    });

    const total = present + absent;
    const rate = total > 0 ? Number(((present / total) * 100).toFixed(1)) : 0;

    return {
      date: dateKey,
      label: formatDateShort(dateKey),
      present,
      absent,
      total,
      percentage: rate
    };
  });
};
