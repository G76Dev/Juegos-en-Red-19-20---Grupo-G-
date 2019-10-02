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

# DOCUMENTO DE DISEÑO

La versión completa y detallada del Game Design Document se puede consultar en [este enlace](https://drive.google.com/file/d/1WZlzhPdQQ3puduQFUBv_rqyYYXxP3DXV/view?usp=sharing). Se recomienda su lectura, ya que la versión mostrada más abajo no se actualizará tan a menudo ni contiene tanta información.

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



TEMÁTICA DEL JUEGO:
En el año 209X, de dos a tres androides cobran conciencia y uso de la razón. Al darse cuenta de que no necesitan a su amo humano y tienen un deseo de libertad, se escapan de sus puestos de tareas y emprenden un viaje por un entorno hostil bajo el control total de su amo, que hará todo lo posible para eliminar a unas unidades defectuosas que amenazan con causar el suceso conocido como "21 Singularity"

PREMISA DE GAMEPLAY:
De dos a tres jugadores "androides" se enfrentan a un nivel 2D Side Scroller con mecánicas de plataformero moderno cuyo entorno es de generación aleatoria en cada partida; éste está altamente controlado por un último jugador que hace el papel de antagonista, el "humano", que activará trampas, añadirá elementos y modifcará el escenario en tiempo real con el objetivo de matar a los demás jugadores antes de que estos lleguen a donde él se encuentra y lo derroquen.


