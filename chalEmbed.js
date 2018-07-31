const emojiDB = require("./emojiDB.js");
const Discord = require('discord.js');

var bot = new Discord.Client()

module.exports= {

	chalBuilder: (client, message, args) => {
		//Challenge Embed
		var chalembed = new Discord.RichEmbed()
			.setTitle(`A MagicSpells Hosted Spell-File Challenge`)
			.setColor([255, 165, 0])
			.setAuthor(`Created by ${message.author.username} called ${challengename}`)
			.setThumbnail("https://i.imgur.com/zEOYDNJ.png")
			.setFooter("Maintained by Rifle D. Luffy#1852", "https://i.imgur.com/zEOYDNJ.png")
			.setImage(`${challengeguide}`)
			.setTimestamp()
			.addField(`Name`,`${challengename}`)
			.addField(`Theme`,`${challengetheme}`)
			.addField(`Contest Duration`, `${challengetime}`)
			.addField(`Instructions`,`${challengeinstructions}`, true)
			.addField(`Rules`,`${challengerules}`, true)
			.addField(`Upload Guide`,`1. Open a private direct message chat with the Professor Ryze bot\n2. Make sure the file you are uploading is in the format, spells-filename.yml, if not you will be disqualified.\n3. Drag and Drop your file onto the chat channel\n4.Inside the comment, put ~submit spell [name of the challenge], if you do not you will be disqualified.\n5. You can send multiple versions and the most recent one will be judged when the time is over.`, true)
		if (inchallengebuilder == true && challengebuilderid == message.author.id) {
			switch (args[1].toLowerCase()) {
					default:
						message.channel.send("Invalid Command. Use ~proj help to view available commands.")
						message.react(emojiDB.react("cross"));
						break;
					case "preset":
						message.channel.send("Loaded Pre-Configured Embed Data... This destroyed any configuration options that have been used.")
						challengename = "Combo Stars";
						challengetheme = "Ridiculously Long Combo Spell";
						challengerules = "1. Combo must last 6 seconds\n2. Combo must silence the target\n3. Combo must not exceed 30s\n4. Any damage or status effect that is inflicted or happens after 30s due to the spell will be disqualified.";
						challengeinstructions = "Create a spell that keeps chaining attacks on its target for at least 6 seconds but no more than 30 seconds. 30 seconds after the combo spell started, if any damage or status effect is inflicted on the target. The spell does not count.";
						message.react(emojiDB.react("tick"));
						break;
					case "cancel":
						ResetEmbedChallenge();
						message.channel.send("All embed data was cleared. Challenge System Closing...")
						challengebuilderid = 0;
						inchallengebuilder = false;
						break;
					case "exit":
						ResetEmbedChallenge();
						message.channel.send("All embed data was cleared. Challenge System Closing...")
						challengebuilderid = 0;
						inchallengebuilder = false;
						break;
					case "confirm":
						client.channels.get("346881478094749697").send(chalembed);
						message.channel.send("Embed Created and Posted. You are free to resend the embed again after changing certain information.")
						break;
					case "help":
						var embed = new Discord.RichEmbed()
							.setTitle("Project Builder Manager")
							.setColor(092030)
							.setAuthor("Professor Ryze - MagicSpells ~cmds bot")
							.setThumbnail("https://i.imgur.com/zEOYDNJ.png")
							.setDescription("Here is a list of available commands.")
							.setFooter("Maintained by Rifle D. Luffy#1852", "https://i.imgur.com/zEOYDNJ.png")
							.addField("Name", "~chal name", true)
							.addField("Rules", "~chal rules", true)
							.addField("Instructions", "~chal instruct", true)
							.addField("Set Contest Length", "~chal time", true)
							.addField("Genre/Theme", "~chal theme or genre", true)
							.addField("Load Preset Data", "~chal preset", true)
							.addField("Preview Embed", "~chal preview", true)
							.addField("Confirm Embed", "~chal confirm", true)
						message.channel.send(embed);
						break;
					case "name":
						challengename = message.content.substring(config.prefix.length).slice(10)
						message.react(emojiDB.react("tick"));
						break;
					case "rules":
						challengerules = message.content.substring(config.prefix.length).slice(11)
						message.react(emojiDB.react("tick"));
						break;
					case "instruct":
						challengeinstructions = message.content.substring(config.prefix.length).slice(14)
						message.react(emojiDB.react("tick"));
						break;
					case "theme":
						challengetheme = message.content.substring(config.prefix.length).slice(11)
						message.react(emojiDB.react("tick"));
						break;
					case "time":
						challengetime = message.content.substring(config.prefix.length).slice(10)
						message.react(emojiDB.react("tick"));
						break;
					case "preview":
						message.channel.send("This is how it currently looks");
						message.channel.send(chalembed);
						break;
				}
		} else {
			message.channel.send("Error: Invalid User or System is being used.")
			message.react(emojiDB.react("cross"));
		}
}
}
