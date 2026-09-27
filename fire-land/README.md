# 🔥 Fire Land

Eres una **pistola disparadora de fuego** anclada al lado izquierdo de la pantalla. Solo te puedes mover en vertical. Los enemigos son **robots**: unos avanzan por la tierra y otros vuelan. Cada nivel que superas te añade una **mejora permanente** al armamento. Son **50 niveles** y **50 mejoras**.

Minijuego del hub [LeoLand](../index.html). HTML5 + CSS3 + JavaScript vanilla, sin dependencias, sin build.

## 🎮 Características

- 50 niveles, cada uno desbloquea una funcionalidad nueva que conservas el resto de la partida.
- Robots de tierra (caminantes, tanques) y de aire (voladores, drones, torretas), más robots élite cada 5 niveles (dos a la vez a partir del 30).
- Dificultad progresiva: más vida, más velocidad, oleadas dobles desde el nivel 30 y más cuota de robots por nivel.
- Progreso, récords por nivel y preferencias de sonido guardados en `localStorage`.
- Sonido procedural con Web Audio API y vibración opcional. Nada de archivos externos.
- Controles de teclado, rueda del ratón y **táctil dedicado** (banda de movimiento + botón de fuego, multitáctil).
- Pantallas estándar: menú, instrucciones, ajustes, juego, pausa, nivel superado, derrota y victoria final.

## 🕹️ Cómo jugar

1. Abre `index.html` en el navegador (o entra desde la landing de LeoLand).
2. Elige un nivel desbloqueado en el menú.
3. Muévete en vertical:
   - **Teclado:** flechas ↑ ↓ o W / S
   - **Ratón:** rueda del ratón, o arrastra sobre el campo
   - **Táctil:** mantén pulsados los botones **▲** y **▼** de la izquierda
4. Dispara fuego (mantener = ráfaga):
   - **Teclado:** Espacio
   - **Ratón:** clic
   - **Táctil:** botón **🔥** abajo a la derecha (puedes mover y disparar con dos dedos a la vez); o toca directamente el campo para mover y disparar con una mano
5. **P** o el botón ⏸ para pausar. En móvil el juego se pausa solo si giras a vertical (juega en horizontal).
6. Destruye la cuota de robots del nivel (barra superior). **Ningún robot puede llegar a tu cuartel general** (el muro del borde izquierdo): si uno lo alcanza, pierdes al instante aunque te sobren vidas.
7. Si un robot choca contigo porque te has interpuesto, solo pierdes 1 vida y el robot se destruye.
8. Si te funden (sin vidas) o cae tu base, repites el nivel; tu progreso de niveles no se pierde.

Truco: toca el título del menú 5 veces para desbloquear todos los niveles.

## 🔓 Las 50 mejoras

