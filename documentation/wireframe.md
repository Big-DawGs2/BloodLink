# BloodLink — UI Wireframe & Layout Specification
**Course:** CS344 Web Engineering — Assignment 1 (Fall 2026)  
**Project #21:** Blood Donation Campaign Scheduler  
**Student:** Huzaifa Sohail  

---

## 1. Overview and Design Philosophy

The BloodLink user interface is constructed following core web design principles taught in **W05L10 (Web Design)** and **W05L11 (Responsive Web Design)**:
- **Visual Hierarchy:** Distinct visual weights through typography, status badges, and contrasting call-to-action buttons.
- **Scannability:** Clear groupings of campaign metadata (Date, Time, Location, Capacity progress bar).
- **Proximity & Whitespace:** Consistent margin and padding using CSS Box Model principles (content, padding, border, margin).
- **Fitts's Law:** Large, easily clickable primary buttons on desktop and full-width touch targets on mobile viewports.

---

## 2. Desktop Wireframe Layout (Viewport: > 768px)

```
+-------------------------------------------------------------------------------------------------------+
|  [LOGO] BloodLink               [Home]   [Campaigns]   [Create Campaign]   [Register as Donor]        |
|  Connecting Donors. Supporting Lives.                                                                 |
+-------------------------------------------------------------------------------------------------------+
|                                                                                                       |
|                                         HERO SECTION                                                  |
|                   "Every Drop Counts — Be a Hero, Donate Blood"                                       |
|      Join BloodLink's network of life-saving blood donation campaigns across Pakistan.                |
|                                                                                                       |
|                   [ View Campaigns ]                [ Register Now ]                                  |
|                                                                                                       |
+-------------------------------------------------------------------------------------------------------+
|                                                                                                       |
|                                       DASHBOARD STATS                                                 |
|   +--------------------+  +--------------------+  +--------------------+  +--------------------+      |
|   |  Total Campaigns   |  | Upcoming Campaigns |  |Total Registrations |  |  Available Slots   |      |
|   |         8          |  |         5          |  |        25          |  |        218         |      |
|   +--------------------+  +--------------------+  +--------------------+  +--------------------+      |
|                                                                                                       |
+-------------------------------------------------------------------------------------------------------+
|                                                                                                       |
|                                        HOW IT WORKS                                                   |
|   +--------------------+  +--------------------+  +--------------------+  +--------------------+      |
|   |   (1) Find Drive   |  |    (2) Register    |  |     (3) Donate     |  |   (4) Save Lives   |      |
|   | Browse campaigns   |  | Pick blood group & |  | Visit venue on the |  | Save up to 3 lives |      |
|   | in your city       |  | reserve slot       |  | scheduled date     |  | with one donation  |      |
|   +--------------------+  +--------------------+  +--------------------+  +--------------------+      |
|                                                                                                       |
+-------------------------------------------------------------------------------------------------------+
|                                                                                                       |
|                                  UPCOMING CAMPAIGNS PREVIEW                                           |
|   +-----------------------------+ +-----------------------------+ +-----------------------------+     |
|   | [Upcoming]                  | | [Upcoming]                  | | [Upcoming]                  |     |
|   | Rawalpindi Blood Drive 2026 | | Lahore General Hospital     | | Islamabad Community Camp    |     |
|   | 📍 Red Crescent Hospital    | | 📍 Lahore General Hospital  | | 📍 F-8 Community Center     |     |
|   | 📅 Wed, Nov 25, 2026        | | 📅 Sat, Dec 05, 2026        | | 📅 Thu, Dec 10, 2026        |     |
|   | 🕐 09:00 AM – 02:00 PM      | | 🕐 08:00 AM – 01:00 PM      | | 🕐 09:00 AM – 03:00 PM      |     |
|   | [A+] [B+] [O+] [AB+] ...    | | [A+] [A-] [B+] [B-] [O+]    | | [All Blood Groups]          |     |
|   | [==== 32/50 Donors ====]    | | [= 15/60 Donors =]          | | [ 5/80 Donors ]             |     |
|   | [    View Details    ]      | | [    View Details    ]      | | [    View Details    ]      |     |
|   +-----------------------------+ +-----------------------------+ +-----------------------------+     |
|                                     [ View All Campaigns ]                                            |
+-------------------------------------------------------------------------------------------------------+
```

---

## 3. Campaigns Explorer Wireframe (Search & Filtering)

```
+-------------------------------------------------------------------------------------------------------+
|  ALL CAMPAIGNS                                                                                        |
|  +-------------------------------------------------------------------------------------------------+  |
|  | [ Search title... ] | Blood Group: [All v] | Date: [mm/dd/yyyy] | Status: [All v] | [Reset]     |  |
|  +-------------------------------------------------------------------------------------------------+  |
|                                                                                                       |
|  +-----------------------------+ +-----------------------------+ +-----------------------------+      |
|  | [Upcoming]                  | | [Full]                      | | [Completed]                 |      |
|  | Rawalpindi Blood Drive 2026 | | NUST Campus Donation Day    | | Karachi Medical Drive       |      |
|  | 📍 Red Crescent Hospital    | | 📍 NUST Health Center       | | 📍 Aga Khan Univ Hospital   |      |
|  | 📅 Nov 25, 2026             | | 📅 Nov 28, 2026             | | 📅 Oct 15, 2026             |      |
|  | [====== 32/50 ======]       | | [================ 40/40 ===]| | [================ 45/45 ===]|      |
|  | [    View Details    ]      | | [    View Details    ]      | | [    View Details    ]      |      |
|  +-----------------------------+ +-----------------------------+ +-----------------------------+      |
+-------------------------------------------------------------------------------------------------------+
```

