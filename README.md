# Pulse Staff - Advanced User Management Dashboard

Pulse Staff is a high-performance, responsive corporate employee directory and admin dashboard. It is custom-built using **React 19**, **TypeScript**, and **Vanilla CSS** (without third-party UI component libraries) for optimal speed, total design freedom, and complete responsiveness. 

The application integrates with the public **DummyJSON Users API** to deliver real-time data syncs, fully simulated persistent CRUD records, smooth micro-animations, glassmorphic menus, and an advanced dark mode system.

---

## Key Features

### 🌟 Dashboard Overview & Statistics
- **High-Level Counters:** Displays employee directory totals, active structural roles, unique departments, and employee gender ratios.
- **Ratios Analytics:** Beautiful CSS-based indicator bar charts that track female-to-male personnel statistics dynamically.
- **Recent Additions Slider:** Quick navigation links displaying recently inserted staff records for easy administrative access.

### 👥 Interactive Staff Directory (List & Grid Views)
- **Combined Search Filters:** Real-time character-by-character search across employee First Names, Last Names, and Email Addresses.
- **Corporate Categorization:** Advanced quick dropdown select filters to target specific genders or corporate organizational roles.
- **Dual Sorting Capabilities:** Fast toggling for alphabetical sorting (Name A-Z / Z-A) and numerical ranges (Age Low-High / High-Low).
- **Responsive Layout Toggle:** Effortlessly switch between a data-dense **Table View** (desktop optimization) and a visual **Card Grid View** (optimized for tablets and mobile devices).
- **Custom Pagination Row:** Structured pagination system showing 10 employees per page, complete with smart page count buttons.

### 📝 Client-Side CRUD Simulators & Forms
- **Add Employee Wizard:** A highly validated, glassmorphic multi-column Modal. Validates field completeness (e.g. Email format, phone patterns, and positive age checks) before sending updates.
- **Edit Employee Record:** Pre-fills all employee basic, location, and corporate details in the form.
- **Mock Persistence Roster:** Communicates live GET, POST, PUT, and DELETE HTTP requests with the DummyJSON API. Since DummyJSON is mock-only, the dashboard intercepts network payloads and updates an application-wide state engine, ensuring your created or edited employees persist flawlessly during your active session.
- **Visual Delete Dialog:** Custom caution modal with alert icons preventing accidental double-click deletions.

### 🎨 Visual & Performance Enhancements (Bonus Features)
- **Glassmorphic Theme Engine:** Fluid transition toggling between **Light Mode** and **Dark Mode**, persisting instantly via `localStorage`.
- **Global Toast Alerts:** A custom React Context Toast stack popping up sliding alerts (Success, Error, Info, Warning) with progress bar timers.
- **Shimmering Skeleton Loader:** Beautifully shaped loading bars matching tables and grid layouts during API calls.
- **Zero UI Libraries:** Built 100% from scratch with no Bootstrap, Tailwind, Ant Design, or Material UI to demonstrate pure HTML5, CSS3, and React development.

---

## Project Structure

```
src/
├── context/
│   ├── ThemeContext.tsx    # Persistent Light/Dark theme manager
│   └── ToastContext.tsx    # Context system triggering sliding toasts
├── components/
│   ├── Sidebar.tsx         # Responsive navigation panel
│   ├── Header.tsx          # Sticky glassmorphic dashboard header
│   ├── Modal.tsx           # Reusable backdrop dialog modal
│   ├── ConfirmDialog.tsx   # Custom delete warnings overlay
│   ├── UserFormModal.tsx   # Employee Add/Edit validated wizard
│   └── Skeleton.tsx        # Shimmering loading place cards
├── pages/
│   ├── Overview.tsx        # Dashboard metrics & department breakdown
│   ├── UserList.tsx        # Roster with search, filters, sorts & grids
│   └── UserDetails.tsx    # Tabbed details employee profile view
├── styles/
│   ├── variables.css       # Color variables, transitions & typography
│   ├── base.css            # Base browser resets & core animations
│   ├── dashboard.css       # Sidebar, Header & Content shell structure
│   ├── components.css      # Buttons, tables, pagination, toasts & forms
│   └── views.css           # Statistics, card rosters & profile page tabs
├── services/
│   └── api.ts              # API service module consuming DummyJSON
├── App.tsx                 # View router and layout shell
└── main.tsx                # Target mounting entry point
```

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (Version 18+ recommended) and `npm` installed.

### 1. Clone & Navigate
```bash
git clone <repository-link>
cd frontendtask
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open your browser and navigate to the local link (typically `http://localhost:5173`) to view the application in action!

### 4. Build for Production
```bash
npm run build
```
This command compiles the project into highly optimized static assets inside the `dist/` directory, ready for instant hosting.
