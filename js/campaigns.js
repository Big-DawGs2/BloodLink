/* ============================================================
   campaigns.js — Campaign Management Module for BloodLink
   CS344 Web Engineering — Assignment 2 (PHP + PDO + Fetch)
   ============================================================ */

/* ---------- 0. Async Fetch Loader (Loading / Success / Empty / Error) ---------- */
async function loadAndRenderCampaigns(filterParams) {
    var loadingEl = document.getElementById('campaignsLoading');
    var errorEl = document.getElementById('campaignsError');
    var errorTextEl = document.getElementById('campaignsErrorText');
    var gridEl = document.getElementById('campaignGrid');

    var upLoadingEl = document.getElementById('upcomingLoading');
    var upErrorEl = document.getElementById('upcomingError');
    var upContainerEl = document.getElementById('upcomingContainer');

    var isFiltered = Boolean(filterParams && (
        filterParams.search || filterParams.location ||
        filterParams.bloodGroup || filterParams.date || filterParams.status
    ));

    if (loadingEl) loadingEl.classList.remove('hidden');
    if (errorEl) errorEl.classList.add('hidden');
    if (gridEl && !isFiltered) gridEl.innerHTML = '';

    if (!isFiltered) {
        if (upLoadingEl) upLoadingEl.classList.remove('hidden');
        if (upErrorEl) upErrorEl.classList.add('hidden');
        if (upContainerEl) upContainerEl.innerHTML = '';
    }

    var query = [];
    if (filterParams) {
        if (filterParams.search) query.push('search=' + encodeURIComponent(filterParams.search));
        if (filterParams.location) query.push('location=' + encodeURIComponent(filterParams.location));
        if (filterParams.bloodGroup) query.push('bloodGroup=' + encodeURIComponent(filterParams.bloodGroup));
        if (filterParams.date) query.push('date=' + encodeURIComponent(filterParams.date));
        if (filterParams.status) query.push('status=' + encodeURIComponent(filterParams.status));
    }

    var url = 'api/campaigns.php' + (query.length > 0 ? '?' + query.join('&') : '');

    try {
        var data = await apiFetch(url, { method: 'GET' });
        var list = Array.isArray(data.campaigns) ? data.campaigns : [];

        if (!isFiltered) {
            campaigns = list;
        }
        if (data.stats) {
            dashboardStats = data.stats;
        }

        renderCampaigns(list);
        if (!isFiltered) {
            renderUpcomingPreview();
            updateDashboard();
            populateCampaignSelect();
        }
    } catch (err) {
        if (errorEl) {
            errorEl.classList.remove('hidden');
            if (errorTextEl) errorTextEl.textContent = err.message || 'Unable to load campaigns from server.';
        }
        if (!isFiltered && upErrorEl) {
            upErrorEl.classList.remove('hidden');
        }
    } finally {
        if (loadingEl) loadingEl.classList.add('hidden');
        if (!isFiltered && upLoadingEl) upLoadingEl.classList.add('hidden');
    }
}

/* ---------- 1. renderCampaignCard (Output Encoded) ---------- */
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
        bloodTags += '<span class="blood-tag">' + escapeHtml(campaign.requiredBloodGroups[i]) + '</span>';
    }

    var slotsText = slotsLeft > 0 ? (slotsLeft + ' slots left') : 'Full capacity';
    if (campaign.status === STATUS_COMPLETED) {
        slotsText = 'Campaign ended';
    }

    var safeId = escapeHtml(campaign.id);

    var html = '<article class="campaign-card minimal-card" data-id="' + safeId + '">' +
        '<div class="card-top-row">' +
            '<span class="status-pill ' + statusClass + '">' + escapeHtml(campaign.status) + '</span>' +
            '<span class="slots-pill">' + escapeHtml(slotsText) + '</span>' +
        '</div>' +
        '<div class="card-main">' +
            '<h3 class="card-title">' + escapeHtml(campaign.title) + '</h3>' +
            '<div class="card-meta-list">' +
                '<p class="card-meta-item"><span class="meta-icon">📍</span> ' + escapeHtml(campaign.location) + '</p>' +
                '<p class="card-meta-item"><span class="meta-icon">📅</span> ' + escapeHtml(formatDate(campaign.date)) + '</p>' +
                '<p class="card-meta-item"><span class="meta-icon">🕐</span> ' + escapeHtml(formatTime(campaign.startTime)) + ' – ' + escapeHtml(formatTime(campaign.endTime)) + '</p>' +
            '</div>' +
            '<div class="card-blood-groups">' + bloodTags + '</div>' +
        '</div>' +
        '<div class="card-bottom">' +
            '<div class="minimal-progress-wrap" title="' + escapeHtml(campaign.registeredCount) + ' of ' + escapeHtml(campaign.capacity) + ' slots booked">' +
                '<div class="minimal-progress-bar">' +
                    '<div class="minimal-progress-fill" style="width: ' + percentage + '%"></div>' +
                '</div>' +
                '<span class="progress-ratio">' + escapeHtml(campaign.registeredCount) + ' / ' + escapeHtml(campaign.capacity) + '</span>' +
            '</div>' +
            '<button type="button" class="btn btn-minimal" onclick="showCampaignDetail(\'' + safeId + '\')">View Details <span class="arrow">→</span></button>' +
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

    var countEl = document.getElementById('campaignCount');
    if (countEl) {
        countEl.textContent = campaignList.length;
    }
}

