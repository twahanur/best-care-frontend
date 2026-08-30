# 🎨 Best Care — Enterprise Modern Frontend Application

A state-of-the-art, high-performance, responsive web application engineered with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**. The application delivers a full-featured digital car rental platform for customers, dedicated trip portals for drivers, real-time executive analytics for administrators, and an embedded **Multilingual AI Concierge with a Live RAG Diagnostic Suite**.

---

## 📑 Table of Contents
1. [Architecture & Rendering Strategy](#-architecture--rendering-strategy)
2. [Complete Frontend Feature Matrix](#-complete-frontend-feature-matrix)
3. [Deep Dive: Portals & User Experiences](#-deep-dive-portals--user-experiences)
   - [1. Customer Discovery & Booking Experience (`/`)](#1-customer-discovery--booking-experience-)
   - [2. Embedded Multilingual AI Concierge Widget](#2-embedded-multilingual-ai-concierge-widget)
   - [3. Customer Bookings & Account Management Hub (`/customer`)](#3-customer-bookings--account-management-hub-customer)
   - [4. Executive Admin Analytics & Control Suite (`/admin`)](#4-executive-admin-analytics--control-suite-admin)
   - [5. Driver Trip Management & Dispatch Portal (`/driver`)](#5-driver-trip-management--dispatch-portal-driver)
   - [6. RAG & AI Vector Diagnostic Sandbox (`/rag-tester`)](#6-rag--ai-vector-diagnostic-sandbox-rag-tester)
   - [7. Authentication & Role-Based Access (`/login`)](#7-authentication--role-based-access-login)
4. [Component Architecture & Hierarchy](#-component-architecture--hierarchy)
5. [Services & API Integration Layer](#-services--api-integration-layer)
6. [Design System, Typography & UI Tokens](#-design-system-typography--ui-tokens)
7. [Repository & Directory Structure](#-repository--directory-structure)
8. [Installation & Getting Started](#-installation--getting-started)
9. [Production Build & Docker Deployment](#-production-build--docker-deployment)
10. [Code Quality, SEO & Performance Standards](#-code-quality-seo--performance-standards)

---

## 🏛️ Architecture & Rendering Strategy

The application leverages **Next.js 15 App Router** and **React 19** to blend high-performance Server-Side Rendering (SSR) for SEO-critical pages with dynamic Client Components for rich interactivity.

```
                               ┌────────────────────────┐
                               │   Root Layout (RSC)    │
                               │  (Navbar, Meta, Shell) │
                               └───────────┬────────────┘
                                           │
         ┌───────────────────┬─────────────┴─────────────┬───────────────────┐
         ▼                   ▼                           ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Public Portal   │ │ Customer Hub    │ │ Admin Suite     │ │ Driver & AI Hub │
│ • Landing Hero  │ │ • My Bookings   │ │ • KPI Charts    │ │ • Driver Trips  │
│ • Fleet Catalog │ │ • Active Trips  │ │ • Fleet Table   │ │ • RAG Tester    │
│ • Booking Modal │ │ • Profile & Pay │ │ • Live Bookings │ │ • AI Concierge  │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## ⚡ Complete Frontend Feature Matrix

| Feature Domain | Features Included & UI Capabilities | Route / Component |
| :--- | :--- | :--- |
| **Hero Search Engine** | Pickup location, return location, pickup date/time, return date/time, instant availability lookup. | `/` (`HeroBanner.tsx`) |
| **Fleet Catalog Filter** | Category tabs (Sedan, SUV, Luxury, Electric, Van), price slider (BDT/day), seating (4, 5, 7+), transmission, fuel. | `/` (`VehicleCatalog.tsx`) |
| **Vehicle Detail Modal**| Multi-angle image preview, feature badges (GPS, Dashcam, AC, Luggage, Bluetooth), specs breakdown. | `VehicleDetailModal.tsx` |
| **Multi-Step Booking** | Live price calculator, daily duration calculation, tax/VAT estimation, add-on package selection, instant confirmation. | `BookingModal.tsx` |
| **Add-On Packages** | Full insurance coverage, child safety booster seat, dedicated chauffeur, airport/doorstep delivery. | `BookingModal.tsx` |
| **AI Concierge Chat** | Floating multilingual chat widget (Bangla/English/Banglish), car recommendation cards with "Book Now" triggers. | `AIChatDrawer.tsx` |
| **Customer Hub** | Active, upcoming, completed, and cancelled bookings tracking, invoice preview, cancellation workflow. | `/customer` |
| **Admin KPI Cards** | Total revenue with MoM growth badge, active rentals count, fleet utilization percentage bar, total bookings. | `/admin` (`AdminKPICards.tsx`) |
| **Interactive Charts** | Monthly revenue vs expense bar/area charts, fleet category distribution donut chart powered by **Recharts**. | `/admin` (`AdminCharts.tsx`) |
| **Fleet Control Table** | Searchable fleet inventory table, instant status switcher (`Available`, `Rented`, `Maintenance`, `Unavailable`). | `/admin` (`FleetManagementTable.tsx`) |
| **Bookings Operations** | Customer name, vehicle, rental date range, total cost, action buttons (`Confirm`, `Activate`, `Complete`, `Cancel`).| `/admin` (`BookingManagementTable.tsx`) |
| **Driver Portal** | Assigned trips list, customer contact details, live progress stepper (`Assigned` -> `En Route` -> `Picked Up` -> `Completed`).| `/driver` |
| **RAG Vector Inspector**| Semantic query sandbox, cosine similarity visualizer, latency monitor, raw knowledge chunk inspector. | `/rag-tester` |
| **Authentication** | Login & signup forms with client-side validation and role-based redirects (`ADMIN`, `CUSTOMER`, `DRIVER`). | `/login` |

---

## 📱 Deep Dive: Portals & User Experiences

### 1. Customer Discovery & Booking Experience (`/`)
- **Interactive Hero & Search Bar**:
  - Location selection dropdown covering major divisions (Dhaka, Chittagong, Sylhet, Cox's Bazar, Rajshahi, Khulna).
  - Date and time pickers with validation preventing past dates and return dates preceding pickup dates.
- **Dynamic Fleet Catalog**:
  - Real-time client-side and API filtering without page reload.
  - **Category Tabs**: Filter by *All Vehicles*, *Sedan*, *SUV*, *Luxury*, *Electric*, and *Van / Microbus*.
  - **Price Range Slider**: Intuitive dual-handle slider filtering vehicles by daily rate (BDT).
  - **Passenger Capacity**: Quick filter for 4 seats, 5 seats, 7+ seats, and 10+ passenger group vehicles.
  - **Transmission & Fuel**: Toggle between Automatic and Manual; filter by Hybrid, Octane, Electric, or Diesel.
  - **Instant Search**: Keyword search matching brand, model, and vehicle name.
- **Vehicle Detail Modal**:
  - Full-screen popover showing comprehensive vehicle specs: engine size, fuel economy, luggage capacity, seating, transmission, and amenities (Air Conditioning, GPS Navigation, Dashcam, Bluetooth Audio).
  - High-resolution imagery gallery and pricing badges.
- **Multi-Step Booking Wizard**:
  - **Step 1 — Duration & Add-ons**: Calculates rental duration and offers optional add-ons:
    - *Full Coverage Insurance (Zero Deductible)*
    - *Child Safety Booster Seat*
    - *Dedicated Chauffeur Service*
    - *Airport / Doorstep Delivery*
  - **Step 2 — Cost Breakdown**: Itemizes base vehicle rental, selected add-ons, and estimated taxes.
  - **Step 3 — Customer Information & Confirmation**: Captures name, phone number, email, and special notes, then dispatches reservation request to backend.
- **Social Proof & FAQ Accordion**:
  - Customer review carousel with star ratings and verified feedback.
  - Interactive accordion covering deposit terms, cancellation policies, and license requirements.

---

### 2. Embedded Multilingual AI Concierge Widget
- **Multilingual Natural Language Understanding**:
  - Chat in English, Bengali (বাংলা), or Banglish (e.g., *"Amar 5 joner jonno 3 diner ekta AC gari lagbe"*).
- **Intelligent Vehicle Recommendations**:
  - AI analyzes budget and passenger requirements and renders rich visual car cards inside the chat stream.
  - Each car card features an image, rate, specs, and a direct *"Book This Vehicle"* action button.
- **RAG-Grounded Answers**:
  - Answers specific policy questions (e.g., security deposit rules, fuel refill policy, chauffeur working hours).
- **Suggested Quick Prompts**:
  - Quick action chips: *"Show luxury sedans"*, *"How does security deposit work?"*, *"Airport pickup rates"*.
- **Graceful Fallback**:
  - Directs complex or unsupported queries to WhatsApp / Phone customer care hotline.

---

### 3. Customer Bookings & Account Management Hub (`/customer`)
- **Tabbed Reservation Management**:
  - Filter reservations into *Active Rentals*, *Upcoming Bookings*, *Completed Trips*, and *Cancelled Reservations*.
- **Itemized Digital Receipts**:
  - View breakdown of base rate, add-ons, VAT, and payment status (`Paid Full`, `Pending Deposit`).
- **Cancellation & Modification**:
  - Customers can request schedule changes or cancel reservations within eligible policy windows.
- **Trip Status Stepper**:
  - Visual timeline indicating reservation milestones: *Requested* ➔ *Confirmed* ➔ *Driver Assigned* ➔ *Trip Active* ➔ *Completed*.

---

### 4. Executive Admin Analytics & Control Suite (`/admin`)
- **Real-Time KPI Metric Cards**:
  - **Total Revenue**: Total earnings with visual month-over-month growth indicators.
  - **Active Rentals**: Vehicles currently on active rental trips.
  - **Fleet Utilization Rate**: $\frac{\text{Active Rentals}}{\text{Total Fleet Size}} \times 100\%$ with progress bar.
  - **Total Bookings**: Lifetime completed and pending reservations count.
- **Interactive Visualizations (Recharts)**:
  - **Monthly Revenue vs Expenses**: Dual-colored Bar and Area charts with custom tooltips.
  - **Fleet Category Distribution**: Interactive Donut chart displaying category inventory share.
  - **Booking Status Breakdown**: Visual distribution of Confirmed, Active, Completed, and Cancelled bookings.
- **Fleet Inventory Control Table**:
  - Searchable list of all fleet vehicles with thumbnail, license plate, category, daily rate, and seating.
  - One-click status switcher dropdown (`Available`, `Rented`, `Maintenance`, `Unavailable`).
- **Live Bookings Operations Table**:
  - Complete list of customer bookings with booking reference code, customer details, vehicle, dates, and cost.
  - Lifecycle state trigger buttons: `Confirm`, `Activate (Start Trip)`, `Complete`, `Cancel`.

---

### 5. Driver Trip Management & Dispatch Portal (`/driver`)
- **Assigned Rides Queue**:
  - Real-time list of assigned trips with customer name, contact phone, pickup address, and drop-off location.
- **Live Progress State Machine**:
  - Interactive buttons advancing trip status: `Assigned` ➔ `Driver En Route` ➔ `Customer Picked Up` ➔ `Trip Completed`.
- **Pre-Trip Digital Checklist**:
  - Fuel level, vehicle exterior cleanliness, and odometer verification checklist before vehicle handover.

---

### 6. RAG & AI Vector Diagnostic Sandbox (`/rag-tester`)
- **Semantic Search Sandbox**:
  - Live query testing against the backend FastAPI RAG service.
- **Query Analysis Inspection**:
  - Real-time display of detected language, classified intent, and extracted entities.
- **Relevance & Similarity Visualizer**:
  - Displays cosine similarity scores, ranking positions, and response latency (in milliseconds).
- **Knowledge Base Passage Inspector**:
  - View raw retrieved knowledge chunks used to generate the LLM response to verify zero-hallucination grounding.

---

### 7. Authentication & Role-Based Access (`/login`)
- Clean, responsive login and signup forms with real-time validation.
- Role-based redirect logic:
  - `ADMIN` ➔ `/admin` (Executive Dashboard)
  - `DRIVER` ➔ `/driver` (Trip Dispatch Portal)
  - `CUSTOMER` ➔ `/` or `/customer` (Customer Hub)

---

## 🧩 Component Architecture & Hierarchy

```
src/components/
├── admin/                        # Executive dashboard components
│   ├── AdminCharts.tsx           # Recharts revenue & distribution visualizations
│   ├── AdminHeader.tsx           # Top navigation bar with user profile & notifications
│   ├── AdminKPICards.tsx         # Real-time metric statistic summary cards
│   ├── BookingManagementTable.tsx# Interactive bookings table with state triggers
│   └── FleetManagementTable.tsx  # Fleet table with vehicle status toggles
│
├── ai/                           # AI & RAG components
│   ├── AIChatDrawer.tsx          # Floating customer concierge chatbot widget
│   └── RAGTesterComponent.tsx    # Live vector diagnostic and similarity inspector
│
├── auth/                         # Authentication components
│   ├── LoginForm.tsx             # User login form with validation
│   └── RegisterForm.tsx          # User signup and onboarding form
│
├── common/                       # Shared global components
│   ├── Navbar.tsx                # Responsive navigation header with portal links
│   ├── Footer.tsx                # Global footer with brand info and links
│   ├── Badge.tsx                 # Status badges for vehicles and bookings
│   └── Modal.tsx                 # Accessible modal dialog wrapper
│
└── customer/                     # Customer portal components
    ├── HeroBanner.tsx            # Hero search banner with date & location pickers
    ├── VehicleCatalog.tsx        # Grid of vehicles with search & filter controls
    ├── VehicleCard.tsx           # Individual vehicle card with specs & CTA
    ├── VehicleDetailModal.tsx    # Full-screen vehicle specification preview
    └── BookingModal.tsx          # Multi-step rental confirmation modal
```

---

## 🔌 Services & API Integration Layer

All backend interactions are abstracted in typed services under `src/services/`:

- **`api.service.ts`**: Core HTTP client wrapper configuring base URLs, headers, and error interceptors.
- **`auth.service.ts`**: Handles login, registration, token persistence, and logout workflows.
- **`vehicle.service.ts`**: Fetches filtered vehicle lists, individual car specifications, and fleet statuses.
- **`booking.service.ts`**: Handles booking creation, customer booking history, status updates, and price calculations.
- **`analytics.service.ts`**: Retrieves KPI statistics, revenue trends, and chart data for the Admin portal.
- **`ai.service.ts`**: Communicates directly or via gateway with the FastAPI AI Service for chat, semantic search, and RAG diagnostics.

---

## 🎨 Design System, Typography & UI Tokens

| Attribute | Specification |
| :--- | :--- |
| **Color Palette** | Neutral Slate/Zinc backgrounds with Emerald/Indigo primary accents |
| **Typography** | Inter / System Sans-Serif with strict font weight hierarchy |
| **Icons** | Lucide React (Clean, modern SVG line icons) |
| **Charts** | Recharts (Responsive SVG charts with custom tooltips) |
| **Styling Engine** | Tailwind CSS with utility-first layout principles |
| **Responsive Breakpoints**| Mobile (`sm: 640px`), Tablet (`md: 768px`), Desktop (`lg: 1024px`), Ultra-wide (`xl: 1280px`) |

---

## 📁 Repository & Directory Structure

```
frontend/
├── public/                       # Static public assets (logos, illustrations)
├── src/
│   ├── app/                      # Next.js 15 App Router
│   │   ├── admin/                # Admin Executive Dashboard route
│   │   │   └── page.tsx
│   │   ├── customer/             # Customer bookings & account route
│   │   │   └── page.tsx
│   │   ├── driver/               # Driver operations & trips route
│   │   │   └── page.tsx
│   │   ├── login/                # Authentication route
│   │   │   └── page.tsx
│   │   ├── rag-tester/           # AI RAG Vector Inspector route
│   │   │   └── page.tsx
│   │   ├── globals.css           # Tailwind CSS directives & global rules
│   │   ├── layout.tsx            # Global layout shell
│   │   └── page.tsx              # Main customer landing & catalog page
│   │
│   ├── components/               # Modular UI component system
│   │   ├── admin/
│   │   ├── ai/
│   │   ├── auth/
│   │   ├── common/
│   │   └── customer/
│   │
│   ├── services/                 # Typed API client services
│   └── types/                    # Domain data types & component interfaces
│
├── .env.example                  # Template environment variables
├── Dockerfile                    # Production multi-stage Docker build
├── next.config.ts                # Next.js compiler & image configuration
├── package.json
├── postcss.config.mjs
├── tailwind.config.js            # Tailwind custom styling tokens
└── tsconfig.json                 # TypeScript strict configuration
```

---

## 🛠️ Installation & Getting Started

### Prerequisites
- **Node.js**: `v18.18.0` or `v20.x`+
- **npm**, **yarn**, or **pnpm**

---

### Step 1: Clone and Install Dependencies
```bash
# Navigate to the frontend directory
cd frontend

# Install package dependencies
npm install
```

### Step 2: Configure Environment Variables
Create a `.env.local` file in the `frontend/` root:
```env
# Backend API Gateway URL
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3001

# FastAPI AI & RAG Service URL
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

### Step 3: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build & Docker Deployment

### Local Production Build Validation
```bash
# Compile and create optimized production build
npm run build

# Start the production server
npm run start
```

### Docker Container Build & Run
```bash
# Build the Docker image
docker build -t best-care-frontend .

# Run container on port 3000
docker run -d -p 3000:3000 --name best-care-ui best-care-frontend
```

---

## 🧪 Code Quality, SEO & Performance Standards

- **Strict TypeScript**: Zero implicit `any` policy for rock-solid type safety.
- **Image Optimization**: Utilizes `next/image` with responsive dimensions and WebP formats.
- **Client/Server Component Separation**: Server components for data fetching and light DOM footprints; client components for dynamic state.
- **SEO Ready**: Dynamic meta tags, semantic HTML5 structure, and OpenGraph descriptors.

---

## 📄 License

This project is licensed under the MIT License.
