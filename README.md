# Caytori — IT Services Ticketing & Support Management Platform

> Centralize IT Support. Resolve Issues. Keep Business Moving.

Caytori is a multi-tenant web application designed to streamline IT support workflows. It replaces scattered communication channels with a centralized pipeline where employees report issues, IT teams manage resolutions, and administrators track performance metrics.

---

## Key Features

### Multi-Tenant Architecture
Isolated company environments ensuring data, departments, tickets, and metrics remain strictly compartmentalized.

### Role-Based Access Control (RBAC)
Dedicated interfaces and permissions configured across five distinct roles:
* **Platform Admin:** Manages tenant accounts and monitors global system statistics.
* **Company Admin:** Configures organization details, departments, and personnel.
* **IT Admin / Manager:** Oversees ticket queues, assigns tasks, and tracks resolution SLAs.
* **IT Staff:** Manages assigned workload, communicates with requesters, and resolves issues.
* **Employee:** Submits tickets, tracks real-time progress, and confirms final resolution.

### AI Integration
Integrated Gemini-powered chatbot for automated issue classification, real-time ticket triage, and conversational support.

### 4-Stage Ticket Lifecycle
Structured state progression for transparent issue tracking:
`OPEN` ➔ `IN_PROGRESS` ➔ `RESOLVED` ➔ `CLOSED`
* **OPEN:** Initial ticket submission by the employee.
* **IN_PROGRESS:** Active triage and technical troubleshooting by IT staff.
* **RESOLVED:** Technical fix implemented by IT staff.
* **CLOSED:** Ticket closure confirmed and verified by the employee.

### Statistics & Analytics
Centralized dashboard tracking open ticket volume, category distribution, department request rates, and mean time to resolution (MTTR).

### Modern UI & Experience
Neumorphic design system built with Tailwind CSS, featuring full dark and light mode support and responsive layouts.
---

## Ticket Business Rules

1. **Company Scope**: Every ticket belongs strictly to one company tenant.
2. **Assignment**: A ticket can be assigned to one IT Staff member at a time.
3. **Privacy**: Employees can only view their own reported tickets, while IT Admins can manage all company tickets.
4. **Resolution Confirmation**: Only the reporting employee can confirm and close a resolved ticket, ensuring actual problem resolution before closure.

---

## 📄 License

This project is proprietary and confidential. Unauthorized copying or distribution is strictly prohibited.
