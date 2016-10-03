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

		id: 'atar', 
		
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
		id: 'go',
		
		reaction: function (par_c) {
			
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
					primitives.GD_CreateMsg (1, "no_te_olvides_novela", "Se supone que te vas unas semanas a la casa de la playa a terminar tu NO-VE-LA... ¿no crees que te olvidad algo?<br/>");
					primitives.CA_ShowMsg ("no_te_olvides_novela");
					return true;
				}

				primitives.GD_CreateMsg (1, "al_salir_del_estudio", "El viaje transcurre como un sueño. Un momento atrás estabas en tu estudio...y ahora, ahí estás delante de la puerta de la casa de la playa. Los trayectos de taxi, el bullicio del aeropuerto, el ronquido del pasajero de al lado... a nada de eso le has prestado demasiada atención. En tu cabeza sólo había una idea 'en un rato volveré a estar allí donde todo ocurrió, después de hace tantos años'. Al supuesto motivo por el que vas, acabar las correcciones de tu última novela, tampoco le has dedicado ni un pensamiento.<br/>");
				
				primitives.CA_ShowMsg ("al_salir_del_estudio");
				
			}
			
			return false; // se ejecuta reacción por defecto
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


						

