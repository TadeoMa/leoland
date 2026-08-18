/* Sushi Family — motor del juego (estilo Geometry Dash, temática sushi).
   Prototipo básico: 2 niveles, 2 tipos de sushi. Diseñado para poder
   añadir más FOOD_TYPES y LEVELS sin tocar el motor. */

const LOGICAL_W = 900;
const LOGICAL_H = 380;
const GROUND_HEIGHT = 70;
const GROUND_TOP = LOGICAL_H - GROUND_HEIGHT;
const PLAYER_SIZE = 42;
const PLAYER_SCREEN_X = 130;
const GRAVITY = 2600;
const JUMP_VELOCITY = -900;

/* ===== Catálogo de tipos de sushi (personajes jugables) ===== */
const FOOD_TYPES = {
  nigiri: {
    id: 'nigiri',
    name: 'Nigiri',
    icon: '🍙',
    shape: 'nigiri',
    speedMultiplier: 1,
    jumpMultiplier: 1,
    canAccelerate: false,
    bodyColor: '#FFFFFF',
    topColor: '#FF6B3D',
    desc: 'El nigiri de siempre. Sin habilidades especiales, solo salta.',
    stats: [
      { label: 'Velocidad', value: 'Normal' },
      { label: 'Salto', value: 'Normal' },
      { label: 'Habilidad especial', value: 'Ninguna' }
    ]
  },
  butterfish: {
    id: 'butterfish',
    name: 'Nigiri de pez mantequilla',
    icon: '🍣',
    shape: 'nigiri',
    speedMultiplier: 1.2,
    jumpMultiplier: 1,
    canAccelerate: false,
    bodyColor: '#FFFFFF',
    topColor: '#F5D77A',
    desc: 'Más rápido que el nigiri normal.',
    stats: [
      { label: 'Velocidad', value: '+20% más rápido que el nigiri' },
      { label: 'Salto', value: 'Normal' },
      { label: 'Habilidad especial', value: 'Ninguna' }
    ]
  },
  meatbun: {
    id: 'meatbun',
    name: 'Bollito de carne',
    icon: '🥟',
    shape: 'bao',
    speedMultiplier: 0.8,
    jumpMultiplier: 1.3,
    canAccelerate: false,
    bodyColor: '#F5E6C8',
    topColor: '#E8A98C',
    desc: 'El más lento del menú, pero compensa con el salto más alto de todos.',
    stats: [
      { label: 'Velocidad', value: '-20% más lento que el nigiri (el más lento)' },
      { label: 'Salto', value: 'El más alto de todos' },
      { label: 'Habilidad especial', value: 'Ninguna' }
    ]
  },
  riceball: {
    id: 'riceball',
    name: 'Bola de arroz',
    icon: '⚪',
    shape: 'riceball',
    speedMultiplier: 1,
    jumpMultiplier: 1,
    canAccelerate: false,
    bodyColor: '#FFFFFF',
    topColor: '#1A1A1A',
    desc: 'Una bola de arroz sencilla, sin ventajas ni desventajas especiales.',
    stats: [
      { label: 'Velocidad', value: 'Normal' },
      { label: 'Salto', value: 'Normal' },
      { label: 'Habilidad especial', value: 'Ninguna' }
    ]
  },
  maki: {
    id: 'maki',
    name: 'Maki',
    icon: '🍥',
    shape: 'maki',
    speedMultiplier: 1,
    jumpMultiplier: 1,
    canAccelerate: true,
    accelMultiplier: 1.15,
    bodyColor: '#FFFFFF',
    topColor: '#E8734A',
    desc: 'Un maki normal y corriente. Mantén pulsada la tecla D para acelerar cuando quieras.',
    stats: [
      { label: 'Velocidad', value: 'Normal (acelera +15% con D)' },
      { label: 'Salto', value: 'Normal' },
      { label: 'Habilidad especial', value: 'Acelerar (mantener pulsada D)' }
    ]
  },
  makiAdvanced: {
    id: 'makiAdvanced',
    name: 'Maki avanzado',
    icon: '🍱',
    shape: 'maki',
    speedMultiplier: 1,
    jumpMultiplier: 1.05,
    canAccelerate: true,
    accelMultiplier: 1.2,
    bodyColor: '#FFFFFF',
    topColor: '#D4AF37',
    desc: 'Una versión mejorada del maki: acelera un poco más y salta un poco más alto.',
    stats: [
      { label: 'Velocidad', value: 'Normal (acelera +20% con D)' },
      { label: 'Salto', value: 'Un poco más alto que el maki normal' },
      { label: 'Habilidad especial', value: 'Acelerar más fuerte (mantener pulsada D)' }
    ]
  },
  nigiriS: {
    id: 'nigiriS',
    name: 'Nigiri S',
    icon: '🍙',
    shape: 'nigiri',
    speedMultiplier: 1,
    jumpMultiplier: 1,
    canAccelerate: false,
    canDoubleJump: true,
    hasFace: true,
    bodyColor: '#FFFFFF',
    topColor: '#3DDC97',
    desc: 'Un nigiri con un truco bajo la manga: puede dar un segundo salto en pleno vuelo. Ideal para corregir un salto en el último momento.',
    stats: [
      { label: 'Velocidad', value: 'Normal' },
      { label: 'Salto', value: 'Normal (con doble salto en el aire)' },
      { label: 'Habilidad especial', value: 'Doble salto: pulsa saltar otra vez estando en el aire' }
    ]
  },
  butterfishS: {
    id: 'butterfishS',
    name: 'Nigiri de pez mantequilla S',
    icon: '🍣',
    shape: 'nigiri',
    speedMultiplier: 1.3,
    jumpMultiplier: 1,
    canAccelerate: false,
    hasFace: true,
    bodyColor: '#FFFFFF',
    topColor: '#E0A72E',
    desc: 'Una versión mejorada del nigiri de pez mantequilla: todavía más rápido que el original.',
    stats: [
      { label: 'Velocidad', value: '+30% más rápido que el nigiri (el más rápido de todos)' },
      { label: 'Salto', value: 'Normal' },
      { label: 'Habilidad especial', value: 'Ninguna' }
    ]
  },
  meatbunS: {
    id: 'meatbunS',
    name: 'Bollito de carne S',
    icon: '🥟',
    shape: 'bao',
    speedMultiplier: 0.85,
    jumpMultiplier: 1.4,
    canAccelerate: false,
    hasFace: true,
    bodyColor: '#F5E6C8',
    topColor: '#C97A5C',
    desc: 'Una versión mejorada del bollito de carne: un salto muchísimo más grande, que llega hasta el límite superior de la pantalla, y también un poco más ancho.',
    stats: [
      { label: 'Velocidad', value: '-15% respecto al nigiri (algo menos lento que el bollito normal)' },
      { label: 'Salto', value: 'El más alto de todos: llega al límite superior de la pantalla, y un poco más ancho que el del bollito normal' },
      { label: 'Habilidad especial', value: 'Ninguna' }
    ]
  },
  riceballS: {
    id: 'riceballS',
    name: 'Bola de arroz S',
    icon: '⚪',
    shape: 'riceball',
    speedMultiplier: 1,
    jumpMultiplier: 1,
    canAccelerate: true,
    accelMultiplier: 0.7,
    hasFace: true,
    bodyColor: '#FFFFFF',
    topColor: '#1A1A1A',
    desc: 'Una bola de arroz mejorada: mantén pulsada D para frenar en vez de acelerar, justo al revés que la familia maki. Útil para calcular con calma los tramos más apretados.',
    stats: [
      { label: 'Velocidad', value: 'Normal (frena -30% mientras se mantiene D)' },
      { label: 'Salto', value: 'Normal' },
      { label: 'Habilidad especial', value: 'Frenar (mantener pulsada D) en vez de acelerar' }
    ]
  },
  wasabi: {
    id: 'wasabi',
    name: 'Wasabi',
    icon: '🌿',
    shape: 'wasabi',
    speedMultiplier: 1.2,
    jumpMultiplier: 1.2,
    canAccelerate: false,
    hasFace: true,
    bodyColor: '#6fae3f',
    topColor: '#bfe89a',
    desc: 'Una montaña de wasabi con mucho carácter: rápido y, sobre todo, el que más salta a lo ancho de todo el menú.',
    stats: [
      { label: 'Velocidad', value: 'Rápido' },
      { label: 'Salto', value: 'El que más salta a lo ancho de todos' },
      { label: 'Habilidad especial', value: 'Ninguna (todo su valor está en la anchura del salto)' }
    ]
  },
  soy: {
    id: 'soy',
    name: 'Soja',
    icon: '🫙',
    shape: 'soy',
    speedMultiplier: 1.35,
    jumpMultiplier: 1,
    canAccelerate: false,
    hasFace: true,
    bodyColor: '#2b1508',
    topColor: '#6b3f1d',
    desc: 'El clásico frasquito de salsa de soja de los restaurantes japoneses: el más rápido de todo el menú, sin ningún otro truco.',
    stats: [
      { label: 'Velocidad', value: 'La más rápida de todas' },
      { label: 'Salto', value: 'Normal' },
      { label: 'Habilidad especial', value: 'Ninguna (todo su valor está en la velocidad pura)' }
    ]
  },
  tempura: {
    id: 'tempura',
    name: 'Tempura',
    icon: '🍤',
    shape: 'tempura',
    speedMultiplier: 1,
    jumpMultiplier: 1,
    canAccelerate: false,
    canGlide: true,
    glideDuration: 3,
    hasFace: true,
    bodyColor: '#F0C05A',
    topColor: '#D9863C',
    desc: 'Dos trozos de tempura pegados el uno al otro. Tras saltar, mantén pulsada la tecla D para planear en el aire hasta 3 segundos antes de empezar a caer. Sin recarga: cada vez que vuelves a tocar el suelo y saltas, tienes los 3 segundos enteros otra vez.',
    stats: [
      { label: 'Velocidad', value: 'Normal' },
      { label: 'Salto', value: 'Normal' },
      { label: 'Habilidad especial', value: 'Planear en el aire hasta 3s manteniendo D (sin recarga: se renueva cada vez que saltas)' }
    ]
  },
  chopstick: {
    id: 'chopstick',
    name: 'Palillo',
    icon: '🥢',
    shape: 'chopstick',
    speedMultiplier: 1,
    jumpMultiplier: 1,
    canAccelerate: false,
    extraLives: 3,
    hasFace: true,
    bodyColor: '#8B5A2B',
    topColor: '#F0D9A8',
    desc: 'Un vasito de madera con dos palillos dentro, con ojitos y boquita. Tiene tres vidas: si muere, revive automáticamente justo después del último obstáculo que ya había superado, en vez de volver al principio del nivel. Solo puede usar este truco 3 veces por intento — a la cuarta muerte, el nivel se reinicia desde el principio como con cualquier otro personaje.',
    stats: [
      { label: 'Velocidad', value: 'Normal' },
      { label: 'Salto', value: 'Normal' },
      { label: 'Habilidad especial', value: '3 vidas automáticas: al morir, revive justo después del último obstáculo superado (hasta 3 veces por intento)' }
    ]
  },
  ramen: {
    id: 'ramen',
    name: 'Ramen',
    icon: '🍜',
    shape: 'ramen',
    speedMultiplier: 1.2,
    jumpMultiplier: 1,
    canAccelerate: false,
    canRemoveObstacles: true,
    removeCharges: 3,
    hasFace: true,
    bodyColor: '#D9861C',
    topColor: '#F5E3A0',
    desc: 'Un tazón de ramen humeante, tan rápido como el nigiri de pez mantequilla. Pulsa S (o el botón 🍜 en pantalla) para eliminar de golpe el próximo obstáculo que tengas por delante — hasta 3 veces por partida.',
    stats: [
      { label: 'Velocidad', value: '+20% más rápido que el nigiri (igual que el nigiri de pez mantequilla)' },
      { label: 'Salto', value: 'Normal' },
      { label: 'Habilidad especial', value: 'Eliminar el siguiente obstáculo (tecla S o botón 🍜): hasta 3 veces por partida' }
    ]
  },
  teriyakiRice: {
    id: 'teriyakiRice',
    name: 'Arroz con pollo teriyaki',
    icon: '🍱',
    shape: 'teriyakiRice',
    speedMultiplier: 1,
    jumpMultiplier: 1,
    canAccelerate: false,
    canPlaceRamp: true,
    rampCharges: 3,
    hasFace: true,
    bodyColor: '#FFFFFF',
    topColor: '#7A3B12',
    desc: 'Un plato de arroz blanco con trozos de pollo teriyaki caramelizado, sésamo y un poco de cebolleta por encima. Pulsa la tecla D para crear una rampa de arroz un poco por delante: al llegar a ella hace un salto muy grande automáticamente. Solo se puede hacer 3 veces por partida.',
    stats: [
      { label: 'Velocidad', value: 'Normal' },
      { label: 'Salto', value: 'Normal' },
      { label: 'Habilidad especial', value: 'Crear una rampa de arroz (tecla D) que da un salto muy grande al llegar a ella: hasta 3 veces por partida' }
    ]
  },
  takoyaki: {
    id: 'takoyaki',
    name: 'Bolas de pulpo',
    icon: '🐙',
    shape: 'takoyaki',
    speedMultiplier: 1,
    jumpMultiplier: 1,
    canAccelerate: false,
    canTeleport: true,
    teleportCharges: 3,
    hasFace: true,
    bodyColor: '#C98A3B',
    topColor: '#8B5A2B',
    desc: 'Una bola de takoyaki en un palillo. Mantén pulsada la tecla D para apuntar (el retículo sigue al ratón) y suéltala para teletransportarte hasta ese punto, atravesando cualquier obstáculo que hubiera en el camino. Solo se puede hacer 3 veces por partida. Ojo: teletransportarte no te protege de nada. Si apareces justo encima de un obstáculo, mueres igual que cualquier otro sushi.',
    stats: [
      { label: 'Velocidad', value: 'Normal' },
      { label: 'Salto', value: 'Normal' },
      { label: 'Habilidad especial', value: 'Teletransportarse (mantén D, apunta con el ratón, suelta para transportarte): hasta 3 veces por partida' },
      { label: 'Debilidad', value: 'Ninguna protección extra: aparecer justo sobre un obstáculo mata igual que a cualquier otro personaje' }
    ]
  }
};

