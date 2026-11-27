<?php
/**
 * ============================================================
 *  BloodLink — Blood Donation Campaign Scheduler
 *  CS344 Web Engineering — Assignment 2
 *  FILE: api/campaigns.php — REST/JSON CRUD Endpoint (PDO + Prepared Statements)
 * ============================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/security.php';

startSecureSession();
$pdo           = getDb();
$method        = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$currentUserId = getCurrentUserId();

/**
 * Formats a database campaign row into the frontend JSON structure.
 */
function formatCampaignRow(array $row, ?int $currentUserId): array
{
    $bloodGroups = json_decode((string) $row['required_blood_groups'], true);
    if (!is_array($bloodGroups)) {
        $bloodGroups = [];
    }

    $capacity        = (int) $row['capacity'];
    $registeredCount = (int) $row['registered_count'];
    $ownerId         = (int) $row['owner_id'];

    return [
        'id'                  => $row['id'],
        'ownerId'             => $ownerId,
        'title'               => $row['title'],
        'organizer'           => $row['organizer'],
        'location'            => $row['location'],
        'date'                => $row['date'],
        'startTime'           => $row['start_time'],
        'endTime'             => $row['end_time'],
        'requiredBloodGroups' => $bloodGroups,
        'capacity'            => $capacity,
        'registeredCount'     => $registeredCount,
        'description'         => $row['description'],
        'contact'             => $row['contact'],
        'status'              => computeCampaignStatus((string) $row['date'], $registeredCount, $capacity),
        'canManage'           => ($currentUserId !== null && $ownerId === $currentUserId),
    ];
}

/**
 * Generates the next sequential Campaign ID (e.g. CAM-009).
 */
function generateNextCampaignId(PDO $pdo): string
{
    $stmt = $pdo->query("SELECT id FROM campaigns WHERE id LIKE 'CAM-%'");
    $max  = 0;
    while ($row = $stmt->fetch()) {
        $num = (int) substr((string) $row['id'], 4);
        if ($num > $max) {
            $max = $num;
        }
    }
    return 'CAM-' . str_pad((string) ($max + 1), 3, '0', STR_PAD_LEFT);
}

/**
 * Checks for spatial & temporal scheduling conflicts using prepared statements.
 */
