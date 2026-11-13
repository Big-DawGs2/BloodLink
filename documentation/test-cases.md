# BloodLink — Test Cases & Quality Assurance Report
**Course:** CS344 Web Engineering — Assignment 1 (Fall 2026)  
**Project #21:** Blood Donation Campaign Scheduler  
**Student:** Huzaifa Sohail  

---

## 1. Test Suite Summary

The BloodLink application was subjected to thorough end-to-end and boundary test execution across all functional requirements:
- **Total Test Cases Executed:** 14
- **Passed:** 14
- **Failed:** 0
- **Status:** 100% Pass Rate

---

## 2. Test Case Execution Log

| Test ID | Module / Feature | Description | Test Inputs | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC-01** | Campaign Creation | Valid campaign creation with complete details | Name: "FAST Spring Blood Camp 2026", Org: "FAST Health Society", Loc: "F-11 Campus, Islamabad", Date: "2026-12-15", Time: 09:00–14:00, Blood: A+, B+, O+, Cap: 50, Contact: "0300-1112233" | Campaign added to array, unique ID `CAM-009` assigned, cards & dashboard update, success toast shown | New campaign record generated, dashboard count incremented from 8 to 9, cards updated | **PASSED** |
| **TC-02** | Campaign Creation | Rejection of missing required fields | Title: "", Org: "Red Crescent", Date: "2026-12-15", Cap: 50 | Form submission intercepted, inline validation error displayed, no record created | Alert message displayed: "Please enter a campaign name.", submission halted | **PASSED** |
| **TC-03** | Campaign Creation | Past date rejection | Date: "2024-01-01" (date in past relative to current date) | Submission rejected, error message stating campaign date cannot be in the past | Alert displayed: "Campaign date cannot be in the past.", input field focused | **PASSED** |
| **TC-04** | Campaign Creation | Invalid time range (End time $\le$ Start time) | Start Time: "14:00", End Time: "11:00" | Submission rejected, warning that end time must be strictly after start time | Alert displayed: "Ending time must be later than starting time.", record blocked | **PASSED** |
| **TC-05** | Conflict Engine | Spatial-temporal conflict detection at same venue & date | Loc: "Red Crescent Hospital, Rawalpindi", Date: "2026-11-25", Time: 10:00–13:00 (overlaps CAM-001 09:00–14:00) | Scheduling conflict detected, overlapping campaign title and time displayed | Conflict caught with message: "Scheduling conflict with 'Rawalpindi Blood Drive 2026' at the same location (09:00 – 14:00)." | **PASSED** |
| **TC-06** | Conflict Engine | Non-overlapping campaigns allowed at same venue & date | Loc: "Red Crescent Hospital, Rawalpindi", Date: "2026-11-25", Time: 15:00–18:00 (after CAM-001 ends at 14:00) | Allowed without conflict, campaign saved | Conflict check returns 0 conflicts, campaign successfully scheduled | **PASSED** |
| **TC-07** | Donor Registration | Successful donor registration | Name: "Bilal Tariq", Email: "bilal.tariq@gmail.com", Phone: "0300-9876543", Blood: "A+", Campaign: "CAM-001" | Registration created (`REG-026`), donor count increments (32 $\rightarrow$ 33), success toast displayed | Registration record saved, capacity meter updated, success toast shown | **PASSED** |
| **TC-08** | Donor Registration | Invalid email address syntax | Email: "invalid-email-at-domain" | Form rejected, clear error requiring standard email syntax | Error displayed: "Please enter a valid email address.", input focused | **PASSED** |
| **TC-09** | Donor Registration | Invalid Pakistani telephone number format | Phone: "12345" or "abcdef" | Form rejected with telephone format hint | Error displayed: "Please enter a valid Pakistani mobile number (e.g., 03175941654 or 03001234567)." | **PASSED** |
| **TC-10** | Donor Registration | Duplicate registration prevention | Email: "ahmad.raza@email.com", Campaign: "CAM-001" (donor already registered) | Duplicate registration blocked, error notification displayed | Error message: "You are already registered for this campaign with email ahmad.raza@email.com." | **PASSED** |
| **TC-11** | Donor Registration | Registration attempt on Full campaign | Campaign: "CAM-002" (NUST Campus Donation Day — Capacity 40/40) | Registration blocked, notice that slots are exhausted | Error displayed: "This campaign has reached its maximum donor capacity (40). No more slots available." | **PASSED** |
| **TC-12** | Search & Filtering | Real-time campaign search by keyword and location | Search: "Rawalpindi", Blood Group: "All", Status: "All" | Only campaigns in Rawalpindi or with "Rawalpindi" in title displayed | Grid rendered 1 matching campaign (`CAM-001`), non-matching campaigns filtered out | **PASSED** |
| **TC-13** | Search & Filtering | Zero matches empty state | Search: "NonExistentCityXYZ" | Friendly empty state message rendered with instructions to reset filters | Container displayed: "No campaigns found matching your filter criteria. Try resetting filters." | **PASSED** |
| **TC-14** | Responsive Behavior | Viewport scaling (Desktop > Tablet 768px > Mobile 480px) | Viewport resized across breakpoints | Desktop: 4 stat cards, 3-column campaign grid. Tablet: 2 stat cards, hamburger menu toggles. Mobile: 1-column cards, full-width touch targets. | All layout elements reflow cleanly without horizontal scrollbars or overflow | **PASSED** |

---

## 3. Edge Cases & Boundary Conditions Addressed

1. **Exact Boundary Times:**
   - A campaign ending at `14:00` and another starting at `14:00` at the same venue do NOT conflict. Our interval overlap condition:
     $$\text{Start}_A < \text{End}_B \land \text{End}_A > \text{Start}_B$$
     evaluates to `false` when $\text{End}_A = \text{Start}_B$, correctly allowing contiguous non-overlapping drive scheduling.
2. **Whitespace and Case Insensitivity:**
   - Location comparisons use `.toLowerCase().trim()` to prevent accidental bypasses due to capitalization or trailing spaces (`"Islamabad "` matches `"islamabad"`).
3. **Blood Group Matching:**
   - When a campaign requests specific blood groups (e.g., `O-`, `O+`), donors selecting mismatched groups receive an informative compatibility notification.
4. **Phone Number Flexibility:**
   - Donors can enter `03175941654`, `03001234567`, or `03175941654`. The validator strips separators and verifies the 11-digit or 13-digit Pakistani mobile specification.
