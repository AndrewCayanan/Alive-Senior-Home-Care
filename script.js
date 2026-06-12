
/* =============================================
   ALIVE SENIOR HOME CARE — Enhanced Script
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────
    // 1. SCROLL PROGRESS BAR
    // ─────────────────────────────────────────
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = pct + '%';
        }, { passive: true });
    }

    // ─────────────────────────────────────────
    // 2. NAVBAR — scroll shadow + transparency
    // ─────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // ─────────────────────────────────────────
    // 3. HAMBURGER MOBILE MENU
    // ─────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
            }
        });
    }

    // ─────────────────────────────────────────
    // 4. SCROLL REVEAL ANIMATION (IntersectionObserver)
    // ─────────────────────────────────────────
    const revealEls = document.querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right, .reveal-card'
    );

    if (revealEls.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    }

    // ─────────────────────────────────────────
    // 5. ANIMATED COUNTER (Hero stats)
    // ─────────────────────────────────────────
    const counters = document.querySelectorAll('.stat-number[data-target]');

    if (counters.length > 0) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10);
                    const duration = 1800;
                    const start = performance.now();

                    const tick = (now) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target);
                        if (progress < 1) requestAnimationFrame(tick);
                        else el.textContent = target;
                    };

                    requestAnimationFrame(tick);
                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => countObserver.observe(c));
    }

    // ─────────────────────────────────────────
    // 6. TESTIMONIALS CAROUSEL
    // ─────────────────────────────────────────
    const track = document.getElementById('testimonialsTrack');
    const dotsContainer = document.getElementById('testimonialDots');

    if (track && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        let current = 0;
        let autoplay;

        const getVisible = () =>
            window.innerWidth >= 900 ? 3 :
            window.innerWidth >= 600 ? 2 : 1;

        const buildDots = () => {
            dotsContainer.innerHTML = '';
            const visible = getVisible();
            const totalSlides = Math.max(1, cards.length - visible + 1);

            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = 't-dot' + (i === current ? ' active' : '');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            }
        };

        const goTo = (idx) => {
            const visible = getVisible();
            const max = Math.max(0, cards.length - visible);
            current = Math.max(0, Math.min(idx, max));

            const cardWidth = track.querySelector('.testimonial-card').offsetWidth + 24;
            track.style.transform = `translateX(-${current * cardWidth}px)`;

            dotsContainer.querySelectorAll('.t-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        };

        const nextSlide = () => {
            const visible = getVisible();
            const max = Math.max(0, cards.length - visible);
            goTo(current >= max ? 0 : current + 1);
        };

        const startAutoplay = () => {
            stopAutoplay();
            autoplay = setInterval(nextSlide, 4500);
        };

        const stopAutoplay = () => clearInterval(autoplay);

        track.addEventListener('mouseenter', stopAutoplay);
        track.addEventListener('mouseleave', startAutoplay);

        let touchStartX = 0;
        track.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : goTo(current - 1);
        }, { passive: true });

        buildDots();
        startAutoplay();

        window.addEventListener('resize', () => {
            buildDots();
            goTo(current);
        });
    }

    // ─────────────────────────────────────────
    // 7. FAQ ACCORDION
    // ─────────────────────────────────────────
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (btn) {
            btn.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                faqItems.forEach(f => f.classList.remove('open'));
                if (!isOpen) item.classList.add('open');
            });
        }
    });

    // ─────────────────────────────────────────
    // 8. CONTACT FORM VALIDATION & EMAILJS SUBMISSION
    // ─────────────────────────────────────────
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {

        const fields = {
            firstName: { el: document.getElementById('firstName'), err: document.getElementById('firstNameError'), msg: 'Please enter your first name.' },
            lastName:  { el: document.getElementById('lastName'), err: document.getElementById('lastNameError'), msg: 'Please enter your last name.' },
            email:     { el: document.getElementById('email'), err: document.getElementById('emailError'), msg: 'Please enter a valid email address.' },
            phone:     { el: document.getElementById('phone'), err: document.getElementById('phoneError'), msg: 'Please enter a phone number.' },
        };

        const validate = () => {
            let valid = true;

            Object.values(fields).forEach(f => {
                f.el.classList.remove('error');
                f.err.textContent = '';
            });

            if (!fields.firstName.el.value.trim()) {
                fields.firstName.el.classList.add('error');
                fields.firstName.err.textContent = fields.firstName.msg;
                valid = false;
            }

            if (!fields.lastName.el.value.trim()) {
                fields.lastName.el.classList.add('error');
                fields.lastName.err.textContent = fields.lastName.msg;
                valid = false;
            }

            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(fields.email.el.value.trim())) {
                fields.email.el.classList.add('error');
                fields.email.err.textContent = fields.email.msg;
                valid = false;
            }

            if (!fields.phone.el.value.trim()) {
                fields.phone.el.classList.add('error');
                fields.phone.err.textContent = fields.phone.msg;
                valid = false;
            }

            return valid;
        };

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validate()) return;

            const btn = document.getElementById('submitBtn');
            const loader = document.getElementById('btnLoader');
            const btnText = btn.querySelector('.btn-text');
            const successEl = document.getElementById('formSuccess');
            const now = new Date();
            const formattedTime = now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

            btn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (loader) loader.style.display = 'inline';

            try {
                await emailjs.send(
                    "service_eku5bnc",
                    "template_efnyzx9",
                    {
                        first_name: fields.firstName.el.value,
                        last_name: fields.lastName.el.value,
                        email: fields.email.el.value,
                        phone: fields.phone.el.value,
                        service: document.getElementById('service').value,
                        message: document.getElementById('message').value,
                        time: formattedTime,
                    }
                );

                await emailjs.send(
                    "service_eku5bnc",
                    "template_07n89ru",
                    {
                        first_name: fields.firstName.el.value,
                        last_name: fields.lastName.el.value,
                        email: fields.email.el.value,
                        phone: fields.phone.el.value,
                        service: document.getElementById('service').value,
                        message: document.getElementById('message').value,
                        time: formattedTime,
                    }
                );

                contactForm.reset();
                successEl.style.display = 'block';
                successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            } catch (error) {
                console.error("EmailJS Error:", error);
                alert("Failed to send message. Please try again.");
            }

            btn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (loader) loader.style.display = 'none';
        });

        Object.values(fields).forEach(f => {
            f.el.addEventListener('input', () => {
                f.el.classList.remove('error');
                f.err.textContent = '';
            });
        });
    }

    // ─────────────────────────────────────────
    // 9. SMOOTH SCROLL FOR ANCHOR LINKS
    // ─────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ─────────────────────────────────────────
    // 10. SERVICE CARD TILT ON MOUSE MOVE
    // ─────────────────────────────────────────
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotX = (-y / rect.height) * 6;
            const rotY = (x / rect.width) * 6;
            card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ─────────────────────────────────────────
    // 11. GOOGLE MAP INITIALIZATION
    // ─────────────────────────────────────────
    window.initMap = function () {
        const mapEl = document.getElementById('map');
        if (!mapEl || typeof google === 'undefined') return;

        const center = { lat: 33.4484, lng: -112.0742 };

        const map = new google.maps.Map(mapEl, {
            zoom: 11,
            center,
            styles: [],
        });

        const marker = new google.maps.Marker({
            position: center,
            map,
            title: 'Alive Senior Home Care',
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<div>Alive Senior Home Care</div>`
        });

        marker.addListener('click', () => infoWindow.open(map, marker));
    };

    // ─────────────────────────────────────────
    // 13. PAGE TRANSITION FADE-IN
    // ─────────────────────────────────────────
    document.body.style.opacity = '1';

});