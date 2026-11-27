<?php
/**
 * ============================================================
 *  BloodLink — Blood Donation Campaign Scheduler
 *  CS344 Web Engineering — Assignment 2
 *  FILE: includes/security.php — Sessions, CSRF, Encoding & Validation
 * ============================================================
 */

declare(strict_types=1);

const ALLOWED_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * Starts a hardened PHP session if not already started.
 */
function startSecureSession(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
        session_set_cookie_params([
            'lifetime' => 0,
            'path'     => '/',
            'secure'   => $isHttps,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }
}

/**
 * Encodes user-controlled output safely for HTML contexts.
 */
function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Generates or retrieves the current session CSRF token.
 */
function getCsrfToken(): string
{
    startSecureSession();
    if (empty($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validates the CSRF token from X-CSRF-Token header or request body.
 */
function verifyCsrfToken(?array $jsonBody = null): void
{
    startSecureSession();
    $sessionToken = $_SESSION['csrf_token'] ?? '';
    $headerToken  = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $bodyToken    = $jsonBody['_csrf_token'] ?? ($_POST['_csrf_token'] ?? '');
    $provided     = $headerToken !== '' ? $headerToken : (string) $bodyToken;

    if ($sessionToken === '' || $provided === '' || !hash_equals($sessionToken, $provided)) {
        jsonError('Invalid or missing CSRF security token. Please refresh the page.', 403);
    }
}

/**
 * Returns the currently authenticated user ID, or null if guest.
 */
function getCurrentUserId(): ?int
{
    startSecureSession();
    return isset($_SESSION['user_id']) ? (int) $_SESSION['user_id'] : null;
}

/**
 * Returns the current authenticated user summary array, or null.
 */
function getCurrentUser(): ?array
{
    startSecureSession();
    if (!isset($_SESSION['user_id'])) {
        return null;
    }
    return [
        'id'    => (int) $_SESSION['user_id'],
        'name'  => (string) ($_SESSION['user_name'] ?? ''),
        'email' => (string) ($_SESSION['user_email'] ?? ''),
        'role'  => (string) ($_SESSION['user_role'] ?? 'organizer'),
    ];
}

/**
 * Enforces an authenticated session; sends 401 JSON error otherwise.
 */
function requireAuth(): int
{
    $userId = getCurrentUserId();
    if ($userId === null) {
        jsonError('Authentication required. Please sign in as an organizer to perform this action.', 401);
    }
    return $userId;
}

/**
 * Enforces ownership of a resource; sends 403 JSON error if mismatch.
 */
function requireOwnership(int $ownerId, int $currentUserId): void
{
    if ($ownerId !== $currentUserId) {
        jsonError('Unauthorized: you can only modify or delete campaigns that you own.', 403);
    }
}

/**
 * Reads and decodes a JSON request body safely.
 */
function readJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        jsonError('Malformed JSON payload.', 400);
    }
    return $decoded;
}

/**
 * Sends a JSON success response and terminates execution.
 */
function jsonResponse(array $payload, int $statusCode = 200): never
{
    if (!headers_sent()) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Sends a JSON error response and terminates execution.
 */
function jsonError(string $message, int $statusCode = 400, array $extra = []): never
{
    jsonResponse(array_merge([
        'success' => false,
        'error'   => $message,
    ], $extra), $statusCode);
}

/**
 * Computes campaign status dynamically from date, registered_count, and capacity.
 */
function computeCampaignStatus(string $date, int $registeredCount, int $capacity): string
{
    $today = date('Y-m-d');
    if ($date < $today) {
        return 'Completed';
    }
    if ($registeredCount >= $capacity) {
        return 'Full';
    }
    return 'Upcoming';
}

/**
 * Validates campaign input payload on the server.
 * Returns sanitized campaign data or sends 422 JSON error.
 */
function validateCampaignPayload(array $input, bool $allowPastDate = false): array
{
    $title       = trim((string) ($input['title'] ?? ''));
    $organizer   = trim((string) ($input['organizer'] ?? ''));
    $location    = trim((string) ($input['location'] ?? ''));
    $date        = trim((string) ($input['date'] ?? ''));
    $startTime   = trim((string) ($input['startTime'] ?? ''));
    $endTime     = trim((string) ($input['endTime'] ?? ''));
    $bloodGroups = $input['requiredBloodGroups'] ?? [];
    $capacityRaw = $input['capacity'] ?? null;
    $contact     = trim((string) ($input['contact'] ?? ''));
    $description = trim((string) ($input['description'] ?? ''));

    if (mb_strlen($title) < 3 || mb_strlen($title) > 150) {
        jsonError('Campaign name must be between 3 and 150 characters.', 422);
    }
    if ($organizer === '' || mb_strlen($organizer) > 120) {
        jsonError('Organizer name is required (max 120 characters).', 422);
    }
    if ($location === '' || mb_strlen($location) > 180) {
        jsonError('Campaign location is required (max 180 characters).', 422);
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        jsonError('Please provide a valid date in YYYY-MM-DD format.', 422);
    }
    $dt = DateTime::createFromFormat('Y-m-d', $date);
    if (!$dt || $dt->format('Y-m-d') !== $date) {
        jsonError('Invalid calendar date.', 422);
    }
    if (!$allowPastDate && $date < date('Y-m-d')) {
        jsonError('Campaign date cannot be in the past.', 422);
    }

    if (!preg_match('/^\d{2}:\d{2}$/', $startTime) || !preg_match('/^\d{2}:\d{2}$/', $endTime)) {
        jsonError('Start time and end time must be in HH:MM format.', 422);
    }
    if ($endTime <= $startTime) {
        jsonError('End time must be strictly after start time.', 422);
    }

    if (!is_array($bloodGroups) || count($bloodGroups) === 0) {
        jsonError('Please select at least one required blood group.', 422);
    }
    $cleanGroups = [];
    foreach ($bloodGroups as $bg) {
        $bgStr = trim((string) $bg);
        if (!in_array($bgStr, ALLOWED_BLOOD_GROUPS, true)) {
            jsonError('Invalid blood group specified: ' . $bgStr, 422);
        }
        if (!in_array($bgStr, $cleanGroups, true)) {
            $cleanGroups[] = $bgStr;
        }
    }

    if (!is_numeric($capacityRaw) || (int) $capacityRaw < 1 || (int) $capacityRaw > 5000) {
        jsonError('Maximum donor capacity must be a positive integer between 1 and 5000.', 422);
    }
    $capacity = (int) $capacityRaw;

    if ($contact === '' || mb_strlen($contact) > 100) {
        jsonError('Valid contact information is required.', 422);
    }
    if (mb_strlen($description) < 10 || mb_strlen($description) > 2000) {
        jsonError('Campaign description must be between 10 and 2000 characters.', 422);
    }

    return [
        'title'               => $title,
        'organizer'           => $organizer,
        'location'            => $location,
        'date'                => $date,
        'startTime'           => $startTime,
        'endTime'             => $endTime,
        'requiredBloodGroups' => $cleanGroups,
        'capacity'            => $capacity,
        'contact'             => $contact,
        'description'         => $description,
    ];
}

/**
 * Validates donor registration payload on the server.
 */
function validateDonorPayload(array $input): array
{
    $name       = trim((string) ($input['name'] ?? ''));
    $email      = trim((string) ($input['email'] ?? ''));
    $phone      = trim((string) ($input['phone'] ?? ''));
    $bloodGroup = trim((string) ($input['bloodGroup'] ?? ''));
    $campaignId = trim((string) ($input['campaignId'] ?? ''));

    if (mb_strlen($name) < 2 || mb_strlen($name) > 120) {
        jsonError('Please enter your full name (2–120 characters).', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonError('Please enter a valid email address.', 422);
    }

    $cleanedPhone = preg_replace('/[\s\-]/', '', $phone);
    if (!preg_match('/^(\+92|0)?3[0-9]{9}$/', (string) $cleanedPhone)) {
        jsonError('Please enter a valid Pakistani mobile number (e.g., 03001234567 or +923001234567).', 422);
    }

    if (!in_array($bloodGroup, ALLOWED_BLOOD_GROUPS, true)) {
        jsonError('Please select a valid blood group.', 422);
    }
    if ($campaignId === '') {
        jsonError('Please select a campaign to register for.', 422);
    }

    return [
        'name'       => $name,
        'email'      => strtolower($email),
        'phone'      => $phone,
        'bloodGroup' => $bloodGroup,
        'campaignId' => $campaignId,
    ];
}
