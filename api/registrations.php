<?php
/**
 * ============================================================
 *  BloodLink — Blood Donation Campaign Scheduler
 *  CS344 Web Engineering — Assignment 2
 *  FILE: api/registrations.php — Donor Registration JSON Endpoint
 * ============================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/security.php';

startSecureSession();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method !== 'POST') {
    jsonError('Method not allowed.', 405);
}

$body = readJsonBody();
verifyCsrfToken($body);
$data = validateDonorPayload($body);

$pdo = getDb();
$pdo->beginTransaction();

try {
    // 1. Fetch target campaign
    $campStmt = $pdo->prepare('SELECT * FROM campaigns WHERE id = ? LIMIT 1');
    $campStmt->execute([$data['campaignId']]);
    $camp = $campStmt->fetch();

    if (!$camp) {
        $pdo->rollBack();
        jsonError('Selected campaign could not be found.', 404);
    }

    $capacity        = (int) $camp['capacity'];
    $registeredCount = (int) $camp['registered_count'];
    $status          = computeCampaignStatus((string) $camp['date'], $registeredCount, $capacity);

    if ($status === 'Completed') {
        $pdo->rollBack();
        jsonError('This campaign has already completed. Registrations are closed.', 400);
    }

    if ($status === 'Full' || $registeredCount >= $capacity) {
        $pdo->rollBack();
        jsonError("This campaign has reached its maximum donor capacity ({$capacity}). No more slots available.", 400);
    }

    // 2. Check blood group eligibility for this campaign
    $reqGroups = json_decode((string) $camp['required_blood_groups'], true);
    if (is_array($reqGroups) && count($reqGroups) > 0 && !in_array($data['bloodGroup'], $reqGroups, true)) {
        $pdo->rollBack();
        $allowedList = implode(', ', $reqGroups);
        jsonError(
            "This campaign is specifically requesting blood groups: {$allowedList}. Your blood group ({$data['bloodGroup']}) does not match.",
            422
        );
    }

    // 3. Find or create donor record by email
    $donorStmt = $pdo->prepare('SELECT id, name, email, phone, blood_group FROM donors WHERE LOWER(email) = ? LIMIT 1');
    $donorStmt->execute([$data['email']]);
    $donor = $donorStmt->fetch();

    if ($donor) {
        $donorId = $donor['id'];
        // Check duplicate registration for this campaign
        $dupStmt = $pdo->prepare('SELECT id FROM registrations WHERE campaign_id = ? AND donor_id = ? LIMIT 1');
        $dupStmt->execute([$data['campaignId'], $donorId]);
        if ($dupStmt->fetch()) {
            $pdo->rollBack();
            jsonError("You have already registered for '{$camp['title']}' with this email address.", 409);
        }
    } else {
        // Generate next DON-XXX ID
        $idStmt = $pdo->query("SELECT id FROM donors WHERE id LIKE 'DON-%'");
        $maxD   = 0;
        while ($r = $idStmt->fetch()) {
            $n = (int) substr((string) $r['id'], 4);
            if ($n > $maxD) {
                $maxD = $n;
            }
        }
        $donorId = 'DON-' . str_pad((string) ($maxD + 1), 3, '0', STR_PAD_LEFT);

        $insDonor = $pdo->prepare(
            'INSERT INTO donors (id, name, email, phone, blood_group) VALUES (?, ?, ?, ?, ?)'
        );
        $insDonor->execute([
            $donorId,
            $data['name'],
            $data['email'],
            $data['phone'],
            $data['bloodGroup'],
        ]);
    }

    // 4. Generate next REG-XXX ID and insert registration
    $regIdStmt = $pdo->query("SELECT id FROM registrations WHERE id LIKE 'REG-%'");
    $maxR      = 0;
    while ($r = $regIdStmt->fetch()) {
        $n = (int) substr((string) $r['id'], 4);
        if ($n > $maxR) {
            $maxR = $n;
        }
    }
    $regId = 'REG-' . str_pad((string) ($maxR + 1), 3, '0', STR_PAD_LEFT);

    $insReg = $pdo->prepare(
        'INSERT INTO registrations (id, campaign_id, donor_id, registered_at, status) VALUES (?, ?, ?, ?, ?)'
    );
    $insReg->execute([
        $regId,
        $data['campaignId'],
        $donorId,
        date('Y-m-d'),
        'Confirmed',
    ]);

    // 5. Increment campaign registered_count
    $updCamp = $pdo->prepare('UPDATE campaigns SET registered_count = registered_count + 1 WHERE id = ?');
    $updCamp->execute([$data['campaignId']]);

    $pdo->commit();

    jsonResponse([
        'success'      => true,
        'message'      => "Thank you, {$data['name']}! Your registration ({$regId}) for '{$camp['title']}' is confirmed.",
        'registration' => [
            'id'         => $regId,
            'campaignId' => $data['campaignId'],
            'donorId'    => $donorId,
            'status'     => 'Confirmed',
        ],
    ], 201);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    jsonError('Unable to complete registration: ' . $e->getMessage(), 500);
}