| Nivel | Mejora | Efecto |
|------:|--------|--------|
| 1 | Bola de fuego | Un proyectil por disparo. |
| 2 | Disparo doble | Dos bolas de fuego a la vez. |
| 3 | Rayo de fuego | El disparo pasa a ser un rayo que perfora robots. |
| 4 | Disparo triple | Abanico de tres proyectiles. |
| 5 | Fuego intenso | Proyectiles más grandes y con más daño. |
| 6 | Cadencia rápida | Disparas mucho más rápido. |
| 7 | Perforación total | Los proyectiles atraviesan a todos los robots. |
| 8 | Disparo trasero | También lanzas fuego en diagonal y hacia atrás. |
| 9 | Bombas de fuego | Cada 4 disparos sueltas una bomba que explota en el suelo. |
| 10 | Escudo de llamas | Absorbe un impacto y se regenera a los 8 s. |
| 11 | Brasas teledirigidas | Los proyectiles persiguen al robot más cercano. |
| 12 | Rayo tridente | El rayo se divide en tres direcciones. |
| 13 | Impacto explosivo | Los proyectiles estallan al impactar (daño en área). |
| 14 | Muro de fuego | Mantén el disparo para levantar una columna de llamas. |
| 15 | Disparo fénix | Cada 6 s un fénix cruza toda la pantalla perforando y explotando. |
| 16 | Calor abrasador | Los robots alcanzados se mueven al 45 % de velocidad 2 s. |
| 17 | Lluvia de meteoros | Cada 6,5 s caen 3 meteoros de fuego con daño en área. |
| 18 | Dron de combate | Un dron te sigue y dispara solo al robot más cercano. |
| 19 | Sobrecarga | Al llenar la barra de calor entras en modo furia (5 s: doble cadencia y daño). |
| 20 | Núcleo solar | Al 55 % del nivel, un rayo solar barre la pantalla. Además ganas +1 de vida. |
| 21 | Disparo cuádruple | Cuatro proyectiles en abanico. |
| 22 | Rayo de plasma | El rayo es mucho más ancho y potente. |
| 23 | Metralla ardiente | Tus bolas sueltan chispas de daño mientras vuelan. |
| 24 | Fuego en cadena | El impacto salta a un robot cercano (hasta 2 saltos). |
| 25 | Napalm | Las explosiones dejan el suelo ardiendo ~3 s. |
| 26 | Fuego azul | Los robots alcanzados quedan paralizados un instante. |
| 27 | Escuadrón de drones | Un segundo dron de combate. |
| 28 | Escudo reforzado | El escudo aguanta dos impactos. |
| 29 | Brasa vital | Cada 15 robots recuperas una vida. |
| 30 | Muro llameante | El muro de fuego es enorme y sin recarga. |
| 31 | Misiles de fuego | Cada 5 disparos lanzas un misil autoguiado que explota. |
| 32 | Brasas orbitales | Dos brasas giran a tu alrededor y queman al contacto. |
| 33 | Ojiva perforante | Los proyectiles perforan y además explotan. |
| 34 | Rayo barredor | El rayo abre un abanico vertical de 6 haces. |
| 35 | Tormenta de meteoros | 6 meteoros cada 3,6 s. |
| 36 | Sobrecarga total | La furia se llena antes y dura 8 s. |
| 37 | Escudo espejo | Un aura devuelve los disparos enemigos contra los robots. |
| 38 | Géiseres de fuego | Columnas de fuego brotan del suelo cada 3,4 s. |
| 39 | Minas flotantes | Sueltas minas que estallan al paso de los voladores. |
| 40 | Bandada fénix | Dos fénix cada 3,5 s. |
| 41 | Reactor solar | El núcleo solar se recarga y se usa varias veces por nivel. |
| 42 | Aura incandescente | Todo lo que se te acerca recibe daño continuo. |
| 43 | Bólido gigante | Proyectiles enormes que perforan filas enteras. |
| 44 | Campo de brasas | La mitad izquierda de la pantalla ralentiza a los robots. |
| 45 | Torreta de fuego | Una torreta fija en tu base dispara sola a la parte alta. |
| 46 | Onda de choque | Al recibir un golpe sueltas una onda que barre robots. |
| 47 | Lanzallamas | Mantén el disparo: chorro de fuego continuo de corto alcance y mucho daño. |
| 48 | Dron guardián | Un guardián frena al robot más próximo a tu base. |
| 49 | Núcleo inestable | Con 2 vidas o menos, furia permanente. |
| 50 | Dios del Sol | Barridos solares automáticos, todo al máximo y regeneras vida. |

Las mejoras son **acumulativas**: en el nivel N tienes las mejoras 1…N. Algunas mejoras posteriores (rayo, lanzallamas) sustituyen tu disparo principal, pero conservas todo lo automático (drones, meteoros, torreta, orbe, aura…).

## 🤖 Enemigos

