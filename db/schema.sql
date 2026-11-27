-- ============================================================
--  BloodLink — Blood Donation Campaign Scheduler
--  CS344 Web Engineering — Assignment 2 (PHP 8.5 + PDO + SQLite)
--  FILE: db/schema.sql — Relational Database Schema
-- ============================================================

PRAGMA foreign_keys = ON;

-- 1. Users table (Organizers for session ownership & authentication)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'organizer',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Campaigns table (Core records from Assignment 1 + owner_id)
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    organizer TEXT NOT NULL,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    required_blood_groups TEXT NOT NULL, -- JSON array string e.g. '["A+","O+"]'
    capacity INTEGER NOT NULL CHECK (capacity >= 1),
    registered_count INTEGER NOT NULL DEFAULT 0 CHECK (registered_count >= 0),
    description TEXT NOT NULL,
    contact TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Donors table
CREATE TABLE IF NOT EXISTS donors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 4. Registrations junction table (links donors to campaigns)
CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    donor_id TEXT NOT NULL,
    registered_at TEXT NOT NULL DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'Confirmed',
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE,
    UNIQUE (campaign_id, donor_id)
);
