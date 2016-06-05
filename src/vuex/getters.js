export function getCount (state) { return state.count }

export function getUserId (state) { return state.userId }

export function getGameId (state) { return state.gameId }

export function getLocale (state) { return state.locale }

export function getHistory (state) { return state.history }

export function getChoices (state) { return state.choices }

export function getGames (state) { return state.games }

export function getGameAbout (state) { return state.gameAbout }

export function geti18n (state) { return state.i18n[state.locale] }

export function getTranslator (state) { return state.translator }

export function translateGameElement (state) { return state.translateGameElement }

