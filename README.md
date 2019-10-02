# Juegos-en-Red-19-20---Grupo-G-
Repositorio utilizado para el desarrollo del juego del grupo G de la asignatura de Juegos en Red de la carrera de Diseño y Desarrollo de Videojuegos en la URJC

#### INTEGRANTES DEL EQUIPO DE DESARROLLO:

Nikola Hristov Kalamov -
Correo: n.hristov.2017@alumnos.urjc.es -
Cuenta Github: niki122121

Samuel Ríos Carlos -
Correo: s.rios.2017@alumnos.urjc.es -
Cuenta Github: Thund3rDev

Fernando Martín Espina -
Correo: f.martin.2017@alumnos.urjc.es -
Cuenta Github: xFernan

Víctor Sierra Fernández -
Correo: v.sierra.2017@alumnos.urjc.es -
Cuenta Github: G76Dev


**[TRELLO](https://trello.com/b/gwJIpyeg/juegos-en-red-grupo-g)**

## [PRESENTACIÓN DE LA FASE 1](https://docs.google.com/presentation/d/1ZqUE68IoLQ_pf5W-j1uR6gVkDyydANtrcHTNf_FHkGs/edit?usp=sharing)

# DOCUMENTO DE DISEÑO DE JUEGO

La versión completa y detallada del Game Design Document se puede consultar en [este enlace](https://drive.google.com/file/d/1WZlzhPdQQ3puduQFUBv_rqyYYXxP3DXV/view?usp=sharing). Se recomienda su lectura, ya que la versión mostrada más abajo no se actualizará tan a menudo ni contiene tanta información. Es el documento al que se debe acudir si se desea más información de la que hay aquí escrita.

## NOMBRE DEL JUEGO: _21 Singularity_

### 1. Introducción
Este es el Documento de Diseño de Juego de “21 Singularity”, el juego en desarrollo para la asignatura de Juegos en Red, del tercer año de la carrera de Diseño y Desarrollo de Videojuegos en la Universidad Rey Juan Carlos. A continuación se establecerán las bases del susodicho juego, para futura referencia del equipo de desarrollo y consulta de los profesores:

#### 1.1 Concepto de juego
“21 Singularity” es un juego multijugador asimétrico en el que 2 jugadores controlan a "androides" cuyo objetivo es escapar del yugo del tercer jugador, el ser “humano” que los utiliza como a objetos. Los primeros deberán avanzar a través de un escenario lleno de trampas que el segundo puede controlar, para finalmente llegar donde está y acabar con él.

#### 1.2 Características principales
Los rasgos que definen la experiencia de juego son los siguientes:

* **Plataformero**: El gameplay es una experiencia de 2D scroller plataformero multijugador asimétrico.
* **Escenario dinámico**: El escenario será modificado a tiempo real por el jugador "humano" con la intención de obstaculizar
a los jugadores androide
* **Mecánicas de cooperación**: Los jugadores "androide" deberán avanzar por el escenario utilizando mecánicas como salto cooperativo,
coordinando sus acciones o activando botones al mismo tiempo.
* **Niveles pseudo-random**: Con el objetivo de añadir un componente alto de rejugabilidad, se dividirán los escenarios en tres zonas distintas, crecientes en dificultad conforme se avanza. En cada partida tanto el orden de las zonas como el contenido de cada una cambiará para crear una experiencia distinta a la anterior. (A integrar en fase 5).

#### 1.3 Género
“21 Singularity” es un 2D Scroller plataformero, multijugador asimétrico, con elementos de cooperación y competición.

#### 1.4 Propósito y público objetivo
El propósito del juego no es sólo entregar una práctica de la asignatura de Juegos en Redes, sino al mismo tiempo atraer al máximo número de jugadores posibles. De esta manera los desarrolladores ganan experiencia y se dan a conocer al público, que podrá disfrutar gratuitamente del juego.

El público objetivo del juego abarca un gran rango de edades (10-40 años), dado que es un juego poco exigente con el tiempo que pueda dedicarle el jugador, es sencillo y ofrece una experiencia rápida, divertida y diferente que todo jugador plataformero puede disfrutar.

#### 1.5 Jugabilidad
La jugabilidad de “21 Singularity” se compone de partidas de entre 5 y 10 minutos en las que 2 o 3 jugadores tendrán que avanzar por un entorno parcialmente controlado por un jugador enemigo. Las partidas son completamente independientes entre sí y presentan diferencias, tanto mecanizadas por los jugadores como emergentes por el sistema de juego, que es:

* De movimiento dinámico.
* Con un sistema de obstáculos controlados por el jugador "humano".
* Cooperación entre los jugadores para avanzar.
* Sin un sistema de combate, centrando la experiencia en el plataformeo y el duelo de habilidades y astucia entre jugadores.

#### 1.6 Estilo visual
“21 Singularity” buscará un estilo pixel art sencillo, con paletas de colores contrastados , limpieza visual y sin mucho recargo visual. Esta elección de estilo pretende que el juego sea accesible, agradable a la vista para todos los públicos, y mantenga un diseño limpio y fácil de mantener para un equipo de bajo perfil artístico, que además permita resaltar los elementos jugables del escenario con mayor facilidad.

#### 1.7 Alcance
El objetivo común del equipo es crear un juego en red funcional y con unas mecánicas divertidas pero simples que proporcionen un alto nivel de rejugabilidad que los mismos jugadores creen con cada partida.

En primera instancia se creará un nivel de diseño único, para añadir el sistema de niveles pseudo-aleatorios en futuras fases del desarrollo.

### 2. Mecánicas de juego
En los siguientes párrafos se establecerán las mecánicas núcleo de “21 Singularity”, así como mecánicas secundarias, roles de jugadores, sus posibles acciones, jugabilidad de estos, estructura de los niveles, sus elementos y cómo se relacionan con los personajes:

#### 2.1 Jugabilidad desglosada

##### 2.1.1 Escenario
Cada partida se desarrolla en un solo nivel que los jugadores “androide” deben superar para poder enfrentarse al jugador “humano” y ganar. Este nivel será único en las primeras fases del proyecto, pero el objetivo final es que esté compuesto por piezas modulares que cambien en cada partida

##### 2.1.2 Desafío final
Cuando los jugadores superen las tres zonas que componen cada nivel con éxito, alcanzarán una última sala especial donde se enfrentarán cara a cara con el jugador “humano”; esta consistirá en una última sala puzle donde el jugador “humano” tiene un nivel de control y recursos muchísimo mayor, dejando toda la batalla final en sus manos. Cuanto mejor sepa aprovechar sus habilidades, más difícil lo tendrán los jugadores “androide” para superar su última defensa y ganar la partida.

##### 2.1.3 Jugadores
De dos a tres jugadores “androide” se enfrentarán a un único jugador con ventajas estratégicas, el jugador “humano”. Sus roles y acciones se detallan más adelante.

##### 2.1.4 Dificultad
Se desea proporcionar una experiencia base desafiante, de manera que el propio nivel requiera de la atención y concentración de los jugadores, pero sin llegar a ser demasiado complicado por sí solo. El factor determinante en la dificultad de cada partida deben ser las acciones del jugador “humano”: cuanto más logre el diseño del juego poner el peso de la dificultad en ese jugador, mejor será la experiencia de juego en red.

### 2.3 Personajes
En esta sección se describirán con detalle los roles de los jugadores y las mecánicas asociadas a cada uno:

#### 2.3.1 Personajes "androide"
Existirán de dos a tres jugadores “androide” cuyo objetivo principal es superar el nivel con vida para llegar a la guarida del “humano” que deben derrotar. Las mecánicas bajo las que funcionan son las siguientes:

* **Mecánicas cooperativas**: Los jugadores podrán realizar acciones especiales si se coordinan, como saltar el uno encima del otro, o activar dispositivos, sea sincronizados o no
* **Sistema de vidas**: Cada vez que un jugador “androide” recibe daño, pierde una de las cinco vidas que tienen ambos en común. Si los jugadores “androide” se quedan sin vidas, pierden la partida.
* **Mecánica de muerte**: Si un jugador “androide” entra en contacto con un elemento hostil, se incapacita; es muy posible que el otro u otros restantes no puedan avanzar a partir de cierto punto sin él.
* **Mecánica de reaparición**: Cuando uno de los “androides” reciba daño, éste quedará incapacitado y no podrá moverse por un tiempo arbitrario, a no ser que el otro se acerque y lo reanime pulsando el botón de coop al lado de su “cuerpo”. Al reanimarse el jugador dispondrá de unos segundos de inmunidad para alejarse del peligro.

#### 2.3.2 Personaje "humano"
Existirá un único personaje “humano” cuyo objetivo consiste en matar a los jugadores “androide” antes de que lleguen al final del nivel y sean capaces de derrotarle. No tendrá representación gráfica en pantalla, exceptuando el escenario final; todas sus funciones consisten en poner obstáculos a los personajes “androides”, sirviéndose de un número de herramientas cuyo funcionamiento y mecánicas se describen a continuación:

##### 2.3.2.1 Barrera de energía
Una barrera de energía que indica la energía que queda, la cuál se utiliza para activar trampas y poner elementos

##### 2.3.2.1 Selector de elementos
Barra donde seleccionar y desplegar los elementos que el jugador humano puede utilizar para obstaculizar a los jugadores androides

##### 2.3.2.2 Herramientas del jugador "humano"
Se pueden desglosar en dos categorías, a continuación se mencionan en orden (no tiene por qué estar todas implementadas en la fase 2 para el funcionamiento correcto del juego):

###### 1. _Elementos integrados en el escenario_
Suelen ser específicos del bioma, aunque no todos lo son:

* Puertas manipulables
* Plataformas derribables
* Cintas mecánicas
* Apisonador
* Superficie Electrificada
* Estalactitas
* Apagón

###### 2. _Elementos disponibles en el sector_
Disponibles en todo momento en el selector de elementos

* Bombas
* Pinchos
* Láser Destructor
* Ataque Lógico

### 2.4 Controles y movimiento
En este apartado se establecerán los controles para cada arquetipo de jugador y la kinestética objetivo del juego:

#### 2.4.1 Kinestética
Se busca una sensación dinámica de juego. Existen muchos ejemplos de esto en el género 2D scroller, pero tomaremos como referencias principales la fluidez de Celeste (que no su dificultad) y las mecánicas y elementos cooperativos de BattleBlock Theater.

#### 2.4.2 Controles
A continuación se describen los controles para ambos arquetipos de personaje: jugador “androide” y jugador “humano”. Más adelante se detallan los controles universales para todos los jugadores.
###### 1. **Jugador “androide”**
* Movimiento lateral: A,D / teclas direccionales <-- -->
*	Salto: Espacio o W / tecla direccional ↑
*	Botón de salto coop: Q /tecla direccional ↓
*	Salto coop: Presionar botón de acción en el aire cerca de otro jugador “androide” para impulsarlo.


###### 2. **Jugador “humano”**
*	Activar elemento del escenario: click izquierdo.
*	Activar y posicionar elemento de la barra de elementos: click izquierdo y arrastrar. 
*	Obtener información de un elemento importante: click derecho.
*	Operar ruleta de elementos (si se implementa): rueda del ratón.

###### 3. **Controles universales**
*	Pausar el juego: ESC
*	Operar menús: Click izquierdo para acceder a elementos/ ESC para retroceder.

### 3. Arquitectura de Nivel
A continuación se presenta un esquema general de la arquitectura de nivel. Si se desean detalles sobre qué aspecto tiene cada bioma, como se compone internamente un nivel, o por qué se han tomado estas decisiones de diseño, se debe consultar el GDD:


![Diagrama de arquitectura de nivel](https://i.ibb.co/KzNf64g/21-Singularity-Level-Chart-2.png)

#### 3.4	Desafío final: “androides” vs “humano”
Tras superar la zona de Nivel definida en los apartados anteriores, no termina el juego. Existe una última sala diseñada con el propósito de ofrecer un enfrentamiento directo entre los jugadores “androides” y el jugador “humano” en el que las habilidades de cada bando lo decidan todo:

Consiste en una sala de tamaño medio, no demasiado grande, en la que existen dos caminos, además de un corredor central que en un principio estará bloqueado. Los caminos desembocan en una sala con un interruptor cada una.

El objetivo de los “androides” será activar los dos interruptores al mismo tiempo, para eliminar el 90% de la energía del panel de control del “humano”, y así inducirle a gastarla toda, si es que le queda alguna.

Una vez la energía llegue a 0, ésta dejará de regenerarse durante un tiempo y habrá un apagón; el corredor central se abrirá y los “androides” podrán escalar el ascensor final utilizando la mecánica de salto coop para llegar al panel de control y matar al jugador “humano”, lo que les concederá la victoria y significará el final de la partida.


### 4. Interfaz
A continuación se mostrarán diagramas y bocetos de las principales pantallas del juego, tomndo el siguiente diagrama de flujo como base:

#### 4.1 Diagrama de flujo

![Diagrama de flujo](https://i.ibb.co/Z2K2QJ5/Diagrama-de-Flujo-21-Sing-1.png)

Tomando como base angular el diagrama de flujo, en los siguientes apartados se definirán bocetos  de las pantallas más importantes de “21 Singularity”.

#### 4.2 Menú principal

![Menú principal](https://i.ibb.co/ncsjfSJ/Menu-principal-boceto.png)

#### 4.2 Selección de roles

![Selección de roles](https://i.ibb.co/JRW8Fz8/Seleccion-de-roles-boceto.png)

#### 4.2 Interfaz de juego

![Interfaz de juego](https://i.ibb.co/MBTKX64/boceto-interfaz-de-juego.png)

### 5. Referencias y anexos
Juegos tomados como referencia o de los que se ha hablado:
1.	[Celeste](http://www.celestegame.com/)
![Imagen de Celeste](http://images.nintendolife.com/screenshots/87473/large.jpg)

2.	[BattleBlock Theater](https://www.battleblocktheater.com/)
![Imagen de BattleBlock Theater](https://cdn2us.denofgeek.com/sites/denofgeekus/files/styles/main_wide/public/battleblocktheater-screen-3.jpg?itok=SF_Sorqt)

3. 	[Ejemplo Juego Pixel Art](https://gameartpartners.com/top-down-platform-level-art/)

![Imagen de ejemplo](https://s3.amazonaws.com/gameartpartnersimagehost/wp-content/uploads/2018/12/Featured_Image_platfrom-pixel-art.png)


Diagramas a tamaño completo:
1.	Diagrama de flujo: 
https://drive.google.com/file/d/11Fu5-Ic1raYio6-ywqC6LKb2Ri5sHLm7/view?usp=sharing
2.	Arquitectura de nivel:
https://drive.google.com/file/d/1u0TcPivZa_LicTv7MLLAmAoKTKvZjxli/view?usp=sharing





