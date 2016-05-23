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

exports.dependsOn = function (primitives, reactionList) {
	this.primitives = primitives
	this.reactionList = reactionList
}

exports.processChoice = function  (choice) {
	
	console.log ("choice0:" + JSON.stringify (choice)) 
	
	if (choice.actionId == "look") {
		this.reactionList.push ({type:"msg", detail: {msgId: 'You look around'}} )
	} else if (choice.actionId == "go to d1") {
		console.log ("choice: " +  JSON.stringify (choice))
		this.reactionList.push ({type:"msg", detail: {msgId: 'You go to d1', d1:choice.d1}} )
	} else {
		this.reactionList.push ({type:"msg", detail: {msgId: 'Not implemented'}} )
	} 

}

/*
reactions.push ({
	id: 'look',
	
	enabled: function (indexItem,indexItem2) {
		return true;
	},
	
	reaction: function (par_c) {
		reactionList.push ({type:"msg", detail: {msgId: 'You look around'}} )
		
		// 	IT_DynDesc(PC_GetCurrentLoc ()); -> libModule.
	},
	
});

*/