function findSchedulingConflicts(
    PDO $pdo,
    string $location,
    string $date,
    string $startTime,
    string $endTime,
    ?string $excludeId = null
): array {
    $sql = 'SELECT id, title, date, start_time, end_time
            FROM campaigns
            WHERE LOWER(TRIM(location)) = LOWER(TRIM(?))
              AND date = ?
              AND start_time < ?
              AND end_time > ?';
    $params = [$location, $date, $endTime, $startTime];

    if ($excludeId !== null && $excludeId !== '') {
        $sql .= ' AND id != ?';
        $params[] = $excludeId;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

// ============================================================
// GET: List campaigns (+ stats) OR Fetch single campaign detail
// ============================================================
if ($method === 'GET') {
    $singleId = trim((string) ($_GET['id'] ?? ''));

    if ($singleId !== '') {
        $stmt = $pdo->prepare('SELECT * FROM campaigns WHERE id = ? LIMIT 1');
        $stmt->execute([$singleId]);
        $row = $stmt->fetch();

        if (!$row) {
            jsonError('Campaign not found.', 404);
        }

        $donorsStmt = $pdo->prepare(
            'SELECT d.id, d.name, d.email, d.blood_group AS bloodGroup, r.registered_at AS registeredAt
             FROM registrations r
             INNER JOIN donors d ON r.donor_id = d.id
             WHERE r.campaign_id = ?
             ORDER BY r.registered_at DESC, r.id DESC'
        );
        $donorsStmt->execute([$singleId]);
        $donors = $donorsStmt->fetchAll();

        jsonResponse([
            'success'  => true,
            'campaign' => formatCampaignRow($row, $currentUserId),
            'donors'   => $donors,
        ]);
    }

    // Fetch all campaigns with optional server-side filters
    $search     = trim((string) ($_GET['search'] ?? ''));
    $location   = trim((string) ($_GET['location'] ?? ''));
    $bloodGroup = trim((string) ($_GET['bloodGroup'] ?? ''));
    $dateFilter = trim((string) ($_GET['date'] ?? ''));
    $statusFilt = trim((string) ($_GET['status'] ?? ''));

    $sql    = 'SELECT * FROM campaigns WHERE 1=1';
    $params = [];

    if ($search !== '') {
        $sql .= ' AND (LOWER(title) LIKE LOWER(?) OR LOWER(organizer) LIKE LOWER(?) OR LOWER(location) LIKE LOWER(?))';
        $like = '%' . $search . '%';
        $params[] = $like;
        $params[] = $like;
        $params[] = $like;
    }
    if ($location !== '') {
        $sql .= ' AND LOWER(location) LIKE LOWER(?)';
        $params[] = '%' . $location . '%';
    }
    if ($dateFilter !== '') {
        $sql .= ' AND date = ?';
        $params[] = $dateFilter;
    }

    $sql .= ' ORDER BY date ASC, start_time ASC';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $allRows = $stmt->fetchAll();

    // Also compute overall dashboard stats from all campaigns
    $allCampaignRows = $pdo->query('SELECT * FROM campaigns')->fetchAll();
    $stats = [
        'total'              => 0,
        'upcoming'           => 0,
        'totalRegistrations' => 0,
        'availableSlots'     => 0,
    ];
    foreach ($allCampaignRows as $r) {
        $formatted = formatCampaignRow($r, $currentUserId);
        $stats['total']++;
        $stats['totalRegistrations'] += $formatted['registeredCount'];
        if ($formatted['status'] === 'Upcoming') {
            $stats['upcoming']++;
            $stats['availableSlots'] += max(0, $formatted['capacity'] - $formatted['registeredCount']);
        }
    }

    $campaigns = [];
    foreach ($allRows as $r) {
        $c = formatCampaignRow($r, $currentUserId);
        if ($bloodGroup !== '' && !in_array($bloodGroup, $c['requiredBloodGroups'], true)) {
            continue;
        }
        if ($statusFilt !== '' && $c['status'] !== $statusFilt) {
            continue;
        }
        $campaigns[] = $c;
    }

    jsonResponse([
        'success'   => true,
        'campaigns' => $campaigns,
        'stats'     => $stats,
    ]);
}

// ============================================================
// POST / PUT / DELETE: Mutating CRUD operations
// ============================================================
$body   = readJsonBody();
$action = trim((string) ($body['action'] ?? ''));

// Support both REST verbs (PUT/DELETE) and POST with action=update/delete
$effectiveMethod = $method;
if ($method === 'POST' && $action === 'update') {
    $effectiveMethod = 'PUT';
} elseif ($method === 'POST' && $action === 'delete') {
    $effectiveMethod = 'DELETE';
}

// CREATE Campaign
if ($effectiveMethod === 'POST') {
    $userId = requireAuth();
    verifyCsrfToken($body);

    $data = validateCampaignPayload($body, false);

    $conflicts = findSchedulingConflicts(
        $pdo,
        $data['location'],
        $data['date'],
        $data['startTime'],
        $data['endTime']
    );
    if (count($conflicts) > 0) {
        $c = $conflicts[0];
        jsonError(
            "Scheduling conflict with '{$c['title']}' at the same location on {$c['date']} from {$c['start_time']} to {$c['end_time']}.",
            409
        );
    }

    $newId = generateNextCampaignId($pdo);
    $stmt  = $pdo->prepare(
        'INSERT INTO campaigns (
            id, owner_id, title, organizer, location, date, start_time, end_time,
            required_blood_groups, capacity, registered_count, description, contact
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)'
    );
    $stmt->execute([
        $newId,
        $userId,
        $data['title'],
        $data['organizer'],
        $data['location'],
        $data['date'],
        $data['startTime'],
        $data['endTime'],
        json_encode($data['requiredBloodGroups']),
        $data['capacity'],
        $data['description'],
        $data['contact'],
    ]);

    $fetchStmt = $pdo->prepare('SELECT * FROM campaigns WHERE id = ?');
    $fetchStmt->execute([$newId]);
    $created = formatCampaignRow($fetchStmt->fetch(), $userId);

    jsonResponse([
        'success'  => true,
        'message'  => "Campaign '{$created['title']}' created successfully!",
        'campaign' => $created,
    ], 201);
}

// UPDATE Campaign
if ($effectiveMethod === 'PUT') {
    $userId = requireAuth();
    verifyCsrfToken($body);

    $campaignId = trim((string) ($body['id'] ?? ($_GET['id'] ?? '')));
    if ($campaignId === '') {
        jsonError('Campaign ID is required for update.', 400);
    }

    $existingStmt = $pdo->prepare('SELECT * FROM campaigns WHERE id = ? LIMIT 1');
    $existingStmt->execute([$campaignId]);
    $existing = $existingStmt->fetch();

    if (!$existing) {
        jsonError('Campaign not found.', 404);
    }

    requireOwnership((int) $existing['owner_id'], $userId);

    $sameDate = ($existing['date'] === trim((string) ($body['date'] ?? '')));
    $data     = validateCampaignPayload($body, $sameDate);

    if ($data['capacity'] < (int) $existing['registered_count']) {
        jsonError(
            "Capacity ({$data['capacity']}) cannot be less than current registrations ({$existing['registered_count']}).",
            422
        );
    }

    $conflicts = findSchedulingConflicts(
        $pdo,
        $data['location'],
        $data['date'],
        $data['startTime'],
        $data['endTime'],
        $campaignId
    );
    if (count($conflicts) > 0) {
        $c = $conflicts[0];
        jsonError(
            "Scheduling conflict with '{$c['title']}' at the same location on {$c['date']} from {$c['start_time']} to {$c['end_time']}.",
            409
        );
    }

    $upd = $pdo->prepare(
        'UPDATE campaigns
         SET title = ?, organizer = ?, location = ?, date = ?, start_time = ?, end_time = ?,
             required_blood_groups = ?, capacity = ?, contact = ?, description = ?
         WHERE id = ? AND owner_id = ?'
    );
    $upd->execute([
        $data['title'],
        $data['organizer'],
        $data['location'],
        $data['date'],
        $data['startTime'],
        $data['endTime'],
        json_encode($data['requiredBloodGroups']),
        $data['capacity'],
        $data['contact'],
        $data['description'],
        $campaignId,
        $userId,
    ]);

    $fetchStmt = $pdo->prepare('SELECT * FROM campaigns WHERE id = ?');
    $fetchStmt->execute([$campaignId]);
    $updated = formatCampaignRow($fetchStmt->fetch(), $userId);

    jsonResponse([
        'success'  => true,
        'message'  => "Campaign '{$updated['title']}' updated successfully!",
        'campaign' => $updated,
    ]);
}

// DELETE Campaign
if ($effectiveMethod === 'DELETE') {
    $userId = requireAuth();
    verifyCsrfToken($body);

    $campaignId = trim((string) ($body['id'] ?? ($_GET['id'] ?? '')));
    if ($campaignId === '') {
        jsonError('Campaign ID is required for deletion.', 400);
    }

    $existingStmt = $pdo->prepare('SELECT id, owner_id, title FROM campaigns WHERE id = ? LIMIT 1');
    $existingStmt->execute([$campaignId]);
    $existing = $existingStmt->fetch();

    if (!$existing) {
        jsonError('Campaign not found.', 404);
    }

    requireOwnership((int) $existing['owner_id'], $userId);

    $del = $pdo->prepare('DELETE FROM campaigns WHERE id = ? AND owner_id = ?');
    $del->execute([$campaignId, $userId]);

    jsonResponse([
        'success' => true,
        'message' => "Campaign '{$existing['title']}' deleted successfully!",
    ]);
}

jsonError('Method not allowed.', 405);
