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

**Última actualización**: Mayo 2026  
**Estado del proyecto**: En desarollo
