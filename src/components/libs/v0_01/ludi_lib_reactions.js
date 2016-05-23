ludi_lib.reactions = []; 

ludi_lib.reactionById = function (actionId) {
	var actionIndex = arrayObjectIndexOf (ludi_game.reactions, "id", actionId);
	return ludi_lib.reactions[actionIndex];
}


ludi_lib.reactions.push ({
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
		
		IT_DynDesc(PC_GetCurrentLoc ());
	},
	
});

ludi_lib.reactions.push ({
	id: 'go',
	
	enabled: function (indexItem, indexItem2) {
		return true;
	},
	
	reaction: function (par_c) {
	
		// test
		CA_ShowMsg("You go to %d1", [par_c.directionId]);
		CA_ShowMsgAsIs("<br/><br/>");

		// preactions when trying to go out from here
		var link = ludi_lib.getTargetAndLocked (par_c);
		
		// if locked, show locked message
		if (link.isLocked) {
			CA_ShowMsg("Locked direction" );
			return;
		}
				
		if (link.target == -1) {
			CA_ShowMsg("It is not possible to go there." );
			return;
		}		
				
		// reaction kernel: change of location
		PC_SetCurrentLoc(link.target);
		
		// after reaction: by default: standard description

		// transition message (if exist) from both locations (before description)
		IT_TransitionTo (par_c.loc, link.target);
		
		if (!IT_GetIsItemKnown (PC_X(), link.target)) {
			// set loc as known;
			IT_SetIsItemKnown(PC_X(), link.target, true);
			// IT_SetWhereItemWas (PC_X(), link.target, IT_GetLoc(link.target));
			IT_SetLastTime (PC_X(), link.target, IT_GetLoc(link.target));
				
			if (IT_ATT(link.target, "score")) {
				// increments PC.score
				var scoreInc = +IT_GetAttPropValue (link.target, "score", "state");
				
				ludi_runner.userState.profile.score += scoreInc;
				
				//CA_ShowMsg("You wins o1 points.", scoreInc); 
				CA_ShowMsg("You wins " + scoreInc + " points." );
			} 

			// first time message
			if (IT_FirstTimeDesc(link.target)) {
				IT_DynDesc(link.target);
			}
			
		} else {
			IT_DynDesc(link.target);
		}
			
		// transition message (if exist) from both locations (after description)
		IT_AfterDescription (link.target);
		
		// endGame locations
		if (IT_ATT(link.target, "endGame")) {
			CA_EndGame();
			return;
		}		 

	},
	
});

ludi_lib.reactions.push ({
	id: 'ex',
	
	enabled: function (indexItem,indexItem2) {
		return true;
	},
	
	reaction: function (par_c) {
		
		IT_DynDesc (par_c.item1);

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
				
				CA_ATT( indexAtt);
			}

		}
		
	},
	
});

// to-do: consider isTakeAble.weight and isTakeAble.size
ludi_lib.reactions.push ({
	id: 'take',
	
	enabled: function (indexItem,indexItem2) {
		if (!IT_ATT(indexItem, "isTakeAble")) return false;
		if (IT_GetLoc(indexItem) == PC_GetCurrentLoc ()) return true;
		return false;
	},
	
	reaction: function (par_c) {

		if (IT_GetLoc(par_c.item1) == PC_X())
			CA_ShowMsg("You just have it!");
		else {
			CA_ShowMsg("You take %o1", [par_c.item1Id]);
			IT_SetLoc(par_c.item1, PC_X());
		}
		
	},
	
});

// to-do: consider isTakeAble and isTakeAble.weight and isTakeAble.size
ludi_lib.reactions.push ({
	id: 'drop',
	
	enabled: function (indexItem,indexItem2) {
		if (IT_GetLoc(indexItem) != PC_X()) return false;
		return true;
	},
	
	reaction: function (par_c) {
		if (IT_GetLoc(par_c.item1) != PC_X())
			CA_ShowMsg("You don't have it!"); // to-do: pronoun
		else {
			CA_ShowMsg("You drop it on %o1", [IT_GetId(PC_GetCurrentLoc())]);
			
			IT_SetLoc(par_c.item1, PC_GetCurrentLoc()); 
			
			// refresh iskwnon/ wherewas
			if (!IT_GetIsItemKnown (PC_X(), par_c.item1)) {
				IT_GetIsItemKnown(PC_X(), par_c.item1, true);
				IT_SetWhereItemWas(PC_X(),par_c.item1, IT_GetLoc(par_c.item1));
			}
		}
		
	},
	
});

