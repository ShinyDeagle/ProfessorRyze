const emojiDB = require("./emojiDB.js");
const Discord = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');

var bot = new Discord.Client()

let effectData = JSON.parse(fs.readFileSync('./effectData.json', 'utf8'));

var jsonToParse = {};
var parsedData = {};

function getEffectData(effect) {
	return effectData.effects[effect];
}

module.exports = {
	readMessage: (client, message, args) => {
		if (!args[1]) return;

    if (args[1].toLowerCase() == "guide") return message.reply("Please have a look at this gif, it gives you an example of its uses\nhttps://i.imgur.com/jy8YPz0.gif");

		//Remove possible codeblocks from message
		var mString = args.join(" ").replace(/`/g, "").replace("yml", "").replace(/\n/g, "")
		mString = mString.slice(mString.indexOf("effects"));

		//Convert the message to a short-form list format
		var mArray = mString.split("-");
		var oArray = [];
		mArray[0].trim();
		for (i = 1; i < mArray.length; i++) {
			mArray[i] = `[${mArray[i].trim().split(" ").join(",")}]`
			oArray.push(mArray[i]);
		}
		mArray[0].replace(",/g", "");
		mArray = `${mArray[0]} [${oArray}]`;

		//Create a full JSON using the fake yaml
		var input = yaml.load(mArray);

		//Store the seperate config data in a json
		var i = 0;
		Object.keys(input.effects).forEach(function(effect) {
			var segment = input.effects[effect];
			jsonToParse[i] = segment;
			i++;
		});

		//Match each input to the config variation of the effect
		Object.keys(jsonToParse).forEach(function(config) {
			var array = Array.from(jsonToParse[config]);
			var effect = getEffectData(array[1]);
			var i = 0;
			parsedData[config] = {};
			Object.keys(effect).forEach(function(parameter) {
				var keys = Object.keys(effect);

				if (array[i] != null) parsedData[config][`${parameter}`] = array[i];
				i++;
			})
		});

		//Reconstruct a code block with the parsed data
		var tabSpace = "  ";
		var messageString = "Here's the converted code you asked for!\nI labled each effect string with numbers, you'll just have to fix those later\😅 ```yml\neffects:\n"
		Object.keys(parsedData).forEach(function(config) {
			var i = 0;
			messageString += `${tabSpace}${config}:\n`
			Object.keys(parsedData[config]).forEach(function(parameter) {
				var keys = Object.keys(parsedData[config])
				var paramName = keys[i];
				var paramValue = parsedData[config][parameter];
				messageString += `${tabSpace}${tabSpace}${paramName}: ${paramValue}\n`;
				i++;
			})
		})
		messageString += "\n```";

		message.channel.send(messageString);
		message.react(emojiDB.react("tick"));
	}
}
