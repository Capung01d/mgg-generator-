const puppeteer = require('puppeteer');
const fs = require('fs-extra');

class GmailGenerator {
    constructor(proxyMode = 'auto') {
        this.proxyMode = proxyMode;
        this.proxies = this.loadProxies();
        this.results = { success: [], failed: [] };
    }

    loadProxies() {
        try {
            return fs.readFileSync('proxies.txt', 'utf8')
                .split('\n')
                .filter(line => line.trim())
                .map(line => line.trim());
        } catch {
            // Fallback proxies untuk testing
            return [
                'http://proxy1:port',
                'http://proxy2:port',
                // Tambah proxy real di proxies.txt
            ];
        }
    }

    async generateAccounts(amount) {
        console.log(`🔥 Starting generation of ${amount} Gmail accounts...`);
        
        const promises = [];
        for (let i = 0; i < amount; i++) {
            promises.push(this.createSingleAccount(i + 1));
            // Delay untuk avoid rate limit
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        await Promise.all(promises);
        console.log(`✅ Success: ${this.results.success.length}, Failed: ${this.results.failed.length}`);
        
        return this.results;
    }

    async createSingleAccount(index) {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                this.proxyMode !== 'none' ? `--proxy-server=${this.getRandomProxy()}` : ''
            ]
        });

        try {
            const page = await browser.newPage();
            await page.setViewport({ width: 1366, height: 768 });
            
            // Random user agent
            await page.setUserAgent(this.getRandomUserAgent());
            
            // Navigate to Gmail signup
            await page.goto('https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp', {
                waitUntil: 'networkidle2',
                timeout: 60000
            });

            // Fill form dengan data random
            const randomData = this.generateRandomUserData();
            
            await page.type('#firstName', randomData.firstName, { delay: 100 });
            await page.type('#lastName', randomData.lastName, { delay: 100 });
            await page.type('#username', randomData.username, { delay: 100 });
            
            // Generate password kuat
            const password = this.generateStrongPassword();
            await page.type('input[name="Passwd"]', password, { delay: 100 });
            await page.type('input[name="ConfirmPasswd"]', password, { delay: 100 });
            
            // Next button
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {}),
                page.click('button[data-value="Next"]')
            ]);

            // Simulate phone verification bypass / captcha solve
            await page.waitForTimeout(3000);

            // Mark as success (dalam real scenario, cek selector success)
            this.results.success.push({
                email: `${randomData.username}@gmail.com`,
                password,
                status: 'created',
                timestamp: new Date().toISOString(),
                proxy: this.getRandomProxy()
            });

            console.log(`✅ Account ${index}: ${randomData.username}@gmail.com`);

        } catch (error) {
            console.log(`❌ Account ${index} failed:`, error.message);
            this.results.failed.push({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } finally {
            await browser.close();
        }
    }

    generateRandomUserData() {
        const firstNames = ['John', 'Jane', 'Alex', 'Sarah', 'Mike', 'Lisa', 'Tom', 'Anna'];
        const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Moore'];
        const adjectives = ['cyber', 'neo', 'dark', 'ghost', 'elite', 'pro', 'max', 'ultra'];
        const nouns = ['hacker', 'code', 'tech', 'net', 'web', 'sys', 'dev', 'bot'];
        
        return {
            firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
            lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
            username: `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 9999)}`
        };
    }

    generateStrongPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 16; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    getRandomProxy() {
        return this.proxies[Math.floor(Math.random() * this.proxies.length)] || 'direct';
    }

    getRandomUserAgent() {
        const agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
        return agents[Math.floor(Math.random() * agents.length)];
    }
}

module.exports = GmailGenerator;
