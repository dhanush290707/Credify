
# Credify - Modern Loan Management Platform

Credify is a comprehensive, role-based Loan Management Dashboard and Platform built with modern web technologies. It is designed to streamline the lending process by connecting borrowers, lenders, financial analysts, and administrators within a single, cohesive ecosystem.

![Credify Platform Overview](https://images.unsplash.com/photo-1592698765727-387c9464cd7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwZGlnaXRhbCUyMGJhbmtpbmclMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzcxNDkwMjczfDA&ixlib=rb-4.1.0&q=80&w=1080)

## 🌟 Key Features

- **Role-Based Access Control (RBAC):** Distinct dashboards, permissions, and tools tailored specifically for Administrators, Lenders, Borrowers, and Financial Analysts.
- **End-to-End Loan Lifecycle:** Complete management from loan application and risk assessment to approval, disbursement, and EMI tracking.
- **Real-time Analytics:** Interactive charts and metrics tracking active loans, revenue, default rates, and platform growth.
- **Automated Amortization:** Built-in EMI calculators and automatic payment schedule generation.
- **Secure Authentication:** Session state management with CAPTCHA validation.
- **Responsive Design:** A beautiful, accessible UI built with Tailwind CSS and Radix UI primitives that works flawlessly on desktop and mobile.

---

## 👥 User Roles & Dashboards

### 1. 🛡️ Administrator
The overarching supervisor of the platform.
- **Capabilities:** Manage all users, oversee all active/pending loans, handle system-wide settings, and monitor top-level platform revenue and statistics.
- **Key Modules:** Users Page, System Reports, Platform Analytics.

### 2. 💰 Lender
The capital provider.
- **Capabilities:** Review loan applications, approve/reject funding requests, track investment portfolios, and monitor repayment schedules.
- **Key Modules:** Lender Dashboard, Loan Offers, Investment Analytics.

### 3. 📝 Borrower
The capital seeker.
- **Capabilities:** Apply for personal or business loans, view active loan statuses, track upcoming payments, and review transaction history.
- **Key Modules:** Borrower Dashboard, My Loans, Payment Portal.

### 4. 📊 Financial Analyst
The risk assessor.
- **Capabilities:** Evaluate borrower credit scores, assess loan default risks, generate detailed financial reports, and analyze market trends.
- **Key Modules:** Risk Analysis Page, Advanced Analytics, Reporting Engine.

---

## 🛠️ Technology Stack

- **Frontend Framework:** [React 18](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/) - Lightning-fast HMR and optimized builds.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first styling.
- **UI Components:** Customized elements based on [shadcn/ui](https://ui.shadcn.com/) (using Radix UI).
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Context API (`AppContext.jsx`) with `localStorage` persistence.
- **Routing:** Component-level conditional rendering mapped to a custom Sidebar implementation.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dhanush290707/Credify.git
   cd Credify
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   Navigate to `http://localhost:5173` in your browser.

---

## 🔐 Demo Credentials

The platform comes pre-seeded with mock data for testing purposes. You can log in using any of the following credentials (Password for all is `Password1!`):

| Role | Email |
| :--- | :--- |
| **Admin** | `admin@credify.com` |
| **Lender** | `sarah@example.com` |
| **Borrower** | `john@example.com` |
| **Analyst** | `analyst@credify.com` |

> *Note: Remember to select the correct Role from the dropdown on the login page.*

---

## 📦 Deployment

This project is optimized for deployment on Vercel. A `vercel.json` configuration is included to handle client-side routing.

1. Push your code to a GitHub repository.
2. Import the repository into your Vercel dashboard.
3. Vercel will automatically detect the Vite preset. Click **Deploy**.

---

*Designed and developed to make loan management accessible, transparent, and efficient.*
  