const emojiDB = require("./emojiDB.js");
const Discord = require('discord.js');

var bot = new Discord.Client()
var validAdmins = [164733971316342784, 112742095978008576, 71448444065021952, 255207721001811968, 192884388747280384, 152242536381939713]

module.exports= {
	//All admin commands. Will give a detailed guide later.
	admin: (client, message, args) => {
		if (validAdmins.contains(message.author.id)) {
				if (args[1].toLowerCase() == "talk") {
					var array = [];
					for (i = 0; i < args.length; i++) array[i] = args[i];
					var channel = array[2].toLowerCase();
					array.shift();
					array.shift();
					array.shift();
					client.channels.get(channel).send(array.join(" "));
				}
				if (args[1].toLowerCase() == "fake") {
					if (!args[2])
						return message.reply("Bruh. What am I faking?")

					switch (args[2].toLowerCase())
						{
							case "join":
								message.channel.send("Oops, I almost forgot. I sent you a message about our bot commands and other info!")
								var embed = new Discord.RichEmbed()
									.setTitle('Welcome Screen')
									.setColor(092030)
									.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
									.setDescription("Let's get you well intergrated with the community. Here is a basic rundown.")
									.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
									.addField("Commands","?commandlist | Dyno Commands\n~cmds | Professor Ryze Commands\n ⤷ Alternatively, you can mention the client.")
									.addField("Rules","View the discord rules on the #welcome channel\n\nWhen using the support channels, there are some special terms you'll need to get acquainted with.\n\nRead them by using ~rules support.\nTo gain access to the support channels, you must **?acceptrules** the rules.")
								message.author.send(embed);
								break;
						}
				}
				if (args[1].toLowerCase() == "issue") {
					if (!args[2].toLowerCase())
						return message.reply("Either ***Approve*** or ***Decline*** the issue with ~issue approve/decline.")

					if (!args[3].toLowerCase())
						return message.reply("Provide the MessageID of the message containing the bug report. Make sure to ***enable*** developer options on your settings.")

					var messagecontent = "";
					message.channel.fetchMessage(args[3])
						.then(message =>
							{
								messagecontent = message.content;
							})
					switch (args[2].toLowerCase())
						{
							case "yes":
							case "ye":
							case "go":
							case "approve":
								client.channels.get("398259282899894272").send(messagecontent)

								var issuecount = issueData.count;

								Object.keys(issueData.users).forEach(function(user)
								{
									if (issueData.users[user].issues.includes(issuecount)) {
										var found = client.users.find(val => val.id == user)

										found.send("Your bug report was approved!")
										}
								})
								message.channel.send("Bug report was approved!")
								message.react("\✅")
								break;

							case "no":
							case "nah":
							case "stop":
							case "decline":
								var issuecount = issueData.count;

								Object.keys(issueData.users).forEach(function(user)
								{
									if (issueData.users[user].issues.includes(issuecount)) {
										var found = client.users.find(val => val.id == user)

										found.send("Your bug report was declined!")
										}
								})
								message.channel.send("Bug report was declined!")
								message.react("\🛑")
								break;
						}
				}
				if (args[1].toLowerCase() == "download") {
					download('RifleDLuffy/MagicSpells#master', 'test/tmp', function (err) {
							console.log(err ? 'Error' : 'Success')
						})
					function finished()
						{
							message.channel.send("MS Github was downloaded.")
							console.log("Done!")
							message.react("\✅")
						}
				}
				if (args[1].toLowerCase() == "markdown") {
					var messageid = args[2]
					var start = "```yml\n"
					var end = "```"
					message.channel.fetchMessage(messageid)
						.then(message =>
						{
							message.reply(`Your code looks ugly when you don't use proper markdown. I sent you a link to the page.`)
							message.channel.send("Here, I make it better. I even added colors too!")
							message.author.send(`https://support.discordapp.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-`)
							client.channels.get(channel).send(`${start}${message.content}${end}`)
						})
				}
				if (args[1].toLowerCase() == "paste" && args[2] != "" && args[3] != "") {
					var messageid = args[2]
					var targetchannel = args[3]

					message.channel.fetchMessage(messageid)
						.then(message =>
						{
							client.channels.get(targetchannel).send(message.content)
						})
						.catch(console.error);
				}
				if (args[1].toLowerCase() == "format") {
					var embed = new Discord.RichEmbed()
						.setTitle("Command List")
						.setColor(092030)
						.setAuthor("Professor Ryze - MagicSpells ~help and test bot")
						.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
						.setDescription("Here is a list of admin  commands. **Base Commands** don't do anything on their own. You need to add a secondary argument to use it.")
						.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
						.addField("Challenge Builder", "~admin challengebuilder start")
						.addField("Bug Report Approval", "~admin issue approve/decline [messageID]\nThe messageID is the ID of the message containing the bug report.")
					message.author.send(embed)
				}
				if (args[1].toLowerCase() == "challengebuilder" && args[2].toLowerCase() == "start") {
					challengebuilderid = message.author.id;
					inchallengebuilder = true;
					message.channel.send(`**${challengebuilderid}** is now using the bot's project builder system.*\n*View** a list of available commands in the embed below or use ~help to bring them up again.`)
					var embed = new Discord.RichEmbed()
						.setTitle("Project Builder Manager")
						.setColor(092030)
						.setAuthor("Professor Ryze - MagicSpells ~cmds bot")
						.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
						.setDescription("Here is a list of available commands.")
						.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
						.addField("Name", "~chal name", true)
						.addField("Rules", "~chal rules", true)
						.addField("Instructions", "~chal instruct", true)
						.addField("Set Contest Length", "~chal time", true)
						.addField("Genre/Theme", "~chal theme or genre", true)
						.addField("Load Preset Data", "~chal preset", true)
						.addField("Preview Embed", "~chal preview", true)
						.addField("Confirm Embed", "~chal confirm", true)
					message.channel.send(embed);
					client.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " started the project builder system.")
				}
			}
		else {
			message.channel.send("Sorry, but thats an admin-only cmd.")
			client.channels.get("392391057490444291").send(`${message.author.username} tried to use an admin command.`)
		}
	}
}
