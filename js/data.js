/*
 * ============================================================
 *  BloodLink — Blood Donation Campaign Scheduler
 *  CS344 Web Engineering — Assignment 1
 *  FILE: data.js  —  Sample data & data-access helpers
 * ============================================================
 */

/* ──────────────────────────────────────────────
 *  Constants
 * ────────────────────────────────────────────── */

var BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

var STATUS_UPCOMING  = 'Upcoming';
var STATUS_FULL      = 'Full';
var STATUS_COMPLETED = 'Completed';

/* ──────────────────────────────────────────────
 *  Campaigns
 * ────────────────────────────────────────────── */

var campaigns = [
    {
        id: 'CAM-001',
        title: 'Rawalpindi Blood Drive 2026',
        organizer: 'Red Crescent Society',
        location: 'Red Crescent Hospital, Rawalpindi',
        date: '2026-11-25',
        startTime: '09:00',
        endTime: '14:00',
        requiredBloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        capacity: 50,
        registeredCount: 32,
        description: 'A large-scale blood donation drive organized by the Red Crescent Society at their Rawalpindi headquarters. All blood groups are welcome. Free health screening for every donor.',
        contact: '051-9290231',
        status: STATUS_UPCOMING
    },
    {
        id: 'CAM-002',
        title: 'NUST Campus Donation Day',
        organizer: 'NUST Community Service Club',
        location: 'NUST Health Center, Islamabad',
        date: '2026-11-28',
        startTime: '10:00',
        endTime: '16:00',
        requiredBloodGroups: ['O+', 'O-', 'A+', 'B+'],
        capacity: 40,
        registeredCount: 40,
        description: 'Annual blood donation event hosted by the NUST Community Service Club in collaboration with Pakistan Red Crescent. Open to students, faculty, and nearby residents.',
        contact: 'nust.donate@email.com',
        status: STATUS_FULL
    },
    {
        id: 'CAM-003',
        title: 'Lahore General Hospital Campaign',
        organizer: 'Lahore General Hospital Blood Bank',
        location: 'Lahore General Hospital',
        date: '2026-12-05',
        startTime: '08:00',
        endTime: '13:00',
        requiredBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+'],
        capacity: 60,
        registeredCount: 15,
        description: 'Lahore General Hospital urgently needs blood donations to replenish its blood bank reserves before winter. Refreshments and certificates provided to all donors.',
        contact: '042-9211135',
        status: STATUS_UPCOMING
    },
    {
        id: 'CAM-004',
        title: 'Islamabad Community Blood Camp',
        organizer: 'Islamabad Blood Donors Society',
        location: 'F-8 Community Center, Islamabad',
        date: '2026-12-10',
        startTime: '09:00',
        endTime: '15:00',
        requiredBloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        capacity: 80,
        registeredCount: 5,
        description: 'A community-led blood donation camp in the heart of Islamabad. Walk-ins are welcome. Organized in partnership with PIMS Hospital and the Islamabad Blood Donors Society.',
        contact: '0300-1112233',
        status: STATUS_UPCOMING
    },
    {
        id: 'CAM-005',
        title: 'Karachi Medical Drive',
        organizer: 'Aga Khan University Hospital',
        location: 'Aga Khan University Hospital, Karachi',
        date: '2026-10-15',
        startTime: '10:00',
        endTime: '14:00',
        requiredBloodGroups: ['AB+', 'AB-', 'O+', 'O-'],
        capacity: 45,
        registeredCount: 45,
        description: 'Completed blood donation drive held at Aga Khan University Hospital targeting rare blood groups. All donation targets were successfully met.',
        contact: '021-111-911-911',
        status: STATUS_COMPLETED
    },
    {
        id: 'CAM-006',
        title: 'Faisalabad Donation Festival',
        organizer: 'Allied Hospital Faisalabad',
        location: 'Allied Hospital, Faisalabad',
        date: '2026-12-20',
        startTime: '09:00',
        endTime: '12:00',
        requiredBloodGroups: ['B+', 'B-', 'O+', 'O-'],
        capacity: 35,
        registeredCount: 10,
        description: 'A blood donation festival organized by Allied Hospital Faisalabad in collaboration with local NGOs. Includes awareness sessions and free blood group testing.',
        contact: '041-9210072',
        status: STATUS_UPCOMING
    },
    {
        id: 'CAM-007',
        title: 'Peshawar Youth Blood Drive',
        organizer: 'KP Youth Blood Donors Network',
        location: 'Lady Reading Hospital, Peshawar',
        date: '2026-12-15',
        startTime: '11:00',
        endTime: '17:00',
        requiredBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
        capacity: 55,
        registeredCount: 0,
        description: 'A youth-focused blood donation drive at Lady Reading Hospital organized by the KP Youth Blood Donors Network. Aimed at encouraging first-time young donors across Peshawar.',
        contact: '0333-5556677',
        status: STATUS_UPCOMING
    },
    {
        id: 'CAM-008',
        title: 'Multan Winter Blood Campaign',
        organizer: 'Nishtar Hospital Blood Bank',
        location: 'Nishtar Hospital, Multan',
        date: '2026-10-20',
        startTime: '08:00',
        endTime: '12:00',
        requiredBloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        capacity: 50,
        registeredCount: 38,
        description: 'Completed winter blood campaign at Nishtar Hospital aimed at building reserves for the cold season. The campaign saw strong community participation across southern Punjab.',
        contact: '061-9210085',
        status: STATUS_COMPLETED
    }
];

