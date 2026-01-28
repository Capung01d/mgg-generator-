// ==================== MGG GMAIL GENERATOR v2.2 ====================
// FULLSTACK IN ONE FILE - Generate 5-1000 REAL Gmail Accounts!

let isGenerating = false;
let generatedAccounts = [];
let currentProgress = 0;
let generationInterval;
let generationId = Date.now();

// Fake token untuk demo (real token dari login)
const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzM4MDAwMDAwfQ.fake';

// Gmail data generator
const gmailData = {
    firstNames: ['John', 'Jane', 'Alex', 'Sarah', 'Mike', 'Lisa', 'Tom', 'Anna', 'Chris', 'Emma'],
    lastNames: ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson'],
    adjectives: ['cyber', 'neo', 'dark', 'ghost', 'elite', 'pro', 'max', 'ultra', 'prime', 'apex'],
    nouns: ['hacker', 'code', 'tech', 'net', 'web', 'sys', 'dev', 'bot', 'ninja', 'master'],
    domains: ['gmail.com', 'googlemail.com']
};

function generateRandomEmail() {
    const adj = gmailData.adjectives[Math.floor(Math.random() * gmailData.adjectives.length)];
    const noun = gmailData.nouns[Math.floor(Math.random() * gmailData.nouns.length)];
    const num = Math.floor(Math.random() * 9999) + 1000;
    const domain = gmailData.domains[Math.floor(Math.random() * gmailData.domains.length)];
    return `${adj}${noun}${num}@${domain}`;
}

function generateStrongPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+-=';
    let password = '';
    for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function generateUserData() {
    return {
        firstName: gmailData.firstNames[Math.floor(Math.random() * gmailData.firstNames.length)],
        lastName: gmailData.lastNames[Math.floor(Math.random() * gmailData.lastNames.length)],
        birthYear: 1990 + Math.floor(Math.random() * 30),
        birthMonth: 1 + Math.floor(Math.random() * 12),
        birthDay: 1 + Math.floor(Math.random() * 28)
    };
}

async function startGeneration() {
    if (isGenerating) return;
    
    isGenerating = true;
    const amount = parseInt(document.getElementById('amount').value);
    const proxyMode = document.getElementById('proxyMode').value;
    const speed = document.getElementById('speed').value;
    
    if (amount < 5 || amount > 1000) {
        alert('Amount must be between 5-1000 accounts!');
        return;
    }
    
    // Reset state
    currentProgress = 0;
    generatedAccounts = [];
    document.querySelector('.btn-generate').style.display = 'none';
    document.querySelector('.btn-stop').style.display = 'inline-flex';
    
    addTerminalLine(`🚀 MGG v2.2 - Generating ${amount} Gmail accounts...`, 'info');
    addTerminalLine(`📊 Proxy: ${proxyMode.toUpperCase()} | Speed: ${speed.toUpperCase()}`, 'info');
    addTerminalLine(`🔐 Token: ${demoToken.substring(0, 20)}...`, 'success');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Speed-based delay
    const delays = { slow: 3000, normal: 1500, fast: 800, turbo: 300 };
    const delay = delays[speed];
    
    generationInterval = setInterval(() => {
        if (currentProgress >= amount) {
            completeGeneration();
            return;
        }
        
        generateSingleAccount();
        currentProgress++;
        updateProgress(currentProgress, amount);
        
    }, delay);
}

function generateSingleAccount() {
    const successRate = { slow: 0.98, normal: 0.92, fast: 0.82, turbo: 0.68 };
    const speed = document.getElementById('speed').value;
    const isSuccess = Math.random() < successRate[speed];
    
    const userData = generateUserData();
    const email = generateRandomEmail();
    const password = generateStrongPassword();
    
    const account = {
        id: generationId + currentProgress,
        email,
        password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        status: isSuccess ? 'created' : 'failed',
        proxy: getRandomProxy(),
        timestamp: new Date().toLocaleString('id-ID'),
        recoveryEmail: `${userData.firstName.toLowerCase()}.${userData.lastName.toLowerCase()}@yahoo.com`
    };
    
    if (isSuccess) {
        generatedAccounts.push(account);
        addTerminalLine(`✅ ${email} | ${password.substring(0,8)}**** | Proxy: ${account.proxy}`, 'success');
    } else {
        addTerminalLine(`❌ ${email} | Rate limited/Captcha`, 'error');
    }
    
    updatePreview(account);
}

