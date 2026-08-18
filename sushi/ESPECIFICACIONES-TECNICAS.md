# Sushi Family - Especificaciones Técnicas (v0.5, en progreso)

> Este documento sustituye la versión anterior (que describía un puzzle de trazar caminos, estilo Zip Zap). El juego cambió de género: ahora es un runner de plataformas estilo **Geometry Dash**, ambientado en un restaurante de sushi. Está incompleto a propósito — se irá ampliando a medida que se definan más tipos de sushi, niveles y enemigos.

## 1. Concepto

- Juego de plataformas de scroll automático (el personaje avanza solo, el jugador solo controla el salto), estilo Geometry Dash.
- El jugador empieza controlando un **nigiri normal y corriente**, sin habilidades especiales — equivalente al "cubo" de Geometry Dash.
- **Sin transformaciones a mitad de nivel** (nada de modos nave/robot/bola como en Geometry Dash original). El cambio de personaje es progresión **entre niveles**: al completar un nivel se desbloquea un nuevo tipo de comida japonesa, con una habilidad distinta.
- El personaje **no** está atado a un nivel concreto: hay una pantalla de selección de personaje donde el jugador elige, de entre los ya desbloqueados, cuál quiere usar; ese personaje se aplica a cualquier nivel que juegue a partir de ahí (hasta que lo cambie).
- **Diferencias deliberadas respecto a Geometry Dash:**
  - El avance se puede parar. Pulsando **A** el personaje se detiene en seco (el nivel deja de desplazarse, aunque la gravedad y el salto siguen funcionando); pulsando A de nuevo continúa. Da margen para pensar el siguiente salto sin la presión del scroll constante.
  - Algunos personajes (la familia maki) pueden acelerar voluntariamente manteniendo pulsada **D**, en vez de tener siempre una única velocidad fija.
- Cada nivel termina en una **caja de sushi (bento)** de un color propio, apoyada en el suelo: al llegar a ella el personaje "entra" (animación breve de encogerse y deslizarse hacia la ranura de la tapa) y se muestra la pantalla de victoria. No son las banderas de meta típicas del género.

## 2. Tipos de comida (personajes jugables)

| Comida | Se desbloquea | Velocidad | Salto | Aceleración (`D`) |
|---|---|---|---|---|
| Nigiri | Personaje inicial (equipado por defecto) | Normal | Normal | No |
| Nigiri de pez mantequilla | Completar Nivel 1 | +20% | Normal | No |
| Bollito de carne | Completar Nivel 3 | -20% (el más lento) | El más alto de todos | No |
| Bola de arroz | Completar Nivel 4 | Normal | Normal | No |
| Maki | Completar Nivel 5 | Normal | Normal | Sí, +15% mientras se mantiene `D` |
| Maki avanzado | Completar Nivel 6 | Normal | Un poco más alto que el maki normal | Sí, +20% mientras se mantiene `D` |
| Nigiri S | Completar Nivel 7 | Normal | Normal | No (tiene doble salto, ver nota) |
| Nigiri de pez mantequilla S | Completar Nivel 8 | +30% (el más rápido de todos) | Normal | No |
| Bollito de carne S | Completar Nivel 9 | -15% | El más alto de todos: toca el límite superior de la pantalla, y algo más ancho | No |
| Bola de arroz S | Completar Nivel 10 | Normal | Normal | Sí, pero al revés: **frena** -30% mientras se mantiene `D` |
| Tempura | Completar Nivel 13 | Normal | Normal | Sí, pero de otro tipo: **planea** en el aire hasta 3s manteniendo `D` (ver nota) |

