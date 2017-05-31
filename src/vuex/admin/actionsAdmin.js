
export const connect = ({ dispatch, userdId, password }) => dispatch('CONNECT', userdId, password)

export const queryLogs = ({ dispatch, logType}) => dispatch('QUERY_LOGS', logType)