/* ===== Niveles ===== */
const LEVELS = [
  {
    id: 'level1',
    name: 'Nivel 1 · Primeros pasos',
    baseScrollSpeed: 260,
    length: 9250,
    unlocksFood: 'butterfish',
    goalColor: '#4ECDC4',
    obstacles: [
      { x: 600, type: 'spike' },
      { x: 900, type: 'spike' },
      { x: 1200, type: 'gap', width: 90 },
      { x: 1550, type: 'spike' },
      { x: 1850, type: 'spike' },
      { x: 2150, type: 'gap', width: 100 },
      { x: 2500, type: 'spike' },
      { x: 2800, type: 'spike' },
      { x: 3100, type: 'gap', width: 90 },
      { x: 3450, type: 'spike' },
      { x: 3750, type: 'spike' },
      { x: 4050, type: 'gap', width: 100 },
      { x: 4400, type: 'spike' },
      { x: 4700, type: 'spike' },
      { x: 5000, type: 'gap', width: 90 },
      { x: 5350, type: 'spike' },
      { x: 5650, type: 'spike' },
      { x: 5950, type: 'gap', width: 100 },
      { x: 6300, type: 'spike' },
      { x: 6600, type: 'spike' },
      { x: 6900, type: 'gap', width: 90 },
      { x: 7250, type: 'spike' },
      { x: 7550, type: 'spike' },
      { x: 7850, type: 'gap', width: 100 },
      { x: 8200, type: 'spike' },
      { x: 8500, type: 'spike' },
      { x: 8800, type: 'gap', width: 90 }
    ]
  },
  {
    id: 'level2',
    name: 'Nivel 2 · Peligro en el aire',
    baseScrollSpeed: 260,
    length: 10400,
    unlocksFood: null,
    goalColor: '#c889b5',
    obstacles: [
      { x: 650, type: 'spike' },
      { x: 950, type: 'enemy' },
      { x: 1250, type: 'gap', width: 90 },
      { x: 1550, type: 'enemy' },
      { x: 1850, type: 'spike' },
      { x: 2150, type: 'enemy' },
      { x: 2450, type: 'gap', width: 100 },
      { x: 2750, type: 'enemy' },
      { x: 3050, type: 'spike' },
      { x: 3350, type: 'enemy' },
      { x: 3650, type: 'gap', width: 90 },
      { x: 3950, type: 'enemy' },
      { x: 4250, type: 'spike' },
      { x: 4550, type: 'enemy' },
      { x: 4850, type: 'gap', width: 100 },
      { x: 5150, type: 'enemy' },
      { x: 5450, type: 'spike' },
      { x: 5750, type: 'enemy' },
      { x: 6050, type: 'gap', width: 90 },
      { x: 6350, type: 'enemy' },
      { x: 6650, type: 'spike' },
      { x: 6950, type: 'enemy' },
      { x: 7250, type: 'gap', width: 100 },
      { x: 7550, type: 'enemy' },
      { x: 7850, type: 'spike' },
      { x: 8150, type: 'enemy' },
      { x: 8450, type: 'gap', width: 90 },
      { x: 8750, type: 'enemy' },
      { x: 9050, type: 'spike' },
      { x: 9350, type: 'enemy' },
      { x: 9650, type: 'gap', width: 100 },
      { x: 9950, type: 'enemy' }
    ]
  },
  {
    id: 'level3',
    name: 'Nivel 3 · La cocina no perdona',
    baseScrollSpeed: 300,
    length: 11290,
    unlocksFood: 'meatbun',
    goalColor: '#FFE66D',
    obstacles: [
      { x: 650, type: 'spike' },
      { x: 950, type: 'bigspike' },
      { x: 1270, type: 'gap', width: 100 },
      { x: 1550, type: 'enemy' },
      { x: 1620, type: 'enemy' },
      { x: 1690, type: 'enemy' },
      { x: 1950, type: 'spike' },
      { x: 2250, type: 'gap', width: 90 },
      { x: 2550, type: 'bigspike' },
      { x: 2850, type: 'enemy' },
      { x: 2920, type: 'enemy' },
      { x: 3200, type: 'spike' },
      { x: 3500, type: 'gap', width: 100 },
      { x: 3800, type: 'enemy' },
      { x: 3870, type: 'enemy' },
      { x: 3940, type: 'enemy' },
      { x: 4220, type: 'bigspike' },
      { x: 4520, type: 'spike' },
      { x: 4820, type: 'gap', width: 110 },
      { x: 5120, type: 'enemy' },
      { x: 5190, type: 'enemy' },
      { x: 5470, type: 'spike' },
      { x: 5770, type: 'bigspike' },
      { x: 6070, type: 'gap', width: 90 },
      { x: 6350, type: 'enemy' },
      { x: 6420, type: 'enemy' },
      { x: 6490, type: 'enemy' },
      { x: 6770, type: 'spike' },
      { x: 7070, type: 'gap', width: 100 },
      { x: 7370, type: 'bigspike' },
      { x: 7670, type: 'enemy' },
      { x: 7740, type: 'enemy' },
      { x: 8020, type: 'spike' },
      { x: 8320, type: 'gap', width: 90 },
      { x: 8620, type: 'enemy' },
      { x: 8690, type: 'enemy' },
      { x: 8760, type: 'enemy' },
      { x: 9040, type: 'bigspike' },
      { x: 9340, type: 'spike' },
      { x: 9640, type: 'gap', width: 100 },
      { x: 9940, type: 'bigspike' },
      { x: 10240, type: 'spike' },
      { x: 10540, type: 'gap', width: 100 },
      { x: 10820, type: 'enemy' },
      { x: 10890, type: 'enemy' }
    ]
  },
  {
    id: 'level4',
    name: 'Nivel 4 · Hora punta',
    baseScrollSpeed: 310,
    length: 12396,
    unlocksFood: 'riceball',
    goalColor: '#36a64d',
    obstacles: [
      { x: 600, type: 'spike' },
      { x: 900, type: 'gap', width: 100 },
      { x: 1200, type: 'enemy' },
      { x: 1268, type: 'enemy' },
      { x: 1336, type: 'enemy' },
      { x: 1404, type: 'enemy' },
      { x: 1674, type: 'bigspike' },
      { x: 1974, type: 'bigspike' },
      { x: 2274, type: 'gap', width: 90 },
      { x: 2574, type: 'spike' },
      { x: 2874, type: 'spike' },
      { x: 3174, type: 'enemy' },
      { x: 3242, type: 'enemy' },
      { x: 3512, type: 'gap', width: 110 },
      { x: 3812, type: 'enemy' },
      { x: 3880, type: 'enemy' },
      { x: 3948, type: 'enemy' },
      { x: 4218, type: 'spike' },
      { x: 4518, type: 'gap', width: 100 },
      { x: 4818, type: 'bigspike' },
      { x: 5118, type: 'enemy' },
      { x: 5186, type: 'enemy' },
      { x: 5254, type: 'enemy' },
      { x: 5322, type: 'enemy' },
      { x: 5390, type: 'enemy' },
      { x: 5660, type: 'spike' },
      { x: 5960, type: 'bigspike' },
      { x: 6260, type: 'gap', width: 90 },
      { x: 6560, type: 'spike' },
      { x: 6860, type: 'enemy' },
      { x: 6928, type: 'enemy' },
      { x: 7198, type: 'bigspike' },
      { x: 7498, type: 'gap', width: 100 },
      { x: 7798, type: 'spike' },
      { x: 8098, type: 'spike' },
      { x: 8398, type: 'bigspike' },
      { x: 8698, type: 'enemy' },
      { x: 8766, type: 'enemy' },
      { x: 8834, type: 'enemy' },
      { x: 8902, type: 'enemy' },
      { x: 9172, type: 'gap', width: 110 },
      { x: 9472, type: 'spike' },
      { x: 9772, type: 'gap', width: 90 },
      { x: 10072, type: 'enemy' },
      { x: 10140, type: 'enemy' },
      { x: 10410, type: 'bigspike' },
      { x: 10710, type: 'spike' },
      { x: 11010, type: 'enemy' },
      { x: 11078, type: 'enemy' },
      { x: 11146, type: 'enemy' },
      { x: 11416, type: 'gap', width: 100 },
      { x: 11716, type: 'bigspike' },
      { x: 12016, type: 'spike' }
    ]
  },
  {
    id: 'level5',
    name: 'Nivel 5 · Modo turbo',
    baseScrollSpeed: 320,
    length: 15938,
    unlocksFood: 'maki',
    goalColor: '#FF6B3D',
    obstacles: [
      { x: 600, type: 'enemy' },
      { x: 664, type: 'enemy' },
      { x: 728, type: 'enemy' },
      { x: 978, type: 'gap', width: 100 },
      { x: 1278, type: 'spike' },
      { x: 1578, type: 'bigspike' },
      { x: 1878, type: 'spike' },
      { x: 2178, type: 'gap', width: 90 },
      { x: 2478, type: 'enemy' },
      { x: 2542, type: 'enemy' },
      { x: 2606, type: 'enemy' },
      { x: 2670, type: 'enemy' },
      { x: 2920, type: 'bigspike' },
      { x: 3220, type: 'gap', width: 110 },
      { x: 3520, type: 'spike' },
      { x: 3820, type: 'enemy' },
      { x: 3884, type: 'enemy' },
      { x: 4134, type: 'spike' },
      { x: 4434, type: 'bigspike' },
      { x: 4734, type: 'bigspike' },
      { x: 5034, type: 'gap', width: 100 },
      { x: 5334, type: 'enemy' },
      { x: 5398, type: 'enemy' },
      { x: 5462, type: 'enemy' },
      { x: 5526, type: 'enemy' },
      { x: 5590, type: 'enemy' },
      { x: 5840, type: 'spike' },
      { x: 6140, type: 'gap', width: 90 },
      { x: 6440, type: 'bigspike' },
      { x: 6740, type: 'enemy' },
      { x: 6804, type: 'enemy' },
      { x: 6868, type: 'enemy' },
      { x: 7118, type: 'spike' },
      { x: 7418, type: 'gap', width: 110 },
      { x: 7718, type: 'spike' },
      { x: 8018, type: 'bigspike' },
      { x: 8318, type: 'enemy' },
      { x: 8382, type: 'enemy' },
      { x: 8632, type: 'gap', width: 100 },
      { x: 8932, type: 'bigspike' },
      { x: 9232, type: 'spike' },
      { x: 9532, type: 'enemy' },
      { x: 9596, type: 'enemy' },
      { x: 9660, type: 'enemy' },
      { x: 9724, type: 'enemy' },
      { x: 9974, type: 'gap', width: 90 },
      { x: 10274, type: 'spike' },
      { x: 10574, type: 'spike' },
      { x: 10874, type: 'bigspike' },
      { x: 11174, type: 'enemy' },
      { x: 11238, type: 'enemy' },
      { x: 11302, type: 'enemy' },
      { x: 11552, type: 'gap', width: 110 },
      { x: 11852, type: 'bigspike' },
      { x: 12152, type: 'enemy' },
      { x: 12216, type: 'enemy' },
      { x: 12466, type: 'spike' },
      { x: 12766, type: 'gap', width: 100 },
      { x: 13066, type: 'bigspike' },
      { x: 13366, type: 'spike' },
      { x: 13666, type: 'enemy' },
      { x: 13730, type: 'enemy' },
      { x: 13794, type: 'enemy' },
      { x: 14044, type: 'gap', width: 90 },
      { x: 14344, type: 'bigspike' },
      { x: 14644, type: 'enemy' },
      { x: 14708, type: 'enemy' },
      { x: 14958, type: 'spike' },
      { x: 15258, type: 'gap', width: 110 },
      { x: 15558, type: 'bigspike' }
    ]
  },
  {
    id: 'level6',
    name: 'Nivel 6 · Turbo extremo',
    baseScrollSpeed: 330,
    length: 17060,
    unlocksFood: 'makiAdvanced',
    goalColor: '#E74C3C',
    obstacles: [
      { x: 600, type: 'bigspike' },
      { x: 900, type: 'enemy' },
      { x: 960, type: 'enemy' },
      { x: 1020, type: 'enemy' },
      { x: 1080, type: 'enemy' },
      { x: 1320, type: 'spike' },
      { x: 1620, type: 'gap', width: 100 },
      { x: 1920, type: 'enemy' },
      { x: 1980, type: 'enemy' },
      { x: 2220, type: 'bigspike' },
      { x: 2520, type: 'bigspike' },
      { x: 2820, type: 'gap', width: 90 },
      { x: 3120, type: 'spike' },
      { x: 3420, type: 'enemy' },
      { x: 3480, type: 'enemy' },
      { x: 3540, type: 'enemy' },
      { x: 3600, type: 'enemy' },
      { x: 3660, type: 'enemy' },
      { x: 3900, type: 'gap', width: 110 },
      { x: 4200, type: 'spike' },
      { x: 4500, type: 'bigspike' },
      { x: 4800, type: 'enemy' },
      { x: 4860, type: 'enemy' },
      { x: 4920, type: 'enemy' },
      { x: 5160, type: 'spike' },
      { x: 5460, type: 'gap', width: 100 },
      { x: 5760, type: 'bigspike' },
      { x: 6060, type: 'enemy' },
      { x: 6120, type: 'enemy' },
      { x: 6360, type: 'spike' },
      { x: 6660, type: 'spike' },
      { x: 6960, type: 'gap', width: 90 },
      { x: 7260, type: 'enemy' },
      { x: 7320, type: 'enemy' },
      { x: 7380, type: 'enemy' },
      { x: 7440, type: 'enemy' },
      { x: 7680, type: 'bigspike' },
      { x: 7980, type: 'gap', width: 110 },
      { x: 8280, type: 'enemy' },
      { x: 8340, type: 'enemy' },
      { x: 8400, type: 'enemy' },
      { x: 8640, type: 'spike' },
      { x: 8940, type: 'bigspike' },
      { x: 9240, type: 'gap', width: 100 },
      { x: 9540, type: 'spike' },
      { x: 9840, type: 'enemy' },
      { x: 9900, type: 'enemy' },
      { x: 10140, type: 'bigspike' },
      { x: 10440, type: 'spike' },
      { x: 10740, type: 'gap', width: 90 },
      { x: 11040, type: 'enemy' },
      { x: 11100, type: 'enemy' },
      { x: 11160, type: 'enemy' },
      { x: 11220, type: 'enemy' },
      { x: 11280, type: 'enemy' },
      { x: 11520, type: 'bigspike' },
      { x: 11820, type: 'gap', width: 110 },
      { x: 12120, type: 'spike' },
      { x: 12420, type: 'enemy' },
      { x: 12480, type: 'enemy' },
      { x: 12540, type: 'enemy' },
      { x: 12780, type: 'bigspike' },
      { x: 13080, type: 'gap', width: 100 },
      { x: 13380, type: 'enemy' },
      { x: 13440, type: 'enemy' },
      { x: 13500, type: 'enemy' },
      { x: 13560, type: 'enemy' },
      { x: 13800, type: 'spike' },
      { x: 14100, type: 'bigspike' },
      { x: 14400, type: 'gap', width: 90 },
      { x: 14700, type: 'enemy' },
      { x: 14760, type: 'enemy' },
      { x: 14820, type: 'enemy' },
      { x: 15060, type: 'spike' },
      { x: 15360, type: 'gap', width: 110 },
      { x: 15660, type: 'bigspike' },
      { x: 15960, type: 'enemy' },
      { x: 16020, type: 'enemy' },
      { x: 16080, type: 'enemy' },
      { x: 16140, type: 'enemy' },
      { x: 16380, type: 'spike' },
      { x: 16680, type: 'gap', width: 100 }
    ]
  },
  {
    id: 'level7',
    name: 'Nivel 7 · El techo también pincha',
    baseScrollSpeed: 330,
    length: 25540,
    unlocksFood: 'nigiriS',
    goalColor: '#6C63FF',
    obstacles: [
      { x: 600, type: 'spike' },
      { x: 900, type: 'spike' },
      { x: 1220, type: 'gap', width: 100 },
      { x: 1610, type: 'bigspike' },
      { x: 1930, type: 'enemy' },
      { x: 1994, type: 'enemy' },
      { x: 2304, type: 'spike' },
      { x: 2564, type: 'spike' },
      { x: 2894, type: 'ceilspike' },
      { x: 3284, type: 'gap', width: 100 },
      { x: 3674, type: 'bigspike' },
      { x: 3994, type: 'enemy' },
      { x: 4058, type: 'enemy' },
      { x: 4122, type: 'enemy' },
      { x: 4452, type: 'spike' },
      { x: 4712, type: 'spike' },
      { x: 5032, type: 'gap', width: 90 },
      { x: 5412, type: 'bigspike' },
      { x: 5712, type: 'bigspike' },
      { x: 6062, type: 'ceilspike' },
      { x: 6452, type: 'gap', width: 100 },
      { x: 6842, type: 'enemy' },
      { x: 6906, type: 'enemy' },
      { x: 6970, type: 'enemy' },
      { x: 7300, type: 'spike' },
      { x: 7600, type: 'bigspike' },
      { x: 7920, type: 'gap', width: 110 },
      { x: 8320, type: 'enemy' },
      { x: 8384, type: 'enemy' },
      { x: 8448, type: 'enemy' },
      { x: 8512, type: 'enemy' },
      { x: 8822, type: 'spike' },
      { x: 9082, type: 'spike' },
      { x: 9342, type: 'bigspike' },
      { x: 9692, type: 'ceilspike' },
      { x: 10082, type: 'bigspike' },
      { x: 10402, type: 'gap', width: 90 },
      { x: 10782, type: 'enemy' },
      { x: 10846, type: 'enemy' },
      { x: 11176, type: 'spike' },
      { x: 11436, type: 'spike' },
      { x: 11696, type: 'spike' },
      { x: 11996, type: 'bigspike' },
      { x: 12296, type: 'gap', width: 100 },
      { x: 12646, type: 'bigspike' },
      { x: 12946, type: 'enemy' },
      { x: 13010, type: 'enemy' },
      { x: 13074, type: 'enemy' },
      { x: 13138, type: 'enemy' },
      { x: 13202, type: 'enemy' },
      { x: 13512, type: 'spike' },
      { x: 13752, type: 'spike' },
      { x: 13992, type: 'spike' },
      { x: 14322, type: 'ceilspike' },
      { x: 14712, type: 'spike' },
      { x: 14972, type: 'gap', width: 100 },
      { x: 15342, type: 'bigspike' },
      { x: 15662, type: 'bigspike' },
      { x: 15982, type: 'enemy' },
      { x: 16046, type: 'enemy' },
      { x: 16110, type: 'enemy' },
      { x: 16440, type: 'spike' },
      { x: 16700, type: 'gap', width: 90 },
      { x: 17090, type: 'ceilspike' },
      { x: 17480, type: 'gap', width: 100 },
      { x: 17880, type: 'ceilspike' },
      { x: 18270, type: 'bigspike' },
      { x: 18590, type: 'enemy' },
      { x: 18654, type: 'enemy' },
      { x: 18718, type: 'enemy' },
      { x: 18782, type: 'enemy' },
      { x: 19092, type: 'spike' },
      { x: 19352, type: 'spike' },
      { x: 19652, type: 'bigspike' },
      { x: 19952, type: 'gap', width: 110 },
      { x: 20332, type: 'enemy' },
      { x: 20396, type: 'enemy' },
      { x: 20460, type: 'enemy' },
      { x: 20770, type: 'spike' },
      { x: 21010, type: 'bigspike' },
      { x: 21270, type: 'bigspike' },
      { x: 21620, type: 'ceilspike' },
      { x: 22010, type: 'gap', width: 100 },
      { x: 22380, type: 'enemy' },
      { x: 22444, type: 'enemy' },
      { x: 22508, type: 'enemy' },
      { x: 22572, type: 'enemy' },
      { x: 22636, type: 'enemy' },
      { x: 22946, type: 'spike' },
      { x: 23206, type: 'spike' },
      { x: 23466, type: 'bigspike' },
      { x: 23786, type: 'gap', width: 90 },
      { x: 24166, type: 'bigspike' },
      { x: 24486, type: 'enemy' },
      { x: 24550, type: 'enemy' },
      { x: 24860, type: 'spike' }
    ]
  },
  {
    id: 'level8',
    name: 'Nivel 8 · El techo aprieta más',
    baseScrollSpeed: 330,
    length: 29114,
    unlocksFood: 'butterfishS',
    goalColor: '#FF4FA3',
    obstacles: [
      { x: 560, type: 'spike' },
      { x: 840, type: 'spike' },
      { x: 1130, type: 'gap', width: 100 },
      { x: 1490, type: 'bigspike' },
      { x: 1790, type: 'enemy' },
      { x: 1854, type: 'enemy' },
      { x: 1918, type: 'enemy' },
      { x: 2208, type: 'spike' },
      { x: 2448, type: 'spike' },
      { x: 2778, type: 'ceilspike' },
      { x: 3168, type: 'gap', width: 100 },
      { x: 3528, type: 'bigspike' },
      { x: 3828, type: 'enemy' },
      { x: 3892, type: 'enemy' },
      { x: 3956, type: 'enemy' },
      { x: 4020, type: 'enemy' },
      { x: 4320, type: 'spike' },
      { x: 4560, type: 'spike' },
      { x: 4850, type: 'gap', width: 90 },
      { x: 5200, type: 'bigspike' },
      { x: 5470, type: 'bigspike' },
      { x: 5820, type: 'ceilspike' },
      { x: 6210, type: 'gap', width: 100 },
      { x: 6610, type: 'ceilspike' },
      { x: 7000, type: 'bigspike' },
      { x: 7310, type: 'enemy' },
      { x: 7374, type: 'enemy' },
      { x: 7438, type: 'enemy' },
      { x: 7738, type: 'spike' },
      { x: 8018, type: 'bigspike' },
      { x: 8318, type: 'gap', width: 110 },
      { x: 8688, type: 'enemy' },
      { x: 8752, type: 'enemy' },
      { x: 8816, type: 'enemy' },
      { x: 8880, type: 'enemy' },
      { x: 8944, type: 'enemy' },
      { x: 9234, type: 'spike' },
      { x: 9474, type: 'spike' },
      { x: 9714, type: 'bigspike' },
      { x: 10064, type: 'ceilspike' },
      { x: 10454, type: 'bigspike' },
      { x: 10754, type: 'gap', width: 90 },
      { x: 11104, type: 'enemy' },
      { x: 11168, type: 'enemy' },
      { x: 11468, type: 'spike' },
      { x: 11708, type: 'spike' },
      { x: 11948, type: 'spike' },
      { x: 12228, type: 'bigspike' },
      { x: 12508, type: 'gap', width: 100 },
      { x: 12838, type: 'bigspike' },
      { x: 13118, type: 'enemy' },
      { x: 13182, type: 'enemy' },
      { x: 13246, type: 'enemy' },
      { x: 13310, type: 'enemy' },
      { x: 13374, type: 'enemy' },
      { x: 13438, type: 'enemy' },
      { x: 13728, type: 'spike' },
      { x: 13958, type: 'spike' },
      { x: 14188, type: 'spike' },
      { x: 14518, type: 'ceilspike' },
      { x: 14908, type: 'spike' },
      { x: 15158, type: 'gap', width: 100 },
      { x: 15508, type: 'bigspike' },
      { x: 15808, type: 'bigspike' },
      { x: 16108, type: 'enemy' },
      { x: 16172, type: 'enemy' },
      { x: 16236, type: 'enemy' },
      { x: 16300, type: 'enemy' },
      { x: 16600, type: 'spike' },
      { x: 16850, type: 'gap', width: 90 },
      { x: 17240, type: 'ceilspike' },
      { x: 17630, type: 'gap', width: 100 },
      { x: 18030, type: 'ceilspike' },
      { x: 18420, type: 'bigspike' },
      { x: 18720, type: 'enemy' },
      { x: 18784, type: 'enemy' },
      { x: 18848, type: 'enemy' },
      { x: 18912, type: 'enemy' },
      { x: 18976, type: 'enemy' },
      { x: 19276, type: 'spike' },
      { x: 19516, type: 'spike' },
      { x: 19796, type: 'bigspike' },
      { x: 20076, type: 'gap', width: 110 },
      { x: 20436, type: 'enemy' },
      { x: 20500, type: 'enemy' },
      { x: 20564, type: 'enemy' },
      { x: 20854, type: 'spike' },
      { x: 21084, type: 'bigspike' },
      { x: 21334, type: 'bigspike' },
      { x: 21684, type: 'ceilspike' },
      { x: 22074, type: 'gap', width: 100 },
      { x: 22424, type: 'enemy' },
      { x: 22488, type: 'enemy' },
      { x: 22552, type: 'enemy' },
      { x: 22616, type: 'enemy' },
      { x: 22680, type: 'enemy' },
      { x: 22744, type: 'enemy' },
      { x: 23034, type: 'spike' },
      { x: 23274, type: 'spike' },
      { x: 23514, type: 'bigspike' },
      { x: 23814, type: 'gap', width: 90 },
      { x: 24164, type: 'bigspike' },
      { x: 24464, type: 'enemy' },
      { x: 24528, type: 'enemy' },
      { x: 24818, type: 'spike' },
      { x: 25148, type: 'ceilspike' },
      { x: 25538, type: 'bigspike' },
      { x: 25818, type: 'gap', width: 100 },
      { x: 26168, type: 'enemy' },
      { x: 26232, type: 'enemy' },
      { x: 26296, type: 'enemy' },
      { x: 26360, type: 'enemy' },
      { x: 26650, type: 'spike' },
      { x: 26890, type: 'spike' },
      { x: 27130, type: 'bigspike' },
      { x: 27430, type: 'gap', width: 90 },
      { x: 27780, type: 'bigspike' },
      { x: 28080, type: 'enemy' },
      { x: 28144, type: 'enemy' },
      { x: 28434, type: 'spike' }
    ]
  },
  {
    id: 'level9',
    name: 'Nivel 9 · El techo no da tregua',
    baseScrollSpeed: 330,
    length: 32686,
    unlocksFood: 'meatbunS',
    goalColor: '#00B8A9',
    obstacles: [
      { x: 540, type: 'spike' },
      { x: 800, type: 'spike' },
      { x: 1080, type: 'gap', width: 100 },
      { x: 1430, type: 'bigspike' },
      { x: 1720, type: 'enemy' },
      { x: 1784, type: 'enemy' },
      { x: 1848, type: 'enemy' },
      { x: 2128, type: 'spike' },
      { x: 2358, type: 'spike' },
      { x: 2688, type: 'ceilspike' },
      { x: 3078, type: 'gap', width: 100 },
      { x: 3428, type: 'bigspike' },
      { x: 3718, type: 'enemy' },
      { x: 3782, type: 'enemy' },
      { x: 3846, type: 'enemy' },
      { x: 3910, type: 'enemy' },
      { x: 4200, type: 'spike' },
      { x: 4430, type: 'spike' },
      { x: 4710, type: 'gap', width: 90 },
      { x: 5050, type: 'bigspike' },
      { x: 5310, type: 'bigspike' },
      { x: 5660, type: 'ceilspike' },
      { x: 6050, type: 'gap', width: 100 },
      { x: 6450, type: 'ceilspike' },
      { x: 6840, type: 'bigspike' },
      { x: 7140, type: 'enemy' },
      { x: 7204, type: 'enemy' },
      { x: 7268, type: 'enemy' },
      { x: 7558, type: 'spike' },
      { x: 7828, type: 'bigspike' },
      { x: 8118, type: 'gap', width: 110 },
      { x: 8478, type: 'enemy' },
      { x: 8542, type: 'enemy' },
      { x: 8606, type: 'enemy' },
      { x: 8670, type: 'enemy' },
      { x: 8734, type: 'enemy' },
      { x: 9014, type: 'spike' },
      { x: 9244, type: 'spike' },
      { x: 9474, type: 'bigspike' },
      { x: 9824, type: 'ceilspike' },
      { x: 10214, type: 'bigspike' },
      { x: 10504, type: 'gap', width: 90 },
      { x: 10844, type: 'enemy' },
      { x: 10908, type: 'enemy' },
      { x: 11198, type: 'spike' },
      { x: 11428, type: 'spike' },
      { x: 11658, type: 'spike' },
      { x: 11928, type: 'bigspike' },
      { x: 12198, type: 'gap', width: 100 },
      { x: 12518, type: 'bigspike' },
      { x: 12788, type: 'enemy' },
      { x: 12852, type: 'enemy' },
      { x: 12916, type: 'enemy' },
      { x: 12980, type: 'enemy' },
      { x: 13044, type: 'enemy' },
      { x: 13108, type: 'enemy' },
      { x: 13388, type: 'spike' },
      { x: 13608, type: 'spike' },
      { x: 13828, type: 'spike' },
      { x: 14158, type: 'ceilspike' },
      { x: 14548, type: 'spike' },
      { x: 14788, type: 'gap', width: 100 },
      { x: 15128, type: 'bigspike' },
      { x: 15418, type: 'bigspike' },
      { x: 15708, type: 'enemy' },
      { x: 15772, type: 'enemy' },
      { x: 15836, type: 'enemy' },
      { x: 15900, type: 'enemy' },
      { x: 16190, type: 'spike' },
      { x: 16430, type: 'gap', width: 90 },
      { x: 16820, type: 'ceilspike' },
      { x: 17210, type: 'gap', width: 100 },
      { x: 17610, type: 'ceilspike' },
      { x: 18000, type: 'bigspike' },
      { x: 18290, type: 'enemy' },
      { x: 18354, type: 'enemy' },
      { x: 18418, type: 'enemy' },
      { x: 18482, type: 'enemy' },
      { x: 18546, type: 'enemy' },
      { x: 18836, type: 'spike' },
      { x: 19066, type: 'spike' },
      { x: 19336, type: 'bigspike' },
      { x: 19606, type: 'gap', width: 110 },
      { x: 19956, type: 'enemy' },
      { x: 20020, type: 'enemy' },
      { x: 20084, type: 'enemy' },
      { x: 20364, type: 'spike' },
      { x: 20584, type: 'bigspike' },
      { x: 20824, type: 'bigspike' },
      { x: 21174, type: 'ceilspike' },
      { x: 21564, type: 'gap', width: 100 },
      { x: 21904, type: 'enemy' },
      { x: 21968, type: 'enemy' },
      { x: 22032, type: 'enemy' },
      { x: 22096, type: 'enemy' },
      { x: 22160, type: 'enemy' },
      { x: 22224, type: 'enemy' },
      { x: 22504, type: 'spike' },
      { x: 22734, type: 'spike' },
      { x: 22964, type: 'bigspike' },
      { x: 23254, type: 'gap', width: 90 },
      { x: 23594, type: 'bigspike' },
      { x: 23884, type: 'enemy' },
      { x: 23948, type: 'enemy' },
      { x: 24228, type: 'spike' },
      { x: 24558, type: 'ceilspike' },
      { x: 24948, type: 'gap', width: 100 },
      { x: 25348, type: 'ceilspike' },
      { x: 25738, type: 'bigspike' },
      { x: 26008, type: 'gap', width: 100 },
      { x: 26348, type: 'enemy' },
      { x: 26412, type: 'enemy' },
      { x: 26476, type: 'enemy' },
      { x: 26756, type: 'spike' },
      { x: 26986, type: 'spike' },
      { x: 27216, type: 'bigspike' },
      { x: 27506, type: 'gap', width: 90 },
      { x: 27846, type: 'bigspike' },
      { x: 28136, type: 'enemy' },
      { x: 28200, type: 'enemy' },
      { x: 28480, type: 'spike' },
      { x: 28810, type: 'ceilspike' },
      { x: 29200, type: 'bigspike' },
      { x: 29470, type: 'gap', width: 100 },
      { x: 29810, type: 'enemy' },
      { x: 29874, type: 'enemy' },
      { x: 29938, type: 'enemy' },
      { x: 30002, type: 'enemy' },
      { x: 30282, type: 'spike' },
      { x: 30512, type: 'spike' },
      { x: 30742, type: 'bigspike' },
      { x: 31032, type: 'gap', width: 90 },
      { x: 31372, type: 'bigspike' },
      { x: 31662, type: 'enemy' },
      { x: 31726, type: 'enemy' },
      { x: 32006, type: 'spike' }
    ]
  },
  {
    id: 'level10',
    name: 'Nivel 10 · Caos total',
    baseScrollSpeed: 330,
    length: 40381,
    unlocksFood: 'riceballS',
    goalColor: '#F2545B',
    obstacles: [
      { x: 520, type: 'spike' },
      { x: 810, type: 'gap', width: 90 },
      { x: 1200, type: 'bigspike' },
      { x: 1502, type: 'bigspike' },
      { x: 1781, type: 'spike' },
      { x: 2131, type: 'bigspike' },
      { x: 2501, type: 'enemy' },
      { x: 2565, type: 'enemy' },
      { x: 2843, type: 'gap', width: 90 },
      { x: 3233, type: 'ceilspike' },
      { x: 3623, type: 'bigspike' },
      { x: 3901, type: 'spike' },
      { x: 4172, type: 'gap', width: 100 },
      { x: 4572, type: 'enemy' },
      { x: 4636, type: 'enemy' },
      { x: 4700, type: 'enemy' },
      { x: 4955, type: 'spike' },
      { x: 5235, type: 'spike' },
      { x: 5488, type: 'spike' },
      { x: 5818, type: 'ceilspike' },
      { x: 6208, type: 'gap', width: 100 },
      { x: 6608, type: 'ceilspike' },
      { x: 6998, type: 'bigspike' },
      { x: 7289, type: 'bigspike' },
      { x: 7562, type: 'spike' },
      { x: 7912, type: 'bigspike' },
      { x: 8282, type: 'enemy' },
      { x: 8346, type: 'enemy' },
      { x: 8410, type: 'enemy' },
      { x: 8708, type: 'enemy' },
      { x: 9048, type: 'ceilspike' },
      { x: 9438, type: 'bigspike' },
      { x: 9734, type: 'bigspike' },
      { x: 10020, type: 'spike' },
      { x: 10370, type: 'enemy' },
      { x: 10434, type: 'enemy' },
      { x: 10498, type: 'enemy' },
      { x: 10790, type: 'gap', width: 100 },
      { x: 11190, type: 'bigspike' },
      { x: 11461, type: 'spike' },
      { x: 11791, type: 'ceilspike' },
      { x: 12181, type: 'gap', width: 100 },
      { x: 12581, type: 'ceilspike' },
      { x: 12971, type: 'bigspike' },
      { x: 13371, type: 'platform' },
      { x: 13851, type: 'spike' },
      { x: 14231, type: 'bigspike' },
      { x: 14523, type: 'spike' },
      { x: 14772, type: 'spike' },
      { x: 15122, type: 'bigspike' },
      { x: 15403, type: 'spike' },
      { x: 15733, type: 'ceilspike' },
      { x: 16123, type: 'spike' },
      { x: 16415, type: 'gap', width: 110 },
      { x: 16825, type: 'bigspike' },
      { x: 17099, type: 'spike' },
      { x: 17387, type: 'enemy' },
      { x: 17451, type: 'enemy' },
      { x: 17710, type: 'spike' },
      { x: 17967, type: 'spike' },
      { x: 18297, type: 'ceilspike' },
      { x: 18687, type: 'gap', width: 100 },
      { x: 19087, type: 'ceilspike' },
      { x: 19477, type: 'enemy' },
      { x: 19541, type: 'enemy' },
      { x: 19605, type: 'enemy' },
      { x: 19894, type: 'gap', width: 110 },
      { x: 20304, type: 'gap', width: 100 },
      { x: 20704, type: 'spike' },
      { x: 20955, type: 'spike' },
      { x: 21204, type: 'spike' },
      { x: 21534, type: 'ceilspike' },
      { x: 21924, type: 'gap', width: 100 },
      { x: 22324, type: 'ceilspike' },
      { x: 22714, type: 'bigspike' },
      { x: 23013, type: 'bigspike' },
      { x: 23383, type: 'spike' },
      { x: 23733, type: 'spike' },
      { x: 24083, type: 'enemy' },
      { x: 24423, type: 'ceilspike' },
      { x: 24813, type: 'gap', width: 90 },
      { x: 25203, type: 'ceilspike' },
      { x: 25593, type: 'spike' },
      { x: 25866, type: 'spike' },
      { x: 26161, type: 'spike' },
      { x: 26511, type: 'enemy' },
      { x: 26800, type: 'bigspike' },
      { x: 27068, type: 'spike' },
      { x: 27362, type: 'gap', width: 100 },
      { x: 27812, type: 'platform' },
      { x: 28292, type: 'spike' },
      { x: 28672, type: 'spike' },
      { x: 28928, type: 'spike' },
      { x: 29175, type: 'spike' },
      { x: 29525, type: 'spike' },
      { x: 29790, type: 'spike' },
      { x: 30140, type: 'enemy' },
      { x: 30204, type: 'enemy' },
      { x: 30268, type: 'enemy' },
      { x: 30332, type: 'enemy' },
      { x: 30593, type: 'spike' },
      { x: 30855, type: 'spike' },
      { x: 31185, type: 'ceilspike' },
      { x: 31575, type: 'spike' },
      { x: 31840, type: 'spike' },
      { x: 32190, type: 'bigspike' },
      { x: 32457, type: 'spike' },
      { x: 32807, type: 'gap', width: 100 },
      { x: 33207, type: 'gap', width: 90 },
      { x: 33597, type: 'ceilspike' },
      { x: 33987, type: 'gap', width: 100 },
      { x: 34387, type: 'ceilspike' },
      { x: 34777, type: 'gap', width: 90 },
      { x: 35167, type: 'spike' },
      { x: 35437, type: 'gap', width: 110 },
      { x: 35847, type: 'spike' },
      { x: 36105, type: 'spike' },
      { x: 36372, type: 'bigspike' },
      { x: 36742, type: 'bigspike' },
      { x: 37032, type: 'spike' },
      { x: 37382, type: 'bigspike' },
      { x: 37669, type: 'spike' },
      { x: 38019, type: 'bigspike' },
      { x: 38313, type: 'spike' },
      { x: 38663, type: 'spike' },
      { x: 38931, type: 'spike' },
      { x: 39281, type: 'spike' },
      { x: 39631, type: 'gap', width: 100 }
    ]
  },
  {
    id: 'level11',
    name: 'Nivel 11 · El infierno del sushi',
    baseScrollSpeed: 330,
    length: 29370,
    unlocksFood: null,
    theme: 'hell',
    goalColor: '#FF7A1A',
    obstacles: [
      { x: 560, type: 'spike' },
      { x: 810, type: 'spike' },
      { x: 1100, type: 'gap', width: 100 },
      { x: 1460, type: 'bigspike' },
      { x: 1770, type: 'enemy' },
      { x: 1834, type: 'enemy' },
      { x: 1898, type: 'enemy' },
      { x: 2198, type: 'spike' },
      { x: 2488, type: 'spike' },
      { x: 2838, type: 'ceilspike' },
      { x: 3248, type: 'gap', width: 100 },
      { x: 3608, type: 'bigspike' },
      { x: 3888, type: 'bigspike' },
      { x: 4198, type: 'enemy' },
      { x: 4262, type: 'enemy' },
      { x: 4326, type: 'enemy' },
      { x: 4390, type: 'enemy' },
      { x: 4690, type: 'spike' },
      { x: 4940, type: 'spike' },
      { x: 5230, type: 'gap', width: 90 },
      { x: 5580, type: 'spike' },
      { x: 5840, type: 'bigspike' },
      { x: 6210, type: 'ceilspike' },
      { x: 6620, type: 'bigspike' },
      { x: 6930, type: 'enemy' },
      { x: 6994, type: 'enemy' },
      { x: 7058, type: 'enemy' },
      { x: 7358, type: 'spike' },
      { x: 7578, type: 'spike' },
      { x: 7798, type: 'spike' },
      { x: 8088, type: 'gap', width: 110 },
      { x: 8458, type: 'bigspike' },
      { x: 8738, type: 'bigspike' },
      { x: 9048, type: 'enemy' },
      { x: 9112, type: 'enemy' },
      { x: 9176, type: 'enemy' },
      { x: 9240, type: 'enemy' },
      { x: 9304, type: 'enemy' },
      { x: 9604, type: 'spike' },
      { x: 9954, type: 'ceilspike' },
      { x: 10364, type: 'gap', width: 100 },
      { x: 10784, type: 'ceilspike' },
      { x: 11194, type: 'bigspike' },
      { x: 11504, type: 'spike' },
      { x: 11754, type: 'spike' },
      { x: 12164, type: 'platform' },
      { x: 12674, type: 'spike' },
      { x: 12964, type: 'bigspike' },
      { x: 13224, type: 'spike' },
      { x: 13514, type: 'enemy' },
      { x: 13578, type: 'enemy' },
      { x: 13642, type: 'enemy' },
      { x: 13706, type: 'enemy' },
      { x: 14006, type: 'gap', width: 90 },
      { x: 14356, type: 'bigspike' },
      { x: 14636, type: 'bigspike' },
      { x: 14946, type: 'spike' },
      { x: 15196, type: 'spike' },
      { x: 15546, type: 'ceilspike' },
      { x: 15956, type: 'enemy' },
      { x: 16020, type: 'enemy' },
      { x: 16084, type: 'enemy' },
      { x: 16384, type: 'gap', width: 100 },
      { x: 16744, type: 'spike' },
      { x: 17004, type: 'bigspike' },
      { x: 17314, type: 'bigspike' },
      { x: 17624, type: 'spike' },
      { x: 17844, type: 'spike' },
      { x: 18064, type: 'spike' },
      { x: 18354, type: 'enemy' },
      { x: 18418, type: 'enemy' },
      { x: 18482, type: 'enemy' },
      { x: 18546, type: 'enemy' },
      { x: 18610, type: 'enemy' },
      { x: 18674, type: 'enemy' },
      { x: 19034, type: 'ceilspike' },
      { x: 19444, type: 'gap', width: 110 },
      { x: 19814, type: 'bigspike' },
      { x: 20094, type: 'bigspike' },
      { x: 20404, type: 'spike' },
      { x: 20654, type: 'spike' },
      { x: 20944, type: 'enemy' },
      { x: 21008, type: 'enemy' },
      { x: 21072, type: 'enemy' },
      { x: 21136, type: 'enemy' },
      { x: 21436, type: 'spike' },
      { x: 21696, type: 'bigspike' },
      { x: 22006, type: 'gap', width: 90 },
      { x: 22416, type: 'ceilspike' },
      { x: 22886, type: 'platform' },
      { x: 23396, type: 'spike' },
      { x: 23646, type: 'spike' },
      { x: 23936, type: 'bigspike' },
      { x: 24246, type: 'enemy' },
      { x: 24310, type: 'enemy' },
      { x: 24374, type: 'enemy' },
      { x: 24674, type: 'spike' },
      { x: 24964, type: 'gap', width: 100 },
      { x: 25324, type: 'bigspike' },
      { x: 25584, type: 'spike' },
      { x: 25934, type: 'ceilspike' },
      { x: 26344, type: 'enemy' },
      { x: 26408, type: 'enemy' },
      { x: 26472, type: 'enemy' },
      { x: 26536, type: 'enemy' },
      { x: 26600, type: 'enemy' },
      { x: 26900, type: 'spike' },
      { x: 27150, type: 'spike' },
      { x: 27440, type: 'bigspike' },
      { x: 27720, type: 'bigspike' },
      { x: 28030, type: 'gap', width: 110 },
      { x: 28400, type: 'spike' },
      { x: 28690, type: 'spike' }
    ]
  },
  {
    id: 'level12',
    name: 'Nivel 12 · El caos infernal',
    baseScrollSpeed: 330,
    length: 31666,
    unlocksFood: null,
    theme: 'hell',
    goalColor: '#8B0000',
    obstacles: [
      { x: 560, type: 'ceilspike' },
      { x: 950, type: 'ceilspike' },
      { x: 1340, type: 'spike' },
      { x: 1590, type: 'spike' },
      { x: 1840, type: 'bigspike' },
      { x: 2110, type: 'spike' },
      { x: 2370, type: 'bigspike' },
      { x: 2640, type: 'spike' },
      { x: 2970, type: 'ceilspike' },
      { x: 3360, type: 'gap', width: 100 },
      { x: 3680, type: 'gap', width: 100 },
      { x: 4000, type: 'spike' },
      { x: 4250, type: 'spike' },
      { x: 4500, type: 'bigspike' },
      { x: 4770, type: 'spike' },
      { x: 5020, type: 'spike' },
      { x: 5270, type: 'spike' },
      { x: 5530, type: 'bigspike' },
      { x: 5800, type: 'enemy' },
      { x: 5864, type: 'enemy' },
      { x: 5928, type: 'enemy' },
      { x: 6268, type: 'ceilspike' },
      { x: 6658, type: 'gap', width: 90 },
      { x: 6968, type: 'enemy' },
      { x: 7032, type: 'enemy' },
      { x: 7096, type: 'enemy' },
      { x: 7160, type: 'enemy' },
      { x: 7420, type: 'enemy' },
      { x: 7484, type: 'enemy' },
      { x: 7824, type: 'ceilspike' },
      { x: 8214, type: 'spike' },
      { x: 8464, type: 'spike' },
      { x: 8714, type: 'spike' },
      { x: 8964, type: 'spike' },
      { x: 9184, type: 'spike' },
      { x: 9404, type: 'spike' },
      { x: 9654, type: 'enemy' },
      { x: 9718, type: 'enemy' },
      { x: 9782, type: 'enemy' },
      { x: 9846, type: 'enemy' },
      { x: 10106, type: 'spike' },
      { x: 10356, type: 'enemy' },
      { x: 10420, type: 'enemy' },
      { x: 10484, type: 'enemy' },
      { x: 10548, type: 'enemy' },
      { x: 10612, type: 'enemy' },
      { x: 10872, type: 'gap', width: 110 },
      { x: 11202, type: 'bigspike' },
      { x: 11472, type: 'enemy' },
      { x: 11536, type: 'enemy' },
      { x: 11600, type: 'enemy' },
      { x: 11860, type: 'enemy' },
      { x: 11924, type: 'enemy' },
      { x: 11988, type: 'enemy' },
      { x: 12052, type: 'enemy' },
      { x: 12116, type: 'enemy' },
      { x: 12180, type: 'enemy' },
      { x: 12440, type: 'spike' },
      { x: 12690, type: 'enemy' },
      { x: 12754, type: 'enemy' },
      { x: 12818, type: 'enemy' },
      { x: 12882, type: 'enemy' },
      { x: 12946, type: 'enemy' },
      { x: 13206, type: 'bigspike' },
      { x: 13486, type: 'bigspike' },
      { x: 13756, type: 'spike' },
      { x: 14016, type: 'bigspike' },
      { x: 14286, type: 'spike' },
      { x: 14536, type: 'spike' },
      { x: 14786, type: 'gap', width: 90 },
      { x: 15176, type: 'ceilspike' },
      { x: 15566, type: 'ceilspike' },
      { x: 15956, type: 'ceilspike' },
      { x: 16346, type: 'bigspike' },
      { x: 16616, type: 'gap', width: 110 },
      { x: 16946, type: 'spike' },
      { x: 17206, type: 'bigspike' },
      { x: 17476, type: 'gap', width: 90 },
      { x: 17786, type: 'gap', width: 100 },
      { x: 18106, type: 'spike' },
      { x: 18356, type: 'bigspike' },
      { x: 18626, type: 'spike' },
      { x: 18876, type: 'enemy' },
      { x: 18940, type: 'enemy' },
      { x: 19004, type: 'enemy' },
      { x: 19264, type: 'enemy' },
      { x: 19328, type: 'enemy' },
      { x: 19392, type: 'enemy' },
      { x: 19456, type: 'enemy' },
      { x: 19716, type: 'bigspike' },
      { x: 19976, type: 'spike' },
      { x: 20306, type: 'ceilspike' },
      { x: 20746, type: 'platform' },
      { x: 21226, type: 'spike' },
      { x: 21446, type: 'spike' },
      { x: 21666, type: 'spike' },
      { x: 21916, type: 'bigspike' },
      { x: 22196, type: 'bigspike' },
      { x: 22466, type: 'gap', width: 100 },
      { x: 22786, type: 'bigspike' },
      { x: 23066, type: 'bigspike' },
      { x: 23336, type: 'enemy' },
      { x: 23400, type: 'enemy' },
      { x: 23464, type: 'enemy' },
      { x: 23724, type: 'bigspike' },
      { x: 23994, type: 'bigspike' },
      { x: 24274, type: 'bigspike' },
      { x: 24544, type: 'spike' },
      { x: 24764, type: 'spike' },
      { x: 24984, type: 'spike' },
      { x: 25234, type: 'gap', width: 110 },
      { x: 25694, type: 'platform' },
      { x: 26174, type: 'gap', width: 100 },
      { x: 26494, type: 'bigspike' },
      { x: 26754, type: 'spike' },
      { x: 27004, type: 'gap', width: 100 },
      { x: 27324, type: 'enemy' },
      { x: 27388, type: 'enemy' },
      { x: 27452, type: 'enemy' },
      { x: 27516, type: 'enemy' },
      { x: 27580, type: 'enemy' },
      { x: 27644, type: 'enemy' },
      { x: 27904, type: 'spike' },
      { x: 28154, type: 'spike' },
      { x: 28404, type: 'gap', width: 90 },
      { x: 28714, type: 'enemy' },
      { x: 28778, type: 'enemy' },
      { x: 28842, type: 'enemy' },
      { x: 28906, type: 'enemy' },
      { x: 29166, type: 'bigspike' },
      { x: 29446, type: 'bigspike' },
      { x: 29796, type: 'ceilspike' },
      { x: 30186, type: 'spike' },
      { x: 30436, type: 'spike' },
      { x: 30686, type: 'bigspike' },
      { x: 30966, type: 'bigspike' }
    ]
  },
  {
    id: 'level13',
    name: 'Nivel 13 · Fosa abisal',
    baseScrollSpeed: 330,
    length: 43925,
    unlocksFood: 'tempura',
    theme: 'ocean',
    goalColor: '#0B7A9E',
    obstacles: [
      { x: 560, type: 'ceilspike' },
      { x: 950, type: 'ceilspike' },
      { x: 1340, type: 'spike' },
      { x: 1590, type: 'spike' },
      { x: 1840, type: 'bigspike' },
      { x: 2110, type: 'spike' },
      { x: 2370, type: 'bigspike' },
      { x: 2640, type: 'spike' },
      { x: 2970, type: 'ceilspike' },
      { x: 3360, type: 'gap', width: 100 },
      { x: 3680, type: 'gap', width: 100 },
      { x: 4000, type: 'spike' },
      { x: 4250, type: 'spike' },
      { x: 4500, type: 'bigspike' },
      { x: 4770, type: 'spike' },
      { x: 5020, type: 'spike' },
      { x: 5270, type: 'spike' },
      { x: 5530, type: 'bigspike' },
      { x: 5800, type: 'enemy' },
      { x: 5864, type: 'enemy' },
      { x: 5928, type: 'enemy' },
      { x: 6268, type: 'ceilspike' },
      { x: 6778, type: 'bigspike' },
      { x: 7038, type: 'bigspike' },
      { x: 7388, type: 'ceilspike' },
      { x: 7778, type: 'gap', width: 100 },
      { x: 8178, type: 'ceilspike' },
      { x: 8568, type: 'bigspike' },
      { x: 8868, type: 'enemy' },
      { x: 8932, type: 'enemy' },
      { x: 8996, type: 'enemy' },
      { x: 9286, type: 'spike' },
      { x: 9556, type: 'bigspike' },
      { x: 9846, type: 'gap', width: 110 },
      { x: 10206, type: 'enemy' },
      { x: 10270, type: 'enemy' },
      { x: 10334, type: 'enemy' },
      { x: 10398, type: 'enemy' },
      { x: 10462, type: 'enemy' },
      { x: 10742, type: 'spike' },
      { x: 10972, type: 'spike' },
      { x: 11202, type: 'bigspike' },
      { x: 11552, type: 'ceilspike' },
      { x: 11942, type: 'bigspike' },
      { x: 12412, type: 'bigspike' },
      { x: 12812, type: 'platform' },
      { x: 13292, type: 'spike' },
      { x: 13672, type: 'bigspike' },
      { x: 13964, type: 'spike' },
      { x: 14213, type: 'spike' },
      { x: 14563, type: 'bigspike' },
      { x: 14844, type: 'spike' },
      { x: 15174, type: 'ceilspike' },
      { x: 15564, type: 'spike' },
      { x: 15856, type: 'gap', width: 110 },
      { x: 16266, type: 'bigspike' },
      { x: 16540, type: 'spike' },
      { x: 16828, type: 'enemy' },
      { x: 16892, type: 'enemy' },
      { x: 17151, type: 'spike' },
      { x: 17408, type: 'spike' },
      { x: 17738, type: 'ceilspike' },
      { x: 18128, type: 'gap', width: 100 },
      { x: 18528, type: 'ceilspike' },
      { x: 18918, type: 'enemy' },
      { x: 18982, type: 'enemy' },
      { x: 19046, type: 'enemy' },
      { x: 19506, type: 'ceilspike' },
      { x: 19946, type: 'platform' },
      { x: 20426, type: 'spike' },
      { x: 20646, type: 'spike' },
      { x: 20866, type: 'spike' },
      { x: 21116, type: 'bigspike' },
      { x: 21396, type: 'bigspike' },
      { x: 21666, type: 'gap', width: 100 },
      { x: 21986, type: 'bigspike' },
      { x: 22266, type: 'bigspike' },
      { x: 22536, type: 'enemy' },
      { x: 22600, type: 'enemy' },
      { x: 22664, type: 'enemy' },
      { x: 22924, type: 'bigspike' },
      { x: 23194, type: 'bigspike' },
      { x: 23474, type: 'bigspike' },
      { x: 23744, type: 'spike' },
      { x: 23964, type: 'spike' },
      { x: 24184, type: 'spike' },
      { x: 24434, type: 'gap', width: 110 },
      { x: 24894, type: 'platform' },
      { x: 25374, type: 'gap', width: 100 },
      { x: 25894, type: 'bigspike' },
      { x: 26204, type: 'gap', width: 90 },
      { x: 26614, type: 'ceilspike' },
      { x: 27084, type: 'platform' },
      { x: 27594, type: 'spike' },
      { x: 27844, type: 'spike' },
      { x: 28134, type: 'bigspike' },
      { x: 28444, type: 'enemy' },
      { x: 28508, type: 'enemy' },
      { x: 28572, type: 'enemy' },
      { x: 28872, type: 'spike' },
      { x: 29162, type: 'gap', width: 100 },
      { x: 29522, type: 'bigspike' },
      { x: 29782, type: 'spike' },
      { x: 30132, type: 'ceilspike' },
      { x: 30542, type: 'enemy' },
      { x: 30606, type: 'enemy' },
      { x: 30670, type: 'enemy' },
      { x: 30734, type: 'enemy' },
      { x: 30798, type: 'enemy' },
      { x: 31098, type: 'spike' },
      { x: 31348, type: 'spike' },
      { x: 31638, type: 'bigspike' },
      { x: 31918, type: 'bigspike' },
      { x: 32388, type: 'platform' },
      { x: 32868, type: 'spike' },
      { x: 33248, type: 'spike' },
      { x: 33504, type: 'spike' },
      { x: 33751, type: 'spike' },
      { x: 34101, type: 'spike' },
      { x: 34366, type: 'spike' },
      { x: 34716, type: 'enemy' },
      { x: 34780, type: 'enemy' },
      { x: 34844, type: 'enemy' },
      { x: 34908, type: 'enemy' },
      { x: 35169, type: 'spike' },
      { x: 35431, type: 'spike' },
      { x: 35761, type: 'ceilspike' },
      { x: 36151, type: 'spike' },
      { x: 36416, type: 'spike' },
      { x: 36766, type: 'bigspike' },
      { x: 37033, type: 'spike' },
      { x: 37383, type: 'gap', width: 100 },
      { x: 37783, type: 'gap', width: 90 },
      { x: 38173, type: 'ceilspike' },
      { x: 38563, type: 'gap', width: 100 },
      { x: 39083, type: 'bigspike' },
      { x: 39343, type: 'spike' },
      { x: 39593, type: 'gap', width: 100 },
      { x: 39913, type: 'enemy' },
      { x: 39977, type: 'enemy' },
      { x: 40041, type: 'enemy' },
      { x: 40105, type: 'enemy' },
      { x: 40169, type: 'enemy' },
      { x: 40233, type: 'enemy' },
      { x: 40493, type: 'spike' },
      { x: 40743, type: 'spike' },
      { x: 40993, type: 'gap', width: 90 },
      { x: 41303, type: 'enemy' },
      { x: 41367, type: 'enemy' },
      { x: 41431, type: 'enemy' },
      { x: 41495, type: 'enemy' },
      { x: 41755, type: 'bigspike' },
      { x: 42035, type: 'bigspike' },
      { x: 42385, type: 'ceilspike' },
      { x: 42775, type: 'spike' },
      { x: 43025, type: 'spike' },
      { x: 43275, type: 'bigspike' }
    ]
  }
];

