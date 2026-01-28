const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs-extra');

const GmailGenerator = require('./gmail-generator');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const JWT_SECRET = 'mgg-ethical-hacking-2026-supersecret';
const USERS_FILE = path.join(__dirname, 'users.json');
const ACCOUNTS_FILE = path.join(__dirname, 'accounts.json');

// Load/Save users
async function loadUsers() {
    return await fs.readJson(USERS_FILE).catch(() => []);
}

async function saveUsers(users) {
    await fs.writeJson(USERS_FILE, users);
}

// Load accounts
async function loadAccounts() {
    return await fs.readJson(ACCOUNTS_FILE).catch(() => []);
}

async function saveAccount(account) {
    const accounts = await loadAccounts();
    accounts.unshift(account);
    await fs.writeJson(ACCOUNTS_FILE, accounts.slice(0, 10000)); // Max 10k
}

// Default admin user
(async () => {
    let users = await loadUsers();
    if (users.length === 0) {
        const hashed = await bcrypt.hash('admin123', 10);
        users = [{ username: 'admin', password: hashed }];
        await saveUsers(users);
        console.log('Admin created: admin/admin123');
    }
})();

// Routes
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await loadUsers();
        const user = users.find(u => u.username === username);
        
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/generate', authenticateToken, async (req, res) => {
    try {
        const { amount, proxyMode } = req.body;
        if (amount < 5 || amount > 1000) {
            return res.status(400).json({ error: 'Amount must be 5-1000' });
        }

        res.json({ status: 'starting', message: `Generating ${amount} accounts...` });
        
        const generator = new GmailGenerator(proxyMode);
        const results = await generator.generateAccounts(amount);
        
        res.json({ 
            status: 'completed', 
            accounts: results.success, 
            failed: results.failed.length,
            successRate: Math.floor((results.success.length / amount) * 100)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/accounts', authenticateToken, async (req, res) => {
    const accounts = await loadAccounts();
    res.json(accounts.slice(0, 100));
});

app.post('/api/export', authenticateToken, async (req, res) => {
    const accounts = await loadAccounts();
    const csv = [
        ['Email', 'Password', 'Status', 'Timestamp'],
        ...accounts.map(a => [a.email, a.password, a.status, a.timestamp])
    ].map(row => row.join(',')).join('\n');
    
    res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="mgg_accounts.csv"'
    });
    res.send(csv);
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access denied' });
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 MGG Gmail Generator running on http://localhost:${PORT}`);
});
