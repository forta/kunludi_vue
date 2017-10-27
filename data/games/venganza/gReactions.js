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
			primitives.CA_EndGame("Esto se acabó.");

			return true;

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
