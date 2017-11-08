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

diario.generalState.state: 0: hoy; 1:día de autos; 2:done
hab_matilda.generalState.state: 0: ini

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

			if (par_c.item1Id == "diario") {

				if (primitives.IT_GetAttPropValue (par_c.item1, "generalState", "state") == "0") {
					primitives.GD_CreateMsg ("es", "ex_diario_0", "Lees con horror la última entrada en su diario:<br/>&quot;¡Pero qué demonios! Con lo que me ha costado que Alberto coma de mi mano después de estar consolándolo meses después de enviudar. Y con lo que me costó conseguir que “enviudara”, arriesgándome a acabar en la cárcel. Con todo esto, con el cumplimiento del primer año desde que por fin Clara pasara con mi ayuda al otro mundo, él vuelve ahora a pensar en ella aunque intente ocultarlo. Pero nada, ese día pasará y volverá a ser todo mío de nuevo y para siempre.&quot;<br/>Te tiemblan las piernas, no te crees lo que estás leyendo. Notas vibrar tu anillo de casado, y notas la presencia de Clara, aún sin verla.")
					primitives.CA_ShowMsg ("ex_diario_0");
					primitives.IT_SetAttPropValue (par_c.item1, "generalState", "state", 1)
				} else if (primitives.IT_GetAttPropValue (par_c.item1, "generalState", "state") == "1") {
						primitives.GD_CreateMsg ("es", "ex_diario_1", "Sigues leyendo, vas a la fecha del día de su muerte:<br/>&quot;¡Qué mirada más tonta puso cuando estábamos en el baño del restaurante y le dije que la acababa de envenenar y le quedaban cuatro latidos de corazón. La muy boba se desplomó y se me quedó mirando mientras yo gritaba, lloraba y pedía desconsoladamente ayuda. Guardaré por siempre esa barra de labios contaminada que le presté como un premio a mi audacia. Pronto ventilaré a Luis. Alberto por fin será mío, y yo seré la amiga sobre la que llorará y a la que se agarrará, ¡y mucho, espero!&quot;");
						primitives.CA_ShowMsg ("ex_diario_1");
						primitives.IT_SetAttPropValue (par_c.item1, "generalState", "state", 2)
				} else {
					primitives.GD_CreateMsg ("es", "ex_diario_2", "Ya no tienes ánimo para seguir leyendo. Lo que tenías que saber, ya lo sabes.");
					primitives.CA_ShowMsg ("ex_diario_2");
				}

					return true
			}

		}
	});

	reactions.push ({
		id: 'put_into',

		enabled: function (indexItem, indexItem2) {
			if (indexItem != primitives.IT_X("frasco")) return false;
			if (indexItem2 != primitives.IT_X("tupperware")) return false;
			return true;
		},

		reaction: function (par_c) {
			primitives.GD_CreateMsg ("es", "fin_juego_1", "No estás seguro al cien por cien de si esto funcionará. ¿Y si se tratara sólo de un estimulante sexual?<br/>Después de aplicarlo, cierras el tupper y te escondes detrás de la cortina del salón. Ella tiene que estar a punto de llegar, pero el tiempo parece haberse detenido y parecen siglos, hasta que oyes cómo se abre la puerta y ella entra.<br/>");
			primitives.CA_ShowMsg ("fin_juego_1");

			primitives.GD_CreateMsg ("es", "pulsa_avanzar", "Continuar") // se reutilizará en más sitios
			primitives.CA_PressKey ("pulsa_avanzar");

			// si has dejado las llaves a la vista
			if (primitives.IT_GetLoc(primitives.IT_X("llaves_matilda")) != primitives.PC_X()) {
				primitives.GD_CreateMsg ("es", "eres_descubierto", "Matilda ve las llaves y se extraña. Hace una ronda detallada por la casa y te descubre. Cuando corre la cortina no se te ocurre otra cosa que decir &quot;sorpresa!&quot; Ella se alegra de verte, y se relaja al ver que el diario está en su sitio. Te invita a comer pero te excusas diciendo que te duele el estómago, pero la acompañas mientras almuerza en el salón.<br/>")
				primitives.CA_ShowMsg ("eres_descubierto");
			} else {
				primitives.GD_CreateMsg ("es", "fin_juego_2", "Ahora va todo muy rápido. Ella se pone cómoda, muy sexy, y se sienta a comer en el salón. De pronto, se detiene y parece mirar hacia ti, pero, no, no es a ti sino a la figura de Clara que aparece entre vosotros dos y dice: &quot;no pongas esa cara de boba, que sólo te quedan cuatro latidos de corazón&quot;. Clara se gira hacia ti, te mira con cariño y desaparece en un círculo de luz que aparece a su lado<br/>");
				primitives.CA_ShowMsg ("fin_juego_2");
			}

			primitives.CA_PressKey ("pulsa_avanzar");

			primitives.GD_CreateMsg ("es", "fin_juego_3", "La cama de la cárcel no es muy incómoda. Tu abogada dice que alegando enajenación mental transitoria debida a la lectura del diario, en pocos meses estarás de nuevo en casa. Tu abogada es muy atractiva y te da todo su apoyo, a veces más del estrictamente profesional. Probablemente quedaréis a cenar cuando salgas de la cárcel, pero quizás no sea buena idea hablarle de los celos post-mortem de Clara.<br/><br/>");
			primitives.CA_ShowMsg ("fin_juego_3");

			// endgame para que pueda empezar el siguiente módulo
			primitives.CA_EndGame("El segundo, y último acto se terminó.", "fin", {test:true});

			return true;

		}

	});

	reactions.push ({
		id: 'look',

		reaction: function (par_c) {


			if (par_c.loc == primitives.IT_X("hab_matilda")) {

				 // si no se ha leído la última página del diario
			  if (primitives.IT_GetAttPropValue (primitives.IT_X("diario"), "generalState", "state") != "2") {
					return false
			  }

				if (primitives.IT_GetAttPropValue (par_c.loc, "generalState", "state") == "0") {

					primitives.GD_CreateMsg ("es", "frasco_aparece", "Buscas con diligencia el arma del delito y no tardas en encontrarla en una cajita en la que aparece junto con un frasquito que pone: Para Alberto, por si alguna vez hiciera falta<br/>")

					primitives.CA_ShowMsg ("frasco_aparece");
					primitives.IT_SetAttPropValue (par_c.loc, "generalState", "state", 1)

					primitives.IT_SetLoc(primitives.IT_X("barra_labios"),  primitives.PC_GetCurrentLoc() );
					primitives.IT_SetLoc(primitives.IT_X("frasco"),  primitives.PC_GetCurrentLoc() );

				}

			}

		}

	});


	reactions.push ({
		id: 'take',

		reaction: function (par_c) {

			if (par_c.item1Id == "diario") {

					primitives.GD_CreateMsg ("es", "diario_quieto_parao", "Mejor no moverlo de sitio para que Matilda no sepa que lo has leído.<br/>")
					primitives.CA_ShowMsg ("diario_quieto_parao");

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
