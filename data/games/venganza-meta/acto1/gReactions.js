//Section 1a: gameReaction (lib overwrite)
//Section 1a: gameReaction (lib overwrite)
//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute
//Section 3: gameItems
//Section 4: game functions

// **********************************************
//Section 1: gameReaction
// **********************************************

/*
Se usa un atributo genérico en cada item que lo necesite: primitives.IT_GetAttPropValue (item, "generalState", "state")

hab_alberto.generalState.state: 0: intro; 1:
mesa_noche.generalState.state: 0: ini
salón_alberto.generalState.state: 0: ini

*/


let primitives, libReactions

let reactions = []
let attributes = []
let items = []


let usr = {}

/* Expose stuff */

module.exports = exports = {
	dependsOn:dependsOn,
	processAction:processAction,
	itemMethod:itemMethod,
	actionIsEnabled:actionIsEnabled,
	turn:turn
}

function dependsOn (primitives, libReactions, reactionList) {
	this.primitives = primitives
	this.libReactions = libReactions
	this.reactionList = reactionList


	this.reactions = []
	initReactions(this.reactions, this.primitives)

	this.attributes = []
	initAttributes(this.attributes, this.primitives)

	this.items = []
	initItems(this.items, this.primitives)

	usr.primitives = this.primitives

}

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

// external interface
function processAction (action) {

	let actionIndex = arrayObjectIndexOf (this.reactions, "id", action.actionId)
	if (actionIndex < 0 ) {
		// this.reactionList.push ({type:"rt_msg", txt: 'Error: missing actionId on gReactions: ' + action.actionId} )
		return undefined
	}

	// to-do: verify again  if action is enabled

	console.log ("game action: " +  JSON.stringify (action))

	return this.reactions[actionIndex].reaction (action)

}

function itemMethod (itemId, methodName, params) {

	var localIndex = arrayObjectIndexOf(this.items, "id", itemId)

	return this.items[localIndex][methodName](params)

}

function turn (indexItem) {
}


// external interface
function actionIsEnabled (actionId, item1, item2) {

	if (actionId == undefined) return undefined

	var reactionIndex = arrayObjectIndexOf(this.reactions, "id", actionId)

	if (this.reactions[reactionIndex] == undefined) return undefined
	if (this.reactions[reactionIndex].enabled == undefined) return undefined

	return this.reactions[reactionIndex].enabled(item1, item2)

}


// ============================

