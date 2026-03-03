document.addEventListener("DOMContentLoaded", () => {
    updateDashboard();
    initHintPanels();
    initLevelProgressBar();

    // Glitch Effect logic
    const glitchElement = document.querySelector('.glitch');
    if (glitchElement) {
        setInterval(() => {
            glitchElement.style.textShadow = Math.random() > 0.8 ? '0 0 15px #ff003c' : '0 0 10px #00ff41';
        }, 2000);
    }

    // Reset Progress
    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (confirm("WARNING: ALL SYSTEM CACHE WILL BE WIPED. PROCEED?")) {
                localStorage.clear();
                window.location.reload();
            }
        });
    }

    // Flag Submission Application
    const flagForm = document.getElementById("flag-form");
    if (flagForm) {
        flagForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const flagInput = document.getElementById("flag-input").value;
            const currentLevel = flagForm.dataset.level;
            checkFlag(currentLevel, flagInput);
        });
    }
});

function updateDashboard() {
    let totalScore = 0;
    const levelNodes = document.querySelectorAll(".level-node");

    levelNodes.forEach(node => {
        const level = node.dataset.level;
        if (localStorage.getItem(`level${level}_completed`) === "true") {
            node.classList.add("completed");

            const statusIndicator = node.querySelector(".status-indicator");
            if (statusIndicator) {
                statusIndicator.textContent = "EXPLOITED";
                statusIndicator.style.color = "#fff";
                statusIndicator.style.animation = "none";
            }

            const reward = node.querySelector(".reward");
            if (reward) reward.style.color = "#00ff41";

            totalScore += 100;
        }
    });

    const scoreDisplay = document.getElementById("total-score");
    if (scoreDisplay) {
        // Animate counter
        let currentIter = 0;
        const interval = setInterval(() => {
            currentIter += Math.ceil(totalScore / 10) || 1;
            if (currentIter >= totalScore) {
                currentIter = totalScore;
                clearInterval(interval);
            }
            scoreDisplay.textContent = currentIter;
        }, 30);
    }
}

// Security note: Obviously storing flags client-side is bad, but for a local CTF it works for verifying completion.
const sysFlags = {
    1: "FLAG{INFO_EXPOSED_892}",
    2: "FLAG{CLIENT_SIDE_BYPASS_WIN}",
    3: "FLAG{COOKIE_TAMPERING_SUCCESS}",
    4: "FLAG{SQLI_MASTER_PW_HACKED}",
    5: "FLAG{XSS_EXECUTION_VERIFIED}",
    6: "FLAG{IDOR_ACCESS_GRANTED}",
    7: "FLAG{PATH_TRAVERSAL_MASTER}",
    8: "FLAG{JWT_BASE64_TAMPERED}",
    9: "FLAG{CMD_INJECTION_SUCCESS}",
    10: "FLAG{SSRF_INTERNAL_REACHED}",
    11: "FLAG{CSRF_STATE_CHANGED}",
    12: "FLAG{XXE_FILE_READ}",
    13: "FLAG{MISCONFIG_BACKUP_FOUND}"
};

window.checkFlag = function (level, submittedFlag) {
    if (submittedFlag.trim() === sysFlags[level]) {
        showToast("ACCESS GRANTED: Flag Accepted. +100 EXP", "success");
        localStorage.setItem(`level${level}_completed`, "true");
        setTimeout(() => {
            // Works whether we're on a level page or the index
            const isOnLevelPage = window.location.pathname.includes('/levels/');
            if (isOnLevelPage) {
                const nextLevel = parseInt(level) + 1;
                if (nextLevel <= 13) {
                    window.location.href = `level${nextLevel}.html`;
                } else {
                    window.location.href = '../public/index.html';
                }
            } else {
                window.location.reload();
            }
        }, 2000);
    } else {
        showToast("ACCESS DENIED: Invalid System Flag.", "error");
        document.getElementById("flag-input").value = "";
    }
};

window.showToast = function (message, type = "default") {
    let container = document.getElementById("toast-container");
    if (!container) {
        // In case missing on level pages
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="icon" style="font-size: 1.2rem; margin-right: 0.5rem; font-family: monospace;">[${type === 'error' ? '!' : '*'}]</span> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "slideIn 0.3s ease reverse forwards";
        setTimeout(() => toast.remove(), 300);
    }, 4500);
};

// --- Matrix Binary Rain Effect ---
function initMatrixRain() {
    const canvas = document.createElement("canvas");
    canvas.id = "matrix-rain-canvas";
    document.body.appendChild(canvas);

    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "-2"; // Behind matrix-bg and scanlines, but above base bg
    canvas.style.opacity = "0.15"; // Subtle effect so it's not too distracting

    const ctx = canvas.getContext("2d");

    let width, height, columns, drops;
    const fontSize = 14;
    // Classic matrix chars + some binary
    const chars = "10101010110001THEMATRIXHASYOUSYSTEMFAILUREERROR40401010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()".split("");

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = width / fontSize;
        drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
    }
    window.addEventListener("resize", resize);
    resize();

    let lastDrawTime = 0;
    const fps = 30;
    const drawInterval = 1000 / fps;

    function draw(time) {
        requestAnimationFrame(draw);

        if (time - lastDrawTime < drawInterval) return;
        lastDrawTime = time;

        // Semi-transparent black background to create trail effect
        // Using var(--bg-base) approximate hex #050505
        ctx.fillStyle = "rgba(5, 5, 5, 0.1)";
        ctx.fillRect(0, 0, width, height);

        // Green text color
        ctx.fillStyle = "#00ff41";
        ctx.font = fontSize + "px 'Share Tech Mono', monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            ctx.fillText(text, x, y);

            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }
    requestAnimationFrame(draw);
}

document.addEventListener("DOMContentLoaded", initMatrixRain);

// --- Hint Panel Toggle ---
function initHintPanels() {
    document.querySelectorAll('.hint-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const body = btn.nextElementSibling;
            if (!body) return;
            btn.classList.toggle('open');
            body.classList.toggle('open');
        });
    });
}

// --- Level Progress Bar ---
function initLevelProgressBar() {
    const fill = document.getElementById('level-progress-fill');
    if (!fill) return;
    const totalLevels = 13;
    let completed = 0;
    for (let i = 1; i <= totalLevels; i++) {
        if (localStorage.getItem(`level${i}_completed`) === 'true') completed++;
    }
    const pct = (completed / totalLevels) * 100;
    fill.style.width = pct + '%';
    const label = document.getElementById('level-progress-label');
    if (label) label.textContent = `${completed} / ${totalLevels} LEVELS COMPROMISED`;
}