| Robot | Tipo | Notas |
|-------|------|-------|
| Caminante | Tierra | Avanza hacia tu base. Si te interpones: −1 vida. Si te esquiva y llega al muro: derrota. |
| Tanque | Tierra | Mucha vida, lento. Aparece desde el nivel 8. |
| Volador | Aire | Se mueve en onda hacia tu base. Te daña al chocar. |
| Dron | Aire | Rápido y frágil. Desde el nivel 6. |
| Torreta | Aire | Te dispara proyectiles. Desde el nivel 4. |
| Élite | Aire | Jefe con mucha vida y ráfaga de proyectiles; se queda a la derecha y no llega a la base. Cada 5 niveles (dos a la vez desde el 30). |

**Tu cuartel general** es el muro del borde izquierdo. Cualquier robot (excepto el élite) que lo toque = **derrota inmediata**, sin gastar vidas. Interponerte con la pistola cuesta 1 vida pero frena al robot.

## 📊 Sistema de puntuación

Puntos por robot destruido:

| Robot | Puntos | Cuota |
|-------|-------:|------:|
| Caminante | 10 | 1 |
| Volador | 12 | 1 |
| Dron | 18 | 1 |
| Torreta | 25 | 1 |
| Tanque | 60 | 2 |
| Élite | 220 | 6 |

- **Cuota del nivel** = `redondear(6 + nivel × 1,7)` puntos de destrucción (nivel 1 ≈ 8, nivel 50 ≈ 91). El nivel termina al alcanzarla (los robots élite deben morir sí o sí).
- **Modo furia** (mejoras 19, 36, 49, 50): +50 % de puntos por robot mientras dura.
- **Bonus al superar el nivel**: `max(0, 600 − tiempo_en_segundos × 4)` por rapidez + `vidas_restantes × 120`.
- La **puntuación final del nivel** = puntos de robots + bonus. Se guarda el mejor resultado por nivel.

## 💾 Almacenamiento local (`localStorage`)

| Clave | Contenido |
|-------|-----------|
| `fireland_progress` | Nivel más alto desbloqueado (1–50). |
| `fireland_best_l<n>` | Mejor puntuación del nivel n. |
| `fireland_soundEnabled` | Sonido activado (`"true"` / `"false"`). |
| `fireland_soundVolume` | Volumen 0–1. |
| `fireland_hapticEnabled` | Vibración activada. |

## 🎨 Paleta

Definida en `:root` dentro de [styles.css](styles.css):

```css
--color-primary:  #ff5722; /* naranja fuego */
--color-accent-1: #ffb300; /* ámbar */
--color-accent-2: #ff8f00; /* ámbar oscuro */
--color-accent-3: #36a64d; /* verde (éxito) */
--color-accent-4: #4ec3e0; /* cian (robots) */
--color-error:    #E74C3C; /* rojo, feedback de daño */
--color-dark:     #1a1207;
--color-light:    #f4ede2;
--color-white:    #FFFFFF;
```

Fondo: degradado `linear-gradient(160deg, #1a0d2e, #4a1c1c, #b23a1e)`.

## 🔊 Sonidos

Todos generados proceduralmente (osciladores + ruido) y silenciables desde Ajustes:

- disparo de bola / disparo de rayo
- impacto en robot / explosión
- daño al jugador (+ vibración)
- nivel superado / mejora desbloqueada / derrota

## 📁 Estructura

```
fire-land/
├── index.html      # Todas las pantallas del juego
├── styles.css      # Estilos y variables CSS
├── js/
│   ├── game.js     # Motor: estado, niveles, mejoras, enemigos, render, input
│   └── audio.js    # Sonido procedural y vibración (Web Audio API)
├── README.md
└── .gitignore
```

## 💻 Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge).
- Sin servidor, sin dependencias, sin conexión.

---

**Versión:** 2.0.0 · **Última actualización:** 2026-09-02

### Cambios 2.0.0
- De 20 a **50 niveles / 50 mejoras**.
- **Controles táctiles dedicados**: banda de movimiento a la izquierda + botón de fuego, multitáctil, aviso de girar el móvil.
- Nueva curva de dificultad (oleadas dobles, doble élite, élite con vida propia más suave al principio).
