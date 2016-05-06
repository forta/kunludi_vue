exports.version = "0.01";

var reactionList = [];

exports.executeGameAction = function (gameAction, parameters) {
	switch (codeAction) {
		case 'CA_ShowMsgAsIs':
			addReaction (gameAction, parameters);
		break;
		
		default:
		break;
	}
}

exports.addReaction = function () {
	reactionList.add ({ });
	ludi_runner.clientAction.push ({type:ludi_root.caEnum.ASIS.value, txt:txt});
}

exports.getNextReaction = function () {
	return exports.reactionList.shift();
}


