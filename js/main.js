// ============================================================
//  PAU VALDÉS ROCHÍN — v4 interactiva
//  1. Reveal al hacer scroll   2. Sombra de nav al hacer scroll
//  3. Titular que se tacha     4. Panel de voces
//  5. Contadores animados      6. Botones magnéticos
//  7. Tilt 3D en tarjetas      8. Timeline de "mi acompañamiento"
//  9. Quiz vocacional interactivo
// ============================================================

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Reveal al hacer scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- 2. Sombra de nav ---------- */
  var navEl = document.querySelector('nav');
  if (navEl) {
    window.addEventListener('scroll', function () {
      navEl.classList.toggle('scrolled', window.scrollY > 8);
    });
  }

  /* ---------- 3. Titular que se tacha y se corrige ---------- */
  var tachado    = document.getElementById('tachado'),
      linea      = document.getElementById('linea'),
      correccion = document.getElementById('correccion'),
      frase      = ' no debería ser la norma.',
      hecho      = false;

  function escribir(i) {
    if (i > frase.length) return;
    correccion.textContent = frase.slice(0, i);
    setTimeout(function () { escribir(i + 1); }, 40);
  }
  function corregir() {
    if (hecho) return;
    hecho = true;
    if (reduce) {
      linea.style.width = '100%';
      tachado.style.color = '#9C978B';
      correccion.textContent = frase;
      return;
    }
    setTimeout(function () { linea.style.width = '100%'; }, 300);
    setTimeout(function () { tachado.style.color = '#9C978B'; }, 1000);
    setTimeout(function () { escribir(1); }, 1200);
  }
  var normaEl = document.getElementById('norma');
  if (normaEl) {
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) corregir(); });
    }, { threshold: 0.35 }).observe(normaEl);
  }

  /* ---------- 4. Panel de voces ---------- */
  var voces = [
    ['"Mis papás quieren que estudie medicina y yo ni sé si me gusta."', 'Estudiante de 5º semestre'],
    ['"Todos mis amigos ya saben qué van a estudiar. Siento que voy tarde."', 'Estudiante de 6º semestre'],
    ['"Me gusta dibujar, pero me dijeron que de eso no se vive."', 'Estudiante de 4º semestre'],
    ['"Escogí la carrera por la universidad, no por la carrera."', 'Primer semestre universitario']
  ];
  var voz = document.getElementById('voz'), quien = document.getElementById('voz-quien'),
      vocesNav = document.getElementById('voces-nav'), actual = 0, reloj;
  if (voz && vocesNav) {
    voces.forEach(function (v, i) {
      var b = document.createElement('button');
      b.className = 'punto';
      b.setAttribute('aria-label', 'Ver frase ' + (i + 1));
      b.addEventListener('click', function () { mostrar(i); reiniciar(); });
      vocesNav.appendChild(b);
    });
    var mostrar = function (i) {
      actual = i;
      voz.style.opacity = 0; quien.style.opacity = 0;
      setTimeout(function () {
        voz.textContent = voces[i][0]; quien.textContent = voces[i][1];
        voz.style.opacity = 1; quien.style.opacity = 1;
      }, reduce ? 0 : 250);
      vocesNav.querySelectorAll('.punto').forEach(function (p, j) {
        p.setAttribute('aria-current', j === i ? 'true' : 'false');
      });
    };
    var reiniciar = function () {
      clearInterval(reloj);
      if (!reduce) reloj = setInterval(function () { mostrar((actual + 1) % voces.length); }, 5500);
    };
    mostrar(0); reiniciar();
  }

  /* ---------- 5. Contadores animados ---------- */
  var contadores = document.querySelectorAll('[data-count]');
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      var target = parseInt(e.target.getAttribute('data-count'), 10);
      if (reduce) { e.target.textContent = target; return; }
      var start = null, dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        e.target.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  contadores.forEach(function (el) { countIO.observe(el); });

  /* ---------- 6. Botones magnéticos ---------- */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.35 + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- 7. Tilt 3D en tarjetas ---------- */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.tilt').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'rotateY(' + px * 10 + 'deg) rotateX(' + (-py * 10) + 'deg) scale(1.02)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- 8. Timeline de "mi acompañamiento" ---------- */
  var pasos = document.querySelectorAll('.paso');
  var fill = document.getElementById('timeline-fill');
  function actualizarFill(i) {
    if (!fill) return;
    var pct = ((i + 1) / pasos.length) * 100;
    fill.style.width = pct + '%';
  }
  pasos.forEach(function (paso, i) {
    paso.addEventListener('click', function () {
      var abierto = paso.getAttribute('aria-expanded') === 'true';
      pasos.forEach(function (otro) { otro.setAttribute('aria-expanded', 'false'); });
      paso.setAttribute('aria-expanded', abierto ? 'false' : 'true');
      if (!abierto) actualizarFill(i);
    });
  });
  actualizarFill(0);

  /* ---------- 9. Quiz vocacional ---------- */
  var quizCard = document.getElementById('quiz-card');
  if (quizCard) {
    var steps = quizCard.querySelectorAll('.quiz-step');
    var progressBars = quizCard.querySelectorAll('.quiz-progress i');
    var resultEl = document.getElementById('quiz-result');
    var restartBtn = document.getElementById('quiz-restart');
    var current = 0, score = 0;

    function showStep(i) {
      steps.forEach(function (s, j) { s.classList.toggle('active', j === i); });
      resultEl.classList.remove('active');
      progressBars.forEach(function (p, j) {
        p.classList.toggle('done', j < i);
        p.classList.toggle('active', j === i);
      });
    }

    function showResult() {
      steps.forEach(function (s) { s.classList.remove('active'); });
      progressBars.forEach(function (p) { p.classList.add('done'); p.classList.remove('active'); });
      resultEl.classList.add('active');

      var titulo = document.getElementById('quiz-titulo'),
          texto = document.getElementById('quiz-texto'),
          gaugeFill = document.getElementById('quiz-gauge-fill'),
          pctLabel = document.getElementById('quiz-pct');

      // score va de 0 a 8 (4 preguntas x valor 0-2)
      var pct = Math.round((score / 8) * 100);
      var circunferencia = 339; // 2 * PI * 54, redondeado
      var offset = circunferencia - (pct / 100) * circunferencia;
      if (gaugeFill) {
        if (reduce) {
          gaugeFill.style.transition = 'none';
          gaugeFill.style.strokeDashoffset = offset;
        } else {
          gaugeFill.style.strokeDashoffset = circunferencia;
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { gaugeFill.style.strokeDashoffset = offset; });
          });
        }
      }
      if (pctLabel) {
        if (reduce) { pctLabel.textContent = pct + '%'; }
        else {
          var start = null, from = 0;
          function stepPct(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / 900, 1);
            pctLabel.textContent = Math.round(from + (pct - from) * (1 - Math.pow(1 - p, 3))) + '%';
            if (p < 1) requestAnimationFrame(stepPct);
          }
          requestAnimationFrame(stepPct);
        }
      }

      if (score <= 2) {
        titulo.textContent = 'Estás en pleno punto de partida';
        texto.textContent = 'Y está perfecto — la mayoría empieza así. Un acompañamiento 1:1 te ahorra meses de dar vueltas solo/a con esto.';
      } else if (score <= 5) {
        titulo.textContent = 'Ya tienes pistas, falta ordenarlas';
        texto.textContent = 'Tienes ideas dando vueltas pero te falta un método para aterrizarlas en una decisión real. Justo para eso sirve una primera sesión.';
      } else {
        titulo.textContent = 'Estás muy cerca de decidir';
        texto.textContent = 'Tienes una idea bastante clara — una sesión te puede ayudar a confirmarla con bases sólidas y armar el plan para lograrlo.';
      }
    }

    quizCard.querySelectorAll('.quiz-op').forEach(function (btn) {
      btn.addEventListener('click', function () {
        score += parseInt(btn.getAttribute('data-v'), 10);
        current++;
        if (current < steps.length) {
          showStep(current);
        } else {
          showResult();
        }
      });
    });

    if (restartBtn) {
      restartBtn.addEventListener('click', function () {
        current = 0; score = 0;
        showStep(0);
      });
    }
  }

  /* ---------- 10. Riel lateral (scrollspy) ---------- */
  var railLinks = document.querySelectorAll('.rail a');
  if (railLinks.length) {
    var railMap = {};
    railLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (target) railMap[id] = a;
    });
    var railIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var link = railMap[e.target.id];
        if (!link) return;
        railLinks.forEach(function (a) { a.classList.remove('active'); });
        link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    Object.keys(railMap).forEach(function (id) { railIO.observe(document.getElementById(id)); });
  }
})();