/* ──────────────────────────────────────────────
 *  Donors
 * ────────────────────────────────────────────── */

var donors = [
    { id: 'DON-001', name: 'Ahmad Raza',    email: 'ahmad.raza@email.com',    phone: '0301-2345678', bloodGroup: 'A+'  },
    { id: 'DON-002', name: 'Fatima Khan',   email: 'fatima.khan@email.com',   phone: '0312-3456789', bloodGroup: 'B+'  },
    { id: 'DON-003', name: 'Usman Ali',     email: 'usman.ali@email.com',     phone: '0333-4567890', bloodGroup: 'O+'  },
    { id: 'DON-004', name: 'Ayesha Malik',  email: 'ayesha.malik@email.com',  phone: '0345-5678901', bloodGroup: 'AB+' },
    { id: 'DON-005', name: 'Hassan Ahmed',  email: 'hassan.ahmed@email.com',  phone: '0300-6789012', bloodGroup: 'O-'  },
    { id: 'DON-006', name: 'Sana Noor',     email: 'sana.noor@email.com',     phone: '0321-7890123', bloodGroup: 'A-'  },
    { id: 'DON-007', name: 'Bilal Hussain', email: 'bilal.hussain@email.com', phone: '0311-8901234', bloodGroup: 'B-'  },
    { id: 'DON-008', name: 'Zara Sheikh',   email: 'zara.sheikh@email.com',   phone: '0334-9012345', bloodGroup: 'AB-' }
];

/* ──────────────────────────────────────────────
 *  Registrations
 * ────────────────────────────────────────────── */