/* ===== Eventos: partidas especiales, siempre jugables desde el principio
   (no dependen de haber completado ningún nivel de la campaña). Superarlas
   desbloquea un personaje que no forma parte de la progresión normal. */
const EVENTS = [
  {
    id: 'event_wasabi',
    name: 'Evento · La ira del wasabi',
    baseScrollSpeed: 300,
    length: 10580,
    unlocksFood: 'wasabi',
    theme: 'kitchen',
    goalColor: '#5c9e3f',
    obstacles: [
      { x: 560, type: 'spike' },
      { x: 850, type: 'gap', width: 100 },
      { x: 1210, type: 'bigspike' },
      { x: 1520, type: 'enemy' },
      { x: 1590, type: 'enemy' },
      { x: 1890, type: 'spike' },
      { x: 2140, type: 'spike' },
      { x: 2430, type: 'gap', width: 90 },
      { x: 2780, type: 'spike' },
      { x: 3040, type: 'bigspike' },
      { x: 3350, type: 'enemy' },
      { x: 3420, type: 'enemy' },
      { x: 3490, type: 'enemy' },
      { x: 3790, type: 'spike' },
      { x: 4080, type: 'gap', width: 100 },
      { x: 4440, type: 'bigspike' },
      { x: 4700, type: 'spike' },
      { x: 4990, type: 'enemy' },
      { x: 5060, type: 'enemy' },
      { x: 5360, type: 'spike' },
      { x: 5610, type: 'spike' },
      { x: 5900, type: 'gap', width: 110 },
      { x: 6270, type: 'bigspike' },
      { x: 6580, type: 'enemy' },
      { x: 6650, type: 'enemy' },
      { x: 6720, type: 'enemy' },
      { x: 7020, type: 'spike' },
      { x: 7310, type: 'spike' },
      { x: 7600, type: 'gap', width: 90 },
      { x: 7950, type: 'spike' },
      { x: 8210, type: 'bigspike' },
      { x: 8520, type: 'enemy' },
      { x: 8590, type: 'enemy' },
      { x: 8660, type: 'enemy' },
      { x: 8730, type: 'enemy' },
      { x: 9030, type: 'spike' },
      { x: 9280, type: 'spike' },
      { x: 9570, type: 'gap', width: 100 },
      { x: 9930, type: 'bigspike' }
    ]
  },
  {
    id: 'event_soy',
    name: 'Evento · La carrera de la soja',
    baseScrollSpeed: 300,
    length: 10320,
    unlocksFood: 'soy',
    theme: 'kitchen',
    goalColor: '#4A2E1A',
    obstacles: [
      { x: 560, type: 'spike' },
      { x: 850, type: 'enemy' },
      { x: 920, type: 'enemy' },
      { x: 1220, type: 'gap', width: 90 },
      { x: 1570, type: 'bigspike' },
      { x: 1880, type: 'spike' },
      { x: 2130, type: 'spike' },
      { x: 2420, type: 'enemy' },
      { x: 2490, type: 'enemy' },
      { x: 2560, type: 'enemy' },
      { x: 2860, type: 'gap', width: 100 },
      { x: 3220, type: 'spike' },
      { x: 3480, type: 'bigspike' },
      { x: 3790, type: 'spike' },
      { x: 4080, type: 'enemy' },
      { x: 4150, type: 'enemy' },
      { x: 4450, type: 'gap', width: 110 },
      { x: 4820, type: 'bigspike' },
      { x: 5080, type: 'spike' },
      { x: 5370, type: 'spike' },
      { x: 5620, type: 'spike' },
      { x: 5910, type: 'enemy' },
      { x: 5980, type: 'enemy' },
      { x: 6050, type: 'enemy' },
      { x: 6120, type: 'enemy' },
      { x: 6420, type: 'gap', width: 90 },
      { x: 6770, type: 'bigspike' },
      { x: 7080, type: 'spike' },
      { x: 7370, type: 'gap', width: 100 },
      { x: 7730, type: 'enemy' },
      { x: 7800, type: 'enemy' },
      { x: 7870, type: 'enemy' },
      { x: 8170, type: 'spike' },
      { x: 8430, type: 'bigspike' },
      { x: 8740, type: 'spike' },
      { x: 9030, type: 'spike' },
      { x: 9320, type: 'gap', width: 90 },
      { x: 9670, type: 'bigspike' }
    ]
  },
  {
    id: 'event_ramen',
    name: 'Evento · Ramen extremo',
    baseScrollSpeed: 330,
    length: 20782,
    unlocksFood: 'ramen',
    theme: 'ramen',
    goalColor: '#E0972E',
    // Nivel Difícil: a diferencia de los otros dos Eventos (dificultad "intermedia",
    // sin pincho de techo ni plataforma), este reutiliza tramos completos ya
    // validados de los Niveles 7 y 10 (misma baseScrollSpeed 330) para heredar su
    // seguridad sin volver a demostrarla — incluye pincho de techo y plataforma
    // elevada, las dos características que marcan a los niveles "avanzados" de la
    // campaña. Las tres costuras entre tramos usan un margen llano fijo de 420px,
    // por encima de los mínimos ya documentados (220/300/350px).
    obstacles: [
      { x: 560, type: 'spike' },
      { x: 860, type: 'spike' },
      { x: 1180, type: 'gap', width: 100 },
      { x: 1570, type: 'bigspike' },
      { x: 1890, type: 'enemy' },
      { x: 1954, type: 'enemy' },
      { x: 2264, type: 'spike' },
      { x: 2524, type: 'spike' },
      { x: 2854, type: 'ceilspike' },
      { x: 3244, type: 'gap', width: 100 },
      { x: 3634, type: 'bigspike' },
      { x: 3954, type: 'enemy' },
      { x: 4018, type: 'enemy' },
      { x: 4082, type: 'enemy' },
      { x: 4412, type: 'spike' },
      { x: 4672, type: 'spike' },
      { x: 4992, type: 'gap', width: 90 },
      { x: 5372, type: 'bigspike' },
      { x: 5672, type: 'bigspike' },
      { x: 6022, type: 'ceilspike' },
      { x: 6412, type: 'gap', width: 100 },
      { x: 6802, type: 'enemy' },
      { x: 6866, type: 'enemy' },
      { x: 6930, type: 'enemy' },
      { x: 7260, type: 'spike' },
      { x: 7560, type: 'bigspike' },
      { x: 7880, type: 'gap', width: 110 },
      { x: 8280, type: 'enemy' },
      { x: 8344, type: 'enemy' },
      { x: 8408, type: 'enemy' },
      { x: 8472, type: 'enemy' },
      { x: 8782, type: 'spike' },
      { x: 9042, type: 'spike' },
      { x: 9302, type: 'bigspike' },
      { x: 9652, type: 'ceilspike' },
      { x: 10042, type: 'bigspike' },
      { x: 10362, type: 'gap', width: 90 },
      { x: 10742, type: 'enemy' },
      { x: 10806, type: 'enemy' },
      { x: 11136, type: 'spike' },
      { x: 11396, type: 'spike' },
      { x: 11656, type: 'spike' },
      { x: 11956, type: 'bigspike' },
      { x: 12256, type: 'gap', width: 100 },
      { x: 12606, type: 'bigspike' },
      { x: 12906, type: 'enemy' },
      { x: 12970, type: 'enemy' },
      { x: 13034, type: 'enemy' },
      { x: 13098, type: 'enemy' },
      { x: 13162, type: 'enemy' },
      { x: 13622, type: 'bigspike' },
      { x: 14022, type: 'platform' },
      { x: 14502, type: 'spike' },
      { x: 14882, type: 'bigspike' },
      { x: 15174, type: 'spike' },
      { x: 15423, type: 'spike' },
      { x: 15773, type: 'bigspike' },
      { x: 16054, type: 'spike' },
      { x: 16384, type: 'ceilspike' },
      { x: 16774, type: 'spike' },
      { x: 17066, type: 'gap', width: 110 },
      { x: 17476, type: 'bigspike' },
      { x: 17750, type: 'spike' },
      { x: 18038, type: 'enemy' },
      { x: 18102, type: 'enemy' },
      { x: 18562, type: 'gap', width: 90 },
      { x: 18952, type: 'ceilspike' },
      { x: 19342, type: 'gap', width: 100 },
      { x: 19742, type: 'ceilspike' },
      { x: 20132, type: 'bigspike' }
    ]
  },
  {
    id: 'event_rice',
    name: 'Evento · Tormenta de arroz',
    baseScrollSpeed: 300,
    length: 10626,
    unlocksFood: 'teriyakiRice',
    theme: 'rice',
    goalColor: '#B5651D',
    obstacles: [
      { x: 560, type: 'spike' },
      { x: 820, type: 'spike' },
      { x: 1080, type: 'gap', width: 100 },
      { x: 1440, type: 'bigspike' },
      { x: 1750, type: 'enemy' },
      { x: 1814, type: 'enemy' },
      { x: 1878, type: 'enemy' },
      { x: 2178, type: 'spike' },
      { x: 2468, type: 'spike' },
      { x: 2758, type: 'spike' },
      { x: 3048, type: 'gap', width: 90 },
      { x: 3398, type: 'bigspike' },
      { x: 3708, type: 'enemy' },
      { x: 3772, type: 'enemy' },
      { x: 4072, type: 'spike' },
      { x: 4362, type: 'spike' },
      { x: 4652, type: 'gap', width: 110 },
      { x: 5022, type: 'bigspike' },
      { x: 5332, type: 'enemy' },
      { x: 5396, type: 'enemy' },
      { x: 5460, type: 'enemy' },
      { x: 5524, type: 'enemy' },
      { x: 5824, type: 'spike' },
      { x: 6114, type: 'spike' },
      { x: 6374, type: 'spike' },
      { x: 6664, type: 'gap', width: 90 },
      { x: 7014, type: 'bigspike' },
      { x: 7324, type: 'enemy' },
      { x: 7388, type: 'enemy' },
      { x: 7688, type: 'spike' },
      { x: 7978, type: 'gap', width: 100 },
      { x: 8338, type: 'bigspike' },
      { x: 8648, type: 'spike' },
      { x: 8908, type: 'spike' },
      { x: 9198, type: 'enemy' },
      { x: 9262, type: 'enemy' },
      { x: 9326, type: 'enemy' },
      { x: 9626, type: 'gap', width: 90 },
      { x: 9976, type: 'bigspike' }
    ]
  },
  {
    id: 'event_takoyaki',
    name: 'Evento · Bolas de pulpo',
    baseScrollSpeed: 300,
    length: 10336,
    unlocksFood: 'takoyaki',
    goalColor: '#D46A2C',
    // Sin campo `theme`: usa el paisaje base del restaurante (sol, monte Fuji,
    // nubes, suelo de tablas de madera) tal cual lo pidió el usuario, y los
    // obstáculos sin reskinear (wasabi/soja/erizo de siempre).
    obstacles: [
      { x: 560, type: 'spike' },
      { x: 850, type: 'gap', width: 100 },
      { x: 1210, type: 'bigspike' },
      { x: 1520, type: 'spike' },
      { x: 1780, type: 'spike' },
      { x: 2070, type: 'enemy' },
      { x: 2134, type: 'enemy' },
      { x: 2198, type: 'enemy' },
      { x: 2498, type: 'gap', width: 90 },
      { x: 2848, type: 'bigspike' },
      { x: 3158, type: 'spike' },
      { x: 3448, type: 'enemy' },
      { x: 3512, type: 'enemy' },
      { x: 3812, type: 'spike' },
      { x: 4072, type: 'spike' },
      { x: 4362, type: 'gap', width: 110 },
      { x: 4732, type: 'bigspike' },
      { x: 5042, type: 'enemy' },
      { x: 5106, type: 'enemy' },
      { x: 5170, type: 'enemy' },
      { x: 5234, type: 'enemy' },
      { x: 5534, type: 'spike' },
      { x: 5824, type: 'spike' },
      { x: 6084, type: 'spike' },
      { x: 6374, type: 'gap', width: 90 },
      { x: 6724, type: 'bigspike' },
      { x: 7034, type: 'enemy' },
      { x: 7098, type: 'enemy' },
      { x: 7398, type: 'spike' },
      { x: 7688, type: 'gap', width: 100 },
      { x: 8048, type: 'bigspike' },
      { x: 8358, type: 'spike' },
      { x: 8618, type: 'spike' },
      { x: 8908, type: 'enemy' },
      { x: 8972, type: 'enemy' },
      { x: 9036, type: 'enemy' },
      { x: 9336, type: 'gap', width: 90 },
      { x: 9686, type: 'bigspike' }
    ]
  }
];

