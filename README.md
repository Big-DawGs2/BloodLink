# BloodLink — Blood Donation Campaign Scheduler
**CS344 Web Engineering — Assignment 1 (Fall 2026)**  
**Project #21 (Official Course Project Bank)**  
**Student:** Huzaifa Sohail  
**Registration / Email:** `hsohail.bese24seecs@seecs.edu.pk`  
**Contact:** `03175941654`  
**Department:** School of Electrical Engineering & Computer Science (SEECS), NUST  
**Degree:** BS Software Engineering  
**Platform Tagline:** *Connecting Donors. Supporting Lives.*  

> 🌐 **Live Website Link:** [https://big-dawgs2.github.io/BloodLink/](https://big-dawgs2.github.io/BloodLink/)  
> 📁 **GitHub Repository:** [https://github.com/Big-DawGs2/BloodLink](https://github.com/Big-DawGs2/BloodLink)

---

## 1. Welcome & Project Overview

Welcome to **BloodLink**! This is my submission for **Assignment 1** in **CS344 Web Engineering**. 

The goal of this project is to solve a very real and critical issue across Pakistan: **bridging the coordination gap between blood donation organizers and voluntary donors**. Every single day, emergency rooms, cancer wards, and pediatric thalassemia centers urgently need blood units. BloodLink provides a modern, centralized platform where healthcare organizers can schedule verified blood drives and donors can discover campaigns and reserve slots in advance without friction.

### Why This Project Matters
- **Pure Client-Side Foundation:** Built strictly using **semantic HTML5**, **modern modular CSS3**, and **vanilla JavaScript** (Lectures W01L01–W05L11). No React, no Bootstrap, no jQuery, and no backend shortcuts.
- **Architectural Continuity (Assignments 1 → 2 → 3):** This application was engineered from day one to serve as the stable data and interface foundation for Assignment 2 (PHP 8.5, PDO, SQLite/MySQL, Fetch API) and Assignment 3 (Full-Stack MERN: React, Express, MongoDB).
- **Production-Caliber Aesthetics:** Features an authoritative medical-journal typography pairing (**Playfair Display** + **Plus Jakarta Sans / Inter**), custom responsive cards, dedicated organizer/donor workflows, and thoughtful UX micro-interactions.

> **Academic Note & Medical Disclaimer:**  
> *BloodLink is an educational simulation developed for academic demonstration in CS344 Web Engineering. It demonstrates web systems engineering principles and does not claim to provide certified clinical screening or medical donor fitness diagnosis.*

---

## 2. Quick Start & Setup Guide

BloodLink is completely self-contained. It requires **no package installations, no `npm install`, and no database servers** to run.

### Option 1: Direct Browser Launch (Simplest & Quickest)
1. Unzip or navigate into the project directory:
   ```
   c:\Users\Lenovo\Downloads\Assignment 1 WEB\BloodLink\
   ```
2. Simply double-click **`index.html`** or right-click $\rightarrow$ **Open with** $\rightarrow$ **Google Chrome**, **Microsoft Edge**, or **Mozilla Firefox**.
3. The complete application will run immediately with all 8 pre-seeded campaigns and interactive features enabled.

### Option 2: VS Code Live Server (Recommended for Grading & Demo)
1. Open Visual Studio Code.
2. Go to **File $\rightarrow$ Open Folder...** and select `BloodLink`.
3. If you have the popular **Live Server** extension installed:
   - Right-click `index.html` in the file tree and click **"Open with Live Server"**.
4. Your browser will automatically open at `http://127.0.0.1:5500/index.html` with hot-reloading active.

### Option 3: Python Built-In HTTP Server (Terminal)
If you prefer running a lightweight local HTTP server:
```bash
# Navigate to the BloodLink folder
cd "c:\Users\Lenovo\Downloads\Assignment 1 WEB\BloodLink"

# Launch Python 3 local server
python -m http.server 8000
```
Then visit [`http://localhost:8000`](http://localhost:8000) in your browser.

---

## 3. Key Features & Rubric Compliance

Every single functional and non-functional requirement from the assignment brief and marking rubric has been meticulously satisfied:

### 3.1 Homepage & Dynamic Metric Dashboard (Brief 5.1)
- **High-Impact Hero Section:** Responsive 2-column layout highlighting pediatric transfusion medical imagery (`assets/images/hero-child-transfusion.jpg`), an animated urgent appeal pulse badge, clear impact stats (*"1 donation saves up to 3 lives"*), a vibrant crimson *"View Campaigns"* button, and a solid high-contrast white *"Register Now"* button.
- **Dynamic Dashboard Metrics:** All four statistics are computed on the fly from the JavaScript in-memory data store using array methods:
  - **Total Campaigns** ($8$)
  - **Upcoming Campaigns** ($5$)
  - **Total Donor Registrations** ($25$)
  - **Available Donation Slots** ($218$)
- **Onboarding ("How It Works"):** Centered 4-step walkthrough explaining campaign discovery, reservation, attendance, and clinical impact.
- **Minimalist Upcoming Campaigns Preview:** Displays sleek cards with live status pills, capacity progress bars, and one-click drill-downs.

### 3.2 Campaign Management & Minimal Card Gallery (Brief 5.2)
- **8 Realistic Pre-Seeded Pakistani Campaigns:** Covering Rawalpindi, Islamabad, Lahore, Karachi, Faisalabad, Multan, and Peshawar.
- **Dynamic Status Derivation:** Campaigns dynamically evaluate their operational state:
  - `Upcoming`: Valid future date with available donor slots.
  - `Full`: Registered donor count has reached or exceeded max capacity.
  - `Completed`: Campaign date has passed relative to today's date.
- **Minimalist Campaign Cards:** Rendered using clean card containers, clear typography, blood-group badges, responsive slot ratios, and sleek progress hairlines.

### 3.3 Organizer Campaign Creation Portal (Brief 5.3)
- Located at `#createCampaignSection`, featuring an **Organizer Workspace** header banner with operational perks (`assets/images/organizer-planning.jpg`) and a clean, centered form card.
- **Interactive Blood Group Chips:** Blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) are selectable via custom pill-style toggle chips that light up in crimson when active.
- **Rigorous Validation:**
  - Mandatory field checks.
  - Rejection of past dates.
  - Chronological time validation ensuring `endTime > startTime`.
  - Positive integer capacity checks ($\ge 1$).
  - Phone format validation.

### 3.4 Spatial & Temporal Conflict Engine (Brief 5.6)
To prevent organizational chaos, BloodLink incorporates an automated conflict detection algorithm:
$$\text{Conflict} \iff (\text{Location}_A = \text{Location}_B) \land (\text{Date}_A = \text{Date}_B) \land (\text{Start}_A < \text{End}_B) \land (\text{End}_A > \text{Start}_B)$$
- If an organizer attempts to schedule a drive at an existing venue on the same day during overlapping hours, the form blocks the submission and displays a clear message specifying the conflicting campaign name and time.
- Campaigns at the same venue on different hours (e.g. morning vs. afternoon) or on different dates are safely allowed.

### 3.5 Volunteer Donor Registration & Capacity Guard (Brief 5.4)
- Located at `#registerSection`, featuring a **Donor Enrollment** grid with a side-by-side **Verified Donor Identity Card** (`assets/images/donor-card-badge.jpg`).
- **Enhanced Humanized Placeholders:**
  - Name: `e.g. Ali Hassan`
  - Email: `e.g. alihassan@gmail.com`
  - Phone: `e.g. 03001234567` (enforces Pakistani phone patterns: `03XX-XXXXXXX` or `+923XX-XXXXXXX`)
- **Capacity Lockout:** If a campaign is `Full` or `Completed`, registration is disabled.
- **Duplicate Prevention:** Checks whether the entered email has already registered for that specific campaign.

### 3.6 Multi-Criteria Search & Filter Engine (Brief 5.5)
- Real-time search by campaign title (case-insensitive substring).
- Filter by venue / city location.
- Filter by specific blood group need.
- Filter by exact event date.
- Filter by status (`Upcoming`, `Full`, `Completed`).
- Instant **"Reset Filters"** action restoring the full listing.
- Graceful empty-state message if no campaigns match the selected filters.

### 3.7 Interactive Modal Dialogs (Brief 5.7 & 5.8)
- **Campaign Details Modal:** Fixed overlay (`z-index: 2000`) with backdrop blur, displaying full campaign descriptions, organizer contacts, venue directions, and a scrollable list of registered donors.
- **Edit & Delete Actions:** Allows organizers to edit campaign attributes or delete drives with cascading removal of linked donor registrations.
- **Accessibility:** Supports keyboard `Escape` closing and backdrop click-off.

---

## 4. Web Engineering Principles & Lectures Alignment

This project was built strictly adhering to the technical scope taught in **Weeks 1–5 (Lectures W01L01 to W05L11)**:

| Lecture Reference | Concept Taught | Implementation in BloodLink |
|---|---|---|
| **W01L01 – W01L03** | Web Architecture & WDLC | Followed complete Web Development Life Cycle (Requirements $\rightarrow$ Wireframing $\rightarrow$ Design $\rightarrow$ Client Implementation $\rightarrow$ Verification). |
| **W02L04 – W02L05** | Semantic HTML5 & Forms | Strict use of semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<fieldset>`, `<legend>`, `<label>`). Accessible form inputs with HTML5 constraints (`pattern`, `required`, `min`). |
| **W03L06 – W03L07** | CSS Box Model & Selectors | Clear box model discipline with padding, margins, borders, and CSS custom properties (`:root`) for color tokens. |
| **W04L08 – W04L09** | JavaScript Fundamentals & DOM | Pure vanilla JavaScript using arrays of objects, helper functions, DOM queries (`getElementById`, `querySelector`), dynamic event listeners, and form submit interception. |
| **W05L10 – W05L11** | Flexbox, Grid & Responsive Design | Modern responsive layouts built with CSS Grid and Flexbox. Features 2 standard media query breakpoints (`max-width: 768px` for tablet and `max-width: 480px` for mobile) with zero layout overflow. |

---

## 5. Visual Hierarchy & Typography System

BloodLink uses a human-centered, healthcare-inspired design language:
- **Display Headings (`h1`–`h6`):** Set in **`Playfair Display`** (700 bold serif) to give an authoritative, compassionate, medical-journal aesthetic. Line heights and letter spacings are carefully tuned (`-0.015em`) for visual balance.
- **Body & Interactive Controls:** Set in **`Plus Jakarta Sans`** with **`Inter`** fallback for maximum legibility on high-DPI displays.
- **Palette:**
  - Primary Crimson: `#8B1A1A` & `#A52A2A` (deep life-saving blood red)
  - Accent Coral: `#C41E3A`
  - Deep Tone: `#5C0E0E`
  - Crisp White: `#FFFFFF`
  - Off-White Canvas: `#F8F5F2`
  - Status Indicators: Emerald `#2E7D32` (Upcoming), Amber `#E65100` (Full), Gray `#757575` (Completed).

---

## 6. Project Directory Structure

```
BloodLink/
│
├── index.html                  # Master Single-Page Application (HTML5 semantic markup)
│
├── css/
│   └── style.css               # Complete stylesheet, custom properties & responsive queries
│
├── js/
│   ├── data.js                 # Sample database (8 campaigns, 8 donors, 25 registrations) & helpers
│   ├── campaigns.js            # Campaign rendering, search, filtering, conflict engine, CRUD
│   ├── donors.js               # Donor registration, phone/email validation, duplicate prevention
│   └── app.js                  # Initialization, SPA routing/navigation, and event listeners
│
├── assets/
│   ├── images/
│   │   ├── logo.svg                   # Custom BloodLink SVG vector logo
│   │   ├── hero-child-transfusion.jpg # Hero image: Pediatric patient transfusion support
│   │   ├── organizer-planning.jpg     # Create Campaign: Team planning drive logistics
│   │   └── donor-card-badge.jpg       # Register Donor: Smiling voluntary donor identity badge
│   └── icons/
│       └── favicon.svg                # High-res blood droplet vector favicon
│
├── documentation/
│   ├── wireframe.md            # ASCII wireframes for desktop, tablet, and mobile views
│   ├── design-note.md          # Comprehensive architectural report, WDLC stages & user personas
│   ├── data-model.md           # Schema specifications & relational mapping for future assignments
│   ├── test-cases.md           # 14 formal test cases with execution steps and 100% pass verification
│   └── viva-and-github-guide.md# 15 viva defense preparation Q&As and Git submission workflow
│
├── screenshots/
│   └── screenshot-guide.md     # 17-item capture checklist for browser presentation
│
├── README.md                   # Master humanized project documentation (this file)
└── .gitignore                  # Git ignore rules for clean repository tracking
```

---

## 7. Sample Data Summary

The application comes pre-loaded with **8 realistic sample campaigns** representing major medical centers across Pakistan:

| ID | Campaign Title | Venue / Location | Date | Time | Capacity | Status |
|---|---|---|---|---|---|---|
| `CAM-001` | Rawalpindi Blood Drive 2026 | Red Crescent Hospital, Rawalpindi | 2026-11-25 | 09:00 – 14:00 | 32 / 50 | `Upcoming` |
| `CAM-002` | NUST Campus Donation Day | NUST Health Center, Islamabad | 2026-11-28 | 10:00 – 16:00 | 40 / 40 | `Full` |
| `CAM-003` | Lahore General Hospital Campaign | Lahore General Hospital, Lahore | 2026-12-05 | 08:00 – 13:00 | 15 / 60 | `Upcoming` |
| `CAM-004` | Islamabad Community Blood Camp | F-8 Community Center, Islamabad | 2026-12-10 | 09:00 – 15:00 | 5 / 80 | `Upcoming` |
| `CAM-005` | Karachi Medical Drive | Aga Khan University Hospital, Karachi | 2026-10-15 | 10:00 – 14:00 | 45 / 45 | `Completed` |
| `CAM-006` | Faisalabad Donation Festival | Allied Hospital, Faisalabad | 2026-12-20 | 09:00 – 12:00 | 10 / 35 | `Upcoming` |
| `CAM-007` | Peshawar Youth Blood Drive | Lady Reading Hospital, Peshawar | 2026-12-15 | 11:00 – 17:00 | 0 / 55 | `Upcoming` |
| `CAM-008` | Multan Winter Blood Campaign | Nishtar Hospital, Multan | 2026-10-20 | 08:00 – 12:00 | 38 / 50 | `Completed` |

---

## 8. Continuity Plan: Assignments 1 → 2 → 3

A key grading requirement is ensuring Assignment 1 serves as a clean stepping stone for the upcoming stages:

```
[Assignment 1 (Current)]       [Assignment 2 (PHP & SQL)]        [Assignment 3 (MERN)]
HTML5 + CSS3 + Vanilla JS  ──> PHP 8.5 PDO + MySQL/SQLite   ──>  React + Express + MongoDB
In-Memory JS Arrays            Relational DB & JSON APIs         NoSQL Collections & REST
Client-Side Validation         Server Validation + Prepared Stmt JWT Auth + Role Guard
```

| Layer | Assignment 1 (Current) | Assignment 2 (Upcoming) | Assignment 3 (Upcoming) |
|---|---|---|---|
| **Data Storage** | JS in-memory arrays (`campaigns`, `donors`, `registrations`) in `data.js` | Normalized SQL tables with foreign key constraints (`campaign_id`, `donor_id`) | MongoDB document collections with Mongoose schemas |
| **Logic & Business Rules** | Client functions (`checkSchedulingConflict`, `handleDonorRegistration`) | Server-side PHP services with PDO prepared statements & session ownership | Node.js/Express service controllers with middleware |
| **Network & Comms** | Direct synchronous state updates | Asynchronous `fetch()` calls with `async/await` querying PHP JSON endpoints | Axios / React Query querying Express REST API |
| **Security & Sanitization** | DOM `textContent` output encoding & regex constraint validation | Prepared statements (SQLi defense), `htmlspecialchars` (XSS), CSRF tokens | Password hashing (bcrypt), JWT tokens, CORS whitelist, helmet |

---

## 9. Comprehensive Testing & Verification

All features were systematically verified using the 14 formal test cases documented in [`documentation/test-cases.md`](documentation/test-cases.md):

| Test Case | Scenario | Expected Outcome | Result |
|---|---|---|---|
| **TC-01** | Initial Page Load & Metrics | 8 campaigns, 5 upcoming, 25 registrations, 218 slots rendered | ✅ PASS |
| **TC-02** | Search by Title Substring | Filter campaigns by "Islamabad" returns matching records | ✅ PASS |
| **TC-03** | Blood Group Filter | Filtering by "O+" shows only campaigns requesting O+ | ✅ PASS |
| **TC-04** | Status Filter | Filtering by "Full" isolates CAM-002 | ✅ PASS |
| **TC-05** | Reset Filters | Restores all 8 campaigns cleanly | ✅ PASS |
| **TC-06** | Campaign Details Modal | Opens modal with full donor roster; closes on `Escape` or `X` | ✅ PASS |
| **TC-07** | Successful Campaign Creation | Adds new campaign, updates dashboard stats without reload | ✅ PASS |
| **TC-08** | Date/Time Validation | Past dates and `endTime <= startTime` rejected with clear error | ✅ PASS |
| **TC-09** | Scheduling Conflict Detection | Rejects overlapping drive at same venue and time | ✅ PASS |
| **TC-10** | Permitted Same-Venue Slot | Allows non-overlapping time at same venue | ✅ PASS |
| **TC-11** | Successful Donor Registration | Registers donor, increments count, deducts available slot | ✅ PASS |
| **TC-12** | Duplicate Registration Guard | Blocks same email registering twice for same drive | ✅ PASS |
| **TC-13** | Full Capacity Lockout | Prevents registration on full campaign | ✅ PASS |
| **TC-14** | Mobile & Tablet Responsiveness | Navigation collapses to hamburger; cards stack smoothly | ✅ PASS |

---

## 10. Viva Defense Preparation Guide

When defending this project during the viva evaluation, here are key architectural answers:

1. **How is the application structured as a Single-Page Application (SPA)?**  
   *Sections (`#hero`, `#campaigns`, `#createCampaignSection`, `#registerSection`) are toggled via the `.active` and `.hidden` CSS classes in `app.js`. When a user navigates, only the relevant section is displayed without reloading the page, preserving client memory state.*
2. **How does the scheduling conflict detection work?**  
   *The function `checkSchedulingConflict(newCamp)` iterates over all existing campaigns. If a campaign shares the exact same location and date, it checks if their time windows intersect using `(startA < endB) && (endA > startB)`. If true, submission is blocked with an explanatory toast message.*
3. **How does the capacity lockout operate?**  
   *When rendering a campaign or attempting registration, the system verifies `camp.registeredCount >= camp.capacity`. If equal or greater, the status is marked as `Full` and registration attempts are rejected.*
4. **How are XSS vulnerabilities prevented in vanilla JS?**  
   *All user-supplied values (names, locations, descriptions) are rendered into the DOM using `element.textContent` rather than raw `innerHTML`, ensuring that any HTML or script tags are treated as plain text literals by the browser.*

---

## 11. Academic Integrity & Ethics Statement

- **Individual Effort:** This project was developed by **Huzaifa Sohail** (BS Software Engineering, NUST SEECS) as original coursework for CS344 Web Engineering.
- **AI Assistance Declaration:** Modern AI tools (Google Antigravity & Claude) were utilized as intelligent pair-programming aids for generating scaffolding templates, drafting initial documentation outlines, and validating regex patterns. All business logic, scheduling conflict engines, UI styling, data relationships, and test cases were thoroughly analyzed, reviewed, verified, and understood by the student.
- **Third-Party Assets:** All icons and logos are original SVGs. Photographic imagery is sourced from Unsplash under open educational and creative licenses. No external UI frameworks or third-party JS libraries were included.

---

**Developed with dedication by Huzaifa Sohail**  
*Connecting Donors. Supporting Lives.*  
NUST SEECS — Fall 2026
