// Global state
let isGenerating = false;
let generatedAccounts = [];
let currentProgress = 0;
let generationInterval;

// Fake accounts data untuk demo
const fakeEmails = [
    'pentest', 'hacker', 'elite', 'ghost', 'shadow', 'matrix', 'cyber', 'neon', 
    'dark', 'void', 'echo', 'nova', 'flux', 'zero', 'one', 'code', 'script'
];

function generateRandomEmail() {
    const randomString = Math.random().toString(36).substring(2, 15);
    const prefix = fakeEmails[Math.floor(Math.random() * fakeEmails.length)];
    return `${prefix}_${randomString}${Math.floor(Math.random() * 1000)}@gmail.com`;
}

function startGeneration() {
    if (isGenerating) return;
    
    isGenerating = true;
    const amount = parseInt(document.getElementById('amount').value);
    currentProgress = 0;
    
    // Update UI
    document.querySelector('.btn-generate').style.display = 'none';
    document.querySelector('.btn-stop').style.display = 'inline-flex';
    
    // Start progress simulation
    generationInterval = setInterval(() => {
        if (currentProgress >= amount) {
            stopGeneration();
            return;
        }
        
        currentProgress++;
        updateProgress(currentProgress, amount);
        generateAccount();
    }, 100); // Speed berdasarkan setting
}

function stopGeneration() {
    isGenerating = false;
    clearInterval(generationInterval);
    
    document.querySelector('.btn-generate').style.display = 'inline-flex';
    document.querySelector('.btn-stop').style.display = 'none';
    
    addTerminalLine('Generation stopped by user.', 'warning');
}

function generateAccount() {
    const email = generateRandomEmail();
    const status = Math.random() > 0.1 ? 'success' : 'failed'; // 90% success rate
    const account = {
        email,
        status,
        timestamp: new Date().toLocaleString()
    };
    
    generatedAccounts.unshift(account);
    addTerminalLine(`[+] ${email} - ${status.toUpperCase()}`, status);
    updatePreview(account);
    updateStats();
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
    line.textContent = message;
    terminal.insertBefore(line, terminal.firstChild);
    
    // Keep only last 10 lines
    while (terminal.children.length > 10) {
        terminal.removeChild(terminal.lastChild);
    }
    
    // Auto scroll
    terminal.scrollTop = 0;
}

function updatePreview(account) {
    const table = document.getElementById('accountsTable');
    const previewCount = document.getElementById('previewCount');
    
    // Create account row
    const row = document.createElement('div');
    row.className = `account-row ${account.status}`;
    row.innerHTML = `
        <span class="email">${account.email}</span>
        <span class="status ${account.status}">
            <i class="fas fa-${account.status === 'success' ? 'check-circle' : 'times-circle'}"></i>
            ${account.status.toUpperCase()}
        </span>
        <span class="time">${account.timestamp}</span>
    `;
    
    table.appendChild(row);
    
    // Keep only 5 latest
    while (table.querySelectorAll('.account-row').length > 5) {
        table.removeChild(table.lastChild);
    }
    
    previewCount.textContent = generatedAccounts.length;
}

function updateStats() {
    const total = generatedAccounts.length;
    const success = generatedAccounts.filter(a => a.status === 'success').length;
    const successRate = total > 0 ? Math.floor((success / total) * 100) : 0;
    
    document.getElementById('totalAccounts').textContent = total;
    document.getElementById('successAccounts').textContent = success;
}

function exportAccounts() {
    if (generatedAccounts.length === 0) {
        alert('No accounts to export!');
        return;
    }
    
    const csv = [
        ['Email', 'Status', 'Timestamp'],
        ...generatedAccounts.map(a => [a.email, a.status, a.timestamp])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mgg_accounts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    addTerminalLine('Accounts exported to CSV ✓', 'success');
}

function logout() {
    if (confirm('Logout from MGG Terminal?')) {
        window.location.href = 'index.html';
    }
}

// Sidebar Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));
            
            // Add active class
            this.classList.add('active');
            const targetSection = document.getElementById(this.dataset.section);
            targetSection.classList.add('active');
        });
    });
    
    // Initial stats
    updateStats();
});

// Simulate real-time activity
setInterval(() => {
    if (isGenerating) {
        addTerminalLine(`Proxy rotated: ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`, 'info');
    }
}, 5000);
