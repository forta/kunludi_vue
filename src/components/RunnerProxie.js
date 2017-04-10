//const serverName = "www.kunludi.com"
const serverName = "buitre.ll.iac.es"
// const serverName = "paco-pc"

let runner

// to-do:
let runnerCache = {
	world: {},
	userState: {}
}

let games = []

let language = {}

let connectionState = -1 // -1: no connected; 0: local; 1: remote

let libVersion= '', gameId= ''

let remoteServer = 'www.kunludi.com', remotePort = 8089

let reactionList = []

let menu = []

let menuPiece = {}

let history = []

let gameSlots = []

let userId = "" , token, playerList = []

let chatMessages // link to external data

let chatMessagesSeq = 0, gameTurn = 0, playerListLogons = 0

// to-do: attention, vue dependence
let Http

// let gameAbout = state.games[gameIndex].about

let primitives, libReactions, gameReactions

module.exports = exports = {
	loadLocalData:loadLocalData,
	userLogon:userLogon,
	userLogoff:userLogoff,
	connectToGame:connectToGame,
	expandDynReactions:expandDynReactions,
	processChoice:processChoice,
	getCurrentChoice:getCurrentChoice,
	updateChoices:updateChoices,
	getChoices:getChoices,
	getReactionList:getReactionList,
	getMenu:getMenu,
	getMenuPiece:getMenuPiece,
	getHistory:getHistory,
	setHistory:setHistory,
	getGameTurn:getGameTurn,
	getGameState:getGameState,
	saveGameState:saveGameState,
	loadGameState:loadGameState,
	deleteGameState:deleteGameState,
	renameGameState:renameGameState,
	getGameSlots:getGameSlots,
	resetGameTurn:resetGameTurn,
	getConnectionState:getConnectionState,
	getToken:getToken,
	getPlayerList:getPlayerList,
	sendChatMessage:sendChatMessage,
	linkChatMessages:linkChatMessages,
	refreshDataFromServer:refreshDataFromServer,
  getGames:getGames,
	loadGames:loadGames,

	//??
	getGameSlotIndex:getGameSlotIndex,
	refreshGameSlots:refreshGameSlots,
	backEnd_sendChoice:backEnd_sendChoice,
	refreshPeriodicallyDataFromServer:refreshPeriodicallyDataFromServer

}

// important: periodic request to server
function refreshPeriodicallyDataFromServer(thisPointer) {
	setInterval(function() {
	  if (thisPointer.connectionState == 1)  thisPointer.refreshDataFromServer(thisPointer.Http)
	}, 10000);
}

function storageON() {

    try {
        localStorage.setItem("__test", "data");
    } catch (e) {
        return false;
    }
    return true;
}

function userLogon (userId, Http ) {

	let url = 'http://' + serverName + ':8090/api/'

	url += 'users/' + userId + '/logon'
	this.connectionState = -1 // initial state
	this.Http = Http;
	this.userId = userId

	// ask for user session
	Http.get(url).then((response) => {

			this.connectionState = 1
			this.token = response.data.token
			this.playerList = response.data.playerList
			this.chatMessagesSeq = 0
			this.gameTurn = 0
			this.playerListLogons = 0

			// periodically refreshing
			this.refreshPeriodicallyDataFromServer(this)


		}, (response) => {
			this.connectionState = -2 //error
			console.log ("User not logged on.")
		});


}

function userLogoff (Http ) {

	let url = 'http://' + serverName + ':8090/api/'

	url += 'users/' + this.token + '/logoff'
	this.connectionState = -1 // initial state
	this.userId = ""

		Http.post(url, {userId:this.userId}).then(response => {
			console.log ("Chat message was sent to server")
			this.refreshDataFromServer(Http)
		}, (response) => {
			// error, but it doesn't matter
		});

}

function loadGames (Http) {

	let url = 'http://' + serverName + ':8090/api/'

	url += 'games'

	Http.get(url).then((response) => {
		this.games = response.data
	}, (response) => {
		console.log ("missed game list")
	});

}

