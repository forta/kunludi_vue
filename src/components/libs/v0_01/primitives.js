/*

module that:
 1. izolizes access to this.world
 2. provides an interface to add reactions to this.reactionList

*/

"use strict";

let world;
let reactionList;
let userState;
let hidenMessages = false;

/* Expose stuff */

module.exports = exports = {
	caMapping:caMapping,
	CA_ShowDesc:CA_ShowDesc,
	executeGameAction:executeGameAction,
	dependsOn:dependsOn,
	CA_QuoteBegin:CA_QuoteBegin,
	CA_QuoteContinues:CA_QuoteContinues,
	CA_Refresh:CA_Refresh,
	CA_URL:CA_URL,
	CA_ShowMsg:CA_ShowMsg,
	CA_ShowMsgAsIs:CA_ShowMsgAsIs,
	CA_ATT:CA_ATT,
	CA_ShowDir:CA_ShowDir,
	CA_ShowItem:CA_ShowItem,
	CA_ShowMenu:CA_ShowMenu,
	CA_ShowImg:CA_ShowImg,
	CA_PressKey:CA_PressKey,
	CA_EndGame:CA_EndGame,
	CA_PlayAudio:CA_PlayAudio,
  PC_X:PC_X,
	PC_SetIndex:PC_SetIndex,
	PC_GetCurrentLoc:PC_GetCurrentLoc,
	PC_GetCurrentLocId:PC_GetCurrentLocId,
	PC_SetCurrentLoc:PC_SetCurrentLoc,
	PC_CheckCurrentLocId,PC_CheckCurrentLocId,
	PC_Points:PC_Points,
	PC_GetTurn:PC_GetTurn,
	PC_IsAt:PC_IsAt,
	DIR_GetIndex:DIR_GetIndex,
	DIR_GetId:DIR_GetId,
	IT_X:IT_X,
	IT_NumberOfItems:IT_NumberOfItems,
	IT_GetId:IT_GetId,
	IT_GetGameIndex:IT_GetGameIndex,
	IT_GetLoc:IT_GetLoc,
	IT_SetLocToLimbo:IT_SetLocToLimbo,
	IT_ReplacedBy:IT_ReplacedBy,
	IT_BringHere:IT_BringHere,
	IT_SetLoc:IT_SetLoc,
	IT_GetType:IT_GetType,
	IT_SetType:IT_SetType,
	IT_GetIsLocked:IT_GetIsLocked,
	IT_SetIsLocked:IT_SetIsLocked,
	IT_GetIsItemKnown:IT_GetIsItemKnown,
	IT_SetIsItemKnown:IT_SetIsItemKnown,
	IT_GetWhereItemWas:IT_GetWhereItemWas,
	IT_SetWhereItemWas:IT_SetWhereItemWas,
	IT_SetLastTime:IT_SetLastTime,
	IT_IsAt:IT_IsAt,
	IT_IsHere,IT_IsHere,
	IT_IsCarried:IT_IsCarried,
	IT_IsCarriedOrHere:IT_IsCarriedOrHere,
	IT_NumberOfAtts:IT_NumberOfAtts,
	IT_ATT:IT_ATT,
	IT_AttPropExists:IT_AttPropExists,
	IT_GetAttPropValue:IT_GetAttPropValue,
	IT_SetAttPropValue:IT_SetAttPropValue,
	IT_IncrAttPropValue:IT_IncrAttPropValue,
	IT_GetRandomDirectionFromLoc:IT_GetRandomDirectionFromLoc,
	IT_SameLocThan:IT_SameLocThan,
	IT_FirstTimeDesc:IT_FirstTimeDesc,
	W_GetAttIndex:W_GetAttIndex,
	GD_CreateMsg:GD_CreateMsg,
	MISC_Random:MISC_Random,
  MISC_HideMessages:MISC_HideMessages

}

