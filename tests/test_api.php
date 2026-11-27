<?php
/**
 * ============================================================
 *  BloodLink — Automated Assignment 2 Verification Suite
 *  CS344 Web Engineering — Assignment 2 (PHP 8.5 + PDO + Fetch)
 *
 *  Usage (with PHP server running on http://127.0.0.1:8000):
 *    php tests/test_api.php
 * ============================================================
 */

declare(strict_types=1);

$baseUrl   = 'http://127.0.0.1:8000';
$cookieJar = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'bloodlink_test_cookies.txt';
if (file_exists($cookieJar)) {
    unlink($cookieJar);
}

$passed = 0;
$failed = 0;

function requestJson(string $method, string $url, ?array $body = null, array $headers = [], ?string $cookieFile = null): array
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

    $reqHeaders = ['Accept: application/json'];
    if ($body !== null) {
        $json = json_encode($body);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        $reqHeaders[] = 'Content-Type: application/json';
    }
    foreach ($headers as $h) {
        $reqHeaders[] = $h;
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $reqHeaders);

    if ($cookieFile !== null) {
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
    }

    $raw    = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'status' => $status,
        'body'   => json_decode((string) $raw, true) ?? [],
        'raw'    => $raw,
    ];
}

function assertTest(string $name, bool $condition, string $detail = ''): void
{
    global $passed, $failed;
    if ($condition) {
        $passed++;
        echo "[PASS] {$name}\n";
    } else {
        $failed++;
        echo "[FAIL] {$name}" . ($detail !== '' ? " — {$detail}" : '') . "\n";
    }
}

echo "=== BloodLink Assignment 2 API Test Suite ===\n\n";

// 0. Fetch initial CSRF token
$authInit = requestJson('GET', "{$baseUrl}/api/auth.php", null, [], $cookieJar);
$csrf     = $authInit['body']['csrfToken'] ?? '';
assertTest('TC-00: Bootstrap session & CSRF token', $authInit['status'] === 200 && $csrf !== '');

// 1. Unauthorized operation: attempt to create campaign without login
$unauthCreate = requestJson('POST', "{$baseUrl}/api/campaigns.php", [
    'title' => 'Unauthorized Drive',
], ["X-CSRF-Token: {$csrf}"], $cookieJar);
assertTest('TC-01: Reject unauthenticated campaign creation (401)', $unauthCreate['status'] === 401);

// 2. Sign in as Demo Organizer
$login = requestJson('POST', "{$baseUrl}/api/auth.php", [
    'action'   => 'login',
    'email'    => 'organizer@bloodlink.pk',
    'password' => 'Organizer123!',
], ["X-CSRF-Token: {$csrf}"], $cookieJar);
$csrf = $login['body']['csrfToken'] ?? $csrf;
assertTest('TC-02: Organizer sign-in succeeds (200)', $login['status'] === 200 && !empty($login['body']['user']));

// 3. Invalid/Missing Input: empty title, past date, invalid times
$invalidInput = requestJson('POST', "{$baseUrl}/api/campaigns.php", [
    'title'               => 'AB',
    'organizer'           => 'Test Org',
    'location'            => 'Test Venue',
    'date'                => '2020-01-01',
    'startTime'           => '14:00',
    'endTime'             => '10:00',
    'requiredBloodGroups' => ['O+'],
    'capacity'            => 20,
    'contact'             => '03001234567',
    'description'         => 'Too short',
], ["X-CSRF-Token: {$csrf}"], $cookieJar);
assertTest('TC-03: Reject invalid/missing input on server (422)', $invalidInput['status'] === 422);

// 4. Invalid CSRF token rejection
$badCsrf = requestJson('POST', "{$baseUrl}/api/campaigns.php", [
    'title' => 'Bad CSRF Test',
], ['X-CSRF-Token: invalid-token-123'], $cookieJar);
assertTest('TC-04: Reject missing/invalid CSRF token (403)', $badCsrf['status'] === 403);

