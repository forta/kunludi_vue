// const serverName = "www.kunludi.com"
// const serverName = "buitre.ll.iac.es"
// const serverName = "paco-pc"
const serverName = "localhost"

let runner

// to-do:
let runnerCache = {
	world: {},
	userState: {}
}

let games = []

let locale = "xx", language = {}

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

let chatMessagesSeq = 0, gameTurn = 0, playerListLogons = 0, playerListLogoffs = 0

let Http	// attention, vue dependence

let primitives, libReactions, gameReactions

// new attributes cached from runner
let lastAction
let pendingPressKey = false, pressKeyMessage = ""
let reactionListCounter = -1, processedReactionList = []

module.exports = exports = {
	initHttp:initHttp,
	local_loadGame:local_loadGame,
	userLogon:userLogon,
	userLogoff:userLogoff,
	backEnd_LoadGame:backEnd_LoadGame,
	processChoice:processChoice,
	getCurrentChoice:getCurrentChoice,
	getPendingChoice:getPendingChoice,
	getLastAction:getLastAction,
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
	backEnd_loadGames:backEnd_loadGames,
	localData_loadGames:localData_loadGames,
	keyPressed:keyPressed,
	getPendingPressKey: getPendingPressKey,
	getPressKeyMessage: getPressKeyMessage,

	setLocale:setLocale,
	msgResolution:msgResolution,
	getEchoAction:getEchoAction,
	translateGameElement:translateGameElement,
	gTranslator:gTranslator,

	//??
	getGameSlotIndex:getGameSlotIndex,
	refreshGameSlots:refreshGameSlots,
	backEnd_sendChoice:backEnd_sendChoice,
	backEnd_keyPressed:backEnd_keyPressed,
	refreshPeriodicallyDataFromServer:refreshPeriodicallyDataFromServer,
	refreshCache:refreshCache


}

function initHttp(http) {
  this.Http = http
	this.connectionState = 0
}

// important: periodic request to server
function refreshPeriodicallyDataFromServer(thisPointer) {

	this.refreshIntervalId = setInterval(function() {
	  if (thisPointer.connectionState == 1)  thisPointer.refreshDataFromServer(thisPointer.Http)
	}, 1000);
}

function storageON() {

    try {
        localStorage.setItem("__test", "data");
    } catch (e) {
        return false;
    }
    return true;
}

// load game messages in the local language
function setLocale (locale) {

	var libVersion = 'v0_01'

	console.log ("locale: " + locale)

	this.locale = locale

	this.libMessages = require ('../components/libs/' + libVersion + '/localization/' + this.locale + '/messages.json');

	this.language = require ('../components/LudiLanguage.js');
	this.language.setLocale (locale)
	this.langHandler = require ('../components/libs/' + libVersion + '/localization/' + this.locale + '/handler.js');

	console.log ("this.gameId: " + this.gameId)

	if ((this.gameId == "") || (this.gameId == undefined)) return

	// by now, local
	this.gameMessages = require ('../../data/games/' + this.gameId + '/localization/' + this.locale + '/messages.json')
	this.gameExtraMessages = require ('../../data/games/' + this.gameId + '/localization/' + this.locale + '/extraMessages.json')
	this.language.dependsOn (this.libMessages, this.gameMessages, this.gameExtraMessages)

	// devMessages: from runner (locally or remotelly)

	if (this.connectionState == 0) { // devMessages locally

		this.language.devMessages =  this.runner.devMessages


	} else { // devMessages from server

		// send language to server
		let url = 'http://' + serverName + ':8090/api/'

		url += 'setLocale'

		let params = {token:this.token, locale: this.locale}

		this.Http.post(url, {params: params}).then(response => {

			this.language.devMessages = response.data.devMessages

		}, (response) => {
			console.log ("Error posting locale to server")
		});
	}


}

function msgResolution (longMsgId) {
	return this.language.msgResolution (longMsgId)
}

