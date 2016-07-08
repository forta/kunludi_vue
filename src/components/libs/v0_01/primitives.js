/*

module that:
 1. izolizes access to this.world
 2. provides an interface to add reactions to this.reactionList

*/

"use strict";

exports.reactionList = [];

let world;
let reactionList;
let userState;

export function caMapping (type) {
	
	let reactionTypes = [
		"ASIS",
		"ATT",
		"ITEM",
		"MSG",
		"DESC",
 		"REFRESH",
 		"URL",
 		"GRAPH",
 		"GRAPH_POPUP",
 		"MSG_POPUP",
 		"PRESS_KEY",
 		"SHOW_MENU",
 		"SOUND",
 		"ACTION",
 		"END_GAME",
 		"RESTART_GAME",
 		"DIR",
 		"SHOW_ECHO",
 		"PLAY_AUDIO",
 		"QUOTE_BEGIN",
 		"QUOTE_CONTINUES"
	]
	
	// var pos = reactionTypes.indexOf (type);
	
	return "rt_" + type.toLowerCase();
	
	
	
}

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}


exports.dependsOn = function (world, reactionList, userState) {
 this.world = world;
 this.reactionList = reactionList;
 this.userState = userState;
};

exports.executeGameAction = function (type, parameters) {

 switch (type) {
  case 'msg':
   addReaction (type, parameters);
  break;
 
  //default:
  //break;
 }
};

// direct, simply show text as is.
exports.addReaction = function (type, parameters) {

 reactionList.add ({type:type, parameters:parameters} );

};

// -----------------------------------



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

  getTargetAndLocked (par_c)

*/

/* CA: Client Action *****************************************************************/

exports.CA_ShowDesc = function (o1) {
 this.reactionList.push ({type:this.caMapping("DESC"), o1:o1});
};

exports.CA_QuoteBegin = function (item, txt, param, last) {
 if (typeof param == "undefined") param = [];
 if (typeof last == "undefined") last = true;

 this.reactionList.push ({type:this.caMapping("QUOTE_BEGIN"), item:item, txt:txt, param:param, last:last});
}

exports.CA_QuoteContinues = function (txt, param, last) {
 if (typeof param == "undefined") param = [];
 if (typeof last == "undefined") last = true;

 this.reactionList.push ({type:this.caMapping("QUOTE_CONTINUES"), txt:txt, param:param, last:last});
}

exports.CA_Refresh = function() {
 this.reactionList.push ({type:this.caMapping("REFRESH")});
}

exports.CA_URL = function(url, txt, param) {
 this.reactionList.push ({type:this.caMapping("URL"), url:url, txt:txt, param:param});
}

export function CA_ShowMsg (txt, param) {
 this.reactionList.push ({type:this.caMapping("MSG"), txt:txt, param:param});
}

exports.CA_ShowMsgAsIs = function(txt) {
 this.reactionList.push ({type:this.caMapping("ASIS"), txt:txt});
}

exports.CA_ATT = function( o1, o2) {
 this.reactionList.push ({type:this.caMapping("ATT"), o1:o1, o2:o2});
}

exports.CA_ShowDir = function( dir) {
 this.reactionList.push ({type:this.caMapping("DIR"), dir:dir});
}

exports.CA_ShowItem = function( o1) {
 this.reactionList.push ({type:this.caMapping("ITEM"), o1:o1});
}

exports.CA_ShowMenu = function( o1) {
 this.reactionList.push ({type:this.caMapping("SHOW_MENU"), o1:o1});
}

exports.CA_ShowImg = function(url, isLocal, isLink, txt, param) {
 if (typeof isLocal == "undefined") isLocal = false;
 if (typeof isLink == "undefined") isLink = false;
 
 this.reactionList.push ({type:this.caMapping("GRAPH"), url:url, isLocal:isLocal, isLink:isLink, txt:txt, param:param});
}

