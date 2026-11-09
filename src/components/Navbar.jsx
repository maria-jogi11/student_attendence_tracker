import React from 'react';
import { Menu, Calendar, RotateCcw } from 'lucide-react';
import { formatDateDisplay, getTodayDateString } from '../utils/dateUtils';

const PAGE_TITLES = {
  dashboard: 'Attendance Dashboard',
  students: 'Student Directory',
  attendance: 'Mark Daily Attendance',
  reports: 'Attendance Analytics & Reports'
};

export default function Navbar({ activeTab, onToggleMobile, onResetDemoData }) {
  const todayFormatted = formatDateDisplay(getTodayDateString());

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button 
          className="menu-toggle-btn" 
          onClick={onToggleMobile} 
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h2 className="page-title">{PAGE_TITLES[activeTab] || 'AttendEase'}</h2>
        </div>
      </div>

      <div className="topbar-right">
        <div className="system-date-pill">
          <Calendar size={15} />
          <span>{todayFormatted}</span>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={onResetDemoData}
          title="Restore original sample records for demonstration"
        >
          <RotateCcw size={14} />
          <span>Demo Data</span>
        </button>
      </div>
    </header>
  );
}

