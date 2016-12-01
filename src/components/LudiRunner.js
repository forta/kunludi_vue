// references to external modules
let libReactions, gameReactions, reactionList
exports.userState
export let choice = {choiceId:'top', isLeafe:false, parent:''} // current under construction choice

exports.choices = []
exports.world =[]

exports.dependsOn = function (libReactions, gameReactions, reactionList) {
	this.libReactions = libReactions
	this.gameReactions = gameReactions
	this.reactionList = reactionList

}

exports.createWorld = function (libWorld, gameWorld) {

	exports.world = {
		attributes: [],
		items: [],
		directions: [],
		actions: []
	}

	// merging libWorld and gameWorld into world and generating indexes (ref: ludi_runner.compileIndexes)

	// import game items (no items in lib)
	for (let i=0;i<gameWorld.items.length;i++) {
		exports.world.items.push (gameWorld.items[i])
	}

	// adding items[].state.itemsMemory
	// if initial states are not defined, default values:
	for (let i=0;i<exports.world.items.length;i++) {

		if ((exports.world.items[i].type == "pc")) {

			// if state is not defined, it is created now
			if (typeof exports.world.items[i].state == "undefined") exports.world.items[i].state = {};

			// A item i is known if itemsMemory[i] exists.
			// the last container where item i was seen: itemsMemory[i].whereWas
			// the time it was seen: itemsMemory[i].lastTime

			// if itemsMemory is not defined, it is created now
			if (exports.world.items[i].state.itemsMemory == null)
				exports.world.items[i].state.itemsMemory = [];
		}

	}

	// import lib directions
	for (let i=0;i<libWorld.directions.length;i++) {
		exports.world.directions.push (libWorld.directions[i])
	}

	// import game directions (only add more directions)
	for (let i=0;i<gameWorld.directions.length;i++) {
		exports.world.directions.push (gameWorld.directions[i])
	}

	// import lib actions
	for (let i=0;i<libWorld.actions.length;i++) {
		exports.world.actions.push (libWorld.actions[i])
	}

	// import game actions: (only add more actions)
	for (let i=0;i<gameWorld.actions.length;i++) {
		exports.world.actions.push (gameWorld.actions[i])
	}

	// adding attExceptions (no items in lib)
	exports.world.attExceptions = []
	for (let i=0;i<gameWorld.attExceptions.length;i++) {
		exports.world.attExceptions.push (gameWorld.attExceptions[i])
	}

	// import lib attributes
	for (let i=0;i<libWorld.attributes.length;i++) {
		exports.world.attributes.push (libWorld.attributes[i])
	}

	// import game attributes (by now: only add more attributes: what about overwriting?)
	for (let i=0;i<gameWorld.attributes.length;i++) {
		exports.world.attributes.push (gameWorld.attributes[i])
	}

	// assign attributes to items
	for (let i=0;i<exports.world.items.length;i++) {
		setDefaultAttributeProperties (this, i)
	}

	// indexes ---------

	exports.userState = {
		profile: {
			indexPC:0, // by default
			loc:  arrayObjectIndexOf (exports.world.items, "id", exports.world.items[0].loc)
		}
	}

}

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

export function getCurrentChoice () {
	return this.choice
}

// to-do: pending to check
export function itemWithAttException (indexItem, attId_def) {

	var indexException = arrayObjectIndexOf(exports.world.attExceptions, "id", attId_def);
	if (indexException >= 0) { // exists exception for this attribute?
		// look item in exceptionLinst
		for (var i=0; i< exports.world.attExceptions[indexException].exceptionList.length; i++) {
			if (exports.world.attExceptions[indexException].exceptionList[i] == exports.world.items[indexItem].id)  return true;
		}
	}
	return false;
}

