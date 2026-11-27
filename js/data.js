/*
 * ============================================================
 *  BloodLink — Blood Donation Campaign Scheduler
 *  CS344 Web Engineering — Assignment 2 (PHP + PDO + Fetch)
 *  FILE: data.js — Client State, Fetch Helper & Formatters
 * ============================================================
 */

var BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

var STATUS_UPCOMING  = 'Upcoming';
var STATUS_FULL      = 'Full';
var STATUS_COMPLETED = 'Completed';

// Live state populated from PHP/SQLite JSON endpoints via Fetch
var campaigns = [];
var dashboardStats = {
    total: 0,
    upcoming: 0,
    totalRegistrations: 0,
    availableSlots: 0
};
var currentUser = window.__BLOODLINK_USER__ || null;

/**
 * Reads the active CSRF token from the <meta name="csrf-token"> tag.
 */
function getCsrfTokenValue() {
    var meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') || '' : '';
}

/**
 * Updates the <meta name="csrf-token"> tag after login/register/logout.
 */
function setCsrfTokenValue(newToken) {
    if (!newToken) return;
    var meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) {
        meta.setAttribute('content', newToken);
    }
}

/**
 * Encodes user-controlled strings before inserting into HTML.
 */
function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Central async Fetch wrapper with JSON handling and CSRF header injection.
 */
async function apiFetch(url, options) {
    var opts = options || {};
    var headers = Object.assign({
        'Accept': 'application/json'
    }, opts.headers || {});

    if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(opts.body);
    }

    var method = (opts.method || 'GET').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
        headers['X-CSRF-Token'] = getCsrfTokenValue();
    }

    opts.headers = headers;
    opts.credentials = 'same-origin';

    var response = await fetch(url, opts);
    var data = null;
    try {
        data = await response.json();
    } catch (e) {
        throw new Error('Invalid server response (HTTP ' + response.status + ').');
    }

    if (!response.ok || (data && data.success === false)) {
        var err = new Error((data && data.error) ? data.error : ('Request failed with HTTP ' + response.status));
        err.status = response.status;
        err.data = data;
        throw err;
    }

    return data;
}

/**
 * Find a campaign in the loaded client cache by ID.
 */
function findCampaignById(campaignId) {
    for (var i = 0; i < campaigns.length; i++) {
        if (campaigns[i].id === campaignId) return campaigns[i];
    }
    return null;
}

/**
 * Return aggregate numbers for the dashboard.
 */
function getDashboardStats() {
    return dashboardStats;
}

/**
 * Format an ISO date string for user-friendly display.
 */
function formatDate(dateStr) {
    if (!dateStr) return '';
    var date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date.getTime())) return dateStr;
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-PK', options);
}

/**
 * Convert 24-hour time to 12-hour display format.
 */
function formatTime(timeStr) {
    if (!timeStr || timeStr.indexOf(':') === -1) return timeStr || '';
    var parts = timeStr.split(':');
    var hours = parseInt(parts[0], 10);
    var minutes = parts[1];
    var period = hours >= 12 ? 'PM' : 'AM';
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    return hours + ':' + minutes + ' ' + period;
}

/**
 * Get today's date as a YYYY-MM-DD string.
 */
function getTodayString() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}
