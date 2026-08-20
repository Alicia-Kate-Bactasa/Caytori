# Caytori — IT Services Ticketing & Support Management Platform

> **Centralize IT Support. Resolve Issues. Keep Business Moving.**

Caytori is a multi-company web application designed to centralize and streamline IT support workflows. Instead of scattered communication across emails, messaging apps, and verbal requests, Caytori provides a structured ticketing pipeline where employees report issues, IT personnel manage resolution, and companies track performance through clear analytics.

---

## 🚀 Key Features

- 🏢 **Multi-Tenant Architecture**: Isolated company environments keeping users, departments, tickets, and metrics strictly compartmentalized.
- 👥 **Role-Based Access Control (RBAC)**: Custom views and permissions tailored across 5 roles:
  - **Platform Admin**: Manages tenant companies and overall system statistics.
  - **Company Admin**: Configures company details, departments, employees, and IT personnel.
  - **IT Admin / Manager**: Oversees ticket queues, assigns/reassigns tasks, and monitors resolution SLAs.
  - **IT Staff**: Tracks assigned work, communicates with requesters, and resolves technical issues.
  - **Employee**: Submits IT tickets, tracks live status, and confirms issue resolution.
- 🔄 **4-Stage Ticket Lifecycle**:
  `OPEN` ➔ `IN_PROGRESS` ➔ `RESOLVED` ➔ `CLOSED`
  - Employees submit issues.
  - IT Staff investigate and mark issues as **RESOLVED**.
  - Employees verify the fix to transition tickets to **CLOSED** (or reopen to **IN_PROGRESS** if needed).
- 📊 **Statistics & Analytics**: Transparent dashboard metrics tracking open/in-progress tickets, category breakdown, department request volume, and average resolution times.
- 🎨 **Modern & Accessible UI**: Clean neumorphic aesthetic built with Tailwind CSS, supporting dark & light mode themes and fluid layout animations.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Formatter**: [OxFmt](https://oxc.rs/)

---

## 📂 Project Structure

```text
Caytori/
├── index.html            # Main HTML entry point
├── package.json          # Project metadata & dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
├── .gitignore            # Git ignore rules
└── src/
    ├── main.tsx          # Application bootstrapper
    ├── App.tsx           # Main application view switcher & theme provider
    ├── index.css         # Global styles & theme tokens
    ├── data.ts           # Data models, mock tickets, and analytics logic
    └── components/
        ├── AppShell.tsx  # Main application layout, sidebar navigation, top bar
        ├── Landing.tsx   # Marketing & feature overview page
        ├── Login.tsx     # Role-selection & authentication screen
        ├── Dashboard.tsx # Role-specific dashboard overview & KPI metrics
        ├── Tickets.tsx   # Interactive ticket management & creation forms
        ├── Analytics.tsx # Statistical charts & ticket metrics breakdown
        ├── Directory.tsx # Companies, employees, IT team, and department directories
        ├── Settings.tsx  # Company & platform settings management
        ├── Profile.tsx   # User profile overview & preferences
        └── primitives.tsx# Shared UI primitives (Cards, Buttons, Badges, Modals)
```

---

## 🎫 Ticket Business Rules

1. **Company Scope**: Every ticket belongs strictly to one company tenant.
2. **Assignment**: A ticket can be assigned to one IT Staff member at a time.
3. **Privacy**: Employees can only view their own reported tickets, while IT Admins can manage all company tickets.
4. **Resolution Confirmation**: Only the reporting employee can confirm and close a resolved ticket, ensuring actual problem resolution before closure.

---

## 📄 License

This project is proprietary and confidential. Unauthorized copying or distribution is strictly prohibited.
