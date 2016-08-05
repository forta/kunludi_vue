//Section 1a: gameReaction (lib overwrite)
//Section 1a: gameReaction (lib overwrite)
//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute 
//Section 3: gameItems
//Section 4: game functions

// **********************************************
//Section 1: gameReaction
// **********************************************

exports.reactionList = [];

let libModule = {}, libReactions = {}

exports.dependsOn = function (libModule, libReactions) {
	this.libModule = libModule
	this.libReactions = libReactions
}

let ludi_game = {}

// ============================

ludi_game.reactions = []; // set of default-reaction functions

ludi_game.reactions.push ({ 

	id: 'afilar', // único verbo específico del juego, no existe a nivel de librería
	
	enabled: function (indexItem, indexItem2) {
		if (IT_GetId(indexItem) == "madera") return true;
		return false;
	},
	

	reaction: function (par_c) {
		
		GD_CreateMsg (1, "afilas_madera", "Afilas la madera con el cuchillo ¡y obtienes una estaca!<br/>");
		GD_CreateMsg (1, "Xnecesitas_afilador", "Necesitas algo con qué afilarla<br/>");
		
		if ( par_c.item1Id == "madera") {
			if (IT_GetLoc (IT_X("cuchillo")) == PC_X()) { // tener cuchillo encima
				CA_ShowMsg ("afilas_madera");
				IT_SetLoc(IT_X("estaca"), IT_GetLoc(IT_X("madera")));
				IT_SetLocToLimbo(par_c.item1);
			} else 
				CA_ShowMsg ("Xnecesitas_afilador");
		} 
		return true;
	}
	
});

ludi_game.reactions.push ({ //lo capamos
	id: 'jump',
	enabled: function (indexItem,indexItem2) { 	return false; }
});

ludi_game.reactions.push ({ //lo capamos
	id: 'sing',
	enabled: function (indexItem,indexItem2) { 	return false; }
});

ludi_game.reactions.push ({ //lo capamos
	id: 'wait',
	enabled: function (indexItem,indexItem2) { 	return false; }
});

ludi_game.reactions.push ({ //lo capamos
	id: 'close',
	enabled: function (indexItem,indexItem2) { 	return false; }
});