function getEchoAction (choice, isEcho) {

  let outText = ""

	if (choice.choiceId == 'action0') {

		outText = this.translateGameElement("actions", choice.action.actionId)

	}	else if ((choice.choiceId == 'action') || (choice.choiceId == 'action2')) {

		// to-do: each action must have an echo statement in each language!

		if (isEcho) { // echo message
			if (choice.choiceId == 'action') {
				let msg = this.language.msgResolution  (this.language.getLongMsgId ("messages", "Echo_o1_a1", "txt"))
				outText =  this.language.expandParams (msg, {a1: choice.action.actionId, o1: choice.action.item1Id})
			} else {
				let msg = this.language.msgResolution  (this.language.getLongMsgId ("messages", "Echo_o1_a1_o2", "txt"))
				outText = this.language.expandParams (msg, {a1: choice.action.actionId, o1: choice.action.item1Id, o2: choice.action.item2Id})
			}

		} else { // button

			// to-do?: modified as in the Echo?
			if (choice.choiceId == 'action')
				outText = this.translateGameElement("actions", choice.action.actionId)
			else
				outText =  this.translateGameElement("actions", choice.action.actionId) + " -> " + this.translateGameElement("items", choice.action.item2Id, "txt")
		}

	}  else if (choice.choiceId == 'dir1') {
		// show the target only ii it is known
		// console.log	("choice.action??: " + JSON.stringify(choice.action) )

		var txt = this.translateGameElement("directions", choice.action.d1Id, "desc")
		if (choice.action.isKnown) txt += " -> " + this.translateGameElement("items", choice.action.targetId, "txt")
		outText = txt

	}

	let playerSt = ""
	if (isEcho && this.getConnectionState() == 1 && (choice.userId != "") && (choice.userId != undefined)) {
			playerSt = "[" + choice.userId + "] "
	}

	return playerSt + outText
}

function translateGameElement  (type, id, attribute) {

	return this.language.msgResolution (this.language.getLongMsgId (type, id, attribute))

}

function gTranslator (reaction) {

  var expanded = ""

	//console.log	("gTranslator.reaction: " + JSON.stringify(reaction) )
	// if not as is
	let longMsg = {}

	if (
		(reaction.type == "rt_msg") || (reaction.type == "rt_graph") ||
		(reaction.type == "rt_quote_begin") || (reaction.type == "rt_quote_continues") ||
		(reaction.type == "rt_play_audio") ||
		(reaction.type == "rt_end_game") ||
		(reaction.type == "rt_dev_msg") ||
		(reaction.type == "rt_press_key")
	) {
		longMsg = {type:'messages', id:reaction.txt, attribute:'txt'}
	} else if (reaction.type == "rt_desc") {
		longMsg.type = "items"
		longMsg.id = reaction.o1Id
		console.log("rt_desc.o1Id: o1 " + reaction.o1 + " -> o1Id: " + reaction.o1Id + "!!!!!!!!!!!!")
		longMsg.attribute = "desc"
	} else if (reaction.type == "rt_item") {
		longMsg.type = "items"
		longMsg.id = reaction.o1Id
		console.log("rt_item.o1Id: o1 " + reaction.o1 + " -> o1Id: " + reaction.o1Id + "!!!!!!!!!!!!")
		longMsg.attribute = "txt"
	} else {
		return {type:'text', txt: "gTranslator:[" + JSON.stringify(reaction) + "]"}
	}

	var longMsgId = longMsg.type + "." + longMsg.id + "." + longMsg.attribute

  // hardcoded translation available
	if (reaction.type == "rt_dev_msg") {
		if (this.gameMessages [longMsgId] == undefined) {
	 		this.gameMessages [longMsgId] = {message:reaction.detail}
	 	}
		return ""
	}

	expanded = this.msgResolution (longMsgId)

	if (expanded == "") {
		if (reaction.txt == undefined)
			expanded = "[" + longMsgId + "]"
		else
			expanded = "[" + reaction.txt + "]"
	}

	if (expanded == "[]") expanded = ""

	if (reaction.type == "rt_graph") {

	// to-do: parameters: by now, only one parameter to expand the text
		if (reaction.param != undefined)
			expanded = this.language.expandParams (expanded,  {o1: reaction.param[0]})

		return {type:'img', src:reaction.url, isLocal:reaction.isLocal, isLink:reaction.isLink, txt: expanded }

	} else if ((reaction.type == "rt_quote_begin") || (reaction.type == "rt_quote_continues")) {

		// dirty trick (to-do)
		expanded = this.language.expandParams (expanded,  {o1: reaction.param[0]})

		var itemExpanded = this.msgResolution ("items." + reaction.item + ".txt")
		if (itemExpanded == "") itemExpanded = reaction.item // in case of not defined

		return {type:'text', txt: ((reaction.type == "rt_quote_begin")? "<br/><b>" + itemExpanded + "</b>: «": "" ) + expanded + ((reaction.last) ? "»" : "") }
	} else if (reaction.type == "rt_play_audio") {
		// to-do
		return {type:'text', txt: expanded + " (play: " + reaction.fileName + " autoStart: " + reaction.autoStart + ")"}

	} else if (reaction.type == "rt_end_game") {
		if (expanded == "") expanded = "End of game"

		// it was: state.choice = {choiceId:'quit', action:{actionId:''}, isLeafe:true}
		this.choice = {choiceId:'quit', action:{actionId:''}, isLeafe:true}
	} else if (reaction.type == "rt_press_key")  {

		if (!reaction.alreadyPressed) {
			this.pendingPressKey = true
			this.pressKeyMessage = expanded
			/* it was:
			state.pendingPressKey = true
			state.pressKeyMessage = expanded
			*/
		}
		expanded = "[...]<br/>"
	}

	expanded = this.language.expandParams (expanded, reaction.param)

	return {type:'text', txt: expanded  }
}

