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

function expandParams (textIn, param) {

	var textOut = textIn

	if (textOut.indexOf("%o1") != -1) {

		// by language
		if (state.locale == 'en' ) textOut =  textOut.replace ("%o1", " " + state.translateGameElement("items", param.o1, "txt"))
		else if (state.locale == 'es' ) textOut =  textOut.replace ("%o1", " " + state.translateGameElement("items", param.o1, "txt"))
		else if (state.locale == 'eo' ) textOut =  textOut.replace ("%o1", " " + state.translateGameElement("items", param.o1, "txt") +  "n")
		else textOut = " " + textOut.replace ("%o1", state.translateGameElement("items", param.o1, "txt") ) 
	}

		if (textOut.indexOf("%o2") != -1) {

		// by language
		if (state.locale == 'en' ) textOut =  textOut.replace ("%o2", " " + state.translateGameElement("items", param.o2, "txt"))
		else if (state.locale == 'es' ) textOut =  textOut.replace ("%o2", " " + state.translateGameElement("items", param.o2, "txt"))
		else if (state.locale == 'eo' ) textOut =  textOut.replace ("%o2", " " + state.translateGameElement("items", param.o2, "txt"))
		else textOut = " " + textOut.replace ("%o2", state.translateGameElement("items", param.o2, "txt") ) 
	}

	if (textOut.indexOf("%d1") != -1) {  
		// by language
		if (state.locale == 'en' ) textOut =  textOut.replace ("%d1", " " + state.translateGameElement("directions", param.d1, "txt") )
		else if (state.locale == 'es' ) textOut =  textOut.replace ("%d1", " " + state.translateGameElement("directions", param.d1, "txt") )
		else if (state.locale == 'eo' ) textOut =  textOut.replace ("%d1", " " + state.translateGameElement("directions", param.d1, "txt") + "n" )
		else textOut = " " + textOut.replace ("%d1", state.translateGameElement("directions", param.d1, "txt") )
	}
	
	return textOut

}		

