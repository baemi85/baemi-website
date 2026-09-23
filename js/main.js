/* ============================================================
   (주)배관의미래 — main.js
   1) 모바일 메뉴  2) 헤더 스크롤  3) 등장 애니메이션
   4) 숫자 카운트업  5) 맨 위로  6) 연도 자동
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 모바일 메뉴 ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', '메뉴 열기');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });

    // 메뉴 링크 클릭 시 닫기
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    // 바깥 클릭 / ESC
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !burger.contains(e.target)) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    // 데스크톱으로 넓어지면 상태 초기화
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeNav();
    });
  }

  /* ---------- 2. 헤더 스크롤 ---------- */
  var header = document.getElementById('header');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (toTop) toTop.classList.toggle('is-on', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. 등장 애니메이션 ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });

    // 품목 그리드는 순차 등장 (목록별로 따로 계산)
    document.querySelectorAll('.items').forEach(function (list) {
      var per = list.classList.contains('items--pro') ? 3 : 4;
      list.querySelectorAll('.item').forEach(function (el, i) {
        el.style.transitionDelay = (i % per) * 0.06 + 's';
      });
    });
  }

  /* ---------- 4. 숫자 카운트업 ---------- */
  var nums = document.querySelectorAll('.stat__num');

  function fmt(n) {
    return n.toLocaleString('ko-KR');            // 20000 → 20,000
  }

  function runCount(el) {
    var out = el.querySelector('.stat__val') || el;
    var target = parseInt((el.getAttribute('data-count') || '0').replace(/[^0-9]/g, ''), 10) || 0;
    var dur = 1200;
    var start = null;

    if (reduceMotion || target === 0) {
      out.textContent = fmt(target);
      return;
    }

    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);        // easeOutCubic
      out.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (nums.length) {
    if (!('IntersectionObserver' in window)) {
      nums.forEach(runCount);
    } else {
      var numIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCount(entry.target);
          numIO.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      nums.forEach(function (el) { numIO.observe(el); });
    }
  }

  /* ---------- 5. 연도 ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