// assign attributes to items (from: exports.world.items[indexItem].att[attIndex])
function setDefaultAttributeProperties (context, indexItem) {

	var attId_def; // attribute definition
	for (var indexAtt = 0; indexAtt < context.world.attributes.length; indexAtt++) {
		// elements like {id: "isDark", restrictedTo: Array[1], properties: Array[1], asignedTo: Array[1], enabledActions: Array[6]}
		attId_def = context.world.attributes[indexAtt].id;
		var isException = context.itemWithAttException(indexItem, attId_def);

		if (typeof context.world.items[indexItem].att == 'undefined')
			context.world.items[indexItem].att ={}; // item without any attribute

		var attOnItem = false;
		// each attribute in item definition
		for (var attId_item in context.world.items[indexItem].att) {
			if (attId_item == attId_def) {
				attOnItem = true;
				break;
			}
		}

		var attToBeImported = false;

		if (attOnItem) {

			if (isException) { // remove it
				delete context.world.items[indexItem].att[attId_def];
			}

			attToBeImported = true;
		} else {
			if ((context.world.attributes[indexAtt].asignedTo != 'undefined')  // att mandatory to item (global rule)
				 && !isException ) {  // not an exception
				for (var aTo in context.world.attributes[indexAtt].asignedTo) {
					if (context.world.items[indexItem].type == context.world.attributes[indexAtt].asignedTo[aTo]) {
						// item must have this attribute
						attToBeImported = true;
						break;
					}
				}
			}
		}

		if (attToBeImported) {
			// get properties from attribute definition (at least: some of them)
			var propAlready;
			for (var pDef in context.world.attributes[indexAtt].properties) {
				propAlready = false;
				var proId = context.world.attributes[indexAtt].properties[pDef].id;
				for (var pItem in context.world.items[indexItem].att[attId_def]) {
					// if match; do not import
					if (typeof context.world.items[indexItem].att[attId_def][pItem][proId] != 'undefined') {
						propAlready = true;
						break;
					}
				}
				if (!propAlready) { // new property from definition
					if (typeof context.world.items[indexItem].att[attId_def] == 'undefined')
						context.world.items[indexItem].att[attId_def] = [];
					var isOptional = true;  // by default property is optional
					if (typeof context.world.attributes[indexAtt].properties[pDef].use != 'undefined') {
						if (context.world.attributes[indexAtt].properties[pDef].use == 'mandatory') {
							isOptional = false;
						}
					}
					// only add mandatory properties
					if (!isOptional) {
						context.world.items[indexItem].att[attId_def].push (context.world.attributes[indexAtt].properties[pDef]);
					}
				}
			}
		}

	}

}



exports.processChoice = function  (choice) {

	if (this.choice.choiceId == 'quit') return

	// console.log("choice input: " + JSON.stringify (choice))

	// parent
	let previousChoice = this.choice

	this.choice = choice

	if (choice.choiceId == 'top') this.choice.action = undefined

	if (choice.choiceId == 'obj1') choice.parent = previousChoice

	if (choice.isLeafe) { // execution

		// saving its previous location
		var locBefore
		if (((choice.choiceId == 'action0') || (choice.choiceId == 'action') || (choice.choiceId == 'action2')) && (choice.action.item1 != undefined) ){
			locBefore = exports.world.items[choice.action.item1].loc
		}

		var indexPCBefore = exports.userState.profile.indexPC
		
		// game action execution
		exports.processAction (choice.action)	
		
		// check whether is at least one refresh action in the reaction list
		var pendingRefresh = false
		for (var i=0;i<this.reactionList.length;i++) {
			if (this.reactionList[i].type == "rt_refresh") {
				pendingRefresh = true
				break
			}
		}

		// after execution, show the parent
		if ( !pendingRefresh && 
		
				// only after game actions
				( ((choice.choiceId == 'action0') ||(choice.choiceId == 'action') || (choice.choiceId == 'action2')) &&
				  (choice.action.item1 != undefined)) && 
			 
				(locBefore == exports.world.items[choice.action.item1].loc) && // item is still accesible
				(indexPCBefore == exports.userState.profile.indexPC) ) // same pc
		{
			exports.processChoice (previousChoice)
		} else {
			// top level of game choices
			this.choice = {choiceId:'top', isLeafe:false, parent:''};
		}

		this.choice.loc = exports.world.items[exports.userState.profile.indexPC].loc
		
	}

	exports.updateChoices()

}

