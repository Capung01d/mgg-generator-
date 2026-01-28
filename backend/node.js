const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const users = []; // Simulasi database
const JWT_SECRET = 'mgg-super-secret-key-2026';

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Simulasi auth
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({ token, message: 'Access granted' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Generate Gmail endpoint
app.post('/api/generate-gmail', authenticateToken, (req, res) => {
    // Logic generate Gmail (pentesting simulation)
    const accounts = [];
    for (let i = 0; i < 10; i++) {
        accounts.push({
            email: `pentest_${Date.now()}_${i}@gmail.com`,
            status: 'created',
            timestamp: new Date().toISOString()
        });
    }
    res.json({ accounts });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(3000, () => {
    console.log('MGG Backend running on port 3000');
});