exports.CA_PressKey = function(txt) {
 this.reactionList.push ({type:this.caMapping("PRESS_KEY"), txt:txt});
}

exports.CA_EndGame = function() {
 // to-do: block interface
 CA_PressKey("The game is over");
 CA_RestartGame();
}

exports.CA_RestartGame = function() {
 this.reactionList.push ({type:this.caMapping("RESTART_GAME")});
}

exports.CA_PlayAudio = function(fileName, autoStart, txt, param) {

 this.reactionList.push ({type:this.caMapping("PLAY_AUDIO"), fileName:fileName, autoStart:autoStart, txt:txt, param:param });

}


/* PC: Playing Character *****************************************************************/

exports.PC_X = function() {
 return this.userState.profile.indexPC;
}

exports.PC_SetIndex = function(o1) {
 this.userState.profile.indexPC = o1;
 if (this.userState.profile.indexPC<0) {
  console.log ("Error in PC_SetIndex(o1): o1(== " +  o1 + ") is < 0");
  return;
 }
}
 
exports.PC_GetCurrentLoc = function() {
 var locId = this.world.items[this.userState.profile.indexPC].loc;
 return this.IT_X (locId);
}

exports.PC_SetCurrentLoc = function (indexItem) {
 this.world.items[this.userState.profile.indexPC].loc = this.world.items[indexItem].id;
}

exports.PC_CheckCurrentLocId = function (locId) {

 return (this.world.items[this.userState.profile.indexPC].loc == locId);

}

// score increment
exports.PC_Points = function (value) {
 // to-do: as att?: var scoreInc = +IT_GetAttPropValue (this.userState.profile.indexPC, "score", "state");
 this.userState.profile.score += value;
}

exports.PC_GetTurn = function () {
 return this.userState.profile.turnCounter;
}

/* DIR: directions *****************************************************************/

exports.DIR_GetIndex = function (id) {
 return arrayObjectIndexOf(this.world.directions, "id", id);
}

exports.DIR_GetId = function (index) {
 if (index>=0) return this.world.directions[index].id;
}

/* IT: items *****************************************************************/

exports.IT_X  = function (id){
 return arrayObjectIndexOf(this.world.items, "id", id);
}

exports.IT_NumberOfItems = function () {
 return this.world.items.length;
}


exports.IT_GetId = function (index) {
 if (index>=0) return this.world.items[index].id;
}

exports.IT_GetGameIndex = function (index) {
 return this.worldIndexes.items[index].gameIndex;
}

exports.IT_GetLoc = function (i) {
 var locId = this.world.items[i].loc;
 return arrayObjectIndexOf(this.world.items, "id", locId);
}

exports.IT_SetLocToLimbo = function (i) {
 var value = IT_X ("limbo");
 this.world.items[i].loc = this.world.items[value].id;
}

//  i2 where i1 was; i1 to limbo
exports.IT_ReplacedBy = function(i1, i2) {
 this.world.items[i2].loc = this.world.items[i1].loc;
 this.world.items[i1].loc = "limbo";
}

exports.IT_BringHere = function(i) {
 this.world.items[i].loc = this.world.items[PC_GetCurrentLoc()].id;
}

exports.IT_SetLoc = function(i, value) {
 this.world.items[i].loc = this.world.items[value].id;
}

exports.IT_GetType = function(i) {
 return this.world.items[i].type;
}

exports.IT_SetType = function(i, value) {
 this.world.items[i].type = value;
}

exports.IT_GetIsLocked = function(i, dir) {
 for (var d in this.world.items[i].address) {
  if (this.world.items[i].address[d].dir  == dir) {
   if (typeof this.world.items[i].address[d].locked != "undefined") {
    return this.world.items[i].address[d].locked;
   } else {
    return false;
   }
  }
 }

 return false;
}

