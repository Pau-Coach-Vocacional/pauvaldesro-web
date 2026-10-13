// ============================================================
//  TESTIMONIOS EN VIDEO — abanico de tarjetas que va rotando.
//
//  Cada página pone <div class="abanico" id="testimonios-video"></div>
//  y aquí se dibujan los videos.
//
//  [EDITAR] Para agregar o quitar un video, cambia la lista VIDEOS.
//  `recorte: true` hace un poco de zoom para esconder bordes raros
//  del video original. `horizontal: true` llena la tarjeta con el video
//  acostado y, al darle play, lo muestra completo.
// ============================================================

(function () {
  var VIDEOS = [
    { src: 'img/testimonio-estudiante-1.mp4', poster: 'img/testimonio-estudiante-1.jpg', duracion: '0:43' },
    { src: 'img/testimonio-estudiante-2.mp4', poster: 'img/testimonio-estudiante-2.jpg', duracion: '0:31', recorte: true },
    { src: 'img/testimonio-estudiante-3.mp4', poster: 'img/testimonio-estudiante-3.jpg', duracion: '2:04', horizontal: true }
  ];
  var CADA = 4500; // ms entre cada giro del abanico

  var caja = document.getElementById('testimonios-video');
  if (!caja) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  caja.innerHTML =
    '<div class="abanico-mesa">' +
    VIDEOS.map(function (v, i) {
      return '<article class="tv' + (v.recorte ? ' recorte' : '') + (v.horizontal ? ' horizontal' : '') + '" data-i="' + i + '">' +
        '<img class="tv-fondo" src="' + v.poster + '" alt="" aria-hidden="true">' +
        '<video src="' + v.src + '" poster="' + v.poster + '" preload="none" playsinline></video>' +
        '<button class="tv-play" type="button" aria-label="Ver testimonio ' + (i + 1) + '">' +
          '<span class="tv-ico">▶</span><span class="tv-dur">' + v.duracion + '</span>' +
        '</button>' +
      '</article>';
    }).join('') +
    '</div>' +
    '<div class="abanico-nav">' +
      '<button class="ab-flecha" data-dir="-1" type="button" aria-label="Anterior">←</button>' +
      '<div class="ab-puntos">' + VIDEOS.map(function (v, i) {
        return '<button type="button" data-i="' + i + '" aria-label="Video ' + (i + 1) + '"></button>';
      }).join('') + '</div>' +
      '<button class="ab-flecha" data-dir="1" type="button" aria-label="Siguiente">→</button>' +
    '</div>';

  var tarjetas = [].slice.call(caja.querySelectorAll('.tv'));
  var puntos = [].slice.call(caja.querySelectorAll('.ab-puntos button'));
  var n = tarjetas.length;
  var actual = 0, timer = null, visible = false, encima = false;

  function pintar() {
    tarjetas.forEach(function (t, i) {
      var pos = (i - actual + n) % n;
      if (pos > n / 2) pos -= n;            // -1 izquierda, 0 centro, 1 derecha
      t.setAttribute('data-pos', pos);
      t.setAttribute('aria-hidden', pos !== 0);
    });
    puntos.forEach(function (p, i) { p.classList.toggle('on', i === actual); });
  }

  function detenerVideos() {
    tarjetas.forEach(function (t) {
      var v = t.querySelector('video');
      if (!v.paused) v.pause();
      v.controls = false;
      t.classList.remove('reproduciendo');
    });
  }

  function ir(i) {
    detenerVideos();
    actual = (i + n) % n;
    pintar();
  }

  function reproduciendo() { return !!caja.querySelector('.tv.reproduciendo'); }

  function programar() {
    clearInterval(timer);
    if (reduce) return;
    timer = setInterval(function () {
      if (visible && !encima && !reproduciendo()) ir(actual + 1);
    }, CADA);
  }

  tarjetas.forEach(function (t, i) {
    var v = t.querySelector('video');
    t.addEventListener('click', function () {
      if (t.getAttribute('data-pos') !== '0') { ir(i); programar(); return; }
      if (t.classList.contains('reproduciendo')) return;
      t.classList.add('reproduciendo');
      v.controls = true;
      v.play();
    });
    v.addEventListener('ended', function () {
      t.classList.remove('reproduciendo');
      v.controls = false;
      programar();
    });
  });

  caja.querySelectorAll('.ab-flecha').forEach(function (b) {
    b.addEventListener('click', function () { ir(actual + Number(b.getAttribute('data-dir'))); programar(); });
  });
  puntos.forEach(function (p, i) {
    p.addEventListener('click', function () { ir(i); programar(); });
  });

  // pausa cuando el mouse está encima
  caja.addEventListener('mouseenter', function () { encima = true; });
  caja.addEventListener('mouseleave', function () { encima = false; });

  // deslizar con el dedo en celular
  var x0 = null;
  caja.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  caja.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) { ir(actual + (dx < 0 ? 1 : -1)); programar(); }
  });

  // solo gira cuando la sección está en pantalla
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (!visible) detenerVideos();
  }, { threshold: 0.35 }).observe(caja);

  pintar();
  programar();
})();
