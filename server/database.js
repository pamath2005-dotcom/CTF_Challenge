const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Setup vulnerable tables for the project
        db.serialize(() => {
            // Level 4: SQLi users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT,
                email TEXT,
                role TEXT,
                password TEXT
            )`);

            // Insert mock data if empty for users
            db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
                if (row && row.count === 0) {
                    db.run(`INSERT INTO users (username, email, role, password) VALUES 
                        ('admin', 'admin@brokenlock.com', 'admin', 'FLAG{SQLI_MASTER_PW_HACKED}'),
                        ('john_doe', 'john@example.com', 'user', 'password123'),
                        ('jane_smith', 'jane@example.com', 'user', 'qwerty')
                    `);
                }
            });

            // Level 6: IDOR user profiles table
            db.run(`CREATE TABLE IF NOT EXISTS profiles (
                user_id INTEGER PRIMARY KEY,
                name TEXT,
                bio TEXT,
                private_flag TEXT
            )`);

            // Insert mock data if empty for profiles
            db.get("SELECT COUNT(*) AS count FROM profiles", (err, row) => {
                if (row && row.count === 0) {
                    db.run(`INSERT INTO profiles (user_id, name, bio, private_flag) VALUES 
                        (1, 'Hacker Joe', 'I love breaking things.', 'Keep looking.'),
                        (2, 'Admin Alice', 'System Administrator', 'FLAG{IDOR_ACCESS_GRANTED}')
                    `);
                }
            });

            // Potential future tables can be added here
        });
    }
});

module.exports = db;