exports.IT_SetIsLocked = function(i, dir, value) {
 for (var d in this.world.items[i].address) {
  if (this.world.items[i].address[d].dir == dir) {
   this.world.items[i].address[d].locked = value;
   return;
  }
 }
}

export function IT_GetIsItemKnown (i1, i2) {
 // vue by now:
 return false
 
 return (typeof this.world.items[i1].state.itemsMemory[i2] != "undefined");
}

exports.IT_SetIsItemKnown = function(i1, i2) {
 // vue by now:
 return 

 this.world.items[i1].state.itemsMemory[i2] = { whereWas:-1, lastTime:-1 };
}

exports.IT_GetWhereItemWas = function(i1, i2) {
 if (IT_GetIsItemKnown (i1, i2)) return this.world.items[i1].state.itemsMemory[i2].whereWas;
 return -1; // ups
}

exports.IT_SetWhereItemWas = function(i1, i2, value) {
 if (!IT_GetIsItemKnown (i1, i2)) exports.IT_SetIsItemKnown (i1,i2);
 this.world.items[i1].state.itemsMemory[i2].whereWas = value;
 IT_SetLastTime(i1, i2);
}

exports.IT_SetLastTime = function (i1, i2) {
  // vue by now:
 return 

 this.world.items[i1].state.itemsMemory[i2].lastTime = this.userState.profile.turnCounter;
}

exports.IT_Here = function (i) {
 return (IT_GetLoc(i) == PC_GetCurrentLoc());
}

// to-do:  IT_CarriedOrHere -> IT_OnCarriedOrHere
exports.IT_CarriedOrHere = function(i) {
 return ((this.IT_GetLoc(i)  == this.PC_X()) || (this.IT_GetLoc(i) == this.PC_GetCurrentLoc()));
}

exports.IT_NumberOfAtts = function(i) {
 if (typeof this.world.items[i].att == "undefined") return 0;
 return this.world.items[i].att.length;
}

exports.IT_ATT = function(indexItem, idAttType) { // if exists definition

 if (indexItem<0) return false; // preventive
 var indexAttType = arrayObjectIndexOf(this.world.attributes, "id", idAttType);
 if (indexAttType  == -1) return false;

 if (typeof this.world.items[indexItem].att == "undefined") return false;
 if (typeof this.world.items[indexItem].att[idAttType] == "undefined") return false;
 return true;
}

exports.IT_AttPropExists = function(indexItem, attId, propId) {
 if (typeof this.world.items[indexItem].att == "undefined") return false;
 if (typeof this.world.items[indexItem].att[attId] == "undefined") return false;

 var j = arrayObjectIndexOf(this.world.items[indexItem].att[attId], "id", propId);
 return (j>=0);
}

exports.IT_GetAttPropValue = function(indexItem, attId, propId) {

 // find j in this.world.items[indexItem].att[attId][i][propId]
 for (var i=0; i<this.world.items[indexItem].att[attId].length;i++) {
 
  // to-do: two versions!
  if (this.world.items[indexItem].att[attId][i].id == propId) {
   return this.world.items[indexItem].att[attId][i].value;
  } else if (typeof this.world.items[indexItem].att[attId][i][propId] != 'undefined') {
   return this.world.items[indexItem].att[attId][i][propId];
  }
 }

}

exports.IT_SetAttPropValue = function(indexItem, attId, propId, newValue) {
 // find j in this.world.items[indexItem].att[attId][i][propId]
 for (var i=0; i<this.world.items[indexItem].att[attId].length;i++) {
  // to-do: two versions!
  if (this.world.items[indexItem].att[attId][i].id == propId) {
   this.world.items[indexItem].att[attId][i].value = newValue;
   return;
  } else if (typeof this.world.items[indexItem].att[attId][i][propId] != 'undefined') {
   this.world.items[indexItem].att[attId][i][propId] = newValue;
   return;
  }
 }
}