const state = {
	games: [
	],
	count: 0, // -> game.turns
	userId: '', // kune 
	locale: '', // lingvo /here!!!
	gameId: '', // ludi
	i18n:[],
	history: [ // game
		// introduction
		{ 	action: { choiceId:'action0', actionId:'look'}, 
			reactionList: [ 
				{ type: 'rt_msg', txt: 'Introduction' }
			]
		} 
	],
	choices: [],
	choice: {choiceId:'top', isLeafe:false, parent:''} ,
	pendingChoice: {},
	menu: [],
	reactionList: [],
	gameAbout: {
		comment: 'not loaded yet...'
	}, 
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
	gTranslator: function (reaction) {
		
		if (reaction.type == "rt_kernel_msg") return state.kTranslator (reaction.txt)
			
		state.menu = []
		
		var expanded = ""

		// console.log	("gTranslator.reaction: " + JSON.stringify(reaction) )
		
		if (reaction.type == "rt_asis") return reaction.txt;
				
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
			state.menu = reaction.o1
			return ""
		} else {
			return "gTranslator:[" + JSON.stringify(reaction) + "]"
		}

		// if static:
		var longMsgId = longMsg.type + "." + longMsg.id + "." + longMsg.attribute
	
		// to-do: this code should be in a function
		// ---------- (begin msg resolution)
		if (state.game.messages [state.locale] != undefined) {
			if (state.game.messages [state.locale][longMsgId] != undefined) expanded = state.game.messages [state.locale][longMsgId].message
		}
		if ((expanded == "") && (state.lib.messages [state.locale] != undefined)) {
			if (state.lib.messages [state.locale][longMsgId] != undefined) expanded = state.lib.messages [state.locale][longMsgId].message
		}
		// ---------- (end msg resolution)
		
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
			return ""
		}
		
		if (expanded == "") {
			if (reaction.txt == undefined) 
				expanded = "[" + longMsgId + "]"
			else
				expanded = "[" + reaction.txt + "]"

			// might be dynamic: 1) a global game method; or 2) a item property
			// to-think: dynamic calls expands the reaction list which it is being processing!
			if ((reaction.type == "rt_desc") || (reaction.type == "rt_item") ){
				// game level
				let actionGameIndex = arrayObjectIndexOf (state.game.reactions, "id", longMsg.attribute)
				if ((actionGameIndex>=0) && (typeof state.game.reactions[actionGameIndex].reaction == "function")) {
					// problem: the new dynamic reactions are added at the end instead of inserted
					state.game.reactions[actionGameIndex].reaction ({item1: reaction.o1})
					return expanded + "(by game method)";
				} 

				// lib level
				let actionLibIndex = arrayObjectIndexOf (state.lib.reactions, "id", longMsg.attribute)
				if ((actionLibIndex>=0) && (typeof state.lib.reactions[actionLibIndex].reaction == "function")) {
					// problem: the new dynamic reactions are added at the end instead of inserted
					state.lib.reactions[actionLibIndex].reaction ({item1: reaction.o1})
					return expanded + "(by lib method)";
				} 

				// item level
				let itemGamelevel = arrayObjectIndexOf (state.game.reactions.items, "id", state.runner.world.items[reaction.o1].id)
				
				// longMsg.attribute: mainly desc()
				state.game.reactions.items[itemGamelevel][longMsg.attribute]()
				return "" // dynamic function do the job
			}
		}
		
		if (expanded == "[]") expanded = ""
		
		if (reaction.type == "rt_graph") {	
			// dirty trick (to-do)
			expanded = expandParams (expanded,  {o1: reaction.param[0]})
			
			// to-do: show the picture (http)
			//if (reaction.isLink)
			//	return "<a href='../data/games/" + state.gameId + "/images/" + reaction.url + "' target='_blank'>" + expanded + "</a><br/>"
			//else 
			//	return "<p>" + expanded + "</p><img src='../data/games/" + state.gameId + "/images/" + reaction.url + "'/>"
			return "<img src=\"./../../data/icons/languages.jpg\"/>"

			return "<p>" + expanded + "</p><img src='./../../data/games/" + state.gameId + "/images/" + reaction.url + "'/>"
			
		} else if ((reaction.type == "rt_quote_begin") || (reaction.type == "rt_quote_continues")) {
			// dirty trick (to-do)
			expanded = expandParams (expanded,  {o1: reaction.param[0]})
			
			// to-do: translate item
			return ((reaction.type == "rt_quote_begin")? "<br/><b>" + reaction.item + "</b>: «": "" ) + expanded + ((reaction.last) ? "»" : "")
			
		} else if (reaction.type == "rt_play_audio") {
			// to-do
			return expanded + " (play: " + reaction.fileName + " autoStart: " + reaction.autoStart + ")"
			
		} else if (reaction.type == "rt_end_game") {
			if (expanded == "") expanded = "End of game"
			state.choice = {choiceId:'quit', action:{actionId:''}, isLeafe:true} 
		} else if (reaction.type == "rt_press_key")  { 
			if (expanded == "") expanded = "Press a key"
			// deactivate buttons
			state.menu = ['Press a key']
		}
	
		expanded = expandParams (expanded, reaction.param)
		
		return expanded  

	}, 	
	translateGameElement: function (type, index, attribute) {

		return state.language.expandText (type, index, attribute)
		
	}

}

