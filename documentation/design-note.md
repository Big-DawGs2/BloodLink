# BloodLink — Design Note & Engineering Report
**Course:** CS344 Web Engineering — Assignment 1 (Fall 2026)  
**Project #21:** Blood Donation Campaign Scheduler  
**Student:** Huzaifa Sohail  
**Email:** hsohail.bese24seecs@seecs.edu.pk  
**Contact:** 03175941654  

---

## 1. Executive Summary & Problem Statement

Blood donation drives across Pakistan (organized by hospitals, universities, and philanthropic bodies like the Pakistan Red Crescent Society) frequently suffer from logistical bottlenecks:
1. **Uncoordinated Scheduling:** Organizers unknowingly book campaigns at identical locations and dates, fragmenting donor turnout and exhausting venue space.
2. **Donor Misinformation:** Donors arrive at venues unaware that specific blood groups are needed or that capacity has already been filled.
3. **Manual Paperwork:** Registrations and slot allocations handled through physical paper ledgers cause long wait times, duplicate entries, and loss of records.

### Academic Disclaimer
*BloodLink is an educational demonstration application developed for CS344 Web Engineering. It does not provide medical screening, verify medical fitness, or guarantee physical donor eligibility.*

---

## 2. Target Users & User Personas

| User Role | Objectives & Core Tasks | Platform Needs |
|---|---|---|
| **Potential Blood Donors** | Discover drives in their city, check required blood groups, register for an available slot without wait times. | Mobile responsiveness, clear availability indicators, immediate confirmation feedback. |
| **Campaign Organizers** | Schedule donation drives, monitor registrant capacity, avoid venue booking collisions, update drive details. | Scheduling conflict detection, real-time donor counts, intuitive creation & editing forms. |
| **Community Volunteers** | Review upcoming campaigns, verify total turnout, assist on-site registration. | High-contrast readability, scannable dashboard statistics, clear event timelines. |

---

## 3. Web Development Life Cycle (WDLC) Application

As established in **Lecture W01L03 (WDLC)**, engineering a web application requires disciplined adherence to life cycle phases:

```
+---------------------------------------------------------------------------------------+
|  1. Requirements Analysis  --> 2. Architectural Design  --> 3. Frontend Implementation|
|  (User stories, fields,        (Wireframes, Box model,      (Semantic HTML5, CSS3,    |
|   conflict rules)               Grid/Flex, Data Model)       Vanilla JavaScript)      |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|  4. Testing & Verification --> 5. Maintenance & Continuity (Assignment 2 & 3 Migration)|
|  (Validation, Edge cases,       (Clean separation, normalized schema, REST endpoints)  |
|   Conflict detection)                                                                 |
+---------------------------------------------------------------------------------------+
```

### Stage 1: Requirements Analysis
- Gathered requirements from the official Assignment 1 specification and Project Bank Idea #21.
- Identified mandatory features: dynamic campaign listing, campaign creation with conflict detection, donor registration with duplicate checking, search/filtering, and responsive UI.

### Stage 2: Architectural & UI Design (W05L10, W05L11)
- Designed desktop, tablet, and mobile wireframes prioritizing user scannability and accessibility.
- Established a cohesive healthcare-inspired color system (Deep burgundy `#8B1A1A`, Crimson accent `#C41E3A`, Warm off-white `#F8F5F2`, Charcoal `#2C2C2C`).

### Stage 3: Implementation (W02L04, W02L05, W03L06, W03L07, W04L09)
- **HTML5:** Semantic document outline (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<fieldset>`, `<legend>`, `<label>`).
- **CSS3:** Custom properties (`:root`), Flexbox for dynamic toolbars/nav, CSS Grid for dashboard cards and campaign galleries, media queries (`768px`, `480px`).
- **JavaScript:** Unobtrusive DOM manipulation, structured arrays/objects, event listeners, client-side validation logic.

### Stage 4: Testing & Verification
- Unit and integration testing across 12 rigorous test cases covering all edge cases (past dates, time inversions, capacity exhaustion, duplicate donor emails, venue collisions).

### Stage 5: Deployment & Three-Assignment Continuity
- Packaged clean, dependency-free code ready for GitHub hosting.
- Architecture structured for drop-in evolution to PHP PDO (Assignment 2) and MERN (Assignment 3).

---

## 4. UI/UX Design Decisions & Justification

### 4.1 Color Psychology & Palette
- **Primary Burgundy (`#8B1A1A`) & Crimson (`#C41E3A`):** Evokes blood donation, vitality, and medical urgency without being alarming or harsh like pure saturated red.
- **Background Off-White (`#F8F5F2`) & Light Gray (`#F0EDEA`):** Soft on eyes, avoids harsh glare, and produces a sterile, professional medical journal aesthetic.
- **Dark Charcoal Text (`#2C2C2C`):** High contrast ratio (>7:1) complying with WCAG AAA accessibility standards.

### 4.2 Typography & Hierarchy
- Clean system font stack (`'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`) ensuring rapid zero-latency rendering without external Google Font requests.
- Strict heading hierarchy (`h1` only once in Hero, followed by descriptive `h2` and `h3` tags).

### 4.3 Interactive Feedback & Progressive Disclosure
- Real-time visual feedback through non-intrusive toast notifications and accessible inline alerts (`role="alert"`, `aria-live="polite"`).
- Dynamic progress bars rendering capacity percentage (`(registered / capacity) * 100`).

---

## 5. Architectural Separation of Responsibilities

As taught in **Lecture W01L02 (Client-Server & HTTP Basics)**:

### 5.1 Client-Side Responsibilities (Assignment 1 — Current Stage)
- **DOM Rendering & UI Updates:** Constructing and updating campaign cards, badges, and progress meters.
- **Immediate Input Validation:** Format checks for Pakistani phone numbers, valid email syntax, non-empty fields, and logical time boundaries.
- **Interactive State Management:** In-memory filtering, keyword searching, modal overlay toggling, and tab navigation.
- **Fast User Feedback:** Instantaneous alert messages without network latency.

### 5.2 Server-Side Responsibilities (Assignment 2 & 3 — Future Stages)
- **Data Persistence:** Storing campaign records, donor accounts, and registration logs in persistent ACID-compliant relational tables (SQLite/MySQL PDO in Assignment 2) or distributed document collections (MongoDB in Assignment 3).
- **Authoritative Validation & Business Logic:** Double-checking capacity limits, venue availability, and scheduling overlaps on the server to prevent race conditions from concurrent client requests.
- **Security & Integrity:** Sanitizing inputs against SQL Injection (prepared statements), escaping output against Cross-Site Scripting (XSS), verifying CSRF tokens, and hashing credentials.
- **Asynchronous Communication:** Exposing JSON endpoints queried via `fetch()` and `async/await`.

---

## 6. Technical Implementation Highlights

### 6.1 Conflict Detection Engine
The application enforces temporal and spatial mutual exclusion:
$$\text{Conflict} \iff (\text{Location}_A = \text{Location}_B) \land (\text{Date}_A = \text{Date}_B) \land (\text{Start}_A < \text{End}_B) \land (\text{End}_A > \text{Start}_B)$$
This algorithm prevents overlapping drives at the same venue while correctly allowing non-overlapping drives on the same day or simultaneous drives at different venues.

### 6.2 Duplicate Prevention & Capacity Protection
When a donor submits a registration:
1. `isDonorRegistered(email, campaignId)` scans all registrations for the chosen campaign.
2. Current count is checked against maximum capacity (`registeredCount < capacity`).
3. If valid, donor profile is either created or linked from previous drives, ensuring a normalized one-to-many relationship.