// 5. Successful Create & Update Campaign
$created = requestJson('POST', "{$baseUrl}/api/campaigns.php", [
    'title'               => 'Automated Test Blood Drive',
    'organizer'           => 'SEECS Welfare',
    'location'            => 'SEECS Seminar Hall, Islamabad',
    'date'                => '2027-03-15',
    'startTime'           => '09:00',
    'endTime'             => '13:00',
    'requiredBloodGroups' => ['O+', 'A+'],
    'capacity'            => 30,
    'contact'             => '03175941654',
    'description'         => 'Automated verification blood drive created via API test.',
], ["X-CSRF-Token: {$csrf}"], $cookieJar);
$createdId = $created['body']['campaign']['id'] ?? '';
assertTest('TC-05: Create campaign persisted in SQLite (201)', $created['status'] === 201 && $createdId !== '');

$updated = requestJson('PUT', "{$baseUrl}/api/campaigns.php", [
    'id'                  => $createdId,
    'title'               => 'Automated Test Blood Drive (Updated)',
    'organizer'           => 'SEECS Welfare',
    'location'            => 'SEECS Seminar Hall, Islamabad',
    'date'                => '2027-03-15',
    'startTime'           => '09:00',
    'endTime'             => '14:00',
    'requiredBloodGroups' => ['O+', 'A+', 'B+'],
    'capacity'            => 45,
    'contact'             => '03175941654',
    'description'         => 'Updated verification blood drive with expanded capacity.',
], ["X-CSRF-Token: {$csrf}"], $cookieJar);
assertTest('TC-06: Update owned campaign succeeds (200)', $updated['status'] === 200 && ($updated['body']['campaign']['capacity'] ?? 0) === 45);

// 6. Unauthorized ownership test: primary organizer tries to edit CAM-007 (owned by partner@bloodlink.pk)
$unauthEdit = requestJson('PUT', "{$baseUrl}/api/campaigns.php", [
    'id'                  => 'CAM-007',
    'title'               => 'Hijacked Campaign',
    'organizer'           => 'Hacker',
    'location'            => 'Lady Reading Hospital, Peshawar',
    'date'                => '2026-12-15',
    'startTime'           => '11:00',
    'endTime'             => '17:00',
    'requiredBloodGroups' => ['O+'],
    'capacity'            => 55,
    'contact'             => '091-9211430',
    'description'         => 'Attempting unauthorized modification.',
], ["X-CSRF-Token: {$csrf}"], $cookieJar);
assertTest('TC-07: Reject editing another organizer campaign (403)', $unauthEdit['status'] === 403);

// 7. Scheduling conflict test (same venue, date, overlapping time)
$conflict = requestJson('POST', "{$baseUrl}/api/campaigns.php", [
    'title'               => 'Conflicting SEECS Drive',
    'organizer'           => 'Another Club',
    'location'            => 'SEECS Seminar Hall, Islamabad',
    'date'                => '2027-03-15',
    'startTime'           => '10:00',
    'endTime'             => '12:00',
    'requiredBloodGroups' => ['O+'],
    'capacity'            => 20,
    'contact'             => '03001234567',
    'description'         => 'Should be blocked by conflict engine.',
], ["X-CSRF-Token: {$csrf}"], $cookieJar);
assertTest('TC-08: Reject scheduling conflict at same venue/time (409)', $conflict['status'] === 409);

// 8. Clean up created test campaign
$deleted = requestJson('DELETE', "{$baseUrl}/api/campaigns.php", [
    'id' => $createdId,
], ["X-CSRF-Token: {$csrf}"], $cookieJar);
assertTest('TC-09: Delete owned test campaign (200)', $deleted['status'] === 200);

echo "\nSummary: {$passed} passed, {$failed} failed.\n";
exit($failed > 0 ? 1 : 0);