exports.IT_IncrAttPropValue = function(indexItem, attId, propId, increment) {
 var incNumber = +increment;

 // find j in this.world.items[indexItem].att[attId][i][propId]
 for (var i=0; i<this.world.items[indexItem].att[attId].length;i++) {
  // to-do: two versions!
  if (typeof this.world.items[indexItem].att[attId][i].id == propId) {
   this.world.items[indexItem].att[attId][i].value =
    +this.world.items[indexItem].att[attId][i].value + incNumber;
   return;
  } else if (typeof this.world.items[indexItem].att[attId][i][propId] != 'undefined') {
   this.world.items[indexItem].att[attId][i][propId] =
    +this.world.items[indexItem].att[attId][i][propId] + incNumber;
   return;
  }
 }
}

exports.IT_GetRandomDirectionFromLoc = function(indexLoc) {
 var table = ludi_runner.getCSExits(indexLoc);

 if (table.length  == 0) return null;
 var i = MISC_Random (table.length);
 return {dir:table[i].dir, target:table[i].target};

}

exports.IT_SameLocThan = function(i1, i2) {
 if (i1<0) return false;
 if (i2<0) return false;
 return (IT_GetLoc(i1) == IT_GetLoc(i2));

}

exports.IT_DynDesc = function(i) {

	// vue by now
	this.CA_ShowDesc (i);

	return



 // if dark, do not show the description
 if (exports.IT_ATT(i, "dark")) {
  //  to-do: if light available, show the description
  CA_ShowMsg("It is dark");
  return;
 }

 var itemWorlIndex = this.worldIndexes.items[i];

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
exports.IT_FirstTimeDesc = function(indexItem) {
 // vue by now:
 return true

 var itemWorlIndex = this.worldIndexes.items[indexItem];

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

exports.W_GetAttIndex = function(id) {
 return arrayObjectIndexOf(this.world.attributes, "id", id);
}

/* GD: Game Definition *****************************************************************/

// note: for use during game development
exports.GD_CreateMsg = function(indexLang, idMsg, txtMsg) {
 ludi_runner.GD_CreateMsg (indexLang, idMsg, txtMsg);
}

/* MISC: facilities *****************************************************************/


 exports.MISC_Random = function(num) {
 return Math.floor((Math.random() * (+num)));
 }

/*(end)********************** INSTRUCTION SET *********************/


// auxiliary functions

exports.getTargetAndLocked = function (par_c) { // to-do: internal


 var connection = {target: -1, isLocked: false};
 
 
 if (this.world.items[par_c.loc].address == undefined) return connection

 // target and locked resolution
 var targetId;
 var dirId = this.world.directions[par_c.direction].id;
 var internalDirIndex =  0; // look for dirIndex (par_c.direction) in this.world.items[par_c.loc].address[] {dir, target, locked}
 for (var i=0;i<this.world.items[par_c.loc].address.length;i++) {
  if (this.world.items[par_c.loc].address[i].dir == dirId) {
   // get target
   if (typeof this.world.items[par_c.loc].address[i].target != 'undefined') {
    targetId = this.world.items[par_c.loc].address[i].target;
    connection.target = arrayObjectIndexOf(this.world.items, "id", targetId);
   } else { // check dynamic target
  
    var gameIndex = this.worldIndexes.items[par_c.loc].gameIndex;
    if (gameIndex>=0) {
     if (typeof ludi_game.items[gameIndex].target == 'function'){
      targetId = ludi_game.items[gameIndex].target (dirId);
      if (targetId == "locked")
       connection.isLocked = true;
      else
       connection.target = arrayObjectIndexOf(this.world.items, "id", targetId);
     }
    }
   }

   // get isLocked
   if (!connection.isLocked) { // if not statically locked
    if (typeof this.world.items[par_c.loc].address[i].locked != 'undefined') {
     connection.isLocked = (this.world.items[par_c.loc].address[i].locked == "true");
    }
   }
   break;
  }
 }
 return connection;

}