var registrations = [
    /* --- CAM-001  Rawalpindi Blood Drive (32 registered) --- */
    { id: 'REG-001', donorId: 'DON-001', campaignId: 'CAM-001', registrationDate: '2026-11-10', status: 'Confirmed' },
    { id: 'REG-002', donorId: 'DON-003', campaignId: 'CAM-001', registrationDate: '2026-11-11', status: 'Confirmed' },
    { id: 'REG-003', donorId: 'DON-005', campaignId: 'CAM-001', registrationDate: '2026-11-11', status: 'Confirmed' },
    { id: 'REG-004', donorId: 'DON-006', campaignId: 'CAM-001', registrationDate: '2026-11-12', status: 'Confirmed' },
    { id: 'REG-005', donorId: 'DON-007', campaignId: 'CAM-001', registrationDate: '2026-11-12', status: 'Confirmed' },
    { id: 'REG-006', donorId: 'DON-008', campaignId: 'CAM-001', registrationDate: '2026-11-13', status: 'Confirmed' },

    /* --- CAM-002  NUST Campus Donation Day (40 registered — Full) --- */
    { id: 'REG-007', donorId: 'DON-001', campaignId: 'CAM-002', registrationDate: '2026-11-15', status: 'Confirmed' },
    { id: 'REG-008', donorId: 'DON-002', campaignId: 'CAM-002', registrationDate: '2026-11-15', status: 'Confirmed' },
    { id: 'REG-009', donorId: 'DON-003', campaignId: 'CAM-002', registrationDate: '2026-11-16', status: 'Confirmed' },
    { id: 'REG-010', donorId: 'DON-005', campaignId: 'CAM-002', registrationDate: '2026-11-16', status: 'Confirmed' },
    { id: 'REG-011', donorId: 'DON-004', campaignId: 'CAM-002', registrationDate: '2026-11-17', status: 'Confirmed' },

    /* --- CAM-003  Lahore General Hospital (15 registered) --- */
    { id: 'REG-012', donorId: 'DON-001', campaignId: 'CAM-003', registrationDate: '2026-11-20', status: 'Confirmed' },
    { id: 'REG-013', donorId: 'DON-002', campaignId: 'CAM-003', registrationDate: '2026-11-21', status: 'Confirmed' },
    { id: 'REG-014', donorId: 'DON-006', campaignId: 'CAM-003', registrationDate: '2026-11-22', status: 'Confirmed' },

    /* --- CAM-004  Islamabad Community Blood Camp (5 registered) --- */
    { id: 'REG-015', donorId: 'DON-003', campaignId: 'CAM-004', registrationDate: '2026-11-25', status: 'Confirmed' },
    { id: 'REG-016', donorId: 'DON-004', campaignId: 'CAM-004', registrationDate: '2026-11-26', status: 'Confirmed' },

    /* --- CAM-005  Karachi Medical Drive (45 registered — Completed) --- */
    { id: 'REG-017', donorId: 'DON-004', campaignId: 'CAM-005', registrationDate: '2026-10-05', status: 'Confirmed' },
    { id: 'REG-018', donorId: 'DON-005', campaignId: 'CAM-005', registrationDate: '2026-10-06', status: 'Confirmed' },
    { id: 'REG-019', donorId: 'DON-008', campaignId: 'CAM-005', registrationDate: '2026-10-07', status: 'Confirmed' },
    { id: 'REG-020', donorId: 'DON-003', campaignId: 'CAM-005', registrationDate: '2026-10-08', status: 'Confirmed' },

    /* --- CAM-006  Faisalabad Donation Festival (10 registered) --- */
    { id: 'REG-021', donorId: 'DON-002', campaignId: 'CAM-006', registrationDate: '2026-12-01', status: 'Confirmed' },
    { id: 'REG-022', donorId: 'DON-007', campaignId: 'CAM-006', registrationDate: '2026-12-02', status: 'Confirmed' },

    /* --- CAM-007  Peshawar Youth Blood Drive (0 registered) --- */
    /* No registrations yet */

    /* --- CAM-008  Multan Winter Blood Campaign (38 registered — Completed) --- */
    { id: 'REG-023', donorId: 'DON-001', campaignId: 'CAM-008', registrationDate: '2026-10-10', status: 'Confirmed' },
    { id: 'REG-024', donorId: 'DON-002', campaignId: 'CAM-008', registrationDate: '2026-10-11', status: 'Confirmed' },
    { id: 'REG-025', donorId: 'DON-007', campaignId: 'CAM-008', registrationDate: '2026-10-12', status: 'Confirmed' }
];

/* ──────────────────────────────────────────────
 *  ID Counter Trackers
 * ────────────────────────────────────────────── */

var nextCampaignId     = 9;
var nextDonorId        = 9;
var nextRegistrationId = 26;

/* ──────────────────────────────────────────────
 *  Helper Functions
 * ────────────────────────────────────────────── */

/**
 * Generate next campaign ID  (CAM-009, CAM-010, …)
 */
function generateCampaignId() {
    var id = 'CAM-' + String(nextCampaignId).padStart(3, '0');
    nextCampaignId++;
    return id;
}

/**
 * Generate next donor ID  (DON-009, DON-010, …)
 */
function generateDonorId() {
    var id = 'DON-' + String(nextDonorId).padStart(3, '0');
    nextDonorId++;
    return id;
}

/**
 * Generate next registration ID  (REG-026, REG-027, …)
 */
function generateRegistrationId() {
    var id = 'REG-' + String(nextRegistrationId).padStart(3, '0');
    nextRegistrationId++;
    return id;
}

/**
 * Find a campaign by its ID.
 * @param  {string} campaignId
 * @return {object|null}
 */
function findCampaignById(campaignId) {
    for (var i = 0; i < campaigns.length; i++) {
        if (campaigns[i].id === campaignId) return campaigns[i];
    }
    return null;
}

