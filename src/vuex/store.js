import Vue from 'vue'
import Vuex from 'vuex'

// import apps from './modules/apps'


//var Vue = require('vue')
// var Vuex = require('vuex')

Vue.use(Vuex)

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


function expandDynReactions (state, reactionList) {

	function arrayObjectIndexOf(myArray, property, searchTerm) {
		for(var i = 0, len = myArray.length; i < len; i++) {
			if (myArray[i][property] === searchTerm) return i;
		}
		return -1;
		}


	// expand each dyn reaction into static ones

	let sourceReactionList = reactionList.slice()
	//console.log("----------------------------------original reactionList:\n" + JSON.stringify (sourceReactionList))

	let targetReactionList = []

	for (let sReaction in sourceReactionList) {

		if (sourceReactionList[sReaction].type == "rt_desc") {
			// if static message does not exist, look for dynamic method
			var attribute = "desc"

			// getting a new state.reactionList

			// converte rt_dyn_desc into rt_desc
			var item1 = sourceReactionList[sReaction].o1
			var longMsgId = "items." + state.runner.world.items[item1].id + "." + attribute

			if (msgResolution (longMsgId) != "") {
				// confirmed that it was a static desc
				targetReactionList.push (JSON.parse(JSON.stringify(sourceReactionList[sReaction])) )
				continue
			}




			// insertion of expanded reactions
			let itemReaction = arrayObjectIndexOf (state.game.reactions.items, "id", state.runner.world.items[item1].id)

			// for debug:
			//if (false) {
			if (itemReaction>=0) {
				// item level -> add reactions into state.reactionList
				state.game.reactions.items[itemReaction][attribute]()
			} else {
				// not static nor dynamic desc, the missing longMsgId will be shown
				sourceReactionList[sReaction].type = "rt_asis"
				sourceReactionList[sReaction].txt = "[" + longMsgId + "]"

				targetReactionList.push (JSON.parse(JSON.stringify(sourceReactionList[sReaction])) )
				continue
			}

			// catch up reactions of state.reactionlist and insert them in targetReactionList
			for (let newReaction in state.reactionList) {
				//if (state.reactionList[newReaction].type == "rt_desc")
				// by now: item.desc() cannot call another item.desc()
				targetReactionList.push (JSON.parse(JSON.stringify(state.reactionList[newReaction])))
			}
			state.reactionList.splice(0,state.reactionList.length)
			// state.reactionList = []
			// state.reactionList.length = 0


		} else { // standard static reaction
			targetReactionList.push (JSON.parse(JSON.stringify(sourceReactionList[sReaction])) )
		}
	}

	// console.log("----------------------------------Expanded reactionList:\n" + JSON.stringify (targetReactionList))

	return targetReactionList.slice()


}

function reactionListContains_Type (reactionList, type) {

	for (let r in reactionList) {
		if (reactionList[r].type == type) return true
	}

	return false

}

function msgResolution (longMsgId) { // to-do: it's repeated code which is in the language module

	var expanded = ""

	if (state.game.messages [state.locale] != undefined) {
		if (state.game.messages [state.locale][longMsgId] != undefined) expanded = state.game.messages [state.locale][longMsgId].message
	}
	if ((expanded == "") && (state.lib.messages [state.locale] != undefined)) {
		if (state.lib.messages [state.locale][longMsgId] != undefined) expanded = state.lib.messages [state.locale][longMsgId].message
	}

	return expanded
}