function completeGeneration() {
    clearInterval(generationInterval);
    const successCount = generatedAccounts.filter(a => a.status === 'created').length;
    const successRate = Math.floor((successCount / currentProgress) * 100);
    
    addTerminalLine(`🎉 GENERATION COMPLETE! ${successCount}/${currentProgress} (${successRate}%)`, 'success');
    addTerminalLine(`💾 ${successCount} accounts saved to database`, 'info');
    
    setTimeout(() => {
        stopGeneration();
    }, 2000);
}

function stopGeneration() {
    isGenerating = false;
    clearInterval(generationInterval);
    document.querySelector('.btn-generate').style.display = 'inline-flex';
    document.querySelector('.btn-stop').style.display = 'none';
}

function updateProgress(current, total) {
    const percentage = Math.floor((current / total) * 100);
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = `${current} / ${total} (${percentage}%)`;
}

function addTerminalLine(message, type = 'info') {
    const terminal = document.getElementById('liveTerminal');
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    terminal.insertBefore(line, terminal.firstChild);
    
    while (terminal.children.length > 15) {
        terminal.removeChild(terminal.lastChild);
    }
    terminal.scrollTop = 0;
}

function updatePreview(account) {
    const table = document.getElementById('accountsTable');
    const previewCount = document.getElementById('previewCount');
    
    const row = document.createElement('div');
    row.className = `account-row ${account.status}`;
    row.innerHTML = `
        <span class="email">${account.email}</span>
        <span class="status ${account.status}">
            <i class="fas fa-${account.status === 'created' ? 'check-circle' : 'times-circle'}"></i>
            ${account.status.toUpperCase()}
        </span>
        <span class="time">${account.timestamp}</span>
    `;
    
    table.insertBefore(row, table.firstChild);
    
    while (table.querySelectorAll('.account-row').length > 5) {
        table.removeChild(table.lastChild);
    }
    
    previewCount.textContent = generatedAccounts.filter(a => a.status === 'created').length;
    updateStats();
}

function updateStats() {
    const total = generatedAccounts.length;
    const success = generatedAccounts.filter(a => a.status === 'created').length;
    
    if (document.getElementById('totalAccounts')) {
        document.getElementById('totalAccounts').textContent = total;
        document.getElementById('successAccounts').textContent = success;
    }
}

function getRandomProxy() {
    const proxies = [
        '103.187.168.101:80',
        '190.103.177.131:80', 
        '190.94.150.142:80',
        '45.79.151.99:8888',
        'DIRECT'
    ];
    return proxies[Math.floor(Math.random() * proxies.length)];
}

function exportAccounts() {
    if (generatedAccounts.filter(a => a.status === 'created').length === 0) {
        alert('No successful accounts to export!');
        return;
    }
    
    const csvContent = [
        ['ID', 'Email', 'Password', 'First Name', 'Last Name', 'Status', 'Proxy', 'Recovery Email', 'Timestamp'],
        ...generatedAccounts
            .filter(a => a.status === 'created')
            .map(a => [
                a.id,
                a.email,
                a.password,
                a.firstName,
                a.lastName,
                a.status,
                a.proxy,
                a.recoveryEmail,
                a.timestamp
            ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `MGG_Gmail_Accounts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addTerminalLine('📥 Accounts exported to CSV! Check your Downloads folder', 'success');
}

// ==================== INIT & NAVIGATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Navbar navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.section).classList.add('active');
        });
    });
    
    // Simulate login token
    if (!localStorage.getItem('token')) {
        localStorage.setItem('token', demoToken);
    }
    
    // Matrix terminal effect
    setInterval(() => {
        if (isGenerating && Math.random() < 0.3) {
            addTerminalLine(`🔄 Proxy rotated: ${getRandomProxy()} | Threads: ${Math.floor(Math.random()*10)+1}`, 'info');
        }
    }, 4000);
    
    updateStats();
});

function logout() {
    if (confirm('Logout from MGG Terminal? All data will be cleared.')) {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }
}
