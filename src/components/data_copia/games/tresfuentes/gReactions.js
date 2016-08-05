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

Variables consideradas:

primitives.IT_GetAttPropValue (primitives.IT_X("cruce_caminos"), "gameParameters", "internal.version"): dos internal.versiones del juego: completa o reducida (se elige al empezar a jugar)
primitives.IT_GetAttPropValue (primitives.IT_X("cruce_caminos"), "gameParameters", "firstPC"): jugador elegido para empezar a jugar (sólo si versión completa)

primitives.IT_GetAttPropValue (PC_X(), "generalState", "state") : estado del jugador activo, valores posibles 
0: estado inicial
1: recibió arma del otro PJ (en versión corta: encontró camisa)
2: cazó usando ese arma
3: entregó presa al flautista
4: bailaron
5: bebió pócima

primitives.IT_GetAttPropValue (PC_X(), "generalState", "nivelMusical") : nivel musical tocando la flauta (ini: 0)

primitives.IT_GetAttPropValue (indexItem, "generalState", "confianza"): "true"/"false" (ini: "false")

El cuenco usa una variable para saber qué agua contiene
primitives.IT_GetAttPropValue (primitives.IT_X("cuenco"), "isLiquidContainer", "state");


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
	
	return this.reactions[actionIndex].reaction ({ pc:action.pc, item1:action.item1, item2:action.item2, item1Id:action.item1Id, item2Id:action.item2Id, loc:this.primitives.PC_GetCurrentLoc (), direction:action.d1 })

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

		id: 'play-instrument', // único verbo específico del juego, no existe a nivel de librería
		
		enabled: function (indexItem,indexItem2) {
			if (primitives.IT_GetLoc(indexItem) != primitives.PC_X()) return false;
			if (primitives.IT_ATT(indexItem, "isMusicInstrument")) return true;
			return false; // si fuera acción existente a nuvel de librería, acabar sin return equivale a ejecutar el enable() de librería.
		},
		
		reaction: function (par_c) {
			
			// asumimos que la flauta es el único instrumento musical del juego
			if (primitives.IT_GetLoc (primitives.IT_X("flautista")) == primitives.PC_GetCurrentLoc()) { // flautista aquí
				usr.examenMusical (par_c);
				return true;
			}
			
			if ((primitives.IT_GetLoc (primitives.IT_X("hechicera")) == primitives.PC_GetCurrentLoc()) || (primitives.IT_GetLoc (primitives.IT_X("vieja")) == primitives.PC_GetCurrentLoc()) ) { // vieja/bruja aquí
				var PNJ = "vieja";
				if (primitives.IT_GetLoc (primitives.IT_X("hechicera")) == primitives.PC_GetCurrentLoc()) PNJ = "hechicera";
				primitives.GD_CreateMsg (1, "DLG_no_toques", "En mi presencia, ¡ni se te ocurra tocar ese instrumento del demonio!"); 
				primitives.CA_QuoteBegin (PNJ, "DLG_no_toques");
				primitives.GD_CreateMsg (1, "%o1_no_te_deja_tocar", "%o1 te intimida tanto, que ni te atreves a intentarlo.");
				primitives.CA_ShowMsg ("%o1_no_te_deja_tocar", {o1:PNJ});
				return true;
			}
			
			// mejora con la práctica
			var nivelMusical = +primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "nivelMusical");

			// practicando sin el flautista que te examine
			primitives.GD_CreateMsg (1, "practicar_flauta_0", "fiu, fiu, la conchambrosa flauta sólo hace un ruido sin gracia, apenas si sabes colocar los dedos en los agujeros.<br/>"); 
			primitives.GD_CreateMsg (1, "practicar_flauta_1", "Después de mucho practicar, consigues ir asociando sonidos a digitaciones de dedos.<br/>"); 
			primitives.GD_CreateMsg (1, "practicar_flauta_2", "Te atreves a tocar de oído algunas pequeñas combinaciones.<br/>"); 
			primitives.GD_CreateMsg (1, "practicar_flauta_3", "Ahora intentas tocar una melodía más larga que oiste una vez.<br/>"); 
			primitives.GD_CreateMsg (1, "practicar_flauta_4", "La práctica es la madre de la maestría, ahora hasta podrías ganarte unos cuarto tocando en la calle.<br/>"); 

			if (nivelMusical == "0") {
				primitives.CA_PlayAudio ("flauta_nivel0.m4a", true, "practicar_flauta_0"); 
			} else 	if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "nivelMusical") == "1") {
				primitives.CA_PlayAudio ("flauta_nivel1.m4a", true, "practicar_flauta_1"); 
			} else 	if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "nivelMusical") == "2") {
				primitives.CA_PlayAudio ("flauta_nivel2.m4a", true, "practicar_flauta_2"); 
			} else 	if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "nivelMusical") == "3") {
				primitives.CA_PlayAudio ("flauta_nivel3.m4a", true, "practicar_flauta_3"); 
			} else {
				primitives.CA_PlayAudio ("flauta_nivel4.mp3", true, "practicar_flauta_4"); 		
			}
			primitives.IT_SetAttPropValue (primitives.PC_X(), "generalState", "nivelMusical",  nivelMusical + 1);

			return true;
		},
		
	});

	reactions.push ({
		id: 'become',
		
		reaction: function (par_c) {
			
			primitives.GD_CreateMsg (1, "cambio_punto_de_vista_a_%o1", "<br/><b>Cambio de protagonista:</b> %o1<br/><br/>"); 
			primitives.PC_SetIndex (par_c.item1);
			primitives.CA_ShowMsg ("cambio_punto_de_vista_a_%o1" , {o1:primitives.IT_GetId(primitives.PC_X())});

			// si ambos ya han sido controlados por el jugador, no se muestra intro
			if (primitives.IT_GetAttPropValue (primitives.IT_X("cruce_caminos"), "gameParameters", "firstPC") == "ambos")  return false;
			
			// si es la primera vez que controlas este PJ, mostrar la intro
			if (par_c.item1Id != primitives.IT_SetAttPropValue (primitives.IT_X("cruce_caminos"), "gameParameters", "firstPC")) {
				primitives.IT_SetAttPropValue (primitives.IT_X("cruce_caminos"), "gameParameters", "firstPC", par_c.item1Id);
				usr.intro();
				primitives.IT_SetAttPropValue (primitives.IT_X("cruce_caminos"), "gameParameters", "firstPC", "ambos"); // se acaban las intros
			}
			
			primitives.CA_Refresh ();

			return true;

		},
		
	});


	reactions.push ({
		id: 'go',
		
		reaction: function (par_c) {
			
			primitives.GD_CreateMsg (1, "al_pasar_delante_figura", "Al pasar por delante de %o1 no puedes dejar de observarla: ");
			primitives.GD_CreateMsg (1, "cazador_atraviesa_catarata", "Con mucho esfuerzo, atraviesas la muralla de agua de la catarata.<br/>");
			primitives.GD_CreateMsg (1, "VR_dragona_atraviesa_catarata_1", "Convertida en dragona, ");
			primitives.GD_CreateMsg (1, "VC_dragona_atraviesa_catarata_1", "Convertida en mostruo marino, ");
			primitives.GD_CreateMsg (1, "dragona_atraviesa_catarata_2", "atraviesas la muralla de agua de la catarata sin dificultad.<br/>");
			primitives.GD_CreateMsg (1, "VR_reflejo_catarata", "Te ves reflejada en la fuente verde... eres tú, pero no eres tú... sólo reconoces de ti misma los ojos de serpiente. Con este cuerpo de mujer no podrías atravesar la cascada, así que por ahora no lo intentas... pero hay una dragona dentro de ti.<br/>");
			primitives.GD_CreateMsg (1, "VC_reflejo_catarata", "Te ves reflejada en la fuente verde y reconoces tus ojos de serpiente. No te arriesgas a poner en riesgo la vida de tu hijo... aún no.<br/>");
			
			if (par_c.loc == primitives.IT_X("cruce_caminos")) {
				var idItem = "";
				if (par_c.directionId == "d0") idItem = "figura_verde";
				else if (par_c.directionId == "d90") idItem = "figura_roja";
				else if (par_c.directionId == "d180") idItem = "figura_negra";
				else if (par_c.directionId == "d270") idItem = "figura_dorada";
				
				if (idItem != "") {
					if (!primitives.IT_GetIsItemKnown (par_c.pc, primitives.IT_X(idItem))) {	
						primitives.IT_SetIsItemKnown (par_c.pc, primitives.IT_X(idItem));
						primitives.CA_ShowMsg ("al_pasar_delante_figura", {o1:idItem});
						primitives.CA_ShowDesc (primitives.IT_X(idItem));
						primitives.CA_ShowMsgAsIs ("<br/>")
					}
				} 
				return false;
			}
					
			// al entrar en caverna del dragón atravesando catarata
			if ( (par_c.loc == primitives.IT_X("fuente_verde")) && (par_c.directionId == "in") )  { 
				if (primitives.PC_X() == primitives.IT_X("cazador")) {
					if ( (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") == "4")  && // cazador no ha bebido
						 (primitives.IT_GetAttPropValue (primitives.IT_X("caldero"), "isLiquidContainer", "state") == "pócima") && // pero existe la pócima
						 (primitives.IT_GetLoc(primitives.IT_X("cuenco")) != primitives.IT_X("caverna_dragón")) && // ypócima no es accesible al cazador al cruzar
						 (primitives.IT_GetLoc(primitives.IT_X("cuenco")) != primitives.IT_X("escondite")) &&
						 (primitives.IT_GetLoc(primitives.IT_X("cuenco")) != primitives.IT_X("cazador")) ) { 
						primitives.GD_CreateMsg (1, "cazador_no_cruza_sin_pócima", "Te acuerdas de que no has tomado la pócima y te parece una tontería avanzar sin haberla tomado.<br/>");
						primitives.CA_ShowMsg ("cazador_no_cruza_sin_pócima");
						return true;
					}

					primitives.CA_ShowMsg ("cazador_atraviesa_catarata");
					primitives.IT_SetLoc(primitives.PC_X(), primitives.IT_X("caverna_dragón"));
					usr.comprobarSiFinDelJuego();
				} else {
					if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") == "5") {
						
						primitives.CA_ShowMsg (usr.getVersion() + "_dragona_atraviesa_catarata_1");
						primitives.CA_ShowMsg ("dragona_atraviesa_catarata_2");
						
						primitives.IT_SetLoc(primitives.PC_X(), primitives.IT_X("caverna_dragón"));
						usr.comprobarSiFinDelJuego();
					} else {
						
						primitives.CA_ShowMsg (usr.getVersion() + "_reflejo_catarata");
						return true;
					}
				}
			}

			if  ( (par_c.loc == primitives.IT_X("caverna_dragón")) && (par_c.directionId == "out") )  { // al salir de caverna del dragón atravesando catarata
				if (primitives.PC_X() == primitives.IT_X("cazador")) {
					primitives.CA_ShowMsg ("cazador_atraviesa_catarata");
					return false;
				}
			}
			
			if (par_c.loc == primitives.IT_X("tierras_sur") && (par_c.directionId == "in")) {
				if (primitives.PC_X() == primitives.IT_X("vagabunda")) {
					if (primitives.IT_GetAttPropValue (primitives.IT_X("tierras_sur"), "generalState", "state") == "0") {
						primitives.GD_CreateMsg (1, "cueva_bruja_innaccesible_vagabunda", "Una grieta en la base de la montaña, al sur, parece indicar una entrada en la montaña, pero una robusta planta llena de espinas no te permite entrar. Desistes.<br/>");
						primitives.CA_ShowMsg ("cueva_bruja_innaccesible_vagabunda");
						return true;
					} else if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") == "5") { // dragona no puede volver a la cueva de la bruja
						primitives.GD_CreateMsg (1, "dragona_no_pasa", "Miras la grieta... miras cómo ha crecido tu cuerpo... y desistes sin intentarlo.<br/>");
						primitives.CA_ShowMsg ("dragona_no_pasa");
						return true;
					}
				}

				// si llevas el diamante, pero no has bailado aún...
				if ( (primitives.IT_GetLoc (primitives.IT_X("diamante")) == primitives.PC_X ()) &&  
					 (primitives.IT_GetAttPropValue (primitives.PC_X (), "generalState", "state") <= "3") ) {
					// llega el flautista y se lleva el diamante
					primitives.GD_CreateMsg (1, "flautista_aparece", "De entre unos matorrales aparece el flautista.<br/>");
					primitives.GD_CreateMsg (1, "DLG_flautista_quita_diamante", "No creerías que te iba a dejar llevarle la valiosa piedra a la vieja antes de que ejerza su magia para mí.");
					primitives.GD_CreateMsg (1, "flautista_se_va", "El flautista te arrebata el diamante y desaparece de tu vista.<br/>");
					
					primitives.CA_ShowMsg ("flautista_aparece");
					primitives.CA_QuoteBegin ("flautista", "DLG_flautista_quita_diamante");
					primitives.CA_ShowMsg ("flautista_se_va");
					primitives.IT_SetLoc (primitives.IT_X("diamante"), primitives.IT_X("flautista"));
					return true;
				}
			}

			if  (par_c.loc == primitives.IT_X("cueva_bruja")) {
				if (primitives.IT_GetIsLocked (par_c.loc, par_c.directionId)) {
					// dejamos que siga corriendo el reloj y se lance la conversión
					primitives.GD_CreateMsg (1, "No_puedes_salir_de_cueva_bruja", "Has crecido mucho, ¡ya no cabes por la grieta de salida y no puedes salir de la cueva!<br/>");
					primitives.CA_ShowMsg("No_puedes_salir_de_cueva_bruja");
					return true;
				}
			}

			return false; // se ejecuta reacción por defecto
		}
		
		
	});



	reactions.push ({
		id: 'take',
		
		reaction: function (par_c) {
			
			primitives.GD_CreateMsg (1, "no_llevas_portaagua %o1", "No tienes con qué coger %o1");
			primitives.GD_CreateMsg (1, "recuerdas_regla %s1", "Recuerdas la regla número %s1 que te dijo la hechicera.<br/>");
			primitives.GD_CreateMsg (1, "contenido_cuenco_no_cambia", "El contenido del cuenco no cambia.<br/>");
			primitives.GD_CreateMsg (1, "regla1", "El líquido verde simboliza a los elfos y ofrece resistencia a que le pongas otros líquidos encima. Como los elfos, desean ser siempre los últimos en llegar a las batallas y decir que gracias a ellos se ganó.<br/>");
			primitives.GD_CreateMsg (1, "efecto_regla1", "El líquido verde empieza a girar dentro del cuenco. Te himnotiza, parece formar forma de elfo y se eleva por los aires, dejando el cuenco vacío.<br/>");
			primitives.GD_CreateMsg (1, "regla2", "Los líquidos verde y dorado representan los bosques de los elfos y el oro de los enanos. Al igual que el agua y el aceite, no se mezclan a solas ni por casualidad.<br/>");
			primitives.GD_CreateMsg (1, "efecto_regla2", "El líquido dorado empieza a burbujear y calentarse y se evapora antes de que llegues a coger el agua verde.<br/>");
			primitives.GD_CreateMsg (1, "regla3", "Los líquidos verde y dorado representan los bosques de los elfos y la sangre de dragón. A los dragones no les gusta ser montados por los elfos.<br/>");
			primitives.GD_CreateMsg (1, "efecto_regla3", "El cuenco empieza a moverse como un caballo que no quiere ser domado, y el agua acaba cayendo al suelo.<br/>");
			primitives.GD_CreateMsg (1, "liquido_contenido %o1 %o2", " %o1 tiene %o2.<br/>"); 
			primitives.GD_CreateMsg (1, "efecto_desconocido", "Por algún motivo desconocido, ¡la mezcla de líquidos reacciona!<br/>");
			
			// coger líquido sin cuenco
			// if atributo de par_c.obj1 es liquido 
			if (primitives.IT_ATT(par_c.item1, "isLiquid")) {  // objeto es líquido 
				if (primitives.IT_GetLoc (primitives.IT_X("cuenco")) != primitives.PC_X()) { // no se tiene el cuenco
					primitives.CA_ShowMsg("no_llevas_portaagua %o1", {o1:par_c.item1Id});
					return true;
				} else {
					
					// mensaje definido ya a nivel de librería... 
					primitives.CA_ShowMsg("You put %o1 into %o2", {o1:par_c.item1Id, o2:"cuenco"});
					primitives.CA_ShowMsgAsIs(".");
					
					// resultado al meter o1 dentro del cuenco
					var resultadoLiquido = usr.agregarLiquido (par_c, "cuenco");
					
					if (resultadoLiquido == "idem") {
						primitives.CA_ShowMsg("contenido_cuenco_no_cambia");
						return true;	
					}
					
					var pos = resultadoLiquido.indexOf ("muerte");
					if (pos >= 0 ) {
						
						var regla = resultadoLiquido.substring(6,7);

						// si el pergamino ya no lo tiene la hechicera, ya deberías saber las reglas
						if (primitives.IT_GetLoc(primitives.IT_X("pergamino")) != primitives.IT_X("hechicera")) {
							primitives.CA_ShowMsg("recuerdas_regla %s1", {s1:regla});
						} else { 
							primitives.CA_ShowMsg("efecto_desconocido");
						}

						// En función de la regla incumplida, el cuenco reacciona de diferente manera
						primitives.CA_ShowMsg("efecto_regla" + regla);
						primitives.IT_SetAttPropValue (primitives.IT_X("cuenco"), "isLiquidContainer", "state", "vacío");
						return true;
					}
					
					// actualizar valor del cuenco
					primitives.CA_ShowMsg("liquido_contenido %o1 %o2", {o1:"cuenco", o2:usr.liquido2String (resultadoLiquido)});
					primitives.IT_SetAttPropValue (primitives.IT_X("cuenco"), "isLiquidContainer", "state", resultadoLiquido);
					
					// suponemos que el líquido de origen es abundante y no se acaba
					return true;
				}
			}
					
			// pájaros
			primitives.GD_CreateMsg (1, "pájaros_no_capturables", "Los pájaros están aburridos de que los caces, te huelen a la milla y salen volando.<br/>");
			primitives.GD_CreateMsg (1, "VC_pájaros_son_capturados", "Lanzas la honda y dos de ellos quedan atrapados en ella; el resto sale volando.<br/>");
			primitives.GD_CreateMsg (1, "VR_pájaros_son_capturados", "Lanzas la camisa y dos de ellos quedan atrapados en ella; el resto sale volando.<br/>");
			primitives.GD_CreateMsg (1, "pájaros_no_son_capturados", "Los intentas cazar, pero son más rápido que tú. Quizás, lanzándoles algo encima...<br/>");
			primitives.GD_CreateMsg (1, "pescados_no_capturables", "Los peces es como si te sintieran desde lejos, y nada más aproximarte se alejan sin que puedas ni verlos.<br/>");
			primitives.GD_CreateMsg (1, "pescados_son_capturados", "Con el anzuelo y un palo haces una caña improvisada y consigues pescar uno.<br/>");
			primitives.GD_CreateMsg (1, "pescados_no_son_capturados", "Los intentas pescar, pero son más rápido que tú. Quizás, con alguna cosa...<br/>");
			
			if (par_c.item1Id == "pájaros") { 
				if (par_c.pc == primitives.IT_X("cazador")) {
					primitives.CA_ShowMsg ("pájaros_no_capturables");
					return true; 			
				}
				if ((primitives.IT_GetLoc (primitives.IT_X("camisa")) == primitives.PC_X()) || (primitives.IT_GetLoc (primitives.IT_X("honda")) == primitives.PC_X())) {
					primitives.CA_ShowMsg (usr.getVersion() + "_pájaros_son_capturados");
					primitives.IT_SetAttPropValue (primitives.PC_X(), "generalState", "state", "2");
					return false; 
				} else {
					primitives.CA_ShowMsg ("pájaros_no_son_capturados");
					return true;
				}
			}
			
			// pescados
			if (par_c.item1Id == "pescados") { 
				if (primitives.PC_X() == primitives.IT_X("vagabunda")) {
					primitives.CA_ShowMsg ("pescados_no_capturables");
					return true; 			
				}	
				if (primitives.IT_GetLoc (primitives.IT_X("anzuelo")) == primitives.PC_X()) {
					primitives.CA_ShowMsg ("pescados_son_capturados");
					// estado pasa a 2.
					primitives.IT_SetAttPropValue (primitives.PC_X(), "generalState", "state", "2");
					return false;
				} else {
					primitives.CA_ShowMsg ("pescados_no_son_capturados");
					return true;
				}
			}
			
			return false;
		}
		
	});

	reactions.push ({
		id: 'ex',
		
		reaction: function (par_c) {
			
			primitives.GD_CreateMsg (1, "pájaros_libres", "Los pájaros beben plácidamente junto a la charca roja.<br/>");
			primitives.GD_CreateMsg (1, "pájaros_capturados", "Los pájaros que cazaste.<br/>");
			primitives.GD_CreateMsg (1, "pescados_libres", "Los pescados se mueven cerca del margen del río.<br/>");
			primitives.GD_CreateMsg (1, "pescados_capturados", "Los pescados que pescaste.<br/>");
			primitives.GD_CreateMsg (1, "VR_figura_roja", "La figura está formada por dos pequeños dragones rojos entrelazados que indican el camino del este. Bajo la figura se lee una inscripción con sus nombres: Laila y Kuko.<br/>");
			primitives.GD_CreateMsg (1, "VC_figura_roja", "La figura representa un dragón rojo que mira hacia el este.<br/>");
			
			
			// representación con gráfico (en el futuro, más integrado a nivel de librería, usando atributos en json)
			var fichero ="";
			if (par_c.item1Id == "cuenco") fichero = "cuenco.jpg";
			else if (par_c.item1Id == "camisa") fichero = "camisa.jpg";
			else if (par_c.item1Id == "diamante") fichero = "diamante.jpg";
			else if (par_c.item1Id == "pájaros") fichero = "pájaros.jpg";
			else if (par_c.item1Id == "vieja") fichero = "vieja.gif";
			// else if (par_c.item1Id == "fuente_roja") fichero = "fuente_roja.jpg";
			// else if (par_c.item1Id == "fuente_dorada") fichero = "fuente_dorada.jpg";
			else if (par_c.item1Id == "hechicera") fichero = "hechicera.jpg";
			else if (par_c.item1Id == "peces") fichero = "peces.jpg"; 
			else if (par_c.item1Id == "espejo") {
				if (primitives.PC_X() == primitives.IT_X("vagabunda")) fichero = "vagabunda.jpg";
				else  fichero = "cazador.gif";
			}
					
			if (fichero != "")
				primitives.CA_ShowImg (fichero, true, true, "pulsa_para_ver_imagen_de_%o1", [par_c.item1Id] ); 
			
			// para mostrar atributo al examinar contenedor de líquido
			if (primitives.IT_ATT(par_c.item1, "isLiquidContainer")) {  // objeto contiene un líquido
				var liquido = primitives.IT_GetAttPropValue (par_c.item1, "isLiquidContainer", "state");
				if (liquido != "vacío") {
					primitives.CA_ShowMsg("liquido_contenido %o1 %o2", {o1:par_c.item1Id, o2:usr.liquido2String (liquido)});
				}
				return false;
			}
			
			// pájaros
			if (par_c.item1Id == "pájaros") { 
				if (primitives.IT_GetLoc (primitives.IT_X("pájaros")) == primitives.PC_X()) {
					primitives.CA_ShowMsg ("pájaros_capturados");
				} else {
					primitives.CA_ShowMsg ("pájaros_libres");
				}
				return true;
			}
			
			// pescados
			if (par_c.item1Id == "pescados") { 
				if (primitives.IT_GetLoc (primitives.IT_X("pescados")) == primitives.PC_X()) {
					primitives.CA_ShowMsg ("pescados_capturados");
				} else {
					primitives.CA_ShowMsg ("pescados_libres");
				}
				return true;
			}
			
			// figura_roja
			if (par_c.item1Id == "figura_roja") { 
				primitives.CA_ShowMsg(usr.getVersion() + "_figura_roja");
				return true;
			}
			
			// basura ->  desaparece y aparece el cuenco; si versión reducida, también aparece la camisa
			if (par_c.item1Id == "basura") { 
				primitives.CA_ShowImg ("monte%20sucio.jpg", true); // a nivel de juego y representación directa
				primitives.GD_CreateMsg (1, "al_examinar_basura_aparece_cuenco", "Removiendo entre ramas y polvo, descubres un viejo cuenco");
				primitives.CA_ShowMsg ("al_examinar_basura_aparece_cuenco");
				primitives.IT_SetLocToLimbo (par_c.item1);
				primitives.IT_BringHere (primitives.IT_X("cuenco"));

				if (usr.getVersion() == "VR") {
					primitives.GD_CreateMsg (1, "junto_con_cuenco_aparece_camisa", " y una camisa sucia.<br/>");
					primitives.CA_ShowMsg ("junto_con_cuenco_aparece_camisa");
					primitives.IT_BringHere (primitives.IT_X("camisa"));
				} else {
					primitives.CA_ShowMsgAsIs(".<br/>");
				}

				// enlaces para ver imágenes (se podría quitar y que lo miren al examinar; lo dejo como demo de funcionalidad)
				primitives.CA_ShowImg ("cuenco.jpg", true, true, "pulsa_para_ver_imagen_de_%o1", ["cuenco"] ); // a nivel de juego y representación diferida
				if (usr.getVersion() == "VR") {
					primitives.CA_ShowImg ("camisa.jpg", true, true, "pulsa_para_ver_imagen_de_%o1", ["camisa"] ); // a nivel de juego y representación diferida
				}
				
				return true;
			}
			
			// espejo
			primitives.GD_CreateMsg (1, "VC_vagabunda_ante_espejo", "Qué extraño te resulta verte con esa enorme barriga, pero sigues teniendo tus ojos de serpiente.<br/>");
			primitives.GD_CreateMsg (1, "VR_vagabunda_ante_espejo", "Qué extraño te resulta verte con esta figura humana. Sigues teniendo tus ojos de serpiente.<br/>");
			primitives.GD_CreateMsg (1, "vagabunda_ante_espejo_ve_diamante", "Recordando el aviso del flautista, observas el espejo con mayor atención y descubres, sin saber cómo, hay una piedra preciosa dentro del espejo. Alargas la mano y coges el diamante, accesible sólo a seres como tú.<br/>");
			primitives.GD_CreateMsg (1, "vagabunda_ante_espejo_no_ve_diamante", "Por un momento te parece ver un refrejo extraño, pero tuvo que haber sido tu imaginación..<br/>");
			primitives.GD_CreateMsg (1, "cazador_ante_espejo", "Te notas más viejo de lo que recordabas, como si hubieran pasado años desde que fuiste al mundo submarino en búsqueda del anzuelo para tu hermano.<br/>");
			if (par_c.item1Id == "espejo") { 
				if (par_c.pc == primitives.IT_X("vagabunda")) {
					primitives.CA_ShowMsg (usr.getVersion() + "_vagabunda_ante_espejo");
					primitives.CA_ShowImg ("espejo.jpg", true, true, "pulsa_para_ver_imagen_de_%o1", {o1:"espejo"} ); // a nivel de juego y representación diferida

					if (primitives.IT_GetLoc (primitives.IT_X("diamante")) == primitives.IT_X("limbo")) {
						if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") >= "3") {
							primitives.CA_ShowMsg ( "vagabunda_ante_espejo_ve_diamante");
							primitives.IT_SetLoc (primitives.IT_X("diamante"), primitives.IT_X("vagabunda"));
						} else {
							primitives.CA_ShowMsg ("vagabunda_ante_espejo_no_ve_diamante");
						}
					}
				} else {
					primitives.CA_ShowMsg ("cazador_ante_espejo");
				}
				
				return true;
			}
			
			// flautista
			if (par_c.item1Id == "flautista") { 
				primitives.GD_CreateMsg (1, "flautista_tocando", "El flautista, tocando animadamente su flauta."); 
				primitives.GD_CreateMsg (1, "flautista_sin_flauta", "Como el flautista ya no tiene flauta... canta animadamente."); 
				if (primitives.IT_GetLoc (primitives.IT_X("flauta")) == primitives.IT_X("flautista"))  { // flautista tiene la flauta
					primitives.CA_ShowImg ("flautista.jpg", true, true, "pulsa_para_ver_imagen_de_%o1", ["flautista"] ); // a nivel de juego y representación diferida
					primitives.CA_PlayAudio ("flauta1.mp3", true, "flautista_tocando"); 
				} else {
					primitives.CA_PlayAudio ("flautista_sin_flauta.m4a", true, "flautista_sin_flauta"); 
				}
				return true;
			}
			
			return false;
		}
		
	});

	// pedir algo a alguien
	reactions.push ({
		id: 'ask_from',

		reaction: function (par_c) {

			// to-improve
			
			primitives.GD_CreateMsg (1, "DLG_acepta_petición_porque %o1", "Vale, pero sólo porque antes me diste %o1.");
			
			// se acepta pedir arma al otro personaje, si previamente dio arma (honda a cazadoro, o anzuelo a vagabunda)
			if ( ((par_c.item2Id == "cazador") && (par_c.item1Id == "honda")) ||
				((par_c.item2Id == "vagabunda") && (par_c.item1Id == "anzuelo")) ) {
				if (primitives.IT_GetAttPropValue (primitives.IT_X(par_c.item2Id), "generalState", "state") == "1") { // si hay confianza previa (item2 recibió arma)
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_acepta_petición_porque %o1", [primitives.IT_GetId(usr.elOtroArma(par_c.item1))]);
					primitives.IT_SetLoc (par_c.item1, primitives.PC_X());
					return true;
				}
			}
			
			// pedir al otro protagonista
			primitives.GD_CreateMsg (1, "DLG_da_%o1", "Vale, toma %o1.");
			if (par_c.item2 == usr.elOtroPJ(primitives.PC_X ()))  { 
				if (primitives.IT_GetAttPropValue (primitives.IT_X(par_c.item2Id), "generalState", "state") >= "1") { // si hay confianza previa (item2 recibió arma)
					if (par_c.item1Id == "cuenco") { // pedir cuenco
						primitives.CA_QuoteBegin (par_c.item2Id, "DLG_da_%o1", [ par_c.item1Id]);
						primitives.IT_SetLoc (par_c.item1, primitives.PC_X());
						return true;
					}
				}
			}

			// pedir a vieja
			primitives.GD_CreateMsg (1, "DLG_no_da_%o1", "¿Y por qué tendría que darte yo %o1?");
			if (par_c.item2Id == "vieja")  {
				primitives.CA_QuoteBegin (par_c.item2Id, "DLG_no_da_%o1", [par_c.item1Id]);
				return true;
			}
			
			// pedir a hechicera
			primitives.GD_CreateMsg (1, "DLG_no_da_%o1_porque_falta_%o2", "Si quieres %o1 deberías traerme %o2.");
			primitives.GD_CreateMsg (1, "DLG_coge_de_%o1", "Sírvete tú mismo de %o1.");
			if (par_c.item2Id == "hechicera") {
				if (par_c.item1Id == "pócima") { // pedir pócima
					if (primitives.IT_GetAttPropValue (primitives.IT_X("caldero"), "isLiquidContainer", "state") != "pócima")  {
						primitives.CA_QuoteBegin (par_c.item2Id, "DLG_no_da_%o1_porque_falta_%o2", [par_c.item1Id, "agua_púrpura"]);
					} else {
						primitives.CA_QuoteBegin (par_c.item2Id, "DLG_coge_de_%o1", "caldero");
					}
				} else {
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_no_da_%o1", [par_c.item1Id]);
				}
				return true;
			}

			return false;
			
		}
		
	});

	reactions.push ({ // mostrar algo a alguien: lo capamos por ahora
		id: 'show_to',
		enabled: function (indexItem,indexItem2) { 	return false; }
	});

	reactions.push ({ //saltar: lo capamos por ahora
		id: 'jump',
		enabled: function (indexItem,indexItem2) { 	return false; }
	});

	// preguntar por
	reactions.push ({
		id: 'ask_about',
		
		reaction: function (par_c) {

			// preguntar a cazador por honda
			if (par_c.item2Id == "cazador") {
				if (par_c.item1Id == "honda") { 
					primitives.GD_CreateMsg (1, "DLG_preguntar_a_cazador_por_onda", "Gracias a ella, he cazado innumerables presas.");
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_preguntar_a_cazador_por_onda");
					return true;
				}
			}

			// preguntar a vagabunda por anzuelo
			if (par_c.item2Id == "vagabunda") {
				if (par_c.item1Id == "anzuelo") { 
					primitives.GD_CreateMsg (1, "DLG_preguntar_a_vagabunda_por_anzuelo", "Le tengo mucho apego, me recuerda mi patria lejana.");
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_preguntar_a_vagabunda_por_anzuelo");
					return true;
				}
			}

			// preguntar a vieja o hechicera por flautista
			if ((par_c.item2Id == "vieja")||(par_c.item2Id == "hechicera")) {
				if (par_c.item1Id == "flautista") { 
					primitives.GD_CreateMsg (1, "DLG_preguntar_a_hechicera_por_flautista", "El flautista parece ser un simple campesino, pero es mucho más viejo y poderoso de lo que aparenta.");
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_preguntar_a_hechicera_por_flautista");
					return true;
				} else if (par_c.item1Id == "diamante") { 
					primitives.GD_CreateMsg (1, "DLG_preguntar_a_hechicera_por_diamante", "Es muy valioso para mí. Sin él esta cueva y toda mi vida es oscuridad.");
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_preguntar_a_hechicera_por_diamante");
					return true;
				} 
			}

			// preguntar a flautista por vieja o hechicera 
			if (par_c.item2Id == "flautista") { 
				if ((par_c.item1Id == "vieja")||(par_c.item1Id == "hechicera")) {
					// mejora: se podría complicar más según contexto
					primitives.GD_CreateMsg (1, "DLG_preguntar_a_flautista_por_hechicera", "La vieja de la cueva te maldijo por estar con quien ella cree que no debes. Pero quizás puedas hacerla entrar en razón si la satisfaces con algo.");
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_preguntar_a_flautista_por_hechicera");
					return true;
				} else if ((par_c.item1Id == "pájaros") || (par_c.item1Id == "pescados")) {
							
					primitives.GD_CreateMsg (1, "DLG_preguntar_a_flautista_por_comida", "Me da pereza ir a conseguir comida, prefiero que me la traigan.");
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_preguntar_a_flautista_por_comida");
					return true;

				}
			}
			
			return false;
			
		}
		
	});


	reactions.push ({
		id: 'talk',
		
		reaction: function (par_c) {
		
			if (par_c.item1Id == "vieja") {
				
				primitives.CA_QuoteBegin (par_c.item1Id, "" , [], false ); // inicia diálogo, sin decir nada aún
				primitives.GD_CreateMsg (1, "DLG_necesita_diamante", "Esta cueva está a oscuras desde que perdí mi piedra lunar. Antes esto resplandecía como un palacio. Te agradecería mucho si me lo recuperaras.");
				if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") <= "3") { // no bailó
					primitives.CA_QuoteContinues ("DLG_necesita_diamante", [], false );
				} else { // ya bailó , state == "4", pero no entregó diamante (sigue siendo la vieja)
					primitives.CA_QuoteContinues ("DLG_necesita_diamante", [], false );
					// to-improve: si lleva diamante, preguntar si lo da
				} 
				primitives.CA_QuoteContinues ("");
				
			} else if (par_c.item1Id == "hechicera") { // ya dieron el diamante
			
				primitives.CA_QuoteBegin (par_c.item1Id, "" , [], false ); // inicia diálogo, sin decir nada aún

				if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") == "4") { // no bebió la pócima
					if (primitives.IT_GetAttPropValue (primitives.IT_X("caldero"), "isLiquidContainer", "state") == "vacío") {
						primitives.GD_CreateMsg (1, "DLG_pide_agua_púrpura", "Tráeme el agua púrpura para que te pueda romper el hechizo.");
						primitives.GD_CreateMsg (1, "DLG_examina_pergamino", "Examina el pergamino para que sepas cómo obtenerla.");
						primitives.CA_QuoteContinues ("DLG_pide_agua_púrpura", [], false );
						primitives.CA_QuoteContinues ("DLG_examina_pergamino", [], false );
					} else {
						primitives.GD_CreateMsg (1, "DLG_bebe_pócima", "Bebe la pócima del recuerdo, cuando consideres oportuno.");
						primitives.CA_QuoteContinues ("DLG_bebe_pócima", [], false );
					}
					
				} else { 
					primitives.GD_CreateMsg (1, "DLG_atraviesa_a_catarata", "Ahora ya lo sabes todo. Ve al otro lado de la catarata a buscar tu destino");
					primitives.CA_QuoteContinues ("DLG_atraviesa_a_catarata", [], false );
					if (primitives.PC_X() == primitives.IT_X("vagabunda")) {
						primitives.GD_CreateMsg (1, "DLG_no_deberías_aquí", "Aunque no deberías hacerlo aquí.");
						primitives.CA_QuoteContinues ("DLG_no_deberías_aquí", [], false );
					}
				}
				primitives.CA_QuoteContinues ("");
			} else 	if ((par_c.item1Id == "cazador") || (par_c.item1Id == "vagabunda")) { // con el otro PJ: comportamiento casi idéntico
				return usr.talkPJ (par_c);
			}
		}
		
	});
		

	reactions.push ({
		id: 'look',
		
		reaction: function (par_c) {
			
			primitives.GD_CreateMsg (1, "undefined_gameParameters", "Este juego necesita tener definido el atributo gameParameters en la localidad inicial del juego<br/>"); 
			primitives.GD_CreateMsg (1, "bienvenida_juego", "Bienvenido a Las Tres Fuentes, aventura interactiva desarrollada en javascript. Sobre el mismo mundo base, puedes elegir entre jugar una versión reducida de tono más infantil o la versión completa, en la que controlas dos personajes.<br/>"); 
			primitives.GD_CreateMsg (1, "chooseversion", "¿Qué versión eliges?"); 
			primitives.GD_CreateMsg (1, "chooseversion_simple", "versión reducida"); 
			primitives.GD_CreateMsg (1, "chooseversion_long", "versión completa"); 
			primitives.GD_CreateMsg (1, "elegida_version_reducida", "Es una buena elección para acabarla en menos tiempo, pero la versión completa tiene un poco más de jugo.<br/><br/>");
			primitives.GD_CreateMsg (1, "intro_reducida_1", "Eres Laila la dragona. La bruja se ha cansado de que revolotees por ahí con tu hermano Kuko quemando cosas a diestro y siniestro y os ha lanzado un hechizo.<br/>");
			primitives.GD_CreateMsg (1, "intro_reducida_2", "Te ha convertido en humana y te ha sacado de la caverna del dragón, lejos de Kuko, al otro lado de la catarata.<br/>");
			primitives.GD_CreateMsg (1, "intro_reducida_3", "No vas a quedarte con los brazos cruzados. Que se prepare la bruja, que se va a enterar. Kuko, no desfallezcas, ¡ya voy!<br/>");
			primitives.GD_CreateMsg (1, "pulsa_para_ver_imagen_de_%o1", "Pulsa para ver imagen de %o1.<br/>");

			if (par_c.item1Id== "cruce_caminos") {
				if (!primitives.IT_ATT(par_c.item1, "gameParameters")) {
					primitives.CA_ShowMsg ("undefined_gameParameters");
					primitives.CA_EndGame("Error");
					return true;
				}
				
				var gameParameters_FIRSTPC = primitives.IT_GetAttPropValue (par_c.item1, "gameParameters", "firstPC");

				if (primitives.IT_GetAttPropValue (par_c.item1, "gameParameters", "version") == "") {
					
					if (typeof par_c.option == 'undefined') { // phase 1: asking dialog
					
						primitives.CA_ShowMsg ("bienvenida_juego");
						primitives.CA_ShowMsg ("chooseversion");

						var menu = ["chooseversion_simple","chooseversion_long"];
						primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2

						return true;

					} else { // getting answer
						if (par_c.option == 0) { // versión reducida
						
							primitives.IT_SetAttPropValue (par_c.item1, "gameParameters", "version","VR");

							primitives.CA_ShowMsg ("elegida_version_reducida");
							primitives.CA_ShowMsg ("intro_reducida_1");
							primitives.CA_ShowMsg ("intro_reducida_2");
							primitives.CA_ShowMsg ("intro_reducida_3");
							
							// se lleva al cazador a la caverna del dragón 
							primitives.IT_SetLoc (primitives.IT_X("cazador"), primitives.IT_X("caverna_dragón"));
							
							// flautista sólo da un regalo en vez de dos
							primitives.IT_SetAttPropValue (primitives.IT_X("flautista"), "generalState", "state","1");
							
							return true;
							
						} else {
							primitives.IT_SetAttPropValue (par_c.item1, "gameParameters", "version", "VC");
							
							primitives.GD_CreateMsg (1, "chooseversion_long_echo", "Has elegido la versión que elegiría un aventurero intrépido. Los protagonistas de este juego son dos amantes legendarios que han caído en desgracia ante una diosa opuesta a su amor. Aunque controlarás ambos personajes, elige ahora con quién empiezas, con la vagabunda, en realidad princesa del mar, que abandonó su patria por amor; o bien con el cazador, pariente de la diosa malvada.<br/><br/>"); 

							primitives.CA_ShowMsg ("chooseversion_long_echo");
							
							// importante para menú reentrante
							par_c.option = undefined; 
						}
					}
						
				} 

				if ((primitives.IT_GetAttPropValue (par_c.item1, "gameParameters", "version") == "VC") && (gameParameters_FIRSTPC == "")) {
					
					if (typeof par_c.option == 'undefined') { // phase 1: asking dialog
					
						primitives.GD_CreateMsg (1, "choosePC", "¿Con qué personaje quieres empezar jugando, ¿con la vagabunda o con el cazador?"); 
						primitives.GD_CreateMsg (1, "chooseprimitives.PC_woman", "la vagabunda"); 
						primitives.GD_CreateMsg (1, "chooseprimitives.PC_man", "el cazador"); 
					
						primitives.CA_ShowMsg ("choosePC");
					
						var menu = ["chooseprimitives.PC_woman","chooseprimitives.PC_man"];
						primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2
						return true;
					
					} else { // getting answer
						if (par_c.option == 0) {  // vagabunda
							primitives.IT_SetAttPropValue (par_c.item1, "gameParameters", "firstPC", "vagabunda");
						} else {
							primitives.IT_SetAttPropValue (par_c.item1, "gameParameters", "firstPC", "cazador");
							primitives.PC_SetIndex (primitives.IT_X("cazador"));
						}
						usr.intro ();
						primitives.CA_Refresh ();
					}	
				}

			}

			return false;
		}
		
	});
			  
	reactions.push ({
		id: 'drop',
		
		reaction: function (par_c) {
			
			primitives.GD_CreateMsg (1, "dejar_flauta", "Es un regalo del flautista, con quien te comprometiste a practicar antes de devolverla.<br/>");
			primitives.GD_CreateMsg (1, "pájaros_vuelan", "Al soltar los pájaros se van volando a la fuente roja.<br/>");
			primitives.GD_CreateMsg (1, "dejar_pájaros", "Al soltar los pájaros vuelven adonde estaban en la fuente roja.<br/>");
			
			// por ahora, no se puede dejar la flauta: quien la recibe es quien debe aprender con ella
			if (par_c.item1Id == "flauta") {
				primitives.CA_ShowMsg ("dejar_flauta");
				return true;
			}
			
			// al dejar pájaros, vuelan a su posición inicial
			if (par_c.item1Id == "pájaros") {
				if (primitives.PC_GetCurrentLoc() != primitives.IT_X("fuente_roja"))
					primitives.CA_ShowMsg ("pájaros_vuelan");
				else
					primitives.CA_ShowMsg ("dejar_pájaros");
				
				primitives.IT_SetLoc (primitives.IT_X("pájaros"), primitives.IT_X("fuente_roja"));
				return true;
			}
			
			if (par_c.item1Id == "cuenco") {
				// cuenco con agua dorada en tierras del sur, mata planta y habilita acceso a vagabunda 
				if (primitives.IT_GetAttPropValue (primitives.IT_X("cuenco"), "isLiquidContainer", "state") == "pócima") {
					primitives.GD_CreateMsg (1, "dejar_pócima", "¿Tirar algo que te ha costado tanto conseguir? Te lo piensas mejor y conservas la pócima.<br/>");
					primitives.CA_ShowMsg ("dejar_pócima");
					return true;
				}

				// cuenco se vacía al dejarlo
				primitives.GD_CreateMsg (1, "dejar_cuenco", "El contenido del cuento se vacía al caer al suelo.<br/>");
				primitives.CA_ShowMsg ("dejar_cuenco");

				if (primitives.IT_GetAttPropValue (primitives.IT_X("cuenco"), "isLiquidContainer", "state") == "dorada") { 
					if (primitives.PC_GetCurrentLoc() == primitives.IT_X("tierras_sur")) {
						if (primitives.IT_GetAttPropValue (primitives.IT_X("tierras_sur"), "generalState", "state") == "0") {
							primitives.GD_CreateMsg (1, "agua_dorada_mata_planta", "Vacias el agua sobre la planta, matándola y ensanchando un poco la entrada a la cueva.<br/>");
							primitives.CA_ShowMsg ("agua_dorada_mata_planta");
							primitives.IT_SetAttPropValue (primitives.IT_X("tierras_sur"), "generalState", "state", "1");
						}
					}				
				}
				primitives.IT_SetAttPropValue (primitives.IT_X("cuenco"), "isLiquidContainer", "state", "vacío");
				return false;
			}
			
			if (par_c.item1Id == "pócima") {
				primitives.CA_ShowMsg ("dejar_pócima");
				return true;
			}
			
			// cada arma inicial no se puede dejar hasta que se entrege al otro personaje
			if ( ((par_c.pc == primitives.IT_X("cazador")) && (par_c.item1Id == "honda") && (primitives.IT_GetAttPropValue (primitives.IT_X("vagabunda"), "generalState", "state") == "0")) ||
				 ((par_c.pc == primitives.IT_X("vagabunda")) && (par_c.item1Id == "anzuelo") && (primitives.IT_GetAttPropValue (primitives.IT_X("cazador"), "generalState", "state") == "0")) ) {
				primitives.GD_CreateMsg (1, "dejar_arma_inicial", "Te puede ser útil para conseguir comida o para ganarte la confianza de alguien. Lo conservas.<br/>");
				primitives.CA_ShowMsg ("dejar_arma_inicial");
				return true;
			}
			
			return false;
		}
		
	});

	reactions.push ({
		id: 'drink',
		
		enabled: function (indexItem) {
			if (primitives.IT_ATT(indexItem, "isLiquid")) {  // objeto es un líquido
				return true;
			} else if (primitives.IT_ATT(indexItem, "isLiquidContainer")) {  // objeto contiene un líquido
				return true;
			}
			// default
		},
		
		reaction: function (par_c) {
			
			var sacarlaDeCaverna = false;
			
			var liquido;
			if (primitives.IT_ATT(par_c.item1, "isLiquid")) {  // objeto es un líquido
				liquido = primitives.IT_GetAttPropValue (par_c.item1, "isLiquid", "state");
			} else 	if (primitives.IT_ATT(par_c.item1, "isLiquidContainer")) {  // objeto contiene un líquido
				liquido = primitives.IT_GetAttPropValue (par_c.item1, "isLiquidContainer", "state");
			}

			primitives.GD_CreateMsg (1, "bebida_agotada","No hay mucho que beber.<br/>");
			primitives.GD_CreateMsg (1, "beber_verde","Los filamentos verdes que tiene te dan algo de asco al principio, pero al final resulta que está rica y todo. En todo caso no te la bebes por completo.<br/>");
			primitives.GD_CreateMsg (1, "beber_dorada","Apesta a azufre. Al acercar la nariz, instintívamente te echas atrás y no la bebes.<br/>");
			primitives.GD_CreateMsg (1, "beber_roja","El rojo parece venir simplemente de restos de barro, sabe asquerosa y sólo la pruebas un poco, dejando el resto.<br/>");
			primitives.GD_CreateMsg (1, "beber_naranja","Aún huele algo a azufre, pero el agua roja parece haberla hecho potable... pero no te atreves a probarla.<br/>");
			primitives.GD_CreateMsg (1, "beber_púrpura","Un humano normal quizás no podría beberla, pero tú no eres un humano normal y este agua te trae recuerdos de la charca de la gruta. [PAUSA].  Al probarla te vienen recuerdos tristes de Kuko, ¿estará en la gruta?, ¿qué estará haciendo ahora?. No te la acabas, dejas para más tarde.<br/>");
			primitives.GD_CreateMsg (1, "repetir_pócima","Ya habías bebido, apúrate y déjate de perder el tiempo.<br/>");
			primitives.GD_CreateMsg (1, "aviso_pócima_grieta","Recuerda que la hechicera te dijo que si bebes recuperarás tu forma... y no podrías salir por la grieta.<br/>");
			primitives.GD_CreateMsg (1, "empiezas_a_crecer_dentro_caverna", "A pesar de que sabes internamente que no deberías hacerlo, no puedes evitar beberte la pócima dentro de la cueva... empiezas a crecer...!<br/>"); 
			primitives.GD_CreateMsg (1, "Menu_drinkNo_no_reaction", "Te lo piensas mejor y no te bebes la pócima todavía.<br/>");
			
			if (liquido == "vacío") {
				primitives.CA_ShowMsg ("bebida_agotada");
				return true;
			} else if (liquido == "verde") {
				primitives.CA_ShowMsg ("beber_verde");
				return true;			
			} else if (liquido == "dorada") {
				primitives.CA_ShowMsg ("beber_dorada");
				return true;			
			} else if (liquido == "roja") {
				primitives.CA_ShowMsg ("beber_roja");
				return true;			
			} else if (liquido == "naranja") {
				primitives.CA_ShowMsg ("beber_naranja");
				return true;			
			} else if (liquido == "púrpura") {
				primitives.CA_ShowMsg ("beber_púrpura");
				return true;			
			} else if (liquido == "pócima") {
				
				if ( primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") == "5")  {
					primitives.CA_ShowMsg ("repetir_pócima");
					return true;
				}
				
				// avisar para no beberla si vagabunda bebe en la cueva de la bruja
				if ((primitives.IT_GetLoc(primitives.PC_X()) == primitives.IT_X("cueva_bruja")) && (primitives.PC_X() == primitives.IT_X("vagabunda"))) {
					
					primitives.CA_ShowMsg ("aviso_pócima_grieta");

					if (typeof par_c.option == 'undefined') { // fase 1: preguna

						primitives.GD_CreateMsg (1, "Menu_drinkNow", "¿Estás segura de que quieres beber ahora?"); 
						primitives.CA_ShowMsg ("Menu_drinkNow");
						primitives.GD_CreateMsg (1, "Menu_drinkNo_yes", "Sí, quiero recuperar ya mi forma."); 
						primitives.GD_CreateMsg (1, "Menu_drinkNo_no", "No, esperaré a estar fuera."); 

						var menu = ["Menu_drinkNo_yes","Menu_drinkNo_no"];
						primitives.CA_ShowMenu (menu);

						return true;

					} else { // fase 2: obtiene respuesta
						if (par_c.option == 0) { // bebes y no "deberías" poder salir
							primitives.CA_ShowMsg ("empiezas_a_crecer_dentro_caverna");
							
							// en la versión corta, sacaremos por a la dragona con "calzador" y efectos especiales
							if (usr.getVersion() == "VR") {
					
								primitives.GD_CreateMsg (1, "VR_dragona_encerrada", "<br/><b>Teórico final del juego:</b> Al final la hechicera se salió con la suya y va a evitar que Kuko y tú hagáis más diabluras...<br/>");
								primitives.GD_CreateMsg (1, "perdona_vida_dragona_encerrada", "<br/><b>Mensaje del escritor del juego:</b> Al crecer no deberías haber podido salir de la cueva... pero vamos a hacer un poco de trampas y te dejaremos seguir jugando, fuera de la cueva.<br/><br/>");
								primitives.GD_CreateMsg (1, "deux_ex_machina_saprimitives.CA_dragona", "¡No! ¡No puedes dejar allí solito a Kuko sin nadie con quien jugar! Te precipitas a la grieta de salida y con tu nuevo cuerpo en crecimiento, agrandas la grieta y consigues salir de la cueva de la hechicera.<br/>");
								primitives.GD_CreateMsg (1, "date_prisa", "¡Debes darte prisa para volver al otro lado de la cascada!<br/>");

								primitives.CA_ShowMsg ("VR_dragona_encerrada");
								primitives.CA_ShowMsg ("perdona_vida_dragona_encerrada");
								primitives.CA_ShowMsg ("deux_ex_machina_saprimitives.CA_dragona");
								primitives.CA_ShowMsg ("date_prisa");
								
								primitives.IT_SetAttPropValue (primitives.PC_X(), "generalState", "state", "5"); // bebió
								primitives.IT_SetAttPropValue (primitives.IT_X("pócima"), "hasDecrementor", "active", "true"); // contador de 5 turnos

								primitives.IT_SetLoc (primitives.PC_X(), primitives.IT_X("tierras_sur"));
								
								primitives.CA_Refresh ();
								
								return true;
							
							}
							
						} else {

							primitives.CA_ShowMsg ("Menu_drinkNo_no_reaction");
							return true;
							
						}
					}

				}
				
				primitives.GD_CreateMsg (1, "cazador_recuerda_1", "Te acuerdas de cómo conociste a la hermosa princesa del mar cuando te hundiste en el océano en pos del anzuelo mágico que te había pedido tu hermano Hoderi.<br/>");
				primitives.GD_CreateMsg (1, "cazador_recuerda_2", "Recuerdas el día que llegásteis a tierra firme, huyendo de la furia de su padre y os instalásteis en la cabaña de madera, vuestro hogar.<br/>");
				primitives.GD_CreateMsg (1, "cazador_recuerda_3", "Recuerdas el día fatídico cuando tu pariente os condenó a olvidar que os habíais conocido.<br/>");
				primitives.GD_CreateMsg (1, "cazador_recuerda_4", "De repende comprendes que está embarazada de ti y que necesitas estar con ellos, pero recuerdas el consejo de tu pariente lejana: - deja que la dragona de a luz a solas, o lo lamentarás el resto de tu vida.<br/>");
				primitives.GD_CreateMsg (1, "cazador_recuerda_5", "Sabes que ella irá al otro lado de la catarata, ¿pero cuándo será el mejor momento para ir?<br/>");
				
				primitives.IT_SetAttPropValue (primitives.PC_X(), "generalState", "state", "5"); // bebió
				
				primitives.GD_CreateMsg (1, "empiezas_recordar","Al beberte la pócima los recuerdos comienzan a aflorar con claridad.<br/>");
				if (usr.getVersion() == "VC") 
					primitives.CA_ShowMsg ("empiezas_recordar");
				
				// inicio de contador a 5 turnos a la vagabunda para atravesar catarata 
				if (primitives.PC_X() == primitives.IT_X("vagabunda"))
					primitives.IT_SetAttPropValue (primitives.IT_X("pócima"), "hasDecrementor", "active", "true");
				
				primitives.IT_SetIsLocked (primitives.IT_X("fuente_verde"), "in", true);	// habilita entrada a caverna_dragón		
				
				if (primitives.PC_X() == primitives.IT_X ("vagabunda")) {
				
					primitives.GD_CreateMsg (1, "VC_vagabunda2_recuerda_1", "Te acuerdas de cómo conociste al cazador, de naturaleza semidivina, nada menos que el un pariente lejano de la diosa de la montaña, cuando fue a tu mundo submarino en búsqueda de un anzuelo mágico para su hermano Hoderi<br/>");
					primitives.GD_CreateMsg (1, "VC_vagabunda2_recuerda_2", "Recuerdas cómo os enamorásteis y huisteís porque porque las de tu especie deben dar a luz en tierra.<br/>");
					primitives.GD_CreateMsg (1, "VC_vagabunda2_recuerda_3", "Recuerdas el día en que supiste que estabas embarazada y el cazador se lo contó a su pariente lejana, el día en que os maldijo usando su bastón de fuerza con el diamante mágico, en la cabaña del monte, vuestro hogar.<br/>");
					primitives.GD_CreateMsg (1, "VC_vagabunda2_recuerda_4", "Y te acuerdas de tu naturaleza marina, que se empieza a derramar por entre tus piernas, has roto aguas y ya sabes lo que te ocurrirá, los de tu especie recuperan su horrenda naturaleza al alumbrar. Sabes que debes darte prisa y alumbrar a tu hijo en un lugar seguro, al otro lado de la cascada.<br/>");
					
					
					primitives.CA_ShowMsg (usr.getVersion() + "_vagabunda2_recuerda_1");
					primitives.CA_ShowMsg (usr.getVersion() + "_vagabunda2_recuerda_2");
					primitives.CA_ShowMsg (usr.getVersion() + "_vagabunda2_recuerda_3");
					primitives.CA_ShowMsg (usr.getVersion() + "_vagabunda2_recuerda_4");
					
					// si el cazador está presente... mala cosa!
					if (primitives.IT_GetLoc(primitives.PC_X()) == primitives.IT_GetLoc(usr.elOtroPJ(primitives.PC_X()))) {
						usr.perdiste_transformacionExterna();
					}
					
				} else {
					
					primitives.CA_ShowMsg ("cazador_recuerda_1");
					primitives.CA_ShowMsg ("cazador_recuerda_2");
					primitives.CA_ShowMsg ("cazador_recuerda_3");
					primitives.CA_ShowMsg ("cazador_recuerda_4");
					primitives.CA_ShowMsg ("cazador_recuerda_5");
				}
				
				return true;
					
			}
			
			return false;
		}
		
	});

	reactions.push ({
		id: 'give',
		
		reaction: function (par_c) {
			
			
			primitives.GD_CreateMsg (1, "no_acepto_regalos", "No acepto regalo de desconocidos.");
			primitives.GD_CreateMsg (1, "da_gracias", "Pues gracias.");
			primitives.GD_CreateMsg (1, "no_gracias", "No te preocupes, no me hace falta, gracias.");

			// al otro PJ
			if (par_c.item2 == usr.elOtroPJ(primitives.PC_X ())) { 
				// si no se conocen, no aceptan otra cosa que el arma
				if (primitives.IT_GetAttPropValue	(par_c.item2, "generalState", "state") == "0") {
					if ( ((par_c.item2Id == "cazador") && (par_c.item1Id == "anzuelo") ) ||
						 ((par_c.item2Id == "vagabunda") && (par_c.item1Id == "honda") ) ) {
							 
						primitives.GD_CreateMsg (1, "DLG_vagabunda_recibe_arma_1", "¡Muchas gracias, caballero!");
						primitives.GD_CreateMsg (1, "DLG_cazador_recibe_arma_1", "¡Muchas gracias, guapa!");
						primitives.GD_CreateMsg (1, "DLG_recibe_arma_2", "Creo que me puede ser útil. Hasta ahora le veía con desconfianza pero creo que me puedo fiar de ti. No sé por qué, pero me resultas familiar.");

						primitives.CA_QuoteBegin (par_c.item2Id, "DLG_" + par_c.item2Id + "_recibe_arma_1", [], false);
						primitives.CA_QuoteContinues ("DLG_recibe_arma_2");

						primitives.IT_SetAttPropValue	(par_c.item2, "generalState", "state", "1");
						primitives.IT_SetLoc (par_c.item1, par_c.item2);
					 } else {
						 primitives.CA_QuoteBegin (par_c.item2Id, "no_acepto_regalos");
					 }
				} else { // ya se conocen
					if (par_c.item1Id == "cuenco") {
						primitives.CA_QuoteBegin (par_c.item2Id, "da_gracias");
						primitives.IT_SetLoc (primitives.IT_X("cuenco"), par_c.item2);					 
					} else {
						// to-improve: por ejemplo, al devolver arma después de usarla
						primitives.CA_QuoteBegin (par_c.item2Id, "no_gracias");
					}
				}
				return true;
			}

			// al flautista:
			primitives.GD_CreateMsg (1, "flautista_hambriento_solo_quiere_comida", "Creo que no tienes nada de mi interés, lo que tengo es hambre.");
			if (par_c.item2Id == "flautista") {
				
				if (par_c.loc == primitives.IT_X("fuente_verde"))  { // flautista en fuente verde
				
					if ((par_c.item1Id == "pájaros") || (par_c.item1Id == "pescados")) { // dar comida al flautista
						if (usr.darComidaAFlautista(par_c.item1Id)) {
							return true;
						}
					} 
					
					// da otra cosa que no es comida
					if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") <= "2") { 
						primitives.CA_QuoteBegin (par_c.item2Id, "flautista_hambriento_solo_quiere_comida");
						return true;
					
					}		
				
				}
				
				// flautista, recibe flauta
				primitives.GD_CreateMsg (1, "flautista_rechaza_flauta_en_fuente_verde", "¿Crees que has practicado lo suficiente? Llévamela al risco lunar cuando estés preparado.");
				primitives.GD_CreateMsg (1, "flautista_al_recibir_flauta_en_risco", "¿Crees que has practicado lo suficiente? Déjame oir qué tal tocas primero.");
				if (par_c.item1Id == "flauta")  { // intentas darle la flauta
					if (par_c.loc == primitives.IT_X("fuente_verde")) {
						primitives.CA_QuoteBegin (par_c.item2Id, "flautista_rechaza_flauta_en_fuente_verde");
					} else { // en el risco lunar
						primitives.CA_QuoteBegin (par_c.item2Id, "flautista_al_recibir_flauta_en_risco");
					}
					return true;
				} 
				
				// flautista, recibe diamante
				if (par_c.item1Id == "diamante") { // recibe diamante
					primitives.GD_CreateMsg (1, "gracias_por_traer_piedra", "¡Gracias por traerme la piedra lunar!");
					primitives.GD_CreateMsg (1, "%o1 lo_guarda", "%o1 se lo guarda ávidamente.<br/>");
					
					primitives.CA_QuoteBegin (par_c.item2Id, "gracias_por_traer_piedra", [], false);
					primitives.CA_ShowMsg ("%o1 lo_guarda", {o1:"flautista"});
					primitives.IT_SetLoc (primitives.IT_X("diamante"), primitives.IT_X("flautista"));

					primitives.GD_CreateMsg (1, "VC_pide_que_practiques", "Debéis honrar mis oidos con buena música si queréis que os ayude con lo de vuestro hechizo.");
					primitives.GD_CreateMsg (1, "VR_pide_que_practiques", "Debes honrar mis oidos con buena música si quieres que te ayude con lo de tu hechizo.");
					primitives.CA_QuoteContinues (usr.getVersion() + "_pide_que_practiques");

					if (primitives.IT_GetLoc (primitives.IT_X("flautista")) == primitives.IT_X("risco_luna")) { // si ya en risco de la luna
						return true;
					} else {
						primitives.IT_SetLoc (primitives.IT_X("flautista"), primitives.IT_X("risco_luna"));
						primitives.GD_CreateMsg (1, "te_espero_en_risco", "Te espero en el risco lunar.");
						primitives.GD_CreateMsg (1, "ven_con_%o1", "No olvides venir con %o1.");
						
						primitives.CA_QuoteContinues ("te_espero_en_risco");
						if (usr.getVersion() == "VC") 
							primitives.CA_QuoteContinues ("ven_con_%o1", [primitives.IT_GetId(usr.elOtroPJ (primitives.PC_X()))]);
					}
					primitives.CA_QuoteContinues ("");
				
					return true;
				} 			

				
			}
					
			// dar diamante a la vieja
			if ((par_c.item1Id == "diamante") && (par_c.item2Id == "vieja")) {
				
				usr.transformacionVieja();
				return true;
			}
			
			// dar agua púrpura
			if (par_c.item1Id == "cuenco") {
				if (primitives.IT_GetAttPropValue (primitives.IT_X("cuenco"), "isLiquidContainer", "state") != "púrpura") {
					primitives.GD_CreateMsg (1, "DLG_no_acepto_agua_no_púrpura", "¿Y para qué quiero yo esa vulgar agua?");
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_no_acepto_agua_no_púrpura");
				} else { // agua púrpura
					if (par_c.item2Id == "vieja") { // a la vieja
						primitives.GD_CreateMsg (1, "DLG_dar_agua_púrpura_a_vieja", "Esa es una mezcla muy interesante. No sé cómo habrás averiguado para conseguirla, pero no me hace falta para nada.");
						primitives.CA_QuoteBegin (par_c.item2Id, "DLG_dar_agua_púrpura_a_vieja");
					} else if (par_c.item2Id == "hechicera") {
						if (primitives.IT_GetAttPropValue (primitives.IT_X("caldero"), "isLiquidContainer", "state") == "pócima")  {
							primitives.GD_CreateMsg (1, "DLG_ya_me_lo_habías_dado", "Ya me la habías dado antes, no te esfuerces tanto.");
							primitives.CA_QuoteBegin (par_c.item2Id, "DLG_ya_me_lo_habías_dado");
						} else {
							if (usr.getVersion() == "VC") {
								if (primitives.IT_GetLoc(primitives.PC_X()) != primitives.IT_GetLoc(usr.elOtroPJ(primitives.PC_X ()))) {
									primitives.GD_CreateMsg (1, "DLG_hechicera_pide_que_estén_ambos", "Debéis estar los dos aquí para que pueda hacer romper y fabricar la pócima de liberación.");
									primitives.CA_QuoteBegin (par_c.item2Id, "DLG_hechicera_pide_que_estén_ambos");
									return true;
								}
							}
							
							primitives.GD_CreateMsg (1, "DLG_hechicera_recibe_agua_púrpura", "La hechicera casi te quita el cuenco de las manos y vierte su contenido en el caldero.");
							primitives.CA_QuoteBegin (par_c.item2Id, "DLG_hechicera_recibe_agua_púrpura");
							primitives.IT_SetLoc (primitives.IT_X("cuenco"), primitives.IT_X("hechicera"));
							primitives.IT_SetAttPropValue (primitives.IT_X("caldero"), "isLiquidContainer", "state", "pócima");	
							// creación de la pócima
							primitives.GD_CreateMsg (1, "hechicera_hace_pócima", "Al darle el agua púrpura, la hechicera te hace realiza un florido ritual al rededor del caldero. Rayos multicolor brillan del diamante, confluyendo en el caldero. El agua púrpura gira y gira, cambiando de color, hasta quedar de un color... eternamente cambiante.<br/>");
							primitives.CA_ShowMsg ("hechicera_hace_pócima");
							
							// aviso al dar la pócima
							if (usr.getVersion() == "VR") {
								primitives.GD_CreateMsg (1, "DLG_VR_al_hacer_pócima_1", "Como recompensa por haberme traído antes el diamante, voy a devolverte tu aspecto original. Toma esta pócima y regresa a tu mundo, atravesando de nuevo la fuente verde");	
								primitives.GD_CreateMsg (1, "DLG_VR_al_hacer_pócima_2", "Pero recuerda: en cuanto bebas la pócima empezarás a crecer de manera incontenible y tendrás <b>poco tiempo</b> para atravesar la catarata y llegar a salvo en la gruta de los dragones, donde te espera tu amado Kuko. Si te retrasas, <u>volverás a tener tu forma humana</u> y quedarás separada de Kuko para siempre.");
								primitives.GD_CreateMsg (1, "DLG_VR_al_hacer_pócima_3", "Adiós dragona, ¡buena suerte!");
								
								primitives.CA_QuoteBegin (par_c.item2Id, "DLG_VR_al_hacer_pócima_1", [], false);
								primitives.CA_QuoteContinues ("DLG_VR_al_hacer_pócima_2", [], false);
								primitives.CA_QuoteContinues ("DLG_VR_al_hacer_pócima_3");
							} else { // versión completa
								primitives.GD_CreateMsg (1, "DLG_VC_al_hacer_pócima_1", "Como recompensa por habedme traído antes el diamante, os voy a liberar de mi hechizo. Sigo siendo contraria a vuestra unión: no veo natural que una criatura del mar se una con un príncipe de las montañas. Pero sóis granditos y ya veréis lo que haréis.");
								primitives.GD_CreateMsg (1, "DLG_VC_al_hacer_pócima_2", "Princesa Otohime, cuando tomes la pócima, empezarás a recuperar tu monstruosa forma original y en breve parirás a tu hijo. Ya casi no cabes por la grieta: no deberías beber aquí dentro. <b>¡Apresúrate!</b> Debes ir al otro lado de la catarata, lejos de la vista del cazador, que puede volverse loco al ver tu naturaleza sobrehumana.");
								primitives.GD_CreateMsg (1, "DLG_VC_al_hacer_pócima_3", "Hoori, apártate de su camino y no acudas a ella hasta después del alumbramiento. Cuando llegue el momento lo sabrás.");
								primitives.GD_CreateMsg (1, "DLG_VC_al_hacer_pócima_4", "Una última cosa. Después de que la princesa cruce la catarata, no podré evitar que se cumpla un pequeño efecto de mi maldición: la entrada a la catarata se cerrará y quedará sellada... ¡Pero qué mala soy!, ¡juá, juá, juá!");
								primitives.GD_CreateMsg (1, "DLG_VC_al_hacer_pócima_5", "Adiós, estúpidos amantes, ¡vuestro amor está condenado!");

								primitives.CA_QuoteBegin (par_c.item2Id, "DLG_VC_al_hacer_pócima_1", [], false);
								primitives.CA_QuoteContinues ( "DLG_VC_al_hacer_pócima_2", [], false);
								primitives.CA_QuoteContinues ( "DLG_VC_al_hacer_pócima_3", [], false);
								primitives.CA_QuoteContinues ( "DLG_VC_al_hacer_pócima_4", [], false);
								primitives.CA_QuoteContinues ( "DLG_VC_al_hacer_pócima_5");
							}

							primitives.GD_CreateMsg (1, "hechicera_hace_mutis", "El diamante brilla de manera cegadora y al recuperar la visión, ves que la hechicera ya no está, sólo el caldero con la pócima y el diamante, girando innacesible a gran altura e iluminando toda la cueva.<br/>");
							primitives.CA_ShowMsg ("hechicera_hace_mutis");
							
							primitives.IT_SetLocToLimbo (primitives.IT_X("hechicera"));
							primitives.IT_SetLoc (primitives.IT_X("cuenco"), primitives.PC_X());
							primitives.IT_SetLoc (primitives.IT_X("pócima"), primitives.IT_X("cueva_bruja")); // como un tipo más de fuente
							
							primitives.IT_SetAttPropValue (primitives.IT_X("cuenco"), "isLiquidContainer", "state", "vacío");
							
							// fin acto 3:
							primitives.GD_CreateMsg (1, "fin_acto_3", "<br/><br/>Aquí termina el acto III: o de cómo la pócima fue obtenida y la hechicera hizo mutis por el foro.<br/><br/>");
							primitives.CA_ShowMsg ("fin_acto_3");
							primitives.PC_Points (25);

						}
					} else  { // cuenco a otros PNJ (flautista)
						primitives.GD_CreateMsg (1, "DLG_no_quiero_eso", "¿Y para qué quiero esto? No gracias."); 
						primitives.CA_QuoteBegin (par_c.item2Id, "DLG_no_quiero_eso");
					} 
					
				}
				return true;
				
			}
				
			return false;
		}
		
	});


	reactions.push ({
		id: 'ask',
		
		reaction: function (par_c) {
					

			// preguntas al flautista
			if (par_c.item2Id == "flautista") {
				if (par_c.item1Id == "flauta") {
					
					if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") < "3") { // PJ no ha dado comida
						primitives.GD_CreateMsg (1, "DLG_dame_comida_por_flauta", "Tengo mucha hambre, dame algo de comer y ya veré si te daré la flauta u otra cosa.");
						primitives.CA_QuoteBegin (par_c.item2Id, "DLG_dame_comida_por_flauta");
						// to-improve: menú si el PJ lleva comida consigo
						return true;
					} else { // PJ ya dio comida
						primitives.GD_CreateMsg (1, "DLG_esperando_comida_de_otro_por_flauta", "Estoy esperando a que otra persona se la gane.");
						primitives.GD_CreateMsg (1, "DLG_flauta_ya_no_la_tengo", "Ya no la tengo.");
						if (primitives.IT_GetLoc(primitives.IT_X("flauta")) == primitives.IT_X("flautista")) { // aún la tiene el flautista
							primitives.CA_QuoteBegin (par_c.item2Id, "DLG_esperando_comida_de_otro_por_flauta");
						} else { 
							primitives.CA_QuoteBegin (par_c.item2Id, "DLG_flauta_ya_no_la_tengo");
						}
					}
					return true;
				} else if (par_c.item1Id == "vieja") {
					primitives.GD_CreateMsg (1, "DLG_flautista_sobre_vieja_a_cazador", "Esa pariente tuya de la cueva, aunque no lo creas, te ha perjudicado en el pasado. Ten cuidado con ella.");
					primitives.GD_CreateMsg (1, "DLG_flautista_sobre_vieja_a_vagabunda", "Esa vieja es una bruja y, aunque no lo creas, te ha perjudicado en el pasado. Ten cuidado con ella.");
					
					if (primitives.PC_X() == primitives.IT_X("cazador")) {
						primitives.CA_QuoteBegin (par_c.item2Id, "DLG_flautista_sobre_vieja_a_cazador");					
					} else {
						primitives.CA_QuoteBegin (par_c.item2Id, "DLG_flautista_sobre_vieja_a_vagabunda");
					}
					return true;
				}
			}

			primitives.GD_CreateMsg (1, "DLG_vieja_sobre_diamante", "Lo perdí y no lo encuentro, ayúdame a encontrarlo, por favor.");
			primitives.GD_CreateMsg (1, "DLG_vieja_sobre_flautista", "Le gusta mucho la música, pero es más que un simple flautista.");
			if (par_c.item2Id == "vieja")   {
				if (par_c.item1Id == "diamante") {
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_vieja_sobre_diamante");
					return true;
				} else if  (par_c.item1Id == "flautista") {
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_vieja_sobre_flautista");
					return true;
				}
			}

			if (par_c.item2Id == "hechicera")   {
				if (par_c.item1Id == "diamante") {
					primitives.GD_CreateMsg (1, "DLG_hechicera_sobre_diamante", "Qué bueno que me lo conseguiste recuperar.");
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_hechicera_sobre_diamante");
					return true;
				} else if (par_c.item1Id == "flautista") {
					primitives.GD_CreateMsg (1, "DLG_hechicera_sobre_flautista", "Ya veo que te dio la piedra de luz. Eres en verdad muy hábil.");
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_hechicera_sobre_flautista");
					return true;
				} else if (par_c.item1Id == "pócima") {
					primitives.GD_CreateMsg (1, "DLG_hechicera_sobre_pócima", "Con el agua púrpura y la piedra lunar se puede obtener la pócima que deshaga mi anterior hechizo.");
					primitives.CA_QuoteBegin (par_c.item2Id, "DLG_hechicera_sobre_pócima");
					return true;
				}
			}

			return false;
			
		},
		
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
	
	items.push ({
		id: 'fuente_roja',
				
		
		desc: function () {
			// by default, simply display associated [desc] built-in attribute
			primitives.CA_ShowDesc (this.index); 
			
			primitives.GD_CreateMsg (1, "fuente_roja_básico", "El agua aparenta ser venenosa y enfermiza");
			primitives.GD_CreateMsg (1, "fuente_roja_con_pájaros %o1", ", pero increíblemente %o1 beben de ella de manera despreocupada<br/>");
			
			primitives.CA_ShowMsg ("fuente_roja_básico");	
			if (primitives.IT_GetLoc(primitives.IT_X("pájaros")) == primitives.IT_X("fuente_roja")) {
				primitives.CA_ShowMsg ("fuente_roja_con_pájaros %o1", {o1:"pájaros"});
			}
			primitives.CA_ShowMsgAsIs(".<br/>");

		}
		
	});

	items.push ({
		id: 'fuente_verde',	
		
		desc: function () {
			
			// primitives.CA_ShowDesc (this.index); // por si hubiera una parte fija que siempre se mostrara
			primitives.GD_CreateMsg (1, "descripcion_fuente_verde_base", "¡La fuente verde! Una poderosa cascada cae desde una altura considerable y con gran fuerza. Un manto de musgo verde y líquenes crece por todos lados. Puedes ver un espectacular arcoiris causado por las gotitas de agua que saltan por todos lados tras chocar con el pequeño lago que se forma en la base, que también tiene una apariencia verde.<br/>");
			primitives.GD_CreateMsg (1, "mencionar_flautista_con_flauta", "Ves a un joven campesino a la sombra de un árbol, tocando despreocupadamente la flauta.<br/>");
			primitives.GD_CreateMsg (1, "mencionar_flautista_sin_flauta", "Ves al flautista sin su flauta, sentado despreocupadamente a la sombra de un árbol, cantando.<br/>");
			
			primitives.CA_ShowMsg ("descripcion_fuente_verde_base");
				
			if (primitives.IT_GetLoc(primitives.IT_X("flautista")) == primitives.PC_GetCurrentLoc ()) {
				if (primitives.IT_GetLoc(primitives.IT_X("flauta")) == primitives.IT_X("flautista")) {
					primitives.CA_ShowMsg ("mencionar_flautista_con_flauta");
				} else {
					primitives.CA_ShowMsg ("mencionar_flautista_sin_flauta");
				}
			}
			return true;

		},
		
		target: function (dirId) {
			if (dirId == "d90") {
				
				if (usr.getVersion() == "VC") 
					return "río";
				else 
					return "";
			} else if (dirId == "in") {
				if ( ( (primitives.PC_X() == primitives.IT_X("vagabunda")) && (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") == "5")) || // vagabunda bebió pócima
					 (primitives.PC_X() == primitives.IT_X("cazador")) )  // o simplemente cazador
					return "caverna_dragón";
				else
					return "locked";
			}
		}
		
	});


	items.push ({
		id: 'tierras_sur',
		
		desc: function () {
			
			primitives.CA_ShowDesc (this.index); // descripción estática predefinida.
			
			primitives.GD_CreateMsg (1, "hay_basura", "No hay nada digno de mención, sólo matorrares y basura llevada por el viento.<br/>");
			if (primitives.IT_GetLoc (primitives.IT_X("basura")) == primitives.PC_GetCurrentLoc ()) {
				primitives.CA_ShowMsg ("hay_basura");
			}

		},
		
		target: function (dirId) {

			if (dirId == "in") {
				if ( (primitives.PC_X() == primitives.IT_X("vagabunda")) && (primitives.IT_GetAttPropValue (primitives.IT_X("tierras_sur"), "generalState", "state") == "0") ) {
					return "locked";
				} else if ( (primitives.PC_X() == primitives.IT_X("vagabunda")) && (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") == "5") ) { // dragona no puede volver a la cueva de la bruja
					return "locked";
				} else { 
					if ((primitives.IT_GetLoc (primitives.IT_X("diamante")) == primitives.PC_X ()) && // si llevas el diamante, pero no has bailado aún... 
						(primitives.IT_GetAttPropValue (primitives.PC_X (), "generalState", "state") <= "3")) {
						return "locked";
					} else // puedes pasar
						return "cueva_bruja";
				}
			}
		},
		
		transitionTo: function (target) {
			
			if (target == primitives.IT_X ("cueva_bruja")) {
				
				primitives.GD_CreateMsg (1, "pasas_malamente_1", "Consigues pasar por la grieta por los pelos.<br/>");				
				primitives.GD_CreateMsg (1, "pasas_malamente_2", "Consigues pasar por la grieta con un poquito de holgura.<br/>");				

				if (primitives.IT_GetAttPropValue (primitives.IT_X("tierras_sur"), "generalState", "state") == "0") { // has pasado sin quitar planta (eres cazador)
					primitives.CA_ShowMsg ("pasas_malamente_1");
				} else {
					if (primitives.PC_X() == primitives.IT_X("vagabunda")) {
						primitives.CA_ShowMsg ("pasas_malamente_1");
					} else {
						primitives.CA_ShowMsg ("pasas_malamente_2");				
					}
				}

			}
		
		}
		
	});
			
	items.push ({
		id: 'caverna_dragón',
			
		target: function (dirId) {
			
			if (primitives.PC_X() == primitives.IT_X("cazador")) {
				if (dirId == "out") return "fuente_verde";
				if (dirId == "d270") return "escondite";
			}
			return "";
		}	

	});
			
			
	items.push ({
		id: 'cabaña',
		
		desc:	function () {
			
			primitives.CA_ShowDesc (this.index);
			
			if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") < "5") {
				primitives.GD_CreateMsg (1, "cabaña_te_suena", "Los trastos quemados dispersos y arruinados te suenan de algo, pero no sabes muy bien de qué.<br/>");
				primitives.CA_ShowMsg ("cabaña_te_suena");
				return true;
			}
			
			// ya tienes memoria
			primitives.GD_CreateMsg (1, "VC_vagabunda_recuerda_cabaña", "Ahora ves con otros ojos los restos de tu paraíso perdido, pero no tienes tiempo que perder regodeándote con el pasado.<br/>");
			primitives.GD_CreateMsg (1, "VC_cazador_recuerda_cabaña", "Recuerdas cómo era todo antes, antes incluso de ir al mundo marino. ¡Qué hermosa era la cabaña que con tanto esfuerzo construiste!<br/>");
			primitives.GD_CreateMsg (1, "VR_vagabunda_recuerda_cabaña", "No deberías perder el tiempo tan tontamente.<br/>");

			primitives.CA_ShowMsg (usr.getVersion() + primitives.IT_GetId(primitives.PC_X()) + "_recuerda_cabaña");
			return true;			

		},
		
		
	});
			
		
	items.push ({
		id: 'cueva_bruja',
		
		desc:	function () {
			
			// no se usa, descripción estática: primitives.CA_ShowDesc (this.index)
			primitives.GD_CreateMsg (1, "en_cueva_oscura", "En la oscura cueva, en la casa de la vieja.<br/>");
			primitives.GD_CreateMsg (1, "en_cueva_brillante", "En la resplandeciente cueva");
			primitives.GD_CreateMsg (1, "hechicera_presente %o1", ", con %o1");
			
			if (primitives.IT_GetLoc (primitives.IT_X("vieja")) == primitives.PC_GetCurrentLoc()) {
				primitives.CA_ShowMsg ("en_cueva_oscura");
			} else {
				primitives.CA_ShowMsg ("en_cueva_brillante");
				if (primitives.IT_GetLoc (primitives.IT_X("hechicera")) == primitives.PC_GetCurrentLoc()) {
					primitives.CA_ShowMsg ("hechicera_presente %o1", {o1:"hechicera"});
				}
				primitives.CA_ShowMsgAsIs (".<br/>");
			}
			return true;
		},
		
		target: function (dirId) {
			
			if (dirId == "out") {
				if ( (primitives.PC_X() == primitives.IT_X("vagabunda")) && (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") == "5") ) 	// dragona
					return "locked";
				else
					return "tierras_sur";
			}
			return "";
		},
		
		afterDescription: function () { // bienvenida de la vieja o de la hechicera
			
			var indexNPC = -1;
			
			if (primitives.IT_GetLoc (primitives.IT_X("vieja")) == primitives.PC_GetCurrentLoc()) {
				indexNPC = primitives.IT_X("vieja");
			} else if (primitives.IT_GetLoc (primitives.IT_X("hechicera")) == primitives.PC_GetCurrentLoc()) {
				indexNPC = primitives.IT_X("hechicera");
			} 
				
			if (indexNPC == -1) return; // ni vieja ni hechicera aquí
			
			var idNPC = primitives.IT_GetId(indexNPC);
			
			// la primera vez que coinciden
			if (!primitives.IT_GetIsItemKnown (primitives.PC_X(), indexNPC)) { // aún era desconocida
				// al entrar por primera vez, parrafada de bienvenida
				primitives.CA_QuoteBegin (idNPC, "" , [], false ); // inicia diálogo, sin decir nada aún
				
				primitives.IT_SetIsItemKnown (primitives.PC_X(), indexNPC); // marcar como conocida
				if (idNPC == "vieja") {
					primitives.GD_CreateMsg (1, "DLG_bienvenido_vagabunda", "Bienvenida a mi humilde hogar, princesa. Tú no me conoces, pero yo a ti sí. Sé que andas algo despistada. Si me encuentras la piedra lunar que perdí, te estaría muy agradecida.");
					primitives.GD_CreateMsg (1, "DLG_bienvenido_cazador", "Bienvenido, querido pariente, a mi humilde hogar. No, no me mires con esa cara. Lo de tu cabaña fue un fatal incidente del que no quiero hablar. Sólo tienes que saber que te libré de una víbora que te tenía apresado.");
					primitives.GD_CreateMsg (1, "DLG_bienvenido_cazador_2", "Verás que mi aspecto se ha deslucido desde la última vez que me viste. Ya no tengo la bella apariencia que tenía. El día de lo de tu cabaña perdí el diamante que conserva parte de mi poder, te agradecería si me lo pudieras recuperar.");
					
					primitives.CA_QuoteContinues ("DLG_bienvenido_" + primitives.IT_GetId(primitives.PC_X()), [], false );
					
					if (primitives.PC_X() == primitives.IT_X("cazador")) {
						primitives.CA_QuoteContinues ("DLG_bienvenido_cazador_2", [], false );
					}
				} else { // hechicera
					primitives.GD_CreateMsg (1, "DLG_bienvenido_a_cueva_luminosa", "¿Te gusta cómo reluce mi cueva con el poder de la luz encerrada?");
					primitives.CA_QuoteContinues ("DLG_bienvenido_a_cueva_luminosa", [], false );
				}
				primitives.CA_QuoteContinues ("");
			} 		
		}

	});

		
		
	// flautista (npc)
	items.push ({
		id: 'flautista',
		
		talk: function (par_c) {
			
			// here! primitives.GD_CreateMsg (1, "", "<br/>");

			if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") <= "1") {	// PJ aún no cazó
				primitives.GD_CreateMsg (1, "que_hambre", "¡Qué hambre tengo! Te estaría muy agradecido si me dieras algo de comer."); 

				primitives.CA_QuoteBegin ("flautista", "que_hambre");

				return true;	
				
			} else if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") == "2") {	// PJ ya cazó
				
				var comida = (primitives.PC_X() == primitives.IT_X("vagabunda"))?  "pájaros": "pescados";
				
				if (primitives.IT_GetLoc(primitives.IT_X(comida)) == primitives.PC_X()) { // si la lleva, encima, menú para facilitar donación
					
					if (typeof par_c.option == 'undefined') { // preguntar
					
						primitives.GD_CreateMsg (1, "DLG_hambre_y_se_que_cazaste", "Hay que hambre tengo! Sé que has cazado algo, ");
						primitives.CA_QuoteBegin ("flautista", "DLG_hambre_y_se_que_cazaste", [], false);
					
						//  pedir comida y esperar si/no
						primitives.GD_CreateMsg (1, "DLG_pregunta_si_das_comida", "¿Me das la comida?");
						primitives.CA_QuoteContinues ("DLG_pregunta_si_das_comida");				

						primitives.GD_CreateMsg (1, "flautista_das_comida_si", "Trato hecho!");
						primitives.GD_CreateMsg (1, "flautista_das_comida_no", "Va a ser que no.");

						var menu = ["flautista_das_comida_si","flautista_das_comida_no"];
						primitives.CA_ShowMenu (menu);
					} else { // respuesta
						if (par_c.option == "0") { // acepta comida y da algo a cambio
							usr.flautistaRecibeComida  (comida);
						} else {
							primitives.GD_CreateMsg (1, "DLG_qué_tacaño_eres", "qué tacaño eres, tú te lo pierdes. Yo sigo con lo mío, que cuando toco la música se me olvida el hambre.");
							primitives.CA_QuoteContinues ("DLG_qué_tacaño_eres");
							
							primitives.GD_CreateMsg (1, "flautista_toca", "El flautista toca su tonada...");
							primitives.CA_PlayAudio ("flauta1.mp3", true, "flautista_toca"); 
						}
					}
				} else {
					primitives.GD_CreateMsg (1, "DLG_ven_con_comida", "vuelve con lo que cazaste y hablamos.");
					primitives.CA_QuoteContinues ("DLG_ven_con_comida");				
				}
				return true;			
			} else if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") == "3") {	// ya dio comida y recibió "regalo" (flauta o consejo)
				if (primitives.PC_GetCurrentLoc() == primitives.IT_X("risco_luna")) {
					
					if (typeof par_c.option == 'undefined') { // preguntar
						primitives.GD_CreateMsg (1, "DLG_espero_músiprimitives.CA_con_diamante", "Espero escuchar buena música bajo la magia de la luna.");
						primitives.CA_QuoteBegin ("flautista", "DLG_espero_músiprimitives.CA_con_diamante", [], false);
						if ((primitives.PC_X() == primitives.IT_X("vagabunda")) && (primitives.IT_GetLoc(primitives.IT_X("diamante")) ==  primitives.IT_X("limbo"))) {
							primitives.GD_CreateMsg (1, "DLG_recuerda_diamante", "Recuerda que con tu visión de serpiente en la cabaña algo debes encontrar.", [], false);
							primitives.CA_QuoteContinues ("DLG_recuerda_diamante");
						}
						primitives.CA_QuoteContinues ("");
					}
				} else {
					primitives.GD_CreateMsg (1, "DLG_finito_te_veo_en_risco", "Ya te di lo que necesitabas. Cuando estés preparado, ve al risco de la luna.");
					primitives.CA_QuoteBegin ("flautista", "DLG_finito_te_veo_en_risco");
				}
				
				// vuelves con la flauta
				if (primitives.IT_GetLoc (primitives.IT_X("flauta")) == primitives.PC_X() ) { // llevas la flauta, el flautista está esperando a que toques la flauta
				
					 // incluye menú respondiendo a si tocarás				
					if (typeof par_c.option == 'undefined') { // preguntar
						primitives.GD_CreateMsg (1, "DLG_pregunta_si_tocas", "Venga, dame un gusto, y tócame una buena tonada bajo el influjo de la luna.");
						primitives.CA_QuoteBegin ("flautista", "DLG_pregunta_si_tocas");

						primitives.GD_CreateMsg (1, "tocas_flauta_si", "Vale, voy a probar, pero no creo que sepa.");
						primitives.GD_CreateMsg (1, "tocas_flauta_no", "Lo siento, pero no sé tocar la flauta.");

						var menu = ["tocas_flauta_si","tocas_flauta_no"];
						primitives.CA_ShowMenu (menu);
					} else { // respuesta
						if (par_c.option == "0") { 
							// aceptas tocar flauta
							usr.examenMusical(par_c);
						} else {
							primitives.GD_CreateMsg (1, "DLG_flautista_sin_oirte", "Así nunca sabré si has aprendido lo suficiente.");
							primitives.CA_QuoteBegin ("flautista", "DLG_flautista_sin_oirte");
						}
					}
				}
				
				return true;
			} else if (primitives.IT_GetAttPropValue (primitives.PC_X(), "generalState", "state") == "4") {	// ya bailó, pero aún sin pócima
				primitives.GD_CreateMsg (1, "DLG_envía_saludos_a_vieja", "Dale saludos a la vieja de mi parte.");
				primitives.CA_QuoteBegin ("flautista", "DLG_envía_saludos_a_vieja");
				return true;
			} else { // ya bebió
				primitives.GD_CreateMsg (1, "DLG_ya_bebiste_apurate", "Ya bebiste la pócima, apúrate con lo que debas hacer.");
				primitives.CA_QuoteBegin ("flautista", "DLG_ya_bebiste_apurate");
				return true;			
			}
						
			return false;
				
		}
			
	});
}

// GENERIC turn **********************************************************************************************

export function turn (indexItem) {

	if (indexItem == primitives.PC_X()) { // reacción sobre PJ, independiente de la acción elegida
		
		// contador total para dar a luz
		if (usr.getVersion() == "VC")  {
			// 300 turnos y contracción cada 15
			if (primitives.PC_GetTurn() == 300) {
				if (primitives.PC_X() == primitives.IT_X("vagabunda") ) {				
					primitives.GD_CreateMsg (1, "vagabunda_no_aguanta_más", "<br/>¡No aguantas más! El alumbramiento será ahora mismo.<br/>");
					primitives.CA_ShowMsg ("vagabunda_no_aguanta_más");
					usr.perdiste_transformacionExterna();
				} else if (primitives.IT_GetLoc(primitives.PC_X()) == primitives.IT_GetLoc(usr.elOtroPJ (primitives.PC_X()))) { // misma loc
					usr.perdiste_transformacionExterna();
				} else { 
					usr.perdiste_cazadorAusente ();
				}
			}			
			
			if (primitives.PC_GetTurn() % 15 == 0) {
				var contraciones_quedan = (300 - primitives.PC_GetTurn()) / 15;
				if (primitives.PC_X() == primitives.IT_X("vagabunda")) {
					primitives.GD_CreateMsg (1, "contracción %s1", "<br/><br/>¡Qué dolor! Te detienes en seco por una contracción.De alguna forma sabes que te quedan %s1 contracciones antes de dar a luz.<br/>");

					primitives.CA_ShowMsg ("contracción %s1" , {s1:contraciones_quedan}); 
				} else if (primitives.IT_GetLoc(primitives.PC_X()) == primitives.IT_GetLoc(usr.elOtroPJ (primitives.PC_X()))) { // misma loc
					primitives.GD_CreateMsg (1, "contracción_vista_por_cazador %s1", "<br/><br/>Ves cómo la vagabunda se detiene y se retuerce de dolor. De alguna forma sabes que le quedan %s1 contracciones antes de dar a luz.<br/>");

					primitives.CA_ShowMsg ("contracción_vista_por_cazador %s1" , {s1:contraciones_quedan}); 
					
				}
			}
		}
		
		// si versión larga y PJ en misma loc que el otro cuando dragona...
		if (usr.getVersion() == "VC") { // versión larga
			if (primitives.IT_GetLoc(primitives.PC_X()) == primitives.IT_GetLoc(usr.elOtroPJ (primitives.PC_X()))) { // misma loc
				if (primitives.IT_GetAttPropValue (primitives.IT_X("vagabunda"), "generalState", "state") == "5") { // ya bebió
					usr.perdiste_transformacionExterna();
				}
			} 
		}		
						
		if (primitives.IT_GetAttPropValue (primitives.IT_X("pócima"), "hasDecrementor", "active") == "true" ) {	
			var counter = +primitives.IT_GetAttPropValue (primitives.IT_X("pócima"), "hasDecrementor", "counter");
			
			// decremento manual (to-do: debería ser cosa de la librería)
			counter--;
			primitives.IT_SetAttPropValue (primitives.IT_X("pócima"), "hasDecrementor", "counter", counter);
			
			if (primitives.PC_X() == primitives.IT_X("vagabunda")) {

				

				if (counter < 4) {
					
					primitives.GD_CreateMsg (1, "cada_vez_más_grande", "Cada vez estás más grande!!<br/>");
					primitives.CA_ShowMsg("cada_vez_más_grande"); 
					if (counter < 0) {
						
						if (usr.getVersion() == "VR") {
							primitives.GD_CreateMsg (1, "perdona_vida_conversión_externa", "<br/><b>Mensaje del escritor del juego:</b> Te volviste a hacer humana y ya no podrás atravesar la catarata y reunirte con Kuko... pero te perdonamos la vida (no se lo digas a nadie) y te dejamos seguir jugando como dragona...<br/><br/>");
							primitives.GD_CreateMsg (1, "deux_ex_machina_dragona_vuela", "Cuando completas tu transformación, desplegas tus alas y atraviesas volando la catarata.<br/>");

							primitives.CA_ShowMsg ("perdona_vida_conversión_externa");
							primitives.CA_ShowMsg("deux_ex_machina_dragona_vuela");

							primitives.IT_SetLoc(primitives.PC_X(), primitives.IT_X("caverna_dragón"));
							usr.comprobarSiFinDelJuego();
							
						} else {
							usr.perdiste_transformacionExterna()
						}

					}
				}
			  
				return true;
				
			} else if (primitives.PC_X() == primitives.IT_X("cazador")) {
				// si vagabunda dio a luz mientras controlabas al cazador
				if ( counter < 0) {
					usr.perdiste_cazadorAusente ();					
				}
				
			}			
			
		}
		
	}
	
		
	// turno del PJ no activo (sólo en si versión completa)
	if (usr.getVersion() == "VC") {
		if ( (indexItem != primitives.PC_X()) && ((indexItem == primitives.IT_X("cazador")) || (indexItem == primitives.IT_X("vagabunda"))) ) {
			
			if (primitives.IT_GetLoc (indexItem) == primitives.PC_GetCurrentLoc()) { // misma localidad
				
				// si aún no confía en el PJ activo
				if (primitives.IT_GetAttPropValue (indexItem, "generalState", "state") == "0") { 
				
					if (primitives.IT_GetAttPropValue (indexItem, "generalState", "confianza") == "0") { 
					
						primitives.IT_SetAttPropValue (indexItem, "generalState", "confianza", "1");
						
						primitives.GD_CreateMsg (1, "%o1_desconfia", "%o1 te mira con desconfianza, no en balde sóis unos desconocidos.");
						primitives.CA_ShowMsg ("%o1_desconfia", {o1:primitives.IT_GetId(indexItem)} );

					} else if (primitives.IT_GetAttPropValue (indexItem, "generalState", "confianza") == "1") { 
						// después de coincidir un turno, se va
					
						primitives.GD_CreateMsg (1, "DLG_me_voy", "Disculpe que me vaya, no frecuento a desconocidos.");
						primitives.CA_QuoteBegin (primitives.IT_GetId(indexItem), "DLG_me_voy" );

						// lo resetea para el siguiente encuentro
						primitives.IT_SetAttPropValue (indexItem, "generalState", "confianza", "2");
										
						// se va
						usr.aOtraLocalidad(indexItem);
						
					}
					return true;
				}
			}
		}
	} 
	

}


// internal functions ****************************************************************************************************************

usr.getVersion = function () { 
	
	// "VR" o "VC": versión reducida o versión completa
	return this.primitives.IT_GetAttPropValue (this.primitives.IT_X("cruce_caminos"), "gameParameters", "version"); 
}

usr.examenMusical = function (par_c) {

	this.primitives.GD_CreateMsg (1, "DLG_anima_música", "¡Venga, dale!");
	this.primitives.CA_QuoteBegin ("flautista", "DLG_anima_música", [], false);

	// según pericia, más contento y mejor suena la flauta
	
	// si en risco lunar y flautista tiene el diamante
	this.primitives.GD_CreateMsg (1, "DLG_tocas_nivel_0", "Socorro, qué dolor! Vete de mi vista y no vuelvas hasta que hayas practicado más.");
	this.primitives.GD_CreateMsg (1, "DLG_tocas_nivel_1", "¿Cómo te atreves a hacer ese ruido sin haber practicado casi nada?");
	this.primitives.GD_CreateMsg (1, "DLG_tocas_nivel_2", "Vas mejorando, pero aún debes practicar algo más.");
	this.primitives.GD_CreateMsg (1, "DLG_tocas_nivel_3", "Practica un poco más y lo tendrás controlado.");
	this.primitives.GD_CreateMsg (1, "DLG_tocas_nivel_4", "¡Enhorabuena, estás hecho un virtuoso! Ahora ya eres digno de que yo toque la flauta para ti. Honraremos a la luna y ella hará algo por ti.");
	
	if (this.primitives.IT_GetAttPropValue (this.primitives.PC_X(), "generalState", "nivelMusical") == "0") {
		this.primitives.CA_PlayAudio ("flauta_nivel0.m4a", true, "DLG_tocas_nivel_0"); 
	} else 	if (this.primitives.IT_GetAttPropValue (this.primitives.PC_X(), "generalState", "nivelMusical") == "1") {
		this.primitives.CA_PlayAudio ("flauta_nivel1.m4a", true, "DLG_tocas_nivel_1"); 
	} else 	if (this.primitives.IT_GetAttPropValue (this.primitives.PC_X(), "generalState", "nivelMusical") == "2") {
		this.primitives.CA_PlayAudio ("flauta_nivel2.m4a", true, "DLG_tocas_nivel_2"); 
	} else 	if (this.primitives.IT_GetAttPropValue (this.primitives.PC_X(), "generalState", "nivelMusical") == "3") {
		this.primitives.CA_PlayAudio ("flauta_nivel3.m4a", true, "DLG_tocas_nivel_3"); 
	} else 	if (this.primitives.IT_GetAttPropValue (this.primitives.PC_X(), "generalState", "nivelMusical") > "3") {
		this.primitives.CA_PlayAudio ("flauta_nivel4.mp3", true, "DLG_tocas_nivel_4"); 
		
		if ( (this.primitives.IT_GetLoc(this.primitives.IT_X("diamante")) != this.primitives.PC_X()) && (this.primitives.IT_GetLoc(this.primitives.IT_X("diamante")) != this.primitives.IT_X("flautista")) ) { // no aquí
			this.primitives.GD_CreateMsg (1, "DLG_debes_traerme_diamante", "Pero para ello, la piedra lunar debe estar presente.");
			this.primitives.CA_QuoteContinues ("DLG_debes_traerme_diamante");
			return;
		}
		
		this.primitives.CA_QuoteContinues ("");
		
		if (this.primitives.IT_GetLoc(this.primitives.IT_X("diamante")) == this.primitives.PC_X()) {
			this.primitives.GD_CreateMsg (1, "flautista_recupera_diamante", "El flautista te quita el diamante, como quien recupera un viejo tesoro.");
			this.primitives.CA_ShowMsg ("flautista_recupera_diamante");
			this.primitives.IT_SetLoc (this.primitives.IT_X("diamante"), this.primitives.IT_X("flautista"));
		}
		
		usr.escenaBaile();
	
	}	
	
}


// agregar par_c.obj1 sobre objDestino
usr.agregarLiquido = function (par_c, objDestino) {
	
	var liquido1 = this.primitives.IT_GetAttPropValue (par_c.item1, "isLiquid", "state");
	var liquido2 = this.primitives.IT_GetAttPropValue (this.primitives.IT_X(objDestino), "isLiquidContainer", "state");

	if (liquido2 == "vacío") return liquido1;
	if (liquido2 == "normal") return liquido1;
	if (liquido1 == "") return "idem";
	if (liquido1 == liquido2) return "idem";

	// tercera 1: los elfos no se deja poner nada encima, quieren ser los últimos en llegar siempre
	if (liquido2 == "verde")  return "muerte1";

	// regla 2: elfo no puede estar con enano
	if (liquido1 == "verde" && liquido2 == "dorada") return "muerte2"; 

	// regla 3: elfo no puede estar encima del dragón
	if (liquido1 == "verde" && liquido2 == "roja") 	return "muerte3"; 

	// mezclas válidas
	if (liquido1 == "roja" && liquido2 == "dorada") return "naranja"; 
	if (liquido1 == "dorada" && liquido2 == "roja") return "naranja"; 
	
	if (liquido1 == "verde" && liquido2 == "naranja") return "púrpura";
	
	// mezclas redundantes
	return "idem";
	
}

usr.liquido2String = function(color) {
	if (color == "pócima") return "pócima";
	return "agua_" + color;
}


usr.escenaBaile = function() {
	
	if (this.primitives.IT_GetLoc (this.primitives.IT_X("diamante")) != this.primitives.IT_X("flautista")) return; // flautista no tiene el diamante
	if (usr.getVersion() == "VC") {
		if (this.primitives.IT_GetLoc(usr.elOtroPJ(this.primitives.PC_X ())) != this.primitives.PC_GetCurrentLoc()) { // si el otro PJ no está presente
			this.primitives.GD_CreateMsg (1, "DLG_falta_uno_para_transformación_lunar", "Debéis estar los dos presentes para honrar a la luna.");
			this.primitives.CA_QuoteBegin ("flautista", "DLG_falta_uno_para_transformación_lunar");
			return;
		}
	}
	
	this.primitives.GD_CreateMsg (1, "fluteTransformation", "El flautista empieza a tocar la flauta... que se transforma en sus manos en una flauta de oro, parece estar embrujada. Toca y toca sin poder parar... y van pasando las horas... hasta hacerse de noche. Ves cómo delante de ti el flautista cambia su aspecto a otra cosa más etérea, casi translúcida, y cómo milagrosamente se sigue observando el arco iris de la fuente verde a pesar de ser de noche."); 
	this.primitives.CA_PlayAudio ("flauta2.mp3", true, "fluteTransformation"); 

	// diamante -> vagabunda, si es que lo tenía el elfo
	this.primitives.IT_SetLoc (this.primitives.IT_X("diamante"), this.primitives.PC_X ());
	
	// flauta, se la queda el flautista
	this.primitives.IT_SetLoc (this.primitives.IT_X("flauta"), this.primitives.IT_X("flautista"));

	// marcado que bailaste
	this.primitives.IT_SetAttPropValue (this.primitives.PC_X (), "generalState", "state", "4");
	
	this.primitives.GD_CreateMsg (1, "VC_transformación_flautista_1", "El diamante brilla con una irreal hermosura. Vosotros, aún siendo casi unos desconocidos, os tomáis de la mano y comenzáis a bailar, horas y horas.<br/>");
	this.primitives.GD_CreateMsg (1, "VC_transformación_flautista_2", "Algunos recuerdos reaparecen, recordáis haber bailado entre corales y medusas. Cuando parece que el velo del olvido os abandona... cesa la música y con ella esos dulces recuerdos.<br/>");
	this.primitives.GD_CreateMsg (1, "VC_transformación_flautista_3", "Tardáis un momento en daros cuenta de que ha amanecido y el flautista ha dejado de tocar y ha vuelvo a recuperar la forma del flautista campestre.<br/>");
	this.primitives.GD_CreateMsg (1, "VR_transformación_flautista_1", "El diamante brilla con una irreal hermosura. Presa de una alegría incontrolada, comienzas a dar vueltas y bailar, horas y horas, hasta que cesa la música y tardas un momento en darte cuenta de que ha amanecido y el elfo ha dejado de tocar y ha vuelvo a recuperar la forma del flautista campestre.<br/>");
	this.primitives.GD_CreateMsg (1, "VR_transformación_flautista_2", "");
	this.primitives.GD_CreateMsg (1, "VR_transformación_flautista_3", "");
	this.primitives.GD_CreateMsg (1, "DLG_VC_id_con_vieja", "Id adonde la vieja bruja, ella sabrá perdonaros el hechizo con que os maldijo si le lleváis el diamante.");
	this.primitives.GD_CreateMsg (1, "DLG_VR_id_con_vieja", "Vete adonde la vieja bruja, ella sabrá perdonarte el hechizo con que os maldijo a ti y a Kuko, si le llevas el diamante.");
	this.primitives.GD_CreateMsg (1, "flaustista_desaparece_tras_árbol", "El flautista da un brinco y desaparece sin más detrás de un árbol. Al seguir sus huellas, ves que desaparecen sin más detrás del árbol.<br/>");
	this.primitives.GD_CreateMsg (1, "VC_fin_acto_2", "<br/><br/>Aquí termina el acto II: o de cómo el flautista hizo bailar a los dos tortolitos.<br/><br/>");
	this.primitives.GD_CreateMsg (1, "VR_fin_acto_2", "<br/><br/>Aquí termina el acto II: o de cómo el flautista hizo bailar a Laila hasta el amanecer.<br/><br/>");
	
	if (usr.getVersion() == "VC") {
		// marcamos al otro PJ que también bailó
		this.primitives.IT_SetAttPropValue (usr.elOtroPJ(this.primitives.PC_X ()), "generalState", "state", "4");
	}
	
	this.primitives.GD_CreateMsg (1, "DLG_VC_toma_diamante", "Tomad el diamante que tantos ansiáis. Id con él a la vieja bruja de la cueva.");
	this.primitives.GD_CreateMsg (1, "DLG_VR_toma_diamante", "Toma el diamante que tanto ansías. Ve con él a la vieja bruja de la cueva.");
	this.primitives.GD_CreateMsg (1, "DLG_VC_busqué_pero_no_encontré_diamante", "El día del maleficio yo vi por una ventana cómo la bruja os maldijo usando la piedra de luz. Vi que después de un rayo terrible, la piedra salió despedida... pero nunca la llegué a encontrar por mucho que busqué entre los restos del incendio.");
	this.primitives.GD_CreateMsg (1, "DLG_VR_busqué_pero_no_encontré_diamante", "Por la cabaña, esa que quemaste por accidente jugando con Kuko, vi cómo la bruja te lanzó un hechizo, usando la piedra de luz y te transformó en humana, encerrando a Kuko al otro lado de la catarata. Después de un rayo terrible, la piedra salió despedida... pero nunca la llegué a encontrar.");
	this.primitives.GD_CreateMsg (1, "DLG_es_hora_de_bailar", "Pero olvidemos el pasado... ¡hora es tiempo de bailar!");
	
	this.primitives.CA_QuoteBegin ("flautista", "DLG_" + usr.getVersion() + "_toma_diamante", [], false);
	this.primitives.CA_QuoteContinues ("DLG_" + usr.getVersion() + "_busqué_pero_no_encontré_diamante", [], false);
	this.primitives.CA_QuoteContinues ("DLG_es_hora_de_bailar");
	
	// escena del baile
	this.primitives.CA_ShowMsg (usr.getVersion() + "_transformación_flautista_1");
	this.primitives.CA_ShowMsg (usr.getVersion() + "_transformación_flautista_2");
	this.primitives.CA_ShowMsg (usr.getVersion() + "_transformación_flautista_3");
		
	this.primitives.CA_QuoteBegin ("flautista", "DLG_" + usr.getVersion() + "_id_con_vieja");

	this.primitives.CA_ShowMsg ("flaustista_desaparece_tras_árbol");

	// fin acto 2:
	this.primitives.CA_ShowMsg (usr.getVersion() + "_fin_acto_2");
	this.primitives.PC_Points (25);
	
	this.primitives.IT_SetLocToLimbo (this.primitives.IT_X("flautista"));	
}


usr.flautistaRecibeComida = function(comida) {
	
	this.primitives.IT_SetAttPropValue	(this.primitives.PC_X(), "generalState", "state", "3");
	this.primitives.IT_SetLocToLimbo (this.primitives.IT_X(comida));

	var regalo = "flauta";
	if (usr.getVersion() == "VC") {
		if (this.primitives.PC_X() == this.primitives.IT_X("vagabunda")) regalo = "pista";
	}

	this.primitives.GD_CreateMsg (1, "DLG_gracias_por_o1", "¡Gracias por %o1! Los prepararé a la brasa.");
	this.primitives.CA_QuoteBegin ("flautista","DLG_gracias_por_o1",[comida], false);
	
	if (regalo == "flauta") {
		this.primitives.GD_CreateMsg (1, "DLG_toma_flauta", "Toma la flauta, practica con ella. Cuando hayas alcanzado suficiente maestría con ella, búscame y demuéstrame lo que sabes si quieres mi ayuda.");
		this.primitives.CA_QuoteContinues ("DLG_toma_flauta", [], false);
		this.primitives.IT_SetLoc (this.primitives.IT_X(regalo), this.primitives.PC_X());
	} 
	
	if ((regalo != "flauta") || (usr.getVersion() == "VR") ) {
		this.primitives.GD_CreateMsg (1, "DLG_aviso_espejo", "Debes saber que tu visión de serpiente te permite ver lo que a otros está oculto. Mira con calma <u>en la cabaña</u> y tráeme lo que encuentres.");
		this.primitives.CA_QuoteContinues ("DLG_aviso_espejo", [], false);
	}
		
	// si flautista saciado de comer: anochece, se despide y se va al risco lunar
	this.primitives.GD_CreateMsg (1, "DLG_me_voy_al_risco", "Creo que me iré a echar una siesta al risco de la luna.");
	this.primitives.GD_CreateMsg (1, "DLG_te_espero_vagabunda", "Te espero allí, cuando estés list con mi piedra, princesa. A medianoche, con el cazador.");
	this.primitives.GD_CreateMsg (1, "DLG_te_espero_cazador", "Te espero allí, cuando estés listo para regalarme una bella tonada, cazador. A medianoche, con la vagabunda.");
	this.primitives.GD_CreateMsg (1, "DLG_VC_adelanto_baile", "Si me complacéis, esta noche la piedra lunar resplandecerá de manera especial y recuperaréis algo que habíais perdido, aunque sólo sea por un rato.");
	this.primitives.GD_CreateMsg (1, "DLG_VR_adelanto_baile", "Te espero allí, cuando estés lista. A medianoche ven a visitarme, pero sólo cuando hayas alcanzado maestría con la flauta y tengas la piedra lunar, que resplandecerá esta noche de manera especial.");
	this.primitives.GD_CreateMsg (1, "DLG_aún_espero_comida_del_otro", "Espero que tu media naranja me traiga algo de comer también.");

	this.primitives.CA_QuoteContinues ("DLG_me_voy_al_risco", [], false);
	if ((usr.getVersion() == "VC") && (this.primitives.IT_GetAttPropValue (usr.elOtroPJ(this.primitives.PC_X()), "generalState", "state") == "3")) {
		this.primitives.CA_QuoteContinues ("DLG_te_espero_"+ this.primitives.IT_GetId(this.primitives.PC_X()), [], false);
		this.primitives.IT_SetLoc (this.primitives.IT_X("flautista"), this.primitives.IT_X("risco_luna"));
		this.primitives.CA_QuoteContinues ("DLG_" + usr.getVersion() + "_adelanto_baile", [], false);
	} else if (usr.getVersion() == "VR") {
		this.primitives.IT_SetLoc (this.primitives.IT_X("flautista"), this.primitives.IT_X("risco_luna"));
		this.primitives.CA_QuoteContinues ("DLG_" + usr.getVersion() + "_adelanto_baile", [], false);
	} else { // el otro PJ aun no ha dado comida
		this.primitives.CA_QuoteContinues ("DLG_aún_espero_comida_del_otro", [], false);		
	}
	this.primitives.CA_QuoteContinues ("");

	if ( (usr.getVersion() == "VR") ||
		 ( (usr.getVersion() == "VC") && 
		   (this.primitives.IT_GetAttPropValue (this.primitives.PC_X(), "generalState", "state") == "3") && 
		   (this.primitives.IT_GetAttPropValue (usr.elOtroPJ (this.primitives.PC_X()), "generalState", "state") == "3") ) ) {
		// fin acto 1
		this.primitives.GD_CreateMsg (1, "VC_fin_acto_1", "<br/><br/>Aquí termina el acto I: o de cómo los dos amantes desmemoriados se reencontraron y colaboraron para dar de comer al hambriento flautista, que les dio una flauta y un consejo.<br/><br/>");
		this.primitives.GD_CreateMsg (1, "VR_fin_acto_1", "<br/><br/>Aquí termina el acto I: o de cómo Laila dio de comer al hambriento flautista y a cambio recibió una flauta para practicar música.<br/><br/>");
		this.primitives.PC_Points (25);
		this.primitives.CA_ShowMsg (usr.getVersion() + "_fin_acto_1");
	}
	
}



// hablar con el otro pc
usr.talkPJ = function (par_c) {
	
	this.primitives.CA_QuoteBegin (par_c.item1Id, "" , [], false ); // inicia diálogo, sin decir nada aún

	// la primera vez que coinciden
	if (!this.primitives.IT_GetIsItemKnown (par_c.pc, par_c.item1)) {
		this.primitives.GD_CreateMsg (1, "DLG_primer_saludo", "Buenos días, ¿nos conocemos? Su cara me resulta familiar.");
		this.primitives.CA_QuoteContinues ("DLG_primer_saludo", [], false );
	} 
	
	/* En función de los estados, variará el discurso
	   Siendo: EPJ el estadodel PJ y EPNJ el estado del PNJ interpelado
	*/
	
	var EPJ = this.primitives.IT_GetAttPropValue (par_c.pc, "generalState", "state");
	var EPNJ = this.primitives.IT_GetAttPropValue (par_c.item1, "generalState", "state");
	
	// episodio 1: antes de que bailen (tanto EPJ como EPNJ < 4)
	if ((EPJ<4) && (EPNJ<4)) {
		if (EPNJ == "0") { // PNJ no confía aún en PJ
			this.primitives.GD_CreateMsg (1, "DLG_No_le_conozco", "No le conozco, creo que no debería hablar con usted.");
			this.primitives.CA_QuoteContinues ("DLG_No_le_conozco", [], false );
		} else if (EPNJ < EPJ) {// PJ más avanzado que el PNJ
			this.primitives.GD_CreateMsg (1, "DLG_deberías_ayudar_a_%o1", "No tiene nada que aportarte a ti... pero tú sí a %o1.");
			this.primitives.CA_QuoteContinues ("DLG_deberías_ayudar_a_%o1", [par_c.item1Id], false );
		} else if (EPNJ >= "1" && EPJ == "0") {  // PNJ confía pero PJ desconfía
			this.primitives.GD_CreateMsg (1, "DLG_yo_confío", "Yo confío en ti, ¿qué podría hacer para que confiaras en mí?");
			this.primitives.CA_QuoteContinues ("DLG_yo_confío", [], false );
		} else if (EPNJ == EPJ &&  EPJ == "1" ) { // ya intercambiaron armas 
			this.primitives.GD_CreateMsg (1, "DLG_deberíamos_usar_armas", "Deberíamos usar las armas que hemos intercambiado.");
			this.primitives.CA_QuoteContinues ("DLG_deberíamos_usar_armas", [], false );
		} else if (EPNJ >= "2" && EPJ == "1" ) { // PNJ cazó, pero PJ aún no 
			this.primitives.GD_CreateMsg (1, "DLG_deberías_cazar", "Yo ya me cobré mi pieza, deberías hacer lo propio.");
			this.primitives.CA_QuoteContinues ("DLG_deberías_cazar", [], false );
		} else if (EPNJ == EPJ && EPJ == "2"  ) { //ambos cazaron
			this.primitives.GD_CreateMsg (1, "DLG_deberías_visitar_flautista_1", "quizás habría que ir a visitar al flautista de nuevo.");
			this.primitives.CA_QuoteContinues ("DLG_deberías_visitar_flautista_1", [], false );
		} else if (EPNJ >= "3" && EPJ == "2"  ) { // /PJN dio regalo al flautista no el PJ
			this.primitives.GD_CreateMsg (1, "DLG_deberías_visitar_flautista_2", "creo que el flautista podría ayudarte.");
			this.primitives.CA_QuoteContinues ("DLG_deberías_visitar_flautista_2", [], false );
		} else if (EPNJ == EPJ && EPJ == "3" ) { 
			this.primitives.GD_CreateMsg (1, "DLG_recordar_flautista_en_risco", "El flautista nos citó en el risco de la luna con la flauta y la piedra lunar.");
			this.primitives.CA_QuoteContinues ("DLG_recordar_flautista_en_risco", [], false );
		} else {
			this.primitives.GD_CreateMsg (1, "DLG_no_sé_qué_decir", "No sé qué decirte.");
			this.primitives.CA_QuoteContinues ("DLG_no_sé_qué_decir", [], false );
		}
		
		this.primitives.CA_QuoteContinues ("");
		
		return true;
	}
	
	// episodio 2: antes de que ninguno haya bebido pócima
	this.primitives.GD_CreateMsg (1, "DLG_debemos_conseguir_pócima", "¡Tenemos que conseguir la pócima!");
	this.primitives.GD_CreateMsg (1, "DLG_debemos_llevar_agua_púrpura", "Deberíamos llevar el agua púrpura para llevársela a la hechicera.");
	this.primitives.GD_CreateMsg (1, "DLG_vagabunda_aviso_1", "Por favor, aléjate del camino que lleva a la catarata, no te gustará verme después de que tome la pócima, hasta después del parto.");
	this.primitives.GD_CreateMsg (1, "DLG_cazador_aviso_1", "Estoy muy nervioso, no sé qué ocurrirá cuando tomes la pócima; tengo miedo, no quiero dejarte sola.");
	if ((EPJ ==4) && (EPNJ == 4)) { // (ya bailaron y el elfo les dijo que visitaran a la bruja y le dieran el diamante)
		if (!this.primitives.IT_GetIsItemKnown (par_c.item1, this.primitives.IT_X("hechicera"))) { // PNJ no conoce a la hechicera como tal
			this.primitives.CA_QuoteContinues ("DLG_debemos_conseguir_pócima", [], false );
		} else { //PNJ conoce a la hechicera como tal
			// PNJ: deberíamos visitar a la bruja/tu pariente lejana para que nos retire el hechizo a cambio del diamante
			if (this.primitives.IT_GetAttPropValue (this.primitives.IT_X("caldero"), "isLiquidContainer", "state") == "vacío") {  // no pócima en caldero
				this.primitives.CA_QuoteContinues ("DLG_debemos_llevar_agua_púrpura", [], false );
			} else { // PNJ conoce a la hechicera y existe pócima en caldero
				// reforzar avisos ya dados por hechicera
				this.primitives.CA_QuoteContinues ("DLG_" + par_c.item1Id + "_aviso_1", [], false );
			}
		}
		this.primitives.CA_QuoteContinues ("");
		return true;
	}
	
	// episodio 3: uno de los dos ya bebió la pócima (estado 5)
	this.primitives.GD_CreateMsg (1, "DLG_cazador_aviso_2", "Ya lo recuerdo todo, cariño. Recuerda que antes de beber tú, deberías dejar que me esconda.");
	if ((this.primitives.PC_X() == this.primitives.IT_X("vagabunda")) && (EPJ == 4)) { // vagabunda habla con cazador (quien ha bebido pócima)
		this.primitives.CA_QuoteContinues ("DLG_cazador_aviso_2", [], false );
	} else if ((this.primitives.PC_X() == this.primitives.IT_X("vagabunda")) && (EPJ == 5)) { // dragona es quien habla (no debería producirse)
		// ya habría acabado el juego, al ver visto a la dragona
		this.primitives.GD_CreateMsg (1, "DLG_te_avisé", "¡Te había avisado!, ¡aparta de mi camino!");
		this.primitives.CA_QuoteContinues ("DLG_te_avisé", [], false );
		usr.comprobarSiFinDelJuego ();
	} else if ((this.primitives.PC_X() == this.primitives.IT_X("cazador")) && (EPJ == 5)) { // habla cazador, que ya bebió pócima
		this.primitives.GD_CreateMsg (1, "DLG_vagabunda_aviso_2", "Cariño, ya lo recuerdas todo, pero yo cuando tome la pócima me transformaré en algo que no quiero que veas: aparta de mi camino a la catarata o lo lamentarás de la peor de las maneras.");
		this.primitives.CA_QuoteContinues ("DLG_vagabunda_aviso_2", [], false );
	} else if ((this.primitives.PC_X() == this.primitives.IT_X("cazador")) && (EPJ == 4)) { // habla cazador, sin haber bebido pócima, con la dragona
		// ya habría acabado el juego, al ver visto a la dragona
		this.primitives.GD_CreateMsg (1, "DLG_no_puede_ser", "¡No puede ser!, ¡monstruo del infierno!");
		this.primitives.CA_QuoteContinues ("DLG_no_puede_ser", [], false );
		usr.comprobarSiFinDelJuego ();
	}
	
	this.primitives.CA_QuoteContinues ("");
	return true;
}


usr.comprobarSiFinDelJuego = function() {

	if (this.primitives.IT_GetLoc (this.primitives.PC_X()) != this.primitives.IT_X("caverna_dragón")) return;

	if (usr.getVersion() == "VR") {
		
		this.primitives.GD_CreateMsg (1, "VR_ganaste", "Atraviesas la cascada verde y entras en tu cueva, tu hogar. Después de avanzar por un túnel llegas a una inmensa cueva repleta de monedas de oro y diamantes. Sobre ella reposa Kuko el dragón, que al verte lanza un fuego de alegría al aire y vuela hacia ti y te da un gran abrazo dragoniano con sus escamosas alas. Has vuelto al hogar, ¡¡HAS GANADO!!<br/>");
		this.primitives.CA_ShowMsg ("VR_ganaste");
		
		this.primitives.CA_ShowImg ("dos_dragones.jpg", true); 

		// fin acto 4 (ganando)
		this.primitives.GD_CreateMsg (1, "VR_fin_acto_4", "<br/><br/>Aquí termina el acto IV y último: o de cómo los dragones se reunieron y fueron buenos... por un tiempo.<br/><br/>");
		this.primitives.CA_ShowMsg ("VR_fin_acto_4");
		this.primitives.PC_Points (25);
		
		this.primitives.CA_EndGame ("Ganaste!");
		usr.creditos();
		
	} else {
		
		if (this.primitives.PC_X() == this.primitives.IT_X("vagabunda")) {
												
			this.primitives.GD_CreateMsg (1, "dragona_en_cueva", "Atraviesas la cascada verde y entras en tu cueva. Tras de ti, como profetizó la hechicera, rocas enormes caen y la catarata queda inaccesible desde el exterior.<br/>");
			this.primitives.CA_ShowMsg ("dragona_en_cueva");

			// si dragona atraviesa catarata y cazador no está en el escondite: fin del juego
			if (this.primitives.IT_GetLoc (this.primitives.IT_X("cazador")) == this.primitives.IT_X("caverna_dragón")) {
				// cazador ve llegar a la dragona: ui qué miedo!
				
				this.primitives.GD_CreateMsg (1, "dragona_en_cueva_pero_cazador_presente", "Al entrar en el que debería haber sido tu refugio... tu dicha se torna drama. El cazador está presente y te ve llegar.<br/>");
				this.primitives.CA_ShowMsg ("dragona_en_cueva_pero_cazador_presente");
				
				usr.perdiste_transformacionExterna();
				
			} else {
				
				this.primitives.CA_ShowMsg ("transformación_1a_persona");
				this.primitives.CA_ShowMsg ("alumbramiento_1a_persona");
				
				this.primitives.GD_CreateMsg (1, "sale_bebé_del_huevo", "Mientras te recuperas, observas cómo unas manitas rompen el huevo desde dentro. El huevo se desmorona dejando a la vista un bebé que rompe a llorar.<br/>");
				this.primitives.CA_ShowMsg ("sale_bebé_del_huevo");
				
				if (this.primitives.IT_GetLoc (this.primitives.IT_X("cazador")) == this.primitives.IT_X("escondite")) { // cazador la siente llegar... pero no la ve siendo dragona

					// final ok 

					this.primitives.GD_CreateMsg (1, "cazador_coge_bebé", "Una vez has recuperado tu forma humana, el cazador aparece de entre las sombras. Te abriga con una manta y coge al bebé en sus brazos, observando que, como su madre, tiene ojos de serpiente. Sois una extraña familia, pero una familia al fin y al cabo. Vuestro hijo, al que llamáis Ugayafukiaezu, está destinado a ser el padre del primer emperador del Japón.<br/>");
					this.primitives.CA_ShowMsg ("cazador_coge_bebé");
										
					this.primitives.GD_CreateMsg (1, "VC_fin_acto_4", "<br/><br/>Aquí termina el acto IV y último: o de cómo la feliz familia se reunió y el maleficio superó.<br/><br/>");
					this.primitives.CA_ShowMsg ("VC_fin_acto_4");
					this.primitives.PC_Points (25);
					
					// fin acto 4 (ganando)
					usr.creditos();

					this.primitives.CA_EndGame ("¡Ganaste!");
					
				} else  { // dramón, el cazador se quedó fuera de la caverna y se queda fuera
					
					this.primitives.GD_CreateMsg  (1, "dragona_recupera_forma_encerrada", "Recuperas tu forma y quedas con tu hijo en brazos. No hay salida posible para tu hijo. Por aquí corre un río subterráneo. Con lágrimas en los ojos, lo abandonas y sigues el curso del río, hacia tu patria subterránea.<br/>");
					this.primitives.CA_ShowMsg ("dragona_recupera_forma_encerrada");
					
					this.primitives.GD_CreateMsg (1, "VC_fin_acto_4_niño_a_solas", "<br/><br/>Aquí termina el acto IV y último: o de cómo el maleficio no fue superado y el niño-dragón, quedó abandonado.<br/><br/>");
					this.primitives.CA_ShowMsg ("VC_fin_acto_4_niño_a_solas");

					usr.epilogoAbandono();

					// fin acto 4 (perdiendo)
					this.primitives.CA_EndGame ("Perdiste");
			
				}
				
			}
			
		}
	}
}

usr.epilogoAbandono = function() {
	this.primitives.GD_CreateMsg (1, "VC_fin_acto_4_niño_a_solas_epílogo", "<br/><br/><b>Epílogo:</b> Una vez que la princesa del mar abandona a su vástago, aparece la hechicera.<br/><br/>");
	this.primitives.CA_ShowMsg ("VC_fin_acto_4_niño_a_solas_epílogo");
	
	this.primitives.GD_CreateMsg (1, "DLG_no_tienes_culpa_dragoncito", "Tú no tienes culpa de nada, niño dragón. Te llamaré Ugayafukiaezu. Con tu naturaleza y mis poderes serás poderoso.");
	this.primitives.CA_QuoteBegin ("hechicera", "DLG_no_tienes_culpa_dragoncito");
}

usr.epilogoCazadorAusente = function() {
	this.primitives.GD_CreateMsg (1, "VC_fin_acto_4_cazador_ausente", "<br/><br/><b>Epílogo:</b> Una vez que el cazador huye desconosolado del lugar, aparece la hechicera.<br/><br/>");
	this.primitives.CA_ShowMsg ("VC_fin_acto_4_cazador_ausente");
	
	this.primitives.GD_CreateMsg (1, "DLG_no_tienes_culpa_dragoncito", "Tú no tienes culpa de nada, niño dragón. Te llamaré Ugayafukiaezu. Con tu naturaleza y mis poderes serás poderoso.");
	this.primitives.CA_QuoteBegin ("hechicera", "DLG_no_tienes_culpa_dragoncito");
}

usr.creditos = function() {
	
	this.primitives.GD_CreateMsg (1, "gracias_por_jugar", "Gracias por jugar. Si no jugaste a la otra versión, te animamos a que lo hagas y veas las diferencias, se trata de una historia ligeramente diferente.<br/>");
	this.primitives.CA_ShowMsg ("gracias_por_jugar");
	this.primitives.GD_CreateMsg (1, "disclaimer", "Disculpa los bugs y fallos con los que probablemente te has encontrado en el juego. No dudes en hacernos llegar tus comentarios a %uludi.ludon@gmail.com__mailto:ludi.ludon@gmail.com%<br/>");
	this.primitives.CA_ShowMsg ("disclaimer");
	this.primitives.GD_CreateMsg (1, "próximas_versiones", "En próximas versiones del motor del juego, mejoraremos la jugabilidad y la parte colaborativa en red.<br/>");
	this.primitives.CA_ShowMsg ("próximas_versiones");
	
	this.primitives.GD_CreateMsg (1, "making_of_0", "<br/><b>The making of Las Tres Fuentes</b><br/><br/>");
	this.primitives.CA_ShowMsg ("making_of_0");

	this.primitives.GD_CreateMsg (1, "making_of_1", "La idea inicial del juego partió de la cascada de colores, en la isla de La Palma, islas Canarias, en el Parque Nacional de La Caldera de Taburiente. Si puedes ir alguna vez, disfrutarás mucho tanto de la cascada como de la caminata hasta llegar a ella.<br/>");
	this.primitives.CA_ShowMsg ("making_of_1");

	if (usr.getVersion() == "VC") {
		this.primitives.GD_CreateMsg (1, "making_of_2", "La idea del embarazo de la criatura marina, procede de la mitología japonesa: tira del hilo en %uhttps://es.wikipedia.org/wiki/Toyotama-hime__https://es.wikipedia.org/wiki/Toyotama-hime%, o buscando por Toyotama-hime (vagabunda), Hoori (cazador), Ōyamatsumi (bruja, diosa de las montañas) y Ugayafukiaezu (el niño dragón), que supuestamente sería el padre del emperador Jinmu, legendario primer emperador del Japón.<br/>");
		this.primitives.CA_ShowMsg ("making_of_2");
	}
	
}

usr.perdiste_cazadorAusente = function() {
	this.primitives.GD_CreateMsg (1, "presentimiento_del_cazador", "Un presentimiento te hiela la sangre. Algo ha sucedido. De alguna manera, sabes que la vagabunda ha dado a luz. Vas corriendo a la catarata, pero el acceso es imposible. ¿Qué habrá sido de la princesa?, ¿habrá nacido sano tu hijo? Vivirás para siempre con estas dudas.<br/>");
	this.primitives.CA_ShowMsg("presentimiento_del_cazador");
	
	this.primitives.GD_CreateMsg (1, "VR_fin_acto_4_presentimiento", "<br/><br/>Aquí termina el acto IV y último: o de cómo el hechizo no pudo ser superado y el cazador quedó sumido en sombra.<br/><br/>");
	this.primitives.CA_ShowMsg ("VR_fin_acto_4_presentimiento");

	usr.epilogoCazadorAusente();
	
	// fin acto 4 (perdiendo)
	this.primitives.CA_EndGame ("Has pedido");
	
}

usr.perdiste_transformacionExterna = function() {
	
	if (this.primitives.PC_X() == this.primitives.IT_X("cazador")) {
		this.primitives.GD_CreateMsg (1, "cambio_punto_de_vista_a_%o1", "<br/><b>Cambio de protagonista:</b> %o1<br/><br/>"); 
		
		this.primitives.PC_SetIndex (par_c.item1); // bug in previous version
		
		this.primitives.PC_SetIndex (this.primitives.IT_X("vagabunda")); 
		this.primitives.CA_ShowMsg ("cambio_punto_de_vista_a_%o1" , [this.primitives.IT_GetId(this.primitives.PC_X())]);
		
	}
	
	var cazadorPresente = (this.primitives.IT_GetLoc(this.primitives.PC_X()) == this.primitives.IT_GetLoc(usr.elOtroPJ(this.primitives.PC_X ())));
					
	this.primitives.GD_CreateMsg (1, "locura_3a_persona", "El cazador te observa espantado. Te ves reflejada en sus ojos, a medio transformar en tu forma marina. Ves cómo tu antes amado compañero se mea y caga encima y se va corriendo, espantado.<br/>"); 
	if (cazadorPresente) this.primitives.CA_ShowMsg ("locura_3a_persona");
	
	this.primitives.GD_CreateMsg (1, "transformación_1a_persona", "Concluyes tu transformación. Tu inmensa figura escamosa que algunos llaman dragón y otros, en lejanas tierras, sirena, no te deja moverte con facilidad. No es esta la forma en la que te conoció el cazador. Aquella era una mexcla grácil de ambos mundos; ahora tienes la forma puramente marina, sin rastro de humanidad.<br/>");
	this.primitives.GD_CreateMsg (1, "alumbramiento_1a_persona", "Con un ligero esfuerzo, de tu cuerpo sale un gran huevo rodeado de viscosidades varias.<br/>");
	this.primitives.GD_CreateMsg (1, "hechicera_expulsa_dragona_según_vagabunda", "Al rato, aparece la hechicera y con un sortilegio, esta vez inquebrantable, te envía de vuelta a tu mundo submarino. Nunca sabrás si la naturaleza de tu hijo será humana o marina, ni lo verás crecer, ni sabrás qué será de tu amante cazador.<br/>");
	this.primitives.GD_CreateMsg (1, "quien_sabe_si", "Quién sabe si en otro mundo paralelo el final de esta historia podría haber sido más feliz.<br/>");

	this.primitives.CA_ShowMsg ("transformación_1a_persona");
	this.primitives.CA_ShowMsg ("alumbramiento_1a_persona");
	this.primitives.CA_ShowMsg ("hechicera_expulsa_dragona_según_vagabunda");
	this.primitives.CA_ShowMsg ("quien_sabe_si");
	
	// fin acto 4 (perdiendo)
	this.primitives.GD_CreateMsg (1, "fin_acto_4_conversión_externa_sin_cazador", "<br/><br/>Aquí termina el acto IV y último: o de cómo la dragona parió y a su hijo abandonó.<br/><br/>");
	this.primitives.GD_CreateMsg (1, "fin_acto_4_conversión_externa_con_cazador", "<br/><br/>Aquí termina el acto IV y último: o de cómo el cazador enloqueció, la dragona parió y a su hijo abandonó.<br/><br/>");
	if (cazadorPresente) 
		this.primitives.CA_ShowMsg("fin_acto_4_conversión_externa_con_cazador"); 
	else
		this.primitives.CA_ShowMsg("fin_acto_4_conversión_externa_sin_cazador"); 
	
	usr.epilogoAbandono();
					
	this.primitives.CA_EndGame ("Has perdido");
	
} 

usr.aOtraLocalidad = function(indexItem) {

// 	simplemente,  lo enviamos de manera determinista a oro sitio cercano
	
	var nuevaLoc;
	
	if (this.primitives.IT_GetLoc (indexItem) == this.primitives.IT_X("cruce_caminos")) {
		nuevaLoc = "tierras_sur"; 
	} else if (this.primitives.IT_GetLoc (indexItem) == this.primitives.IT_X("risco_luna")) {
		nuevaLoc = "fuente_verde";
	} else if (this.primitives.IT_GetLoc (indexItem) == this.primitives.IT_X("río")) {
		nuevaLoc = "fuente_verde";
	} else if (this.primitives.IT_GetLoc (indexItem) == this.primitives.IT_X("cabaña")) {
		nuevaLoc = "tierras_sur";
	} else if (this.primitives.IT_GetLoc (indexItem) == this.primitives.IT_X("cueva_bruja")) {
		nuevaLoc = "tierras_sur";
	} else
		nuevaLoc = "cruce_caminos";
	
	this.primitives.GD_CreateMsg (1, "o1_se_va_a_o2", "<br/>%o1 se va a %o2.<br/>");
	this.primitives.CA_ShowMsg("o1_se_va_a_o2", {o1:this.primitives.IT_GetId(indexItem), o2:nuevaLoc} );
	this.primitives.IT_SetLoc (indexItem, this.primitives.IT_X(nuevaLoc));
	
}

usr.elOtroPJ = function(index) {
	return (index == this.primitives.IT_X("cazador"))?  this.primitives.IT_X("vagabunda") : this.primitives.IT_X("cazador");
}


usr.elOtroArma = function(index) {
	return (index == this.primitives.IT_X("honda"))?  this.primitives.IT_X("anzuelo") : this.primitives.IT_X("honda");
}

// la primera vez que pilotas un PJ
usr.intro = function() {
	
	if (this.primitives.IT_GetAttPropValue (this.primitives.IT_X("cruce_caminos"), "gameParameters", "firstPC") == "vagabunda") {

		this.primitives.GD_CreateMsg (1, "introWoman_1", "Eres la princesa del mar, deberías estar nadando con otras criaturas como tú... en vez de estar como ahora, con dos piernas y en tierra firme."); 
		this.primitives.GD_CreateMsg (1, "introWoman_2", "Imágenes confusas. Un guapo humano en tu mundo... luego, ya en tierra, una cabaña de madera, un incendio. Ruido, dolor... y ahora aquí, en mitad de ninguna parte."); 
		this.primitives.GD_CreateMsg (1, "introWoman_3", "Te levantas y te notas pesada. No sólo estás presa en este cuerpo humano y fuera de tu elemento, sino que descubres que estás embarazada y no sabes ni quién es el padre.<br/>"); 
		this.primitives.GD_CreateMsg (1, "introWoman_4", "-¡Padre!, ¡madre!, ¡quiero volver con vosotros!- gritas desconsoladamente."); 
		this.primitives.GD_CreateMsg (1, "introWoman_5", "Sin emabargo, sabes que las de tu raza cuando son concebidas por humanos deben dar a luz en tierra. Tu hijo podrá nacer humano u... otra cosa, más afín a ti, pero no lo sabrás hasta que llegue ese momento, muy cercano.<br/>"); 
		this.primitives.GD_CreateMsg (1, "introWoman_6", "¡Ui! Notas una contracción. El momento va a ser muy próximo. Debes encontrar un lugar protegido donde alumbrar... más aún sabiendo que en ese momento recuperarás tu verdadera apariencia, que helará de horror y odio a los humanos que te vean.</br>"); 

		this.primitives.CA_ShowMsg ("introWoman_1");
		this.primitives.CA_ShowMsg ("introWoman_2");
		this.primitives.CA_ShowMsg ("introWoman_3");
		this.primitives.CA_ShowMsg ("introWoman_4");
		this.primitives.CA_ShowMsg ("introWoman_5");
		this.primitives.CA_ShowMsg ("introWoman_6");	
	} else {
		this.primitives.GD_CreateMsg (1, "introMan_1", "Eres eres un cazador montaraz, de los pocos habitantes de esta recóndita región de la isla. Vives relativamente cerca de tu pariente lejana, la diosa de la montaña.");
		this.primitives.GD_CreateMsg (1, "introMan_2", "Te encuentras en tu cabaña... bueno, en lo que queda de ella: ¿quemada?, ¿pero qué diablos ha sucedido aquí? Miras a tu alrededor y descubres que el incendio fue hace muy poco. Aún queda algún rescoldo humeante.<br/>"); 
		this.primitives.GD_CreateMsg (1, "introMan_3", "¡Qué dolor de cabeza! ¿Qué habrá pasado? Lo último que recuerdas es que fuiste al mundo submarino en búsqueda del anzuelo mágico que necesitaba tu hermano, Hoderi."); 
		this.primitives.GD_CreateMsg (1, "introMan_4", "Había una bella joven, que se movía con la gracia de los delfines... y luego un rayo lanzado por la diosa de la montaña y la cabaña quemándose."); 
		this.primitives.GD_CreateMsg (1, "introMan_5", "Mi pariente lejana, en su cueva más allá de las tierras del sur, me tiene que ayudar a descubrir qué pasó.<br/>"); 

		this.primitives.CA_ShowMsg ("introMan_1");
		this.primitives.CA_ShowMsg ("introMan_2");
		this.primitives.CA_ShowMsg ("introMan_3");
		this.primitives.CA_ShowMsg ("introMan_4");
		this.primitives.CA_ShowMsg ("introMan_5");
	}
	
}

usr.transformacionVieja = function() {
	this.primitives.GD_CreateMsg (1, "transfomación_vieja", "Cuando la vieja toma el diamante, lo sostiene en alto, pronuncia unas frases ininteligibles para ti y el diamante comienza a brillar con fuerza iluminando toda la cueva. Te das cuenta ahora de lo inmensa que es la cueva. La vieja misma se transforma ante tus ojos en una bella dama vestida de negro, como la figura del cruce de caminos.<br/>");
	this.primitives.GD_CreateMsg (1, "DLG_VR_vieja_recibe_diamante", "Gracias por devolverme la piedra de luz que tenía elfo ruidoso. Necesito que me traigas el água púrpura, que conseguirás mezclando las aguas de las Tres Fuentes. Cuando me la traigas, pronunciaré un hechizo ante la luz sagrada y al beberte esa agua consagrada, recuperarás la forma que habías perdido.");
	this.primitives.GD_CreateMsg (1, "DLG_VC_vieja_recibe_diamante", "Gracias por devolverme la piedra de luz que tenía Kukonichi, bajo la forma de flautista campestre. No me preguntes cómo lo sabía. Es un ser más poderoso de lo que parece y no podía quitárselo por las buenas. Necesito que me traigas el água púrpura, que conseguirás mezclando las aguas de las Tres Fuentes. Cuando la traigas, vuelve con el otro y pronunciaré un hechizo ante la luz sagrada, para preparáos la pócima que os libere del hechizo que os hice. A beber esa agua consagrada, recuperaréis los recuerdos que os arrebaté.");
	this.primitives.GD_CreateMsg (1, "DLG_hechicera_da_instrucciones", "Toma estas instrucciones para que me prepares el agua púrpura, pues algunas mezclas de aguas de las Tres Fuentes son un tanto especiales.<br/>La hechicera te da un pergamino con instrucciones.");
	
	this.primitives.IT_SetLoc (this.primitives.IT_X("diamante"), this.primitives.IT_X("hechicera"));
	this.primitives.IT_BringHere (this.primitives.IT_X("hechicera"));
	this.primitives.IT_SetLocToLimbo (this.primitives.IT_X("vieja"));
	this.primitives.IT_SetLoc (this.primitives.IT_X("pergamino"), this.primitives.PC_X());
	
	this.primitives.CA_ShowMsg ("transfomación_vieja");
	this.primitives.CA_QuoteBegin ("hechicera", "DLG_" + usr.getVersion() + "_vieja_recibe_diamante", [], false);
	this.primitives.CA_QuoteContinues ("DLG_hechicera_da_instrucciones");
}

usr.darComidaAFlautista = function(item1Id) {
	
	this.primitives.GD_CreateMsg (1, "rechaza_comida", "Gracias por traerme algo de comer. Tengo hambre, pero sólo de algo hayas cazado tú.");
	this.primitives.GD_CreateMsg (1, "lo_espero_de_otro", "Gracias, aún tengo hambre, pero espero que me lo traiga otra persona.");
	var comida_esperada = "";

	if (this.primitives.PC_X() == this.primitives.IT_X("vagabunda")) comida_esperada = "pájaros";
	else if (this.primitives.PC_X() == this.primitives.IT_X("cazador")) comida_esperada = "pescados";
	
	if ( this.primitives.IT_GetAttPropValue (this.primitives.PC_X(), "generalState", "state") <= "2")  {
		if (comida_esperada == item1Id) {
			usr.flautistaRecibeComida (item1Id);
			return true;
		} else {
			this.primitives.CA_QuoteBegin ("flautista", "rechaza_comida");
			return true;
		}
	}
	
	if (this.primitives.IT_GetAttPropValue (this.primitives.PC_X(), "generalState", "state") == "3") {	// tú ya diste comida: ergo la comida que ofreces es la del otro personaje
		this.primitives.CA_QuoteBegin ("flautista", "lo_espero_de_otro");
		return true;
	}
	return false;
}

usr.aceptasPropuesta = function(option, superMsg, superParam, isDialog) {
	
	/*
		// plantilla de uso, donde "pregunta" es id de mensaje existente
		if (usr.aceptasPropuesta(par_c.option, ["pregunta"], []) == -1) return true; // fase 1
		if (par_c.option == 0) { // en fase 2 elegiste "sí"
			// ...
		} else { // elegiste "no"
			// ...
		}
		return true;
	*/
				
	if (typeof isDialog == 'undefined')  isDialog = false;
	
	if (typeof option == 'undefined') { // fase 1
	
		for (var i=0;i<superMsg.length;i++) {
			if (isDialog) this.primitives.CA_QuoteContinues (superMsg[i], superParam[i], false);	
			else this.primitives.CA_ShowMsg (superMsg[i], superParam[i]);
		}
		
		this.primitives.GD_CreateMsg (1, "aceptas_S_N", "¿Aceptas?");
		this.primitives.GD_CreateMsg (1, "eliges_si", "Sí");
		this.primitives.GD_CreateMsg (1, "eliges_no", "No");

		this.primitives.CA_ShowMsg ("aceptas_S_N");

		var menu = ["eliges_si","eliges_no"];
		this.primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2
		return -1;

	} else return option; // fase 2
					
}
						

