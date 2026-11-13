/* ============================================================
   campaigns.js — Campaign Management Module for BloodLink
   Depends on data.js (loaded first — provides campaigns, donors,
   registrations arrays, helper functions and constants).
   ============================================================ */

/* ---------- 1. renderCampaignCard ---------- */
function renderCampaignCard(campaign) {
    if (!campaign) return '';

    var statusClass = 'status-upcoming';
    if (campaign.status === STATUS_FULL) {
        statusClass = 'status-full';
    } else if (campaign.status === STATUS_COMPLETED) {
        statusClass = 'status-completed';
    }

    var percentage = 0;
    var slotsLeft = campaign.capacity - campaign.registeredCount;
    if (campaign.capacity > 0) {
        percentage = Math.min(100, Math.round((campaign.registeredCount / campaign.capacity) * 100));
    }

    var bloodTags = '';
    for (var i = 0; i < campaign.requiredBloodGroups.length; i++) {
        bloodTags += '<span class="blood-tag">' + campaign.requiredBloodGroups[i] + '</span>';
    }

    var slotsText = slotsLeft > 0 ? (slotsLeft + ' slots left') : 'Full capacity';
    if (campaign.status === STATUS_COMPLETED) {
        slotsText = 'Campaign ended';
    }

    var html = '<article class="campaign-card minimal-card" data-id="' + campaign.id + '">' +
        '<div class="card-top-row">' +
            '<span class="status-pill ' + statusClass + '">' + campaign.status + '</span>' +
            '<span class="slots-pill">' + slotsText + '</span>' +
        '</div>' +
        '<div class="card-main">' +
            '<h3 class="card-title">' + campaign.title + '</h3>' +
            '<div class="card-meta-list">' +
                '<p class="card-meta-item"><span class="meta-icon">📍</span> ' + campaign.location + '</p>' +
                '<p class="card-meta-item"><span class="meta-icon">📅</span> ' + formatDate(campaign.date) + '</p>' +
                '<p class="card-meta-item"><span class="meta-icon">🕐</span> ' + formatTime(campaign.startTime) + ' – ' + formatTime(campaign.endTime) + '</p>' +
            '</div>' +
            '<div class="card-blood-groups">' + bloodTags + '</div>' +
        '</div>' +
        '<div class="card-bottom">' +
            '<div class="minimal-progress-wrap" title="' + campaign.registeredCount + ' of ' + campaign.capacity + ' slots booked">' +
                '<div class="minimal-progress-bar">' +
                    '<div class="minimal-progress-fill" style="width: ' + percentage + '%"></div>' +
                '</div>' +
                '<span class="progress-ratio">' + campaign.registeredCount + ' / ' + campaign.capacity + '</span>' +
            '</div>' +
            '<button type="button" class="btn btn-minimal" onclick="showCampaignDetail(\'' + campaign.id + '\')">View Details <span class="arrow">→</span></button>' +
        '</div>' +
    '</article>';

    return html;
}

/* ---------- 2. renderCampaigns ---------- */
function renderCampaigns(campaignList) {
    var grid = document.getElementById('campaignGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!campaignList || campaignList.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No campaigns found matching your criteria.</p></div>';
        return;
    }

    var html = '';
    for (var i = 0; i < campaignList.length; i++) {
        html += renderCampaignCard(campaignList[i]);
    }
    grid.innerHTML = html;

    // Update campaign count display if it exists
    var countEl = document.getElementById('campaignCount');
    if (countEl) {
        countEl.textContent = campaignList.length;
    }
}

/* ---------- 3. renderUpcomingPreview ---------- */
function renderUpcomingPreview() {
    var container = document.getElementById('upcomingContainer');
    if (!container) return;

    // Filter upcoming campaigns
    var upcoming = [];
    for (var i = 0; i < campaigns.length; i++) {
        if (campaigns[i].status === STATUS_UPCOMING) {
            upcoming.push(campaigns[i]);
        }
    }

    // Sort by date ascending (nearest first)
    upcoming.sort(function (a, b) {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
    });

    // Take first 3
    var preview = upcoming.slice(0, 3);

    container.innerHTML = '';

    if (preview.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No upcoming campaigns at this time.</p></div>';
        return;
    }

    var html = '';
    for (var i = 0; i < preview.length; i++) {
        html += renderCampaignCard(preview[i]);
    }
    container.innerHTML = html;
}

