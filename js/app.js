/*
 * ============================================================
 *  BloodLink — Blood Donation Campaign Scheduler
 *  CS344 Web Engineering — Assignment 1
 *  FILE: app.js — Application Initialization, Navigation & Events
 * ============================================================
 */

/* ---------- 1. Navigation System ---------- */
function navigateTo(sectionId) {
    if (!sectionId) sectionId = 'hero';

    // Normalize section identifier
    if (sectionId === 'home' || sectionId === '#hero') {
        sectionId = 'hero';
    } else if (sectionId.charAt(0) === '#') {
        sectionId = sectionId.substring(1);
    }

    var hero = document.getElementById('hero');
    var dashboard = document.getElementById('dashboard');
    var howItWorks = document.getElementById('howItWorks');
    var upcomingPreview = document.getElementById('upcomingPreview');
    var campaignsSection = document.getElementById('campaigns');
    var createSection = document.getElementById('createCampaignSection');
    var registerSection = document.getElementById('registerSection');

    // Home view: show hero, dashboard, how-it-works, upcoming-preview
    if (sectionId === 'hero') {
        if (hero) { hero.classList.remove('hidden'); hero.classList.add('active'); }
        if (dashboard) { dashboard.classList.remove('hidden'); dashboard.classList.add('active'); }
        if (howItWorks) { howItWorks.classList.remove('hidden'); howItWorks.classList.add('active'); }
        if (upcomingPreview) { upcomingPreview.classList.remove('hidden'); upcomingPreview.classList.add('active'); }

        if (campaignsSection) { campaignsSection.classList.add('hidden'); campaignsSection.classList.remove('active'); }
        if (createSection) { createSection.classList.add('hidden'); createSection.classList.remove('active'); }
        if (registerSection) { registerSection.classList.add('hidden'); registerSection.classList.remove('active'); }
    } else {
        // Individual sections: hide home-specific sections
        if (hero) { hero.classList.add('hidden'); hero.classList.remove('active'); }
        if (dashboard) { dashboard.classList.add('hidden'); dashboard.classList.remove('active'); }
        if (howItWorks) { howItWorks.classList.add('hidden'); howItWorks.classList.remove('active'); }
        if (upcomingPreview) { upcomingPreview.classList.add('hidden'); upcomingPreview.classList.remove('active'); }

        if (campaignsSection) { campaignsSection.classList.add('hidden'); campaignsSection.classList.remove('active'); }
        if (createSection) { createSection.classList.add('hidden'); createSection.classList.remove('active'); }
        if (registerSection) { registerSection.classList.add('hidden'); registerSection.classList.remove('active'); }

        var target = document.getElementById(sectionId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
        }

        if (sectionId === 'campaigns') {
            filterCampaigns();
        }
    }

    // Update active class on nav links
    var navLinks = document.querySelectorAll('.nav-link');
    for (var i = 0; i < navLinks.length; i++) {
        var linkTarget = navLinks[i].getAttribute('data-section');
        if (linkTarget === sectionId) {
            navLinks[i].classList.add('active');
        } else {
            navLinks[i].classList.remove('active');
        }
    }

    // Close mobile menu if open
    closeMobileMenu();

    // Smooth scroll to top of page or active section
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Also alias navigateToSection for compatibility */
function navigateToSection(sectionId) {
    navigateTo(sectionId);
}

/* ---------- 2. Mobile Menu Helpers ---------- */
function toggleMobileMenu() {
    var nav = document.getElementById('mainNav');
    var toggleBtn = document.getElementById('menuToggle');
    if (!nav) return;

    var isOpen = nav.classList.toggle('is-open');
    if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
}

function closeMobileMenu() {
    var nav = document.getElementById('mainNav');
    var toggleBtn = document.getElementById('menuToggle');
    if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    }
}