function userLogon (userId) {

	let url = 'http://' + serverName + ':8090/api/'

	url += 'users/' + userId + '/logon/' + (this.locale==undefined?"0":this.locale) // to-do
	this.connectionState = -1 // initial state
	this.userId = userId

	// ask for user session
	this.Http.get(url).then((response) => {

			if (response.data.status < 0) {
				this.connectionState = 0
				this.userId = ''
				console.log ("Logon error: " + response.data.errorMsg)
				return
			}

			this.connectionState = 1
			this.token = response.data.token
			this.playerList = response.data.playerList
			this.chatMessagesSeq = 0
			this.gameTurn = 0
			this.playerListLogons = this.playerListLogoffs = 0


			// periodically refreshing
			this.refreshPeriodicallyDataFromServer(this)


		}, (response) => {
			// this.connectionState = -2 //error
			this.connectionState = 0
			this.userId = ''
			console.log ("User not logged on.")
		});


}

function userLogoff () {

	clearInterval(this.refreshIntervalId);

	alert ("nos vamos")

	let url = 'http://' + serverName + ':8090/api/'

	url += 'users/' + this.token + '/logoff'
	this.connectionState = -1 // initial state
	this.userId = ""
	this.chatMessagesSeq = this.gameTurn = 0
	this.playerListLogons = this.playerListLogoffs = 0

		this.Http.post(url).then(response => {
			console.log ("Logoff request was sent to server")
			this.refreshDataFromServer(Http)
		}, (response) => {
			// error, but it doesn't matter
		});

}

function localData_loadGames () {

	let gamesData = require ('../../data/games.json');

	this.games = gamesData.games

	// load all about files from all games
	for (let i=0; i<this.games.length;i++) {
		try {
			this.games[i].about = require ('../../data/games/' + this.games[i].name + '/about.json');
		}
		catch(err) {
			this.games[i].about = {
				"ludi_id": "1",
				"name": this.games[i].name,
				"translation": [
					{
						"language": this.locale,
						"title": "[" + this.games[i].name +"]",
						"desc": "??",
						"introduction": "??",
						"author": {
							"name": "??",
							"ludi_account": "??",
							"email": "??"
						}
					}
				]
			}

		}

	}
}

function backEnd_loadGames () {

	let url = 'http://' + serverName + ':8090/api/'

	url += 'games/' + this.token

	this.Http.get(url).then((response) => {

		if ( response.data.status < 0) {
			console.log ("The game list was not loaded. " + response.data.msgServer)
			this.games = []
			return
		}

		this.games = response.data

	}, (response) => {
		console.log ("missed game list")
	});

}

