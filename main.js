// CareerAI - Main JavaScript Utilities

// =====================================================
// API CONFIGURATION
// =====================================================

const API_BASE = window.location.origin;

const API = {
    predict:  `${API_BASE}/api/predict`,
    stats:    `${API_BASE}/api/stats`,
    health:   `${API_BASE}/api/health`
};

// =====================================================
// LOADING OVERLAY
// =====================================================

function showLoader(title = 'Processing...', sub = 'Please wait') {
    const overlay = document.getElementById('overlay');
    if (!overlay) return;
    document.getElementById('overlay-title').textContent = title;
    document.getElementById('overlay-sub').textContent   = sub;
    overlay.classList.add('active');
}

function hideLoader() {
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('active');
}

// =====================================================
// RANGE SLIDER - LIVE COLOR UPDATE
// =====================================================

function initSliders() {
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        updateSliderTrack(slider);
        slider.addEventListener('input', () => {
            updateSliderTrack(slider);
            const display = document.getElementById('val-' + slider.id);
            if (display) display.textContent = slider.value;
            updateProgress();
        });
    });
}

function updateSliderTrack(slider) {
    const min = parseInt(slider.min) || 1;
    const max = parseInt(slider.max) || 10;
    const val = parseInt(slider.value);
    const pct = ((val - min) / (max - min)) * 100;

    let color;
    if (val >= 7)      color = '#00e676';
    else if (val >= 4) color = '#00d4ff';
    else               color = '#ff6b35';

    slider.style.background = `linear-gradient(90deg, ${color} ${pct}%, rgba(0,212,255,0.1) ${pct}%)`;
}

// =====================================================
// PROGRESS TRACKER (predict page)
// =====================================================

function updateProgress() {
    const sliders   = document.querySelectorAll('input[type="range"]');
    const progBar   = document.getElementById('progress-fill');
    const progLabel = document.getElementById('progress-label');
    if (!progBar || !sliders.length) return;

    let movedCount = 0;
    sliders.forEach(s => { if (parseInt(s.value) !== 5) movedCount++; });

    const pct = Math.min(Math.round((movedCount / sliders.length) * 100), 100);
    progBar.style.width       = pct + '%';
    if (progLabel) progLabel.textContent = `${movedCount} / ${sliders.length} skills rated`;
}

// =====================================================
// FORM VALIDATION
// =====================================================

function validatePredictForm() {
    const name = document.getElementById('name');
    if (!name || !name.value.trim()) {
        showAlert('Please enter your name to continue.', 'warning');
        name && name.focus();
        return false;
    }
    return true;
}

// =====================================================
// ALERT / TOAST
// =====================================================

function showAlert(message, type = 'info') {
    const existing = document.getElementById('toast-msg');
    if (existing) existing.remove();

    const colors = {
        info:    { bg: 'rgba(0,212,255,0.1)',   border: 'rgba(0,212,255,0.3)',   text: '#00d4ff' },
        success: { bg: 'rgba(0,230,118,0.1)',   border: 'rgba(0,230,118,0.3)',   text: '#00e676' },
        warning: { bg: 'rgba(255,193,7,0.1)',   border: 'rgba(255,193,7,0.3)',   text: '#ffc107' },
        error:   { bg: 'rgba(255,68,68,0.1)',   border: 'rgba(255,68,68,0.3)',   text: '#ff4444' }
    };

    const c     = colors[type] || colors.info;
    const toast = document.createElement('div');
    toast.id    = 'toast-msg';

    Object.assign(toast.style, {
        position:     'fixed',
        bottom:       '28px',
        right:        '28px',
        zIndex:       '99999',
        background:   c.bg,
        border:       `1px solid ${c.border}`,
        color:        c.text,
        padding:      '14px 22px',
        borderRadius: '12px',
        fontFamily:   "'DM Sans', sans-serif",
        fontSize:     '14px',
        fontWeight:   '600',
        maxWidth:     '340px',
        boxShadow:    '0 8px 32px rgba(0,0,0,0.4)',
        animation:    'fadeUp 0.4s ease'
    });

    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3500);
}

// =====================================================
// PREDICTION API CALL
// =====================================================

