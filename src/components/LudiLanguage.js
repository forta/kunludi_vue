// references to external modules
let libMessages, gameMessages, extraMesssages
let locale
let world


function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

exports.dependsOn = function (libMessages, gameMessages, extraMesssages, world) {
	this.libMessages = libMessages
	this.gameMessages = gameMessages
	this.extraMesssages = extraMesssages
	this.world = world

}

export function setLocale (locale) {
	this.locale = locale
}

export function getLongMsgId   (type, index, attribute) {
	
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
		
	return longMsgId
	
}

export function expandParams (textIn, param) {

	let availableParams = ["a1", "o1", "o2", "d1", "s1", "s2", "s3", "s4", "s5", "s6"] // yeah, clearly improvable
	let expandedParams = [], numParms = 0

	for (let i=0; i<availableParams.length;i++) {

		let p1, p2

		if ((p1 = textIn.indexOf("%" + availableParams[i])) >= 0) {   // parámeters like "%o1" and so on
			expandedParams[numParms] = {code: availableParams[i]}

			let type = "undefined!"
			if (availableParams[i][0] == "o") type = "items"
			else if (availableParams[i][0] == "d") type = "directions"
			else if (availableParams[i][0] == "a") type = "actions"
			else if (availableParams[i][0] == "s") type = "string"

			if (type == "string") {
				expandedParams[numParms].text = param[availableParams[i]] // text as is
			} else {
				expandedParams[numParms].longMsgId = this.getLongMsgId (type, param[availableParams[i]], "txt")
				expandedParams[numParms].base = this.getBaseFromLongMsgId (expandedParams[numParms].longMsgId)
			}

			// language-dependent modifiers
			
			if ((p2 = textIn.indexOf("_" + availableParams[i] +  "%")) >= 0) {
				
				// explicit modifiers
				expandedParams[numParms].modifiers = textIn.substring (p1+availableParams[i].length + 2,p2)

				// to-do:
				/*
				if (type == "items") {
					
					if (this.locale == "es") {
						expandedParams[numParms].properties = {articulo:true}
						
					} else if (this.locale == "en") {
						
					} else if (this.locale == "eo") {
						
						expandedParams[numParms].properties = {artikolo: true}
						
					} else if (this.locale == "fr") {
						
					} 
				}
				*/
				
			} else {
				// default modifiers

				if (this.locale == "es") {
					expandedParams[numParms].properties = {articulo:true}
				} else if (this.locale == "en") {
					expandedParams[numParms].properties = {article:true}
				} else if (this.locale == "eo") {
					expandedParams[numParms].properties = {artikolo: true}
				} else if (this.locale == "fr") {
					expandedParams[numParms].properties = {article:true}
				} 
			}
			
			numParms++
		}
	}
	

	return this.buildSentence (textIn, expandedParams)

}

export function getBaseFromLongMsgId   (longMsgId) {
	var parts = longMsgId.split(".")
	return parts[0] + "." +  parts[1] + "."
}


export function getMessageFromLongMsgId   (longMsgId) {

	if (this.gameMessages != undefined) {
		if (this.gameMessages[longMsgId] != undefined) return this.gameMessages[longMsgId].message;
	}

	if (this.libMessages != undefined) {
		if (this.libMessages[longMsgId] != undefined) return this.libMessages[longMsgId].message;
	}

	return "[" + longMsgId + "]"
}

export function getExtraMessageFromLongMsgId   (longMsgId) {

	if (this.extraMesssages != undefined) {
		if (this.extraMesssages[longMsgId] != undefined) return this.extraMesssages[longMsgId].message;
	}

	return
}


function endsWith (word, suffix) {
	return word.indexOf(suffix, word.length - suffix.length) !== -1;
}

let lang_modules = {en:{}, es: {}, eo: {}, fr: {} }

lang_modules.en.process = function (langModule, param) {

	var textOut = param.text
	
	if (param.text != undefined) return param.text
	else textOut = langModule.getMessageFromLongMsgId (param.longMsgId)

	if (param.code.indexOf("o") >= 0) {

		if (param.properties.article) {
			var article = langModule.getExtraMessageFromLongMsgId (param.base + "article")
			if (article === undefined) article = "the"

			if (article !== "") textOut = article + " " + textOut				
		}
	}

	return textOut

}

lang_modules.es.process = function (langModule, param) {

	var textOut = param.text
	
	if (param.text != undefined) return param.text
	else textOut = langModule.getMessageFromLongMsgId (param.longMsgId)
	
	if (param.code.indexOf("o") >= 0) {
		var articulo = ""

		if (param.properties.articulo) {		
			articulo = langModule.getExtraMessageFromLongMsgId (param.base + "articulo")
			textOut = articulo + " " + textOut
		}
	}

	return textOut
}

lang_modules.eo.process = function (langModule, param) {
	
	var textOut = param.text
	
	if (param.text != undefined) return param.text
	else textOut = langModule.getMessageFromLongMsgId (param.longMsgId)
	
	if (param.code.indexOf("o") >= 0) {
		if (param.properties.artikolo) {
			var artikolo = langModule.getExtraMessageFromLongMsgId (param.base + "artikolo")
			if (artikolo === undefined) artikolo = "la"

			if (artikolo != "") textOut = artikolo + " " + textOut				
		}
	}
	
	return textOut
}

lang_modules.fr.process = function (langModule, param) {
	
	var textOut = param.text
	
	if (param.text != undefined) return param.text
	else textOut = langModule.getMessageFromLongMsgId (param.longMsgId)
	
	if (param.code.indexOf("o") >= 0) {
		var article = ""

		if (param.properties.article) {
			article = langModule.getExtraMessageFromLongMsgId (param.base + "article")
			textOut = article + " " + textOut
		}
	}

	return textOut
}


lang_modules.eo.akuzativigi = function (textIn) {
	// add "n" at the end of each word ending by "o", "a", "oj" or "aj", or if the word is a pronoun
	
	let words = textIn.split(" ");
	let textOut = ""
	let endings = ["a", "aj", "o", "oj"]
	let prepositions = ["de", "el", "da"]
	let pronomoj = ["mi", "vi", "li", "ŝi", "ĝi", "ci", "ni", "ili"] 
	
	let noMore = false
	
	for (let w in words) {
		let doIt = false
	
		if (!noMore) {
			for (let e in endings) {
				if (endsWith(words[w], endings[e])) {
					if (words[w] == "la") continue
					doIt = true
					break
				} 
			}
			for (let p in pronomoj) {
				if (words[w] == pronomoj[p]) {
					doIt = true
					break
				} 
			}
			
		}
		
		if (!noMore) {
			for (let p in prepositions) {
				if (words[w] == prepositions[p]) {
					noMore = true
					if (doIt) doIt = false
					break
				}
			}
		}
		
		if (doIt) textOut += words[w] + "n"
		else textOut += words[w]
		
		textOut	+= " "
		
	}

	return textOut
	
}

export function buildSentence (textIn, expandedParams) {
	
	let textOut = " " + textIn

	for (let i=0; i<expandedParams.length;i++) {

		// calling the language dependent processor
		var modifiedText = lang_modules[this.locale].process(this, expandedParams[i])
		
		// replace code by language dependant word/s
		textOut = textOut.replace ("%" + expandedParams[i].code, modifiedText) 
		
		// if explicit modifiers, clean final token
		if (expandedParams[i].modifiers != undefined) { 
			textOut = textOut.replace ("_" + expandedParams[i].modifiers + "_" + expandedParams[i].code + "%", "") 
		}
		
	}
	
	return textOut

}		