/* ---------- 4. showCampaignDetail ---------- */
function showCampaignDetail(campaignId) {
    var campaign = findCampaignById(campaignId);
    if (!campaign) return;

    var overlay = document.getElementById('campaignDetail');
    if (!overlay) return;
    overlay.setAttribute('data-campaign-id', campaignId);

    // Populate detail fields
    var nameEl = document.getElementById('detailCampaignName');
    if (nameEl) nameEl.textContent = campaign.title;

    var orgEl = document.getElementById('detailOrganizer');
    if (orgEl) orgEl.textContent = campaign.organizer;

    var locEl = document.getElementById('detailLocation');
    if (locEl) locEl.textContent = campaign.location;

    var dateEl = document.getElementById('detailDate');
    if (dateEl) dateEl.textContent = formatDate(campaign.date);

    var startEl = document.getElementById('detailStartTime');
    if (startEl) startEl.textContent = formatTime(campaign.startTime);

    var endEl = document.getElementById('detailEndTime');
    if (endEl) endEl.textContent = formatTime(campaign.endTime);

    // Blood groups as tags
    var bgEl = document.getElementById('detailBloodGroups');
    if (bgEl) {
        var tagsHtml = '';
        for (var i = 0; i < campaign.requiredBloodGroups.length; i++) {
            tagsHtml += '<span class="blood-tag">' + campaign.requiredBloodGroups[i] + '</span> ';
        }
        bgEl.innerHTML = tagsHtml;
    }

    // Capacity
    var regEl = document.getElementById('detailRegistered');
    if (regEl) regEl.textContent = campaign.registeredCount;

    var capEl = document.getElementById('detailCapacity');
    if (capEl) capEl.textContent = campaign.capacity;

    // Status badge
    var statusEl = document.getElementById('detailStatus');
    if (statusEl) {
        var statusClass = 'status-upcoming';
        if (campaign.status === STATUS_FULL) statusClass = 'status-full';
        else if (campaign.status === STATUS_COMPLETED) statusClass = 'status-completed';
        statusEl.innerHTML = '<span class="status-badge ' + statusClass + '">' + campaign.status + '</span>';
    }

    // Contact
    var contactEl = document.getElementById('detailContact');
    if (contactEl) contactEl.textContent = campaign.contact;

    // Description
    var descEl = document.getElementById('detailDescription');
    if (descEl) descEl.textContent = campaign.description;

    // Registered donors list
    var donorListEl = document.getElementById('detailDonorList');
    if (donorListEl) {
        var campRegs = getRegistrationsForCampaign(campaignId);
        if (campRegs.length === 0) {
            donorListEl.innerHTML = '<li>No donors registered yet.</li>';
        } else {
            var listHtml = '';
            for (var i = 0; i < campRegs.length; i++) {
                var donor = findDonorById(campRegs[i].donorId);
                if (donor) {
                    listHtml += '<li>' + donor.name + ' (' + donor.bloodGroup + ') — ' + donor.email + '</li>';
                }
            }
            if (listHtml === '') {
                listHtml = '<li>No donor details available.</li>';
            }
            donorListEl.innerHTML = listHtml;
        }
    }

    // Register button — only if Upcoming and not Full
    var registerBtn = document.getElementById('detailRegisterBtn');
    if (registerBtn) {
        if (campaign.status === STATUS_UPCOMING) {
            registerBtn.style.display = '';
            registerBtn.onclick = function (e) {
                if (e) e.preventDefault();
                registerForCampaignFromDetail(campaignId);
            };
        } else {
            registerBtn.style.display = 'none';
            registerBtn.onclick = null;
        }
    }

    // Edit button
    var editBtn = document.getElementById('detailEditBtn');
    if (editBtn) {
        editBtn.onclick = function () {
            closeCampaignDetail();
            openEditModal(campaignId);
        };
    }

    // Delete button
    var deleteBtn = document.getElementById('detailDeleteBtn');
    if (deleteBtn) {
        deleteBtn.onclick = function () {
            deleteCampaign(campaignId);
        };
    }

    // Close button
    var closeBtn = document.getElementById('closeDetail');
    if (closeBtn) {
        closeBtn.onclick = function () {
            closeCampaignDetail();
        };
    }

    // Show overlay
    overlay.classList.remove('hidden');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
}