// to-do: create attribute isTalkAble?
ludi_lib.reactions.push ({
	id: 'talk',
	
	enabled: function (indexItem,indexItem2) {
		return true;
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("You talk with %o1", [par_c.item1]); // to-do: pronoun
		CA_ShowMsgAsIs (" ... ");
		CA_ShowMsg("but without any reaction");
	},
	
});

ludi_lib.reactions.push ({
	id: 'become',
	
	enabled: function (indexItem,indexItem2) {
		if (!IT_ATT(indexItem, "isBecomeAble")) return false;
		return true;
	},
	
	reaction: function (par_c) {
		
		CA_ShowMsgAsIs("<br/>");
		CA_ShowMsg("You become %o1", [par_c.item1Id]);
		CA_ShowMsgAsIs("<br/>");
		PC_SetIndex(par_c.item1);
		IT_DynDesc (PC_GetCurrentLoc());
		CA_Refresh ();
		
	},
	
});


// to-do consider isContainer.maxWeight and .maxSize
ludi_lib.reactions.push ({
	id: 'put_into',
	
	enabled: function (indexItem,indexItem2) {
				
		if (!IT_ATT(indexItem, "isTakeAble")) return false;
		if (indexItem2 == -1) return false;
		if (indexItem2 == indexItem) return false;
		if (!IT_ATT(indexItem2, "isContainer")) return false;
		if (IT_GetLoc(indexItem) == indexItem2) return false;
		
		return true;
	},
	
	reaction: function (par_c) {
		if (par_c.item2==-1) {
			CA_ShowMsg("You shoud mark a container first");

		} else {
			if (par_c.item1 == par_c.item2) {
				CA_ShowMsg("You cannot put a object into itself");
			} else {
				if (!IT_ATT(par_c.item2, "isContainer")) {
					CA_ShowMsg("The marked object must be a container");
				} else {
					CA_ShowMsg("You put %o1 into %o2", [par_c.item1 , par_c.item2]);

					IT_SetLoc(par_c.item1, par_c.item2);
				}
			}
		}
				
	},
	
});

// to-do: consider canCarry
ludi_lib.reactions.push ({
	id: 'give',
	
	enabled: function (indexItem, indexItem2) {
		if (indexItem == indexItem2) return false;
		if (!IT_ATT(indexItem, "isTakeAble")) return false;
		if (IT_GetType(indexItem2) == "loc") return false;
		
		// to-do: create attribute isGiveAble?
		if (IT_GetType(indexItem2) == "obj") return false;
		
		// item2 must be here
		if (IT_GetLoc(indexItem2) != PC_GetCurrentLoc()) return false;
		
		return true;
	},
	
	reaction: function (par_c) {
		if (par_c.item2==-1) return false;
		if ((IT_GetType(par_c.item2) != "npc") && (IT_GetType(par_c.item2) != "pc")) return false;
		
		// to-translate: 
		CA_ShowMsg("You try to give o1 to o2", [par_c.item1Id, par_c.item2Id]);
		return true;		
	},
	
});

// to-do: consider isContainer
ludi_lib.reactions.push ({
	id: 'take_from',
	
	enabled: function (indexItem,indexItem2) {
		if (!IT_ATT(indexItem, "isTakeAble")) return false;
		if (indexItem2==-1) return false;
		if (indexItem2 == indexItem) return false;
		if (!IT_ATT(indexItem2, "isContainer")) return false;
		if (IT_GetLoc(indexItem) != indexItem2) return false;
		return true;
	},
	
	reaction: function (par_c) {

		CA_ShowMsg("You take %o1 from %o2", [par_c.item1Id, par_c.item2Id]);
		IT_SetLoc(par_c.item1, PC_X());
	},
	
});

