//External NPMs
const Discord = require('discord.js');
const fs = require('fs');
const randomInt = require('random-int');
const config =  require("./config.json");
const download = require('download');
const finder = require('find-files');
const glob = require('glob');
const readdirp = require('readdirp');
//const ChartJSNode = require('chartjs-node');

//File Requires
const versionJS = require("./version.js");
const fetchJS = require("./fetch.js");
const emojiDB = require("./emojiDB.js");
const reportBugJS = require("./reportbug.js");
const submitJS = require("./submit.js");
const challengeJS = require("./chalEmbed.js");
const adminJS = require("./admin.js");
//const chartJS = require("./chart.js");

let bugData = JSON.parse(fs.readFileSync('./bugData.json', 'utf8'));
let issueData = JSON.parse(fs.readFileSync('./issueData.json', 'utf8'))

var bot = new Discord.Client()

const fetch = require('snekfetch')

//user Variables

var ownerid = 164733971316342784;

//Project builder Variables
var inchallengebuilder = false;
var challengebuilderid = 0;
var bugbuilder = [];

//Challenge Builder Variables
var challengename = "Empty"
var challengetheme = "Empty"
var challengerules = "Empty"
var challengeinstructions = "Empty"
var challengetime = "24 Hours"
var challengeguide = "https://i.imgur.com/2hXcHrZ.gif"

//File sending
var reason = "";

/*Fetch Code

new fetch('POST', `https://discordbots.org/api/bots/${bot.user.id}/stats`)
.set('Authorization', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4Mjc5NDEzMzQ1MTk2NDQxNiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTEzMTczMzk5fQ.HhptrnG3rgkZc6wFec9jzLvgbUhRdUCgXyia6eEM0bw")
.send({ server_count: bot.guilds.size})
.then(() => console.log('Updated dbots.org status'))
.catch((e) => e);
*/

//Other Variables
console.log("HP, Check. Mana, Check. Ready To Go.")

