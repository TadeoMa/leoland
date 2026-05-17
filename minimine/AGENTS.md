# MINIMINE - Proyecto de Juego 2D

## 📋 Descripción General del Proyecto

**Minimine** es un juego sandbox 2D de minería e construcción, inspirado en Minecraft, desarrollado en **JavaScript vanilla** con Canvas. Es un juego completo con múltiples sistemas integrados que permite al jugador:

- 🎮 Explorar mundos generados proceduralmente con múltiples biomas (bosque, desierto, montañas)
- ⛏️ Minar bloques y recolectar recursos (piedra, minerales, diamantes, esmeraldas)
- 🏠 Construir y decorar estructuras
- ⚔️ Combatir enemigos (de día y de noche)
- 💰 Comerciar con un sistema de tienda y moneda (Dinero)
- 📦 Gestionar inventario con almacenamiento en casa
- 🌙 Sistema de día/noche con ciclos dinámicos
- 💾 Guardar y cargar progreso automáticamente
- 📱 Compatible con controles táctiles en móvil

---

## 📁 Estructura de Carpetas

```
minimine/
├── index.html              # Página principal del juego
├── AGENTS.md              # Este archivo (documentación)
├── css/
│   └── style.css          # Estilos y CSS del juego
├── js/                    # Módulos principales del juego
│   ├── main.js            # Loop del juego y gestión de estado
│   ├── config.js          # Configuración centralizada de valores
│   ├── player.js          # Sistema del jugador
│   ├── world.js           # Generación y gestión del mundo
│   ├── enemies.js         # Sistema de enemigos
│   ├── combat.js          # Sistema de combate
│   ├── inventory.js       # Sistema de inventario
│   ├── input.js           # Gestión de entrada (teclado/táctil)
│   ├── render.js          # Sistema de renderizado gráfico
│   ├── ui.js              # Interfaz de usuario (HUD/menus)
│   ├── sprites.js         # Gestión de sprites y texturas
│   ├── save.js            # Sistema de guardado/carga
│   ├── shop.js            # Sistema de tienda
│   ├── audio.js           # Gestión de sonidos y música
│   ├── daynight.js        # Sistema de ciclo día/noche
│   ├── portal.js          # Sistema de portales/transporte
│   └── utils.js           # Funciones utilitarias
└── assets/
    ├── audio/             # Archivos de sonido
    └── img/               # Imágenes y sprites
```

---

## 📄 Descripción Detallada de Archivos

### **index.html**
- **Propósito**: Estructura HTML principal del juego
- **Contenido**:
  - Canvas para renderizado del juego
  - Overlay de UI (HUD, barras de vida/escudo, inventario)
  - Controles táctiles para móvil
  - Botones de menú (nuevo juego, cargar, opciones)
  - Referencias a todos los estilos y scripts

### **css/style.css**
- **Propósito**: Estilos visuales de la interfaz
- **Includes**:
  - Estilos del canvas y contenedor del juego
  - Diseño del HUD (barras de vida, recursos, indicador día/noche)
  - Hotbar de inventario
  - Menú principal y opciones
  - Controles táctiles responsivos
  - Animaciones y efectos visuales

---

### **js/main.js**
- **Propósito**: Punto de entrada y loop principal del juego
- **Responsabilidades**:
  - Inicializar todos los sistemas (Renderer, Input, Sprites, UI, AudioManager, SaveSystem)
  - Gestionar estados del juego: 'menu', 'playing', 'paused', 'dead'
  - Control de generación de nuevo juego
  - Cargar juegos guardados
  - Loop de animación principal (actualizar → renderizar)
  - Pausar/resumir juego
  - Gestionar fin de juego

### **js/config.js**
- **Propósito**: Centro de configuración centralizado
- **Contiene**:
  - **WORLD**: Dimensiones del mundo, tamaño de bloques, biomas, niveles de cuevas
  - **PLAYER**: Salud, escudo, velocidad, gravedad, tamaño
  - **TOOLS & WEAPONS**: Velocidad de minería, daño, rango
  - **ENEMIES**: Tasas de spawn, vida, daño
  - **ITEMS**: Propiedades de recursos, herramientas, objetos
  - **SHOP**: Precios de mejoras
  - **DAY_NIGHT**: Duración de ciclos

### **js/player.js**
- **Propósito**: Sistema completo del jugador
- **Funcionalidades**:
  - Movimiento horizontal (izquierda/derecha)
  - Física de salto y gravedad
  - Caída de daño
  - Sistema de salud y escudo
  - Regeneración (si se upgradea)
  - Alas opcionales para volar
  - Invulnerabilidad temporal tras recibir daño
  - Gestión de armas equipadas
  - Interacción con bloques
  - Recopilación de recursos
  - Control de velocidad según herramienta/arma

