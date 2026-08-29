# 🎨 Enterprise Car Rental — Frontend Tier

A modern, responsive, high-performance car rental application built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and **Recharts**.

---

## 📱 Pages & Features

- **`/` (Customer Portal)**:
  - Hero Section with quick search & date picker
  - Interactive Fleet Catalog with category filters, seat filters, and price sliders
  - Instant Vehicle Booking Modal with protection packages and price calculator
  - Floating AI Concierge Chat Widget with live RAG answers
  - Customer Testimonials & FAQ Section
- **`/admin` (Admin Executive Dashboard)**:
  - KPI Metrics (Total Revenue, Active Rentals, Fleet Utilization, Conversion Rate)
  - Revenue & Expenses monthly bar & area chart (Recharts)
  - Fleet Category Distribution donut chart
  - Live Booking Table with instant status updates (`Pending`, `Confirmed`, `Active`, `Completed`, `Cancelled`)
- **`/rag-tester` (RAG Vector Inspector)**:
  - Live Semantic Search query tester
  - Similarity score metrics visualizer
  - Knowledge Base chunk inspector

---

## 🛠️ Development & Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build validation
npm run build
```

---

## 🚀 Branch Promotion Workflow

```
feat/nextjs-frontend -> test -> dev -> main
```
All pull requests and merges must pass CI build validation in `.github/workflows/ci.yml`.