function caMapping (type) {

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
		"KERNEL_MSG"
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

function dependsOn (worldPar, reactionListPar, userStatePar) {
	this.world = worldPar;
	this.reactionList = reactionListPar;
	this.userState = userStatePar;
};

function executeGameAction (type, parameters) {

 switch (type) {

  case 'msg':
	reactionList.add ({type:type, parameters:parameters} );
  break;

  //default:
  //break;
 }
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
  CA_ShowMenu ( menu, piece)
  CA_ShowImg (url)
  CA_PressKey (txt)
  CA_EndGame ()
  CA_RestartGame ()
  CA_PlayAudio (fileName, autoStart, txt)

 PC: Playing Character

  PC_X()
  PC_SetIndex(o1)
  PC_GetCurrentLoc ()
  PC_GetCurrentLocId ()
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
  IT_IsHere (i)
  IT_IsCarried(i)
  IT_IsCarriedOrHere(i)
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
	MISC_HideMessages (boolean)

 Auxiliary functions (internals):

  getTargetAndLocked (par_c)

*/

/* CA: Client Action *****************************************************************/

function CA_ShowDesc  (o1) {
 this.reactionList.push ({type:this.caMapping("DESC"), o1:o1, o1Id:this.world.items[o1].id});
};

function CA_QuoteBegin  (item, txt, param, last) {
 if (typeof param == "undefined") param = [];
 if (typeof last == "undefined") last = true;

 this.reactionList.push ({type:this.caMapping("QUOTE_BEGIN"), item:item, txt:txt, param:param, last:last});
}

function CA_QuoteContinues  (txt, param, last) {
 if (typeof param == "undefined") param = [];
 if (typeof last == "undefined") last = true;

 this.reactionList.push ({type:this.caMapping("QUOTE_CONTINUES"), txt:txt, param:param, last:last});
}

function CA_Refresh () {
 this.reactionList.push ({type:this.caMapping("REFRESH")});
}

function CA_URL (url, txt, param) {
 this.reactionList.push ({type:this.caMapping("URL"), url:url, txt:txt, param:param});
}

function CA_ShowMsg (txt, param) {

  if (this.hidenMessages) return

  // to-do: this is a temp trick
  if (param != undefined) {
	console.log ("Param in CA_ShowMsg: " + JSON.stringify (param))
	if (param.o1 != undefined) {
		console.log ("Param.o1 in CA_ShowMsg: " + param.o1)
		if  (!isNaN(parseFloat(param.o1)) && isFinite(param.o1)) {
			param.o1 = this.world.items[param.o1].id
		}
	}
  }

 this.reactionList.push ({type:this.caMapping("MSG"), txt:txt, param:param});
}

function CA_ShowMsgAsIs (txt) {
 this.reactionList.push ({type:this.caMapping("ASIS"), txt:txt});
}

function CA_ATT ( o1, o2) {
 this.reactionList.push ({type:this.caMapping("ATT"), o1:o1, o2:o2});
}

function CA_ShowDir ( dir) {
 this.reactionList.push ({type:this.caMapping("DIR"), dir:dir});
}

function CA_ShowItem ( o1) {
 // o1Id!
 this.reactionList.push ({type:this.caMapping("ITEM"), o1:o1, o1Id:this.world.items[o1].id});
}

function CA_ShowMenu ( menu, menuPiece) {

 if (menuPiece != undefined) {
	  console .log ("MenuPiece: " + JSON.stringify (menuPiece))
 }

  this.reactionList.push ({type:this.caMapping("SHOW_MENU"), menu:menu, menuPiece:menuPiece});
}

function CA_ShowImg (url, isLocal, isLink, txt, param) {

	this.reactionList.push ({
		type:this.caMapping("GRAPH"),
		url:url,
		isLocal: (typeof isLocal == "undefined")? false : isLocal,
		isLink: (typeof isLink == "undefined")? false: isLink,
		txt:(typeof txt == "undefined")? "": txt,
		param:param
	});
}

function CA_PressKey (txt) {
	this.reactionList.push ({type:this.caMapping("PRESS_KEY"), txt:txt, pressed:false});
}

function CA_EndGame (txt) {
 this.reactionList.push ({type:this.caMapping("END_GAME"), txt:txt});
}

function CA_PlayAudio (fileName, autoStart, txt, param) {

 this.reactionList.push ({type:this.caMapping("PLAY_AUDIO"), fileName:fileName, autoStart:autoStart, txt:txt, param:param });

}


/* PC: Playing Character *****************************************************************/

function PC_X () {
 return this.userState.profile.indexPC;
}

function PC_SetIndex (o1) {
 this.userState.profile.indexPC = o1;
 if (this.userState.profile.indexPC<0) {
  console.log ("Error in PC_SetIndex(o1): o1(== " +  o1 + ") is < 0");
  return;
 }
}

function PC_GetCurrentLoc () {
 var locId = this.world.items[this.userState.profile.indexPC].loc;
 return this.IT_X (locId);
}

function PC_GetCurrentLocId () {
 return this.world.items[this.userState.profile.indexPC].loc;
}

function PC_SetCurrentLoc  (indexItem) {
 this.world.items[this.userState.profile.indexPC].loc = this.world.items[indexItem].id;
}

function PC_CheckCurrentLocId  (locId) {
 var i =  this.IT_X (locId)

 return ((this.IT_GetLoc(i)  == this.PC_X()) || (this.IT_GetLoc(i) == this.PC_GetCurrentLoc()));

}

// score increment
function PC_Points  (value) {
 // to-do: as att?: var scoreInc = +IT_GetAttPropValue (this.userState.profile.indexPC, "score", "state");
 this.userState.profile.score += value;
}

function PC_GetTurn  () {
 return this.userState.profile.turnCounter;
}

function PC_IsAt  (i) {
	return (this.IT_X (this.world.items[this.userState.profile.indexPC].loc) == i)
}


/* DIR: directions *****************************************************************/

function DIR_GetIndex  (id) {
 return arrayObjectIndexOf(this.world.directions, "id", id);
}

function DIR_GetId  (index) {
 if (index>=0) return this.world.directions[index].id;
}

/* IT: items *****************************************************************/

function IT_X (id){

 return arrayObjectIndexOf(this.world.items, "id", id);
}

function IT_NumberOfItems  () {
 return this.world.items.length;
}


function IT_GetId  (index) {
 if (index>=0) return this.world.items[index].id;
}

function IT_GetGameIndex  (index) {
 return this.worldIndexes.items[index].gameIndex;
}

function IT_GetLoc  (i) {
 var locId = this.world.items[i].loc;
 return arrayObjectIndexOf(this.world.items, "id", locId);
}

function IT_SetLocToLimbo  (i) {
 var value = this.IT_X ("limbo");
 this.world.items[i].loc = this.world.items[value].id;
}

//  i2 where i1 was; i1 to limbo
function IT_ReplacedBy (i1, i2) {
 this.world.items[i2].loc = this.world.items[i1].loc;
 this.world.items[i1].loc = "limbo";
}

function IT_BringHere (i) {
 this.world.items[i].loc = this.world.items[this.PC_GetCurrentLoc()].id;
}

function IT_SetLoc (i, value) {
 this.world.items[i].loc = this.world.items[value].id;
}

function IT_GetType (i) {
 return this.world.items[i].type;
}

function IT_SetType (i, value) {
 this.world.items[i].type = value;
}

function IT_GetIsLocked (i, dir) {
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

function IT_SetIsLocked (i, dir, value) {
 for (var d in this.world.items[i].address) {
  if (this.world.items[i].address[d].dir == dir) {
   this.world.items[i].address[d].locked = value;
   return;
  }
 }
}

function IT_GetIsItemKnown (i1, i2) {
	 return arrayObjectIndexOf(this.world.items[i1].state.itemsMemory, "itemIndex", i2) >= 0
}

function IT_SetIsItemKnown (i1, i2) {
	var pos = arrayObjectIndexOf(this.world.items[i1].state.itemsMemory, "itemIndex", i2)
	if (pos < 0) {
		this.world.items[i1].state.itemsMemory.push ( {itemIndex: i2, whereWas:-1, lastTime:-1 } )
	} else {
		this.world.items[i1].state.itemsMemory[pos] = {itemIndex: i2, whereWas:-1, lastTime:-1 }
	}
}

function IT_GetWhereItemWas (i1, i2) {
	var pos = arrayObjectIndexOf(this.world.items[i1].state.itemsMemory, "itemIndex", i2)
	if (pos < 0) return "limbo"; // it could be undefined
	return  this.world.items[i1].state.itemsMemory[pos].whereWas;
}

function IT_SetWhereItemWas (i1, i2, value) {
	var pos = arrayObjectIndexOf(this.world.items[i1].state.itemsMemory, "itemIndex", i2)
	if (pos < 0) this.IT_SetIsItemKnown (i1,i2)
	pos = arrayObjectIndexOf(this.world.items[i1].state.itemsMemory, "itemIndex", i2)
  this.world.items[i1].state.itemsMemory[pos].whereWas = value;
  this.IT_SetLastTime(i1, i2);
}

function IT_SetLastTime (i1, i2) {
	var pos = arrayObjectIndexOf(this.world.items[i1].state.itemsMemory, "itemIndex", i2)
  this.world.items[i1].state.itemsMemory[pos].lastTime = this.userState.profile.turnCounter;
}

function IT_IsAt  (i, l) {
 return (this.IT_GetLoc(i) == l);
}

function IT_IsHere  (i) {
 return (this.IT_GetLoc(i) == this.PC_GetCurrentLoc());
}

function IT_IsCarried (i) {
 return (this.IT_GetLoc(i)  == this.PC_X());
}

// to-do:  IT_IsCarriedOrHere -> IT_OnCarriedOrHere
function IT_IsCarriedOrHere (i) {
 return ((this.IT_GetLoc(i)  == this.PC_X()) || (this.IT_GetLoc(i) == this.PC_GetCurrentLoc()));
}

 function IT_NumberOfAtts (i) {
 if (typeof this.world.items[i].att == "undefined") return 0;
 return this.world.items[i].att.length;
}

function IT_ATT (indexItem, idAttType) { // if exists definition

 if (indexItem<0) return false; // preventive
 var indexAttType = arrayObjectIndexOf(this.world.attributes, "id", idAttType);
 if (indexAttType  == -1) return false;

 if (typeof this.world.items[indexItem].att == "undefined") return false;
 if (typeof this.world.items[indexItem].att[idAttType] == "undefined") return false;
 return true;
}

function IT_AttPropExists (indexItem, attId, propId) {
 if (typeof this.world.items[indexItem].att == "undefined") return false;
 if (typeof this.world.items[indexItem].att[attId] == "undefined") return false;

 var j = arrayObjectIndexOf(this.world.items[indexItem].att[attId], "id", propId);
 return (j>=0);
}

function IT_GetAttPropValue (indexItem, attId, propId) {

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

function IT_SetAttPropValue (indexItem, attId, propId, newValue) {

	// console.log ("IT_SetAttPropValue. indexItem: " + indexItem + ",attId: " + attId + ",propId: " + propId + ", newValue: " + newValue)

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

function IT_IncrAttPropValue (indexItem, attId, propId, increment) {
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

function IT_GetRandomDirectionFromLoc (indexLoc) {

 // to-do: pending to repare
 return
 var table = ludi_runner.getCSExits(indexLoc);

 if (table.length  == 0) return null;
 var i = MISC_Random (table.length);
 return {dir:table[i].dir, target:table[i].target};

}

function IT_SameLocThan (i1, i2) {
 if (i1<0) return false;
 if (i2<0) return false;
 return (IT_GetLoc(i1) == IT_GetLoc(i2));

}

// if returns true, ordinary desc will be needed after it
function IT_FirstTimeDesc (indexItem) {
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

function W_GetAttIndex (id) {
 return arrayObjectIndexOf(this.world.attributes, "id", id);
}

/* GD: Game Definition *****************************************************************/

// note: for use during game development
function GD_CreateMsg (lang, idMsg, txtMsg) {

	this.reactionList.push ({type:this.caMapping("DEV_MSG"), lang:lang, txt:idMsg, detail:txtMsg});

}

/* MISC: facilities *****************************************************************/


 function MISC_Random (num) {
 return Math.floor((Math.random() * (+num)));
 }

 function MISC_HideMessages (flag) {

	 console.log ("MISC_HideMessages. flag: " + flag)

	 this.hidenMessages = flag

 }


/*(end)********************** INSTRUCTION SET *********************/
