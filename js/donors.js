/*
 * ============================================================
 *  BloodLink — Blood Donation Campaign Scheduler
 *  CS344 Web Engineering — Assignment 2 (PHP + PDO + Fetch)
 *  FILE: donors.js — Donor Registration & Validation Module
 * ============================================================
 */

/* ---------- 1. validateEmail ---------- */
function validateEmail(email) {
    if (!email) return false;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email.trim());
}

/* ---------- 2. validatePhone ---------- */
function validatePhone(phone) {
    if (!phone) return false;
    var cleaned = phone.trim().replace(/[\s\-]/g, '');
    var pakistaniPattern = /^(\+92|0)?3[0-9]{9}$/;
    return pakistaniPattern.test(cleaned);
}

/* ---------- 3. registerForCampaignFromDetail ---------- */
function registerForCampaignFromDetail(campaignId) {
    closeCampaignDetail();

    if (typeof navigateTo === 'function') {
        navigateTo('registerSection');
    }

    var campaignSelect = document.getElementById('donorCampaign');
    if (campaignSelect) {
        campaignSelect.value = campaignId;
    }

    clearFormMessage('donorFormMsg');

    var registerSection = document.getElementById('registerSection');
    if (registerSection) {
        registerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/* ---------- 4. handleDonorRegistration (Async Fetch) ---------- */
async function handleDonorRegistration(event) {
    if (event) {
        event.preventDefault();
    }
    clearFormMessage('donorFormMsg');

    var nameInput = document.getElementById('donorName');
    var emailInput = document.getElementById('donorEmail');
    var phoneInput = document.getElementById('donorPhone');
    var bloodGroupSelect = document.getElementById('donorBloodGroup');
    var campaignSelect = document.getElementById('donorCampaign');
    var form = document.getElementById('donorForm');
    var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    var name = nameInput ? nameInput.value.trim() : '';
    var email = emailInput ? emailInput.value.trim() : '';
    var phone = phoneInput ? phoneInput.value.trim() : '';
    var bloodGroup = bloodGroupSelect ? bloodGroupSelect.value.trim() : '';
    var campaignId = campaignSelect ? campaignSelect.value.trim() : '';

    // Client-side quick checks (mirrored authoritatively on the PHP server)
    if (!name) {
        showFormMessage('donorFormMsg', 'Please enter your full name.', true);
        if (nameInput) nameInput.focus();
        return;
    }
    if (!email || !validateEmail(email)) {
        showFormMessage('donorFormMsg', 'Please enter a valid email address (e.g., alihassan@gmail.com).', true);
        if (emailInput) emailInput.focus();
        return;
    }
    if (!phone || !validatePhone(phone)) {
        showFormMessage('donorFormMsg', 'Please enter a valid Pakistani mobile number (e.g., 03001234567).', true);
        if (phoneInput) phoneInput.focus();
        return;
    }
    if (!bloodGroup) {
        showFormMessage('donorFormMsg', 'Please select your blood group.', true);
        if (bloodGroupSelect) bloodGroupSelect.focus();
        return;
    }
    if (!campaignId) {
        showFormMessage('donorFormMsg', 'Please select a campaign to register for.', true);
        if (campaignSelect) campaignSelect.focus();
        return;
    }

    var originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Registration…';
    }

    try {
        var result = await apiFetch('api/registrations.php', {
            method: 'POST',
            body: {
                name: name,
                email: email,
                phone: phone,
                bloodGroup: bloodGroup,
                campaignId: campaignId
            }
        });

        if (form) form.reset();
        showFormMessage('donorFormMsg', result.message, false);
        showToast('Donor registration confirmed!', 'success');

        // Refresh campaign list, upcoming preview, dashboard stats & select options from DB
        if (typeof loadAndRenderCampaigns === 'function') {
            await loadAndRenderCampaigns();
        }
    } catch (err) {
        showFormMessage('donorFormMsg', err.message || 'Unable to complete registration.', true);
        showToast(err.message || 'Registration failed.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
}