function backEnd_LoadGame (gameId ) {

	let url = 'http://' + serverName + ':8090/api/'

	url += 'game/' + gameId + '/load/' + this.token
	this.connectionState = -1 // initial state
	this.reactionList = []
	this.gameId = gameId

	this.runnerCache = {
		world: {},
		userState: {}
	}

	// ask for game session
	this.Http.get(url).then((response) => {

		  if ( response.data.status < 0) {
				this.connectionState = -2 //error
				console.log ("The game was not loaded")
				this.gameId= ''
				return
			}

			// first at all: devMessages
			this.language.devMessages = response.data.devMessages

			this.processedReactionList = response.data.reactionList
			this.choices = response.data.choices
			this.currentChoice = response.data.currentChoice

			this.runnerCache.userState = response.data.userState
			this.runnerCache.world = response.data.world

			if (response.data.gameTurn == undefined) this.gameTurn = 0;
			else this.gameTurn = response.data.gameTurn

			this.reactionListCounter = response.data.reactionListCounter

			this.history = response.data.history.slice()

			this.lastAction = response.data.lastAction
			this.pendingPressKey = response.data.pendingPressKey
			this.pendingChoice = response.data.pendingChoice

			this.reactionListCounter = response.data.reactionListCounter

			this.menu = response.data.menu
			this.menuPiece = response.data.menuPiece

			this.connectionState = 1


		}, (response) => {
			this.connectionState = -2 /error
			console.log ("The game was not loaded")
		});


}

function backEnd_keyPressed () {
	let url = 'http://' + serverName + ':8090/api/'

	url += 'keyPressed'
	let params = {token: this.token, myGameTurn:this.gameTurn }

	this.Http.post(url, {params: params}).then((response) => {

		if (response.data.status < 0) {
			console.log ("Connection lost")
			token = undefined
			userId = ""
			connectionState = -1
		}

		copyGameChoicesFromServer (this, response.data)
		copyGameDataFromServer (this, response.data)

	}, (response) => {
		console.log ("missed game reaction")
	});

}

function backEnd_sendChoice (choice, optionMsg ) {

  this.currentChoice = choice

	let url = 'http://' + serverName + ':8090/api/'

   // game actions
	 if ( (choice.choiceId == "action0") ||
			 (choice.choiceId == "dir1") ||
			 (choice.choiceId == "action") ||
			 (choice.choiceId == "action2") ) {

	 		url += 'gameAction'
			let params = {token: this.token, choice: choice, myGameTurn: this.gameTurn, optionMsg:optionMsg}

			// see: https://github.com/pagekit/vue-resource/blob/develop/docs/http.md  (timeout!!)
			this.Http.post(url, {params: params}).then((response) => {

				if (response.data.status < 0) {
					console.log ("Connection lost")
					token = undefined
					userId = ""
					connectionState = -1
				}

				copyGameChoicesFromServer (this, response.data)
				copyGameDataFromServer (this, response.data)

			}, (response) => {
				console.log ("missed game reaction")
			});

			return
		}

		if ( (choice.choiceId == "top") ||
		     (choice.choiceId == "directActions") ||
				 (choice.choiceId == "directionGroup") ||
				 (choice.choiceId == "obj1") ||
				 (choice.choiceId == "itemGroup" ) ) {

		 url += 'choice/' + choice.choiceId + '/' + this.token + '/'

		 // extra parameter
		 if (choice.choiceId == "itemGroup" )
 			 url += choice.itemGroup
		 else if (choice.choiceId == "obj1" )
 			url += choice.item1
 		 else  url += "0"

			if (url != "") {
				this.Http.get(url).then((response) => {

					if (response.data.status < 0) {
						console.log ("Connection lost")
						token = undefined
						userId = ""
						connectionState = -1
					}

		      copyGameChoicesFromServer (this, response.data)

				}, (response) => {
					console.log ("missed game reaction")
				});
			}

			return

	}

	console.log ("Unknown game choice")

}

