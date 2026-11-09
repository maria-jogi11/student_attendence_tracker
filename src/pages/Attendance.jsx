import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Save, 
  CheckCheck, 
  XSquare, 
  Filter,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatDateDisplay, getTodayDateString, getPreviousDay, getNextDay } from '../utils/dateUtils';

export default function Attendance({ students, attendance, onSaveAttendance, showToast }) {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [currentAttendance, setCurrentAttendance] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PRESENT' | 'ABSENT' | 'UNMARKED'

  // When selected date changes or global attendance updates, sync local state
  useEffect(() => {
    const existingForDate = attendance[selectedDate] || {};
    setCurrentAttendance({ ...existingForDate });
    setIsDirty(false);
  }, [selectedDate, attendance]);

  // Unique classes for filter
  const classesList = ['ALL', ...Array.from(new Set(students.map(s => s.studentClass).filter(Boolean)))];

  // Filtered students for marking
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || student.studentClass === selectedClass;

    const currentStatus = currentAttendance[student.id];
    let matchesStatus = true;
    if (statusFilter === 'PRESENT') matchesStatus = currentStatus === 'present';
    else if (statusFilter === 'ABSENT') matchesStatus = currentStatus === 'absent';
    else if (statusFilter === 'UNMARKED') matchesStatus = !currentStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  // Calculate live stats for the selected date
  const presentCount = students.filter(s => currentAttendance[s.id] === 'present').length;
  const absentCount = students.filter(s => currentAttendance[s.id] === 'absent').length;
  const unmarkedCount = students.length - (presentCount + absentCount);
  const totalMarked = presentCount + absentCount;
  const dayRate = totalMarked > 0 ? ((presentCount / totalMarked) * 100).toFixed(1) : 0;

  const handleStatusChange = (studentId, status) => {
    setCurrentAttendance(prev => {
      const next = { ...prev };
      next[studentId] = status;
      return next;
    });
    setIsDirty(true);
  };

  const handleMarkAll = (status) => {
    const updated = { ...currentAttendance };
    filteredStudents.forEach(s => {
      updated[s.id] = status;
    });
    setCurrentAttendance(updated);
    setIsDirty(true);
    showToast(`Marked all ${filteredStudents.length} displayed students as ${status}`, 'success');
  };

  const handleSave = () => {
    onSaveAttendance(selectedDate, currentAttendance);
    setIsDirty(false);
    showToast(`Attendance for ${formatDateDisplay(selectedDate)} saved successfully`, 'success');
  };

  const handlePrevDay = () => {
    setSelectedDate(prev => getPreviousDay(prev));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => getNextDay(prev));
  };

  return (
    <div>
      {/* Date Selection & Action Bar */}
      <div 
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '4px' }}>
              Select Attendance Date
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handlePrevDay}
                title="Go to Previous Day"
                style={{ padding: '8px 10px' }}
              >
                <ChevronLeft size={16} />
              </button>

              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: 'auto', fontWeight: 600, padding: '7px 12px' }}
              />

              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleNextDay}
                title="Go to Next Day"
                style={{ padding: '8px 10px' }}
              >
                <ChevronRight size={16} />
              </button>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedDate(getTodayDateString())}
                title="Jump to today's date"
              >
                Today
              </button>
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Active Session
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)' }}>
              {formatDateDisplay(selectedDate)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isDirty && (
            <span style={{ fontSize: '0.8rem', color: 'var(--warning-color)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <AlertCircle size={14} /> Unsaved changes
            </span>
          )}
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            style={{ minWidth: '160px' }}
          >
            <Save size={16} />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Date Metrics Pill Strip */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Students</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-900)' }}>{students.length}</div>
          </div>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)' }}>
            <Calendar size={18} />
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Present</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--present-color)' }}>{presentCount}</div>
          </div>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--present-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--present-color)' }}>
            <CheckCircle size={18} />
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Absent</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--absent-color)' }}>{absentCount}</div>
          </div>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--absent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--absent-color)' }}>
            <XCircle size={18} />
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Rate</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb' }}>{dayRate}%</div>
          </div>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <CheckCheck size={18} />
          </div>
        </div>
      </div>

      {/* Attendance Marking Table Card */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', flex: 1 }}>
            <div className="search-input-box" style={{ maxWidth: '300px' }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={15} style={{ color: 'var(--text-muted)' }} />
              <select
                className="form-control"
                style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classesList.map(c => (
                  <option key={c} value={c}>{c === 'ALL' ? 'All Classes' : c}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="PRESENT">Present Only</option>
                <option value="ABSENT">Absent Only</option>
                <option value="UNMARKED">Unmarked Only</option>
              </select>
            </div>
          </div>

          {/* Quick Mark Batch Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => handleMarkAll('present')}
              title="Mark all listed students as present"
            >
              <CheckCheck size={15} style={{ color: 'var(--present-color)' }} />
              <span>Mark All Present</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => handleMarkAll('absent')}
              title="Mark all listed students as absent"
            >
              <XSquare size={15} style={{ color: 'var(--absent-color)' }} />
              <span>Mark All Absent</span>
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Student Details</th>
                <th>Register No.</th>
                <th>Class</th>
                <th>Current Status</th>
                <th style={{ textAlign: 'center', width: '220px' }}>Mark Attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No students found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const status = currentAttendance[student.id];
                  const isPresent = status === 'present';
                  const isAbsent = status === 'absent';

                  return (
                    <tr key={student.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {idx + 1}
                      </td>
                      <td>
                        <div className="student-cell">
                          <div className="student-avatar">
                            {student.name.charAt(0)}
                          </div>
                          <div className="student-meta">
                            <h4>{student.name}</h4>
                            <span>{student.gender || 'Student'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="reg-code">{student.registerNumber}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {student.studentClass}
                        </span>
                      </td>
                      <td>
                        {isPresent ? (
                          <span className="badge badge-present">
                            <CheckCircle size={12} /> Present
                          </span>
                        ) : isAbsent ? (
                          <span className="badge badge-absent">
                            <XCircle size={12} /> Absent
                          </span>
                        ) : (
                          <span className="badge badge-neutral">Not Marked</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div 
                          style={{ 
                            display: 'inline-flex', 
                            background: '#f1f5f9', 
                            padding: '4px', 
                            borderRadius: '8px', 
                            gap: '4px' 
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'present')}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              backgroundColor: isPresent ? 'var(--present-color)' : 'transparent',
                              color: isPresent ? '#ffffff' : 'var(--text-secondary)',
                              boxShadow: isPresent ? '0 2px 5px rgba(16, 185, 129, 0.3)' : 'none'
                            }}
                          >
                            <CheckCircle size={14} />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              backgroundColor: isAbsent ? 'var(--absent-color)' : 'transparent',
                              color: isAbsent ? '#ffffff' : 'var(--text-secondary)',
                              boxShadow: isAbsent ? '0 2px 5px rgba(239, 68, 68, 0.3)' : 'none'
                            }}
                          >
                            <XCircle size={14} />
                            <span>Absent</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Save Bar for Convenience */}
        <div 
          style={{ 
            padding: '16px 24px', 
            background: 'var(--bg-subtle)', 
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students. Click <strong>Save Attendance</strong> to save records.
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleSave}
          >
            <Save size={16} />
            <span>Save Attendance for {formatDateDisplay(selectedDate)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