/* ---------- 5. closeCampaignDetail ---------- */
function closeCampaignDetail() {
    var overlay = document.getElementById('campaignDetail');
    if (!overlay) return;
    overlay.removeAttribute('data-campaign-id');
    overlay.classList.remove('active');
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
}

/* ---------- 6. filterCampaigns ---------- */
function filterCampaigns() {
    var searchVal = '';
    var locationVal = '';
    var bloodGroupVal = '';
    var dateVal = '';
    var statusVal = '';

    var searchInput = document.getElementById('searchInput');
    if (searchInput) searchVal = searchInput.value.trim().toLowerCase();

    var filterLocation = document.getElementById('filterLocation');
    if (filterLocation) locationVal = filterLocation.value.trim().toLowerCase();

    var filterBloodGroup = document.getElementById('filterBloodGroup');
    if (filterBloodGroup) bloodGroupVal = filterBloodGroup.value;

    var filterDate = document.getElementById('filterDate');
    if (filterDate) dateVal = filterDate.value;

    var filterStatus = document.getElementById('filterStatus');
    if (filterStatus) statusVal = filterStatus.value;

    var filtered = [];
    for (var i = 0; i < campaigns.length; i++) {
        var camp = campaigns[i];
        var match = true;

        // Search in title (case-insensitive)
        if (searchVal && camp.title.toLowerCase().indexOf(searchVal) === -1) {
            match = false;
        }

        // Location filter (case-insensitive)
        if (match && locationVal && camp.location.toLowerCase().indexOf(locationVal) === -1) {
            match = false;
        }

        // Blood group filter
        if (match && bloodGroupVal && bloodGroupVal !== 'All') {
            var hasGroup = false;
            for (var j = 0; j < camp.requiredBloodGroups.length; j++) {
                if (camp.requiredBloodGroups[j] === bloodGroupVal) {
                    hasGroup = true;
                    break;
                }
            }
            if (!hasGroup) match = false;
        }

        // Date filter (exact match)
        if (match && dateVal && camp.date !== dateVal) {
            match = false;
        }

        // Status filter
        if (match && statusVal && statusVal !== 'All' && camp.status !== statusVal) {
            match = false;
        }

        if (match) {
            filtered.push(camp);
        }
    }

    renderCampaigns(filtered);
}

/* ---------- 7. resetFilters ---------- */
function resetFilters() {
    var searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    var filterLocation = document.getElementById('filterLocation');
    if (filterLocation) filterLocation.value = '';

    var filterBloodGroup = document.getElementById('filterBloodGroup');
    if (filterBloodGroup) filterBloodGroup.value = '';

    var filterDate = document.getElementById('filterDate');
    if (filterDate) filterDate.value = '';

    var filterStatus = document.getElementById('filterStatus');
    if (filterStatus) filterStatus.value = '';

    renderCampaigns(campaigns);
}

/* ---------- helper: showToast ---------- */
function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'success');
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function () {
        toast.classList.add('toast-fade');
        setTimeout(function () {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }, 3000);
}

/* ---------- helper: showFormMessage ---------- */
function showFormMessage(elementId, message, isError) {
    var msgEl = document.getElementById(elementId);
    if (!msgEl) return;
    msgEl.textContent = message;
    msgEl.className = 'form-message ' + (isError ? 'form-error' : 'form-success');
}

/* ---------- helper: clearFormMessage ---------- */
function clearFormMessage(elementId) {
    var msgEl = document.getElementById(elementId);
    if (!msgEl) return;
    msgEl.textContent = '';
    msgEl.className = 'form-message';
}

/* ---------- helper: getSelectedBloodGroups ---------- */
function getSelectedBloodGroups(containerIdOrName) {
    var checkboxes = document.querySelectorAll('input[name="' + containerIdOrName + '"]:checked');
    var selected = [];
    for (var i = 0; i < checkboxes.length; i++) {
        selected.push(checkboxes[i].value);
    }
    return selected;
}

