// lib.reactions using lib version 0.01

// standard reactions to game choices

/* this module can:
 
 1) add stuff directly exports.reactionList (former CA actions), or
 2) call libModule primitives who can modify the world state or add stuff in exports.reactionList
 
 Note: the reactionList will be processed by the runner and only must have static messages, not allowing variables which will be processed later
 
 A especial case is the two-step action "menu"

 */
 
let reactionList
let primitives

let reactions = []
let attributes = [] 

export function dependsOn (primitives, reactionList) {
	this.primitives = primitives
	this.reactionList = reactionList
	
	this.reactions = []
	initReactions(this.reactions, this.primitives)

	this.attributes = []
	initAttributes(this.attributes, this.primitives)
	
}

exports.processAction = function  (action) {
	
	if (action.actionId == "look") {
		this.reactionList.push ({type:"msg", detail: {msgId: 'You can see'}} )
		return true
	} else if (action.actionId == "go to d1") {
		// console.log ("action: " +  JSON.stringify (action))
		this.reactionList.push ({type:"msg", detail: {msgId: 'You go to %d1', d1:action.d1}} )
		return true
	} else {
		return false
	} 


}

exports.actionIsEnabled = function  (action, item1, item2) {
	
	if (action == undefined) return false
	if (this.reactions[action] == undefined) return false

	return this.reactions[action].enabled(item1, item2)
	
}


/*
ludi_lib.reactionById = function (actionId) {
	var actionIndex = arrayObjectIndexOf (ludi_game.reactions, "id", actionId);
	return this.reactions[actionIndex];
}
*/

