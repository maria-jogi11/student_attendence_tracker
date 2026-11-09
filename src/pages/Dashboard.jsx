import React, { useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Percent, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  CalendarDays,
  Sparkles,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { 
  calculateOverallMetrics, 
  calculateStudentStats, 
  formatDateDisplay, 
  getTodayDateString,
  getAttendanceTrend 
} from '../utils/dateUtils';

export default function Dashboard({ students, attendance, onNavigate }) {
  const today = getTodayDateString();
  const metrics = useMemo(() => calculateOverallMetrics(students, attendance, today), [students, attendance, today]);
  const trendData = useMemo(() => getAttendanceTrend(students, attendance, 7), [students, attendance]);

  // Students requiring attendance attention (< 75%)
  const lowAttendanceStudents = useMemo(() => {
    return students
      .map(student => ({
        ...student,
        stats: calculateStudentStats(student.id, attendance)
      }))
      .filter(s => s.stats.totalClasses > 0 && s.stats.percentage < 75)
      .sort((a, b) => a.stats.percentage - b.stats.percentage);
  }, [students, attendance]);

  // Today's attendance list
  const todayRecord = attendance[today] || {};

  // Class breakdown
  const classBreakdown = useMemo(() => {
    const map = {};
    students.forEach(s => {
      const cls = s.studentClass || 'General';
      if (!map[cls]) {
        map[cls] = { total: 0, presentToday: 0 };
      }
      map[cls].total += 1;
      if (todayRecord[s.id] === 'present') {
        map[cls].presentToday += 1;
      }
    });
    return Object.entries(map).map(([className, data]) => ({
      className,
      total: data.total,
      presentToday: data.presentToday,
      percentage: data.total > 0 ? ((data.presentToday / data.total) * 100).toFixed(0) : 0
    }));
  }, [students, todayRecord]);

  return (
    <div>
      {/* Top Welcome Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #0f2744 0%, #1e3a8a 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          color: '#ffffff',
          marginBottom: '26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 14px rgba(15, 39, 68, 0.25)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ 
              background: 'rgba(59, 130, 246, 0.25)', 
              color: '#93c5fd', 
              fontSize: '0.75rem', 
              padding: '3px 10px', 
              borderRadius: '999px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Sparkles size={12} /> MCA Attendance Management
            </span>
            <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>• {formatDateDisplay(today)}</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Welcome back, Faculty Coordinator
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '6px 0 0' }}>
            Here is your daily attendance summary and student statistics at a glance.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => onNavigate('attendance')}
          style={{ 
            backgroundColor: '#ffffff', 
            color: '#0f2744', 
            fontWeight: 700,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}
        >
          <CalendarDays size={16} />
          <span>Mark Today's Attendance</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* 4 Dashboard Metric Cards */}
      <div className="stat-grid">
        <StatCard
          label="Total Students"
          value={metrics.totalStudents}
          subtext="Enrolled across all classes"
          icon={Users}
          variant="blue"
        />
        <StatCard
          label="Present Students (Today)"
          value={metrics.presentToday}
          subtext={`${metrics.dayPercentage}% attendance for today`}
          icon={UserCheck}
          variant="green"
        />
        <StatCard
          label="Absent Students (Today)"
          value={metrics.absentToday}
          subtext={metrics.unmarkedToday > 0 ? `${metrics.unmarkedToday} unmarked yet` : 'All marked'}
          icon={UserX}
          variant="red"
        />
        <StatCard
          label="Overall Attendance"
          value={`${metrics.overallPercentage}%`}
          subtext={`Based on ${metrics.totalDatesRecorded} recorded days`}
          icon={Percent}
          variant="purple"
        />
      </div>

      {/* 7-Day Attendance Trend Chart */}
      {trendData.length > 0 && (
        <div className="card" style={{ marginBottom: '28px' }}>
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={18} style={{ color: '#2563eb' }} />
              Recent Attendance Trends (Last 7 Sessions)
            </h3>
            <span className="badge badge-neutral">Batch Performance</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${trendData.length}, 1fr)`, gap: '14px', alignItems: 'flex-end', minHeight: '160px', padding: '16px 8px 8px' }}>
              {trendData.map((day) => {
                const barHeight = Math.max(day.percentage, 10);
                const isHigh = day.percentage >= 80;
                return (
                  <div key={day.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isHigh ? 'var(--present-color)' : '#2563eb' }}>
                      {day.percentage}%
                    </span>
                    <div 
                      style={{
                        width: '100%',
                        maxWidth: '44px',
                        height: `${barHeight}%`,
                        background: isHigh 
                          ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)' 
                          : 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
                        borderRadius: '6px 6px 2px 2px',
                        transition: 'height 0.4s ease',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                      title={`${day.date}: ${day.present} Present, ${day.absent} Absent (${day.percentage}%)`}
                    />
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {day.label}
                      </span>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {day.present}/{day.total} P
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Grid: Class Breakdown & Low Attendance Warnings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        
        {/* Class Breakdown Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Users size={18} style={{ color: '#3b82f6' }} />
              Class-wise Distribution
            </h3>
            <span className="badge badge-neutral">{classBreakdown.length} Classes</span>
          </div>
          <div className="card-body">
            {classBreakdown.map((item) => (
              <div key={item.className} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.className}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {item.total} Students ({item.presentToday} present today)
                  </span>
                </div>
                <div className="progress-container" style={{ height: '10px' }}>
                  <div 
                    className="progress-bar progress-blue" 
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.percentage}% present today`}
                  />
                </div>
              </div>
            ))}

            <div style={{ marginTop: '20px', padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Total Recorded Academic Days:</span>
                <strong>{metrics.totalDatesRecorded} Days</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Low Attendance Watchlist Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <AlertTriangle size={18} style={{ color: '#ef4444' }} />
              Attendance Watchlist (&lt; 75%)
            </h3>
            <span className={`badge ${lowAttendanceStudents.length > 0 ? 'badge-absent' : 'badge-present'}`}>
              {lowAttendanceStudents.length} Students
            </span>
          </div>
          <div className="card-body" style={{ maxHeight: '310px', overflowY: 'auto' }}>
            {lowAttendanceStudents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={36} style={{ color: 'var(--present-color)', marginBottom: '8px' }} />
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Great news!</p>
                <p style={{ fontSize: '0.85rem' }}>All students have healthy attendance above 75%.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {lowAttendanceStudents.map((s) => (
                  <div 
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--absent-bg)',
                      border: '1px solid var(--absent-border)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--absent-text)' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {s.registerNumber} • {s.studentClass}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-absent" style={{ fontSize: '0.82rem' }}>
                        {s.stats.percentage}%
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--absent-text)', marginTop: '2px' }}>
                        {s.stats.presentDays}/{s.stats.totalClasses} Days
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Today's Attendance Snapshot Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <CalendarDays size={18} style={{ color: '#1e3a8a' }} />
              Today's Quick Roster ({formatDateDisplay(today)})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Snapshot of student status for today. Go to the Attendance tab to edit or save changes.
            </p>
          </div>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={() => onNavigate('attendance')}
          >
            <span>Open Attendance Sheet</span>
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Register No.</th>
                <th>Class</th>
                <th>Status (Today)</th>
                <th>Overall Rate</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 6).map((student) => {
                const status = todayRecord[student.id];
                const stats = calculateStudentStats(student.id, attendance);
                return (
                  <tr key={student.id}>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          {student.name.charAt(0)}
                        </div>
                        <div className="student-meta">
                          <h4>{student.name}</h4>
                          <span>{student.email || 'No email provided'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="reg-code">{student.registerNumber}</span>
                    </td>
                    <td>{student.studentClass}</td>
                    <td>
                      {status === 'present' ? (
                        <span className="badge badge-present">Present</span>
                      ) : status === 'absent' ? (
                        <span className="badge badge-absent">Absent</span>
                      ) : (
                        <span className="badge badge-neutral">Not Marked</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{stats.percentage}%</span>
                        <div className="progress-container" style={{ width: '60px', height: '6px' }}>
                          <div 
                            className={`progress-bar progress-${stats.statusColor}`} 
                            style={{ width: `${stats.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
