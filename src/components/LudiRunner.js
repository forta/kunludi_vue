// references to external modules
let libReactions, gameReactions

exports.dependsOn = function (libReactions, gameReactions, reactionList) {
	this.libReactions = libReactions
	this.gameReactions = gameReactions
	this.reactionList = reactionList
}

exports.processAction = function  (action) {
	var status;
	
	// to-do: at first, try this.gameReactions.processAction (action) and only if is not possible, try against lib
	status = false
	// status = this.gameReactions.processAction (action)
	
	if (!status) 
		status = this.libReactions.processAction (action)	
	
	if (!status)
		this.reactionList.push ({type:"msg", detail: {msgId: 'You cannot %v1'}} )

}

