//export const increment = function (store) {  store.dispatch('INCREMENT') }

export const setLocale = function (store, par) {  store.dispatch('SETLOCALE', par) }

export const resetUserId = ({ dispatch }) => dispatch('RESETUSERID')

export const setUserId = function (store, par) {  store.dispatch('SETUSERID', par) }

export const setGameId = function (store, par) {  store.dispatch('SETGAMEID', par) }

export const resetGameId = ({ dispatch }) => dispatch('RESETGAMEID')

export const processChoice = ({ dispatch, choice }) => dispatch('PROCESS_CHOICE', choice)

export const setPendingChoice = function (store, choice) {  store.dispatch('SET_PENDING_CHOICE', choice) }

export const loadGames = function (store, par) {  store.dispatch('LOADGAMES', par) }

export const loadGameAbout = function (store, par) {  store.dispatch('LOAD_GAME_ABOUT', par) }

export const increment = ({ dispatch }) => dispatch('INCREMENT')

export const incrementBy = function (store, par) {  store.dispatch('INCREMENTBY', par) }

/*
export const decrement = ({ dispatch }) => dispatch('DECREMENT')



export const incrementIfOdd = ({ dispatch, state }) => {
  if ((state.count + 1) % 2 === 0) {
    dispatch('INCREMENT')
  }
}

export const incrementAsync = ({ dispatch }) => {
  setTimeout(() => {
    dispatch('INCREMENT')
  }, 1000)
}

*/