/* ---------- 3. Event Listeners Setup ---------- */
function setupEventListeners() {
    // Mobile navigation toggle
    var menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // All links with data-section attribute
    var sectionLinks = document.querySelectorAll('[data-section]');
    for (var i = 0; i < sectionLinks.length; i++) {
        sectionLinks[i].addEventListener('click', function(e) {
            var targetSection = this.getAttribute('data-section');
            if (targetSection) {
                e.preventDefault();
                navigateTo(targetSection);
            }
        });
    }

    // Brand link (goes to home)
    var brandLink = document.querySelector('.brand-link');
    if (brandLink) {
        brandLink.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo('hero');
        });
    }

    // Search & Filter event bindings
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterCampaigns();
        });
    }

    var filterLocation = document.getElementById('filterLocation');
    if (filterLocation) {
        filterLocation.addEventListener('input', function() {
            filterCampaigns();
        });
    }

    var filterBloodGroup = document.getElementById('filterBloodGroup');
    if (filterBloodGroup) {
        filterBloodGroup.addEventListener('change', function() {
            filterCampaigns();
        });
    }

    var filterDate = document.getElementById('filterDate');
    if (filterDate) {
        filterDate.addEventListener('change', function() {
            filterCampaigns();
        });
    }

    var filterStatus = document.getElementById('filterStatus');
    if (filterStatus) {
        filterStatus.addEventListener('change', function() {
            filterCampaigns();
        });
    }

    var resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetFilters();
        });
    }

    // Campaign creation form
    var campaignForm = document.getElementById('campaignForm');
    if (campaignForm) {
        campaignForm.addEventListener('submit', function(e) {
            handleCampaignSubmit(e);
        });
        campaignForm.addEventListener('reset', function() {
            clearFormMessage('campaignFormMsg');
        });
    }

    // Donor registration form
    var donorForm = document.getElementById('donorForm');
    if (donorForm) {
        donorForm.addEventListener('submit', function(e) {
            handleDonorRegistration(e);
        });
        donorForm.addEventListener('reset', function() {
            clearFormMessage('donorFormMsg');
        });
    }

    // Edit campaign form
    var editCampaignForm = document.getElementById('editCampaignForm');
    if (editCampaignForm) {
        editCampaignForm.addEventListener('submit', function(e) {
            handleCampaignEdit(e);
        });
    }

    var cancelEditBtn = document.getElementById('cancelEdit');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            closeEditModal();
        });
    }

    // Campaign detail modal close button
    var closeDetailBtn = document.getElementById('closeDetail');
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', function() {
            closeCampaignDetail();
        });
    }

    // Detail modal register button (explicit listener in addition to showCampaignDetail)
    var detailRegisterBtn = document.getElementById('detailRegisterBtn');
    if (detailRegisterBtn) {
        detailRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var detailModal = document.getElementById('campaignDetail');
            var currentCampId = detailModal ? detailModal.getAttribute('data-campaign-id') : null;
            if (currentCampId) {
                registerForCampaignFromDetail(currentCampId);
            } else {
                navigateTo('registerSection');
            }
        });
    }

    // Close modals on overlay backdrop click
    var modals = document.querySelectorAll('.modal-overlay');
    for (var m = 0; m < modals.length; m++) {
        modals[m].addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                this.classList.add('hidden');
                this.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Close modals on Escape key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            closeCampaignDetail();
            closeEditModal();
            var confirmDlg = document.getElementById('confirmDialog');
            if (confirmDlg) {
                confirmDlg.classList.remove('active');
                confirmDlg.classList.add('hidden');
            }
        }
    });

    // Close mobile menu on outside click
    document.addEventListener('click', function(e) {
        var nav = document.getElementById('mainNav');
        var menuToggle = document.getElementById('menuToggle');
        if (nav && nav.classList.contains('is-open')) {
            if (!nav.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target))) {
                closeMobileMenu();
            }
        }
    });
}

/* ---------- 4. Application Initialization ---------- */
function initApp() {
    // 1. Recalculate campaign statuses based on current date & capacity
    updateAllCampaignStatuses();

    // 2. Set min attribute for campaign date pickers to prevent past dates
    var todayStr = getTodayString();
    var campDate = document.getElementById('campDate');
    if (campDate) {
        campDate.setAttribute('min', todayStr);
    }
    var editCampDate = document.getElementById('editCampDate');
    if (editCampDate) {
        editCampDate.setAttribute('min', todayStr);
    }

    // 3. Render dashboard statistics
    updateDashboard();

    // 4. Render all campaigns in the campaign grid
    renderCampaigns(campaigns);

    // 5. Render upcoming campaigns preview on the home page
    renderUpcomingPreview();

    // 6. Populate the campaign selection dropdown in the donor form
    populateCampaignSelect();

    // 7. Setup all event listeners
    setupEventListeners();

    // 8. Handle initial URL hash or default to home view
    var hash = window.location.hash;
    if (hash && hash.length > 1) {
        navigateTo(hash.substring(1));
    } else {
        navigateTo('hero');
    }
}

// Start application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});
