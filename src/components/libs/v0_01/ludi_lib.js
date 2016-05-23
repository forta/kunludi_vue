/*
interface that isolizes access to ludi_runner.world

objective #1: high level function in game development
objective #2: no ludi_runner.* references in ludi_reactions_game with ludi_primitives.*
objective #3: when possible, remplace ludi_runner.* references in ludi_reactions_kernel with ludi_primitives.*

*/


/*(begin)********************** INSTRUCTION SET *********************
They are just a interface of macros for cleaner code
Categories:
	CA: Client Action
	
		CA_ShowDesc (o1)
		CA_QuoteBegin (i)
		CA_QuoteContinues ()
		CA_Refresh ()
		CA_ShowMsg (txt[,o1[,o2]])
		CA_ShowMsgAsIs (txt)
		CA_ATT (o1, o2)
		CA_ShowItem (o1)
		CA_ShowMenu ( o1)
		CA_ShowImg (url)
		CA_PressKey (txt)
		CA_EndGame ()
		CA_RestartGame ()
		CA_PlayAudio (fileName, autoStart, txt)
		
	PC: Playing Character
	
		PC_X()
		PC_SetIndex(o1)
		PC_GetCurrentLoc () 
		PC_SetCurrentLoc (o1) 
		PC_CheckCurrentLocId (locId)
		PC_Points (value)
		PC_GetTurn()
	
	DIR: Directions
		
		DIR_GetIndex (id)
		DIR_GetId (index)
			
	IT: items
	
		IT_X(id)
		IT_NumberOfItems ()
		IT_GetId (index)
		IT_GetGameIndex (i)
		IT_GetLoc (i)
		IT_SetLocToLimbo (i)
		IT_ReplacedBy (i1, i2) 
		IT_BringHere (i)
		IT_SetLoc (i, value)
		IT_GetType (i)
		IT_SetType (i, value)
		IT_GetIsLocked (i, dir)
		IT_SetIsLocked (i, dir, value)
		IT_GetIsItemKnown (i1, i2)
		IT_SetIsItemKnown (i1, i2)
		IT_GetWhereItemWas(i1, i2)
		IT_GetWhereItemWas(i1, i2)
		IT_SetWhereItemWas(i1, i2, value)
		IT_SetLastTime(i1, i2)
		IT_Here (i)
		IT_CarriedOrHere(i)
		IT_NumberOfAtts(i) 
		IT_ATT (indexItem, idAttType)
		IT_AttPropExists (indexItem, attId, propId)
		IT_GetAttPropValue (indexItem, attId, propId)
		IT_SetAttPropValue (indexItem, attId, propId, newValue)
		IT_IncrAttPropValue (indexItem, attId, propId, increment)

		IT_GetRandomDirectionFromLoc(indexLoc)
		IT_SameLocThan(i1,i2)

		IT_DynDesc (i)
		IT_FirstTimeDesc(indexItem) // no IT_
	
	W: world ??
	
		W_GetAttIndex(id)	

	GD: Game Definition 

		GD_CreateMsg (indexLang, idMsg, txtMsg)
		
	MISC:
	
		MISC_Random (num)
		
	Auxiliary functions (internals):
	
		ludi_lib.getTargetAndLocked (par_c)
	
*/

/* CA: Client Action *****************************************************************/

function CA_ShowDesc (o1) {
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.DESC.value, o1:o1});	
}

function CA_QuoteBegin (item, txt, param, last) {
	if (typeof param == "undefined") param = [];
	if (typeof last == "undefined") last = true;
	
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.QUOTE_BEGIN.value, item:item, txt:txt, param:param, last:last});	
}

function CA_QuoteContinues (txt, param, last) {
	if (typeof param == "undefined") param = [];
	if (typeof last == "undefined") last = true;

	ludi_runner.clientAction.push ({type:ludi_root.caEnum.QUOTE_CONTINUES.value, txt:txt, param:param, last:last});	
}

function CA_Refresh () {
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.REFRESH.value});
}

function CA_URL (url, txt, param) {
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.URL.value, url:url, txt:txt, param:param});
}

function CA_ShowMsg (txt, param) {
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.MSG.value, txt:txt, param:param});
}

function CA_ShowMsgAsIs (txt) {
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.ASIS.value, txt:txt});
}

function CA_ATT ( o1, o2) {
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.ATT.value, o1:o1, o2:o2});
}

function CA_ShowDir ( dir) {
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.DIR.value, dir:dir});
}

function CA_ShowItem ( o1) {
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.ITEM.value, o1:o1});
}

