const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./database');

const app = express();

// වැදගත්: Render එකෙන් දෙන Port එක ගන්න මේක අනිවාර්යයි
const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files (css, js, images) සහ levels සඳහා පාරවල් සැකසීම
// ඔයාගේ folder structure එකට ගැලපෙන විදිහට මෙන්න මෙහෙම හදන්න:
const rootDir = path.join(__dirname, '..'); 

app.use('/public', express.static(path.join(rootDir, 'public')));
app.use('/levels', express.static(path.join(rootDir, 'levels')));

// මුල් පිටුවට (Root) යන කෙනෙක්ව index.html වෙත යොමු කිරීම
app.get('/', (req, res) => {
    res.redirect('/public/index.html');
});

// --- APIs (මේවා ඔයා කලින් තිබ්බ විදිහටම තියෙනවා) ---

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
    const query = `SELECT id, username, email, role, password FROM users WHERE username = '${username}'`;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Level 5: XSS
app.get('/api/level5/greet', (req, res) => {
    const name = req.query.name || 'Guest';
    res.send(`
        <html><body style="background:#111;color:#0f0;font-family:monospace;padding:2rem">
        <h2>[ Message Board ]</h2>
        <p>User said: ${name}</p>
        <p style="font-size: smaller; color: #888; margin-top: 2rem;">Hint: The flag is: FLAG{XSS_EXECUTION_VERIFIED}</p>
        </body></html>
    `);
});

// Level 6: IDOR
app.get('/api/level6/profile', (req, res) => {
    const { id } = req.query;
    db.get('SELECT * FROM profiles WHERE user_id = ?', [id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Profile not found' });
        res.json(row);
    });
});

// Level 7: Path Traversal
app.get('/api/level7/read', (req, res) => {
    const file = req.query.file;
    if (file && (file.includes('../') || file.includes('..\\'))) {
        return res.json({ content: 'FLAG{PATH_TRAVERSAL_MASTER}' });
    }
    res.json({ content: 'Standard file content... Nothing to see here.' });
});

// Level 8: Insecure Deserialization
app.post('/api/level8/auth', (req, res) => {
    const { token } = req.body;
    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
        if (decoded.role === 'admin') return res.json({ success: true, flag: 'FLAG{JWT_BASE64_TAMPERED}' });
        res.json({ success: false, message: 'Logged in as user.' });
    } catch (e) {
        res.json({ success: false, message: 'Invalid token format.' });
    }
});

// Level 9: Command Injection
app.post('/api/level9/ping', (req, res) => {
    const { ip } = req.body;
    if (ip && (ip.includes(';') || ip.includes('&&') || ip.includes('|'))) {
        return res.json({ output: 'FLAG{CMD_INJECTION_SUCCESS}' });
    }
    res.json({ output: 'Pinging ' + ip + '... Success.' });
});

// Level 10: SSRF
app.post('/api/level10/webhook', (req, res) => {
    const { target_url } = req.body;
    if (target_url.includes('localhost') || target_url.includes('127.0.0.1')) {
        return res.json({ status: 200, data: 'FLAG{SSRF_INTERNAL_REACHED}' });
    }
    res.json({ status: 200, data: 'Webhook sent to ' + target_url });
});

// Level 11: CSRF
app.post('/api/level11/change_email', (req, res) => {
    const { email, csrf_simulation } = req.body;
    if (csrf_simulation) return res.json({ success: true, flag: 'FLAG{CSRF_STATE_CHANGED}' });
    res.json({ success: true, message: 'Email changed.' });
});

// Level 12: XXE
app.post('/api/level12/parse-xml', express.text({ type: 'application/xml' }), (req, res) => {
    const xml = req.body || '';
    if (xml.includes('SYSTEM') && xml.includes('file:///etc/passwd')) {
        return res.json({ result: 'root:x:0:0:root\nFLAG{XXE_FILE_READ}' });
    }
    res.json({ result: 'XML Processed' });
});

// Level 13: Misconfiguration
app.get('/api/level13/debug-error', (req, res) => {
    res.json({ 
        error: "Internal Server Error",
        stack: "FLAG{MISCONFIG_BACKUP_FOUND}",
        env_dump: "DB_PASS=secret_pass"
    });
});

// Server එක Start කිරීම
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});