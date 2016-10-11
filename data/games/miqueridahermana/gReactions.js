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
---
embarazada.state: 0: no la conoces aún; 1: ya la conoces pero no sabes que va a tener gemelos; 2: sabes que tiene gemelos y que quiere chocolate; 3: ya comió chocolate



hippie.state: 0: no lo conoces aún; 1: ya lo conoces y quiere marcha; 2: ya tuviste fiesta con él
libro_magia.state: 0: muy bonito; 1:página del hechizo 1; 2:página del hechizo 2
cinturón.state: 0: sin atar a ningún sitio; 1: atado a los barrotes (en caleta o en cuevita): no deja que te vayas de la caleta al paseo;
móvil.state: carga inicial del móvil (minutos que quedan). Valor inicial: 1440 (100%). Cambios: pierde 15 puntos por turno en modo normal; pierde 120 puntos por turno en modo linterna; gana 75 puntos por turno en modo carga; pierde 45 puntos si llamas.
app_reloj.state: hora del día (empieza con 1020 al llegar a la casa; se incrementa 15 por turno; a las 1380 vas a dormir; te levantas a las 420)
app_linterna.state:  0: apagado; 1: encendido
cargador_móvil.state:  0: no conectado; 1: conectado: no te puedes mover de la habitación mientras se carga (aprovecha para escribir!)
(enchufes en las dos habitaciones, en la cocina y en el salón_comedor)
app_marea.siguiente_marea: hora de la siguiente marea (inicialmente 1200 = 20:00) (al llegar, app_marea.marea_baja se pone a 6)
app_marea.marea_baja: contador decremental de marea baja (se pone a 6 y va bajando: al llegar a cero, se da valor al siguiente app_marea.siguiente_marea)
manuscrito.state: tiempo que has escrito hoy (cada día se pone a 0 y debes llegar a 360)
diario.state:?

objetos por crear:
paquete_vecino: contiene los objetos que se solicitan; al coger el paquete, se deshace y tienes los objetos que contiene.
paquete_telepapeo: contiene el pedido que son cosas del tipo:
	pedido_ya_usado_hoy: 0 
	pedido_num_personas: 1
	pedido_postre_chocolate: 0
	pedido_tipo_bebidas: 0,1,2 (refresco, cerveza, whisky)

---
?:
día/noche: día (entre las 8:30 y las 19:00) ?

---

