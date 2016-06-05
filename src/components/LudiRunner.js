// references to external modules
let libReactions, gameReactions, reactionList
exports.userState
let choice = {choiceId:'top', isLeafe:false} // current under construction choice

exports.choices = []
exports.world=[]

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}


exports.createWorld = function (libWorld, gameWorld) {
	
	exports.userState = {
		profile: {
			indexPC:0, // by default
			loc: 2 // by default (item 1 is "the limbo")
		}
	}

	exports.world = {
		attributes: [],
		items: [],
		directions: [],
		actions: []
	}

	// merging libWorld and gameWorld into world and generating indexes (ref: ludi_runner.compileIndexes)
	
	// attributes
	
	// to-do

	// import lib items
	for (let i=0;i<libWorld.items.length;i++) {
		exports.world.items.push (libWorld.items[i])
	}

	// import game items
	for (let i=0;i<gameWorld.items.length;i++) {
		exports.world.items.push (gameWorld.items[i])
	}

	// directions

	// to-do

	// import lib actions
	for (let i=0;i<libWorld.actions.length;i++) {
		exports.world.actions.push (libWorld.actions[i])
	}

	// import game actions: only add action
	for (let i=0;i<gameWorld.actions.length;i++) {
		exports.world.actions.push (gameWorld.actions[i])
	}
	
	// indexes ---------
	
	// items[].locIndex
	for (let i=0;i<exports.world.items.length;i++) {
		exports.world.items[i].locIndex = arrayObjectIndexOf(exports.world.items, "id", exports.world.items[i].loc);
	}
	
	
}

exports.dependsOn = function (libReactions, gameReactions, reactionList) {
	this.libReactions = libReactions
	this.gameReactions = gameReactions
	this.reactionList = reactionList

}

exports.processChoice = function  (choice) {
	
	let previousChoice = this.choice
	
	this.choice = choice
	
	if (choice.choiceId == 'top') this.choice.action = undefined
	// else if (choice.choiceId == 'obj1') this.choice.item1 = previousChoice.item1 // to-do: provitional
	
				
	if (choice.isLeafe) { // execution
		exports.processAction (choice.action)
	}

	exports.updateChoices()
	
}


exports.processAction = function(action) {
	var status
	
	status = false
	// status = this.gameReactions.processAction (action)
	
	if (!status) 
		status = this.libReactions.processAction (action)	
	
	if (!status)
		this.reactionList.push ({type:"msg", detail: {msgId: 'You cannot:' + JSON.stringify (action)}} )

}

exports.actionIsEnabled = function(action, item1, item2) {
	
	var status = undefined

	// status = this.gameReactions.actionIsEnabled (action, item1, item2)
	
	if (status == undefined) 
		status = this.libReactions.actionIsEnabled (action, item1, item2)	
	
	return status
}


exports.updateChoices = function () {
	
	exports.choices = []
	
	// exports.choices.length = 0

	exports.choices.push ({choiceId:'top', isLeafe:false});
	exports.choices.push ({choiceId:'itemGroup', isLeafe:false, itemGroup: 'here'});
	exports.choices.push ({choiceId:'itemGroup', isLeafe:false, itemGroup: 'carrying'});
	exports.choices.push ({choiceId:'itemGroup', isLeafe:false, itemGroup: 'notHere'});
	exports.choices.push ({choiceId:'directActions', isLeafe:false});


	if (this.choice.choiceId == 'directActions') {
		
		exports.choices.push ({choiceId:'action', isLeafe:true, action:{actionId:'look'}});
		
	} else if (this.choice.choiceId == 'itemGroup') {
		
		
		if (this.choice.itemGroup == 'here') {
			
			for (let i=0;i<exports.world.items.length;i++) {
				if (exports.world.items[i].type == "loc") continue;
				
				if (exports.world.items[i].loc == exports.world.items[exports.userState.profile.indexPC].loc) {
					exports.choices.push ({choiceId:'obj1', item1: i});
				}
				
			}
			
			
		} else if (this.choice.itemGroup == 'carrying') {
			
			for (let i=0;i<exports.world.items.length;i++) {
				if (exports.world.items[i].type == "loc") continue;
				
				if (exports.world.items[i].locIndex == exports.userState.profile.indexPC) {
					exports.choices.push ({choiceId:'obj1', item1: i});
				}
				
			}
			
			
		} else if (this.choice.itemGroup == 'notHere') {
			// to-do
			
		} 
		
	} else if (this.choice.choiceId == 'obj1') {
		
		for (var i=0; i< exports.world.actions.length; i++) {
			if (exports.actionIsEnabled  (i, this.choice.item1)) {
				exports.choices.push ({choiceId:'action', isLeafe:true, action: { item1: this.choice.item1, actionId: exports.world.actions[i].id }})
			}
		}
	} else if (this.choice.choiceId == 'action') {
		// o1 -> action -> o2
		
		for (var i=0; i< exports.world.items.length; i++) {
			exports.choices.push ({choiceId:'obj2', action: { item1: this.choice.item1, actionId: this.choice.actionId, item2: i }});
		}
	}

}


