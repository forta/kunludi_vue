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

estudio.generalState.state: 0: primera vez; 1: siguientes
panfleto.generalState.state: 0 no leído; 1: leído
salón_comedor.generalState.state: 0: primera vez; 1: siguientes
barrotes.generalState.state: 0: entrada bloqueada; 1: entrada abierta
cuevita.generalState.state: 0: primera vez; 1: siguientes

Cuando aparece el fantasma: salón_comedor, cocina, camino_playa, y caleta usan atributo generalState.state como contador para forzar acciones.

---
embarazada.generalState.state: 0: no la conoces aún; 1: ya la conoces; 2: no sabes que va a tener gemelos; 3: ya sabes que va a tener gemelos; 4: ya comió chocolate y te dió la servilleta
hippie.generalState.state: 0: no lo conoces aún; 1: ya lo conoces y quiere marcha; 2: ya tuviste fiesta con él
---
cargador_móvil.generalState.state:  0: no conectado; 1: conectado: no te puedes mover de la habitación mientras se carga (aprovecha para escribir!)
manuscrito.generalState.state: minutos dedicados hoy al libro (se resetea a cero y cada sentada avanza hora y media; debes completar 6 horas al día)

escritor.generalState.state: número de días jugados

libro_magia.generalState.state: 0: muy bonito; 1:página del hechizo 1; 2:página del hechizo 2
cinturón.generalState.state: 0: sin atar a ningún sitio; 1: atado a los barrotes (en caleta o en cuevita): no deja que te vayas de la caleta al paseo;


móvil.apps.llamada: flujo de la conversacion: "" no iniciada; sino, el nombre del PNJ con el que se está hablando
móvil.apps.app_reloj: hora del día (empieza con 1020 al llegar a la casa; se incrementa 15 por turno; a las 1380 vas a dormir; te levantas a las 420)
móvil.apps.app_linterna: 0: apagado; 1: encendido
móvil.apps.app_mareas:  hora de la siguiente marea
móvil.apps.app_pilas: carga inicial del móvil (minutos que quedan). Valor inicial: 1440 (100%). Cambios: pierde 15 puntos por turno en modo normal; pierde 120 puntos por turno en modo linterna; gana 75 puntos por turno en modo carga; pierde 45 puntos si llamas.

cestaFreddie.generalState.state: array en formato json de los items pedidos a Freddie
cestaTelePapeo.generalState.state:  array en formato json de los items pedidos a TelePapeo

timbre.generalState.state: turnos que permanece el PNJ antes de irse

