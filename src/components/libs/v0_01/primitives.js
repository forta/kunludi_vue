exports.reactionList = [];

let world
let reactionList

exports.setWorld = function (libWorld, gameWorld) {
	// to-do: compilation and merge
	// by now:
	this.world = libWorld
}

exports.dependsOn = function (reactionList) {
	this.reactionList = reactionList
}

exports.executeGameAction = function (type, parameters) {
	
	switch (type) {
		case 'msg':
			addReaction (type, parameters)
		break
		
		default:
		break
	}
}

// direct, simply show text as is.
exports.addReaction = function (type, parameters) {
	
	reactionList.add ({type:type, parameters:parameters} )

}

exports.getChoices = function (choice) {
	// it should be by exploring the world
	
	var choices = []
	
	// choices.length = 0

	choices.push ({choiceId:'top'});
	choices.push ({choiceId:'itemGroup', itemGroup: 'here'});
	choices.push ({choiceId:'itemGroup', itemGroup: 'carrying'});
	choices.push ({choiceId:'itemGroup', itemGroup: 'notHere'});
	choices.push ({choiceId:'directActions'});

	if (choice.choiceId == 'directActions') {
		choices.push ({choiceId:'action', action:{actionId:'look'}});
	} else if (choice.choiceId == 'itemGroup') {
		if (choice.itemGroup == 'here') {
			choices.push ({choiceId:'obj1', item: 'pájaros'});
		} else if (choice.itemGroup == 'carrying') {
			choices.push ({choiceId:'obj1', item: 'camisa'});
		} else if (choice.itemGroup == 'notHere') {
			choices.push ({choiceId:'obj1', item: 'espejo'});
		} 
		
	} else if (choice.choiceId == 'obj1') {
		for (var i=0; i< this.world.actions.length; i++) {
			choices.push ({choiceId:'action', action: { actionId: this.world.actions[i].id }});
		}
	}


	return choices;
}