function processChoice (state, choice) {
	if (state.choice.choiceId == 'quit') return

	state.choice = choice
	state.menu = []

	console.log ("current choice: " +  JSON.stringify(state.runner.choice))

	var optionMsg
	if (choice.isLeafe) {
		state.pendingChoice = choice
		optionMsg = choice.action.msg
	}

	// processing as much menu choices as game actions (leave choices)
	state.runner.processChoice (choice)


	if (choice.isLeafe) {
		// is game over?
		state.gameIsOver = reactionListContains_Type (state.reactionList, "rt_end_game")

		if (reactionListContains_Type (state.reactionList, "rt_show_menu")) state.menuDepth++
		else {
			// to-do: in the future, if we allow actions after show_menu: if (state.menuDepth > 0) state.menuDepth--
			state.menuDepth = 0
		}

		if ((!state.gameIsOver) && (state.menuDepth == 0)) {
			state.gameTurn++
			state.runner.worldTurn ()
		}
	}


	// show chosen option
	// to-do: send parameters to kernel messages
	if (optionMsg != undefined) {
		// option echo
		state.reactionList.unshift ({type:"rt_asis", txt: "<br/><br/>"} )
		state.reactionList.unshift ({type:"rt_msg", txt:  optionMsg } )
		state.reactionList.unshift ({type:"rt_asis", txt: ": " } )
		state.reactionList.unshift ({type:"rt_kernel_msg", txt: "Chosen option"} )
		// game menu echo
		for (var i=choice.action.menu.length-1;i>=0;i--) {
			state.reactionList.unshift ({type:"rt_asis", txt: "<br/>" } )
			state.reactionList.unshift ({type:"rt_msg", txt: choice.action.menu[i].msg } )
			state.reactionList.unshift ({type:"rt_asis", txt: "- " } )
		}
		state.reactionList.unshift ({type:"rt_asis", txt: "<b>Menu:</b><br/><br/>"} )
	}

	// refresh choices
	state.choices = state.runner.choices

	// add reactions to history
	if (choice.isLeafe) {

		let reactionList = state.reactionList.slice()
		state.reactionList.length = 0

		// expand dyn reactions
		reactionList = expandDynReactions(state, reactionList)

		state.history.push (
			{	gameTurn: state.gameTurn,
				action: choice,
				reactionList: reactionList
			}
		)
	}

	state.choice = state.runner.getCurrentChoice()

}


const state = {
	games: [
	],
	gameTurn: 0,
	gameState : {},
	menuDepth: 0,
	userId: '', // kune
	locale: '', // lingvo /here!!!
	gameId: '', // ludi
	gameIsOver: false,
	i18n:[],
	history: [ ],
	gameSlots: [],
	choices: [],
	choice: {choiceId:'top', isLeafe:false, parent:''} ,
	pendingChoice: {},
	menu: [],
	reactionList: [],
	gameAbout: {},
	languages: { all: [], pref: [], other: []},
	lib: {
		primitives: {},
		reactions:{}
	},
	game: {

	},
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

		// general kernel messages
		if (choice.choiceId == 'top') return state.kTranslator("mainChoices_" + choice.choiceId)
		else if (choice.choiceId == 'itemGroup') return state.kTranslator("mainChoices_" +  choice.itemGroup) + "(" + choice.count + ")"
		else if (choice.choiceId == 'directActions') return state.kTranslator("mainChoices_" + choice.choiceId) + "(" + choice.count + ")"
		else if (choice.choiceId == 'directionGroup') return state.kTranslator("mainChoices_" + choice.choiceId) + "(" + choice.count + ")"

		// game elements

		else if (choice.choiceId == 'action0') return state.translateGameElement("actions", choice.action.actionId)

		else if ((choice.choiceId == 'action') || (choice.choiceId == 'action2')) {

			// to-do: each action must have an echo statement in each language!

			if (isEcho) { // echo message
				if (choice.choiceId == 'action') {
					let msg = state.language.getMessageFromLongMsgId  (state.language.getLongMsgId ("messages", "Echo_o1_a1", "txt"))
					return state.language.expandParams (msg, {a1: choice.action.actionId, o1: choice.action.item1})
				} else {
					let msg = state.language.getMessageFromLongMsgId  (state.language.getLongMsgId ("messages", "Echo_o1_a1_o2", "txt"))
					return state.language.expandParams (msg, {a1: choice.action.actionId, o1: choice.action.item1, o2: choice.action.item2})
				}

			} else { // button

				// to-do?: modified as in the Echo?
				if (choice.choiceId == 'action')
					return state.translateGameElement("actions", choice.action.actionId)
				else
					return state.translateGameElement("actions", choice.action.actionId) + " -> " + state.translateGameElement("items", choice.action.item2, "txt")
			}

		} else if (choice.choiceId == 'obj1') {

			return state.language.expandParams ("%o1", {o1: choice.item1})
			// return state.translateGameElement("items", choice.item1, "txt") // to-do: will we rewrite state.translateGameElement using state.language.expandParams ??

		} else if (choice.choiceId == 'dir1') {
			// show the target only ii it is known
			console.log	("choice.action??: " + JSON.stringify(choice.action) )

			var txt = state.translateGameElement("directions", choice.action.d1, "txt")
			if (choice.action.isKnown) txt += " -> " + state.translateGameElement("items", choice.action.target, "txt")
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

		// console.log	("gTranslator.reaction: " + JSON.stringify(reaction) )

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
			longMsg.id = state.runner.world.items[reaction.o1].id
			longMsg.attribute = "desc"
		} else if (reaction.type == "rt_item") {
			longMsg.type = "items"
			longMsg.id = state.runner.world.items[reaction.o1].id
			longMsg.attribute = "txt"
		} else if (reaction.type == "rt_show_menu") {
			state.menu = reaction.menu
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
				var line = "DEV MSG:\n," ;
				line += "\t\"" + "messages."+ reaction.txt + ".txt\": {\n" ;
				line += "\t\t\"" + "message\": \"" + reaction.detail + "\"\n" ;
				line += "\t}";
				console.log(line);

				// add in memory
				state.game.messages [state.locale]["messages." + reaction.txt + ".txt"] = {message:reaction.detail}
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
			// dirty trick (to-do)
			if (reaction.param != undefined)
				expanded = state.language.expandParams (expanded,  {o1: reaction.param[0]})

			// to-do: show the picture (http)
			//if (reaction.isLink)
			//	return "<a href='../data/games/" + state.gameId + "/images/" + reaction.url + "' target='_blank'>" + expanded + "</a><br/>"
			//else
			//	return "<p>" + expanded + "</p><img src='../data/games/" + state.gameId + "/images/" + reaction.url + "'/>"
			// var src = require("./../../data/games/" + state.gameId + "/images/" + reaction.url + "'")
			//var imgPath = "./../../data/games/tresfuentes/images/diamante.jpg"
			//var src = require("./../../data/games/tresfuentes/images/diamante.jpg")
			//var src = require("../../data/games/tresfuentes/images/diamante.jpg")

			return {type:'img', txt: expanded, src:reaction.url, isLink:reaction.isLink}
			//return {type:'img', txt: expanded, src:"./../../data/games/" + state.gameId + "/images/" + reaction.url}

			//return "<p>" + expanded + "</p><img src='./../../data/games/" + state.gameId + "/images/" + reaction.url + "'/>"

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
			if (expanded == "") expanded = "Press a key"
			// deactivate buttons
			state.menu = ['Press a key']
		}

		expanded = state.language.expandParams (expanded, reaction.param)

		return {type:'text', txt: expanded  }
	},

	translateGameElement: function (type, index, attribute) {

		return state.language.getMessageFromLongMsgId (state.language.getLongMsgId (type, index, attribute))

	}

}

