# AttendEase - Modern Student Attendance Tracker 🎓

**AttendEase** is a college-ready, responsive **Student Attendance Tracker** web application built with **React.js**, **JavaScript**, **HTML5**, and modern **CSS3**. It provides faculty coordinators, teachers, and department heads with an intuitive dashboard to manage student directories, record daily attendance, and analyze attendance performance.

Designed specifically for academic demonstrations (such as MCA/BCA/B.Tech final or mini project presentations), the application runs locally with zero external database dependencies by leveraging browser `localStorage`.

---

## 🌟 Key Features

### 1. Modern Navy-Themed Dashboard
- **Real-time Key Metrics:**
  - **Total Students** enrolled.
  - **Present Students** count and percentage for today.
  - **Absent Students** count.
  - **Overall Cumulative Attendance Percentage** across all recorded academic days.
- **Class-wise Attendance Distribution:** Visual progress bars for each section (e.g., MCA - 1st Year, MCA - 2nd Year).
- **Attendance Watchlist (< 75%):** Instant warning cards for students at risk of attendance shortage under university guidelines.
- **Today's Quick Roster Snapshot:** Immediate view of students' attendance status for today.

### 2. Comprehensive Student Management (`Students` Page)
- **Add New Students:** Full student profile including Name, Register Number, Course/Class, Gender, Email, and Phone number.
- **Input Validation:** Required field checks and duplicate register number prevention.
- **Edit Records:** Update student credentials via interactive modal dialog.
- **Delete Records:** Safe removal with confirmation modal.
- **Live Search & Filter:** Instant search by student name or register number, plus dropdown filtering by class.

### 3. Daily Attendance Tracking (`Attendance` Page)
- **Date Selector:** Calendar picker defaulting to today's date, with a quick "Today" shortcut button.
- **Interactive Marking:** Toggle students between **Present** and **Absent** with distinct color-coded buttons.
- **Batch Actions:** One-click **"Mark All Present"** and **"Mark All Absent"** shortcuts for high productivity.
- **Unsaved Changes Indicator:** Prompts the user when edits are pending.
- **Persistent Storage:** Changes are saved directly into `localStorage` and can be edited/updated for any past date anytime.

### 4. In-depth Analytics & Reports (`Reports` Page)
- **Academic Metrics:** Shows total academic sessions recorded, average batch attendance, and top performer.
- **Detailed Table View:** Displays Total Classes, Present Days, Absent Days, and calculated Attendance Percentage for each student.
- **Status Badges:** Color-coded eligibility indicators:
  - 🟢 **Excellent / Good (≥ 75%)**: Eligible for examinations.
  - 🔴 **Warning / Defaulter (< 75%)**: Condone/attendance shortage alert.
- **Filter by Eligibility:** Easily filter for defaulters (< 75%) or eligible students.
- **Export to CSV:** One-click download of the attendance report into a spreadsheet-compatible `.csv` file.

### 5. Persistent Local Storage & Demo Reset
- All data is preserved across page refreshes and browser restarts in `localStorage`.
- Includes realistic preloaded **MCA demonstration data** (10 students across 1st & 2nd Year with past 6 days of attendance history).
- Includes a **"Demo Data"** button in the top navigation bar to reset the dataset back to its original state anytime during a live presentation.

---

## 🎨 Color Theme & Design
- **Primary Navy Blue:** `#0a192f`, `#0f2744`, `#1b3a6b`
- **Accent Blue:** `#2563eb`, `#3b82f6`
- **Backgrounds:** Light grey `#f8fafc`, pure white card containers `#ffffff`
- **Status Accents:** Emerald Green `#10b981` (Present), Rose Red `#ef4444` (Absent), Amber `#f59e0b` (Warning)
- **Responsive Layout:** Adaptive sidebar with collapsible drawer on mobile and tablet devices.

---

## 📁 Project Structure

```text
student_attendence_tracker/
├── index.html                   # HTML entry point with Plus Jakarta Sans & JetBrains Mono fonts
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite configuration (port 3000)
├── README.md                    # Project documentation & presentation guide
├── src/
│   ├── main.jsx                 # React root renderer
│   ├── App.jsx                  # Main application state & navigation router
│   ├── index.css                # Global styles, variables & buttons
│   ├── App.css                  # Layout, sidebar, topbar, modal & responsive styles
│   ├── components/
│   │   ├── Sidebar.jsx          # Collapsible navy sidebar with icons
│   │   ├── Navbar.jsx           # Top header with date badge & demo reset
│   │   ├── StatCard.jsx         # Metric card component for KPI display
│   │   └── Modal.jsx            # Reusable popup dialog component
│   ├── pages/
│   │   ├── Dashboard.jsx        # Overview, metrics & watchlist
│   │   ├── Students.jsx         # CRUD student management & search
│   │   ├── Attendance.jsx       # Daily attendance register & batch marking
│   │   └── Reports.jsx          # Tabular analytics & CSV export
│   └── utils/
│       ├── sampleData.js        # Default demonstration records
│       ├── storage.js           # Browser localStorage manager
│       └── dateUtils.js         # Formatting and percentage calculation helpers
└── dist/                        # Production build output
```

---

## 🚀 How to Run the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Install Dependencies
Open your terminal in the project directory (`c:\student_attendence_tracker`) and run:

```bash
npm install
```

### 2. Start the Development Server
Run the following command to start the application:

```bash
npm run dev
```

The Vite dev server will start (typically at `http://localhost:3000` or `http://localhost:5173`). Open the URL in your web browser.

### 3. Build for Production (Optional)
To verify or generate an optimized production bundle:

```bash
npm run build
```

---

## 🎯 College MCA Demonstration Walkthrough

When demonstrating this project to professors, evaluators, or classmates, follow this recommended walkthrough:

1. **Dashboard Overview:**
   - Explain the 4 KPI cards: Total Students, Today's Present, Today's Absent, and Overall Percentage.
   - Point out the **Attendance Watchlist (< 75%)** which automatically flags students needing attendance condonation.
   - Show the class breakdown bar charts.

2. **Student Management (`Students` Tab):**
   - Demonstrate searching for a student (e.g. type `Aarav` or `24MCA`).
   - Click **"Add New Student"**, enter new details (e.g., `Rohit Mehra`, `24MCA06`), and show immediate validation and table addition.
   - Edit the student's name or contact information.
   - Demonstrate the delete modal.

3. **Marking Attendance (`Attendance` Tab):**
   - Select today's date or select a previous date to review past records.
   - Show the **"Mark All Present"** shortcut, then toggle 1 or 2 students to **"Absent"**.
   - Click **"Save Attendance"** and point out the toast confirmation.
   - Refresh the browser (F5) to show evaluator that all marks persist via `localStorage`.

4. **Analytics & Reports (`Reports` Tab):**
   - Show the overall batch attendance rate and highest performer.
   - Use the status filter dropdown to select **"Defaulters / Low (< 75%)"** to isolate students under the mandatory minimum.
   - Click **"Export CSV"** to demonstrate downloading the full attendance ledger to an Excel-compatible file.

5. **Reset Demo Data:**
   - Click the **"Demo Data"** button in the top navigation bar to showcase resetting back to the clean demonstration state.