function CA_ShowMenu ( o1) {
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.SHOW_MENU.value, o1:o1});
}

function CA_ShowImg (url, isLocal, isLink, txt, param) {
	if (typeof isLocal == "undefined") isLocal = false;
	if (typeof isLink == "undefined") isLink = false;
		
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.GRAPH.value, url:url, isLocal:isLocal, isLink:isLink, txt:txt, param:param});	
}

function CA_PressKey (txt) {
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.PRESS_KEY.value, txt:txt});
}

function CA_EndGame () {
	// to-do: block interface
	CA_PressKey("The game is over");
	CA_RestartGame();
}

function CA_RestartGame () {
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.RESTART_GAME.value});
}

function CA_PlayAudio (fileName, autoStart, txt, param) {

	ludi_runner.clientAction.push ({type:ludi_root.caEnum.PLAY_AUDIO.value, fileName:fileName, autoStart:autoStart, txt:txt, param:param });
	
}


/* PC: Playing Character *****************************************************************/

function PC_X () {
	return ludi_runner.userState.profile.indexPC;
}

function PC_SetIndex (o1) {
	ludi_runner.userState.profile.indexPC = o1;
	if (ludi_runner.userState.profile.indexPC<0) {
		console.log ("Error in PC_SetIndex(o1): o1(== " +  o1 + ") is < 0");
		return;
	}
}
		
function PC_GetCurrentLoc () {
	var locId = ludi_runner.world.items[ludi_runner.userState.profile.indexPC].loc;
	return IT_X (locId);
}

function PC_SetCurrentLoc (indexItem) {
	ludi_runner.world.items[ludi_runner.userState.profile.indexPC].loc = ludi_runner.world.items[indexItem].id;
}

function PC_CheckCurrentLocId (locId) {

	return (ludi_runner.world.items[ludi_runner.userState.profile.indexPC].loc == locId);
	
}

// score increment
function PC_Points (value) { 
	// to-do: as att?: var scoreInc = +IT_GetAttPropValue (ludi_runner.userState.profile.indexPC, "score", "state");
	ludi_runner.userState.profile.score += value;
}

function PC_GetTurn() {
	return ludi_runner.userState.profile.turnCounter;
}


/* DIR: directions *****************************************************************/

function DIR_GetIndex (id) {
	return arrayObjectIndexOf(ludi_runner.world.directions, "id", id);
}

function DIR_GetId (index) {
	if (index>=0) return ludi_runner.world.directions[index].id;
}

/* IT: items *****************************************************************/

function IT_X (id) {
	return arrayObjectIndexOf(ludi_runner.world.items, "id", id);
}

function IT_NumberOfItems () {
	return ludi_runner.world.items.length;
}
 

function IT_GetId (index) {
	if (index>=0) return ludi_runner.world.items[index].id;
}

function IT_GetGameIndex (index) {
	return ludi_runner.worldIndexes.items[index].gameIndex;
}

function IT_GetLoc (i) {
	var locId = ludi_runner.world.items[i].loc;
	return arrayObjectIndexOf(ludi_runner.world.items, "id", locId);
}

function IT_SetLocToLimbo (i) {
	var value = IT_X ("limbo");
	ludi_runner.world.items[i].loc = ludi_runner.world.items[value].id;
}

//  i2 where i1 was; i1 to limbo
function IT_ReplacedBy (i1, i2) {
	ludi_runner.world.items[i2].loc = ludi_runner.world.items[i1].loc;
	ludi_runner.world.items[i1].loc = "limbo";
}

function IT_BringHere (i) {
	ludi_runner.world.items[i].loc = ludi_runner.world.items[PC_GetCurrentLoc()].id;
}

function IT_SetLoc (i, value) {
	ludi_runner.world.items[i].loc = ludi_runner.world.items[value].id;
}

function IT_GetType (i) {
	return ludi_runner.world.items[i].type;
}

function IT_SetType (i, value) {
	ludi_runner.world.items[i].type = value;
}

// here!
function IT_GetIsLocked (i, dir) {
	for (var d in ludi_runner.world.items[i].address) {
		if (ludi_runner.world.items[i].address[d].dir	 == dir) {
			if (typeof ludi_runner.world.items[i].address[d].locked != "undefined") {
				return ludi_runner.world.items[i].address[d].locked;
			} else {
				return false;
			}
		}
	}
	
	return false;
}

function IT_SetIsLocked (i, dir, value) {
	for (var d in ludi_runner.world.items[i].address) {
		if (ludi_runner.world.items[i].address[d].dir == dir) {
			ludi_runner.world.items[i].address[d].locked = value;
			return;	
		}
	}
}

