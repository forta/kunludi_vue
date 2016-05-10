export function getCount (state) { return state.count }

export function getUserId (state) { return state.userId }

export function getLocale (state) { return state.locale }

export function geti18n (state) { return state.i18n[state.locale] }

export function getGameMsg (state) { return state.gameMsg[state.locale] }

export function getGameItem (state) { return state.gameItem[state.locale] }
