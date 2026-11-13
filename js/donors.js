/*
 * ============================================================
 *  BloodLink — Blood Donation Campaign Scheduler
 *  CS344 Web Engineering — Assignment 1
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
    // Normalize by stripping spaces and dashes
    var cleaned = phone.trim().replace(/[\s\-]/g, '');
    // Pakistani format: 03XXXXXXXXX or +923XXXXXXXXX (total 11 or 13 digits)
    var pakistaniPattern = /^(\+92|0)?3[0-9]{9}$/;
    return pakistaniPattern.test(cleaned);
}

/* ---------- 3. registerForCampaignFromDetail ---------- */
function registerForCampaignFromDetail(campaignId) {
    // Close the campaign detail overlay
    closeCampaignDetail();

    // Navigate to the registration section
    if (typeof navigateTo === 'function') {
        navigateTo('registerSection');
    } else if (typeof navigateToSection === 'function') {
        navigateToSection('registerSection');
    }

    // Pre-select the campaign in the donor form
    var campaignSelect = document.getElementById('donorCampaign');
    if (campaignSelect) {
        campaignSelect.value = campaignId;
    }

    // Clear any previous form messages
    clearFormMessage('donorFormMsg');

    // Smooth scroll to the registration form
    var registerSection = document.getElementById('registerSection');
    if (registerSection) {
        registerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/* ---------- 4. handleDonorRegistration ---------- */
function handleDonorRegistration(event) {
    if (event) {
        event.preventDefault();
    }
    clearFormMessage('donorFormMsg');

    var nameInput = document.getElementById('donorName');
    var emailInput = document.getElementById('donorEmail');
    var phoneInput = document.getElementById('donorPhone');
    var bloodGroupSelect = document.getElementById('donorBloodGroup');
    var campaignSelect = document.getElementById('donorCampaign');

    var name = nameInput ? nameInput.value.trim() : '';
    var email = emailInput ? emailInput.value.trim() : '';
    var phone = phoneInput ? phoneInput.value.trim() : '';
    var bloodGroup = bloodGroupSelect ? bloodGroupSelect.value.trim() : '';
    var campaignId = campaignSelect ? campaignSelect.value.trim() : '';

    // Validation 1: Required fields
    if (!name) {
        showFormMessage('donorFormMsg', 'Please enter your full name.', true);
        if (nameInput) nameInput.focus();
        return;
    }

    if (!email) {
        showFormMessage('donorFormMsg', 'Please enter your email address.', true);
        if (emailInput) emailInput.focus();
        return;
    }

    if (!validateEmail(email)) {
        showFormMessage('donorFormMsg', 'Please enter a valid email address (e.g., donor@example.com).', true);
        if (emailInput) emailInput.focus();
        return;
    }

    if (!phone) {
        showFormMessage('donorFormMsg', 'Please enter your phone number.', true);
        if (phoneInput) phoneInput.focus();
        return;
    }

    if (!validatePhone(phone)) {
        showFormMessage('donorFormMsg', 'Please enter a valid Pakistani mobile number (e.g., 0300-1234567 or 03001234567).', true);
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

    // Find the campaign
    var campaign = findCampaignById(campaignId);
    if (!campaign) {
        showFormMessage('donorFormMsg', 'Selected campaign could not be found.', true);
        return;
    }

    // Check if campaign is completed
    if (campaign.status === STATUS_COMPLETED) {
        showFormMessage('donorFormMsg', 'This campaign has already completed. Registrations are closed.', true);
        return;
    }

    // Check if campaign is full
    if (campaign.status === STATUS_FULL || campaign.registeredCount >= campaign.capacity) {
        showFormMessage('donorFormMsg', 'This campaign has reached its maximum donor capacity (' + campaign.capacity + '). No more slots available.', true);
        return;
    }

    // Check if donor's blood group is accepted (informational warning or compatibility)
    // Note: If campaign specifies required blood groups, check if donor is eligible
    if (campaign.requiredBloodGroups && campaign.requiredBloodGroups.length > 0) {
        var isAccepted = false;
        for (var b = 0; b < campaign.requiredBloodGroups.length; b++) {
            if (campaign.requiredBloodGroups[b] === bloodGroup) {
                isAccepted = true;
                break;
            }
        }
        if (!isAccepted) {
            showFormMessage('donorFormMsg', 'Note: This campaign is specifically requesting blood groups: ' + campaign.requiredBloodGroups.join(', ') + '. Your blood group (' + bloodGroup + ') does not match the requested groups.', true);
            return;
        }
    }

    // Check for duplicate registration
    if (isDonorRegistered(email, campaignId)) {
        showFormMessage('donorFormMsg', 'You are already registered for this campaign with email ' + email + '.', true);
        return;
    }

    // Find or create donor record
    var existingDonor = null;
    for (var d = 0; d < donors.length; d++) {
        if (donors[d].email.toLowerCase() === email.toLowerCase()) {
            existingDonor = donors[d];
            break;
        }
    }

    var donorId;
    if (existingDonor) {
        donorId = existingDonor.id;
        // Update contact/blood group if changed
        existingDonor.name = name;
        existingDonor.phone = phone;
        existingDonor.bloodGroup = bloodGroup;
    } else {
        donorId = generateDonorId();
        var newDonor = {
            id: donorId,
            name: name,
            email: email,
            phone: phone,
            bloodGroup: bloodGroup
        };
        donors.push(newDonor);
    }

    // Create registration record
    var regId = generateRegistrationId();
    var newRegistration = {
        id: regId,
        donorId: donorId,
        campaignId: campaignId,
        registrationDate: getTodayString(),
        status: 'Confirmed'
    };
    registrations.push(newRegistration);

    // Update campaign registered count
    campaign.registeredCount++;

    // Check if campaign is now full
    if (campaign.registeredCount >= campaign.capacity) {
        campaign.status = STATUS_FULL;
    }

    // Reset the form
    var donorForm = document.getElementById('donorForm');
    if (donorForm) {
        donorForm.reset();
    }

    // Update UI components
    updateDashboard();
    renderCampaigns(campaigns);
    renderUpcomingPreview();
    populateCampaignSelect();

    // Show success feedback
    var successText = 'Registration successful! Donor ID: ' + donorId + '. You are registered for "' + campaign.title + '". Confirmation ID: ' + regId + '.';
    showFormMessage('donorFormMsg', successText, false);
    showToast('Registered successfully for ' + campaign.title + '!', 'success');
}