/* ---------- 3. renderUpcomingPreview ---------- */
function renderUpcomingPreview() {
    var container = document.getElementById('upcomingContainer');
    if (!container) return;

    var upcoming = [];
    for (var i = 0; i < campaigns.length; i++) {
        if (campaigns[i].status === STATUS_UPCOMING) {
            upcoming.push(campaigns[i]);
        }
    }

    upcoming.sort(function (a, b) {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
    });

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

/* ---------- 4. showCampaignDetail (Async Fetch from PHP/SQLite) ---------- */
async function showCampaignDetail(campaignId) {
    var overlay = document.getElementById('campaignDetail');
    if (!overlay) return;
    overlay.setAttribute('data-campaign-id', campaignId);

    var donorListEl = document.getElementById('detailDonorList');
    if (donorListEl) {
        donorListEl.innerHTML = '<li>Loading registered donors…</li>';
    }

    // Show modal immediately with cached data if available, then refresh from DB
    var cached = findCampaignById(campaignId);
    if (cached) {
        populateDetailModalFields(cached, []);
        if (donorListEl) donorListEl.innerHTML = '<li>Loading registered donors…</li>';
    }

    overlay.classList.remove('hidden');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    try {
        var data = await apiFetch('api/campaigns.php?id=' + encodeURIComponent(campaignId), { method: 'GET' });
        populateDetailModalFields(data.campaign, data.donors || []);
    } catch (err) {
        if (donorListEl) {
            donorListEl.innerHTML = '<li>Unable to load donors: ' + escapeHtml(err.message) + '</li>';
        }
    }
}

function populateDetailModalFields(campaign, donorsList) {
    if (!campaign) return;

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

    var bgEl = document.getElementById('detailBloodGroups');
    if (bgEl) {
        var tagsHtml = '';
        for (var i = 0; i < campaign.requiredBloodGroups.length; i++) {
            tagsHtml += '<span class="blood-tag">' + escapeHtml(campaign.requiredBloodGroups[i]) + '</span> ';
        }
        bgEl.innerHTML = tagsHtml;
    }

    var regEl = document.getElementById('detailRegistered');
    if (regEl) regEl.textContent = campaign.registeredCount;

    var capEl = document.getElementById('detailCapacity');
    if (capEl) capEl.textContent = campaign.capacity;

    var statusEl = document.getElementById('detailStatus');
    if (statusEl) {
        var statusClass = 'status-upcoming';
        if (campaign.status === STATUS_FULL) statusClass = 'status-full';
        else if (campaign.status === STATUS_COMPLETED) statusClass = 'status-completed';
        statusEl.innerHTML = '<span class="status-badge ' + statusClass + '">' + escapeHtml(campaign.status) + '</span>';
    }

    var contactEl = document.getElementById('detailContact');
    if (contactEl) contactEl.textContent = campaign.contact;

    var descEl = document.getElementById('detailDescription');
    if (descEl) descEl.textContent = campaign.description;

    var donorListEl = document.getElementById('detailDonorList');
    if (donorListEl) {
        if (!donorsList || donorsList.length === 0) {
            donorListEl.innerHTML = '<li>No donors registered yet.</li>';
        } else {
            var listHtml = '';
            for (var i = 0; i < donorsList.length; i++) {
                var d = donorsList[i];
                listHtml += '<li>' + escapeHtml(d.name) + ' (' + escapeHtml(d.bloodGroup) + ') — ' + escapeHtml(d.email) + '</li>';
            }
            donorListEl.innerHTML = listHtml;
        }
    }

    var registerBtn = document.getElementById('detailRegisterBtn');
    if (registerBtn) {
        if (campaign.status === STATUS_UPCOMING) {
            registerBtn.style.display = '';
            registerBtn.onclick = function (e) {
                if (e) e.preventDefault();
                registerForCampaignFromDetail(campaign.id);
            };
        } else {
            registerBtn.style.display = 'none';
            registerBtn.onclick = null;
        }
    }

    // Ownership enforcement in UI (also strictly enforced on server)
    var editBtn = document.getElementById('detailEditBtn');
    var deleteBtn = document.getElementById('detailDeleteBtn');
    if (editBtn) {
        editBtn.style.display = campaign.canManage ? '' : 'none';
        editBtn.onclick = function () {
            closeCampaignDetail();
            openEditModal(campaign.id);
        };
    }
    if (deleteBtn) {
        deleteBtn.style.display = campaign.canManage ? '' : 'none';
        deleteBtn.onclick = function () {
            deleteCampaign(campaign.id);
        };
    }

    var closeBtn = document.getElementById('closeDetail');
    if (closeBtn) {
        closeBtn.onclick = function () {
            closeCampaignDetail();
        };
    }
}

/* ---------- 5. closeCampaignDetail ---------- */
function closeCampaignDetail() {
    var overlay = document.getElementById('campaignDetail');
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.removeAttribute('data-campaign-id');
}

/* ---------- 6. filterCampaigns (Server-side prepared query via Fetch) ---------- */
async function filterCampaigns() {
    var searchVal = (document.getElementById('searchInput')?.value || '').trim();
    var bgVal = (document.getElementById('filterBloodGroup')?.value || '').trim();
    var dateVal = (document.getElementById('filterDate')?.value || '').trim();
    var statusVal = (document.getElementById('filterStatus')?.value || '').trim();
    var locVal = (document.getElementById('filterLocation')?.value || '').trim();

    await loadAndRenderCampaigns({
        search: searchVal,
        bloodGroup: bgVal,
        date: dateVal,
        status: statusVal,
        location: locVal
    });
}

/* ---------- 7. resetFilters ---------- */
async function resetFilters() {
    var searchInput = document.getElementById('searchInput');
    var bgSelect = document.getElementById('filterBloodGroup');
    var dateInput = document.getElementById('filterDate');
    var statusSelect = document.getElementById('filterStatus');
    var locInput = document.getElementById('filterLocation');

    if (searchInput) searchInput.value = '';
    if (bgSelect) bgSelect.value = '';
    if (dateInput) dateInput.value = '';
    if (statusSelect) statusSelect.value = '';
    if (locInput) locInput.value = '';

    await loadAndRenderCampaigns();
}

/* ---------- 8. handleCampaignSubmit (Create via Fetch POST) ---------- */
async function handleCampaignSubmit(event) {
    if (event) event.preventDefault();
    clearFormMessage('campaignFormMsg');

    if (!currentUser || !currentUser.id) {
        showFormMessage('campaignFormMsg', 'Please sign in as an organizer before creating a campaign.', true);
        if (typeof openAuthModal === 'function') openAuthModal('login');
        return;
    }

    var form = document.getElementById('campaignForm');
    var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    var title = (document.getElementById('campName')?.value || '').trim();
    var organizer = (document.getElementById('campOrganizer')?.value || '').trim();
    var location = (document.getElementById('campLocation')?.value || '').trim();
    var date = (document.getElementById('campDate')?.value || '').trim();
    var startTime = (document.getElementById('campStartTime')?.value || '').trim();
    var endTime = (document.getElementById('campEndTime')?.value || '').trim();
    var capacity = (document.getElementById('campCapacity')?.value || '').trim();
    var contact = (document.getElementById('campContact')?.value || '').trim();
    var description = (document.getElementById('campDescription')?.value || '').trim();

    var checkboxes = document.querySelectorAll('input[name="campBloodGroups"]:checked');
    var selectedBloodGroups = [];
    for (var i = 0; i < checkboxes.length; i++) {
        selectedBloodGroups.push(checkboxes[i].value);
    }

    if (!title || !organizer || !location || !date || !startTime || !endTime || !contact || !description) {
        showFormMessage('campaignFormMsg', 'All required fields must be completed.', true);
        return;
    }
    if (selectedBloodGroups.length === 0) {
        showFormMessage('campaignFormMsg', 'Please select at least one required blood group.', true);
        return;
    }

    var originalBtn = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Publishing Campaign…';
    }

    try {
        var result = await apiFetch('api/campaigns.php', {
            method: 'POST',
            body: {
                title: title,
                organizer: organizer,
                location: location,
                date: date,
                startTime: startTime,
                endTime: endTime,
                requiredBloodGroups: selectedBloodGroups,
                capacity: parseInt(capacity, 10),
                contact: contact,
                description: description
            }
        });

        if (form) form.reset();
        showFormMessage('campaignFormMsg', result.message, false);
        showToast('Campaign published to database!', 'success');
        await loadAndRenderCampaigns();
    } catch (err) {
        showFormMessage('campaignFormMsg', err.message || 'Unable to create campaign.', true);
        showToast(err.message || 'Campaign creation failed.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtn;
        }
    }
}

