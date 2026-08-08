/* =========================================================
   Muhammad Kashif — Portfolio
   script.js — icon-driven panels + animation layer
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------
       1. PRELOADER
    --------------------------------------------------- */
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.add('loaded');
            startTypewriter();
        }, 900);
    });

    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            startTypewriter();
        }
    }, 3500);


    /* ---------------------------------------------------
       2. SCROLL PROGRESS BAR
    --------------------------------------------------- */
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = percent + '%';
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });


    /* ---------------------------------------------------
       3. NAV TOGGLE (mobile)
    --------------------------------------------------- */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
        navToggle.classList.toggle('active');
    });


    /* ---------------------------------------------------
       4. TYPEWRITER — hero name + eyebrow
    --------------------------------------------------- */
    function typeText(el, text, speed, onDone) {
        let i = 0;
        el.textContent = '';
        (function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (onDone) {
                onDone();
            }
        })();
    }

    function startTypewriter() {
        const eyebrowEl = document.getElementById('typedEyebrow');
        const nameEl = document.getElementById('typedName');
        if (!eyebrowEl || !nameEl) return;

        typeText(eyebrowEl, 'whoami', 70, () => {
            setTimeout(() => {
                typeText(nameEl, 'Muhammad Kashif', 60);
            }, 200);
        });
    }


    /* ---------------------------------------------------
       5. PARTICLE / KEYPOINT NETWORK CANVAS (hero bg)
    --------------------------------------------------- */
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const heroSection = document.getElementById('hero');
        let particles = [];
        let width, height;
        const accent = 'rgba(52, 214, 196, 0.55)';
        const line = 'rgba(52, 214, 196, 0.12)';

        function resizeCanvas() {
            width = canvas.width = heroSection.offsetWidth;
            height = canvas.height = heroSection.offsetHeight;
        }

        function createParticles() {
            const count = Math.floor((width * height) / 22000);
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.6 + 1
            }));
        }

        function step() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = accent;
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i], b = particles[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = line;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(step);
        }

        resizeCanvas();
        createParticles();
        requestAnimationFrame(step);

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
    }


    /* ---------------------------------------------------
       6. DETECTION PANEL (hero) — animated confidence counters
    --------------------------------------------------- */
    const detectPanel = document.querySelector('.detect-panel');
    if (detectPanel) {
        const confEls = detectPanel.querySelectorAll('.conf');

        const detectObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    confEls.forEach((el, i) => {
                        const target = parseFloat(el.textContent);
                        let current = 0;
                        const steps = 40;
                        const increment = target / steps;

                        setTimeout(() => {
                            const counter = setInterval(() => {
                                current += increment;
                                if (current >= target) {
                                    current = target;
                                    clearInterval(counter);
                                }
                                el.textContent = current.toFixed(2);
                            }, 20);
                        }, i * 120);
                    });
                    detectObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        detectObserver.observe(detectPanel);
    }


    /* ---------------------------------------------------
       7. PANEL SYSTEM — click a nav icon, only that
          section shows, its content animates in
    --------------------------------------------------- */
    const navButtons = document.querySelectorAll('.nav-icon-btn');
    const panels = document.querySelectorAll('.panel');
    const heroSectionEl = document.getElementById('hero');
    const panelStage = document.getElementById('panelStage');

    function playPanelItems(panel) {
        const items = panel.querySelectorAll('.panel-item');
        items.forEach((item, i) => {
            item.classList.remove('show');
            item.style.transitionDelay = (i * 90) + 'ms';
        });
        // Force reflow so the transition replays every time the panel opens
        void panel.offsetWidth;
        items.forEach(item => item.classList.add('show'));

        // Skill level bars fill only once their panel is open
        const bars = panel.querySelectorAll('.level-bar');
        bars.forEach(bar => {
            const level = bar.getAttribute('data-level') || 80;
            const span = bar.querySelector('span');
            span.style.width = '0%';
            requestAnimationFrame(() => {
                setTimeout(() => { span.style.width = level + '%'; }, 250);
            });
        });
    }

    function resetPanelItems(panel) {
        panel.querySelectorAll('.panel-item').forEach(item => item.classList.remove('show'));
        panel.querySelectorAll('.level-bar span').forEach(span => { span.style.width = '0%'; });
    }

    function openPanel(id) {
        const target = document.getElementById(id);
        if (!target || !target.classList.contains('panel')) return;

        panels.forEach(p => {
            if (p !== target) {
                p.classList.remove('active');
                resetPanelItems(p);
            }
        });

        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === id);
        });

        target.classList.add('active');
        playPanelItems(target);

        setTimeout(() => {
            panelStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
    }

    function closeAllPanels() {
        panels.forEach(p => {
            p.classList.remove('active');
            resetPanelItems(p);
        });
        navButtons.forEach(btn => btn.classList.remove('active'));
        heroSectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.target;
            const isActive = btn.classList.contains('active');
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');

            if (isActive) {
                closeAllPanels();
            } else {
                openPanel(id);
            }
        });
    });

    // "Contact Me" button in hero also opens a panel
    document.querySelectorAll('[data-target]:not(.nav-icon-btn)').forEach(el => {
        el.addEventListener('click', () => openPanel(el.dataset.target));
    });

    // Close (×) button inside each panel
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', closeAllPanels);
    });

    // Logo click always returns home
    document.getElementById('logoHome').addEventListener('click', (e) => {
        e.preventDefault();
        closeAllPanels();
    });

    // Esc key closes the open panel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllPanels();
    });


    /* ---------------------------------------------------
       8. 3D TILT — project cards follow the cursor
    --------------------------------------------------- */
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            card.style.transition = 'transform .1s ease-out';

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform =
                `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });


    /* ---------------------------------------------------
       9. SKILL CARD FLIP — tap support for touch devices
    --------------------------------------------------- */
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('click', () => {
            if (window.matchMedia('(hover: none)').matches) {
                card.querySelector('.skill-inner').classList.toggle('flipped');
            }
        });
    });


    /* ---------------------------------------------------
       10. MAGNETIC BUTTONS
    --------------------------------------------------- */
    document.querySelectorAll('.btn, .btn2').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });


    /* ---------------------------------------------------
       11. BACK TO TOP
    --------------------------------------------------- */
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});