ludi_lib.reactions.push ({
	id: 'ask_about',
	
	enabled: function (indexItem, indexItem2) {
		// to-do: create isTalkAble?
		// if (!IT_ATT(indexItem, "isTalkAble")) return false;
		
		if (indexItem == indexItem2) return false;
		if (IT_GetType(indexItem2) == "loc") return false;
		
		if (IT_GetType(indexItem2) == "obj") return false;
		
		// item2 must be here
		if (IT_GetLoc(indexItem2) != PC_GetCurrentLoc()) return false;
		
		return true;
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("%o1 does not react when you ask about %o2", [par_c.item2Id, par_c.item1Id]);		
	},
	
});

// to-do: consider canCarry
ludi_lib.reactions.push ({
	id: 'ask_from',
	
	enabled: function (indexItem, indexItem2) {
		if (!IT_ATT(indexItem, "isTakeAble")) return false;
		if (indexItem2==-1) return false;
		if ((IT_GetType(indexItem2) != "npc") && (IT_GetType(indexItem2) != "pc")) return false;
		if (IT_GetLoc (indexItem) != indexItem2) return false;
		
		// only if item2 you have item1
		return (IT_GetLoc(indexItem) == indexItem2);
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("%o1 does not react when you ask for %o2", [par_c.item2Id, par_c.item1Id]);
	},
	
});

ludi_lib.reactions.push ({
	id: 'show_to',
	
	enabled: function (indexItem,indexItem2) {
		if (indexItem2==-1) return false;
		if ((IT_GetType(indexItem2) != "npc") && (IT_GetType(indexItem2) != "pc")) return false;

		// only if you have it
		return (IT_GetLoc(indexItem) == PC_X());

	},
	
	reaction: function (par_c) {
		CA_ShowMsg("%o1 does not react when you show %o2", [par_c.item2Id, par_c.item1Id]);
		
	},
	
});

ludi_lib.reactions.push ({
	id: 'read',
	
	enabled: function (indexItem,indexItem2) {
		if (!IT_ATT(indexItem, "isReadAble")) return false;
		return true;
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("You read %o1", [par_c.item1Id]);
		CA_ShowMsgAsIs(".");
		CA_ShowMsg(IT_GetAttPropValue (par_c.item1, "isReadAble", "msgId")); 
		
	},
	
});

ludi_lib.reactions.push ({
	id: 'turnon',
	
	enabled: function (indexItem,indexItem2) {
		if (!IT_ATT(indexItem, "isSwitchAble")) return false;
		return (IT_GetAttPropValue (indexItem, "isSwitchAble", "state") != "on");
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("You turn on %o1", [par_c.item1]);
		IT_SetAttPropValue (par_c.item1, "isSwitchAble", "state", "on");		
	},
	
});

ludi_lib.reactions.push ({
	id: 'turnoff',
	
	enabled: function (indexItem,indexItem2) {
		if (!IT_ATT(indexItem, "isSwitchAble")) return false;
		return (IT_GetAttPropValue (indexItem, "isSwitchAble", "state") != "off");
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("You turn off %o1", [par_c.item1]);
		IT_SetAttPropValue (par_c.item1, "isSwitchAble", "state", "off");		
	},
	
});

ludi_lib.reactions.push ({
	id: 'sing',
	
	enabled: function (indexItem,indexItem2) {
		return true;
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("You sing");
		
	},
	
});

ludi_lib.reactions.push ({
	id: 'where',
	
	enabled: function (indexItem,indexItem2) {
		// here
		if (IT_CarriedOrHere(indexItem)) return false;
		// if in limbo, not shown
		// if (IT_GetId(IT_GetLoc(indexItem))== "limbo") return false; // really?
		return true; // not here
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("where %o1 was?", [par_c.item1Id]);
		var whereWas = IT_GetWhereItemWas(PC_X(),par_c.item1);

		if (whereWas == -1) CA_ShowMsg ("location unknown of %o1", [par_c.item1Id]);
		else if (IT_GetId(whereWas)== "limbo") CA_ShowMsg ("location unknown of %o1", [par_c.item1Id]);
		else CA_ShowItem (whereWas);
		CA_ShowMsgAsIs ("<br/>");
	},

});

ludi_lib.reactions.push ({
	id: 'open',
	
	enabled: function (indexItem,indexItem2) {
		if (!IT_ATT(indexItem, "isOpen")) return false;
		return (IT_GetAttPropValue (indexItem, "isOpen", "state") != "open");
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("You open %o1", [par_c.item1Id]);
		IT_SetAttPropValue (par_c.item1, "isOpen", "state", "open");
	},
	
});

