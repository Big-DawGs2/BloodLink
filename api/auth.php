<?php
/**
 * ============================================================
 *  BloodLink — Blood Donation Campaign Scheduler
 *  CS344 Web Engineering — Assignment 2
 *  FILE: api/auth.php — Session Authentication & CSRF Endpoint
 * ============================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/security.php';

startSecureSession();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    jsonResponse([
        'success'   => true,
        'user'      => getCurrentUser(),
        'csrfToken' => getCsrfToken(),
    ]);
}

if ($method !== 'POST') {
    jsonError('Method not allowed.', 405);
}

$body   = readJsonBody();
$action = trim((string) ($body['action'] ?? ''));

if ($action === 'login') {
    verifyCsrfToken($body);

    $email    = strtolower(trim((string) ($body['email'] ?? '')));
    $password = (string) ($body['password'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        jsonError('Please provide a valid email and password.', 422);
    }

    $pdo  = getDb();
    $stmt = $pdo->prepare('SELECT id, name, email, password_hash, role FROM users WHERE LOWER(email) = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonError('Invalid email or password.', 401);
    }

    session_regenerate_id(true);
    $_SESSION['user_id']    = (int) $user['id'];
    $_SESSION['user_name']  = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role']  = $user['role'];
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

    jsonResponse([
        'success'   => true,
        'message'   => 'Signed in successfully.',
        'user'      => getCurrentUser(),
        'csrfToken' => $_SESSION['csrf_token'],
    ]);
}

if ($action === 'register') {
    verifyCsrfToken($body);

    $name     = trim((string) ($body['name'] ?? ''));
    $email    = strtolower(trim((string) ($body['email'] ?? '')));
    $password = (string) ($body['password'] ?? '');

    if (mb_strlen($name) < 2 || mb_strlen($name) > 100) {
        jsonError('Name must be between 2 and 100 characters.', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonError('Please enter a valid email address.', 422);
    }
    if (strlen($password) < 6) {
        jsonError('Password must be at least 6 characters long.', 422);
    }

    $pdo   = getDb();
    $check = $pdo->prepare('SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1');
    $check->execute([$email]);
    if ($check->fetch()) {
        jsonError('An account with this email already exists.', 409);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $ins  = $pdo->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
    $ins->execute([$name, $email, $hash, 'organizer']);
    $newId = (int) $pdo->lastInsertId();

    session_regenerate_id(true);
    $_SESSION['user_id']    = $newId;
    $_SESSION['user_name']  = $name;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role']  = 'organizer';
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

    jsonResponse([
        'success'   => true,
        'message'   => 'Organizer account created and signed in.',
        'user'      => getCurrentUser(),
        'csrfToken' => $_SESSION['csrf_token'],
    ], 201);
}

if ($action === 'logout') {
    verifyCsrfToken($body);
    $_SESSION = [];
    session_regenerate_id(true);
    $newToken = getCsrfToken();

    jsonResponse([
        'success'   => true,
        'message'   => 'Signed out successfully.',
        'user'      => null,
        'csrfToken' => $newToken,
    ]);
}

jsonError('Unsupported auth action.', 400);