const SPIKE_W = 30;
const SPIKE_H = 38;

// Wasabi grande: obstáculo nuevo del Nivel 3, más ancho y alto que el pincho normal.
const BIGSPIKE_W = 50;
const BIGSPIKE_H = 52;

// Pincho de techo: obstáculo del Nivel 7, cuelga desde arriba del todo (y=0).
// Al contrario que el wasabi (obliga a saltar), obliga a NO saltar: pasar por
// debajo caminando es seguro, pero saltar mientras se está bajo él es letal.
const CEIL_SPIKE_W = 90;
const CEIL_SPIKE_DROP = 248;

// Plataforma elevada: obstáculo del Nivel 10. A diferencia del resto de
// obstáculos (que son cajas de colisión fijas), cambia el nivel del suelo:
// hay que saltar lo bastante alto para aterrizar en su superficie y seguir
// corriendo por encima; si se llega por debajo de la superficie sin haber
// saltado ya lo suficiente, es una pared sólida y mata igual que un pincho.
const PLATFORM_W = 130;
const PLATFORM_H = 130;

// Los enemigos flotan en el aire (línea vertical sobre el suelo), con pinta de erizo de mar (uni).
const ENEMY_W = 40;
const ENEMY_H = 40;
const ENEMY_CORE_RADIUS = 13;
const ENEMY_SPIKE_LEN = 8;
const ENEMY_SPIKE_COUNT = 9;
const ENEMY_FLOAT_OFFSET = 100; // distancia del centro del enemigo al suelo
const ENEMY_BOB_AMPLITUDE = 10;
const ENEMY_BOB_SPEED = 2.2;
const ENEMY_SPIN_SPEED = 1.1;

// Meta de cada nivel: una caja de sushi (bento) en la que entra el personaje.
const GOAL_BOX_W = 74;
const GOAL_BOX_H = 96;

// Rampa de arroz del Arroz con pollo teriyaki: un obstáculo nuevo que el
// propio jugador crea (ver `placeRiceRamp()`), a diferencia del resto de
// obstáculos que ya vienen definidos en el nivel. No es una pared sólida ni
// mata: simplemente, al llegar a ella estando en el suelo, lanza al jugador
// en un salto mucho más alto que el normal.
const RAMP_W = 90;
const RAMP_H = 60;
const RAMP_PLACE_OFFSET = 260; // distancia por delante del jugador a la que aparece al crearla
const RAMP_LAUNCH_VELOCITY = -1500; // muy por encima de JUMP_VELOCITY (-900): "un salto muy grande"

class SushiDashGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.audio = new AudioManager();

    this.progress = this.loadProgress();

    this.currentLevel = null;
    this.state = 'menu'; // menu | playing | paused | dead-flash | levelcomplete
    this.rafId = null;
    this.lastTime = 0;
    // Modo Dios: interruptor de sesión (no se guarda en localStorage, se resetea
    // al recargar). Nunca modifica el progreso real (unlockedFoods/completedLevels):
    // solo hace que las comprobaciones de desbloqueo devuelvan siempre true mientras esté activo.
    this.godMode = false;

    // Puntería del Takoyaki: posición del ratón sobre el canvas en
    // coordenadas lógicas (900x380), puramente cosmética para el retículo —
    // el destino real del teletransporte se calcula a partir de esta misma
    // posición (ver `teleportTakoyaki()`).
    this.mouseX = LOGICAL_W * 0.6;
    this.mouseY = GROUND_TOP - 80;
    this.nextTeleportAvailableAt = 0;
    this.teleportFlashUntil = 0;
    this.launchFlashUntil = 0;

    this.bindStaticUI();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.renderMenu();
    this.showScreen('screen-menu');
    this.updateMuteButton();
    this.updateGodModeButton();
  }

  /* ===== Progreso persistente ===== */
  loadProgress() {
    let unlocked = ['nigiri'];
    try {
      const raw = localStorage.getItem('sushi_unlocked_foods');
      if (raw) unlocked = JSON.parse(raw);
    } catch (e) { /* datos corruptos, se ignoran */ }

    let completedLevels = [];
    try {
      const raw = localStorage.getItem('sushi_completed_levels');
      if (raw) completedLevels = JSON.parse(raw);
    } catch (e) { /* datos corruptos, se ignoran */ }

    let completedEvents = [];
    try {
      const raw = localStorage.getItem('sushi_completed_events');
      if (raw) completedEvents = JSON.parse(raw);
    } catch (e) { /* datos corruptos, se ignoran */ }

    let selectedFood = localStorage.getItem('sushi_selected_food') || 'nigiri';
    if (!unlocked.includes(selectedFood) || !FOOD_TYPES[selectedFood]) selectedFood = 'nigiri';

    return { unlockedFoods: unlocked, completedLevels, completedEvents, selectedFood };
  }

  saveProgress() {
    localStorage.setItem('sushi_unlocked_foods', JSON.stringify(this.progress.unlockedFoods));
    localStorage.setItem('sushi_completed_levels', JSON.stringify(this.progress.completedLevels));
    localStorage.setItem('sushi_completed_events', JSON.stringify(this.progress.completedEvents));
    localStorage.setItem('sushi_selected_food', this.progress.selectedFood);
  }

  isLevelUnlocked(levelIndex) {
    if (this.godMode) return true;
    if (levelIndex === 0) return true;
    const prevLevel = LEVELS[levelIndex - 1];
    return this.progress.completedLevels.includes(prevLevel.id);
  }

  getBestStats(levelId) {
    const time = localStorage.getItem(`sushi_best_time_${levelId}`);
    const attempts = localStorage.getItem(`sushi_best_attempts_${levelId}`);
    return {
      time: time ? parseFloat(time) : null,
      attempts: attempts ? parseInt(attempts, 10) : null
    };
  }

  saveBestStats(levelId, time, attempts) {
    const best = this.getBestStats(levelId);
    if (best.time === null || time < best.time) {
      localStorage.setItem(`sushi_best_time_${levelId}`, String(time));
    }
    if (best.attempts === null || attempts < best.attempts) {
      localStorage.setItem(`sushi_best_attempts_${levelId}`, String(attempts));
    }
  }

  /* ===== UI estática (menú, modales, botones) ===== */
  bindStaticUI() {
    document.getElementById('btnInstructions').addEventListener('click', () => this.showScreen('screen-instructions'));
    document.getElementById('btnCloseInstructions').addEventListener('click', () => {
      this.showScreen(this.state === 'paused' ? 'screen-pause' : 'screen-menu');
    });
    document.getElementById('btnPauseInstructions').addEventListener('click', () => this.showScreen('screen-instructions'));

    document.getElementById('btnMute').addEventListener('click', () => {
      this.audio.setEnabled(!this.audio.enabled);
      this.updateMuteButton();
    });

    document.getElementById('btnGodMode').addEventListener('click', () => {
      if (this.godMode) {
        this.disableGodMode();
      } else {
        document.getElementById('godModePasswordInput').value = '';
        document.getElementById('godModeError').style.display = 'none';
        this.showScreen('screen-godmode');
        document.getElementById('godModePasswordInput').focus();
      }
    });
    document.getElementById('btnGodModeCancel').addEventListener('click', () => this.goToMenu());
    document.getElementById('btnGodModeSubmit').addEventListener('click', () => this.submitGodModePassword());
    document.getElementById('godModePasswordInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.submitGodModePassword();
    });

    document.getElementById('btnCharacters').addEventListener('click', () => this.openCharacterScreen());
    document.getElementById('btnCloseCharacters').addEventListener('click', () => this.goToMenu());
    document.getElementById('btnEquipCharacter').addEventListener('click', () => {
      this.progress.selectedFood = this.previewFood;
      this.saveProgress();
      this.renderCharacterScreen();
    });
    document.getElementById('btnViewCharactersFromWin').addEventListener('click', () => this.openCharacterScreen());

    document.getElementById('btnAbility').addEventListener('click', () => this.useRemoveAbility());

    document.getElementById('btnEvents').addEventListener('click', () => this.goToEvents());
    document.getElementById('btnCloseEvents').addEventListener('click', () => this.goToMenu());

    document.getElementById('btnPause').addEventListener('click', () => this.pauseGame());
    document.getElementById('btnResume').addEventListener('click', () => this.resumeGame());
    document.getElementById('btnRestartLevel').addEventListener('click', () => this.restartCurrentLevel());
    document.getElementById('btnPauseMenu').addEventListener('click', () => this.exitToHub());
    document.getElementById('btnMenuFromGame').addEventListener('click', () => this.exitToHub());

    document.getElementById('btnRetryLevel').addEventListener('click', () => this.restartCurrentLevel());
    document.getElementById('btnNextOrMenu').addEventListener('click', () => {
      if (this.currentLevel.source === 'event') {
        this.goToEvents();
        return;
      }
      const nextIndex = this.currentLevel.index + 1;
      if (this.pendingUnlockedNextLevel && LEVELS[nextIndex]) {
        this.showScreen('screen-game');
        this.startLevel(nextIndex);
      } else {
        this.goToMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        this.handleJumpInput();
      }
      if (e.code === 'Escape' && this.state === 'playing') {
        this.pauseGame();
      }
      if (e.code === 'KeyA' && this.state === 'playing' && this.currentLevel) {
        this.currentLevel.scrollStopped = !this.currentLevel.scrollStopped;
      }
      // Tecla S = habilidad del Ramen (eliminar el próximo obstáculo), equivalente
      // en teclado del botón 🍜 en pantalla.
      if (e.code === 'KeyS' && this.state === 'playing' && this.currentLevel) {
        this.useRemoveAbility();
      }
      // Tecla D (pulsación única) = habilidad del Arroz con pollo teriyaki:
      // crea una rampa de arroz un poco por delante. A diferencia del
      // Takoyaki, no necesita mantenerse pulsada ni apuntar con el ratón.
      if (e.code === 'KeyD' && this.state === 'playing' && this.currentLevel && this.currentLevel.food.canPlaceRamp) {
        this.placeRiceRamp();
      }
    });

    // Tecla D = acelerar mientras se mantiene pulsada (solo personajes con canAccelerate)
    // o, en el Takoyaki, apuntar mientras se mantiene y teletransportarse al soltarla. Van
    // en listeners aparte para no interferir con el guard `e.repeat` de arriba.
    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyD') this.keyDHeld = true;
    });
    document.addEventListener('keyup', (e) => {
      if (e.code === 'KeyD') {
        this.keyDHeld = false;
        this.teleportTakoyaki();
      }
    });
    // Si se cambia de ventana/pestaña mientras se mantiene D, evita que se quede "pegado".
    window.addEventListener('blur', () => { this.keyDHeld = false; });
  }

  updateMuteButton() {
    document.getElementById('btnMute').textContent = `Sonido: ${this.audio.enabled ? 'ON' : 'OFF'}`;
  }

  /* ===== Modo Dios ===== */
  submitGodModePassword() {
    const input = document.getElementById('godModePasswordInput');
    if (input.value.trim().toLowerCase() === 'wasabi') {
      this.enableGodMode();
      this.goToMenu();
    } else {
      document.getElementById('godModeError').style.display = 'block';
      input.value = '';
      input.focus();
    }
  }

  enableGodMode() {
    this.godMode = true;
    this.updateGodModeButton();
  }

  disableGodMode() {
    this.godMode = false;
    // Si el personaje equipado solo estaba disponible gracias al Modo Dios, vuelve al nigiri.
    if (!this.progress.unlockedFoods.includes(this.progress.selectedFood)) {
      this.progress.selectedFood = 'nigiri';
      this.saveProgress();
    }
    this.updateGodModeButton();
    this.renderMenu();
  }

  updateGodModeButton() {
    document.getElementById('btnGodMode').classList.toggle('godmode-active', this.godMode);
  }

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  goToMenu() {
    this.stopLoop();
    this.state = 'menu';
    this.renderMenu();
    this.showScreen('screen-menu');
  }

  // Vuelve al menú principal o a la pantalla de Eventos según de dónde venga
  // la partida actual, para no devolver a un evento a un jugador al menú de
  // la campaña (y viceversa).
  exitToHub() {
    if (this.currentLevel && this.currentLevel.source === 'event') {
      this.goToEvents();
    } else {
      this.goToMenu();
    }
  }

  restartCurrentLevel() {
    this.showScreen('screen-game');
    if (this.currentLevel.source === 'event') {
      this.startEvent(this.currentLevel.index);
    } else {
      this.startLevel(this.currentLevel.index);
    }
  }

  goToEvents() {
    this.stopLoop();
    this.state = 'menu';
    this.renderEvents();
    this.showScreen('screen-events');
  }

  renderEvents() {
    const list = document.getElementById('eventList');
    list.innerHTML = '';
    EVENTS.forEach((event, index) => {
      const completed = this.progress.completedEvents.includes(event.id);
      const alreadyUnlocked = this.progress.unlockedFoods.includes(event.unlocksFood);

      const item = document.createElement('div');
      item.className = 'level-item';

      const best = this.getBestStats(event.id);
      const metaParts = [];
      if (completed && best.time !== null) metaParts.push(`Mejor tiempo: ${best.time.toFixed(1)}s`);
      const rewardText = alreadyUnlocked
        ? `Personaje: ${FOOD_TYPES[event.unlocksFood].name} ✅`
        : `Consigue a ${FOOD_TYPES[event.unlocksFood].name}`;

      item.innerHTML = `
        <div>
          <div class="level-name">${event.name}${completed ? ' ✅' : ''}</div>
          <div class="level-meta">${metaParts.concat(rewardText).join(' · ')}</div>
        </div>
        <div class="level-icon">🏁</div>
      `;

      item.addEventListener('click', () => {
        this.showScreen('screen-game');
        this.startEvent(index);
      });
      list.appendChild(item);
    });
  }

  renderMenu() {
    const currentFood = FOOD_TYPES[this.progress.selectedFood];
    const badge = document.getElementById('currentCharBadge');
    badge.innerHTML = `<span>${currentFood.icon} Jugando como: <strong>${currentFood.name}</strong></span><span class="change-char-link">Cambiar</span>`;
    badge.onclick = () => this.openCharacterScreen();

    const list = document.getElementById('levelList');
    list.innerHTML = '';
    LEVELS.forEach((level, index) => {
      const unlocked = this.isLevelUnlocked(index);
      const completed = this.progress.completedLevels.includes(level.id);

      const item = document.createElement('div');
      item.className = 'level-item' + (unlocked ? '' : ' locked');

      const best = this.getBestStats(level.id);
      const metaParts = [];
      if (completed && best.time !== null) metaParts.push(`Mejor tiempo: ${best.time.toFixed(1)}s`);

      item.innerHTML = `
        <div>
          <div class="level-name">${level.name}${completed ? ' ✅' : ''}</div>
          <div class="level-meta">${unlocked ? (metaParts.join(' · ') || 'Sin completar todavía') : 'Termina el nivel anterior para desbloquear'}</div>
        </div>
        <div class="level-icon">${unlocked ? '🏁' : '🔒'}</div>
      `;

      if (unlocked) {
        item.addEventListener('click', () => {
          this.showScreen('screen-game');
          this.startLevel(index);
        });
      }
      list.appendChild(item);
    });
  }

  /* ===== Pantalla de selección de personaje ===== */
  openCharacterScreen() {
    this.previewFood = this.progress.selectedFood;
    this.renderCharacterScreen();
    this.showScreen('screen-characters');
  }

  renderCharacterScreen() {
    const list = document.getElementById('charList');
    list.innerHTML = '';

    Object.keys(FOOD_TYPES).forEach(id => {
      const food = FOOD_TYPES[id];
      const unlocked = this.godMode || this.progress.unlockedFoods.includes(id);
      const isEquipped = id === this.progress.selectedFood;
      const isPreviewed = id === this.previewFood;

      const item = document.createElement('div');
      item.className = 'char-item' + (unlocked ? '' : ' locked') + (isPreviewed ? ' active' : '');
      item.innerHTML = `
        <div class="char-item-icon">${unlocked ? '<canvas class="char-item-canvas" width="64" height="64"></canvas>' : '❓'}</div>
        <div class="char-item-name">${unlocked ? food.name : 'Bloqueado'}</div>
        ${isEquipped ? '<div class="char-item-equipped">En uso</div>' : ''}
      `;
      if (unlocked) {
        item.addEventListener('click', () => {
          this.previewFood = id;
          this.renderCharacterScreen();
        });
      }
      list.appendChild(item);

      if (unlocked) {
        const itemCanvas = item.querySelector('.char-item-canvas');
        this.drawFoodSprite(itemCanvas.getContext('2d'), food, 64);
      }
    });

    const previewFood = FOOD_TYPES[this.previewFood];
    const previewUnlocked = this.godMode || this.progress.unlockedFoods.includes(this.previewFood);
    const detailCanvas = document.getElementById('charDetailCanvas');
    const detailCtx = detailCanvas.getContext('2d');
    detailCtx.clearRect(0, 0, detailCanvas.width, detailCanvas.height);
    if (previewUnlocked) {
      this.drawFoodSprite(detailCtx, previewFood, detailCanvas.width);
    }
    document.getElementById('charDetailName').textContent = previewUnlocked ? previewFood.name : 'Personaje bloqueado';
    document.getElementById('charDetailDesc').textContent = previewUnlocked
      ? previewFood.desc
      : 'Completa más niveles para desbloquearlo.';

    const statsList = document.getElementById('charDetailStats');
    statsList.innerHTML = previewUnlocked
      ? previewFood.stats.map(s => `<li><span>${s.label}</span><strong>${s.value}</strong></li>`).join('')
      : '';

    const equipBtn = document.getElementById('btnEquipCharacter');
    const isEquipped = this.previewFood === this.progress.selectedFood;
    equipBtn.disabled = !previewUnlocked || isEquipped;
    equipBtn.textContent = isEquipped ? '✓ Personaje actual' : 'Usar este personaje';
  }

  /* ===== Canvas / resize ===== */
  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = LOGICAL_W * dpr;
    this.canvas.height = LOGICAL_H * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ===== Ciclo de nivel ===== */
  startLevel(index) {
    this.beginRun(LEVELS[index], index, 'campaign');
  }

  startEvent(index) {
    this.beginRun(EVENTS[index], index, 'event');
  }

  // Motor compartido por la campaña y los Eventos: monta `currentLevel` a
  // partir de cualquier definición de nivel (LEVELS o EVENTS) y arranca el
  // bucle de juego. `source` distingue de dónde viene la partida para que
  // salir/reiniciar/completar sepan a qué pantalla volver.
  beginRun(levelDef, index, source) {
    const food = FOOD_TYPES[this.progress.selectedFood];
    this.keyDHeld = false;

    this.currentLevel = {
      index,
      source,
      def: levelDef,
      food,
      scrollSpeed: levelDef.baseScrollSpeed * food.speedMultiplier,
      obstacles: levelDef.obstacles.map(o => ({ ...o })),
      worldX: 0,
      attempts: 1,
      startTime: performance.now(),
      goalX: levelDef.length,
      scrollStopped: false,
      checkpointX: 0,
      livesLeft: food.extraLives || 0,
      removeCharges: food.removeCharges || 0,
      teleportCharges: food.teleportCharges || 0,
      rampCharges: food.rampCharges || 0
    };

    this.player = {
      y: GROUND_TOP - PLAYER_SIZE,
      vy: 0,
      grounded: true,
      airJumpUsed: false,
      glideTimeLeft: food.glideDuration || 0
    };
    this.isGliding = false;
    this.removeFlashUntil = 0;
    this.nextTeleportAvailableAt = 0;
    this.teleportFlashUntil = 0;
    this.launchFlashUntil = 0;

    document.getElementById('hudLevelName').textContent = levelDef.name;
    this.updateAttemptsHud();
    this.updateAbilityButton();
    this.updateProgressBar();

    this.state = 'playing';
    this.lastTime = performance.now();
    this.startLoop();
  }

  updateAttemptsHud() {
    const level = this.currentLevel;
    let text = `Intentos: ${level.attempts}`;
    if (level.food.extraLives) {
      text += ` · Vidas: ${level.livesLeft}`;
    }
    if (level.food.canRemoveObstacles) {
      text += ` · Quitar: ${level.removeCharges}`;
    }
    if (level.food.canTeleport) {
      text += ` · Teletransportes: ${level.teleportCharges}`;
    }
    if (level.food.canPlaceRamp) {
      text += ` · Rampas: ${level.rampCharges}`;
    }
    document.getElementById('hudAttempts').textContent = text;
  }

  updateProgressBar() {
    const level = this.currentLevel;
    const percent = Math.min(100, Math.max(0, (level.worldX / level.goalX) * 100));
    document.getElementById('progressFill').style.width = `${percent}%`;
  }

  // Botón en pantalla de la habilidad del Ramen (equivalente táctil de la
  // tecla S): solo visible si el personaje equipado puede eliminar
  // obstáculos, y muestra cuántos usos le quedan en la partida actual.
  updateAbilityButton() {
    const btn = document.getElementById('btnAbility');
    const level = this.currentLevel;
    const canUse = !!(level && level.food.canRemoveObstacles);
    btn.style.display = canUse ? 'flex' : 'none';
    if (canUse) {
      document.getElementById('abilityCharges').textContent = level.removeCharges;
      btn.disabled = level.removeCharges <= 0;
    }
  }

  // Habilidad del Ramen: elimina de la partida el próximo obstáculo que el
  // jugador todavía no haya superado (el primero cuyo borde derecho sigue
  // por delante de la posición actual). Al desaparecer del array `obstacles`
  // deja de dibujarse, de colisionar y de contar como hueco/plataforma para
  // el suelo, sin necesidad de tocar el resto del motor de física/colisiones.
  removeNextObstacleAhead() {
    const level = this.currentLevel;
    const playerWorldX = level.worldX + PLAYER_SCREEN_X;
    const idx = level.obstacles.findIndex(o => this.obstacleRightExtent(o) > playerWorldX);
    if (idx === -1) return null;
    const removed = level.obstacles[idx];
    level.obstacles.splice(idx, 1);
    return removed;
  }

  // Habilidad del Ramen: hasta 3 veces por intento (tecla S o botón 🍜).
  useRemoveAbility() {
    if (this.state !== 'playing' || !this.currentLevel) return;
    const level = this.currentLevel;
    const food = level.food;
    if (!food.canRemoveObstacles || level.removeCharges <= 0) return;

    const removed = this.removeNextObstacleAhead();
    if (!removed) return;

    level.removeCharges -= 1;
    this.updateAttemptsHud();
    this.updateAbilityButton();
    this.removeBannerText = '🍜 OBSTÁCULO ELIMINADO';
    this.removeFlashUntil = performance.now() + 700;
    this.audio.removeObstacle();
    this.audio.vibrate(40);
  }

  // Habilidad del Takoyaki: mantén pulsada D para apuntar (el retículo sigue
  // al ratón) y suéltala para teletransportarte hasta ese punto en vez de
  // disparar nada. Como la cámara mantiene siempre al jugador en
  // `PLAYER_SCREEN_X`, teletransportarse es sumar directamente a
  // `level.worldX` la distancia entre el retículo y el jugador en pantalla:
  // cualquier obstáculo que hubiera en ese tramo queda simplemente atrás (su
  // posición en el mundo ya no coincide con la del jugador, así que deja de
  // poder colisionar — no hace falta borrarlo del array ni tocar el resto
  // del motor de física/colisiones). Hasta 3 veces por intento, con un
  // pequeño margen entre usos para que se note el efecto.
  teleportTakoyaki() {
    if (this.state !== 'playing' || !this.currentLevel) return;
    const level = this.currentLevel;
    const food = level.food;
    if (!food.canTeleport || level.teleportCharges <= 0) return;
    const now = performance.now();
    if (this.nextTeleportAvailableAt && now < this.nextTeleportAvailableAt) return;

    const distance = this.mouseX - PLAYER_SCREEN_X;
    if (distance <= 0) return;

    level.worldX += distance;
    level.teleportCharges -= 1;
    this.updateAttemptsHud();
    this.nextTeleportAvailableAt = now + 400;
    this.teleportFlashUntil = now + 300;
    this.audio.teleport();
    this.audio.vibrate(40);
  }

  // Habilidad del Arroz con pollo teriyaki: hasta 3 veces por intento (tecla
  // D, una sola pulsación, sin apuntar). Crea un obstáculo nuevo de tipo
  // 'ramp' un poco por delante del jugador (`RAMP_PLACE_OFFSET`); al llegar
  // a él estando en el suelo, el propio motor de física lo detecta (ver
  // `update()`) y lanza al jugador en un salto mucho más alto de lo normal.
  placeRiceRamp() {
    if (this.state !== 'playing' || !this.currentLevel) return;
    const level = this.currentLevel;
    const food = level.food;
    if (!food.canPlaceRamp || level.rampCharges <= 0) return;

    const playerWorldX = level.worldX + PLAYER_SCREEN_X;
    level.obstacles.push({ x: playerWorldX + RAMP_PLACE_OFFSET, type: 'ramp' });
    level.obstacles.sort((a, b) => a.x - b.x);
    level.rampCharges -= 1;
    this.updateAttemptsHud();
  }

  startLoop() {
    this.stopLoop();
    const loop = (t) => {
      const dt = Math.min((t - this.lastTime) / 1000, 0.032);
      this.lastTime = t;
      if (this.state === 'playing') {
        this.update(dt);
      } else if (this.state === 'entering-goal') {
        this.updateGoalEntry();
      }
      this.render();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stopLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  pauseGame() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.showScreen('screen-pause');
  }

  resumeGame() {
    this.state = 'playing';
    this.lastTime = performance.now();
    this.showScreen('screen-game');
  }

  handleJumpInput() {
    if (this.state !== 'playing') return;
    const food = this.currentLevel.food;
    if (this.player.grounded) {
      this.player.vy = JUMP_VELOCITY * food.jumpMultiplier;
      this.player.grounded = false;
      this.player.airJumpUsed = false;
      this.audio.jump();
    } else if (food.canDoubleJump && !this.player.airJumpUsed) {
      this.player.vy = JUMP_VELOCITY * food.jumpMultiplier;
      this.player.airJumpUsed = true;
      this.audio.jump();
    }
  }

  /* ===== Física y colisiones ===== */
  update(dt) {
    const level = this.currentLevel;
    const food = level.food;
    this.isAccelerating = !!(this.keyDHeld && food.canAccelerate && !level.scrollStopped);
    if (!level.scrollStopped) {
      const speed = this.isAccelerating ? level.scrollSpeed * food.accelMultiplier : level.scrollSpeed;
      level.worldX += speed * dt;
    }

    // Planeo (tempura): mientras esté en el aire y se mantenga D, la gravedad
    // se anula (el personaje flota) hasta gastar el cupo de `glideDuration`
    // segundos. El cupo se rellena por completo cada vez que se vuelve a
    // tocar el suelo, así que no hay "recarga" que esperar entre saltos.
    if (this.player.grounded) {
      this.player.glideTimeLeft = food.glideDuration || 0;
    }
    this.isGliding = !!(food.canGlide && !this.player.grounded && this.keyDHeld && !level.scrollStopped && this.player.glideTimeLeft > 0);
    if (this.isGliding) {
      this.player.glideTimeLeft = Math.max(0, this.player.glideTimeLeft - dt);
      this.player.vy = 0;
    } else {
      this.player.vy += GRAVITY * dt;
    }
    this.player.y += this.player.vy * dt;

    const playerWorldX = level.worldX + PLAYER_SCREEN_X;
    // En Modo Dios se ignoran huecos y plataformas como obstáculo (nada de esto debe
    // poder matar ni bloquear el avance): el suelo se trata siempre como normal.
    const overGap = !this.godMode && this.isOverGap(playerWorldX);
    const platform = this.godMode ? null : this.platformAt(playerWorldX);

    let groundY;
    if (platform) {
      const surfaceY = GROUND_TOP - PLATFORM_H;
      if (this.player.y + PLAYER_SIZE > surfaceY + 4) {
        // todavía no ha saltado lo bastante alto: choca contra el lateral sólido de la plataforma
        this.onDeath();
        return;
      }
      groundY = surfaceY;
    } else if (overGap) {
      groundY = LOGICAL_H + 100;
    } else {
      groundY = GROUND_TOP;
    }

    if (this.player.y + PLAYER_SIZE >= groundY) {
      if (overGap && !platform) {
        this.onDeath();
        return;
      }
      this.player.y = groundY - PLAYER_SIZE;
      this.player.vy = 0;
      this.player.grounded = true;
      this.player.airJumpUsed = false;
    }

    if (this.player.y < 0) {
      this.player.y = 0;
      this.player.vy = 0;
    }

    // Rampa de arroz (Arroz con pollo teriyaki): no es una pared ni mata,
    // solo lanza al jugador en un salto muy grande al llegar a ella estando
    // en el suelo. Se consume al usarse (se borra del array).
    if (this.player.grounded) {
      const rampIdx = level.obstacles.findIndex(o => o.type === 'ramp' && playerWorldX + PLAYER_SIZE > o.x && playerWorldX < o.x + RAMP_W);
      if (rampIdx !== -1) {
        level.obstacles.splice(rampIdx, 1);
        this.player.vy = RAMP_LAUNCH_VELOCITY;
        this.player.grounded = false;
        this.player.airJumpUsed = false;
        this.launchFlashUntil = performance.now() + 350;
        this.audio.launch();
        this.audio.vibrate(50);
      }
    }

    this.checkObstacleCollisions(playerWorldX);
    if (food.extraLives) {
      this.updateCheckpoint(playerWorldX);
    }
    this.updateProgressBar();

    if (playerWorldX + PLAYER_SIZE >= level.goalX) {
      this.startGoalEntry();
    }
  }

  /* ===== Meta: caja de sushi ===== */
  startGoalEntry() {
    this.state = 'entering-goal';
    this.goalEntryStart = performance.now();
    this.goalEntryDuration = 480;
    const level = this.currentLevel;
    this.goalBoxScreenX = level.goalX - level.worldX;
    this.goalEntryStartPlayerY = this.player.y;
  }

  updateGoalEntry() {
    const elapsed = performance.now() - this.goalEntryStart;
    this.goalEntryT = Math.min(1, elapsed / this.goalEntryDuration);
    if (this.goalEntryT >= 1) {
      this.onLevelComplete();
    }
  }

  isOverGap(playerWorldX) {
    const level = this.currentLevel;
    return level.obstacles.some(o => {
      if (o.type !== 'gap') return false;
      return playerWorldX + PLAYER_SIZE * 0.3 > o.x && playerWorldX + PLAYER_SIZE * 0.7 < o.x + o.width;
    });
  }

  platformAt(playerWorldX) {
    const level = this.currentLevel;
    return level.obstacles.find(o => o.type === 'platform' && playerWorldX + PLAYER_SIZE > o.x && playerWorldX < o.x + PLATFORM_W) || null;
  }

  enemyBox(o, nowSec) {
    const bob = Math.sin(nowSec * ENEMY_BOB_SPEED + o.x * 0.01) * ENEMY_BOB_AMPLITUDE;
    const centerY = GROUND_TOP - ENEMY_FLOAT_OFFSET + bob;
    return { left: o.x, right: o.x + ENEMY_W, top: centerY - ENEMY_H / 2, bottom: centerY + ENEMY_H / 2 };
  }

  checkObstacleCollisions(playerWorldX) {
    const level = this.currentLevel;
    const nowSec = performance.now() / 1000;
    const playerBox = {
      left: playerWorldX,
      right: playerWorldX + PLAYER_SIZE,
      top: this.player.y,
      bottom: this.player.y + PLAYER_SIZE
    };

    for (const o of level.obstacles) {
      if (o.type === 'spike') {
        const box = { left: o.x, right: o.x + SPIKE_W, top: GROUND_TOP - SPIKE_H, bottom: GROUND_TOP };
        if (this.boxesOverlap(playerBox, box)) {
          this.onDeath();
          return;
        }
      } else if (o.type === 'bigspike') {
        const box = { left: o.x, right: o.x + BIGSPIKE_W, top: GROUND_TOP - BIGSPIKE_H, bottom: GROUND_TOP };
        if (this.boxesOverlap(playerBox, box)) {
          this.onDeath();
          return;
        }
      } else if (o.type === 'enemy') {
        if (this.boxesOverlap(playerBox, this.enemyBox(o, nowSec))) {
          this.onDeath();
          return;
        }
      } else if (o.type === 'ceilspike') {
        const box = { left: o.x, right: o.x + CEIL_SPIKE_W, top: 0, bottom: CEIL_SPIKE_DROP };
        if (this.boxesOverlap(playerBox, box)) {
          this.onDeath();
          return;
        }
      }
    }
  }

  boxesOverlap(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  // Cupo de vidas extra (Palillo): el punto de reaparición avanza hasta el
  // borde derecho de cada obstáculo ya superado del todo por el jugador —
  // así, tras una revivida, se reanuda justo después del último obstáculo
  // pasado en vez de desde el principio del nivel.
  obstacleRightExtent(o) {
    switch (o.type) {
      case 'spike': return o.x + SPIKE_W;
      case 'bigspike': return o.x + BIGSPIKE_W;
      case 'gap': return o.x + o.width;
      case 'enemy': return o.x + ENEMY_W;
      case 'ceilspike': return o.x + CEIL_SPIKE_W;
      case 'platform': return o.x + PLATFORM_W;
      case 'ramp': return o.x + RAMP_W;
      default: return o.x;
    }
  }

  updateCheckpoint(playerWorldX) {
    const level = this.currentLevel;
    let checkpoint = level.checkpointX;
    for (const o of level.obstacles) {
      const clearedAt = this.obstacleRightExtent(o) + 24;
      if (clearedAt <= playerWorldX && clearedAt > checkpoint) checkpoint = clearedAt;
    }
    level.checkpointX = checkpoint;
  }

  onDeath() {
    if (this.godMode) return; // invencible: para poder probar los niveles hasta el final sin morir
    if (this.state !== 'playing') return;
    const level = this.currentLevel;
    const canRevive = !!(level.food.extraLives && level.livesLeft > 0);
    this.state = 'dead-flash';
    this.audio.death();
    this.audio.vibrate([40, 40, 40]);
    const flash = document.getElementById('flashOverlay');
    flash.classList.add('show');
    setTimeout(() => {
      flash.classList.remove('show');
      if (canRevive) {
        level.livesLeft -= 1;
        this.updateAttemptsHud();
        this.respawnAtCheckpoint();
      } else {
        level.attempts += 1;
        this.resetPlayerToStart();
        this.updateAttemptsHud();
        this.updateAbilityButton();
      }
      this.state = 'playing';
      this.lastTime = performance.now();
    }, 220);
  }

  // Reaparición "con vida" (Palillo): retoma justo después del último
  // obstáculo superado, sin volver al principio ni sumar un intento nuevo.
  respawnAtCheckpoint() {
    const level = this.currentLevel;
    level.worldX = level.checkpointX;
    level.scrollStopped = false;
    this.player.y = GROUND_TOP - PLAYER_SIZE;
    this.player.vy = 0;
    this.player.grounded = true;
    this.player.airJumpUsed = false;
    this.player.glideTimeLeft = level.food.glideDuration || 0;
    this.isGliding = false;
  }

  resetPlayerToStart() {
    const level = this.currentLevel;
    level.worldX = 0;
    level.scrollStopped = false;
    level.checkpointX = 0;
    level.livesLeft = level.food.extraLives || 0;
    // Al morir se reinicia el nivel desde el principio, así que el cupo de
    // las habilidades limitadas (Ramen, Takoyaki, Arroz con pollo teriyaki)
    // también se restablece por completo, igual que las vidas del Palillo.
    level.removeCharges = level.food.removeCharges || 0;
    level.teleportCharges = level.food.teleportCharges || 0;
    level.rampCharges = level.food.rampCharges || 0;
    this.player.y = GROUND_TOP - PLAYER_SIZE;
    this.player.vy = 0;
    this.player.grounded = true;
    this.player.airJumpUsed = false;
    this.player.glideTimeLeft = level.food.glideDuration || 0;
    this.isGliding = false;
  }

  onLevelComplete() {
    this.state = 'levelcomplete';
    const level = this.currentLevel;
    const isEvent = level.source === 'event';
    const elapsed = (performance.now() - level.startTime) / 1000;

    if (isEvent) {
      if (!this.progress.completedEvents.includes(level.def.id)) {
        this.progress.completedEvents.push(level.def.id);
      }
    } else if (!this.progress.completedLevels.includes(level.def.id)) {
      this.progress.completedLevels.push(level.def.id);
    }

    this.pendingUnlockedNextLevel = false;
    // unlocksFood puede ser un id suelto o un array (el Nivel 7 desbloquea dos personajes a la vez).
    const unlockIds = level.def.unlocksFood
      ? (Array.isArray(level.def.unlocksFood) ? level.def.unlocksFood : [level.def.unlocksFood])
      : [];
    const newlyUnlocked = unlockIds.filter(id => !this.progress.unlockedFoods.includes(id));
    newlyUnlocked.forEach(id => this.progress.unlockedFoods.push(id));
    if (!isEvent && (newlyUnlocked.length > 0 || LEVELS[level.index + 1])) {
      this.pendingUnlockedNextLevel = true;
    }

    this.saveProgress();
    this.saveBestStats(level.def.id, elapsed, level.attempts);
    this.audio.levelComplete();
    this.audio.vibrate([30, 60, 30, 60, 80]);

    document.getElementById('lcTime').textContent = `Tiempo: ${elapsed.toFixed(1)}s`;
    document.getElementById('lcAttempts').textContent = `Intentos: ${level.attempts}`;

    const unlockBox = document.getElementById('lcUnlock');
    const unlockList = document.getElementById('lcUnlockList');
    unlockList.innerHTML = '';
    if (newlyUnlocked.length > 0) {
      unlockBox.style.display = 'block';
      document.getElementById('lcUnlockLabel').textContent = newlyUnlocked.length > 1
        ? '¡Nuevos sushis desbloqueados!'
        : '¡Nuevo sushi desbloqueado!';
      newlyUnlocked.forEach(id => {
        const food = FOOD_TYPES[id];
        const item = document.createElement('div');
        item.className = 'lc-unlock-item';
        item.innerHTML = `
          <div class="unlock-sprite"><canvas class="lc-unlock-canvas" width="120" height="120"></canvas></div>
          <p class="lc-unlock-name">${food.name}</p>
          <p class="lc-unlock-desc">${food.desc}</p>
        `;
        unlockList.appendChild(item);
        const canvas = item.querySelector('.lc-unlock-canvas');
        this.drawFoodSprite(canvas.getContext('2d'), food, canvas.width);
      });
    } else {
      unlockBox.style.display = 'none';
    }

    const nextBtn = document.getElementById('btnNextOrMenu');
    if (isEvent) {
      nextBtn.textContent = 'Volver a eventos';
    } else {
      nextBtn.textContent = (this.pendingUnlockedNextLevel && LEVELS[level.index + 1]) ? 'Siguiente nivel' : 'Volver al menú';
    }

    this.showScreen('screen-levelcomplete');
  }

  /* ===== Render ===== */
  isHellLevel() {
    return !!(this.currentLevel && this.currentLevel.def.theme === 'hell');
  }

  isKitchenLevel() {
    return !!(this.currentLevel && this.currentLevel.def.theme === 'kitchen');
  }

  isOceanLevel() {
    return !!(this.currentLevel && this.currentLevel.def.theme === 'ocean');
  }

  isRamenLevel() {
    return !!(this.currentLevel && this.currentLevel.def.theme === 'ramen');
  }

  isRiceLevel() {
    return !!(this.currentLevel && this.currentLevel.def.theme === 'rice');
  }

  render() {
    const ctx = this.ctx;
    const isHell = this.isHellLevel();
    const isKitchen = this.isKitchenLevel();
    const isOcean = this.isOceanLevel();
    const isRamen = this.isRamenLevel();
    const isRice = this.isRiceLevel();
    ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);

    // cielo
    const skyGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
    if (isHell) {
      skyGrad.addColorStop(0, '#1a0505');
      skyGrad.addColorStop(0.55, '#4a1006');
      skyGrad.addColorStop(1, '#7a2408');
    } else if (isKitchen) {
      skyGrad.addColorStop(0, '#fdf3e3');
      skyGrad.addColorStop(1, '#ffe3b8');
    } else if (isOcean) {
      skyGrad.addColorStop(0, '#012a4a');
      skyGrad.addColorStop(0.55, '#014f76');
      skyGrad.addColorStop(1, '#0f7a94');
    } else if (isRamen) {
      skyGrad.addColorStop(0, '#3a2410');
      skyGrad.addColorStop(0.55, '#a85a1e');
      skyGrad.addColorStop(1, '#e0a340');
    } else if (isRice) {
      skyGrad.addColorStop(0, '#fef6e4');
      skyGrad.addColorStop(1, '#ffdf9e');
    } else {
      skyGrad.addColorStop(0, '#bfe9ff');
      skyGrad.addColorStop(1, '#eaf9ff');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

    if (!this.currentLevel) return;
    const level = this.currentLevel;
    const camOffset = level.worldX;

    // azulejos de la pared, solo tema cocina
    if (isKitchen) {
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1;
      const tileSize = 40;
      const tileOffsetX = -((camOffset * 0.02) % tileSize);
      for (let x = tileOffsetX; x < LOGICAL_W; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GROUND_TOP);
        ctx.stroke();
      }
      for (let y = 0; y < GROUND_TOP; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(LOGICAL_W, y);
        ctx.stroke();
      }
    }

    this.drawSkyDecor(camOffset);

    // suelo
    if (isHell) {
      ctx.fillStyle = '#2b1210';
      ctx.fillRect(0, GROUND_TOP, LOGICAL_W, GROUND_HEIGHT);
      ctx.strokeStyle = 'rgba(255,120,40,0.35)';
      ctx.lineWidth = 2;
      const stripeOffset = -(camOffset % 60);
      for (let x = stripeOffset; x < LOGICAL_W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, GROUND_TOP);
        ctx.lineTo(x + 24, LOGICAL_H);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255,90,20,0.55)';
      ctx.fillRect(0, GROUND_TOP, LOGICAL_W, 4);
    } else if (isKitchen) {
      ctx.fillStyle = '#c7d0d6';
      ctx.fillRect(0, GROUND_TOP, LOGICAL_W, GROUND_HEIGHT);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 2;
      const stripeOffset = -(camOffset % 50);
      for (let x = stripeOffset; x < LOGICAL_W; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, GROUND_TOP);
        ctx.lineTo(x, LOGICAL_H);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, GROUND_TOP, LOGICAL_W, 3);
    } else if (isOcean) {
      ctx.fillStyle = '#c9b482';
      ctx.fillRect(0, GROUND_TOP, LOGICAL_W, GROUND_HEIGHT);
      ctx.strokeStyle = 'rgba(0,60,80,0.18)';
      ctx.lineWidth = 2;
      const stripeOffset = -(camOffset % 70);
      for (let x = stripeOffset; x < LOGICAL_W; x += 70) {
        ctx.beginPath();
        ctx.moveTo(x, GROUND_TOP + 14);
        ctx.quadraticCurveTo(x + 17, GROUND_TOP + 24, x + 35, GROUND_TOP + 14);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(4,60,90,0.5)';
      ctx.fillRect(0, GROUND_TOP, LOGICAL_W, 4);
    } else if (isRamen) {
      ctx.fillStyle = '#caa15e';
      ctx.fillRect(0, GROUND_TOP, LOGICAL_W, GROUND_HEIGHT);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 2;
      const stripeOffset = -(camOffset % 46);
      for (let x = stripeOffset; x < LOGICAL_W; x += 46) {
        ctx.beginPath();
        ctx.moveTo(x, GROUND_TOP + 10);
        ctx.quadraticCurveTo(x + 11, GROUND_TOP + 20, x + 23, GROUND_TOP + 10);
        ctx.quadraticCurveTo(x + 35, GROUND_TOP, x + 46, GROUND_TOP + 10);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255,180,60,0.55)';
      ctx.fillRect(0, GROUND_TOP, LOGICAL_W, 4);
    } else if (isRice) {
      ctx.fillStyle = '#f2e9d0';
      ctx.fillRect(0, GROUND_TOP, LOGICAL_W, GROUND_HEIGHT);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      const grainOffset = -(camOffset % 18);
      for (let x = grainOffset; x < LOGICAL_W; x += 18) {
        for (let row = 0; row < 3; row++) {
          const gx = x + (row % 2 === 0 ? 0 : 9);
          const gy = GROUND_TOP + 10 + row * 18;
          ctx.beginPath();
          ctx.ellipse(gx, gy, 3, 1.6, 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillRect(0, GROUND_TOP, LOGICAL_W, 4);
    } else {
      ctx.fillStyle = '#caa06b';
      ctx.fillRect(0, GROUND_TOP, LOGICAL_W, GROUND_HEIGHT);
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 2;
      const stripeOffset = -(camOffset % 60);
      for (let x = stripeOffset; x < LOGICAL_W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, GROUND_TOP);
        ctx.lineTo(x, LOGICAL_H);
        ctx.stroke();
      }
    }

    // obstáculos
    const nowSec = performance.now() / 1000;
    level.obstacles.forEach(o => {
      const screenX = o.x - camOffset;
      if (screenX < -120 || screenX > LOGICAL_W + 120) return;

      if (o.type === 'spike') {
        // en el arroz, este pincho es un trozo de crunch crujiente (cebolla/ajo frito)
        ctx.fillStyle = isHell ? '#ff5a1f' : isOcean ? '#3a2a5c' : isRamen ? '#7fbf4f' : isRice ? '#c98a3b' : '#5c9e3f';
        ctx.beginPath();
        ctx.moveTo(screenX, GROUND_TOP);
        ctx.lineTo(screenX + SPIKE_W / 2, GROUND_TOP - SPIKE_H);
        ctx.lineTo(screenX + SPIKE_W, GROUND_TOP);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = isHell ? 'rgba(255,220,120,0.6)' : isOcean ? 'rgba(150,220,255,0.5)' : isRice ? 'rgba(255,240,200,0.7)' : 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(screenX + SPIKE_W / 2, GROUND_TOP - SPIKE_H);
        ctx.lineTo(screenX + SPIKE_W / 2 + 4, GROUND_TOP - SPIKE_H + 12);
        ctx.lineTo(screenX + SPIKE_W / 2 - 4, GROUND_TOP - SPIKE_H + 12);
        ctx.closePath();
        ctx.fill();
      } else if (o.type === 'bigspike') {
        this.drawBigSpike(screenX, isHell, isOcean, isRamen, isRice);
      } else if (o.type === 'gap') {
        if (isHell) {
          const lavaGrad = ctx.createLinearGradient(0, GROUND_TOP, 0, LOGICAL_H);
          lavaGrad.addColorStop(0, '#ff7a1a');
          lavaGrad.addColorStop(1, '#5c0f00');
          ctx.fillStyle = lavaGrad;
          ctx.fillRect(screenX, GROUND_TOP, o.width, GROUND_HEIGHT);
          ctx.fillStyle = 'rgba(255,200,80,0.75)';
          ctx.fillRect(screenX, GROUND_TOP, o.width, 6);
        } else if (isOcean) {
          const trenchGrad = ctx.createLinearGradient(0, GROUND_TOP, 0, LOGICAL_H);
          trenchGrad.addColorStop(0, '#043552');
          trenchGrad.addColorStop(1, '#000a12');
          ctx.fillStyle = trenchGrad;
          ctx.fillRect(screenX, GROUND_TOP, o.width, GROUND_HEIGHT);
          ctx.fillStyle = 'rgba(120,220,255,0.4)';
          ctx.fillRect(screenX, GROUND_TOP, o.width, 4);
        } else if (isRamen) {
          const brothGrad = ctx.createLinearGradient(0, GROUND_TOP, 0, LOGICAL_H);
          brothGrad.addColorStop(0, '#ff9d3c');
          brothGrad.addColorStop(1, '#7a2e05');
          ctx.fillStyle = brothGrad;
          ctx.fillRect(screenX, GROUND_TOP, o.width, GROUND_HEIGHT);
          ctx.fillStyle = 'rgba(255,224,150,0.75)';
          ctx.fillRect(screenX, GROUND_TOP, o.width, 6);
        } else if (isRice) {
          // charco de salsa teriyaki, a juego con el pollo teriyaki que se desbloquea
          const teriyakiGrad = ctx.createLinearGradient(0, GROUND_TOP, 0, LOGICAL_H);
          teriyakiGrad.addColorStop(0, '#5c2e0a');
          teriyakiGrad.addColorStop(1, '#2a1204');
          ctx.fillStyle = teriyakiGrad;
          ctx.fillRect(screenX, GROUND_TOP, o.width, GROUND_HEIGHT);
          ctx.fillStyle = 'rgba(255,200,120,0.65)';
          ctx.fillRect(screenX, GROUND_TOP, o.width, 6);
        } else {
          ctx.fillStyle = '#3d2d1a';
          ctx.fillRect(screenX, GROUND_TOP, o.width, GROUND_HEIGHT);
          ctx.fillStyle = 'rgba(80,40,10,0.55)';
          ctx.fillRect(screenX, GROUND_TOP, o.width, 10);
        }
      } else if (o.type === 'enemy') {
        this.drawEnemy(o, screenX, nowSec, isHell, isOcean, isRamen, isRice);
      } else if (o.type === 'ceilspike') {
        this.drawCeilSpike(screenX, isHell, isOcean, isRamen, isRice);
      } else if (o.type === 'platform') {
        this.drawPlatform(screenX, isHell, isOcean, isRamen, isRice);
      } else if (o.type === 'ramp') {
        this.drawRampObstacle(screenX);
      }
    });

    // meta: caja de sushi
    const goalScreenX = level.goalX - camOffset;
    if (goalScreenX > -150 && goalScreenX < LOGICAL_W + 150) {
      this.drawGoalBox(goalScreenX, level.def.goalColor);
    }

    // jugador (nigiri)
    if (this.state === 'entering-goal') {
      this.drawPlayerEnteringGoal();
    } else {
      this.drawPlayer();
    }

    if (this.currentLevel.food.canTeleport && this.keyDHeld) {
      this.drawAimReticle();
    }
    this.drawTeleportFlash();
    this.drawLaunchFlash();

    if (this.currentLevel.scrollStopped) {
      this.drawStoppedBanner();
    } else if (this.isAccelerating) {
      this.drawAccelBanner(this.currentLevel.food.accelMultiplier < 1);
    } else if (this.isGliding) {
      this.drawGlideBanner();
    } else if (this.removeFlashUntil && performance.now() < this.removeFlashUntil) {
      this.drawRemoveBanner();
    }
  }

  drawSkyDecor(camOffset) {
    if (this.isHellLevel()) {
      this.drawHellSkyDecor(camOffset);
      return;
    }
    if (this.isKitchenLevel()) {
      if (this.currentLevel && this.currentLevel.def.decorVariant === 'tempuraHouse') {
        this.drawTempuraHouseSkyDecor(camOffset);
      } else {
        this.drawKitchenSkyDecor(camOffset);
      }
      return;
    }
    if (this.isOceanLevel()) {
      this.drawOceanSkyDecor(camOffset);
      return;
    }
    if (this.isRamenLevel()) {
      this.drawRamenSkyDecor(camOffset);
      return;
    }
    if (this.isRiceLevel()) {
      this.drawRiceSkyDecor(camOffset);
      return;
    }
    const ctx = this.ctx;

    // sol, con un parallax muy sutil
    const sunPeriod = 1400;
    const sunX = (((720 - camOffset * 0.03) % sunPeriod) + sunPeriod) % sunPeriod - 250;
    ctx.save();
    ctx.globalAlpha = 0.9;
    const sunGrad = ctx.createRadialGradient(sunX, 68, 4, sunX, 68, 58);
    sunGrad.addColorStop(0, '#FFE66D');
    sunGrad.addColorStop(1, '#FF6B3D');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, 68, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // monte Fuji al fondo, parallax lento (se repite para cubrir niveles largos)
    const fujiPeriod = 700;
    const fujiBase = (((-camOffset * 0.05) % fujiPeriod) + fujiPeriod) % fujiPeriod;
    for (let i = -1; i <= 1; i++) {
      const baseX = fujiBase + i * fujiPeriod + 220;
      ctx.fillStyle = 'rgba(110, 125, 165, 0.32)';
      ctx.beginPath();
      ctx.moveTo(baseX - 190, GROUND_TOP);
      ctx.lineTo(baseX, GROUND_TOP - 150);
      ctx.lineTo(baseX + 190, GROUND_TOP);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath();
      ctx.moveTo(baseX, GROUND_TOP - 150);
      ctx.lineTo(baseX - 36, GROUND_TOP - 110);
      ctx.lineTo(baseX - 16, GROUND_TOP - 116);
      ctx.lineTo(baseX, GROUND_TOP - 132);
      ctx.lineTo(baseX + 18, GROUND_TOP - 114);
      ctx.lineTo(baseX + 36, GROUND_TOP - 108);
      ctx.closePath();
      ctx.fill();
    }

    // nubes, parallax medio
    const cloudPeriod = 480;
    const cloudBase = (((-camOffset * 0.13) % cloudPeriod) + cloudPeriod) % cloudPeriod;
    for (let i = -1; i <= 1; i++) {
      this.drawCloud(cloudBase + i * cloudPeriod + 90, 50);
      this.drawCloud(cloudBase + i * cloudPeriod + 320, 95);
    }
  }

  drawCloud(cx, cy) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.arc(cx + 16, cy - 7, 18, 0, Math.PI * 2);
    ctx.arc(cx + 36, cy, 14, 0, Math.PI * 2);
    ctx.arc(cx + 16, cy + 6, 16, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  // Decorado de fondo para los niveles de tema "infierno": en vez de sol +
  // monte Fuji + nubes, un astro rojo, volcanes humeantes con grietas de
  // lava y brasas ascendiendo (mismo esquema de parallax que el original).
  drawHellSkyDecor(camOffset) {
    const ctx = this.ctx;
    const nowSec = performance.now() / 1000;

    // astro rojo, parallax muy sutil
    const sunPeriod = 1400;
    const sunX = (((720 - camOffset * 0.03) % sunPeriod) + sunPeriod) % sunPeriod - 250;
    ctx.save();
    ctx.globalAlpha = 0.85;
    const sunGrad = ctx.createRadialGradient(sunX, 68, 4, sunX, 68, 58);
    sunGrad.addColorStop(0, '#ff5a1f');
    sunGrad.addColorStop(1, '#4a0800');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, 68, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // volcanes al fondo, parallax lento, con grieta de lava en vez de nieve
    const volcanoPeriod = 700;
    const volcanoBase = (((-camOffset * 0.05) % volcanoPeriod) + volcanoPeriod) % volcanoPeriod;
    for (let i = -1; i <= 1; i++) {
      const baseX = volcanoBase + i * volcanoPeriod + 220;
      ctx.fillStyle = 'rgba(40, 18, 20, 0.55)';
      ctx.beginPath();
      ctx.moveTo(baseX - 190, GROUND_TOP);
      ctx.lineTo(baseX, GROUND_TOP - 150);
      ctx.lineTo(baseX + 190, GROUND_TOP);
      ctx.closePath();
      ctx.fill();

      // grietas de lava brillante bajando desde el cráter
      ctx.strokeStyle = 'rgba(255,120,30,0.75)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(baseX, GROUND_TOP - 150);
      ctx.lineTo(baseX - 14, GROUND_TOP - 96);
      ctx.lineTo(baseX + 6, GROUND_TOP - 58);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(baseX, GROUND_TOP - 150);
      ctx.lineTo(baseX + 16, GROUND_TOP - 100);
      ctx.stroke();

      // penacho de humo sobre el cráter
      ctx.fillStyle = 'rgba(60,50,55,0.4)';
      ctx.beginPath();
      ctx.ellipse(baseX + 6, GROUND_TOP - 168, 22, 14, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // brasas ascendiendo, parallax medio
    const emberPeriod = 240;
    const emberBase = (((-camOffset * 0.16) % emberPeriod) + emberPeriod) % emberPeriod;
    for (let i = -1; i <= 2; i++) {
      const ex = emberBase + i * emberPeriod + 60;
      const drift = Math.sin(nowSec * 1.4 + i * 2.1) * 10;
      const rise = ((nowSec * 22 + i * 53) % 260);
      this.drawEmber(ex + drift, GROUND_TOP - rise, 1 - rise / 260);
    }
  }

  drawEmber(cx, cy, life) {
    const ctx = this.ctx;
    const alpha = Math.max(0, Math.min(1, life)) * 0.85;
    ctx.save();
    ctx.globalAlpha = alpha;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 6);
    glow.addColorStop(0, '#ffdd88');
    glow.addColorStop(0.5, '#ff7a1a');
    glow.addColorStop(1, 'rgba(255,90,20,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Decorado de fondo para los niveles de tema "cocina" (los Eventos): una
  // lámpara de techo, una barra de la que cuelgan ollas y utensilios, y
  // vapor subiendo, en vez de sol + monte Fuji + nubes.
  drawKitchenSkyDecor(camOffset) {
    const ctx = this.ctx;

    // lámpara de techo colgante, parallax muy sutil
    const lampPeriod = 1400;
    const lampX = (((720 - camOffset * 0.03) % lampPeriod) + lampPeriod) % lampPeriod - 250;
    ctx.save();
    ctx.strokeStyle = 'rgba(90,70,50,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lampX, 0);
    ctx.lineTo(lampX, 30);
    ctx.stroke();
    const glow = ctx.createRadialGradient(lampX, 62, 4, lampX, 62, 56);
    glow.addColorStop(0, 'rgba(255,224,150,0.9)');
    glow.addColorStop(1, 'rgba(255,224,150,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(lampX, 62, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4a3626';
    ctx.beginPath();
    ctx.moveTo(lampX - 26, 30);
    ctx.lineTo(lampX + 26, 30);
    ctx.lineTo(lampX + 14, 56);
    ctx.lineTo(lampX - 14, 56);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFE9A8';
    ctx.beginPath();
    ctx.arc(lampX, 60, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // barra colgante con ollas y utensilios, parallax lento
    const railPeriod = 700;
    const railBase = (((-camOffset * 0.05) % railPeriod) + railPeriod) % railPeriod;
    ctx.strokeStyle = 'rgba(120,100,80,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(LOGICAL_W, 6);
    ctx.stroke();
    for (let i = -1; i <= 1; i++) {
      const baseX = railBase + i * railPeriod + 220;
      this.drawHangingPot(baseX - 60);
      this.drawHangingUtensil(baseX + 90);
    }

    // vapor subiendo, parallax medio (reutiliza la silueta de nube)
    const steamPeriod = 480;
    const steamBase = (((-camOffset * 0.13) % steamPeriod) + steamPeriod) % steamPeriod;
    ctx.save();
    ctx.globalAlpha = 0.55;
    for (let i = -1; i <= 1; i++) {
      this.drawCloud(steamBase + i * steamPeriod + 90, 55);
      this.drawCloud(steamBase + i * steamPeriod + 320, 100);
    }
    ctx.restore();
  }

  drawHangingPot(cx) {
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(90,70,50,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, 6);
    ctx.lineTo(cx, 34);
    ctx.stroke();
    ctx.fillStyle = '#8a94a0';
    ctx.beginPath();
    ctx.roundRect(cx - 16, 34, 32, 22, [3, 3, 8, 8]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 22, 38);
    ctx.lineTo(cx - 16, 38);
    ctx.moveTo(cx + 16, 38);
    ctx.lineTo(cx + 22, 38);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(cx - 12, 38, 5, 14);
  }

  drawHangingUtensil(cx) {
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(90,70,50,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, 6);
    ctx.lineTo(cx, 26);
    ctx.stroke();
    ctx.strokeStyle = '#9aa3ac';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, 26);
    ctx.lineTo(cx, 64);
    ctx.stroke();
    ctx.fillStyle = '#9aa3ac';
    ctx.beginPath();
    ctx.ellipse(cx, 26, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Decorado de fondo del Evento "El festín de tempura": mismo restaurante
  // japonés (lámpara + vapor) que `drawKitchenSkyDecor()`, pero con la barra
  // colgante llena de brochetas de tempura en vez de ollas y utensilios —
  // "un montón de tempuras" de fondo, a petición del usuario.
  drawTempuraHouseSkyDecor(camOffset) {
    const ctx = this.ctx;

    // lámpara de techo colgante, idéntica a la del tema "cocina"
    const lampPeriod = 1400;
    const lampX = (((720 - camOffset * 0.03) % lampPeriod) + lampPeriod) % lampPeriod - 250;
    ctx.save();
    ctx.strokeStyle = 'rgba(90,70,50,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lampX, 0);
    ctx.lineTo(lampX, 30);
    ctx.stroke();
    const glow = ctx.createRadialGradient(lampX, 62, 4, lampX, 62, 56);
    glow.addColorStop(0, 'rgba(255,224,150,0.9)');
    glow.addColorStop(1, 'rgba(255,224,150,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(lampX, 62, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4a3626';
    ctx.beginPath();
    ctx.moveTo(lampX - 26, 30);
    ctx.lineTo(lampX + 26, 30);
    ctx.lineTo(lampX + 14, 56);
    ctx.lineTo(lampX - 14, 56);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFE9A8';
    ctx.beginPath();
    ctx.arc(lampX, 60, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // barra colgante repleta de brochetas de tempura, parallax lento —
    // más repeticiones y más brochetas por tramo que ollas/utensilios en el
    // tema "cocina" normal, para que se lea como "un montón" de fondo
    const railPeriod = 460;
    const railBase = (((-camOffset * 0.05) % railPeriod) + railPeriod) % railPeriod;
    ctx.strokeStyle = 'rgba(120,100,80,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(LOGICAL_W, 6);
    ctx.stroke();
    for (let i = -1; i <= 2; i++) {
      const baseX = railBase + i * railPeriod + 120;
      this.drawHangingTempuraSkewer(baseX - 70);
      this.drawHangingTempuraSkewer(baseX + 30);
      this.drawHangingTempuraSkewer(baseX + 130);
    }

    // vapor de fritura subiendo, parallax medio (reutiliza la silueta de nube)
    const steamPeriod = 480;
    const steamBase = (((-camOffset * 0.13) % steamPeriod) + steamPeriod) % steamPeriod;
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let i = -1; i <= 1; i++) {
      this.drawCloud(steamBase + i * steamPeriod + 90, 55);
      this.drawCloud(steamBase + i * steamPeriod + 320, 100);
    }
    ctx.restore();
  }

  drawHangingTempuraSkewer(cx) {
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(90,70,50,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, 6);
    ctx.lineTo(cx, 24);
    ctx.stroke();

    // palo de la brocheta
    ctx.strokeStyle = '#C68642';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, 24);
    ctx.lineTo(cx, 78);
    ctx.stroke();

    // trozos de tempura rebozada ensartados
    const colors = ['#F0C05A', '#E8A93F', '#F5CE72'];
    for (let i = 0; i < 3; i++) {
      const py = 34 + i * 15;
      ctx.save();
      ctx.translate(cx, py);
      ctx.rotate((i % 2 === 0 ? -1 : 1) * 0.18);
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath();
      ctx.arc(-3, -2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Decorado de fondo para el Nivel 13 (tema "océano"): en vez de sol +
  // monte Fuji + nubes, un haz de luz filtrándose desde la superficie, algas
  // gigantes/corales meciéndose al fondo (mismo esquema de parallax lento que
  // el monte Fuji) y burbujas subiendo (parallax medio, en vez de nubes).
  drawOceanSkyDecor(camOffset) {
    const ctx = this.ctx;
    const nowSec = performance.now() / 1000;

    // haz de luz solar filtrado, parallax muy sutil
    const beamPeriod = 1400;
    const beamX = (((720 - camOffset * 0.03) % beamPeriod) + beamPeriod) % beamPeriod - 250;
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#eafcff';
    ctx.beginPath();
    ctx.moveTo(beamX - 46, 0);
    ctx.lineTo(beamX + 46, 0);
    ctx.lineTo(beamX + 110, LOGICAL_H);
    ctx.lineTo(beamX - 110, LOGICAL_H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // algas/corales gigantes al fondo, parallax lento, ondulando
    const kelpPeriod = 700;
    const kelpBase = (((-camOffset * 0.05) % kelpPeriod) + kelpPeriod) % kelpPeriod;
    for (let i = -1; i <= 1; i++) {
      const baseX = kelpBase + i * kelpPeriod + 220;
      ctx.fillStyle = 'rgba(20, 90, 90, 0.4)';
      ctx.beginPath();
      ctx.moveTo(baseX - 26, GROUND_TOP);
      let topX = baseX;
      const segments = 5;
      for (let s = 1; s <= segments; s++) {
        const t = s / segments;
        const sway = Math.sin(nowSec * 0.8 + i * 2 + s * 0.6) * 14 * t;
        topX = baseX + sway;
        ctx.lineTo(topX - 26 * (1 - t) - 4, GROUND_TOP - 150 * t);
      }
      for (let s = segments; s >= 1; s--) {
        const t = s / segments;
        const sway = Math.sin(nowSec * 0.8 + i * 2 + s * 0.6) * 14 * t;
        topX = baseX + sway;
        ctx.lineTo(topX + 26 * (1 - t) + 4, GROUND_TOP - 150 * t);
      }
      ctx.closePath();
      ctx.fill();
    }

    // burbujas subiendo, parallax medio
    const bubblePeriod = 240;
    const bubbleBase = (((-camOffset * 0.16) % bubblePeriod) + bubblePeriod) % bubblePeriod;
    for (let i = -1; i <= 2; i++) {
      const bx = bubbleBase + i * bubblePeriod + 60;
      const drift = Math.sin(nowSec * 1.4 + i * 2.1) * 10;
      const rise = ((nowSec * 26 + i * 53) % 280);
      this.drawBubble(bx + drift, GROUND_TOP - rise, 3 + (i % 3));
    }

    // silueta de pez cruzando, parallax medio-rápido
    const fishPeriod = 620;
    const fishX = (((640 - camOffset * 0.22) % fishPeriod) + fishPeriod) % fishPeriod - 200;
    this.drawFishSilhouette(fishX, 100 + Math.sin(nowSec * 0.9) * 12);
  }

  drawBubble(cx, cy, r) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(200,240,255,0.5)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawFishSilhouette(cx, cy) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(4, 30, 45, 0.4)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 20, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy);
    ctx.lineTo(cx - 32, cy - 8);
    ctx.lineTo(cx - 32, cy + 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Decorado de fondo del Evento "Ramen extremo": en vez de sol/cocina/mar, la
  // sensación de estar dentro de un cuenco de ramen mirando hacia la pared
  // lejana de cerámica del bowl, con vapor del caldo subiendo denso, palillos
  // apoyados en el borde y burbujas del caldo hirviendo en vez de nubes.
  drawRamenSkyDecor(camOffset) {
    const ctx = this.ctx;
    const nowSec = performance.now() / 1000;

    // pared lejana del cuenco: un resplandor ancho y muy suave cerca del
    // borde superior, sugiriendo la cerámica curvándose hacia atrás
    const rimPeriod = 1000;
    const rimX = (((450 - camOffset * 0.04) % rimPeriod) + rimPeriod) % rimPeriod - 200;
    ctx.save();
    ctx.globalAlpha = 0.35;
    const rimGrad = ctx.createRadialGradient(rimX, -40, 20, rimX, -40, 260);
    rimGrad.addColorStop(0, '#fff3df');
    rimGrad.addColorStop(1, 'rgba(255,243,223,0)');
    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.arc(rimX, -40, 260, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // palillos apoyados en el borde del cuenco, parallax lento
    const chopstickPeriod = 900;
    const chopstickBase = (((-camOffset * 0.05) % chopstickPeriod) + chopstickPeriod) % chopstickPeriod;
    for (let i = -1; i <= 1; i++) {
      this.drawRestingChopsticks(chopstickBase + i * chopstickPeriod + 260, 18);
    }

    // vapor del caldo subiendo, denso, parallax medio (reutiliza la silueta de nube)
    const steamPeriod = 380;
    const steamBase = (((-camOffset * 0.14) % steamPeriod) + steamPeriod) % steamPeriod;
    ctx.save();
    ctx.globalAlpha = 0.6;
    for (let i = -1; i <= 2; i++) {
      this.drawCloud(steamBase + i * steamPeriod + 70, 60);
      this.drawCloud(steamBase + i * steamPeriod + 260, 110);
    }
    ctx.restore();

    // burbujas del caldo hirviendo, parallax medio-rápido
    const bubblePeriod = 220;
    const bubbleBase = (((-camOffset * 0.18) % bubblePeriod) + bubblePeriod) % bubblePeriod;
    for (let i = -1; i <= 2; i++) {
      const bx = bubbleBase + i * bubblePeriod + 50;
      const drift = Math.sin(nowSec * 1.2 + i * 1.7) * 8;
      const rise = ((nowSec * 30 + i * 47) % 260);
      this.drawBrothBubble(bx + drift, GROUND_TOP - rise, 2.5 + (i % 3));
    }
  }

  drawRestingChopsticks(cx, cy) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#caa06b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - 70, cy - 6);
    ctx.lineTo(cx + 70, cy + 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 66, cy + 2);
    ctx.lineTo(cx + 74, cy + 18);
    ctx.stroke();
    ctx.restore();
  }

  drawBrothBubble(cx, cy, r) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,210,140,0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Decorado de fondo del Evento "Tormenta de arroz": un paisaje de arroz en
  // vez de sol/cocina/mar/ramen — montículos de arroz al fondo (mismo esquema
  // de parallax lento que el monte Fuji), vapor de arroz recién hecho subiendo
  // y semillas de sésamo flotando en vez de nubes/burbujas.
  drawRiceSkyDecor(camOffset) {
    const ctx = this.ctx;
    const nowSec = performance.now() / 1000;

    // montículos de arroz al fondo, parallax lento
    const moundPeriod = 700;
    const moundBase = (((-camOffset * 0.05) % moundPeriod) + moundPeriod) % moundPeriod;
    for (let i = -1; i <= 1; i++) {
      const baseX = moundBase + i * moundPeriod + 220;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.beginPath();
      ctx.ellipse(baseX, GROUND_TOP + 10, 130, 70, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 240, 205, 0.4)';
      ctx.beginPath();
      ctx.ellipse(baseX + 70, GROUND_TOP + 22, 90, 46, 0, Math.PI, 0);
      ctx.fill();
    }

    // vapor de arroz recién hecho, denso, parallax medio (reutiliza la silueta de nube)
    const steamPeriod380 = 380;
    const steamBase = (((-camOffset * 0.14) % steamPeriod380) + steamPeriod380) % steamPeriod380;
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let i = -1; i <= 2; i++) {
      this.drawCloud(steamBase + i * steamPeriod380 + 70, 55);
      this.drawCloud(steamBase + i * steamPeriod380 + 260, 100);
    }
    ctx.restore();

    // semillas de sésamo flotando, parallax medio-rápido
    const sesamePeriod = 200;
    const sesameBase = (((-camOffset * 0.2) % sesamePeriod) + sesamePeriod) % sesamePeriod;
    for (let i = -1; i <= 2; i++) {
      const sx = sesameBase + i * sesamePeriod + 40;
      const drift = Math.sin(nowSec * 1.1 + i * 1.9) * 6;
      const rise = ((nowSec * 22 + i * 39) % 240);
      this.drawSesameSeed(sx + drift, GROUND_TOP - rise - 20);
    }
  }

  drawSesameSeed(cx, cy) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 3, 1.6, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawGoalBox(screenX, color) {
    const ctx = this.ctx;
    const w = GOAL_BOX_W;
    const h = GOAL_BOX_H;
    const topY = GROUND_TOP - h;

    // cuerpo de la caja
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(screenX, topY, w, h, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // tapa
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.roundRect(screenX, topY, w, h * 0.22, [8, 8, 0, 0]);
    ctx.fill();

    // ranura por la que "entra" el sushi
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(screenX + w / 2, topY + h * 0.22, w * 0.26, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // palillos apoyados encima
    ctx.strokeStyle = '#caa06b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(screenX + w * 0.12, topY - 6);
    ctx.lineTo(screenX + w * 0.82, topY - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(screenX + w * 0.2, topY - 2);
    ctx.lineTo(screenX + w * 0.9, topY - 16);
    ctx.stroke();
  }

  drawPlayerEnteringGoal() {
    if (!this.currentLevel || !this.player) return;
    const ctx = this.ctx;
    const t = this.goalEntryT || 0;
    const boxCenterX = this.goalBoxScreenX + GOAL_BOX_W / 2;
    const boxSlotY = GROUND_TOP - GOAL_BOX_H + GOAL_BOX_H * 0.22;

    const startX = PLAYER_SCREEN_X;
    const startY = this.goalEntryStartPlayerY;
    const x = startX + (boxCenterX - PLAYER_SIZE / 2 - startX) * t;
    const y = startY + (boxSlotY - PLAYER_SIZE / 2 - startY) * t;
    const size = Math.max(PLAYER_SIZE * (1 - 0.85 * t), 2);

    ctx.save();
    ctx.globalAlpha = 1 - t * 0.3;
    ctx.translate(x + (PLAYER_SIZE - size) / 2, y + (PLAYER_SIZE - size) / 2);
    this.drawFoodSprite(ctx, this.currentLevel.food, size);
    ctx.restore();
  }

  drawBigSpike(screenX, isHell, isOcean, isRamen, isRice) {
    const ctx = this.ctx;
    const w = BIGSPIKE_W;
    const h = BIGSPIKE_H;

    const drawBump = (cx, bw, bh) => {
      ctx.beginPath();
      ctx.moveTo(cx - bw / 2, GROUND_TOP);
      ctx.lineTo(cx, GROUND_TOP - bh);
      ctx.lineTo(cx + bw / 2, GROUND_TOP);
      ctx.closePath();
      ctx.fill();
    };

    // racimo de wasabi (en el infierno, de picos de fuego; en el océano, de
    // erizos de mar apretados; en el ramen, de champiñones shiitake; en el
    // arroz, de cebolla): dos bultos laterales más pequeños + un pico
    // central más alto
    ctx.fillStyle = isHell ? '#c92a0a' : isOcean ? '#241a3d' : isRamen ? '#8a5a3c' : isRice ? '#8a3a5e' : '#3f7a2a';
    drawBump(screenX + w * 0.22, w * 0.42, h * 0.6);
    drawBump(screenX + w * 0.78, w * 0.42, h * 0.6);
    drawBump(screenX + w * 0.5, w * 0.56, h);

    ctx.fillStyle = isHell ? 'rgba(255,200,90,0.7)' : isOcean ? 'rgba(140,210,255,0.55)' : isRamen ? 'rgba(255,224,150,0.65)' : isRice ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.moveTo(screenX + w * 0.5, GROUND_TOP - h);
    ctx.lineTo(screenX + w * 0.5 + 5, GROUND_TOP - h + 14);
    ctx.lineTo(screenX + w * 0.5 - 5, GROUND_TOP - h + 14);
    ctx.closePath();
    ctx.fill();
  }

  drawCeilSpike(screenX, isHell, isOcean, isRamen, isRice) {
    const ctx = this.ctx;
    const w = CEIL_SPIKE_W;
    const drop = CEIL_SPIKE_DROP;

    const drawIcicle = (cx, iw, ih) => {
      ctx.beginPath();
      ctx.moveTo(cx - iw / 2, 0);
      ctx.lineTo(cx, ih);
      ctx.lineTo(cx + iw / 2, 0);
      ctx.closePath();
      ctx.fill();
    };

    // racimo de algas nori (en el infierno, estalactitas de piedra volcánica;
    // en el océano, estalactitas de roca coralina; en el ramen, hebras de
    // fideos colgando; en el arroz, racimos de arroz apelmazado) colgando
    // del techo
    ctx.fillStyle = isHell ? '#2a1518' : isOcean ? '#0a2f3d' : isRamen ? '#e8c86a' : isRice ? '#f2e9d0' : '#1A1A1A';
    drawIcicle(screenX + w * 0.18, w * 0.34, drop * 0.72);
    drawIcicle(screenX + w * 0.5, w * 0.4, drop);
    drawIcicle(screenX + w * 0.82, w * 0.34, drop * 0.78);

    // anclaje al techo
    ctx.fillStyle = isHell ? '#150a0b' : isOcean ? '#061c24' : isRamen ? '#8a6a2a' : isRice ? '#c9b988' : '#0d0d0d';
    ctx.fillRect(screenX, 0, w, 6);

    // brillo húmedo (en el infierno, veta de brasa; en el océano, reflejo
    // azulado; en el ramen, sheen de caldo; en el arroz, grano brillante) en
    // la punta central
    ctx.fillStyle = isHell ? 'rgba(255,120,30,0.5)' : isOcean ? 'rgba(150,225,255,0.4)' : isRamen ? 'rgba(255,255,255,0.4)' : isRice ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.22)';
    ctx.beginPath();
    ctx.moveTo(screenX + w * 0.5, drop * 0.14);
    ctx.lineTo(screenX + w * 0.5 + 4, drop * 0.38);
    ctx.lineTo(screenX + w * 0.5 - 4, drop * 0.38);
    ctx.closePath();
    ctx.fill();
  }

  drawPlatform(screenX, isHell, isOcean, isRamen, isRice) {
    const ctx = this.ctx;
    const w = PLATFORM_W;
    const surfaceY = GROUND_TOP - PLATFORM_H;

    // cuerpo: torre de cajas de bento apiladas (en el infierno, bloques de
    // obsidiana; en el océano, un peñasco de roca coralina; en el ramen, un
    // montículo de fideos y toppings apilados; en el arroz, un montículo de
    // arroz prensado) erizado de pinchos de erizo en los laterales solo en
    // el océano — la superficie de arriba (por donde se aterriza) queda
    // siempre libre de pinchos.
    ctx.fillStyle = isHell ? '#241016' : isOcean ? '#123645' : isRamen ? '#e8c86a' : isRice ? '#f2e9d0' : '#caa06b';
    ctx.fillRect(screenX, surfaceY, w, PLATFORM_H);
    ctx.strokeStyle = isHell ? 'rgba(255,110,30,0.3)' : isOcean ? 'rgba(150,220,255,0.25)' : isRamen ? 'rgba(120,80,20,0.25)' : isRice ? 'rgba(160,120,50,0.2)' : 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, surfaceY, w, PLATFORM_H);

    if (isOcean) {
      // pinchos de erizo asomando por los dos laterales de la roca
      ctx.fillStyle = '#1c2f42';
      const spikeCount = 4;
      for (let i = 0; i < spikeCount; i++) {
        const sy = surfaceY + 14 + i * ((PLATFORM_H - 24) / (spikeCount - 1));
        ctx.beginPath();
        ctx.moveTo(screenX, sy - 5);
        ctx.lineTo(screenX - 9, sy);
        ctx.lineTo(screenX, sy + 5);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(screenX + w, sy - 5);
        ctx.lineTo(screenX + w + 9, sy);
        ctx.lineTo(screenX + w, sy + 5);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      // líneas de separación entre "cajas" apiladas (o entre capas de fideos/arroz)
      ctx.strokeStyle = isHell ? 'rgba(255,110,30,0.22)' : isRamen ? 'rgba(120,80,20,0.2)' : isRice ? 'rgba(160,120,50,0.16)' : 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 1;
      const boxH = PLATFORM_H / 3;
      for (let i = 1; i < 3; i++) {
        const y = surfaceY + boxH * i;
        ctx.beginPath();
        ctx.moveTo(screenX, y);
        ctx.lineTo(screenX + w, y);
        ctx.stroke();
      }
    }

    // superficie superior (donde se aterriza), resaltada
    ctx.fillStyle = isHell ? '#ff7a1a' : isOcean ? '#2fb8c9' : isRamen ? '#ffb238' : isRice ? '#ffffff' : '#e8c48f';
    ctx.fillRect(screenX, surfaceY, w, 10);
    ctx.fillStyle = isHell ? 'rgba(255,220,150,0.5)' : isOcean ? 'rgba(220,250,255,0.5)' : isRamen ? 'rgba(255,255,255,0.45)' : isRice ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)';
    ctx.fillRect(screenX, surfaceY, w, 3);
  }

  drawEnemy(o, screenX, nowSec, isHell, isOcean, isRamen, isRice) {
    const ctx = this.ctx;
    const box = this.enemyBox(o, nowSec);
    const cx = screenX + ENEMY_W / 2;
    const cy = (box.top + box.bottom) / 2;
    const rotation = nowSec * ENEMY_SPIN_SPEED + o.x * 0.03;

    if (isOcean) {
      this.drawJellyfishEnemy(cx, cy, nowSec, o.x);
      return;
    }
    if (isRamen) {
      this.drawChiliEnemy(cx, cy, nowSec, o.x);
      return;
    }
    if (isRice) {
      this.drawRiceEnemy(cx, cy, nowSec, o.x);
      return;
    }

    // hilo que lo sujeta al suelo, para que se lea como "flotando" y no como un error
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, box.bottom - 4);
    ctx.lineTo(cx, GROUND_TOP);
    ctx.stroke();

    // aura de peligro
    const glowColor = isHell ? '200,40,20' : '150,40,190';
    const glow = ctx.createRadialGradient(cx, cy, ENEMY_CORE_RADIUS * 0.4, cx, cy, ENEMY_CORE_RADIUS + ENEMY_SPIKE_LEN + 6);
    glow.addColorStop(0, `rgba(${glowColor},0.35)`);
    glow.addColorStop(1, `rgba(${glowColor},0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, ENEMY_CORE_RADIUS + ENEMY_SPIKE_LEN + 6, 0, Math.PI * 2);
    ctx.fill();

    // púas (erizo de mar / uni, o cuernos de oni en el infierno)
    ctx.fillStyle = isHell ? '#3d1210' : '#2b1f3d';
    for (let i = 0; i < ENEMY_SPIKE_COUNT; i++) {
      const angle = rotation + (i / ENEMY_SPIKE_COUNT) * Math.PI * 2;
      const baseAngle1 = angle - 0.09;
      const baseAngle2 = angle + 0.09;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(baseAngle1) * ENEMY_CORE_RADIUS, cy + Math.sin(baseAngle1) * ENEMY_CORE_RADIUS);
      ctx.lineTo(cx + Math.cos(baseAngle2) * ENEMY_CORE_RADIUS, cy + Math.sin(baseAngle2) * ENEMY_CORE_RADIUS);
      ctx.lineTo(cx + Math.cos(angle) * (ENEMY_CORE_RADIUS + ENEMY_SPIKE_LEN), cy + Math.sin(angle) * (ENEMY_CORE_RADIUS + ENEMY_SPIKE_LEN));
      ctx.closePath();
      ctx.fill();
    }

    // cuerpo central con sombreado
    const bodyGrad = ctx.createRadialGradient(cx - 3, cy - 3, 1, cx, cy, ENEMY_CORE_RADIUS);
    if (isHell) {
      bodyGrad.addColorStop(0, '#9c2b1a');
      bodyGrad.addColorStop(1, '#2c0d08');
    } else {
      bodyGrad.addColorStop(0, '#5b3f7a');
      bodyGrad.addColorStop(1, '#221833');
    }
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, ENEMY_CORE_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // ojo único, brillante, siempre mirando al frente
    ctx.fillStyle = '#ff3b3b';
    ctx.beginPath();
    ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.arc(cx - 1.3, cy - 1.3, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Enemigo del Nivel 13 (tema "océano"): una medusa translúcida en vez del
  // erizo de mar habitual, con tentáculos ondulantes en vez de púas
  // giratorias. Ocupa la misma caja de colisión que `enemyBox()`: mata al
  // tocarla exactamente igual que el resto de enemigos, solo cambia el arte.
  drawJellyfishEnemy(cx, cy, nowSec, seed) {
    const ctx = this.ctx;
    const bellR = ENEMY_CORE_RADIUS + 3;

    // aura de peligro
    const glow = ctx.createRadialGradient(cx, cy, bellR * 0.4, cx, cy, bellR + ENEMY_SPIKE_LEN + 10);
    glow.addColorStop(0, 'rgba(120,220,255,0.3)');
    glow.addColorStop(1, 'rgba(120,220,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, bellR + ENEMY_SPIKE_LEN + 10, 0, Math.PI * 2);
    ctx.fill();

    // tentáculos ondulantes colgando de la campana
    ctx.strokeStyle = 'rgba(180,140,220,0.65)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    const tentacleCount = 5;
    for (let i = 0; i < tentacleCount; i++) {
      const startX = cx - bellR * 0.7 + (i / (tentacleCount - 1)) * bellR * 1.4;
      const wave = Math.sin(nowSec * 3 + seed * 0.02 + i) * 6;
      ctx.beginPath();
      ctx.moveTo(startX, cy + bellR * 0.5);
      ctx.quadraticCurveTo(startX + wave, cy + bellR * 1.4, startX + wave * 0.5, cy + bellR * 2.1);
      ctx.stroke();
    }

    // campana (cuerpo), translúcida
    const bellGrad = ctx.createRadialGradient(cx - 3, cy - 4, 1, cx, cy, bellR);
    bellGrad.addColorStop(0, 'rgba(220,200,255,0.9)');
    bellGrad.addColorStop(1, 'rgba(150,110,210,0.55)');
    ctx.fillStyle = bellGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, bellR, Math.PI, 0);
    ctx.quadraticCurveTo(cx + bellR, cy + bellR * 0.5, cx, cy + bellR * 0.6);
    ctx.quadraticCurveTo(cx - bellR, cy + bellR * 0.5, cx - bellR, cy);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // ojo único, brillante
    ctx.fillStyle = '#ff3b6f';
    ctx.beginPath();
    ctx.arc(cx, cy - 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.arc(cx - 1.3, cy - 3.3, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Enemigo del Evento "Ramen extremo": una guindilla picante flotando y
  // balanceándose en vez del erizo de mar/medusa habitual. Ocupa la misma
  // caja de colisión que devuelve `enemyBox()`, así que mata al tocarla
  // exactamente igual que el resto de enemigos, solo cambia el arte.
  drawChiliEnemy(cx, cy, nowSec, seed) {
    const ctx = this.ctx;
    const bodyR = ENEMY_CORE_RADIUS + 2;

    // aura de peligro (picante)
    const glow = ctx.createRadialGradient(cx, cy, bodyR * 0.4, cx, cy, bodyR + ENEMY_SPIKE_LEN + 8);
    glow.addColorStop(0, 'rgba(255,60,20,0.35)');
    glow.addColorStop(1, 'rgba(255,60,20,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, bodyR + ENEMY_SPIKE_LEN + 8, 0, Math.PI * 2);
    ctx.fill();

    const sway = Math.sin(nowSec * 2.4 + seed * 0.02) * 0.22;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(sway);

    // cuerpo curvado de la guindilla
    const bodyGrad = ctx.createLinearGradient(-bodyR, -bodyR, bodyR, bodyR);
    bodyGrad.addColorStop(0, '#ff5a3c');
    bodyGrad.addColorStop(1, '#c4160f');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(-bodyR * 0.3, -bodyR * 1.3);
    ctx.quadraticCurveTo(bodyR * 1.2, -bodyR * 0.6, bodyR * 0.5, bodyR * 1.2);
    ctx.quadraticCurveTo(-bodyR * 0.3, bodyR * 1.5, -bodyR * 0.6, bodyR * 0.5);
    ctx.quadraticCurveTo(-bodyR * 0.9, -bodyR * 0.5, -bodyR * 0.3, -bodyR * 1.3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // brillo
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.ellipse(-bodyR * 0.1, -bodyR * 0.4, bodyR * 0.25, bodyR * 0.5, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // rabito verde
    ctx.fillStyle = '#3f8a2a';
    ctx.beginPath();
    ctx.moveTo(-bodyR * 0.45, -bodyR * 1.25);
    ctx.lineTo(-bodyR * 0.1, -bodyR * 1.65);
    ctx.lineTo(bodyR * 0.15, -bodyR * 1.2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // ojo único, furioso
    ctx.fillStyle = '#ffe14d';
    ctx.beginPath();
    ctx.arc(cx + bodyR * 0.15, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(cx + bodyR * 0.15, cy, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Enemigo del Evento "Tormenta de arroz": un grumo de arroz apelmazado con
  // una banda de nori (como un mini onigiri furioso) flotando y girando en
  // vez del erizo de mar/medusa/guindilla habitual. Ocupa la misma caja de
  // colisión que devuelve `enemyBox()`, así que mata al tocarlo exactamente
  // igual que el resto de enemigos, solo cambia el arte.
  drawRiceEnemy(cx, cy, nowSec, seed) {
    const ctx = this.ctx;
    const bodyR = ENEMY_CORE_RADIUS + 3;
    const wobble = Math.sin(nowSec * 2.2 + seed * 0.02) * 0.15;

    // aura de peligro
    const glow = ctx.createRadialGradient(cx, cy, bodyR * 0.4, cx, cy, bodyR + ENEMY_SPIKE_LEN + 6);
    glow.addColorStop(0, 'rgba(240,220,180,0.4)');
    glow.addColorStop(1, 'rgba(240,220,180,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, bodyR + ENEMY_SPIKE_LEN + 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(wobble);

    // cuerpo: grumo de arroz redondeado
    const bodyGrad = ctx.createRadialGradient(-bodyR * 0.3, -bodyR * 0.3, 1, 0, 0, bodyR);
    bodyGrad.addColorStop(0, '#ffffff');
    bodyGrad.addColorStop(1, '#e8dcb8');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, bodyR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // banda de nori
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(-bodyR, -bodyR * 0.28, bodyR * 2, bodyR * 0.56);

    ctx.restore();

    // ojo único, furioso
    ctx.fillStyle = '#ff3b3b';
    ctx.beginPath();
    ctx.arc(cx + bodyR * 0.1, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.arc(cx + bodyR * 0.1 - 1.3, cy - 1.3, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawStoppedBanner() {
    const ctx = this.ctx;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px Segoe UI, sans-serif';
    const text = '⏸ PARADO — pulsa A para continuar';
    const w = ctx.measureText(text).width + 28;
    ctx.fillStyle = 'rgba(26,26,26,0.75)';
    ctx.beginPath();
    ctx.roundRect(LOGICAL_W / 2 - w / 2, 14, w, 32, 16);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, LOGICAL_W / 2, 35);
    ctx.restore();
  }

  drawAccelBanner(isBraking) {
    const ctx = this.ctx;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px Segoe UI, sans-serif';
    const text = isBraking ? '🐌 FRENANDO' : '⚡ ACELERANDO';
    const w = ctx.measureText(text).width + 28;
    ctx.fillStyle = isBraking ? 'rgba(61, 148, 255, 0.85)' : 'rgba(255, 107, 61, 0.85)';
    ctx.beginPath();
    ctx.roundRect(LOGICAL_W / 2 - w / 2, 14, w, 32, 16);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, LOGICAL_W / 2, 35);
    ctx.restore();
  }

  drawGlideBanner() {
    const ctx = this.ctx;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px Segoe UI, sans-serif';
    const text = '🪂 PLANEANDO';
    const w = ctx.measureText(text).width + 28;
    ctx.fillStyle = 'rgba(11, 122, 158, 0.85)';
    ctx.beginPath();
    ctx.roundRect(LOGICAL_W / 2 - w / 2, 14, w, 32, 16);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, LOGICAL_W / 2, 35);
    ctx.restore();
  }

  drawRemoveBanner() {
    const ctx = this.ctx;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px Segoe UI, sans-serif';
    const text = this.removeBannerText || '🍜 OBSTÁCULO ELIMINADO';
    const w = ctx.measureText(text).width + 28;
    ctx.fillStyle = 'rgba(217, 134, 28, 0.88)';
    ctx.beginPath();
    ctx.roundRect(LOGICAL_W / 2 - w / 2, 14, w, 32, 16);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, LOGICAL_W / 2, 35);
    ctx.restore();
  }

  // Retículo de puntería del Takoyaki: sigue al ratón mientras se mantiene D.
  // Puramente cosmético — el destino real del teletransporte se calcula a
  // partir de esta misma posición del ratón en `teleportTakoyaki()`.
  drawAimReticle() {
    const ctx = this.ctx;
    const x = this.mouseX;
    const y = this.mouseY;
    ctx.save();
    ctx.strokeStyle = 'rgba(139, 90, 43, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 18, y);
    ctx.lineTo(x - 6, y);
    ctx.moveTo(x + 6, y);
    ctx.lineTo(x + 18, y);
    ctx.moveTo(x, y - 18);
    ctx.lineTo(x, y - 6);
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x, y + 18);
    ctx.stroke();
    ctx.restore();
  }

  // Destello del teletransporte del Takoyaki: como la cámara mantiene al
  // jugador siempre en `PLAYER_SCREEN_X`, teletransportarse no lo mueve en
  // pantalla (es el mundo el que salta hacia delante) — un anillo que se
  // expande y se apaga en su posición fija vende el efecto de "desaparece y
  // reaparece" sin necesidad de animar ningún desplazamiento en pantalla.
  drawTeleportFlash() {
    if (!this.teleportFlashUntil || performance.now() >= this.teleportFlashUntil) return;
    const elapsed = 300 - (this.teleportFlashUntil - performance.now());
    const t = Math.max(0, Math.min(1, elapsed / 300));
    const cx = PLAYER_SCREEN_X + PLAYER_SIZE / 2;
    const cy = this.player.y + PLAYER_SIZE / 2;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 1 - t;
    ctx.strokeStyle = '#8B5A2B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, PLAYER_SIZE * 0.4 + t * 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Rampa de arroz (obstáculo 'ramp'), creada por el jugador con la
  // habilidad del Arroz con pollo teriyaki. No es una pared ni mata a nadie:
  // solo hace de trampolín (ver el chequeo en `update()`). Se dibuja en un
  // tono caramelizado bien distinto del suelo de cualquier tema (incluido el
  // suelo del propio Evento "arroz", que usa un crema muy parecido al blanco
  // del arroz normal) y con un contorno oscuro grueso, para que nunca se
  // camufle contra el fondo.
  drawRampObstacle(screenX) {
    const ctx = this.ctx;
    const w = RAMP_W;
    const h = RAMP_H;
    ctx.save();
    ctx.fillStyle = '#e8b23c';
    ctx.beginPath();
    ctx.moveTo(screenX, GROUND_TOP);
    ctx.lineTo(screenX + w, GROUND_TOP - h);
    ctx.lineTo(screenX + w, GROUND_TOP);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,70,10,0.85)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.moveTo(screenX, GROUND_TOP - 2);
    ctx.lineTo(screenX + w, GROUND_TOP - h);
    ctx.lineTo(screenX + w, GROUND_TOP - h + 6);
    ctx.lineTo(screenX + 6, GROUND_TOP - 2);
    ctx.closePath();
    ctx.fill();
    // "granos" de arroz decorativos, para que se lea como una rampa hecha de arroz
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (let i = 0; i < 5; i++) {
      const t = 0.15 + i * 0.16;
      const gx = screenX + w * t;
      const gy = GROUND_TOP - h * t * 0.85 - 4;
      ctx.beginPath();
      ctx.ellipse(gx, gy, 3, 1.8, -0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Destello del lanzamiento del Arroz con pollo teriyaki: granos de arroz
  // saliendo despedidos hacia atrás desde la posición fija del jugador.
  drawLaunchFlash() {
    if (!this.launchFlashUntil || performance.now() >= this.launchFlashUntil) return;
    const elapsed = 350 - (this.launchFlashUntil - performance.now());
    const t = Math.max(0, Math.min(1, elapsed / 350));
    const cx = PLAYER_SCREEN_X + PLAYER_SIZE / 2;
    const cy = this.player.y + PLAYER_SIZE / 2;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 1 - t;
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI * 0.6 + (i / 5) * Math.PI * 0.8;
      const dist = 10 + t * 46;
      ctx.beginPath();
      ctx.ellipse(cx - Math.cos(angle) * dist, cy + Math.sin(angle) * dist, 3, 1.8, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawPlayer() {
    if (!this.currentLevel || !this.player) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(PLAYER_SCREEN_X, this.player.y);
    this.drawFoodSprite(ctx, this.currentLevel.food, PLAYER_SIZE);
    ctx.restore();
  }

  // Dibuja el aspecto real de una comida en el origen (0,0) de un canvas de
  // tamaño `size`x`size`. Se usa tanto para el jugador en juego como para las
  // miniaturas/vista grande de la pantalla de personajes. Cada `shape` tiene
  // su propia silueta (nigiri = arroz+pez+nori, bao = bollito redondo).
  drawFoodSprite(ctx, food, size) {
    if (food.shape === 'bao') {
      this.drawBaoSprite(ctx, food, size);
      return;
    }
    if (food.shape === 'riceball') {
      this.drawRiceballSprite(ctx, food, size);
      return;
    }
    if (food.shape === 'maki') {
      this.drawMakiSprite(ctx, food, size);
      return;
    }
    if (food.shape === 'wasabi') {
      this.drawWasabiSprite(ctx, food, size);
      return;
    }
    if (food.shape === 'soy') {
      this.drawSoySprite(ctx, food, size);
      return;
    }
    if (food.shape === 'tempura') {
      this.drawTempuraSprite(ctx, food, size);
      return;
    }
    if (food.shape === 'chopstick') {
      this.drawChopstickSprite(ctx, food, size);
      return;
    }
    if (food.shape === 'ramen') {
      this.drawRamenSprite(ctx, food, size);
      return;
    }
    if (food.shape === 'teriyakiRice') {
      this.drawTeriyakiRiceSprite(ctx, food, size);
      return;
    }
    if (food.shape === 'takoyaki') {
      this.drawTakoyakiSprite(ctx, food, size);
      return;
    }
    const r = size * 0.19;

    // arroz (cuerpo)
    ctx.fillStyle = food.bodyColor;
    ctx.beginPath();
    ctx.roundRect(0, size * 0.35, size, size * 0.65, r);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // pez (parte superior)
    ctx.fillStyle = food.topColor;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size * 0.55, r);
    ctx.fill();

    // nori (tira negra)
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, size * 0.32, size, size * 0.08);

    // carita (solo las variantes "S")
    if (food.hasFace) {
      this.drawCuteFace(ctx, size / 2, size * 0.22, size);
    }
  }

  // Dibuja un par de ojitos "kawaii" (con brillo) y mofletes sonrosados,
  // reutilizado por todas las siluetas de comida para que se vean "bonitas".
  drawCuteFace(ctx, cx, eyeY, size, spread = 1, scale = 1) {
    const eyeSpacing = size * 0.19 * spread;
    const eyeR = size * 0.045 * scale;
    const highlightR = eyeR * 0.4;
    const blushSpacing = size * 0.3 * spread;
    const blushR = size * 0.06 * scale;

    // mofletes
    ctx.fillStyle = 'rgba(255, 140, 150, 0.35)';
    ctx.beginPath();
    ctx.arc(cx - blushSpacing, eyeY + eyeR * 1.8, blushR, 0, Math.PI * 2);
    ctx.arc(cx + blushSpacing, eyeY + eyeR * 1.8, blushR, 0, Math.PI * 2);
    ctx.fill();

    // ojos
    [-1, 1].forEach((side) => {
      const ex = cx + side * eyeSpacing;
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.arc(ex, eyeY, eyeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ex + eyeR * 0.35, eyeY - eyeR * 0.35, highlightR, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawBaoSprite(ctx, food, size) {
    const cx = size / 2;
    const cy = size * 0.56;
    const rx = size * 0.47;
    const ry = size * 0.42;

    // bollito
    ctx.fillStyle = food.bodyColor;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // pliegue superior (nudo característico del bao)
    const knotY = cy - ry * 0.75;
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = size * 0.035;
    ctx.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, knotY);
      ctx.lineTo(cx + Math.cos(angle) * size * 0.13, knotY + Math.sin(angle) * size * 0.09);
      ctx.stroke();
    }
    ctx.fillStyle = food.topColor;
    ctx.beginPath();
    ctx.arc(cx, knotY, size * 0.07, 0, Math.PI * 2);
    ctx.fill();

    // carita (solo las variantes "S")
    if (food.hasFace) {
      this.drawCuteFace(ctx, cx, cy - ry * 0.05, size);
    }
  }

  // Dibuja un polígono con las esquinas redondeadas (usado para el
  // triángulo del onigiri, que debe verse "triangular pero tirando a redondo").
  roundedPolygonPath(ctx, points, radius) {
    const n = points.length;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const prev = points[(i - 1 + n) % n];
      const curr = points[i];
      const next = points[(i + 1) % n];
      const dx = prev.x - curr.x;
      const dy = prev.y - curr.y;
      const len = Math.hypot(dx, dy);
      const startX = curr.x + (dx / len) * radius;
      const startY = curr.y + (dy / len) * radius;
      if (i === 0) {
        ctx.moveTo(startX, startY);
      } else {
        ctx.lineTo(startX, startY);
      }
      ctx.arcTo(curr.x, curr.y, next.x, next.y, radius);
    }
    ctx.closePath();
  }

  drawRiceballSprite(ctx, food, size) {
    const top = size * 0.06;
    const bottom = size * 0.94;
    const leftX = size * 0.08;
    const rightX = size * 0.92;
    const midX = size / 2;
    const corner = size * 0.18;

    const points = [
      { x: midX, y: top },
      { x: rightX, y: bottom },
      { x: leftX, y: bottom },
    ];

    this.roundedPolygonPath(ctx, points, corner);
    ctx.fillStyle = food.bodyColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // nori: solo un cuadradito centrado en la base, no toda la base
    const noriW = size * 0.3;
    const noriH = size * 0.22;
    ctx.fillStyle = food.topColor;
    ctx.beginPath();
    ctx.roundRect(midX - noriW / 2, bottom - noriH, noriW, noriH, size * 0.03);
    ctx.fill();

    // carita (solo las variantes "S")
    if (food.hasFace) {
      this.drawCuteFace(ctx, midX, bottom - noriH - size * 0.16, size, 0.55);
    }
  }

  drawMakiSprite(ctx, food, size) {
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.46;

    // nori (anillo exterior)
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // arroz
    ctx.fillStyle = food.bodyColor;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
    ctx.fill();

    // relleno central
    ctx.fillStyle = food.topColor;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // granos de arroz (detalle)
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    const seeds = [[-0.5, -0.4], [0.45, -0.35], [-0.35, 0.45], [0.5, 0.4], [0, 0.55]];
    seeds.forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(cx + dx * r * 0.7, cy + dy * r * 0.7, size * 0.03, 0, Math.PI * 2);
      ctx.fill();
    });

    // carita (solo las variantes "S", más el maki y el maki avanzado)
    if (food.hasFace) {
      this.drawCuteFace(ctx, cx, cy, size, 0.32, 0.55);
    }
  }

  // Personaje de Evento: una montaña de wasabi (silueta redondeada tipo
  // "soft serve", no el pincho puntiagudo de los obstáculos).
  // A petición del usuario, con más aspecto de gelatina que la versión
  // original: contorno inferior ondulado (en vez de liso, para leerse como
  // algo blando que tiembla), cuerpo semitranslúcido y un brillo doble
  // (blanco + del color de acento) más grande y difuso que el brillo sólido
  // de antes. Conserva los ojitos y el surco de textura de siempre.
  drawWasabiSprite(ctx, food, size) {
    ctx.beginPath();
    ctx.moveTo(size * 0.1, size * 0.84);
    ctx.quadraticCurveTo(size * 0.02, size * 0.66, size * 0.08, size * 0.48);
    ctx.quadraticCurveTo(size * 0.04, size * 0.4, size * 0.5, size * 0.08);
    ctx.quadraticCurveTo(size * 0.96, size * 0.4, size * 0.92, size * 0.48);
    ctx.quadraticCurveTo(size * 0.98, size * 0.66, size * 0.9, size * 0.84);
    ctx.quadraticCurveTo(size * 0.72, size * 0.98, size * 0.5, size * 0.93);
    ctx.quadraticCurveTo(size * 0.28, size * 0.98, size * 0.1, size * 0.84);
    ctx.closePath();
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = food.bodyColor;
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // brillo gelatinoso: dos manchas translúcidas superpuestas, más grandes
    // y difusas que un brillo sólido, para dar sensación de humedad/gel
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(size * 0.36, size * 0.32, size * 0.16, size * 0.21, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = food.topColor;
    ctx.beginPath();
    ctx.ellipse(size * 0.4, size * 0.37, size * 0.1, size * 0.14, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // un surco de textura
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = size * 0.02;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(size * 0.32, size * 0.8);
    ctx.quadraticCurveTo(size * 0.44, size * 0.62, size * 0.38, size * 0.44);
    ctx.stroke();

    if (food.hasFace) {
      this.drawCuteFace(ctx, size * 0.5, size * 0.6, size, 0.65, 0.85);
    }
  }

  // Personaje de Evento: el frasco de salsa de soja "de toda la vida" que
  // ponen en las mesas de los restaurantes japoneses (a petición del
  // usuario, ni una gota ni un simple botecito genérico) — cuerpo, cuello
  // estrecho, tapón rojo y etiqueta con una franja de color, y con boca
  // además de ojos, como pide el usuario.
  drawSoySprite(ctx, food, size) {
    const cx = size / 2;
    const bodyW = size * 0.52;
    const bodyTop = size * 0.36;
    const bodyBottom = size * 0.92;
    const bodyH = bodyBottom - bodyTop;
    const neckW = size * 0.22;
    const neckTop = size * 0.16;

    // cuerpo de la botella
    ctx.fillStyle = food.bodyColor;
    ctx.beginPath();
    ctx.roundRect(cx - bodyW / 2, bodyTop, bodyW, bodyH, size * 0.08);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // cuello, más estrecho que el cuerpo
    ctx.fillStyle = food.bodyColor;
    ctx.beginPath();
    ctx.moveTo(cx - neckW / 2, bodyTop + 1);
    ctx.lineTo(cx - neckW / 2, neckTop + size * 0.05);
    ctx.quadraticCurveTo(cx - neckW / 2, neckTop, cx - neckW / 2 + size * 0.03, neckTop);
    ctx.lineTo(cx + neckW / 2 - size * 0.03, neckTop);
    ctx.quadraticCurveTo(cx + neckW / 2, neckTop, cx + neckW / 2, neckTop + size * 0.05);
    ctx.lineTo(cx + neckW / 2, bodyTop + 1);
    ctx.closePath();
    ctx.fill();

    // tapón
    ctx.fillStyle = '#C0392B';
    ctx.beginPath();
    ctx.roundRect(cx - neckW / 2 - size * 0.02, neckTop - size * 0.08, neckW + size * 0.04, size * 0.1, size * 0.02);
    ctx.fill();

    // etiqueta blanca con una franja de color
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.roundRect(cx - bodyW * 0.42, bodyTop + bodyH * 0.3, bodyW * 0.84, bodyH * 0.32, size * 0.02);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = food.topColor;
    ctx.fillRect(cx - bodyW * 0.34, bodyTop + bodyH * 0.42, bodyW * 0.68, bodyH * 0.09);

    // brillo de vidrio
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx - bodyW * 0.28, bodyTop + bodyH * 0.18, bodyW * 0.08, bodyH * 0.14, -0.15, 0, Math.PI * 2);
    ctx.fill();

    if (food.hasFace) {
      const faceCy = bodyTop + bodyH * 0.75;
      this.drawCuteFace(ctx, cx, faceCy, size, 0.5, 0.75);

      // boquita, para que el frasco tenga boca además de ojos
      ctx.strokeStyle = '#7a4415';
      ctx.lineWidth = size * 0.025;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, faceCy + size * 0.045, size * 0.065, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }
  }

  // Personaje del Nivel 13: una gamba rebozada y crujiente, con el cuerpo
  // curvado en forma de "C" (como una gamba a la tempura de verdad), cola
  // en abanico en un extremo, cabecita con antenitas y carita en el otro.
  drawTempuraSprite(ctx, food, size) {
    const cx = size * 0.5;
    const cy = size * 0.56;
    const r = size * 0.27;
    const bodyWidth = size * 0.34;
    const startAngle = Math.PI * 0.08; // extremo de la cabeza
    const endAngle = Math.PI * 1.62; // extremo de la cola

    ctx.save();
    ctx.lineCap = 'round';

    // contorno oscuro del rebozado, da grosor al cuerpo curvado
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = bodyWidth + size * 0.03;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.stroke();

    // cuerpo curvado (rebozado dorado y crujiente)
    ctx.strokeStyle = food.bodyColor;
    ctx.lineWidth = bodyWidth;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.stroke();

    // anillos del rebozado, como los pliegues de una gamba frita
    const rings = 5;
    for (let i = 1; i < rings; i++) {
      const angle = startAngle + (endAngle - startAngle) * (i / rings);
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillStyle = food.topColor;
      ctx.fillRect(-size * 0.018, -bodyWidth * 0.46, size * 0.036, bodyWidth * 0.92);
      ctx.restore();
    }

    // migas crujientes del rebozado, salpicadas por el borde del cuerpo
    const crumbs = 8;
    for (let i = 0; i < crumbs; i++) {
      const angle = startAngle + (endAngle - startAngle) * ((i + 0.5) / crumbs);
      const rr = r + (i % 2 === 0 ? 1 : -1) * bodyWidth * 0.38;
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * rr, cy + Math.sin(angle) * rr, size * 0.035, 0, Math.PI * 2);
      ctx.fill();
    }

    // cola en abanico, en el extremo final de la curva
    const tailX = cx + Math.cos(endAngle) * r;
    const tailY = cy + Math.sin(endAngle) * r;
    ctx.save();
    ctx.translate(tailX, tailY);
    ctx.rotate(endAngle);
    ctx.fillStyle = food.topColor;
    [-0.32, 0, 0.32].forEach((spread) => {
      ctx.save();
      ctx.rotate(spread);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.26, -size * 0.07);
      ctx.lineTo(size * 0.26, size * 0.07);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();

    ctx.restore();

    // cabecita en el extremo inicial de la curva, con antenitas y carita
    if (food.hasFace) {
      const headX = cx + Math.cos(startAngle) * r;
      const headY = cy + Math.sin(startAngle) * r;

      ctx.strokeStyle = food.topColor;
      ctx.lineWidth = size * 0.02;
      ctx.lineCap = 'round';
      [0.35, 0.75].forEach((spread) => {
        const aAngle = startAngle + spread;
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(headX + Math.cos(aAngle) * size * 0.22, headY + Math.sin(aAngle) * size * 0.22);
        ctx.stroke();
      });

      this.drawCuteFace(ctx, headX, headY - size * 0.02, size, 0.45, 0.7);

      // boquita: un pequeño arco sonriente, distintivo de la tempura frente
      // al resto del roster (que solo lleva ojitos)
      ctx.strokeStyle = '#7a4415';
      ctx.lineWidth = size * 0.026;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(headX, headY + size * 0.05, size * 0.06, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }
  }

  // Personaje del Evento "El festín de tempura": un vasito de madera con dos
  // palillos asomando por arriba, y ojitos + boquita en el propio vaso.
  drawChopstickSprite(ctx, food, size) {
    const cx = size / 2;
    const cupTop = size * 0.42;
    const cupBottom = size * 0.94;
    const topW = size * 0.62;
    const bottomW = size * 0.5;

    // palillos, asomando por arriba del vaso
    const drawStick = (baseX, angle) => {
      ctx.save();
      ctx.translate(baseX, cupTop + size * 0.06);
      ctx.rotate(angle);
      ctx.fillStyle = food.topColor;
      ctx.beginPath();
      ctx.roundRect(-size * 0.035, -size * 0.42, size * 0.07, size * 0.42, size * 0.03);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.38, size * 0.025, size * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawStick(cx - size * 0.08, -0.12);
    drawStick(cx + size * 0.1, 0.14);

    // vaso de madera (trapecio con esquinas redondeadas)
    this.roundedPolygonPath(ctx, [
      { x: cx - topW / 2, y: cupTop },
      { x: cx + topW / 2, y: cupTop },
      { x: cx + bottomW / 2, y: cupBottom },
      { x: cx - bottomW / 2, y: cupBottom }
    ], size * 0.06);
    ctx.fillStyle = food.bodyColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // vetas de madera
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = size * 0.015;
    const halfWidthAt = (t) => (topW / 2) * (1 - t) + (bottomW / 2) * t;
    for (let i = 0; i < 3; i++) {
      const t = 0.28 + i * 0.24;
      const y = cupTop + (cupBottom - cupTop) * t;
      const hw = halfWidthAt(t) - size * 0.05;
      ctx.beginPath();
      ctx.moveTo(cx - hw, y);
      ctx.lineTo(cx + hw, y);
      ctx.stroke();
    }

    // borde superior del vaso, más claro
    ctx.fillStyle = food.topColor;
    ctx.beginPath();
    ctx.ellipse(cx, cupTop, topW / 2, size * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.stroke();

    if (food.hasFace) {
      const faceCy = cupTop + (cupBottom - cupTop) * 0.42;
      this.drawCuteFace(ctx, cx, faceCy, size, 0.55, 0.8);
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = size * 0.028;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, faceCy + size * 0.09, size * 0.075, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }
  }

  // Personaje del Evento "Ramen extremo": un cuenco de ramen humeante visto
  // desde arriba, con fideos ondulados, un narutomaki (espiral rosa), un
  // trozo de nori y palillos apoyados en el borde, con carita en el caldo.
  drawRamenSprite(ctx, food, size) {
    const cx = size / 2;
    const bowlTop = size * 0.3;
    const bowlBottom = size * 0.92;
    const bowlTopW = size * 0.94;
    const bowlBottomW = size * 0.6;

    // cuenco (cerámica)
    ctx.fillStyle = '#F5F0E6';
    ctx.beginPath();
    ctx.moveTo(cx - bowlTopW / 2, bowlTop);
    ctx.quadraticCurveTo(cx - bowlBottomW / 2 - 6, bowlBottom * 0.62, cx - bowlBottomW / 2, bowlBottom);
    ctx.quadraticCurveTo(cx, bowlBottom + size * 0.05, cx + bowlBottomW / 2, bowlBottom);
    ctx.quadraticCurveTo(cx + bowlBottomW / 2 + 6, bowlBottom * 0.62, cx + bowlTopW / 2, bowlTop);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // borde superior del cuenco (aro)
    ctx.fillStyle = '#E4DAC0';
    ctx.beginPath();
    ctx.ellipse(cx, bowlTop, bowlTopW / 2, size * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    // caldo
    ctx.fillStyle = food.bodyColor;
    ctx.beginPath();
    ctx.ellipse(cx, bowlTop + size * 0.015, bowlTopW / 2 - size * 0.05, size * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();

    // fideos ondulados
    ctx.strokeStyle = food.topColor;
    ctx.lineWidth = size * 0.035;
    ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * size * 0.15 - size * 0.08, bowlTop - size * 0.01);
      ctx.quadraticCurveTo(cx + i * size * 0.15, bowlTop - size * 0.09, cx + i * size * 0.15 + size * 0.08, bowlTop - size * 0.01);
      ctx.stroke();
    }

    // narutomaki (espiral rosa)
    ctx.fillStyle = '#F2A6B0';
    ctx.beginPath();
    ctx.arc(cx - bowlTopW * 0.24, bowlTop - size * 0.015, size * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#C0392B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx - bowlTopW * 0.24, bowlTop - size * 0.015, size * 0.03, 0, Math.PI * 1.5);
    ctx.stroke();

    // trozo de nori
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.roundRect(cx + bowlTopW * 0.12, bowlTop - size * 0.07, size * 0.17, size * 0.11, 2);
    ctx.fill();

    // palillos apoyados en el borde
    ctx.strokeStyle = '#8B5A2B';
    ctx.lineWidth = size * 0.03;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - bowlTopW * 0.4, bowlTop - size * 0.1);
    ctx.lineTo(cx + bowlTopW * 0.46, bowlTop - size * 0.02);
    ctx.stroke();

    if (food.hasFace) {
      this.drawCuteFace(ctx, cx, bowlTop + size * 0.02, size, 0.55, 0.7);
    }
  }

  // Personaje del Evento "Tormenta de arroz": un plato de arroz blanco con
  // trozos de pollo teriyaki caramelizado, sésamo y cebolleta por encima.
  drawTeriyakiRiceSprite(ctx, food, size) {
    const cx = size / 2;
    const plateTop = size * 0.32;
    const plateBottom = size * 0.92;
    const plateTopW = size * 0.94;
    const plateBottomW = size * 0.66;

    // plato (bandeja)
    ctx.fillStyle = '#F5F0E6';
    ctx.beginPath();
    ctx.moveTo(cx - plateTopW / 2, plateTop);
    ctx.quadraticCurveTo(cx - plateBottomW / 2 - 6, plateBottom * 0.62, cx - plateBottomW / 2, plateBottom);
    ctx.quadraticCurveTo(cx, plateBottom + size * 0.05, cx + plateBottomW / 2, plateBottom);
    ctx.quadraticCurveTo(cx + plateBottomW / 2 + 6, plateBottom * 0.62, cx + plateTopW / 2, plateTop);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // borde del plato
    ctx.fillStyle = '#E4DAC0';
    ctx.beginPath();
    ctx.ellipse(cx, plateTop, plateTopW / 2, size * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    // montón de arroz blanco
    ctx.fillStyle = food.bodyColor;
    ctx.beginPath();
    ctx.ellipse(cx, plateTop + size * 0.01, plateTopW / 2 - size * 0.05, size * 0.055, 0, 0, Math.PI * 2);
    ctx.fill();

    // trozos de pollo teriyaki caramelizado
    const chickenSpots = [[-0.22, -0.01], [0.05, -0.03], [0.26, 0.005]];
    chickenSpots.forEach(([dx, dy]) => {
      ctx.save();
      ctx.translate(cx + dx * size, plateTop + dy * size);
      ctx.fillStyle = food.topColor;
      ctx.beginPath();
      ctx.roundRect(-size * 0.06, -size * 0.035, size * 0.12, size * 0.07, size * 0.02);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,220,160,0.4)';
      ctx.beginPath();
      ctx.ellipse(-size * 0.02, -size * 0.012, size * 0.03, size * 0.015, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // sésamo
    ctx.fillStyle = '#FFFFFF';
    [[-0.32, -0.03], [0.16, -0.045], [0.36, -0.01], [-0.06, -0.05]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.ellipse(cx + dx * size, plateTop + dy * size, size * 0.012, size * 0.007, 0.4, 0, Math.PI * 2);
      ctx.fill();
    });

    // cebolleta picada
    ctx.strokeStyle = '#3f8a2a';
    ctx.lineWidth = size * 0.02;
    ctx.lineCap = 'round';
    [[-0.28, -0.05], [0.1, -0.06], [0.3, -0.03]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx + dx * size - size * 0.02, plateTop + dy * size);
      ctx.lineTo(cx + dx * size + size * 0.02, plateTop + dy * size + size * 0.01);
      ctx.stroke();
    });

    // palillos apoyados en el borde
    ctx.strokeStyle = '#8B5A2B';
    ctx.lineWidth = size * 0.03;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - plateTopW * 0.4, plateTop - size * 0.1);
    ctx.lineTo(cx + plateTopW * 0.46, plateTop - size * 0.02);
    ctx.stroke();

    if (food.hasFace) {
      this.drawCuteFace(ctx, cx, plateTop + size * 0.02, size, 0.55, 0.7);
    }
  }

  // Personaje del Evento "Bolas de pulpo": una bola de takoyaki en un
  // palillo, con salsa y mayonesa en zigzag, y copos de aonori y katsuobushi.
  drawTakoyakiSprite(ctx, food, size) {
    const cx = size * 0.52;
    const cy = size * 0.58;
    const r = size * 0.4;

    // palillo
    ctx.strokeStyle = '#8B5A2B';
    ctx.lineWidth = size * 0.035;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.3, cy + r * 0.75);
    ctx.lineTo(cx - r * 0.55, size * 1.02);
    ctx.stroke();

    // bola de takoyaki
    const bodyGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.15, cx, cy, r);
    bodyGrad.addColorStop(0, '#E0A54F');
    bodyGrad.addColorStop(1, food.bodyColor);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // salsa takoyaki (zigzag oscuro)
    ctx.strokeStyle = food.topColor;
    ctx.lineWidth = size * 0.035;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.6, cy - r * 0.3);
    ctx.lineTo(cx - r * 0.2, cy - r * 0.55);
    ctx.lineTo(cx + r * 0.2, cy - r * 0.2);
    ctx.lineTo(cx + r * 0.6, cy - r * 0.5);
    ctx.stroke();

    // mayonesa (zigzag claro)
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = size * 0.022;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.55, cy);
    ctx.lineTo(cx - r * 0.15, cy - r * 0.25);
    ctx.lineTo(cx + r * 0.25, cy + r * 0.05);
    ctx.lineTo(cx + r * 0.6, cy - r * 0.2);
    ctx.stroke();

    // copos de aonori (verde) y katsuobushi (rosa)
    ctx.fillStyle = '#3f8a2a';
    [[-0.3, 0.25], [0.15, 0.35], [0.4, 0.1]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.ellipse(cx + dx * r, cy + dy * r, size * 0.012, size * 0.02, 0.3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#F2A6B0';
    [[-0.1, 0.4], [0.3, 0.3], [-0.4, 0.05]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.ellipse(cx + dx * r, cy + dy * r, size * 0.015, size * 0.022, -0.3, 0, Math.PI * 2);
      ctx.fill();
    });

    if (food.hasFace) {
      this.drawCuteFace(ctx, cx, cy - r * 0.1, size, 0.5, 0.75);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const game = new SushiDashGame();
  window.sushiGame = game; // hook de depuración

  const canvas = document.getElementById('gameCanvas');
  canvas.addEventListener('mousedown', () => game.handleJumpInput());
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    game.handleJumpInput();
  }, { passive: false });

  // Puntería del Takoyaki: convierte la posición del ratón sobre el canvas
  // (tamaño CSS variable) a coordenadas lógicas fijas (900x380) para el retículo.
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    game.mouseX = (e.clientX - rect.left) / rect.width * LOGICAL_W;
    game.mouseY = (e.clientY - rect.top) / rect.height * LOGICAL_H;
  });
});
