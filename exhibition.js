(() => {
  'use strict';

  const catalog = Array.isArray(window.PHOTO_CATALOG) ? window.PHOTO_CATALOG : [];
  const archiveOrder = [13, 4, 27, 5, 7, 8, 14, 9, 20, 12, 22, 15, 24, 11, 17, 2, 25, 6, 18, 19, 21, 1, 10, 16, 23, 26];
  const photosById = new Map(catalog.map(photo => [Number(photo.id), photo]));
  const originalIds = new Set(archiveOrder);
  const orderedIds = [...archiveOrder, ...[...photosById.keys()].filter(id => !originalIds.has(id))];
  const photos = orderedIds.map(id => photosById.get(id)).filter(Boolean);
  const tallerLandscapes = new Set([2, 7, 8, 9, 10, 11]);

  function dimensions(photo) {
    const id = Number(photo.id);
    const portrait = id === 27;
    return {
      width: photo.width ?? (portrait ? 1200 : 1800),
      height: photo.height ?? (portrait ? 1500 : tallerLandscapes.has(id) ? 1205 : 1196),
      smallWidth: photo.smallWidth ?? (portrait ? 680 : 850),
      smallHeight: photo.smallHeight ?? (portrait ? 850 : tallerLandscapes.has(id) ? 569 : 565)
    };
  }

  const galleries = [...document.querySelectorAll('[data-gallery]')];
  const galleryResults = new WeakMap();
  const search = document.querySelector('#archive-search');
  const filters = [...document.querySelectorAll('button[data-filter]')];
  const status = document.querySelector('#gallery-status');
  const empty = document.querySelector('#gallery-empty');
  let currentFilter = 'All';

  const menuToggle = document.querySelector('#menu-toggle');
  const menu = document.querySelector('#site-menu');
  const viewer = document.querySelector('#photo-viewer');
  const viewerImage = document.querySelector('#viewer-image');
  const viewerTitle = document.querySelector('#viewer-title');
  const viewerCategory = document.querySelector('#viewer-category');
  const viewerCount = document.querySelector('#viewer-count');
  let viewerPhotos = photos;
  let viewerIndex = 0;
  let viewerTrigger = null;
  let previousOverflow = null;

  function syncScrollLock() {
    const isOpen = Boolean(menu?.open || viewer?.open);
    if (isOpen && previousOverflow === null) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else if (!isOpen && previousOverflow !== null) {
      document.body.style.overflow = previousOverflow;
      previousOverflow = null;
    }
    document.body.classList.toggle('dialog-open', isOpen);
  }

  function closeMenu() {
    if (menu?.open) menu.close();
  }

  if (menu && menuToggle) {
    menuToggle.setAttribute('aria-controls', menu.id);
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.addEventListener('click', () => {
      if (menu.open) {
        closeMenu();
        return;
      }
      if (viewer?.open) viewer.close();
      menu.showModal();
      menuToggle.setAttribute('aria-expanded', 'true');
      syncScrollLock();
      (menu.querySelector('#menu-close') || menu.querySelector('a, button'))?.focus({ preventScroll: true });
    });
    menu.querySelector('#menu-close')?.addEventListener('click', closeMenu);
    menu.addEventListener('click', event => {
      if (event.target === menu || event.target.closest('a[href]')) closeMenu();
    });
    menu.addEventListener('close', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      syncScrollLock();
      // A followed link may already have moved focus to its on-page destination.
      if (document.activeElement === document.body || menu.contains(document.activeElement)) {
        menuToggle.focus({ preventScroll: true });
      }
    });
  }

  function paintViewer() {
    const photo = viewerPhotos[viewerIndex];
    if (!photo || !viewerImage) return;
    const size = dimensions(photo);
    viewerImage.alt = photo.alt;
    viewerImage.src = `images/${photo.file}.webp`;
    viewerImage.width = size.width;
    viewerImage.height = size.height;
    if (viewerTitle) viewerTitle.textContent = photo.title;
    if (viewerCategory) viewerCategory.textContent = photo.category;
    if (viewerCount) viewerCount.textContent = `${String(viewerIndex + 1).padStart(2, '0')} / ${String(viewerPhotos.length).padStart(2, '0')}`;
    viewer.querySelectorAll('[data-viewer-prev], [data-viewer-next]').forEach(button => {
      button.disabled = viewerPhotos.length < 2;
    });
    // Warm the next full photograph while the current one is being viewed.
    if (viewerPhotos.length > 1) {
      const next = viewerPhotos[(viewerIndex + 1) % viewerPhotos.length];
      const preload = new Image();
      preload.src = `images/${next.file}.webp`;
    }
  }

  function moveViewer(direction) {
    if (!viewer?.open || !viewerPhotos.length) return;
    viewerIndex = (viewerIndex + direction + viewerPhotos.length) % viewerPhotos.length;
    paintViewer();
  }

  function openViewer(id, list, trigger) {
    if (!viewer || !viewerImage || !photosById.has(id)) return;
    viewerPhotos = list?.length ? [...list] : photos;
    viewerIndex = viewerPhotos.findIndex(photo => Number(photo.id) === id);
    if (viewerIndex < 0) {
      viewerPhotos = photos;
      viewerIndex = viewerPhotos.findIndex(photo => Number(photo.id) === id);
    }
    if (viewerIndex < 0) return;
    viewerTrigger = trigger || document.activeElement;
    closeMenu();
    paintViewer();
    if (!viewer.open) viewer.showModal();
    syncScrollLock();
    viewer.querySelector('[data-viewer-close]')?.focus({ preventScroll: true });
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-photo-id]');
    if (!trigger) return;
    const id = Number(trigger.dataset.photoId);
    if (!photosById.has(id) || !viewer) return;
    event.preventDefault();
    const gallery = trigger.closest('[data-gallery]');
    const photoSet = trigger.closest('[data-photo-set]');
    const editorialPhotos = photoSet
      ? [...new Set(photoSet.dataset.photoSet.split(',').map(value => Number(value.trim())))]
        .map(photoId => photosById.get(photoId)).filter(Boolean)
      : photos;
    openViewer(id, gallery ? galleryResults.get(gallery) : editorialPhotos, trigger);
  });

  if (viewer) {
    viewer.querySelectorAll('[data-viewer-close]').forEach(button => button.addEventListener('click', () => viewer.close()));
    viewer.querySelector('[data-viewer-prev]')?.addEventListener('click', () => moveViewer(-1));
    viewer.querySelector('[data-viewer-next]')?.addEventListener('click', () => moveViewer(1));
    viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
    viewer.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveViewer(event.key === 'ArrowLeft' ? -1 : 1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        viewerIndex = event.key === 'Home' ? 0 : viewerPhotos.length - 1;
        paintViewer();
      }
    });
    viewer.addEventListener('close', () => {
      syncScrollLock();
      if (viewerTrigger?.isConnected && !menu?.open) viewerTrigger.focus({ preventScroll: true });
    });

    let swipeStart = null;
    viewerImage?.addEventListener('touchstart', event => {
      swipeStart = event.touches.length === 1
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
        : null;
    }, { passive: true });
    viewerImage?.addEventListener('touchend', event => {
      if (!swipeStart || !event.changedTouches.length) return;
      const dx = event.changedTouches[0].clientX - swipeStart.x;
      const dy = event.changedTouches[0].clientY - swipeStart.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) moveViewer(dx < 0 ? 1 : -1);
      swipeStart = null;
    }, { passive: true });
    viewerImage?.addEventListener('touchcancel', () => { swipeStart = null; }, { passive: true });
  }

  function photoCard(photo, index, layout) {
    const figure = document.createElement('figure');
    figure.className = 'photo-card';
    figure.dataset.reveal = '';
    figure.style.setProperty('--card-index', String(index % 3));
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'photo-open';
    button.dataset.photoId = String(photo.id);
    button.setAttribute('aria-label', `View ${photo.title}`);
    const frame = document.createElement('div');
    frame.className = 'photo-frame';
    const img = document.createElement('img');
    const size = dimensions(photo);
    img.src = `images/${photo.file}-small.webp`;
    img.srcset = `images/${photo.file}-small.webp ${size.smallWidth}w, images/${photo.file}.webp ${size.width}w`;
    img.sizes = layout === 'list' ? '(max-width: 640px) 92vw, 45vw' : '(max-width: 640px) 92vw, (max-width: 1000px) 45vw, 30vw';
    img.width = size.smallWidth;
    img.height = size.smallHeight;
    img.alt = photo.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    const expand = document.createElement('span');
    expand.className = 'photo-expand';
    expand.textContent = '↗';
    expand.setAttribute('aria-hidden', 'true');
    frame.append(img, expand);
    button.append(frame);
    const caption = document.createElement('figcaption');
    caption.className = 'photo-caption';
    const title = document.createElement('span');
    title.className = 'photo-title';
    title.textContent = photo.title;
    const category = document.createElement('span');
    category.className = 'photo-category';
    category.textContent = photo.category;
    caption.append(title, category);
    figure.append(button, caption);
    return figure;
  }

  function renderGalleries() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let total = 0;
    galleries.forEach(gallery => {
      const baseCategory = gallery.dataset.category || 'All';
      const filtered = photos.filter(photo => {
        const categoryMatches = (baseCategory === 'All' || photo.category === baseCategory)
          && (currentFilter === 'All' || photo.category === currentFilter);
        const queryMatches = !query || `${photo.title} ${photo.category} ${photo.alt}`.toLocaleLowerCase().includes(query);
        return categoryMatches && queryMatches;
      });
      galleryResults.set(gallery, filtered);
      gallery.replaceChildren(...filtered.map((photo, index) => photoCard(photo, index, gallery.dataset.layout)));
      gallery.classList.toggle('is-filtered', currentFilter !== 'All' || Boolean(query));
      total += filtered.length;
    });
    filters.forEach(button => {
      const active = button.dataset.filter === currentFilter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (status) {
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      const category = currentFilter !== 'All' ? currentFilter : (galleries[0]?.dataset.category || 'All');
      status.textContent = `${total} photograph${total === 1 ? '' : 's'}${category === 'All' ? '' : ` · ${category}`}${query ? ` matching “${search.value.trim()}”` : ''}`;
    }
    if (empty) empty.hidden = total !== 0;
    document.dispatchEvent(new CustomEvent('gallery:updated', { detail: { count: total, filter: currentFilter, query } }));
  }

  filters.forEach(button => button.addEventListener('click', () => {
    currentFilter = button.dataset.filter || 'All';
    renderGalleries();
  }));
  search?.addEventListener('input', renderGalleries);
  search?.addEventListener('keydown', event => {
    if (event.key === 'Escape' && search.value) {
      search.value = '';
      renderGalleries();
    }
  });
  document.querySelectorAll('[data-reset-gallery]').forEach(button => button.addEventListener('click', () => {
    currentFilter = 'All';
    if (search) search.value = '';
    renderGalleries();
    search?.focus({ preventScroll: true });
  }));

  const layoutButtons = [...document.querySelectorAll('button[data-layout]')];
  layoutButtons.forEach(button => button.addEventListener('click', () => {
    const layout = button.dataset.layout === 'list' ? 'list' : 'grid';
    galleries.forEach(gallery => {
      gallery.dataset.layout = layout;
      gallery.querySelectorAll('img').forEach(img => {
        img.sizes = layout === 'list'
          ? '(max-width: 640px) 92vw, 45vw'
          : '(max-width: 640px) 92vw, (max-width: 1000px) 45vw, 30vw';
      });
    });
    layoutButtons.forEach(control => {
      const active = control.dataset.layout === layout;
      control.classList.toggle('active', active);
      control.setAttribute('aria-pressed', String(active));
    });
    document.dispatchEvent(new CustomEvent('gallery:updated', { detail: { layout } }));
  }));

  if (galleries.length) renderGalleries();
})();