---

## 4. Modal Overlays Wireframe

### 4.1 Campaign Detail Modal
```
+-----------------------------------------------------------------------+
|  CAMPAIGN DETAILS                                                 [X] |
+-----------------------------------------------------------------------+
|  Rawalpindi Blood Drive 2026                           [Upcoming]     |
|                                                                       |
|  Organizer: Red Crescent Society                                      |
|  Location:  Red Crescent Hospital, Rawalpindi                         |
|  Date:      Wednesday, November 25, 2026                              |
|  Time:      09:00 AM – 02:00 PM                                       |
|  Required:  [A+] [A-] [B+] [B-] [AB+] [AB-] [O+] [O-]                 |
|  Capacity:  32 / 50 Registered                                        |
|  Contact:   051-9290231                                               |
|                                                                       |
|  Description:                                                         |
|  A large-scale blood donation drive organized by the Red Crescent     |
|  Society at their Rawalpindi headquarters. Free health screening.     |
|                                                                       |
|  Registered Donors:                                                   |
|  • Ahmad Raza (A+) — ahmad.raza@email.com                             |
|  • Fatima Khan (B+) — fatima.khan@email.com                           |
|  • Usman Ali (O+) — usman.ali@email.com                               |
|                                                                       |
|  [ Register for This Campaign ]    [ Edit Campaign ]   [ Delete ]     |
+-----------------------------------------------------------------------+
```

---

## 5. Forms Wireframe

### 5.1 Campaign Creation Form
```
+-----------------------------------------------------------------------+
|  CREATE A NEW CAMPAIGN                                                |
+-----------------------------------------------------------------------+
|  Campaign Name *      [ e.g. Spring Blood Drive 2026                ] |
|  Organizer *          [ e.g. Red Crescent Society                   ] |
|  Location *           [ e.g. FAST-NUCES Lahore Campus               ] |
|  +--------------------+ +--------------------+ +--------------------+ |
|  | Date * [mm/dd/yyyy]| | Start Time * [09:00] | End Time * [14:00]  | |
|  +--------------------+ +--------------------+ +--------------------+ |
|  Required Blood Groups *                                              |
|  [X] A+   [X] A-   [X] B+   [X] B-   [X] AB+   [X] AB-   [X] O+   [X] O-|
|  Max Capacity *       [ 50                                          ] |
|  Contact Info *       [ 03175941654                                ] |
|  Description *        [ Multiline textarea description...           ] |
|                                                                       |
|  [!] Conflict Warning / Validation Error Box (dynamically rendered)   |
|                                                                       |
|  [ Create Campaign ]                            [ Reset ]             |
+-----------------------------------------------------------------------+
```

### 5.2 Donor Registration Form
```
+-----------------------------------------------------------------------+
|  REGISTER AS A DONOR                                                  |
+-----------------------------------------------------------------------+
|  Full Name *          [ Huzaifa Sohail                              ] |
|  Email Address *      [ hsohail.bese24seecs@seecs.edu.pk                         ] |
|  Phone Number *       [ 03175941654                                ] |
|  Blood Group *        [ -- Select Blood Group -- v ]                  |
|  Select Campaign *    [ Rawalpindi Blood Drive 2026 (18 slots left) v]|
|                                                                       |
|  [!] Validation / Feedback Box (dynamically rendered)                 |
|                                                                       |
|  [ Register ]                                   [ Reset ]             |
+-----------------------------------------------------------------------+
```

---

## 6. Mobile Wireframe Layout (Viewport: ≤ 480px)

```
+-----------------------------------------+
| [LOGO] BloodLink                 [ = ]  |
+-----------------------------------------+
| (Mobile Dropdown when [ = ] tapped):    |
| • Home                                  |
| • Campaigns                             |
| • Create Campaign                       |
| • Register as Donor                     |
+-----------------------------------------+
|                                         |
| HERO SECTION                            |
| "Every Drop Counts —                    |
|  Be a Hero, Donate Blood"               |
|                                         |
| [ View Campaigns ]                      |
| [ Register Now ]                        |
+-----------------------------------------+
| DASHBOARD (Stacked 1-column)            |
| +-------------------------------------+ |
| | Total Campaigns: 8                  | |
| +-------------------------------------+ |
| | Upcoming Campaigns: 5               | |
| +-------------------------------------+ |
| | Total Registrations: 25             | |
| +-------------------------------------+ |
| | Available Slots: 218                | |
| +-------------------------------------+ |
+-----------------------------------------+
| CAMPAIGN CARDS (100% Full Width)        |
| +-------------------------------------+ |
| | [Upcoming]                          | |
| | Rawalpindi Blood Drive 2026         | |
| | 📍 Red Crescent Hospital            | |
| | 📅 Nov 25, 2026                     | |
| | 🕐 09:00 AM – 02:00 PM              | |
| | [A+] [B+] [O+]                      | |
| | [ 32 / 50 Donors ]                  | |
| | [ View Details ]                    | |
| +-------------------------------------+ |
+-----------------------------------------+
| FOOTER (Single column, centered)        |
| BloodLink © 2026 — Huzaifa Sohail       |
+-----------------------------------------+
```
