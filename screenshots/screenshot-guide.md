# BloodLink — Screenshot Capture Checklist & Submission Guide
**Course:** CS344 Web Engineering — Assignment 1 (Fall 2026)  
**Project #21:** Blood Donation Campaign Scheduler  
**Student:** Huzaifa Sohail  

---

## 1. Overview

Before submitting your repository on GitHub or demonstrating in class, take clean full-page and component screenshots of the running BloodLink application in your browser (e.g. Google Chrome or Microsoft Edge).

Place the captured PNG images directly into this `screenshots/` directory using the designated filenames below.

---

## 2. Screenshot Checklist

| # | Target View / State | Recommended Filename | How to Produce in Application |
|---|---|---|---|
| **01** | **Homepage & Hero Section** | `01_home_hero.png` | Open `index.html` in browser. Capture the top navigation, BloodLink logo, and Hero banner. |
| **02** | **Dynamic Dashboard Stats** | `02_dashboard_stats.png` | Scroll to the Dashboard section showing the 4 stat cards (Total Campaigns: 8, Upcoming: 5, Registrations: 25, Available Slots: 218). |
| **03** | **How It Works & Upcoming Preview** | `03_how_it_works_preview.png` | Capture the 4-step workflow cards and the 3 upcoming campaign preview cards. |
| **04** | **All Campaigns Explorer** | `04_campaigns_explorer.png` | Click "Campaigns" in the top navigation. Capture the search/filter toolbar and the full 8 campaign cards with status badges. |
| **05** | **Filter & Search Demonstration** | `05_campaigns_filtered.png` | Type "Rawalpindi" in the search box or select Blood Group "O+". Capture the filtered grid showing matching cards. |
| **06** | **Empty Filter State** | `06_empty_state.png` | Type a non-existent search query (e.g. "XYZ999") into the search box. Capture the friendly "No campaigns found" empty state. |
| **07** | **Campaign Detail Modal** | `07_campaign_detail_modal.png` | Click "View Details" on any upcoming campaign (e.g., CAM-001). Capture the modal overlay with complete metadata and registered donors list. |
| **08** | **Campaign Creation Form** | `08_create_campaign_form.png` | Click "Create Campaign" in navigation. Capture the clean form with input fields, time pickers, and blood group checkboxes. |
| **09** | **Scheduling Conflict Warning** | `09_scheduling_conflict_alert.png` | In Create Campaign, enter Location: "Red Crescent Hospital, Rawalpindi", Date: "2026-11-25", Time: 10:00 to 13:00. Click Submit. Capture the red conflict notification. |
| **10** | **Successful Campaign Creation** | `10_campaign_created_success.png` | Enter valid new campaign data on a non-conflicting date/time. Click Submit. Capture the green success alert and toast notification. |
| **11** | **Donor Registration Form** | `11_donor_registration_form.png` | Click "Register as Donor" in navigation. Capture the registration form. |
| **12** | **Duplicate Donor Prevention** | `12_duplicate_donor_alert.png` | Enter Email: "ahmad.raza@email.com" and select "Rawalpindi Blood Drive 2026". Click Register. Capture the red duplicate warning. |
| **13** | **Successful Donor Registration** | `13_donor_registered_success.png` | Enter a fresh name, email, phone number (`0300-1122334`), and select an upcoming campaign. Click Register. Capture the confirmation message and green toast. |
| **14** | **Full Campaign Registration Block** | `14_full_campaign_block.png` | Attempt to register for "NUST Campus Donation Day" (40/40 capacity). Capture the capacity exhaustion message. |
| **15** | **Responsive Tablet View (768px)** | `15_responsive_tablet.png` | Open DevTools (`F12`), toggle Device Toolbar (`Ctrl+Shift+M`), set width to `768px`. Capture the 2-column stats and reflowed cards. |
| **16** | **Responsive Mobile View (375px/480px)** | `16_responsive_mobile.png` | In DevTools, set width to `375px` or `414px` (iPhone/Pixel). Capture the stacked single-column layout, touch buttons, and hamburger menu. |
| **17** | **Mobile Navigation Menu Open** | `17_mobile_nav_open.png` | On mobile viewport, tap the hamburger menu icon. Capture the slide-down mobile menu links. |

---

## 3. How to Capture High-Resolution Screenshots
1. In Google Chrome or Edge, press `F12` to open Developer Tools.
2. Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac) to open the Command Palette.
3. Type `screenshot`.
4. Choose:
   - **Capture full size screenshot** for full-page layout documentation.
   - **Capture area screenshot** or **Capture screenshot** for specific modals and forms.
5. Save the images into this `screenshots/` directory.
