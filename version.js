const Discord = require('discord.js');

var bot = new Discord.Client()

modules.export = {
	parseVersion: (bot, message, args) => {
		if (!args[1])
			return message.reply("Can you actually provide a legit version string to parse?")

		var string = args[1]
		var prefixEnd = string.indexOf("-dev-");
		if (prefixEnd == -1) return message.reply("Make sure to include everything. For example, 2.9-dev-[datepattern]")
		var version = string.slice(0,prefixEnd);
		if (version == "") return message.reply("Specify every part of the build's version. For example, 2.9-dev-[datepattern]")
		var format = string.slice(prefixEnd + "-dev-".length);
		console.log(`${string}`);
		console.log(prefixEnd);
		console.log(version);
		console.log(format);

		//Parse the format
		if (format.length != 10) return message.reply("Invalid date-pattern was detected!")

		var year = format.slice(0,2);
		var month = format.slice(2,4).replace("0","");
		var day = format.slice(4,6);
		var daySuffix = "";
		var hour = format.slice(6,8);
		var minute = format.slice(8,10);

		if (day == "01" || day == "11" || day == "21" || day == "31") daySuffix = "st";
		else if (day == "02" || day == "12" || day == "22") daySuffix = "nd";
		else if (day == "03" || day == "13" || day == "23") daySuffix = "rd";
		else daySuffix = "th";

		if (day.slice(0,1) == "0") day = day.replace("0","");

		var monthArray = ["January","Febuary","March","April","May","June","July","August","September","October","Novemeber","December"]

		message.channel.send(`This build of MagicSpells is version ${version} and was built at ${hour}:${minute} on the ${day}${daySuffix} of ${monthArray[parseInt(month) - 1]}, 20${year}.`)
	}
}
