var Vue = require('vue')
var Vuex = require('vuex')

Vue.use(Vuex)

const state = {
  count: 0,
  userId: 'forta',
  locale: 'en',
  i18n: {
		en: {
			Play: { message: "Play" },
			Together: { message: "Together" },
			Language: { message: "Language" }
		}, 
		es: {
			Play: { message: "Jugar" },
			Together: { message: "Juntos" },
			Language: { message: "Idioma" }
		}, 
		eo: {
			Play: { message: "Ludi" },
			Together: { message: "Kune" },
			Language: { message: "Lingvo" }
		}	
  },
  gameMsg: {
		en: {
			'You have o1': { message: "You have o1" },
			'You need o1': { message: "You need o1" },
		}, 
		es: {
			'You have o1': { message: "Tienes o1" },
			'You need o1': { message: "Necesitas o1" },
		}, 
		eo: {
			'You have o1': { message: "Vi havas o1" },
			'You need o1': { message: "Vi bezonas o1" },
		}	
  },
  gameItem: {
		en: {
			'book': { message: "book" },
			'pencil': { message: "pencil" },
		}, 
		es: {
			'book': { message: "libro" },
			'pencil': { message: "lápiz" },
		}, 
		eo: {
			'book': { message: "libro" },
			'pencil': { message: "krajono" },
		}	
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
    state.userId= 'annonymous'
  },
  SETUSERID (state, par) {
    state.userId= par
  }, 
  SETLOCALE (state, locale) {
    state.locale = locale
  }
}

export default new Vuex.Store({
  state,
  mutations
})