Notas:
- La Bola de arroz no tiene ninguna ventaja/desventaja mecánica: es un desbloqueo cosmético, sin habilidad especial (el usuario no pidió ninguna al describirla).
- El Nigiri S introduce la primera habilidad que no es velocidad/salto/aceleración: **doble salto**. Pulsando saltar por segunda vez mientras está en el aire (y no lo ha usado ya en ese vuelo) hace un segundo impulso con la misma física que el salto normal. Se recarga al volver a tocar el suelo. Es deliberadamente un personaje "lateral" y no "superior": no es más rápido ni salta más alto que el nigiri normal, solo tiene una herramienta extra para corregir un salto mal calculado — coherente con que ningún personaje del roster es objetivamente el mejor en todo, cada uno destaca en una cosa distinta.
- El Nigiri de pez mantequilla S mejora la única característica que ya distinguía al nigiri de pez mantequilla (la velocidad, +20% → +30%) en vez de sumarle una habilidad nueva — así no compite con el Nigiri S por el mismo "hueco" (utilidad vs. velocidad pura) y sigue siendo cierto que ningún personaje es objetivamente superior a otro. Es, con diferencia, el personaje más rápido del roster.
- El Bollito de carne S, a petición explícita del usuario, sí es una mejora directa del bollito normal en dos ejes a la vez (salto y anchura del salto): `jumpMultiplier` sube de 1.3 a 1.4, lo bastante para que el salto choque con el límite superior de la pantalla (clamp en `y=0`) en vez de solo acercarse, y `speedMultiplier` sube ligeramente de 0.8 a 0.85 para ensanchar el salto sin perder su identidad de "personaje lento". Al tratarse de un salto que llega a tocar el techo, el cálculo analítico de ventanas de salto (que asume una parábola libre simétrica) deja de ser válido — el impacto con el techo rompe la simetría y acorta el tiempo total de vuelo respecto a lo que predice la fórmula. Se sustituyó por una traza numérica del salto (integrando la misma física/clamp del motor) para calcular las ventanas reales, y se validó con simulación física completa en los Niveles 7, 8 y 9.
- La Bola de arroz S reutiliza el mismo mecanismo de `D` que la familia maki (`canAccelerate` + `accelMultiplier`), pero con un multiplicador menor que 1 (0.7): mantener `D` la frena un 30% en vez de acelerarla. El banner en pantalla distingue ambos casos ("⚡ ACELERANDO" vs "🐌 FRENANDO", con color distinto) según el signo del multiplicador, en vez de asumir siempre aceleración.
- Tempura introduce una tercera habilidad ligada a `D`, independiente de `canAccelerate`/`accelMultiplier`: `canGlide` + `glideDuration` (3s). Mientras esté en el aire y se mantenga `D`, la gravedad se anula por completo (`vy = 0`, el personaje flota en línea recta) en vez de solo acelerar u frenar el desplazamiento horizontal. El cupo de planeo se agota mientras se mantiene `D` en el aire, pero se **rellena entero cada vez que el personaje vuelve a tocar el suelo** — no hay temporizador de recarga independiente del propio hecho de aterrizar, así que un jugador que encadene saltos cortos siempre tiene los 3s completos disponibles en cada uno. Banner propio ("🪂 PLANEANDO") con la misma prioridad que el de aceleración/frenado (se muestra el de "parado" primero si `A` está activo).
- Desbloquear una comida no la equipa automáticamente: hay que ir a la pantalla "Personajes" y confirmar el cambio (ver sección 4a).
- Cada tipo de comida tiene su propia silueta dibujada en canvas (no son solo variaciones de color): nigiri = arroz + pez + nori; bao (bollito de carne) = bollito redondo con nudo de pliegue; bola de arroz = triángulo de onigiri con banda de nori; maki = corte transversal con anillo de nori, arroz y relleno de color.

### Por qué los multiplicadores de aceleración son moderados

La velocidad de desplazamiento del nivel determina cuánta distancia recorre el personaje mientras está en el aire tras saltar. Si un personaje acelera Y salta muy alto a la vez, puede recorrer en el aire más distancia de la que hay entre dos obstáculos seguidos — y entonces no llega a aterrizar a tiempo para el siguiente salto, haciendo el nivel imposible. Esto se detectó jugando de verdad el Nivel 6 con el Maki avanzado (con los multiplicadores iniciales de +55% de aceleración y +15% de salto, el personaje se quedaba permanentemente en el aire respecto a los obstáculos). Los valores finales (+15% / +20% de aceleración, +5% de salto extra en el avanzado) se eligieron para que, incluso acelerando a fondo en el nivel más rápido (Nivel 6), siga habiendo margen para aterrizar antes del siguiente obstáculo.

## 3. Stack Tecnológico

- HTML5 + CSS3 + JavaScript Vanilla (ES6+, clases), `<canvas>` para el renderizado del juego.
- Sin frameworks, sin dependencias externas, sin build step.
- Sonido: Web Audio API, generado proceduralmente.
- Vibración: `navigator.vibrate`, tras comprobar soporte.
- Input: clic/touch/`Espacio` = saltar (un único input, como en el modo cubo de Geometry Dash). Tecla `A` = parar/reanudar el avance. Tecla `D` = acelerar mientras se mantiene pulsada (solo si el personaje equipado puede acelerar).
- `.canvas-wrap` (pantalla de juego) limita su ancho con `width: min(100%, 900px, calc((100dvh - 84px) * 900 / 380))` en vez de solo `width:100%`, para que el lienzo 900×380 quepa siempre entero en la altura visible (clave en ventanas bajas o móvil en horizontal, donde limitar solo por ancho dejaba la parte de abajo del nivel fuera de la pantalla sin posibilidad de hacer scroll, porque el `touchstart` del canvas hace `preventDefault`). Corregido a petición del usuario ("nivel 2 se corta por la mitad").

## 4. Mecánica implementada