function IT_GetIsItemKnown (i1, i2) {
	return (typeof ludi_runner.world.items[i1].state.itemsMemory[i2] != "undefined");
}

function IT_SetIsItemKnown (i1, i2) {
	ludi_runner.world.items[i1].state.itemsMemory[i2] = { whereWas:-1, lastTime:-1 };
}

function IT_GetWhereItemWas(i1, i2) {
	if (IT_GetIsItemKnown (i1, i2)) return ludi_runner.world.items[i1].state.itemsMemory[i2].whereWas;
	return -1; // ups
}

function IT_SetWhereItemWas(i1, i2, value) {
	if (!IT_GetIsItemKnown (i1, i2)) IT_SetIsItemKnown (i1,i2);
	ludi_runner.world.items[i1].state.itemsMemory[i2].whereWas = value;
	IT_SetLastTime(i1, i2);
}

function IT_SetLastTime(i1, i2) {
	ludi_runner.world.items[i1].state.itemsMemory[i2].lastTime = ludi_runner.userState.profile.turnCounter;
}

function IT_Here (i) {
	return (IT_GetLoc(i) == PC_GetCurrentLoc());
}

// to-do:  IT_CarriedOrHere -> IT_OnCarriedOrHere
function IT_CarriedOrHere(i) {
	return ((IT_GetLoc(i)  == PC_X()) || (IT_GetLoc(i) == PC_GetCurrentLoc()));
}

function IT_NumberOfAtts(i) {
	if (typeof ludi_runner.world.items[i].att == "undefined") return 0;
	return ludi_runner.world.items[i].att.length;
}

function IT_ATT (indexItem, idAttType) { // if exists definition

	if (indexItem<0) return false; // preventive
	var indexAttType = arrayObjectIndexOf(ludi_runner.world.attributes, "id", idAttType);
	if (indexAttType  == -1) return false;
	
	if (typeof ludi_runner.world.items[indexItem].att == "undefined") return false;
	if (typeof ludi_runner.world.items[indexItem].att[idAttType] == "undefined") return false;
	return true;
}

function IT_AttPropExists (indexItem, attId, propId) { 
	if (typeof ludi_runner.world.items[indexItem].att == "undefined") return false;
	if (typeof ludi_runner.world.items[indexItem].att[attId] == "undefined") return false;
	
	var j = arrayObjectIndexOf(ludi_runner.world.items[indexItem].att[attId], "id", propId);
	return (j>=0);
}

function IT_GetAttPropValue (indexItem, attId, propId) {
	
	// find j in ludi_runner.world.items[indexItem].att[attId][i][propId]
	for (var i=0; i<ludi_runner.world.items[indexItem].att[attId].length;i++) {
		
		// to-do: two versions!
		if (ludi_runner.world.items[indexItem].att[attId][i].id == propId) {
			return ludi_runner.world.items[indexItem].att[attId][i].value;
		} else if (typeof ludi_runner.world.items[indexItem].att[attId][i][propId] != 'undefined') {
			return ludi_runner.world.items[indexItem].att[attId][i][propId];
		}
	}
	
}

function IT_SetAttPropValue (indexItem, attId, propId, newValue) {
	// find j in ludi_runner.world.items[indexItem].att[attId][i][propId]
	for (var i=0; i<ludi_runner.world.items[indexItem].att[attId].length;i++) {
		// to-do: two versions!
		if (ludi_runner.world.items[indexItem].att[attId][i].id == propId) {
			ludi_runner.world.items[indexItem].att[attId][i].value = newValue;
			return;
		} else if (typeof ludi_runner.world.items[indexItem].att[attId][i][propId] != 'undefined') {
			ludi_runner.world.items[indexItem].att[attId][i][propId] = newValue;
			return;
		}
	}
}

function IT_IncrAttPropValue (indexItem, attId, propId, increment) {
	var incNumber = +increment;
	
	// find j in ludi_runner.world.items[indexItem].att[attId][i][propId]
	for (var i=0; i<ludi_runner.world.items[indexItem].att[attId].length;i++) {
		// to-do: two versions!
		if (typeof ludi_runner.world.items[indexItem].att[attId][i].id == propId) {
			ludi_runner.world.items[indexItem].att[attId][i].value = 
				+ludi_runner.world.items[indexItem].att[attId][i].value + incNumber;
			return;
		} else if (typeof ludi_runner.world.items[indexItem].att[attId][i][propId] != 'undefined') {
			ludi_runner.world.items[indexItem].att[attId][i][propId] = 
				+ludi_runner.world.items[indexItem].att[attId][i][propId] + incNumber;
			return;
		}
	}
}