/* ---------- 9. handleCampaignEdit (Update via Fetch PUT) ---------- */
async function handleCampaignEdit(event) {
    if (event) event.preventDefault();
    clearFormMessage('editFormMsg');

    var campaignId = document.getElementById('editCampId')?.value || '';
    var title = (document.getElementById('editCampName')?.value || '').trim();
    var organizer = (document.getElementById('editCampOrganizer')?.value || '').trim();
    var location = (document.getElementById('editCampLocation')?.value || '').trim();
    var date = (document.getElementById('editCampDate')?.value || '').trim();
    var startTime = (document.getElementById('editCampStartTime')?.value || '').trim();
    var endTime = (document.getElementById('editCampEndTime')?.value || '').trim();
    var capacity = (document.getElementById('editCampCapacity')?.value || '').trim();
    var contact = (document.getElementById('editCampContact')?.value || '').trim();
    var description = (document.getElementById('editCampDescription')?.value || '').trim();

    var checkboxes = document.querySelectorAll('input[name="editCampBloodGroups"]:checked');
    var selectedBloodGroups = [];
    for (var i = 0; i < checkboxes.length; i++) {
        selectedBloodGroups.push(checkboxes[i].value);
    }

    var form = document.getElementById('editCampaignForm');
    var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    var originalBtn = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving…';
    }

    try {
        var result = await apiFetch('api/campaigns.php', {
            method: 'PUT',
            body: {
                id: campaignId,
                title: title,
                organizer: organizer,
                location: location,
                date: date,
                startTime: startTime,
                endTime: endTime,
                requiredBloodGroups: selectedBloodGroups,
                capacity: parseInt(capacity, 10),
                contact: contact,
                description: description
            }
        });

        closeEditModal();
        showToast(result.message || 'Campaign updated!', 'success');
        await loadAndRenderCampaigns();
    } catch (err) {
        showFormMessage('editFormMsg', err.message || 'Unable to update campaign.', true);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtn;
        }
    }
}

