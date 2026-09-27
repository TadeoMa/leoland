/* ============================================================
   FIRE LAND — motor del juego
   Eres una pistola de fuego anclada a la izquierda. Te mueves
   solo en vertical (flechas / W-S / rueda / arrastre). Espacio
   dispara. Cada nivel superado desbloquea una mejora permanente.
   ============================================================ */
(function () {
  'use strict';

  const audio = new AudioManager();

  // ---- Canvas ----
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;   // 900
  const H = canvas.height;  // 506
  const GROUND_Y = H - 46;  // línea del suelo
  const BASE_X = 34;        // muro del cuartel general (borde izquierdo)
  const PLAYER_X = 74;      // posición fija de tu pistola

  // ---- Mejoras: una por nivel (índice 0 => nivel 1) ----
  const ABILITIES = [
    { key: 'single',    name: 'Bola de fuego',        desc: 'Lanzas una bola de fuego con Espacio.' },
    { key: 'double',    name: 'Disparo doble',        desc: 'Ahora lanzas dos bolas de fuego a la vez.' },
    { key: 'beam',      name: 'Rayo de fuego',        desc: 'Tu disparo pasa a ser un rayo que perfora robots.' },
    { key: 'triple',    name: 'Disparo triple',       desc: 'Abanico de tres proyectiles.' },
    { key: 'power',     name: 'Fuego intenso',        desc: 'Proyectiles más grandes y con más daño.' },
    { key: 'rapid',     name: 'Cadencia rápida',      desc: 'Disparas mucho más rápido.' },
    { key: 'pierce',    name: 'Perforación total',    desc: 'Los proyectiles atraviesan a todos los robots.' },
    { key: 'rear',      name: 'Disparo trasero',      desc: 'También lanzas fuego en diagonal y hacia atrás.' },
    { key: 'bomb',      name: 'Bombas de fuego',      desc: 'Cada pocos disparos sueltas una bomba que explota en el suelo.' },
    { key: 'shield',    name: 'Escudo de llamas',     desc: 'Un escudo absorbe un impacto y se regenera solo.' },
    { key: 'homing',    name: 'Brasas teledirigidas', desc: 'Los proyectiles persiguen al robot más cercano.' },
    { key: 'splitbeam', name: 'Rayo tridente',        desc: 'El rayo se divide en tres direcciones.' },
    { key: 'explosive', name: 'Impacto explosivo',    desc: 'Los proyectiles estallan al impactar.' },
    { key: 'wall',      name: 'Muro de fuego',        desc: 'Mantén Espacio para levantar una columna de llamas.' },
    { key: 'phoenix',   name: 'Disparo fénix',        desc: 'Cada pocos segundos un fénix cruza toda la pantalla.' },
    { key: 'slow',      name: 'Calor abrasador',      desc: 'Los robots alcanzados se mueven más lento un rato.' },
    { key: 'meteor',    name: 'Lluvia de meteoros',   desc: 'Cada pocos segundos caen meteoros de fuego.' },
    { key: 'drone',     name: 'Dron de combate',      desc: 'Un dron te acompaña y dispara solo.' },
    { key: 'overdrive', name: 'Sobrecarga',           desc: 'Llena la barra de calor y entra en modo furia.' },
    { key: 'solar',     name: 'Núcleo solar',         desc: 'Un rayo solar barre la pantalla y ganas +1 de vida.' },
    // --- Niveles 21-50 ---
    { key: 'quad',          name: 'Disparo cuádruple',   desc: 'Cuatro proyectiles de fuego en abanico.' },
    { key: 'bigbeam',       name: 'Rayo de plasma',      desc: 'El rayo es mucho más ancho y potente.' },
    { key: 'flak',          name: 'Metralla ardiente',   desc: 'Tus bolas sueltan chispas de daño mientras vuelan.' },
    { key: 'chain',         name: 'Fuego en cadena',     desc: 'El impacto salta a un robot cercano.' },
    { key: 'napalm',        name: 'Napalm',              desc: 'Las explosiones dejan el suelo ardiendo unos segundos.' },
    { key: 'stun',          name: 'Fuego azul',          desc: 'Los robots alcanzados quedan paralizados un instante.' },
    { key: 'drone2',        name: 'Escuadrón de drones', desc: 'Un segundo dron de combate te acompaña.' },
    { key: 'shield2',       name: 'Escudo reforzado',    desc: 'El escudo aguanta dos impactos.' },
    { key: 'lifesteal',     name: 'Brasa vital',         desc: 'Cada 15 robots recuperas una vida.' },
    { key: 'bigwall',       name: 'Muro llameante',      desc: 'El muro de fuego es enorme y sin recarga.' },
    { key: 'missile',       name: 'Misiles de fuego',    desc: 'Cada 5 disparos lanzas un misil autoguiado potente.' },
    { key: 'orbit',         name: 'Brasas orbitales',    desc: 'Dos brasas giran a tu alrededor y queman al contacto.' },
    { key: 'pierceexplode', name: 'Ojiva perforante',    desc: 'Los proyectiles perforan y además explotan.' },
    { key: 'beamsweep',     name: 'Rayo barredor',       desc: 'El rayo abre un abanico vertical al disparar.' },
    { key: 'meteor2',       name: 'Tormenta de meteoros',desc: 'Muchos más meteoros y más a menudo.' },
    { key: 'overdrive2',    name: 'Sobrecarga total',    desc: 'La furia se llena antes y dura más.' },
    { key: 'reflect',       name: 'Escudo espejo',       desc: 'Un aura devuelve los disparos enemigos.' },
    { key: 'groundspike',   name: 'Géiseres de fuego',   desc: 'Columnas de fuego brotan del suelo cada pocos segundos.' },
    { key: 'airmine',       name: 'Minas flotantes',     desc: 'Sueltas minas que estallan al paso de los voladores.' },
    { key: 'phoenix2',      name: 'Bandada fénix',       desc: 'Dos fénix y más frecuentes.' },
    { key: 'solarcharge',   name: 'Reactor solar',       desc: 'El núcleo solar se recarga y se usa varias veces por nivel.' },
    { key: 'damageaura',    name: 'Aura incandescente',  desc: 'Todo lo que se te acerca recibe daño continuo.' },
    { key: 'giant',         name: 'Bólido gigante',      desc: 'Proyectiles enormes que arrasan filas enteras.' },
    { key: 'slowfield',     name: 'Campo de brasas',     desc: 'La mitad izquierda de la pantalla ralentiza a los robots.' },
    { key: 'turret',        name: 'Torreta de fuego',    desc: 'Una torreta fija dispara sola desde tu base.' },
    { key: 'shockwave',     name: 'Onda de choque',      desc: 'Al recibir un golpe sueltas una onda que barre robots.' },
    { key: 'inferno',       name: 'Lanzallamas',         desc: 'Mantén el disparo para un chorro de fuego continuo y demoledor.' },
    { key: 'guardian',      name: 'Dron guardián',       desc: 'Un guardián frena al robot que esté a punto de cruzar tu base.' },
    { key: 'overload',      name: 'Núcleo inestable',    desc: 'Con 2 vidas o menos entras en furia permanente.' },
    { key: 'sungod',        name: 'Dios del Sol',        desc: 'Barridos solares automáticos, todo al máximo y regeneras vida.' },
  ];
  const TOTAL_LEVELS = ABILITIES.length; // 50

  // ---- Definición de niveles (derivada + ajustes) ----
  function levelConfig(n) { // n: 1..50
    const L = n;
    return {
      n: L,
      quota: Math.round(6 + L * 1.7),          // "puntos de destrucción" necesarios
      spawnInterval: Math.max(0.34, 1.7 - L * 0.033),
      hpMul: 1 + (L - 1) * 0.19,
      speedMul: 1 + Math.min(L - 1, 28) * 0.04,
      batch: L >= 30 ? 2 : 1,                  // robots por oleada
      gunner: L >= 4,
      drone: L >= 6,
      tank: L >= 8,
      elite: L % 5 === 0,
      doubleElite: L >= 30 && L % 5 === 0,
      ability: ABILITIES[L - 1],
    };
  }

  function startHp(L) {
    return 5 + (L >= 15 ? 1 : 0) + (L >= 30 ? 1 : 0) + (L >= 42 ? 1 : 0) + (L >= 50 ? 1 : 0);
  }

  // ---- Estado persistente ----
  const store = {
    getProgress() {
      const v = parseInt(localStorage.getItem('fireland_progress'), 10);
      return isNaN(v) ? 1 : Math.min(Math.max(v, 1), TOTAL_LEVELS);
    },
    setProgress(v) {
      const cur = store.getProgress();
      if (v > cur) localStorage.setItem('fireland_progress', String(Math.min(v, TOTAL_LEVELS)));
    },
    unlockAll() { localStorage.setItem('fireland_progress', String(TOTAL_LEVELS)); },
    getBest(n) {
      const v = parseInt(localStorage.getItem('fireland_best_l' + n), 10);
      return isNaN(v) ? 0 : v;
    },
    setBest(n, v) {
      if (v > store.getBest(n)) { localStorage.setItem('fireland_best_l' + n, String(v)); return true; }
      return false;
    },
  };

  // ---- Pantallas ----
  const screens = {};
  ['menu', 'game', 'pause', 'levelcomplete', 'gameover', 'victory', 'settings', 'instructions']
    .forEach(id => screens[id] = document.getElementById('screen-' + id));

  let overlayReturn = 'menu'; // a qué pantalla base volver tras cerrar un modal

  function showScreen(id) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[id].classList.add('active');
    document.body.classList.toggle('in-game', id === 'game');
  }
  function showOverlay(id) { screens[id].classList.add('active'); }
  function hideOverlay(id) { screens[id].classList.remove('active'); }

  // ---- Referencias DOM ----
  const el = {
    levelList: document.getElementById('levelList'),
    gameTitle: document.getElementById('gameTitle'),
    btnInstructions: document.getElementById('btnInstructions'),
    btnSettings: document.getElementById('btnSettings'),
    btnMute: document.getElementById('btnMute'),
    progressFill: document.getElementById('progressFill'),
    hudLevelName: document.getElementById('hudLevelName'),
    hudHearts: document.getElementById('hudHearts'),
    hudScore: document.getElementById('hudScore'),
    btnPause: document.getElementById('btnPause'),
    btnMenuFromGame: document.getElementById('btnMenuFromGame'),
    flashOverlay: document.getElementById('flashOverlay'),
    abilityToast: document.getElementById('abilityToast'),
    btnResume: document.getElementById('btnResume'),
    btnRestartLevel: document.getElementById('btnRestartLevel'),
    btnPauseInstructions: document.getElementById('btnPauseInstructions'),
    btnPauseMenu: document.getElementById('btnPauseMenu'),
    lcScore: document.getElementById('lcScore'),
    lcTime: document.getElementById('lcTime'),
    lcRecord: document.getElementById('lcRecord'),
    lcUnlock: document.getElementById('lcUnlock'),
    lcUnlockName: document.getElementById('lcUnlockName'),
    lcUnlockDesc: document.getElementById('lcUnlockDesc'),
    btnRetryLevel: document.getElementById('btnRetryLevel'),
    btnNextOrMenu: document.getElementById('btnNextOrMenu'),
    goTitle: document.getElementById('goTitle'),
    goInfo: document.getElementById('goInfo'),
    btnRetryFromOver: document.getElementById('btnRetryFromOver'),
    btnOverMenu: document.getElementById('btnOverMenu'),
    vicScore: document.getElementById('vicScore'),
    btnVictoryMenu: document.getElementById('btnVictoryMenu'),
    volumeRange: document.getElementById('volumeRange'),
    btnToggleSound: document.getElementById('btnToggleSound'),
    btnToggleHaptic: document.getElementById('btnToggleHaptic'),
    btnCloseSettings: document.getElementById('btnCloseSettings'),
    btnCloseInstructions: document.getElementById('btnCloseInstructions'),
  };

  // ============================================================
  //  ESTADO DE PARTIDA
  // ============================================================
  let game = null;
  let running = false;
  let lastFrame = 0;

  function has(key) {
    // Durante el nivel N tienes las mejoras 1..N.
    const idx = ABILITIES.findIndex(a => a.key === key);
    return idx > -1 && idx < game.level;
  }

  function newGame(level) {
    const cfg = levelConfig(level);
    const hp = startHp(level);
    game = {
      level,
      cfg,
      t: 0,
      elapsed: 0,
      player: { y: H / 2, targetY: H / 2, hp, maxHp: hp, iFrames: 0 },
      keys: new Set(),
      firing: false,
      fireSrc: { key: false, pointer: false, btn: false },
      spaceHeld: 0,
      lastShot: -999,
      shotCount: 0,
      projectiles: [],
      enemies: [],
      enemyBolts: [],
      effects: [],     // explosiones, chispas
      floaters: [],     // texto de puntos
      spawnTimer: 0,
      spawned: 0,
      killPoints: 0,
      score: 0,
      shake: 0,
      state: 'play',   // play | done | dead
      // temporizadores de mejoras
      phoenixTimer: 0,
      meteorTimer: 0,
      drones: [],       // drones de combate {y,t}
      wall: null,       // {t} muro de fuego activo
      wallCooldown: 0,
      shield: 0,        // 0/1 disponible
      shieldRegen: 0,
      heat: 0,          // barra de sobrecarga 0..100
      fury: 0,          // segundos de furia restantes
      solarReady: false,
      solarSweep: null,
      solarCd: 10,
      eliteSpawned: false,
      // --- mejoras 21-50 ---
      orbAng: 0,
      napalm: [],       // charcos de fuego {x,y,t,life,r}
      mines: [],        // minas flotantes {x,y,life}
      mineTimer: 3,
      spikeTimer: 3.5,
      spikes: [],       // {x,t,life}
      turretT: 0,
      killsSinceHeal: 0,
      guardian: { y: H / 2, targetId: null },
      shieldMax: 1,
    };
    if (has('shield')) { game.shieldMax = has('shield2') ? 2 : 1; game.shield = game.shieldMax; }
    if (has('solar')) game.solarReady = true;
  }

  // ============================================================
  //  ENTRADA
  // ============================================================
  const PLAYER_SPEED = 340; // px/s con teclado

  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints || 0) > 0;
  if (isTouch) document.body.classList.add('touch');

  const MIN_Y = 34, MAX_Y = GROUND_Y - 8;

  window.addEventListener('keydown', e => {
    if (!game) return;
    const k = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'w', 's', ' ', 'spacebar'].includes(k)) e.preventDefault();
    if (k === ' ' || k === 'spacebar') game.fireSrc.key = true;
    game.keys.add(k === 'spacebar' ? ' ' : k);
    if (k === 'p' && screens.game.classList.contains('active')) togglePause();
  });
  window.addEventListener('keyup', e => {
    if (!game) return;
    let k = e.key.toLowerCase();
    if (k === 'spacebar') k = ' ';
    if (k === ' ') { game.fireSrc.key = false; game.spaceHeld = 0; }
    game.keys.delete(k);
  });

  canvas.addEventListener('wheel', e => {
    if (!game || game.state !== 'play' || !running) return;
    e.preventDefault();
    movePlayer(Math.sign(e.deltaY) * 42);
  }, { passive: false });

  // ---- Puntero / multitáctil sobre el canvas ----
  // Cada puntero se captura por separado, así un dedo mueve y otro dispara.
  const pointers = new Map(); // id -> { move: bool }
  let moveActive = false;

  function canvasY(clientY) {
    const rect = canvas.getBoundingClientRect();
    return clamp((clientY - rect.top) * (H / rect.height), MIN_Y, MAX_Y);
  }
  function recomputePointerFire() {
    if (game) game.fireSrc.pointer = pointers.size > 0;
  }
  canvas.addEventListener('pointerdown', e => {
    if (!game || game.state !== 'play') return;
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    const isMoveCtrl = ![...pointers.values()].some(p => p.move);
    pointers.set(e.pointerId, { move: isMoveCtrl });
    if (isMoveCtrl) { moveActive = true; game.player.targetY = canvasY(e.clientY); }
    recomputePointerFire();
  });
  canvas.addEventListener('pointermove', e => {
    if (!game) return;
    const p = pointers.get(e.pointerId);
    if (p && p.move) game.player.targetY = canvasY(e.clientY);
  });
  function dropPointer(e) {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    pointers.delete(e.pointerId);
    if (p.move) {
      const next = pointers.values().next().value;
      if (next) { next.move = true; }
      else moveActive = false;
    }
    if (!pointers.size && game) game.spaceHeld = 0;
    recomputePointerFire();
  }
  canvas.addEventListener('pointerup', dropPointer);
  canvas.addEventListener('pointercancel', dropPointer);

  // ---- Controles táctiles dedicados (botones ▲ ▼ + botón de fuego) ----
  // Mantener ▲ o ▼ equivale a mantener pulsada la flecha del teclado.
  const touchFire = document.getElementById('touchFire');

  function bindHoldKey(btn, key) {
    if (!btn) return;
    const on = e => {
      e.preventDefault();
      if (!game) return;
      moveActive = false; // la flecha manda sobre el arrastre del dedo
      game.keys.add(key);
      try { btn.setPointerCapture(e.pointerId); } catch (_) {}
    };
    const off = () => { if (game) game.keys.delete(key); };
    btn.addEventListener('pointerdown', on);
    btn.addEventListener('pointerup', off);
    btn.addEventListener('pointercancel', off);
    btn.addEventListener('contextmenu', e => e.preventDefault());
  }
  bindHoldKey(document.getElementById('touchUp'), 'arrowup');
  bindHoldKey(document.getElementById('touchDown'), 'arrowdown');
  if (touchFire) {
    const fireOn = e => { e.preventDefault(); if (game) game.fireSrc.btn = true; try { touchFire.setPointerCapture(e.pointerId); } catch (_) {} };
    const fireOff = () => { if (game) { game.fireSrc.btn = false; game.spaceHeld = 0; } };
    touchFire.addEventListener('pointerdown', fireOn);
    touchFire.addEventListener('pointerup', fireOff);
    touchFire.addEventListener('pointercancel', fireOff);
    touchFire.addEventListener('pointerleave', fireOff);
  }

  // ---- Aviso de girar el móvil en vertical ----
  const portraitMq = window.matchMedia('(orientation: portrait)');
  function checkOrientation() {
    if (isTouch && portraitMq.matches && screens.game.classList.contains('active')
        && game && game.state === 'play' && !paused) {
      togglePause();
    }
  }
  if (portraitMq.addEventListener) portraitMq.addEventListener('change', checkOrientation);
  else if (portraitMq.addListener) portraitMq.addListener(checkOrientation);

  function movePlayer(dy) {
    game.player.y = clamp(game.player.y + dy, MIN_Y, MAX_Y);
    game.player.targetY = game.player.y;
  }

  // ============================================================
  //  BUCLE PRINCIPAL
  // ============================================================
  function loop(now) {
    if (!running) return;
    let dt = (now - lastFrame) / 1000;
    lastFrame = now;
    if (dt > 0.05) dt = 0.05;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  function startLoop() {
    if (running) return;
    running = true;
    lastFrame = performance.now();
    requestAnimationFrame(loop);
  }
  function stopLoop() { running = false; }

  // ============================================================
  //  UPDATE
  // ============================================================
  function update(dt) {
    const g = game;
    if (g.state !== 'play') return;
    g.t += dt;
    g.elapsed += dt;
    if (g.shake > 0) g.shake = Math.max(0, g.shake - dt * 60);

    // --- movimiento jugador ---
    const p = g.player;
    if (g.keys.has('arrowup') || g.keys.has('w')) movePlayer(-PLAYER_SPEED * dt);
    if (g.keys.has('arrowdown') || g.keys.has('s')) movePlayer(PLAYER_SPEED * dt);
    if (moveActive) {
      p.y += (p.targetY - p.y) * Math.min(1, dt * 18);
      p.y = clamp(p.y, 34, GROUND_Y - 8);
    }
    if (p.iFrames > 0) p.iFrames -= dt;

    // --- disparo activo (teclado / puntero / botón táctil) ---
    g.firing = g.fireSrc.key || g.fireSrc.pointer || g.fireSrc.btn;

    // --- furia / sobrecarga ---
    if (g.fury > 0) g.fury -= dt;
    if (has('overload') && p.hp <= 2 && g.state === 'play') g.fury = Math.max(g.fury, 0.15);
    if (has('sungod')) g.fury = Math.max(g.fury, 0.15);

    // --- disparo ---
    const wallEnabled = has('wall') && !has('inferno'); // el lanzallamas sustituye al muro
    if (g.firing) {
      g.spaceHeld += dt;
      if (wallEnabled) handleWall(dt);
      if (!g.wall) tryShoot();
    } else {
      g.spaceHeld = 0;
      if (g.wall) { g.wall = null; if (!has('bigwall')) g.wallCooldown = 3; }
    }
    if (g.wallCooldown > 0) g.wallCooldown -= dt;
    if (g.wall) {
      g.wall.t += dt;
      // daño continuo a robots que tocan el muro
      const wx = PLAYER_X + 40;
      const wide = has('bigwall') ? 44 : 26, tall = has('bigwall') ? 110 : 70;
      for (const en of g.enemies) {
        if (en.type !== 'elite' && Math.abs(en.x - wx) < wide && Math.abs(en.y - p.y) < tall) damageEnemy(en, 75 * dt, false, has('slow'), has('stun'));
      }
      if (!has('bigwall') && g.spaceHeld > 2.4) { g.wall = null; g.wallCooldown = 3; }
    }

    // --- escudo ---
    if (has('shield') && g.shield < g.shieldMax) {
      g.shieldRegen += dt;
      if (g.shieldRegen >= 8) { g.shield++; g.shieldRegen = 0; }
    }

    // --- fénix / meteoros / drones (mejorables) ---
    if (has('phoenix')) {
      g.phoenixTimer -= dt;
      if (g.phoenixTimer <= 0) {
        spawnPhoenix();
        if (has('phoenix2')) { spawnPhoenix(-60); g.phoenixTimer = 3.5; }
        else g.phoenixTimer = 6;
      }
    }
    if (has('meteor')) {
      g.meteorTimer -= dt;
      if (g.meteorTimer <= 0) {
        const n = has('meteor2') ? 6 : 3;
        spawnMeteors(n);
        g.meteorTimer = has('meteor2') ? 3.6 : 6.5;
      }
    }
    if (has('drone')) {
      const nD = has('drone2') ? 2 : 1;
      for (let d = 0; d < nD; d++) {
        const dr = g.drones[d] || (g.drones[d] = { y: p.y, t: 0 });
        dr.y += ((p.y + (d === 0 ? -52 : 52)) - dr.y) * Math.min(1, dt * 6);
        dr.t -= dt;
        if (dr.t <= 0) {
          const target = nearestEnemy(PLAYER_X, dr.y);
          if (target) {
            const ang = Math.atan2(target.y - dr.y, target.x - PLAYER_X);
            g.projectiles.push(makeBall(PLAYER_X + 10, dr.y, ang, 8, dmgBase() * 0.6, { small: true }));
            dr.t = 0.7;
          } else dr.t = 0.3;
        }
      }
    }

    // --- núcleo solar (mejorable a recargable / automático) ---
    const repeatable = has('solarcharge') || has('sungod');
    if (has('solar')) {
      if (repeatable) {
        g.solarCd -= dt;
        if (g.solarCd <= 0 && !g.solarSweep && g.enemies.length >= 2) {
          g.solarSweep = { x: PLAYER_X + 30 };
          audio.explosion(); g.shake = 14;
          g.solarCd = has('sungod') ? 5 : 9;
        }
      } else if (g.solarReady && g.killPoints / g.cfg.quota >= 0.55) {
        g.solarReady = false;
        g.solarSweep = { x: PLAYER_X + 30 };
        audio.explosion(); g.shake = 14;
      }
    }
    if (g.solarSweep) {
      g.solarSweep.x += 1500 * dt;
      for (const en of g.enemies) {
        if (Math.abs(en.x - g.solarSweep.x) < 60) damageEnemy(en, 400, true);
      }
      if (g.solarSweep.x > W + 80) g.solarSweep = null;
    }

    updateAbilities(dt);

    // --- spawn de enemigos ---
    if (g.killPoints < g.cfg.quota) {
      g.spawnTimer -= dt;
      if (g.spawnTimer <= 0) {
        for (let b = 0; b < g.cfg.batch; b++) spawnEnemy();
        g.spawnTimer = g.cfg.spawnInterval * (0.7 + Math.random() * 0.6);
      }
      if (g.cfg.elite && !g.eliteSpawned && g.killPoints / g.cfg.quota >= 0.45) {
        spawnElite();
        if (g.cfg.doubleElite) spawnElite();
        g.eliteSpawned = true;
      }
    }

    updateProjectiles(dt);
    updateEnemies(dt);
    updateBolts(dt);
    updateEffects(dt);

    // --- fin de nivel ---
    if (g.killPoints >= g.cfg.quota && g.enemies.every(e => e.type !== 'elite')) {
      // limpia lo que quede y termina
      finishLevel();
    }

    // HUD
    el.progressFill.style.width = Math.min(100, (g.killPoints / g.cfg.quota) * 100) + '%';
    el.hudHearts.textContent = '❤'.repeat(Math.max(0, p.hp)) + '♡'.repeat(Math.max(0, p.maxHp - p.hp));
    el.hudScore.textContent = g.score + ' pts';
  }

  // ---- Disparo ----
  function fireCooldown() {
    let cd = has('beam') ? 0.5 : 0.36;
    if (has('rapid')) cd *= 0.55;
    if (game.fury > 0) cd *= 0.5;
    if (has('sungod')) cd *= 0.7;
    return cd;
  }
  function dmgBase() {
    let d = has('beam') ? 16 : 12;
    if (has('power')) d *= 1.8;
    if (game.fury > 0) d *= 2;
    if (has('sungod')) d *= 1.6;
    return d;
  }
  function shotOpts() {
    return {
      pierce: has('pierce') || has('pierceexplode') || has('giant'),
      homing: has('homing'),
      explosive: has('explosive') || has('pierceexplode'),
      slow: has('slow'),
      stun: has('stun'),
      chain: has('chain'),
      flak: has('flak'),
      napalm: has('napalm'),
      giant: has('giant'),
    };
  }

  function tryShoot() {
    const g = game;
    if (has('inferno')) { infernoStream(); return; }   // el lanzallamas sustituye al disparo normal
    if (g.t - g.lastShot < fireCooldown()) return;
    g.lastShot = g.t;
    g.shotCount++;
    const px = PLAYER_X + 24, py = g.player.y;
    const d = dmgBase();
    const opts = shotOpts();

    if (has('beam')) {
      let angles = [0];
      if (has('splitbeam')) angles = [-0.26, 0, 0.26];
      if (has('beamsweep')) angles = [-0.5, -0.28, -0.1, 0.1, 0.28, 0.5];
      for (const a of angles) g.projectiles.push(makeBeam(px, py, a, d, opts));
      audio.beam();
    } else {
      let angles = [0];
      if (has('double')) angles = [-0.06, 0.06];
      if (has('triple')) angles = [-0.22, 0, 0.22];
      if (has('quad')) angles = [-0.3, -0.1, 0.1, 0.3];
      for (const a of angles) g.projectiles.push(makeBall(px, py, a, 9, d, opts));
      audio.shoot();
    }

    if (has('rear')) {
      g.projectiles.push(makeBall(PLAYER_X - 4, py, Math.PI, 8, d, opts));
      g.projectiles.push(makeBall(px, py, -2.5, 8, d, opts));
      g.projectiles.push(makeBall(px, py, 2.5, 8, d, opts));
    }
    if (has('bomb') && g.shotCount % 4 === 0) g.projectiles.push(makeBomb(px, py));
    if (has('missile') && g.shotCount % 5 === 0) {
      g.projectiles.push({
        type: 'missile', x: px, y: py, vx: 240, vy: 0, r: 11,
        dmg: d * 3, life: 3.2, homing: true, explosive: true,
        slow: opts.slow, stun: opts.stun, napalm: opts.napalm, hits: new Set(),
      });
    }
  }

  // Lanzallamas: cono corto de mucho daño mientras mantienes el disparo.
  function infernoStream() {
    const g = game, p = g.player;
    const reach = 190, dps = 260 * (g.fury > 0 ? 2 : 1);
    for (const e of g.enemies) {
      if (e.type === 'elite') continue;
      const dx = e.x - PLAYER_X;
      if (dx > 0 && dx < reach && Math.abs(e.y - p.y) < 44 + dx * 0.18) {
        damageEnemy(e, dps * (1 / 60), false, has('slow'), has('stun'));
      }
    }
    g.infernoOn = 0.06;
    if (g.t - g.lastShot > 0.09) { audio.shoot(); g.lastShot = g.t; }
  }

  function handleWall(dt) {
    const g = game;
    const noCd = has('bigwall');
    if (g.spaceHeld > 0.35 && !g.wall && (noCd || g.wallCooldown <= 0)) {
      g.wall = { t: 0 };
      audio.beam();
    }
  }

  // ---- Fábricas de proyectiles ----
  function makeBall(x, y, ang, speed, dmg, opts = {}) {
    let r = opts.small ? 5 : (opts.pierce || has('power') ? 9 : 7);
    if (opts.giant) { r *= 2.3; dmg *= 1.8; }
    return {
      type: 'ball', x, y,
      vx: Math.cos(ang) * speed * 60,
      vy: Math.sin(ang) * speed * 60,
      r, dmg, life: 2.4,
      pierce: opts.pierce, homing: opts.homing,
      explosive: opts.explosive, slow: opts.slow, stun: opts.stun,
      chain: opts.chain, flak: opts.flak, napalm: opts.napalm,
      flakT: 0.1, chained: 0,
      hits: new Set(),
    };
  }
  function makeBeam(x, y, ang, dmg, opts = {}) {
    let r = 7;
    if (has('bigbeam')) { r = 17; dmg *= 2.3; }
    return {
      type: 'beam', x, y,
      vx: Math.cos(ang) * 1500, vy: Math.sin(ang) * 1500,
      r, dmg, life: 0.8,
      pierce: true, explosive: opts.explosive, slow: opts.slow, stun: opts.stun,
      chain: opts.chain, napalm: opts.napalm,
      hits: new Set(),
    };
  }
  function makeBomb(x, y) {
    return { type: 'bomb', x, y, vx: 320, vy: -160, r: 9, dmg: 0, life: 4, grav: 620, hits: new Set() };
  }
  function spawnPhoenix(offY = 0) {
    game.projectiles.push({
      type: 'phoenix', x: PLAYER_X, y: clamp(game.player.y + offY, 40, GROUND_Y - 20),
      vx: 780, vy: 0, r: 22, dmg: 46, life: 2,
      pierce: true, explosive: true, slow: has('slow'), stun: has('stun'),
      hits: new Set(),
    });
    audio.beam();
  }
  function spawnMeteors(n = 3) {
    for (let i = 0; i < n; i++) {
      const x = W * 0.3 + Math.random() * W * 0.68;
      game.projectiles.push({
        type: 'meteor', x, y: -30 - i * 34,
        vx: -120, vy: 380, r: 12, dmg: 30, life: 4,
        explosive: true, slow: has('slow'), stun: has('stun'),
        napalm: has('napalm'), hits: new Set(),
      });
    }
  }

  function updateProjectiles(dt) {
    const g = game;
    for (let i = g.projectiles.length - 1; i >= 0; i--) {
      const pr = g.projectiles[i];
      pr.life -= dt;

      if (pr.type === 'bomb') {
        pr.vy += pr.grav * dt;
        pr.x += pr.vx * dt; pr.y += pr.vy * dt;
        if (pr.y >= GROUND_Y) { explode(pr.x, GROUND_Y, 78, 34, pr.slow, has('stun'), has('napalm')); g.projectiles.splice(i, 1); continue; }
      } else if (pr.type === 'meteor') {
        pr.x += pr.vx * dt; pr.y += pr.vy * dt;
        for (const en of g.enemies) {
          if (dist(pr.x, pr.y, en.x, en.y) < pr.r + en.r) { explode(pr.x, pr.y, 70, pr.dmg, pr.slow, pr.stun, pr.napalm); g.projectiles.splice(i, 1); pr._gone = true; break; }
        }
        if (pr._gone) continue;
        if (pr.y >= GROUND_Y) { explode(pr.x, GROUND_Y, 70, pr.dmg, pr.slow, pr.stun, pr.napalm); g.projectiles.splice(i, 1); continue; }
      } else {
        if (pr.homing && (pr.type === 'ball' || pr.type === 'missile')) {
          const target = nearestEnemy(pr.x, pr.y);
          if (target) {
            const desired = Math.atan2(target.y - pr.y, target.x - pr.x);
            const cur = Math.atan2(pr.vy, pr.vx);
            const sp = Math.hypot(pr.vx, pr.vy);
            const turn = pr.type === 'missile' ? 5 : 3.5;
            const na = cur + clamp(angDiff(desired, cur), -turn * dt, turn * dt);
            pr.vx = Math.cos(na) * sp; pr.vy = Math.sin(na) * sp;
          }
        }
        // metralla ardiente: suelta chispas de daño mientras vuela
        if (pr.flak) {
          pr.flakT -= dt;
          if (pr.flakT <= 0) {
            pr.flakT = 0.09;
            for (const s of [-1, 1]) g.projectiles.push({
              type: 'ball', x: pr.x, y: pr.y, vx: pr.vx * 0.2, vy: s * 220,
              r: 3, dmg: pr.dmg * 0.35, life: 0.35, hits: new Set(),
            });
          }
        }
        pr.x += pr.vx * dt; pr.y += pr.vy * dt;
      }

      // colisión con enemigos
      if (pr.type !== 'bomb') {
        for (const en of g.enemies) {
          if (pr.hits.has(en.id)) continue;
          if (dist(pr.x, pr.y, en.x, en.y) < pr.r + en.r) {
            pr.hits.add(en.id);
            damageEnemy(en, pr.dmg, false, pr.slow, pr.stun);
            audio.hitEnemy();
            spawnSpark(pr.x, pr.y);
            if (pr.chain && (pr.chained || 0) < 2) { pr.chained = (pr.chained || 0) + 1; chainZap(en, pr.dmg * 0.55); }
            if (pr.explosive) explode(pr.x, pr.y, pr.type === 'missile' ? 78 : 52, pr.dmg * 0.6, pr.slow, pr.stun, pr.napalm);
            if (!pr.pierce) { g.projectiles.splice(i, 1); pr._gone = true; break; }
          }
        }
        if (pr._gone) continue;
      }

      if (pr.life <= 0 || pr.x < -60 || pr.x > W + 80 || pr.y > H + 80 || pr.y < -80) {
        g.projectiles.splice(i, 1);
      }
    }
  }

  function chainZap(fromEnemy, dmg) {
    const g = game;
    let best = null, bd = 150;
    for (const e of g.enemies) {
      if (e === fromEnemy || e.type === 'elite') continue;
      const d = dist(fromEnemy.x, fromEnemy.y, e.x, e.y);
      if (d < bd) { bd = d; best = e; }
    }
    if (best) {
      damageEnemy(best, dmg, false, has('slow'), has('stun'));
      g.effects.push({ type: 'zap', x1: fromEnemy.x, y1: fromEnemy.y, x2: best.x, y2: best.y, t: 0 });
    }
  }

  function explode(x, y, radius, dmg, slow, stun, napalm) {
    const g = game;
    for (const en of g.enemies) {
      if (dist(x, y, en.x, en.y) < radius + en.r) damageEnemy(en, dmg, true, slow, stun);
    }
    g.effects.push({ type: 'boom', x, y, r: 4, max: radius, t: 0 });
    if (napalm) g.napalm.push({ x, y: Math.min(y, GROUND_Y - 2), t: 0, life: 3, r: Math.max(40, radius * 0.7) });
    audio.explosion();
    g.shake = Math.max(g.shake, 6);
  }

  // ---- Mejoras persistentes (orbe, napalm, minas, géiseres, torreta, aura, guardián) ----
  function updateAbilities(dt) {
    const g = game, p = g.player;
    if (g.infernoOn > 0) g.infernoOn -= dt;

    // brasas orbitales
    if (has('orbit')) {
      g.orbAng += dt * 4;
      for (let k = 0; k < 2; k++) {
        const a = g.orbAng + k * Math.PI;
        const ox = PLAYER_X + Math.cos(a) * 46, oy = p.y + Math.sin(a) * 46;
        for (const e of g.enemies) {
          if (e.type !== 'elite' && dist(ox, oy, e.x, e.y) < 14 + e.r) damageEnemy(e, 90 * dt, false, has('slow'), has('stun'));
        }
      }
    }

    // aura incandescente
    if (has('damageaura')) {
      const R = 78;
      for (const e of g.enemies) {
        if (e.type !== 'elite' && dist(PLAYER_X, p.y, e.x, e.y) < R + e.r) damageEnemy(e, 55 * dt, false, has('slow'), false);
      }
    }

    // napalm: charcos ardiendo en el suelo
    for (let i = g.napalm.length - 1; i >= 0; i--) {
      const pool = g.napalm[i];
      pool.t += dt;
      for (const e of g.enemies) {
        if (e.type === 'elite') continue;
        if (Math.abs(e.x - pool.x) < pool.r && e.y > GROUND_Y - 70) damageEnemy(e, 60 * dt, false, has('slow'), false);
      }
      if (pool.t >= pool.life) g.napalm.splice(i, 1);
    }

    // géiseres de fuego que brotan del suelo
    if (has('groundspike')) {
      g.spikeTimer -= dt;
      if (g.spikeTimer <= 0) {
        g.spikeTimer = 3.4;
        for (let k = 0; k < 3; k++) g.spikes.push({ x: 180 + Math.random() * (W - 260), t: 0 });
      }
      for (let i = g.spikes.length - 1; i >= 0; i--) {
        const sp = g.spikes[i];
        sp.t += dt;
        if (sp.t > 0.12 && sp.t < 0.6) {
          for (const e of g.enemies) {
            if (e.type !== 'elite' && Math.abs(e.x - sp.x) < 26 && e.y > GROUND_Y - 120) damageEnemy(e, 240 * dt, false, has('slow'), has('stun'));
          }
        }
        if (sp.t > 0.8) g.spikes.splice(i, 1);
      }
    }

    // minas flotantes
    if (has('airmine')) {
      g.mineTimer -= dt;
      if (g.mineTimer <= 0 && g.mines.length < 6) {
        g.mineTimer = 2.4;
        g.mines.push({ x: PLAYER_X + 70, y: 60 + Math.random() * (GROUND_Y - 160), life: 9 });
      }
      for (let i = g.mines.length - 1; i >= 0; i--) {
        const m = g.mines[i];
        m.life -= dt; m.x += 26 * dt;
        let boom = m.life <= 0;
        for (const e of g.enemies) {
          if ((e.type === 'flyer' || e.type === 'drone' || e.type === 'gunner') && dist(m.x, m.y, e.x, e.y) < 22 + e.r) { boom = true; break; }
        }
        if (boom) { explode(m.x, m.y, 74, 80, has('slow'), has('stun'), false); g.mines.splice(i, 1); }
      }
    }

    // torreta de fuego fija (cubre la parte alta mientras tú cubres el resto)
    if (has('turret')) {
      g.turretT -= dt;
      if (g.turretT <= 0) {
        const ty = 84;
        const target = nearestEnemy(PLAYER_X, ty);
        if (target) {
          const ang = Math.atan2(target.y - ty, target.x - PLAYER_X);
          g.projectiles.push(makeBall(PLAYER_X + 14, ty, ang, 9, dmgBase() * 0.8, shotOpts()));
          g.turretT = 0.45;
        } else g.turretT = 0.2;
      }
    }

    // dron guardián: frena al robot más próximo a la base
    if (has('guardian')) {
      let threat = null, tx = 220;
      for (const e of g.enemies) {
        if (e.type === 'elite') continue;
        if (e.x < tx) { tx = e.x; threat = e; }
      }
      if (threat) {
        g.guardian.y += (threat.y - g.guardian.y) * Math.min(1, dt * 8);
        if (Math.abs(g.guardian.y - threat.y) < 40) damageEnemy(threat, 260 * dt, false, has('slow'), true);
      } else {
        g.guardian.y += (p.y - g.guardian.y) * Math.min(1, dt * 4);
      }
    }
  }

  // ============================================================
  //  ENEMIGOS
  // ============================================================
  let enemyId = 1;

  function enemyBase(type) {
    const cfg = game.cfg;
    if (type === 'elite') return Math.round(150 + cfg.n * 20);   // curva propia, más suave al principio
    const S = { walker: 30, flyer: 18, gunner: 26, drone: 12, tank: 95 }[type];
    return Math.round(S * cfg.hpMul);
  }

  function spawnEnemy() {
    const g = game, cfg = g.cfg;
    const roll = Math.random();
    let type = 'walker';
    if (roll < 0.4) type = 'walker';
    else if (roll < 0.72) type = 'flyer';
    else if (roll < 0.85 && cfg.gunner) type = 'gunner';
    else if (roll < 0.95 && cfg.drone) type = 'drone';
    else if (cfg.tank) type = 'tank';
    else type = Math.random() < 0.5 ? 'walker' : 'flyer';
    addEnemy(type);
  }

  function spawnElite() { addEnemy('elite'); }

  function addEnemy(type) {
    const g = game, cfg = g.cfg;
    const spd = cfg.speedMul;
    let e = { id: enemyId++, type, x: W + 40, hp: enemyBase(type), maxHp: enemyBase(type), slowT: 0, hitFlash: 0, fireT: 1 + Math.random() };
    if (type === 'walker') { e.y = GROUND_Y - 20; e.r = 20; e.vx = -66 * spd; e.pts = 10; e.kp = 1; }
    else if (type === 'tank') { e.y = GROUND_Y - 28; e.r = 30; e.vx = -34 * spd; e.pts = 60; e.kp = 2; }
    else if (type === 'flyer') { e.y = 60 + Math.random() * (GROUND_Y - 140); e.r = 17; e.vx = -104 * spd; e.baseY = e.y; e.wob = Math.random() * 6; e.pts = 12; e.kp = 1; }
    else if (type === 'gunner') { e.y = 60 + Math.random() * (GROUND_Y - 160); e.r = 19; e.vx = -60 * spd; e.pts = 25; e.kp = 1; e.shooter = true; }
    else if (type === 'drone') { e.y = 50 + Math.random() * (GROUND_Y - 120); e.r = 12; e.vx = -150 * spd; e.baseY = e.y; e.wob = Math.random() * 6; e.pts = 18; e.kp = 1; }
    else if (type === 'elite') { e.y = H / 2; e.r = 44; e.vx = -26 * spd; e.pts = 220; e.kp = 6; e.shooter = true; e.fireT = 1.5; }
    g.enemies.push(e);
    g.spawned++;
  }

  function updateEnemies(dt) {
    const g = game, p = g.player;
    for (let i = g.enemies.length - 1; i >= 0; i--) {
      const e = g.enemies[i];
      let slowMul = e.slowT > 0 ? 0.45 : 1;
      if (e.slowT > 0) e.slowT -= dt;
      if (e.stunT > 0) { e.stunT -= dt; slowMul = 0; }
      if (e.hitFlash > 0) e.hitFlash -= dt;
      if (has('slowfield') && e.x < W * 0.5) slowMul *= 0.55;

      e.x += e.vx * slowMul * dt;

      if (e.type === 'flyer' || e.type === 'drone') {
        e.y = e.baseY + Math.sin(g.t * 3 + e.wob) * 26;
      } else if (e.type === 'elite') {
        e.y = H / 2 + Math.sin(g.t * 1.3) * (H / 2 - 70);
        if (e.x < W - 150) e.x = W - 150; // se queda a la derecha
      }

      // disparo de robots armados
      if (e.shooter) {
        e.fireT -= dt;
        if (e.fireT <= 0 && e.x < W - 20) {
          const ang = Math.atan2(p.y - e.y, PLAYER_X - e.x);
          if (e.type === 'elite') {
            const arms = g.level >= 20 ? [-0.28, 0, 0.28] : [-0.24, 0.24];
            for (const a of arms) {
              g.enemyBolts.push({ x: e.x, y: e.y, vx: Math.cos(ang + a) * 230, vy: Math.sin(ang + a) * 230, r: 7 });
            }
            e.fireT = Math.max(1.1, 2.6 - g.level * 0.03);
          } else {
            g.enemyBolts.push({ x: e.x, y: e.y, vx: Math.cos(ang) * 240, vy: Math.sin(ang) * 240, r: 6 });
            e.fireT = 1.7 + Math.random();
          }
        }
      }

      // El robot élite nunca alcanza tu zona: solo dispara desde la derecha.
      if (e.type === 'elite') { if (e.x < -80) g.enemies.splice(i, 1); continue; }

      // Choque contra TU pistola (te interpones en su camino): pierdes 1 vida
      // y el robot se destruye. Sirve como último recurso.
      if (Math.abs(e.x - PLAYER_X) < e.r + 15 && Math.abs(e.y - p.y) < e.r + 18) {
        hitPlayer();
        killEnemy(e, i, false);
        continue;
      }
      // El robot te ha esquivado y toca tu CUARTEL GENERAL (borde izquierdo):
      // derrota inmediata, sin importar las vidas que te queden.
      if (e.x - e.r <= BASE_X) {
        loseBase();
        return;
      }

      if (e.x < -80) { g.enemies.splice(i, 1); }
    }
  }

  function damageEnemy(e, dmg, fromExplosion, slow, stun) {
    if (e._dead) return;
    e.hp -= dmg;
    e.hitFlash = 0.08;
    if (slow) e.slowT = 2;
    if (stun) e.stunT = Math.max(e.stunT || 0, 0.6);
    if (e.hp <= 0) {
      e._dead = true;
      const idx = game.enemies.indexOf(e);
      if (idx > -1) killEnemy(e, idx, true);
    }
  }

  function killEnemy(e, idx, byPlayer) {
    const g = game;
    g.enemies.splice(idx, 1);
    if (byPlayer) {
      g.killPoints += e.kp;
      g.score += e.pts + (g.fury > 0 ? Math.round(e.pts * 0.5) : 0);
      g.floaters.push({ x: e.x, y: e.y, text: '+' + e.pts, t: 0 });
      if (has('overdrive') && g.fury <= 0 && !has('sungod')) {
        const gain = (e.type === 'elite' ? 40 : e.type === 'tank' ? 14 : 7) * (has('overdrive2') ? 1.7 : 1);
        g.heat = Math.min(100, g.heat + gain);
        if (g.heat >= 100) { g.fury = has('overdrive2') ? 8 : 5; g.heat = 0; audio.unlock(); }
      }
      if (has('lifesteal')) {
        g.killsSinceHeal++;
        if (g.killsSinceHeal >= 15 && g.player.hp < g.player.maxHp) {
          g.player.hp++; g.killsSinceHeal = 0;
          g.floaters.push({ x: PLAYER_X + 20, y: g.player.y - 20, text: '+1 ❤', t: 0 });
        }
      }
      for (let k = 0; k < 6; k++) spawnSpark(e.x, e.y);
      g.effects.push({ type: 'boom', x: e.x, y: e.y, r: 3, max: e.r + 14, t: 0 });
    }
  }

  function updateBolts(dt) {
    const g = game, p = g.player;
    const canReflect = has('reflect');
    for (let i = g.enemyBolts.length - 1; i >= 0; i--) {
      const b = g.enemyBolts[i];
      b.x += b.vx * dt; b.y += b.vy * dt;

      if (b.friendly) {
        for (const e of g.enemies) {
          if (e.type === 'elite') continue;
          if (dist(b.x, b.y, e.x, e.y) < b.r + e.r) { damageEnemy(e, 24, false, has('slow'), has('stun')); g.enemyBolts.splice(i, 1); b._gone = true; break; }
        }
        if (b._gone) continue;
        if (b.x < -30 || b.x > W + 30 || b.y < -30 || b.y > H + 30) g.enemyBolts.splice(i, 1);
        continue;
      }

      const dToPlayer = dist(b.x, b.y, PLAYER_X, p.y);
      if (canReflect && !b.reflected && dToPlayer < 46) {
        // el aura espejo devuelve el disparo
        b.reflected = true; b.friendly = true;
        const sp = Math.hypot(b.vx, b.vy);
        b.vx = Math.abs(b.vx) || sp; b.vy *= -0.3;
        continue;
      }
      if (dToPlayer < b.r + 15) {
        g.enemyBolts.splice(i, 1);
        hitPlayer();
        continue;
      }
      if (b.x < -30 || b.x > W + 30 || b.y < -30 || b.y > H + 30) g.enemyBolts.splice(i, 1);
    }
  }

  function hitPlayer() {
    const g = game, p = g.player;
    if (p.iFrames > 0 || g.state !== 'play') return;
    if (has('shield') && g.shield > 0) {
      g.shield--; g.shieldRegen = 0;
      p.iFrames = 0.6;
      audio.hitEnemy();
      g.shake = 6;
      if (has('shockwave')) doShockwave();
      return;
    }
    p.hp--;
    p.iFrames = 1.2;
    g.shake = 12;
    flash();
    audio.playerHit();
    if (has('shockwave')) doShockwave();
    if (p.hp <= 0) gameOver();
  }

  function doShockwave() {
    const g = game, p = g.player;
    for (const e of g.enemies) {
      if (e.type === 'elite') continue;
      if (dist(PLAYER_X, p.y, e.x, e.y) < 300) {
        damageEnemy(e, 70, true, has('slow'), true);
        e.x += 60;
      }
    }
    g.effects.push({ type: 'boom', x: PLAYER_X, y: p.y, r: 8, max: 300, t: 0 });
  }

  function updateEffects(dt) {
    const g = game;
    for (let i = g.effects.length - 1; i >= 0; i--) {
      const f = g.effects[i];
      f.t += dt;
      if (f.max !== undefined) f.r += (f.max - f.r) * Math.min(1, dt * 10);
      if (f.type === 'spark') { f.x += f.vx * dt; f.y += f.vy * dt; }
      if (f.t > (f.type === 'zap' ? 0.14 : 0.4)) g.effects.splice(i, 1);
    }
    for (let i = g.floaters.length - 1; i >= 0; i--) {
      const fl = g.floaters[i];
      fl.t += dt; fl.y -= 30 * dt;
      if (fl.t > 0.8) g.floaters.splice(i, 1);
    }
  }

  function spawnSpark(x, y) {
    game.effects.push({
      type: 'spark', x, y,
      vx: (Math.random() - 0.5) * 260, vy: (Math.random() - 0.5) * 260,
      r: 2 + Math.random() * 2, t: 0, max: 0,
    });
  }

  function nearestEnemy(x, y) {
    let best = null, bd = Infinity;
    for (const e of game.enemies) {
      if (e.x < x) continue;
      const d = dist(x, y, e.x, e.y);
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  }

  // ============================================================
  //  RENDER
  // ============================================================
  function render() {
    const g = game;
    ctx.save();
    if (g && g.shake > 0) {
      ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
    }

    // fondo
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#241539');
    sky.addColorStop(0.6, '#3a1836');
    sky.addColorStop(1, '#7a2417');
    ctx.fillStyle = sky;
    ctx.fillRect(-30, -30, W + 60, H + 60);

    // estrellas / brasas de fondo
    ctx.fillStyle = 'rgba(255,180,80,0.5)';
    for (let i = 0; i < 40; i++) {
      const x = (i * 197 + (g ? g.t * 12 : 0) * ((i % 3) + 1)) % (W + 40) - 20;
      const y = (i * 313) % (GROUND_Y - 40) + 10;
      ctx.fillRect(W - x, y, 2, 2);
    }

    // suelo
    ctx.fillStyle = '#2a1a12';
    ctx.fillRect(-30, GROUND_Y, W + 60, H - GROUND_Y + 30);
    ctx.strokeStyle = '#ff7a3d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-30, GROUND_Y);
    ctx.lineTo(W + 30, GROUND_Y);
    ctx.stroke();

    // cuartel general (muro del borde izquierdo que debes proteger)
    const baseHit = g && g.state === 'dead' && g._baseLost;
    ctx.fillStyle = baseHit ? '#7a1e12' : '#3b2a1f';
    ctx.fillRect(-30, 0, BASE_X + 30, H);
    ctx.fillStyle = '#54402f';
    for (let by = 6; by < H; by += 26) {
      ctx.fillRect(-30, by, BASE_X + 26, 12);
    }
    ctx.fillStyle = baseHit ? '#ff5252' : '#ffb300';
    ctx.fillRect(BASE_X - 4, 0, 4, H);
    // emblema del cuartel
    ctx.fillStyle = baseHit ? '#ff5252' : '#ff7a3d';
    ctx.beginPath();
    ctx.arc(BASE_X / 2 - 3, H / 2, 9, 0, 7);
    ctx.fill();

    if (!g) { ctx.restore(); return; }

    // muro de fuego
    if (g.wall) {
      const wx = PLAYER_X + 40;
      const half = has('bigwall') ? 30 : 16, tall = has('bigwall') ? 120 : 74;
      const grad = ctx.createLinearGradient(wx - half, 0, wx + half, 0);
      grad.addColorStop(0, 'rgba(255,120,0,0.15)');
      grad.addColorStop(0.5, 'rgba(255,200,60,0.85)');
      grad.addColorStop(1, 'rgba(255,120,0,0.15)');
      ctx.fillStyle = grad;
      const wob = Math.sin(g.t * 30) * 4;
      ctx.fillRect(wx - half + wob, g.player.y - tall, half * 2, tall * 2);
    }

    // rayo solar
    if (g.solarSweep) {
      ctx.fillStyle = 'rgba(255,230,120,0.85)';
      ctx.fillRect(g.solarSweep.x - 55, -30, 110, H + 60);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillRect(g.solarSweep.x - 18, -30, 36, H + 60);
    }

    drawAbilities(g);

    // proyectiles
    for (const pr of g.projectiles) drawProjectile(pr);

    // enemigos
    for (const e of g.enemies) drawEnemy(e);

    // balas enemigas
    for (const b of g.enemyBolts) {
      ctx.fillStyle = '#6ff';
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(120,255,255,0.4)';
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r + 3, 0, 7); ctx.fill();
    }

    // efectos
    for (const f of g.effects) {
      if (f.type === 'boom') {
        ctx.strokeStyle = `rgba(255,170,60,${Math.max(0, 1 - f.t / 0.4)})`;
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 7); ctx.stroke();
        ctx.fillStyle = `rgba(255,230,140,${Math.max(0, 0.5 - f.t)})`;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 0.6, 0, 7); ctx.fill();
      } else if (f.type === 'spark') {
        ctx.fillStyle = `rgba(255,${150 + Math.random() * 80 | 0},60,${Math.max(0, 1 - f.t / 0.4)})`;
        ctx.fillRect(f.x, f.y, f.r, f.r);
      } else if (f.type === 'zap') {
        ctx.strokeStyle = `rgba(120,200,255,${Math.max(0, 1 - f.t / 0.14)})`;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(f.x1, f.y1); ctx.lineTo(f.x2, f.y2); ctx.stroke();
      }
    }

    // drones de combate
    if (has('drone')) {
      for (const dr of g.drones) {
        ctx.fillStyle = '#cfd8dc';
        roundRect(PLAYER_X - 12, dr.y - 8, 24, 16, 4); ctx.fill();
        ctx.fillStyle = '#ff5722';
        ctx.beginPath(); ctx.arc(PLAYER_X + 10, dr.y, 3, 0, 7); ctx.fill();
      }
    }

    // jugador (pistola de fuego)
    drawPlayer();

    // floaters
    ctx.font = 'bold 14px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    for (const fl of g.floaters) {
      ctx.fillStyle = `rgba(255,214,120,${1 - fl.t / 0.8})`;
      ctx.fillText(fl.text, fl.x, fl.y);
    }
    ctx.textAlign = 'left';

    // barra de sobrecarga
    if (has('overdrive') && !has('sungod')) {
      const furyMax = has('overdrive2') ? 8 : 5;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(14, H - 22, 160, 10);
      ctx.fillStyle = g.fury > 0 ? '#ff2d2d' : '#ffb300';
      const w = g.fury > 0 ? (g.fury / furyMax) * 156 : (g.heat / 100) * 156;
      ctx.fillRect(16, H - 20, Math.max(0, w), 6);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Segoe UI, sans-serif';
      ctx.fillText(g.fury > 0 ? (has('overload') && g.player.hp <= 2 ? 'NÚCLEO INESTABLE' : 'FURIA') : 'CALOR', 16, H - 26);
    } else if (has('sungod')) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Segoe UI, sans-serif';
      ctx.fillText('☀ DIOS DEL SOL', 16, H - 16);
    }

    ctx.restore();
  }

  // Dibuja las mejoras persistentes (napalm, géiseres, minas, orbe, torreta, guardián, aura, lanzallamas).
  function drawAbilities(g) {
    const p = g.player;

    if (has('slowfield')) {
      ctx.fillStyle = 'rgba(120,180,255,0.06)';
      ctx.fillRect(BASE_X, 0, W * 0.5 - BASE_X, GROUND_Y);
    }

    // napalm
    for (const pool of g.napalm) {
      const a = Math.max(0, 1 - pool.t / pool.life);
      for (let k = -pool.r; k < pool.r; k += 10) {
        const h = 10 + Math.abs(Math.sin((g.t * 12 + k) * 0.5)) * 16;
        ctx.fillStyle = `rgba(255,${120 + Math.random() * 90 | 0},20,${a * 0.7})`;
        ctx.fillRect(pool.x + k, GROUND_Y - h, 8, h);
      }
    }

    // géiseres
    for (const sp of g.spikes) {
      const grow = Math.sin(Math.min(1, sp.t / 0.3) * Math.PI) ;
      const h = 130 * Math.max(0.1, grow);
      const grd = ctx.createLinearGradient(0, GROUND_Y, 0, GROUND_Y - h);
      grd.addColorStop(0, '#ffd27a');
      grd.addColorStop(1, 'rgba(255,87,34,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(sp.x - 16, GROUND_Y - h, 32, h);
    }

    // minas
    for (const m of g.mines) {
      ctx.fillStyle = '#ffca28';
      ctx.beginPath(); ctx.arc(m.x, m.y, 6, 0, 7); ctx.fill();
      ctx.strokeStyle = `rgba(255,120,0,${0.4 + 0.4 * Math.sin(g.t * 10)})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(m.x, m.y, 11, 0, 7); ctx.stroke();
    }

    // aura incandescente
    if (has('damageaura')) {
      ctx.strokeStyle = `rgba(255,140,40,${0.25 + 0.15 * Math.sin(g.t * 8)})`;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(PLAYER_X, p.y, 78, 0, 7); ctx.stroke();
    }

    // lanzallamas
    if (g.infernoOn > 0) {
      const grd = ctx.createLinearGradient(PLAYER_X, 0, PLAYER_X + 190, 0);
      grd.addColorStop(0, 'rgba(255,240,180,0.9)');
      grd.addColorStop(0.5, 'rgba(255,150,40,0.5)');
      grd.addColorStop(1, 'rgba(255,87,34,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(PLAYER_X + 16, p.y - 10);
      ctx.lineTo(PLAYER_X + 200, p.y - 52);
      ctx.lineTo(PLAYER_X + 200, p.y + 52);
      ctx.lineTo(PLAYER_X + 16, p.y + 10);
      ctx.closePath(); ctx.fill();
    }

    // brasas orbitales
    if (has('orbit')) {
      for (let k = 0; k < 2; k++) {
        const a = g.orbAng + k * Math.PI;
        const ox = PLAYER_X + Math.cos(a) * 46, oy = p.y + Math.sin(a) * 46;
        const grd = ctx.createRadialGradient(ox, oy, 1, ox, oy, 12);
        grd.addColorStop(0, '#fff3c4'); grd.addColorStop(1, 'rgba(255,87,34,0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(ox, oy, 12, 0, 7); ctx.fill();
      }
    }

    // torreta de fuego en la base
    if (has('turret')) {
      ctx.fillStyle = '#455a64';
      roundRect(BASE_X - 2, 72, 20, 26, 4); ctx.fill();
      ctx.fillStyle = '#ff7043';
      ctx.fillRect(BASE_X + 14, 82, 16, 6);
    }

    // dron guardián
    if (has('guardian')) {
      const gy = g.guardian.y;
      ctx.fillStyle = '#4ec3e0';
      roundRect(150, gy - 10, 26, 20, 5); ctx.fill();
      ctx.strokeStyle = 'rgba(120,220,255,0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(163, gy, 16, 0, 7); ctx.stroke();
    }
  }

  function drawPlayer() {
    const g = game, p = g.player;
    const blink = p.iFrames > 0 && Math.floor(g.t * 20) % 2 === 0;
    ctx.save();
    ctx.translate(PLAYER_X, p.y);
    if (blink) ctx.globalAlpha = 0.4;

    // escudo
    if (has('shield') && g.shield > 0) {
      ctx.strokeStyle = 'rgba(255,170,60,0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 26, 0, 7); ctx.stroke();
    }

    // cuerpo de la pistola
    ctx.fillStyle = g.fury > 0 ? '#ff3d00' : '#37474f';
    roundRect(-18, -12, 24, 24, 5); ctx.fill();
    // cañón
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(2, -6, 26, 12);
    // empuñadura
    ctx.fillStyle = '#263238';
    ctx.fillRect(-14, 8, 10, 16);

    // llama en la boca
    const fl = 6 + Math.sin(g.t * 40) * 3;
    const grd = ctx.createRadialGradient(30, 0, 1, 30, 0, 16 + fl);
    grd.addColorStop(0, '#fff3c4');
    grd.addColorStop(0.4, '#ffb300');
    grd.addColorStop(1, 'rgba(255,87,34,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(30, 0, 16 + fl, 0, 7); ctx.fill();

    ctx.restore();
  }

  function drawProjectile(pr) {
    ctx.save();
    if (pr.type === 'beam') {
      const ang = Math.atan2(pr.vy, pr.vx);
      ctx.translate(pr.x, pr.y);
      ctx.rotate(ang);
      const grad = ctx.createLinearGradient(-90, 0, 20, 0);
      grad.addColorStop(0, 'rgba(255,120,0,0)');
      grad.addColorStop(1, '#fff3c4');
      ctx.fillStyle = grad;
      ctx.fillRect(-90, -pr.r, 110, pr.r * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(-90, -2, 110, 4);
    } else if (pr.type === 'phoenix') {
      const grd = ctx.createRadialGradient(pr.x, pr.y, 2, pr.x, pr.y, pr.r + 8);
      grd.addColorStop(0, '#fff');
      grd.addColorStop(0.4, '#ffca28');
      grd.addColorStop(1, 'rgba(255,61,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(pr.x, pr.y, pr.r + 8, 0, 7); ctx.fill();
      ctx.fillStyle = '#ff7043';
      ctx.beginPath();
      ctx.moveTo(pr.x - 18, pr.y);
      ctx.lineTo(pr.x + 10, pr.y - 14);
      ctx.lineTo(pr.x + 4, pr.y);
      ctx.lineTo(pr.x + 10, pr.y + 14);
      ctx.closePath(); ctx.fill();
    } else {
      const grd = ctx.createRadialGradient(pr.x, pr.y, 1, pr.x, pr.y, pr.r + 4);
      grd.addColorStop(0, '#fff3c4');
      grd.addColorStop(0.5, pr.type === 'bomb' ? '#ff9800' : '#ff7043');
      grd.addColorStop(1, 'rgba(255,87,34,0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(pr.x, pr.y, pr.r + 4, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(pr.x, pr.y, pr.r * 0.5, 0, 7); ctx.fill();
    }
    ctx.restore();
  }

  function drawEnemy(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    const flash = e.hitFlash > 0;
    const bodyCol = flash ? '#fff' : (e.slowT > 0 ? '#6d8ea0' : '#90a4ae');

    if (e.type === 'walker' || e.type === 'tank') {
      const w = e.type === 'tank' ? 52 : 34;
      const h = e.type === 'tank' ? 44 : 32;
      // patas
      ctx.fillStyle = '#455a64';
      ctx.fillRect(-w / 2 + 3, h / 2 - 4, 6, 12);
      ctx.fillRect(w / 2 - 9, h / 2 - 4, 6, 12);
      // cuerpo
      ctx.fillStyle = bodyCol;
      roundRect(-w / 2, -h / 2, w, h, 6); ctx.fill();
      // ojo
      ctx.fillStyle = flash ? '#333' : '#ff1744';
      ctx.fillRect(-w / 2 + 6, -h / 4, w - 12, 6);
      // antena
      ctx.strokeStyle = '#455a64'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, -h / 2); ctx.lineTo(0, -h / 2 - 8); ctx.stroke();
    } else if (e.type === 'elite') {
      ctx.fillStyle = bodyCol;
      roundRect(-40, -40, 80, 80, 12); ctx.fill();
      ctx.fillStyle = '#37474f';
      roundRect(-40, -40, 80, 80, 12); ctx.lineWidth = 4; ctx.strokeStyle = '#ff5722'; ctx.stroke();
      ctx.fillStyle = flash ? '#333' : '#ff1744';
      ctx.beginPath(); ctx.arc(0, -4, 14, 0, 7); ctx.fill();
      ctx.fillStyle = '#ffca28';
      ctx.fillRect(-30, 22, 60, 6);
    } else {
      // voladores: cuerpo + rotor
      ctx.strokeStyle = '#cfd8dc'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-e.r - 6, -e.r); ctx.lineTo(e.r + 6, -e.r); ctx.stroke();
      ctx.fillStyle = bodyCol;
      if (e.type === 'drone') { roundRect(-e.r, -e.r + 4, e.r * 2, e.r * 1.6, 4); ctx.fill(); }
      else { ctx.beginPath(); ctx.arc(0, 0, e.r, 0, 7); ctx.fill(); }
      ctx.fillStyle = flash ? '#333' : (e.type === 'gunner' ? '#ffea00' : '#ff1744');
      ctx.beginPath(); ctx.arc(0, 0, e.r * 0.4, 0, 7); ctx.fill();
      if (e.type === 'gunner') { ctx.fillStyle = '#455a64'; ctx.fillRect(-e.r - 8, -3, 10, 6); }
    }

    // barra de vida
    if (e.hp < e.maxHp) {
      const bw = Math.max(24, e.r * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(-bw / 2, -e.r - 16, bw, 4);
      ctx.fillStyle = '#ff5252';
      ctx.fillRect(-bw / 2, -e.r - 16, bw * Math.max(0, e.hp / e.maxHp), 4);
    }
    ctx.restore();
  }

  // ============================================================
  //  FLUJO DE NIVELES
  // ============================================================
  function startLevel(level) {
    newGame(level);
    paused = false;
    hideOverlay('pause');
    showScreen('game');
    el.hudLevelName.textContent = 'Nivel ' + level;
    el.progressFill.style.width = '0%';
    showAbilityToast('Mejora activa: ' + ABILITIES[level - 1].name);
    startLoop();
    checkOrientation(); // si el móvil está en vertical, pausa hasta que gire
  }

  function finishLevel() {
    const g = game;
    if (g.state !== 'play') return;
    g.state = 'done';
    stopLoop();
    audio.levelComplete();

    // bonus de tiempo y vida
    const timeBonus = Math.max(0, Math.round(600 - g.elapsed * 4));
    const hpBonus = g.player.hp * 120;
    g.score += timeBonus + hpBonus;

    const isRecord = store.setBest(g.level, g.score);
    store.setProgress(g.level + 1);

    el.lcScore.textContent = 'Puntuación: ' + g.score + ' pts';
    el.lcTime.textContent = 'Tiempo: ' + g.elapsed.toFixed(1) + ' s  ·  Vidas: ' + g.player.hp;
    el.lcRecord.style.display = isRecord ? 'block' : 'none';

    if (g.level < TOTAL_LEVELS) {
      const next = ABILITIES[g.level]; // mejora del siguiente nivel
      el.lcUnlock.style.display = 'block';
      el.lcUnlockName.textContent = next.name;
      el.lcUnlockDesc.textContent = next.desc;
      el.btnNextOrMenu.textContent = 'Nivel ' + (g.level + 1) + ' →';
      audio.unlock();
    } else {
      el.lcUnlock.style.display = 'none';
      el.btnNextOrMenu.textContent = 'Final';
    }
    showScreen('levelcomplete');
  }

  function gameOver() {
    const g = game;
    if (g.state === 'dead') return;
    g.state = 'dead';
    stopLoop();
    audio.gameOver();
    el.goTitle.textContent = 'Te han fundido';
    el.goInfo.textContent = 'Sin vidas · Nivel ' + g.level + ' · ' + g.score + ' pts · ' + g.killPoints + '/' + g.cfg.quota + ' robots';
    showScreen('gameover');
  }

  function loseBase() {
    const g = game;
    if (g.state === 'dead') return;
    g.state = 'dead';
    g._baseLost = true;
    g.shake = 22;
    stopLoop();
    flash();
    audio.gameOver();
    render();
    el.goTitle.textContent = 'Tu cuartel general ha caído';
    el.goInfo.textContent = 'Un robot cruzó tu base · Nivel ' + g.level + ' · ' + g.score + ' pts · ' + g.killPoints + '/' + g.cfg.quota + ' robots';
    showScreen('gameover');
  }

  // ============================================================
  //  MENÚ / UI
  // ============================================================
  function renderMenu() {
    const progress = store.getProgress();
    el.levelList.innerHTML = '';
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      const locked = i > progress;
      const item = document.createElement('button');
      item.className = 'level-item' + (locked ? ' locked' : '');
      const best = store.getBest(i);
      item.innerHTML =
        '<span class="level-num">Nivel ' + i + (locked ? ' 🔒' : '') + '</span>' +
        '<span class="level-ability">' + (locked ? '???' : ABILITIES[i - 1].name) + '</span>' +
        '<span class="level-best">' + (best ? 'Récord: ' + best : '—') + '</span>';
      if (!locked) item.addEventListener('click', () => { audio.ensureContext(); startLevel(i); });
      el.levelList.appendChild(item);
    }
  }

  function refreshSoundButtons() {
    el.btnMute.textContent = 'Sonido: ' + (audio.enabled ? 'ON' : 'OFF');
    el.btnToggleSound.textContent = 'Sonido: ' + (audio.enabled ? 'ON' : 'OFF');
    el.btnToggleHaptic.textContent = 'Vibración: ' + (audio.hapticEnabled ? 'ON' : 'OFF');
    el.volumeRange.value = Math.round(audio.volume * 100);
  }

  let paused = false;
  function togglePause() {
    if (!game || game.state !== 'play') return;
    paused = !paused;
    if (paused) { stopLoop(); showOverlay('pause'); }
    else { hideOverlay('pause'); startLoop(); }
  }

  function flash() {
    el.flashOverlay.classList.add('show');
    setTimeout(() => el.flashOverlay.classList.remove('show'), 90);
  }

  let toastTimer = null;
  function showAbilityToast(text) {
    el.abilityToast.textContent = text;
    el.abilityToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.abilityToast.classList.remove('show'), 2200);
  }

  // ---- Listeners de UI ----
  el.btnInstructions.addEventListener('click', () => { overlayReturn = 'menu'; showOverlay('instructions'); });
  el.btnCloseInstructions.addEventListener('click', () => hideOverlay('instructions'));
  el.btnPauseInstructions.addEventListener('click', () => showOverlay('instructions'));

  el.btnSettings.addEventListener('click', () => showOverlay('settings'));
  el.btnCloseSettings.addEventListener('click', () => hideOverlay('settings'));
  el.btnToggleSound.addEventListener('click', () => { audio.setEnabled(!audio.enabled); refreshSoundButtons(); });
  el.btnToggleHaptic.addEventListener('click', () => { audio.setHaptic(!audio.hapticEnabled); refreshSoundButtons(); });
  el.btnMute.addEventListener('click', () => { audio.setEnabled(!audio.enabled); refreshSoundButtons(); });
  el.volumeRange.addEventListener('input', () => { audio.setVolume(el.volumeRange.value / 100); });

  el.btnPause.addEventListener('click', togglePause);
  el.btnResume.addEventListener('click', togglePause);
  el.btnRestartLevel.addEventListener('click', () => { paused = false; hideOverlay('pause'); startLevel(game.level); });
  el.btnPauseMenu.addEventListener('click', () => { paused = false; hideOverlay('pause'); stopLoop(); game = null; renderMenu(); showScreen('menu'); });
  el.btnMenuFromGame.addEventListener('click', () => { stopLoop(); game = null; renderMenu(); showScreen('menu'); });

  el.btnRetryLevel.addEventListener('click', () => startLevel(game.level));
  el.btnNextOrMenu.addEventListener('click', () => {
    const lvl = game.level;
    if (lvl < TOTAL_LEVELS) startLevel(lvl + 1);
    else {
      el.vicScore.textContent = 'Puntuación del nivel 20: ' + game.score + ' pts';
      showScreen('victory');
    }
  });

  el.btnRetryFromOver.addEventListener('click', () => startLevel(game.level));
  el.btnOverMenu.addEventListener('click', () => { game = null; renderMenu(); showScreen('menu'); });
  el.btnVictoryMenu.addEventListener('click', () => { game = null; renderMenu(); showScreen('menu'); });

  // Easter egg: 5 toques al título desbloquean todo
  let titleTaps = 0, titleTapT = 0;
  el.gameTitle.addEventListener('click', () => {
    const now = Date.now();
    if (now - titleTapT > 1200) titleTaps = 0;
    titleTapT = now;
    titleTaps++;
    if (titleTaps >= 5) {
      store.unlockAll();
      renderMenu();
      titleTaps = 0;
      el.gameTitle.textContent = 'FIRE LAND 🔓';
      setTimeout(() => el.gameTitle.textContent = 'FIRE LAND', 1200);
    }
  });

  // ============================================================
  //  UTILIDADES
  // ============================================================
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function dist(x1, y1, x2, y2) { return Math.hypot(x1 - x2, y1 - y2); }
  function angDiff(a, b) {
    let d = a - b;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ---- Arranque ----
  refreshSoundButtons();
  renderMenu();
  render(); // pinta el fondo del canvas aunque no haya partida

  // Hook mínimo para pruebas automáticas (no afecta al juego).
  window.FireLand = {
    ABILITIES,
    startLevel,
    step: dt => update(dt),
    draw: () => render(),
    get game() { return game; },
    set input(v) { if (game) game.fireSrc.key = !!v; },
  };
})();
