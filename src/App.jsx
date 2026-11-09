import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import { 
  loadStudents, 
  saveStudents, 
  loadAttendance, 
  saveAttendance, 
  resetToSampleData 
} from './utils/storage';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Core Data States with localStorage persistence
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Initialize data on mount
  useEffect(() => {
    const loadedStudents = loadStudents();
    const loadedAttendance = loadAttendance();
    setStudents(loadedStudents);
    setAttendance(loadedAttendance);
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Student Actions
  const handleAddStudent = (newStudent) => {
    const updated = [newStudent, ...students];
    setStudents(updated);
    saveStudents(updated);
  };

  const handleUpdateStudent = (updatedStudent) => {
    const updated = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
    setStudents(updated);
    saveStudents(updated);
  };

  const handleDeleteStudent = (studentId) => {
    const updated = students.filter((s) => s.id !== studentId);
    setStudents(updated);
    saveStudents(updated);
  };

  // Attendance Actions
  const handleSaveAttendance = (dateStr, dateAttendanceMap) => {
    const updatedAttendance = {
      ...attendance,
      [dateStr]: dateAttendanceMap
    };
    setAttendance(updatedAttendance);
    saveAttendance(updatedAttendance);
  };

  // Reset to Demo Data
  const handleResetDemoData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all data back to the default MCA demonstration records? Any custom students added will be replaced.'
    );
    if (confirmed) {
      const reset = resetToSampleData();
      setStudents(reset.students);
      setAttendance(reset.attendance);
      showToast('Reset to original demonstration records completed', 'success');
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <Navbar
          activeTab={activeTab}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          onResetDemoData={handleResetDemoData}
        />

        <main className="content-body">
          {activeTab === 'dashboard' && (
            <Dashboard
              students={students}
              attendance={attendance}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'students' && (
            <Students
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              showToast={showToast}
            />
          )}

          {activeTab === 'attendance' && (
            <Attendance
              students={students}
              attendance={attendance}
              onSaveAttendance={handleSaveAttendance}
              showToast={showToast}
            />
          )}

          {activeTab === 'reports' && (
            <Reports
              students={students}
              attendance={attendance}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global Toast Notifications */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} style={{ color: 'var(--present-color)' }} />
            ) : (
              <AlertCircle size={18} style={{ color: 'var(--absent-color)' }} />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