let initReactions =  function  (reactions, primitives) {

	// saltar, de lib, deshabilitado
	reactions.push ({

		id: 'jump',

		enabled: function (indexItem, indexItem2) {
			return false
		}

	});

	// cantar, de lib, deshabilitado
	reactions.push ({

		id: 'sing',

		enabled: function (indexItem, indexItem2) {
			return false
		}

	});

	// wait, de lib, deshabilitado
	reactions.push ({

		id: 'wait',

		enabled: function (indexItem, indexItem2) {
			return false
		}

	});

	reactions.push ({
		id: 'ex',

		reaction: function (par_c) {

			if (par_c.item1Id == "mesa_noche") {

				primitives.GD_CreateMsg ("es", "mesa_noche_desc", "La mesa de noche. Cuando viene Matilda, sueles guardar en su cajón la foto de tu boda porque te avergüenza tanto tenerla a la vista con ella, como deshacerte de la foto, que representa mucho para ti.");
				primitives.CA_ShowMsg ("mesa_noche_desc");

				if (primitives.IT_GetAttPropValue (par_c.item1, "generalState", "state") == "0") {
					primitives.GD_CreateMsg ("es", "mesa_noche_con_foto", "En la mesa está la foto de tu boda.");
					primitives.CA_ShowMsg ("mesa_noche_con_foto");
					primitives.IT_SetLoc(primitives.IT_X("foto_boda"), primitives.PC_GetCurrentLoc());
					primitives.IT_SetAttPropValue (par_c.item1, "generalState", "state", 1)
				}

				primitives.CA_ShowMsgAsIs ("<br/>");
				return true;
			}

			if (par_c.item1Id == "foto_boda_rota") {

				primitives.GD_CreateMsg ("es", "foto_arde", "Al recoger la foto, un estremecimiento te recorre. Observas atónito como la foto comienza a arder por una de sus esquinas. En ese momento, la puerta de la habitación se abre sola de pan en par y se crea una corriente de aire que apaga la pequeña llama de la foto, y la lanza al salón contiguo.");
				primitives.CA_ShowMsg ("foto_arde");
				primitives.IT_SetLocToLimbo(par_c.item1);
				primitives.IT_SetLoc(primitives.IT_X("foto_quemada"), primitives.IT_X("salón_alberto"));

				return true;
			}

			if (par_c.item1Id == "cristales") {

				primitives.GD_CreateMsg ("es", "tiras_cristales", "Con pulcritud y por seguridad recoges los cristales con cuidado y los tiras a la basuta.");
				primitives.CA_ShowMsg ("tiras_cristales");
				primitives.IT_SetLocToLimbo(par_c.item1);

				return true;
			}

			if (par_c.item1Id == "foto_boda") {

					primitives.GD_CreateMsg ("es", "foto_boda__vuela_contra_pared", "Al ir a coger la foto, observas maravillado cómo sale volando y se estrella contra una pared, rompiéndose el marco y dejando un reguero de cristales rotos así como la foto suelta. Buscas una explicación lógica y te auto-convences de que has sido tú mismo el responsable: un espasmo muscular involuntario o algo así. Las cosas siempre tienen una explicación lógica.<br/>")
					primitives.CA_ShowMsg ("foto_boda__vuela_contra_pared");

					primitives.IT_SetLocToLimbo(par_c.item1);

					primitives.IT_SetLoc(primitives.IT_X("cristales"),  primitives.PC_GetCurrentLoc() );
					primitives.IT_SetLoc(primitives.IT_X("foto_boda_rota"), primitives.PC_GetCurrentLoc() );
          return true
			}

		}
	});


	reactions.push ({
		id: 'go',

		reaction: function (par_c) {
			if (par_c.loc == primitives.IT_X("hab_alberto")) {
				if (primitives.IT_GetLoc(primitives.IT_X("foto_quemada")) == primitives.IT_X("limbo")) {
					primitives.GD_CreateMsg ("es", "pomo_eléctrico", "¿Pero qué…? El pomo de la puerta te da como un calambrazo y no puedes abrirla. Qué cosa más ridícula es ésta. &quot;Espero que Matilda no me esté gastando una broma al otro lado&quot;.<br/>")
					primitives.CA_ShowMsg ("pomo_eléctrico");
					return true
				}
			}

			if (par_c.loc == primitives.IT_X("salón_alberto")) {
				if (par_c.target == primitives.IT_X("salón_matilda"))  {
					 if (primitives.IT_GetLoc(primitives.IT_X("llaves_matilda")) == primitives.IT_X("limbo")) {
						 primitives.GD_CreateMsg ("es", "salir_sin_llaves", "¿Y adónde se supones que quieres ir?<br/>")
						 primitives.CA_ShowMsg ("salir_sin_llaves");
						 return true
					 } else {
						 primitives.GD_CreateMsg ("es", "salir_con_llaves", "Coges la llave y subes a la cuarta planta. Hoy es sábado por la mañana y ella está trabajando. Se te pasa por la cabeza prepararle un almuerzo romántico para que se encuentre con la mesa preparada al llegar a casa.<br/>")
						 primitives.CA_ShowMsg ("salir_con_llaves");
						 primitives.IT_SetLoc(primitives.IT_X("llaves_matilda"),  primitives.PC_X() );
						 
						// endgame para que pueda empezar el siguiente módulo
						primitives.CA_EndGame("El primer acto se terminó. Guarda la partida para continuar en el segundo acto.", "fin", {test:true});
						
						return false

					 }
				} else { // hab_alberto
					primitives.GD_CreateMsg ("es", "atrás_no", "Atrás, ni para coger impulso.<br/>")
					primitives.CA_ShowMsg ("atrás_no");
					return true

				}

			}

			return false; // se ejecuta reacción por defecto
		}
	});

	reactions.push ({
		id: 'look',

		reaction: function (par_c) {

			if (par_c.loc == primitives.IT_X("hab_alberto")) {

				if (primitives.IT_GetAttPropValue (par_c.loc, "generalState", "state") == "0") {

					primitives.GD_CreateMsg ("es", "intro_cumple", "Hoy se cumple el aniversario de la muerte de Clara, tu mujer. Deberías llevar una triste vida de viudo desconsolado, pero desde que comenzaste a salir con Matilda hace unos meses, has cambiado los pañuelos para llorar por los preservativos para, bueno, para ser usados en vez de guardados en un cajón.<br/>Es un día raro. Has dormido fatal, recordando los cumpleaños pasados en los que siempre le hacías un inesperado regalo a Clara para contentarla y demostrarle tu amor. De alguna manera, tienes la necesidad de hacerle un regalo, pero es una estupidez. Ella no tiene ni nicho donde dejarlo ya que fue incinerada y sus restos deshidratados fueron arrojados al océano.<br/>")

					// bug en el primer mensaje
					primitives.GD_CreateMsg ("en", "intro_cumple", "Today marks the anniversary of the death of Clara, your wife. You should have a sad life as a disconsolate widower, but since you started dating Matilda a few months ago, you changed your handkerchiefs to cry for condoms, well, to be used rather than stored in a drawer. a rare day. You've slept awful, remembering past birthdays in which you always made an unexpected gift to Clare to satisfy her and show her your love. Somehow, you have the need to make a gift, but it's stupid. She has no niche where to leave it since it was cremated and its dehydrated debris was thrown into the ocean. <br/>")


					primitives.CA_ShowMsg ("intro_cumple");

					primitives.GD_CreateMsg ("es", "pulsa_avanzar", "Continuar") // se reutilizará en más sitios
					primitives.GD_CreateMsg ("en", "pulsa_avanzar", "Continue") // se reutilizará en más sitios

					primitives.CA_PressKey ("pulsa_avanzar");

					primitives.IT_SetAttPropValue (par_c.loc, "generalState", "state", 1)

				} 
			}

			if (par_c.loc == primitives.IT_X("salón_alberto")) {

				if (primitives.IT_GetAttPropValue (par_c.loc, "generalState", "state") == "0") {

					primitives.GD_CreateMsg ("es", "llaves_aparecen", "¡Esto sí que es una sorpresa! Al lado de la foto que ha salido volando al salón, caída en el desordenado sofá, ves brillar algo. Descubres escondidas las llaves del piso de Matilda, que perdió hace unos meses y nunca aparecieron. Esto dice mucho de lo poco que limpias. Tú le dejaste la llave de tu piso desde poco después de los primeros revolcones, pero no había habido reciprocidad en eso. Ella es muy celosa de su intimidad.<br/>")

					primitives.CA_ShowMsg ("llaves_aparecen");
					primitives.IT_SetAttPropValue (par_c.loc, "generalState", "state", 1)

					primitives.IT_SetLoc(primitives.IT_X("llaves_matilda"),  primitives.PC_GetCurrentLoc() );

				}

			}

		}

	});


	reactions.push ({
		id: 'take',

		reaction: function (par_c) {

			if (par_c.item1Id == "cristales") {

				primitives.GD_CreateMsg ("es", "tiras_cristales", "Con pulcritud y por seguridad recoges los cristales con cuidado y los tiras a la basura.");
				primitives.CA_ShowMsg ("tiras_cristales");
				primitives.IT_SetLocToLimbo(par_c.item1);

				return true;
			}

			if (par_c.item1Id == "foto_boda") {

					primitives.GD_CreateMsg ("es", "foto_boda__vuela_contra_pared", "Al ir a coger la foto, observas maravillado cómo sale volando y se estrella contra una pared, rompiéndose el marco y dejando un reguero de cristales rotos así como la foto suelta. Buscas una explicación lógica y te auto-convences de que has sido tú mismo el responsable: un espasmo muscular involuntario o algo así. Las cosas siempre tienen una explicación lógica.<br/>")
					primitives.CA_ShowMsg ("foto_boda__vuela_contra_pared");

					primitives.IT_SetLocToLimbo(par_c.item1);

					primitives.IT_SetLoc(primitives.IT_X("cristales"),  primitives.PC_GetCurrentLoc() );
					primitives.IT_SetLoc(primitives.IT_X("foto_boda_rota"), primitives.PC_GetCurrentLoc() );
          return true
			}

		}

	});

}

// to-do: afterDescription , para mostrar imagen de localidad al entrar
/* to-do: uncomment!

export afterDescription = function (target) {

	primitives.CA_ShowImg (primitives.IT_GetId (target) + ".jpg", true);
}
*/


// **********************************************
//Section 2: gameAttribute
// **********************************************

let initAttributes =  function  (attributes, primitives) {

}

// **********************************************
//Section 3: items
/*
available methods for each item:
	desc()
	[precondToGo(dir)] // for "loc" items: to unlock/unlock exits
	turn() // by now, mandatory for "npc" and "pc" items


*/

// **********************************************

let initItems =  function  (items, primitives) {


}
