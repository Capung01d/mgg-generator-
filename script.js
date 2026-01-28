// Matrix rain effect
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px monospace`;
        
        drops.forEach((y, i) => {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, y * fontSize);
            
            if (y * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        });
    }
    
    setInterval(draw, 50);
}

// Glitch effect on scroll
function initGlitchEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const glitchElements = document.querySelectorAll('.glitch');
        glitchElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateX(${Math.sin(scrolled * speed) * 2}px)`;
        });
    });
}

// Typing animation
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing');
    if (typingElement) {
        const text = 'Ready to generate: ∞ accounts';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                typingElement.textContent = text.slice(0, i + 1);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        typeWriter();
    }
}

// Navbar scroll effect
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 20, 0, 0.98)';
        } else {
            navbar.style.background = 'rgba(0, 20, 0, 0.95)';
        }
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    createMatrixRain();
    initGlitchEffect();
    initTypingAnimation();
    initNavbarScroll();
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Responsive canvas
window.addEventListener('resize', () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
