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

exports.getChoices = function () {
	// it should be by exploring the world
	return [
		{ actionId: 'look' }, 
		{ actionId: 'go to d1', d1:'east' } 
	]
}