let initReactions =  function  (reactions, primitives) {

	reactions.push ({
		id: 'look',
		
		enabled: function (indexItem,indexItem2) {
			return true;
		},
		
		reaction: function (par_c) {
		
			if (par_c.item2 != -1) { 
				// to-do: show debug message
				
				console.log ("Debug: look with two parameters!")
			
				//return;
			} 
			
			primitives.IT_DynDesc(primitives.PC_GetCurrentLoc ());
		},
		
	});

	reactions.push ({
		id: 'go',
		
		enabled: function (indexItem, indexItem2) {
			return true;
		},
		
		reaction: function (par_c) {
		
			// test
			primitives.CA_ShowMsg("You go to %d1", [par_c.directionId]);
			primitives.CA_ShowMsgAsIs("<br/><br/>");

			// preactions when trying to go out from here
			var link = ludi_lib.getTargetAndLocked (par_c);
			
			// if locked, show locked message
			if (link.isLocked) {
				primitives.CA_ShowMsg("Locked direction" );
				return;
			}
					
			if (link.target == -1) {
				primitives.CA_ShowMsg("It is not possible to go there." );
				return;
			}		
					
			// reaction kernel: change of location
			primitives.PC_SetCurrentLoc(link.target);
			
			// after reaction: by default: standard description

			// transition message (if exist) from both locations (before description)
			IT_TransitionTo (par_c.loc, link.target);
			
			if (!primitives.IT_GetIsItemKnown (primitives.PC_X(), link.target)) {
				// set loc as known;
				primitives.IT_SetIsItemKnown(primitives.PC_X(), link.target, true);
				// primitives.IT_SetWhereItemWas (primitives.PC_X(), link.target, primitives.IT_GetLoc(link.target));
				primitives.IT_SetLastTime (primitives.PC_X(), link.target, primitives.IT_GetLoc(link.target));
					
				if (primitives.IT_ATT(link.target, "score")) {
					// increments PC.score
					var scoreInc = +primitives.IT_GetAttPropValue (link.target, "score", "state");
					
					ludi_runner.userState.profile.score += scoreInc;
					
					//primitives.CA_ShowMsg("You wins o1 points.", scoreInc); 
					primitives.CA_ShowMsg("You wins " + scoreInc + " points." );
				} 

				// first time message
				if (primitives.IT_FirstTimeDesc(link.target)) {
					primitives.IT_DynDesc(link.target);
				}
				
			} else {
				primitives.IT_DynDesc(link.target);
			}
				
			// transition message (if exist) from both locations (after description)
			IT_AfterDescription (link.target);
			
			// endGame locations
			if (primitives.IT_ATT(link.target, "endGame")) {
				primitives.CA_EndGame();
				return;
			}		 

		},
		
	});

	reactions.push ({
		id: 'ex',
		
		enabled: function (indexItem,indexItem2) {
			return true;
		},
		
		reaction: function (par_c) {
			
			primitives.IT_DynDesc (par_c.item1);

			for (var idAtt in ludi_runner.world.items[par_c.item1].att) {
				indexAtt = W_GetAttIndex (idAtt);
				if (indexAtt<0) {
					console.log ("Undefined attribute " + idAtt);
					continue;
				}

				var indexGameAttribute = arrayObjectIndexOf(ludi_game.attribute, "id", idAtt);
				var indexLibAttribute = arrayObjectIndexOf(ludi_lib.attribute, "id", idAtt);
						
				if (indexGameAttribute>=0) {
					ludi_game.attribute[indexGameAttribute].desc(par_c.item1);
				} else if (indexLibAttribute>=0) {
					ludi_lib.attribute[indexLibAttribute].desc(par_c.item1);
				} else {
					
					primitives.CA_ATT( indexAtt);
				}

			}
			
		},
		
	});

	// to-do: consider isTakeAble.weight and isTakeAble.size
	reactions.push ({
		id: 'take',
		
		enabled: function (indexItem,indexItem2) {
			
			// here! error! missing primitives here
			
			if (!primitives.IT_ATT(indexItem, "isTakeAble")) return false;
			if (primitives.IT_GetLoc(indexItem) == primitives.PC_GetCurrentLoc ()) return true;
			return false;
		},
		
		reaction: function (par_c) {

			if (primitives.IT_GetLoc(par_c.item1) == primitives.PC_X())
				primitives.CA_ShowMsg("You just have it!");
			else {
				primitives.CA_ShowMsg("You take %o1", [par_c.item1Id]);
				primitives.IT_SetLoc(par_c.item1, primitives.PC_X());
			}
			
		},
		
	});

	// to-do: consider isTakeAble and isTakeAble.weight and isTakeAble.size
	reactions.push ({
		id: 'drop',
		
		enabled: function (indexItem,indexItem2) {
			if (primitives.IT_GetLoc(indexItem) != primitives.PC_X()) return false;
			return true;
		},
		
		reaction: function (par_c) {
			if (primitives.IT_GetLoc(par_c.item1) != primitives.PC_X())
				primitives.CA_ShowMsg("You don't have it!"); // to-do: pronoun
			else {
				primitives.CA_ShowMsg("You drop it on %o1", [primitives.IT_GetId(primitives.PC_GetCurrentLoc())]);
				
				primitives.IT_SetLoc(par_c.item1, primitives.PC_GetCurrentLoc()); 
				
				// refresh iskwnon/ wherewas
				if (!primitives.IT_GetIsItemKnown (primitives.PC_X(), par_c.item1)) {
					primitives.IT_GetIsItemKnown(primitives.PC_X(), par_c.item1, true);
					primitives.IT_SetWhereItemWas(primitives.PC_X(),par_c.item1, primitives.IT_GetLoc(par_c.item1));
				}
			}
			
		},
		
	});

	// to-do: create attribute isTalkAble?
	reactions.push ({
		id: 'talk',
		
		enabled: function (indexItem,indexItem2) {
			return true;
		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You talk with %o1", [par_c.item1]); // to-do: pronoun
			primitives.CA_ShowMsgAsIs (" ... ");
			primitives.CA_ShowMsg("but without any reaction");
		},
		
	});

	reactions.push ({
		id: 'become',
		
		enabled: function (indexItem,indexItem2) {
			if (!primitives.IT_ATT(indexItem, "isBecomeAble")) return false;
			return true;
		},
		
		reaction: function (par_c) {
			
			primitives.CA_ShowMsgAsIs("<br/>");
			primitives.CA_ShowMsg("You become %o1", [par_c.item1Id]);
			primitives.CA_ShowMsgAsIs("<br/>");
			primitives.PC_SetIndex(par_c.item1);
			primitives.IT_DynDesc (primitives.PC_GetCurrentLoc());
			primitives.CA_Refresh ();
			
		},
		
	});


	// to-do consider isContainer.maxWeight and .maxSize
	reactions.push ({
		id: 'put_into',
		
		enabled: function (indexItem,indexItem2) {
					
			if (!primitives.IT_ATT(indexItem, "isTakeAble")) return false;
			if (indexItem2 == -1) return false;
			if (indexItem2 == indexItem) return false;
			if (!primitives.IT_ATT(indexItem2, "isContainer")) return false;
			if (primitives.IT_GetLoc(indexItem) == indexItem2) return false;
			
			return true;
		},
		
		reaction: function (par_c) {
			if (par_c.item2==-1) {
				primitives.CA_ShowMsg("You shoud mark a container first");

			} else {
				if (par_c.item1 == par_c.item2) {
					primitives.CA_ShowMsg("You cannot put a object into itself");
				} else {
					if (!primitives.IT_ATT(par_c.item2, "isContainer")) {
						primitives.CA_ShowMsg("The marked object must be a container");
					} else {
						primitives.CA_ShowMsg("You put %o1 into %o2", [par_c.item1 , par_c.item2]);

						primitives.IT_SetLoc(par_c.item1, par_c.item2);
					}
				}
			}
					
		},
		
	});

	// to-do: consider canCarry
	reactions.push ({
		id: 'give',
		
		enabled: function (indexItem, indexItem2) {
			if (indexItem == indexItem2) return false;
			if (!primitives.IT_ATT(indexItem, "isTakeAble")) return false;
			if (primitives.IT_GetType(indexItem2) == "loc") return false;
			
			// to-do: create attribute isGiveAble?
			if (primitives.IT_GetType(indexItem2) == "obj") return false;
			
			// item2 must be here
			if (primitives.IT_GetLoc(indexItem2) != primitives.PC_GetCurrentLoc()) return false;
			
			return true;
		},
		
		reaction: function (par_c) {
			if (par_c.item2==-1) return false;
			if ((primitives.IT_GetType(par_c.item2) != "npc") && (primitives.IT_GetType(par_c.item2) != "pc")) return false;
			
			// to-translate: 
			primitives.CA_ShowMsg("You try to give o1 to o2", [par_c.item1Id, par_c.item2Id]);
			return true;		
		},
		
	});

	// to-do: consider isContainer
	reactions.push ({
		id: 'take_from',
		
		enabled: function (indexItem,indexItem2) {
			if (!primitives.IT_ATT(indexItem, "isTakeAble")) return false;
			if (indexItem2==-1) return false;
			if (indexItem2 == indexItem) return false;
			if (!primitives.IT_ATT(indexItem2, "isContainer")) return false;
			if (primitives.IT_GetLoc(indexItem) != indexItem2) return false;
			return true;
		},
		
		reaction: function (par_c) {

			primitives.CA_ShowMsg("You take %o1 from %o2", [par_c.item1Id, par_c.item2Id]);
			primitives.IT_SetLoc(par_c.item1, primitives.PC_X());
		},
		
	});

	reactions.push ({
		id: 'ask_about',
		
		enabled: function (indexItem, indexItem2) {
			// to-do: create isTalkAble?
			// if (!primitives.IT_ATT(indexItem, "isTalkAble")) return false;
			
			if (indexItem2 == undefined) return false;
			if (indexItem == indexItem2) return false;

			if (primitives.IT_GetType(indexItem2) == "loc") return false;
			
			if (primitives.IT_GetType(indexItem2) == "obj") return false;
			
			// item2 must be here
			if (primitives.IT_GetLoc(indexItem2) != primitives.PC_GetCurrentLoc()) return false;
			
			return true;
		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("%o1 does not react when you ask about %o2", [par_c.item2Id, par_c.item1Id]);		
		},
		
	});

	// to-do: consider canCarry
	reactions.push ({
		id: 'ask_from',
		
		enabled: function (indexItem, indexItem2) {
			if (!primitives.IT_ATT(indexItem, "isTakeAble")) return false;

			if (indexItem2==-1) return false;
			if (indexItem2 == undefined) return false;
			if (indexItem2==primitives.PC_X()) return false;
			
			if ((primitives.IT_GetType(indexItem2) != "npc") && (primitives.IT_GetType(indexItem2) != "pc")) return false;
			if (primitives.IT_GetLoc (indexItem) != indexItem2) return false;
			
			// only if item2 you have item1
			return (primitives.IT_GetLoc(indexItem) == indexItem2);
		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("%o1 does not react when you ask for %o2", [par_c.item2Id, par_c.item1Id]);
		},
		
	});

	reactions.push ({
		id: 'show_to',
		
		enabled: function (indexItem,indexItem2) {
			if (indexItem2 == undefined) return false;
			if (indexItem2==-1) return false;
			if (indexItem2==primitives.PC_X()) return false;

			if ((primitives.IT_GetType(indexItem2) != "npc") && (primitives.IT_GetType(indexItem2) != "pc")) return false;
			if (primitives.IT_GetLoc (indexItem) != indexItem2) return false;
			

			// only if you have it
			return (primitives.IT_GetLoc(indexItem) == primitives.PC_X());

		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("%o1 does not react when you show %o2", [par_c.item2Id, par_c.item1Id]);
			
		},
		
	});

	reactions.push ({
		id: 'read',
		
		enabled: function (indexItem,indexItem2) {
			if (!primitives.IT_ATT(indexItem, "isReadAble")) return false;
			return true;
		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You read %o1", [par_c.item1Id]);
			primitives.CA_ShowMsgAsIs(".");
			primitives.CA_ShowMsg(primitives.IT_GetAttPropValue (par_c.item1, "isReadAble", "msgId")); 
			
		},
		
	});

	reactions.push ({
		id: 'turnon',
		
		enabled: function (indexItem,indexItem2) {
			if (!primitives.IT_ATT(indexItem, "isSwitchAble")) return false;
			return (primitives.IT_GetAttPropValue (indexItem, "isSwitchAble", "state") != "on");
		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You turn on %o1", [par_c.item1]);
			primitives.IT_SetAttPropValue (par_c.item1, "isSwitchAble", "state", "on");		
		},
		
	});

	reactions.push ({
		id: 'turnoff',
		
		enabled: function (indexItem,indexItem2) {
			if (!primitives.IT_ATT(indexItem, "isSwitchAble")) return false;
			return (primitives.IT_GetAttPropValue (indexItem, "isSwitchAble", "state") != "off");
		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You turn off %o1", [par_c.item1]);
			primitives.IT_SetAttPropValue (par_c.item1, "isSwitchAble", "state", "off");		
		},
		
	});

	reactions.push ({
		id: 'sing',
		
		enabled: function (indexItem,indexItem2) {
			return true;
		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You sing");
			
		},
		
	});

	reactions.push ({
		id: 'where',
		
		enabled: function (indexItem,indexItem2) {
			// here
			if (primitives.IT_CarriedOrHere(indexItem)) return false;
			// if in limbo, not shown
			// if (primitives.IT_GetId(primitives.IT_GetLoc(indexItem))== "limbo") return false; // really?
			return true; // not here
		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("where %o1 was?", [par_c.item1Id]);
			var whereWas = primitives.IT_GetWhereItemWas(primitives.PC_X(),par_c.item1);

			if (whereWas == -1) primitives.CA_ShowMsg ("location unknown of %o1", [par_c.item1Id]);
			else if (primitives.IT_GetId(whereWas)== "limbo") primitives.CA_ShowMsg ("location unknown of %o1", [par_c.item1Id]);
			else primitives.CA_ShowItem (whereWas);
			primitives.CA_ShowMsgAsIs ("<br/>");
		},

	});

	reactions.push ({
		id: 'open',
		
		enabled: function (indexItem,indexItem2) {
			if (!primitives.IT_ATT(indexItem, "isOpen")) return false;
			return (primitives.IT_GetAttPropValue (indexItem, "isOpen", "state") != "open");
		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You open %o1", [par_c.item1Id]);
			primitives.IT_SetAttPropValue (par_c.item1, "isOpen", "state", "open");
		},
		
	});

	reactions.push ({
		id: 'close',
		
		enabled: function (indexItem,indexItem2) {
			if (!primitives.IT_ATT(indexItem, "isOpen")) return false;
			return (primitives.IT_GetAttPropValue (indexItem, "isOpen", "state") != "close");
		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You close %o1", [par_c.item1]);
			primitives.IT_SetAttPropValue (par_c.item1, "isOpen", "state", "close");
		},
		
	});

	reactions.push ({
		id: 'unlock',
		
		enabled: function (indexItem,indexItem2) {
			if (!primitives.IT_ATT(indexItem, "isOpen")) return false;
			if (!primitives.IT_AttPropExists(indexItem, "isOpen", "locked")) return false;
			return (primitives.IT_GetAttPropValue (indexItem, "isOpen", "locked") == "true");
		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You unlock %o1", [par_c.item1]);
		},
		
	});

	reactions.push ({
		id: 'lock',
		
		enabled: function (indexItem,indexItem2) {
			if (!primitives.IT_ATT(indexItem, "isOpen")) return false;
			if (!primitives.IT_AttPropExists(indexItem, "isOpen", "locked")) return false;
			return (primitives.IT_GetAttPropValue (indexItem, "isOpen", "locked") == "false");
		},
		
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You lock %o1", [par_c.item1]);
		},
		
	});

	reactions.push ({
		id: 'look_dir',

		enabled: function (indexItem, indexItem2) {
			return false;
		},
		
		reaction: function (par_c) {
		
			// if attribute lookDir exists, show it
			for(var i = 0, len = ludi_runner.world.items[par_c.loc].address.length; i < len; i++) {
				
				if(typeof ludi_runner.world.items[par_c.loc].address[i].lookDir != 'undefined'){ 
					var lookDirValue = ludi_runner.world.items[par_c.loc].address[i].lookDir;
					primitives.CA_ShowMsg (lookDirValue);
					return;
				}
			}
			
			// default reaction
			primitives.CA_ShowMsg("You look to %d1", [par_c.direction]);
		},
		
	});

	reactions.push ({
		id: 'investigate',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You get nothing.")
		}
	});

	reactions.push ({
		id: 'dig_with',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You try to dig but you get nothing.");
		}
	});

	reactions.push ({
		id: 'climb',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			// primitives.CA_ShowMsg("You cannot climb"); 
			primitives.CA_ShowMsg("You cannot %v1", [this.index]); // just testing
		}
	});

	reactions.push ({
		id: 'swim',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You swim and swim.");
		}
	});

	reactions.push ({
		id: 'jump',
		enabled: function (indexItem,indexItem2) {
			return true;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You just jump!")
		}
	});


	reactions.push ({
		id: 'tie',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("Nothing to tie."); 
		}
	});

	reactions.push ({
		id: 'untie',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("Nothing to untie."); 
		}
	});

	reactions.push ({
		id: 'drink',
		enabled: function (indexItem,indexItem2) {
			return (primitives.IT_ATT(indexItem, "isDrinkAble"));
		},
		reaction: function (par_c, fromDown) {
			fromDown = (fromDown === false);
			if (!fromDown)
				primitives.CA_ShowMsg("You drink %o1", [par_c.item1])
			primitives.IT_SetLoc (par_c.item1, primitives.IT_X("limbo"));
			return true;
		}
	});

	reactions.push ({
		id: 'eat',
		
		enabled: function (indexItem,indexItem2) {
			return (primitives.IT_ATT(indexItem, "isEatAble"));
		},
		
		reaction: function (par_c) {
		
			primitives.CA_ShowMsg("You eat %o1", [par_c.item1]);
			primitives.IT_SetLoc (par_c.item1, primitives.IT_X("limbo"));
			return true;
		}	
	});

	reactions.push ({
		id: 'listen',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You listen anything.")
		}
	});

	reactions.push ({
		id: 'smell',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You smell nothing.")
		}
	});

	reactions.push ({
		id: 'wakeup',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You cannot wake up anybody.")
		}
	});

	reactions.push ({
		id: 'attack',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You shouldn't attack everyone you meet.");
		}
	});

	reactions.push ({
		id: 'strike',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You shouldn't strike everything you see.");
		}
	});

	reactions.push ({ //???
		id: 'stop',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You get nothing.");
		}
	});

	reactions.push ({ // atributo quemable?
		id: 'burn',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("Nothing to burn.")
		}
	});

	// to-do: 2 par
	reactions.push ({ // similar a dejar/drop por defecto? (si es rompible, se rompería)
		id: 'throwAction',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("You manage to throw it."); // ??? it/her/him...
		}
	});

	reactions.push ({
		id: 'pull',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("Nothing to pull.");
		}
	});

	reactions.push ({
		id: 'raise',
		enabled: function (indexItem,indexItem2) {
			return false;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("Nothing to raise.");
		}
	});


	reactions.push ({
		id: 'wait',
		enabled: function (indexItem,indexItem2) {
			return true;
		},
		reaction: function (par_c) {
			primitives.CA_ShowMsg("Time runs");
			primitives.CA_ShowMsgAsIs ("<br/>");
		}
	});

	reactions.push ({
		id: 'attack-with',
		
		enabled: function (indexItem,indexItem2) {
			return primitives.IT_ATT(indexItem, "isWeapon");
		},
		
		reaction: function (par_c) {
			if (par_c.item2==-1) return false;
			if ((primitives.IT_GetType(par_c.item2) != "npc") && (primitives.IT_GetType(par_c.item2) != "pc")) return false;
			
			if (!primitives.IT_ATT(par_c.item1, "isWeapon")) {
				primitives.CA_ShowMsg("You shouldn't attack with that.");
				return true;
			}
			primitives.CA_ShowMsg("You attack %o2 with %o1.", [par_c.item2, par_c.item1]);
			primitives.CA_ShowMsg("With any result.");
			return true;		
		},
		
	});

} // end of initReactions

