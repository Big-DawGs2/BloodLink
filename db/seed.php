<?php
/**
 * ============================================================
 *  BloodLink — Blood Donation Campaign Scheduler
 *  CS344 Web Engineering — Assignment 2
 *  FILE: db/seed.php — Idempotent Database Seed Script
 * ============================================================
 */

declare(strict_types=1);

/**
 * Populates the database with demo organizer accounts,
 * the 8 core campaigns from Assignment 1, 8 donors, and 25 registrations.
 */
function seedDatabase(PDO $pdo, bool $resetExisting = false): void
{
    if ($resetExisting) {
        $pdo->exec('DELETE FROM registrations;');
        $pdo->exec('DELETE FROM donors;');
        $pdo->exec('DELETE FROM campaigns;');
        $pdo->exec('DELETE FROM users;');
    } else {
        $count = (int) $pdo->query('SELECT COUNT(*) FROM campaigns')->fetchColumn();
        if ($count > 0) {
            return;
        }
    }

    $pdo->beginTransaction();
    try {
        // 1. Seed Organizer Accounts (for session ownership & authorization testing)
        $userStmt = $pdo->prepare(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
        );
        $userStmt->execute([
            'Huzaifa Sohail (Lead Organizer)',
            'organizer@bloodlink.pk',
            password_hash('Organizer123!', PASSWORD_DEFAULT),
            'organizer',
        ]);
        $primaryOrganizerId = (int) $pdo->lastInsertId();

        $userStmt->execute([
            'PIMS Partner Coordinator',
            'partner@bloodlink.pk',
            password_hash('Partner123!', PASSWORD_DEFAULT),
            'organizer',
        ]);
        $partnerOrganizerId = (int) $pdo->lastInsertId();

        // 2. Seed 8 Campaigns from Assignment 1
        // Note: CAM-001..CAM-006 owned by primary organizer, CAM-007..CAM-008 owned by partner
        // so ownership authorization (403 on another user's campaign) can be demonstrated cleanly!
        $campaignsData = [
            [
                'CAM-001', $primaryOrganizerId, 'Rawalpindi Blood Drive 2026', 'Red Crescent Society',
                'Red Crescent Hospital, Rawalpindi', '2026-12-25', '09:00', '14:00',
                json_encode(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
                50, 32,
                'A large-scale blood donation drive organized by the Red Crescent Society at their Rawalpindi headquarters. All blood groups are welcome. Free health screening for every donor.',
                '051-9290231'
            ],
            [
                'CAM-002', $primaryOrganizerId, 'NUST Campus Donation Day', 'NUST Community Service Club',
                'NUST Health Center, Islamabad', '2026-12-28', '10:00', '16:00',
                json_encode(['O+', 'O-', 'A+', 'B+']),
                40, 40,
                'Annual blood donation event hosted by the NUST Community Service Club in collaboration with Pakistan Red Crescent. Open to students, faculty, and nearby residents.',
                'nust.donate@email.com'
            ],
            [
                'CAM-003', $primaryOrganizerId, 'Lahore General Hospital Campaign', 'Lahore General Hospital Blood Bank',
                'Lahore General Hospital', '2026-12-05', '08:00', '13:00',
                json_encode(['A+', 'A-', 'B+', 'B-', 'O+']),
                60, 15,
                'Lahore General Hospital urgently needs blood donations to replenish its blood bank reserves before winter. Refreshments and certificates provided to all donors.',
                '042-9211135'
            ],
            [
                'CAM-004', $primaryOrganizerId, 'Islamabad Community Blood Camp', 'Islamabad Blood Donors Society',
                'F-8 Community Center, Islamabad', '2026-12-10', '09:00', '15:00',
                json_encode(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
                80, 5,
                'A community-led blood donation camp in the heart of Islamabad. Walk-ins are welcome. Organized in partnership with PIMS Hospital and the Islamabad Blood Donors Society.',
                '0300-1112233'
            ],
            [
                'CAM-005', $primaryOrganizerId, 'Karachi Medical Drive', 'Aga Khan University Hospital',
                'Aga Khan University Hospital, Karachi', '2026-10-15', '10:00', '14:00',
                json_encode(['AB+', 'AB-', 'O+', 'O-']),
                45, 45,
                'Completed blood donation drive held at Aga Khan University Hospital targeting rare blood groups. All donation targets were successfully met.',
                '021-111-911-911'
            ],
            [
                'CAM-006', $primaryOrganizerId, 'Faisalabad Donation Festival', 'Allied Hospital Faisalabad',
                'Allied Hospital, Faisalabad', '2026-12-20', '09:00', '12:00',
                json_encode(['B+', 'B-', 'O+', 'O-']),
                35, 10,
                'A blood donation festival organized by Allied Hospital Faisalabad in collaboration with local NGOs. Includes awareness sessions and free blood group testing.',
                '041-9210072'
            ],
            [
                'CAM-007', $partnerOrganizerId, 'Peshawar Youth Blood Drive', 'KP Youth Blood Donors Network',
                'Lady Reading Hospital, Peshawar', '2026-12-15', '11:00', '17:00',
                json_encode(['A+', 'B+', 'O+', 'O-']),
                55, 0,
                'Youth-led blood donation campaign at Lady Reading Hospital Peshawar. Aimed at collecting emergency units for trauma and surgical wards.',
                '091-9211430'
            ],
            [
                'CAM-008', $partnerOrganizerId, 'Multan Winter Blood Campaign', 'Nishtar Medical University',
                'Nishtar Hospital, Multan', '2026-10-20', '08:00', '12:00',
                json_encode(['A+', 'A-', 'B+', 'O+', 'O-']),
                50, 38,
                'Completed winter blood collection campaign at Nishtar Hospital Multan. Over 38 donors participated and contributed to the regional blood supply.',
                '061-9200231'
            ],
        ];

        $campStmt = $pdo->prepare(
            'INSERT INTO campaigns (
                id, owner_id, title, organizer, location, date, start_time, end_time,
                required_blood_groups, capacity, registered_count, description, contact
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        foreach ($campaignsData as $c) {
            $campStmt->execute($c);
        }

        // 3. Seed 8 Donors from Assignment 1
        $donorsData = [
            ['DON-001', 'Ahmed Khan',   'ahmed.khan@email.com',   '0300-1234567', 'O+'],
            ['DON-002', 'Fatima Zahra', 'fatima.zahra@email.com', '0321-2345678', 'A+'],
            ['DON-003', 'Bilal Tariq',  'bilal.tariq@email.com',  '0333-3456789', 'B+'],
            ['DON-004', 'Ayesha Malik', 'ayesha.malik@email.com', '0345-4567890', 'AB+'],
            ['DON-005', 'Usman Ali',    'usman.ali@email.com',    '0312-5678901', 'O-'],
            ['DON-006', 'Zainab Raza',  'zainab.raza@email.com',  '0301-6789012', 'A-'],
            ['DON-007', 'Hamza Iqbal',  'hamza.iqbal@email.com',  '0334-7890123', 'B-'],
            ['DON-008', 'Sana Nawaz',   'sana.nawaz@email.com',   '0315-8901234', 'AB-'],
        ];

        $donorStmt = $pdo->prepare(
            'INSERT INTO donors (id, name, email, phone, blood_group) VALUES (?, ?, ?, ?, ?)'
        );
        foreach ($donorsData as $d) {
            $donorStmt->execute($d);
        }

        // 4. Seed 25 Registrations from Assignment 1
        $regsData = [
            ['REG-001', 'CAM-001', 'DON-001', '2026-10-10', 'Confirmed'],
            ['REG-002', 'CAM-001', 'DON-002', '2026-10-11', 'Confirmed'],
            ['REG-003', 'CAM-001', 'DON-003', '2026-10-12', 'Confirmed'],
            ['REG-004', 'CAM-001', 'DON-004', '2026-10-13', 'Confirmed'],
            ['REG-005', 'CAM-001', 'DON-005', '2026-10-14', 'Confirmed'],
            ['REG-006', 'CAM-002', 'DON-001', '2026-10-15', 'Confirmed'],
            ['REG-007', 'CAM-002', 'DON-002', '2026-10-15', 'Confirmed'],
            ['REG-008', 'CAM-002', 'DON-003', '2026-10-16', 'Confirmed'],
            ['REG-009', 'CAM-002', 'DON-005', '2026-10-17', 'Confirmed'],
            ['REG-010', 'CAM-003', 'DON-002', '2026-10-18', 'Confirmed'],
            ['REG-011', 'CAM-003', 'DON-006', '2026-10-19', 'Confirmed'],
            ['REG-012', 'CAM-003', 'DON-007', '2026-10-20', 'Confirmed'],
            ['REG-013', 'CAM-003', 'DON-001', '2026-10-21', 'Confirmed'],
            ['REG-014', 'CAM-004', 'DON-005', '2026-10-22', 'Confirmed'],
            ['REG-015', 'CAM-004', 'DON-004', '2026-10-23', 'Confirmed'],
            ['REG-016', 'CAM-005', 'DON-004', '2026-10-01', 'Confirmed'],
            ['REG-017', 'CAM-005', 'DON-008', '2026-10-02', 'Confirmed'],
            ['REG-018', 'CAM-005', 'DON-001', '2026-10-03', 'Confirmed'],
            ['REG-019', 'CAM-005', 'DON-005', '2026-10-04', 'Confirmed'],
            ['REG-020', 'CAM-006', 'DON-003', '2026-10-24', 'Confirmed'],
            ['REG-021', 'CAM-006', 'DON-007', '2026-10-25', 'Confirmed'],
            ['REG-022', 'CAM-006', 'DON-001', '2026-10-26', 'Confirmed'],
            ['REG-023', 'CAM-008', 'DON-002', '2026-10-05', 'Confirmed'],
            ['REG-024', 'CAM-008', 'DON-006', '2026-10-06', 'Confirmed'],
            ['REG-025', 'CAM-008', 'DON-005', '2026-10-07', 'Confirmed'],
        ];

        $regStmt = $pdo->prepare(
            'INSERT INTO registrations (id, campaign_id, donor_id, registered_at, status) VALUES (?, ?, ?, ?, ?)'
        );
        foreach ($regsData as $r) {
            $regStmt->execute($r);
        }

        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}

// Allow CLI execution: php db/seed.php [--reset]
if (PHP_SAPI === 'cli' && realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    require_once __DIR__ . '/../includes/db.php';
    $reset = in_array('--reset', $argv ?? [], true);
    $pdo = getDb();
    if ($reset) {
        seedDatabase($pdo, true);
        echo "Database reset and re-seeded successfully.\n";
    } else {
        echo "Database initialized and seeded.\n";
    }
}