### **js/world.js**
- **Propósito**: Generación y gestión del mundo
- **Sistemas**:
  - **Generación procedural**: Crea mundo con múltiples biomas
  - **Biomas diferentes**: Bosque, desierto, montañas con características únicas
  - **Bloques variados**: Tierra, piedra, minerales, diamantes, esmeraldas
  - **Cuevas**: Generadas subterráneamente con ramificaciones
  - **Árboles**: Generación natural de árboles en bosques
  - **Estructuras**: Casa del jugador, tienda, portal
  - **NPCs**: Colocación de aldeanos/villagers
  - **Lógica de minería**: Extracción y recolección de bloques

### **js/enemies.js**
- **Propósito**: Sistema de enemigos dinámico
- **Características**:
  - **Spawn condicional**: Diferentes tasas de día/noche
  - **Enemigos nocturnos**: Mayor cantidad y peligrosidad de noche
  - **Spawn en cuevas**: Enemigos en subterráneo (siempre activos)
  - **Inteligencia básica**: Movimiento, búsqueda de jugador, ataque
  - **Dropeo de recursos**: Enemigos sueltan recompensas
  - **Limitación de entidades**: Máximo de enemigos simultáneos
  - **Tipos de enemigos**: Zombies, esqueletos, arañas (configurable)

### **js/combat.js**
- **Propósito**: Sistema de combate jugador vs enemigos
- **Mecánicas**:
  - **Ataque a corta distancia**: Espadas y armas cuerpo a cuerpo
  - **Ataque a distancia**: Arcos, flechas
  - **Cálculo de daño**: Basado en arma equipada y estadísticas
  - **Knockback**: Empuje al impactar
  - **Invulnerabilidad**: Período de inmunidad tras recibir daño
  - **Rango de ataque**: Detección de colisiones para golpes
  - **Efectos**: Partículas de sangre, sonidos de impacto

### **js/inventory.js**
- **Propósito**: Sistema de gestión de objetos
- **Componentes**:
  - **Slots de inventario**: 20 slots para guardar items
  - **Hotbar**: 9 slots rápidos de acceso
  - **Almacenamiento en casa**: Items pueden guardarse en la casa
  - **Stack de items**: Acumulación de recursos idénticos
  - **Categorías**: Herramientas, armas, bloques, recursos
  - **Movimiento de items**: Organización entre slots
  - **Límites**: Máximo de slots y peso (opcional)

### **js/input.js**
- **Propósito**: Captura y procesamiento de entrada del usuario
- **Soporta**:
  - **Teclado**: WASD para movimiento, Espacio para saltar, Clic para atacar/minar
  - **Ratón**: Posición para aiming, clic izquierdo/derecho
  - **Táctil**: Controles virtuales en móvil (buttons direccionales)
  - **Gamepad**: (Opcional) Soporte de controladores
  - **Eventos**: Press/release con tracking de teclas activas

### **js/render.js**
- **Propósito**: Sistema de renderizado 2D en Canvas
- **Características**:
  - **Parallax scroll**: Cielo y nubes mueven diferente
  - **Renderizado de bloques**: Texturas y colores por tipo
  - **Renderizado del jugador**: Sprite animado, dirección
  - **Renderizado de enemigos**: Sprites animados
  - **Efectos de partículas**: Minería, golpes, explosiones
  - **Iluminación dinámica**: Iluminación según hora del día
  - **Sombras suavizadas**: Efectos de profundidad
  - **Cámara**: Sigue al jugador centrado en pantalla
  - **Optimización**: Culling de objetos fuera de pantalla

### **js/ui.js**
- **Propósito**: Gestión de interfaz de usuario (DOM)
- **Elementos gestionados**:
  - **HUD ingame**: Barras de vida, escudo, recursos
  - **Hotbar visual**: Mostrar slots de inventario rápido
  - **Pantalla de inicio**: Menú principal
  - **Pantalla de pausa**: Opciones, reanudar, guardar
  - **Menú de inventario**: Vista completa de items
  - **Tienda**: Interfaz de compra/venta
  - **Indicador día/noche**: Muestra hora del ciclo
  - **Equipamiento**: Arma/herramienta actual
  - **Mensajes**: Notificaciones de eventos

