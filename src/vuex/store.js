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
	locale: 'en', // lingvo
	gameId: '', // ludi
	i18n: { // global
		en: {
			Play: { message: "Play" },
			Together: { message: "Together" },
			Language: { message: "Language" },
			Username: { message: "User name" }, 
		}, 
		es: {
			Play: { message: "Jugar" },
			Together: { message: "Juntos" },
			Language: { message: "Idioma" },
			Username: { message: "Nombre de usuario" },
		}, 
		eo: {
			Play: { message: "Ludi" },
			Together: { message: "Kune" },
			Language: { message: "Lingvo" },
			Username: { message: "Kromnomo" },
		}	
	},
	history: [ // game
		{ 	action: { actionId:'look'}, 
			reactionList: [
				{ type: 'msg', detail: {msgId: 'Introduction'} },
				{ type: 'msg', detail: {msgId: 'Locked direction'} },
				{ type: 'msg', detail: {msgId: 'You just jump!'} },
				{ type: 'msg', detail: {msgId: 'You read %o1', o1:'book'}  },
				{ type: 'msg', detail:  {msgId: 'You don\'t know where %o1 was', o1:'pencil'} }
			]
		},
		{ action: {actionId:'go west'}, 
			reactionList: [
				{ type: 'msg', detail: {msgId: 'You go to %d1', d1:'west'} },
				{ type: 'msg', detail: {msgId: 'Time runs'} },
				{ type: 'msg', detail: {msgId: 'Locked direction'} }
			]
		}  
	],
	choices: [],
	reactionList: [],
	actionDef: [ // lib + game
		{ actionId: 'look'}, 
		{ actionId: 'go to d1'}, 
		{ actionId: 'jump'}, 
		{ actionId: 'take o1'}, 
		{ actionId: 'write on o1 with o2'}
	],
	items: {
		'book': { 
			attList: [ ["take o1", "o1"], ["take o1", "o1"], ["write on o1 with o2", "o1"] ]
		},
		'pencil': { 
			attList: [ ["take o1", "o1"], ["write on o1 with o2", "o2"] ]
		},
	},
	itemsGroups: [ // will extracted dynamically from "world"
		{ type: 'here', items: [ 'book', 'pencil' ] },
		{ type: 'carrying', items: [ 'bottle' ] },
		{ type: 'notHere', items: [ 'can' ] }
	],
	echoes: { // to-do
		en: {
			'look': { message: "look" },
			'go to d1': { message: "go to d1" },
			'jump': { message: "jump" },
			'take o1': { message: "take o1" },
			'write on o1 with o2': { message: "write on o1 with o2" },
		}, 
		es: {
			'look': { message: "look" },
			'go to d1': { message: "go to d1" },
			'jump': { message: "jump" },
			'take o1': { message: "take o1" },
			'write on o1 with o2': { message: "write on o1 with o2" },
		}, 
		eo: {
			'look': { message: "look" },
			'go to d1': { message: "go to d1" },
			'jump': { message: "jump" },
			'take o1': { message: "take o1" },
			'write on o1 with o2': { message: "write on o1 with o2" },
		}	
	},
	gameAbout: {
		comment: 'not loaded yet...'
	}, 
	lib: { 
		primitives: {}, 
		reactions:{}
	},
	game: {
		
	},
	translator: function (reaction) {
		
		// we suppose that all reactions consist in show texts
		
		/*	
		function itemTranslation(itemId) {
          // return itemId
          return this.gameItem[itemId].message
		}
		*/
		

		var expanded = ""
		var longMsgId = "messages." + reaction.msgId + ".txt"
		
		if (state.game.messages [state.locale] != undefined) {
			if (state.game.messages [state.locale][longMsgId] != undefined) expanded = state.game.messages [state.locale][longMsgId].message
		}
		if ((expanded == "") && (state.lib.messages [state.locale] != undefined)) {
			if (state.lib.messages [state.locale][longMsgId] != undefined) expanded = state.lib.messages [state.locale][longMsgId].message
		}
		if (expanded == "") {
			expanded = "[" + reaction.msgId + "]"
		}
		
		return expanded
		
		/*	
		if (expanded.indexOf(" o1") != -1) {
		if (this.locale == 'en' ) expanded =  expanded.replace ("o1", "a(n)" + this.itemTranslation(reaction.o1))
		else if (this.locale == 'es' ) expanded =  expanded.replace ("o1", "un(a)" + this.itemTranslation(reaction.o1))
		else if (this.locale == 'eo' ) expanded =  expanded.replace ("o1", this.itemTranslation(reaction.o1) +  "n")
		else expanded = expanded.replace ("o1", this.itemTranslation(reaction.o1))
		}

		if (expanded.indexOf(" d1") != -1) {  
		if (this.locale == 'en' ) expanded =  expanded.replace ("d1", reaction.d1) // this.directionTranslation(reaction.d1))
		else if (this.locale == 'es' ) expanded =  expanded.replace ("d1", reaction.d1) // this.directionTranslation(reaction.d1))
		else if (this.locale == 'eo' ) expanded =  expanded.replace ("d1", reaction.d1) // this.directionTranslation(reaction.d1))
		else expanded = expanded.replace ("d1", reaction.d1) // this.directionTranslation(reaction.d1))
		}

		return expanded  
		*/
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

	//state.game.world =  require ('../../data/games/' + par + '/world.json')
	
	//state.game.extraMessages = []
	//state.game.extraMessages [state.locale] = require ('../../data/games/' + par + '/localization/' + state.locale + '/extraMessages.json')
	
	
	state.runner = require ('../components/LudiRunner.js');

	// DEPENDENCES -------------------------------
	state.lib.primitives.setWorld(state.lib.world, state.game.world)
	state.lib.primitives.dependsOn(state.reactionList )
	
	state.lib.reactions.dependsOn(state.lib.primitives, state.reactionList)
	//state.game.reactions.dependsOn(state.lib.primitives, state.lib.reactions, state.reactionList )

	state.runner.dependsOn(state.lib.reactions, state.game.reactions, state.reactionList)

	state.reactionList.push ({type:"msg", detail: {msgId: 'Welcome'}} )
	mutations.PROCESS_CHOICE(state, {actionId: 'look'}); 
	
  }, 
  PROCESS_CHOICE (state, choice) {
	
	console.log ("choice0:" + JSON.stringify (choice)) 
	
	if (choice.choiceId == "itemGroup") {
		state.choices = state.lib.primitives.getChoices(choice)
	} else if (choice.choiceId == "directActions") {
		state.choices = state.lib.primitives.getChoices(choice)
	} else if (choice.choiceId == "action") {
		
		state.runner.processAction (choice.action)
		let reactionList = state.reactionList.slice()
		state.reactionList.length = 0
		state.history.push ( 
			{	action: choice, 
				reactionList: reactionList
			}
		)
		state.choices = state.lib.primitives.getChoices({choiceId:'top'}) // really?
		
	} else if (choice.choiceId == "obj1") {
		state.choices = state.lib.primitives.getChoices(choice)
	} else if (choice.choiceId == "obj2") {
		
	} else if (choice.choiceId == "dir") {
		
	} else if (choice.choiceId == "menu") {
		
	} else { // or if (choice.choiceId == "top") 
		state.choices = state.lib.primitives.getChoices({choiceId:'top'})
	}

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
	
	// to-do: not allow if gameId was already selected and the selected language is not allowed (in fact, it must be an external disabling)
	
	let libVersion = 'v0_01'
	state.lib.messages [state.locale] = require ('../components/libs/' + libVersion + '/localization/' + state.locale + '/messages.json');
	
	// to-do: load game messages if gameId was already selected
	// state.game.messages [state.locale] = require ('../../data/games/' + par + '/localization/' + state.locale + '/messages.json')


  }
}

export default new Vuex.Store({
  state,
  mutations,
  modules: {
    // apps
  }
})