Horarios:
* luz solar: entre las 7:30 y las 18:00
* escritor (protagonista): despierto de 7:30 a 23:30
* vicky: despierta de 9:00 a 24:00, pero disponible en persona sólo de 10:00 a 17:00 (o sea, que el primer día sólo está disponible por cortesía por el tiempo pasado; luego, si sale es sólo para decir que está con el marido).
* charlie: despierto de 13:00 a 3:00, pero para quedar sólo a partir de las 20:00
* cueva accesible el día cero a las 8:35 y a las 21:00 durante 1h30m; día 1: a las 9:00 y a las 21:25; etc
* al resetear día: si marea < 7:30, entonces: marea+=745 minutos.

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
	
	if (typeof this.reactions[actionIndex].reaction == 'function') {
		return this.reactions[actionIndex].reaction (action)
	}
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



	reactions.push ({ 
	
		id: 'push',
		
		enabled: function (indexItem, indexItem2) {
			if ( (indexItem !=  primitives.IT_X("timbre_hippie")) && (indexItem !=  primitives.IT_X("timbre_embarazada")) ) return false;
			if (primitives.IT_GetLoc(indexItem) !=  primitives.PC_GetCurrentLoc()) return false
			return true
		},

		reaction: function (par_c) {
			
			var PNJIndex  = -1
			if (par_c.item1 ==  primitives.IT_X("timbre_hippie")) PNJIndex = primitives.IT_X("hippie")
			else PNJIndex = primitives.IT_X("embarazada")
		
			var PNJId = primitives.IT_GetId(PNJIndex)
			var dias = +primitives.IT_GetAttPropValue (primitives.IT_X("escritor"), "generalState", "state")

			if (par_c.option == undefined) {
				
				// reacción según disponibilidad horaria
				if (!usr.disponibilidadPNJ (PNJId)) {
					primitives.GD_CreateMsg (1, "nadie_sale_a_recibirte", "Después de esperar un rato, ves que nadie sale a recibirte. Estarán fuera o muy ocupados.<br/>"); 
					primitives.CA_ShowMsg("nadie_sale_a_recibirte");
					return
				}
			
				if (primitives.IT_GetLoc(PNJIndex) ==  primitives.PC_GetCurrentLoc()) {
					primitives.CA_QuoteBegin (PNJId, "" , [], false ); 
					primitives.GD_CreateMsg (1, "DLG_ya_estoy_aquí", "Ya estoy aquí, ¿para qué me llamas?");
					primitives.CA_QuoteContinues ("DLG_ya_estoy_aquí", [], true );
					return true
				} 
			
				// en el caso del hippie, te miran por la cámara y si no tienes bebidas no te hacen caso
				if ((PNJId == "hippie") && (primitives.IT_GetAttPropValue (primitives.IT_X("hippie"), "generalState", "state") != "0")) {

					if (primitives.IT_GetAttPropValue (primitives.IT_X("hippie"), "generalState", "state") == "2") {
						primitives.GD_CreateMsg (1, "sabes_que_no_te_abrirá", "Tocas el timbre, ves encenderse una luz sobre la cámara... pero sabes que después de la última fiesta salvaje Charlie no te va a abrir durante un tiempo.<br/><br/>"); 
						primitives.CA_ShowMsg("sabes_que_no_te_abrirá");
						return true
					}
					
					// aún pendiente de fiesta y setas
					primitives.GD_CreateMsg (1, "te_observan_por_cámara", "Notas cómo se enciende la luz de la cámara de seguridad y te observan unos segundos. Al final escuchas:<br/>"); 
					primitives.CA_ShowMsg("te_observan_por_cámara");

					// si llevas whisky, escena de fiesta y cambia estado del hippie a 2
					if ( (primitives.IT_IsCarried(primitives.IT_X("cestaTelePapeo"))) && 
   					     (usr.paqueteContiene (primitives.IT_X("cestaTelePapeo"), "whisky")) ) {
							 
						primitives.GD_CreateMsg (1, "DLG_welcome_whisky", "¡Mi hermano!, ¡qué bueno que vienes con provisiones! Entra, muchacho, bienvenido a nuestra humilde morada.");
						primitives.CA_QuoteBegin (PNJId, "DLG_welcome_whisky" , [], true ); 

						primitives.GD_CreateMsg (1, "fiestón", "<br/><br/>¿En qué momento se te ocurrió meterte en este lío? Al pasar por la puerta, el olor a marihuana te hace sentirte en casa y te acuerdas de tu plantita del estudio. Música a todo meter, gente guapa y mucha alegría. Con una sonrisa de oreja a oreja hablas entre gritos acerca tu nueva novela con unos perfectos desconocidos que te han adoptado como parte de su grupo. Uno de ellos te habla de ruidos y sucesos misteriosos ocurridos en tu casa: \'solemos entrar de okupas en las casas abandonadas durante mucho tiempo, ¿por qué crees que hemos respetado la tuya?\'<br/><br/>De madrugada te atreves a lanzar tu pregunta sobre si hay alguien que tenga setas alucinógenas, para \'documentarte\' en una cosa que escribes. El colega de un colega llama a un colega y a la media hora estás probando las setas. Menos mal que alcanzas a esconder unas en tu chaqueta antes de... perder la conciencia. Vagamente sientes que alguien te lleva a tu casa, pero es casi más un sueño que algo de lo que estés seguro.<br/><br/>"); 
						
						primitives.CA_ShowMsg("fiestón");
						primitives.IT_SetAttPropValue (primitives.IT_X("hippie"), "generalState", "state", "2")
						primitives.IT_SetLoc(primitives.IT_X("setas"), primitives.PC_X());
						primitives.IT_SetLoc(PNJIndex, primitives.IT_X("habitación_gemelos"))
						
						usr.reseteoDia ()
						
						return true
					}
					primitives.GD_CreateMsg (1, "DLG_donde_whisky", "Mi hermano, ¿dónde está el whisky? Creo que te has equivocado de fiesta.");
					primitives.CA_QuoteBegin (PNJId, "DLG_donde_whisky" , [], true ); 
					return true
				}
				
				// si están en casa, salen y quedan disponibles para que hables con ellos
				primitives.IT_SetLoc(PNJIndex, primitives.PC_GetCurrentLoc());
				primitives.GD_CreateMsg (1, "%o1_aparece", "%o1 aparece.");
				primitives.CA_ShowMsg ("%o1_aparece", {o1:PNJId});
				
				// tres turnos antes de irse
				primitives.IT_SetAttPropValue (primitives.IT_X("timbre_" + PNJId), "generalState", "state", "3")
			}
			
			// igual que talk
			return usr.hablarConPNJ (PNJIndex, par_c.option, false) // esTelefonico: false
		}
		
	});

	reactions.push ({
		id: 'write',
		
		enabled: function (indexItem,indexItem2) {
			if (indexItem !=  primitives.IT_X("manuscrito")) return false
			if (primitives.IT_IsCarriedOrHere(indexItem)) return true;
			return false
		},
		
		reaction: function (par_c) {
			
			// debes estar en habitación_gemelos, donde está el escritorio
			if (par_c.loc == primitives.IT_X("estudio")) {
				primitives.GD_CreateMsg (1, "escribes_en_estudio", "Eres un obseso de la literatura, empiezas retocando una cosita de tu manuscrito y cuando te das cuenta, ya llevas más de una hora con la revisión.<br/>"); 
				primitives.CA_ShowMsg("escribes_en_estudio");

				usr.incrementar_hora (6)

				return true
			}
				
			if (par_c.loc != primitives.IT_X("habitación_gemelos")) {
				primitives.GD_CreateMsg (1, "sitio_incorrecto_escribir", "Por comodidad no considerar oportuno escribir en otro sitio que no sea en el escritorio de tu antigua habitación.<br/>"); 
				primitives.CA_ShowMsg("sitio_incorrecto_escribir");
				return true
			}

			
			var estado_hora = usr.DividirMinutos (+primitives.IT_GetAttPropValue (primitives.IT_X("manuscrito"), "generalState", "state"))
			
			if (estado_hora.minutosDia >= 360) {
				primitives.GD_CreateMsg (1, "ya_escribiste_por_hoy", "Ya dedicaste tu ración diaria de escritura. Como tu conciencia está libre para hacer otras cosas, apartas el manuscrito a un lado.<br/>"); 
				primitives.CA_ShowMsg("ya_escribiste_por_hoy");
				primitives.IT_SetLoc(primitives.IT_X("manuscrito"), primitives.PC_GetCurrentLoc()); // si lo tienes, lo sueltas

				return true
			}
			
			primitives.GD_CreateMsg (1, "Sesión_escritura", "Te sientas en el escritorio y después de unos momentos de duda, coges carrerilla y cuando te das cuentas ha pasado más de una hora, tiempo en el que reescribes algunas partes de tu nueva novela.<br/>"); 
			primitives.CA_ShowMsg("Sesión_escritura");

			primitives.IT_SetAttPropValue (primitives.IT_X("manuscrito"), "generalState", "state", estado_hora.minutosDia + 120)

			usr.incrementar_hora (6)
			
			return true
		},
		
	});
	
	
	reactions.push ({
		id: 'eat',
		
		enabled: function (indexItem,indexItem2) {
			if (indexItem !=  primitives.IT_X("cestaTelePapeo")) return false
			return true
		},
		
		reaction: function (par_c) {
			
			var pedido = JSON.parse (primitives.IT_GetAttPropValue (primitives.IT_X("cestaTelePapeo"), "generalState", "state") )

			if ( (primitives.IT_IsAt(primitives.IT_X("cestaTelePapeo")) != primitives.IT_X("limbo")) && (pedido.length > 0) ) {

				primitives.GD_CreateMsg (1, "comesTelePapeo", "Es aburrida comida basura, pero tu prioridad en estos días no es comer bien.<br/><br/>"); 
				primitives.CA_ShowMsg("comesTelePapeo");

				primitives.IT_SetAttPropValue (primitives.IT_X("cestaTelePapeo"), "generalState", "state", "[]") 
			} else {

				primitives.GD_CreateMsg (1, "comesTelePapeoVacío", "Desconsolado, miras las restos que quedan, pero poco más.<br/><br/>"); 
				primitives.CA_ShowMsg("comesTelePapeoVacío");

			}
			return true

		},
		
	});
	
	
	reactions.push ({ 
		id: 'look',
		
		reaction: function (par_c) {
			
			if (par_c.loc == primitives.IT_X("estudio")) {
				
				if (primitives.IT_GetAttPropValue (par_c.loc, "generalState", "state") == "0") {
					
					primitives.GD_CreateMsg (1, "sueño", "No puedes respirar, estás encerrado en la cueva de la playa y no puedes escapar. De repente, un corrimiento de arena de la playa entra en la cueva y te cubre hasta la cintura y no puedes moverte. En tus manos tienes el collar de conchas marinas que has hecho para regalárselas a tu querido hermano...<br/>Pero no, no puede ser, estos no son recuerdos tuyos, sólo pueden ser los últimos recuerdos de ella, del día en que...<br/>Despiertas, mojado en sudor.<br/><br/>Te levantas, no crees que vayas a poder reconciliar el sueño. De hecho, temes volver a dormir y volver a vivir esa horrible experiencia.<br/><br/>"); 
					primitives.CA_ShowMsg ("sueño");

					primitives.GD_CreateMsg (1, "sueño_en_estudio", "Tienes la maleta casi preparada para el viaje de vuelta a la vieja casa familiar, en la costa. Sólo te hace falta meter un par de cosas más y podrás emprender ese viaje que llevas retrasando ya quince años.<br/>Deberías salir de casa antes de las 13:00 para no perder el avión.<br/>Has terminado el primer borrador de tu nueva novela y crees que la vieja casa te dará la tranquilidad necesaria para terminarla, lejos del ruido y las obligaciones de la ciudad.<br/><br/>"); 
					primitives.CA_ShowMsg ("sueño_en_estudio");

					primitives.IT_SetAttPropValue (par_c.loc, "generalState", "state", 1)
					
					return true;
				}
			}

		}
		
	});
	
	reactions.push ({ 
		id: 'wait',
		
		enabled: function (indexItem,indexItem2) {
			// si fantasma, no duermes
			if (+primitives.IT_GetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state") >=2) return false
			return true
		},
		
		reaction: function (par_c) {
			primitives.GD_CreateMsg (1, "perder_tiempo", "La cosa no está como para derrochar el tiempo, pero una cabezadita nunca viene mal... ZZZ.<br/>"); 
			primitives.CA_ShowMsg ("perder_tiempo");
			usr.incrementar_hora(4)
			return true
		}
		
	});
		

	reactions.push ({ 
		id: 'put_into',
		
		reaction: function (par_c) {

			if (par_c.item2Id == "chimenea") {
				if ((par_c.item1Id != "manuscrito") && (par_c.item1Id != "foto3") && (par_c.item1Id != "foto2")  && (par_c.item1Id != "servilleta")) {
					primitives.GD_CreateMsg (1, "no_dejar_meter_en_chimenea", "Podría ser interesante hacer que arda... pero no en esta ocasión.<br/>"); 
					primitives.CA_ShowMsg ("no_dejar_meter_en_chimenea");
					return true
				}
				if (primitives.IT_GetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state") == "0") {
					if (par_c.item1Id == "foto2") {
						primitives.GD_CreateMsg (1, "no_dejar_meter_foto2_en_chimenea", "Recuerdas que el libro arcano muestra una imagen de una madre con sus dos hijos.<br/>"); 
						primitives.CA_ShowMsg ("no_dejar_meter_foto2_en_chimenea");
						return true
					}
					primitives.GD_CreateMsg (1, "sin_motivo_para_dejar_meter_en_chimenea", "No ves el motivo para meter eso en la chimenea.<br/>"); 
					primitives.CA_ShowMsg ("sin_motivo_para_dejar_meter_en_chimenea");
					return true
				}
				
				primitives.GD_CreateMsg (1, "fantasma_asiente_cuando_metes_en_chimenea", "Una espantosa voz que viene de todos lados y ninguno grita un \'¡sí!\'.<br/>"); 
				primitives.CA_ShowMsg ("fantasma_asiente_cuando_metes_en_chimenea");
				// sino, tratamiento por defecto
			} else if (((par_c.item1Id == "cargador")||(par_c.item1Id == "móvil")) && ((par_c.item2Id == "maleta") || (par_c.item2Id == "estantería"))) {
				// meter cargador o móvil conectado
				if (primitives.IT_GetAttPropValue (primitives.IT_X("cargador"), "generalState", "state") != "0") {
					primitives.GD_CreateMsg (1, "meter_o1_mientras_se_carga_móvil", "¿Meter %o1 mientras el móvil se carga? Va a ser que no.<br/>"); 
					primitives.CA_ShowMsg ("meter_o1_mientras_se_carga_móvil", {o1:par_c.item1Id});
					return true
				}

			}
		}
		
	});
		
	
	reactions.push ({
		id: 'talk',
		
		reaction: function (par_c) {
		
			return usr.hablarConPNJ (par_c.item1, par_c.option, false) // esTelefonico: false

			
		}
		
	});
	
	reactions.push ({

		id: 'tie', 
		
		enabled: function (indexItem, indexItem2) {
			
			if (indexItem !== primitives.IT_X("cinturón")) return false;
			if ( (primitives.PC_GetCurrentLoc() != primitives.IT_X("cuevita")) &&
			     (primitives.PC_GetCurrentLoc() != primitives.IT_X("caleta")) ) return false
			if (primitives.IT_GetAttPropValue (indexItem, "generalState", "state") != "0")  return false

			return true;
		},
		
		reaction: function (par_c) {

			if (primitives.PC_GetCurrentLoc() == primitives.IT_X("cuevita")) {
				primitives.GD_CreateMsg (1, "atar_cinturón_en_cuevita", "Desde aquí no alcanzas los barrotes, deberás atar el cinturón desde fuera.<br/>"); 
				primitives.CA_ShowMsg ("atar_cinturón_en_cuevita");
				return true;				
			} 

			// la marea debe estar baja
			if (usr.minutosRestantesMarea() <= 0) {
				primitives.GD_CreateMsg (1, "atar_cinturón_barrotes_bajo_agua", "Los barrotes están bajo el agua y no consigues atar el cinturón, tendrás que esperar a que baje la marea.<br/>"); 
				primitives.CA_ShowMsg ("atar_cinturón_barrotes_bajo_agua");
				return true;
			}

			primitives.GD_CreateMsg (1, "atas_cinturón", "Atas el cinturón a los barrotes de la entrada a la cueva.<br/>"); 
			primitives.CA_ShowMsg ("atas_cinturón");
			
			primitives.IT_SetAttPropValue (par_c.item1, "generalState", "state", "1")

			return true;
		}
		
	});

	reactions.push ({

		id: 'untie', 
		
		enabled: function (indexItem, indexItem2) {
			
			if (indexItem !== primitives.IT_X("cinturón")) return false;
			if ( (primitives.PC_GetCurrentLoc() != primitives.IT_X("cuevita")) &&
			     (primitives.PC_GetCurrentLoc() != primitives.IT_X("caleta")) ) return false
			if (primitives.IT_GetAttPropValue (indexItem, "generalState", "state") == "0")  return false

			return true;
		},
		
		reaction: function (par_c) {

			if (primitives.PC_GetCurrentLoc() == primitives.IT_X("cuevita")) {
				primitives.GD_CreateMsg (1, "desatar_cinturón_en_cuevita", "Desde aquí no alcanzas los barrotes, deberás desatar el cinturón desde fuera.<br/>"); 
				primitives.CA_ShowMsg ("desatar_cinturón_en_cuevita");
				return true;				
			} 

			 // to-do:?? la marea debe estar baja
			if (usr.minutosRestantesMarea() <= 0) {
				primitives.GD_CreateMsg (1, "desatar_cinturón_barrotes_bajo_agua", "Los barrotes están bajo el agua y no consigues desatar el cinturón, tendrás que esperar a que baje la marea.<br/>"); 
				primitives.CA_ShowMsg ("desatar_cinturón_barrotes_bajo_agua");
				return true;
			}

			primitives.GD_CreateMsg (1, "desatas_cinturón", "Desatas el cinturón de los barrotes de la entrada a la cueva.<br/>"); 
			primitives.CA_ShowMsg ("desatas_cinturón");
			
			primitives.IT_SetAttPropValue (par_c.item1, "generalState", "state", "0")

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
		id: 'give', 
		
		// to-do: por ahora lo deshabilitamos en el juego
		enabled: function (indexItem, indexItem2) {
			return false
		},

		reaction: function (par_c) {
						
			// dar cesta a Vicky
			if ((par_c.item1Id  == "cestaTelePapeo") && (par_c.item2Id  == "embarazada")) {

				if (+primitives.IT_GetAttPropValue (par_c.item2, "generalState", "state") < 3) {
					// no te interesa nada de ella
					primitives.GD_CreateMsg (1, "antisocial", "Por ahora estás muy centrado en tu libro como para hacer vida social, así que al final no lo haces.<br/>"); 
					primitives.CA_ShowMsg ("antisocial");
				} else {
					usr.hablarConPNJ (par_c.item2, "Vicky_invitar_a_comer", false) // esTelefonico: false 
				}	
				
				return true

			}
		}
		
	});

	
	reactions.push ({ 
		id: 'drop', 
		
		reaction: function (par_c) {

			if (par_c.item1Id  == "móvil") {
				primitives.GD_CreateMsg (1, "nomobofia", "Cuando vas a dejarlo, te entra tu habitual ataque de nomobofia y no lo sueltas.<br/>"); 
				primitives.CA_ShowMsg ("nomobofia");

				return true
			}

			if (par_c.item1Id  == "collar") {
				primitives.GD_CreateMsg (1, "no_dejas_collar", "No te sientes capaz de soltar el collar que te hizo tu querida hermana antes de morir.<br/>"); 
				primitives.CA_ShowMsg ("no_dejas_collar");

				return true
			}

			if (primitives.PC_GetCurrentLoc() == primitives.IT_X("cuevita")) {
				primitives.GD_CreateMsg (1, "no_dejas_nada_en_cueva", "Mejor no dejar nada en la cueva, no vaya a ser que suba la marea y lo pierdas.<br/>"); 
				primitives.CA_ShowMsg ("no_dejas_nada_en_cueva");

				return true
			}

		}
		
	});

	reactions.push ({ 

		id: 'móvil_llamar', 
		
		enabled: function (indexItem, indexItem2) {
			
			if (indexItem != primitives.IT_X("móvil")) return false;
			
			return true;
		},
		
		reaction: function (par_c) {
			
			if (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas") == 0) {
				primitives.GD_CreateMsg (1, "sin_baterías", "Las baterías están gastadas. Tendrías que recargarlo primero.<br/>"); 
				primitives.CA_ShowMsg ("sin_baterías");
				return true;				
			}

			if (primitives.PC_IsAt (primitives.IT_X("estudio"))) {
				primitives.GD_CreateMsg (1, "llamar_desde_estudio", "Ves que en la agenda aparece Freddie, tu vecino de al lado, pero por ahora no ves la necesidad de llamarlo.<br/>"); 
				primitives.CA_ShowMsg ("llamar_desde_estudio");
				return true
			}
			
			var PNJId = primitives.IT_GetAttPropValue (par_c.item1, "apps", "llamada")
			
			if (PNJId == "") {
				if (typeof par_c.option == 'undefined') { // phase 1: asking dialog
				
					primitives.GD_CreateMsg (1, "llamar_a_quien", "¿A quién quieres llamar?<br/>"); 
					primitives.CA_ShowMsg ("llamar_a_quien");

					var menu = []
					
					primitives.GD_CreateMsg (1, "cancelar_acción", "Cancelar la acción"); 
					menu.push ({id:"cancelar", msg:"cancelar_acción"})

					primitives.GD_CreateMsg (1, "llamar_a_Freddie", "Freddie"); 
					menu.push ({id:"Freddie", msg:"llamar_a_Freddie"})

					if (primitives.IT_GetAttPropValue (primitives.IT_X("panfleto"), "generalState", "state") != "0") {
						primitives.GD_CreateMsg (1, "llamar_a_TelePapeo", "TelePapeo"); 
						menu.push ({id:"TelePapeo", msg:"llamar_a_TelePapeo"})
					}
					
					if (primitives.IT_GetAttPropValue (primitives.IT_X("hippie"), "generalState", "state") != "0") {
						primitives.GD_CreateMsg (1, "llamar_a_Charlie", "Charlie"); 
						menu.push ({id:"Charlie", msg:"llamar_a_Charlie"})
					}

					if (primitives.IT_GetAttPropValue (primitives.IT_X("embarazada"), "generalState", "state") != "0") {
						primitives.GD_CreateMsg (1, "llamar_a_Vicky", "Vicky"); 
						menu.push ({id:"Vicky", msg:"llamar_a_Vicky"})
					}

					primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2

					return true;

				} else { // getting PNJId
				
					if (par_c.option == "cancelar") {
						primitives.GD_CreateMsg (1, "no_llamas", "Al final no llamas a nadie"); 
						primitives.CA_ShowMsg ("no_llamas");
					} else PNJId = par_c.option
					
					primitives.IT_SetAttPropValue (par_c.item1, "apps", "llamada", PNJId)
					par_c.option = undefined  // para iniciar nuevo menu de PNJ
				}				
			} 

			PNJId = primitives.IT_GetAttPropValue (par_c.item1, "apps", "llamada")
			if (PNJId == "") return true // si no PNJ, salir 
			
			// fase de menús de los PNJs
			
			if (PNJId ==  "Freddie") usr.menuTelefonoFreddie (par_c.option)
			else if (PNJId ==  "TelePapeo") usr.menuTelePapeo (par_c.option)
			else if (PNJId ==  "Charlie") usr.menuTelefonoCharlie (par_c.option)
			else if (PNJId ==  "Vicky") usr.menuTelefonoVicky (par_c.option)
			else {
				primitives.GD_CreateMsg (1, "llamas_a_s1_y_cuelgas", "Llamas a %s1 y cuelgas.<br/>"); 
				primitives.CA_ShowMsg ("llamas_a_s1_y_cuelgas", {s1: PNJId });
			}
			
			return true;
		}
		
		
	});
	
	reactions.push ({ 

		id: 'móvil_estado', 
		
		enabled: function (indexItem, indexItem2) {
			
			if (indexItem != primitives.IT_X("móvil")) return false;
			
			return true;
		},
		
		reaction: function (par_c) {
			
			if (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas") == 0) {
				primitives.GD_CreateMsg (1, "sin_baterías", "Las baterías están gastadas. Tendrías que recargarlo primero.<br/>"); 
				primitives.CA_ShowMsg ("sin_baterías");
				return true;				
			}
			
			// si aún en estudio: es muy tarde, vas a perder el avión
			if (primitives.PC_GetCurrentLoc() == primitives.IT_X("estudio")) {
				primitives.GD_CreateMsg (1, "recuerdas_hora_avión", "Recuerdas que deberías salir antes de las 13:00 para el aeropuerto o perderás el avión que te lleva a la costa.<br/>"); 
				primitives.CA_ShowMsg ("recuerdas_hora_avión");
			}
			
			// calcular hora en función de app_reloj.state
			var estado_hora = usr.DividirMinutos (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_reloj"))
			primitives.GD_CreateMsg (1, "son_las_s1_s2", "Son las %s1:%s2."); 
			primitives.CA_ShowMsg ("son_las_s1_s2", {s1: estado_hora.horas, s2: estado_hora.minutos });

			// estado baterías
			estado_hora = usr.DividirMinutos (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas") )
			primitives.GD_CreateMsg (1, "batería_restante_s1_s2", " Tiempo restante de batería: %s1h%s2m."); 
			primitives.CA_ShowMsg ("batería_restante_s1_s2", {s1: estado_hora.horas, s2: estado_hora.minutos });
						
			if (primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_linterna") != "0") {
				primitives.GD_CreateMsg (1, "linterna_encendida", " Linterna encendida."); 
				primitives.CA_ShowMsg ("linterna_encendida");
			}
							
			if (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas") == 0) {
				primitives.GD_CreateMsg (1, "sin_baterías", "Las baterías están gastadas. Tendrías que recargarlo primero.<br/>"); 
				primitives.CA_ShowMsg ("sin_baterías");
				return true;				
			}
			
			primitives.CA_ShowMsgAsIs ("<br/>");

			// estado mareas
			if (+primitives.IT_GetAttPropValue (primitives.IT_X("hippie"), "generalState", "state") > 0) {
				
				var minutos = usr.minutosRestantesMarea()
				
				if (minutos > 0) {
					primitives.GD_CreateMsg (1, "bajamar_ahora_durante_s1", "La máxima marea baja está siendo ahora y acabará dentro de %s1 minutos.<br/>"); 
					primitives.CA_ShowMsg ("bajamar_ahora_durante_s1", {s1: minutos });
				} else {
					var horaBajamar = usr.DividirMinutos (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_mareas"))
					primitives.GD_CreateMsg (1, "próxima_bajamar_s1_s2", "La próxima marea baja será a las %s1:%s2.<br/>"); 
					primitives.CA_ShowMsg ("próxima_bajamar_s1_s2", {s1: horaBajamar.horas, s2: horaBajamar.minutos });
				}
			}
			
			// cargándose
			if (primitives.IT_GetAttPropValue (primitives.IT_X("cargador"), "generalState", "state") == "1") {
				primitives.GD_CreateMsg (1, "móvil_cargándose", "Se está cargando ahora.<br/>");
				primitives.CA_ShowMsg ("móvil_cargándose");			
				if (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas") >= 1440) {
					primitives.GD_CreateMsg (1, "baterías_móvil_llenas", "Las baterías están llenas.<br/>");
					primitives.CA_ShowMsg ("baterías_móvil_llenas");			
				}
			}
			
			return true;
			
		}
		
	});

	reactions.push ({ 

		id: 'encender_linterna', 
		
		enabled: function (indexItem, indexItem2) {
			
			if (indexItem != primitives.IT_X("móvil")) return false;
			if (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas") == 0) return false
			
			return (primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_linterna") == "0")
		},
		
		reaction: function (par_c) {
			
			primitives.GD_CreateMsg (1, "enciendes_linterna", "Enciendes la linterna del móvil.<br/>"); 
			primitives.CA_ShowMsg ("enciendes_linterna");
			primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_linterna", "1")
			return true;
			
		}
		
	});
			
	reactions.push ({ 

		id: 'apagar_linterna', 
		
		enabled: function (indexItem, indexItem2) {
			
			if (indexItem != primitives.IT_X("móvil")) return false;
			if (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas") == 0) return false
			
			return (primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_linterna") == "1")
			
			return true;
		},
		
		reaction: function (par_c) {
			
			primitives.GD_CreateMsg (1, "apagas_linterna", "Apagas linterna del móvil<br/>"); 
			primitives.CA_ShowMsg ("apagas_linterna");
			primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_linterna", "0")		
			
			return true;
			
		}
		
	});

	reactions.push ({ 

		id: 'cargar', 
		
		enabled: function (indexItem, indexItem2) {
			
			var otherItem
			
			if (indexItem == primitives.IT_X("cargador")) otherItem = primitives.IT_X("móvil")
			else if (indexItem == primitives.IT_X("móvil")) otherItem = primitives.IT_X("cargador")
			else return false
			 
			if (!primitives.IT_IsCarriedOrHere(indexItem)) return false
			if (!primitives.IT_IsCarriedOrHere(otherItem)) return false
			
			if (primitives.IT_GetAttPropValue (primitives.IT_X("cargador"), "generalState", "state") != "0") return false
			
			return true;
		},
		
		reaction: function (par_c) {
				
			if ( ! usr.bajoTecho() ){
				primitives.GD_CreateMsg (1, "sin_enchufe", "Aquí no hay ningún enchufe donde cargarlo.<br/>");
				primitives.CA_ShowMsg ("sin_enchufe");
				return true;				
			}
						
			primitives.IT_SetAttPropValue (primitives.IT_X("cargador"), "generalState", "state", "1")
			primitives.GD_CreateMsg (1, "lo_pones_a_cargar", "Pones el móvil a cargar, a ver si no tarda mucho.<br/>");
			primitives.CA_ShowMsg ("lo_pones_a_cargar");			

			return true;				

		}
		
	});	
	
	reactions.push ({ 

		id: 'desconectar', 
		
		enabled: function (indexItem, indexItem2) {
			
			if ( (indexItem != primitives.IT_X("cargador")) && (indexItem != primitives.IT_X("móvil")) ) return false;	
			if (primitives.IT_GetAttPropValue (primitives.IT_X("cargador"), "generalState", "state") == "0") return false
			return true;
		},
		
		reaction: function (par_c) {
			
			primitives.IT_SetAttPropValue (primitives.IT_X("cargador"), "generalState", "state", "0")
			primitives.GD_CreateMsg (1, "retiras_cargador", "Retiras el cargador del móvil.<br/>");
			primitives.CA_ShowMsg ("retiras_cargador");			

			return true;				

		}
		
	});	
	
	reactions.push ({
		id: 'go',
		
		reaction: function (par_c) {
			
			if (primitives.IT_GetAttPropValue (primitives.IT_X("cargador"), "generalState", "state") != "0") { // móvil cargándose
				primitives.GD_CreateMsg (1, "no_puedes_salir_mientras_carga", "Intentas moverte... pero ni te separas de tu móvil mientras se está cargando.<br/>");
				primitives.CA_ShowMsg ("no_puedes_salir_mientras_carga");
				return true
			}
			
			// dejar en casa el manuscrito o la maleta al salir de la casa
			if ( ((par_c.loc == primitives.IT_X("salón_comedor")) && (par_c.target == primitives.IT_X("camino_residencial"))) || 
				((par_c.loc == primitives.IT_X("cocina")) && (par_c.target == primitives.IT_X("camino_playa"))) ) {
				if (primitives.IT_IsCarried (primitives.IT_X("maleta"))) {
					primitives.GD_CreateMsg (1, "no_puedes_sacar_maleta_de_casa", "Cuando  te diriges afuera, te sientes un poco ridículo llevando la maleta contigo, así que la dejas antes de salir.<br/>");
					primitives.CA_ShowMsg ("no_puedes_sacar_maleta_de_casa");
					primitives.IT_SetLoc(primitives.IT_X("maleta"), par_c.loc)
				} 
				if (primitives.IT_IsCarried (primitives.IT_X("manuscrito"))) {
					primitives.GD_CreateMsg (1, "no_puedes_sacar_manuscrito_de_casa", "¿Salir de casa con tu valioso manuscrito? Sólo tienes una copia y no te arriesgas a perderlo. Lo dejas en casa antes de salir.<br/>");
					primitives.CA_ShowMsg ("no_puedes_sacar_manuscrito_de_casa");
					primitives.IT_SetLoc(primitives.IT_X("manuscrito"), par_c.loc)
				}
			}
			
			// después del hechizo
			if (+primitives.IT_GetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state") >= 2) {
				
				if ( ((par_c.loc == primitives.IT_X("salón_comedor")) && (par_c.target == primitives.IT_X("camino_residencial") || par_c.target == primitives.IT_X("pasillo"))) || 
				    ((par_c.loc == primitives.IT_X("cocina")) && (par_c.target == primitives.IT_X("salón_comedor"))) ||
				    ((par_c.loc == primitives.IT_X("camino_playa")) && (par_c.target == primitives.IT_X("cocina"))) ||
				    ((par_c.loc == primitives.IT_X("caleta")) && (par_c.target == primitives.IT_X("camino_playa"))) ||
				    (par_c.loc == primitives.IT_X("promontorio")) ||
				    (par_c.loc == primitives.IT_X("cuevita")) )  {
					primitives.GD_CreateMsg (1, "fantasma_no_te_deja_ir", "Tu querida hermana no te permite ir en esa dirección.<br/>");
					primitives.CA_ShowMsg ("fantasma_no_te_deja_ir");
					return true
				}
				
				if (par_c.target == primitives.IT_X("promontorio")) {
					// te despeñas sobre el mar
					
					primitives.GD_CreateMsg (1, "te_despeñas", "<br/><br/>En la noche avanzas siguiendo la voluntad de tu hermana. Al llegar al lugar de las dos lápidas, ves cómo una niebla sale de la tumba de tu madre y se reúne con la figura de tu querida hermana. Ambas te llaman con los brazos abiertos. Caminas hacia ellas como hipnotizado... y de repente sientes que no hay suelo bajo tus pies. Mientras caes, dos luces te acompañan en la caída. Luego, una tercera luz, tú, se reúne con ellas y avanzan juntas hacia un círculo de luz en el horizonte.<br/><br/>")
					primitives.CA_ShowMsg ("te_despeñas");
															
					primitives.GD_CreateMsg (1, "fin_juego_despeñas", "El juego ha terminado. ¿Qué habría pasado si hubieras ido a la cueva en vez de al promontorio?<hr/>")
					
					
					primitives.CA_EndGame("fin_juego_despeñas")
					return true
					
					
				}
			}

			// salir del estudio
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
					 (primitives.IT_GetLoc(primitives.IT_X("foto2")) == primitives.PC_X()) ||
					 (primitives.IT_GetLoc(primitives.IT_X("cargador")) == primitives.PC_X()) ||
					 (primitives.IT_GetLoc(primitives.IT_X("manuscrito")) == primitives.PC_X()) ||
					 (primitives.IT_GetLoc(primitives.IT_X("libro_magia")) == primitives.PC_X()) ) {
					primitives.GD_CreateMsg (1, "cosas_en_mano", "Te piensas salir con las manos tan llenas. Salvo el móvil, sabes que irías más cómodo si llevas el resto de cosas en la maleta.<br/>");
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
				     (primitives.IT_GetLoc(primitives.IT_X("foto2")) != primitives.IT_X("maleta")) ) {
					primitives.GD_CreateMsg (1, "te_olvidas_algo", "Igual te has olvidado de coger algo, pero esás ansioso por partir.");
					primitives.CA_ShowMsg ("te_olvidas_algo");
				}

				primitives.GD_CreateMsg (1, "cierras_maleta", "Cierras la maleta y sales del estudio.<br/><br/>");
				primitives.CA_ShowMsg ("cierras_maleta");					

				primitives.GD_CreateMsg (1, "al_salir_del_estudio_1", "El viaje transcurre como en un sueño. Un momento atrás estabas en tu estudio...y ahora, ahí estás delante de la puerta de la casa de la playa. Los trayectos de taxi, el bullicio del aeropuerto, el ronquido del pasajero de al lado... a nada de eso le has prestado demasiada atención. En tu cabeza sólo había una idea 'en un rato volveré a estar allí donde todo ocurrió, después de hace tantos años'. Al supuesto motivo por el que vas, acabar las correcciones de tu última novela, tampoco le has dedicado ni un pensamiento.<br/><br/>");
				primitives.CA_ShowMsg ("al_salir_del_estudio_1");

				primitives.GD_CreateMsg (1, "al_salir_del_estudio_2", "Sólo puedes pensar en cómo eran las cosas antes de la muerte de Ana, tu querida hermana gemela, la niña de tus ojos. Recuerdas en especial lo felices que fuisteis juntos aquel último verano. Pasabais casi más tiempo en la caleta de detrás de la casa que dentro de la misma. Vuestra madre siempre tenía que ir a buscaros cuando empezaba a oscurecer. Esa misma caleta infame donde ocurrió la tragedia.<br/><br/>");
				primitives.CA_ShowMsg ("al_salir_del_estudio_2");
				
				// reloj a la hora de llegada, al salir del taxi
				primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_reloj", "1200")
				primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas", "360")				
			}
							
			if (par_c.target == primitives.IT_X("salón_comedor")) {

				if (primitives.IT_GetAttPropValue (par_c.target, "generalState", "state") == "0") {

					primitives.GD_CreateMsg (1, "primera_vez_salón_comedor", "<b>Entras.</b><br/><br/>El salón comedor está casi igual que hace quince años, si exceptuamos el polvo acumulado. Retiras las sábanas y las sacudes fuera. Ahora sí, el salón luce casi como antes. Entre diversos planfletos bajo la puerta, te llama la atención uno de comida a domicilio, TelePapeo, que no te vendrá mal estos días.<br/>");
					primitives.CA_ShowMsg ("primera_vez_salón_comedor");
					primitives.IT_SetAttPropValue (par_c.target, "generalState", "state", "1")
				}
			}
			
			if (!usr.conLuz()) {
				if (par_c.loc == primitives.IT_X("promontorio")) {
					primitives.GD_CreateMsg (1, "promontorio_sin_luz", "A oscuras, no te atreves a moverte ni un paso por miedo a despeñarte, como le pasó a tu madre.<br/>"); 
					primitives.CA_ShowMsg ("promontorio_sin_luz");
					return true
				} else if (par_c.loc == primitives.IT_X("camino_playa"))  {
					// al azar entre las salidas posibles
					var azar = primitives.MISC_Random (3)
					var target = ["cocina", "promontorio", "caleta"]
					primitives.GD_CreateMsg (1, "camino_playa_sin_luz_a_o1", "A oscuras, caminas sin tino y llegas sin saber como a... %o1<br/>"); 
					primitives.CA_ShowMsg ("camino_playa_sin_luz_a_o1", {o1: target[azar]});
					
					primitives.IT_SetLoc(primitives.PC_X(), primitives.IT_X(target[azar]));
					
					return true
				} else if ((par_c.loc == primitives.IT_X("caleta")) && (par_c.target == primitives.IT_X("camino_playa"))) { 
					primitives.GD_CreateMsg (1, "caleta_sin_luz_a_camino_playa", "A oscuras, comienzar a subir a tientas un promontorio, pero resbalas y vuelves a donde estabas.<br/>"); 
					primitives.CA_ShowMsg ("caleta_sin_luz_a_camino_playa");
					return true
				}
			}

			if (par_c.target == primitives.IT_X("cuevita")) {

				// si estás con fantasma, entras sin problema
				if (primitives.IT_GetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state") == "2") {
					primitives.GD_CreateMsg (1, "entras_cueva_con_fanstasma", "Con un inefable sensación de fatídica desgracia entras en la cueva, seguido por tu querida hermana.<br/>"); 
					primitives.CA_ShowMsg ("entras_cueva_con_fanstasma");
					return false
				}
				

				// no dejar entrar cuando hay no es marea baja
				if (usr.minutosRestantesMarea() <= 0) {
					primitives.GD_CreateMsg (1, "cueva_no_accesible", "La pequeña cueva ahora está cubierta por el mar. Tendrás que esperar a la próxima marea baja.<br/>"); 
					primitives.CA_ShowMsg ("cueva_no_accesible");
					return true
				}

				if (primitives.IT_GetAttPropValue (primitives.IT_X("barrotes"), "generalState", "state") == "0") { // bloqueada la entrada
					primitives.GD_CreateMsg (1, "cueva_innaccesible", "Los barrotes te impiden entrar en la cuevita.<br/>");
					primitives.CA_ShowMsg ("cueva_innaccesible");
					return true;
				} 

				// entrar sin linterna encendida
				if (primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_linterna") == "0") {
					primitives.GD_CreateMsg (1, "entrar_sin_linterna", "Está muy oscuro ahí dentro. Como sin luz no verías nada sería tontería entrar ahora.<br/>"); 
					primitives.CA_ShowMsg ("entrar_sin_linterna");
					return true
				}

				// contador de número de veces que has entrado en la cueva sin tener el cinturón atado
				if (primitives.IT_GetAttPropValue (primitives.IT_X("cinturón"), "generalState", "state") == "0")  {
					var vecesEnCueva =  primitives.IT_GetAttPropValue (par_c.target, "generalState", "state")
					primitives.GD_CreateMsg (1, "entras_sin_cinturon_atado", "Entras con mucha precaución, atemorizado por lo que le pasó a tu hermana aquí. Seguramente no es una buena idea entrar sin una cuerda o similar atada a los barrotes, por si acaso.<br/>");
					primitives.CA_ShowMsg ("entras_sin_cinturon_atado");
					primitives.IT_SetAttPropValue (par_c.target, "generalState", "state", vecesEnCueva + 1)
				}
				
				// primera vez que entras (localidad desconocida)
				if (!primitives.IT_GetIsItemKnown(primitives.PC_X(), par_c.target)) {
				//if (primitives.IT_GetAttPropValue (par_c.target, "generalState", "state") == "0") {
					primitives.GD_CreateMsg (1, "primera_vez_cuevita", "Te cuesta respirar, aquí fue donde ella murió ahogada. Nadie sabe muy bien por qué permaneció tanto tiempo dentro y fue sorprendida por la marea y el corrimiento de tierra que precipitó la area de la pequeña duna dentro de la cueva.<br/>En el suelo puedes ver lo que parece ser una cuerda semienterrada<br/>");
					primitives.CA_ShowMsg ("primera_vez_cuevita");
					primitives.IT_SetAttPropValue (par_c.target, "generalState", "state", "1")
				}
				
				// entras:
				primitives.CA_ShowImg ("cuevita.jpg", true, false, "%o1", ["cuevita"] ); 

				
			} // fin si destino es cuevita
			

			// primera vez que entras (localidad desconocida)
			if (par_c.target == primitives.IT_X("caleta")) {
			
				if (!primitives.IT_GetIsItemKnown(primitives.PC_X(), par_c.target)) {
					primitives.GD_CreateMsg (1, "primera_vez_caleta", "Avanzas casi arrastrando los pies. No quieres ir, pero no puedes evitarlo. Sabes que tienes que hacer frente al pasado, ya han pasado más de quince años y tienes que superarlo.<br/>");
					primitives.CA_ShowMsg ("primera_vez_caleta");
				}
			}

			// ir de caleta a camino_playa con el cinturón atado a los barroes
			if ( (par_c.loc == primitives.IT_X("caleta")) && 
			     (par_c.target == primitives.IT_X("camino_playa")) &&
				 (primitives.IT_GetAttPropValue (primitives.IT_X("cinturón"), "generalState", "state") == "1") ) {
				primitives.GD_CreateMsg (1, "debes_dejar_cinturón", "No puedes irte con el cinturón atado a los barrores. Lo desatas y te lo llevas contigo.<br/>");
				primitives.CA_ShowMsg ("debes_dejar_cinturón");
				
				primitives.IT_SetAttPropValue (primitives.IT_X("cinturón"), "generalState", "state", "0")
					 
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
			
			if ( (par_c.item1Id  == "barrotes") && (usr.minutosRestantesMarea() <= 0)) {
				primitives.GD_CreateMsg (1, "ex_barrotes_marea_alta", "Con la marea alta apenas ves unos hierros oxidados bajo el agua. Se pusieron para sellar la entrada a la cueva donde Ana..., cuando la marea está baja.<br/>");
				primitives.CA_ShowMsg ("ex_barrotes_marea_alta");
				return true
			}

			if (par_c.item1Id  == "cestaTelePapeo") {
				var pedido = JSON.parse (primitives.IT_GetAttPropValue (primitives.IT_X("cestaTelePapeo"), "generalState", "state") )

				if (pedido.length == 0) {
					primitives.GD_CreateMsg (1, "CestaTelePapeo_vacía", "La cesta de TelePapeo está vacía.<br/>");
					primitives.CA_ShowMsg ("CestaTelePapeo_vacía");
					
				} else {
					primitives.GD_CreateMsg (1, "contenidoCestaTelePapeo", "La cesta de TelePapeo contiene:<br/>");
					primitives.CA_ShowMsg ("contenidoCestaTelePapeo");
					for (var i=0; i<pedido.length; i++) {
						primitives.GD_CreateMsg (1, "TelePapeo_ver_prod_s1", "%s1<br/>" ); 
						primitives.CA_ShowMsg ("TelePapeo_ver_prod_s1", {s1: pedido[i].id});
					}
				}

				return true
			}
			
			if (par_c.item1Id  == "libro_magia") {

				//  state: 0 -> mensaje general; 1 -> ilustración de la mujer embarazada; 2 -> ilustración de rompimiento de atadura 
				if (primitives.IT_GetAttPropValue (par_c.item1, "generalState", "state") == "0") {
					primitives.GD_CreateMsg (1, "ex_libro_magia_general", "Las macabras ilustraciones de este libro antiquísimo escrito en un idioma que desconoces te fascina de manera enfermiza. Te ha dado muchas ideas para escribir tus cuentos y novelas.<br/>" ); 
					primitives.CA_ShowMsg ("ex_libro_magia_general");
				} else if (primitives.IT_GetAttPropValue (par_c.item1, "generalState", "state") == "1")  { 
					primitives.GD_CreateMsg (1, "ex_libro_magia_embarazada", "Ahí está la ilustración que buscabas. Parece ser un ritual para que dos almas separadas por la muerte vuelvan a encontrarse en el cuerpo de una mujer embarazada de gemelos. Ves cómo el gemelo difunto le da un regalo al superviviente, que lo sujeta en una mano mientras que con otra prende fuego a una tela con la sangre de la mujer embarazada y a una ofrenda valiosa del gemelo vivo. Como colofón, se ve al gemelo vivo comiendo algo parecido a setas alucinógenas mientras ver arder el fuego ante él.<br/>" ); 
					primitives.CA_ShowMsg ("ex_libro_magia_embarazada");

					if (primitives.IT_GetAttPropValue (primitives.IT_X("embarazada"), "generalState", "state") == "1") {
						// libro leído -> activa preguntar a Vicky por su embarazo
						primitives.IT_SetAttPropValue (primitives.IT_X("embarazada"), "generalState", "state",  "2" )
					}
					
					if ( (primitives.IT_GetAttPropValue (primitives.IT_X("embarazada"), "generalState", "state") == "1") || 
						 (primitives.IT_GetAttPropValue (primitives.IT_X("embarazada"), "generalState", "state") == "2") ) {
						primitives.GD_CreateMsg (1, "duda_embarazada_gemelos", "Un sombío presentimiento te viene a la cabeza: ¿estará Vicky embarazada de gemelos?<br/>" ); 
						primitives.CA_ShowMsg ("duda_embarazada_gemelos");
					} else {
						primitives.GD_CreateMsg (1, "duda_embarazada_gemelos_confirmada", "Algo irrefrenable te anima a seguir adelante con el hechizo, aunque sólo sea para confirmar que no son más que supersticiones sin sentido.<br/>" ); 
						primitives.CA_ShowMsg ("duda_embarazada_gemelos_confirmada");
					}
					
				} else if (primitives.IT_GetAttPropValue (par_c.item1, "generalState", "state") == "3") { // cuando todo está  listo para hechizo 2
					primitives.GD_CreateMsg (1, "ex_libro_magia_hechizo2", "ex_libro_magia_hechizo2<br/>" ); 
					primitives.CA_ShowMsg ("ex_libro_magia_hechizo2");
				} else {
					primitives.GD_CreateMsg (1, "ex_libro_completo", "El libro no parece tener nada interesante que ofrecerte ahora.<br/>" ); 
					primitives.CA_ShowMsg ("ex_libro_completo");
				}
				
				return true;
				
			}
			
			if (par_c.item1Id  == "cama") {
				if (primitives.IT_GetLoc(primitives.IT_X("diario")) == primitives.IT_X("limbo")) {
					primitives.GD_CreateMsg (1, "aparece_diario", "Al apoyarte en el colchón para ver cómo está la cama, oyes un ruido de algo que cae al suelo debajo de la cama.<br/>" ); 
					primitives.CA_ShowMsg ("aparece_diario")
					primitives.IT_SetLoc(primitives.IT_X("diario"), primitives.IT_X("habitación_madre"));
				}

				return false;
				
			}
			
			if (par_c.item1Id  == "diario") {
				if (primitives.IT_GetLoc(primitives.IT_X("foto3")) == primitives.IT_X("limbo")) {
					primitives.GD_CreateMsg (1, "aparece_foto3", "Entre otras cosas, aparece una foto de tu madre con tu hermana y contigo.<br/>" ); 
					primitives.CA_ShowMsg ("aparece_foto3")
					primitives.IT_SetLoc(primitives.IT_X("foto3"), primitives.PC_GetCurrentLoc());
				}

				return false;
				
			}
			
			if (par_c.item1Id  == "espejo") {
				
				primitives.GD_CreateMsg (1, "espejo_0", "Por un momento, te parece ver a tu hermana cogida de tu mano al lado tuya. Sientes la mano fría y te la frotas para recuperar el calor.<br/>" ); 
				primitives.GD_CreateMsg (1, "espejo_1", "Se te nubla la vista y te ves tal como eras de pequeño. Oyes una vocetia que entre risas te dice \'¡Al!¡Estoy escondida, ven a buscarme, apúrate!\'<br/>" ); 
				primitives.GD_CreateMsg (1, "espejo_2", "Te ves rodeado de un aura de fuego que te cubre. Instintívamente, te pasas las manos por la cabeza, que te notas más cliente de lo normal.<br/>" ); 
				primitives.GD_CreateMsg (1, "espejo_3", "El espejo refleja la ventana abierta, a través de la que puede ver el lejano promontorio. Tiemblas al recordar no sólo que los cuerpo de tu querida hermana y tu madre están ahí, sino que ésta última falleció al caer desde ahí.<br/>" ); 
				primitives.GD_CreateMsg (1, "espejo_4", "Por un segundo, te viene una imagen de tu recurrente pesadilla. Te ves a ti mismo cubierto del mar y ahogándote en la cueva.<br/>" ); 
				
				var lista_mensajes = ["espejo_0", "espejo_1", "espejo_2", "espejo_3", "espejo_4"]
				
				var i = primitives.MISC_Random (5)
				primitives.CA_ShowMsg ("espejo_" + i)

				// and shows dfault message too
				
			}
			
			var fichero ="";
			if (par_c.item1Id == "collar") fichero = "collar.jpg";
					
			primitives.GD_CreateMsg (1, "pulsa_para_ver_imagen_de_%o1", "Pulsa para ver imagen de %o1.<br/>");
			if (fichero != "") {
				// primitives.CA_ShowImg (fichero, true, true, "pulsa_para_ver_imagen_de_%o1", [par_c.item1Id] ); 
				primitives.CA_ShowImg (fichero, true, false, "%o1", [par_c.item1Id] ); 
			}
			
		}
		
	});		
		
		
	/*
	reactions.push ({
		id: 'put_into',
		
		enabled: function (indexItem, indexItem2) {

			if (indexItem == primitives.IT_X("móvil")) return false // no dejar meter móvil en un contenedor
		}
		
	});
	*/
		

	reactions.push ({
		id: 'strike',
		
		enabled: function (indexItem, indexItem2) {
			
			// los barrotes no se ven con mare alta
			if (usr.minutosRestantesMarea() <= 0) return false
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
		
	reactions.push ({
		id: 'break',
		
		enabled: function (indexItem, indexItem2) {
			
			if (indexItem == primitives.IT_X("collar")) return true;
			return false;
		},
		
		reaction: function (par_c) {
		
			if ( primitives.PC_IsAt(primitives.IT_X("cuevita")) &&
				 (+primitives.IT_GetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state") >= 2) ) {
					 
				// final del juego
				primitives.GD_CreateMsg (1, "rompes_collar", "Tus lágimas se diluyen en el mar, que te cubre por completo. Cuando ya casi no puedes seguir respirando pones todas tus energías en romper el collar, en un intento desesperado de romper el nexo con tu querida hermana. Te hieres las manos, pero al final rompes la cuerda y las conchas que formaban el collar se dispersan por la corriente en todas direcciones.<br/>Entonces sucede lo inesperado. Aparentemente, ese collar mantenía encadenada a tu hermana a ti y al mundo de los mortales. Una vez roto el collar, toda la rabia de tu querida hermana desaparece y es sustituida por una gran paz y una bella sonrisa. Su cuerpo respandece y te guía en la oscuridad hasta la salida de la cueva.<br>Apareces de noche en la pequeña caleta. Tu querida hermana se despide de ti y se diríge a un círculo de luz.<br/><br/>");
				primitives.CA_ShowMsg ("rompes_collar");
				
				var dias = +primitives.IT_GetAttPropValue (primitives.IT_X("escritor"), "generalState", "state")
				var estado_hora = usr.DividirMinutos (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_reloj"))
				primitives.GD_CreateMsg (1, "estadística_juego_s1_s2_s3", "Has necesitado %s1 días y %s2:%s3 horas para despedirte de tu querida hermana.<br/><br/>")
				
				primitives.CA_ShowImg ("hermanos.jpg", true, false, "" ); 

				primitives.CA_ShowMsg ("estadística_juego_s1_s2_s3" , {s1: dias, s2:estado_hora.horas, s3:estado_hora.minutos });

				// escena final
				primitives.GD_CreateMsg (1, "epílogo", "<b>Epílogo</b><br/><br/>Días después, organizas una fiesta en la casa de la playa. Asisten Freddie, Vicky con su marido, así como Charlie con varios amigos suyos. Después de comer, beber (y, algunos, fumarse lo que queda de tu planta que ha traído Freddie) en abundancia, les anuncias que estos días en la casa te han hecho renacer, que has quemado tu novela casi acabada y has empezado a escribir una nueva novela.<br/><br/>")
				primitives.CA_ShowMsg ("epílogo");
				
				primitives.GD_CreateMsg (1, "DLG_presentación_poema", "Amigos, permitidme leeros este poemita que se me ocurrió ayer, que es en esencia una continuación del poema de Edgan Allan Poe \'Annabelle Lee\' y que creo que va a  jugar un papel importante en mi nueva novela:")
				primitives.CA_QuoteBegin ("escritor", "DLG_presentación_poema" , [], true ); 
				
				usr.poema()
				

				
				primitives.GD_CreateMsg (1, "fin_juego_poema", "El juego ha terminado<hr/>")
				primitives.CA_EndGame("fin_juego_poema")
				
				return true
					 
			} else {
				primitives.GD_CreateMsg (1, "no_rompes_collas", "¿Cómo romper algo tan bello que te hizo tu querida hermana el día de su muerte? El sólo hecho de pensarlo te entistrece y te hace soltar lágimas de dolor y pena.<br/>");
				primitives.CA_ShowMsg ("no_rompes_collas");
				return true
				
			}

			return false;
		}
		

	});				

	reactions.push ({
		id: 'burn',
		
		enabled: function (indexItem, indexItem2) {
			
			if (indexItem == primitives.IT_X("cerillas")) return true;
			if (primitives.IT_GetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state") == "2") return false // ya arde
			if (indexItem == primitives.IT_X("chimenea")) return true;
			return false;
		},
		
		reaction: function (par_c) {
		
			if (par_c.item1Id == "cerillas") {
				if (primitives.PC_GetCurrentLoc() != primitives.IT_X("salón_comedor")) {
					primitives.GD_CreateMsg (1, "no_gastar_cerillas", "Haces el amago de encender una, pero te das cuenta de que sólo la estarías desaprovechando aquí.<br/>");
					primitives.CA_ShowMsg ("no_gastar_cerillas");
					
					return true
				}
			}

			if (!primitives.IT_IsCarriedOrHere(primitives.IT_X("cerillas"))) {
				primitives.GD_CreateMsg (1, "sin_cerillas", "No ves nada alrededor con qué encender la chimenea.<br/>");
				primitives.CA_ShowMsg ("sin_cerillas");
				return true
			}

			// tu querida hermana sólo te deja un opción: los elementos del hechizo 1: manuscrito + foto3 + servilleta, con setas a mano y collar
			// to-do: que se haga de noche
			if ( primitives.IT_IsAt(primitives.IT_X("manuscrito"), primitives.IT_X("chimenea")) &&
				 primitives.IT_IsAt(primitives.IT_X("foto3"), primitives.IT_X("chimenea")) &&
				 primitives.IT_IsAt(primitives.IT_X("servilleta"), primitives.IT_X("chimenea")) &&
				 primitives.IT_IsCarried(primitives.IT_X("setas")) &&
				 primitives.IT_IsCarried(primitives.IT_X("collar")) ) {
					 
				// hechizo 1!!
				if (typeof par_c.option == 'undefined') { // phase 1: asking dialog
				
					primitives.GD_CreateMsg (1, "escena_hechizo1", "Te comes las setas y con mano temblorosa enciendes la cerilla y la acercas a la chimenea. Ahí descansan las páginas del manuscrito de tu novela, que te ha llevado cuatro años de tu vid: ¿qué mayor sacrificio que este para realizar el hechizo del libro arcano? Te sientes muy estúpido, ¿y si todo esto es una tontería y simplemente estás quemando tu trabajo por nada?<br/><br/>Pero no puedes resistirte, notas como las setas te han dejado la conciencia alterada y una sombra de la habitación adquiere la forma de tu hermana, que se acerca a ti y te hace un gesto para que acabes de acercar la cerilla a la chimenea.<br/><br/>Te has tenido que volver loco, porque ahora ves volando por el aire las tijeras de la cocina. Ahora sabes qué va a pasar, el hechizo exigirá tu muerte para que puedas renacer con tu querida hermana en el vientre de Vicky.<br/>Tienes muchas ganas de completar el hechizo y reunirte con tu querida hermana, pero... ¡tienes tantas cosas que hacer aún en esta vida!: publicar tu novela, ser padre, viajar... Antes de acercar irremisiblemente la cerilla a la chimenea el apego a la vida te da la oportunidad de no seguir el camino que te marca tu querida hermana.<br/>");
					primitives.CA_ShowMsg ("escena_hechizo1");
					
					var menu = []
					
					primitives.GD_CreateMsg (1, "apagar_cerilla", "Apagar la cerilla"); 
					menu.push ({id:"apagar_cerilla", msg:"apagar_cerilla"})

					primitives.GD_CreateMsg (1, "encender_hoguera", "Encender la hoguera y completar el hechizo"); 
					menu.push ({id:"encender_hoguera", msg:"encender_hoguera"})

					primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2

					return true;

				} else { // getting PNJId
							
					if (par_c.option == "apagar_cerilla") {
						primitives.GD_CreateMsg (1, "hechizo1_abortado", "Con apenas fuerzas, soplas la cerilla. Tu querida hermana te mira con rabia y luego dirige su atención a las tijeras, que salen disparadas hacia ti y que sólo esquivas por los pelos.<br/><br/>La caja de cerillas sale volando de tus manos y ves ante tus ojos cómo se abre y se enciende una cerrilla por sí sola y prende fuego a la chimenea. ¡No! De manera instintiva intentas sacar tu manuscrito de las llamas, pero ya es demasiado tarde.<br/><br/>Pero ése no es suficiente sacrificio para tu hermana, que se sitúa entre la entrada de la casa y las escalera bloqueando tu salida y te señala hacia la cocina y la salida posterior de la casa.<br><br/>"); 
						primitives.CA_ShowMsg ("hechizo1_abortado");
						
						primitives.IT_SetLocToLimbo (primitives.IT_X("manuscrito"));
						primitives.IT_SetLocToLimbo (primitives.IT_X("servilleta"));
						primitives.IT_SetLocToLimbo (primitives.IT_X("setas"));
						primitives.IT_SetLocToLimbo (primitives.IT_X("foto3"));
						primitives.IT_SetLoc (primitives.IT_X("tijeras"), primitives.PC_GetCurrentLoc());
						
						primitives.GD_CreateMsg (1, "fantasma_rompe_móvil", "Al verte dudar, tu querida hermana se enfuerece aún más y vuelve a lanzarte las tijeras, que dan de pleno en tu pecho... justo donde llevabas tu flamante móvil. Nunca creíste que llegaras alegrarte de sentir cómo se rompía su pantalla en mil pedazos.<br>"); 
						primitives.CA_ShowMsg ("fantasma_rompe_móvil");
						primitives.IT_SetLocToLimbo (primitives.IT_X("móvil"));
							
						// activa reacción ante tu negativa -> ya no habrá recálculo de horas, ni cambio de día o mareas, ni se necesitará linterna
						primitives.IT_SetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state", 2)
												
						// brainstorming: el único objeto necesario para entrar en la cueva con el fantasma: el collar					
						primitives.CA_Refresh()
						
					} else {
						primitives.GD_CreateMsg (1, "hechizo1_ejecutado", "Con apenas fuerzas, acercas la cerilla a la chimenea, mientra las tijeras vuelan por el aire y se clavan en tu cuello. Caes al suelo, desde donde ves quemarse tu vida. Tu manuscrito arde mientras notas que tu alma sale de tu cuerpo. Al lado tuyo están ahora las figuras de tu madre y tu querida hermana. Vuestra madre se dirige a un círculo de luz mientras que tú y tu querida hermana volaís hasta la habitación de Vicky. Ella duerme plácidamente abrazada a su marido. Notas cómo entráis en su vientre.<br/><br/>Dentro de Vicky, uno de los gemelos, la niña, sonríe, mientras que tú, en tu último pensamiento antes de perder la memoria, dudas de si esto era lo que realmente querías o has sido sólo el títere de su hermana. Después de ese momento, oscuridad y espera. Tu querida hermana te da la mano, volvéis a estar juntos.<br/><br/>");
						
						primitives.CA_ShowMsg ("hechizo1_ejecutado");
						
						primitives.GD_CreateMsg (1, "fin_juego_chimenea", "Este juego ha terminado, pero... ¿que habría pasado si no hubieras encendido la chimenea?<hr/>")
						
						primitives.CA_EndGame("fin_juego_chimenea")
					}
				}
				
				return true;
			}
			
			// resto de casos
			primitives.GD_CreateMsg (1, "fantasma_apaga_cerilla", "Enciendes una cerilla, y cuando vas a prender fuego a la chimenea, notas una corriente de aire extraña que la apaga. Se te herizan los pelos al escuchar una corriente de aire que te recuerda a tu querida hermana cuando jugaba a ser un fantasma.<br/>");
			primitives.CA_ShowMsg ("fantasma_apaga_cerilla");
			
			return true;
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


	items.push ({
		id: 'manuscrito',
		
		desc: function () {
			primitives.CA_ShowDesc (this.index); // to-do? desc estática
			
			primitives.GD_CreateMsg (1, "tiempo_dedicado_s1", "Hoy le has dedicado %s1 horas de las 6 mínimas diarias que te marcaste.");
			
			primitives.CA_ShowMsg ("tiempo_dedicado_s1", {s1:0});

		}
		
	});

}

// GENERIC turn **********************************************************************************************

export function turn (indexItem) {
	
	var  primitives = this.primitives // tricky
	
	// cuando aparece el fantasma pralizamos el resto de reacciones ("el tiempo se para"), salvo la del fantasma
	if (+primitives.IT_GetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state") < 2) {
		
		if (indexItem == primitives.IT_X("móvil")) usr.incrementar_hora(1)
			
		if (indexItem == primitives.IT_X("cargador")) usr.turnoCargador()
		
		if (indexItem == primitives.IT_X("cinturón")) usr.turnoCinturon()
		
		if ((indexItem == primitives.IT_X("hippie")) || (indexItem == primitives.IT_X("embarazada"))) usr.turnoPNJ(indexItem)
		if (indexItem == primitives.IT_X("caleta")) usr.turnoCaleta()
		if (indexItem == primitives.IT_X("cuevita")) usr.turnoCuevita()

		if (indexItem == primitives.IT_X("cestaTelePapeo")) usr.turnoCestaTelePapeo ()
	}
		// vinculamos turno de la fantasma al libro arcano
	if (indexItem == primitives.IT_X("libro_magia")) usr.turnoFantasma()
		
}


// internal functions ****************************************************************************************************************

usr.turnoCinturon = function() {
	var  primitives = this.primitives // tricky
	var indexItem = primitives.IT_X("cinturón")
	
	if ( (usr.minutosRestantesMarea() == 0) &&
		 (primitives.IT_GetAttPropValue (indexItem, "generalState", "state") != "0") &&
		 (primitives.PC_GetCurrentLoc() == primitives.IT_X("caleta")) ) {
		primitives.GD_CreateMsg (1, "desatas_cinturón_con_marea", "Desatas el cinturón de los barrotes antes de que suba más la marea.<br/>");
		primitives.CA_ShowMsg ("desatas_cinturón_con_marea");
		primitives.IT_SetAttPropValue (indexItem, "generalState", "state", "0")
	}
}
	
usr.turnoCargador = function() {
	var  primitives = this.primitives // tricky

	var indexItemC = primitives.IT_X("cargador")
	var indexItemM = primitives.IT_X("móvil")

	if ( (primitives.IT_GetAttPropValue (indexItemC, "generalState", "state") != "0") && 
	     ((!primitives.IT_IsCarriedOrHere(indexItemC)) || (!primitives.IT_IsCarriedOrHere(indexItemM))) ) {
		primitives.GD_CreateMsg (1, "desconectar_cargador", "Desconectas el cargador del móvil.<br/>");
		primitives.CA_ShowMsg ("desconectar_cargador");
		primitives.IT_SetAttPropValue (indexItemC, "generalState", "state", "0")
	}
	
}

usr.bajoTecho = function() {
	var  primitives = this.primitives // tricky

	return ( (primitives.PC_GetCurrentLoc() == primitives.IT_X("salón_comedor")) ||
	 (primitives.PC_GetCurrentLoc() == primitives.IT_X("estudio")) ||
	 (primitives.PC_GetCurrentLoc() == primitives.IT_X("cocina")) ||
	 (primitives.PC_GetCurrentLoc() == primitives.IT_X("pasillo")) ||
	 (primitives.PC_GetCurrentLoc() == primitives.IT_X("habitación_gemelos")) ||
	 (primitives.PC_GetCurrentLoc() == primitives.IT_X("habitación_madre")) ) 

}

usr.conLuz = function() {
	var  primitives = this.primitives // tricky

	if  (!( (primitives.PC_GetCurrentLoc() == primitives.IT_X("camino_playa")) ||
	 (primitives.PC_GetCurrentLoc() == primitives.IT_X("promontorio")) ||
	 (primitives.PC_GetCurrentLoc() == primitives.IT_X("caleta")) ||
	 (primitives.PC_GetCurrentLoc() == primitives.IT_X("cuevita"))  )) return true

	// to-do: es de día?
	var estado_hora = usr.DividirMinutos (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_reloj"))
	
	// antes de las 18:00 es de día
	if (estado_hora.minutosDia < 18 * 60) return true
	 
	// linterna encendida?
	return (primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_linterna") != "0")

}


usr.incrementar_hora = function(turnos) {
	
	var  primitives = this.primitives // tricky

	// si fantasma, el tiempo se para:
	if (+primitives.IT_GetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state") >=2) return

	var minutosHoy = +primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_reloj") + turnos * 15
	
	if (primitives.PC_IsAt (primitives.IT_X("estudio"))) {
		// si pierde el avión, reseteo del día en el estudio
		if (minutosHoy >= 13 * 60) { 
			primitives.GD_CreateMsg (1, "perdiste_avión", "Ni tú mismo te puedes creer que hayas perdido el avión. Menos mal que no será por vuelos. Llamas a la compañía aérea y reservas otro para la misma hora para mañana. Te pones a trabajar en tu nuevo libro y al llegar la noche comes algo y te vas a la cama. Mañana será otro día... aunque temes la noche y las pesadillas que trae consigo.<br/><br/>");
			primitives.CA_ShowMsg ("perdiste_avión");

			usr.reseteoDia ()
			return
		}
		
	} else {
		
		// Si no tienes tiempo para cumplir con el tiempo de escritura -> a escribir ahora
		var minutosPendientesEscribirHoy = 360 - primitives.IT_GetAttPropValue (primitives.IT_X("manuscrito"), "generalState", "state") 
		if (minutosHoy + minutosPendientesEscribirHoy > 23 * 60) {
			primitives.GD_CreateMsg (1, "dejarlo_todo_y_escribir", "Te das cuenta de que no has cumplido con tu compromiso de seis horas diarias de revisión diaria de tu novela. Lo dejas todo y te diriges a tu habitación a cumplir con tu deber.<br/>");
			primitives.CA_ShowMsg ("dejarlo_todo_y_escribir");

			if (usr.tiradoEnLaCalleDeNoche ()) {
				primitives.GD_CreateMsg (1, "el_remordimiento_te_corroe", "Peor aún, te das cuenta de que no podrás cumplir con tu compromiso al no saber cómo volver a casa.<br/>");
				primitives.CA_ShowMsg ("el_remordimiento_te_corroe");
			} else {
				primitives.GD_CreateMsg (1, "a_dormir_después_de_escribir", "Acabas exhausto después de la sesión de revisión de tu novela. Comes algo y te acuestas.<br/>");
				primitives.CA_ShowMsg ("a_dormir_después_de_escribir");			
			}
			
			usr.reseteoDia ()
			return
			
		} else if (minutosHoy >= 23 * 60) { // después de las 23:00 (1380 minutos) -> a dormir 
			primitives.GD_CreateMsg (1, "a_dormir", "<br/>De repente, te das cuenta de qué hora es. Eres muy escrupuloso con tus horarios y a las 23:00 te retiras a casa a dormir, sí o sí. El sueño te vence y te arrastras a la cama. Mañana será otro día.<br/><br/>");
			primitives.CA_ShowMsg ("a_dormir");
			
			usr.reseteoDia ()
			return
			
		} else if (usr.tiradoEnLaCalleDeNoche ()) {
			usr.reseteoDia ()
			return
		}
	}
	
	primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_reloj", minutosHoy)	

	// el tiempo también pasa para la batería
	usr.gastar_bateria (turnos)

	// decir si es de noche
	if (!usr.conLuz()) {
		primitives.GD_CreateMsg (1, "de_noche_sin_luz", "Es de noche y estás fuera de casa sin iluminación que te guíe.<br/><br/>");
		primitives.CA_ShowMsg ("de_noche_sin_luz");
	}
	
	// recálculo de marea
	var siguiente_marea = +primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_mareas")
	
	// ventana de marea se acaba 60 minutos después de máxima bajamar
	if (minutosHoy > siguiente_marea + 60) siguiente_marea += 745 
	
	if (siguiente_marea >= 1440) siguiente_marea -= 1440 // si suma más de 24 horas
	primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_mareas", siguiente_marea)
	
	// to-do: hambre
	/*
		Si a las 11:00 (660) no has comido nada, empiezas a sentir hambre
		Si a las 14:00 (840) no has comido nada, llamas poseído a TelePapeo y pides cualquier cosa para una sola persona (pizza y refresco) y comes solo.
	*/
	
}

usr.tiradoEnLaCalleDeNoche = function() {
	var  primitives = this.primitives // tricky

	if (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_reloj") <= 18 * 60) return false  
	if (usr.conLuz()) return false
	if (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas") > 0) return false
	
	return true
	
}

usr.reseteoDia = function() {
	
	var  primitives = this.primitives // tricky
	
	if (usr.tiradoEnLaCalleDeNoche ()) {
		primitives.GD_CreateMsg (1, "tirado_en_la_calle", "De noche, en la calle y sin luz. Te haces un ovillo en cualquier lugar y duermes algo tullido de frío hasta que sale el sol.<br/><br/>");
		primitives.CA_ShowMsg ("tirado_en_la_calle");
	} else {
		if ( (primitives.IT_IsCarried (primitives.IT_X("cargador"))) || 
		     (primitives.IT_GetLoc (primitives.IT_X("cargador")) == primitives.IT_X("habitación_gemelos")) ) {
			primitives.GD_CreateMsg (1, "antes_dormir_cargas_móvil", "Antes de dormir, estiras el brazo y pones el móvil a cargar.<br/>");
			primitives.CA_ShowMsg ("antes_dormir_cargas_móvil");
		} else {
			primitives.GD_CreateMsg (1, "antes_dormir_NO_cargas_móvil", "Antes de dormir, estiras el brazo, pero el cargador no está... bueno, ya lo buscarás mañana.<br/>");
			primitives.CA_ShowMsg ("antes_dormir_NO_cargas_móvil");
		}
	}

	// to-do: primitives.CA_PressKey ("Pulsa");

	primitives.CA_ShowMsgAsIs ("<hr/>")
	
	primitives.CA_ShowMsg ("sueño"); // def de mensaje mensaje reusada de antes			
	
	primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_reloj", "450") // 7:30 de la mañana
	
	// reseteo tiempo pendiente a dedicar en manuscrito
	if (primitives.PC_IsAt (primitives.IT_X("estudio")))
		primitives.IT_SetAttPropValue (primitives.IT_X("manuscrito"), "generalState", "state", "360")	
	else
		primitives.IT_SetAttPropValue (primitives.IT_X("manuscrito"), "generalState", "state", "0")	
	
	var dias = +primitives.IT_GetAttPropValue (primitives.IT_X("escritor"), "generalState", "state")
	primitives.IT_SetAttPropValue (primitives.IT_X("escritor"), "generalState", "state", dias + 1)
	
	primitives.GD_CreateMsg (1, "día_s1", "<br/>Con energías renovadas comienzas la jornada %s1 desde que tuviste la pesadilla por primera vez.<br/><br/>");
	primitives.CA_ShowMsg ("día_s1", {s1: dias + 2});
	
	if (primitives.IT_GetLoc(primitives.PC_X()) != primitives.IT_X("estudio") && (!usr.tiradoEnLaCalleDeNoche ()) )
		primitives.IT_SetLoc(primitives.PC_X(), primitives.IT_X("habitación_gemelos"));

	// baterías
	if (!usr.tiradoEnLaCalleDeNoche () && (primitives.IT_IsCarriedOrHere (primitives.IT_X("cargador"))) ) 
		primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas", "1440")	
    else 	
		primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas", "0")

	// recálculo hora de la siguiente marea baja: 12h25m (12*60 + 25 = 745) ; app_mareas.estado += 745
	var siguiente_marea = +primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_mareas")
	siguiente_marea += 745
	if (siguiente_marea >= 1440) siguiente_marea -= 1440 // si suma más de 24 horas
	
	// si la marea baja fue mientras dormía, saltar a la siguiente
	if (siguiente_marea < 450) siguiente_marea += 745
	if (siguiente_marea >= 1440) siguiente_marea -= 1440 // si suma más de 24 horas
	primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_mareas", siguiente_marea)
	
	// si hay un paquete de Freddie, escena donde lo recibes
	var pedido = JSON.parse (primitives.IT_GetAttPropValue (primitives.IT_X("cestaFreddie"), "generalState", "state") )
	if (pedido.length > 0) {
		primitives.GD_CreateMsg (1, "recibes_paquete", "<br/>¡Hoy seguro que recibiste el paquete de Freddie! Te diriges a la puerta de la casa, sacas todo el contenido del paquete y lo dejas en el salón comedor.<br/>");
		primitives.CA_ShowMsg ("recibes_paquete");
		for (var i=0;i<pedido.length;i++)
			primitives.IT_SetLoc(primitives.IT_X(pedido[i]), primitives.IT_X("salón_comedor"));
		primitives.IT_SetLoc(primitives.PC_X(), primitives.IT_X("salón_comedor"));
		primitives.IT_SetAttPropValue (primitives.IT_X("cestaFreddie"), "generalState", "state", "[]")
	}

	// vaciar cestaTelePapeo y llevarla al limbo
	primitives.IT_SetAttPropValue (primitives.IT_X("cestaTelePapeo"), "generalState", "state", "[]") 
	primitives.IT_SetLocToLimbo (primitives.IT_X("cestaTelePapeo"));
	
	// por si llamada en curso (to-do: no pasaría si una secuencia de menús se consideraran un único turno)
	primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada
	
	// linterna apagada
	primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_linterna", "0") 


	// PNJs al limbo
	primitives.IT_SetLocToLimbo (primitives.IT_X("embarazada"));
	primitives.IT_SetLocToLimbo (primitives.IT_X("hippie"));
	primitives.IT_SetAttPropValue (primitives.IT_X("timbre_embarazada" ), "generalState", "state", "0")
	primitives.IT_SetAttPropValue (primitives.IT_X("timbre_hippie" ), "generalState", "state", "0")
	
	primitives.CA_Refresh()
}


usr.gastar_bateria = function(turnos) {
	
	var  primitives = this.primitives // tricky

	var decremento = +turnos * (primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_linterna") == "0")? 15: 60

	var estado0 = +primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas")
	var estado =  estado0 - decremento
	
	// cargador conectado
	if (primitives.IT_GetAttPropValue (primitives.IT_X("cargador"), "generalState", "state") != "0") estado += 240

	if (estado < 0) estado = 0
	else if (estado > 1440) estado = 1440
	
	primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas", estado)	

	if (estado == 0) {
		if (estado0 >0) {
			primitives.GD_CreateMsg (1, "baterías_0", "Te has quedado sin baterías. Te toca apañártelas a la antigua usanza.<br/>");
			primitives.CA_ShowMsg ("baterías_0");
		}
	} else if (estado <= 60) {
		primitives.GD_CreateMsg (1, "baterías_60", "Te estás quedando sin baterías. Te queda una hora a ritmo normal.<br/>");
		primitives.CA_ShowMsg ("baterías_60");
	} else if (estado <= 120) {
		primitives.GD_CreateMsg (1, "baterías_120", "Te estás quedando sin baterías. Te quedan menos de dos horas a ritmo normal.<br/>");
		primitives.CA_ShowMsg ("baterías_120");
	}

}

usr.poema = function() {
	var  primitives = this.primitives // tricky

	primitives.GD_CreateMsg (1, "estrofa1", "<br/><br/>De niño pasaba con mi familia<br/>los veranos en una casa junto al mar.<br/>Tenía yo una guapa vecina<br/>cuyo nombre no voy a mencionar<br/>de la que era novio infantil en verano<br/>y a quien el resto del año sólo podía añorar.<br/><br/>");
	primitives.CA_ShowMsg ("estrofa1");
	primitives.GD_CreateMsg (1, "estrofa2", "Un desgraciado verano,<br/>mi querido amor me fue arrebatado por un golpe de mar<br/>y quedé profundamente conmocionado.<br/>Su tumba iba a visitar <br/>todos los días, ese verano y los siguientes,<br/>en un promontorio junto al mar.<br/><br/>");
	primitives.CA_ShowMsg ("estrofa2");
	primitives.GD_CreateMsg (1, "estrofa3", "Quince años sin ella<br/>no me pudieron calmar.<br/>Entonces algo sucedió<br/>y me dejaron de mirar<br/>sus ojos reflejados en las estrellas.<br/>Sólo escribir me podía aliviar<br/>y con letras y más letras<br/>no la dejaba de llamar.<br/><br/>");
	primitives.CA_ShowMsg ("estrofa3");
	primitives.GD_CreateMsg (1, "estrofa4", "En otros ojos y cuerpos<br/>la quise buscar<br/>tanto de ángeles como de demonios.<br/>Pero nunca la pude encontrar<br/>Tanta fue mi desesperación<br/>que casi la llegué a olvidar.<br/><br/>");
	primitives.CA_ShowMsg ("estrofa4");
	primitives.GD_CreateMsg (1, "estrofa5", "Un día alguien tuvo a bien<br/>una bonita carta quererme enviar.<br/>Era una admiradora a quien en edad podría yo doblar.<br/>Había leído algo mío<br/>que de ella y de mí parecía hablar.<br/>Pero nunca pudimos vernos.<br/>Porque vivía ella lejos de mi casa junto al mar.<br/><br/>");
	primitives.CA_ShowMsg ("estrofa5");
	primitives.GD_CreateMsg (1, "estrofa6", "Un día, mientras firmaba libros en la ciudad,<br/>A una dulce voz oí rogar<br/>'Me firma, por favor.'<br/>Y al la vista levantar,<br/>los ojos de ella reencontré<br/>Aquellos mismos a quienes tanto amé.<br/>Y fui afortunado de nunca más volverme a separar<br/>de aquellos ojos de más allá de cielo y del mar.<br/><br/>");
	primitives.CA_ShowMsg ("estrofa6");
	
}
	
usr.hablarConPNJ = function(PNJIndex, option, esTelefonico) {
	
	var  primitives = this.primitives // tricky
	
	var PNJId = primitives.IT_GetId(PNJIndex)
		
	// si es el primer encuentro
	if (primitives.IT_GetAttPropValue (PNJIndex, "generalState", "state") == "0") {

		if (PNJIndex == primitives.IT_X("hippie")) {
		
			primitives.GD_CreateMsg (1, "DLG_hippie_se_presenta", "¡Hola!, ¿qué puedo hacer por usted?... pero espera, ¡tú eres Al, mi viejo amigo de aventuras veraniegas! ¡Cómo me alegro de verte después de tantos años! Yo sigo aquí, con mi música y mi surf... a propósito, mira que app más guapa para saber a qué hora son las mareas")
			primitives.CA_QuoteBegin (PNJId, "DLG_hippie_se_presenta" , [], true ); 

			// por si tienes el móvil descargado
			if (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas") > 0) {
				primitives.GD_CreateMsg (1, "hippie_app_mareas_móvil_cargado",  "Te coge tu móvil y te la instala sin más.<br/>")
				primitives.CA_ShowMsg ("hippie_app_mareas_móvil_cargado" );
			} else {
				// te presta cargador por la cara
				primitives.GD_CreateMsg (1, "hippie_app_mareas_presta_cargador",  "Te coge tu móvil y al ver que lo tienes sin baterías, entra en casa con tu móvil y vuelve con el móvil con un poco de carga y la app de mareas instalada.")
				primitives.CA_ShowMsg ("hippie_app_mareas_móvil_cargado" );
				primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas", 60)
			}

			primitives.GD_CreateMsg (1, "DLG_hippie_invita_a_fiesta", "Colega, pásate por casa a partir de las 7 de le noche. Casi siempre hay gente, sexo, drogas y rockandroll a partir de esa hora. Ja, ja, ja. Tráete algo de bebida y yo me encargo del resto. Tengo género de buena calidad.")
			primitives.CA_QuoteBegin (PNJId, "DLG_hippie_invita_a_fiesta" , [], true ); 

			primitives.GD_CreateMsg (1, "hippie_se_despide", "<br/>Sin darte mucho margen, tu amigo de la infancia se mete en casa («a dormir la mona», dice), no sin antes dejarte su número de móvil.<br/>"); 
			primitives.CA_ShowMsg ("hippie_se_despide");

			primitives.IT_SetAttPropValue (PNJIndex, "generalState", "state", 1) // Charlie pasa a ser conocido
			primitives.IT_SetLocToLimbo (PNJIndex);
			
			primitives.GD_CreateMsg (1, "sobre_mareas_y_cuevas", "<br/>Una oscura reflexión te nubla la mente. Te acabas de acordar de la época del año en la que estamos, aproximadamente la misma en que ella... ¿Como no te habías dado cuenta antes? Las mareas surferas de Charlie te lo acaban de recordar. Es época de mareas largas, permitiendo que la fatídica cuevita de la playa quede al descubierto cuando está baja. El resto del año la cueva queda siempre bajo el nivel del mar, sin riesgo de que a ningún niño le pueda pasar lo que a ella.<br/>"); 
			primitives.CA_ShowMsg ("sobre_mareas_y_cuevas");
			
		} else if (PNJIndex == primitives.IT_X("embarazada")) {

			primitives.CA_QuoteBegin (PNJId, "" , [], false ); 
			primitives.GD_CreateMsg (1, "DLG_embarazada_se_presenta", "¡Al!» Sin darte tiempo a reaccionar una corpulenta mujer embarazada se abalanza encima tuya y te da cuatro besos.«¡Qué alegría más grande! ¿Vas a estar mucho?, ¿unas semanas tal vez?, ¡qué bueeeno! Paso mucho tiempo sola en casa por las mañanas, hasta eso de la hora del té, que es cuando regresa de trabajar mi marido. Apunta mi número de móvil: llámame e invítame a tu casa a comerme un helado de chocolate. ¡Estos días sólo pienso en comer chocolate!")
			primitives.CA_QuoteContinues ("DLG_embarazada_se_presenta", [], true );
			
			primitives.GD_CreateMsg (1, "embarazada_se_despide", "<br/><br/>Vicky hace gestos de sentir náuseas y sin previo aviso entra en casa.<br/>"); 
			primitives.CA_ShowMsg ("embarazada_se_despide");

			primitives.GD_CreateMsg (1, "recuerdas_libro", "<br/>De repente... te acuerdas de tu viejo libro comprado en el mercado de Marrakech. Te viene a la memoria una página en concreto, con unas ilustraciones de una mujer embarazada de gemelos. ¿Por qué te habrá venido ese recuerdo ahora? Seguro que es una tontería, pero no te vas a quedar tranquilo hasta que consultes el libro.<br/>"); 
			primitives.CA_ShowMsg ("recuerdas_libro");
			primitives.IT_SetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state", "1") // libro de magia mostrará a embarazada
			
			// si no lo traiste
			if ( (primitives.IT_GetLoc(primitives.IT_X("libro_magia")) == primitives.IT_X("estudio")) || 
				 (primitives.IT_GetLoc(primitives.IT_X("libro_magia")) == primitives.IT_X("estantería")) ) {
				primitives.GD_CreateMsg (1, "libro_en_estudio", "«¡Mierda!», recuerdas que no metiste el libro en la maleta; «quizás el bueno de Freddie me lo pueda enviar por mensajería.»<br/>"); 
				primitives.CA_ShowMsg ("libro_en_estudio");

			 }

			primitives.IT_SetAttPropValue (PNJIndex, "generalState", "state", 1) // Vicky pasa a ser conocida
			primitives.IT_SetLocToLimbo (PNJIndex);

		}
		return true
	}	

	// siguientes encuentros
	
	if (typeof option == 'undefined') { // phase 1: asking dialog
	
		var menu = []
		
		// si cargador en estudio y estás sin baterías, habilita pedir un uno prestado
		if ( (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_pilas") == 0) &&
			 ( (primitives.IT_IsAt(primitives.IT_X("cargador"), primitives.IT_X("estantería"))) ||
			   (primitives.IT_IsAt(primitives.IT_X("cargador"), primitives.IT_X("estudio"))) ) ) {
			primitives.GD_CreateMsg (1, "pedir_cargador", "Pedir prestado un cargador<br/>"); 
			menu.push ({id:"pedir_cargador", msg:"pedir_cargador"})
		}

		// añadir más líneas de diálogo
		usr.agregarDialogos (PNJIndex, menu)
		
		primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2

		return true;

	} 
	
	// phase2
	if (option == "pedir_cargador") {
		primitives.GD_CreateMsg (1, "DLG_pedir_cargador_reacción", "Venga, va, pero no te lo olvides por ahí, que me da que eres un poco despistado.<br/>"); 
		primitives.GD_CreateMsg (1, "DLG_pedir_cargador_reacción", "Bueno, tengo mucho, lío. Ya hablamos.")
		primitives.CA_QuoteBegin (PNJId, "DLG_pedir_cargador_reacción" , [], true ); 

		primitives.IT_SetLoc(primitives.IT_X("cargador"), primitives.PC_X()) 		
	} else {
		
		if (PNJIndex == primitives.IT_X("embarazada")) {
			usr.reaccionesVicky (option, esTelefonico)
		} else {
			primitives.GD_CreateMsg (1, "o1_te_devuelve_el_saludo", "%o1 te devuelve el saludo."); 
			primitives.CA_ShowMsg ("o1_te_devuelve_el_saludo", {o1:PNJId});	
		}

	}

	return true;				

}

usr.turnoPNJ = function (PNJIndex) {
	var  primitives = this.primitives // tricky

	var PNJId = primitives.IT_GetId(PNJIndex)

	// si está presente y no interactúas o bien pasa a estar ocupado -> se va
	var timbre = +primitives.IT_GetAttPropValue (primitives.IT_X("timbre_" + PNJId), "generalState", "state")
	if (timbre > 0) {
		timbre--
		primitives.IT_SetAttPropValue (primitives.IT_X("timbre_" + PNJId), "generalState", "state", timbre)
		if (timbre == 0) {
			if (primitives.IT_IsHere(PNJIndex)) {
				primitives.GD_CreateMsg (1, "DLG_se_despide", "Bueno, tengo mucho, lío. Ya hablamos.")
				primitives.CA_QuoteBegin (PNJId, "DLG_se_despide" , [], true ); 
				primitives.GD_CreateMsg (1, "se_va_o1", "%o1 se va<br/>"); 
				primitives.CA_ShowMsg ("se_va_o1", {o1: PNJId });
			}
			primitives.IT_SetLoc(PNJIndex, primitives.IT_X("limbo"));
			primitives.CA_Refresh()
			return
		}
	}	
	
	// parte específica
	var status =  (PNJId == "embarazada")? usr.turnoEmbarazada(): usr.turnoHippie()

	if (status) return
	
	// si aún no ha reaccionado, saluda sin más
	
	if (primitives.IT_GetLoc(PNJIndex) ==  primitives.PC_GetCurrentLoc()) {
		// nada que decir
		primitives.GD_CreateMsg (1, "o1_te_mira", "%o1 te mira, esperando ver qué quieres.")
		primitives.CA_ShowMsg ("o1_te_mira", {o1: PNJId });
	}
	
}

usr.turnoHippie = function () {
	
	var  primitives = this.primitives // tricky
	
	return false
	
}

usr.turnoEmbarazada = function () {
	
	var  primitives = this.primitives // tricky

	return false
	
}

usr.turnoCuevita = function () {
	
	var  primitives = this.primitives // tricky

	if (!primitives.PC_IsAt (primitives.IT_X("cuevita"))) return
	
    if (+primitives.IT_GetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state") >= 2) return // con fantasma en escena final

	primitives.GD_CreateMsg (1, "la_marea_sube", "La marea sube y cada ves oyes el mar más cerca. Puede ser peligroso permanecer mucho tiempo aquí.<br/>");
	primitives.CA_ShowMsg ("la_marea_sube");

	// venció el tiempo de la marea -> fuera de la cueva, de manera automática
	if (usr.minutosRestantesMarea() <= 0) {
		primitives.GD_CreateMsg (1, "el_agua_entra", "El agua empieza a entrar en la cueva. Te asustas y te afanas por salir."); 
		primitives.CA_ShowMsg ("el_agua_entra");

		// sin cinturón, posibilidad de que mueras, insensato
		if (primitives.IT_GetAttPropValue (primitives.IT_X("cinturón"), "generalState", "state") == "0")  {
			// posibilidad de que mueras: numero de veces que entras sin cinturón * 10
			var probabilidadMuerte = +primitives.IT_GetAttPropValue (primitives.IT_X("cuevita"), "generalState", "state") * 10
			if (primitives.MISC_Random (100) < probabilidadMuerte) {
				primitives.GD_CreateMsg (1, "el_agua_entra_y_mueres", "Sin embargo, resbalas y caes atrás. Tocas los barrotes pero no consigues asirlos por las algas pegadas. Un corrimiento de area aprisona tus pies y sólo puedes ser testigo de ver cómo cada vez entra más agua. Cuando por fin el agua te sobrepasa y no te deja respirar, crees ver la figura de tu querida hermana, que te sonríe y te ofrece la mano para que vayas con ella a un círculo de luz.<br/><br/><hr/>"); 
				primitives.CA_ShowMsg ("el_agua_entra_y_mueres");

				primitives.GD_CreateMsg (1, "fin_juego_asfixia_sin_cinturón", "El juego ha terminado, pero ¿qué habría pasado si hubieras atado una cuerda o similar a los barrotes para poder salir con ellos?")
				primitives.CA_EndGame("fin_juego_asfixia_sin_cinturón")
				return true
			} else {
				primitives.GD_CreateMsg (1, "el_agua_entra_y_sales", "Afortunadamente, consigues asir los barrotes sin resbalarte, pero te apuntas mentalmente atar algo a los barrotes para no volver a llevarte este susto.<br/><br/>")
				primitives.CA_ShowMsg ("el_agua_entra_y_sales");

			}
		} else {
			primitives.GD_CreateMsg (1, "el_agua_entra_y_sales_con_cinturón", "Agarras el cinturón y tirando de él consigues salir sin demasiados problemas<br/><br/>")
			primitives.CA_ShowMsg ("el_agua_entra_y_sales_con_cinturón");

		}

		// sacarlo de la cueva
		primitives.IT_SetLoc(primitives.PC_X(), primitives.IT_X("caleta"));
		primitives.CA_ShowMsg("Current_location_o1", {o1: primitives.PC_GetCurrentLoc()} );
		primitives.CA_Refresh()

	} 
	
	if (primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_linterna") == "0")  {
		primitives.GD_CreateMsg (1, "cueva_se_oscurece", "Estar sin luz en la cueva es superior a ti. A duras penas recoges tus cosas y sales a trompicones.<br/><br/>"); 
		primitives.CA_ShowMsg ("cueva_se_oscurece");
		
		primitives.IT_SetLoc(primitives.PC_X(), primitives.IT_X("caleta"));
		primitives.CA_ShowMsg("Current_location_o1", {o1: primitives.PC_GetCurrentLoc()} );
		primitives.CA_Refresh()
		
	}
	
}

usr.turnoCestaTelePapeo = function () {
	
	var primitives = this.primitives // tricky
	
	var estado_hora = usr.DividirMinutos (+primitives.IT_GetAttPropValue (primitives.IT_X("manuscrito"), "generalState", "state"))
	var pedido = JSON.parse (primitives.IT_GetAttPropValue (primitives.IT_X("cestaTelePapeo"), "generalState", "state") )

	
	if ( (estado_hora.minutosDia > 900) && 
		 (primitives.IT_IsAt(primitives.IT_X("cestaTelePapeo")) != primitives.IT_X("limbo")) &&
		 (pedido.length > 0) ) {
	
		primitives.GD_CreateMsg (1, "comes_con_ansia", "¡La hora que es y aún sin comer! Devoras con ansia el contenido de la cesta de TelePapeo.<br/><br/>"); 
		primitives.CA_ShowMsg ("comes_con_ansia");
		
		primitives.IT_SetAttPropValue (primitives.IT_X("cestaTelePapeo"), "generalState", "state", "[]") 

	}
		  
}
	
usr.turnoFantasma = function () {
	
	var primitives = this.primitives // tricky
	var estado = +primitives.IT_GetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state") 
	
	if (estado == 0) return
	
	if (estado == 1) { 
		if ( !primitives.IT_IsAt(primitives.IT_X("setas"), primitives.IT_X("limbo")) &&
		     !primitives.IT_IsAt(primitives.IT_X("foto3"), primitives.IT_X("limbo")) &&
		     !primitives.IT_IsAt(primitives.IT_X("collar"), primitives.IT_X("limbo")) &&
		     !primitives.IT_IsAt(primitives.IT_X("servilleta"), primitives.IT_X("limbo")) ) {
			primitives.GD_CreateMsg (1, "fantasma_te_incita_a_hechizo", "Oyes una voz que te dice \'haz el hechizo, hazlo, ¡hazlo!\'"); 
			primitives.CA_ShowMsg ("fantasma_te_incita_a_hechizo");
		}
	
		return
	}
	
	// estado >= 2, después del hechizo
	
    if (!primitives.PC_IsAt(primitives.IT_X("cuevita")))   {
		
		primitives.GD_CreateMsg (1, "fantasma_te_mira_enfadado", "Tu querida hermana brilla en la noche y te señala el camino.<br/><br/>"); 
		primitives.CA_ShowMsg ("fantasma_te_mira_enfadado");

		// incrementar contadores de localidad y forzar cambio de localidad si el jugador está remolón
		var contadorLocalidad = +primitives.IT_GetAttPropValue (primitives.PC_GetCurrentLoc(), "generalState", "state")
		primitives.IT_SetAttPropValue (primitives.PC_GetCurrentLoc(), "generalState", "state", contadorLocalidad + 1)
		
		if (contadorLocalidad > 4 ) {
			var nuevaLoc = -1

			if (primitives.PC_IsAt(primitives.IT_X("salón_comedor"))) nuevaLoc = primitives.IT_X("cocina")
			else if (primitives.PC_IsAt(primitives.IT_X("cocina"))) nuevaLoc = primitives.IT_X("camino_playa")
			else if (primitives.PC_IsAt(primitives.IT_X("camino_playa"))) nuevaLoc = primitives.IT_X("caleta")
			else if (primitives.PC_IsAt(primitives.IT_X("caleta"))) nuevaLoc = primitives.IT_X("cuevita")

			if (nuevaLoc != -1) {
				primitives.PC_SetCurrentLoc(nuevaLoc)
				
				primitives.GD_CreateMsg (1, "fantasma__te_empuja_a_o1", "Tu querida hermana no soporta la espera y te arrastra a %o1.<br/><br/>"); 
				primitives.CA_ShowMsg ("fantasma__te_empuja_a_o1", {o1: nuevaLoc});
				primitives.CA_ShowMsg("Current_location_o1", {o1: nuevaLoc} );

				primitives.CA_Refresh()
			}
		} else {
			if (primitives.PC_IsAt(primitives.IT_X("camino_playa"))) {
				primitives.GD_CreateMsg (1, "fantasma_te_apunta_dos_direcciones", "Con cada mano apunta dos direcciones, como preguntándote dónde quieres morir y reunirte con ella: si en el promontorio o en la cueva de la caleta."); 
				primitives.CA_ShowMsg ("fantasma_te_apunta_dos_direcciones");
			}
		}
		
	} else {
		// en la cueva, sube la marea
		if (estado < 5) {
	
			primitives.GD_CreateMsg (1, "te_asfixias_con_fantasma", "La marea sube irremediablemente. El agua te cubre y empiezas a experimentar la misma asfixia que tu querida hermana el día en que murió. Tu querida hermana te mira complacida, pronto te reunirás con ella."); 
			primitives.CA_ShowMsg ("te_asfixias_con_fantasma");
			
			estado++
			primitives.IT_SetAttPropValue (primitives.IT_X("libro_magia"), "generalState", "state", estado) 
		} else {
			primitives.GD_CreateMsg (1, "mueres_asfixiado_con_fanstama", "Tu querida hermana se acerca y te toma por la mano. La acompañas a un círculo luminoso, al mirar atrás ves tu cuerpo ahogado en la cueva.<hr/>"); 
			primitives.CA_ShowMsg ("mueres_asfixiado_con_fanstama");

			primitives.GD_CreateMsg (1, "fin_juego_asfixia", "El juego ha terminado, pero quizás podría haber sido de otra manera si no te hubieras sentido tan apegado al collar de tu querida hermana.")
			primitives.CA_EndGame("fin_juego_asfixia")
			
		}
		
		
	}
	
}


usr.turnoCaleta = function () {
	
	var  primitives = this.primitives // tricky

	if (!primitives.PC_IsAt (primitives.IT_X("caleta"))) return
	
	if (usr.minutosRestantesMarea() <= 0) {
		primitives.GD_CreateMsg (1, "marea_alta", "La marea cubre la entrada a la cueva donde toco ocurrió.<br/><br/>"); 
		primitives.CA_ShowMsg ("marea_alta");
	} else if (usr.conLuz()) {
		primitives.GD_CreateMsg (1, "marea_baja", "La marea está muy baja y permite ver la entrada a la cueva donde toco ocurrió.<br/><br/>"); 
		primitives.CA_ShowMsg ("marea_baja");
	}
	
	
}

usr.DividirMinutos = function (minutosDia) {
		
	var horas = Math.floor(minutosDia / 60)
	var minutos = (minutosDia - horas * 60) 
	
	horas = usr.rellenaCeros (horas,2)
	minutos = usr.rellenaCeros (minutos,2)

	return {minutosDia: minutosDia, horas: horas, minutos: minutos}

}

usr.minutosRestantesMarea = function () {
	
	var  primitives = this.primitives // tricky

	var horaBajamar = usr.DividirMinutos (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_mareas"))
	var	estado_hora = usr.DividirMinutos (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_reloj"))

	var diferencia = horaBajamar.minutosDia + 60 - estado_hora.minutosDia

	if (diferencia < 0 || diferencia > 120) return 0
	
	return diferencia

}				


usr.menuTelefonoFreddie = function (option) {

	var  primitives = this.primitives // tricky
	var pedido = JSON.parse (primitives.IT_GetAttPropValue (primitives.IT_X("cestaFreddie"), "generalState", "state") )
		
	if (typeof option == 'undefined') { // phase 1: asking dialog
	
		var menu = []
		
		if (pedido.length == 0) {
			// si no hay nada encestaFreddie, puedes saludar sin más
			primitives.GD_CreateMsg (1, "Freddie_solo_saludar", "Simplemente lo saludas y te aseguras de que va todo bien por el estudio."); 
			menu.push ({id:"Freddie_solo_saludar", msg:"Freddie_solo_saludar"})
		} else {
			// pero si ya hay algo en la cesta del pedido, puedes cancelar pedido o cerrarlo
			primitives.GD_CreateMsg (1, "Freddie_cancelar_paquete", "Te lo piensas mejor, y al final no le pides nada y te despides depués de asegurarte de que va todo bien por el estudio."); 
			primitives.GD_CreateMsg (1, "Freddie_fin_paquete", "Te despides, insistiéndole que te envíe el paquete urgente, que ya se lo pagarás."); 

			menu.push ({id:"Freddie_cancelar_paquete", msg:"Freddie_cancelar_paquete"})
			menu.push ({id:"Freddie_fin_paquete", msg:"Freddie_fin_paquete"})
		}

		if (pedido.indexOf ("cargador") < 0) { // no está en el pedido
			if ( (primitives.IT_GetLoc(primitives.IT_X("cargador")) == primitives.IT_X("estudio")) ||
				(primitives.IT_GetLoc(primitives.IT_X("cargador")) == primitives.IT_X("estantería")) ) {

				primitives.GD_CreateMsg (1, "Freddie_cargador", "Le pides el cargador."); 
				menu.push ({id:"Freddie_cargador", msg:"Freddie_cargador"})
			}
		}

		if (pedido.indexOf ("foto2") < 0) { // no está en el pedido
			if ( (primitives.IT_GetLoc(primitives.IT_X("foto2")) == primitives.IT_X("estudio")) ||
				(primitives.IT_GetLoc(primitives.IT_X("foto2")) == primitives.IT_X("estantería")) ) {
				primitives.GD_CreateMsg (1, "Freddie_foto", "Le pides la foto tuya con tu querida hermana."); 
				menu.push ({id:"Freddie_foto", msg:"Freddie_foto"})
			}
		}

		if (pedido.indexOf ("libro_magia") < 0) { // no está en el pedido
			if ( (primitives.IT_GetLoc(primitives.IT_X("libro_magia")) == primitives.IT_X("estudio")) ||
				(primitives.IT_GetLoc(primitives.IT_X("libro_magia")) == primitives.IT_X("estantería")) ) {
				primitives.GD_CreateMsg (1, "Freddie_libro", "Le pides el libro ilustrado."); 
				menu.push ({id:"Freddie_libro", msg:"Freddie_libro"})
			}
		}

		primitives.IT_SetAttPropValue (primitives.IT_X("cestaFreddie"), "generalState", "state", JSON.stringify(pedido)) 
		primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2
		
	} else { 
	
		if (option == "Freddie_solo_saludar") {
			/* to-do: añadir profundidad y ambiente: por ejemplo
				- que freddie te diga que la casa estaba toda desordenada, o que sintió algo raro al coger la foto.
				- te dice que te cogió un poquito de la planta para fumar, que se había quedado sin nada.
			*/
			
			primitives.GD_CreateMsg (1, "Freddie_solo_saludar_reacción", "Freddie te dice que va todo bien y cuelga."); 
			primitives.CA_ShowMsg ("Freddie_solo_saludar_reacción");
			primitives.IT_SetAttPropValue (primitives.IT_X("cestaFreddie"), "generalState", "state", "[]") // resetea cesta
			primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada
			return
			
		} else if (option == "Freddie_cancelar_paquete") {
			primitives.GD_CreateMsg (1, "Freddie_cancelar_paquete_reacción", "Freddie te dice que va todo bien y cuelga."); 
			primitives.CA_ShowMsg ("Freddie_cancelar_paquete_reacción");
			primitives.IT_SetAttPropValue (primitives.IT_X("cestaFreddie"), "generalState", "state", "[]") // resetea cesta
			return
			primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada
		} else if (option == "Freddie_fin_paquete") {
			primitives.GD_CreateMsg (1, "Freddie_fin_paquete", "Freddie te dice te lo enviará ahora mismo."); 
			primitives.CA_ShowMsg ("Freddie_fin_paquete");
			primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada
			return
			
		} else if ( (option == "Freddie_cargador") || (option == "Freddie_foto")  || (option == "Freddie_libro") ) {
			
			var itemId 
			if (option == "Freddie_cargador") itemId = "cargador"
			else if (option == "Freddie_foto") itemId = "foto2"
			else if (option == "Freddie_libro") itemId = "libro_magia"
	
			primitives.GD_CreateMsg (1, "Freddie_pedido_reacción", "Freddie te dice que te lo enviará mañana por correo y que si quieres algo más."); 
			primitives.CA_ShowMsg ("Freddie_pedido_reacción");
			
			pedido.push (itemId)
			primitives.IT_SetAttPropValue (primitives.IT_X("cestaFreddie"), "generalState", "state", JSON.stringify(pedido)) 
			
			usr.menuTelefonoFreddie () // recursividad para el resto de cosas, si hay
						
		}
	}				
}


usr.menuTelePapeo = function (option) {
	
	var  primitives = this.primitives // tricky

	if (primitives.IT_GetLoc(primitives.IT_X("cestaTelePapeo")) != primitives.IT_X("limbo")) {
		primitives.GD_CreateMsg (1, "pedido_ya_realizado", "En realidad, con lo que ya pediste te puedes apañar por hoy, así que te resignas y cuelgas.<br/>"); 
		primitives.CA_ShowMsg ("pedido_ya_realizado");
		 primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada
		return
	}
	
	var pedido = JSON.parse (primitives.IT_GetAttPropValue (primitives.IT_X("cestaTelePapeo"), "generalState", "state") )
	
	var productos = [ 
		{id: "agua", tipo: 0},
		{id: "cocacola", tipo: 0},
		{id: "cerveza", tipo: 0},
		{id: "chocolate", tipo: 1},
		{id: "whisky", tipo: 2},
		{id: "bocadillo", tipo: 3},
		{id: "pizza", tipo: 3},
		{id: "patatas fritas", tipo: 3}
	]
		
	if (typeof option == 'undefined') { // phase 1: asking dialog
	
		var menu = []
		
		primitives.GD_CreateMsg (1, "TelePapeo_cancelar_paquete", "Te lo piensas mejor, y al final no pides nada."); 
		menu.push ({id:"TelePapeo_cancelar_paquete", msg:"TelePapeo_cancelar_paquete"})

		if (pedido.length > 0) {
			primitives.GD_CreateMsg (1, "TelePapeo_fin_paquete", "Cierras el pedido, que recibirás en la puerta de la casa."); 
			menu.push ({id:"TelePapeo_fin_paquete", msg:"TelePapeo_fin_paquete"})		
		}

		for (var i=0; i<productos.length; i++) {
			primitives.GD_CreateMsg (1, "TelePapeo_prod_" + productos[i].id, "Añadir " + productos[i].id + " al pedido"); 
			menu.push ({id:"TelePapeo_prod_" + productos[i].id, msg:"TelePapeo_prod_" + productos[i].id})
		}

		primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2
		
	} else { 
	
		if (option == "TelePapeo_cancelar_paquete") {
			primitives.GD_CreateMsg (1, "TelePapeo_cancelar_paquete_reacción", "Cancelas el pedido a TelePapeo.<br/>"); 
			primitives.CA_ShowMsg ("TelePapeo_cancelar_paquete_reacción");
			primitives.IT_SetAttPropValue (primitives.IT_X("cestaTelePapeo"), "generalState", "state", "[]") // resetea cesta
			primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada
			return
		} else if (option == "TelePapeo_fin_paquete") {
			primitives.GD_CreateMsg (1, "TelePapeo_fin_paquete", "TelePapeo te dice te lo enviará ahora mismo.<br/>"); 
			primitives.CA_ShowMsg ("TelePapeo_fin_paquete");

			// el envío es automático
			primitives.IT_SetLoc(primitives.IT_X("cestaTelePapeo"), primitives.IT_X("camino_residencial"));
			primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada

			return
			
		} else {

			var itemId = option.substring ("TelePapeo_prod_".length,option.length)
	
			for(var producIndex = 0; producIndex < productos.length; producIndex++) 
				if (productos[producIndex].id === itemId) break;
			
			// no dejar comprar whisky antes de tiempo
			if ((productos[producIndex].id != "whisky") || 
			    (+primitives.IT_GetAttPropValue (primitives.IT_X("embarazada"), "generalState", "state") >= 1) ) { // ya has visto libro_magia con la mujer embarazada
				// to-do: y aún no ha sido el fiestón
				
				primitives.GD_CreateMsg (1, "TelePapeo_pedido_reacción", "Lo añades al pedido"); 
				primitives.CA_ShowMsg ("TelePapeo_pedido_reacción");
				pedido.push (productos[producIndex] )
				primitives.IT_SetAttPropValue (primitives.IT_X("cestaTelePapeo"), "generalState", "state", JSON.stringify(pedido)) 
			} else {
				primitives.GD_CreateMsg (1, "whisky_antes_de_tiempo", "En realidad eres más de ron que de whisky, así que lo descartas."); 
				primitives.CA_ShowMsg ("whisky_antes_de_tiempo");
			}

			usr.menuTelePapeo () // recursividad para el resto de cosas
						
		}
	}				
}

usr.agregarDialogos = function (PNJIndex, menu) {

	var  primitives = this.primitives // tricky
	
	var PNJId = primitives.IT_GetId(PNJIndex)

	primitives.GD_CreateMsg (1, "saludar_embarazada", "Hola, Vicky, ¿qué tal estás?"); 
	primitives.GD_CreateMsg (1, "saludar_hippie", "Hola compadre, ¿cómo va todo?"); 
	menu.push ({id:"saludar_" + PNJId , msg:"saludar_" + PNJId})

	if (PNJId == "embarazada") {
		
			// primitives.GD_CreateMsg (1, "Vicky_hablar_de_tu_libro", "Vicky_hablar_de_tu_libro"); 
		// primitives.GD_CreateMsg (1, "Vicky_hablar_de_tu_hermana", "Vicky_hablar_de_tu_hermana"); 
		// primitives.GD_CreateMsg (1, "Vicky_hablar_de_tu_madre", "Vicky_hablar_de_tu_madre"); 
		// primitives.GD_CreateMsg (1, "Vicky_hablar_de_la_casa", "Vicky_hablar_de_la_casa"); 
		// primitives.GD_CreateMsg (1, "Vicky_hablar_de_infancia", "Vicky_hablar_de_infancia"); 

		// ya has visto el libro pero no sabes si ella está embarazada de gemelos
		if (primitives.IT_GetAttPropValue (PNJIndex, "generalState", "state") == "2") {
			primitives.GD_CreateMsg (1, "Vicky_preguntar_por_embarazo", "Preguntar a Vicky por embarazo"); 
			menu.push ({id:"Vicky_preguntar_por_embarazo", msg:"Vicky_preguntar_por_embarazo"})
		} else if (primitives.IT_GetAttPropValue (PNJIndex, "generalState", "state") == "3") {  // sabes que está embarazada de gemelos
			
			// si tienes cestaTelePapeo y la necesitas, aunque no tenga chocolate
			if ( (primitives.IT_IsCarried(primitives.IT_X("cestaTelePapeo"))) && 
				 (primitives.IT_GetAttPropValue (primitives.IT_X("cestaTelePapeo"), "generalState", "state") != "[]") &&
				 (primitives.IT_GetLoc(primitives.IT_X("servilleta")) == primitives.IT_X("limbo")) ) {
				primitives.GD_CreateMsg (1, "Vicky_invitar_a_comer", "Te invito a comer algo"); 
				menu.push ({id:"Vicky_invitar_a_comer", msg:"Vicky_invitar_a_comer"})
			}

		}

		// to-do: resto de posibilidades: hablar de tu libro, de tu hermana, de la casa, de tu madre, de la infancia.
		
		// menu.push ({id:"Vicky_hablar_de_tu_libro", msg:"Vicky_hablar_de_tu_libro"})
		// menu.push ({id:"Vicky_hablar_de_tu_hermana", msg:"Vicky_hablar_de_tu_hermana"})
		// menu.push ({id:"Vicky_hablar_de_tu_madre", msg:"Vicky_hablar_de_tu_madre"})
		// menu.push ({id:"Vicky_hablar_de_la_casa", msg:"Vicky_hablar_de_la_casa"})
		// menu.push ({id:"Vicky_hablar_de_infancia", msg:"Vicky_hablar_de_infancia"})
	} else { // hippie
	
	
		
	}
	


	
}

usr.menuTelefonoVicky = function (option) {
	
	var  primitives = this.primitives // tricky
	var PNJIndex = primitives.IT_X("embarazada")
	

	// si está aquí -> ¿para qué me llamas si estoy aquí?
	if (primitives.IT_IsHere(PNJIndex) ) {
		primitives.GD_CreateMsg (1, "embarazada_dice_estoy_aquí", "¿No ves que estoy aquí, para qué me llamas?"); 
		primitives.CA_QuoteBegin (primitives.IT_GetId(PNJIndex), "embarazada_dice_estoy_aquí" , [], true )
		primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada
		return
	}
	
	if ( !usr.disponibilidadPNJ ("embarazada") ) {

		var estado_hora = usr.DividirMinutos (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_reloj"))
			
		// to-do: si llamas antes de las 10:00 -> ahora no te puedo atender, llámame después de las 10 porfa
		// to-do: si llamas después de la 17:00 -> te dije que por las tardes estoy con mi marido, llámame mañana porfa

		primitives.GD_CreateMsg (1, "embarazada_dice_no_puedo_hablar_ahora", "Ahora no te puedo atender, lo siento. Estaré libre de 10:00 a 17:00. Llamame entonces. Besos."); 
		primitives.CA_QuoteBegin (primitives.IT_GetId(PNJIndex), "embarazada_dice_no_puedo_hablar_ahora" , [], false )
		primitives.CA_QuoteContinues ("", [], true );
		
		primitives.GD_CreateMsg (1, "y_cuelga", " Y cuelga<br/>"); 
		primitives.CA_ShowMsg ("y_cuelga");
		
		primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada
		return

	}
	
	// to-do: si se dan las circunstancias, puede ser ella la que se autoinvite a cenar, o al menos que diga que tiene un antojo de chocolate.

	// reacciones a lo que le digas
	if (typeof option == 'undefined') { // phase 1: asking dialog
	
		// comienza nuevo menú, para el que se te proponen alternativas
		primitives.GD_CreateMsg (1, "embarazada_dice_qué_quieres", "Hola, querido Al, ¿qué puedo hacer por ti?"); 
		primitives.CA_QuoteBegin (primitives.IT_GetId(PNJIndex), "embarazada_dice_qué_quieres" , [], false )
		primitives.CA_QuoteContinues ("", [], true );

		var menu = []
		
		usr.agregarDialogos (PNJIndex, menu)

		primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2
		
	} else { 

		usr.reaccionesVicky (option, true) // esTelefonico: true

		return
	
	}				
	
}

usr.reaccionesVicky = function (option, esTelefonico) {

	var  primitives = this.primitives // tricky

	var PNJIndex = primitives.IT_X("embarazada")
	
	primitives.GD_CreateMsg (1, "Y_cuelga", "Y cuelga el teléfono.<br/>"); 

	if (option == "saludar_embarazada") {
		
		primitives.GD_CreateMsg (1, "saludar_embarazada_reacción", "Le preguntas qué tal está, a ver si te cuenta algo.<br/>"); 
		primitives.CA_ShowMsg ("saludar_embarazada_reacción");

		if (primitives.IT_GetAttPropValue (PNJIndex, "generalState", "state") != "4") {  // aún no ha sido la escena de la servilleta
			primitives.GD_CreateMsg (1, "DLG_Vicky_responde_saludo", "Todo bien, majete. A ver si nos vemos.");
			primitives.CA_QuoteBegin ("embarazada",  "DLG_Vicky_responde_saludo", [], true ); 
		} else {
			primitives.GD_CreateMsg (1, "DLG_Vicky_no_mas_chocolate", "Al, júrame que no me dejarás volver a comer chocolate. Sentí como un demonio en el estómago.");
			primitives.CA_QuoteBegin ("embarazada",  "DLG_Vicky_no_mas_chocolate", [], true ); 
		}
		
		if (esTelefonico) {
			primitives.CA_ShowMsg ("Y_cuelga");
		} else  {
			primitives.CA_ShowMsgAsIs ("<br/><br/>");
		}

	} else if (option == "Vicky_preguntar_por_embarazo") {
		primitives.GD_CreateMsg (1, "Vicky_preguntar_por_embarazo_reacción", "Con mucho tacto masculino, le preguntas a Vicky si está embarazada de gemelos."); 
		primitives.CA_ShowMsg ("Vicky_preguntar_por_embarazo_reacción");

		primitives.GD_CreateMsg (1, "DLG_confirma_embarazo_gemelos", "¿Tan gorda estoy? Sí, de gemelos. Te iba a decir que tengo un antojito de chocolate y tenías algo, pero como veo que me ves como una foca, casi que me abstengo.");
		primitives.CA_QuoteBegin ("embarazada",  "DLG_confirma_embarazo_gemelos", [], true ); 
		
		primitives.IT_SetAttPropValue (PNJIndex, "generalState", "state",  "3") // confirma embarazo

		if (esTelefonico) {
			primitives.CA_ShowMsg ("Y_cuelga");
		} else  {
			primitives.CA_ShowMsgAsIs ("<br/><br/>");
		}

	} else if (option == "Vicky_invitar_a_comer") {
		
		// si le llevas algo que no tenga chocolate...
		if (!usr.paqueteContiene (primitives.IT_X("cestaTelePapeo"), "chocolate")) {
			primitives.GD_CreateMsg (1, "invitas_sin_chocolate", "Vicky se planta contigo en casa y da buena cuenta de la comida, pero en cuanto ve que no tienes chocolate, se va apresuradamente no sin antes soltarte que \'a ver si la próxima vez me invitas a chocolate, vecino.\'.<br/><br/>"); 
			primitives.CA_ShowMsg ("invitas_sin_chocolate");
			
			// en el salón comedor
			primitives.IT_SetLoc( primitives.PC_X(), primitives.IT_X("salón_comedor"))
			primitives.CA_Refresh()

			// vaciar cestaTelePapeo
			primitives.IT_SetAttPropValue (primitives.IT_X("cestaTelePapeo"), "generalState", "state", "[]") 

			// pasan un rato juntos
			usr.incrementar_hora(3)	

		} else {
			// escena de merienda de chocolate y servilleta

			primitives.GD_CreateMsg (1, "escena_merienda_con_Vicky_1", "A los pocos minutos, tienes a Vicky en casa. Durante unas horas os ponéis al día sobre vuestras vidas. Te habla sobre la aburrida vida de la villa costera y cómo te ha echado de menos."); 
			primitives.CA_ShowMsg ("escena_merienda_con_Vicky_1");
			
			primitives.GD_CreateMsg (1, "DLG_embarazada_habla_1", "Querido Al, ¡qué raro se me hace verte sin tu querida hermana al lado! Después de aquello, tu madre te envió lejos y casi no tuvimos tiempo ni de despedirnos. Pensarás que estoy loca, pero cuando he ido a dejar flores a las tumbas de tu hermana y tu malograda madre, las brumas de la costa siempre parecen tomar sus formas, como llamándome a reunirme con ellas. Una vez casi me despeño en el promontorio.");
			primitives.CA_QuoteBegin ("embarazada",  "DLG_embarazada_habla_1", [], true ); 

			// escena de la posesión
			primitives.GD_CreateMsg (1, "escena_merienda_con_Vicky_2", "<br/>Vicky da buena cuenta del helado de chocolate. Comienza comiendo comedidamente, pero luego devora como una posesa... tan posesa que con la boca llena de chocolate te mira con los ojos en blanco y te dice:<br/>"); 
			primitives.CA_ShowMsg ("escena_merienda_con_Vicky_2");
			
			primitives.GD_CreateMsg (1, "DLG_embarazada_habla_2", "Querido hermano, pronto estaremos juntos. Necesitarás sangre de nuestra nueva madre para realizar el hechizo de reunión. Aquí te dejo un poco");
			primitives.CA_QuoteBegin ("embarazada",  "DLG_embarazada_habla_2", [], true ); 
			
			primitives.GD_CreateMsg (1, "escena_merienda_con_Vicky_3", "<br/><br/>Observas atónito cómo Vicky se muerde ligeramente el labio y recoge unas gotas de sangre con una servilleta, que te tira por encima de la mesa.	Acto seguido, como si hubiera sido un mal sueño, Vicky toma el control de su cuerpo y sigue hablando como si nada:<br/>"); 
			primitives.CA_ShowMsg ("escena_merienda_con_Vicky_3");

			primitives.GD_CreateMsg (1, "DLG_embarazada_habla_3", "¡Qué tonta, me he mordido de tantas ganas que tenía de chocolate!");
			primitives.CA_QuoteBegin ("embarazada",  "DLG_embarazada_habla_3", [], true ); 

			primitives.GD_CreateMsg (1, "escena_merienda_con_Vicky_4", "<br/><br/>Poco después, Vicky regresa a su casa y tú sigues con tus rutinas.<br/><br/>"); 
			primitives.CA_ShowMsg ("escena_merienda_con_Vicky_4");
			
			primitives.IT_SetLoc( primitives.PC_X(), primitives.IT_X("salón_comedor"))
			primitives.IT_SetLoc(primitives.IT_X("servilleta"), primitives.IT_X("salón_comedor"))
			primitives.IT_SetLocToLimbo(PNJIndex)
				
			// finiquitada: ya pasó la escena de la servilleta
			primitives.IT_SetAttPropValue (PNJIndex, "generalState", "state", "4")
				
			// vaciar cestaTelePapeo
			primitives.IT_SetAttPropValue (primitives.IT_X("cestaTelePapeo"), "generalState", "state", "[]") 

			primitives.CA_Refresh()

			// pasan dos horas juntos
			usr.incrementar_hora(8)			
		}
				
	} else {

		primitives.GD_CreateMsg (1, "Vicky_no_tiene_qué_decir", "Vicky no tiene mucho que decirte."); 
		primitives.CA_ShowMsg ("Vicky_no_tiene_qué_decir");
		
		if (esTelefonico) {
			primitives.CA_ShowMsg ("Y_cuelga");
		} else  {
			primitives.CA_ShowMsgAsIs ("<br/><br/>");
		}

	}
	
	if (esTelefonico) {
		// fin de la llamada
		primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") 
	}


}


usr.menuTelefonoCharlie = function (option) {
	// charlie: despierto de 13:00 a 3:00, pero para quedar sólo a partir de las 20:00
	
	var  primitives = this.primitives // tricky
	var PNJIndex = primitives.IT_X("hippie")

	// si está aquí -> ¿para qué me llamas si estoy aquí?
	if (primitives.IT_IsHere(PNJIndex) ) {
		primitives.GD_CreateMsg (1, "hippie_dice_estoy_aquí", "¿No ves que estoy aquí, para qué me llamas?"); 
		primitives.CA_QuoteBegin (primitives.IT_GetId(PNJIndex), "hippie_dice_estoy_aquí" , [], true )
		primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada
		return
	}

	var estado_hora = usr.DividirMinutos (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_reloj"))
			
	if ( !usr.disponibilidadPNJ ("hippie") ) {
		primitives.GD_CreateMsg (1, "hippie_dice_no_puedo_hablar_ahora", "Po favó, déjame \'rmir un poito más."); 
		primitives.CA_QuoteBegin (primitives.IT_GetId(PNJIndex), "hippie_dice_no_puedo_hablar_ahora" , [], false )
		primitives.CA_QuoteContinues ("", [], true );
		
		primitives.GD_CreateMsg (1, "y_cuelga", " Y cuelga<br/>"); 
		primitives.CA_ShowMsg ("y_cuelga");
		
		primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada
		return

	}
	
	// si ya has tenido la fiesta de las setas
	if (primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada") == "2") {
		
		primitives.GD_CreateMsg (1, "hippie_saturado_de_fiestas", "Hermano, yo no tengo tu aguante. Creo que dejaré las fiestas por un tiempo y me dedicaré a surferar. No me llames por un tiempo, que me tengo que recuperar."); 
		primitives.CA_QuoteBegin ("hippie", "hippie_saturado_de_fiestas" , [], true )
		
		primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada
		return
	}
	
	primitives.GD_CreateMsg (1, "Charlie_te_invita_a_fiesta", "Entre un montón de ruido de fondo de música y risas, sólo le alcanzas a entender que necesita más whisky, que te vengas al fiestón y que te quiere mucho.<br/>"); 
	primitives.CA_ShowMsg ("Charlie_te_invita_a_fiesta");
	
	primitives.IT_SetAttPropValue (primitives.IT_X("móvil"), "apps", "llamada", "") // fin de la llamada

	return
	
}

usr.disponibilidadPNJ = function (PNJId) {
	
	var  primitives = this.primitives // tricky

	var dias = +primitives.IT_GetAttPropValue (primitives.IT_X("escritor"), "generalState", "state")
	
	if (dias == 0) return true // "periodo de gracia"
	
	var estado_hora = usr.DividirMinutos (+primitives.IT_GetAttPropValue (primitives.IT_X("móvil"), "apps", "app_reloj"))
	
	if (PNJId == "Freddie") //  Freddie: de 7 a 23:30
		return ( (estado_hora.minutosDia > 420) && (estado_hora.minutosDia < 1410) )
	else if (PNJId == "embarazada") //  Vicky: está disponible de 10:00 a 17:00
		return ( (estado_hora.minutosDia > 600) && (estado_hora.minutosDia < 1020) )
	else if (PNJId == "hippie") //  Charlie: no disponible de 4:00 a 13:00
		return ( (estado_hora.minutosDia < 240) || (estado_hora.minutosDia > 780) )

	return false

}			


usr.paqueteContiene = function (indexItem, itemId) {
	
	var  primitives = this.primitives // tricky
	
	var pedido = JSON.parse (primitives.IT_GetAttPropValue (indexItem, "generalState", "state")) 
	
	for(var producIndex = 0; producIndex < pedido.length; producIndex++) 
		if (pedido[producIndex].id === itemId) return true

	return false
	
}

usr.rellenaCeros = function (n, width) {
	// uso: rellenaCeros(10, 4) ->  // 0010
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