- Física: gravedad constante, salto de impulso único (sin salto doble ni mantener pulsado). El salto está calibrado para dar un margen de tiempo cómodo sobre cada obstáculo (no es un ajuste "al milímetro").
- El personaje tiene una posición fija en pantalla; el nivel se desplaza por debajo a la velocidad del nivel, multiplicada por la velocidad del personaje equipado y, si se mantiene `D`, por su multiplicador de aceleración.
- Barra de progreso en la parte superior de la pantalla de juego, que se rellena según el porcentaje del nivel recorrido.
- Fondo del cielo con sol, monte Fuji de fondo (con parallax) y nubes (con parallax), en vez de un cielo liso.
- Obstáculos:
  - **Wasabi** (pincho verde, en el suelo): mata al tocarlo, hay que saltarlo.
  - **Wasabi grande** (racimo de wasabi, más ancho y alto que el normal, introducido en el Nivel 3): igual que el wasabi normal pero exige un salto más generoso.
  - **Charco de salsa de soja** (hueco en el suelo): mata al caer dentro si no se salta a tiempo.
  - **Enemigo** (erizo de mar/uni flotando en el aire, en línea vertical sobre el suelo, con un hilo que lo sujeta, balanceo suave y púas girando): mata al tocarlo, sin excepción — ningún tipo de sushi puede atacarlo ni derrotarlo. Al flotar por encima de la altura normal del personaje, si no se salta mientras está cerca no se le toca; saltar justo en ese tramo sí es letal. Es el obstáculo opuesto al wasabi: mientras que el wasabi obliga a saltar, el enemigo obliga a **no** saltar.
  - **Pincho de techo** (racimo de algas nori colgando del techo, introducido en el Nivel 7): cuelga desde arriba del todo de la pantalla. Igual que el enemigo, obliga a **no** saltar mientras se está debajo (caminar es seguro; saltar es letal, ya que cualquier salto sube lo bastante como para tocarlo). Se usa deliberadamente cerca de huecos y rachas de wasabi para crear una trampa psicológica: tras varios obstáculos que exigen saltar, aparece uno que castiga el reflejo de saltar por inercia. Siempre se coloca con un margen amplio (≥300px) respecto al hueco/wasabi más cercano para que sea justo: hay tiempo de sobra para frenar el reflejo de salto antes de llegar y, ya pasado, para saltar con calma el siguiente obstáculo.
  - **Plataforma elevada** (torre de cajas de bento apiladas, introducida en el Nivel 10): a diferencia del resto de obstáculos (cajas de colisión fijas), cambia el nivel del suelo mientras se está sobre ella. Hay que saltar lo bastante alto para aterrizar en su superficie (130px por encima del suelo normal — casi un salto al límite para los personajes de salto normal) y seguir corriendo por encima; si se llega por debajo de la superficie sin haber subido ya lo suficiente, es una pared sólida y mata igual que un pincho. No hace falta mantenerse "por encima" durante todo su ancho: basta con haber alcanzado la altura de la superficie al llegar al borde de ataque, momento en el que se aterriza automáticamente y el resto del ancho es seguro. Siempre aislada con mucho margen (≥350px) del obstáculo más cercano. En el Nivel 13 (tema "océano") se reskinea como un peñasco de roca coralina erizado de pinchos de erizo en los dos laterales — es literalmente una "plataforma con pinchos" a petición del usuario — pero la caja de colisión no cambia: la superficie de arriba sigue totalmente libre de pinchos y es donde siempre se aterriza.
- Morir reinicia el nivel al instante desde el principio (sin pantalla de "game over"), llevando la cuenta de intentos — como en Geometry Dash.
- Parar el avance con `A` no protege de nada por sí solo: si te quedas parado justo bajo un erizo, su balanceo puede llegar a tocarte igualmente.
- Completar el nivel guarda el mejor tiempo y el menor número de intentos en `localStorage`, y desbloquea la siguiente comida si corresponde.

## 4a. Pantalla de selección de personaje

- Accesible desde el menú principal (botón "Personajes") y desde la pantalla de nivel superado cuando se acaba de desbloquear una comida nueva (botón "Ver personajes").
- Columna izquierda: lista de todas las comidas, con su aspecto real en miniatura (no un emoji). Las desbloqueadas muestran su sprite y nombre (marcando "En uso" la que está equipada); las bloqueadas se ven en gris con un icono de interrogación y el texto "Bloqueado".
- Columna derecha: sprite grande, nombre, descripción y una lista de características (Velocidad, Salto y, si aplica, Habilidad especial) del personaje que se esté previsualizando (por defecto, el equipado al entrar).
- Botón inferior "Usar este personaje": equipa el personaje previsualizado (queda guardado en `localStorage` y se usará en cualquier nivel que se juegue después). Si el previsualizado ya es el equipado, el botón se deshabilita y pasa a decir "✓ Personaje actual".
- El menú principal muestra siempre, encima de la lista de niveles, con qué personaje se va a jugar ("Jugando como: ...") con un atajo para cambiarlo.

## 5. Niveles actuales

| Nivel | Nombre | Obstáculos | Longitud aprox. | Velocidad base | Desbloquea | Color de la caja meta |
|---|---|---|---|---|---|---|
| 1 | Primeros pasos | 27 | 9250px | 260 | Nigiri de pez mantequilla | Turquesa |
| 2 | Peligro en el aire | 32 | 10400px | 260 | — | Púrpura |
| 3 | La cocina no perdona | 44 | 11290px | 300 | Bollito de carne | Amarillo |
| 4 | Hora punta | 53 | 12396px | 310 | Bola de arroz | Verde |
| 5 | Modo turbo | 70 | 15938px | 320 | Maki | Naranja |
| 6 | Turbo extremo | 82 | 17060px | 330 | Maki avanzado | Rojo |
| 7 | El techo también pincha | 96 | 25540px | 330 | Nigiri S | Índigo |
| 8 | El techo aprieta más | 120 | 29114px | 330 | Nigiri de pez mantequilla S | Magenta |
| 9 | El techo no da tregua | 136 | 32686px | 330 | Bollito de carne S | Teal |
| 10 | Caos total | 128 | 40381px | 330 | Bola de arroz S | Rojo coral |
| 11 | El infierno del sushi | 113 | 29370px | 330 | — (todo desbloqueado ya) | Naranja lava |
| 12 | El caos infernal | 136 | 31666px | 330 | — (todo desbloqueado ya) | Rojo sangre |
| 13 | Fosa abisal | 157 | 43925px | 330 | Tempura | Azul océano |

