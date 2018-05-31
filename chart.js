const ChartJSNode = require('chartjs-node');
const ChartJS = require('chartjs');
const Discord = require('discord.js');

var bot = new Discord.Client()

let chartData = JSON.parse(fs.readFileSync('./chartData.json', 'utf8'));

function getGuildCount() {
	var msguild = client.guilds.get("335237931633606656")
	var count = 0;

  msguild.fetchMembers().then(g => {
	  count = g.members.size;
  })

	return count;
}

function checkCurrentDate() {
	var now = new Date()
	now = now.toDateString();

	if (chartData.currentdate != now) {
		chartData.currentdate = now;
		chartData.dates[now] = {
			users: getGuildCount()
		}
		return true;
	}
	else return false;
}

function getCurrentDate() {
	return chartData.currentdate;
}

function getDateStringBefore(dateString) {
	var date = new Date(dateString);
	var dayMilliseconds = 86400000;

	date = new Date(date.now() - dayMilliseconds);
	return date.toDateString();
}

function getDatesInRange(range) {
	var dates = [];
	var now = new Date();

	switch (range) {
		default:
			return;

		case "7D":
			for (i = 0; i < 7; i++) {
				if (i = 0) dates.push(now.toDateString());
				dates.push(getDateStringBefore(dates[i - 1]));
			}
			break;

		case "14D":
			for (i = 0; i < 14; i++) {
				if (i = 0) dates.push(now.toDateString());
				dates.push(getDateStringBefore(dates[i - 1]));
			}
			break;

		case "21D":
			for (i = 0; i < 21; i++) {
				if (i = 0) dates.push(now.toDateString());
				dates.push(getDateStringBefore(dates[i - 1]));
			}
			break;
	}
}

function getUserDateData(dates) {
	var data = [];
	for (date in dates) {
		if (!chartData.dates[date]) continue;
		data.push(chartData.dates[date].users);
	}
	return data;
}

module.exports= {

	updateGuildCount: (client, message, args) => {
		chartData.dates[getCurrentDate()].users = getGuildCount();
	},

	createWeekChart: (client, message, args) => {
		var weekChart = new ChartJSNode(600, 600);
		var range = args[1].toUpperCase();
		var weekChartOptions = {
			type: "bar",
			data: {
				labels: getDatesInRange(range),
				datasets:[{
					label: "Date",
					data: getUserDateData(getDatesInRange(range))
				}],
				backgroundColor: "blue",
				borderWidth: 1,
				borderColor: "#77"

		}
		weekChart.drawChart(weekChartOptions)
		.then(streamResult => {
			streamResult.stream;
    	streamResult.length;

			message.channel.send("Chart has been drawn, let me pull it up for you");
			return chartNode.writeImageToFile('image/png', './chartJS.png');
		})

	}

}

fs.writeFile("./chartData.json", JSON.stringify(bugData), (err) => {
	if (err) console.error(err)
});
