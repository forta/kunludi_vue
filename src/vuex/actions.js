export const setLocale = function (store, par) {  store.dispatch('SETLOCALE', par) }

export const resetUserId = ({ dispatch }) => dispatch('RESETUSERID')

export const setUserId = function (store, userId, password) {  store.dispatch('SETUSERID', userId, password) }

export const setGameId = function (store, par, slotId) {  store.dispatch('SETGAMEID', par, slotId) }

export const resetGameId = ({ dispatch }) => dispatch('RESETGAMEID')

export const resetSlotId = ({ dispatch, gameId, slotId, newLocal }) => dispatch('RESETSLOTID', gameId, slotId, newLocal)

export const processChoice = ({ dispatch, choice }) => dispatch('PROCESS_CHOICE', choice)

export const sendChatMessage = ({ dispatch, chatMessage, target}) => dispatch('SEND_CHAT_MESSAGE', chatMessage, target)

export const setPendingChoice = function (store, choice) {  store.dispatch('SET_PENDING_CHOICE', choice) }

export const setKeyPressed = function (store) {  store.dispatch('SET_KEY_PRESSED') }

// export const loadGameSlots = function (store, par) {  store.dispatch('LOAD_GAME_SLOTS', par) }

export const loadGames = function (store, par) {  store.dispatch('LOADGAMES', par) }

export const loadGameAbout = function (store, par) {  store.dispatch('LOAD_GAME_ABOUT', par) }

export const saveGameState = function (store) {  store.dispatch('SAVE_GAME_STATE') }

export const loadGameState = function (store, slotId) {  store.dispatch('LOAD_GAME_STATE', slotId) }

export const deleteGameState = function (store, gameId, slotId) {  store.dispatch('DELETE_GAME_STATE', gameId, slotId) }

export const renameGameState = function (store, gameId, slotId, newSlotDescription) {  store.dispatch('RENAME_GAME_STATE', gameId, slotId, newSlotDescription) }