ludi_game.reactions.push ({
	id: 'look',
	
	reaction: function (par_c) {
		
		GD_CreateMsg (1, "undefined_gameParameters", "Este juego necesita tener definido el atributo gameParameters en la localidad inicial del juego<br/>"); 
		GD_CreateMsg (1, "bienvenida_juego_1", "El Proyecto Vampiro (http://wiki.caad.es/Proyecto_Vampiro)) consiste en recrear una aventura muy sencilla en un nuevo lenguaje. En este caso, el objetivo es demostrar las posibilidades de LUDI. Basado en la versión Twine de no2nsence, que a su vez se basa en las versiones de fi.js (por baltasarq) e Inform 7 (por Sarganar).<br/><br/>"); 
		
		GD_CreateMsg (1, "bienvenida_juego_2", "Despiertas aturdido. Después de unos segundos te incorporas en el frío suelo de piedra y ves que estás en un castillo. ¡Ahora recuerdas! Eres reXXe y tu misión es la de matar al vampiro. TIENES que matar al vampiro que vive en la parte superior del castillo...<br/><br/>"); 

		if (par_c.item1Id== "vestibulo") {
			if (!IT_ATT(par_c.item1, "gameParameters")) {
				CA_ShowMsg ("undefined_gameParameters");
				CA_EndGame("Error");
				return true;
			}

			if (IT_GetAttPropValue (par_c.item1, "gameParameters", "version") == "") {
				CA_ShowImg ("portada_vampiro.jpg", true);
				
				CA_ShowMsg ("bienvenida_juego_1");
				CA_ShowMsg ("bienvenida_juego_2");

				IT_SetAttPropValue (par_c.item1, "gameParameters", "version","iniciado");
					
			} 
		}
		
		// to-do: imágenes de las localidades (porque el kernel no lo pemite)
		CA_ShowImg (par_c.item1Id + ".jpg", true);

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
	
ludi_game.reactions.push ({
	id: 'open',
	
	reaction: function (par_c) {
		
		GD_CreateMsg (1, "aparece_martillo", "-¡Clack! - Haciendo palanca logras abrir el barril.<br/>Dentro hay un martillo.<br/>"); 
		GD_CreateMsg (1, "aparecen_ajos", "Abres el armario con la llavecita.<br/>Al examinarlo se te cae al suelo una ristra de ajos que estaba en su interior.<br/>"); 
		GD_CreateMsg (1, "Xno_abres_o1", "No consigues abrir %o1.<br/>"); 
		GD_CreateMsg (1, "Xo1_ya_abierto", "%o1 ya está abierto.<br/>"); 

		if (par_c.item1Id == "barril") {
			if (IT_GetLoc (IT_X("martillo")) == IT_X("limbo")) {
				if (IT_GetLoc (IT_X("palanca")) == PC_X()) {// tener palanca
					CA_ShowMsg ("aparece_martillo");
					IT_SetLoc(IT_X("martillo"), PC_GetCurrentLoc());
				} else
					CA_ShowMsg ("Xno_abres_o1", [par_c.item1Id]);
			} else { // ya está abierto
				CA_ShowMsg ("Xo1_ya_abierto" , [par_c.item1Id]);
			}
			
			return true;
		}

		if (par_c.item1Id == "armario_pequeño") {
			if (IT_GetLoc (IT_X("ajos")) == IT_X("limbo")) {
				if (IT_GetLoc (IT_X("llave")) == PC_X()) { // tener llave
					CA_ShowMsg ("aparecen_ajos");
					IT_SetLoc(IT_X("ajos"), PC_GetCurrentLoc());
				} else
					CA_ShowMsg ("Xno_abres_o1", [par_c.item1Id]);
			} else { // ya está abierto
				CA_ShowMsg ("Xo1_ya_abierto" , [par_c.item1Id]);
			}
			return true;
		}

		if (par_c.item1Id == "ataud") {
			if ( (IT_GetLoc (IT_X("ajos")) != PC_X()) ||
				 (IT_GetLoc (IT_X("estaca")) != PC_X()) ||
				 (IT_GetLoc (IT_X("martillo")) != PC_X()) ||
				 (IT_GetLoc (IT_X("cruz")) != PC_X()) ) {
				GD_CreateMsg (1, "no_se_puede_abrir_ataúd", "Necesito cuatro cosas antes de poner fin a la 'vida' del vampiro. A saber: un crucifijo, una ristra de ajos, una estaca afilada y un martillo.<br/>");
				CA_ShowMsg ("no_se_puede_abrir_ataúd");
			} else {
				CA_ShowImg ("fin.png", true);
				CA_ShowMsg ("ganaste");
				CA_EndGame ("Ganaste!");
			}
			return true;
		}

		return false;
	}
	
});

ludi_game.reactions.push ({
	id: 'ex',
	
	reaction: function (par_c) {
		
		if (par_c.item1Id == "chimenea") {
			GD_CreateMsg (1, "desc_chimenea", "Es una chimenea hecha de ladrillos y muy elegante.");
			GD_CreateMsg (1, "hay_madera", "Entre los restos del fuego encuentras un trozo de madera.");
			
			CA_ShowMsg ("desc_chimenea");
			if ( (IT_GetLoc (IT_X("madera")) == IT_X("limbo")) && (IT_GetLoc (IT_X("estaca")) == IT_X("limbo")) ) {
				CA_ShowMsg ("hay_madera");
				IT_SetLoc(IT_X("madera"), PC_GetCurrentLoc());
			} 
			CA_ShowMsgAsIs ("<br/>");
			return true;			
		}
		
		if (par_c.item1Id == "cama") {
			if (IT_GetLoc (IT_X("sábanas")) == IT_X("limbo")) {
				IT_SetLoc(IT_X("sábanas"), PC_GetCurrentLoc());
			} 
			return false;			
		}

		if (par_c.item1Id == "sábanas") {
			GD_CreateMsg (1, "desc_sábanas", "Sábanas corrientes y molientes.");
			GD_CreateMsg (1, "hay_llavecita", "Entre ellas encuentras una pequeña llavecita.");
			
			CA_ShowMsg ("desc_sábanas");
			if (IT_GetLoc (IT_X("llave")) == IT_X("limbo")) {
				CA_ShowMsg ("hay_llavecita");
				IT_SetLoc(IT_X("llave"), PC_GetCurrentLoc());
			} 
			CA_ShowMsgAsIs ("<br/>");
			return true;			
		}
		
		if (par_c.item1Id == "armario_pequeño") {
			GD_CreateMsg (1, "armario_abierto", "El armario está abierto.");
			GD_CreateMsg (1, "armario_cerrado", "Está cerrado con llave.");
			
			if (IT_GetLoc (IT_X("llave")) == IT_X("limbo")) {
				CA_ShowMsg ("armario_cerrado");
			} else {
				CA_ShowMsg ("armario_abierto");			
			}
			CA_ShowMsgAsIs ("<br/>");
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
			CA_ShowImg (par_c.item1Id + ".jpg", true);
		}

		return false;
	}
	
});


ludi_game.reactions.push ({
	id: 'go',
	
	reaction: function (par_c) {

		return false;
	}
	
	
});



// to-do: afterDescription , para mostrar imagen de localidad al entrar
ludi_game.afterDescription = function (target) {
	
	CA_ShowImg (IT_GetId (target) + ".jpg", true);
}


ludi_game.reactions.push ({
	id: 'open',
	
	reaction: function (par_c) {
		
		// to-do: imágenes de las localidades (porque el kernel no lo pemite)
		CA_ShowImg (par_c.item1Id + ".jpg", true);

		return false;
	}
	
});
	
	
// **********************************************
//Section 2: gameAttribute 
// **********************************************

ludi_game.attribute = []; 

// **********************************************
//Section 3: items
/*
available methods for each item:
	desc()
	[precondToGo(dir)] // for "loc" items: to unlock/unlock exits
	turn() // by now, mandatory for "npc" and "pc" items
	
	
*/

// **********************************************

ludi_game.items = []; 

