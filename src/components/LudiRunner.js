// references to external modules
let libReactions, gameReactions

exports.dependsOn = function (libReactions, gameReactions) {
	this.libReactions = libReactions
	this.gameReactions = gameReactions
}

exports.processChoice = function  (choice) {
	// by now, only against lib reactions
	this.libReactions.processChoice (choice)	
}