/* ---------- 10. openEditModal ---------- */
function openEditModal(campaignId) {
    var campaign = findCampaignById(campaignId);
    if (!campaign) return;

    var modal = document.getElementById('editCampaignModal');
    if (!modal) return;

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

    var checkboxes = document.querySelectorAll('input[name="editCampBloodGroups"]');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = campaign.requiredBloodGroups.indexOf(checkboxes[i].value) !== -1;
    }

    clearFormMessage('editFormMsg');

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

    var form = document.getElementById('editCampaignForm');
    if (form) form.reset();
    clearFormMessage('editFormMsg');
}

/* ---------- 12. deleteCampaign (Delete via Fetch DELETE) ---------- */
function deleteCampaign(campaignId) {
    var campaign = findCampaignById(campaignId);
    if (!campaign) return;

    showConfirmDialog('Are you sure you want to delete "' + campaign.title + '"? This will permanently remove the campaign and its registrations.', async function () {
        try {
            var result = await apiFetch('api/campaigns.php', {
                method: 'DELETE',
                body: { id: campaignId }
            });
            closeCampaignDetail();
            showToast(result.message || 'Campaign deleted!', 'success');
            await loadAndRenderCampaigns();
        } catch (err) {
            showToast(err.message || 'Unable to delete campaign.', 'error');
        }
    });
}

/* ---------- 13. showConfirmDialog ---------- */
function showConfirmDialog(message, onConfirm) {
    var dialog = document.getElementById('confirmDialog');
    if (!dialog) return;

    var msgEl = document.getElementById('confirmMessage');
    if (msgEl) msgEl.textContent = message;

    dialog.classList.remove('hidden');
    dialog.classList.add('active');
    dialog.setAttribute('aria-hidden', 'false');

    var confirmBtn = document.getElementById('confirmYes');
    var cancelBtn = document.getElementById('confirmNo');

    if (confirmBtn) {
        var newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        newConfirmBtn.onclick = function () {
            dialog.classList.remove('active');
            dialog.classList.add('hidden');
            dialog.setAttribute('aria-hidden', 'true');
            if (typeof onConfirm === 'function') onConfirm();
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

    var currentValue = select.value;
    select.innerHTML = '';

    var defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '— Select a Campaign —';
    select.appendChild(defaultOpt);

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

    if (currentValue) {
        select.value = currentValue;
    }
}

/* ---------- 16. UI Helpers (Toast & Form Messages) ---------- */
function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast ' + (type === 'error' ? 'toast-error' : 'toast-success');
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function () {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 4200);
}

function showFormMessage(elementId, message, isError) {
    var el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.className = 'form-message ' + (isError ? 'error' : 'success');
    el.style.display = 'block';
}

function clearFormMessage(elementId) {
    var el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = '';
    el.className = 'form-message';
    el.style.display = 'none';
}
