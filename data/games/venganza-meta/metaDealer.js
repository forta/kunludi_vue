let metaState, subgames

module.exports = exports = {
	dependsOn:dependsOn,
	getSubgames:getSubgames
}

function dependsOn ( metaState) {
	this.metaState =  metaState

  this.subgames = []
  initSubgames (this.subgames, this.metaState)

}

function getSubgames () {
	return this.subgames
}

let initSubgames =  function  (subgames, metaState) {

subgames.push ({

	id: 'acto1',

	available: function () {
		// sólo disponible si no lo has completado
		return metaState.subgames[this.id].length == 0
	}
});

subgames.push ({

	id: 'acto2',

	available: function () {
		// sólo disponible si no lo has completado, pero sí el acto previo
		return  metaState.subgames[this.id].length == 0 &&  metaState.subgames.acto1.length > 0
	}
});

}

function nextSubgame () {
	// only if it is one module mandatory to run
	// using metaState.history  and  metaState.subgame[subgameIndex].state and metaState.subgame[subgameIndex].data

	return ""
}
