"use strict";

//Section 1a: gameReaction (lib overwrite)
//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute 
//Section 3: gameItems
//Section 4: internal functions

// **********************************************
//Section 1: gameReaction
// **********************************************

/*

Se usa un atributo genérico en cada item que lo necesite: primitives.IT_GetAttPropValue (item, "generalState", "state") 

estudio.state: 0: primera vez; 1: siguientes
panfleto.state: 0 no leído; 1: leído
salón_comedor.state: 0: primera vez; 1: siguientes
barrotes.state: 0: entrada bloqueada; 1: entrada abierta
cuevita.state: 0: primera vez; 1: siguientes

*/

let reactionList = [];
let primitives, libReactions

let reactions = []
let attributes = [] 
let items = [] 


let usr = {}

export function dependsOn (primitives, libReactions, reactionList) {
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
export function processAction (action) {
	
	let actionIndex = arrayObjectIndexOf (this.reactions, "id", action.actionId)
	if (actionIndex < 0 ) {
		// this.reactionList.push ({type:"rt_msg", txt: 'Error: missing actionId on gReactions: ' + action.actionId} )
		return undefined
	}
		
	// to-do: verify again  if action is enabled

	console.log ("game action: " +  JSON.stringify (action))
	
	return this.reactions[actionIndex].reaction (action)

}

export function itemMethod (itemId, methodName, params) {

	var localIndex = arrayObjectIndexOf(this.items, "id", itemId) 	
	
	return this.items[localIndex][methodName](params)
	
}


// external interface
exports.actionIsEnabled = function  (actionId, item1, item2) {
	
	if (actionId == undefined) return undefined

	var reactionIndex = arrayObjectIndexOf(this.reactions, "id", actionId)
	
	if (this.reactions[reactionIndex] == undefined) return undefined
	if (this.reactions[reactionIndex].enabled == undefined) return undefined

	return this.reactions[reactionIndex].enabled(item1, item2)
	
}


// ============================

let initReactions =  function  (reactions, primitives) {
	
	reactions.push ({ 
		id: 'look',
		
		reaction: function (par_c) {
			
			var currentLoc = primitives.PC_GetCurrentLoc()
			
			if (currentLoc == primitives.IT_X("estudio")) {
				if (primitives.IT_GetAttPropValue (currentLoc, "generalState", "state") == "0") {
					primitives.GD_CreateMsg (1, "sueño", "No puedes respirar, estás encerrado en la cueva de la playa y no puedes escapar. De repente, un corrimiento de arena de la playa entra en la cueva y te cubre hasta la cintura y no puedes moverte. En tus manos tienes el collar de conchas marinas que has hecho para regalárselas a tu querido hermano...<br/>Pero no, no puede ser, estos no son recuerdos tuyos, sólo pueden ser los últimos recuerdos de ella, del día en que...<br/>Despiertas, mojado en sudor.<br/><br/>Te levantas, no crees que vayas a poder reconciliar el sueño. De hecho, temes volver a dormir y volver a vivir esa horrible experiencia.<br/>Tienes la maleta casi preparada para el viaje de vuelta a la vieja casa familiar, en la costa. Sólo te hace falta meter un par de cosas más y podrás emprender ese viaje que llevas retrasando ya quince años.<br/>Has terminado el primer borrador de tu nueva novela y crees que la vieja casa te dará la tranquilidad necesaria para terminarla, lejos del ruido y las obligaciones de la ciudad."); 
					primitives.CA_ShowMsg ("sueño");
					primitives.IT_SetAttPropValue (currentLoc, "generalState", "state", 1)
					
					return true;
				}
			}

		}
		
	});
	
					
	
	reactions.push ({  // acción específica de esta juego, así que debe tener definido enabled() y reaction() acabar con true o falsa explícito.

		id: 'tie', 
		
		enabled: function (indexItem, indexItem2) {
			return false;
		},
		
		reaction: function (par_c) {

			primitives.GD_CreateMsg (1, "atar_1", "¿Para qué atar?<br/>"); 
			primitives.CA_ShowMsg ("atar_1");

			return true;
		}
		
	});

	reactions.push ({ 
		id: 'take', 
		
		reaction: function (par_c) {

			if (par_c.item1Id  == "cuerda_enterrada") {
				primitives.GD_CreateMsg (1, "coges_collar", "Aparece un collar de conchas como el de tu sueño. No puedes evitar llorar mientras lo acaricias. No puedes explicarlo, pero notas a Ana cerca de ti, como si ella estuviera contigo ahora.<br/>"); 
				primitives.CA_ShowMsg ("coges_collar");

				primitives.IT_SetLoc(primitives.IT_X("collar"), primitives.PC_X());
				primitives.IT_SetLocToLimbo (par_c.item1);

				return true;
			}
		}
		
	});
	
	reactions.push ({ 

		id: 'telefonear', 
		
		enabled: function (indexItem, indexItem2) {
			
			if (indexItem == primitives.IT_X("móvil")) return true;
			
			return false;
		},
		
		reaction: function (par_c) {

			primitives.GD_CreateMsg (1, "llamar_a_quien", "¿A quién quieres llamar?<br/>"); 
			primitives.CA_ShowMsg ("llamar_a_quien");
			
			if (typeof par_c.option == 'undefined') { // phase 1: asking dialog
			
				primitives.GD_CreateMsg (1, "llamar_a_telepapeo", "TelePapeo"); 
				primitives.GD_CreateMsg (1, "llamar_a_vecino_estudio", "Freddie"); 
				primitives.GD_CreateMsg (1, "llamar_a_vecino_playa", "Charlie"); 
				primitives.GD_CreateMsg (1, "llamar_a_vecina_playa", "Vicky"); 

				var menu = []
				
				if (primitives.IT_GetAttPropValue (primitives.IT_X("panfleto"), "generalState", "state") != "0") {
					menu.push ({id:"telepapeo", msg:"llamar_a_telepapeo"})
				}
				
				menu.push ({id:"estudio", msg:"llamar_a_vecino_estudio"})
				menu.push ({id:"hippie", msg:"llamar_a_vecino_playa"})
				menu.push ({id:"embarazada", msg:"llamar_a_vecina_playa"})
	
				primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2

				return true;

			} else { // getting answer
				if (par_c.option == 0) {
					primitives.GD_CreateMsg (1, "llamas_a_vecino_estudio", "Llamas a Freddie"); 
					primitives.CA_ShowMsg ("llamas_a_vecino_estudio");
				} else if (par_c.option == 1) {
					primitives.GD_CreateMsg (1, "llamas_a_vecino_playa", "Llamas a Charlie"); 
					primitives.CA_ShowMsg ("llamas_a_vecino_playa");
				} else if (par_c.option == 2) {
					primitives.GD_CreateMsg (1, "llamas_a_vecina_playa", "Llamas a Vicky"); 
					primitives.CA_ShowMsg ("llamas_a_vecina_playa");
				} else {
					primitives.GD_CreateMsg (1, "no_llamas", "Al final no llamas a nadie"); 
					primitives.CA_ShowMsg ("no_llamas");
				}
			}

			return true;
		}
		
	});
	
	reactions.push ({
		id: 'go',
		
		reaction: function (par_c) {
			
			// to-do: no dejar sacar ciertas cosas de la casa (de salón_comedor a delante_casa; o de cocina a camino_playa): ni la maleta, ni el manuscrito
			
			
			
			if (par_c.loc == primitives.IT_X("estudio")) {

				if (primitives.IT_GetLoc(primitives.IT_X("móvil")) != primitives.PC_X()) {
					primitives.GD_CreateMsg (1, "no_te_olvides_móvil", "¿Irte sin el móvil? Eres un poco rarito y no vas a la última... pero no tanto.<br/>");
					primitives.CA_ShowMsg ("no_te_olvides_móvil");
					return true;
				}
			
				if (primitives.IT_GetLoc(primitives.IT_X("maleta")) != primitives.PC_X()) {
					primitives.GD_CreateMsg (1, "no_te_olvides_maleta", "¿Irte de viaje sin  maleta? Eres un poco olvidadizo y despistado, me temo.<br/>");
					primitives.CA_ShowMsg ("no_te_olvides_maleta");
					return true;
				}

				if ( (primitives.IT_GetLoc(primitives.IT_X("planta")) == primitives.PC_X()) ||
					 (primitives.IT_GetLoc(primitives.IT_X("foto")) == primitives.PC_X()) ||
					 (primitives.IT_GetLoc(primitives.IT_X("manuscrito")) == primitives.PC_X()) ||
					 (primitives.IT_GetLoc(primitives.IT_X("libro_magia")) == primitives.PC_X()) ) {
					primitives.GD_CreateMsg (1, "cosas_en_mano", "Te piensas salir con las manos tan llenas. Salvo el móvil, sabes que irías más cómodo si llevas el el resto de cosas en la maleta.<br/>");
					primitives.CA_ShowMsg ("cosas_en_mano");
					return true;
				}
				
				if (primitives.IT_GetLoc(primitives.IT_X("planta")) == primitives.IT_X("maleta")) {
					primitives.GD_CreateMsg (1, "no_te_lleves_planta", "¿Para qué demonios te quieres llevar la planta de viaje?<br/>");
					primitives.CA_ShowMsg ("no_te_lleves_planta");
					return true;
				}

				if (primitives.IT_GetLoc(primitives.IT_X("manuscrito")) != primitives.IT_X("maleta")) {
					primitives.GD_CreateMsg (1, "no_te_olvides_novela", "Se supone que te vas unas semanas a la casa de la playa a terminar tu NO-VE-LA... ¿no crees que te olvidas algo?<br/>");
					primitives.CA_ShowMsg ("no_te_olvides_novela");
					return true;
				}

				if ( (primitives.IT_GetLoc(primitives.IT_X("libro_magia")) != primitives.IT_X("maleta")) ||
				     (primitives.IT_GetLoc(primitives.IT_X("foto")) != primitives.IT_X("maleta")) ) {
					primitives.GD_CreateMsg (1, "te_olvidas_algo", "Igual te has olvidado de coger algo, pero esás ansioso por partir.");
					primitives.CA_ShowMsg ("te_olvidas_algo");
				}

				primitives.GD_CreateMsg (1, "cierras_maleta", "Cierras la maleta y sales del estudio.<br/>");
				primitives.CA_ShowMsg ("cierras_maleta");					

				primitives.GD_CreateMsg (1, "al_salir_del_estudio_1", "El viaje transcurre como en un sueño. Un momento atrás estabas en tu estudio...y ahora, ahí estás delante de la puerta de la casa de la playa. Los trayectos de taxi, el bullicio del aeropuerto, el ronquido del pasajero de al lado... a nada de eso le has prestado demasiada atención. En tu cabeza sólo había una idea 'en un rato volveré a estar allí donde todo ocurrió, después de hace tantos años'. Al supuesto motivo por el que vas, acabar las correcciones de tu última novela, tampoco le has dedicado ni un pensamiento.<br/>");
				primitives.CA_ShowMsg ("al_salir_del_estudio_1");

				primitives.GD_CreateMsg (1, "al_salir_del_estudio_2", "Tú sólo puedes pensar en cómo eran las cosas antes de la muerte de Ana, tu querida hermana gemela, la niña de tus ojos.<br/>Recuerdas en especial lo felices que fuisteis juntos aquel último verano. Pasabais casi más tiempo en la caleta de detrás de la casa que dentro de la misma. Vuestra madre siempre tenía que ir a buscaros cuando empezaba a oscurecer. Esa misma caleta infame donde ocurrió la tragedia.<br/>");
				primitives.CA_ShowMsg ("al_salir_del_estudio_2");
				
			}
			
			if (par_c.target == primitives.IT_X("salón_comedor")) {

				if (primitives.IT_GetAttPropValue (par_c.target, "generalState", "state") == "0") {

					primitives.GD_CreateMsg (1, "primera_vez_salón_comedor", "Está casi igual que hace quince años, si exceptuamos el polvo acumulado. Retiras las sábanas y las sacudes fuera. Ahora sí luce casi como antes.<br/>Entre diversos planfletos bajo la puerta, te llama la atención uno reciente de servicio de comida a domicilio, que no te vendrá mal estos días.<br/>");
					primitives.CA_ShowMsg ("primera_vez_salón_comedor");
					primitives.IT_SetAttPropValue (par_c.target, "generalState", "state", "1")
				}
				
			}
			

			if (par_c.loc == primitives.IT_X("caleta") && (par_c.directionId == "in")) {
				if (primitives.IT_GetAttPropValue (primitives.IT_X("barrotes"), "generalState", "state") == "0") { // bloqueada la entrada
					primitives.GD_CreateMsg (1, "cueva_innaccesible", "Los barrotes te impiden entrar en la cuevita.<br/>");
					primitives.CA_ShowMsg ("cueva_innaccesible");
					return true;
				} 
			}

			if (par_c.target == primitives.IT_X("cuevita")) {

				if (primitives.IT_GetAttPropValue (par_c.target, "generalState", "state") == "0") {
					primitives.GD_CreateMsg (1, "primera_vez_cuevita", "Te cuesta respirar, aquí fue donde ella murió ahogada. Nadie sabe muy bien porqué permaneció tanto tiempo dentro y fue sorprendida por la marea y el corrimiento de tierra y precipitó la area de la pequeña duna dentro de la cueva.<br/>En el suelo puedes ver lo que parece ser una cuerda semienterrada<br/>");
					primitives.CA_ShowMsg ("primera_vez_cuevita");
					primitives.IT_SetAttPropValue (par_c.target, "generalState", "state", "1")
				}
				
			}
			
			return false; // se ejecuta reacción por defecto
		}
		

	});
	
	reactions.push ({
		id: 'ex',
		
		reaction: function (par_c) {
		
			if (par_c.item1Id  == "panfleto") {
				
				if (primitives.IT_GetAttPropValue (par_c.item1, "generalState", "state") == "0") {
					// to-do: si tienes el móvil encima
					primitives.GD_CreateMsg (1, "telepapeo_en_agenda", "Añades el teléfono de la tienda TelePapeo en tu agenda del móvil.<br/>");
					primitives.CA_ShowMsg ("telepapeo_en_agenda");
					primitives.IT_SetAttPropValue (par_c.item1, "generalState", "state",  1);
				}
				
				return false;
				
			}

		
		}
		

	});
		
	reactions.push ({
		id: 'strike',
		
		enabled: function (indexItem, indexItem2) {
			
			if (indexItem == primitives.IT_X("barrotes")) return true;
			
			return false;
		},
		
		reaction: function (par_c) {
		
			if (par_c.item1Id == "barrotes") {

				if (primitives.IT_GetAttPropValue (primitives.IT_X("barrotes"), "generalState", "state") == "0") { // bloqueada la entrada
				
					// comprobar que llevas el atizador
					if (primitives.IT_GetLoc(primitives.IT_X("atizador")) != primitives.PC_X()) {
						primitives.GD_CreateMsg (1, "falta_atizador", "Los barrotes están muy oxidados y se mueven, pero te convences de que con las manos sólo no vas a poder retirarlos.<br/>");
						primitives.CA_ShowMsg ("falta_atizador");
						return true
					}

					primitives.GD_CreateMsg (1, "rompes_barrotes", "Gracias al atizador, rompes los barrotes con facilidad, pudiendo ahora entrar en la cuevita.<br/>");
					primitives.CA_ShowMsg ("rompes_barrotes");
					primitives.IT_SetAttPropValue (primitives.IT_X("barrotes"), "generalState", "state", "1")
				} else { 
					primitives.GD_CreateMsg (1, "no_es_necesario_que_insistas", "No es necesario que insistas.<br/>");
					primitives.CA_ShowMsg ("no_es_necesario_que_insistas");
				}
				
				return true;
			}
			return false;
		}
		

	});		
		


	
}

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

// GENERIC turn **********************************************************************************************

export function turn (indexItem) {
	

}


// internal functions ****************************************************************************************************************

usr.poema = function() {
	primitives.GD_CreateMsg (1, "estrofa1", "De niño pasaba con mi familia<br/>los veranos en una casa junto al mar.<br/>Tenía yo una guapa vecina<br/>cuyo nombre no voy a mencionar<br/>de la que era novio infantil en verano<br/>y a quien el resto del año sólo podía añorar.<br/><br/>");
	primitives.CA_ShowMsg ("estrofa1");
	primitives.GD_CreateMsg (1, "estrofa2", "Un desgraciado verano,<br/>mi querido amor me fue arrebatado por un golpe de mar<br/>y quedé profundamente conmocionado.<br/>Su tumba iba a visitar <br/>todos los días, ese verano y los siguientes,<br/>en un promontorio junto al mar.<br/><br/>");
	primitives.CA_ShowMsg ("estrofa2");
	primitives.GD_CreateMsg (1, "estrofa3", "Quince años sin ella<br/>no me pudieron calmar.<br/>Entonces algo sucedió<br/>y me dejaron de mirar<br/>sus ojos reflejados en las estrellas.<br/>Sólo escribir me podía aliviar<br/>y con letras y más letras<br/>no la dejaba de llamar.<br/><br/>");
	primitives.CA_ShowMsg ("estrofa3");
	primitives.GD_CreateMsg (1, "estrofa4", "En otros ojos y cuerpos<br/>la quise buscar<br/>tanto de ángeles como de demonios.<br/>Pero nunca la pude encontrar<br/>Tanta fue mi desesperación<br/>que casi la llegué a olvidar.<br/><br/>");
	primitives.CA_ShowMsg ("estrofa4");
	primitives.GD_CreateMsg (1, "estrofa5", "Un día alguien tuvo a bien<br/>una bonita carta quererme enviar.<br/>Era una admiradora a quien en edad podría yo doblar.<br/>Había leído algo mío<br/>que de ella y de mí parecía hablar.<br/>Pero nunca pudimos vernos.<br/>Porque vivía ella lejos de mi casa junto al mar.<br/><br/>");
	primitives.CA_ShowMsg ("estrofa5");
	primitives.GD_CreateMsg (1, "estrofa6", "Un día, mientras firmaba libros en la ciudad,<br/>A una dulce voz oí rogar<br/>'Me firma, por favor.'<br/>Y al la vista levantar,<br/>los ojos de ella reencontré<br/>Aquellos mismos a quienes tanto amé.<br/>Y fui afortunado de nunca más volverme a separar<br/>de aquellos ojos ojos de más allá de cielo y del mar.<br/><br/>");
	primitives.CA_ShowMsg ("estrofa6");
	
}
	

	

