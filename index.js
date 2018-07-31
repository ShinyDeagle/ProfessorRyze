//External NPMs
const Discord = require('discord.js');
const fs = require('fs');
const config = require("./config.json");

//File Requires
const versionJS = require("./version.js");
const fetchJS = require("./fetch.js");
const emojiDB = require("./emojiDB.js");
const submitJS = require("./submit.js");
const challengeJS = require("./chalEmbed.js");
const adminJS = require("./admin.js");
const chartJS = require("./chart.js");
const effectJS = require("./EFFConverter.js");
const statsJS = require("./stats.js")
const profileJS = require("./profile.js")

var bot = new Discord.Client()

//user Variables

var ownerid = 164733971316342784;

//Project builder Variables
var inchallengebuilder = false;
var challengebuilderid = 0;

//Challenge Builder Variables
var challengename = "Empty"
var challengetheme = "Empty"
var challengerules = "Empty"
var challengeinstructions = "Empty"
var challengetime = "24 Hours"
var challengeguide = "https://i.imgur.com/2hXcHrZ.gif"

//File sending
var reason = "";

//UserCount
var memberSize = 0;

function updateGuildCount() {
  chartJS.updateGuildCount(memberSize);
}

//Other Variables
console.log("HP, Check. Mana, Check. Ready To Go.")

bot.on("ready", function() {
	updateGuildCount();
  bot.user.setUsername("Professor Ryze")

  var valid = ["335237931633606656", "383216614851739658", "369109149809770497"]

  bot.guilds.forEach(g => {
    if (!valid.includes(g.id))
      g.leave();
  })

  var msguild = bot.guilds.get("335237931633606656")

  msguild.fetchMembers().then(g => {
    bot.user.setActivity(`${g.members.size} MS Configers`, {
      type: 'LISTENING'
    })
    memberSize = g.members.size;
  })
});

bot.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  bot.channels.get("390754803959070720").send(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)

	var valid = ["335237931633606656", "383216614851739658", "369109149809770497"]

  if (!valid.includes(guild.id)) guild.leave();
});

bot.on("guildMemberAdd", member => {
	updateGuildCount();
  var embed = new Discord.RichEmbed()
    .setTitle('Welcome Screen')
    .setColor(092030)
    .setThumbnail("https://i.imgur.com/zEOYDNJ.png")
    .setDescription("Here is a basic rundown")
    .setFooter("Maintained by Rifle D. Luffy#1852", "https://i.imgur.com/zEOYDNJ.png")
    .addField("Commands", "?commandlist | Dyno Commands\n~cmds | Professor Ryze Commands.")
    .addField("Rules", "View the discord rules on the #welcome channel\n\nWhen using the support channels, there are some special terms you'll need to get acquainted with.\n\nRead them by using ~rules support.\nTo gain access to the support channels, you must **?acceptrules** the rules.")
  member.send(embed);

  var msguild = bot.guilds.get("335237931633606656");

  msguild.fetchMembers().then(g => {
    bot.user.setActivity(`${g.members.size} MS Configers`, {
      type: 'LISTENING'
    })
    memberSize = g.members.size;
  })
})

bot.on("guildMemberRemove", member => {
  var msguild = bot.guilds.get("335237931633606656")

  msguild.fetchMembers().then(g => {
    bot.user.setActivity(`${g.members.size} MS Configers`, {
      type: 'LISTENING'
    })
    memberSize = g.members.size;
  })
})

bot.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  bot.channels.get("390754803959070720").send(`I have been removed from: ${guild.name} (id: ${guild.id})`)
});

bot.on("error", error => {
	console.log(error);
})