ludi_lib.reactions.push ({
	id: 'close',
	
	enabled: function (indexItem,indexItem2) {
		if (!IT_ATT(indexItem, "isOpen")) return false;
		return (IT_GetAttPropValue (indexItem, "isOpen", "state") != "close");
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("You close %o1", [par_c.item1]);
		IT_SetAttPropValue (par_c.item1, "isOpen", "state", "close");
	},
	
});

ludi_lib.reactions.push ({
	id: 'unlock',
	
	enabled: function (indexItem,indexItem2) {
		if (!IT_ATT(indexItem, "isOpen")) return false;
		if (!IT_AttPropExists(indexItem, "isOpen", "locked")) return false;
		return (IT_GetAttPropValue (indexItem, "isOpen", "locked") == "true");
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("You unlock %o1", [par_c.item1]);
	},
	
});

ludi_lib.reactions.push ({
	id: 'lock',
	
	enabled: function (indexItem,indexItem2) {
		if (!IT_ATT(indexItem, "isOpen")) return false;
		if (!IT_AttPropExists(indexItem, "isOpen", "locked")) return false;
		return (IT_GetAttPropValue (indexItem, "isOpen", "locked") == "false");
	},
	
	reaction: function (par_c) {
		CA_ShowMsg("You lock %o1", [par_c.item1]);
	},
	
});

ludi_lib.reactions.push ({
	id: 'look_dir',

	enabled: function (indexItem, indexItem2) {
		return false;
	},
	
	reaction: function (par_c) {
	
		// if attribute lookDir exists, show it
		for(var i = 0, len = ludi_runner.world.items[par_c.loc].address.length; i < len; i++) {
			
			if(typeof ludi_runner.world.items[par_c.loc].address[i].lookDir != 'undefined'){ 
				var lookDirValue = ludi_runner.world.items[par_c.loc].address[i].lookDir;
				CA_ShowMsg (lookDirValue);
				return;
			}
		}
		
		// default reaction
		CA_ShowMsg("You look to %d1", [par_c.direction]);
	},
	
});

ludi_lib.reactions.push ({
	id: 'investigate',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("You get nothing.")
	}
});

ludi_lib.reactions.push ({
	id: 'dig_with',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("You try to dig but you get nothing.");
	}
});

ludi_lib.reactions.push ({
	id: 'climb',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		// CA_ShowMsg("You cannot climb"); 
		CA_ShowMsg("You cannot %v1", [this.index]); // just testing
	}
});

ludi_lib.reactions.push ({
	id: 'swim',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("You swim and swim.");
	}
});

ludi_lib.reactions.push ({
	id: 'jump',
	enabled: function (indexItem,indexItem2) {
		return true;
	},
	reaction: function (par_c) {
		CA_ShowMsg("You just jump!")
	}
});


ludi_lib.reactions.push ({
	id: 'tie',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("Nothing to tie."); 
	}
});

ludi_lib.reactions.push ({
	id: 'untie',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("Nothing to untie."); 
	}
});

ludi_lib.reactions.push ({
	id: 'drink',
	enabled: function (indexItem,indexItem2) {
		return (IT_ATT(indexItem, "isDrinkAble"));
	},
	reaction: function (par_c, fromDown) {
		fromDown = (fromDown === false);
		if (!fromDown)
			CA_ShowMsg("You drink %o1", [par_c.item1])
		IT_SetLoc (par_c.item1, IT_X("limbo"));
		return true;
	}
});

ludi_lib.reactions.push ({
	id: 'eat',
	
	enabled: function (indexItem,indexItem2) {
		return (IT_ATT(indexItem, "isEatAble"));
	},
	
	reaction: function (par_c) {
	
		CA_ShowMsg("You eat %o1", [par_c.item1]);
		IT_SetLoc (par_c.item1, IT_X("limbo"));
		return true;
	}	
});

ludi_lib.reactions.push ({
	id: 'listen',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("You listen anything.")
	}
});

ludi_lib.reactions.push ({
	id: 'smell',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("You smell nothing.")
	}
});

