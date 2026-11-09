import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Percent,
  CalendarCheck2
} from 'lucide-react';
import { calculateStudentStats } from '../utils/dateUtils';

export default function Reports({ students, attendance, showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'GOOD'

  // Total recorded sessions across the entire attendance database
  const totalRecordedDays = Object.keys(attendance).length;

  // Process report rows for each student
  const reportData = useMemo(() => {
    return students.map(student => {
      const stats = calculateStudentStats(student.id, attendance);
      return {
        ...student,
        ...stats
      };
    });
  }, [students, attendance]);

  // Unique classes for filtering
  const classesList = ['ALL', ...Array.from(new Set(students.map(s => s.studentClass).filter(Boolean)))];

  // Filtered rows
  const filteredData = useMemo(() => {
    return reportData.filter(item => {
      const matchSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.registerNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchClass = selectedClass === 'ALL' || item.studentClass === selectedClass;

      let matchStatus = true;
      if (statusFilter === 'CRITICAL') {
        matchStatus = item.percentage < 75;
      } else if (statusFilter === 'GOOD') {
        matchStatus = item.percentage >= 75;
      }

      return matchSearch && matchClass && matchStatus;
    });
  }, [reportData, searchTerm, selectedClass, statusFilter]);

  // Overall statistics for top summary
  const summary = useMemo(() => {
    if (reportData.length === 0) return { avgPercentage: 0, lowCount: 0, topStudent: null };

    const totalPercents = reportData.reduce((acc, curr) => acc + curr.percentage, 0);
    const avgPercentage = (totalPercents / reportData.length).toFixed(1);
    const lowCount = reportData.filter(r => r.totalClasses > 0 && r.percentage < 75).length;
    
    // Sort to find top student
    const sorted = [...reportData].sort((a, b) => b.percentage - a.percentage);
    const topStudent = sorted.length > 0 && sorted[0].totalClasses > 0 ? sorted[0] : null;

    return { avgPercentage, lowCount, topStudent };
  }, [reportData]);

  // Export report to CSV file
  const handleExportCSV = () => {
    if (reportData.length === 0) {
      showToast('No records available to export', 'error');
      return;
    }

    const headers = [
      'Register Number',
      'Student Name',
      'Class',
      'Gender',
      'Total Classes',
      'Present Days',
      'Absent Days',
      'Attendance Percentage (%)',
      'Academic Status'
    ];

    const rows = filteredData.map(item => [
      `"${item.registerNumber}"`,
      `"${item.name}"`,
      `"${item.studentClass}"`,
      `"${item.gender || 'N/A'}"`,
      item.totalClasses,
      item.presentDays,
      item.absentDays,
      item.percentage,
      `"${item.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AttendEase_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Report downloaded as CSV file', 'success');
  };

  return (
    <div>
      {/* Analytics Summary Cards */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '26px'
        }}
      >
        <div style={{ background: '#ffffff', padding: '18px 22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Academic Sessions
            </span>
            <div style={{ color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '6px', borderRadius: '8px' }}>
              <CalendarCheck2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary-900)' }}>
            {totalRecordedDays} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Days</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Total attendance sessions recorded
          </p>
        </div>

        <div style={{ background: '#ffffff', padding: '18px 22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Batch Average
            </span>
            <div style={{ color: '#2563eb', background: '#eff6ff', padding: '6px', borderRadius: '8px' }}>
              <Percent size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#2563eb' }}>
            {summary.avgPercentage}%
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Average student attendance rate
          </p>
        </div>

        <div style={{ background: '#ffffff', padding: '18px 22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Low Attendance (&lt; 75%)
            </span>
            <div style={{ color: 'var(--absent-color)', background: 'var(--absent-bg)', padding: '6px', borderRadius: '8px' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--absent-color)' }}>
            {summary.lowCount} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Students</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Below University minimum requirement
          </p>
        </div>

        <div style={{ background: '#ffffff', padding: '18px 22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Top Performer
            </span>
            <div style={{ color: 'var(--present-color)', background: 'var(--present-bg)', padding: '6px', borderRadius: '8px' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {summary.topStudent ? summary.topStudent.name : 'N/A'}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--present-text)', margin: '4px 0 0', fontWeight: 600 }}>
            {summary.topStudent ? `${summary.topStudent.percentage}% Attendance` : 'No data'}
          </p>
        </div>
      </div>

      {/* Filter and Export Bar */}
      <div className="search-filter-bar">
        <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
          <div className="search-input-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by student name or register no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-control"
              style={{ width: 'auto', padding: '9px 12px' }}
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
              style={{ width: 'auto', padding: '9px 12px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Attendance Status</option>
              <option value="GOOD">Eligible (≥ 75%)</option>
              <option value="CRITICAL">Defaulters / Low (&lt; 75%)</option>
            </select>
          </div>
        </div>

        <button 
          className="btn btn-outline-primary"
          onClick={handleExportCSV}
          title="Download report as CSV spreadsheet"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Clear Attendance Report Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <FileSpreadsheet size={20} style={{ color: '#1e3a8a' }} />
            Student Attendance Performance Report ({filteredData.length} Students)
          </h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Minimum Required Attendance: <strong>75%</strong>
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Register No.</th>
                <th>Class</th>
                <th style={{ textAlign: 'center' }}>Total Classes</th>
                <th style={{ textAlign: 'center' }}>Present Days</th>
                <th style={{ textAlign: 'center' }}>Absent Days</th>
                <th style={{ width: '180px' }}>Attendance Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No student records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  const isEligible = item.percentage >= 75;

                  return (
                    <tr key={item.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {index + 1}
                      </td>
                      <td>
                        <div className="student-cell">
                          <div className="student-avatar">
                            {item.name.charAt(0)}
                          </div>
                          <div className="student-meta">
                            <h4>{item.name}</h4>
                            <span>{item.email || 'Student'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="reg-code">{item.registerNumber}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {item.studentClass}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>
                        {item.totalClasses}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--present-color)' }}>
                        {item.presentDays}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--absent-color)' }}>
                        {item.absentDays}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700 }}>
                            <span style={{ color: isEligible ? 'var(--text-primary)' : 'var(--absent-color)' }}>
                              {item.percentage}%
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {item.presentDays}/{item.totalClasses}
                            </span>
                          </div>
                          <div className="progress-container">
                            <div 
                              className={`progress-bar progress-${item.statusColor}`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        {item.totalClasses === 0 ? (
                          <span className="badge badge-neutral">No Classes</span>
                        ) : isEligible ? (
                          <span className="badge badge-present">
                            <CheckCircle2 size={12} /> {item.status}
                          </span>
                        ) : (
                          <span className="badge badge-absent">
                            <AlertTriangle size={12} /> {item.status} (&lt;75%)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div 
          style={{ 
            padding: '16px 24px', 
            background: 'var(--bg-subtle)', 
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}
        >
          <div>
            Note: Students with <strong>&lt; 75%</strong> attendance require institutional condonation as per university regulations.
          </div>
          <div>
            Total active students evaluated: <strong>{filteredData.length}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