### **js/sprites.js**
- **Propósito**: Gestión de recursos gráficos
- **Responsabilidades**:
  - **Carga de imágenes**: Sprites del jugador, enemigos, bloques, items
  - **Animaciones**: Definir frames de animación
  - **Texturas de bloques**: Mapeo de bloques a sprites
  - **Caché**: Almacenar imágenes cargadas
  - **Generación procedural**: (Opcional) Crear sprites dinámicamente
  - **Atlas de sprites**: Optimización de carga

### **js/save.js**
- **Propósito**: Sistema de persistencia de datos
- **Funciones**:
  - **Guardado automático**: Cada 30 segundos
  - **localStorage**: Almacena datos en navegador
  - **Serialización**: Convertir estado del juego a JSON
  - **Deserialización**: Restaurar estado desde guardado
  - **Slots de guardado**: Múltiples partidas (opcional)
  - **Compresión**: (Opcional) Comprimir datos para ahorrar espacio
  - **Datos guardados**: Posición, inventario, mundo, enemigos, progreso

### **js/shop.js**
- **Propósito**: Sistema de comercio y tienda
- **Características**:
  - **Compra de items**: Gastar Dinero para obtener recursos
  - **Venta de recursos**: Intercambiar items por Dinero
  - **Mejoras**: Salud, daño, velocidad minería
  - **Herramientas**: Comprar herramientas mejoradas
  - **Precios dinámicos**: Según disponibilidad (opcional)
  - **NPC tendero**: Interacción con vendedor
  - **Inventario limitado**: Stock limitado de tienda

### **js/audio.js**
- **Propósito**: Gestión de sonidos y música de fondo
- **Incluye**:
  - **Música ambiental**: Por bioma y hora del día
  - **Efectos de sonido**: Minería, ataque, salto, recibir daño
  - **Sonidos de UI**: Click de menú, selección
  - **Control de volumen**: Slider de volumen
  - **Preload**: Carga anticipada de audios
  - **Pooling de sonidos**: Reutilización de instancias de audio

### **js/daynight.js**
- **Propósito**: Sistema de ciclo día/noche
- **Funcionalidades**:
  - **Ciclos temporales**: Duración configurada
  - **Cambios visuales**: Iluminación y colores
  - **Cambios de mecánica**: Spawn de enemigos
  - **Indicador visual**: Muestra hora actual
  - **Bosses nocturnos**: Enemigos más fuertes de noche
  - **Efectos ambientales**: Sonidos diferentes
  - **Progreso**: Contador de días

### **js/portal.js**
- **Propósito**: Sistema de transporte rápido
- **Características**:
  - **Creación de portales**: Puntos de teletransporte
  - **Red de viaje**: Conectar portales
  - **Animación de teletransporte**: Efectos visuales
  - **Requisitos**: Necesita recursos para crear
  - **Destinos**: Menú de selección de destino
  - **Seguridad**: No permite teletransporte a zonas peligrosas

### **js/utils.js**
- **Propósito**: Funciones utilitarias compartidas
- **Contiene**:
  - **Matemáticas**: randomInt, randomFloat, distancia, colisiones
  - **Tiempo**: Funciones de timestamp, timer
  - **Arrays**: Utilidades de búsqueda, ordenamiento
  - **Verificación**: isValidPosition, isBlockSolid
  - **Conversiones**: Píxeles a bloques, ángulos
  - **Debug**: Logging y herramientas de desarrollo

---

## 🎮 Flujo de Juego

1. **Inicialización**: `main.js` carga todos los sistemas
2. **Menú**: Mostrar pantalla de inicio (nuevo juego / cargar)
3. **Generación**: `world.js` crea mundo procedural
4. **Loop principal**: Cada frame:
   - `input.js` captura entrada
   - `player.js` actualiza posición
   - `enemies.js` actualiza enemigos
   - `combat.js` chequea colisiones
   - `daynight.js` actualiza ciclo
   - `render.js` dibuja todo en canvas
   - `ui.js` actualiza HUD
   - `save.js` guarda automáticamente
5. **Fin**: Guardar y volver al menú

---

## 🛠️ Tecnologías

- **HTML5**: Canvas API para gráficos
- **JavaScript ES6+**: Lógica del juego
- **CSS3**: Estilos y animaciones
- **localStorage API**: Guardado de datos
- **Web Audio API**: (En audio.js) Sonidos

---

## 📊 Estadísticas

- **17 módulos JavaScript** especializados
- **Generación procedural** de mundos
- **Sistema de física** 2D integrado
- **Gestión de eventos** centralizada
- **Renderizado optimizado** con Canvas
- **Persistencia** automática de datos

---

## 🎯 Características Clave