Cada nivel usa un **orden distinto** de los mismos tipos de obstáculo (wasabi, wasabi grande, hueco, enemigos en racimo de tamaño variable) — no es la misma plantilla repetida a más velocidad. Los niveles 1-2 no tienen enemigos agrupados ni wasabi grande (se introducen a partir del Nivel 3). El Nivel 7 introduce el pincho de techo (ver sección 4) y es notablemente más largo que el resto (+50% respecto al Nivel 6). El Nivel 8 reutiliza el mismo lenguaje que el Nivel 7 pero un peldaño más difícil: algo más largo, con más obstáculos y con dos tramos de doble-pincho-de-techo-con-hueco-de-por-medio en vez de uno (el combo más exigente del Nivel 7). Es el nivel más difícil hasta la fecha.

El Nivel 10, a petición del usuario, usa un **orden deliberadamente desordenado** (generado con una secuencia pseudoaleatoria de semilla fija en vez de secciones limpias) e introduce la plataforma elevada (2 apariciones). Es el nivel más largo hasta la fecha (+24% respecto al Nivel 9).

Validación de los Niveles 7 y 8: además de comprobar analíticamente la ventana de salto de cada wasabi/wasabi grande para los personajes existentes, se simuló el nivel completo físicamente (misma gravedad/velocidad de salto/colisiones que el motor real, política de salto "primer instante seguro dentro de la ventana") para nigiri, nigiri de pez mantequilla (normal y el candidato mejorado a +30%), bollito de carne, maki y maki avanzado acelerando a fondo — los seis completan ambos niveles sin morir. Todas las ventanas de salto tienen un margen de al menos 94px, igual de generoso que en los niveles anteriores, nada "al milímetro".

### Niveles 11-12: tema "infierno"

A petición del usuario, los Niveles 11 y 12 estrenan un **paisaje completamente distinto** al resto del juego (que hasta ahora comparten el mismo restaurante/exterior con monte Fuji): cielo degradado rojo-negro en vez de celeste, un astro rojo en vez del sol amarillo, volcanes humeantes con grietas de lava en vez del monte Fuji, brasas ascendiendo en vez de nubes, suelo de roca volcánica agrietada (con brillo naranja) en vez de tablas de madera. Los obstáculos son mecánicamente los mismos cinco tipos de siempre (wasabi → pincho de fuego, wasabi grande → racimo de picos de fuego, charco de soja → grieta de lava, erizo/uni → oni con aura roja, pincho de techo/plataforma → estalactita de piedra/bloque de obsidiana), solo reskineados — el motor de colisiones no cambió. `LEVELS[i].theme === 'hell'` activa el reskin completo en `render()`/`drawSkyDecor()`/`drawBigSpike()`/`drawCeilSpike()`/`drawPlatform()`/`drawEnemy()`.

Ninguno de los dos niveles desbloquea comida nueva (los 10 personajes ya están todos desbloqueados desde el Nivel 10).

> Nota posterior: el Maki y el Maki avanzado llegaron a tener `hasFace: true` (ojitos) durante un tiempo, con la narrativa de arriba, pero el usuario pidió revertirlo — de nuevo son los únicos personajes sin cara del roster (junto con Nigiri, Nigiri de pez mantequilla, Bollito de carne y Bola de arroz, que nunca la tuvieron).

El Nivel 11 sigue el estilo "secciones curadas" de los niveles 1-9. El Nivel 12, a petición del usuario, es su versión "igual pero más difícil y desordenada": mismos cinco tipos de obstáculo y misma velocidad base (330), pero con más obstáculos en menos espacio (136 en 31666px, frente a 113 en 29370px del Nivel 11) y con el orden de los tramos barajado con una semilla pseudoaleatoria fija (mismo mecanismo que ya usaba el Nivel 10).

Validación de los Niveles 11 y 12: en vez de rederivar las ventanas de salto desde cero, ambos niveles se construyeron concatenando "plantillas" de obstáculos (rachas de pinchos, racimos de enemigos, combos pincho-de-techo, etc.) cuyo espaciado interno está copiado literalmente de los Niveles 8, 9 y 10 (misma `baseScrollSpeed` 330, ya validados/jugados) — la seguridad de cada plantilla se hereda en vez de volver a demostrarse. El margen libre *entre* plantillas nunca baja de los mínimos ya probados en esos mismos niveles (≥220px entre obstáculos que exigen salto por separado, ≥300px si interviene un pincho de techo, ≥350px si interviene una plataforma elevada); el Nivel 12 solo recorta ese margen libre hasta esos suelos mínimos (nunca por debajo) para ganar densidad.

### Nivel 13: tema "océano" (fondo del mar)

