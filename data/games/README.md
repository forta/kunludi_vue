#Instructions in three languages: EN, ES, EO = english, español, esperanto.

------------------------------------------------------------------------
ENGLISH VERSION
#tresfuentes (EN): a game for LUDI, a MultiLingual Interactive Fiction, built on javascript.
------------------------------------------------------------------------

Here are the specific code for LUDI games

The LUDI client code, needed to play ithe game, is at github.com/forta/ludi_client

Instructions to play the game with LUDI:

1) If not done before, download the zip of the client code (github.com/forta/ludi_client) and extract it.

2) In the directory .\client\data\games download and extract this zip.
(The game files must appear on .\client\data\games\<gamename>\)

3) Add an entry in .\client\data\games.json with:
(see ezample in .\client\data\games_sample.json)

		{
			"name": "<gamename>",
			"type": "0",
			"group": "0"
		}

4) open .\index.html and select this game on the list of available game.

------------------------------------------------------------------------
VERSIÓN EN ESPAÑOL
#<gamename> (ES): un juego para LUDI, Ficción Interactiva Multilingüe, contruida en javascript.
------------------------------------------------------------------------

Aquí está el código específico de los juego LUDI.

El código del cliente LUDI, necesario para ejecutar el juego, está en github.com/forta/ludi_client

Instrucciones par ajugar al juego con LUDI:

1) Si no lo has hecho antes, descarga el zip con el código del cliente (github.com/forta/ludi_client) y descomprímelo.

2) En el directorio .\client\data\games descarga y extrae este zip.
(Los ficheros del juego deberán aparecer en .\client\data\games\<gamename>\)

3) Añade una entra en el fichero  .\client\data\games.json con:
(mira el ejemplo .\client\data\games_sample.json)

		{
			"name": "<gamename>",
			"type": "0",
			"group": "0"
		}

4) Abre .\index.html y selecciona este juego de entre la lista de juegos disponibles.

------------------------------------------------------------------------
ESPERANTA VERSIO
#<gamename> (EO): ludo por LUDI, Multilingva Interreagema Fikcio, konstruita en "javascript".
------------------------------------------------------------------------

Jen la specifa kodo por la LUDI-aj ludoj.

La klienta LUDI-a kodo, nepra por ludi la ludon, etas jen: github.com/forta/ludi_client

Instrukcioj por ludi la ludon per LUDI:

1) Se vi ne faris antaŭe, elŝutu la kodon (github.com/forta/ludi_client) kaj elpaku ĝin.

2) En la dosierujo .\client\data\games elŝutu kaj elpaku ĉi zipa arĥivo.
(La arĥivoj devas aperi en .\client\data\games\<gamename>\)

3) Aldonu la sekvanta tekxto en  .\client\data\games.json:
(vidu ekzemplon .\client\data\games_sample.json)

		{
			"name": "<gamename>",
			"type": "0",
			"group": "0"
		}

4) Malfermu .\index.html kaj elekti ĉi ludo inter la listo el havablaj ludoj.