/* ---------- helper: navigateToSection ---------- */
function navigateToSection(sectionId) {
    // Hide all sections
    var sections = document.querySelectorAll('.section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.add('hidden');
        sections[i].classList.remove('active');
    }
    // Show target section
    var target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
    // Also keep hero and dashboard visible when navigating home
    var hero = document.getElementById('hero');
    var dashboard = document.getElementById('dashboard');
    if (sectionId === 'hero') {
        if (hero) { hero.classList.remove('hidden'); hero.classList.add('active'); }
        if (dashboard) { dashboard.classList.remove('hidden'); dashboard.classList.add('active'); }
    }
}

/* ---------- 8. handleCampaignSubmit ---------- */
function handleCampaignSubmit(event) {
    event.preventDefault();
    clearFormMessage('campaignFormMsg');

    // Read form values
    var title = document.getElementById('campName').value.trim();
    var organizer = document.getElementById('campOrganizer').value.trim();
    var location = document.getElementById('campLocation').value.trim();
    var date = document.getElementById('campDate').value;
    var startTime = document.getElementById('campStartTime').value;
    var endTime = document.getElementById('campEndTime').value;
    var capacity = document.getElementById('campCapacity').value;
    var contact = document.getElementById('campContact').value.trim();
    var description = document.getElementById('campDescription').value.trim();
    var selectedBloodGroups = getSelectedBloodGroups('campBloodGroups');

    // Validation
    if (!title || !organizer || !location || !date || !startTime || !endTime || !capacity || !contact || !description) {
        showFormMessage('campaignFormMsg', 'Please fill in all required fields.', true);
        return;
    }

    if (title.length < 3) {
        showFormMessage('campaignFormMsg', 'Campaign name must be at least 3 characters long.', true);
        return;
    }

    // Date not in the past
    if (date < getTodayString()) {
        showFormMessage('campaignFormMsg', 'Campaign date cannot be in the past.', true);
        return;
    }

    // End time must be later than start time
    if (endTime <= startTime) {
        showFormMessage('campaignFormMsg', 'End time must be later than start time.', true);
        return;
    }

    // Capacity must be a positive integer
    var capNum = parseInt(capacity, 10);
    if (isNaN(capNum) || capNum <= 0) {
        showFormMessage('campaignFormMsg', 'Capacity must be a positive number.', true);
        return;
    }

    // At least one blood group selected
    if (selectedBloodGroups.length === 0) {
        showFormMessage('campaignFormMsg', 'Please select at least one required blood group.', true);
        return;
    }

    // Contact info not empty (already checked above, but explicit)
    if (!contact) {
        showFormMessage('campaignFormMsg', 'Contact information is required.', true);
        return;
    }

    // Check scheduling conflicts
    var conflicts = checkSchedulingConflict(location, date, startTime, endTime, null);
    if (conflicts.length > 0) {
        var conflictMsg = 'Scheduling conflict with \'' + conflicts[0].title + '\' at the same location on ' +
            formatDate(conflicts[0].date) + ' from ' + formatTime(conflicts[0].startTime) + '-' + formatTime(conflicts[0].endTime);
        showFormMessage('campaignFormMsg', conflictMsg, true);
        return;
    }

    // All validation passed — create campaign
    var newId = generateCampaignId();
    var newCampaign = {
        id: newId,
        title: title,
        organizer: organizer,
        location: location,
        date: date,
        startTime: startTime,
        endTime: endTime,
        requiredBloodGroups: selectedBloodGroups,
        capacity: capNum,
        registeredCount: 0,
        description: description,
        contact: contact,
        status: STATUS_UPCOMING
    };

    campaigns.push(newCampaign);

    // Re-render
    renderCampaigns(campaigns);
    renderUpcomingPreview();
    updateDashboard();
    populateCampaignSelect();

    // Reset form
    document.getElementById('campaignForm').reset();
    clearFormMessage('campaignFormMsg');

    // Show success toast
    showToast('Campaign \'' + title + '\' created successfully!', 'success');

    // Navigate to campaigns section
    navigateToSection('campaigns');
}