ludi_lib.reactions.push ({
	id: 'wakeup',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("You cannot wake up anybody.")
	}
});

ludi_lib.reactions.push ({
	id: 'attack',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("You shouldn't attack everyone you meet.");
	}
});

ludi_lib.reactions.push ({
	id: 'strike',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("You shouldn't strike everything you see.");
	}
});

ludi_lib.reactions.push ({ //???
	id: 'stop',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("You get nothing.");
	}
});

ludi_lib.reactions.push ({ // atributo quemable?
	id: 'burn',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("Nothing to burn.")
	}
});

// to-do: 2 par
ludi_lib.reactions.push ({ // similar a dejar/drop por defecto? (si es rompible, se rompería)
	id: 'throwAction',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("You manage to throw it."); // ??? it/her/him...
	}
});

ludi_lib.reactions.push ({
	id: 'pull',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("Nothing to pull.");
	}
});

ludi_lib.reactions.push ({
	id: 'raise',
	enabled: function (indexItem,indexItem2) {
		return false;
	},
	reaction: function (par_c) {
		CA_ShowMsg("Nothing to raise.");
	}
});


ludi_lib.reactions.push ({
	id: 'wait',
	enabled: function (indexItem,indexItem2) {
		return true;
	},
	reaction: function (par_c) {
		CA_ShowMsg("Time runs");
		CA_ShowMsgAsIs ("<br/>");
	}
});

ludi_lib.reactions.push ({
	id: 'attack-with',
	
	enabled: function (indexItem,indexItem2) {
		return IT_ATT(indexItem, "isWeapon");
	},
	
	reaction: function (par_c) {
		if (par_c.item2==-1) return false;
		if ((IT_GetType(par_c.item2) != "npc") && (IT_GetType(par_c.item2) != "pc")) return false;
		
		if (!IT_ATT(par_c.item1, "isWeapon")) {
			CA_ShowMsg("You shouldn't attack with that.");
			return true;
		}
		CA_ShowMsg("You attack %o2 with %o1.", [par_c.item2, par_c.item1]);
		CA_ShowMsg("With any result.");
		return true;		
	},
	
});


// GENERIC turn **********************************************************************************************

ludi_lib.turn = function (indexItem) {

}


//***********************************************************************************************************************
// ATTRIBUTES
//***********************************************************************************************************************

ludi_lib.attribute = []; 

ludi_lib.attribute.push ({
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
		this.index = arrayObjectIndexOf(ludi_lib.attribute, "id", this.id);		
		
		CA_ATT(this.index, indexItem);

		// show items inside

		if (ludi_runner.world.items.length >0) {
			var counter = 0;
			for (indexItemInside in ludi_runner.world.items) {
				if (ludi_runner.world.items[indexItemInside].loc == ludi_runner.world.items[indexItem].id) counter++;
			}
			if (counter > 0) {
				CA_ShowMsgAsIs (", " ); 
				CA_ShowMsg ("with objects inside"); 
				CA_ShowMsgAsIs (" (" + counter + ")" ); 
				CA_ShowMsgAsIs (": "); 
				for (indexItemInside in ludi_runner.world.items) {
					if (ludi_runner.world.items[indexItemInside].loc == ludi_runner.world.items[indexItem].id) {
						CA_ShowMsgAsIs ("[");
						CA_ShowItem (indexItemInside); 
						CA_ShowMsgAsIs ("]");
					}
				} 

			} else {
				CA_ShowMsg ("It's empty now."); 
			}
		}

	}
	
});


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
		CA_ShowMsgAsIs ("<br/>");
		CA_ShowItem (PC_GetCurrentLoc());
		CA_ShowMsgAsIs ("<br/>");
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
		for (var index=0; index<IT_NumberOfItems(); index++) {
			if ((PC_X() != index) && (IT_SameLocThan (PC_X(), index))) {
				if (numItemsHere == 0) {
					CA_ShowMsgAsIs ("<br/>");
					CA_ShowMsg ("You can see");
					CA_ShowMsgAsIs (":");
				} else 
					CA_ShowMsgAsIs (", ");
				numItemsHere++;
				CA_ShowItem (index);
			}
		}
		if (numItemsHere > 0) CA_ShowMsgAsIs (".<br/>");
	}
		
}


