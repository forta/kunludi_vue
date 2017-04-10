import Vue from 'vue'

import VueResource from 'vue-resource'

import Vuex from 'vuex'

Vue.use(Vuex)

Vue.use(VueResource)
// ?: Vue.http.options.emulateJSON = true

//game engine
const runnerProxie = require ('../components/RunnerProxie.js');

const Http=Vue.http // Http instead of this.$http.get(url).then((response) => {

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function storageON() {
    try {
        localStorage.setItem("__test", "data");
    } catch (e) {
        return false;
    }
    return true;
}

function reactionListContains_Type (reactionList, type) {

	for (let r in reactionList) {
		if (reactionList[r].type == type) return true
	}

	return false

}

function msgResolution (longMsgId) { // to-do: it's repeated code which is in the language module

	var expanded = ""

	if (state.gameMessages  != undefined) {
		if (state.gameMessages [longMsgId] != undefined) expanded = state.gameMessages [longMsgId].message
	}
	if ((expanded == "") && (state.libMessages  != undefined)) {
		if (state.libMessages [longMsgId] != undefined) expanded = state.libMessages [longMsgId].message
	}

	return expanded
}

function refreshDataFromServer(runnerProxie) {

  setInterval(function() {

    {
      // console.log ("Get data from runnerProxie")

      state.playerList = runnerProxie.getPlayerList ()
      if (state.gameId == "") state.games = runnerProxie.getGames ()
      else {
        state.history = runnerProxie.getHistory()
        state.choices = runnerProxie.getChoices ()
        state.gameTurn = runnerProxie.getGameTurn ()
      }

      if (runnerProxie.getConnectionState() < 0) {
        if (state.userId != "") {
          state.userId = ""
          state.userSession = 'anonymous'
          alert ("Connection lost with server")
        }
      }

      if ((state.chatMessagesInternal.length > 0) && (state.chatMessagesState != state.chatMessagesInternal[0].seq)) {
        state.chatMessagesState = state.chatMessages[0].seq
        state.chatMessages = state.chatMessagesInternal.slice()
        console.log ("State of chatMessages: " +  state.chatMessages[0].seq)
      }

    }

  }, 10000);
}

