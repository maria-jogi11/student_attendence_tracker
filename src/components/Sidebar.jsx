import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  BarChart3, 
  X, 
  GraduationCap,
  Sparkles
} from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            zIndex: 45,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <div className="brand-icon-box">
              <GraduationCap size={22} strokeWidth={2.4} />
            </div>
            <div>
              <h1 className="brand-title">Attend<span>Ease</span></h1>
              <div className="brand-subtitle">Attendance System</div>
            </div>
          </div>
          <button 
            className="sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
              >
                <Icon size={19} className="nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="college-badge-card">
            <div className="college-avatar">
              <Sparkles size={16} />
            </div>
            <div className="college-info">
              <h4>Department of MCA</h4>
              <p>Academic Year 2026-27</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

