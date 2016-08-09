//Section 1a: gameReaction (lib overwrite)
//Section 1a: gameReaction (lib overwrite)
//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute 
//Section 3: gameItems
//Section 4: game functions

// **********************************************
//Section 1: gameReaction
// **********************************************

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

		id: 'afilar', // único verbo específico del juego, no existe a nivel de librería
		
		enabled: function (indexItem, indexItem2) {
			if (primitives.IT_GetId(indexItem) == "madera") return true;
			return false;
		},
		

		reaction: function (par_c) {
			
			primitives.GD_CreateMsg (1, "afilas_madera", "Afilas la madera con el cuchillo ¡y obtienes una estaca!<br/>");
			primitives.GD_CreateMsg (1, "Xnecesitas_afilador", "Necesitas algo con qué afilarla<br/>");
			
			if ( par_c.item1Id == "madera") {
				if (primitives.IT_GetLoc (primitives.IT_X("cuchillo")) == primitives.PC_X()) { // tener cuchillo encima
					primitives.CA_ShowMsg ("afilas_madera");
					primitives.IT_SetLoc(primitives.IT_X("estaca"), primitives.IT_GetLoc(primitives.IT_X("madera")));
					primitives.IT_SetLocToLimbo(par_c.item1);
				} else 
					primitives.CA_ShowMsg ("Xnecesitas_afilador");
			} 
			return true;
		}
		
	});

	reactions.push ({ //lo capamos
		id: 'jump',
		enabled: function (indexItem,indexItem2) { 	return false; }
	});

	reactions.push ({ //lo capamos
		id: 'sing',
		enabled: function (indexItem,indexItem2) { 	return false; }
	});

	reactions.push ({ //lo capamos
		id: 'wait',
		enabled: function (indexItem,indexItem2) { 	return false; }
	});

	reactions.push ({ //lo capamos
		id: 'close',
		enabled: function (indexItem,indexItem2) { 	return false; }
	});

	reactions.push ({
		id: 'look',
		
		reaction: function (par_c) {
			
			primitives.GD_CreateMsg (1, "undefined_gameParameters", "Este juego necesita tener definido el atributo gameParameters en la localidad inicial del juego<br/>"); 
			primitives.GD_CreateMsg (1, "bienvenida_juego_1", "El Proyecto Vampiro (http://wiki.caad.es/Proyecto_Vampiro)) consiste en recrear una aventura muy sencilla en un nuevo lenguaje. En este caso, el objetivo es demostrar las posibilidades de LUDI. Basado en la versión Twine de no2nsence, que a su vez se basa en las versiones de fi.js (por baltasarq) e Inform 7 (por Sarganar).<br/><br/>"); 
			
			primitives.GD_CreateMsg (1, "bienvenida_juego_2", "Despiertas aturdido. Después de unos segundos te incorporas en el frío suelo de piedra y ves que estás en un castillo. ¡Ahora recuerdas! Eres reXXe y tu misión es la de matar al vampiro. TIENES que matar al vampiro que vive en la parte superior del castillo...<br/><br/>"); 

			if (par_c.item1Id== "vestibulo") {
				if (!primitives.IT_ATT(par_c.item1, "gameParameters")) {
					primitives.CA_ShowMsg ("undefined_gameParameters");
					primitives.CA_EndGame("Error");
					return true;
				}

				if (primitives.IT_GetAttPropValue (par_c.item1, "gameParameters", "version") == "") {
					primitives.CA_ShowImg ("portada_vampiro.jpg", true);
					
					primitives.CA_ShowMsg ("bienvenida_juego_1");
					primitives.CA_ShowMsg ("bienvenida_juego_2");

					primitives.IT_SetAttPropValue (par_c.item1, "gameParameters", "version","iniciado");
						
				} 
			}
			
			// to-do: imágenes de las localidades (porque el kernel no lo pemite)
			primitives.CA_ShowImg (par_c.item1Id + ".jpg", true);

			return false;
		}
		
	});
		
	/* eventos a considerar : 

		abrir barril (con palanca) -> martillo
		afilar madera -> estaca
		abrir armario pequeño (con llave) -> ajos
		entrar final -> ganaste
		ex cama -> ex sábanas -> llavecita
		ex chimenea -> madera

	*/
		
	reactions.push ({
		id: 'open',
		
		reaction: function (par_c) {
			
			primitives.GD_CreateMsg (1, "aparece_martillo", "-¡Clack! - Haciendo palanca logras abrir el barril.<br/>Dentro hay un martillo.<br/>"); 
			primitives.GD_CreateMsg (1, "aparecen_ajos", "Abres el armario con la llavecita.<br/>Al examinarlo se te cae al suelo una ristra de ajos que estaba en su interior.<br/>"); 
			primitives.GD_CreateMsg (1, "Xno_abres_o1", "No consigues abrir %o1.<br/>"); 
			primitives.GD_CreateMsg (1, "Xo1_ya_abierto", "%o1 ya está abierto.<br/>"); 

			if (par_c.item1Id == "barril") {
				if (primitives.IT_GetLoc (primitives.IT_X("martillo")) == primitives.IT_X("limbo")) {
					if (primitives.IT_GetLoc (primitives.IT_X("palanca")) == primitives.PC_X()) {// tener palanca
						primitives.CA_ShowMsg ("aparece_martillo");
						primitives.IT_SetLoc(primitives.IT_X("martillo"), primitives.PC_GetCurrentLoc());
					} else
						primitives.CA_ShowMsg ("Xno_abres_o1", [par_c.item1Id]);
				} else { // ya está abierto
					primitives.CA_ShowMsg ("Xo1_ya_abierto" , [par_c.item1Id]);
				}
				
				return true;
			}

			if (par_c.item1Id == "armario_pequeño") {
				if (primitives.IT_GetLoc (primitives.IT_X("ajos")) == primitives.IT_X("limbo")) {
					if (primitives.IT_GetLoc (primitives.IT_X("llave")) == primitives.PC_X()) { // tener llave
						primitives.CA_ShowMsg ("aparecen_ajos");
						primitives.IT_SetLoc(primitives.IT_X("ajos"), primitives.PC_GetCurrentLoc());
					} else
						primitives.CA_ShowMsg ("Xno_abres_o1", [par_c.item1Id]);
				} else { // ya está abierto
					primitives.CA_ShowMsg ("Xo1_ya_abierto" , [par_c.item1Id]);
				}
				return true;
			}

			if (par_c.item1Id == "ataud") {
				if ( (primitives.IT_GetLoc (primitives.IT_X("ajos")) != primitives.PC_X()) ||
					 (primitives.IT_GetLoc (primitives.IT_X("estaca")) != primitives.PC_X()) ||
					 (primitives.IT_GetLoc (primitives.IT_X("martillo")) != primitives.PC_X()) ||
					 (primitives.IT_GetLoc (primitives.IT_X("cruz")) != primitives.PC_X()) ) {
					primitives.GD_CreateMsg (1, "no_se_puede_abrir_ataúd", "Necesito cuatro cosas antes de poner fin a la 'vida' del vampiro. A saber: un crucifijo, una ristra de ajos, una estaca afilada y un martillo.<br/>");
					primitives.CA_ShowMsg ("no_se_puede_abrir_ataúd");
				} else {
					primitives.CA_ShowImg ("fin.png", true);
					primitives.CA_ShowMsg ("ganaste");
					primitives.CA_EndGame ("Ganaste!");
				}
				return true;
			}

			return false;
		}
		
	});

	reactions.push ({
		id: 'ex',
		
		reaction: function (par_c) {
			
			if (par_c.item1Id == "chimenea") {
				primitives.GD_CreateMsg (1, "desc_chimenea", "Es una chimenea hecha de ladrillos y muy elegante.");
				primitives.GD_CreateMsg (1, "hay_madera", "Entre los restos del fuego encuentras un trozo de madera.");
				
				primitives.CA_ShowMsg ("desc_chimenea");
				if ( (primitives.IT_GetLoc (primitives.IT_X("madera")) == primitives.IT_X("limbo")) && (primitives.IT_GetLoc (primitives.IT_X("estaca")) == primitives.IT_X("limbo")) ) {
					primitives.CA_ShowMsg ("hay_madera");
					primitives.IT_SetLoc(primitives.IT_X("madera"), primitives.PC_GetCurrentLoc());
				} 
				primitives.CA_ShowMsgAsIs ("<br/>");
				return true;			
			}
			
			if (par_c.item1Id == "cama") {
				if (primitives.IT_GetLoc (primitives.IT_X("sábanas")) == primitives.IT_X("limbo")) {
					primitives.IT_SetLoc(primitives.IT_X("sábanas"), primitives.PC_GetCurrentLoc());
				} 
				return false;			
			}

			if (par_c.item1Id == "sábanas") {
				primitives.GD_CreateMsg (1, "desc_sábanas", "Sábanas corrientes y molientes.");
				primitives.GD_CreateMsg (1, "hay_llavecita", "Entre ellas encuentras una pequeña llavecita.");
				
				primitives.CA_ShowMsg ("desc_sábanas");
				if (primitives.IT_GetLoc (primitives.IT_X("llave")) == primitives.IT_X("limbo")) {
					primitives.CA_ShowMsg ("hay_llavecita");
					primitives.IT_SetLoc(primitives.IT_X("llave"), primitives.PC_GetCurrentLoc());
				} 
				primitives.CA_ShowMsgAsIs ("<br/>");
				return true;			
			}
			
			if (par_c.item1Id == "armario_pequeño") {
				primitives.GD_CreateMsg (1, "armario_abierto", "El armario está abierto.");
				primitives.GD_CreateMsg (1, "armario_cerrado", "Está cerrado con llave.");
				
				if (primitives.IT_GetLoc (primitives.IT_X("llave")) == primitives.IT_X("limbo")) {
					primitives.CA_ShowMsg ("armario_cerrado");
				} else {
					primitives.CA_ShowMsg ("armario_abierto");			
				}
				primitives.CA_ShowMsgAsIs ("<br/>");
				return true;			
			}
		
			// mostrar imagen
			// excepciones: ataud, barril, chimenea, mesa, silla, adornos, trofeos, horno
			if ( (par_c.item1Id != "ataud") &&
				 (par_c.item1Id != "barril") &&
				 (par_c.item1Id != "chimenea") &&
				 (par_c.item1Id != "mesa") &&
				 (par_c.item1Id != "silla") &&
				 (par_c.item1Id != "adornos") &&
				 (par_c.item1Id != "trofeos") &&
				 (par_c.item1Id != "horno") ) {
				primitives.CA_ShowImg (par_c.item1Id + ".jpg", true);
			}

			return false;
		}
		
	});


	reactions.push ({
		id: 'go',
		
		reaction: function (par_c) {

			return false;
		}
		
		
	});
	
	reactions.push ({
	id: 'open',
	
	reaction: function (par_c) {
		
		// to-do: imágenes de las localidades (porque el kernel no lo pemite)
		primitives.CA_ShowImg (par_c.item1Id + ".jpg", true);

		return false;
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

	
