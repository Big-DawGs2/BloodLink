<?php
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/security.php';
startSecureSession();
getDb();
$csrfToken = getCsrfToken();
$currentUser = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="<?= e($csrfToken) ?>">
  <meta name="description" content="BloodLink — Blood Donation Campaign Scheduler. Connecting Donors. Supporting Lives.">
  <title>BloodLink — Blood Donation Campaign Scheduler</title>
  <link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg">
  <!-- Google Fonts: Playfair Display (headings) + Inter (body) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- ========== HEADER / NAVIGATION ========== -->
  <header class="site-header">
    <div class="container header-inner">
      <div class="brand">
        <a href="#hero" class="brand-link">
          <img src="assets/images/logo.svg" alt="BloodLink Logo" class="brand-logo" width="36" height="36">
          <div class="brand-info">
            <span class="brand-name">BloodLink</span>
            <span class="brand-tagline">Connecting Donors. Supporting Lives.</span>
          </div>
        </a>
      </div>

      <button id="menuToggle" class="menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mainNav">
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>

      <nav id="mainNav" class="main-nav" aria-label="Primary navigation">
        <ul class="nav-list">
          <li><a href="#hero" class="nav-link active" data-section="hero">Home</a></li>
          <li><a href="#campaigns" class="nav-link" data-section="campaigns">Campaigns</a></li>
          <li><a href="#createCampaignSection" class="nav-link" data-section="createCampaignSection">Create Campaign</a></li>
          <li><a href="#registerSection" class="nav-link" data-section="registerSection">Register as Donor</a></li>
          <li class="nav-auth-item">
            <button type="button" id="authOpenBtn" class="btn-nav-auth" aria-label="Organizer Sign In">Sign In</button>
            <div id="authUserPill" class="auth-user-pill hidden">
              <span id="authUserName" class="auth-user-name"></span>
              <button type="button" id="authLogoutBtn" class="btn-nav-logout" title="Sign Out">Sign Out</button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- ========== MAIN CONTENT ========== -->
  <main>

    <!-- ===== HERO SECTION ===== -->
    <section id="hero" class="section hero-section">
      <div class="container hero-container">
        <div class="hero-text-col">
          <div class="hero-badge">
            <span class="badge-pulse"></span>
            <span>Urgent Appeal &bull; Saving Young Lives Across Pakistan</span>
          </div>
          <h1>Every Drop Counts &mdash; Give Blood, Give a Child Tomorrow</h1>
          <p class="hero-subtitle">
            Every day, thousands of young patients battling thalassemia, leukemia, and emergency trauma in Pakistan depend on selfless blood donors. Join BloodLink to discover verified hospital campaigns, reserve your donation slot, and give the gift of life.
          </p>
          <div class="hero-actions">
            <a href="#campaigns" class="btn btn-hero-primary" data-section="campaigns">View Campaigns</a>
            <a href="#registerSection" class="btn btn-hero-secondary" data-section="registerSection">Register Now</a>
          </div>
          <div class="hero-highlights">
            <div class="highlight-item">
              <strong>1 Donation</strong>
              <span>Saves up to 3 lives</span>
            </div>
            <div class="highlight-item">
              <strong>100% Free</strong>
              <span>Health screening</span>
            </div>
            <div class="highlight-item">
              <strong>Verified Drives</strong>
              <span>Across Pakistan</span>
            </div>
          </div>
        </div>

        <div class="hero-visual-col">
          <div class="hero-image-card">
            <img src="assets/images/hero-child-transfusion.jpg" alt="Child patient receiving life-saving pediatric transfusion support" class="hero-child-img">
            <div class="hero-image-overlay">
              <div class="hero-caption-card">
                <div class="caption-icon">&#129656;</div>
                <div class="caption-text">
                  <strong>Hope for Young Patients</strong>
                  <span>Your donation provides emergency pediatric transfusions to children in critical need.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== DASHBOARD / STATS SECTION ===== -->
    <section id="dashboard" class="section dashboard-section">
      <div class="container">
        <h2>Dashboard</h2>
        <div class="stats-grid">
          <article class="stat-card">
            <h3>Total Campaigns</h3>
            <p class="stat-value" id="statTotalCampaigns">0</p>
          </article>
          <article class="stat-card">
            <h3>Upcoming Campaigns</h3>
            <p class="stat-value" id="statUpcoming">0</p>
          </article>
          <article class="stat-card">
            <h3>Total Registrations</h3>
            <p class="stat-value" id="statRegistrations">0</p>
          </article>
          <article class="stat-card">
            <h3>Available Slots</h3>
            <p class="stat-value" id="statSlots">0</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section id="howItWorks" class="section how-it-works-section hidden">
      <div class="container text-center">
        <h2 class="section-title">How It Works</h2>
        <p class="section-subtitle">Four simple steps to make an extraordinary difference in someone's life.</p>
        <div class="steps-grid">
          <article class="step-card">
            <span class="step-number">1</span>
            <h3>Find a Campaign</h3>
            <p>Browse upcoming blood donation campaigns in your area using our search and filter tools.</p>
          </article>
          <article class="step-card">
            <span class="step-number">2</span>
            <h3>Register</h3>
            <p>Sign up as a donor for any campaign that matches your blood group and schedule.</p>
          </article>
          <article class="step-card">
            <span class="step-number">3</span>
            <h3>Donate</h3>
            <p>Visit the campaign location on the scheduled date and donate blood safely.</p>
          </article>
          <article class="step-card">
            <span class="step-number">4</span>
            <h3>Save Lives</h3>
            <p>Your single donation can save up to three lives. Be the reason someone gets another chance.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== UPCOMING CAMPAIGNS PREVIEW ===== -->
    <section id="upcomingPreview" class="section upcoming-preview-section hidden">
      <div class="container text-center">
        <h2 class="section-title">Upcoming Campaigns</h2>
        <p class="section-subtitle">Don't miss these upcoming blood donation opportunities near you.</p>
        <div id="upcomingLoading" class="loading-state hidden" role="status" aria-live="polite">
          <span class="spinner" aria-hidden="true"></span>
          <span>Loading upcoming campaigns from database…</span>
        </div>
        <div id="upcomingError" class="error-state hidden" role="alert">
          <p>Unable to load upcoming campaigns right now.</p>
          <button type="button" class="btn btn-outline btn-sm" id="retryUpcomingBtn">Retry</button>
        </div>
        <div id="upcomingContainer" class="campaign-cards-grid">
          <!-- Campaign preview cards will be injected here by JS -->
        </div>
        <div class="section-action">
          <a href="#campaigns" class="btn btn-outline" data-section="campaigns">View All Campaigns</a>
        </div>
      </div>
    </section>

    <!-- ===== CAMPAIGN LISTING SECTION ===== -->
    <section id="campaigns" class="section campaigns-section hidden">
      <div class="container">
        <div class="campaigns-header-row">
          <h2>All Campaigns</h2>
          <div class="view-pref-group" role="group" aria-label="Card view density preference">
            <span class="view-pref-label">View:</span>
            <button type="button" class="btn-pref active" id="prefComfortable" data-density="comfortable">Comfortable</button>
            <button type="button" class="btn-pref" id="prefCompact" data-density="compact">Compact</button>
          </div>
        </div>

        <!-- Search & Filters -->
        <aside class="filters-bar" aria-label="Campaign filters">
          <div class="filter-group">
            <label for="searchInput" class="visually-hidden">Search campaigns</label>
            <input type="search" id="searchInput" class="filter-input" placeholder="Search campaigns…" aria-label="Search campaigns by name or location">
          </div>

          <div class="filter-group">
            <label for="filterBloodGroup">Blood Group</label>
            <select id="filterBloodGroup" class="filter-select">
              <option value="">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A−</option>
              <option value="B+">B+</option>
              <option value="B-">B−</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB−</option>
              <option value="O+">O+</option>
              <option value="O-">O−</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="filterDate">Date</label>
            <input type="date" id="filterDate" class="filter-input">
          </div>

          <div class="filter-group">
            <label for="filterStatus">Status</label>
            <select id="filterStatus" class="filter-select">
              <option value="">All</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Full">Full</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="filterLocation">Location</label>
            <input type="search" id="filterLocation" class="filter-input" placeholder="Filter by location…">
          </div>

          <div class="filter-group filter-actions">
            <button type="button" id="resetFilters" class="btn btn-outline">Reset Filters</button>
          </div>
        </aside>

        <!-- Loading & Error States -->
        <div id="campaignsLoading" class="loading-state hidden" role="status" aria-live="polite">
          <span class="spinner" aria-hidden="true"></span>
          <span>Fetching campaigns from server…</span>
        </div>
        <div id="campaignsError" class="error-state hidden" role="alert">
          <p id="campaignsErrorText">Failed to load campaigns.</p>
          <button type="button" class="btn btn-outline btn-sm" id="retryCampaignsBtn">Retry</button>
        </div>

        <!-- Campaign Grid -->
        <div id="campaignGrid" class="campaign-cards-grid">
          <!-- Campaign cards will be injected here by JS -->
        </div>
      </div>
    </section>

    <!-- ===== CAMPAIGN DETAIL MODAL / SECTION ===== -->
    <section id="campaignDetail" class="modal-overlay hidden" aria-hidden="true" role="dialog" aria-labelledby="detailCampaignName">
      <div class="modal-content">
        <button type="button" class="modal-close" id="closeDetail" aria-label="Close campaign details">&times;</button>
        <article class="campaign-detail-body">
          <h2 id="detailCampaignName">Campaign Name</h2>
          <div class="detail-meta">
            <p><strong>Organizer:</strong> <span id="detailOrganizer"></span></p>
            <p><strong>Location:</strong> <span id="detailLocation"></span></p>
            <p><strong>Date:</strong> <span id="detailDate"></span></p>
            <p><strong>Time:</strong> <span id="detailStartTime"></span> – <span id="detailEndTime"></span></p>
            <p><strong>Blood Groups Needed:</strong> <span id="detailBloodGroups"></span></p>
            <p><strong>Capacity:</strong> <span id="detailRegistered"></span> / <span id="detailCapacity"></span></p>
            <p><strong>Status:</strong> <span id="detailStatus"></span></p>
            <p><strong>Contact:</strong> <span id="detailContact"></span></p>
          </div>
          <div class="detail-description">
            <h3>Description</h3>
            <p id="detailDescription"></p>
          </div>
          <div class="detail-donors">
            <h3>Registered Donors</h3>
            <ul id="detailDonorList">
              <!-- Donor list items injected by JS -->
            </ul>
          </div>
          <div class="detail-actions">
            <a href="#registerSection" class="btn btn-primary" id="detailRegisterBtn" data-section="registerSection">Register for This Campaign</a>
            <button type="button" class="btn btn-secondary" id="detailEditBtn">Edit Campaign</button>
            <button type="button" class="btn btn-danger" id="detailDeleteBtn">Delete Campaign</button>
          </div>
        </article>
      </div>
    </section>

            <!-- ===== CREATE CAMPAIGN SECTION (ORGANIZER WORKSPACE) ===== -->
    <section id="createCampaignSection" class="section create-campaign-section hidden">
      <div class="container">
        <!-- Top Editorial Banner with Distinct Image -->
        <div class="create-header-banner">
          <div class="create-banner-text">
            <span class="badge-role">ORGANIZER WORKSPACE</span>
            <h2>Schedule &amp; Coordinate a Blood Drive</h2>
            <p>Set up an official donation campaign in your city. Our platform handles conflict detection, real-time donor capacity counters, and immediate public discovery across Pakistan.</p>
            <div class="organizer-perks-row">
              <span class="perk-tag">&#10003; Automated Venue Conflict Detection</span>
              <span class="perk-tag">&#10003; Real-Time Capacity Tracking</span>
              <span class="perk-tag">&#10003; Instant Public Listing</span>
            </div>
          </div>
          <div class="create-banner-image-wrap">
            <img src="assets/images/organizer-planning.jpg" alt="Organizers planning health drive and logistics" class="create-banner-img">
          </div>
        </div>

        <!-- The Clean Form Card -->
        <div class="create-form-container">
          <form id="campaignForm" class="modern-organizer-form" novalidate>
            <div id="createAuthNotice" class="auth-required-banner hidden" role="status">
              <div>
                <strong>Organizer Sign-In Required:</strong> Please sign in to create or manage your campaigns.
              </div>
              <button type="button" class="btn btn-primary btn-sm" id="createSignInPromptBtn">Sign In as Organizer</button>
            </div>

            <div class="form-section-heading">
              <h3>Campaign Specifications</h3>
              <p>Provide accurate event details for donor registration. Fields with <span class="required">*</span> are required.</p>
            </div>

            <fieldset>
              <legend class="visually-hidden">Campaign Details</legend>

              <div class="form-group">
                <label for="campName">Campaign Name <span class="required" aria-hidden="true">*</span></label>
                <input type="text" id="campName" name="campName" required minlength="3" placeholder="e.g. Islamabad Youth Red Crescent Drive">
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label for="campOrganizer">Organizer / Society <span class="required" aria-hidden="true">*</span></label>
                  <input type="text" id="campOrganizer" name="campOrganizer" required placeholder="e.g. Red Crescent Society Islamabad">
                </div>

                <div class="form-group">
                  <label for="campLocation">Venue / Address <span class="required" aria-hidden="true">*</span></label>
                  <input type="text" id="campLocation" name="campLocation" required placeholder="e.g. F-8 Community Center, Islamabad">
                </div>
              </div>

              <div class="form-row form-grid-3">
                <div class="form-group">
                  <label for="campDate">Date <span class="required" aria-hidden="true">*</span></label>
                  <input type="date" id="campDate" name="campDate" required>
                </div>
                <div class="form-group">
                  <label for="campStartTime">Start Time <span class="required" aria-hidden="true">*</span></label>
                  <input type="time" id="campStartTime" name="campStartTime" required>
                </div>
                <div class="form-group">
                  <label for="campEndTime">End Time <span class="required" aria-hidden="true">*</span></label>
                  <input type="time" id="campEndTime" name="campEndTime" required>
                </div>
              </div>

              <div class="form-group">
                <label id="campBloodGroupsLabel">Required Blood Groups <span class="required" aria-hidden="true">*</span></label>
                <div class="checkbox-group blood-chips-wrap" id="campBloodGroups" role="group" aria-labelledby="campBloodGroupsLabel">
                  <label class="checkbox-label blood-chip"><input type="checkbox" name="campBloodGroups" value="A+"> <span>A+</span></label>
                  <label class="checkbox-label blood-chip"><input type="checkbox" name="campBloodGroups" value="A-"> <span>A&minus;</span></label>
                  <label class="checkbox-label blood-chip"><input type="checkbox" name="campBloodGroups" value="B+"> <span>B+</span></label>
                  <label class="checkbox-label blood-chip"><input type="checkbox" name="campBloodGroups" value="B-"> <span>B&minus;</span></label>
                  <label class="checkbox-label blood-chip"><input type="checkbox" name="campBloodGroups" value="AB+"> <span>AB+</span></label>
                  <label class="checkbox-label blood-chip"><input type="checkbox" name="campBloodGroups" value="AB-"> <span>AB&minus;</span></label>
                  <label class="checkbox-label blood-chip"><input type="checkbox" name="campBloodGroups" value="O+"> <span>O+</span></label>
                  <label class="checkbox-label blood-chip"><input type="checkbox" name="campBloodGroups" value="O-"> <span>O&minus;</span></label>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label for="campCapacity">Target Donor Capacity <span class="required" aria-hidden="true">*</span></label>
                  <input type="number" id="campCapacity" name="campCapacity" required min="1" placeholder="e.g. 80">
                </div>

                <div class="form-group">
                  <label for="campContact">Contact Info / Phone <span class="required" aria-hidden="true">*</span></label>
                  <input type="text" id="campContact" name="campContact" required placeholder="e.g. 03175941654">
                </div>
              </div>

              <div class="form-group">
                <label for="campDescription">Campaign Description &amp; Instructions <span class="required" aria-hidden="true">*</span></label>
                <textarea id="campDescription" name="campDescription" required rows="4" placeholder="Describe the campaign mission, hospital partner, parking instructions, or donor guidelines..."></textarea>
              </div>
            </fieldset>

            <div id="campaignFormMsg" class="form-message" role="alert" aria-live="polite"></div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-submit-action">&#10010; Create &amp; Publish Campaign</button>
              <button type="reset" class="btn btn-outline">Clear Form</button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- ===== DONOR REGISTRATION SECTION (VOLUNTEER PORTAL) ===== -->
    <section id="registerSection" class="section donor-register-section hidden">
      <div class="container">
        <div class="donor-layout-grid">
          <!-- Left: The Registration Form -->
          <div class="donor-form-card">
            <div class="donor-form-header">
              <span class="badge-role badge-donor">DONOR ENROLLMENT</span>
              <h2>Register as a Donor</h2>
              <p>Reserve your verified slot in 2 minutes. Fields marked with <span class="required">*</span> are required.</p>
            </div>

            <form id="donorForm" novalidate>
              <fieldset>
                <legend class="visually-hidden">Donor Information</legend>

                <div class="form-group">
                  <label for="donorName">Full Name <span class="required" aria-hidden="true">*</span></label>
                  <input type="text" id="donorName" name="donorName" required placeholder="e.g. Ali Hassan">
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label for="donorEmail">Email Address <span class="required" aria-hidden="true">*</span></label>
                    <input type="email" id="donorEmail" name="donorEmail" required placeholder="e.g. alihassan@gmail.com">
                  </div>

                  <div class="form-group">
                    <label for="donorPhone">Phone Number <span class="required" aria-hidden="true">*</span></label>
                    <input type="tel" id="donorPhone" name="donorPhone" required pattern="^(\+92|0)?3[0-9]{9}$" placeholder="e.g. 03001234567" title="Enter a valid Pakistani mobile number (e.g. 03001234567 or 03175941654)">
                  </div>
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label for="donorBloodGroup">Blood Group <span class="required" aria-hidden="true">*</span></label>
                    <select id="donorBloodGroup" name="donorBloodGroup" required>
                      <option value="">&mdash; Select Blood Group &mdash;</option>
                      <option value="A+">A+</option>
                      <option value="A-">A&minus;</option>
                      <option value="B+">B+</option>
                      <option value="B-">B&minus;</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB&minus;</option>
                      <option value="O+">O+</option>
                      <option value="O-">O&minus;</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="donorCampaign">Choose Campaign <span class="required" aria-hidden="true">*</span></label>
                    <select id="donorCampaign" name="donorCampaign" required>
                      <option value="">&mdash; Select a Campaign &mdash;</option>
                      <!-- Options populated dynamically by JS -->
                    </select>
                  </div>
                </div>
              </fieldset>

              <div id="donorFormMsg" class="form-message" role="alert" aria-live="polite"></div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-submit-action">&#10003; Complete Registration</button>
                <button type="reset" class="btn btn-outline">Clear Form</button>
              </div>
            </form>
          </div>

          <!-- Right: Donor Badge & Information Card -->
          <aside class="donor-info-sidebar">
            <div class="donor-badge-card">
              <div class="donor-badge-img-wrap">
                <img src="assets/images/donor-card-badge.jpg" alt="Smiling healthy voluntary blood donor" class="donor-badge-img">
                <div class="donor-badge-floating-tag">&#9829; Verified Donor</div>
              </div>
              <div class="donor-badge-content">
                <h3>Every Pint Brings Hope</h3>
                <p>By registering today, you ensure patients in critical care receive blood when seconds count.</p>
                <ul class="donor-checklist">
                  <li><strong>&#10003; Free Screening:</strong> Hemoglobin &amp; vital checkup on site</li>
                  <li><strong>&#10003; 100% Sterile:</strong> Safe, certified single-use equipment</li>
                  <li><strong>&#10003; Priority Queue:</strong> Instant confirmation upon arrival</li>
                </ul>
                <div class="donor-mini-stat">
                  <div class="stat-circle">3</div>
                  <span>Lives saved with your single donation</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

  </main>

