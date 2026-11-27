/*
 * ============================================================
 *  BloodLink — Blood Donation Campaign Scheduler
 *  CS344 Web Engineering — Assignment 2 (PHP + PDO + Fetch)
 *  FILE: app.js — Initialization, Navigation, Auth & Preferences
 * ============================================================
 */

var PREF_VIEW_DENSITY_KEY = 'bloodlink_view_density';

/* ---------- 1. Navigation System ---------- */
function navigateTo(sectionId) {
    if (!sectionId) sectionId = 'hero';

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

    if (sectionId === 'hero') {
        if (hero) { hero.classList.remove('hidden'); hero.classList.add('active'); }
        if (dashboard) { dashboard.classList.remove('hidden'); dashboard.classList.add('active'); }
        if (howItWorks) { howItWorks.classList.remove('hidden'); howItWorks.classList.add('active'); }
        if (upcomingPreview) { upcomingPreview.classList.remove('hidden'); upcomingPreview.classList.add('active'); }

        if (campaignsSection) { campaignsSection.classList.add('hidden'); campaignsSection.classList.remove('active'); }
        if (createSection) { createSection.classList.add('hidden'); createSection.classList.remove('active'); }
        if (registerSection) { registerSection.classList.add('hidden'); registerSection.classList.remove('active'); }
    } else {
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

    var navLinks = document.querySelectorAll('.nav-link');
    for (var i = 0; i < navLinks.length; i++) {
        var linkTarget = navLinks[i].getAttribute('data-section');
        if (linkTarget === sectionId) {
            navLinks[i].classList.add('active');
        } else {
            navLinks[i].classList.remove('active');
        }
    }

    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateToSection(sectionId) {
    navigateTo(sectionId);
}

/* ---------- 2. Non-Sensitive Browser Storage Preference ---------- */
function applyViewDensityPreference(density) {
    var val = (density === 'compact') ? 'compact' : 'comfortable';
    try {
        localStorage.setItem(PREF_VIEW_DENSITY_KEY, val);
    } catch (e) {
        // Ignore storage errors in restricted environments
    }

    var grid = document.getElementById('campaignGrid');
    if (grid) {
        if (val === 'compact') {
            grid.classList.add('compact-grid');
        } else {
            grid.classList.remove('compact-grid');
        }
    }

    var btnComf = document.getElementById('prefComfortable');
    var btnComp = document.getElementById('prefCompact');
    if (btnComf && btnComp) {
        btnComf.classList.toggle('active', val === 'comfortable');
        btnComp.classList.toggle('active', val === 'compact');
    }
}

function loadViewDensityPreference() {
    var saved = 'comfortable';
    try {
        saved = localStorage.getItem(PREF_VIEW_DENSITY_KEY) || 'comfortable';
    } catch (e) {
        saved = 'comfortable';
    }
    applyViewDensityPreference(saved);
}

/* ---------- 3. Organizer Session & Auth UI ---------- */
function updateAuthUI() {
    var openBtn = document.getElementById('authOpenBtn');
    var userPill = document.getElementById('authUserPill');
    var userNameEl = document.getElementById('authUserName');
    var createNotice = document.getElementById('createAuthNotice');

    if (currentUser && currentUser.id) {
        if (openBtn) openBtn.classList.add('hidden');
        if (userPill) userPill.classList.remove('hidden');
        if (userNameEl) userNameEl.textContent = currentUser.name;
        if (createNotice) createNotice.classList.add('hidden');
    } else {
        if (openBtn) openBtn.classList.remove('hidden');
        if (userPill) userPill.classList.add('hidden');
        if (userNameEl) userNameEl.textContent = '';
        if (createNotice) createNotice.classList.remove('hidden');
    }
}

function openAuthModal(defaultTab) {
    var modal = document.getElementById('authModal');
    if (!modal) return;
    switchAuthTab(defaultTab || 'login');
    clearFormMessage('authLoginMsg');
    clearFormMessage('authRegMsg');
    modal.classList.remove('hidden');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

function closeAuthModal() {
    var modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

function switchAuthTab(tabName) {
    var loginForm = document.getElementById('authLoginForm');
    var regForm = document.getElementById('authRegisterForm');
    var tabSignIn = document.getElementById('tabSignIn');
    var tabRegister = document.getElementById('tabRegister');

    if (tabName === 'register') {
        if (loginForm) loginForm.classList.add('hidden');
        if (regForm) regForm.classList.remove('hidden');
        if (tabSignIn) { tabSignIn.classList.remove('active'); tabSignIn.setAttribute('aria-selected', 'false'); }
        if (tabRegister) { tabRegister.classList.add('active'); tabRegister.setAttribute('aria-selected', 'true'); }
    } else {
        if (loginForm) loginForm.classList.remove('hidden');
        if (regForm) regForm.classList.add('hidden');
        if (tabSignIn) { tabSignIn.classList.add('active'); tabSignIn.setAttribute('aria-selected', 'true'); }
        if (tabRegister) { tabRegister.classList.remove('active'); tabRegister.setAttribute('aria-selected', 'false'); }
    }
}

async function handleAuthLogin(e) {
    e.preventDefault();
    clearFormMessage('authLoginMsg');

    var email = (document.getElementById('authLoginEmail')?.value || '').trim();
    var password = document.getElementById('authLoginPassword')?.value || '';
    var btn = document.getElementById('authLoginSubmitBtn');

    if (!email || !password) {
        showFormMessage('authLoginMsg', 'Please enter your email and password.', true);
        return;
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
    try {
        var res = await apiFetch('api/auth.php', {
            method: 'POST',
            body: { action: 'login', email: email, password: password }
        });
        currentUser = res.user;
        setCsrfTokenValue(res.csrfToken);
        updateAuthUI();
        closeAuthModal();
        showToast('Welcome back, ' + currentUser.name + '!', 'success');
        await loadAndRenderCampaigns();
    } catch (err) {
        showFormMessage('authLoginMsg', err.message || 'Sign in failed.', true);
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
    }
}

async function handleAuthRegister(e) {
    e.preventDefault();
    clearFormMessage('authRegMsg');

    var name = (document.getElementById('authRegName')?.value || '').trim();
    var email = (document.getElementById('authRegEmail')?.value || '').trim();
    var password = document.getElementById('authRegPassword')?.value || '';
    var btn = document.getElementById('authRegSubmitBtn');

    if (!name || !email || password.length < 6) {
        showFormMessage('authRegMsg', 'Name, valid email, and password (min 6 chars) are required.', true);
        return;
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Creating Account…'; }
    try {
        var res = await apiFetch('api/auth.php', {
            method: 'POST',
            body: { action: 'register', name: name, email: email, password: password }
        });
        currentUser = res.user;
        setCsrfTokenValue(res.csrfToken);
        updateAuthUI();
        closeAuthModal();
        showToast('Organizer account created!', 'success');
        await loadAndRenderCampaigns();
    } catch (err) {
        showFormMessage('authRegMsg', err.message || 'Registration failed.', true);
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Create Organizer Account'; }
    }
}

async function handleAuthLogout() {
    try {
        var res = await apiFetch('api/auth.php', {
            method: 'POST',
            body: { action: 'logout' }
        });
        currentUser = null;
        setCsrfTokenValue(res.csrfToken);
        updateAuthUI();
        showToast('Signed out successfully.', 'success');
        await loadAndRenderCampaigns();
    } catch (err) {
        showToast(err.message || 'Sign out failed.', 'error');
    }
}

/* ---------- 4. Mobile Menu Helpers ---------- */
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

/* ---------- 5. Event Listeners Setup ---------- */
function setupEventListeners() {
    var menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

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

    var brandLink = document.querySelector('.brand-link');
    if (brandLink) {
        brandLink.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo('hero');
        });
    }

    // Auth modal & buttons
    var authOpenBtn = document.getElementById('authOpenBtn');
    if (authOpenBtn) authOpenBtn.addEventListener('click', function() { openAuthModal('login'); });

    var createSignInPromptBtn = document.getElementById('createSignInPromptBtn');
    if (createSignInPromptBtn) createSignInPromptBtn.addEventListener('click', function() { openAuthModal('login'); });

    var closeAuthBtn = document.getElementById('closeAuthModal');
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);

    var authLogoutBtn = document.getElementById('authLogoutBtn');
    if (authLogoutBtn) authLogoutBtn.addEventListener('click', handleAuthLogout);

    var tabSignIn = document.getElementById('tabSignIn');
    var tabRegister = document.getElementById('tabRegister');
    if (tabSignIn) tabSignIn.addEventListener('click', function() { switchAuthTab('login'); });
    if (tabRegister) tabRegister.addEventListener('click', function() { switchAuthTab('register'); });

    var fillDemoBtn = document.getElementById('fillDemoOrganizerBtn');
    if (fillDemoBtn) {
        fillDemoBtn.addEventListener('click', function() {
            document.getElementById('authLoginEmail').value = 'organizer@bloodlink.pk';
            document.getElementById('authLoginPassword').value = 'Organizer123!';
        });
    }

    var authLoginForm = document.getElementById('authLoginForm');
    if (authLoginForm) authLoginForm.addEventListener('submit', handleAuthLogin);

    var authRegisterForm = document.getElementById('authRegisterForm');
    if (authRegisterForm) authRegisterForm.addEventListener('submit', handleAuthRegister);

    // View density preference buttons
    var prefComf = document.getElementById('prefComfortable');
    var prefComp = document.getElementById('prefCompact');
    if (prefComf) prefComf.addEventListener('click', function() { applyViewDensityPreference('comfortable'); });
    if (prefComp) prefComp.addEventListener('click', function() { applyViewDensityPreference('compact'); });

    // Retry buttons for Fetch error states
    var retryCampaignsBtn = document.getElementById('retryCampaignsBtn');
    if (retryCampaignsBtn) retryCampaignsBtn.addEventListener('click', function() { loadAndRenderCampaigns(); });

    var retryUpcomingBtn = document.getElementById('retryUpcomingBtn');
    if (retryUpcomingBtn) retryUpcomingBtn.addEventListener('click', function() { loadAndRenderCampaigns(); });

    // Search & Filter event bindings
    var searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', function() { filterCampaigns(); });

    var filterLocation = document.getElementById('filterLocation');
    if (filterLocation) filterLocation.addEventListener('input', function() { filterCampaigns(); });

    var filterBloodGroup = document.getElementById('filterBloodGroup');
    if (filterBloodGroup) filterBloodGroup.addEventListener('change', function() { filterCampaigns(); });

    var filterDate = document.getElementById('filterDate');
    if (filterDate) filterDate.addEventListener('change', function() { filterCampaigns(); });

    var filterStatus = document.getElementById('filterStatus');
    if (filterStatus) filterStatus.addEventListener('change', function() { filterCampaigns(); });

    var resetBtn = document.getElementById('resetFilters');
    if (resetBtn) resetBtn.addEventListener('click', function() { resetFilters(); });

    // Campaign creation form
    var campaignForm = document.getElementById('campaignForm');
    if (campaignForm) {
        campaignForm.addEventListener('submit', function(e) { handleCampaignSubmit(e); });
        campaignForm.addEventListener('reset', function() { clearFormMessage('campaignFormMsg'); });
    }

    // Donor registration form
    var donorForm = document.getElementById('donorForm');
    if (donorForm) {
        donorForm.addEventListener('submit', function(e) { handleDonorRegistration(e); });
        donorForm.addEventListener('reset', function() { clearFormMessage('donorFormMsg'); });
    }

    // Edit campaign form
    var editCampaignForm = document.getElementById('editCampaignForm');
    if (editCampaignForm) {
        editCampaignForm.addEventListener('submit', function(e) { handleCampaignEdit(e); });
    }

    var cancelEditBtn = document.getElementById('cancelEdit');
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', function() { closeEditModal(); });

    var closeDetailBtn = document.getElementById('closeDetail');
    if (closeDetailBtn) closeDetailBtn.addEventListener('click', function() { closeCampaignDetail(); });

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
            closeAuthModal();
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

/* ---------- 6. Application Initialization ---------- */
async function initApp() {
    var todayStr = getTodayString();
    var campDate = document.getElementById('campDate');
    if (campDate) campDate.setAttribute('min', todayStr);
    var editCampDate = document.getElementById('editCampDate');
    if (editCampDate) editCampDate.setAttribute('min', todayStr);

    loadViewDensityPreference();
    updateAuthUI();
    setupEventListeners();

    var hash = window.location.hash;
    if (hash && hash.length > 1) {
        navigateTo(hash.substring(1));
    } else {
        navigateTo('hero');
    }

    await loadAndRenderCampaigns();
}

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});