function connectToGame (gameId, Http ) {

	let url = 'http://' + serverName + ':8090/api/'

	url += 'game/' + gameId + '/load/' + this.token
	this.connectionState = -1 // initial state
	this.reactionList = []
	this.Http = Http;
	this.gameId = gameId

	this.runnerCache = {
		world: {},
		userState: {}
	}

	// ask for game session
	Http.get(url).then((response) => {

		  if ( response.data.status < 0) {
				this.connectionState = -2 //error
				console.log ("The game was not loaded")
				this.gameId= ''
				return
			}

		  // initial arrays and values
			this.reactionList = response.data.reactionList
			this.choices = response.data.choices
			this.runnerCache.userState = response.data.userState
			this.runnerCache.world = response.data.world

			if (response.data.gameTurn == undefined) this.gameTurn = 0;
			else this.gameTurn = response.data.gameTurn

			this.history = response.data.history

			this.connectionState = 1


		}, (response) => {
			this.connectionState = -2 /error
			console.log ("The game was not loaded")
		});


}

function expandDynReactions (reactionList) {

	function arrayObjectIndexOf(myArray, property, searchTerm) {
		for(var i = 0, len = myArray.length; i < len; i++) {
			if (myArray[i][property] === searchTerm) return i;
		}
		return -1;
		}


	// expand each dyn reaction into static ones

	let sourceReactionList = reactionList.slice()
	//console.log("----------------------------------original reactionList:\n" + JSON.stringify (sourceReactionList))

	let expandedReactionList = [], pendingReactionlist = []

	let currentPointer
	for (currentPointer = 0;
		 currentPointer < sourceReactionList.length;
		 currentPointer++) {

		if (sourceReactionList[currentPointer].type == "rt_desc") {
			// if static message does not exist, look for dynamic method
			var attribute = "desc"

			// getting a new this.reactionList

			// transform rt_dyn_desc into rt_desc
			var longMsgId = "items." + sourceReactionList[currentPointer].o1Id + "." + attribute

			// to-do: msgResolution depends on language and mustn't be here
			// if (msgResolution (longMsgId) != "") {
				// confirmed that it was a static desc
				expandedReactionList.push (JSON.parse(JSON.stringify(sourceReactionList[currentPointer])) )
				continue
			//}

			// insertion of expanded reactions
			let itemReaction = arrayObjectIndexOf (this.gameReactions.items, "id", sourceReactionList[sReaction].o1Id)

			// for debug:
			//if (false) {
			if (itemReaction>=0) {
				// item level -> add reactions into this.reactionList
				this.gamReactions.items[itemReaction][attribute]()
			} else {
				// not static nor dynamic desc, the missing longMsgId will be shown
				sourceReactionList[currentPointer].type = "rt_asis"
				sourceReactionList[currentPointer].txt = "[" + longMsgId + "]"

				expandedReactionList.push (JSON.parse(JSON.stringify(sourceReactionList[currentPointer])) )
				continue
			}

			// catch up reactions of this.reactionlist and insert them in expandedReactionList
			for (let newReaction in this.reactionList) {
				//if (this.reactionList[newReaction].type == "rt_desc")
				// by now: item.desc() cannot call another item.desc()
				expandedReactionList.push (JSON.parse(JSON.stringify(this.reactionList[newReaction])))
			}
			// empty this.reactionList
			this.reactionList.splice(0,this.reactionList.length)
		}
		else if (sourceReactionList[currentPointer].type == "rt_press_key") {
			expandedReactionList.push (JSON.parse(JSON.stringify(sourceReactionList[currentPointer])) )
			expandedReactionList [expandedReactionList.length-1].alreadyPressed = false

			// avoid processing the rest of reactions until key is pressed
			break
		}
		else { // standard static reaction
			expandedReactionList.push (JSON.parse(JSON.stringify(sourceReactionList[currentPointer])) )
		}
	}

	// console.log("----------------------------------Expanded reactionList:\n" + JSON.stringify (expandedReactionList))

	for (var i= currentPointer+1; i < sourceReactionList.length;i++) {
		pendingReactionlist.push (sourceReactionList[i])
	}

	return {expandedReactionList: expandedReactionList.slice(), pendingReactionlist: pendingReactionlist.slice()}


}

