# AGENTS.md — Guía para el agente que construya el juego de Sushi Roll

Este archivo da el contexto esencial para crear el juego de esta carpeta de forma consistente con el resto del repo. Léelo antes de empezar a escribir código.

## 1. Qué es este repo

Un hub personal de minijuegos web, servido como sitio estático (GitHub Pages). La landing ([index.html](../index.html)) muestra una grilla de proyectos generada dinámicamente por [main.js](../main.js) a partir del array `projects` definido en [projects.js](../projects.js). Cada juego vive en su propia carpeta al nivel raíz y es autocontenido.

Juegos ya implementados como referencia de estructura: [starcat/](../starcat/), [dinoaventura/](../dinoaventura/), [snake/](../snake/), [minimine/](../minimine/), [sport-game/](../sport-game/).

## 2. Stack obligatorio

- HTML5 + CSS3 + JavaScript Vanilla, ES6+ (clases, arrow functions, `Map`/`Set`, template literals).
- **Sin frameworks, sin dependencias externas, sin CDN, sin build step.** Todo debe funcionar abriendo el `index.html` directamente o sirviéndolo como archivos estáticos.
- Persistencia: `localStorage` (mejores puntuaciones, mejores tiempos, partidas jugadas, preferencias de sonido/volumen/vibración).
- Sonido: Web Audio API, generado **proceduralmente** (osciladores/beeps), nunca archivos de audio externos.
- Vibración: `navigator.vibrate`, siempre detrás de un check de soporte y de una preferencia activable/desactivable.
- Input: debe soportar mouse y touch por igual.

## 3. Estructura de carpetas del juego

```
sushi/
├── index.html                      # Pantallas del juego (menú, juego, victoria, pausa, instrucciones, ajustes)
├── styles.css                      # Estilos (variables CSS, responsive)
├── js/
│   ├── game.js                     # Motor del juego: estado, reglas, render, input
│   └── audio.js                    # Sonidos y vibración (Web Audio API)
├── README.md                       # Descripción, cómo jugar, controles, puntuación, versión
└── .gitignore
```

Documentación de diseño ya presente en esta carpeta (léela antes de generar el código):
- `ESPECIFICACIONES-TECNICAS.md` — especificaciones técnicas y UX/UI detalladas (stack, estado, interacción, visual, sonido, puntuación, generación).

## 4. Sistema de diseño del juego

Este repo no impone una paleta compartida entre juegos: cada carpeta define la suya en variables CSS `:root` dentro de su propio `styles.css`. Punto de partida sugerido para Sushi Roll (documentado en `ESPECIFICACIONES-TECNICAS.md`, ajustable libremente):

```css
--color-primary:   #FF6B3D; /* naranja */
--color-accent-1:  #4ECDC4; /* turquesa */
--color-accent-2:  #FFE66D; /* amarillo */
--color-accent-3:  #36a64d; /* verde (éxito) */
--color-accent-4:  #c889b5; /* púrpura */
--color-error:     #E74C3C; /* rojo, feedback de error */
--color-dark:      #1A1A1A;
--color-light:      #F5F5F5;
--color-white:     #FFFFFF;
```

- Fondo general: degradado `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`.
- Contenedores: tarjeta blanca, esquinas redondeadas (`border-radius: 15-20px`), `box-shadow` suave.
- Tipografía: `'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.
- Mobile-first, breakpoints habituales en `768px` y `480px`.
- Transiciones de pantalla: fade + desplazamiento vertical suave (~0.25-0.3s).

## 5. Funcionalidades estándar que debe tener el juego

- Pantalla de menú principal con título, subtítulo y botón de jugar.
- Pantalla de instrucciones (modal, cerrable).
- Pantalla de ajustes: volumen (0-100%), activar/desactivar sonido, activar/desactivar vibración.
- Pantalla de juego con cabecera (progreso, cronómetro si aplica, botón pausa/menú).
- Pantalla de pausa: progreso congelado, botones Reanudar / Reiniciar / Instrucciones / Menú.
- Pantalla de victoria: resumen de partida, confeti, insignia de "nuevo récord" si aplica, botones para repetir o volver al menú.
- Sistema de puntuación documentado explícitamente en el README del juego (fórmula clara, no arbitraria).
- Guardado en `localStorage` de mejor puntuación y mejor tiempo (por dificultad, si el juego tiene dificultades).
- Sonidos: selección/acierto/error/victoria, todos silenciables.
- Feedback visual de error (parpadeo/flash breve) + sonido + vibración corta a la vez.

## 6. ⚠️ Paso obligatorio: registrar el juego en el hub

**Hay que añadir el juego al array `projects` en [projects.js](../projects.js) para que aparezca en la landing.** El listado de `index.html` (`<div id="projects-grid">`) no es estático: se genera en tiempo de ejecución por [main.js](../main.js) a partir de ese array. Editar `index.html` directamente **no** lo añade al listado.

Pasos:

1. Abre [projects.js](../projects.js) en la raíz del repo.
2. Añade un objeto nuevo al array `projects`:

```js
{
  nombre: "Sushi Roll",
  imagen: "img/projects/sushi.gif",
  enlace: "sushi/index.html",
  enable: true
}
```

3. Añade una imagen o gif de previsualización en `img/projects/` con el nombre usado arriba (revisa el formato de las imágenes ya existentes en esa carpeta para mantener consistencia).
4. Verifica abriendo `index.html` en el navegador que la tarjeta nueva aparece en la grilla y que enlaza correctamente a `./sushi/index.html`.

## 7. Documentación al terminar el juego

El juego debe incluir su propio `README.md` (puedes usar [sport-game/README.md](../sport-game/README.md) como referencia de formato) con, como mínimo: características, cómo jugar, requisitos/instalación, estructura de archivos, paleta usada, sonidos, almacenamiento local, sistema de puntuación, versión y fecha de última actualización.
