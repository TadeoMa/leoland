# MINIMINE - Proyecto de Juego 2D

## 📋 Descripción General del Proyecto

**Minimine** es un juego sandbox 2D de minería y combate, desarrollado en **JavaScript vanilla** con Canvas. El juego actual incluye:

- 🎮 Mundo procedural con biomas y cuevas
- ⛏️ Minería de bloques y recolección de recursos
- 🛠️ Herramientas, armas y mejoras encantadas
- 🏠 Casa como punto de respawn y refugio
- ⚔️ Combate melee y ranged
- 🛒 Tienda con moneda, diamantes y objetos especiales
- 🧑‍🌾 Comercio con aldeanos mediante esmeraldas
- 🌀 Portal y arena de jefe definitivo
- 🌙 Ciclo día/noche con spawns dinámicos
- 💾 Guardado automático en `localStorage`
- 📱 Controles táctiles para móvil
- 🎵 Música y efectos con Web Audio API

---

## 📁 Estructura de Carpetas

```
minimine/
├── index.html              # Página principal del juego
├── AGENTS.md              # Documentación del proyecto
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
│   ├── portal.js          # Sistema de portal y jefe final
│   └── utils.js           # Funciones utilitarias
└── assets/
    ├── audio/             # Archivos de sonido
    └── img/               # Imágenes y sprites
```

---

## 📄 Descripción Detallada de Archivos

### **index.html**
- **Propósito**: Contenedor principal del juego.
- **Incluye**: canvas de render, overlay de HUD, menús, botones táctiles y referencias a los scripts.

### **css/style.css**
- **Propósito**: Estilos visuales y diseño de la interfaz.
- **Incluye**: HUD, barras de vida/escudo, hotbar, menús, botones táctiles, paneles de tienda/inventario, notificaciones y pantalla de muerte.

---

### **js/main.js**
- **Propósito**: Entrada y loop principal del juego.
- **Responsabilidades**:
  - Inicializar Renderer, Input, Sprites, UI, AudioManager y SaveSystem.
  - Gestionar estados: `menu`, `playing`, `paused`, `dead`.
  - Iniciar nueva partida y cargar partidas guardadas.
  - Ejecutar bucle de actualización y render.
  - Gestionar cámara, pausa, tienda, inventario, portal, muerte y respawn.
  - Incluir modo de prueba local con atajos de depuración.

### **js/config.js**
- **Propósito**: Valores y definiciones centrales.
- **Contiene**:
  - `WORLD`: Dimensiones, biomas, superficie y cuevas.
  - `PLAYER`: Salud, escudo, velocidad, gravedad y vuelo.
  - `TOOLS` y `ENCHANTED`: Herramientas, armas y objetos especiales.
  - `BLOCKS`: Tipos de bloques y requisitos de minería.
  - `ENEMIES`: Tipos de enemigos, stats, spawns y propiedades.
  - `SHOP`: Items comprables con monedas y diamantes.
  - `VILLAGER_ITEMS`: Comercio con aldeanos.
  - `DAY_NIGHT`: Duración de día y noche.
  - `PORTAL`: Condiciones y recompensas.
  - `AUDIO`: Música y sonidos.
  - `CAMERA`: Suavizado y límites.

### **js/player.js**
- **Propósito**: Lógica del jugador.
- **Funcionalidades**:
  - Movimiento, salto, gravedad y colisiones.
  - Salud, escudo, daño y ataques.
  - Uso de herramientas y armas para minar y combatir.
  - Detección de portal y activación de boss screen.
  - Guardado y restauración de estado.

### **js/world.js**
- **Propósito**: Generación y gestión del mundo.
- **Sistemas**:
  - Generación procedural con biomas `forest`, `desert` y `mountains`.
  - Superficie, subterráneo, bedrock, cuevas y ores.
  - Colocación de árboles, aldeanos, casa y portal.
  - Ores: hierro, oro, diamante y esmeralda.
  - Minería basada en herramientas y partículas.
  - Portal activo y arena de jefe.
  - Guardado y restauración de estado completo.

### **js/enemies.js**
- **Propósito**: Control de enemigos y spawns.
- **Características**:
  - Spawns nocturnos en superficie y constantes en cuevas.
  - Límite de enemigos simultáneos.
  - Enemigos con biomas específicos y debilidades.
  - Enemigos ranged y melee.
  - Jefe final con lógica de arena y recompensas.

### **js/combat.js**
- **Propósito**: Mecánicas de combate.
- **Mecánicas**:
  - Colisiones y daño entre jugador y enemigos.
  - Daño especial con herramientas.
  - Proyectiles enemigos.
  - Knockback e invulnerabilidad.
  - Efectos de impacto.

### **js/inventory.js**
- **Propósito**: Gestión de inventario.
- **Componentes**:
  - Inventario con múltiples slots y hotbar.
  - Selección de item equipado.
  - Pila de items y conteo.
  - Guardado y carga del inventario.

### **js/input.js**
- **Propósito**: Captura de entrada.
- **Soporta**:
  - Teclado: WASD, Espacio, Escape, E, I, 1-9.
  - Ratón: apuntado, clic izquierdo/derecho.
  - Táctil: botones virtuales para movimiento, salto, ataque, tienda e inventario.
  - Prevención de menú contextual.