✅ Generación procedural de mundos con biomas  
✅ Minería y recolección de recursos  
✅ Sistema de combate con enemigos IA  
✅ Ciclo día/noche con mecánicas dinámicas  
✅ Inventario y gestión de objetos  
✅ Tienda y sistema económico  
✅ Guardado/carga automático  
✅ Controles táctiles para móvil  
✅ Efectos de partículas y animaciones  
✅ Sonido y música ambiental  

---

## 🧟 Guía: Añadir un Nuevo Monstruo

Existen **dos tipos** de monstruos según cómo se dibuja su sprite:

| Tipo | Descripción | Gráfico definido en |
|------|-------------|---------------------|
| **Canvas** | Dibujado con código Canvas 2D | `js/sprites.js` → `_generateAll()` |
| **Sprite Sheet** | Imagen externa con frames de animación | Archivo PNG en `assets/img/` + config en `js/config.js` |

---

### Tipo A: Monstruo Canvas (dibujado con código)

Se dibuja proceduralmente con la API Canvas. Ideal para monstruos simples o si no se dispone de imagen.

#### Paso 1 — Definir estadísticas en `js/config.js`

Añadir una entrada en `CONFIG.ENEMIES.TYPES`:

```js
mi_monstruo: {
    name: 'Mi Monstruo',      // Nombre visible
    health: 5,                 // Puntos de vida
    damage: 2,                 // Daño al jugador
    speed: 1.2,                // Velocidad de movimiento
    color: '#E74C3C',          // Color principal (fallback y partículas)
    width: 28,                 // Ancho en píxeles del hitbox
    height: 36,                // Alto en píxeles del hitbox
    money: 10,                 // Dinero que suelta al morir
    biome: 'any',              // Bioma: 'any', 'forest', 'desert', 'mountains', 'caves'
    // Opcionales:
    // ranged: true,           // Dispara proyectiles a distancia
    // weakTo: 'shovel',       // Herramienta que hace daño especial
    // isBoss: true,           // Es un jefe (no spawnea normalmente)
},
```

**Valores de `biome`:**
- `'any'` — aparece en superficie de cualquier bioma
- `'forest'`, `'desert'`, `'mountains'` — solo en ese bioma de superficie
- `'caves'` — solo en subterráneo (spawn independiente del ciclo día/noche)

#### Paso 2 — Crear sprite Canvas en `js/sprites.js`

Añadir en el método `_generateAll()`, en la sección `// === ENEMIES ===`:

```js
this._createSprite('mi_monstruo', (ctx, s) => {
    // s = tamaño del sprite (48px)
    // Cuerpo
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(s * 0.25, s * 0.3, s * 0.5, s * 0.5);
    // Cabeza
    ctx.fillStyle = '#C0392B';
    ctx.fillRect(s * 0.3, s * 0.1, s * 0.4, s * 0.25);
    // Ojos
    ctx.fillStyle = '#FFF';
    ctx.fillRect(s * 0.4, s * 0.17, s * 0.06, s * 0.06);
    ctx.fillRect(s * 0.55, s * 0.17, s * 0.06, s * 0.06);
    // Piernas
    ctx.fillStyle = '#922B21';
    ctx.fillRect(s * 0.3, s * 0.78, s * 0.15, s * 0.2);
    ctx.fillRect(s * 0.55, s * 0.78, s * 0.15, s * 0.2);
});
```

> **Importante**: El nombre del sprite (`'mi_monstruo'`) **debe coincidir exactamente** con la key usada en `CONFIG.ENEMIES.TYPES`.

#### Paso 3 — ¡Listo!

No se necesitan cambios en otros archivos. El sistema de spawn (`enemies.js`) y renderizado (`render.js`) manejan todo automáticamente:
- El spawn filtra por bioma y elige aleatoriamente entre los tipos disponibles.
- El render busca `Sprites.get(enemy.id)` y dibuja el sprite Canvas.
- Si el sprite no existe, dibuja un rectángulo de color como fallback.

---

### Tipo B: Monstruo con Sprite Sheet (imagen externa)

Usa una imagen PNG con frames organizados en cuadrícula. Soporta animaciones (idle, ataque, etc.).

#### Requisitos del archivo de imagen

- **Formato**: PNG con transparencia
- **Ubicación**: `assets/img/nombre_monstruo.png`
- **Organización**: Cuadrícula regular de frames (todas las celdas del mismo tamaño)
- **Ejemplo**: 3 columnas × 1 fila, cada frame de 64×64px → imagen total de 192×64px

```
┌──────────┬──────────┬──────────┐
│ Frame 0  │ Frame 1  │ Frame 2  │
│  (idle)  │(ataque 1)│(ataque 2)│
│  64×64   │  64×64   │  64×64   │
└──────────┴──────────┴──────────┘
```