bot.on("ready", function()
{
	bot.user.setUsername("Professor Ryze")
	
	var valid = ["335237931633606656","383216614851739658","369109149809770497"]
	
	bot.guilds.forEach(g => {
		if (!valid.includes(g.id))
		g.leave();
	})
	
	var msguild = bot.guilds.get("335237931633606656")
	
	msguild.fetchMembers().then(g =>
		{
			bot.user.setActivity(`${g.members.size} MS Configers`,{type: 'WATCHING'})
		})
	});
	
	bot.on("guildCreate", guild =>
	{
		// This event triggers when the bot joins a guild.
		console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
		bot.channels.get("390754803959070720").send(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
	});
	
	bot.on("guildMemberAdd", member =>
	{
		var embed = new Discord.RichEmbed()
		.setTitle('Welcome Screen')
		.setColor(092030)
		.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
		.setDescription("Here is a basic rundown")
		.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
		.addField("Commands","?commandlist | Dyno Commands\n~cmds | Professor Ryze Commands\n â¤· Alternatively, you can mention the bot.")
		.addField("Rules","View the discord rules on the #welcome channel\n\nWhen using the support channels, there are some special terms you'll need to get acquainted with.\n\nRead them by using ~rules support.\nTo gain access to the support channels, you must **?acceptrules** the rules.")
		member.send(embed);
		
		var msguild = bot.guilds.get("335237931633606656")
		
		msguild.fetchMembers().then(g =>
			{
				bot.user.setActivity(`${g.members.size} MS Configers`,{type: 'WATCHING'})
			})
		})
		
		bot.on("guildMemberRemove", member =>
		{
			var msguild = bot.guilds.get("335237931633606656")
			
			msguild.fetchMembers().then(g =>
				{
					bot.user.setActivity(`${g.members.size} MS Configers`,{type: 'WATCHING'})
				})
			})
			
			bot.on("guildDelete", guild =>
			{
				// this event triggers when the bot is removed from a guild.
				console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
				bot.channels.get("390754803959070720").send(`I have been removed from: ${guild.name} (id: ${guild.id})`)
			});
			
			bot.on("message", function(message)
			{
				
				function ResetEmbedChallenge()
				{
					challengename = "Empty"
					challengetheme = "Empty"
					challengerules = "Empty"
					challengeinstructions = "Empty"
					challengetime = "24 Hours"
					challengeguide = "https://i.imgur.com/2hXcHrZ.gif"
				}
				
				if (message.author.equals(bot.user)) return;
				
				var args = message.content.substring(config.prefix.length).split(" ");
				
				if (args.length < 2)
				{
					for (i = 1; i < 4; i++)
					{
						args[i] = "";
					}
				}
				
				if (message.content.includes(bot.user.id))
				{
					var embed = new Discord.RichEmbed()
					.setTitle("Command List")
					.setColor(092030)
					.setAuthor("Professor Ryze - MagicSpells ~help and test bot")
					.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
					.setDescription("Here is a list of available commands. **Base Commands** don't do anything on their own. You need to add a secondary argument to use it.")
					.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
					.addField("\ðŸ”— Links", "~list | **Base Command**\n â¤· ~list nisovin | Displays links from the MS nisovin page\n â¤· ~list github | Displays links from the MS github page\n â¤· ~list tutorial | Lunks to various tutorials for MS users\n~invite | **Base Command**\n â¤· ~invite bot | Bot's Invite Link\n â¤· ~invite msdiscord | **Official MagicSpells Discord** Link\n â¤· ~invite botdiscord | Development and Help Center for the bot")
					.addField("\â†©ï¸ Fetch File","~fetch | **Base Command**\n â¤· ~fetch [filename] | Provides Direct Links to files from the Github Page.\n**[Only Retrieves .java files]**")
					.addField("\ðŸ“š Rules","~rules | **Base Command**\n â¤· ~rules support | Lists the rules for the usage of support channels.")
					.addField(":beetle: Sumbit a Bug Report","~reportbug | **Base Command**\n â¤· ~reportbug start | Starts the bug report builder\n â¤· ~reportbug help | Displays an important message related to the reportbug command.")
					.addField("\ðŸ“‹ Suggest Ideas or Fixes", "~suggest [message] | Sent to development discord.")
					message.channel.send(embed);
					bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
				}
				
				var suggestargs = message.content.substring(config.prefix.length).slice(8);
				
				function CheckGuild() {
					if (message.channel.type === "text")
					{
						//There are two discords that piss me off. These ones are blocked.
						if (message.guild.id == 264445053596991498) return;
						if (message.guild.id == 110373943822540800) return;
					}
				}
				
				if (!message.content.startsWith(config.prefix)) CheckGuild();
				
				if (message.content.startsWith(config.prefix)) // ~ commands
				{
					//I'm going to register their bug data if they are new.
					if (!bugData[message.author.id]) bugData[message.author.id] =
					{
						buglevel: 0,
						bugmsv: "Empty",
						bugsv: "Empty",
						bugdesc: "Empty"
					}
					
					switch (args[0].toLowerCase())
					{
						//case "draw":
						//console.log("Lets Go");
						//chartJS.createWeekChart(bot, message, args);
						//break;
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
						case "rb":
						case "reportbug":
							reportBugJS.reportBug(bot, message, args);
							break;
						case "submit":
							submitJS.submit(bot, message, args);
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
							.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
							.setDescription("Here is a list of available commands. **Base Commands** don't do anything on their own. You need to add a secondary argument to use it.")
							.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
							.addField("\ðŸ”— Links", "~list | **Base Command**\n â¤· ~list nisovin | Displays links from the MS nisovin page\n â¤· ~list github | Displays links from the MS github page\n â¤· ~list tutorial | Lunks to various tutorials for MS users\n~invite | **Base Command**\n â¤· ~invite bot | Bot's Invite Link\n â¤· ~invite msdiscord | **Official MagicSpells Discord** Link\n â¤· ~invite botdiscord | Development and Help Center for the bot")
							.addField("\â†©ï¸ Fetch File","~fetch | **Base Command**\n â¤· ~fetch [filename] | Provides Direct Links to files from the Github Page.\n**[Only Retrieves .java files]**")
							.addField("\ðŸ“š Rules","~rules | **Base Command**\n â¤· ~rules support | Lists the rules for the usage of support channels.")
							.addField(":beetle: Sumbit a Bug Report","~reportbug | **Base Command**\n â¤· ~reportbug start | Starts the bug report builder\n â¤· ~reportbug help | Displays an important message related to the reportbug command.")
							.addField("\ðŸ“‹ Suggest Ideas or Fixes", "~suggest [message] | Sent to development discord.")
							message.channel.send(embed);
							bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
							break;
						
						case "suggest": //suggest commands
							if (args[1].toLowerCase() != "") {
								message.channel.send("Your suggestion was sent to the Professor Ryze Development Discord. Thank You!")
								bot.channels.get("385498891744706571").send(message.author.username + "/" + message.author.id + " suggested " + suggestargs)
								break;
							}
							if (args[1].toLowerCase() == "") {
								message.channel.send("You need to add something after ~suggest if you want to suggest something.")
								bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
								break;
							}
							break;
						case "invite":
							switch(args[1].toLowerCase()) {
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
						// troubleshoot command
						
						case "troubleshoot":
						
						switch (args[1].toLowerCase())
						{
							case "effects":
								var embed = new Discord.RichEmbed()
								.setTitle("Useful Links")
								.setColor(092030)
								.setAuthor("Professor Ryze - MagicSpells ~cmds bot")
								.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
								.setDescription("For those who encounter problems when setting effects within MagicSpells.")
								.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord. This bot was created to aid users of the MagicSpells Plugin for Minecraft 1.9 to 1.12.2", "https://i.imgur.com/vzbca9G.jpg")
								.addField("Common Problems", "With reference to the spell effects page at http://nisovin.com/magicspells/spelleffects")
								.addField("I can't see my effect!", "Make sure that all of the configuration options within the effect like ``position:``, ``effect:`` and ``particle-name:`` are spelled correctly, valid and where you want the effect to appear.")
								.addField("I can't hear my sound effect!", "The sounds in the nisovin page are mostly outdated. The most up-to-date database for Minecraft 1.9+ sounds are on the official Minecraft page at https://minecraft.gamepedia.com/Sounds.json.")
								.addField("I can't hear my custom sound effect!", "Sounds that may be defined through a resource pack of any kind have a sounds.json file that store all the sounds. Make sure that the name of the sound like ``custom.tazer`` are the same as the ones in the sounds.json file within the resource pack.")
								.addField("I still can't see my effect!", "Make sure that each effect you list under the spell supports its position and have a name defined before the configuration options of the effect.")
								.addField("Example", "```yml\neffects:\n  [name-of-effect-goes-here]:\n    position: caster\n    effect: hearts```")
								message.channel.send(embed);
								bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
								break;
							
							default:
								message.channel.send("Invalid Argument, use ~cmds for the correct syntax.")
								bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked an invalid command which was " + message.content)
								break;
						}
						break;
						
						// list command
						
						case "list":
						switch(args[1].toLowerCase())
						{
							case "nisovin":
								var embed = new Discord.RichEmbed()
								.setTitle("Useful Links")
								.setColor(092030)
								.setAuthor("Professor Ryze - MagicSpells ~cmds bot")
								.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
								.setDescription("Here is a list of links that would be useful in one way or another while you're coding your own spells.")
								.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord. This bot was created to aid users of the MagicSpells Plugin for Minecraft 1.9 to 1.12.2", "https://i.imgur.com/vzbca9G.jpg")
								.addField("List of Available Spells", "http://nisovin.com/magicspells/spelllist")
								.addField("General Configuration", "http://nisovin.com/magicspells/generalconfiguration")
								.addField("Spell Configuration", "http://nisovin.com/magicspells/spellconfiguration")
								.addField("Spell Effects", "http://nisovin.com/magicspells/spelleffects")
								.addField("Mana Configuration", "http://nisovin.com/magicspells/manaconfiguration")
								.addField("Magic Zone Configuration", "http://nisovin.com/magicspells/nomagiczones")
								.addField("Modifiers", "http://nisovin.com/magicspells/modifiers")
								.addField("Variables", "http://nisovin.com/magicspells/variables")
								.addField("Permissions", "http://nisovin.com/magicspells/permissions")
								.addField("Pre-defined Items", "http://nisovin.com/magicspells/predefineditems")
								message.channel.send(embed);
								bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
								break;
							
							case "github":
								var embed = new Discord.RichEmbed()
								.setTitle("Useful Links")
								.setColor(092030)
								.setAuthor("Professor Ryze - MagicSpells ~cmds bot")
								.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
								.setDescription("Here is a list of links that would be useful in one way or another while you're coding your own spells.")
								.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord. This bot was created to aid users of the MagicSpells Plugin for Minecraft 1.9 to 1.12.2", "https://i.imgur.com/vzbca9G.jpg")
								.addField("List of Effectlib Effects", "https://goo.gl/1LKW5U")
								.addField("List of Compatible Particle Effects", "https://goo.gl/rGPXqv")
								.addField("All Instant Spells", "https://goo.gl/MxyYWu")
								.addField("All Targeted Spells", "https://goo.gl/PNfCHe")
								.addField("All Buff Spells", "https://goo.gl/PSHPPF")
								.addField("All Command Spells", "https://goo.gl/aAEyDQ")
								.addField("All Passive Spell Listeners", "https://goo.gl/jnoHLh")
								.addField("All Possible Modifiers", "https://goo.gl/tajSP2")
								message.channel.send(embed);
								bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
								break;
							
							case "tutorial":
								var embed = new Discord.RichEmbed()
								.setTitle("Useful Links")
								.setColor(092030)
								.setAuthor("Professor Ryze - MagicSpells ~cmds bot")
								.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
								.setDescription("Thanks to Niblexis for these helpful tutorials.")
								.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord. This bot was created to aid users of the MagicSpells Plugin for Minecraft 1.9 to 1.12.2", "https://i.imgur.com/vzbca9G.jpg")
								.addField("Reading the Github", "https://goo.gl/niAMhq")
								.addField("Particle Projectiles", "https://goo.gl/tk4Xdi")
								.addField("General Debugging", "https://goo.gl/jZj8G2")
								.addField("Variables I - Intro", "https://goo.gl/g6VeYj")
								.addField("Variables II - Meta", "https://goo.gl/d6h6ST")
								.addField("Modifiers I - Intro", "https://goo.gl/Mmg5ws")
								.addField("Modifiers II - Collections", "https://goo.gl/pb317Z")
								message.channel.send(embed);
								bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
								break;
						}
						break;
					} //end of switch
				}
				fs.writeFile("./bugData.json", JSON.stringify(bugData), (err) => {
					if (err) console.error(err)
				});
				fs.writeFile("./issueData.json", JSON.stringify(issueData), (err) => {
					if (err) console.error(err)
				});
			})
			bot.login(config.token);
