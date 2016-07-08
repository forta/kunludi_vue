import Vue from 'vue'
import Vuex from 'vuex'

// import apps from './modules/apps'


//var Vue = require('vue')
// var Vuex = require('vuex')

Vue.use(Vuex)


const state = {
	games: [
	],
	count: 0, // -> game.turns
	userId: '', // kune 
	locale: '', // lingvo /here!!!
	gameId: '', // ludi
	i18n:[],
	history: [ // game
		// hardcoded simulation
		{ 	action: { actionId:'look'}, 
			reactionList: [ 
				{ type: 'rt_msg', txt: 'Introduction' },
				{ type: 'rt_msg', txt: 'Locked direction' },
				{ type: 'rt_msg', txt: 'You just jump!' },
				{ type: 'rt_msg', txt: 'You read %o1', param: {o1:"5"}  },
				{ type: 'rt_msg', txt: 'location unknown of %o1', param: {o1:6} }
			]
		},
		{ action: {actionId:'go west'}, 
			reactionList: [
				{ type: 'rt_msg', txt: 'You go to %d1', param: {d1:'0'} },
				{ type: 'rt_msg', txt:  'Time runs' },
				{ type: 'rt_msg', txt: 'Locked direction' }
			]
		}  
	],
	choices: [],
	currentChoice: {},
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
		
		// we suppose that all reactions consist in show texts
		
		/*	
		function itemTranslation(itemId) {
          // return itemId
          return this.gameItem[itemId].message
		}
		*/
		
		// assume reaction.type == "txt"

		var expanded = ""
		var longMsgId

		console.log	("gTranslator.reaction: " + JSON.stringify(reaction) )
		
		if (reaction.type == "rt_asis") return reaction.txt;
		else if (reaction.type == "rt_msg") longMsgId = "messages." + reaction.txt + ".txt"
		else if (reaction.type == "rt_desc") {
			longMsgId = "items." + state.runner.world.items[reaction.o1].id + ".desc" // to-do: it could be dynamic
		} else if (reaction.type == "rt_item") {
			longMsgId = "items." + state.runner.world.items[reaction.o1].id + ".txt" // to-do: it could be dynamic?
		} else return "gTranslator:[" + JSON.stringify(reaction) + "]"

		
		if (state.game.messages [state.locale] != undefined) {
			if (state.game.messages [state.locale][longMsgId] != undefined) expanded = state.game.messages [state.locale][longMsgId].message
		}
		if ((expanded == "") && (state.lib.messages [state.locale] != undefined)) {
			if (state.lib.messages [state.locale][longMsgId] != undefined) expanded = state.lib.messages [state.locale][longMsgId].message
		}
		if (expanded == "") {
			expanded = "[" + reaction.txt + "]"
		}
		
		if (expanded.indexOf("%o1") != -1) {

			// by language
			if (this.locale == 'en' ) expanded =  expanded.replace ("%o1", " a(n) " + state.translateGameElement("items", reaction.param.o1, "txt"))
			else if (this.locale == 'es' ) expanded =  expanded.replace ("%o1", " un(a) " + state.translateGameElement("items", reaction.param.o1, "txt"))
			else if (this.locale == 'eo' ) expanded =  expanded.replace ("%o1", " " + state.translateGameElement("items", reaction.param.o1, "txt") +  "n")
			else expanded = " " + expanded.replace ("%o1", state.translateGameElement("items", reaction.param.o1, "txt") ) 
		}

		if (expanded.indexOf("%d1") != -1) {  
			// by language
			if (this.locale == 'en' ) expanded =  expanded.replace ("%d1", " " + state.translateGameElement("directions", reaction.param.d1, "txt") )
			else if (this.locale == 'es' ) expanded =  expanded.replace ("%d1", " " + state.translateGameElement("directions", reaction.param.d1, "txt") )
			else if (this.locale == 'eo' ) expanded =  expanded.replace ("%d1", " " + state.translateGameElement("directions", reaction.param.d1, "txt") + "n" )
			else expanded = " " + expanded.replace ("%d1", state.translateGameElement("directions", reaction.param.d1, "txt") )
		}

		return expanded  

	}, 	
	translateGameElement: function (type, index, attribute) {

		return state.language.expandText (type, index, attribute)
		// return "[" + type + "," + index + "," + attribute + "]"
		
	},
	getCurrentChoice : function () {

		return state.currentChoice
		
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
	
	//state.game.reactions = require ('../../data/games/' + par + '/gReactions.js');
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
	//state.game.reactions.dependsOn(state.lib.primitives, state.lib.reactions, state.reactionList )

	state.runner.dependsOn(state.lib.reactions, state.game.reactions, state.reactionList)

	state.language.dependsOn (state.lib.messages[state.locale], state.game.messages[state.locale], state.runner.world )

	state.reactionList.push ({type:"rt_msg", txt: 'Welcome'} )
	mutations.PROCESS_CHOICE(state, {actionId: 'look'}); 
	
  }, 
  PROCESS_CHOICE (state, choice) {
	
	state.currentChoice = choice
	state.runner.processChoice (choice)
	
	// console.log ("current choice: " +  JSON.stringify(state.runner.getCurrentChoice()))
	
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
	
	// to-do: kill currentChoice?
	state.currentChoice = state.runner.choice


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