Los frames se numeran de izquierda a derecha, de arriba a abajo:
- Fila 0: frames 0, 1, 2, ...
- Fila 1: frames columns, columns+1, ...

#### Paso 1 — Colocar imagen en `assets/img/`

Copiar el archivo PNG del sprite sheet a `assets/img/`.

#### Paso 2 — Definir estadísticas + spriteSheet en `js/config.js`

Añadir en `CONFIG.ENEMIES.TYPES` con la propiedad `spriteSheet`:

```js
mi_monstruo_ss: {
    name: 'Mi Monstruo SS',
    health: 8,
    damage: 3,
    speed: 1.0,
    color: '#8B0000',          // Color fallback (si la imagen no carga)
    width: 32,                 // Ancho del hitbox en el juego
    height: 32,                // Alto del hitbox en el juego
    money: 12,
    biome: 'any',
    spriteSheet: {
        src: 'assets/img/mi_monstruo_ss.png',  // Ruta a la imagen
        frameWidth: 64,        // Ancho de cada frame en la imagen
        frameHeight: 64,       // Alto de cada frame en la imagen
        columns: 3,            // Número de columnas en el sprite sheet
        rows: 1,               // Número de filas en el sprite sheet
        animations: {
            idle: [0],         // Frames para estado normal (índices)
            attack: [1, 2],    // Frames para animación de ataque
        },
    },
},
```

**Propiedades de `spriteSheet`:**

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `src` | string | Ruta relativa a la imagen PNG |
| `frameWidth` | number | Ancho en px de cada frame en la imagen original |
| `frameHeight` | number | Alto en px de cada frame en la imagen original |
| `columns` | number | Número de columnas de frames |
| `rows` | number | Número de filas de frames |
| `animations.idle` | number[] | Índices de frames para estado normal |
| `animations.attack` | number[] | Índices de frames para animación de ataque |

**Cómo funciona la animación de ataque:**
- Cuando el enemigo ataca, su `attackCooldown` se pone a 1000ms y baja a 0.
- Los frames de `attack` se reparten equitativamente en ese tiempo.
- Ejemplo con `attack: [1, 2]`: frame 1 durante los primeros 500ms, frame 2 los últimos 500ms.
- Cuando no está atacando, muestra el primer frame de `idle`.

#### Paso 3 — ¡Listo!

No se necesitan cambios en `sprites.js`, `enemies.js` ni `render.js`. El sistema:
1. `Sprites.init()` → `_loadSpriteSheets()` detecta todos los tipos con `spriteSheet` y los carga.
2. `render.js` → `_renderEnemies()` detecta el sprite sheet y usa `Sprites.drawSpriteSheetFrame()`.
3. Si la imagen no ha cargado aún, usa el fallback de color sólido.

---

### Notas generales para ambos tipos

- **El `id` (key)** en `CONFIG.ENEMIES.TYPES` es el identificador interno. Debe ser único y en snake_case.
- **`width`/`height`** definen el hitbox del enemigo, no el tamaño del sprite. El sprite se escala al hitbox.
- **`color`** se usa como fallback visual y para las partículas al recibir daño.
- **Spawn automático**: No hay que tocar `enemies.js`. Los monstruos aparecen según su bioma.
- **Compatibilidad**: Un monstruo puede tener tanto sprite Canvas como sprite sheet. El sprite sheet tiene prioridad.
- **Para añadir más animaciones en el futuro** (caminar, morir, etc.): ampliar el objeto `animations` y la lógica en `Sprites.getEnemyFrame()`.

### Monstruos actuales

| ID | Nombre | Tipo | Bioma | HP | Daño | Velocidad |
|----|--------|------|-------|----|------|-----------|
| `zombie` | Zombie | Canvas | any | 4 | 1 | 1.2 |
| `skeleton` | Esqueleto | Canvas | any | 3 | 2 | 1.5 |
| `sand_monster` | Monstruo de Arena | Canvas | desert | 6 | 2 | 0.8 |
| `cave_spider` | Araña de Cueva | Canvas | caves | 3 | 1 | 2.0 |
| `mountain_golem` | Golem de Montaña | Canvas | mountains | 10 | 3 | 0.6 |
| `guarderdor` | Guarderdor | Sprite Sheet | any | 8 | 3 | 1.0 |
| `boss` | Jefe Oscuro | Canvas | portal | 50 | 5 | 1.0 |

---

**Última actualización**: Mayo 2026  
**Estado del proyecto**: En desarollo