const mutations = {
  INCREMENT (state) {
    state.count++
  },
  INCREMENTBY (state, par) {
    state.count+=par
  },
  DECREMENT (state) {
    state.count--
  },
  RESETUSERID (state) {
    state.userId= ''
  },
  SETUSERID (state, par) {
    state.userId= par
  }, 
  SETGAMEID (state, par) {
	  
	// to-do: check if language available in current language
	console.log ("state.locale: " + state.locale) 
	
	/*
	if (state.gameAbout.translation[0].language != state.locale) {
		alert ('By now, the current language must be the principal language of the game') 
		return
	} 
		
	*/
	
	let l;
	let t = state.gameAbout.translation;
	for (l=0; l < t.length; l++) {
		if (t[l].language == state.locale) break;
	}
	if 	(l == t.length) {
		alert ('Game not available for current language') 
		return;
	}
	
	  
    state.gameId = par
	
	// LIB SCOPE -------------------------------
	// load generic libraries and texts: 
	// language-independent: primitives, reactions, world
	// by language: messages, extraMesssages, localization handlers
	state.lib = {}
	
	let libPath = '../components/libs/'
	let libVersion = 'v0_01'

	console.log ('state.lib: ' + JSON.stringify (state.lib))
	console.log ('lib primitives path: ' + libPath + 'primitives.js')

	// primitives
	state.lib.primitives = require ('../components/libs/' + libVersion + '/primitives.js');

	// reactions
	state.lib.reactions = require ('../components/libs/' + libVersion + '/reactions.js'); 

	// world
	state.lib.world = require ('../components/libs/' + libVersion + '/world.json');
	// console.log ("world:" + JSON.stringify (state.lib.world));

	// messages
	state.lib.messages = []
	state.lib.messages [state.locale] = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/messages.json');
	//console.log ("libmsg: " + JSON.stringify(state.lib.messages [state.locale]))
	
	// extraMessages
	state.lib.extraMessages = []
	state.lib.extraMessages [state.locale] = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/extraMessages.json');

	// localization handlers
	state.lib.localization = [];
	state.lib.localization [state.locale] = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/handler.js');
	
	// GAME SCOPE -------------------------------
	state.game = {reactions: {}}
	let gamePath = '../../data/games/' + par + '/'

	// load specific game code and texts:
	// language-independent: reactions
	// by language: messages, extraMessages
	
	state.game.reactions = require ('../../data/games/' + par + '/gReactions.js');
	state.game.messages = []
	state.game.messages [state.locale] = require ('../../data/games/' + par + '/localization/' + state.locale + '/messages.json')
	//console.log ("gamemsg: " + JSON.stringify(state.game.messages [state.locale]))

	state.game.world =  require ('../../data/games/' + par + '/world.json')

	//state.game.extraMessages = []
	//state.game.extraMessages [state.locale] = require ('../../data/games/' + par + '/localization/' + state.locale + '/extraMessages.json')
	
	state.runner = require ('../components/LudiRunner.js');
	state.runner.createWorld(state.lib.world, state.game.world)

	state.language = require ('../components/LudiLanguage.js');

	
	// DEPENDENCES -------------------------------
	state.lib.primitives.dependsOn(state.runner.world, state.reactionList, state.runner.userState )
	
	state.lib.reactions.dependsOn(state.lib.primitives, state.reactionList)
	state.game.reactions.dependsOn(state.lib.primitives, state.lib.reactions, state.reactionList )

	state.runner.dependsOn(state.lib.reactions, state.game.reactions, state.reactionList)

	state.language.dependsOn (state.lib.messages[state.locale], state.game.messages[state.locale], state.runner.world )

	mutations.PROCESS_CHOICE(state, { choiceId:'action0', action: {actionId:'look'}, isLeafe:true}); 
	
	
  }, 
  SET_PENDING_CHOICE (state, choice) {
	  state.menu = [] // reset 
	  mutations.PROCESS_CHOICE (state, choice)
  },
  PROCESS_CHOICE (state, choice) {
	
	if (state.choice.choiceId == 'quit') return
	
	state.choice = choice

	state.menu = []

	console.log ("current choice: " +  JSON.stringify(state.runner.choice))
	
	var option
	if (choice.isLeafe) {
		state.pendingChoice = choice
		option = choice.action.option
	}

	state.runner.processChoice (choice)
	
	// to-do: send parameters to kernel messages
	if (option != undefined) {
		state.reactionList.unshift ({type:"rt_asis", txt: ": " + option + "<br/><br/>"} )
		state.reactionList.unshift ({type:"rt_kernel_msg", txt: "Chosen option"} )
	}
	
	// refresh choices
	state.choices = state.runner.choices 
	
	// refresh history
	if (state.runner.reactionList.length > 0) {
		let reactionList = state.reactionList.slice()
		state.reactionList.length = 0
		state.history.push ( 
			{	action: choice, 
				reactionList: reactionList
			}
		)
	}
	
	state.choice = state.runner.getCurrentChoice()

  },
  RESETGAMEID (state) {
    state.gameId= ''
  },
  LOADGAMES (state, par) { // par: filter
	  
	let gamesData = require ('../../data/games.json');

	state.games = gamesData.games
	
  },
  LOAD_GAME_ABOUT (state, par) { 
	// to-do: capture error
	let gameAbout = require ('../../data/games/' + par + '/about.json');
	state.gameAbout = gameAbout
  },
  SETLOCALE (state, locale) {
    state.locale = locale
	
	// load kernel messages
	state.i18n [state.locale] = require ('../../data/kernel/kernel_' + state.locale + '.json');
	
	let libVersion = 'v0_01'
	state.lib.messages = []
	state.lib.messages [state.locale] = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/messages.json');
	
	state.game.messages = []
	if (state.gameId != '') {
		state.game.messages [state.locale] = require ('../../data/games/' + state.gameId + '/localization/' + state.locale + '/messages.json');
		
		// update links
		state.language.dependsOn (state.lib.messages[state.locale], state.game.messages[state.locale], state.runner.world )
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