exports.processAction = function(action) {
	var status

	action.pc = exports.userState.profile.indexPC

	// expanding codes
	if (action.item1 >= 0) action.item1Id = exports.world.items [action.item1].id
	if (action.item2 >= 0) action.item2Id = exports.world.items [action.item2].id

	action.loc = arrayObjectIndexOf (exports.world.items, "id", exports.world.items[exports.userState.profile.indexPC].loc)

	action.direction = action.d1
	if (action.direction != undefined) {
		action.directionId = exports.world.directions [action.d1].id
		// it must be resolved here
		action.link = exports.getTargetAndLocked (action.loc, action.direction)
	}

	status = false
	status = this.gameReactions.processAction (action)

	if (!status)
		status = this.libReactions.processAction (action)

	if (!status)
		this.reactionList.push ({type:"rt_msg", txt: 'You cannot:' + JSON.stringify (action)} )
	
	// update memory
	if (action.item1 >= 0) {
		if (exports.world.items[exports.userState.profile.indexPC].state.itemsMemory[action.item1] == null)
			exports.world.items[exports.userState.profile.indexPC].state.itemsMemory[action.item1] = {}
		exports.world.items[exports.userState.profile.indexPC].state.itemsMemory[action.item1].whereWas = exports.world.items[action.item1].loc
	}

	if (action.item2 >= 0) {
		if (exports.world.items[exports.userState.profile.indexPC].state.itemsMemory[action.item2] == null)
			exports.world.items[exports.userState.profile.indexPC].state.itemsMemory[action.item2] = {}
		exports.world.items[exports.userState.profile.indexPC].state.itemsMemory[action.item1].whereWas = exports.world.items[action.item2].loc
	}
	
}


exports.worldTurn = function() {

	// to-do: if pendingChoice do nothing

	for (var i=0;i<exports.world.items.length;i++) {

		// attention! currently items[i].turn() are not called
		
		if (typeof this.gameReactions.turn == 'function') {
			// game level
			status = this.gameReactions.turn (i)
			if (status == true) continue;
			// by now: no lib turn
		}
    }
		
	exports.updateChoices()
}


exports.actionIsEnabled = function(actionId, item1, item2) {

	var status = undefined

	if (typeof this.gameReactions.actionIsEnabled == "function")
		status = this.gameReactions.actionIsEnabled (actionId, item1, item2)

	if (status == undefined)
		status = this.libReactions.actionIsEnabled (actionId, item1, item2)

	return status
}

exports.getTargetAndLocked = function (loc, direction) {

	var connection = {target: -1, isLocked: false};


	if (exports.world.items[loc].address == undefined) return connection

	// target and locked resolution
	var targetId;
	var dirId = exports.world.directions[direction].id;
	var internalDirIndex =  0; // look for dirIndex (direction) in exports.world.items[loc].address[] {dir, target, locked}
	for (var i=0;i<exports.world.items[loc].address.length;i++) {
		if (exports.world.items[loc].address[i].dir == dirId) {
			// get target
			if (typeof exports.world.items[loc].address[i].target != 'undefined') {
				targetId = exports.world.items[loc].address[i].target;
				connection.target = arrayObjectIndexOf(exports.world.items, "id", targetId);
			} else { // check dynamic target

				var gameIndex = arrayObjectIndexOf(this.gameReactions.items, "id", exports.world.items[loc].id);

				if (gameIndex>=0) {
					if (typeof this.gameReactions.items[gameIndex].target == 'function'){
						targetId = this.gameReactions.items[gameIndex].target (dirId);
						if (targetId == "locked")
							connection.isLocked = true;
						else
							connection.target = arrayObjectIndexOf(exports.world.items, "id", targetId);
					}
				}
			}

			// get isLocked
			if (!connection.isLocked) { // if not statically locked
				if (typeof exports.world.items[loc].address[i].locked != 'undefined') {
					connection.isLocked = (exports.world.items[loc].address[i].locked == "true");
				}
			}
			break;
		}
	}

	connection.isKnown = false
	if (connection.target != -1) {
		connection.isKnown = (exports.world.items[exports.userState.profile.indexPC].state.itemsMemory[connection.target] != null) 
	}

	return connection;

}