/* ---------- 9. handleCampaignEdit ---------- */
function handleCampaignEdit(event) {
    event.preventDefault();
    clearFormMessage('editFormMsg');

    // Read form values
    var campaignId = document.getElementById('editCampId').value;
    var title = document.getElementById('editCampName').value.trim();
    var organizer = document.getElementById('editCampOrganizer').value.trim();
    var location = document.getElementById('editCampLocation').value.trim();
    var date = document.getElementById('editCampDate').value;
    var startTime = document.getElementById('editCampStartTime').value;
    var endTime = document.getElementById('editCampEndTime').value;
    var capacity = document.getElementById('editCampCapacity').value;
    var contact = document.getElementById('editCampContact').value.trim();
    var description = document.getElementById('editCampDescription').value.trim();
    var selectedBloodGroups = getSelectedBloodGroups('editCampBloodGroups');

    // Find existing campaign
    var campaign = findCampaignById(campaignId);
    if (!campaign) {
        showFormMessage('editFormMsg', 'Campaign not found.', true);
        return;
    }

    // Validation (same as creation)
    if (!title || !organizer || !location || !date || !startTime || !endTime || !capacity || !contact || !description) {
        showFormMessage('editFormMsg', 'Please fill in all required fields.', true);
        return;
    }

    if (title.length < 3) {
        showFormMessage('editFormMsg', 'Campaign name must be at least 3 characters long.', true);
        return;
    }

    if (date < getTodayString()) {
        showFormMessage('editFormMsg', 'Campaign date cannot be in the past.', true);
        return;
    }

    if (endTime <= startTime) {
        showFormMessage('editFormMsg', 'End time must be later than start time.', true);
        return;
    }

    var capNum = parseInt(capacity, 10);
    if (isNaN(capNum) || capNum <= 0) {
        showFormMessage('editFormMsg', 'Capacity must be a positive number.', true);
        return;
    }

    if (selectedBloodGroups.length === 0) {
        showFormMessage('editFormMsg', 'Please select at least one required blood group.', true);
        return;
    }

    if (!contact) {
        showFormMessage('editFormMsg', 'Contact information is required.', true);
        return;
    }

    // Check capacity vs current registrations
    if (capNum < campaign.registeredCount) {
        showFormMessage('editFormMsg', 'Capacity (' + capNum + ') cannot be less than current registrations (' + campaign.registeredCount + ').', true);
        return;
    }

    // Check scheduling conflicts (exclude current campaign)
    var conflicts = checkSchedulingConflict(location, date, startTime, endTime, campaignId);
    if (conflicts.length > 0) {
        var conflictMsg = 'Scheduling conflict with \'' + conflicts[0].title + '\' at the same location on ' +
            formatDate(conflicts[0].date) + ' from ' + formatTime(conflicts[0].startTime) + '-' + formatTime(conflicts[0].endTime);
        showFormMessage('editFormMsg', conflictMsg, true);
        return;
    }

    // Update the campaign object
    campaign.title = title;
    campaign.organizer = organizer;
    campaign.location = location;
    campaign.date = date;
    campaign.startTime = startTime;
    campaign.endTime = endTime;
    campaign.requiredBloodGroups = selectedBloodGroups;
    campaign.capacity = capNum;
    campaign.contact = contact;
    campaign.description = description;

    // Recompute status
    campaign.status = computeCampaignStatus(campaign);

    // Re-render everything
    renderCampaigns(campaigns);
    renderUpcomingPreview();
    updateDashboard();
    populateCampaignSelect();

    // Close modal
    closeEditModal();

    // Show success toast
    showToast('Campaign \'' + title + '\' updated successfully!', 'success');
}

/* ---------- 10. openEditModal ---------- */
function openEditModal(campaignId) {
    var campaign = findCampaignById(campaignId);
    if (!campaign) return;

    var modal = document.getElementById('editCampaignModal');
    if (!modal) return;

    // Fill form fields
    document.getElementById('editCampId').value = campaign.id;
    document.getElementById('editCampName').value = campaign.title;
    document.getElementById('editCampOrganizer').value = campaign.organizer;
    document.getElementById('editCampLocation').value = campaign.location;
    document.getElementById('editCampDate').value = campaign.date;
    document.getElementById('editCampStartTime').value = campaign.startTime;
    document.getElementById('editCampEndTime').value = campaign.endTime;
    document.getElementById('editCampCapacity').value = campaign.capacity;
    document.getElementById('editCampContact').value = campaign.contact;
    document.getElementById('editCampDescription').value = campaign.description;

    // Check appropriate blood group checkboxes
    var checkboxes = document.querySelectorAll('input[name="editCampBloodGroups"]');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        for (var j = 0; j < campaign.requiredBloodGroups.length; j++) {
            if (checkboxes[i].value === campaign.requiredBloodGroups[j]) {
                checkboxes[i].checked = true;
                break;
            }
        }
    }

    // Clear any previous messages
    clearFormMessage('editFormMsg');

    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

