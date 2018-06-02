const Discord = require('discord.js');
const fs = require('fs');
const chartJS = require('./chart.js');

var bot = new Discord.Client()

let chartData = JSON.parse(fs.readFileSync('./chartData.json', 'utf8'));

function writeChartData() {
	fs.writeFile("./chartData.json", JSON.stringify(chartData), (err) => {
		if (err) console.error(err)
	});
}

function getCurrentDate() {
	var date;
	var now = new Date(Date.now()).toDateString();
	if (chartData.currentdate == now) return chartData.currentdate;
	else {
		chartData.currentdate = now;
		return now;
	}
}

function getDateStringBefore(dateString) {
	var date = new Date(dateString);
	var yesterday = new Date(date.getTime());
	yesterday.setDate(date.getDate() - 1);
	return yesterday.toDateString();
}

function getDatesInRange(range) {

	var dates = [];
	var now = new Date();

	switch (range) {
		default:
			break;

		case "7D":
			for (i = 0; i < 7; i++) {
				if (i == 0) dates.push(now.toDateString());
				else dates.push(getDateStringBefore(dates[i - 1]));
			}
			break;

		case "14D":
			for (i = 0; i < 14; i++) {
				if (i == 0) dates.push(now.toDateString());
				else dates.push(getDateStringBefore(dates[i - 1]));
			}
			break;

		case "21D":
			for (i = 0; i < 21; i++) {
				if (i == 0) dates.push(now.toDateString());
				else dates.push(getDateStringBefore(dates[i - 1]));
			}
			break;
	}
	return dates;
}

function getUserDateData(dateArray) {

	var data = [];

	for (i = 0; i < dateArray.length; i++) {
		if (!chartData.dates[dateArray[dateArray.length - 1 - i]]) continue;
		data.push(chartData.dates[dateArray[dateArray.length - 1 - i]].users);
	}
	return data;
}

module.exports = {

	updateGuildCount: (count) => {
		if (!chartData.dates[getCurrentDate()]) chartData.dates[getCurrentDate()] = {
			users: count
		}
		chartData.dates[getCurrentDate()].users = count;
		writeChartData();
	},

	createWeekChart: (client, message, args) => {

		var dates = getDatesInRange("7D");
		var dateData = getUserDateData(dates);

		dates = dates.reverse();

		var dateArray = [];

		for (i = 0; i < dates.length; i++) dateArray.push(`on ${dates[i]}, we had ${dateData[i]} users`)

		//Change
		var initialCount = dateData[0];
		var finalCount = dateData[dateData.length - 1];

		var changePercent = (((finalCount - initialCount) / initialCount) * 100).toFixed(2);

		if (changePercent < 0) {
			suffix = "decrease"
			changePercent = 0 - changePercent;
		} else if (changePercent == 0){
			suffix = ""
		}	else {
			suffix = "increase"
		}

		var change = "";

		switch (suffix) {
			case "decrease":
				change = `There has been a ${changePercent}% decrease in user count`;
				break;
			case "increase":
				change = `There has been a ${changePercent}% increase in user count`;
				break;
			default:
				change = `There has been no increase or decrease in user count`;
				break;
		}

		//Highs and Lows

		var highDay = [];
		var lowDay = [];

		var lowestCount = 1000000000000000000000000000;
		var highestCount = -lowestCount;
		var index = 0;

		for (i = 0; i < dateData.length; i++) {
			var count = dateData[i];
			if (count > highestCount) {
				highestCount = count;
				index = i;
			}
		}

		highDay[0] = dates[index];
		highDay[1] = dateData[index]

		for (i = 0; i < dateData.length; i++) {
			var count = dateData[i];
			if (count < lowestCount) {
				lowestCount = count;
				index = i;
			}
		}

		lowDay[0] = dates[index];
		lowDay[1] = dateData[index];

		var weekChart = new Discord.RichEmbed()
			.setTitle("User Count over 1 Week Period")
			.setColor(092030)
			.setThumbnail("https://i.imgur.com/zEOYDNJ.png")
			.addField("7 Day Log",dateArray)
			.addField("Statistics",`${change}\nThe date with the most users [${highDay[1]}] was ${highDay[0]}\nThe date with the least users [${lowDay[1]}] was ${lowDay[0]}`, true)
			.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/zEOYDNJ.png")
		message.channel.send(weekChart);
	}

}
