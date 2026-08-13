/* ============================================================
   STÅLBÆKGÅRD — SHARED SITE JS
   Mobile nav toggle + hero carousel. No dependencies.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ----------------------------------------------------------
       LANGUAGE SWITCHING — DA/EN/DE, shared across every page.
       translations.js (loaded before this file) defines the
       `translations` object: { da: {s1:...}, en: {...}, de: {...} }
    ---------------------------------------------------------- */
    function applyLanguage(lang) {
        if (typeof translations === 'undefined') return;
        var dict = translations[lang] || translations.da;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) el.textContent = dict[key];
        });
        document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
        });
        document.documentElement.setAttribute('lang', lang);
        try { localStorage.setItem('staalbaek-lang', lang); } catch (e) {}
    }

    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
        btn.addEventListener('click', function () { applyLanguage(btn.getAttribute('data-lang-btn')); });
    });

    var savedLang = 'da';
    try { savedLang = localStorage.getItem('staalbaek-lang') || 'da'; } catch (e) {}
    applyLanguage(savedLang);

    var mobileToggle = document.getElementById('mobileToggle');
    var primaryNav = document.getElementById('primaryNav');
    if (mobileToggle && primaryNav) {
        mobileToggle.addEventListener('click', function () {
            var open = primaryNav.style.display === 'flex';
            primaryNav.style.display = open ? 'none' : 'flex';
            primaryNav.style.flexDirection = 'column';
            primaryNav.style.position = 'absolute';
            primaryNav.style.top = '100%';
            primaryNav.style.left = '0';
            primaryNav.style.right = '0';
            primaryNav.style.background = 'var(--paper)';
            primaryNav.style.borderTop = '1px solid var(--line)';
            primaryNav.style.padding = '10px 20px 16px';
            mobileToggle.setAttribute('aria-expanded', String(!open));
        });
    }

    var root = document.getElementById('heroCarousel');
    if (root) {
        var slides = root.querySelectorAll('.carousel-slide');
        var dots = root.querySelectorAll('.carousel-dot');
        var current = 0;
        var timer = null;
        var AUTO_MS = 2000;

        function show(i) {
            current = (i + slides.length) % slides.length;
            slides.forEach(function (s, idx) { s.classList.toggle('active', idx === current); });
            dots.forEach(function (d, idx) { d.classList.toggle('active', idx === current); });
        }
        function next() { show(current + 1); }
        function start() { stop(); timer = setInterval(next, AUTO_MS); }
        function stop() { if (timer) clearInterval(timer); }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(parseInt(dot.getAttribute('data-slide'), 10));
                start();
            });
        });
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        root.addEventListener('focusin', stop);
        root.addEventListener('focusout', start);

        start();
    }

});