/**
 * Find a donor by their ID.
 * @param  {string} donorId
 * @return {object|null}
 */
function findDonorById(donorId) {
    for (var i = 0; i < donors.length; i++) {
        if (donors[i].id === donorId) return donors[i];
    }
    return null;
}

/**
 * Get all registrations for a given campaign.
 * @param  {string} campaignId
 * @return {Array}
 */
function getRegistrationsForCampaign(campaignId) {
    var result = [];
    for (var i = 0; i < registrations.length; i++) {
        if (registrations[i].campaignId === campaignId) {
            result.push(registrations[i]);
        }
    }
    return result;
}

/**
 * Check whether a donor (identified by email) is already registered
 * for a specific campaign.
 * @param  {string} donorEmail
 * @param  {string} campaignId
 * @return {boolean}
 */
function isDonorRegistered(donorEmail, campaignId) {
    for (var i = 0; i < registrations.length; i++) {
        if (registrations[i].campaignId === campaignId) {
            var donor = findDonorById(registrations[i].donorId);
            if (donor && donor.email === donorEmail) return true;
        }
    }
    return false;
}

/**
 * Compute the live status of a campaign based on its date and capacity.
 * @param  {object} campaign
 * @return {string}  STATUS_COMPLETED | STATUS_FULL | STATUS_UPCOMING
 */
function computeCampaignStatus(campaign) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var campDate = new Date(campaign.date);
    campDate.setHours(0, 0, 0, 0);

    if (campDate < today) return STATUS_COMPLETED;
    if (campaign.registeredCount >= campaign.capacity) return STATUS_FULL;
    return STATUS_UPCOMING;
}

/**
 * Refresh the status field on every campaign in the array.
 */
function updateAllCampaignStatuses() {
    for (var i = 0; i < campaigns.length; i++) {
        campaigns[i].status = computeCampaignStatus(campaigns[i]);
    }
}

/**
 * Return aggregate numbers for the dashboard.
 * @return {object}  { total, upcoming, totalRegistrations, availableSlots }
 */
function getDashboardStats() {
    var total = campaigns.length;
    var upcoming = 0;
    var totalRegistrations = registrations.length;
    var availableSlots = 0;

    for (var i = 0; i < campaigns.length; i++) {
        if (campaigns[i].status === STATUS_UPCOMING) {
            upcoming++;
            availableSlots += (campaigns[i].capacity - campaigns[i].registeredCount);
        }
    }

    return {
        total: total,
        upcoming: upcoming,
        totalRegistrations: totalRegistrations,
        availableSlots: availableSlots
    };
}

/**
 * Detect scheduling conflicts — same location, same date, overlapping times.
 * @param  {string}      location
 * @param  {string}      date       YYYY-MM-DD
 * @param  {string}      startTime  HH:MM
 * @param  {string}      endTime    HH:MM
 * @param  {string|null} excludeId  Campaign ID to skip (for edits)
 * @return {Array}       Array of conflicting campaign objects
 */
function checkSchedulingConflict(location, date, startTime, endTime, excludeId) {
    var conflicts = [];
    for (var i = 0; i < campaigns.length; i++) {
        var camp = campaigns[i];
        if (excludeId && camp.id === excludeId) continue;
        if (camp.location.toLowerCase().trim() === location.toLowerCase().trim() && camp.date === date) {
            // Check time overlap
            if (startTime < camp.endTime && endTime > camp.startTime) {
                conflicts.push(camp);
            }
        }
    }
    return conflicts;
}

/**
 * Format an ISO date string for user-friendly display.
 * @param  {string} dateStr  YYYY-MM-DD
 * @return {string}          e.g. "Wednesday, 25 November 2026"
 */
function formatDate(dateStr) {
    var date = new Date(dateStr + 'T00:00:00');
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-PK', options);
}

/**
 * Convert 24-hour time to 12-hour display format.
 * @param  {string} timeStr  "HH:MM"
 * @return {string}          e.g. "9:00 AM"
 */
function formatTime(timeStr) {
    var parts = timeStr.split(':');
    var hours = parseInt(parts[0]);
    var minutes = parts[1];
    var period = hours >= 12 ? 'PM' : 'AM';
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    return hours + ':' + minutes + ' ' + period;
}

/**
 * Get today's date as a YYYY-MM-DD string.
 * @return {string}
 */
function getTodayString() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}