function refreshCache () {

	this.currentChoice = this.runner.getCurrentChoice()

  if (this.language != undefined) {
		if (this.language.devMessages == undefined) {
			this.language.devMessages = this.runner.devMessages
		}
	}

	this.processedReactionList = this.runner.processedReactionList.slice()

	// runnerProxie.updateChoices()
	this.choices = this.runner.choices
	this.gameTurn = this.runner.getGameTurn()
	// this.gameState = runnerProxie.getGameState()
	this.history = this.runner.history
	this.pendingChoice = this.runner.pendingChoice
	this.pendingPressKey = this.runner.pendingPressKey
	// this.pressKeyMessage =  msgResolution ("messages." + runner.pressKeyMessage + ".desc")
	// to-do: internal game messages are not expanded
	if (this.pressKeyMessage  == "") this.pressKeyMessage  = this.runner.pressKeyMessage
	this.lastAction = this.runner.lastAction
	this.menu = this.runner.menu.slice()
	this.menuPiece = this.runner.menuPiece
}


function processChoice (choice, optionMsg) {

	if (this.connectionState == 0) {

		this.runner.processChoice (choice, optionMsg)
		this.refreshCache ()

	} else {

		// adding who makes the action
    let choiceWithUser = choice
		choiceWithUser.userId = this.userId

		this.backEnd_sendChoice (choiceWithUser, optionMsg)
	}

}

function getPendingPressKey() {

	if (this.connectionState == 0) {
			return	this.runner.pendingPressKey
	} else {
		// from cached value
		return this.pendingPressKey
	}
}


function getPressKeyMessage () {
	if (this.connectionState == 0) {
			return	this.runner.pressKeyMessage
	} else {
		// from cached value
		return this.pressKeyMessage
	}

}

function keyPressed () {

  if (this.connectionState == 0) {
		this.runner.keyPressed()
		this.refreshCache ()
	} else {
    this.backEnd_keyPressed ()
	}
}

function getCurrentChoice() {

	// it is supposed refreshed from runner or the backfront
	return this.currentChoice
}

function getPendingChoice() {

	// it is supposed refreshed from runner or the backfront
	return this.pendingChoice
}


