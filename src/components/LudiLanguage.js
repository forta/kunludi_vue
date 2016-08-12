// references to external modules
let libMessages, gameMessages
let locale
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

export function setLocale (locale) {
	this.locale = locale
}

export function expandText   (type, index, attribute) {

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

export function buildSentence (textIn, expandedParams) {

	// language modules, hardcoded inside by now
	let lang_modules = {eo:{}, en: {}, es: {}, fr: {} }
	
	function endsWith (word, suffix) {
		return word.indexOf(suffix, word.length - suffix.length) !== -1;
	}
	
	// LANGUAGE MODULE: ESPERANTO (begin) -------------------------------------------------------------------------------
	
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

	//  LANGUAGE MODULE: ESPERANTO (end) -------------------------------------------------------------------------------

	let textOut = " " + textIn

	for (let i=0; i<expandedParams.length;i++) {
		let wasDone = false
		
		// apply rules, even using language-dependent properties: expandedParams[i].properties
		if (expandedParams[i].modifiers != undefined) { 
			var newText = expandedParams[i].text

			// language-dependent section (hard-coded by now: later, using external modules)
			let langMod = lang_modules[this.locale]
			
			// LANGUAGE: ESPERANTO (begin) -------------------------------------------------------------------------------
			if (this.locale	== 'eo') {
				// p: pronomo 
				if (expandedParams[i].modifiers.indexOf("p") >= 0) {
					// replace by pronoun (from expandedParams[i].properties) instead of by expanded noun
					/*
					newText = expandedParams[i].properties.pronomo
					*/
				}
				
				// n: akuzativo
				if (expandedParams[i].modifiers.indexOf("n") >= 0) {
					newText = langMod.akuzativigi (newText)
				}
				
				// a: artikolo
				// if (expandedParams[i].modifiers.indexOf("a") >= 0) {
					//if (expandedParams[i].modifiers.indexOf("p") < 0)  // if a pronoun, it cannot use an article
						newText = "la " + newText 
				// }
				
			}
			// LANGUAGE: ESPERANTO (end) -------------------------------------------------------------------------------
			
			wasDone = true
			textOut = textOut.replace ("%" + expandedParams[i].code, newText) 
			
			// clean final token
			textOut = textOut.replace ("_" + expandedParams[i].modifiers + "_" + expandedParams[i].code + "%", "") 
		}
		
		if (!wasDone) // simple replacement
			textOut = textOut.replace ("%" + expandedParams[i].code, expandedParams[i].text ) 
	}
	
	return textOut

}		