<!-- ========== EDIT CAMPAIGN MODAL ========== -->
  <div id="editCampaignModal" class="modal-overlay hidden" aria-hidden="true" role="dialog" aria-labelledby="editModalTitle">
    <div class="modal-content">
      <h2 id="editModalTitle">Edit Campaign</h2>
      <form id="editCampaignForm" novalidate>
        <input type="hidden" id="editCampId" name="editCampId">

        <fieldset>
          <legend>Update Campaign Details</legend>

          <div class="form-group">
            <label for="editCampName">Campaign Name <span class="required" aria-hidden="true">*</span></label>
            <input type="text" id="editCampName" name="editCampName" required minlength="3">
          </div>

          <div class="form-group">
            <label for="editCampOrganizer">Organizer <span class="required" aria-hidden="true">*</span></label>
            <input type="text" id="editCampOrganizer" name="editCampOrganizer" required>
          </div>

          <div class="form-group">
            <label for="editCampLocation">Location <span class="required" aria-hidden="true">*</span></label>
            <input type="text" id="editCampLocation" name="editCampLocation" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="editCampDate">Date <span class="required" aria-hidden="true">*</span></label>
              <input type="date" id="editCampDate" name="editCampDate" required>
            </div>
            <div class="form-group">
              <label for="editCampStartTime">Start Time <span class="required" aria-hidden="true">*</span></label>
              <input type="time" id="editCampStartTime" name="editCampStartTime" required>
            </div>
            <div class="form-group">
              <label for="editCampEndTime">End Time <span class="required" aria-hidden="true">*</span></label>
              <input type="time" id="editCampEndTime" name="editCampEndTime" required>
            </div>
          </div>

          <div class="form-group">
            <label id="editCampBloodGroupsLabel">Required Blood Groups <span class="required" aria-hidden="true">*</span></label>
            <div class="checkbox-group" id="editCampBloodGroups" role="group" aria-labelledby="editCampBloodGroupsLabel">
              <label class="checkbox-label">
                <input type="checkbox" name="editCampBloodGroups" value="A+"> A+
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="editCampBloodGroups" value="A-"> A−
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="editCampBloodGroups" value="B+"> B+
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="editCampBloodGroups" value="B-"> B−
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="editCampBloodGroups" value="AB+"> AB+
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="editCampBloodGroups" value="AB-"> AB−
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="editCampBloodGroups" value="O+"> O+
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="editCampBloodGroups" value="O-"> O−
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="editCampCapacity">Max Capacity <span class="required" aria-hidden="true">*</span></label>
            <input type="number" id="editCampCapacity" name="editCampCapacity" required min="1">
          </div>

          <div class="form-group">
            <label for="editCampContact">Contact Info <span class="required" aria-hidden="true">*</span></label>
            <input type="text" id="editCampContact" name="editCampContact" required>
          </div>

          <div class="form-group">
            <label for="editCampDescription">Description <span class="required" aria-hidden="true">*</span></label>
            <textarea id="editCampDescription" name="editCampDescription" required rows="4"></textarea>
          </div>
        </fieldset>

        <div id="editFormMsg" class="form-message" role="alert" aria-live="polite"></div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Save Changes</button>
          <button type="button" class="btn btn-outline" id="cancelEdit">Cancel</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ========== CONFIRMATION DIALOG ========== -->
  <div id="confirmDialog" class="modal-overlay hidden" aria-hidden="true" role="alertdialog" aria-labelledby="confirmTitle" aria-describedby="confirmMessage">
    <div class="modal-content modal-confirm">
      <h2 id="confirmTitle">Confirm Action</h2>
      <p id="confirmMessage">Are you sure you want to perform this action?</p>
      <div class="form-actions">
        <button type="button" class="btn btn-danger" id="confirmYes">Yes, Delete</button>
        <button type="button" class="btn btn-outline" id="confirmNo">Cancel</button>
      </div>
    </div>
  </div>

  <!-- ========== ORGANIZER AUTH MODAL ========== -->
  <div id="authModal" class="modal-overlay hidden" aria-hidden="true" role="dialog" aria-labelledby="authModalTitle">
    <div class="modal-content modal-auth">
      <button type="button" class="modal-close" id="closeAuthModal" aria-label="Close sign in dialog">&times;</button>
      <h2 id="authModalTitle">Organizer Portal Sign In</h2>
      <p class="auth-modal-subtitle">Sign in to create campaigns and manage drives you own.</p>

      <div class="auth-tabs" role="tablist">
        <button type="button" class="auth-tab active" id="tabSignIn" data-auth-tab="login" role="tab" aria-selected="true">Sign In</button>
        <button type="button" class="auth-tab" id="tabRegister" data-auth-tab="register" role="tab" aria-selected="false">Create Account</button>
      </div>

      <form id="authLoginForm" novalidate>
        <div class="form-group">
          <label for="authLoginEmail">Organizer Email <span class="required" aria-hidden="true">*</span></label>
          <input type="email" id="authLoginEmail" required placeholder="e.g. organizer@bloodlink.pk">
        </div>
        <div class="form-group">
          <label for="authLoginPassword">Password <span class="required" aria-hidden="true">*</span></label>
          <input type="password" id="authLoginPassword" required placeholder="Enter password">
        </div>
        <div class="demo-credentials-box">
          <small><strong>Demo Organizer:</strong> organizer@bloodlink.pk / Organizer123!</small>
          <button type="button" id="fillDemoOrganizerBtn" class="btn-link-sm">Fill Demo</button>
        </div>
        <div id="authLoginMsg" class="form-message" role="alert" aria-live="polite"></div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="authLoginSubmitBtn">Sign In</button>
        </div>
      </form>

      <form id="authRegisterForm" class="hidden" novalidate>
        <div class="form-group">
          <label for="authRegName">Full Name / Organization <span class="required" aria-hidden="true">*</span></label>
          <input type="text" id="authRegName" required minlength="2" placeholder="e.g. Dr. Sara Ahmed">
        </div>
        <div class="form-group">
          <label for="authRegEmail">Email Address <span class="required" aria-hidden="true">*</span></label>
          <input type="email" id="authRegEmail" required placeholder="e.g. sara@hospital.pk">
        </div>
        <div class="form-group">
          <label for="authRegPassword">Password (min 6 chars) <span class="required" aria-hidden="true">*</span></label>
          <input type="password" id="authRegPassword" required minlength="6" placeholder="Create a strong password">
        </div>
        <div id="authRegMsg" class="form-message" role="alert" aria-live="polite"></div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="authRegSubmitBtn">Create Organizer Account</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ========== TOAST / NOTIFICATION CONTAINER ========== -->
  <div id="toastContainer" class="toast-container" aria-live="polite" aria-relevant="additions"></div>

  <!-- ========== FOOTER ========== -->
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <h2 class="footer-logo">BloodLink</h2>
        <p>Connecting Donors. Supporting Lives. A platform dedicated to streamlining blood donation campaigns and saving lives across Pakistan.</p>
      </div>

      <nav class="footer-links" aria-label="Footer navigation">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#hero" data-section="hero">Home</a></li>
          <li><a href="#campaigns" data-section="campaigns">Campaigns</a></li>
          <li><a href="#createCampaignSection" data-section="createCampaignSection">Create Campaign</a></li>
          <li><a href="#registerSection" data-section="registerSection">Register as Donor</a></li>
        </ul>
      </nav>

      <div class="footer-contact">
        <h3>Contact Us</h3>
        <address>
          <p>Email: <a href="mailto:hsohail.bese24seecs@seecs.edu.pk">hsohail.bese24seecs@seecs.edu.pk</a></p>
          <p>Phone: <a href="tel:03175941654">03175941654</a></p>
          <p>NUST SEECS, Islamabad, Pakistan</p>
        </address>
      </div>
    </div>
  </footer>

  <!-- ========== INITIAL SESSION BOOTSTRAP ========== -->
  <script>
    window.__BLOODLINK_USER__ = <?= json_encode($currentUser, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
  </script>

  <!-- ========== SCRIPTS ========== -->
  <script src="js/data.js"></script>
  <script src="js/campaigns.js"></script>
  <script src="js/donors.js"></script>
  <script src="js/app.js"></script>

</body>
</html>