function backEnd_sendChoice (choice, optionMsg) {

	let url = 'http://' + serverName + ':8090/api/'

	if (choice.choiceId == "top" || choice.choiceId == "directActions" || choice.choiceId == "directionGroup")
		url += 'choice/' + this.token + '/' + choice.choiceId
	else if (choice.choiceId == "itemGroup" )
		url += 'choice/itemGroup/' + this.token + '/' + choice.itemGroup
	else if (choice.choiceId == "action0" )
		url += 'gameAction0/' + this.token + '/' + choice.action.actionId
	else if (choice.choiceId == "dir1" )
		url += 'dir/' + this.token + '/' + choice.action.d1 + '/' + choice.action.target + '/' + choice.action.isKnown
	else if (choice.choiceId == "obj1" )
		url += 'obj1/' + this.token + '/' + choice.item1
	else if (choice.choiceId == "action" )
		url += 'gameAction1/' + this.token + '/' + choice.action.item1 + '/' + choice.action.actionId
	else if (choice.choiceId == "action2" )
		url += 'gameAction2/' + this.token + '/' + choice.action.item1 + '/' + choice.action.actionId + '/' + choice.action.item2

  /*
	var res = {
		reactionList: [],
		choices: [{ userId: this.userId, choiceId:'action0', action: {actionId:'look'}, isLeafe:true, comment:'error'}]
	}
	*/

	if (url != "") {
		this.Http.get(url).then((response) => {

			if (response.data.status < 0) {
				console.log ("Connection lost")
				token = undefined
				userId = ""
				connectionState = -1
			}

      copyGameDataFromServer (this, response.data)

		}, (response) => {
			console.log ("missed game reaction")
		});
	}

	return

}

function processChoice (choice, optionMsg) {

	if (this.connectionState == 0) {
		this.runner.processChoice (choice, optionMsg)
		this.gameTurn = this.runner.getGameTurn()

	} else {

		this.backEnd_sendChoice (choice)

	}

}

function getCurrentChoice() {

	if (this.connectionState == 0) return this.runner.getCurrentChoice ()
	else {
		// to-do: Http.get(url).then((response)
	}

}

function updateChoices() {
	if (this.connectionState == 0) {
		this.runner.updateChoices ()
		this.choices = this.runner.choices
	} else {
		// to-do: Http.get(url).then((response)
	}

}



function getChoices() {
	return this.choices
}

function getReactionList() {
	return this.reactionList
}

function getMenu() {
	return this.menu
}

function getMenuPiece() {
	return this.menuPiece
}

function getHistory() {
	return this.history
}

function setHistory(history) {
	this.history = history
}


function getGameTurn() {
	return this.gameTurn
}

function getGameState () {

	var pointer

	if (this.connectionState <0) return {PC:-1}

	if (this.connectionState == 0) {
		pointer = this.runner
	} else  {
		pointer = this.runnerCache
	}

	this.userState = pointer.userState

	var PC = pointer.userState.profile.indexPC

	return {PC:PC, userState: pointer.world.items[PC] }


}

function saveGameState (slotDescription) {

	var pointer

	if (this.connectionState == 0) {
		pointer = this.runner
	} else  {
		pointer = this.runnerCache
	}

	if (this.connectionState == 0) {

		if (!storageON()) return

		// necessary to refresh data
		this.refreshGameSlots ()

		var i = this.getGameSlotIndex(slotDescription)

		if (i>=0) { // if name already exists
			// if it is the default slot, exit
			if (slotDescription == "default") {
				return
			} else {
				// name used
				alert ("Name slot in use, try another one");
				return
			}
		}

		var ludi_games = JSON.parse (localStorage.ludi_games)

		var d = +new Date

		ludi_games[this.gameId].push ({
			id: (slotDescription == "default")? "default": d,
			date: d,
			world: this.runner.world,
			history: this.history,
			gameTurn: this.runner.gameTurn,
			userState: pointer.userState,
			slotDescription: slotDescription
		})

		this.gameSlots = ludi_games[this.gameId].slice()

		localStorage.setItem("ludi_games", JSON.stringify(ludi_games));

		console.log ("Game saved!")


	} else {
		// to-do: Http.get(url).then((response)
	}

}

