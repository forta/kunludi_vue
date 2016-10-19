/*

module that:
 1. izolizes access to this.world
 2. provides an interface to add reactions to this.reactionList

*/

"use strict";

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
 		"DIR",
 		"SHOW_ECHO",
 		"PLAY_AUDIO",
 		"QUOTE_BEGIN",
 		"QUOTE_CONTINUES",
		"DEV_MSG",
		"KERNEL_MSG",
		
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


export function dependsOn  (world, reactionList, userState) {
 this.world = world;
 this.reactionList = reactionList;
 this.userState = userState;
};

export function executeGameAction (type, parameters) {

 switch (type) {
  case 'msg':
   addReaction (type, parameters);
  break;
 
  //default:
  //break;
 }
};

// direct, simply show text as is.
export function addReaction (type, parameters) {

 reactionList.add ({type:type, parameters:parameters} );

};

// -----------------------------------



/*(begin)********************** INSTRUCTION SET *********************
They are just a interface of macros for cleaner code
Categories:
 CA: Client Action

  CA_ShowDesc (o1)
  CA_ShowDynDesc (o1)
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
  PC_IsAt (i)

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
  IT_IsAt (i, l)
  IT_Here (i)
  IT_Carried(i)
  IT_CarriedOrHere(i)
  IT_NumberOfAtts(i)
  IT_ATT (indexItem, idAttType)
  IT_AttPropExists (indexItem, attId, propId)
  IT_GetAttPropValue (indexItem, attId, propId)
  IT_SetAttPropValue (indexItem, attId, propId, newValue)
  IT_IncrAttPropValue (indexItem, attId, propId, increment)

  IT_GetRandomDirectionFromLoc(indexLoc)
  IT_SameLocThan(i1,i2)

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

export function CA_ShowDesc  (o1) {
 this.reactionList.push ({type:this.caMapping("DESC"), o1:o1});
};

export function CA_ShowDesc  (o1) {
 this.reactionList.push ({type:this.caMapping("DYN_DESC"), o1:o1});
};

export function CA_QuoteBegin  (item, txt, param, last) {
 if (typeof param == "undefined") param = [];
 if (typeof last == "undefined") last = true;

 this.reactionList.push ({type:this.caMapping("QUOTE_BEGIN"), item:item, txt:txt, param:param, last:last});
}

export function CA_QuoteContinues  (txt, param, last) {
 if (typeof param == "undefined") param = [];
 if (typeof last == "undefined") last = true;

 this.reactionList.push ({type:this.caMapping("QUOTE_CONTINUES"), txt:txt, param:param, last:last});
}

export function CA_Refresh () {
 this.reactionList.push ({type:this.caMapping("REFRESH")});
}

export function CA_URL (url, txt, param) {
 this.reactionList.push ({type:this.caMapping("URL"), url:url, txt:txt, param:param});
}

export function CA_ShowMsg (txt, param) {
 this.reactionList.push ({type:this.caMapping("MSG"), txt:txt, param:param});
}

export function CA_ShowMsgAsIs (txt) {
 this.reactionList.push ({type:this.caMapping("ASIS"), txt:txt});
}

export function CA_ATT ( o1, o2) {
 this.reactionList.push ({type:this.caMapping("ATT"), o1:o1, o2:o2});
}

export function CA_ShowDir ( dir) {
 this.reactionList.push ({type:this.caMapping("DIR"), dir:dir});
}

export function CA_ShowItem ( o1) {
 this.reactionList.push ({type:this.caMapping("ITEM"), o1:o1});
}

export function CA_ShowMenu ( menu) {
 this.reactionList.push ({type:this.caMapping("SHOW_MENU"), menu:menu});
}

export function CA_ShowImg (url, isLocal, isLink, txt, param) {
 if (typeof txt == "undefined") txt = "";
 if (typeof isLocal == "undefined") isLocal = false;
 if (typeof isLink == "undefined") isLink = false;
 
 this.reactionList.push ({type:this.caMapping("GRAPH"), url:url, isLocal:isLocal, isLink:isLink, txt:txt, param:param});
}

export function CA_PressKey (txt) {
 this.reactionList.push ({type:this.caMapping("PRESS_KEY"), txt:txt});
}

export function CA_EndGame (txt) {
 this.reactionList.push ({type:this.caMapping("END_GAME"), txt:txt});
}

export function CA_PlayAudio (fileName, autoStart, txt, param) {

 this.reactionList.push ({type:this.caMapping("PLAY_AUDIO"), fileName:fileName, autoStart:autoStart, txt:txt, param:param });

}


/* PC: Playing Character *****************************************************************/

