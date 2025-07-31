# Class Payment Tracker

A web application to track and manage class payments efficiently. Keep organized with your educational expenses and payment history.

## Features

- 🌙 Dark/Light theme toggle
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- ⚡ Built with Next.js 14

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd class-note
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development TODO

### 🚀 Phase 1: Core Features (High Priority)

#### Data Models & Structure
- [ ] Define TypeScript interfaces for:
  - [ ] Class (id, name, instructor, cost, date, status, category)
  - [ ] Payment (id, classId, amount, date, method, receipt)
  - [ ] Instructor (id, name, contact, specialties)
  - [ ] Category (id, name, color, description)

#### Class Management
- [ ] Create class entry form component
  - [ ] Form validation
  - [ ] Date picker integration
  - [ ] Cost input with currency formatting
  - [ ] Instructor selection/creation
  - [ ] Category selection
- [ ] Class list view with:
  - [ ] Search functionality
  - [ ] Filter by status, instructor, category
  - [ ] Sort by date, cost, name
  - [ ] Pagination
- [ ] Class detail view
- [ ] Edit/delete class functionality

#### Payment Tracking
- [ ] Payment status management (paid, pending, overdue)
- [ ] Payment history per class
- [ ] Receipt upload and storage
- [ ] Payment method tracking
- [ ] Due date reminders

### 💾 Phase 2: Data Management (Medium Priority)

#### Storage Solutions
- [ ] Choose and implement storage:
  - [ ] Local Storage (for demo/offline)
  - [ ] IndexedDB (for larger datasets)
  - [ ] Supabase/PostgreSQL (for production)
  - [ ] SQLite (for desktop app version)

#### Data Operations
- [ ] CRUD operations for all entities
- [ ] Data validation and error handling
- [ ] Backup and restore functionality
- [ ] Data import/export (CSV, JSON)
- [ ] Data migration scripts

### 📊 Phase 3: Analytics & Reports (Medium Priority)

#### Dashboard & Statistics
- [ ] Enhanced dashboard with:
  - [ ] Total spending overview
  - [ ] Monthly/yearly spending trends
  - [ ] Top instructors by spending
  - [ ] Category breakdown
  - [ ] Payment status distribution

#### Charts & Visualizations
- [ ] Implement chart library (Chart.js, Recharts, or D3)
- [ ] Spending over time chart
- [ ] Category pie chart
- [ ] Instructor spending bar chart
- [ ] Monthly comparison charts

#### Reports
- [ ] Generate PDF reports
- [ ] Email reports functionality
- [ ] Tax deduction reports
- [ ] Instructor payment summaries
- [ ] Budget vs actual spending

### 🎨 Phase 4: UI/UX Enhancements (Low Priority)

#### User Experience
- [ ] Mobile-first responsive design
- [ ] Keyboard shortcuts
- [ ] Drag and drop for file uploads
- [ ] Loading states and skeletons
- [ ] Error boundaries and fallbacks
- [ ] Accessibility improvements (ARIA labels, screen reader support)

#### Advanced Features
- [ ] Multi-language support
- [ ] Currency conversion
- [ ] Recurring payment setup
- [ ] Payment reminders and notifications
- [ ] Calendar integration
- [ ] Export to accounting software

### 🔧 Phase 5: Technical Improvements (Low Priority)

#### Performance & Security
- [ ] Code splitting and lazy loading
- [ ] Image optimization
- [ ] Caching strategies
- [ ] Input sanitization
- [ ] Rate limiting
- [ ] Error logging and monitoring

#### Testing
- [ ] Unit tests for components
- [ ] Integration tests for data flow
- [ ] E2E tests for critical paths
- [ ] Performance testing

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── common/         # Shared components
│   ├── forms/          # Form components
│   ├── charts/         # Chart components
│   └── ui/             # UI components
├── lib/                # Utility functions
├── types/              # TypeScript definitions
└── hooks/              # Custom React hooks
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Theme**: Custom dark/light theme system
- **Icons**: (To be decided - Lucide, Heroicons, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [x] Project setup with Next.js
- [x] Basic styling with Tailwind CSS
- [x] Dark/light theme toggle
- [x] Responsive layout
- [ ] Core CRUD operations
- [ ] Data persistence
- [ ] Analytics dashboard
- [ ] Export functionality
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)

---

**Note**: This is a personal project for tracking class payments. Feel free to adapt and extend based on your specific needs!
