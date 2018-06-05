const Discord = require('discord.js');
const fs = require('fs');
const chartJS = require('./chart.js');

var bot = new Discord.Client()

let chartData = JSON.parse(fs.readFileSync('./chartData.json', 'utf8'));

var json = chartData;

require('isomorphic-fetch')
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox ({
	accessToken: '14NyOEb0iqwAAAAAAAAA7wQhJT2b3Yir0cdX96qaxO8U-tmTjtXW9I0qpXDqPezE'
})
.filesUpload({
	contents: json,
	path: "/usercount",
	mode: "add",
	autorename: true
})
.then(console.log, console.error);

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

		case "112D":
			for (i = 0; i < 112; i++) {
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

	uploadGuildData: () => {
	},

	updateGuildCount: (count) => {
		if (!chartData.dates[getCurrentDate()]) chartData.dates[getCurrentDate()] = {
			users: count
		}
		chartData.dates[getCurrentDate()].users = count;
		writeChartData();
	},

	extrapolateCount: () => {

		var intialCount = chartData.dates[getCurrentDate()].users;

		var finalDay = "Fri Jul 14 2017"
		var extrapolatedDay = getCurrentDate();
		console.log(extrapolatedDay);
		var extrapolatedCount = chartData.dates[extrapolatedDay].users;
		console.log(extrapolatedCount);
		var countBefore = extrapolatedCount;
		console.log(countBefore);

		var i = 0;
		while (extrapolatedDay != finalDay) {
			if (!chartData.dates[extrapolatedDay]) {
				console.log("Doesn't exist, going to add data");
				if (countBefore < 10) break;
				var newCount = countBefore - 1;
				if (i == 3 || i == 5) newCount--;
				if (i == 10) i = 0;
				i++;
				console.log(newCount);
				chartData.dates[extrapolatedDay] = {
					users: newCount
				}
				countBefore = chartData.dates[extrapolatedDay].users;
				console.log(`${extrapolatedDay}:${chartData.dates[extrapolatedDay].users}`);
				extrapolatedDay = getDateStringBefore(extrapolatedDay);
			} else {
				extrapolatedDay = getDateStringBefore(extrapolatedDay);
				countBefore = extrapolatedCount;
				console.log(countBefore);
				if (chartData.dates[extrapolatedDay]) extrapolatedCount = chartData.dates[extrapolatedDay].users;
				console.log(`Skipped ${extrapolatedDay}`);
				console.log(extrapolatedCount);
				continue;
			}
		}
		writeChartData();
	},

	createChart: (client, message, args) => {

		var range = "";

		var keyword = args.join(" ").substring(6).toLowerCase();

		switch (keyword) {
			default:
			case "1 week":
				range = "7D";
				break;
			//Please do not use this until the rest of the data is filled!
			case "2 weeks":
				range = "14D"
				break;
			case "3 weeks":
				range = "21D"
				break;
			case "112 days":
				range = "112D"
				break;
		}

		var dates = getDatesInRange(range);
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

		var weekChart = new Discord.RichEmbed()
			.setTitle(`User Count in ${keyword} Period`)
			.setColor(092030)
			.setThumbnail("https://i.imgur.com/zEOYDNJ.png")
			for (i = 0; i < totalFields; i++) {
				var tempArray = [];
				for (j = 0 + i * sizeOfField; j < sizeOfField + i * sizeOfField; j++) {
					tempArray.push(dateArray[j]);
				}
				weekChart.addField(`Week ${i + 1}`, tempArray, true);
			}
			weekChart.addField("Statistics",`${change}\nThe date with the most users [${highDay[1]}] was ${highDay[0]}\nThe date with the least users [${lowDay[1]}] was ${lowDay[0]}`, true)
			weekChart.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/zEOYDNJ.png")
			weekChart.addField("Notes","Dates before May 24 2018 have been extrapolated")
		message.channel.send(weekChart);
	}

}
