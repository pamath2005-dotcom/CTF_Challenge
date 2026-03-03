const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static assets from public and levels matching real file system paths
const rootDir = path.join(__dirname, '..');
app.use('/public', express.static(path.join(rootDir, 'public')));
app.use('/levels', express.static(path.join(rootDir, 'levels')));

// Redirect root to public/index.html
app.get('/', (req, res) => {
    res.redirect('/public/index.html');
});

// Initialize SQLite Database is now handled in database.js

// APIs

// Level 1: Info Exposure
app.get('/api/level1/config', (req, res) => {
    res.json({
        db_host: 'localhost',
        db_user: 'root',
        db_pass: 'toor',
        admin_token: 'FLAG{INFO_EXPOSED_892}'
    });
});

// Level 2: Client-side bypass
app.post('/api/level2/purchase', (req, res) => {
    const { price, item } = req.body;
    // Vulnerability: trusting the client price 
    if (price <= 0) {
        return res.json({ success: true, message: `Purchased ${item}! FLAG{CLIENT_SIDE_BYPASS_WIN}` });
    }
    res.json({ success: false, message: `Insufficient funds. Cost is $${price}.` });
});

// Level 3: Cookie Manipulation
app.get('/api/level3/admin', (req, res) => {
    const role = req.cookies['role'];
    if (role === 'admin') {
        res.json({ success: true, flag: 'FLAG{COOKIE_TAMPERING_SUCCESS}' });
    } else {
        res.json({ success: false, message: 'Access Denied. You are not an admin.' });
    }
});

app.get('/api/level3/set_cookie', (req, res) => {
    res.cookie('role', 'user');
    res.send('Cookie set to user');
});

// Level 4: SQL Injection
app.post('/api/level4/search', (req, res) => {
    const { username } = req.body;
    // INSECURE QUERY - concatenates variable directly into string
    const query = `SELECT id, username, email, role, password FROM users WHERE username = '${username}'`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Level 5: XSS (Simulated server reflection)
app.get('/api/level5/greet', (req, res) => {
    const name = req.query.name || 'Guest';
    // Vulnerability: reflecting input directly without sanitization
    res.send(`
        <html><body style="background:#111;color:#0f0;font-family:monospace;padding:2rem">
        <h2>[ Message Board ]</h2>
        <p>User said: ${name}</p>
        <p style="font-size: smaller; color: #888; margin-top: 2rem;">Hint: If you can pop an alert() or access document.cookie, you've successfully injected a script. The flag is: FLAG{XSS_EXECUTION_VERIFIED}</p>
        </body></html>
    `);
});

// Level 6: IDOR
app.get('/api/level6/profile', (req, res) => {
    const { id } = req.query;
    // Vulnerability: No authorization check to ensure the user requesting profile 2 is actually user 2
    db.get('SELECT * FROM profiles WHERE user_id = ?', [id], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(row);
    });
});

// Level 7: Path Traversal (Simulated)
app.get('/api/level7/read', (req, res) => {
    const file = req.query.file;
    if (file && (file.includes('../') || file.includes('..\\'))) {
        return res.json({ content: 'FLAG{PATH_TRAVERSAL_MASTER}' });
    }
    res.json({ content: 'Standard file content... Nothing to see here.' });
});

// Level 8: Insecure Deserialization / JWT Bypass
app.post('/api/level8/auth', (req, res) => {
    const { token } = req.body;
    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
        if (decoded.role === 'admin') {
            return res.json({ success: true, message: 'FLAG{JWT_BASE64_TAMPERED}' });
        }
        res.json({ success: false, message: 'Logged in as user.' });
    } catch (e) {
        res.json({ success: false, message: 'Invalid token format.' });
    }
});

// Level 9: Command Injection
app.post('/api/level9/ping', (req, res) => {
    const { ip } = req.body;
    // Simulated command injection
    if (ip && (ip.includes(';') || ip.includes('&&') || ip.includes('|'))) {
        if (ip.includes('cat ') || ip.includes('ls ') || ip.includes('dir') || ip.includes('echo')) {
            return res.json({ output: 'Pinging ' + ip + '\n... \nFLAG{CMD_INJECTION_SUCCESS}' });
        }
    }
    res.json({ output: 'Pinging ' + ip + '... \nReply from ' + ip + ': bytes=32 time=10ms' });
});

// Level 10: SSRF Simulated
app.post('/api/level10/webhook', (req, res) => {
    const { target_url } = req.body;
    if (target_url === 'http://127.0.0.1/admin-api' || target_url === 'http://localhost/admin-api') {
        return res.json({ status: 200, data: 'FLAG{SSRF_INTERNAL_REACHED}' });
    }
    res.json({ status: 200, data: 'Webhook sent successfully to ' + target_url });
});

// Level 11: CSRF Simulated
app.post('/api/level11/change_email', (req, res) => {
    const { email, csrf_simulation } = req.body;
    if (csrf_simulation) {
        return res.json({ success: true, message: 'Email changed to ' + email + '!\nFLAG{CSRF_STATE_CHANGED}' });
    }
    res.json({ success: true, message: 'Email changed to ' + email + ' successfully.' });
});

// Level 12: XXE Simulated
app.post('/api/level12/parse-xml', express.text({ type: 'application/xml' }), (req, res) => {
    const xml = req.body || '';
    if (xml.includes('<!ENTITY') && xml.includes('SYSTEM') && xml.match(/&(.*?);/)) {
        if (xml.includes('file:///etc/passwd')) {
            const passwdMock = "root:x:0:0:root:/root:/bin/bash\nbin:x:1:1:bin:/bin:/sbin/nologin\nFLAG{XXE_FILE_READ}";
            return res.json({ result: 'Order processed for item: \n' + passwdMock });
        }
        return res.json({ result: 'Order processed for item: [Resolved External Entity]' });
    }
    const match = xml.match(/<item>(.*?)<\/item>/);
    const item = match ? match[1] : 'Unknown';
    res.json({ result: 'Order processed for item: ' + item });
});

// Level 13: Security Misconfiguration Simulated
app.get('/api/level13/debug-error', (req, res) => {
    const mockStackTrace = `Error: Cannot read properties of undefined (reading 'db')
    at App.query (/var/www/html/server/db.js:42:15)
    at Object.getUser (/var/www/html/server/routes.js:18:22)
    at Layer.handle [as handle_request] (/var/www/html/node_modules/express/lib/router/layer.js:95:5)
    at next (/var/www/html/node_modules/express/lib/router/route.js:144:13)
    ---
    Environment Variables Dump:
    USER=admin
    AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
    DB_PASSWORD=secret_db_pass
    FLAG{MISCONFIG_BACKUP_FOUND}
    `;
    res.json({ stackTrace: mockStackTrace });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Broken Lock CTF Server running on http://localhost:${PORT}`);
});