exports.updateChoices = function () {

	if (this.choice.choiceId == 'quit') return
	
	// updating exports.userState.profile.loc
	if (exports.world.items[exports.userState.profile.loc].id != exports.world.items[exports.userState.profile.indexPC].loc) {
		let newLoc = arrayObjectIndexOf (exports.world.items, "id", exports.world.items[exports.userState.profile.indexPC].loc)
		exports.userState.profile.loc = newLoc

	}

	exports.choices = []

	exports.choices.push ({choiceId:'top', isLeafe:false, parent:""});
	
	var internalChoices = {
		directActions: [],
		directionGroup: [],
		itemGroup_here: [],
		itemGroup_carrying: [],
		itemGroup_notHere: []
	}
	
	if (this.choice.choiceId == 'top') {
		var loc = arrayObjectIndexOf (exports.world.items, "id", exports.world.items[exports.userState.profile.indexPC].loc)

		// set current loc as known
		if (exports.world.items[exports.userState.profile.indexPC].state.itemsMemory[loc] == null) {
		  console.log ("Loc ["+ exports.world.items[exports.userState.profile.indexPC].loc + "] is now known.")
		  exports.world.items[exports.userState.profile.indexPC].state.itemsMemory[loc] = {}
		}
	}

	// direct actions
	for (var i=0; i< exports.world.actions.length; i++) {
		if (exports.world.actions[i].numpar == 0) {
			var actionId = exports.world.actions[i].id
			if (exports.actionIsEnabled  (actionId)) {
				internalChoices.directActions.push ({choiceId:'action0', isLeafe:true, parent:"directActions", action: { actionId: actionId, parent:"top"}})
			}
		}
	}

	// directions
	for (let d=0;d<exports.world.directions.length;d++) {

		var link = exports.getTargetAndLocked (exports.userState.profile.loc, d)
		if (link.target >= 0) {
			internalChoices.directionGroup.push ({choiceId:'dir1', isLeafe:true, parent:"directionGroup", parent:"directActions", action: {actionId:'go', d1: d, target:link.target, isKnown:link.isKnown}})
		}
	}

	// items here
	for (let i=0;i<exports.world.items.length;i++) {
		if (i == exports.userState.profile.indexPC) continue;
		if (exports.world.items[i].type == "loc") continue;

		if (exports.world.items[i].loc == exports.world.items[exports.userState.profile.indexPC].loc) {
			internalChoices.itemGroup_here.push ({choiceId:'obj1', item1: i, parent:"here"});
		}
	}

	// items carried
	for (let i=0;i<exports.world.items.length;i++) {
		if (i == exports.userState.profile.indexPC) continue;
		if (exports.world.items[i].type == "loc") continue;

		if (exports.world.items[i].loc == exports.world.items[exports.userState.profile.indexPC].id) {
			internalChoices.itemGroup_carrying.push ({choiceId:'obj1', item1: i, parent:"carrying"});
		}
	}

	// absent items
	for (let i=0;i<exports.world.items.length;i++) {
		if (i == exports.userState.profile.indexPC) continue;
		if (exports.world.items[i].type == "loc") continue;
		if (exports.world.items[i].loc == exports.world.items[exports.userState.profile.indexPC].loc) continue;
		if (exports.world.items[i].loc == exports.world.items[exports.userState.profile.indexPC].id) continue;

		var gameIndex = arrayObjectIndexOf(this.gameReactions.items, "id", exports.world.items[i].id);

		if (gameIndex>=0) {
			if (typeof this.gameReactions.items[gameIndex].shownWhenAbsent == 'function'){
				if (!this.gameReactions.items[gameIndex].shownWhenAbsent ()) continue
	
				internalChoices.itemGroup_notHere.push ({choiceId:'obj1', item1: i, parent:"notHere"});
			}
		}
	}
		
	// counting choices 
	if (internalChoices.directActions.length > 0){
		exports.choices.push ({choiceId:'directActions', isLeafe:false, parent:"top", count: internalChoices.directActions.length});

		if ((this.choice.choiceId == 'top') || (this.choice.choiceId == 'directActions')) {

			// direct action look is always present
			if (this.choice.choiceId == 'top') {
				// to-do: asset: PC can see
				exports.choices.push ({choiceId:'action0', isLeafe:true, parent:"directActions", action:{actionId:'look', parent:"top"}});
			} else {
					
				// all direct actions are not shown all the time (top)
				for (var i in internalChoices.directActions) 
					exports.choices.push (internalChoices.directActions[i])
			}
		}
	}
	
	if (internalChoices.directionGroup.length > 0){
		exports.choices.push ({choiceId:'directionGroup', isLeafe:false, parent:"top", count: internalChoices.directionGroup.length});

		if ((this.choice.choiceId == 'top') ||(this.choice.choiceId == 'directionGroup')) {
			for (var i in internalChoices.directionGroup) 
				exports.choices.push (internalChoices.directionGroup[i])
		}
	}
	
	if (internalChoices.itemGroup_here.length > 0){
		exports.choices.push ({choiceId:'itemGroup', isLeafe:false, itemGroup: 'here', parent:"top", count: internalChoices.itemGroup_here.length});		

		if ((this.choice.choiceId == 'top') || ((this.choice.choiceId == 'itemGroup') && (this.choice.itemGroup == 'here'))) {
			for (var i in internalChoices.itemGroup_here) 
				exports.choices.push (internalChoices.itemGroup_here[i])
		}
	}
	
	if (internalChoices.itemGroup_carrying.length > 0){
		exports.choices.push ({choiceId:'itemGroup', isLeafe:false, itemGroup: 'carrying', parent:"top", count: internalChoices.itemGroup_carrying.length});		

		if ((this.choice.choiceId == 'top') || ((this.choice.choiceId == 'itemGroup') && (this.choice.itemGroup == 'carrying'))) {
			for (var i in internalChoices.itemGroup_carrying) 
				exports.choices.push (internalChoices.itemGroup_carrying[i])
		}
	}

	if (internalChoices.itemGroup_notHere.length > 0){

		exports.choices.push ({choiceId:'itemGroup', isLeafe:false, itemGroup: 'notHere', parent:"top", count: internalChoices.itemGroup_notHere.length});		
		// absent items are not shown all the time (top)
		if ((this.choice.choiceId == 'itemGroup') && (this.choice.itemGroup == 'notHere')) { 
			for (var i in internalChoices.itemGroup_notHere) 
				exports.choices.push (internalChoices.itemGroup_notHere[i])
		}
	}
	
	if (this.choice.choiceId == 'obj1') {

		// if the item has items inside (container), show them
		for (var itemInside=0; itemInside< exports.world.items.length; itemInside++) {
			if (itemInside == this.choice.item1) continue; // item1 into itself
			if (exports.world.items[itemInside].type == 'loc') continue // location into item1
			
			var itemInsideLoc = arrayObjectIndexOf (exports.world.items, "id",exports.world.items[itemInside].loc)
			
			if (itemInsideLoc != this.choice.item1)  continue // itemInsideLoc must be the container (item1)
				
			// finally the container must be carried or here
			if ( (exports.world.items[itemInsideLoc].loc != exports.world.items[this.userState.profile.indexPC].id) &&  // not carried
				 (exports.world.items[itemInsideLoc].loc != exports.world.items[this.userState.profile.indexPC].loc) )  // not here
				continue

			exports.choices.push ({choiceId:'obj1', item1: itemInside, parent:"inside"});
		}

		// actions on the item
		for (var i=0; i< exports.world.actions.length; i++) {
			var actionId = exports.world.actions[i].id
			if (exports.world.actions[i].numpar == 0) continue;

			if (exports.actionIsEnabled  (actionId, this.choice.item1)) { 		// obj1 + action
				exports.choices.push ({choiceId:'action', isLeafe:true, parent:"obj1", action: { item1: this.choice.item1, actionId: actionId }})
			} else {
				var j=0
				for (; j< exports.world.items.length; j++) {
					if (j == this.choice.item1) continue; // item1 on item1
					if (j == this.userState.profile.indexPC) continue; // self action with item1
					
					// j must be carried or here
					if ( (exports.world.items[j].loc != exports.world.items[this.userState.profile.indexPC].id) &&  // not carried
						 (exports.world.items[j].loc != exports.world.items[this.userState.profile.indexPC].loc) )  // not here
					continue;

					if (exports.actionIsEnabled  (actionId, this.choice.item1, j)) { // obj1 + action + obj2
						exports.choices.push ({choiceId:'action2', isLeafe:true, parent:"action2", action: { item1: this.choice.item1, actionId: actionId, item2:j }})
					}
				}
			}
		}

		/*
		if (this.choice.parent == 'notHere') {
			// specially for absent items
			if (exports.world.items[exports.userState.profile.indexPC].state.itemsMemory[this.choice.item1] != undefined) {
				exports.choices.push ({choiceId:'action', isLeafe:true, parent:"obj1", action: { item1: this.choice.item1, actionId: "where" }})
			}
		}
		*/

	}

}
