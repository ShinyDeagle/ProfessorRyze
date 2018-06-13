const fs = require('fs');
const Discord = require('discord.js');

const emojiDB = require("./emojiDB.js");
const statsJS = require("./stats.js");

var bot = new Discord.Client()

let statData = JSON.parse(fs.readFileSync('./statData.json', 'utf8'));

function writeStatData() {
	fs.writeFile("./statData.json", JSON.stringify(statData), (err) => {
		if (err) console.error(err)
	});
}

function generateUserData(id) {
  statData.fetch.users[id] = {
    fetches: {},
    total: 0,
  }
}

function sortUsersByTotal() {
  var bigJSON = {};
  var recordTotal = -1;
  var recordName = "";

  var jsonCopy = statData.fetch.users;

  while (Object.keys(jsonCopy).length > 0) {
    Object.keys(jsonCopy).forEach(function(user) {
      var name = user;
      var total = jsonCopy[user].total;

      if (total > recordTotal) {
        recordTotal = total;
        recordName = name;
      }
    })

    bigJSON[recordName] = jsonCopy[recordName];
    delete jsonCopy[recordName];

    recordTotal = -1;
    recordName = "";
  }

  statData.fetch.users = bigJSON;
  writeStatData();
}
function sortFetchByTotal(id) {
  var bigJSON = {};
  var recordTotal = -1;
  var recordName = "";

  var jsonCopy = statData.fetch.users[id].fetches;

  while (Object.keys(jsonCopy).length > 0) {
    Object.keys(jsonCopy).forEach(function(fetch) {
      var name = fetch;
      var total = jsonCopy[fetch];

      if (total > recordTotal) {
        recordTotal = total;
        recordName = name;
      }
    })

    bigJSON[recordName] = recordTotal;
    delete jsonCopy[recordName];

    recordTotal = -1;
    recordName = "";
  }

  statData.fetch.users[id].fetches = bigJSON;
  writeStatData();
}

function getLeaderboardPosition(id) {
  for (i = 0; i < Object.keys(statData.fetch.users).length; i++) {
    var key = Object.keys(statData.fetch.users)[i];

    if (key == id) return i + 1;
  }
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

function backupStatData() {
	fs.writeFile(`./statDataBackups/${getCurrentDate()}.json`, JSON.stringify(statData), (err) => {
		if (err) console.error(err)
	});
}

//Oh my god, he uses StackOverFlow Code. What a bad guy!!!!
function getOrdinalSuffix(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

module.exports = {
  incrementFetchData: (id, fetchName) => {
    //Is that user in the system? If not create them.
    if (!statData.fetch.users[id]) generateUserData(id);

    //Is there result in their system? Create it.
    if (!statData.fetch.users[id].fetches[fetchName]) statData.fetch.users[id].fetches[fetchName] = 0;
    //Is that the first time someone is searching that file? Add it to the global fetches
    if (!statData.fetch.globalFetches[fetchName]) statData.fetch.globalFetches[fetchName] = 0;

    //Increment all their values globally and internally.
    statData.fetch.users[id].fetches[fetchName]++;
    statData.fetch.users[id].total++;
    statData.fetch.globalFetches[fetchName]++;
    statData.fetch.total++;

    writeStatData();
    backupStatData();
  },
  produceLeaderboardReport: (client, message, args, limit) => {
    sortUsersByTotal();

    var topString = "";
    var globalTotal = statData.fetch.total;

    for (i = 0; i < limit; i++) {
      if (!Object.keys(statData.fetch.users)[i]) break;
      var id = Object.keys(statData.fetch.users)[i];
      var user = client.users.find(val => val.id == id)
      var username = user.username;
      var total = statData.fetch.users[id].total;
      topString += `${username}: ${total} - ${((total / globalTotal) * 100).toFixed(1)}%\n`;
    }

    var embed = new Discord.RichEmbed()
      .setTitle(`Global | Top ${limit} Fetch Statistics`)
      .addField("User: Total Fetches - % of Total Amount",`${topString}`)
      .setThumbnail(message.author.avatarURL)
      .setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/zEOYDNJ.png")
      .setTimestamp()
    message.channel.send(embed);
  },
  produceIndividualReport: (client, message, args, requestedID) => {
    //Lets find and store that user. It's annoying to try and do it halfway-through
    var user = client.users.find(val => val.id == requestedID);

    if (!statData.fetch.users[user.id]) generateUserData(user.id);

    var userFetchData = statData.fetch.users[user.id];

    //Sort their JSON Externally so that I don't have to sort it here
    sortFetchByTotal(user.id);

    //Placeholders; SHOULD NEVER BE EMPTY AT THE END
    var totalString = "";
    var specificString = "";

    //Add some data to the Total Field
    totalString += `You have a total of ${userFetchData.total} fetches!\n`;
    if (userFetchData.total == 0) totalString += `I won't bother giving you the rest of the information.\nYou don't have any fetches ${emojiDB.react("df")}\n`;
    else {
      totalString += `You account for ${(userFetchData.total / statData.fetch.total) * 100}% of all the files fetched!\n\n`;
      leaderboardPosition = getLeaderboardPosition(user.id);
      totalString += `This puts you in ${getOrdinalSuffix(leaderboardPosition)} place against ${Object.keys(statData.fetch.users).length} users!\n\n`
      var highestFetch = Object.keys(userFetchData.fetches)[0];
      //If I didn't store the fetch as a var, imagine how long this string would be!
      totalString += `Your most fetched keyword, ${highestFetch}, accounts for ${(userFetchData.fetches[highestFetch] / statData.fetch.globalFetches[highestFetch]) * 100}% of the times it was fetched`;
    }

    //Lets list the specific information
    if (userFetchData.total == 0) specificString += "Empty... Actually fetch some files first";
    else {
      specificString += `You have fetched ${Object.keys(userFetchData.fetches).length} unique keywords! Here are all of them...\n\n`;
      for (i = 0; i < Object.keys(userFetchData.fetches).length; i++) {
        specificString += `${Object.keys(userFetchData.fetches)[i]}: ${userFetchData.fetches[Object.keys(userFetchData.fetches)[i]]}\n`;
      }
    }

    //Creating the embed
    var embed = new Discord.RichEmbed()
      .setTitle(`${user.username}'s Fetch Statistics`)
      .addField("Totals",totalString)
      .addField("Specifics",specificString)
      .setThumbnail(user.avatarURL)
      .setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/zEOYDNJ.png")
      .setTimestamp()
    message.channel.send(embed);
  }
}
