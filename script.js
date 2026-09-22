document.addEventListener('DOMContentLoaded', () => {
  // ── Responsive Hamburger Nav ────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const siteHeader = document.getElementById('siteHeader');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close drawer when a link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });

    // Close when clicking outside the header
    document.addEventListener('click', (e) => {
      if (siteHeader && !siteHeader.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Header scroll shadow
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  // Reveal Animations
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .reveal-img, .tl-row').forEach(el => io.observe(el));


  // Parallax & Scroll fill
  const heroImg = document.querySelector('.hero-image-col img');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroImg && y < 900) {
      heroImg.style.transform = `translateY(${y * 0.08}px) scale(1.02)`;
    }

    const doc = document.documentElement;
    const pct = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight) * 100;
    const fill = document.getElementById('scrollFill');
    if (fill) fill.style.height = pct + '%';
  }, { passive: true });

  // Timeline Scroll fill
  const tlSection = document.getElementById('timeline');
  const tlFill = document.getElementById('tlFill');
  window.addEventListener('scroll', () => {
    if (!tlSection || !tlFill) return;
    const rect = tlSection.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height - vh * 0.4;
    const progressed = Math.min(Math.max(-rect.top + vh * 0.5, 0), total);
    const pct = total > 0 ? (progressed / total) * 100 : 0;
    tlFill.style.height = pct + '%';
  }, { passive: true });

  // Tribute Tabs Switcher
  const tributeTabs = document.querySelectorAll('.tribute-tab-btn');
  tributeTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tributeTabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tribute-tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Gallery Category Filter Tabs
  const catTabs = document.querySelectorAll('.gallery-cats span');
  const mosaicItems = document.querySelectorAll('.mosaic .m-item');
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('on'));
      tab.classList.add('on');
      const selectedCat = (tab.getAttribute('data-cat') || tab.textContent.trim()).toLowerCase();

      mosaicItems.forEach(item => {
        const itemTag = (item.querySelector('.m-label')?.textContent || '').toLowerCase();
        if (selectedCat === 'all' || itemTag === selectedCat) {
          item.style.display = 'block';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          item.style.opacity = '0.25';
          item.style.transform = 'scale(0.95)';
        }
      });
    });
  });

  // Image Preview Lightbox Modal Logic
  function ensureLightboxModalExists() {
    let modal = document.getElementById('imagePreviewModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'imagePreviewModal';
      modal.className = 'img-preview-modal';
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-label', 'Image Preview Modal');
      modal.innerHTML = `
        <div class="modal-overlay" id="modalOverlay"></div>
        <div class="modal-dialog-box">
            <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close modal">&times;</button>
            <button class="modal-arrow modal-arrow-prev" id="modalPrevBtn" aria-label="Previous image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button class="modal-arrow modal-arrow-next" id="modalNextBtn" aria-label="Next image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <div class="modal-body-content">
                <div class="modal-img-container">
                    <img id="modalPreviewImg" src="" alt="Full view photograph">
                </div>
                <div class="modal-footer-caption">
                    <div class="caption-left">
                        <span id="modalImgTag" class="modal-tag">Portfolio</span>
                        <h4 id="modalImgTitle" class="modal-title">Photo Preview</h4>
                    </div>
                    <div class="caption-right">
                        <span id="modalImgCounter" class="modal-counter">1 / 1</span>
                    </div>
                </div>
            </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    return modal;
  }

  function initLightbox() {
    const modal = ensureLightboxModalExists();
    const modalImg = document.getElementById('modalPreviewImg');
    const modalTag = document.getElementById('modalImgTag');
    const modalTitle = document.getElementById('modalImgTitle');
    const modalCounter = document.getElementById('modalImgCounter');
    const closeBtn = document.getElementById('modalCloseBtn');
    const overlay = document.getElementById('modalOverlay');
    const prevBtn = document.getElementById('modalPrevBtn');
    const nextBtn = document.getElementById('modalNextBtn');

    let previewElements = [];
    let currentIndex = 0;

    function getVisiblePreviewElements() {
      const all = Array.from(document.querySelectorAll('.strip-item, .mosaic .m-item, .tribute-photo-card, .tl-thumb, .archive-visual .main-img, .archive-visual .float-img'));
      return all.filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.opacity !== '0';
      });
    }

    function getPhotoData(el) {
      const img = el.querySelector('img') || (el.tagName === 'IMG' ? el : null);
      const tag = el.querySelector('.strip-tag span, .m-label, .modal-tag')?.textContent.trim() || 'Archive';
      const alt = img?.getAttribute('alt') || 'Photograph by Shashi Sahai';
      const src = img?.getAttribute('src') || '';
      return { src, tag, title: alt };
    }

    function updateModal(index) {
      previewElements = getVisiblePreviewElements();
      if (previewElements.length === 0) return;
      if (index < 0) index = previewElements.length - 1;
      if (index >= previewElements.length) index = 0;
      currentIndex = index;

      const data = getPhotoData(previewElements[currentIndex]);
      if (modalImg) {
        modalImg.style.opacity = '0';
        setTimeout(() => {
          modalImg.src = data.src;
          modalImg.alt = data.title;
          if (modalTag) modalTag.textContent = data.tag;
          if (modalTitle) modalTitle.textContent = data.title;
          if (modalCounter) modalCounter.textContent = `${currentIndex + 1} / ${previewElements.length}`;
          modalImg.style.opacity = '1';
        }, 100);
      }
    }

    function openModalForElement(targetEl) {
      previewElements = getVisiblePreviewElements();
      let idx = previewElements.indexOf(targetEl);
      if (idx === -1) idx = 0;
      updateModal(idx);
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Global Click Listener for all preview items
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.strip-item, .mosaic .m-item, .tribute-photo-card, .tl-thumb, .archive-visual .main-img, .archive-visual .float-img');
      if (card) {
        e.preventDefault();
        openModalForElement(card);
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); updateModal(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); updateModal(currentIndex + 1); });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') updateModal(currentIndex - 1);
      if (e.key === 'ArrowRight') updateModal(currentIndex + 1);
    });
  }

  initLightbox();

  // Interactive Tribute Wall Form & LocalStorage Logic
  const tributeForm = document.getElementById('tributeForm');
  const tributeWallGrid = document.getElementById('tributeWallGrid');

  function escapeHtml(str) {
    return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderTributeCard(data, prepend = true) {
    if (!tributeWallGrid) return;
    const card = document.createElement('div');
    card.className = 'tribute-wall-card';
    const initial = (data.name || 'A').charAt(0).toUpperCase();
    const roleText = data.role ? data.role : 'Well-Wisher & Admirer';
    card.innerHTML = `
      <div class="tribute-wall-text">“${escapeHtml(data.message)}”</div>
      <div class="tribute-wall-meta">
        <div class="tribute-avatar">${initial}</div>
        <div>
          <div class="tribute-wall-author">${escapeHtml(data.name)}</div>
          <div class="tribute-wall-role">${escapeHtml(roleText)}</div>
        </div>
        <div class="tribute-wall-date">${data.date || 'Today'}</div>
      </div>
    `;
    if (prepend) {
      tributeWallGrid.insertBefore(card, tributeWallGrid.firstChild);
    } else {
      tributeWallGrid.appendChild(card);
    }
  }

  function loadSavedTributes() {
    if (!tributeWallGrid) return;
    try {
      const saved = JSON.parse(localStorage.getItem('shashi_tributes') || '[]');
      saved.forEach(item => {
        renderTributeCard(item, false);
      });
    } catch (err) {
      console.error('Error loading tributes:', err);
    }
  }

  if (tributeForm) {
    loadSavedTributes();
    tributeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('authorName')?.value.trim();
      const role = document.getElementById('authorRole')?.value.trim();
      const message = document.getElementById('tributeMsg')?.value.trim();
      if (!name || !message) return;

      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const newTribute = { name, role, message, date: dateStr };

      renderTributeCard(newTribute, true);

      try {
        const saved = JSON.parse(localStorage.getItem('shashi_tributes') || '[]');
        saved.unshift(newTribute);
        localStorage.setItem('shashi_tributes', JSON.stringify(saved));
      } catch (err) {
        console.error('Error saving tribute:', err);
      }

      tributeForm.reset();
      const formCard = document.querySelector('.tribute-form-card');
      if (formCard) {
        const alertMsg = document.createElement('div');
        alertMsg.className = 'alert alert-success mt-3 text-center py-2';
        alertMsg.style.fontSize = '0.85rem';
        alertMsg.style.background = 'rgba(25, 135, 84, 0.2)';
        alertMsg.style.border = '1px solid rgba(25, 135, 84, 0.5)';
        alertMsg.style.color = '#75b798';
        alertMsg.textContent = '✨ Thank you! Your memory has been posted to the Tribute Wall.';
        formCard.appendChild(alertMsg);
        setTimeout(() => alertMsg.remove(), 4000);
      }
    });
  }

  // Swiper Slider for Archival Frames Gallery
  if (typeof Swiper !== 'undefined' && document.querySelector('.archivalSwiper')) {
    new Swiper('.archivalSwiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        576: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 24,
        }
      }
    });
  }
});