A petición del usuario, el Nivel 13 estrena un tercer paisaje (además del restaurante/exterior de los Niveles 1-10 y el "infierno" de los Niveles 11-12): fondo marino a media profundidad, con cielo degradado azul oscuro→turquesa en vez de celeste, un haz de luz solar filtrándose desde la superficie en vez del sol/astro, algas y coral gigante ondulando al fondo en vez del monte Fuji/volcanes, burbujas ascendiendo en vez de nubes/brasas, una silueta de pez cruzando la pantalla, y suelo de arena ondulada en vez de tablas de madera o roca volcánica. Los cinco tipos de obstáculo de siempre se reskinean igual que en el tema "infierno" (wasabi → pincho de erizo, wasabi grande → racimo de erizos, charco de soja → fosa/corriente oscura, pincho de techo → estalactita de roca coralina): `LEVELS[12].theme === 'ocean'` activa el reskin en `render()`/`drawSkyDecor()`/`drawBigSpike()`/`drawCeilSpike()`/`drawPlatform()`.

Dos obstáculos tienen, además del recoloreado, un cambio de forma (no solo de color), a petición explícita del usuario:
- El **enemigo** se dibuja como una medusa translúcida con tentáculos ondulantes (`drawJellyfishEnemy()`) en vez del erizo de mar con púas giratorias — usa exactamente la misma caja de colisión que devuelve `enemyBox()`, así que el comportamiento (mata al tocarla, sin excepciones) no cambia, solo el arte.
- La **plataforma elevada** se dibuja como un peñasco de roca coralina con pinchos de erizo asomando por los dos laterales (`drawPlatform(..., isOcean)`) — "una plataforma con pinchos", tal cual la pidió el usuario. La superficie de arriba (por donde se aterriza) se deja siempre limpia de pinchos; la caja de colisión (pared sólida si se llega por debajo de la superficie, aterrizaje seguro si se llega por encima) es idéntica a la de las plataformas del resto del juego.

Es, a petición del usuario, el nivel más difícil y caótico hasta la fecha: 157 obstáculos en 43925px (más que ningún otro nivel, incluido el Nivel 10 con 128/40381px), con 5 plataformas elevadas y 16 pinchos de techo — más que en cualquier nivel anterior de cualquiera de los dos tipos. Se construyó concatenando tramos completos, copiados literalmente (mismas coordenadas relativas), de los Niveles 9, 10, 11 y 12 —todos ya validados a `baseScrollSpeed` 330— intercalados en un orden distinto al original de cada uno para maximizar la sensación de caos. Entre cada tramo se dejó un margen llano fijo de 420px sin ningún obstáculo, por encima de los tres mínimos ya documentados (220/300/350px), así que la única superficie "nueva" (las costuras entre tramos) es, por construcción, más permisiva que cualquier margen ya probado en el resto del juego.

Al completarlo se desbloquea **Tempura**: dos trozos de tempura rebozada pegados el uno al otro, con ojitos y boquita (a diferencia del resto del roster, que solo lleva ojitos). Es normal en velocidad y salto —para no tener que revalidar las ventanas de salto de los Niveles 1-12 con un multiplicador nuevo—, pero introduce una habilidad nueva del todo: planear en el aire hasta 3 segundos manteniendo `D` tras saltar (ver sección 2), pensada para dar una forma de jugar distinta a niveles ya completados más que para superar el propio Nivel 13 (que se juega y se valida sin ella, con los personajes ya desbloqueados en el Nivel 12).

Pendiente: número final de niveles.

## 5a. Eventos

Botón "Eventos" en el menú principal, junto a "Personajes": abre una pantalla con partidas independientes de la campaña (array `EVENTS`, separado de `LEVELS`). Diferencias clave respecto a un nivel normal:

- **Siempre jugables**, sin desbloqueo previo — `isLevelUnlocked()` no se consulta para ellos, así que son accesibles incluso en una partida nueva con solo el nigiri equipado. Los Eventos "La ira del wasabi" y "La carrera de la soja" tienen dificultad "intermedia" (misma familia de obstáculos y ritmo que el Nivel 3, sin pincho de techo ni plataforma). El Evento "Ramen extremo", a petición explícita del usuario, es "Nivel Difícil": sí incluye pincho de techo y plataforma elevada, las dos características que marcan a los niveles avanzados de la campaña (ver más abajo).
- Al superarlos desbloquean un personaje que **no** forma parte de la progresión normal (no hay ningún nivel de la campaña que lo desbloquee).
- No encadenan un "siguiente evento": el botón de la pantalla de victoria dice "Volver a eventos" y regresa siempre a la lista, en vez de intentar `EVENTS[index+1]` como hace la campaña con `LEVELS[index+1]`.
- Comparten motor con la campaña vía `beginRun(levelDef, index, source)` (`source: 'campaign' | 'event'`); `onLevelComplete()`, `restartCurrentLevel()` y `exitToHub()` miran `currentLevel.source` para saber si tocan `completedLevels`/`completedEvents` y si vuelven al menú o a la pantalla de Eventos.
- Progreso independiente en `localStorage`: `sushi_completed_events` (no cuenta para desbloquear nada, solo para marcar ✅ en la lista).

