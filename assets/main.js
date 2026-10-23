(function () {
  var root = document.documentElement;
  var motion = root.classList.contains('motion');
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Hero pins ---------- */
  var field = document.getElementById('pins');
  if (field) {
    var pins = Array.prototype.slice.call(field.querySelectorAll('.pin'));
    var card = field.querySelector('.pin-card');
    var img = card.querySelector('img');
    var label = card.querySelector('b');
    var current = -1, timer = null, pausedUntil = 0, heroVisible = true;

    function place(pin) {
      var tipX = pin.offsetLeft, tipY = pin.offsetTop;
      var cw = card.offsetWidth, ch = card.offsetHeight, fw = field.clientWidth;
      var top = tipY - 62 - ch;
      if (top < -24) top = tipY + 16;
      var left = Math.max(0, Math.min(fw - cw, tipX - cw / 2));
      card.style.left = left + 'px';
      card.style.top = top + 'px';
    }
    function select(i) {
      var pin = pins[i];
      if (!pin) return;
      pins.forEach(function (p, k) { p.classList.toggle('is-active', k === i); p.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      img.src = pin.getAttribute('data-img');
      img.alt = pin.getAttribute('data-alt');
      label.textContent = pin.getAttribute('data-label');
      card.classList.remove('show');
      place(pin);
      void card.offsetWidth;
      card.classList.add('show');
      current = i;
    }
    pins.forEach(function (pin, i) {
      pin.addEventListener('click', function () { pausedUntil = Date.now() + 9000; select(i); });
      pin.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) { pausedUntil = Date.now() + 9000; select(i); } });
    });
    window.addEventListener('resize', function () { if (current >= 0) place(pins[current]); });

    if (motion) {
      setTimeout(function () {
        select(0);
        timer = setInterval(function () {
          if (!heroVisible || document.hidden || Date.now() < pausedUntil) return;
          select((current + 1) % pins.length);
        }, 3400);
      }, 1700);
      if (hasIO) {
        new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; }).observe(field);
      }
    } else {
      select(0);
    }
  }

  /* ---------- Scroll story ---------- */
  var scenes = Array.prototype.slice.call(document.querySelectorAll('.scene'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.story-progress span'));
  document.querySelectorAll('.mosaic li').forEach(function (li, k) { li.style.setProperty('--k', k); });
  function activate(i) {
    scenes.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
  }
  if (motion && hasIO && scenes.length) {
    activate(0);
    var steps = Array.prototype.slice.call(document.querySelectorAll('.story-steps > div'));
    var stepIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) activate(steps.indexOf(en.target));
      });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
    steps.forEach(function (s) { stepIO.observe(s); });
  } else {
    scenes.forEach(function (s) { s.classList.add('is-active'); });
  }

  /* ---------- Reveal ---------- */
  var targets = document.querySelectorAll('.reveal');
  if (!motion || !hasIO) {
    targets.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  targets.forEach(function (el) { io.observe(el); });
})();
