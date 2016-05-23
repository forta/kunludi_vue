//Section 1a: gameReaction (lib overwrite)
//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute 
//Section 3: gameItems

// **********************************************
//Section 1: gameReaction
// **********************************************


ludi_game.reactions = []; // set of default-reaction functions

// 1.a LIB OVERWRITE *************************************************************

ludi_game.reactions.push ({
	id: 'look',
	
	reaction: function (par_c) {

		if (par_c.item1Id== "room") {
			if (!IT_ATT(par_c.item1, "gameParameters")) {
				CA_ShowMsg ("Este juego necesita tener definido el atributo gameParameters en la localidad inicial del juego");
				CA_EndGame();
				return true;
			}
			
			var gameParameters_VERSION = IT_GetAttPropValue (par_c.item1, "gameParameters", "version");
			if (gameParameters_VERSION == "") {
				// phase1: asking for user preferences
				if (typeof par_c.option == 'undefined') { // phase 1: asking dialog
					CA_ShowMsg ("¿Qué versión quieres jugar, la reducida o la completa?");

					var menu = ["versión reducida","versión completa"];
					CA_ShowMenu (menu); // continuation in state == 0, phase 2
					return;

				} else { // getting asnwer
					if (par_c.option == 0) {
						IT_SetAttPropValue (par_c.item1, "gameParameters", "version","reducida");
						CA_ShowMsg ("Es una buena elección para echar un vistazo, pero la versión completa tiene más jugo.");
					} else {
						IT_SetAttPropValue (par_c.item1, "gameParameters", "version","completa");
						CA_ShowMsg ("Has elegido la versión que elegiría un aventurero intrépido");
					}
					
				}
				return false;
					
			}
		}
		
	},
	
});

ludi_game.reactions.push ({
	id: 'tie',
	
	enabled: function (indexItem,indexItem2) {
		return ((indexItem == IT_X("rope1")) || 
			    (indexItem == IT_X("rope2")) ||
				(indexItem == IT_X("rope3")));
	},
	reaction: function (par_c) {

		// general lib NPC reaction
		// to-do (clearer): IT_LibReaction(this.id, par_c.item1, par_c.item2) {
		ludi_lib.reactions[this.index].reaction(par_c.item1, par_c.item2);
	},
	
});

ludi_game.reactions.push ({
	id: 'talk',
	
	enabled: function (indexItem,indexItem2) {
		return ludi_lib.reactionById(this.id).enabled(indexItem, indexItem2);
	},
	
	reaction: function (par_c) {

		// general lib NPC reaction
		// to-do (clearer): IT_LibReaction(this.id, par_c.item1, par_c.item2) {
		ludi_lib.reactions[this.index].reaction(par_c.item1, par_c.item2);
	},
	
});

ludi_game.reactions.push ({
	id: 'lock',
	
	enabled: function (indexItem,indexItem2) {
		// game code here
		if (IT_ATT(indexItem, "isOpen")) return true;
		return false;
		
		// default (not exits)
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("You lock %o1", [par_c.item1Id]);
	},
	
});

ludi_game.reactions.push ({
	id: 'sing',
	
	enabled: function (indexItem,indexItem2) {
		if (PC_GetCurrentLoc () == IT_X("forest")) return true;
		return false;		
	},
	
	reaction: function (par_c) {
		// game reaction, show a picture
		CA_ShowImg ('http://siliconangle.com/files/2013/12/Lets-Play-Logo_3102180.jpg');
		CA_ShowMsgAsIs ("<br/>");
		// general lib reaction
		ludi_lib.reactions[this.index].reaction(par_c.item1, par_c.item2);
		CA_PressKey("Click here or press any key to continue");
		
		// to-do: next doesn't work
		//ludi_lib.reactionsById(this.id).reaction(par_c.item1, par_c.item2);
	},
	
});

// 1.b GAME-SPECIFIC (without lib counterpart) *************************************************************