### **js/render.js**
- **Propósito**: Renderizado 2D con Canvas.
- **Características**:
  - Cámara suavizada y centrada.
  - Dibujo de bloques, entidades y partículas.
  - Culling de objetos fuera de pantalla.
  - Renderizado de sprites y efectos.

### **js/ui.js**
- **Propósito**: Gestión de UI DOM.
- **Elementos**:
  - HUD con vida, escudo, recursos y hora del día.
  - Hotbar interactiva.
  - Paneles: inventario, tienda, pausa, muerte, portal, villager dialog.
  - Tienda con pestañas `money` y `diamonds`.
  - Comercio de aldeanos con esmeraldas.
  - Notificaciones de portal y victoria.

### **js/sprites.js**
- **Propósito**: Gestión de sprites.
- **Responsabilidades**:
  - Generación de sprites canvas.
  - Carga de sprite sheets para enemigos.
  - Dibujo de frames animados y flip horizontal.
  - Selección de frame por estado de enemigo.

### **js/save.js**
- **Propósito**: Guardado y carga.
- **Funciones**:
  - Guardado automático cada 30 segundos.
  - Serialización de jugador, inventario, mundo, día/noche y portal.
  - Carga fiable desde localStorage.
  - Evita guardado durante la arena de jefe.

### **js/shop.js**
- **Propósito**: Comercio y tienda.
- **Características**:
  - Compras con monedas y diamantes.
  - Items básicos y mejoras.
  - Armas, herramientas y objetos especiales.
  - Cambio de pestañas y validación de compra.

### **js/audio.js**
- **Propósito**: Audio y música.
- **Incluye**:
  - Web Audio API con contexto diferido.
  - Música de día, noche y jefe.
  - Efectos para minería, impacto, portal y menú.

### **js/daynight.js**
- **Propósito**: Ciclo día/noche.
- **Funcionalidades**:
  - Temporizador de día y noche.
  - Cambios de spawn y visuales.
  - Guardado y restauración de estado.

### **js/portal.js**
- **Propósito**: Portal y jefe final.
- **Características**:
  - Apertura de portal tras matar enemigos.
  - Barra de entrada a portal.
  - Generación de arena de jefe.
  - Recompensas y regreso al mundo.

### **js/utils.js**
- **Propósito**: Utilidades.
- **Contiene**:
  - randomInt, randomFloat, distancia, clamping, lerp.
  - Helpers de tiempo, listas y colisiones.

---

## 🎮 Flujo de Juego Actualizado

1. **Carga**: `main.js` inicializa todos los sistemas.
2. **Menú**: Mostrar pantalla inicial con nuevo juego/cargar.
3. **Generación**: `world.js` crea el mundo procedural.
4. **Loop principal**:
   - `input.js` captura controles.
   - `player.js` actualiza movimiento y acciones.
   - `enemies.js` maneja spawns y IA.
   - `combat.js` calcula daño y ataques.
   - `daynight.js` avanza el ciclo.
   - `portal.js` gestiona portal y jefe.
   - `save.js` guarda automáticamente.
   - `ui.js` actualiza HUD y paneles.
   - `render.js` dibuja el juego.
5. **Portal y jefe**:
   - Tras suficientes muertes, el portal aparece.
   - El jugador puede entrar y luchar en una arena de jefe.
   - Al derrotar al jefe, obtiene recompensas.
6. **Fin**: Guardado continuo y respawn tras muerte.

---

## 🎯 Características Clave Actuales

✅ Mundo procedural con biomas  
✅ Cuevas subterráneas y ores  
✅ Minería con herramientas específicas  
✅ Combate melee y ranged  
✅ Enemigos únicos y jefe final  
✅ Tienda con moneda y diamantes  
✅ Comercio con aldeanos  
✅ Guardado automático  
✅ Controles táctiles  
✅ HUD completo  
✅ Audio ambiente  
✅ Sprite sheets animados  
✅ Modo prueba local

---

## 🧟 Enemigos actuales

| ID | Nombre | Tipo | Bioma | HP | Daño | Velocidad |
|----|--------|------|-------|----|------|-----------|
| `zombie` | Zombie | Canvas | any | 4 | 1 | 1.2 |
| `skeleton` | Esqueleto | Canvas | any | 3 | 2 | 1.5 |
| `sand_monster` | Monstruo de Arena | Canvas | desert | 6 | 2 | 0.8 |
| `cave_spider` | Araña de Cueva | Canvas | caves | 3 | 1 | 2.0 |
| `mountain_golem` | Golem de Montaña | Canvas | mountains | 10 | 3 | 0.6 |
| `guarderdor` | Guarderdor | Sprite Sheet | any | 100 | 3 | 1.0 |
| `boss` | Jefe Oscuro | Canvas | portal | 50 | 5 | 1.0 |

---

## 🛠️ Notas recientes

- El portal se abre tras matar `CONFIG.PORTAL.KILLS_TO_OPEN` enemigos.
- La entrada al portal crea una arena de jefe temporal.
- Guarderdor usa sprite sheet animado cargado automáticamente.
- El guardado se suspende en la arena de jefe.
- UI separa inventario, tienda, pausa, muerte y diálogo de aldeanos.
- El modo de prueba local añade recursos y atajos de depuración.
- Botones táctiles específicos abren tienda e inventario.

---

## 📄 Estado del proyecto

**Última actualización**: 21 de mayo de 2026
**Estado del proyecto**: En desarrollo
