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

	var longMsgId
	
	if (type == 'items') {
		if (this.world.items[index] == undefined) 
			longMsgId  = type + "." + index + "." + attribute
		else
			longMsgId = "items." + this.world.items[index].id + "." + attribute	
		
	} else if (type == 'actions') {
		longMsgId = "actions." + index + "." +  "txt"

	} else if (type == 'directions') {
		if (this.world.directions[index] == undefined) 
			longMsgId  = type + "." + index + "." + "desc"
		else
			longMsgId = "directions." + this.world.directions [index].id + "." +  "desc"

	} else 
		longMsgId = type + "." + index + "." + attribute
			
	
	if (this.gameMessages != undefined) {
		if (this.gameMessages[longMsgId] != undefined) return this.gameMessages[longMsgId].message;
	}

	if (this.libMessages != undefined) {
		if (this.libMessages[longMsgId] != undefined) return this.libMessages[longMsgId].message;
	}

	return "[" + longMsgId + "]"
	
}

