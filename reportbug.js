const emojiDB = require("./emojiDB.js");
const Discord = require('discord.js');
const fs = require('fs');

var bot = new Discord.Client()

let bugData = JSON.parse(fs.readFileSync('./bugData.json', 'utf8'));

module.exports= {
	reportBug: (client, message, args) => {
		//Embed
		var templevel = "Empty"
		var bugembed = new Discord.RichEmbed()
		.setTitle(`${message.author.username}'s Bug Report'`)
		.setAuthor(`Created with Professor Ryze's Bug System`)
		.setThumbnail("https://i.imgur.com/zEOYDNJ.png")
		.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/zEOYDNJ.png")
		.setTimestamp()
		switch (bugData[message.author.id].buglevel) {
			case 0:
				bugembed.setColor([218, 213, 204])
				templevel = "Undefined"
				bugembed.addField("Bug Level",`Level: ${bugData[message.author.id].buglevel} | ${templevel}`)
				break;
			case 1:
				bugembed.setColor([50, 226, 0])
				templevel = "Minor: Infrequent";
				bugembed.addField("Bug Level",`Level: ${bugData[message.author.id].buglevel} | ${templevel}`)
				break;
			case 2:
				bugembed.setColor([236, 255, 0])
				templevel = "Average: Uncommon";
				bugembed.addField("Bug Level",`Level: ${bugData[message.author.id].buglevel} | ${templevel}`)
				break;
			case 3:
				bugembed.setColor([255, 172, 0])
				templevel = "Major: Non-Functioning Mechanic";
				bugembed.addField("Bug Level",`Level: ${bugData[message.author.id].buglevel} | ${templevel}`)
				break;
			case 4:
				bugembed.setColor([255, 0, 0])
				templevel = "Urgent: Plugin Breaking";
				bugembed.addField("Bug Level",`Level: ${bugData[message.author.id].buglevel} | ${templevel}`)
				break;
		}
		bugembed.addField("Details",`MagicSpells Version: ${bugData[message.author.id].bugmsv}\nServer Version: ${bugData[message.author.id].bugsv}`)
		bugembed.addField("Description",`${bugData[message.author.id].bugdesc}`)
		bugembed.addField("Other Info",`This issue will be resolved when it is marked with \✅\nCreated by ${message.author.username}/${message.author.id}.`)

		//exist check
		var doesexist = false;
		var user = message.author.id;

		for (i = 0; i < bugbuilder.length; i++) {
			var id = bugbuilder[i]

			if (user == id) {
					doesexist = true;
					break;
				}
		}
		switch (args[1].toLowerCase()) {
				case "buglevel":
					if (doesexist == true) {
						var int = parseInt(args[2].toLowerCase())
						if (int > 0 && int < 5) {
							message.react(emojiDB.react("tick"))
							bugData[message.author.id].buglevel = int;
						} else {
							message.react(emojiDB.react("cross"))
							message.author.send("Your buglevel is not an interger or was not 1,2,3 or 4.")
						}
					} else {
						message.author.send("You are not submitting a bug report!")
						message.react(emojiDB.react("cross"))
					}
					break;
				case "msversion":
					if (doesexist == true) {
						message.react(emojiDB.react("tick"))
						bugData[message.author.id].bugmsv = args[2].toLowerCase();
					} else {
						message.author.send("You are not submitting a bug report!")
						message.react(emojiDB.react("cross"))
					}
					break;
				case "sversion":
					if (doesexist == true) {
						message.react(emojiDB.react("tick"))
						bugData[message.author.id].bugsv = args[2].toLowerCase();
					} else {
						message.author.send("You are not submitting a bug report!")
						message.react(emojiDB.react("cross"))
					}
					break;
				case "desc":
					if (doesexist == true) {
						message.react(emojiDB.react("tick"))
						bugData[message.author.id].bugdesc = message.content.slice(8)
					} else {
						message.author.send("You are not submitting a bug report!")
						message.react(emojiDB.react("cross"))
					}
					break;
				case "preview":
					if (doesexist == true) {
						message.react(emojiDB.react("tick"))
						message.author.send("This is how it will look like when you **submit** the bug report.")
						message.author.send(bugembed);
					} else {
						message.author.send("You are not submitting a bug report!")
						message.react(emojiDB.react("cross"))
					}
					break;
				case "submit":
					if (!issueData.users[message.author.id]) issueData.users[message.author.id] = {
							"issues": []
					}

					issueData.count++;
					var issuecount = issueData.count;
					issueData.users[message.author.id].issues.push(issuecount);

					client.channels.get("410434459050049548").send(bugembed)
					message.author.send("Sent! Will go through approval and you will be notified on its status.")

					message.react(emojiDB.react("tick"))
					break;
				case "help":
					var exists = false;
					var user = message.author.id
					for (i = 0; i < bugbuilder.length; i++) {
							var id = bugbuilder[i]

							if (user == id) {
									var embed = new Discord.RichEmbed()
										.setTitle("Bug Reporting System Help Commands")
										.setColor(092030)
										.setAuthor("Professor Ryze - MagicSpells ~cmds bot")
										.setThumbnail("https://i.imgur.com/zEOYDNJ.png")
										.setDescription("Here are a list of commands available while using the bug reporting system.")
										.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/zEOYDNJ.png")
										.addField("Command","``~reportbug`` or ``~rb``")
										.addField("Bug Level","~rb buglevel")
										.addField("MS Version","~rb msversion")
										.addField("Exact Server Version","~rb sversion")
										.addField("Description","~rb desc")
										.addField("Preview | DONT Forget to Preview at least once!","~rb preivew")
										.addField("Submit","~rb submit")
										.addField("Other Info","**You must include the __steps to reproduce__ AND __exact versions__**")
									message.author.send(embed)
									exists = true;
									break;
								}
					}

					if (exists == true) break;

					message.reply(' as we do have the channel #known-issues for admin acknowledged bugs, all of these bug reports come from the community. ``~reportbug`` sends us a message and your description of a bug and, if we are able to replicate it, this bug will be sent to the #known-issues channel.\n\n__We also want to make it aware__ that misuse of this command is not tolerated. If you use this command as a joke or anything besides the intended purpose, you will be punished **heavily**\n\nTo report a bug, use ~reportbug start to get walked through an interactive process to ensure that all details of the bug are captured.')
					/*\n\nAlternatively you can use ``~reportbug {Bug Level} {MS version} {Exact Server Version} {Description}`` to quickly post the bug issue. These commands must be used in a private DM with the client.*/
					break;

				case "start":
					message.react(emojiDB.react("tick"))
					message.author.send("Bug Reporting Process Initiated")
					message.author.send("From now on, you must continue to privately direct message the client. You can use ~reportbug or ~rb to proceed with the interactive process.")
					client.channels.get("392391057490444291").send(`${message.author.username}/${message.author.id} wants to report a bug.`)
					bugbuilder.push(message.author.id)
					var embed = new Discord.RichEmbed()
						.setTitle("Bug Reporting System Help Commands")
						.setColor(092030)
						.setAuthor("Professor Ryze - MagicSpells ~cmds bot")
						.setThumbnail("https://i.imgur.com/zEOYDNJ.png")
						.setDescription("Here are a list of commands available while using the bug reporting system.")
						.setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/zEOYDNJ.png")
						.addField("Command","``~reportbug`` or ``~rb``")
						.addField("Bug Level","~rb buglevel")
						.addField("MS Version","~rb msversion")
						.addField("Exact Server Version","~rb sversion")
						.addField("Description","~rb desc")
						.addField("Preview | DONT Forget to Preview at least once!","~rb preivew")
						.addField("Submit","~rb submit")
						.addField("Other Info","**You must include the __steps to reproduce__ AND __exact versions__**")
					message.author.send(embed)
					break;

				case "exit":
					var exists = false;
					var user = message.author.id;
					for (i = 0; i < bugbuilder.length; i++) {
						var id = bugbuilder[i]

						if (user == id) {
								message.author.send("Bug Reporting Process Exited")
								message.react(emojiDB.react("tick"))

								var index = bugbuilder.indexOf(user)

								if (index > -1) bugbuilder.splice(index, 1);

								exists = true;

								delete bugData[message.author.id];
								break;
							}
					}

					if (exists == false) message.author.send("You weren't using the bug reporting system to begin with.");
			}
			fs.writeFile("./bugData.json", JSON.stringify(bugData), (err) => {
				if (err) console.error(err)
			});
		}
	}