/* ---------- 11. closeEditModal ---------- */
function closeEditModal() {
    var modal = document.getElementById('editCampaignModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');

    // Reset the form
    var form = document.getElementById('editCampaignForm');
    if (form) form.reset();
    clearFormMessage('editFormMsg');
}

/* ---------- 12. deleteCampaign ---------- */
function deleteCampaign(campaignId) {
    var campaign = findCampaignById(campaignId);
    if (!campaign) return;

    showConfirmDialog('Are you sure you want to delete the campaign "' + campaign.title + '"? This action cannot be undone.', function () {
        // Remove campaign from campaigns array
        for (var i = 0; i < campaigns.length; i++) {
            if (campaigns[i].id === campaignId) {
                campaigns.splice(i, 1);
                break;
            }
        }

        // Remove all registrations for this campaign
        for (var j = registrations.length - 1; j >= 0; j--) {
            if (registrations[j].campaignId === campaignId) {
                registrations.splice(j, 1);
            }
        }

        // Re-render everything
        renderCampaigns(campaigns);
        renderUpcomingPreview();
        updateDashboard();
        populateCampaignSelect();

        // Close campaign detail if open
        closeCampaignDetail();

        // Show success toast
        showToast('Campaign deleted successfully!', 'success');
    });
}

/* ---------- 13. showConfirmDialog ---------- */
function showConfirmDialog(message, onConfirm) {
    var dialog = document.getElementById('confirmDialog');
    if (!dialog) return;

    var msgEl = document.getElementById('confirmMessage');
    if (msgEl) msgEl.textContent = message;

    // Show dialog
    dialog.classList.remove('hidden');
    dialog.classList.add('active');
    dialog.setAttribute('aria-hidden', 'false');

    // Confirm button
    var confirmBtn = document.getElementById('confirmYes');
    var cancelBtn = document.getElementById('confirmNo');

    // Clone and replace to remove old event listeners
    if (confirmBtn) {
        var newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        newConfirmBtn.onclick = function () {
            dialog.classList.remove('active');
            dialog.classList.add('hidden');
            dialog.setAttribute('aria-hidden', 'true');
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
        };
    }

    if (cancelBtn) {
        var newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        newCancelBtn.onclick = function () {
            dialog.classList.remove('active');
            dialog.classList.add('hidden');
            dialog.setAttribute('aria-hidden', 'true');
        };
    }
}

/* ---------- 14. updateDashboard ---------- */
function updateDashboard() {
    var stats = getDashboardStats();

    var totalEl = document.getElementById('statTotalCampaigns');
    if (totalEl) totalEl.textContent = stats.total;

    var upcomingEl = document.getElementById('statUpcoming');
    if (upcomingEl) upcomingEl.textContent = stats.upcoming;

    var regsEl = document.getElementById('statRegistrations');
    if (regsEl) regsEl.textContent = stats.totalRegistrations;

    var slotsEl = document.getElementById('statSlots');
    if (slotsEl) slotsEl.textContent = stats.availableSlots;
}

/* ---------- 15. populateCampaignSelect ---------- */
function populateCampaignSelect() {
    var select = document.getElementById('donorCampaign');
    if (!select) return;

    // Clear existing options
    select.innerHTML = '';

    // Default option
    var defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '-- Select a Campaign --';
    select.appendChild(defaultOpt);

    // Add upcoming campaigns that are not Full or Completed
    for (var i = 0; i < campaigns.length; i++) {
        var camp = campaigns[i];
        if (camp.status === STATUS_UPCOMING) {
            var available = camp.capacity - camp.registeredCount;
            var opt = document.createElement('option');
            opt.value = camp.id;
            opt.textContent = camp.title + ' — ' + formatDate(camp.date) + ' (' + available + ' slots left)';
            select.appendChild(opt);
        }
    }
}
