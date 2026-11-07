# ArthriHealth

A web application designed for managing arthritis health data and monitoring. Built with modern web technologies for an intuitive user experience.

## About

ArthriHealth is a dissertation project that provides a comprehensive web application for arthritis health management. The application helps users track their health metrics, manage medication schedules, and monitor their arthritis condition over time.

**Live Application**: https://myapp-8439e.web.app/

## Features

- **Health Monitoring**: Track and visualize health metrics with interactive charts
- **Calendar Management**: Schedule and manage medication reminders with react-big-calendar
- **Data Analytics**: Visual representation of health data using Chart.js
- **Form Validation**: Robust form handling with Formik and Yup validation
- **Responsive Design**: Mobile-friendly interface with Bootstrap 5 and React Bootstrap
- **Real-time Database**: Firebase integration for data persistence
- **User-Friendly Icons**: Font Awesome icons for better UX

## Tech Stack

### Frontend

- **React** 18.2.0 - UI library
- **React Router DOM** 6.22.3 - Client-side routing
- **React Bootstrap** 2.10.1 - UI components
- **Bootstrap** 5.3.3 - CSS framework

### Form & Validation

- **Formik** 2.4.5 - Form management
- **Yup** 1.4.0 - Schema validation

### Data Visualization

- **Chart.js** 4.4.2 - Charting library
- **React ChartJS 2** 5.2.0 - React wrapper for Chart.js
- **React Big Calendar** 1.11.2 - Calendar component

### Backend & Database

- **Firebase** 10.11.0 - Backend services and real-time database

### Utilities

- **Font Awesome** 6.5.2 - Icon library
- **Moment.js** 2.30.1 - Date/time manipulation

### Testing

- **React Testing Library** 14 - Component testing
- **Jest** (via react-scripts) - Test runner

---

## ⭐ Project Architecture

ArthriHealth follows a modular, component‑driven architecture designed for clarity, maintainability, and scalability.

### Frontend Architecture

- **React Components** — Reusable UI components for forms, charts, calendars, and layout
- **React Router** — Client‑side navigation between dashboard, forms, and analytics pages
- **State Management** — Local component state with React hooks for simplicity and performance
- **Form Handling** — Formik + Yup for structured validation and predictable form behaviour
- **Data Visualisation** — Chart.js and React ChartJS 2 for rendering interactive health charts
- **Calendar System** — React Big Calendar for medication scheduling and reminders

### Backend & Data Layer

- **Firebase Firestore** — Stores user health entries, medication schedules, and analytics data
- **Firebase Authentication** — Secure user login and session handling
- **Real‑time Sync** — Firestore listeners provide instant UI updates without manual refresh

### Deployment

- **Firebase Hosting** — Serves the production build with HTTPS, caching, and global CDN
- **CI‑friendly Structure** — Clean separation of config, build output, and environment variables

This architecture keeps the project lightweight while still demonstrating full‑stack capability.

---

## ⭐ Why I Built This

ArthriHealth was created as part of my dissertation to explore how modern web technologies can support long‑term health management. Arthritis is a condition that requires continuous monitoring, and many patients struggle to track symptoms, medication schedules, and trends over time.

This project aims to:

- simplify daily health tracking
- provide clear visual insights into symptom patterns
- help users stay consistent with medication
- demonstrate how accessible web tools can support chronic condition management

It also showcases practical full‑stack engineering skills, including UI design, data visualisation, real‑time databases, and secure authentication.

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- A Firebase project with Email/Password auth, Firestore and Storage enabled
- [Firebase CLI](https://firebase.google.com/docs/cli) (for deploying rules and hosting)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/MCoding90/ArthriHealth.git
cd ArthriHealth
```

2. Install dependencies:

```bash
npm ci
```

3. Configure Firebase: copy `.env.example` to `.env.local` and fill in the values from
   Firebase console → Project settings → Your apps.

```bash
cp .env.example .env.local
```

4. Start the dev server:

```bash
npm start
```

### Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the app at http://localhost:3000 |
| `npm test` | Run the test suite (Jest + React Testing Library) |
| `npm run build` | Production build into `build/` |

### Security rules

Access control lives in `firestore.rules` and `storage.rules`: each user can only read and write
their own `Users/{uid}` document and sub-collections, and only after verifying their email.
Profile pictures are limited to images under 2 MB.

```bash
firebase deploy --only firestore:rules,storage
```

### Deployment

**Firebase Hosting**

```bash
npm run build
firebase deploy --only hosting
```

**Docker** (static build served by nginx)

```bash
# values are read from your shell / .env file
docker compose up --build
# → http://localhost:8080
```