async function submitPrediction(payload) {
    try {
        const response = await fetch(API.predict, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        if (data.success) return { ok: true, data };
        return { ok: false, error: data.error || 'Prediction failed.' };

    } catch (err) {
        // Offline/demo fallback
        const result = buildOfflineResult(payload);
        return { ok: true, data: result, offline: true };
    }
}

// Offline demo mode when Flask is not running
function buildOfflineResult(payload) {
    const toInt = k => parseInt(payload[k]) || 5;

    const scores = {
        'AI/ML Engineer':       (toInt('interest_in_data') + toInt('math_ability') + toInt('analytical_thinking')) / 3,
        'Software Developer':   (toInt('interest_in_coding') + toInt('logical_thinking') + toInt('problem_solving')) / 3,
        'Cloud Engineer':       (toInt('interest_in_cloud') + toInt('technical_skills')) / 2,
        'Data Scientist':       (toInt('interest_in_data') + toInt('math_ability')) / 2,
        'DevOps Engineer':      (toInt('interest_in_cloud') + toInt('technical_skills') + toInt('interest_in_testing')) / 3,
        'QA/Testing Engineer':  (toInt('interest_in_testing') + toInt('attention_to_detail')) / 2,
        'Full Stack Developer': (toInt('interest_in_coding') + toInt('interest_in_design')) / 2,
        'UI/UX Designer':       (toInt('interest_in_design') + toInt('creativity')) / 2,
        'IT Project Manager':   (toInt('leadership') + toInt('communication')) / 2,
        'Business Analyst':     (toInt('analytical_thinking') + toInt('communication')) / 2
    };

    const sorted  = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topName = sorted[0][0];
    const topConf = Math.min(72 + sorted[0][1] * 2, 94).toFixed(1);

    const top3 = sorted.slice(0, 3).map(([career, score], i) => ({
        career,
        confidence: parseFloat((parseFloat(topConf) - i * 9).toFixed(1))
    }));

    const careerInfo = {
        'AI/ML Engineer':       { icon: 'robot',     salary: '8-25 LPA',  growth: 'Very High', description: 'Design and build AI/ML systems and intelligent applications.', skills: ['Python','TensorFlow','PyTorch','Statistics','SQL'], courses: ['Deep Learning Specialization - Coursera','Fast.ai','Google ML Crash Course'], companies: ['Google','Microsoft','Amazon','Flipkart','Swiggy'] },
        'Software Developer':   { icon: 'laptop',    salary: '5-20 LPA',  growth: 'High',      description: 'Build scalable software applications and backend systems.',     skills: ['Java','Python','DSA','System Design','Git'],    courses: ['CS50 Harvard','The Odin Project','LeetCode DSA'],                         companies: ['TCS','Infosys','Wipro','Accenture'] },
        'Cloud Engineer':       { icon: 'cloud',     salary: '7-22 LPA',  growth: 'Very High', description: 'Design and manage cloud infrastructure on AWS/Azure/GCP.',     skills: ['AWS','Terraform','Kubernetes','Docker','Linux'], courses: ['AWS Solutions Architect','AZ-900','GCP Associate'],                       companies: ['Amazon','Microsoft','Google','IBM'] },
        'Data Scientist':       { icon: 'chart',     salary: '7-20 LPA',  growth: 'Very High', description: 'Extract insights from complex data using statistics and ML.',   skills: ['Python','SQL','Statistics','ML','Tableau'],     courses: ['IBM Data Science Certificate','Kaggle Courses'],                          companies: ['Fractal Analytics','Mu Sigma','Razorpay'] },
        'DevOps Engineer':      { icon: 'gear',      salary: '6-22 LPA',  growth: 'Very High', description: 'Bridge development and operations with CI/CD automation.',      skills: ['Jenkins','Docker','Kubernetes','CI/CD','Shell'], courses: ['Docker & Kubernetes Complete Guide','GitLab CI/CD'],                      companies: ['Ola','PhonePe','CRED','BrowserStack'] },
        'QA/Testing Engineer':  { icon: 'search',    salary: '4-15 LPA',  growth: 'Medium',    description: 'Ensure software quality through manual and automation testing.', skills: ['Selenium','JIRA','TestNG','Postman','SQL'],     courses: ['ISTQB Certification','Selenium WebDriver'],                               companies: ['Cognizant','Capgemini','HCL','Mphasis'] },
        'Full Stack Developer': { icon: 'globe',     salary: '5-18 LPA',  growth: 'High',      description: 'Build complete web apps from frontend to backend.',             skills: ['React','Node.js','MongoDB','SQL','REST APIs'],  courses: ['MERN Stack - Udemy','FreeCodeCamp'],                                      companies: ['Startups','Persistent','Zensar','Remote'] },
        'UI/UX Designer':       { icon: 'palette',   salary: '4-18 LPA',  growth: 'High',      description: 'Design user interfaces and digital experiences.',               skills: ['Figma','Adobe XD','User Research','CSS'],       courses: ['Google UX Design Certificate','Figma Masterclass'],                       companies: ['Zomato','Swiggy','Freshworks','Startups'] },
        'IT Project Manager':   { icon: 'clipboard', salary: '10-30 LPA', growth: 'High',      description: 'Lead IT projects and manage cross-functional development teams.',skills: ['PMP','Agile','Scrum','Risk Management'],        courses: ['PMP Certification','Scrum Master CSM'],                                  companies: ['Accenture','IBM','Deloitte','Wipro'] },
        'Business Analyst':     { icon: 'trend',     salary: '5-16 LPA',  growth: 'Medium',    description: 'Analyze business processes and translate to technical needs.',   skills: ['SQL','Excel','Tableau','BPMN','Communication'], courses: ['Business Analysis Fundamentals','CBAP Certification'],                    companies: ['EY','KPMG','Deloitte','TCS'] }
    };

    return {
        success: true,
        name: payload.name || 'User',
        predicted_career: topName,
        confidence: parseFloat(topConf),
        top3_careers: top3,
        career_info: careerInfo[topName] || careerInfo['Software Developer']
    };
}

// =====================================================
// ANIMATE ELEMENTS ON SCROLL
// =====================================================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity  = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        observer.observe(el);
    });
}

// =====================================================
// NUMBER COUNTER ANIMATION
// =====================================================

function animateCounter(el, target, duration = 1200) {
    const start     = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = Math.round(start + (target - start) * eased);
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// =====================================================
// LOCAL STORAGE HELPERS
// =====================================================

const Store = {
    save:   (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} },
    load:   (key)      => { try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; } },
    remove: (key)      => { try { localStorage.removeItem(key); } catch(e) {} }
};

// =====================================================
// INIT ON DOM READY
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    if (document.querySelector('input[type="range"]')) {
        initSliders();
        updateProgress();
    }
    // Highlight active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });
});