function localData_loadGames () {

	let gamesData = require ('../../data/games.json');

	state.games = gamesData.games

	// load all about files from all games
	for (let i=0; i<state.games.length;i++) {
		try {
			state.games[i].about = require ('../../data/games/' + state.games[i].name + '/about.json');
		}
		catch(err) {
			state.games[i].about = {
				"ludi_id": "1",
				"name": state.games[i].name,
				"translation": [
					{
						"language": state.locale,
						"title": "[" + state.games[i].name +"]",
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


function processChoice (state, choice) {

	if (state.choice.choiceId == 'quit') return

	state.choice = choice
	state.menu = []

	var optionMsg
	if (choice.isLeafe) {
		console.log ("actionDump: {userSession:'" + state.userSession + "', action: {" +  JSON.stringify(choice.action) + "}" )

		state.pendingChoice = choice
		optionMsg = choice.action.msg
	}

	// processing choices or game actions (leave choices)
	runnerProxie.processChoice (choice, optionMsg)

	afterProcessChoice (choice, optionMsg)

	if (state.userId == '') {
		state.choice = runnerProxie.getCurrentChoice()
		runnerProxie.updateChoices()
		state.choices = runnerProxie.getChoices ()
		state.gameTurn = runnerProxie.getGameTurn ()
		state.gameState = runnerProxie.getGameState()
	}

}

function afterProcessChoice (choice, optionMsg) {

	// show chosen option
	// to-do: send parameters to kernel messages
	if (optionMsg != undefined) {
		// option echo
		state.reactionList.unshift ({type:"rt_asis", txt: "<br/><br/>"} )
		state.reactionList.unshift ({type:"rt_msg", txt:  optionMsg } )
		state.reactionList.unshift ({type:"rt_asis", txt: ": " } )

		state.reactionList.unshift ({type:"rt_kernel_msg", txt: "Chosen option"} )

	}

	// add reactions to history
	if (choice.isLeafe) {
		state.history.push ({ gameTurn: state.gameTurn, action: choice, reactionList: [] })
		processingRemainingReactions ();
	}

}

function processingRemainingReactions () {

	// expand dyn reactions
	let forkedReactionList = runnerProxie.expandDynReactions(state.reactionList)

	// empty state.reactionList
	state.reactionList.splice(0,state.reactionList.length)

	// copy expanded into state.reactionList
	for (var i=0;i<forkedReactionList.expandedReactionList.length;i++) {
		state.reactionList.push (forkedReactionList.expandedReactionList[i])

		// to-do: tricky by now, avoiding anything after a menu submission
		if (forkedReactionList.expandedReactionList[i].type == 'rt_show_menu')
			break;
	}

	// add already shown reactions to history
	for (var i in state.reactionList) {
		state.history[state.history.length-1].reactionList.push (state.reactionList[i])
	}

	// empty state.reactionList
	state.reactionList.splice(0,state.reactionList.length)

	// copy pendingReactionlist into state.reactionList
	for (var i=0;i<forkedReactionList.pendingReactionlist.length;i++) {
		state.reactionList.push (forkedReactionList.pendingReactionlist[i])
	}

	if (state.pendingPressKey) {
		state.pendingPressKey = false
	}

}



const state = {
	games: [
	],
	gameTurn: 0,
	gameState : {},
	userId: '', // kune
  playerList: [],
	userSession: 'anonymous',
	locale: '', // lingvo /here!!!
	gameId: '', // ludi
	i18n:[],
	history: [ ],
	gameSlots: [],
	choices: [],
	choice: {choiceId:'top', isLeafe:false, parent:''} ,
	pendingChoice: {},
  pendingPressKey: false,
	pressKeyMessage: '',
	menu: [],
  menuPiece: '',
	reactionList: [],
	gameAbout: {},
	languages: { all: [], pref: [], other: []},
	lib: {
		primitives: {},
		reactions:{}
	},
  chatMessages: [],
  chatMessagesInternal: [],
  chatMessagesState: 0,
	game: {	},
	kTranslator: function (kMsg) {
		if (state.locale == "") {
			// set default language and load kernel messages
			// attention: using window object
			if (["es", "en", "eo", "fr"].indexOf(window.navigator.language) >=0)
				mutations.SETLOCALE(state, window.navigator.language);
			else
				mutations.SETLOCALE(state, 'en');
		}

		if (state.locale != "") {
			state.i18n [state.locale]
			if (state.i18n [state.locale] != undefined) {
				if (state.i18n[state.locale][kMsg] != undefined) {
					return state.i18n[state.locale][kMsg].message
				}
			}
		}
		return "*" + kMsg + "*"
	},

	getEcho: function (choice, isEcho) {

		if ((choice.noEcho != undefined) && (choice.noEcho)) {
			return ""
		}

		// console.log	("getEcho.choice: " + JSON.stringify(choice) )

		// general kernel messages
		if (choice.choiceId == 'top') return state.kTranslator("mainChoices_" + choice.choiceId)
		else if (choice.choiceId == 'itemGroup') return state.kTranslator("mainChoices_" +  choice.itemGroup) + "(" + choice.count + ")"
		else if (choice.choiceId == 'directActions') return state.kTranslator("mainChoices_" + choice.choiceId) + "(" + choice.count + ")"
		else if (choice.choiceId == 'directionGroup') return state.kTranslator("mainChoices_" + choice.choiceId) + "(" + choice.count + ")"

		// game elements

		else if (choice.choiceId == 'action0') {

     let player = ""
       if (isEcho && runnerProxie.getConnectionState() == 1 && (choice.userId != undefined)) player = choice.userId

      return player + state.translateGameElement("actions", choice.action.actionId)

    }	else if ((choice.choiceId == 'action') || (choice.choiceId == 'action2')) {

			// to-do: each action must have an echo statement in each language!

			if (isEcho) { // echo message
				if (choice.choiceId == 'action') {
					let msg = state.language.getMessageFromLongMsgId  (state.language.getLongMsgId ("messages", "Echo_o1_a1", "txt"))
					return state.language.expandParams (msg, {a1: choice.action.actionId, o1: choice.action.item1Id})
				} else {
					let msg = state.language.getMessageFromLongMsgId  (state.language.getLongMsgId ("messages", "Echo_o1_a1_o2", "txt"))
					return state.language.expandParams (msg, {a1: choice.action.actionId, o1: choice.action.item1Id, o2: choice.action.item2Id})
				}

			} else { // button

				// to-do?: modified as in the Echo?
				if (choice.choiceId == 'action')
					return state.translateGameElement("actions", choice.action.actionId)
				else
					return state.translateGameElement("actions", choice.action.actionId) + " -> " + state.translateGameElement("items", choice.action.item2Id, "txt")
			}

		} else if (choice.choiceId == 'obj1') {

			return state.language.expandParams ("%o1", {o1: choice.item1Id})
			// return state.translateGameElement("items", choice.item1, "txt") // to-do: will we rewrite state.translateGameElement using state.language.expandParams ??

		} else if (choice.choiceId == 'dir1') {
			// show the target only ii it is known
			// console.log	("choice.action??: " + JSON.stringify(choice.action) )

			var txt = state.translateGameElement("directions", choice.action.d1Id, "txt")
			if (choice.action.isKnown) txt += " -> " + state.translateGameElement("items", choice.action.targetId, "txt")
			return txt

		}

		return ""
	},

	gTranslator: function (reaction) {

		if (reaction.type == "rt_refresh") {
			// do nothing
			return {type:'text', txt:""}
		}

		if (reaction.type == "rt_kernel_msg") {
			return {type:'text', txt:state.kTranslator (reaction.txt)}
		}

		state.menu = []

		var expanded = ""

		//console.log	("gTranslator.reaction: " + JSON.stringify(reaction) )

		if (reaction.type == "rt_asis") {
			return {type:'text', txt:reaction.txt}
		}

		// if not as is
		let longMsg = {}

		if (
			(reaction.type == "rt_msg") || (reaction.type == "rt_graph") ||
			(reaction.type == "rt_quote_begin") || (reaction.type == "rt_quote_continues") ||
			(reaction.type == "rt_play_audio") ||
			(reaction.type == "rt_dev_msg") ||
			(reaction.type == "rt_end_game") ||
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
		} else if (reaction.type == "rt_show_menu") {
			state.menu = reaction.menu
			state.menuPiece = reaction.menuPiece
			return
		} else {
			return {type:'text', txt: "gTranslator:[" + JSON.stringify(reaction) + "]"}
		}

		// if static:
		var longMsgId = longMsg.type + "." + longMsg.id + "." + longMsg.attribute

		expanded = msgResolution (longMsgId)

		// if dev msg not exists, show json line to add in the console
		if (reaction.type == "rt_dev_msg") {
			if (expanded == "") {
				/*
				var line = "DEV MSG:\n," ;
				line += "\t\"" + "messages."+ reaction.txt + ".txt\": {\n" ;
				line += "\t\t\"" + "message\": \"" + reaction.detail + "\"\n" ;
				line += "\t}";
				console.log(line);
				*/

				// add in memory
				state.gameMessages ["messages." + reaction.txt + ".txt"] = {message:reaction.detail}
			}
			return
		}

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
				expanded = state.language.expandParams (expanded,  {o1: reaction.param[0]})

			return {type:'img', src:reaction.url, isLocal:reaction.isLocal, isLink:reaction.isLink, txt: expanded }

		} else if ((reaction.type == "rt_quote_begin") || (reaction.type == "rt_quote_continues")) {

			// dirty trick (to-do)
			expanded = state.language.expandParams (expanded,  {o1: reaction.param[0]})

			var itemExpanded = msgResolution ("items." + reaction.item + ".txt")
			if (itemExpanded == "") itemExpanded = reaction.item // in case of not defined

			return {type:'text', txt: ((reaction.type == "rt_quote_begin")? "<br/><b>" + itemExpanded + "</b>: «": "" ) + expanded + ((reaction.last) ? "»" : "") }
		} else if (reaction.type == "rt_play_audio") {
			// to-do
			return {type:'text', txt: expanded + " (play: " + reaction.fileName + " autoStart: " + reaction.autoStart + ")"}

		} else if (reaction.type == "rt_end_game") {
			if (expanded == "") expanded = "End of game"
			state.choice = {choiceId:'quit', action:{actionId:''}, isLeafe:true}
		} else if (reaction.type == "rt_press_key")  {

			if (!reaction.alreadyPressed) {
				state.pendingPressKey = true
				state.pressKeyMessage = expanded
			}
			expanded = "[...]<br/>"
		}

		expanded = state.language.expandParams (expanded, reaction.param)

		return {type:'text', txt: expanded  }
	},

	translateGameElement: function (type, index, attribute) {

		return state.language.getMessageFromLongMsgId (state.language.getLongMsgId (type, index, attribute))

	}

}

function localData_loadData (gameId) {

	var libVersion = 'v0_01'

	// code
	var primitives = require ('../components/libs/' + libVersion + '/primitives.js');
	var libReactions = require ('../components/libs/' + libVersion + '/libReactions.js');
	var gameReactions = require ('../../data/games/' + gameId + '/gReactions.js');
	var langHandel = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/handler.js');

	// world
	var libWorld = require ('../components/libs/' + libVersion + '/world.json');
	var gameWorld0 =  require ('../../data/games/' + gameId + '/world.json')

	// load explicit data to the local engine
	runnerProxie.loadLocalData (gameId, primitives, libReactions, gameReactions, libWorld, gameWorld0 )

	if (runnerProxie.getConnectionState() == 0) return true

	return false


}


function cleanHistory () {

	state.history = []

	state.history.push ( {
		action: { choiceId:'action0', action : {actionId:'look'}, noEcho:true},
		reactionList: [
			//{ type: 'rt_msg', txt: 'Introduction' },
			// { type: 'rt_press_key', txt: 'press_key_to_start' }
		]
	})

	state.gameTurn = runnerProxie.resetGameTurn()
	runnerProxie.setHistory(state.history )
	state.pendingChoice = {}
}

function afterUserLogged(userId) {
  state.userId = userId
  state.userSession =  runnerProxie.getToken()
  state.playerList = runnerProxie.getPlayerList ()
  if (storageON()) localStorage.ludi_userId = userId

  runnerProxie.loadGames (Http)

  state.chatMessages = [
      {seq:1, from: 'demo-user', msg:'Mensaje de demo.', new:true},
      {seq:0, from: 'System', msg:'Bienvenido a KunLudi. En esta sección verás los mensajes de los otros jugadores.', new:true}
  ]
  state.chatMessagesInternal = []
  state.chatMessagesState = 0

  runnerProxie.linkChatMessages (state.chatMessagesInternal)

}

function afterGameLoaded(slotId) {

  if (runnerProxie.getConnectionState() < 0) {
    alert ("http error: token error?");
    mutations.RESETGAMEID(state)
    return
  }

	state.gameTurn = runnerProxie.getGameTurn ()
	state.gameState = runnerProxie.getGameState ()

	if (state.gameState.PC < 0) {
		// error
		alert ("http error");
		mutations.RESETGAMEID(state)
		return
	}

	runnerProxie.updateChoices()

	state.choices = runnerProxie.getChoices ()
	state.reactionList = runnerProxie.getReactionList ()
	state.menu = runnerProxie.getMenu () //?.slice()
	state.menuPiece = runnerProxie.getMenuPiece () //?.slice()
	runnerProxie.setHistory(state.history )

	runnerProxie.saveGameState (slotId)
	state.gameSlots = runnerProxie.getGameSlots ()

	if (slotId == "default") {
		processChoice (state, { choiceId:'action0', action: {actionId:'look'}, isLeafe:true, noEcho:true} )
	}

}


const mutations = {
  RESETUSERID (state) {
    if (state.gameId != "") {
        alert ("[You will loose your current game state.]")
        mutations.RESETGAMEID (state)
    }

    runnerProxie.userLogoff (Http)

    state.userId= ''
	  state.userSession = 'anonymous'


	  if (storageON()) localStorage.removeItem("ludi_userId")
  },
  SETUSERID (state, userId) {

    if (state.gameId != "") {
        alert ("[You will loose your current game state.]")
        mutations.RESETGAMEID (state)
    }
	  // user session
		runnerProxie.userLogon (userId, Http)

    // wait for several seconds till the game were loaded
		setTimeout(function () {
			if (runnerProxie.getConnectionState() != -1) {
				if (runnerProxie.getConnectionState() == 1) {

          // launch periodic request
          refreshDataFromServer(runnerProxie)

					afterUserLogged(userId)
				}
			}
		}, 3000);

  },
  SETGAMEID (state, gameId, slotId, newlocale) {

	var libVersion = 'v0_01'

	console.log ("state.locale: " + state.locale)
	console.log ("Slot: " + slotId)

	let l;
	let t = state.gameAbout.translation;
	for (l=0; l < t.length; l++) {
		if (t[l].language == state.locale) break;
	}
	if 	(newlocale != state.locale) {
		// load new locale
		mutations.SETLOCALE (state, newlocale)
	}

    state.gameId = gameId

	// languages

	let oldLanguages = state.languages
	let languagesInGame = []
	for (let i=0;i<state.gameAbout.translation.length;i++) {
		languagesInGame.push (state.gameAbout.translation[i].language)
	}
	state.languages = oldLanguages
	state.languages.inGame = languagesInGame


	var gameIndex = arrayObjectIndexOf (state.games, "name", gameId)
	state.gameAbout = state.games[gameIndex].about

	// language code (always local)
	state.language = require ('../components/LudiLanguage.js');
	state.langHandler = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/handler.js');

	// cleaning previous game data
	cleanHistory()

	// messages (always local)
	state.libMessages = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/messages.json');
	state.gameMessages = require ('../../data/games/' + gameId + '/localization/' + state.locale + '/messages.json')
	state.gameExtraMessages = require ('../../data/games/' + gameId + '/localization/' + state.locale + '/extraMessages.json')
	state.language.dependsOn (state.libMessages, state.gameMessages, state.gameExtraMessages)
	state.language.setLocale (state.locale)

	// here!!
	// to-do: timeout message

	if (state.userId == '') { // local engine
		localData_loadData (gameId)
		afterGameLoaded(slotId)
	} else {

		// remote engine using REST calls
		runnerProxie.connectToGame (gameId, Http)

		// wait for several seconds till the game were loaded
		setTimeout(function () {
			if (runnerProxie.getConnectionState() != -1) {
				if (runnerProxie.getConnectionState() == 1) {
					// game loaded
					state.reactionList = runnerProxie.getReactionList ()
					state.choices = runnerProxie.getChoices ()
					state.gameTurn = runnerProxie.getGameTurn ()
					state.gameState = runnerProxie.getGameState ()

					afterGameLoaded(slotId)
				}
			}
		}, 3000);

	}

  },

  SET_PENDING_CHOICE (state, choice) {
	   state.menu = [] // reset
	   processChoice (state, choice)
  },
  SEND_CHAT_MESSAGE (state, chatMessage) {

   console.log ("here")
    runnerProxie.sendChatMessage (chatMessage, Http)

	},
  SET_KEY_PRESSED (state) {
	processingRemainingReactions()
  },
  PROCESS_CHOICE (state, choice) {
	   processChoice (state, choice)
  },
  RESETGAMEID (state) {
    state.gameId= ''
    state.about= {}
	mutations.SETLOCALE (state, state.locale)

	// force change
	let oldLanguages = state.languages
	state.languages = oldLanguages
	state.languages.inGame = undefined

	cleanHistory()

  },

  LOADGAMES (state, par) { // par: filter

	// server calls if session active
	if (state.userId != '') {
    runnerProxie.loadGames (Http)
	} else {
		localData_loadGames ()
	}
  },
  SAVE_GAME_STATE (state, slotDescription) {
	runnerProxie.saveGameState (slotDescription)
	// refresh slot list
	state.gameSlots = runnerProxie.getGameSlots ()
  },
  LOAD_GAME_STATE (state, slotId, showIntro) {
	runnerProxie.loadGameState (slotId, false)

	// refresh slot list
	state.gameSlots = runnerProxie.getGameSlots ()

	// refresh game states
	state.choices = runnerProxie.getChoices ()
	state.gameTurn = runnerProxie.getGameTurn ()
	state.gameState = runnerProxie.getGameState()
	state.reactionList = runnerProxie.getReactionList ()
	state.menu = runnerProxie.getMenu () //?.slice()
	state.menuPiece = runnerProxie.getMenuPiece () //?.slice()
	state.history = runnerProxie.getHistory() //?.slice() //?

  },
  DELETE_GAME_STATE (state, slotId) {
	runnerProxie.deleteGameState (slotId)
	// refresh slot list
	state.gameSlots = runnerProxie.getGameSlots ()
  },
  RENAME_GAME_STATE (state, slotId, newSlotDescription) {

	runnerProxie.renameGameState ( slotId, newSlotDescription)
	// refresh slot list
	state.gameSlots = runnerProxie.getGameSlots ()

  },
  LOAD_GAME_ABOUT (state, par) {

	for (var i=0;i<state.games.length;i++) {
		if (state.games[i].name == par) {state.gameAbout = state.games[i].about; break; }
	}

  },
  SETLOCALE (state, locale) {

	if (state.gameId == '') {
		state.languages.all = ['en', 'eo', 'es', 'fr']
		state.languages.pref = [locale]
		state.languages.other = []
		for (let i=0;i<state.languages.all.length;i++) {
			if (state.languages.all[i] != locale) {
				state.languages.other.push (state.languages.all[i])
			}
		}
	} else {
		for (let i=0;i<state.gameAbout.translation.length;i++) {
			if (state.languages.all.indexOf (state.gameAbout.translation[i].language) >= 0) {
				state.languages.inGame.push (state.gameAbout.translation[i].language)
			}
		}

	}

	// prevention
	if (state.locale == undefined || state.locale == "") state.locale == "en"

    state.locale = locale
	if (storageON()) localStorage.ludi_locale = locale

	// load kernel messages
	state.i18n [state.locale] = require ('../../data/kernel/kernel_' + state.locale + '.json');

	let libVersion = 'v0_01'
	state.libMessages = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/messages.json');

	state.gameMessages = {}
	state.gameExtraMessages = {}
	if (state.gameId != '') {
		state.gameMessages = require ('../../data/games/' + state.gameId + '/localization/' + state.locale + '/messages.json');
		state.gameExtraMessages  = require ('../../data/games/' + state.gameId + '/localization/' + state.locale + '/extraMessages.json')

		// to refresh internal value of locale in language module
		state.language.setLocale (state.locale)

		// update links
		state.language.dependsOn (state.libMessages, state.gameMessages, state.gameExtraMessages )

	}



  }

}

export default new Vuex.Store({
  state,
  mutations,
  modules: {
    // apps
  }
})


function randomHash(nChar) {
    let nBytes = Math.ceil(nChar = (+nChar || 8) / 2);
    let u = new Uint8Array(nBytes);
    window.crypto.getRandomValues(u);
    let zpad = str => '00'.slice(str.length) + str;
    let a = Array.prototype.map.call(u, x => zpad(x.toString(16)));
    let str = a.join('').toUpperCase();
    if (nChar % 2) str = str.slice(1);
    return str;
}
