const Discord = require('discord.js');
const fs = require('fs');
const chartJS = require('./chart.js');

var bot = new Discord.Client()

var establishedDate = "Fri Jul 14 2017";

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

function getDatesInRange(timescale, count) {

	var dates = [];
	var now = new Date();

	switch (timescale) {
		case "day":
		case "days":
		case "d":
			for (i = 0; i < count; i++) {
				if (i == 0) dates.push(now.toDateString());
				else {
					var newDate = getDateStringBefore(dates[i - 1]);
					if (newDate == establishedDate) break;
					else dates.push(newDate);
				}
			}
			break;

		case "week":
		case "weeks":
		case "wk":
		case "w":
			for (i = 0; i < count * 7; i++) {
				if (i == 0) dates.push(now.toDateString());
				else {
					var newDate = getDateStringBefore(dates[i - 1]);
					if (newDate == establishedDate) break;
					else dates.push(newDate);
				}
			}
			break;

		case "month":
		case "months":
		case "m":
			for (i = 0; i < count * 31; i++) {
				if (i == 0) dates.push(now.toDateString());
				else {
					var newDate = getDateStringBefore(dates[i - 1]);
					if (newDate == establishedDate) break;
					else dates.push(newDate);
				}
			}
			break;

		case "year":
		case "years":
		case "y":
			for (i = 0; i < count * 365; i++) {
				if (i == 0) dates.push(now.toDateString());
				else {
					var newDate = getDateStringBefore(dates[i - 1]);
					if (newDate == establishedDate) break;
					else dates.push(newDate);
				}
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

function backupGuildData() {
	fs.writeFile(`./chartDataBackups/${getCurrentDate()}.json`, JSON.stringify(chartData), (err) => {
		if (err) console.error(err)
	});
}

module.exports = {

	updateGuildCount: (count) => {
		if (!chartData.dates[getCurrentDate()]) chartData.dates[getCurrentDate()] = {
			users: count
		}
		chartData.dates[getCurrentDate()].users = count;
		writeChartData();
		backupGuildData();
	},

	//Currently inactive since data has already been extrapolated.
	//Try not to call it at any point
	extrapolateCount: () => {

		var intialCount = chartData.dates[getCurrentDate()].users;

		var finalDay = "Fri Jul 14 2017"
		var extrapolatedDay = getCurrentDate();
		var extrapolatedCount = chartData.dates[extrapolatedDay].users;
		var countBefore = extrapolatedCount;

		var i = 0;
		while (extrapolatedDay != finalDay) {
			if (!chartData.dates[extrapolatedDay]) {
				if (countBefore < 10) break;
				var newCount = countBefore - 1;
				if (i == 3 || i == 5) newCount--;
				if (i == 10) i = 0;
				i++;
				chartData.dates[extrapolatedDay] = {
					users: newCount
				}
				countBefore = chartData.dates[extrapolatedDay].users;
				extrapolatedDay = getDateStringBefore(extrapolatedDay);
			} else {
				extrapolatedDay = getDateStringBefore(extrapolatedDay);
				countBefore = extrapolatedCount;
				console.log(countBefore);
				if (chartData.dates[extrapolatedDay]) extrapolatedCount = chartData.dates[extrapolatedDay].users;
				continue;
			}
		}
		writeChartData();
	},

	createChart: (client, message, args) => {

		var range = "";

		if (!args[1] || !args[2]) return;
		
		var timescale = args[1].toLowerCase();
		var limit = parseInt(args[2].toLowerCase());

		var dates = getDatesInRange(timescale, limit);
		var dateData = getUserDateData(dates);

		dates = dates.reverse();

		for (i = 0; i < dates.length; i++) {
			if (!chartData.dates[dates[i]]) {
				dates.splice(i,1);
				i--;
			}
		}

		var dateArray = [];

		for (i = 0; i < dates.length; i++) dateArray.push(`${dates[i]}: ${dateData[i]} users`)

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
				change = `There has been a ${changePercent}% [${finalCount - initialCount} users] decrease in user count`;
				break;
			case "increase":
				change = `There has been a ${changePercent}% [${finalCount - initialCount} users] increase in user count`;
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

		var sizeOfField = 7;
		var totalFields = Math.ceil(dateArray.length / sizeOfField);

		//The embed breaks if I have more than 24 fields. I'm using 2 already so I can also use 22.
		if (totalFields > 22) totalFields = 22;

		var weekChart = new Discord.RichEmbed()
			.setTitle(`User Count in a ${limit} ${timescale} period`)
			.setColor(092030)
			.setThumbnail(message.author.avatarURL)
			for (i = 0; i < totalFields; i++) {
				var tempArray = [];
				for (j = 0 + i * sizeOfField; j < sizeOfField + i * sizeOfField; j++) {
					tempArray.push(dateArray[j]);
				}
				weekChart.addField(`Week ${i}`, tempArray, true);
			}
			weekChart.addField("Statistics",`${change}\nThe date with the most users [${highDay[1]}] was ${highDay[0]}\nThe date with the least users [${lowDay[1]}] was ${lowDay[0]}`, true)
			weekChart.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/zEOYDNJ.png")
			weekChart.addField("Notes","Dates before May 24 2018 have been extrapolated")
		message.channel.send(weekChart);
	}

}