bot.on("message", function(message) {
  if (message.author.equals(bot.user)) return;

  var args = message.content.substring(config.prefix.length).split(" ");

  if (args.length < 2)
    for (i = 1; i < 4; i++) args[i] = "";

  // ~ commands
  if (message.content.startsWith(config.prefix)) {

    switch (args[0].toLowerCase()) {
			case "profile":
				profileJS.generateProfile(bot, message, args, message.author.id);
				break;
      case "convert":
        effectJS.readMessage(bot, message, args);
        break;
      case "chart":
        chartJS.createChart(bot, message, args);
        break;
      case "version":
        versionJS.parseVersion(bot, message, args);
        break;
      case "fetchall":
        var valid = fetchJS.validate(bot, message, args);
        if (!valid) return;
        else fetchJS.fetchAll(bot, message, args);
        break;
      case "fetch":
        var valid = fetchJS.validate(bot, message, args);
        if (!valid) return;
        else fetchJS.fetchKeyword(bot, message, args);
        break;
        break;
      case "submit":
        submitJS.submit(bot, message, args);
        break;
      case "fetchstats":
        if (message.content.includes(bot.user.id)) return;
        if (!args[1]) return;
        else if (args[1].toLowerCase() == "user") {
          var mentioned = message.mentions.members.first();
          if (mentioned == null) return
          statsJS.produceIndividualReport(bot, message, args, mentioned.id);
          break;
        } else if (args[1].toLowerCase() == "leaderboard") {
          if (!args[2]) return;
          if (parseInt(args[2].toLowerCase()) < 0 || isNaN(parseInt(args[2].toLowerCase()))) return;
          statsJS.produceLeaderboardReport(bot, message, args, args[2].toLowerCase());
        }
        break;
      case "rules":
        if (!args[1].toLowerCase()) message.reply("Invalid argument, refer to my help page via ~cmds or mention me.")

        switch (args[1].toLowerCase()) {
          case "support":
            message.reply("By using this command you agree to the rules of the support channel.\n\nYou also aknowledge that you've read over the #welcome channel and know the rules.\n\n```yml\nRules:\n\n1. Always use and follow the support format when asking for help repairing a spell.\n2. Only use the support channel for MagicSpells related issues.\n3. Keep arguments non-existent in the channel.\n4. Move to another support channel if one is currently being used.\n5. Acknowledge that just posting a config saying `help` can result in a instant support ban.```")
            break;
        }
        break;

      case "chal": //Challenge Builder Commands
        challengeJS.chalBuilder(bot, message, args);
        break;

      case "admin":
        adminJS.admin(bot, message, args);
        break;

      case "cmds":
        var embed = new Discord.RichEmbed()
          .setTitle("Command List")
          .setColor(092030)
          .setAuthor("Professor Ryze - MagicSpells ~help and test bot")
          .setThumbnail("https://i.imgur.com/zEOYDNJ.png")
          .setDescription("Here is a list of available commands. **Base Commands** don't do anything on their own. You need to add a secondary argument to use it.")
          .setFooter("Maintained by Rifle D. Luffy#1852", "https://i.imgur.com/zEOYDNJ.png")
          .addField("\🔗 Links", "~invite | **Base Command**\n **⤷** ~invite bot | Bot's Invite Link\n **⤷** ~invite msdiscord | **Official MagicSpells Discord** Link\n **⤷** ~invite botdiscord | Development and Help Center for the bot")
          .addField("\↩️ Fetch File", "~fetch | **Base Command**\n **⤷** ~fetch [filename] | fetches a link to the spell on the Github .\n **⤷** ~fetchall [category] | fetchs names of all files in that category\n**Example: instant, targeted.**\n**~fetch and ~fetchall only retrieve .java files**")
          .addField("\📅 View User Counts", "~chart | **Base Command**\n **⤷** ~chart [timescale] [date-range] \n **timescale**: day, week, month, year \n **date-range**: any interger number")
        message.channel.send(embed);
        bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
        break;

      case "invite":
        switch (args[1].toLowerCase()) {
          case "bot":
            message.channel.send("Here is my invite link which includes my necessary permissions.")
            message.channel.send("https://discordbots.org/bot/382794133451964416")
            bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
            break;

          case "msdiscord":
            message.channel.send("Join the official MagicSpells discord at...")
            message.channel.send("https://discord.gg/Q3Hj7wz")
            bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
            break;

          case "botdiscord":
            message.channel.send("Contact the maintainer of the bot at the Professor Ryze Development Discord.")
            message.channel.send("https://discord.gg/yvvbfuk")
            bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
            break;

          default:
            message.channel.send("Invalid Argument, use ~cmds for the correct syntax.")
            bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked an invalid command which was " + message.content)
            break;
        }
        break;
    } //end of switch
  }
})
bot.login(config.token);
