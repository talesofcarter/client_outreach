# Tracker: Premium Outreach & Pipeline CRM

Tracker is a full-stack, enterprise-grade Customer Relationship Management (CRM) platform designed to track business outreach, pipeline progression, and lead conversion.

Built with a relentless focus on UI/UX, Tracker features a pristine, neo-minimalist design language inspired by Google Drive and Linear, utilizing floating panels, glassmorphism, and high-contrast typography to deliver a premium user experience.

## ✨ Key Features

- **Interactive Command Dashboard:** High-level KPIs, pending follow-ups, and a dynamic snapshot of recent outreach activity.
- **Comprehensive Lead Directory:** A high-performance, client-side filtered data table for instantly searching and sorting leads by status, region, or category.
- **Slide-Out CRUD Panels:** Seamless context preservation using URL-parameter-driven slide-out drawers for creating and editing leads without losing your place in the app.
- **Data Visualization & Analytics:** Interactive, responsive charting powered by Recharts (Pipeline Doughnut, Category Bar Graphs, and Regional Horizontal Bars) paired with custom premium tooltips.
- **Custom Design System:** Zero native browser alerts. All interactions utilize custom-built, animated modals with deep shadowing and ambient glows.
- **Smart Responsive Sidebar:** Context-aware navigation that gracefully retracts into an icon-only state on smaller viewports.
- **Secure Authentication:** JWT-based stateless authentication with secure cookie management and instantaneous client-cache purging on logout.

## 🛠️ Tech Stack

This project is structured as a monorepo containing both the frontend client and the backend API.

**Frontend (`apps/web`)**

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **Data Fetching & Caching:** TanStack Query (React Query)
- **Icons:** Lucide React
- **Charting:** Recharts

**Backend (`apps/api`)**

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL (using raw SQL queries via `pg-pool`)
- **Authentication:** Custom JWT Guards

## 🎨 Design Philosophy

Tracker is built on strict UI/UX principles:

1.  **Light & Clean:** Deep reliance on whitespace, light backgrounds (`#f8fafd`), and high-contrast typography rather than dark mode.
2.  **Context Overlays:** Modals and slide-out panels over page redirects. The user should always feel grounded in the application.
3.  **Strictly Custom:** Native HTML alerts (`window.confirm`) are strictly forbidden. Every dialogue, down to the 404 page, is a custom-engineered React component.
4.  **Subtle Elegance:** Strategic use of ambient background blurs (`blur-[100px]`), tracking-adjusted typography, and 1px borders.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (recommended package manager)
- PostgreSQL running locally or via a cloud provider

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/tracker-crm.git](https://github.com/yourusername/tracker-crm.git)
   cd tracker-crm
   ```
