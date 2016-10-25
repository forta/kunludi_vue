export const setLocale = function (store, par) {  store.dispatch('SETLOCALE', par) }

export const resetUserId = ({ dispatch }) => dispatch('RESETUSERID')

export const setUserId = function (store, par) {  store.dispatch('SETUSERID', par) }

export const setGameId = function (store, par) {  store.dispatch('SETGAMEID', par) }

export const resetGameId = ({ dispatch }) => dispatch('RESETGAMEID')

export const processChoice = ({ dispatch, choice }) => dispatch('PROCESS_CHOICE', choice)

export const setPendingChoice = function (store, choice) {  store.dispatch('SET_PENDING_CHOICE', choice) }

export const loadGames = function (store, par) {  store.dispatch('LOADGAMES', par) }

export const loadGameAbout = function (store, par) {  store.dispatch('LOAD_GAME_ABOUT', par) }

export const saveGameState = function (store) {  store.dispatch('SAVE_GAME_STATE') }

export const loadGameState = function (store) {  store.dispatch('LOAD_GAME_STATE') }
