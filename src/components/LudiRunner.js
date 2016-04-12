
exports.gameId = "tresfuentes";

// import fs from 'fs'
//var fs = require("fs");

var supportedLanguages = ["EN", "ES", "EO"];
// ver: https://jsfiddle.net/yyx990803/KupQL/ sobre cómo leer json de fuera

exports.kernelMSG = ["a"];
exports.libMSG = ["a"];
exports.libMSGByLan = ["a"];

/*
for (var i=0; i<supportedLanguages.length;i++) {
	exports.kernelMSG [i] = { lang:supportedLanguages[i],  messages: JSON.parse(fs.readFileSync("./data/kernel/kernel" + supportedLanguages[i] + ".json")) };
	exports.libMSG [i] = { lang:supportedLanguages[i],  messages: JSON.parse(fs.readFileSync("./data/lib/libMessages" + supportedLanguages[i] + ".json")) };
	exports.libMSGByLan [i] = { lang:supportedLanguages[i],  messages: JSON.parse(fs.readFileSync("./data/lib/libMessagesByLan" + supportedLanguages[i] + ".json")) };
}

*/

/*

// kernel messages in each language
for (m in kernelMSG[0].messages) {
	console.log("Kernel messageId [" + m + "]:");
	for (var l in kernelMSG) {
		console.log("\t" + kernelMSG[l].lang + ":" + kernelMSG[l].messages[m].message );
	}
}

// lib messages in each language
for (m in libMSG[0].messages) {
	console.log("Lib messageId [" + m + "]:");
	for (var l in libMSG) {
		console.log("\t" + libMSG[l].lang + ":" + libMSG[l].messages[m].message );
	}
}
*/