export function PC_X () {
 return this.userState.profile.indexPC;
}

export function PC_SetIndex (o1) {
 this.userState.profile.indexPC = o1;
 if (this.userState.profile.indexPC<0) {
  console.log ("Error in PC_SetIndex(o1): o1(== " +  o1 + ") is < 0");
  return;
 }
}
 
export function PC_GetCurrentLoc () {
 var locId = this.world.items[this.userState.profile.indexPC].loc;
 return this.IT_X (locId);
}

export function PC_SetCurrentLoc  (indexItem) {
 this.world.items[this.userState.profile.indexPC].loc = this.world.items[indexItem].id;
}

export function PC_CheckCurrentLocId  (i) {

 return ((this.IT_GetLoc(i)  == this.PC_X()) || (this.IT_GetLoc(i) == this.PC_GetCurrentLoc()));

}

// score increment
export function PC_Points  (value) {
 // to-do: as att?: var scoreInc = +IT_GetAttPropValue (this.userState.profile.indexPC, "score", "state");
 this.userState.profile.score += value;
}

export function PC_GetTurn  () {
 return this.userState.profile.turnCounter;
}

export function PC_IsAt  (i) {
	return (this.IT_X (this.world.items[this.userState.profile.indexPC].loc) == i)
}


/* DIR: directions *****************************************************************/

export function DIR_GetIndex  (id) {
 return arrayObjectIndexOf(this.world.directions, "id", id);
}

export function DIR_GetId  (index) {
 if (index>=0) return this.world.directions[index].id;
}

/* IT: items *****************************************************************/

export function IT_X   (id){
 return arrayObjectIndexOf(this.world.items, "id", id);
}

export function IT_NumberOfItems  () {
 return this.world.items.length;
}


export function IT_GetId  (index) {
 if (index>=0) return this.world.items[index].id;
}

export function IT_GetGameIndex  (index) {
 return this.worldIndexes.items[index].gameIndex;
}

export function IT_GetLoc  (i) {
 var locId = this.world.items[i].loc;
 return arrayObjectIndexOf(this.world.items, "id", locId);
}

export function IT_SetLocToLimbo  (i) {
 var value = this.IT_X ("limbo");
 this.world.items[i].loc = this.world.items[value].id;
}

//  i2 where i1 was; i1 to limbo
export function IT_ReplacedBy (i1, i2) {
 this.world.items[i2].loc = this.world.items[i1].loc;
 this.world.items[i1].loc = "limbo";
}

export function IT_BringHere (i) {
 this.world.items[i].loc = this.world.items[this.PC_GetCurrentLoc()].id;
}

export function IT_SetLoc (i, value) {
 this.world.items[i].loc = this.world.items[value].id;
}

export function IT_GetType (i) {
 return this.world.items[i].type;
}

export function IT_SetType (i, value) {
 this.world.items[i].type = value;
}

