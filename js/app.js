(function () {
  var HAS_THUMBS = true;
  var BASE = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/js\/app\.js(\?.*)?$/, '');
    return '';
  })();

  var advIcons = [
    '<circle cx="20" cy="20" r="16"/><path d="M20 10v10l6 4"/>',
    '<circle cx="14" cy="14" r="4"/><circle cx="26" cy="14" r="4"/><circle cx="20" cy="26" r="4"/>',
    '<path d="M8 28l6-14 6 8 6-12 6 18"/>',
    '<rect x="8" y="14" width="24" height="16" rx="2"/><path d="M8 20h24"/>',
    '<path d="M20 6l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
    '<path d="M12 10v6c0 4 3 8 8 8s8-4 8-8v-6"/><path d="M10 28h20"/>',
    '<path d="M10 12h20v8H10z"/><path d="M14 28v4h12v-4"/>',
    '<path d="M12 8v24M20 4v28M28 10v22"/>'
  ];

  function mediaUrl(file, thumb) {
    return BASE + (thumb && HAS_THUMBS ? 'media/thumbs/' : 'media/') + file;
  }

  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  function closeMenu() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var open = !mobileMenu.classList.contains('open');
    burger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  document.querySelectorAll('.lang-btn[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () { HIOTO.apply(btn.getAttribute('data-lang')); });
  });

  var advGrid = document.getElementById('advGrid');
  for (var i = 0; i < 8; i++) {
    var cell = document.createElement('div');
    cell.className = 'adv-cell anim';
    cell.style.transitionDelay = (i % 4) * 0.08 + 's';
    var numHtml = i === 7 ? '<div class="adv-num" data-t="adv.items.' + i + '.numLabel">10–50 yr</div>' : '';
    cell.innerHTML =
      '<div class="adv-icon"><svg viewBox="0 0 40 40" fill="none" stroke="var(--gold)" stroke-width="1.4" stroke-linecap="round">' + advIcons[i] + '</svg></div>' +
      numHtml +
      '<div class="adv-title" data-t="adv.items.' + i + '.title"></div>' +
      '<div class="adv-desc" data-t="adv.items.' + i + '.desc"></div>';
    advGrid.appendChild(cell);
  }

  var sysGrid = document.getElementById('sysGrid');
  HIOTO_SYSTEMS.items.forEach(function (sys, i) {
    var card = document.createElement('div');
    card.className = 'sys-card anim';
    card.style.transitionDelay = (i % 3) * 0.1 + 's';
    card.innerHTML =
      '<div class="sys-img-wrap"><img class="sys-img" alt="' + sys.name + '" loading="lazy" data-src="' + mediaUrl(sys.image) + '"></div>' +
      '<div class="sys-body">' +
        '<div class="sys-from" data-t="sys.items.' + i + '.from"></div>' +
        '<div class="sys-name" data-t="sys.items.' + i + '.name">' + sys.name + '</div>' +
        '<div class="sys-desc" data-t="sys.items.' + i + '.desc"></div>' +
      '</div>';
    sysGrid.appendChild(card);
  });

  var optKeys = ['canvas', 'wall', 'curtain', 'lighting'];
  var optsGrid = document.getElementById('optsGrid');
  optKeys.forEach(function (key, i) {
    var imgs = HIOTO_SYSTEMS.options[key] || [];
    var thumbs = imgs.map(function (f) {
      return '<img src="' + mediaUrl(f, true) + '" alt="" loading="lazy">';
    }).join('');
    var card = document.createElement('div');
    card.className = 'opt-card anim';
    card.style.transitionDelay = i * 0.1 + 's';
    card.innerHTML =
      '<div class="opt-price" data-t="opts.items.' + i + '.price"></div>' +
      '<div class="opt-unit" data-t="opts.items.' + i + '.unit"></div>' +
      '<div class="opt-name" data-t="opts.items.' + i + '.name"></div>' +
      '<div class="opt-desc" data-t="opts.items.' + i + '.desc"></div>' +
      '<div class="opt-thumbs' + (imgs.length <= 4 ? ' cols-2' : '') + '">' + thumbs + '</div>';
    optsGrid.appendChild(card);
  });

  var otherGrid = document.getElementById('otherGrid');
  HIOTO_SYSTEMS.otherDesigns.forEach(function (file) {
    var item = document.createElement('div');
    item.className = 'other-item anim';
    item.innerHTML = '<img src="' + mediaUrl(file, true) + '" alt="" loading="lazy">';
    otherGrid.appendChild(item);
  });

  var heroBg = document.getElementById('heroBg');
  var heroObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var hi = new Image();
      hi.onload = function () {
        heroBg.style.backgroundImage = "url('" + hi.src + "')";
        requestAnimationFrame(function () { heroBg.classList.add('loaded'); });
      };
      hi.src = mediaUrl(HIOTO_SYSTEMS.hero);
      heroObs.disconnect();
    });
  }, { threshold: 0.1 });
  heroObs.observe(heroBg);

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });

  var imgIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var img = e.target;
      if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
      imgIO.unobserve(img);
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('.sys-img[data-src]').forEach(function (img) { imgIO.observe(img); });

  var photos = HIOTO_GALLERY;
  var grid = document.getElementById('galGrid');
  photos.forEach(function (name, i) {
    var wrap = document.createElement('div');
    wrap.className = 'gal-item anim';
    wrap.style.transitionDelay = (i % 4) * 0.05 + 's';
    var img = document.createElement('img');
    img.alt = 'Project ' + (i + 1);
    img.loading = 'lazy';
    img.src = mediaUrl(name, true);
    wrap.appendChild(img);
    grid.appendChild(wrap);
    wrap.addEventListener('click', function () { openLb(i); });
    io.observe(wrap);
  });

  document.querySelectorAll('.anim').forEach(function (el) { io.observe(el); });

  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var cur = 0;
  function openLb(i) {
    cur = i;
    lbImg.src = mediaUrl(photos[i]);
    lbCap.textContent = (i + 1) + ' / ' + photos.length;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function moveLb(d) {
    cur = (cur + d + photos.length) % photos.length;
    lbImg.src = mediaUrl(photos[cur]);
    lbCap.textContent = (cur + 1) + ' / ' + photos.length;
  }
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function () { moveLb(-1); });
  document.getElementById('lbNext').addEventListener('click', function () { moveLb(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') moveLb(-1);
    if (e.key === 'ArrowRight') moveLb(1);
  });
  var tx0 = 0;
  lb.addEventListener('touchstart', function (e) { tx0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - tx0;
    if (Math.abs(dx) > 50) moveLb(dx < 0 ? 1 : -1);
  });

  HIOTO.apply(HIOTO.lang);

  document.getElementById('vid1').poster = mediaUrl('IMG_6860.JPG', true);
  document.getElementById('vid2').poster = mediaUrl('IMG_6860.JPG', true);
})();
