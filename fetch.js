const emojiDB = require("./emojiDB.js");
const Discord = require('discord.js');

var bot = new Discord.Client()
//Fetch.js makes use of the readdirp module. If you want to know how this works. You'll need to check the module page.

modules.export = {
	validate: (bot, message, args) => {
		if (!args[1])
			return message.reply("I need some criteria in the form of a name!")

		var hasAnyRole = false;
		var banned = false;
		var notguildmessage = false;
		var msguild = bot.guilds.get("335237931633606656")

		msguild.roles.forEach(function(role)
		{
			if (message.channel.type !== "text") {
				notguildmessage = true;
				return;
			}
			if (role.name == "@everyone") return;

			if (message.member.roles.exists(memberrole => memberrole.id === role.id)) {
				hasAnyRole = true;
			}

			if (message.member.roles.exists(memberrole => memberrole.name == "Support Banned")) {
				banned = true;
			}
		})

		if (notguildmessage) {
			message.react(emojiDB.react("cross"));
			message.channel.send("You must use this command in the MS Guild for it to function.");
			return false;
		}

		if (!hasAnyRole) {
			message.react(emojiDB.react("cross"));
			message.reply("\🤔```yml\n\nYou do not have the required roles to perform this command.\nMake sure you read and **accept** the rules at the welcome channel.\nFurther Instructions are noted.```")
			return false;
		}

		if (banned) {
			message.react(emojiDB.react("cross"));
			message.reply("You've been **banned** from support or helpful bot commands. What did you expect? \😒");
			return false;
		}
		return true;
	},
	fetchKeyword: (bot, message, args) => {
		switch (args[1].toLowerCase())
			{
				case "guide":
					var embed = new Discord.RichEmbed()
						.setTitle(`Guide to using Fetch Efficiently`)
						.addField("KeyWords","If you are looking for... Use this keyword after the filename\nModifiers - [FileName]Condition\nSpells - [FileName]Spell\nPassive Triggers - [FileName]Listener")
						.addField("Example","I am looking for a modifier, I'll type [condition] after the name of the modifier.")
						.setAuthor(`Created with Professor Ryze's Bug System`)
						.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
						.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
						.setTimestamp()
					message.channel.send(embed);
					break;
				default:
					readdirp({ root: './GitHubDownload', fileFilter: '*.java'}, function (errors, res) {
							if (errors) {
									errors.forEach(function (err) {
										console.error('Error: ', err);
									});
							}
							var datastring = "Empty";

							var embed = new Discord.RichEmbed()
								.setTitle(`File Links Found`)
								.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
								.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
								.setTimestamp()

							Object.keys(res.files).forEach(function(id) {
									var name = res.files[id]['name'];
									var path = res.files[id]['path'];
									if (name.toLowerCase() == `${args[1].toLowerCase()}.java`) {
										if (datastring == "Empty") datastring = "$|$";

										embed.addField(name,`https://github.com/TheComputerGeek2/MagicSpells/blob/master/${path}\n`)
									}
							})

							if (datastring == "Empty") {
								message.react(emojiDB.react("cross"))
								return message.channel.send("No Files Found!")
							}

							datastring = datastring.replace("$|$","");
							message.channel.send(embed);
							message.react(emojiDB.react("tick"))
					});
					break;
			}
	},
	fetchAll: (bot, message, args) => {
		//Currently no testing has been done on this.
		//This feature is 100% broken rn.
		switch (args[1].toLowerCase())
			{
				case "guide":
					var embed = new Discord.RichEmbed()
						.setTitle(`Guide to using FetchAll Efficiently`)
						.addField("KeyWords","This is ment to bring a list of all available modifiers, spells and so on. Add a keyword after ~fetchall [keyword] to use it.\nAvailable Keywords are \ninstant, targeted, buff, command, passive, modifier")
						.addField("Example","I am looking for all modifiers, I'll type ~fetchall modifier")
						.setAuthor(`Created with Professor Ryze's Fetch System`)
						.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
						.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
						.setTimestamp()
					message.channel.send(embed);
					break;
				case "instant":
					readdirp({ root: './GitHubDownload/src/com/nisovin/magicspells/spells/instant', fileFilter: '*.java'}, function (errors, res) {
							if (errors) {
									errors.forEach(function (err) {
										console.error('Error: ', err);
									});
							}
							var endString = " ";

							Object.keys(res.files).forEach(function(id) {
									var name = res.files[id]['name'];
									endString.concat(`${name.replace(".java","")}\n`)
							})

							var embed = new Discord.RichEmbed()
								.setTitle(`All Instant Spells`)
								.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
								.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
								.setTimestamp()
								.addField("Spells",endString)
							message.channel.send(embed);
							message.react(emojiDB.react("tick"))
					});
					break;
				case "targeted":
					readdirp({ root: './GitHubDownload/src/com/nisovin/magicspells/spells/targeted', fileFilter: '*.java'}, function (errors, res) {
							if (errors) {
									errors.forEach(function (err) {
										console.error('Error: ', err);
									});
							}
							var endString = " ";

							Object.keys(res.files).forEach(function(id) {
									var name = res.files[id]['name'];
									endString.concat(`${name.replace(".java","")}\n`)
							})
							var embed = new Discord.RichEmbed()
								.setTitle(`All Targeted Spells`)
								.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
								.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
								.setTimestamp()
								.addField("Spells",endString)
							message.channel.send(embed);
							message.react(emojiDB.react("tick"))
					});
					break;
				case "buff":
					readdirp({ root: './GitHubDownload/src/com/nisovin/magicspells/spells/buff', fileFilter: '*.java'}, function (errors, res) {
							if (errors) {
									errors.forEach(function (err) {
										console.error('Error: ', err);
									});
							}
							var endString = " ";

							Object.keys(res.files).forEach(function(id) {
									var name = res.files[id]['name'];
									endString.concat(`${name.replace(".java","")}\n`)
							})
							var embed = new Discord.RichEmbed()
								.setTitle(`All Buff Spells`)
								.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
								.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
								.setTimestamp()
								.addField("Spells",endString)
							message.channel.send(embed);
							message.react(emojiDB.react("tick"))
					});
					break;
				case "command":
					readdirp({ root: './GitHubDownload/src/com/nisovin/magicspells/spells/command', fileFilter: '*.java'}, function (errors, res) {
							if (errors) {
									errors.forEach(function (err) {
										console.error('Error: ', err);
									});
							}
							var endString = " ";

							Object.keys(res.files).forEach(function(id) {
									var name = res.files[id]['name'];
									endString.concat(`${name.replace(".java","")}\n`)
							})
							var embed = new Discord.RichEmbed()
								.setTitle(`All Command Spells`)
								.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
								.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
								.setTimestamp()
								.addField("Spells",endString)
							message.channel.send(embed);
							message.react(emojiDB.react("tick"))
					});
					break;
					case "passive":
						readdirp({ root: './GitHubDownload/src/com/nisovin/magicspells/spells/passive', fileFilter: '*.java'}, function (errors, res) {
								if (errors) {
										errors.forEach(function (err) {
											console.error('Error: ', err);
										});
								}
								var endString = " ";

								Object.keys(res.files).forEach(function(id) {
										var name = res.files[id]['name'];
										endString.concat(`${name.replace(".java","")}\n`)
								})
								var embed = new Discord.RichEmbed()
									.setTitle(`All Passive Triggers`)
									.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
									.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
									.setTimestamp()
									.addField("Spells",endString)
								message.channel.send(embed);
								message.react(emojiDB.react("tick"))
						});
						break;
					case "modifier":
						readdirp({ root: './GitHubDownload/src/com/nisovin/magicspells/castmodifiers/conditions', fileFilter: '*.java'}, function (errors, res) {
								if (errors) {
										errors.forEach(function (err) {
											console.error('Error: ', err);
										});
								}
								var endString = " ";

								Object.keys(res.files).forEach(function(id) {
										var name = res.files[id]['name'];
										endString.concat(`${name.replace(".java","")}\n`)
								})
								var embed = new Discord.RichEmbed()
									.setTitle(`All Modifier Conditions`)
									.setThumbnail("https://i.imgur.com/vzbca9G.jpg")
									.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
									.setTimestamp()
									.addField("Spells",endString)
								message.channel.send(embed);
								message.react(emojiDB.react("tick"))
						});
						break;
				default:
					return message.reply("Must choose one of these parameters to fetch.\n\ninstant\ntargeted\nbuff\ncommand\npassive\nmodifier")
			}
			break;
	}
}