function IT_GetRandomDirectionFromLoc(indexLoc) {
	var table = ludi_runner.getCSExits(indexLoc);
	
	if (table.length  == 0) return null;
	var i = MISC_Random (table.length);
	return {dir:table[i].dir, target:table[i].target};

}

function IT_SameLocThan(i1, i2) {
	if (i1<0) return false;
	if (i2<0) return false;
	return (IT_GetLoc(i1) == IT_GetLoc(i2));

}

function IT_DynDesc(i) {

	// if dark, do not show the description 
	if (IT_ATT(i, "dark")) {
		//  to-do: if light available, show the description
		CA_ShowMsg("It is dark");
		return;
	}

	var itemWorlIndex = ludi_runner.worldIndexes.items[i]; 
	
	if (itemWorlIndex.gameIndex>=0)  { 
		if (typeof ludi_game.items[itemWorlIndex.gameIndex].desc == 'function') { // exists game item desc()?
			ludi_game.items[itemWorlIndex.gameIndex].desc();
		} else {
			CA_ShowDesc (i);
		}
	} else {
		CA_ShowDesc (i);
	}
	
	// game reaction after desc()
	var indexAction = arrayObjectIndexOf (ludi_game.reactions, "id", "desc"); 
	if (indexAction >=0) {
		ludi_game.reactions[indexAction].reaction();
		return;
	}

	// lib reaction after desc()
	indexAction = arrayObjectIndexOf (ludi_lib.reactions, "id", "desc"); 
	if(indexAction >=0) 
		ludi_lib.reactions[indexAction].reaction();
}

// if returns true, ordinary desc will be needed after it
function IT_FirstTimeDesc(indexItem) {
	
	var itemWorlIndex = ludi_runner.worldIndexes.items[indexItem];
	
	if (itemWorlIndex.gameIndex>=0)  { 
		// if exists game item firstDesc()
		if (typeof ludi_game.items[itemWorlIndex.gameIndex].firstDesc == 'function') { 
			var state=ludi_game.items[itemWorlIndex.gameIndex].firstDesc();
			return ((state) || ( state == undefined));
		} 
		
	}
	return true;

}


/* W: World *****************************************************************/

function W_GetAttIndex(id) {
	return arrayObjectIndexOf(ludi_runner.world.attributes, "id", id);
}

/* GD: Game Definition *****************************************************************/

// note: for use during game development
function GD_CreateMsg (indexLang, idMsg, txtMsg) {
	ludi_runner.GD_CreateMsg (indexLang, idMsg, txtMsg);
}

/* MISC: facilities *****************************************************************/

 
 function MISC_Random (num) {
	return Math.floor((Math.random() * (+num)));
 }

/*(end)********************** INSTRUCTION SET *********************/


// auxiliary functions


ludi_lib.getTargetAndLocked = function (par_c) {

	connection = {target: -1, isLocked: false};
	
	// target and locked resolution
	var targetId;
	var dirId = ludi_runner.world.directions[par_c.direction].id;
	var internalDirIndex =  0; // look for dirIndex (par_c.direction) in ludi_runner.world.items[par_c.loc].address[] {dir, target, locked}
	for (var i=0;i<ludi_runner.world.items[par_c.loc].address.length;i++) {
		if (ludi_runner.world.items[par_c.loc].address[i].dir == dirId) {
			// get target
			if (typeof ludi_runner.world.items[par_c.loc].address[i].target != 'undefined') {
				targetId = ludi_runner.world.items[par_c.loc].address[i].target;
				connection.target = arrayObjectIndexOf(ludi_runner.world.items, "id", targetId);
			} else { // check dynamic target
			
				var gameIndex = ludi_runner.worldIndexes.items[par_c.loc].gameIndex;
				if (gameIndex>=0) {
					if (typeof ludi_game.items[gameIndex].target == 'function'){
						targetId = ludi_game.items[gameIndex].target (dirId);
						if (targetId == "locked")
							connection.isLocked = true;
						else
							connection.target = arrayObjectIndexOf(ludi_runner.world.items, "id", targetId);
					}
				}
			}

			// get isLocked
			if (!connection.isLocked) { // if not statically locked
				if (typeof ludi_runner.world.items[par_c.loc].address[i].locked != 'undefined') {
					connection.isLocked = (ludi_runner.world.items[par_c.loc].address[i].locked == "true");
				} 
			}
			break;
		}
	}
	return connection;
	
}