function loadLocalData (gameId, primitives, libReactions, gameReactions, libWorld, gameWorld0) {

	var libVersion = 'v0_01'

	this.gameId = gameId

	// code links
	this.primitives = primitives
	this.libReactions = libReactions
	this.gameReactions = gameReactions

	this.connectionState = -1

	this.runner = require ('../components/LudiRunner.js');

	// "compile" default ( == initial) state
	this.runner.createWorld(libWorld, gameWorld0)

	this.reactionList = []

	this.menu = []

	this.history = [
		{
			action: { choiceId:'action0', action : {actionId:'look'}, noEcho:true},
			reactionList: [
				//{ type: 'rt_msg', txt: 'Introduction' },
				//{ type: 'rt_press_key', txt: 'press_key_to_start' }
			]
		}
	]

	this.runner.dependsOn(primitives, libReactions, gameReactions, this.reactionList)

	this.connectionState = 0

	this.gameTurn = 0

}

function loadGameState (slotId, showIntro) {


	if (this.connectionState == 0) {

		if (!storageON()) return

		// necessary to refresh data
		this.refreshGameSlots ()

		var i = this.getGameSlotIndex(slotId)
		if (i<0) {
			console.log ("Game not loaded!. Slot: " + slotId)
		} else {
			this.runner.world = this.gameSlots[i].world
			this.history = this.gameSlots[i].history //.slice()
			this.gameTurn = this.gameSlots[i].gameTurn
			this.runner.userState = this.gameSlots[i].userState
			console.log ("Game loaded!. Slot: " + slotId)
		}

		// refreshing dependences
		this.primitives.dependsOn(this.runner.world, this.reactionList, this.runner.userState )

		// show intro, after default game slot
		if ( (slotId == "default") && (showIntro == undefined) ) {
			this.choice = { choiceId:'action0', action: {actionId:'look'}, isLeafe:true}
		} else {
			this.choice = 	{choiceId:'top', isLeafe:false, parent:''}
		}

		this.processChoice(this.choice)

		return true
	}

}

function deleteGameState (slotId) {

	if (this.connectionState == 0) {

		if (!storageON()) return

		var i = this.getGameSlotIndex(slotId)
		if (i>=0) {
			var ludi_games = JSON.parse (localStorage.ludi_games)

			this.gameSlots.splice(i,1)

			ludi_games[this.gameId] = this.gameSlots
			localStorage.setItem("ludi_games", JSON.stringify(ludi_games));

			console.log ("Game slot deleted!. Slot: " + slotId)
		}
	}

}

function renameGameState ( slotId, newSlotDescription) {

	if (this.connectionState == 0) {

		if (!storageON()) return

		var i = this.getGameSlotIndex (slotId)
		if (i>=0) {
			var ludi_games = JSON.parse (localStorage.ludi_games)

			ludi_games[this.gameId][i].slotDescription = newSlotDescription
			this.gameSlots[i].slotDescription = newSlotDescription
			localStorage.setItem("ludi_games", JSON.stringify(ludi_games));

			// refresh state
			this.gameSlots = ludi_games[this.gameId]

			console.log ("Game slot " + slotId + " renamed: [" + newSlotDescription + "]")
		}
	}
}

function refreshGameSlots () {

	this.gameSlots =  []

	if (this.connectionState == 0) {

		if (!storageON()) return

		var ludi_games = {}
		if (localStorage.ludi_games == undefined) localStorage.setItem("ludi_games", JSON.stringify({}));
		else ludi_games = JSON.parse (localStorage.ludi_games)

		if (ludi_games[this.gameId] == undefined) {
			ludi_games[this.gameId] = []
			localStorage.setItem("ludi_games", JSON.stringify(ludi_games));
		}
		this.gameSlots = ludi_games[this.gameId].slice()
	} else {
		//from serve
	}

}

function getGames () {

	return this.games
}


function getGameSlots () {
	this.refreshGameSlots()

	return this.gameSlots
}


