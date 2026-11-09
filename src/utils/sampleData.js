// Sample Student and Attendance Data for AttendEase
// Suitable for College MCA Demonstration

export const INITIAL_STUDENTS = [
  {
    id: "std-001",
    name: "Aarav Sharma",
    registerNumber: "24MCA01",
    studentClass: "MCA - 1st Year",
    gender: "Male",
    email: "aarav.sharma@college.edu",
    phone: "+91 98765 43210"
  },
  {
    id: "std-002",
    name: "Ananya Iyer",
    registerNumber: "24MCA02",
    studentClass: "MCA - 1st Year",
    gender: "Female",
    email: "ananya.iyer@college.edu",
    phone: "+91 98765 43211"
  },
  {
    id: "std-003",
    name: "Rohan Verma",
    registerNumber: "24MCA03",
    studentClass: "MCA - 1st Year",
    gender: "Male",
    email: "rohan.verma@college.edu",
    phone: "+91 98765 43212"
  },
  {
    id: "std-004",
    name: "Sneha Patel",
    registerNumber: "24MCA04",
    studentClass: "MCA - 1st Year",
    gender: "Female",
    email: "sneha.patel@college.edu",
    phone: "+91 98765 43213"
  },
  {
    id: "std-005",
    name: "Vikramaditya Rao",
    registerNumber: "24MCA05",
    studentClass: "MCA - 1st Year",
    gender: "Male",
    email: "vikram.rao@college.edu",
    phone: "+91 98765 43214"
  },
  {
    id: "std-006",
    name: "Pooja Nair",
    registerNumber: "23MCA11",
    studentClass: "MCA - 2nd Year",
    gender: "Female",
    email: "pooja.nair@college.edu",
    phone: "+91 98765 43215"
  },
  {
    id: "std-007",
    name: "Karthik Menon",
    registerNumber: "23MCA12",
    studentClass: "MCA - 2nd Year",
    gender: "Male",
    email: "karthik.m@college.edu",
    phone: "+91 98765 43216"
  },
  {
    id: "std-008",
    name: "Diya Deshmukh",
    registerNumber: "23MCA13",
    studentClass: "MCA - 2nd Year",
    gender: "Female",
    email: "diya.d@college.edu",
    phone: "+91 98765 43217"
  },
  {
    id: "std-009",
    name: "Arjun Reddy",
    registerNumber: "23MCA14",
    studentClass: "MCA - 2nd Year",
    gender: "Male",
    email: "arjun.reddy@college.edu",
    phone: "+91 98765 43218"
  },
  {
    id: "std-010",
    name: "Meera Krishnan",
    registerNumber: "23MCA15",
    studentClass: "MCA - 2nd Year",
    gender: "Female",
    email: "meera.k@college.edu",
    phone: "+91 98765 43219"
  }
];

// Helper to generate past dates in YYYY-MM-DD
function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

// Generate sample attendance for recent 7 days
export const generateInitialAttendance = () => {
  const attendance = {};

  // Recent 6 working days
  const pastDays = [5, 4, 3, 2, 1, 0];

  pastDays.forEach((daysAgo, index) => {
    const dateKey = getPastDate(daysAgo);
    attendance[dateKey] = {
      // std-001 has 100%
      "std-001": "present",
      // std-002 has high attendance
      "std-002": index === 2 ? "absent" : "present",
      // std-003 has good attendance
      "std-003": index === 4 ? "absent" : "present",
      // std-004 has average attendance
      "std-004": index % 2 === 0 ? "present" : "absent",
      // std-005 has lower attendance (good for <75% warning demonstration)
      "std-005": index > 2 ? "present" : "absent",
      // std-006 has 100%
      "std-006": "present",
      // std-007 has 1 absent
      "std-007": index === 1 ? "absent" : "present",
      // std-008 has 100%
      "std-008": "present",
      // std-009 has low attendance (needs warning)
      "std-009": index === 0 || index === 3 ? "present" : "absent",
      // std-010 has high attendance
      "std-010": index === 5 ? "absent" : "present"
    };
  });

  return attendance;
};

