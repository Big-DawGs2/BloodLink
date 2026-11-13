# BloodLink — Viva Preparation & GitHub Submission Guide
**Course:** CS344 Web Engineering — Assignment 1 (Fall 2026)  
**Project #21:** Blood Donation Campaign Scheduler  
**Student:** Huzaifa Sohail  

---

## PART 1 — STEP-BY-STEP GITHUB PROCEDURE

Follow these exact steps to upload your project to GitHub for grading.

### Recommended Long-Term Repository Structure
To maintain continuity across Assignments 1, 2, and 3 without losing Assignment 1:
```
CS344-BloodLink/
│
├── Assignment-1/
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── assets/
│   ├── documentation/
│   ├── screenshots/
│   └── README.md
│
├── Assignment-2/      (To be added in Assignment 2)
└── Assignment-3/      (To be added in Assignment 3)
```

For Assignment 1 submission, you can push the `BloodLink` folder directly or inside an `Assignment-1/` directory.

### Step 1: Create a New Repository on GitHub
1. Log in to your personal account on [GitHub](https://github.com).
2. Click the **+** icon in the top right corner and select **New repository**.
3. Set the Repository name: `CS344-BloodLink` (or `BloodLink-CS344`).
4. Set visibility to **Public** (or Private if requested by instructor, then invite instructor as collaborator).
5. **DO NOT** check "Add a README file" or ".gitignore" (we have already created professional versions locally).
6. Click **Create repository**.
7. Copy the repository HTTPS URL (e.g. `https://github.com/your-username/CS344-BloodLink.git`).

### Step 2: Open Terminal in VS Code
1. Open VS Code.
2. Select **File $\rightarrow$ Open Folder...** and choose the `c:\Users\Lenovo\Downloads\Assignment 1 WEB\BloodLink` folder.
3. Open the integrated terminal by pressing ``Ctrl + ` `` (Backtick) or selecting **Terminal $\rightarrow$ New Terminal**.

### Step 3: Initialize Git & Commit Files
Run these exact commands in the terminal:

```bash
# 1. Initialize local Git repository
git init

# 2. Configure your identity for commits
git config user.name "Huzaifa Sohail"
git config user.email "hsohail.bese24seecs@seecs.edu.pk"

# 3. Stage all project files
git add .

# 4. Create your official initial commit
git commit -m "feat: complete CS344 Assignment 1 - BloodLink client-side application"

# 5. Set default branch to main
git branch -M main

# 6. Link to your GitHub remote repository (replace with your actual URL)
git remote add origin https://github.com/your-username/CS344-BloodLink.git

# 7. Push to GitHub main branch
git push -u origin main
```

### Step 4: Verify Your Upload
1. Refresh your GitHub repository page in the browser.
2. Confirm that all folders (`css/`, `js/`, `assets/`, `documentation/`, `screenshots/`) and `index.html`, `README.md`, `.gitignore` are present.
3. Review the rendered `README.md` on the repository homepage to ensure markdown tables, code blocks, and headings render clearly.

---

## PART 2 — VIVA & INSTRUCTOR WALKTHROUGH PREPARATION

During the instructor viva/demo, you may be asked to explain your code, justify your architectural choices, and make a live modification.

### 15 High-Probability Viva Questions & Clear Answers

#### Q1: What is the Web Development Life Cycle (WDLC) and which stages did you follow?
> **Answer:** "WDLC is the systematic engineering process for building web applications (taught in W01L03). For Assignment 1, I followed the first four stages:
> 1. *Requirements Analysis:* Identified core user needs (donors, organizers) and rules (conflict detection, capacity limits).
> 2. *Architectural & UI Design:* Created desktop, tablet, and mobile wireframes and established the data model.
> 3. *Implementation:* Developed semantic HTML5, responsive CSS3 (Grid & Flexbox), and vanilla JavaScript.
> 4. *Testing:* Validated all edge cases (past dates, venue conflicts, duplicate donors).
> The future stages—server-side persistence and full-stack transformation—will be completed in Assignments 2 and 3."

#### Q2: How does client-server architecture apply to Assignment 1 versus Assignment 2?
> **Answer:** "In Assignment 1 (client-side prototype), all logic, state, and rendering occur entirely in the client's browser using JavaScript arrays and DOM manipulation (W01L02). No web server or database is involved. In Assignment 2, this will transition to a traditional client-server architecture where the browser makes asynchronous HTTP requests using the `fetch()` API to a PHP 8.5 backend, which communicates with an SQLite or MySQL database via PDO."

#### Q3: Why did you use semantic HTML elements instead of generic `<div>` tags?
> **Answer:** "Semantic elements like `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` (taught in W02L04/W02L05) provide machine-readable meaning to the document outline. They improve accessibility for screen readers, provide clear landmark navigation, and enhance search engine parsing. For example, each campaign card is an `<article>` because it represents an independent, reusable piece of content."

#### Q4: How is the CSS Box Model used in your design?
> **Answer:** "The CSS Box Model consists of content, padding, border, and margin (W03L06). I used `box-sizing: border-box;` universally so that padding and border are included within the element's total width and height. This prevents layout breakage and horizontal overflow when adding padding to form inputs, buttons, and campaign cards."

#### Q5: Where did you use CSS Flexbox versus CSS Grid, and why?
> **Answer:** "I used **Flexbox** for 1-dimensional layouts (nav bar items, button groups, filter bar controls, and status badges) where alignment along a single axis is needed. I used **CSS Grid** for 2-dimensional layouts (the 4 dashboard statistic cards, the 3-column campaign card grid, and the multi-column footer) because Grid enables rigid row and column tracks that automatically reflow responsively."

#### Q6: Explain your responsive design strategy and media query breakpoints.
> **Answer:** "As taught in W05L11, I implemented responsive design using fluid layouts, relative units (`rem`, `%`), and two media query breakpoints:
> - `@media (max-width: 768px)` (Tablet): Converts the horizontal nav to a collapsible mobile menu, condenses the dashboard stats into 2 columns, and reflows forms.
> - `@media (max-width: 480px)` (Mobile): Stacks campaign cards into a single 100% width column, makes buttons full-width touch targets, and reduces heading font sizes to prevent line wraps."

#### Q7: How does your scheduling conflict detection algorithm work?
> **Answer:** "In `js/data.js`, the function `checkSchedulingConflict(location, date, startTime, endTime, excludeId)` checks whether an existing campaign shares the exact same location and date. If so, it verifies whether the time intervals overlap using the mathematical interval test: `startTime < camp.endTime && endTime > camp.startTime`. This flags overlapping drives while correctly allowing non-overlapping drives on the same day at the same venue."

#### Q8: How did you implement duplicate donor registration prevention?
> **Answer:** "In `js/donors.js`, before adding a registration, `isDonorRegistered(email, campaignId)` iterates through the `registrations` array. For each registration linked to that `campaignId`, it looks up the associated donor by `donorId`. If the donor's email matches the input email, registration is blocked with a descriptive error message."

#### Q9: How are campaign statuses determined?
> **Answer:** "Campaign status is computed dynamically in `computeCampaignStatus(campaign)`:
> 1. If the campaign date is strictly before today's date, status is `'Completed'`.
> 2. Else if `registeredCount >= capacity`, status is `'Full'`.
> 3. Otherwise, status is `'Upcoming'`.
> Users can only register for campaigns that are `'Upcoming'`."

#### Q10: How are the dashboard statistics calculated?
> **Answer:** "In `js/data.js`, `getDashboardStats()` iterates through the `campaigns` and `registrations` arrays to dynamically sum total campaigns, count campaigns with status `'Upcoming'`, count total registrations, and sum the remaining available slots (`capacity - registeredCount`). These numbers update reactively whenever a campaign or donor is added."

#### Q11: How is data organized in memory, and how will it translate to a database in Assignment 2?
> **Answer:** "Data is organized in three normalized arrays: `campaigns`, `donors`, and `registrations`. Each object has a unique identifier (`CAM-XXX`, `DON-XXX`, `REG-XXX`). In Assignment 2, these map directly to three relational database tables: a `campaigns` table, a `donors` table, and a `registrations` associative table with foreign keys linking `donor_id` and `campaign_id`."

#### Q12: Why did you avoid frameworks like React or Bootstrap in Assignment 1?
> **Answer:** "The official assignment rubric strictly requires semantic HTML5, pure CSS3, and vanilla JavaScript without external libraries or frameworks. This demonstrates mastery of foundational web technologies (Weeks 1–5). React is specifically scheduled for Assignment 3, where the application will be transitioned into a full-stack MERN platform."

#### Q13: How do you handle empty search results or invalid filters?
> **Answer:** "In `js/campaigns.js`, `renderCampaigns()` checks if the filtered array is empty (`campaignList.length === 0`). If so, it injects a dedicated `.empty-state` container displaying an informative message: *'No campaigns found matching your criteria. Try resetting filters.'* rather than leaving a blank or broken container."

#### Q14: How does your application prevent SQL injection or XSS if migrated to a backend?
> **Answer:** "For Assignment 1, we avoid `innerHTML` with unsanitized user inputs where possible, using `textContent` to safely encode text. In Assignment 2, we will use PDO Prepared Statements with bound parameters (`:id`, `:email`) for all database queries containing user input, and encode HTML output using `htmlspecialchars()` before rendering."

#### Q15: What happens when an organizer deletes a campaign?
> **Answer:** "When `deleteCampaign(campaignId)` is confirmed, the campaign is spliced from the `campaigns` array, and all registrations matching that `campaignId` are removed from the `registrations` array to maintain referential integrity. The campaign grid, dashboard stats, and dropdowns are then immediately re-rendered."

---

## PART 3 — LIVE MODIFICATIONS FOR INSTRUCTOR DEMONSTRATION

Instructors often ask students to make a small live change during the demonstration. Here are two prepared, easy modifications:

### Live Change 1: Add a "City" Filter or Change Primary Theme Color
If the instructor asks: *"Can you change the primary accent color to teal or dark navy?"*
1. Open `css/style.css`.
2. Locate the `:root` block at lines 8–12:
   ```css
   --primary: #8B1A1A;       /* Change to #0056b3 (Navy) or #00796B (Teal) */
   --accent: #C41E3A;        /* Change to #00A896 */
   ```
3. Save the file and refresh the browser. The header, buttons, badges, and accents will instantly update across the entire site.

### Live Change 2: Adjust Donor Slot Capacity Threshold
If the instructor asks: *"Can you add an alert when a campaign has 5 or fewer slots remaining?"*
1. Open `js/campaigns.js`.
2. Locate `renderCampaignCard` around line 20:
   ```javascript
   var slotsLeft = campaign.capacity - campaign.registeredCount;
   var urgentBadge = '';
   if (slotsLeft > 0 && slotsLeft <= 5) {
       urgentBadge = '<span class="status-badge" style="background:#d9534f;">Only ' + slotsLeft + ' Left!</span> ';
   }
   ```
3. Add `urgentBadge` into the card header. Refresh the page to demonstrate immediate proficiency with the code.