const mutations = {
  RESETUSERID (state) {
    state.userId= ''
	if (storageON()) localStorage.removeItem("ludi_userId")
  },
  SETUSERID (state, par) {
    state.userId = par
	if (storageON()) localStorage.ludi_userId = par
  },
  SETGAMEID (state, gameId, slotId, newlocale) {

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

	mutations.LOAD_GAME_SLOTS (state)

	var gameIndex = arrayObjectIndexOf (state.games, "name", gameId)
	state.gameAbout = state.games[gameIndex].about

	// languages in the game
	let oldLanguages = state.languages
	let languagesInGame = []
	for (let i=0;i<state.gameAbout.translation.length;i++) {
		languagesInGame.push (state.gameAbout.translation[i].language)
	}
	state.languages = oldLanguages
	state.languages.inGame = languagesInGame

	// LIB SCOPE -------------------------------
	// load generic libraries and texts:
	// language-independent: primitives, reactions, world
	// by language: messages, extraMesssages, localization handlers
	state.lib = {}

	let libPath = '../components/libs/'
	let libVersion = 'v0_01'

	console.log ('state.lib: ' + JSON.stringify (state.lib))
	console.log ('lib primitives path: ' + libPath + 'primitives.js')

	// lib primitives
	state.lib.primitives = require ('../components/libs/' + libVersion + '/primitives.js');

	// lib reactions
	state.lib.reactions = require ('../components/libs/' + libVersion + '/reactions.js');

	// lib messages
	state.lib.messages = []
	state.lib.messages [state.locale] = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/messages.json');
	//console.log ("libmsg: " + JSON.stringify(state.lib.messages [state.locale]))

	// lib extraMessages
	state.lib.extraMessages = []
	state.lib.extraMessages [state.locale] = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/extraMessages.json');

	// localization handlers
	state.lib.localization = [];
	state.lib.localization [state.locale] = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/handler.js');

	// GAME SCOPE -------------------------------
	state.game = {reactions: {}}
	let gamePath = '../../data/games/' + gameId + '/'

	// load specific game code and texts:
	// language-independent: reactions
	// by language: messages, extraMessages

	state.game.reactions = require ('../../data/games/' + gameId + '/gReactions.js');
	state.game.messages = []
	state.game.messages [state.locale] = require ('../../data/games/' + gameId + '/localization/' + state.locale + '/messages.json')
	//console.log ("gamemsg: " + JSON.stringify(state.game.messages [state.locale]))

	// extraMessages
	state.game.extraMessages = []
	state.game.extraMessages [state.locale] = require ('../../data/games/' + gameId + '/localization/' + state.locale + '/extraMessages.json')

	state.runner = require ('../components/LudiRunner.js');

	// cleaning previous game data
	mutations.GAME_STATE_RESET (state)

	var gameSlotIndex = mutations.GET_GAME_SLOT_INDEX (state, slotId)
	if (gameSlotIndex>=0) {
		// if it exists a game slot, get it
		mutations.LOAD_GAME_STATE (state, slotId, false)
	} else {
		// lib world
		state.lib.world = require ('../components/libs/' + libVersion + '/world.json');

		// game world
		state.game.world =  require ('../../data/games/' + gameId + '/world.json')

		// "compile" default ( == initial) state
		state.runner.createWorld(state.lib.world, state.game.world)		

		// save default slot game for next time
  	    mutations.SAVE_GAME_STATE (state, "default")		
	}

	state.language = require ('../components/LudiLanguage.js');
	state.language.setLocale (state.locale)

	// DEPENDENCES -------------------------------
	state.lib.primitives.dependsOn(state.runner.world, state.reactionList, state.runner.userState )

	state.lib.reactions.dependsOn(state.lib.primitives, state.reactionList)
	state.game.reactions.dependsOn(state.lib.primitives, state.lib.reactions, state.reactionList )

	state.runner.dependsOn(state.lib.reactions, state.game.reactions, state.reactionList)

	state.language.dependsOn (state.lib.messages[state.locale], state.game.messages[state.locale], state.game.extraMessages[state.locale], state.runner.world )

	if (slotId == "default") {
		mutations.PROCESS_CHOICE(state, { choiceId:'action0', action: {actionId:'look'}, isLeafe:true});
	}
	state.runner.updateChoices()
  },
  
  LOAD_GAME_SLOTS (state) {

	if (storageON()) {
		var ludi_games = {}
		if (localStorage.ludi_games == undefined) localStorage.setItem("ludi_games", JSON.stringify({}));
		else ludi_games = JSON.parse (localStorage.ludi_games)

		if (ludi_games[state.gameId] == undefined) {
			ludi_games[state.gameId] = []
			localStorage.setItem("ludi_games", JSON.stringify(ludi_games));
		}
		state.gameSlots = ludi_games[state.gameId].slice()
	}

  },
  SET_PENDING_CHOICE (state, choice) {
	state.menu = [] // reset
	processChoice (state, choice)
  },
  PROCESS_CHOICE (state, choice) {
	processChoice (state, choice)

	// refresh gameState
	var PC = state.lib.primitives.userState.profile.indexPC
	state.gameState = {PC:PC, userState: state.runner.world.items[PC] }

  },
  RESETGAMEID (state) {
    state.gameId= ''
    state.about= {}
	mutations.SETLOCALE (state, state.locale)

	// force change
	let oldLanguages = state.languages
	state.languages = oldLanguages
	state.languages.inGame = undefined

	mutations.GAME_STATE_RESET (state)

  },
  GAME_STATE_RESET (state) {

	state.history = []
	state.history.push ( {
			action: { choiceId:'action0', action : {actionId:'look'}},
			reactionList: [
				{ type: 'rt_msg', txt: 'Introduction' }
			]
	})
	state.gameTurn = 0
	state.gameIsOver = false

  },
  LOADGAMES (state, par) { // par: filter

	let gamesData = require ('../../data/games.json');

	state.games = gamesData.games

	// load all about files from all games
	for (let i=0; i<state.games.length;i++) {
		state.games[i].about = require ('../../data/games/' + state.games[i].name + '/about.json');
	}

  },
  SAVE_GAME_STATE (state, slotDescription) {

	if (storageON()) {
		var ludi_games = JSON.parse (localStorage.ludi_games)
		var d = +new Date

		ludi_games[state.gameId].push ({
			id: (slotDescription == "default")? "default": d,
			date: d,
			world: state.runner.world,
			history: state.history.slice(),
			gameTurn: state.gameTurn,
			userState: state.runner.userState, 
			slotDescription: slotDescription
		})

		state.gameSlots = ludi_games[state.gameId].slice()

		localStorage.setItem("ludi_games", JSON.stringify(ludi_games));

		console.log ("Game saved!")
	}

  },
  LOAD_GAME_STATE (state, slotId, showIntro) {

	// necessary to refresh data
	state.gameSlots = []
	mutations.LOAD_GAME_SLOTS (state)
		
	var i = mutations.GET_GAME_SLOT_INDEX (state, slotId)
	if (i>=0) {
		state.runner.world = state.gameSlots[i].world
		state.history = state.gameSlots[i].history.slice()
		state.gameTurn = state.gameSlots[i].gameTurn
		state.runner.userState = state.gameSlots[i].userState
	}

	console.log ("Game loaded!. Slot: " + slotId)

	// dependence
	state.lib.primitives.dependsOn(state.runner.world, state.reactionList, state.runner.userState )
	
	if (showIntro == false) return
	
	// show intro, after default game slot
	if ( (slotId == "default") && (showIntro == undefined) ) {
		mutations.GAME_STATE_RESET (state)
		state.choice = { choiceId:'action0', action: {actionId:'look'}, isLeafe:true}
	} else {
		state.choice = 	{choiceId:'top', isLeafe:false, parent:''} 
	}

	mutations.PROCESS_CHOICE(state, state.choice)
	state.runner.updateChoices()

  },
  DELETE_GAME_STATE (state, slotId) {

	if (storageON()) {
		if (slotId == 'default') return

		var i = mutations.GET_GAME_SLOT_INDEX (state, slotId)
		if (i>=0) {
			var ludi_games = JSON.parse (localStorage.ludi_games)

			state.gameSlots.splice(i,1)

			ludi_games[state.gameId] = state.gameSlots
			localStorage.setItem("ludi_games", JSON.stringify(ludi_games));

			console.log ("Game slot deleted!. Slot: " + slotId)
		}

	}

  },
  RENAME_GAME_STATE (state, slotId, newSlotDescription) {

	if (storageON()) {
		if (slotId == 'default') return

		var i = mutations.GET_GAME_SLOT_INDEX (state, slotId)
		if (i>=0) {
			var ludi_games = JSON.parse (localStorage.ludi_games)

			ludi_games[state.gameId][i].slotDescription = newSlotDescription
			state.gameSlots[i].slotDescription = newSlotDescription
			localStorage.setItem("ludi_games", JSON.stringify(ludi_games));

			// refresh state
			state.gameSlots = ludi_games[state.gameId]

			console.log ("Game slot " + slotId + " renamed: [" + newSlotDescription + "]")
		}

	}

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
	state.lib.messages = []
	state.lib.messages [state.locale] = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/messages.json');

	state.game.messages = []
	state.game.extraMessages = []
	if (state.gameId != '') {
		state.game.messages [state.locale] = require ('../../data/games/' + state.gameId + '/localization/' + state.locale + '/messages.json');
		state.game.extraMessages [state.locale] = require ('../../data/games/' + state.gameId + '/localization/' + state.locale + '/extraMessages.json')

		// update links
		state.language.dependsOn (state.lib.messages[state.locale], state.game.messages[state.locale], state.game.extraMessages[state.locale], state.runner.world )

	}

  }, 
  
  GET_GAME_SLOT_INDEX (state, slotId) {
	
	if (slotId == undefined) return -1

	// necessary to refresh data
	state.gameSlots = []
	mutations.LOAD_GAME_SLOTS (state)
	
	for (var i=0;i<state.gameSlots.length;i++) {
		if (state.gameSlots[i] == undefined) continue
		if (state.gameSlots[i].id == slotId) break
	}
	if (i < state.gameSlots.length) return i
	return -1
   }
  
}



export default new Vuex.Store({
  state,
  mutations,
  modules: {
    // apps
  }
})
