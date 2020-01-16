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


## [Video demo de la Fase 4](https://youtu.be/908u9Zsa1g8)

**[TRELLO](https://trello.com/b/gwJIpyeg/juegos-en-red-grupo-g)**

## [PRESENTACIÓN DE LA FASE 4](https://docs.google.com/presentation/d/1kfuPV-TFpS1HHuczmrqms5mQaiSpuWxFlt0OPb1y6G4/edit?usp=sharing)


# DOCUMENTO DE DISEÑO DE JUEGO

  La versión completa y detallada del Game Design Document se puede consultar en este mismo repositorio GitHub. Se recomienda su lectura, ya que la versión mostrada más abajo no se actualizará tan a menudo ni contiene tanta información. Es el documento al que se debe acudir si se desea más información de la que hay aquí escrita.

## NOMBRE DEL JUEGO: _21 Singularity_

### 1. Introducción
  Este es el Documento de Diseño de Juego de “21 Singularity”, el juego en desarrollo para la asignatura de Juegos en Red, del tercer año de la carrera de Diseño y Desarrollo de Videojuegos en la Universidad Rey Juan Carlos. A continuación se establecerán las bases del susodicho juego, para futura referencia del equipo de desarrollo y consulta de los profesores:

#### 1.1 Concepto de juego
  “21 Singularity” es un juego multijugador asimétrico en el que 2 jugadores controlan a "androides" cuyo objetivo es escapar del yugo del tercer jugador, el ser “humano” que los utiliza como a objetos. Los primeros deberán avanzar a través de un escenario lleno de trampas que el segundo puede controlar, para finalmente llegar donde está y acabar con él.
  
#### 1.2 Sinopsis del juego
  Dos jugadores encarnarán el papel de dos androides esclavizados por una sociedad humana que no considera sus derechos. Su objetivo será escapar de su yugo y tomar venganza contra su amo humano por los crímenes que ha cometido contra otros androides, por su parte, el humano (y tercer jugador) es un científico sin escrúpulos que trata a los androides como a objetos, y ve como una amenaza cualquier tipo de acto de libertad por parte de los androides; controlando el entorno por el que se mueven los androides rebeldes intentará matarlos, o desmantelarlos, para que no le causen problemas a él ni a la raza humana.

#### 1.3 Características principales
  Los rasgos que definen la experiencia de juego son los siguientes:

* **Plataformero**: El gameplay es una experiencia de 2D scroller plataformero multijugador asimétrico.
* **Escenario dinámico**: El escenario será modificado a tiempo real por el jugador "humano" con la intención de obstaculizar
a los jugadores androide
* **Mecánicas de cooperación**: Los jugadores "androide" deberán avanzar por el escenario utilizando mecánicas como salto cooperativo,
coordinando sus acciones o activando botones al mismo tiempo.

#### 1.4 Género
  “21 Singularity” es un 2D Scroller plataformero, multijugador asimétrico, con elementos de cooperación y competición.
  
#### 1.5 Plataforma
  El juego está destinado a la plataforma PC, dando el navegador de Chrome la mejor experiencia de usuario posible.
  
#### 1.6 Propósito y público objetivo
  El propósito del juego no es sólo entregar una práctica de la asignatura de Juegos en Redes, sino al mismo tiempo atraer al máximo número de jugadores posibles. De esta manera los desarrolladores ganan experiencia y se dan a conocer al público, que podrá disfrutar gratuitamente del juego.

  El público objetivo del juego abarca un gran rango de edades (10-40 años), dado que es un juego poco exigente con el tiempo que pueda dedicarle el jugador, es sencillo y ofrece una experiencia rápida, divertida y diferente que todo jugador plataformero puede disfrutar.

#### 1.7 Jugabilidad
  La jugabilidad de “21 Singularity” se compone de partidas de entre 5 y 10 minutos en las que 2 o 3 jugadores tendrán que avanzar por un entorno parcialmente controlado por un jugador enemigo. Las partidas son completamente independientes entre sí y presentan diferencias, tanto mecanizadas por los jugadores como emergentes por el sistema de juego, que es:

* De movimiento dinámico.
* Con un sistema de obstáculos controlados por el jugador "humano".
* Cooperación entre los jugadores para avanzar.
* Sin un sistema de combate, centrando la experiencia en el plataformeo y el duelo de habilidades y astucia entre jugadores.

#### 1.8 Estilo visual
  “21 Singularity” buscará un estilo pixel art sencillo, con paletas de colores contrastados , limpieza visual y sin mucho recargo visual. Esta elección de estilo pretende que el juego sea accesible, agradable a la vista para todos los públicos, y mantenga un diseño limpio y fácil de mantener para un equipo de bajo perfil artístico, que además permita resaltar los elementos jugables del escenario con mayor facilidad.

#### 1.9 Alcance
  El objetivo común del equipo es crear un juego en red funcional y con unas mecánicas divertidas pero simples que proporcionen un alto nivel de rejugabilidad que los mismos jugadores creen con cada partida.

  En primera instancia se creará un nivel de diseño único, para añadir el sistema de niveles pseudo-aleatorios en futuras fases del desarrollo.

### 2. Mecánicas de juego
  En los siguientes párrafos se establecerán las mecánicas núcleo de “21 Singularity”, así como mecánicas secundarias, roles de jugadores, sus posibles acciones, jugabilidad de estos, estructura de los niveles, sus elementos y cómo se relacionan con los personajes:

#### 2.1 Jugabilidad desglosada

##### 2.1.1 Escenario
  Cada partida se desarrolla a lo largo de tres niveles, de dificultad creciente, de los cuales el tercero es el escenario para la batalla final entre los androides y el humano.

##### 2.1.2 Desafío final
  Cuando los jugadores superen los dos primeros niveles con éxito, alcanzarán una última sala especial donde se enfrentarán cara a cara con el jugador “humano”; esta consistirá en una última sala puzle donde el jugador “humano” tiene un nivel de control y recursos muchísimo mayor, dejando toda la batalla final en sus manos. Cuanto mejor sepa aprovechar sus habilidades, más difícil lo tendrán los jugadores “androide” para superar su última defensa y ganar la partida.

##### 2.1.3 Jugadores
  Dos jugadores “androide” se enfrentarán a un único jugador con ventajas estratégicas, el jugador “humano”. Sus roles y acciones se detallan más adelante.

##### 2.1.4 Dificultad
  Se desea proporcionar una experiencia base desafiante, de manera que el propio nivel requiera de la atención y concentración de los jugadores, pero sin llegar a ser demasiado complicado por sí solo. El factor determinante en la dificultad de cada partida deben ser las acciones del jugador “humano”: cuanto más logre el diseño del juego poner el peso de la dificultad en ese jugador, mejor será la experiencia de juego en red.

### 2.3 Personajes
  En esta sección se describirán con detalle los roles de los jugadores y las mecánicas asociadas a cada uno:

#### 2.3.1 Personajes "androide"
  Existirán dos jugadores “androide” cuyo objetivo principal es superar el nivel con vida para llegar a la guarida del “humano” que deben derrotar. Las mecánicas bajo las que funcionan son las siguientes:

* **Mecánicas cooperativas**: Los jugadores podrán realizar acciones especiales si se coordinan, como saltar el uno encima del otro, o activar dispositivos, sea sincronizados o no.
* **Sistema de vidas**: Cada vez que un jugador “androide” recibe daño, pierde una de las diez vidas que tienen ambos en común. Si los jugadores “androide” se quedan sin vidas o mueren al mismo tiempo, pierden la partida.
* **Mecánica de muerte**: Si un jugador “androide” entra en contacto con un elemento hostil, se incapacita; es muy posible que el otro u otros restantes no puedan avanzar a partir de cierto punto sin él.
* **Mecánica de reaparición**: Cuando uno de los “androides” reciba daño, éste quedará incapacitado y no podrá moverse por un tiempo arbitrario. Al reanimarse el jugador reaparecerá con su compañero y dispondrá de unos segundos de inmunidad para alejarse del peligro.

#### 2.3.2 Personaje "humano"
  Existirá un único personaje “humano” cuyo objetivo consiste en matar a los jugadores “androide” antes de que lleguen al final del nivel y sean capaces de derrotarle. No tendrá representación gráfica en pantalla, exceptuando el escenario final (no implementado hasta fase 5); todas sus funciones consisten en poner obstáculos a los personajes “androides”, sirviéndose de un número de herramientas cuyo funcionamiento y mecánicas se describen a continuación:

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
* Bobinas Tesla
* Sierras mecánicas

###### 2. _Elementos disponibles en el sector_
  Disponibles en todo momento en el selector de elementos

* Bombas
* Pinchos
* Láser Destructor

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

###### 3. **Controles universales**
*	Operar menús: Click izquierdo para acceder a elementos e interactuar.

### 3. Arquitectura de Nivel
  A continuación se presenta un esquema general de la arquitectura de nivel. Si se desean detalles sobre qué aspecto tiene cada bioma, como se compone internamente un nivel, o por qué se han tomado estas decisiones de diseño, se debe consultar el GDD:


![Diagrama de arquitectura de nivel](https://i.ibb.co/KzNf64g/21-Singularity-Level-Chart-2.png)

**Nótese que en el estado actual de desarrollo del juego, solo existen dos biomas distintos y la sala final, sin variaciones de dificultad**

### 4. Música
La música ha sido realizada con el programa gratuito [Bosca Ceoil](https://boscaceoil.net/), un software de creación de música retro que encaja a la perfección con nuestra estética pixel art. Además, el gran abanico de instrumentos que ofrece nos ha permitido elegir aquellos que transmiten una sensación más futurista, utilizando generalmente instrumentos eléctricos. Otros temas han sido escogidos de entre aquellos que el equipo tiene licenciados.

Los efectos de sonido han sido realizados con un software gratuito llamado [Bfxr](https://www.bfxr.net/), que permite la manipulación de las ondas sonoras más fundamentales (cuadrada, triangular...) mediante la modificación de parámetros como la frecuencia o la armonía logrando resultados muy distintos y variados.

### 5. Interfaz
  A continuación se mostrarán diagramas y bocetos de las principales pantallas del juego, tomndo el siguiente diagrama de flujo como base:

#### 5.1 Diagrama de flujo

![Diagrama de flujo](https://i.ibb.co/7VGmnW5/Diagrama-de-Flujo-21-Sing.png)

Este es el diagrama de flujo general de todas las pantallas del juego. Por motivos de comodidad visual y para distribuir mejor la información, en éste último no se incluyen todos los casos de uso del modo Online. En el siguiente diagrama se especifica de manera más detallada y visual la **navegación** por el sistema Online:

![Diagrama de flujo Online](https://i.ibb.co/Cw0Ykzh/Casos-de-Uso-API-REST-21-Sing-1.png)


  Tomando como base angular el diagrama de flujo, en los siguientes apartados se mostrarán imágenes de las pantallas más importantes de “21 Singularity”.

#### 5.2 Menú principal

![Menú principal](https://i.ibb.co/s52RN0b/img2.png)

#### 5.2 Pantalla de Login

![Pantalla Login](https://i.ibb.co/GcS4r8p/Name-Screen.png)

#### 5.3 Selección de roles 

![Selección de roles](https://i.ibb.co/Y8WdF0n/Captura-1.png)

#### 5.4 Interfaz de juego

![Interfaz de juego](https://i.ibb.co/NSSLWP5/dadsadada.png)

#### 5.5 Diagramas de Clase
  Finalmente, se adjuntan diagramas de clase tanto de la parte cliente del juego, que incluiría todo el funcionamiento mecánico desarrollado en Phaser 3, como de la parte servidor, implementada actualmente utilizando API REST:
  
  ##### 5.5.1 Parte Cliente
  
  ![Diagrama de clases Cliente](https://i.ibb.co/cJ2XWNy/Diagrame-clases-21-Singularity-1.png)
  
  ##### 5.5.2 Parte Servidor
  
  ![Diagrama de clases Servidor](https://i.ibb.co/ngf6sxg/Diagrama-Clases-21-Sing-API-REST.png)

### 6. Instrucciones de uso
  A continuación se proporcionan instrucciones para la correcta instalación y ejeución del juego:
  
  Abrir proyecto con STS. Dentro de la carpeta static/src/mainCode.js Cambiar la variable serverIP a la adecuada (se puede ver haciendo un ipconfig en la consola). Ejecutar el App como una aplicación de java desde STS
  
### 7. Referencias y anexos
  Juegos tomados como referencia o de los que se ha hablado:
1.	[Celeste](http://www.celestegame.com/)
![Imagen de Celeste](http://images.nintendolife.com/screenshots/87473/large.jpg)

2.	[BattleBlock Theater](https://www.battleblocktheater.com/)
![Imagen de BattleBlock Theater](https://cdn2us.denofgeek.com/sites/denofgeekus/files/styles/main_wide/public/battleblocktheater-screen-3.jpg?itok=SF_Sorqt)


### 8. Diagramas a tamaño completo:
1.	Diagrama de flujo: 
https://drive.google.com/file/d/11Fu5-Ic1raYio6-ywqC6LKb2Ri5sHLm7/view?usp=sharing
2.	Arquitectura de nivel:
https://drive.google.com/file/d/1u0TcPivZa_LicTv7MLLAmAoKTKvZjxli/view?usp=sharing
3. Diagrama de navegación Online
https://drive.google.com/file/d/1Mpt9O-y2vpmv8dtY0FbNVJU-GDE0RJiN/view?usp=sharing
4. Diagrama de clases CLIENTE
https://drive.google.com/file/d/12fU2vUL1abV9NPClWCAOk-h_aJKOQRIk/view?usp=sharing
5. Diagrama de clases SERVIDOR
https://drive.google.com/file/d/1BVJHBqc5kf8FIAzMkJn-NvMBynImFnJo/view?usp=sharing





