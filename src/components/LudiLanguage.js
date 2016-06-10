// references to external modules
let libMessages, gameMessages
let languageParser
let world

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

exports.dependsOn = function (libMessages, gameMessages, world) {
	this.libMessages = libMessages
	this.gameMessages = gameMessages
	this.world = world

}

exports.expandText = function  (type, index, attribute) {

	if (type == 'item') {
		if (this.world.items[index] == undefined) return "[" + type + "." + index + "." + attribute + "]"
		
		var longMsgId = "items." + this.world.items[index].id + "." + attribute
		
		if (this.gameMessages != undefined) {
			if (this.gameMessages[longMsgId] != undefined) return this.gameMessages[longMsgId].message;
		}

		if (this.libMessages != undefined) {
			if (this.libMessages[longMsgId] != undefined) return this.libMessages[longMsgId].message;
		}

		return "[" + longMsgId + "]"
	} else if (type == 'action') {
		var longMsgId = "actions." + index + "." +  "txt"

		if (this.gameMessages != undefined) {
			if (this.gameMessages[longMsgId] != undefined) return this.gameMessages[longMsgId].message;
		}

		if (this.libMessages != undefined) {
			if (this.libMessages[longMsgId] != undefined) return this.libMessages[longMsgId].message;
		}

		return "[" + longMsgId + "]"
	} else if (type == 'dir') {
				
		var longMsgId = "directions.d" + index + "." +  "desc"

		if (this.gameMessages != undefined) {
			if (this.gameMessages[longMsgId] != undefined) return this.gameMessages[longMsgId].message;
		}

		if (this.libMessages != undefined) {
			if (this.libMessages[longMsgId] != undefined) return this.libMessages[longMsgId].message;
		}

		return "[" + longMsgId + "]"
	
	} 
	
	return "missing short name"
	
}

