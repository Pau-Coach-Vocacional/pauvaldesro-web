// ============================================================
//  PAQUETES (BETA) — todo lo editable está en este archivo.
//
//  Cada página tiene <div id="paquetes-lista" data-para="prepa|uni|padres">
//  y aquí se dibujan los paquetes de esa página.
//
//  [EDITAR] Nombres, precios y contenidos son de EJEMPLO. Cuando Pau
//  confirme, cámbialos aquí y se actualizan solos en las 3 páginas.
//
//  MERCADO PAGO: en su cuenta, Pau crea un "Link de pago" por paquete
//  (Mercado Pago → Cobrar → Link de pago) y lo pega en `pago`.
//  Mientras `pago` esté vacío, el botón manda a WhatsApp para apartar.
// ============================================================

(function () {
  var WHATSAPP = '5215585758726';
  var CALENDLY = 'https://calendly.com/pau-coachvocacional/30min';

  var PAQUETES = {
    prepa: [
      {
        tipo: 'Para empezar', nombre: 'Sesión de claridad',
        desc: 'Nos conocemos y vemos en qué punto estás hoy.',
        precio: 'Gratis', nota: '30 min · en línea',
        incluye: ['Sesión 1:1 de diagnóstico', 'Mapa de en qué punto estás', 'Recomendación de siguientes pasos'],
        gratis: true
      },
      {
        tipo: 'Programa completo', nombre: 'Programa C2C',
        desc: 'De la confusión a la claridad: te conoces, exploras y decides.',
        precio: '$0,000', nota: 'Precio de ejemplo · pago único o en parcialidades',
        incluye: ['6 sesiones 1:1 personalizadas', 'Herramientas de autoconocimiento', 'Exploración de carreras y universidades', 'Plan de acción con tus siguientes pasos'],
        destacado: true, sello: 'El más elegido', pago: ''
      },
      {
        tipo: 'Con admisión', nombre: 'C2C + Admisión',
        desc: 'El programa completo y te acompaño hasta tu solicitud.',
        precio: '$0,000', nota: 'Precio de ejemplo',
        incluye: ['Todo el Programa C2C', 'Acompañamiento en solicitudes y ensayos', 'Seguimiento hasta tu decisión final'],
        pago: ''
      }
    ],
    uni: [
      {
        tipo: 'Para empezar', nombre: 'Sesión de claridad',
        desc: 'Hablamos de qué está pasando con tu carrera.',
        precio: 'Gratis', nota: '30 min · en línea',
        incluye: ['Sesión 1:1 de diagnóstico', 'Primer mapa de tus dudas', 'Recomendación de siguientes pasos'],
        gratis: true
      },
      {
        tipo: 'Programa completo', nombre: 'Replantear mi carrera',
        desc: 'Entendemos qué pasó, qué conservar y qué necesitas ahora.',
        precio: '$0,000', nota: 'Precio de ejemplo · pago único o en parcialidades',
        incluye: ['5 sesiones 1:1 personalizadas', 'Análisis de lo que sí y lo que no', 'Alternativas reales: cambiar, ajustar o quedarte', 'Plan para avanzar'],
        destacado: true, sello: 'Recomendado', pago: ''
      },
      {
        tipo: 'Con transición', nombre: 'Replantear + Transición',
        desc: 'Si decides cambiar, te acompaño en el cambio.',
        precio: '$0,000', nota: 'Precio de ejemplo',
        incluye: ['Todo Replantear mi carrera', 'Revalidación y opciones de cambio', 'Seguimiento durante la transición'],
        pago: ''
      }
    ],
    padres: [
      {
        tipo: 'Para empezar', nombre: 'Primera conversación',
        desc: 'Conocemos la situación de su hijo o hija y cómo los puedo ayudar.',
        precio: 'Gratis', nota: '30 min · en línea',
        incluye: ['Sesión con padres', 'Panorama del proceso', 'Recomendación de siguientes pasos'],
        gratis: true
      },
      {
        tipo: 'Programa familiar', nombre: 'C2C en familia',
        desc: 'El programa para su hijo o hija, con ustedes dentro del proceso.',
        precio: '$0,000', nota: 'Precio de ejemplo · pago único o en parcialidades',
        incluye: ['Programa C2C completo para su hijo/a', '2 sesiones con padres', 'Conversación guiada sobre expectativas y límites', 'Cierre en familia con el plan'],
        destacado: true, sello: 'Recomendado', pago: ''
      },
      {
        tipo: 'Solo padres', nombre: 'Sesión para padres',
        desc: 'Para saber cómo acompañar sin imponer.',
        precio: '$0,000', nota: 'Precio de ejemplo',
        incluye: ['Sesión 1:1 con padres', 'Cómo hablar de expectativas (también económicas)', 'Guía para acompañar el proceso'],
        pago: ''
      }
    ]
  };

  var lista = document.getElementById('paquetes-lista');
  if (!lista) return;
  var paquetes = PAQUETES[lista.getAttribute('data-para')] || [];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function whats(nombre) {
    var msg = 'Hola Pau, vi tu página y me interesa el paquete "' + nombre + '".';
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
  }

  lista.innerHTML = paquetes.map(function (p) {
    var botones;
    if (p.gratis) {
      botones =
        '<a class="btn-primary" href="' + CALENDLY + '" target="_blank" rel="noopener">Agendar gratis</a>';
    } else if (p.pago) {
      botones =
        '<a class="btn-primary btn-mp" href="' + esc(p.pago) + '" target="_blank" rel="noopener">Pagar con Mercado Pago</a>' +
        '<a class="btn-outline" href="' + whats(p.nombre) + '" target="_blank" rel="noopener">Tengo dudas</a>';
    } else {
      botones =
        '<a class="btn-primary" href="' + whats(p.nombre) + '" target="_blank" rel="noopener">Apartar mi lugar</a>' +
        '<p class="mini">Pago con Mercado Pago · próximamente</p>';
    }
    return '<article class="paquete' + (p.destacado ? ' destacado' : '') + '">' +
      (p.sello ? '<span class="sello">' + esc(p.sello) + '</span>' : '') +
      '<span class="tipo">' + esc(p.tipo) + '</span>' +
      '<h3>' + esc(p.nombre) + '</h3>' +
      '<p class="desc">' + esc(p.desc) + '</p>' +
      '<p class="precio">' + esc(p.precio) + (p.gratis ? '' : '<small>MXN</small>') + '</p>' +
      '<p class="nota-precio">' + esc(p.nota) + '</p>' +
      '<ul>' + p.incluye.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' +
      '<div class="acciones">' + botones + '</div>' +
      '</article>';
  }).join('');
})();