export function IT_GetIsLocked (i, dir) {
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

export function IT_SetIsLocked (i, dir, value) {
 for (var d in this.world.items[i].address) {
  if (this.world.items[i].address[d].dir == dir) {
   this.world.items[i].address[d].locked = value;
   return;
  }
 }
}

export function IT_GetIsItemKnown (i1, i2) {
 
 return (typeof this.world.items[i1].state.itemsMemory[i2] != "undefined");
}

export function IT_SetIsItemKnown (i1, i2) {

 this.world.items[i1].state.itemsMemory[i2] = { whereWas:-1, lastTime:-1 };
}

export function IT_GetWhereItemWas (i1, i2) {
 if (this.IT_GetIsItemKnown (i1, i2)) return this.world.items[i1].state.itemsMemory[i2].whereWas;
 return "limbo"; // it could be undefined
}

export function IT_SetWhereItemWas (i1, i2, value) {
 if (!this.IT_GetIsItemKnown (i1, i2)) this.IT_SetIsItemKnown (i1,i2);
 this.world.items[i1].state.itemsMemory[i2].whereWas = value;
 this.IT_SetLastTime(i1, i2);
}

export function IT_SetLastTime (i1, i2) {

 this.world.items[i1].state.itemsMemory[i2].lastTime = this.userState.profile.turnCounter;
}

export function IT_IsAt  (i, l) {
 return (IT_GetLoc(i) == l);
}

export function IT_Here  (i) {
 return (IT_GetLoc(i) == PC_GetCurrentLoc());
}

export function IT_Carried (i) {
 return (this.IT_GetLoc(i)  == this.PC_X());
}

// to-do:  IT_CarriedOrHere -> IT_OnCarriedOrHere
export function IT_CarriedOrHere (i) {
 return ((this.IT_GetLoc(i)  == this.PC_X()) || (this.IT_GetLoc(i) == this.PC_GetCurrentLoc()));
}

export function IT_NumberOfAtts (i) {
 if (typeof this.world.items[i].att == "undefined") return 0;
 return this.world.items[i].att.length;
}

export function IT_ATT (indexItem, idAttType) { // if exists definition

 if (indexItem<0) return false; // preventive
 var indexAttType = arrayObjectIndexOf(this.world.attributes, "id", idAttType);
 if (indexAttType  == -1) return false;

 if (typeof this.world.items[indexItem].att == "undefined") return false;
 if (typeof this.world.items[indexItem].att[idAttType] == "undefined") return false;
 return true;
}

export function IT_AttPropExists (indexItem, attId, propId) {
 if (typeof this.world.items[indexItem].att == "undefined") return false;
 if (typeof this.world.items[indexItem].att[attId] == "undefined") return false;

 var j = arrayObjectIndexOf(this.world.items[indexItem].att[attId], "id", propId);
 return (j>=0);
}

export function IT_GetAttPropValue (indexItem, attId, propId) {

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

export function IT_SetAttPropValue (indexItem, attId, propId, newValue) {
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

export function IT_IncrAttPropValue (indexItem, attId, propId, increment) {
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

export function IT_GetRandomDirectionFromLoc (indexLoc) {
	
 // to-do: pending to repare
 return
 var table = ludi_runner.getCSExits(indexLoc);

 if (table.length  == 0) return null;
 var i = MISC_Random (table.length);
 return {dir:table[i].dir, target:table[i].target};

}

export function IT_SameLocThan (i1, i2) {
 if (i1<0) return false;
 if (i2<0) return false;
 return (IT_GetLoc(i1) == IT_GetLoc(i2));

}

// if returns true, ordinary desc will be needed after it
export function IT_FirstTimeDesc (indexItem) {
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

export function W_GetAttIndex (id) {
 return arrayObjectIndexOf(this.world.attributes, "id", id);
}

/* GD: Game Definition *****************************************************************/

// note: for use during game development
export function GD_CreateMsg (indexLang, idMsg, txtMsg) {
	
	this.reactionList.push ({type:this.caMapping("DEV_MSG"), lang:indexLang, txt:idMsg, detail:txtMsg});

}

/* MISC: facilities *****************************************************************/


 export function MISC_Random (num) {
 return Math.floor((Math.random() * (+num)));
 }

/*(end)********************** INSTRUCTION SET *********************/