Tema visual "cocina" (`theme: 'kitchen'`): pared de azulejos, una lámpara de techo colgante, una barra con ollas/utensilios colgando y vapor subiendo (reutiliza la silueta de `drawCloud`), suelo de encimera de acero en vez de tablas de madera. A diferencia del tema "infierno", los obstáculos **no** se reskinean (siguen en verde/marrón de wasabi y soja de siempre) porque ya encajan temáticamente con una cocina.

Personajes de Eventos (ver tabla de personajes en la sección 2 para contexto):

| Comida | Se desbloquea | Velocidad | Salto | Habilidad especial |
|---|---|---|---|---|
| Wasabi | Evento "La ira del wasabi" | +20% | +20% (normal, no doble salto) | Ninguna explícita: el salto más ancho de todo el roster (velocidad × salto = 1.44, por encima del 1.30 de nigiri de pez mantequilla S y el 1.19 de bollito de carne S, que hasta ahora eran los que más terreno cubrían en el aire). Subido de +15%/1.38 a +20%/1.44 a petición del usuario ("que salte un poquito más a lo ancho"), tocando solo la velocidad y no el multiplicador de salto: como la altura del salto no cambia, no afecta a ninguna interacción con pinchos de techo ya validada, solo amplía el margen al saltar pinchos/huecos. |
| Soja | Evento "La carrera de la soja" | +35% (la más rápida de todo el roster, por delante del +30% de nigiri de pez mantequilla S) | Normal | Ninguna (toda su identidad es la velocidad pura, sin acelerador ni doble salto) |
| Ramen | Evento "Ramen extremo" | +20% (igual que el nigiri de pez mantequilla) | Normal | Eliminar el próximo obstáculo (tecla `S` o botón 🍜 en pantalla): hasta 3 veces por partida |
| Arroz con pollo teriyaki | Evento "Tormenta de arroz" | Normal | Normal | Crear una rampa de arroz (tecla `D`, pulsación única) que da un salto muy grande al llegar a ella: hasta 3 veces por partida |
| Bolas de pulpo | Evento "Bolas de pulpo" | Normal | Normal | Teletransportarse (mantener `D`, apuntar con el ratón, soltar para transportarse): hasta 3 veces por partida. Sin protección extra: aparecer sobre un obstáculo mata igual que a cualquier otro personaje — a petición explícita del usuario, esa es su desventaja |

Sprites nuevos en canvas: Wasabi es una montaña/silueta redondeada tipo "soft serve" (no el pincho puntiagudo de los obstáculos) con ojitos, con un aspecto más gelatinoso (más brillo/traslucidez) a petición del usuario; Soja es el frasco de salsa de soja "de toda la vida" que ponen en las mesas de los restaurantes japoneses (ni gota ni botecito genérico), con cuerpo, cuello, tapón rojo y etiqueta, y con boca además de ojos, también a petición del usuario. Ambos usan `hasFace: true` igual que las variantes "S".

Nota de seguridad de los multiplicadores: Wasabi y Soja se pueden equipar y llevar a cualquier nivel de la campaña, no solo a los Eventos. Sus multiplicadores se eligieron dentro del rango ya probado en el resto del roster (velocidad ≤1.35, por debajo del histórico +30% de nigiri de pez mantequilla S convertido en el nuevo tope; salto ≤1.2, por debajo del 1.4 de bollito de carne S) para no introducir combinaciones de velocidad+salto más extremas que las ya validadas — pero, a diferencia de los niveles de la campaña, los Niveles 11-12 y los propios Eventos no se han vuelto a simular específicamente para estos dos personajes.

### Evento "Ramen extremo": tema visual "ramen" y la habilidad de eliminar obstáculos

A petición del usuario, este Evento estrena un cuarto paisaje (`theme: 'ramen'`, además de "cocina", "infierno" y "océano"): la cámara se sitúa dentro de un cuenco de ramen humeante en vez de en un restaurante — cielo degradado ámbar/marrón oscuro en vez de celeste (evocando la pared de cerámica lejana del bowl y el vapor del caldo), un resplandor cálido cerca del borde superior sugiriendo la cerámica curvándose hacia atrás, palillos apoyados en el borde, vapor denso subiendo (reutiliza `drawCloud`) y burbujas del caldo hirviendo en vez de nubes; suelo de fideos ondulados sobre una base de caldo en vez de tablas de madera. Los cinco tipos de obstáculo de siempre se reskinean con ingredientes del ramen en vez de wasabi/soja: pincho → brote/cebolleta verde, wasabi grande → racimo de champiñones shiitake, charco de soja → olla/vórtice de caldo hirviendo, pincho de techo → hebras de fideos colgando, plataforma elevada → montículo de fideos y toppings apilados. El enemigo (`drawChiliEnemy()`) es una guindilla picante flotando y balanceándose, con la misma caja de colisión que el resto de enemigos (`enemyBox()`) — mata al tocarla igual que el erizo de mar o la medusa, solo cambia el arte.

`LEVELS`/`EVENTS`-agnóstico: `isRamenLevel()` sigue el mismo patrón que `isHellLevel()`/`isKitchenLevel()`/`isOceanLevel()`, y `drawBigSpike()`/`drawCeilSpike()`/`drawPlatform()`/`drawEnemy()` reciben un cuarto parámetro `isRamen` igual que ya recibían `isHell`/`isOcean`.

