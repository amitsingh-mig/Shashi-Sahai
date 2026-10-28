/**
 * Shashi Sahai — Cinematic Preloader
 * Displays once per visitor using persistent localStorage.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'shashi_sahai_loader_seen';

  // Check if visitor has already seen the loader
  function hasSeenLoader() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  // Permanently mark loader as seen
  function markLoaderSeen() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      // Graceful degradation if storage is blocked
    }
  }

  // Fast-path: subsequent visits skip loader completely
  if (hasSeenLoader()) {
    document.documentElement.classList.add('no-preloader');
    var existing = document.getElementById('sitePreloader');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
    return;
  }

  // First visit: set flag IMMEDIATELY to prevent loader on refresh or navigation
  markLoaderSeen();

  // Check reduced motion preference
  var prefersReducedMotion = false;
  try {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function createPreloaderMarkup() {
    var el = document.getElementById('sitePreloader');
    if (!el) {
      el = document.createElement('div');
      el.id = 'sitePreloader';
      el.className = 'site-preloader';
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML =
        '<div class="preloader-backdrop"></div>' +
        '<div class="preloader-container">' +
          '<div class="preloader-brand">' +
            '<img src="images/log.png" alt="Shashi Sahai" class="preloader-logo">' +
          '</div>' +
          '<div class="preloader-dates">1961 — 2026</div>' +
          '<div class="preloader-progress" role="progressbar" aria-label="Loading exhibition">' +
            '<div class="preloader-progress-bar" id="preloaderProgressBar"></div>' +
          '</div>' +
          '<div class="preloader-status">Entering Exhibition</div>' +
        '</div>';
      if (document.body) {
        document.body.insertBefore(el, document.body.firstChild);
      }
    }
    return el;
  }

  function runPreloader() {
    var preloader = createPreloaderMarkup();
    if (!preloader) return;

    if (prefersReducedMotion) {
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
      return;
    }

    document.body.classList.add('preloader-locked');
    var progressBar = document.getElementById('preloaderProgressBar');

    // Smooth progress fill
    setTimeout(function () {
      if (progressBar) {
        progressBar.style.width = '100%';
      }
    }, 100);

    // Total display target: ~1.8s
    var DISPLAY_TIME = 1800;
    var FADE_TIME = 650;

    setTimeout(function () {
      preloader.classList.add('preloader-fade-out');
      document.body.classList.remove('preloader-locked');

      setTimeout(function () {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, FADE_TIME);
    }, DISPLAY_TIME);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPreloader);
  } else {
    runPreloader();
  }
})();