Problemas de integridad:
- te quedas sin batería de noche y fuera de casa -> en modo automático: te quedas tirado esperando a que amanezca. Al amanecer, vas a tu habitación a dormir, enchufando el móvil a cargar. Cuando te despiertas, a mediodía, continúas el juego.
- se te queda el cargador en el estudio y se te acaban la batería: ¿cómo le dices a Freddie que te lo envíe?
- instalación de aplicaciones en el móvil: reloj (ya instalada); linterna; mareas
	- uso de las aplicaciones:



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
	
		id: 'push',
		
		enabled: function (indexItem, indexItem2) {
			if ( (indexItem ==  primitives.IT_X("timbre_hippie")) || (indexItem ==  primitives.IT_X("timbre_embarazada")) ) return true;
				
			return false
		},

		reaction: function (par_c) {
			
			var PNJIndex  = -1
			if (par_c.item1 ==  primitives.IT_X("timbre_hippie")) PNJIndex = primitives.IT_X("hippie")
			else PNJIndex = primitives.IT_X("embarazada")

			if (primitives.IT_GetLoc(PNJIndex) ==  primitives.PC_GetCurrentLoc()) {
				primitives.CA_QuoteBegin (primitives.IT_GetId(PNJIndex), "" , [], false ); 
				primitives.GD_CreateMsg (1, "DLG_ya_estoy_aquí", "Ya estoy aquí, ¿para qué me llamas?");
				primitives.CA_QuoteContinues ("DLG_ya_estoy_aquí", [], true );
				return true
			} else {
				// si no están en casa, simplemente salen y reaccionan como "talk"
				primitives.IT_SetLoc(PNJIndex, primitives.PC_GetCurrentLoc());
				primitives.GD_CreateMsg (1, "%o1_aparece", "%o1 aparece.");
				primitives.CA_ShowMsg ("%o1_aparece", {o1:primitives.IT_GetId(PNJIndex)});
				
				// primitives.GD_CreateMsg (1, "no_aparece_nadie", "No aparece nadie.<br/>");
				// primitives.CA_ShowMsg ("no_aparece_nadie");
			}
			
			
			// igual que talk
			usr.hablarConPNJ (PNJIndex)


			return true
			
		}
		
	});
	
	reactions.push ({ 
		id: 'look',
		
		reaction: function (par_c) {
			
			if (par_c.loc == primitives.IT_X("estudio")) {
				if (primitives.IT_GetAttPropValue (par_c.loc, "generalState", "state") == "0") {
					primitives.GD_CreateMsg (1, "sueño", "No puedes respirar, estás encerrado en la cueva de la playa y no puedes escapar. De repente, un corrimiento de arena de la playa entra en la cueva y te cubre hasta la cintura y no puedes moverte. En tus manos tienes el collar de conchas marinas que has hecho para regalárselas a tu querido hermano...<br/>Pero no, no puede ser, estos no son recuerdos tuyos, sólo pueden ser los últimos recuerdos de ella, del día en que...<br/>Despiertas, mojado en sudor.<br/><br/>Te levantas, no crees que vayas a poder reconciliar el sueño. De hecho, temes volver a dormir y volver a vivir esa horrible experiencia.<br/>Tienes la maleta casi preparada para el viaje de vuelta a la vieja casa familiar, en la costa. Sólo te hace falta meter un par de cosas más y podrás emprender ese viaje que llevas retrasando ya quince años.<br/>Has terminado el primer borrador de tu nueva novela y crees que la vieja casa te dará la tranquilidad necesaria para terminarla, lejos del ruido y las obligaciones de la ciudad."); 
					primitives.CA_ShowMsg ("sueño");
					primitives.IT_SetAttPropValue (par_c.loc, "generalState", "state", 1)
					
					return true;
				}
			}

		}
		
	});
	
	
	
	reactions.push ({
		id: 'talk',
		
		reaction: function (par_c) {
		
			return usr.hablarConPNJ (par_c.item1)
			
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
		id: 'drop', 
		
		reaction: function (par_c) {

			if (par_c.item1Id  == "móvil") {
				primitives.GD_CreateMsg (1, "nomobofia", "Cuando vas a dejarlo, te entra tu habitual ataque de nomobofia y no lo sueltas.<br/>"); 
				primitives.CA_ShowMsg ("nomobofia");

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

			
			if (typeof par_c.option == 'undefined') { // phase 1: asking dialog
			
				primitives.GD_CreateMsg (1, "llamar_a_quien", "¿A quién quieres llamar?<br/>"); 
				primitives.CA_ShowMsg ("llamar_a_quien");

				var menu = []
				
				primitives.GD_CreateMsg (1, "cancelar_acción", "Cancelar la acción"); 
				menu.push ({id:"cancelar", msg:"cancelar_acción"})

				primitives.GD_CreateMsg (1, "llamar_a_estudio", "Freddie"); 
				menu.push ({id:"estudio", msg:"llamar_a_estudio"})

				if (primitives.IT_GetAttPropValue (primitives.IT_X("panfleto"), "generalState", "state") != "0") {
					primitives.GD_CreateMsg (1, "llamar_a_telepapeo", "TelePapeo"); 
					menu.push ({id:"telepapeo", msg:"llamar_a_telepapeo"})
				}
				
				if (primitives.IT_GetAttPropValue (primitives.IT_X("hippie"), "generalState", "state") != "0") {
					primitives.GD_CreateMsg (1, "llamar_a_playa", "Charlie"); 
					menu.push ({id:"hippie", msg:"llamar_a_playa"})
				}

				if (primitives.IT_GetAttPropValue (primitives.IT_X("embarazada"), "generalState", "state") != "0") {
					primitives.GD_CreateMsg (1, "llamar_a_playa", "Vicky"); 
					menu.push ({id:"embarazada", msg:"llamar_a_playa"})
				}

	
				primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2

				return true;

			} else { // getting answer
			
			
				if (par_c.option == "cancelar") {
					primitives.GD_CreateMsg (1, "no_llamas", "Al final no llamas a nadie"); 
					primitives.CA_ShowMsg ("no_llamas");
				} else if (par_c.option == "estudio") {
					primitives.GD_CreateMsg (1, "llamas_a_estudio", "Llamas a Freddie"); 
					primitives.CA_ShowMsg ("llamas_a_estudio");
				} else if (par_c.option == "telepapeo") {
					primitives.GD_CreateMsg (1, "llamas_a_playa", "Llamas a Charlie"); 
					primitives.CA_ShowMsg ("llamas_a_playa");
				} else if (par_c.option == "hippie") {
					primitives.GD_CreateMsg (1, "llamas_a_playa", "Llamas a Charlie"); 
					primitives.CA_ShowMsg ("llamas_a_playa");
				} else if (par_c.option == "embarazada") {
					primitives.GD_CreateMsg (1, "llamas_a_playa", "Llamas a Vicky"); 
					primitives.CA_ShowMsg ("llamas_a_playa");
				}
				
				// to-do: se inicia la conversación telefónica
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
			
			// si aún en estudio: es muy tarde, vas a perder el avión
			if (primitives.PC_GetCurrentLoc() == primitives.IT_X("estudio")) {
				primitives.GD_CreateMsg (1, "es_muy_tarde", "¡Es muy tarde! Deberías salir ya para el aeropuerto o perderás el avión que te lleva a la costa.<br/>"); 
				primitives.CA_ShowMsg ("es_muy_tarde");
				return true;
			}
			
			// calcular hora en función de app_reloj.state
			var estado_hora = +primitives.IT_GetAttPropValue (primitives.IT_X("app_reloj"), "generalState", "state") 
			var hora = Math.floor(estado_hora / 60)
			var minutos = (estado_hora - hora * 60) 
			
			// to-do: %s parameter!
			// primitives.GD_CreateMsg (1, "son_las_s1_s2", "Son las %s1:%s2<br/>"); 
			// primitives.CA_ShowMsg ("son_las_s1_s2", {s1: hora, s2: minutos });
			primitives.CA_ShowMsgAsIs ("Son las " + hora + ":" + minutos + ".<br/>");

			// estado baterías
			estado_hora = +primitives.IT_GetAttPropValue (primitives.IT_X("app_batería"), "generalState", "state") 
			hora = Math.floor(estado_hora / 60)
			minutos = (estado_hora - hora * 60)

			// to-do: %s parameter!		
			// primitives.GD_CreateMsg (1, "batería_restante_s1_s2", "A la batería le quedan %s1 horas y %s2 minutos.<br/>"); 
			// primitives.CA_ShowMsg ("batería_restante_s1_s2", {s1: hora, s2: minutos });
			primitives.CA_ShowMsgAsIs ("A la batería le quedan " + hora + " horas y " + minutos + " minutos.<br/>");

			return true;
			
		}
		
	});

	reactions.push ({ 

		id: 'móvil_linterna', 
		
		enabled: function (indexItem, indexItem2) {
			
			if (indexItem != primitives.IT_X("móvil")) return false;
			
			return true;
		},
		
		reaction: function (par_c) {
			
			// si aún en estudio: no te hace falta
			if (primitives.PC_GetCurrentLoc() == primitives.IT_X("estudio")) {
				primitives.GD_CreateMsg (1, "linterna_en_estudio", "Miras a tu alrededor y ves que no te hace falta usarla."); 
				primitives.CA_ShowMsg ("linterna_en_estudio");
				
				return true;
			}
			
			// to-do: switch on/off (debería controlarse por atributo de librería)
			if (primitives.IT_GetAttPropValue (primitives.IT_X("app_linterna"), "generalState", "state") == "0") {
				primitives.GD_CreateMsg (1, "linterna_encendida", "Enciendes la linterna del móvil.<br/>"); 
				primitives.CA_ShowMsg ("linterna_encendida");
				primitives.IT_SetAttPropValue (primitives.IT_X("app_linterna"), "generalState", "state", "1")
			} else {
				primitives.GD_CreateMsg (1, "linterna_apagada", "Apagas linterna del móvil<br/>"); 
				primitives.CA_ShowMsg ("linterna_apagada");
				primitives.IT_SetAttPropValue (primitives.IT_X("app_linterna"), "generalState", "state", "0")		
			}
			
			return true;
			
		}
		
	});
			
	reactions.push ({ 

		id: 'móvil_mareas', 
		
		enabled: function (indexItem, indexItem2) {
			
			if (indexItem != primitives.IT_X("móvil")) return false;
			if (primitives.IT_GetAttPropValue (primitives.IT_X("hippie"), "generalState", "state") == "0") return false
			
			return true;
		},
		
		reaction: function (par_c) {
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
	
	var  primitives = this.primitives // tricky

	if (indexItem == primitives.IT_X("app_reloj")) usr.incementar_hora()
	if (indexItem == primitives.IT_X("app_batería")) usr.gastar_bateria()
	
	if (indexItem == primitives.IT_X("hippie")) usr.turnoHippie()
	if (indexItem == primitives.IT_X("embarazada")) usr.turnoEmbarazada()
	
		
}


// internal functions ****************************************************************************************************************

usr.incementar_hora = function() {
	
	var  primitives = this.primitives // tricky

	var incremento = 15

	if (primitives.PC_GetCurrentLoc() == primitives.IT_X("estudio")) return;

	var estado = +primitives.IT_GetAttPropValue (primitives.IT_X("app_reloj"), "generalState", "state") + incremento
	
    // to-do: si después de las 23:00 (1380 minutos): a dormir
	if (estado >= 1380) {
		primitives.GD_CreateMsg (1, "a_dormir", "El sueño te vence y te arrastras a la cama. Mañana será otro día.<br/>");
		primitives.CA_ShowMsg ("a_dormir");
		estado = 450 // 7:30 de la mañana
	}

	primitives.IT_SetAttPropValue (primitives.IT_X("app_reloj"), "generalState", "state", estado)	
	
	// to_do: de manera similar, recalcular estado mareas

}

usr.gastar_bateria = function() {
	
	var  primitives = this.primitives // tricky

	var decremento = (primitives.IT_GetAttPropValue (primitives.IT_X("app_linterna"), "generalState", "state") == "0")? 15: 60

	if (primitives.PC_GetCurrentLoc() == primitives.IT_X("estudio")) return;

	var estado = +primitives.IT_GetAttPropValue (primitives.IT_X("app_batería"), "generalState", "state") - decremento
	
	primitives.IT_SetAttPropValue (primitives.IT_X("app_batería"), "generalState", "state", estado)	
	
	if (estado <= 120) {
		primitives.GD_CreateMsg (1, "te_quedas_sin_batería", "Te estás quedando sin baterías. Menos de dos horas a ritmo normal.<br/>");
		primitives.CA_ShowMsg ("te_quedas_sin_batería");
	}

}

usr.poema = function() {
	var  primitives = this.primitives // tricky

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
	
usr.hablarConPNJ = function(PNJIndex) {
	
	var  primitives = this.primitives // tricky
		
	if (PNJIndex == primitives.IT_X("hippie")) {
		
		if (primitives.IT_GetAttPropValue (PNJIndex, "generalState", "state") == "0") {

			primitives.CA_QuoteBegin (primitives.IT_GetId(PNJIndex), "" , [], false ); 
			primitives.GD_CreateMsg (1, "DLG_hippie_se_presenta", "¡Hola!, ¿qué puedo hacer por usted?... pero espera, ¡tú eres Al, mi viejo amigo de aventuras veraniegas! ¡Cómo me alegro de verte después de tantos años! Yo sigo aquí, con mi surf (a propósito, mira que app más guapa para saber a qué hora son las mareas)», te coge tu móvil y te la instala sin más, «y mi música. Vente un día a comer a casa. Tú pones el alcohol y yo me encargo del resto. Tengo género de buena calidad.")
			primitives.CA_QuoteContinues ("DLG_hippie_se_presenta", [], true );
			
			primitives.GD_CreateMsg (1, "hippie_se_despide", "<br/>Sin darte mucho margen, tu amigo Charlie se mete en casa ('a dormir la mona', dice), no sin antes dejarte su número de móvil"); 
			primitives.CA_ShowMsg ("hippie_se_despide");

			primitives.IT_SetAttPropValue (PNJIndex, "generalState", "state", 1) // Charlie pasa a ser conocido
			primitives.IT_SetLocToLimbo (PNJIndex);

			return true
		}

	}

	if (PNJIndex == primitives.IT_X("embarazada")) {
		
		if (primitives.IT_GetAttPropValue (PNJIndex, "generalState", "state") == "0") {

			primitives.CA_QuoteBegin (primitives.IT_GetId(PNJIndex), "" , [], false ); 
			primitives.GD_CreateMsg (1, "DLG_embarazada_se_presenta", "¡Al!» Sin darte tiempo a reaccionar una corpulenta mujer embarazada se abalanza encima tuya y te da cuatro besos.«¡Qué alegría más grande! ¿Vas a estar mucho?, ¿unas semanas tal vez?, ¡qué bueeeno! Paso mucho tiempo sola en casa por las mañanas, con mi marido Marcos casi todo el tiempo trabajando en la ciudad. Apunta mi número de móvil: llámame e invítame a tu casa a comerme un helado de chocolate. ¡Estos días sólo pienso en comer chocolate!")
			primitives.CA_QuoteContinues ("DLG_embarazada_se_presenta", [], true );
			
			primitives.GD_CreateMsg (1, "embarazada_se_despide", "<br/><br/>Vicky hace gestos de sentir náuseas y sin previo aviso entra en casa.<br/>"); 
			primitives.CA_ShowMsg ("embarazada_se_despide");

			primitives.GD_CreateMsg (1, "recuerdas_libro", "<br/>De repente... te acuerdas de tu viejo libro comprado en el mercado de Marrakech. Te viene a la memoria una página en concreto, con unas ilustraciones de una mujer embarazada de gemelos. ¿Por qué te habrá venido ese recuerdo ahora? Seguro que es una tontería, pero no te vas a quedar tranquilo hasta que consultes el libro.<br/>"); 
			primitives.CA_ShowMsg ("recuerdas_libro");
			
			// si no lo traiste
			if ( (primitives.IT_GetLoc(primitives.IT_X("libro_magia")) == primitives.IT_X("estudio")) || 
				 (primitives.IT_GetLoc(primitives.IT_X("libro_magia")) == primitives.IT_X("estantería")) ) {
				primitives.GD_CreateMsg (1, "libro_en_estudio", "«¡Mierda!», recuerdas que no metiste el libro en la maleta; «quizás el bueno de Freddie me lo pueda enviar por mensajería.»<br/>"); 
				primitives.CA_ShowMsg ("libro_en_estudio");

			 }

			primitives.IT_SetAttPropValue (PNJIndex, "generalState", "state", 1) // Vicky pasa a ser conocida
			primitives.IT_SetLocToLimbo (PNJIndex);

			return true
		}

	}	
	
	return false


}

usr.turnoHippie = function () {
	
	var  primitives = this.primitives // tricky
	var PNJIndex = primitives.IT_X("hippie")

	if (primitives.IT_GetLoc(PNJIndex) ==  primitives.PC_GetCurrentLoc()) {
		// nada que decir
		primitives.CA_QuoteBegin (primitives.IT_GetId(PNJIndex), "" , [], false ); 
		primitives.GD_CreateMsg (1, "DLG_saluda", "¿Qué tal?")
		primitives.CA_QuoteContinues ("DLG_saluda", [], true );
	}
	
	// to-do: si no interactúas con el PNJ -> se va
	
}

usr.turnoEmbarazada = function () {
	
	var  primitives = this.primitives // tricky
	var PNJIndex = primitives.IT_X("embarazada")

	if (primitives.IT_GetLoc(PNJIndex) ==  primitives.PC_GetCurrentLoc()) {
		// nada que decir
		primitives.CA_QuoteBegin (primitives.IT_GetId(PNJIndex), "" , [], false ); 
		primitives.GD_CreateMsg (1, "DLG_saluda", "¿Qué tal?")
		primitives.CA_QuoteContinues ("DLG_saluda", [], true );
	}
	
	// to-do: si no interactúas con el PNJ -> se va
	
}