// GENERIC turn **********************************************************************************************

/*
ludi_lib.turn = function (indexItem) {

}
*/


//***********************************************************************************************************************
// ATTRIBUTES
//***********************************************************************************************************************

let initAttributes =  function  (attributes, primitives) {


	attributes.push ({
		id: 'isContainer',
		
		desc: function (indexItem) {
			var values = ludi_runner.world.items[indexItem].att[this.id];
			/*
				values: [Object: maxWeight: "200"]
			
				values[0]: {maxWeight: "200"}
				values[0].maxWeight: "200"		
			*/
			
			var o1 = values.capacity; //values["capacity"] ?
			
			// to-do! this.index undefined
			this.index = arrayObjectIndexOf(this.attribute, "id", this.id);		
			
			primitives.CA_ATT(this.index, indexItem);

			// show items inside

			if (ludi_runner.world.items.length >0) {
				var counter = 0;
				for (indexItemInside in ludi_runner.world.items) {
					if (ludi_runner.world.items[indexItemInside].loc == ludi_runner.world.items[indexItem].id) counter++;
				}
				if (counter > 0) {
					primitives.CA_ShowMsgAsIs (", " ); 
					primitives.CA_ShowMsg ("with objects inside"); 
					primitives.CA_ShowMsgAsIs (" (" + counter + ")" ); 
					primitives.CA_ShowMsgAsIs (": "); 
					for (indexItemInside in ludi_runner.world.items) {
						if (ludi_runner.world.items[indexItemInside].loc == ludi_runner.world.items[indexItem].id) {
							primitives.CA_ShowMsgAsIs ("[");
							primitives.CA_ShowItem (indexItemInside); 
							primitives.CA_ShowMsgAsIs ("]");
						}
					} 

				} else {
					primitives.CA_ShowMsg ("It's empty now."); 
				}
			}

		}
		
	});
	
} // end of initAttributes

