import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Filter, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import Modal from '../components/Modal';

export default function Students({ students, onAddStudent, onUpdateStudent, onDeleteStudent, showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    studentClass: 'MCA - 1st Year',
    gender: 'Male',
    email: '',
    phone: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Unique classes list for filter
  const classesList = useMemo(() => {
    const set = new Set(students.map(s => s.studentClass).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [students]);

  // Filter & Search logic
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchClass = selectedClass === 'ALL' || student.studentClass === selectedClass;
      return matchSearch && matchClass;
    });
  }, [students, searchTerm, selectedClass]);

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      registerNumber: '',
      studentClass: 'MCA - 1st Year',
      gender: 'Male',
      email: '',
      phone: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      registerNumber: student.registerNumber,
      studentClass: student.studentClass || 'MCA - 1st Year',
      gender: student.gender || 'Male',
      email: student.email || '',
      phone: student.phone || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Student name is required';
    }
    if (!formData.registerNumber.trim()) {
      errors.registerNumber = 'Register number is required';
    } else {
      // Check for duplicate register number (excluding current student in edit mode)
      const duplicate = students.some(
        s => s.registerNumber.toLowerCase() === formData.registerNumber.trim().toLowerCase() &&
             (!editingStudent || s.id !== editingStudent.id)
      );
      if (duplicate) {
        errors.registerNumber = 'This register number already exists in records';
      }
    }
    if (!formData.studentClass.trim()) {
      errors.studentClass = 'Class / Course is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        name: formData.name.trim(),
        registerNumber: formData.registerNumber.trim().toUpperCase(),
        studentClass: formData.studentClass.trim(),
        gender: formData.gender,
        email: formData.email.trim(),
        phone: formData.phone.trim()
      });
      showToast('Student details updated successfully', 'success');
    } else {
      const newStudent = {
        id: `std-${Date.now()}`,
        name: formData.name.trim(),
        registerNumber: formData.registerNumber.trim().toUpperCase(),
        studentClass: formData.studentClass.trim(),
        gender: formData.gender,
        email: formData.email.trim(),
        phone: formData.phone.trim()
      };
      onAddStudent(newStudent);
      showToast('New student added successfully', 'success');
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      onDeleteStudent(studentToDelete.id);
      showToast(`Student ${studentToDelete.name} deleted`, 'success');
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  return (
    <div>
      {/* Top Controls & Search Bar */}
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
              style={{ width: 'auto', padding: '9px 14px' }}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classesList.map(c => (
                <option key={c} value={c}>{c === 'ALL' ? 'All Classes' : c}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <UserPlus size={16} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Students Data Table Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <GraduationCap size={20} style={{ color: '#1e3a8a' }} />
            Registered Students ({filteredStudents.length} of {students.length})
          </h3>
          {searchTerm && (
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Filtered for: "{searchTerm}"
            </span>
          )}
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Register Number</th>
                <th>Class / Year</th>
                <th>Gender</th>
                <th>Contact</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={32} style={{ color: '#94a3b8' }} />
                      <p style={{ fontWeight: 600 }}>No students found</p>
                      <p style={{ fontSize: '0.82rem' }}>Try adjusting your search criteria or add a new student.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <tr key={student.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', width: '40px' }}>
                      {idx + 1}
                    </td>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          {student.name.charAt(0)}
                        </div>
                        <div className="student-meta">
                          <h4>{student.name}</h4>
                          <span>{student.email || 'No email specified'}</span>
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
                      <span className="badge badge-neutral">{student.gender || 'Not specified'}</span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {student.phone || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEditModal(student)}
                          title="Edit Student Details"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--absent-color)', borderColor: '#fecaca' }}
                          onClick={() => handleOpenDeleteModal(student)}
                          title="Delete Student"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Edit Student Details' : 'Add New Student'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required">Student Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
            {formErrors.name && <div className="form-error">{formErrors.name}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label required">Register Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 24MCA01"
                value={formData.registerNumber}
                onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
              />
              {formErrors.registerNumber && <div className="form-error">{formErrors.registerNumber}</div>}
            </div>

            <div className="form-group">
              <label className="form-label required">Class / Program</label>
              <select
                className="form-control"
                value={formData.studentClass}
                onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
              >
                <option value="MCA - 1st Year">MCA - 1st Year</option>
                <option value="MCA - 2nd Year">MCA - 2nd Year</option>
                <option value="BCA - Final Year">BCA - Final Year</option>
                <option value="M.Sc Computer Science">M.Sc Computer Science</option>
              </select>
              {formErrors.studentClass && <div className="form-error">{formErrors.studentClass}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              className="form-control"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Email Address (Optional)</label>
              <input
                type="email"
                className="form-control"
                placeholder="student@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '24px -24px -24px -24px' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingStudent ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Student Deletion"
      >
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Are you sure you want to delete <strong>{studentToDelete?.name}</strong> (Register No: <strong>{studentToDelete?.registerNumber}</strong>)?
          </p>
          <div style={{ background: 'var(--absent-bg)', border: '1px solid var(--absent-border)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--absent-text)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>This action will permanently delete this student record from localStorage.</span>
          </div>
          <div className="modal-footer" style={{ margin: '24px -24px -24px -24px' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={handleConfirmDelete}
            >
              Yes, Delete Student
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

