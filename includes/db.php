<?php
/**
 * ============================================================
 *  BloodLink — Blood Donation Campaign Scheduler
 *  CS344 Web Engineering — Assignment 2
 *  FILE: includes/db.php — PDO SQLite Connection & Auto-Init
 * ============================================================
 */

declare(strict_types=1);

define('DB_PATH', __DIR__ . '/../db/bloodlink.sqlite');
define('SCHEMA_PATH', __DIR__ . '/../db/schema.sql');

/**
 * Returns a singleton PDO instance connected to SQLite.
 * Automatically initializes schema and seed data if the database is empty.
 */
function getDb(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dbDir = dirname(DB_PATH);
    if (!is_dir($dbDir)) {
        mkdir($dbDir, 0755, true);
    }

    $isNewDb = !file_exists(DB_PATH) || filesize(DB_PATH) === 0;

    $pdo = new PDO('sqlite:' . DB_PATH, null, null, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $pdo->exec('PRAGMA foreign_keys = ON;');

    if ($isNewDb) {
        initializeDatabase($pdo);
    } else {
        // Ensure tables exist even if file was touched empty
        $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='campaigns'");
        if ($stmt->fetch() === false) {
            initializeDatabase($pdo);
        }
    }

    return $pdo;
}

/**
 * Runs schema.sql and seeds initial sample data.
 */
function initializeDatabase(PDO $pdo): void
{
    if (!file_exists(SCHEMA_PATH)) {
        throw new RuntimeException('Database schema file not found.');
    }

    $schemaSql = file_get_contents(SCHEMA_PATH);
    if ($schemaSql === false) {
        throw new RuntimeException('Unable to read database schema file.');
    }

    $pdo->exec($schemaSql);

    require_once __DIR__ . '/../db/seed.php';
    seedDatabase($pdo);
}