// internal
function getGameSlotIndex( slotId) {

	if (slotId == undefined) return -1

	this.refreshGameSlots ()

	for (var i=0;i<this.gameSlots.length;i++) {
		if (this.gameSlots[i] == undefined) continue
		if (this.gameSlots[i].id == slotId) break
	}
	if (i < this.gameSlots.length) return i
	return -1
}


function resetGameTurn () {

	return (this.gameTurn = 0)

}

function getConnectionState() {
	return this.connectionState
}

function getToken() {
	return this.token
}

function getPlayerList() {
	return this.playerList
}

function sendChatMessage(chatMessage, Http ) {

  // send chat message to backserver
  let url = 'http://' + serverName + ':8090/api/'

	url += '/chat/' + this.userId + '/' + this.token + '/' + encodeURIComponent (chatMessage)
	console.log ("Trying to send chat Message: " + chatMessage)

	// see: https://github.com/pagekit/vue-resource/blob/develop/docs/http.md  (timeout!!)
	Http.post(url, {userId:this.userId}).then(response => {
		console.log ("Chat message was sent to server")
		this.refreshDataFromServer(Http)
	}, (response) => {
		console.log ("Chat message wasnot sent to server")
	});

}

function copyGameDataFromServer (thisPointer, data) {

	if (data.gameTurn == undefined) return
	thisPointer.gameTurn = data.gameTurn

	// copy reactionList
	thisPointer.reactionList.splice(0, thisPointer.reactionList.length) // empty array
	for (let r in data.reactionList) {
		thisPointer.reactionList.push (JSON.parse(JSON.stringify(data.reactionList[r])))
	}

	// copy choices
	thisPointer.choices.splice(0, thisPointer.choices.length) // empty array
	for (let c in data.choices) {
		thisPointer.choices.push (JSON.parse(JSON.stringify(data.choices[c])))
	}

  // add incremental entries from history
	for (let h in data.historyInc) {
		thisPointer.history.push (JSON.parse(JSON.stringify(data.historyInc[h])))
	}

	// to-do: what about response.data. (userState and world) ?

}

function copyChatDataFromServer (thisPointer, data) {

	if (data.seq == undefined) return
	thisPointer.chatMessagesSeq = data.seq

	console.log ("Chat messages from server: " + JSON.stringify(data.chatMessages))

	//copy chatMessages
	thisPointer.chatMessages.splice(0, thisPointer.chatMessages.length) // empty array
	for (var i=0; i<data.chatMessages.length && i<10;i++) {
		thisPointer.chatMessages [i] = data.chatMessages[i]
	}
}


function copyPlayerListFromServer (thisPointer, data) {

  if (data.logons == undefined) return
	thisPointer.playerListLogons = data.logons

	// copy playerList
  thisPointer.playerList.splice(0, thisPointer.playerList.length) // empty array
	for (let c in data.playerList) {
		thisPointer.playerList.push (JSON.parse(JSON.stringify(data.playerList[c])))
	}

}

function refreshDataFromServer(Http) {

  if (this.connectionState < 0) {
		return
	}

  // get messages back from server
	let url = 'http://' + serverName + ':8090/api/'

	url += '/refresh/' + this.token + '/' + this.chatMessagesSeq + '/' + this.gameTurn + '/' + (this.history==undefined?0:this.history.length) + '/' + this.playerListLogons

	// console.log ("Refreshing data from the server")

	Http.get(url).then(response => {

		if ( response.data.status < 0) {
			console.log ("Connection lost")
			connectionState = -1
			token = undefined
			userId = ""
			return
		}

		copyChatDataFromServer (this, response.data.chat)
    copyGameDataFromServer (this, response.data.gameData)
		copyPlayerListFromServer (this, response.data.players)

		// to-do
		if (response.data.historyInc != undefined) {
			console.log ("historyInc: " + response.data.historyInc.length)
		}

	}, (response) => {
		this.connectionState = -1
		console.log ("Connection Error")
	});

}

function linkChatMessages(chatMessages) {
	 this.chatMessages = chatMessages
}
