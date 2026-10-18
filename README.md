# Caytori — IT Services Ticketing & Support Management Platform

> Centralize IT Support. Resolve Issues. Keep Business Moving.

Caytori is a multi-company web application designed to centralize and streamline IT support workflows. In many organizations, employees report technical issues through scattered channels such as personal messages, emails, chat apps, or verbal requests. This informal approach causes support teams to lose track of ticket owners, severity levels, resolution times, and recurring equipment faults.

Caytori replaces scattered communication with a structured support workflow:
1. **Employees report** issues with department context, category, and priority.
2. **IT Support receives** tickets in a centralized queue and assigns them to the appropriate technician.
3. **IT Technicians investigate**, resolve, or escalate issues through defined support tiers.
4. **Employees verify and confirm** the resolution before a ticket is officially closed.
5. **Managers and administrators track** performance, workload, and trends across departments through clear dashboards.

The platform is built to support organizations of all sizes, from small companies with a single IT technician to enterprises with multi-tier IT support structures and multiple departments.

---

## Tech Stack

### Frontend

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-F56565?style=for-the-badge&logo=lucide&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white)

### Backend

![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Entity Framework Core](https://img.shields.io/badge/Entity_Framework_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-02569B?style=for-the-badge&logo=fastapi&logoColor=white)
![OpenAPI](https://img.shields.io/badge/OpenAPI_3.0-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

### Database

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Supabase Auth](https://img.shields.io/badge/Supabase_Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Supabase Storage](https://img.shields.io/badge/Supabase_Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)
![OxFmt](https://img.shields.io/badge/OxFmt-FF5722?style=for-the-badge&logo=rust&logoColor=white)

---

## System Overview

Caytori is built as a multi-tenant platform with clear security boundaries, deterministic workflows, and defined user responsibilities.

### How Caytori Works

```text
[Employee Reports Issue]
         │
         ▼
[OPEN Ticket in Company Queue] ───► SLA Timer Begins
         │
         ▼
[IT Lead Triages & Assigns to Technician]
         │
         ▼
[IN_PROGRESS: Technician Investigates / Troubleshoots]
         │
         ├── Needs higher level support? ──► [Escalate L1 ➔ L2 ➔ L3 ➔ Lead]
         │
         ▼
[IT Technician Marks RESOLVED]
         │
         ▼
[Employee Verifies Solution]
         │
         ├── Fixed? ──────► [CLOSED] (Ticket Completed)
         └── Not Fixed? ──► [IN_PROGRESS] (Reopened for further work)
```

### User Roles and Responsibilities

Caytori includes five distinct roles organized into two scopes:

#### System Scope
- **Platform Admin (Caytori Admin)**: Operates the cross-tenant platform. Registers, suspends, and activates company tenants. Toggles global self-registration settings and monitors aggregate platform metrics without accessing company ticket details or employee information.

#### Tenant Scope
- **Company Admin**: Manages company organizational settings, departments, department heads, and user invitations. Has audit access to view all company tickets and reports.
- **IT Lead**: Owns and manages the company ticket queue. Switches between all tickets and unassigned tickets, assigns tickets to technicians, manages escalations, and monitors SLA breaches and team workload.
- **IT Technician (L1 / L2 / L3)**: Focuses exclusively on assigned tickets (`My Assigned Tickets`). Starts work on open tickets, communicates with reporting employees, escalates complex issues to higher tiers, and marks tickets as resolved.
- **Employee**: Reports workplace technical issues. Tracks personal tickets (`My Tickets`), communicates with assigned technicians via comments, and confirms resolution to close the ticket or reopen it if the problem persists.

### Ticket Lifecycle

1. `OPEN`: Issue submitted by an employee. The ticket is placed in the company queue and awaits triage or assignment.
2. `IN_PROGRESS`: Ticket is claimed or assigned to an IT technician who is actively investigating or fixing the issue.
3. `RESOLVED`: The IT technician has resolved the issue and added resolution notes.
4. `CLOSED`: The reporting employee verifies that the issue is resolved and confirms closure.

### SLA and Overdue Rules

To ensure issues are addressed promptly, Caytori enforces target resolution windows based on ticket priority:

| Priority | Target Resolution Window | Overdue Rule |
|---|---|---|
| **Critical** | 8 Hours | Flagged with urgent badge and prominent dashboard alert if uncompleted after 8h |
| **High** | 24 Hours | Flagged with overdue badge and escalation prompt if uncompleted after 24h |
| **Medium** | 48 Hours | Flagged with overdue indicator if uncompleted after 48h |
| **Low** | 72 Hours | Monitored with target indicator if uncompleted after 72h |

---

## Key Features and Integrations

### Key Features

- **Multi-Tenant Architecture**: Strict company-level data isolation ensuring users only see data belonging to their company.
- **Role-Based Access Control**: Five distinct roles with least-privilege permissions preventing unauthorized access across administrative and operational actions.
- **Queue and Dispatch Management**: Dedicated queue switcher allowing IT Leads to filter between unassigned issues and the complete ticket list.
- **Tiered Escalation Matrix**: Support escalation through defined levels (`L1 Support` ➔ `L2 Support` ➔ `L3 Support` ➔ `IT Lead`) with required handover notes and a safeguard preventing downward downgrades.
- **Employee Verification Gate**: Only the employee who reported the issue can verify and mark a ticket as closed, guaranteeing that IT staff cannot close tickets prematurely.
- **Reopen Policy Enforcement**: Company administrators can configure whether employees are permitted to reopen resolved tickets.
- **Live Notifications**: Real-time notification feed derived from the latest ticket status updates, assignments, and comments.
- **Comprehensive Reports and Analytics**: Visual charts breaking down ticket volume by category, department, priority, and status, along with average resolution time calculations.
- **Clean Neumorphic Interface**: Accessible UI featuring soft surfaces, clear typography, dark and light theme options, and non-blocking modal drawers.

### Integrations

- **Postman API Collection**: Full suite of 30 ready-to-test API requests covering authentication, companies, departments, users, tickets, comments, and settings.
- **OpenAPI 3.0 Specification**: Formal machine-readable contract defining all endpoints, request schemas, parameters, and response structures.
- **Planned Supabase Integration**: Cloud-hosted PostgreSQL database, row-level security policies, user authentication, and file storage.
- **Planned Resend Email Service**: Automated transactional emails for employee invitation links, ticket creation receipts, technician assignments, and SLA breach notices.

---

## Repository Structure

```text
Caytori/
├── .gitignore                          # Rules for excluded files and build artifacts
├── README.md                           # Project documentation and technical reference
├── index.html                          # Single-page application HTML entry point
├── package.json                        # Dependencies, scripts, and project metadata
├── package-lock.json                   # Deterministic package dependency tree
├── tsconfig.json                       # TypeScript compiler options
├── vite.config.ts                      # Vite build configuration with Tailwind CSS plugin
├── docs/
│   └── ROLES_AND_FEATURES_FINAL.md     # System specification and user story definitions
├── postman/
│   ├── collections/
│   │   └── Caytori API.collection.json # 30 API requests for testing and development
│   ├── environments/
│   │   ├── Local.postman_environment.json      # Local development environment configuration
│   │   └── Production.postman_environment.json # Production environment configuration
│   ├── globals/
│   │   └── workspace.globals.yaml      # Global Postman variables
│   └── specs/
│       └── caytori-openapi.yaml        # OpenAPI 3.0 REST API specification
├── public/
│   └── favicon.png                     # Application browser favicon
└── src/
    ├── App.tsx                         # Main view router, role switching, and global state
    ├── data.ts                         # Data models, mock records, SLA helpers, and utilities
    ├── index.css                       # Global styles, color tokens, and neumorphic surface classes
    ├── main.tsx                        # React application bootstrap entry point
    ├── vite-env.d.ts                   # Vite environment type declarations
    ├── components/
    │   ├── Analytics.tsx               # Analytics charts and resolution performance graphs
    │   ├── AppShell.tsx                # Application shell with sidebar, header, and live alerts
    │   ├── Dashboard.tsx               # Role-specific KPI metrics and workload overviews
    │   ├── Directory.tsx               # Company, department, employee, and IT staff directories
    │   ├── Hierarchy.tsx               # IT support tier management and escalation configuration
    │   ├── Landing.tsx                 # Public product overview and feature demonstration page
    │   ├── Login.tsx                   # User login and role selection screen
    │   ├── Profile.tsx                 # User profile settings and notification preferences
    │   ├── Settings.tsx                # Company profile and ticket policy configuration
    │   ├── Tickets.tsx                 # Ticket queue, creation forms, filters, and detail modals
    │   └── primitives.tsx              # Reusable UI components (Buttons, Cards, Badges, Modals)
    ├── imports/
    │   └── Caytori_Final_Logo.png      # Official brand logo asset
    └── utils/
        └── validation.ts               # Input validation rules for forms and escalation notes
```

---

## Future Plans with Projects

The development roadmap for Caytori is structured into six focused projects:

### Project 1: Database and Backend API Integration
- Implement the .NET and ASP.NET Core REST API based on the OpenAPI 3.0 specification (`postman/specs/caytori-openapi.yaml`).
- Connect the application to Supabase PostgreSQL database.
- Implement Row Level Security (RLS) policies to enforce multi-tenant isolation at the database level.
- Replace local state mock data with live API client queries and mutations.

### Project 2: Transactional Email and Alerts
- Integrate the Resend email service for transactional messaging.
- Send secure invitation emails with activation tokens to newly invited employees and IT staff.
- Send instant notification emails when tickets are assigned, commented on, or escalated.
- Implement automated email alerts when a ticket approaches or breaches its SLA deadline.

### Project 3: File and Screenshot Attachments
- Connect Supabase Storage buckets for secure file uploads.
- Allow employees to attach error screenshots, system crash logs, and diagnostic documents during ticket creation.
- Add image preview and document download capabilities inside the ticket conversation view.

### Project 4: Help Center and Knowledge Base
- Build a company-specific knowledge base containing self-help troubleshooting guides and FAQs.
- Implement intelligent search suggestions that recommend relevant articles while an employee types an issue description.
- Track article helpfulness metrics to identify common recurring issues that require permanent IT fixes.

### Project 5: Automated Ticket Rules and Auto-Escalation
- Create automated background tasks that monitor ticket age and trigger alerts before SLA limits expire.
- Implement auto-assignment rules that assign new tickets to available technicians based on current workload.
- Automatically escalate unacknowledged Critical and High tickets to the IT Lead when target response times are exceeded.

### Project 6: Mobile Application and Vendor Portal
- Develop a responsive mobile application for IT technicians working on-site or in the field.
- Support push notifications on mobile devices for urgent ticket assignments.
- Build an external vendor portal allowing companies to securely collaborate with third-party IT service providers.

---

## Ticket Business Rules

1. **Company Scope**: Every ticket belongs strictly to one company tenant. Cross-company access is blocked.
2. **Single Assignee**: A ticket can be assigned to one IT staff member at a time to maintain clear accountability.
3. **Data Privacy**: Employees can only view tickets they created. IT Technicians view their assigned tickets. IT Leads and Company Admins can review all company tickets.
4. **Resolution Confirmation**: Only the reporting employee can confirm and close a resolved ticket, ensuring issues are truly resolved before closure.
5. **Immutable History**: All comments, status transitions, and escalation notes are permanently preserved in the ticket activity log for audit compliance.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Alicia-Kate-Bactasa/Caytori.git
cd Caytori
```

2. Install dependencies:
```bash
npm install
```

3. Start the local development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

---

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or commercial use is strictly prohibited.