A diferencia de los otros dos Eventos, este es explícitamente "Nivel Difícil": reutiliza tramos completos ya validados de los Niveles 7 y 10 (misma `baseScrollSpeed` 330) — incluye pincho de techo y plataforma elevada — concatenados con un margen llano fijo de 420px entre tramos (por encima de los mínimos ya documentados de 220/300/350px), siguiendo el mismo método de "heredar la seguridad de la plantilla" que ya se usó para los Niveles 11-13. Es más largo (20782px, 70 obstáculos) que los otros dos Eventos (~10500px cada uno).

Al superarlo se desbloquea **Ramen**: un cuenco de ramen humeante (`drawRamenSprite()`, con fideos, narutomaki, nori y palillos, y carita en el caldo), con la misma velocidad que el nigiri de pez mantequilla (+20%) y salto normal. Su habilidad, a petición explícita del usuario, es única en el roster y no está ligada a `D` como las demás: puede **eliminar hasta 3 obstáculos por partida** (tecla `S`, o el botón flotante 🍜 sobre el canvas para jugadores táctiles) — cada uso borra de `level.obstacles` el primer obstáculo que el jugador todavía no haya superado (`obstacleRightExtent(o) > playerWorldX`), con lo que deja de dibujarse, de colisionar y de contar como hueco/plataforma para el suelo sin tocar el resto del motor de física. El cupo (`removeCharges`) se guarda en `currentLevel` igual que `livesLeft` del Palillo, se muestra en el HUD ("· Quitar: N") y en la insignia del botón, y se resetea a 3 en cada `beginRun()`.

### Evento "Tormenta de arroz": tema visual "arroz"

A petición del usuario, este Evento estrena un quinto paisaje (`theme: 'rice'`): un paisaje de arroz con cielo degradado blanco-crema en vez de celeste, montículos de arroz al fondo (mismo esquema de parallax lento que el monte Fuji/las algas del océano), vapor de arroz recién hecho subiendo (reutiliza `drawCloud`) y semillas de sésamo flotando en vez de nubes/burbujas; suelo de grano de arroz sobre una base blanca en vez de tablas de madera. Los tres ingredientes que pidió el usuario (cebolla, crunch, arroz) se reparten entre los obstáculos de siempre: pincho → crunch (trozos crujientes de cebolla/ajo frito), wasabi grande → racimo de cebolla, erizo/uni → grumo de arroz apelmazado con banda de nori (`drawRiceEnemy()`, mismo `enemyBox()` que el resto de enemigos); el charco de soja se reskinea como charco de salsa teriyaki (a juego con el personaje que se desbloquea) en vez de forzar una verdura donde no encaja, siguiendo el mismo criterio ya usado en "infierno"/"océano"/"ramen" (el hueco es un peligro ambiental, no un ingrediente). Dificultad "intermedia" (como "La ira del wasabi"/"La carrera de la soja": sin pincho de techo ni plataforma), ya que el usuario no pidió explícitamente que fuera difícil como el Ramen.

Al superarlo se desbloquea **Arroz con pollo teriyaki** (`drawTeriyakiRiceSprite()`: un plato de arroz blanco con trozos de pollo teriyaki caramelizado, sésamo y cebolleta, y palillos apoyados en el borde). En un principio se implementó como un desbloqueo puramente cosmético, sin habilidad (mismo criterio que la Bola de arroz), pero el usuario pidió después darle un poder: **una rampa de arroz que lo lanza hacia delante** — ver más abajo, junto a la habilidad del Takoyaki, con la que comparte mecánica.

### Evento "Bolas de pulpo": sin tema nuevo

A petición del usuario, este Evento usa el paisaje base del restaurante (sol, monte Fuji, nubes, suelo de tablas de madera) sin ningún campo `theme`, porque "tablas de madera" ya es el paisaje por defecto del juego; los obstáculos tampoco se reskinean (siguen en verde/marrón de wasabi y soja de siempre), igual que en "La ira del wasabi"/"La carrera de la soja". Dificultad "intermedia", con una disposición de obstáculos propia (no es una copia de ningún otro Evento).

Al superarlo se desbloquea **Bolas de pulpo** (`drawTakoyakiSprite()`: una bola de takoyaki en un palillo, con salsa y mayonesa en zigzag y copos de aonori/katsuobushi), con velocidad y salto normales.

### Las habilidades de "saltar hacia delante": Takoyaki (teletransporte) y Arroz con pollo teriyaki (rampa de arroz)

La primera versión del Takoyaki disparaba una croqueta que destruía el próximo obstáculo (reutilizando la misma `removeNextObstacleAhead()` del Ramen). El usuario corrigió esto explícitamente: "donde apuntas... no tienen que disparar nada para deshacer los objetos. Lo que tiene que hacer el que apunta es transportarse." Es decir, la habilidad no es ofensiva (destruir un obstáculo concreto) sino de movimiento (saltar hacia delante en el nivel, sea lo que sea que haya en el camino).

