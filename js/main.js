'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');


/* ---------- Menü: háttér görgetéskor ---------- */

function initStickyMenu() {
    const menu = document.querySelector('.menu');
    if (!menu) return;

    const update = () => {
        menu.classList.toggle('sticky-active', window.scrollY > 50);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
}


/* ---------- Hamburger menü (mobil) ---------- */

function initHamburger() {
    const button = document.getElementById('hamb');
    const list = document.getElementById('hamb-list');
    if (!button || !list) return;

    function setOpen(open) {
        list.classList.toggle('hamb-on', open);
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
    }

    button.addEventListener('click', () => {
        setOpen(!list.classList.contains('hamb-on'));
    });

    list.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && list.classList.contains('hamb-on')) {
            setOpen(false);
            button.focus();
        }
    });
}


/* ---------- Térkép: a helyszín gombok data-map attribútumából ---------- */

function initMaps() {
    const frame = document.getElementById('map');
    const buttons = document.querySelectorAll('.map-btn');
    if (!frame || buttons.length === 0) return;

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            frame.src = button.dataset.map;

            buttons.forEach((other) => {
                const active = other === button;
                other.classList.toggle('btn-active', active);
                other.setAttribute('aria-pressed', String(active));
            });
        });
    });
}


/* ---------- Csomagok slider ---------- */

function initPackageSlider() {
    const slider = document.querySelector('.csomag-slide-cont');
    const prev = document.getElementById('prev-btn');
    const next = document.getElementById('next-btn');
    if (!slider || !prev || !next) return;

    const slides = [...slider.querySelectorAll('.csomag-slide-item')];
    if (slides.length === 0) return;

    let current = 0;
    const wrap = (index) => (index + slides.length) % slides.length;

    function render() {
        const left = wrap(current - 1);
        const right = wrap(current + 1);

        slides.forEach((slide, index) => {
            slide.classList.remove('slide-active', 'slide-left', 'slide-right', 'slide-hide');

            let visible = true;
            if (index === current) {
                slide.classList.add('slide-active');
            } else if (index === right) {
                slide.classList.add('slide-right');
            } else if (index === left) {
                slide.classList.add('slide-left');
            } else {
                slide.classList.add('slide-hide');
                visible = false;
            }

            slide.setAttribute('aria-hidden', String(!visible));
        });
    }

    function go(step) {
        current = wrap(current + step);
        render();
    }

    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));

    // oldalsó kártyára kattintva az lép középre
    slider.addEventListener('click', (event) => {
        const slide = event.target.closest('.csomag-slide-item');
        if (!slide) return;
        if (slide.classList.contains('slide-right')) go(1);
        if (slide.classList.contains('slide-left')) go(-1);
    });

    // billentyűzet: nyilak
    slider.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            go(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            go(1);
        }
    });

    // érintés: elhúzás (swipe)
    let startX = null;
    let startY = null;

    slider.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    }, { passive: true });

    slider.addEventListener('touchend', (event) => {
        if (startX === null) return;

        const dx = event.changedTouches[0].clientX - startX;
        const dy = event.changedTouches[0].clientY - startY;
        startX = null;
        startY = null;

        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            go(dx < 0 ? 1 : -1);
        }
    }, { passive: true });

    render();
}


/* ---------- Rólam: fülek és jelző ---------- */

function initAboutTabs() {
    const tabs = [...document.querySelectorAll('.rolam-cimek button')];
    const sections = [...document.querySelectorAll('.observe-section')];
    const text = document.querySelector('.rolam-text');
    const indicator = document.querySelector('.indicator');

    if (!text || !indicator || tabs.length === 0 || tabs.length !== sections.length) return;

    function setActive(index) {
        indicator.style.top = `${tabs[index].offsetTop}px`;
        tabs.forEach((tab, i) => {
            if (i === index) {
                tab.setAttribute('aria-current', 'true');
            } else {
                tab.removeAttribute('aria-current');
            }
        });
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            const top =
                sections[index].getBoundingClientRect().top -
                text.getBoundingClientRect().top +
                text.scrollTop;

            text.scrollTo({
                top,
                behavior: reduceMotion.matches ? 'auto' : 'smooth'
            });
        });
    });

    text.addEventListener('scroll', () => {
        const scrollPos = text.scrollTop;
        let activeIndex = 0;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - text.offsetTop;
            if (scrollPos >= sectionTop - 50) {
                activeIndex = index;
            }
        });

        const maxScroll = text.scrollHeight - text.clientHeight;
        if (scrollPos >= maxScroll - 10) {
            activeIndex = sections.length - 1;
        }

        setActive(activeIndex);
    }, { passive: true });

    setActive(0);
}


/* ---------- Kapcsolatfelvételi űrlap (Formspree) ---------- */

function initContactForm() {
    const form = document.getElementById('my-form');
    const statusBox = document.getElementById('my-form-status');
    if (!form || !statusBox) return;

    form.addEventListener('submit', async (event) => {
        // megakadályozza a böngésző újratöltését
        event.preventDefault();

        const data = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        button.textContent = 'Küldés folyamatban...';
        button.disabled = true;
        statusBox.textContent = '';
        statusBox.className = '';

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                statusBox.textContent = 'Köszönöm! Az üzenetet sikeresen megkaptam.';
                statusBox.className = 'status-success';
                form.reset();
            } else {
                statusBox.textContent = 'Hoppá! Valamiért nem sikerült elküldeni.';
                statusBox.className = 'status-error';
            }
        } catch (error) {
            statusBox.textContent = 'Ellenőrizd az internetkapcsolatod!';
            statusBox.className = 'status-error';
        }

        button.textContent = originalText;
        button.disabled = false;
    });
}


/* ---------- Indítás ---------- */

initStickyMenu();
initHamburger();
initMaps();
initPackageSlider();
initAboutTabs();
initContactForm();

/* js vége - bővítést csak az "Indítás" rész fölé, új függvényként */
