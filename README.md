Kunludi: Multilingual and cooperative interactive fiction
---------------------------------------------------------

[Link to the English version.](#en)


El sistema kunludi está siendo desarrollado en javascript tanto en el lado del servidor (con [node.js](https://nodejs.org/)) como del cliente (usando [vue.js v1.0](https://vuejs.org/)).

Se juega desde un navegador web, ya sea contra la versión actualizada en internet (http://www.kunludi.com) o contra un servicio web local (http://localhost:8080), que hay que instalar y lanzar, como indicaremos más adelante.

Para jugar directamente el juego "Mi Querida Hermana" presentado a la ["Más allá de la Comp"](wiki.caad.es/Más_allá_de_la_Comp): http://www.kunludi.com/#!/ludi/games/miqueridahermana

Instrucciones para instalar y lanzar el servicio web local de kunludi.
----------------------------------------------------------------------

Paso previo para poder jugar a los juegos de kunludi localmente: instalar node.js (https://nodejs.org/en/)
El juego ha sido probado con node.js v.4.4.2

Descargar el código fuente de kunludi localmente desde https://github.com/forta/kunludi_vue (por ejemplo, en c:\juegos\kunludi). Y luego:

1) Instalar los paquetes requeridos por el juego: ejecutar desde línea de comandos, en el directorio anterior
``` bash
npm install
```
(en el caso de windows, la consola de comandos debe ser ejecutada con permisos de administrador)

2) Para lanzar el servicio web local ejecutar *en modo de depuración*:
``` bash
npm run dev (o bien: "node build/dev-server.js")
```
(En algunos linux es "nodejs" en vez de "node").

En *modo producción*, se ejecutaría:
``` bash
node build/build.js
```

3) Para jugar localmente: http://localhost:8080

4) Para ir directamente a un juego hay que usar su nombre interno. Por ejemplo para el juego "Mi Querida Hermana": http://localhost/#!/ludi/games/miqueridahermana

Instrucciones para instalar juegos adicionales a los que vienen en el paquete de github de kunludi.
---------------------------------------------------------------------------------------------------

El fichero **./kunludi/data/games.json** indica a kunludi qué juegos están disponibles.

Los juegos "texel" y "las tres fuentes" no vienen en el paquete del código de kunludi, pero sí están indicados en el games.json.

Para cargar a estos dos juegos, hay que descomprimir sus fuentes en  en **./kunludi/data/games/**:
- Texel: https://github.com/forta/kunludiGame_texel -> ./kunludi/data/games/texel
- Las tres fuentes: https://github.com/forta/kunludiGame_tresfuentes -> ./kunludi/data/games/tresfuentes

Igualmente, si el usuario desea desarrollar su propio juego, sólo tiene que añadir una entrada en el fichero games.json y crear el directorio asociado.

Composición de un juego kunludi.
--------------------------------

Cada juego kunludi consta de:
- fichero **about.json**: contiene el título y los créditos del juego en cada uno de los idiomas en los que está disponible.
- fichero **world.json**: definición del munco del juego: items (localidades, objetos, PNJs y PJs), y definición de atributos, acciones y direcciones extra que no vienen definidos en la librería base.
- fichero **gReactions.js**: programa en javascript con el código del juego
- para cada idioma en el que está definido el juego, se usan dos ficheros adicionales, en **./localization/[idioma]/**:
	- fichero **messages.json**: mensajes del juego
	- fichero **extraMessages.json**: información dependiente del idioma asociada a los items del juego.
- fichero **README.md**: las instrucciones específicas del juego.
- fichero **LICENSE.html**: por defecto, General Commons, pero cada creador de juego puede user los términos que desee.
- directorio **images/** contiene los gráficos específicos del juego
- directorio **audio/** contiene los audios específicos del juego

Los mensajes del juego están en un formato que entiende el GTT (Google Translation Toolkit): para hacer una traducción rápida se pueden traducir con GTT, que también permite colaboración online para traducir el fichero entre varias personas.


Plantilla inicial del programa, usando [vue-cli y webpack](http://vuejs-templates.github.io/webpack/).

### <a name="en"></a>***Read me, in English:***

The kunludi system is being developed in javascript on both the server side (with [node.js] (https://nodejs.org/)) and the client side (using [vue.js v1.0] (https://vuejs.org/)).

It is played from a web browser, either against the updated version on the internet (http://www.kunludi.com) or against a local web service (http: // localhost: 8080), which must be installed and launched, as we will see below.

To play directly the game "Mi Querida Hermana" presented to the Spanish Comp ["Beyond the Comp"](wiki.caad.es/Más_allá_de_la_Comp): http://www.kunludi.com:8080/#!/ludi/games/miqueridahermana

Instructions for installing and launching the local kunludi web service.
-------------------------------------------------- --------------------

Before you can play kunludi games locally: install node.js (https://nodejs.org/en/)
The game has been tested with node.js v.4.4.2

Download the kunludi source code locally from https://github.com/forta/kunludi_vue (for example, in c: \ games \ kunludi). And then:

1) Install packages required by the game: run from command line, in the above directory
``` bash
npm install
```
(In the case of windows, the command console must be executed with administrator permissions)

2) To launch the local web service run * in debug mode *:
``` bash
npm run dev (or: "node build/dev-server.js")
```
(In some linux it is "nodejs" instead of "node").

In * production mode *, it would execute:
``` bash
node build/build.js
```

3) To play locally: http://localhost:8080

4) To go directly to a game, you must use its internal name. By example, for the game "My Dear Sister": http://localhost:8080/#!/ludi/games/miqueridahermana

Instructions for installing additional games not present in the kunludi github package
--------------------------------------------------------------------------------------------

The file **./kunludi/data/games.json ** tells kunludi which games are available.

The games "texel" and "the three sources" are not in the kunludi code package, but they are present in games.json.

To load these two games, unzip their sources in **./kunludi/data/games/**:
- Texel: https://github.com/forta/kunludiGame_texel -> ./kunludi/data/games/texel
- The three sources: https://github.com/forta/kunludiGame_tresfuentes -> ./kunludi/data/games/tresfuentes

Likewise, if the user wants to develop their own game, just add an entry in the games.json file and create the associated directory.

Composition of a kunludi game.
------------------------------

Each kunludi game consists of:
- file ** about.json **: contains the title and credits of the game in each of the languages ​​in which it is available.
- file ** world.json **: munco definition of the game: items (localities, objects, NPCs and PJs), and definition of attributes, actions and extra addresses that are not defined in the base library.
- file ** gReactions.js **: javascript program with game code
- for each language in which the game is defined, two additional files are used, in **. / Localization / [language] / **:
	- file ** messages.json **: game messages
	- file ** extraMessages.json **: additional language-dependent information on game items.
- file ** README.md **: the specific instructions of the game.
- file ** LICENSE.html **: by default, General Commons, but each game creator can user the terms you want.
- directory ** images / ** contains game-specific graphics
- directory ** audio / ** contains the specific audios of the game

The messages of the game are in a format that understands the GTT (Google Translation Toolkit): a quick translation can be done using GTT, which also allows online collaboration to translate the file by several people.

Initial program template, using [vue-cli and webpack] (http://vuejs-templates.github.io/webpack/).