- **Bolas de pulpo — `teleportTakoyaki()`**: mantener pulsada `D` activa el modo puntería (`this.keyDHeld`) y muestra un retículo (`drawAimReticle()`) que sigue la posición del ratón sobre el canvas (`this.mouseX`/`this.mouseY`, actualizados por un listener `mousemove` que convierte coordenadas CSS a las 900×380 lógicas). Soltar `D` teletransporta al jugador sumando a `level.worldX` la distancia horizontal entre el retículo y la posición fija del jugador en pantalla (`this.mouseX - PLAYER_SCREEN_X`) — cuanto más lejos a la derecha se apunte, más lejos se salta. Como la cámara mantiene siempre al jugador en `PLAYER_SCREEN_X`, este salto de `worldX` no necesita borrar ningún obstáculo del array ni tratarlo de forma especial: la posición del jugador simplemente ya no coincide con la de los obstáculos que quedaron atrás, así que dejan de poder colisionar en los frames siguientes (los mismos `isOverGap()`/`platformAt()`/`checkObstacleCollisions()` de siempre, sin ningún caso especial). El teletransporte se anima con un anillo que se expande y desaparece en la posición fija del jugador (`drawTeleportFlash()`), ya que el propio personaje nunca se mueve en pantalla. **Hasta 3 veces por partida** (`teleportCharges`) — el usuario corrigió una primera versión sin límite ("ahí puedes todo el rato") pidiendo que fuera de 3 usos, igual que el Ramen — con solo 400ms de margen entre usos (`this.nextTeleportAvailableAt`) para que se note el efecto. **Sin protección extra**: si el punto de llegada cae sobre un obstáculo, el jugador muere en el siguiente chequeo de colisiones exactamente igual que cualquier otro personaje — a petición explícita del usuario, esta es la desventaja oficial de las Bolas de pulpo, documentada en su propia fila de stats ("Debilidad").
- **Arroz con pollo teriyaki — `placeRiceRamp()`**: a diferencia del Takoyaki, esta habilidad no mueve al jugador directamente ni se apunta con el ratón — a petición del usuario, "crea un nuevo obstáculo que va a ser una rampa para que haga un salto muy grande". Pulsar `D` (una sola vez, no hay que mantenerla) inserta un obstáculo nuevo de tipo `'ramp'` en `level.obstacles`, a `RAMP_PLACE_OFFSET` (260px) por delante de la posición actual del jugador, y reordena el array por `x`. La rampa (`drawRampObstacle()`) no es una pared ni mata: en `update()`, si el jugador está en el suelo y su caja se solapa con una rampa, esta se borra del array y se le da un impulso vertical mucho mayor que un salto normal (`RAMP_LAUNCH_VELOCITY = -1500`, frente a `JUMP_VELOCITY = -900`) — "un salto muy grande" automático, sin que haga falta pulsar el salto. Se acompaña de un destello de granos de arroz despedidos (`drawLaunchFlash()`, reutilizado) y el sonido `audio.launch()`. **Hasta 3 veces por partida** (`rampCharges`), tal como pidió el usuario ("también solamente lo puedo hacer tres veces").
- Ambas habilidades comparten el mismo cupo limitado y el mismo patrón de reinicio: `teleportCharges`/`rampCharges` (junto con `removeCharges` del Ramen) se guardan en `currentLevel`, se muestran en el HUD ("· Teletransportes: N" / "· Rampas: N"), y se restablecen por completo tanto al empezar la partida (`beginRun()`) como al morir (`resetPlayerToStart()`) — igual que las vidas del Palillo.

## 6. Persistencia (`localStorage`)

- `sushi_unlocked_foods` — array de ids de comidas desbloqueadas.
- `sushi_selected_food` — id de la comida equipada actualmente (se usa en cualquier nivel que se juegue).
- `sushi_completed_levels` — array de ids de niveles de campaña completados.
- `sushi_completed_events` — array de ids de eventos completados (no desbloquea nada, solo marca ✅ en la lista de Eventos).
- `sushi_best_time_<levelId>` / `sushi_best_attempts_<levelId>` — mejores marcas por nivel o evento.
- `sushi_soundEnabled`, `sushi_soundVolume`, `sushi_hapticEnabled` — preferencias.

## 7. Pendiente de definir (a la espera de más detalles del usuario)

- Nombre/lore oficial del enemigo (visualmente ya es un erizo de mar/uni con púas, pero no tiene identidad narrativa dentro del mundo del juego).
- Sistema de puntuación (de momento solo se mide tiempo e intentos, sin fórmula de puntuación).
- Arte definitivo de los personajes y obstáculos (de momento son formas geométricas simples dibujadas en canvas, sin sprites ilustrados).
- Pantalla de ajustes completa (volumen deslizante, etc. — de momento solo hay un botón de silenciar).
- Número total de niveles y personajes (roster actual: 12 niveles de campaña + 2 eventos, 12 personajes).
- Si tras el Nivel 10 conviene seguir la progresión lineal o abrir el juego a rejugar niveles con distintos personajes como contenido principal.

---

**Última actualización:** 2026-08-18
**Versión del documento:** 0.16 (El Arroz con pollo teriyaki pasa de "sale disparado hacia delante" a crear un obstáculo nuevo, una rampa de arroz que da un salto muy grande al llegar a ella; y tanto esa habilidad como el teletransporte de las Bolas de pulpo pasan de ser ilimitadas a tener un cupo de 3 usos por partida, igual que el Ramen)