// to-do: ask to npc for doing something : each npc could repond in a diferent way

// to-do: general default behaviours of npc: "mule", indiferent, agresive (each one will be a different function); game writer can add new types

// ----------------------------------------------
// local functions // to-do: naming

function IT_TransitionTo (source, target) {
	
	var itemWorlIndex = ludi_runner.worldIndexes.items[source];
	
	var state;
	if (itemWorlIndex.gameIndex>=0)  { 
		if (typeof ludi_game.items[itemWorlIndex.gameIndex].transitionTo == 'function') { // exists game item transitionTo()?
			state = ludi_game.items[itemWorlIndex.gameIndex].transitionTo(target);
		}
	}
	if (((state == false) || (state== undefined)) && (typeof ludi_game.transitionTo == 'function')) { // exists game.transitionTo()?
		state = ludi_game.transitionTo(source, target);
	}
	
	if ((state == false) || (state== undefined)) {
		// show location name
		this.primitives.CA_ShowMsgAsIs ("<br/>");
		this.primitives.CA_ShowItem (this.primitives.PC_GetCurrentLoc());
		this.primitives.CA_ShowMsgAsIs ("<br/>");
	}
}

function IT_AfterDescription (target) {
	
	var itemWorlIndex = ludi_runner.worldIndexes.items[target];
	 
	var state;
	if (itemWorlIndex.gameIndex>=0)  {
		if (typeof ludi_game.items[itemWorlIndex.gameIndex].afterDescription == 'function') { // exists game item afterDescription()?
			state = ludi_game.items[itemWorlIndex.gameIndex].afterDescription();
		}
	}
	if (((state == false) || (state== undefined)) && (typeof ludi_game.afterDescription == 'function')) { // exists game.afterDescription()?
		state = ludi_game.afterDescription(target);
	}
	
	if ((state == false) || (state== undefined))  { 
		// if there items here, show them after description
		var numItemsHere=0;
		for (var index=0; index<this.primitives.IT_NumberOfItems(); index++) {
			if ((this.primitives.PC_X() != index) && (this.primitives.IT_SameLocThan (this.primitives.PC_X(), index))) {
				if (numItemsHere == 0) {
					this.primitives.CA_ShowMsgAsIs ("<br/>");
					this.primitives.CA_ShowMsg ("You can see");
					this.primitives.CA_ShowMsgAsIs (":");
				} else 
					this.primitives.CA_ShowMsgAsIs (", ");
				numItemsHere++;
				this.primitives.CA_ShowItem (index);
			}
		}
		if (numItemsHere > 0) this.primitives.CA_ShowMsgAsIs (".<br/>");
	}
		
}