ludi_game.reactions.push ({ 

	id: 'play-instrument',
	
	enabled: function (indexItem,indexItem2) {
		// game code here
		if (IT_ATT(indexItem, "isMusicInstrument")) return true;
		return false;
		
		// default (not exits)
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("You play %o1", [par_c.item1Id]);
	},
	
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

// 0: harry (pc)
ludi_game.items.push ({
	id: 'harry',
	
	desc: function () {
		// by default, simply display associated [desc] built-in attribute
		// to-do (clearer): IT_DefaultReaction("desc", this.index, -1) {
		CA_ShowDesc (this.index);
	},
	
	// to-do: pending to destroy (executed because harry is defined as npc and not as pc)
	turn: function () {
	}
	
});

// room
ludi_game.items.push ({
	id: 'room',
	
	target: function (dirId) {
		if (dirId == "out") {
			if (IT_GetLoc (IT_X("key")) == PC_X() ) return "exit";
			return "locked";
		} else 	if (dirId == "d0") {
			if (IT_GetLoc (IT_X("key")) == PC_X() ) return "forest";
		}
		return "";

	},

	desc: function () {
		
			
		// by default, simply display associated [desc] built-in attribute
		CA_ShowDesc (this.index); 
		if (IT_GetLoc (IT_X("key")) != PC_X() ) {
			CA_ShowMsg ("so you should take the key if you can go out.");
		}

	}
	
	
});

ludi_game.items.push ({
	id: 'exit',

	transitionTo: function (target) {
	
		if (target == IT_X("room")) {
			
			if (IT_GetLoc (IT_X("key")) != PC_X()) { // better: if (PC_Carrying (IT_X("key")) {
				CA_ShowMsg ("You've just come in the room without the key, so how will you go out now?");
				CA_ShowMsgAsIs ("<p></p>");

			}
			
		}
		
		return false;
		
	}
});

// door_room
ludi_game.items.push ({
	id: 'door_room',
	
	desc: function () {
		// by default, simply display associated [desc] built-in attribute
		CA_ShowDesc (this.index);
		if (IT_GetLoc (IT_X("key")) == PC_X() ) {
			CA_ShowMsg (". It's great that you have the key. Now you can go out... but will you be able to go back?");
		} else {
			CA_ShowMsg (". You should take it to go out... but will you be able to go back?");
		} 

	},
	
});


// flutist (npc)
ludi_game.items.push ({
	id: 'flutist',
	
	desc: function () {
		// by default, simply display associated [desc] built-in attribute
		CA_ShowDesc (this.index);
	},

	talk: function (par_c) {
		if (!IT_ATT(this.index, "NPCState")) return true;
		
		var state = IT_GetAttPropValue (this.index, "NPCState", "state");
		
		if (typeof par_c.option == 'undefined') { // phase 1: asking dialog
			if (state == 0) { // ask q1

				// In GD_CreateMsg: 0 for EN, 1 for ES, 2 for EO
				GD_CreateMsg (0, "flutist ask1", "Flutist looks at you and asks you... 'What is at the end of everything?'");
				GD_CreateMsg (1, "flutist ask1", "el flautista te mira y te pregunta... '&iquest;C&oacute;mo acaba todo?'");
				GD_CreateMsg (2, "flutist ask1", "la flutisto rigardas vin kaj vi demandas... 'kiel finiĝas ĉio'");

				CA_ShowMsg("flutist ask1");

				GD_CreateMsg (0, "flutist ask1_answer1", "I don\'t know!");
				GD_CreateMsg (0, "flutist ask1_answer2", "g");
				GD_CreateMsg (0, "flutist ask1_answer3", "Help");
				GD_CreateMsg (1, "flutist ask1_answer1", "No lo s&eacute;!");
				GD_CreateMsg (1, "flutist ask1_answer2", "o");
				GD_CreateMsg (1, "flutist ask1_answer3", "Ayuda");
				GD_CreateMsg (2, "flutist ask1_answer1", "Mi ne scias!");
				GD_CreateMsg (2, "flutist ask1_answer2", "o");
				GD_CreateMsg (2, "flutist ask1_answer3", "Help");

				var menu = ["flutist ask1_answer1","flutist ask1_answer2","flutist ask1_answer3"];
				CA_ShowMenu (menu); // continuation in state == 0, phase 2
				
			} else if (state == 1) { // q2

				GD_CreateMsg (0, "flutist ask2", "Second question: 'what do I have in my pocket?'");
				GD_CreateMsg (0, "flutist ask2", "Second question: 'What do I have in my pocket>??'");
				GD_CreateMsg (1, "flutist ask2", "Segunda pregunta: '&iquest;Qu&eacute; tengo en mi bolsillo??'");
				GD_CreateMsg (2, "flutist ask2", "dua demando: 'Kion mi havas en mia poŝo??'");

				CA_ShowMsg("flutist ask2");

				GD_CreateMsg (0, "flutist ask2_answer1", "I don\'t know!");
				GD_CreateMsg (0, "flutist ask2_answer2", "A ring!");
				GD_CreateMsg (0, "flutist ask2_answer3", "An aspirin");
				GD_CreateMsg (1, "flutist ask2_answer1", "No lo s&eacute;!");
				GD_CreateMsg (1, "flutist ask2_answer2", "Un anillo!");
				GD_CreateMsg (1, "flutist ask2_answer3", "Una aspirina");
				GD_CreateMsg (2, "flutist ask2_answer1", "Mi ne scias!");
				GD_CreateMsg (2, "flutist ask2_answer2", "Ringo!");
				GD_CreateMsg (2, "flutist ask2_answer3", "Aspirino");
				
				var menu = ["flutist ask2_answer1","flutist ask2_answer2","flutist ask2_answer3"];
				CA_ShowMenu (menu);
				
			} else if (state == 2) { // q1 confirmation
				// no sense: state 2 requiers an option
				
			} else {
				GD_CreateMsg (0, "flustist silent", "Flutist: I don't want to speak more.");
				GD_CreateMsg (1, "flustist silent", "Flautista: No quiero hablar más.");
				GD_CreateMsg (2, "flustist silent", "Flutisto: Mi ne volas plu paroli.");
				CA_ShowMsg("flustist silent");
			}
			return;
		}

		// second phase (reaction itself)
		if (state == 0) { // answering q1
			if (par_c.option == 1) { // q1 correct
				
				// subsequent dialog:
				GD_CreateMsg (0, "flustist ask2_confirmation", "Flutist: are you sure?");
				GD_CreateMsg (1, "flustist ask2_confirmation", "Flutist: ¿estás seguro?");
				GD_CreateMsg (2, "flustist ask2_confirmation", "Flutist: cxu vi certas");

				CA_ShowMsg("flustist ask2_confirmation");
				
				GD_CreateMsg (0, "flustist ask2_confirmation_yes", "yes");
				GD_CreateMsg (0, "flustist ask2_confirmation_no", "no");
				GD_CreateMsg (1, "flustist ask2_confirmation_yes", "sí");
				GD_CreateMsg (1, "flustist ask2_confirmation_no", "no");
				GD_CreateMsg (2, "flustist ask2_confirmation_yes", "jes");
				GD_CreateMsg (2, "flustist ask2_confirmation_no", "ne");

				//new state: before launh new menu!
				IT_SetAttPropValue (this.index, "NPCState", "state","2");

				var menu = ["flustist ask2_confirmation_yes","flustist ask2_confirmation_no"];
				CA_ShowMenu (menu);
				
			} else { // q1 incorrect
				GD_CreateMsg (0, "Flutist says no", "Flutist: No, no!");
				GD_CreateMsg (1, "Flutist says no", "El flutista: No, no!");
				GD_CreateMsg (2, "Flutist says no", "Flutisto: Ne, ne!");
				CA_ShowMsg("Flutist: No, no!");
			}
		} else if (state == 1) { // answering q2
			
			if (par_c.option== 2) {
				GD_CreateMsg (0, "flustist headache", "Flutist: Yes. Terrible headache.");
				GD_CreateMsg (1, "flustist headache", "El flutista: S&iacute;. Un terrible dolor de cabeza.");
				GD_CreateMsg (2, "flustist headache", "Flutisto: Jes. Terura kapdoloro.");
				CA_ShowMsg("flustist headache");
				
				//new state
				IT_SetAttPropValue (this.index, "NPCState", "state","3");
				
			} else {
				CA_ShowMsg("Flutist: No, no!");
			}
		}  else if (state == 2) { // answering q1 confirmation
			
			if (par_c.option== 0) { // sure of q1 answer
				GD_CreateMsg (0, "Flutist says bravo", "Flutist says bravo!");
				GD_CreateMsg (1, "Flutist says bravo", "El flautista dice bravo!");
				GD_CreateMsg (2, "Flutist says bravo", "Flautisto diras bravo!");
				CA_ShowMsg("Flutist says bravo");
				
				//new state
				IT_SetAttPropValue (this.index, "NPCState", "state","1");
				
			} else { // sure of q1 answer
				GD_CreateMsg (0, "Flutist repeats q1", "Flutist: came back when you are surer!");
				GD_CreateMsg (1, "Flutist repeats q1", "El flautista te dice que vuelvas cuando estés más seguro!");
				GD_CreateMsg (2, "Flutist repeats q1", "Flautisto petas ke vi revenu kiam vi pli certos!");
				
				CA_ShowMsg("Flutist repeats q1");

				//new state
				IT_SetAttPropValue (this.index, "NPCState", "state","0");
			}
			
			
		} else { // state 3: there is no question in state 3 which reacts to
		
		}

		return;
			
	},
	
	/*
	
	- Turno del flautista:
	
	* Si no tiene objetos y ve un objeto tirado: coje uno al azar y lo comunica si PC presente.
	* Si no, si tiene objetos, suelta uno y lo comunica si PC presente.
	* Si no, cambia de localización (se mueve entre dos): 
		- si PC está en origen: dice adiós antes de salir. Y mensaje de que se va (por qué dirección).
		- si PC está en destino: dice hola al llegar.
	* Dice cosas al azar sin ser preguntado.
	* Responde cosas al azar cuando le preguntas.

	*/
	turn: function () {
		/*
		if (index == -1 || index == undefined) ludi_lib.NPCTurn.getIndex();
		if (index == -1 || index == undefined) {
			CA_ShowMsgAsIs ("<br/>Debug: Error in ludi_lib.NPCTurn.getIndex()");			
			return;
		}
		*/
		// this.index?
		
		if ( IT_GetLoc(IT_X(this.id)) == PC_GetCurrentLoc()) {
			CA_ShowMsgAsIs ("<br/>");
			CA_ShowMsg ("The flutist looks at you");
		}
		
	},
		
});