function getLastAction() {

	// it is supposed refreshed from runner or the backfront
  return this.lastAction

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

	// from cached value
	if (this.processedReactionList == undefined) this.processedReactionList = []

  for (let r in this.processedReactionList) {
    let reaction = this.processedReactionList[r]
		if (reaction.type == "rt_dev_msg") {

			let longMsgId = "messages." + reaction.txt + ".txt"

			// show json line to add in the console

			var line = "DEV MSG:\n," ;
			line += "\t\"" + longMsgId + "\": {\n" ;
			line += "\t\t\"" + "message\": \"" + reaction.detail + "\"\n" ;
			line += "\t}";
			console.log(line);

			// if dev msg not exists, add in memory
			if (this.gameMessages [longMsgId] == undefined) {
				this.gameMessages [longMsgId] = {message:reaction.detail}
			}
		}

	}

	return this.processedReactionList.slice()
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
	this.history = history.slice()
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
			history: this.history.slice(),
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

function local_loadGame (gameId, primitives, libReactions, gameReactions, libWorld, gameWorld0) {

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

	this.runner.dependsOn(primitives, libReactions, gameReactions, this.reactionList)

	this.connectionState = 0

	this.gameTurn = 0

	// first description
  this.processChoice ( { choiceId:'action0', action: {actionId:'look'}, isLeafe:true, noEcho:true} )

}

function loadGameState (slotId, showIntro) {

	if (this.connectionState == 0) { // to-do: by now, only local game slots

		if (!storageON()) return

		// necessary to refresh data
		this.refreshGameSlots ()

		var i = this.getGameSlotIndex(slotId)
		if (i<0) {
			console.log ("Game not loaded!. Slot: " + slotId)
		} else {
			this.runner.world = this.gameSlots[i].world
			this.history = this.gameSlots[i].history.slice()
			this.gameTurn = this.gameSlots[i].gameTurn
			this.runner.userState = this.gameSlots[i].userState
			console.log ("Game loaded!. Slot: " + slotId)
		}

		// refreshing dependences
		this.primitives.dependsOn(this.runner.world, this.reactionList, this.runner.userState )

		// show intro, after default game slot
		if ( (slotId == "default") && (showIntro == undefined) ) {
			this.currentChoice = { choiceId:'action0', action: {actionId:'look'}, isLeafe:true}
		} else {
			this.currentChoice = 	{choiceId:'top', isLeafe:false, parent:''}
		}

		this.processChoice(this.currentChoice)

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

// send chat message to backserver
function sendChatMessage(chatMessage) {

  let url = 'http://' + serverName + ':8090/api/'
	url += '/chat' // + '/' + this.userId + '/' + this.token + '/' + encodeURIComponent (chatMessage)

  let params = {userId:this.userId, token:this.token, chatMessage: chatMessage}

	this.Http.post(url, {params: params}).then(response => {
		// do nothing
	}, (response) => {
		console.log ("Chat message was not sent to server")
	});

}

function logedOffFromServer (thisPointer) {
		console.log ("Connection lost")
		thisPointer.connectionState = -1
		thisPointer.token = undefined
		thisPointer.userId = ""
}

function copyGameChoicesFromServer (thisPointer, data) {

	// copy choices
	if (thisPointer.choices.length>0) {
		thisPointer.choices.splice(0, thisPointer.choices.length) // empty array
	}
	for (let c in data.choices) {
		thisPointer.choices.push (JSON.parse(JSON.stringify(data.choices[c])))
	}

}

function copyGameDataFromServer (thisPointer, data) {

	if (data.gameTurn == undefined) return
	thisPointer.gameTurn = data.gameTurn

	// copy reactionList
	if (thisPointer.processedReactionList!= undefined) {
		if (thisPointer.processedReactionList.length>0) {
			thisPointer.processedReactionList.splice(0, thisPointer.processedReactionList.length) // empty array
		}
		for (let r in data.reactionList) {
			thisPointer.processedReactionList.push (JSON.parse(JSON.stringify(data.reactionList[r])))
		}
	}

  // add incremental entries from history
	if ( data.historyInc!= undefined) {
		console.log ("Increment history by " + data.historyInc.length)
		if (thisPointer.getHistory() == undefined) {
			thisPointer.history = []
		}
		for (let h in data.historyInc) {
			thisPointer.history.push (JSON.parse(JSON.stringify(data.historyInc[h])))
		}
	}

  if (thisPointer.language != undefined) {
		thisPointer.language.devMessages = data.devMessages
	}

	thisPointer.currentChoice = data.currentChoice
	thisPointer.lastAction = data.lastAction
	thisPointer.pendingPressKey = data.pendingPressKey
	thisPointer.pendingChoice = data.pendingChoice
	thisPointer.pressKeyMessage = data.pressKeyMessage
	thisPointer.reactionListCounter = data.reactionListCounter

	thisPointer.devMessages == data.devMessages

	thisPointer.menu = data.menu
	thisPointer.menuPiece = data.menuPiece

	// to-do: what about response.data. (userState and world) ?

}

function copyChatDataFromServer (thisPointer, data) {

	if (data.seq == undefined) return
	thisPointer.chatMessagesSeq = data.seq

	console.log ("Chat messages from server: " + JSON.stringify(data.chatMessages))

	//copy chatMessages
	if (thisPointer.chatMessages != undefined ) {
		thisPointer.chatMessages.splice(0, thisPointer.chatMessages.length) // empty array
		for (var i=0; i<data.chatMessages.length && i<10;i++) {
			thisPointer.chatMessages [i] = data.chatMessages[i]
		}
	}
}


function copyPlayerListFromServer (thisPointer, data) {

  if ((data.logons == undefined) || (data.logoffs == undefined) )  return
	thisPointer.playerListLogons = data.logons
	thisPointer.playerListLogoffs = data.logoffs

	// copy playerList
  thisPointer.playerList.splice(0, thisPointer.playerList.length) // empty array
	for (let c in data.playerList) {
		thisPointer.playerList.push (JSON.parse(JSON.stringify(data.playerList[c])))
	}

}

function refreshDataFromServer(Http) {

  if (this.connectionState <= 0) {
		return
	}

  // get messages back from server
	let url = 'http://' + serverName + ':8090/api/'

	url += '/refresh/' + this.token + '/' + this.chatMessagesSeq + '/' + this.gameTurn +  '/' + this.reactionListCounter + '/' + this.playerListLogons + '/' + this.playerListLogoffs

	// console.log ("Refreshing data from the server")

	Http.get(url).then(response => {

		if ( response.data.status < 0) {
			logedOffFromServer(this)
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
