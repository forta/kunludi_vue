import Vue from 'vue'
import VueResource from 'vue-resource'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.use(VueResource)

//game engine
const runnerProxie = require ('../components/RunnerProxie.js');

// vue dependence (VueResource)
runnerProxie.initHttp (Vue.http)

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

function msgResolution (longMsgId) {

  return runnerProxie.msgResolution (longMsgId)

}

function refreshDataFromProxie(runnerProxie) {

  setInterval(function() {

    {
      // console.log ("Get data from runnerProxie")

      // connection active
      if (runnerProxie.getConnectionState() < 0) {
        if (state.userId != "") {
          state.userId = ""
          state.userSession = 'anonymous'
          console.log ("Connection lost with server")
          alert ("Connection lost with server")
        }
        return
      }

      //playerList
      state.playerList = runnerProxie.getPlayerList ()

      state.refreshFromProxie()

    }

  }, 1000);
}

function processChoice (state, choice) {

  // to-do here
  if (state.choice != undefined) {
    if (state.choice.choiceId == 'quit') return

  }

	state.choice = choice
	state.menu = []

	var optionMsg
	if (choice.isLeafe) {
		console.log ("store.js. action: {userSession:'" + state.userSession + "', action: {" +  JSON.stringify(choice.action) + "}" )

		optionMsg = choice.action.msg
    state.lastAction = choice
	}

	// processing choices or game actions (leave choices)
	runnerProxie.processChoice (choice, optionMsg)

	if (runnerProxie.getConnectionState() == 0)  {
      state.refreshFromProxie ()
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
  lastAction: {},
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
  getEchoAction: function (choice, isEcho) {
    return runnerProxie.getEchoAction(choice, isEcho)
  },
  getEchoChoice: function (choice, isEcho) {

    if (isEcho) {
      console.log ("Echo: " +  JSON.stringify (choice))

    }

		if ((choice.noEcho != undefined) && (choice.noEcho)) {
			return ""
		}

    // here!!
    let outText = ""

		// console.log	("getEcho.choice: " + JSON.stringify(choice) )

		// general kernel messages
		if (choice.choiceId == 'top') return state.kTranslator("mainChoices_" + choice.choiceId)
		else if (choice.choiceId == 'itemGroup') return state.kTranslator("mainChoices_" +  choice.itemGroup) + "(" + choice.count + ")"
		else if (choice.choiceId == 'directActions') return state.kTranslator("mainChoices_" + choice.choiceId) + "(" + choice.count + ")"
		else if (choice.choiceId == 'directionGroup') return state.kTranslator("mainChoices_" + choice.choiceId) + "(" + choice.count + ")"
    else if (choice.choiceId == 'obj1') {
      outText = runnerProxie.translateGameElement ("items", choice.item1Id, "txt")

      if (outText == "") { // the language modules weren't loaded into the runnerProxie.language
        runnerProxie.setLocale (state.locale)

        // second try
        outText = runnerProxie.translateGameElement ("items", choice.item1Id, "txt")
        if (outText == "") outText = "[" + choice.item1Id + "]"
      }

      return outText
    }

		// game elements
    outText = runnerProxie.getEchoAction (choice, isEcho)
    if (outText == "") { // the language modules weren't loaded into the runnerProxie.language
      runnerProxie.setLocale (state.locale)

      // second try
      outText = runnerProxie.getEchoAction (choice, isEcho)
      if (outText == "") outText = "[" + JSON.stringify (choice) + "]"
    }
    return outText

	},

	gTranslator: function (reaction) {

		if (reaction.type == "rt_refresh") {
			// do nothing
			return {type:'text', txt:""}
		}

		if (reaction.type == "rt_kernel_msg") {
			return {type:'text', txt:state.kTranslator (reaction.txt)}
		}


		if (reaction.type == "rt_asis") {
			return {type:'text', txt:reaction.txt}
		}

    return runnerProxie.gTranslator (reaction)
	},

	translateGameElement: function (type, id, attribute) {
    return runnerProxie.translateGameElement  (type, id, attribute)
	},

  refreshFromProxie: function () {

    if (state.gameId == "") state.games = runnerProxie.getGames ()
    else { // if playing a game
      state.choice = runnerProxie.getCurrentChoice()
      state.reactionList = runnerProxie.getReactionList ()
      runnerProxie.updateChoices()
      state.pendingChoice = runnerProxie.getPendingChoice()
      state.choices = runnerProxie.getChoices ()
      state.gameTurn = runnerProxie.getGameTurn ()
      state.gameState = runnerProxie.getGameState()
      state.history = runnerProxie.getHistory()
      state.pendingPressKey = runnerProxie.getPendingPressKey ()

      if (state.pendingPressKey) {         // pressKey message
        let pressKeyMessage_short = runnerProxie.getPressKeyMessage ()
        if ( pressKeyMessage_short == undefined || pressKeyMessage_short == "") {
          // default message
          pressKeyMessage_short  = "press_key"
        }

        state.pressKeyMessage =  msgResolution ("messages." + pressKeyMessage_short + ".txt")
        // if message not resolved, show it as is.
        if (state.pressKeyMessage  == "") {
          state.pressKeyMessage  = "[" + pressKeyMessage_short + "]"
        }
      } else {
        state.pressKeyMessage  = ""
      }

      state.lastAction =  runnerProxie.getLastAction ()
  		state.menu = runnerProxie.getMenu ()
  		state.menuPiece = runnerProxie.getMenuPiece ()
    }

    // chatmessages
    if ((state.chatMessagesInternal.length > 0) && (state.chatMessagesState != state.chatMessagesInternal[0].seq)) {
      state.chatMessagesState = state.chatMessages[0].seq
      state.chatMessages = state.chatMessagesInternal.slice()
      console.log ("State of chatMessages: " +  state.chatMessages[0].seq)
    }
  }
}

function localData_loadGame (gameId) {

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
	runnerProxie.local_loadGame (gameId, primitives, libReactions, gameReactions, libWorld, gameWorld0 )

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

  runnerProxie.backEnd_loadGames ()

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

  runnerProxie.setLocale (state.locale) // update language data in proxie

  state.refreshFromProxie()

	if (state.gameState.PC < 0) {
		// error
		alert ("http error");
		mutations.RESETGAMEID(state)
		return
	}


  /*
  //only when local playing
  if (runnerProxie.getConnectionState() == 0) {
	  runnerProxie.setHistory(state.history )
  }
  */

	runnerProxie.saveGameState (slotId)
	state.gameSlots = runnerProxie.getGameSlots ()

}


const mutations = {
  RESETUSERID (state) {
    if (state.gameId != "") {
        alert ("[You will loose your current game state.]")
        mutations.RESETGAMEID (state)
    }

    runnerProxie.userLogoff ()

    state.userId= ''
	  state.userSession = 'anonymous'

    // load local list of games again
    mutations.LOADGAMES (state)

	  if (storageON()) localStorage.removeItem("ludi_userId")
  },
  SETUSERID (state, userId) {

    if (state.gameId != "") {
        alert ("[You will loose your current game state.]")
        mutations.RESETGAMEID (state)
    }

	  // user session
		runnerProxie.userLogon (userId)

    // wait for several seconds till the game were loaded
		setTimeout(function () {
			if (runnerProxie.getConnectionState() != -1) {
				if (runnerProxie.getConnectionState() == 1) {

          // launch periodic request
          refreshDataFromProxie(runnerProxie)

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

	// cleaning previous game data
	cleanHistory()

	if (state.userId == '') { // local engine
		localData_loadGame (gameId)
		afterGameLoaded(slotId)
	} else {

		state.choice = {choiceId:'top', isLeafe:false, parent:''}

		// remote engine using REST calls
		runnerProxie.backEnd_LoadGame (gameId)

    //runnerProxie.setLocale (state.locale) // update language data in proxie

		// wait for several seconds till the game were loaded
		setTimeout(function () {
			if (runnerProxie.getConnectionState() != -1) {
				if (runnerProxie.getConnectionState() == 1) {
					afterGameLoaded(slotId)
				}
			}
		}, 3000);

	}

  },

  SET_PENDING_CHOICE (state, choice) {
     state.menu = []
	   processChoice (state, choice)
  },
  SEND_CHAT_MESSAGE (state, chatMessage) {
    runnerProxie.sendChatMessage (chatMessage)
	},
  SET_KEY_PRESSED (state) {

	  runnerProxie.keyPressed()

    if (runnerProxie.getConnectionState() == 0)  {
        state.refreshFromProxie ()
    }

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

  LOADGAMES (state, par) { // par: filter (not used yet)

    // if (runnerProxie.getConnectionState() < 0) return

  	if (runnerProxie.getConnectionState() <= 0) {
  		runnerProxie.localData_loadGames ()
  	} else {
  		runnerProxie.backEnd_loadGames ()
  	}

    state.games = runnerProxie.getGames ()

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
	state.history = runnerProxie.getHistory().slice() //?

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

	// prevention
	if ((locale == undefined) || (locale == "")) state.locale = "en"
	else state.locale = locale

	if (storageON()) localStorage.ludi_locale = state.locale

	if (state.gameId == '') {
		state.languages.all = ['en', 'eo', 'es', 'fr']
		state.languages.pref = [state.locale]
		state.languages.other = []
		for (let i=0;i<state.languages.all.length;i++) {
			if (state.languages.all[i] != state.locale) {
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

    // load kernel messages
	state.i18n [state.locale] = require ('../../data/kernel/kernel_' + state.locale + '.json');

	runnerProxie.setLocale (state.locale) // update language data in proxie

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
