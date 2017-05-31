// const serverName = "www.kunludi.com"
// const serverName = "buitre.ll.iac.es"
// const serverName = "paco-pc"
const serverName = "localhost"

let connected = false, result = []

module.exports = exports = {
	initHttp:initHttp,
	connect:connect,
	getResult:getResult,
	queryLogs:queryLogs

}

function initHttp(http) {
  this.Http = http
	this.connectionState = 0
}

function connect (store, userdId, password) {

  // by now: locally
	if ( (userdId == "admin") && (password == "blabla")) return true

	// to-do: provisionally
	return true

}

function getResult () {
	return this.result
}

function queryLogs (logType) {

	// send language to server
	let url = 'http://' + serverName + ':8090/api/'

	url += 'logs/' + logType

	this.Http.get(url).then(response => {

			console.log ("Logs from web (" + logType + "): " + JSON.stringify (response.data))
			this.result = response.data

	}, (response) => {
		console.log ("Error getting logs (" + logType + ") from server")
	});

}
