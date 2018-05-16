const Discord = require('discord.js')
const fs = require('fs')
const randomInt = require('random-int')
const config =  require("./config.json")
const search = require('find-file')
const download = require('download')
const finder = require('find-files')
const glob = require('glob')
const readdirp = require('readdirp');

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
    .addField("Commands","?commandlist | Dyno Commands\n~cmds | Professor Ryze Commands\n ⤷ Alternatively, you can mention the bot.")
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
        .addField("\🔗 Links", "~list | **Base Command**\n ⤷ ~list nisovin | Displays links from the MS nisovin page\n ⤷ ~list github | Displays links from the MS github page\n ⤷ ~list tutorial | Lunks to various tutorials for MS users\n~invite | **Base Command**\n ⤷ ~invite bot | Bot's Invite Link\n ⤷ ~invite msdiscord | **Official MagicSpells Discord** Link\n ⤷ ~invite botdiscord | Development and Help Center for the bot")
        .addField("\↩️ Fetch File","~fetch | **Base Command**\n ⤷ ~fetch [filename] | Provides Direct Links to files from the Github Page.\n**[Only Retrieves .java files]**")
        .addField("\📚 Rules","~rules | **Base Command**\n ⤷ ~rules support | Lists the rules for the usage of support channels.")
        .addField(":beetle: Sumbit a Bug Report","~reportbug | **Base Command**\n ⤷ ~reportbug start | Starts the bug report builder\n ⤷ ~reportbug help | Displays an important message related to the reportbug command.")
        .addField("\📋 Suggest Ideas or Fixes", "~suggest [message] | Sent to development discord.")
      message.channel.send(embed);
      bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
    }

  var suggestargs = message.content.substring(config.prefix.length).slice(8);

  function CheckGuild()
  {
    if (message.channel.type === "text")
      {
        if (message.guild.id == 264445053596991498) {return;}
        if (message.guild.id == 110373943822540800) {return;}
      }
  }

  if (!message.content.startsWith(config.prefix)) CheckGuild();

  if (message.content.startsWith(config.prefix)) // ~ commands
    {
      if (!bugData[message.author.id]) bugData[message.author.id] =
        {
          buglevel: 0,
          bugmsv: "Empty",
          bugsv: "Empty",
          bugdesc: "Empty"
        }

	    switch (args[0].toLowerCase())
	    {
				case "version":
					if (!args[1])
						return message.reply("Can you actually provide a legit version string to parse?")

					var string = args[1]
					var prefixEnd = string.indexOf("-dev-");
					if (prefixEnd == -1) return message.reply("Make sure to include everything. For example, 2.9-dev-[datepattern]")
					var version = string.slice(0,prefixEnd);
					if (version == "") return message.reply("Specify every part of the build's version. For example, 2.9-dev-[datepattern]")
					var format = string.slice(prefixEnd + "-dev-".length);
					console.log(`${string}`);
					console.log(prefixEnd);
					console.log(version);
					console.log(format);

					//Parse the format
					if (format.length != 10) return message.reply("Invalid date-pattern was detected!")

					var year = format.slice(0,2);
					var month = format.slice(2,4).replace("0","");
					var day = format.slice(4,6);
					var daySuffix = "";
					var hour = format.slice(6,8);
					var minute = format.slice(8,10);

					if (day == "01" || day == "11" || day == "21" || day == "31") daySuffix = "st";
					else if (day == "02" || day == "12" || day == "22") daySuffix = "nd";
					else if (day == "03" || day == "13" || day == "23") daySuffix = "rd";
					else daySuffix = "th";

					if (day.slice(0,1) == "0") day = day.replace("0","");

					var monthArray = ["January","Febuary","March","April","May","June","July","August","September","October","Novemeber","December"]

					message.channel.send(`This build of MagicSpells is version ${version} and was built at ${hour}:${minute} on the ${day}${daySuffix} of ${monthArray[parseInt(month) - 1]}, 20${year}.`)
					break;
				case "fetchall":
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
						message.react("\❌")
						return message.channel.send("You must use this command in the MS Guild for it to function.")
					}

					if (!hasAnyRole) {
						message.react("\❌")
						message.reply("\🤔```yml\n\nYou do not have the required roles to perform this command.\nMake sure you read and **accept** the rules at the welcome channel.\nFurther Instructions are noted.```")
						return;
					}

					if (banned) {
						message.react("\❌")
						message.reply("You've been **banned** from support or helpful bot commands. What did you expect? \😒");
						return;
					}

					switch (args[1].toLowerCase())
						{
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
										message.react("\✅")
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
										message.react("\✅")
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
										message.react("\✅")
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
										message.react("\✅")
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
											message.react("\✅")
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
											message.react("\✅")
									});
									break;
							default:
								return message.reply("Must choose one of these parameters to fetch.\n\ninstant\ntargeted\nbuff\ncommand\npassive\nmodifier")
						}
					break;
        case "fetch":
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
            message.react("\❌")
            return message.channel.send("You must use this command in the MS Guild for it to function.")
          }

          if (!hasAnyRole) {
            message.react("\❌")
            message.reply("\🤔```yml\n\nYou do not have the required roles to perform this command.\nMake sure you read and **accept** the rules at the welcome channel.\nFurther Instructions are noted.```")
            return;
          }

          if (banned) {
            message.react("\❌")
            message.reply("You've been **banned** from support or helpful bot commands. What did you expect? \😒");
            return;
          }

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
                      message.react("\❌")
                      return message.channel.send("No Files Found!")
                    }

                    datastring = datastring.replace("$|$","");
                    message.channel.send(embed);
                    message.react("\✅")
                });
                break;
            }
            break;
        case "rb":
          //Embed
          var templevel = "Empty"
          var bugembed = new Discord.RichEmbed()
            .setTitle(`${message.author.username}'s Bug Report`)
            .setAuthor(`Created with Professor Ryze's Bug System`)
            .setThumbnail("https://i.imgur.com/vzbca9G.jpg")
            .setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
            .setTimestamp()
            switch (bugData[message.author.id].buglevel)
              {
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
            bugembed.addField("Other Info",`Issue #${issueData.count + 1}\nThis issue will be resolved when it is marked with \✅\nCreated by ${message.author.username}/${message.author.id}.`)

            //exist check
            var doesexist = false;
            var user = message.author.id;

            for (i = 0; i < bugbuilder.length; i++)
              {
                var id = bugbuilder[i]

                if (user == id)
                  {
                    doesexist = true;
                    break;
                  }
              }
          switch (args[1].toLowerCase())
            {
              case "buglevel":

                if (doesexist == true)
                  {
                    var int = parseInt(args[2].toLowerCase())
                    if (int > 0 && int < 5)
                      {
                        message.react("\✅")
                        bugData[message.author.id].buglevel = int;
                      }
                    else
                      {
                        message.react("\❌")
                        message.author.send("Your buglevel is not an interger or was not 1,2,3 or 4.")
                      }
                  }
                else
                  {
                    message.author.send("You are not submitting a bug report!")
                    message.react("\❌")
                  }
                break;

              case "msversion":

                if (doesexist == true)
                  {
                    message.react("\✅")
                    bugData[message.author.id].bugmsv = args[2].toLowerCase();
                  }
                else
                  {
                    message.author.send("You are not submitting a bug report!")
                    message.react("\❌")
                  }
                break;

              case "sversion":

                if (doesexist == true)
                  {
                    message.react("\✅")
                    bugData[message.author.id].bugsv = args[2].toLowerCase();
                  }
                else
                  {
                    message.author.send("You are not submitting a bug report!")
                    message.react("\❌")
                  }
                break;

              case "desc":

                if (doesexist == true)
                  {
                    message.react("\✅")
                    bugData[message.author.id].bugdesc = message.content.slice(8)
                  }
                else
                  {
                    message.author.send("You are not submitting a bug report!")
                    message.react("\❌")
                  }
                break;

              case "preview":

                if (doesexist == true)
                  {
                    message.react("\✅")
                    message.author.send("This is how it will look like when you **submit** the bug report.\nMake sure you include a **detailed** description of the bug and the necessary steps to reproduce it.")
                    message.author.send(bugembed);
                  }
                else
                  {
                    message.author.send("You are not submitting a bug report!")
                    message.react("\❌")
                  }
                break;

              case "submit":
                if (!issueData.users[message.author.id]) issueData.users[message.author.id] =
                  {
                    "issues": []
                  }

                issueData.count++;
                var issuecount = issueData.count;
                issueData.users[message.author.id].issues.push(issuecount);

                bot.channels.get("410434459050049548").send(bugembed)
                message.author.send("Sent! Will go through approval and you will be notified on its status.")

                message.react("\✅")
                break;

              case "help":

                var exists = false;
                var user = message.author.id

                for (i = 0; i < bugbuilder.length; i++)
                  {
                    var id = bugbuilder[i]

                    if (user == id)
                      {
                        var embed = new Discord.RichEmbed()
                          .setTitle("Bug Reporting System Help Commands")
                          .setColor(092030)
                          .setAuthor("Professor Ryze - MagicSpells ~cmds bot")
                          .setThumbnail("https://i.imgur.com/vzbca9G.jpg")
                          .setDescription("Here are a list of commands available while using the bug reporting system.")
                          .setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
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

              case "exit":

                var exists = false;
                var user = message.author.id;

                for (i = 0; i < bugbuilder.length; i++)
                  {
                    var id = bugbuilder[i]

                    if (user == id)
                      {
                        message.author.send("Bug Reporting Process Exited")
                        message.react("\✅")

                        var index = bugbuilder.indexOf(user)

                        if (index > -1)
                          {
                            bugbuilder.splice(index, 1);
                          }

                        exists = true;

                        delete bugData[message.author.id];
                        break;
                      }
                  }

                if (exists == false)
                  {
                    message.author.send("You weren't using the bug reporting system to begin with.")
                  }
              }
            break;

        case "reportbug":
          //Embed
          var templevel = "Empty"
          var bugembed = new Discord.RichEmbed()
            .setTitle(`${message.author.username}'s Bug Report'`)
            .setAuthor(`Created with Professor Ryze's Bug System`)
            .setThumbnail("https://i.imgur.com/vzbca9G.jpg")
            .setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
            .setTimestamp()
            switch (bugData[message.author.id].buglevel)
              {
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

            for (i = 0; i < bugbuilder.length; i++)
              {
                var id = bugbuilder[i]

                if (user == id)
                  {
                    doesexist = true;
                    break;
                  }
              }
          switch (args[1].toLowerCase())
            {
              case "buglevel":

                if (doesexist == true)
                  {
                    var int = parseInt(args[2].toLowerCase())
                    if (int > 0 && int < 5)
                      {
                        message.react("\✅")
                        bugData[message.author.id].buglevel = int;
                      }
                    else
                      {
                        message.react("\❌")
                        message.author.send("Your buglevel is not an interger or was not 1,2,3 or 4.")
                      }
                  }
                else
                  {
                    message.author.send("You are not submitting a bug report!")
                    message.react("\❌")
                  }
                break;

              case "msversion":

                if (doesexist == true)
                  {
                    message.react("\✅")
                    bugData[message.author.id].bugmsv = args[2].toLowerCase();
                  }
                else
                  {
                    message.author.send("You are not submitting a bug report!")
                    message.react("\❌")
                  }
                break;

              case "sversion":

                if (doesexist == true)
                  {
                    message.react("\✅")
                    bugData[message.author.id].bugsv = args[2].toLowerCase();
                  }
                else
                  {
                    message.author.send("You are not submitting a bug report!")
                    message.react("\❌")
                  }
                break;

              case "desc":

                if (doesexist == true)
                  {
                    message.react("\✅")
                    bugData[message.author.id].bugdesc = message.content.slice(8)
                  }
                else
                  {
                    message.author.send("You are not submitting a bug report!")
                    message.react("\❌")
                  }
                break;

              case "preview":

                if (doesexist == true)
                  {
                    message.react("\✅")
                    message.author.send("This is how it will look like when you **submit** the bug report.")
                    message.author.send(bugembed);
                  }
                else
                  {
                    message.author.send("You are not submitting a bug report!")
                    message.react("\❌")
                  }
                break;

              case "submit":
                if (!issueData.users[message.author.id]) issueData.users[message.author.id] =
                  {
                    "issues": []
                  }

                issueData.count++;
                var issuecount = issueData.count;
                issueData.users[message.author.id].issues.push(issuecount);

                bot.channels.get("410434459050049548").send(bugembed)
                message.author.send("Sent! Will go through approval and you will be notified on its status.")

                message.react("\✅")
                break;

              case "help":

                var exists = false;
                var user = message.author.id

                for (i = 0; i < bugbuilder.length; i++)
                  {
                    var id = bugbuilder[i]

                    if (user == id)
                      {
                        var embed = new Discord.RichEmbed()
                          .setTitle("Bug Reporting System Help Commands")
                          .setColor(092030)
                          .setAuthor("Professor Ryze - MagicSpells ~cmds bot")
                          .setThumbnail("https://i.imgur.com/vzbca9G.jpg")
                          .setDescription("Here are a list of commands available while using the bug reporting system.")
                          .setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
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

                if (exists == true) {break;}

                message.reply(' as we do have the channel #known-issues for admin acknowledged bugs, all of these bug reports come from the community. ``~reportbug`` sends us a message and your description of a bug and, if we are able to replicate it, this bug will be sent to the #known-issues channel.\n\n__We also want to make it aware__ that misuse of this command is not tolerated. If you use this command as a joke or anything besides the intended purpose, you will be punished **heavily**\n\nTo report a bug, use ~reportbug start to get walked through an interactive process to ensure that all details of the bug are captured.')
				/*\n\nAlternatively you can use ``~reportbug {Bug Level} {MS version} {Exact Server Version} {Description}`` to quickly post the bug issue. These commands must be used in a private DM with the bot.*/
                break;

              case "start":
                message.react("\✅")
                message.author.send("Bug Reporting Process Initiated")
                message.author.send("From now on, you must continue to privately direct message the bot. You can use ~reportbug or ~rb to proceed with the interactive process.")
                bot.channels.get("392391057490444291").send(`${message.author.username}/${message.author.id} wants to report a bug.`)
                bugbuilder.push(message.author.id)
                var embed = new Discord.RichEmbed()
                  .setTitle("Bug Reporting System Help Commands")
                  .setColor(092030)
                  .setAuthor("Professor Ryze - MagicSpells ~cmds bot")
                  .setThumbnail("https://i.imgur.com/vzbca9G.jpg")
                  .setDescription("Here are a list of commands available while using the bug reporting system.")
                  .setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
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

                for (i = 0; i < bugbuilder.length; i++)
                  {
                    var id = bugbuilder[i]

                    if (user == id)
                      {
                        message.author.send("Bug Reporting Process Exited")
                        message.react("\✅")

                        var index = bugbuilder.indexOf(user)

                        if (index > -1)
                          {
                            bugbuilder.splice(index, 1);
                          }

                        exists = true;

                        delete bugData[message.author.id];
                        break;
                      }
                  }

                if (exists == false)
                  {
                    message.author.send("You weren't using the bug reporting system to begin with.")
                  }
            }
          break;
        case "submit":
          switch (args[1].toLowerCase())
            {
              case "spell":
                if (args[2] != "")
                  {
                    reason = message.content.slice(13);
                  }
                else
                  {
                    reason = "UnExplained"
                  }
                message.channel.send("Waiting 5s for all files to load.")
                delay(2000)
                    .then(() =>
                    {
                      var attachments = message.attachments
                      var filename = "";
                      var link = "";
                      var username = message.author.username
                      var id = message.author.id

                      attachments.forEach(function(attachment)
                      {
                        filename = attachment.filename
                        link = attachment.url

                        if (!filename.startsWith("spells-") && !filename.endsWith(".yml"))
                          {
                            message.channel.send(`${filename} is not a valid spell file!`)
                            message.react("\❌")
                          }
                        else
                          {
                            message.channel.send("Spell File Sent!")
                            bot.channels.get("392961616833937408").send(`${username}/${id} sent a spell file with a reason which is: ${reason}.`)
                            message.channel.fetchMessage(message.id)
                            .then(message =>
                              {
                                bot.channels.get("392961616833937408").send(link)
                              })
                          }
                      })
                      message.react("\✅")
                    })
                break;
            }
          break;

          case "rules":
            if (!args[1].toLowerCase())
              message.reply("Invalid argument, refer to my help page via ~cmds or mention me.")

            switch (args[1].toLowerCase())
              {
                case "support":
                  message.reply("By using this command you agree to the rules of the support channel.\n\nYou also aknowledge that you've read over the #welcome channel and know the rules.\n\n```yml\nRules:\n\n1. Always use and follow the support format when asking for help repairing a spell.\n2. Only use the support channel for MagicSpells related issues.\n3. Keep arguments non-existent in the channel.\n4. Move to another support channel if one is currently being used.\n5. Acknowledge that just posting a config saying `help` can result in a instant support ban.```")
                  break;
              }
            break;

          case "chal": //Challenge Builder Commands

            //Challenge Embed
            var chalembed = new Discord.RichEmbed()
              .setTitle(`A MagicSpells Hosted Spell-File Challenge`)
              .setColor([255, 165, 0])
              .setAuthor(`Created by ${message.author.username} called ${challengename}`)
              .setThumbnail("https://i.imgur.com/vzbca9G.jpg")
              .setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
              .setImage(`${challengeguide}`)
              .setTimestamp()
              .addField(`Name`,`${challengename}`)
              .addField(`Theme`,`${challengetheme}`)
              .addField(`Contest Duration`, `${challengetime}`)
              .addField(`Instructions`,`${challengeinstructions}`, true)
              .addField(`Rules`,`${challengerules}`, true)
              .addField(`Upload Guide`,`1. Open a private direct message chat with the Professor Ryze bot\n2. Make sure the file you are uploading is in the format, spells-filename.yml, if not you will be disqualified.\n3. Drag and Drop your file onto the chat channel\n4.Inside the comment, put ~submit spell [name of the challenge], if you do not you will be disqualified.\n5. You can send multiple versions and the most recent one will be judged when the time is over.`, true)
            if (inchallengebuilder == true && challengebuilderid == message.author.id)
              {
                switch (args[1].toLowerCase())
                  {
                    default:
                      message.channel.send("Invalid Command. Use ~proj help to view available commands.")
                      message.react("\❌")
                      break;
                    case "preset":
                        message.channel.send("Loaded Pre-Configured Embed Data... This destroyed any configuration options that have been used.")
                        challengename = "Combo Stars";
                        challengetheme = "Ridiculously Long Combo Spell";
                        challengerules = "1. Combo must last 6 seconds\n2. Combo must silence the target\n3. Combo must not exceed 30s\n4. Any damage or status effect that is inflicted or happens after 30s due to the spell will be disqualified.";
                        challengeinstructions = "Create a spell that keeps chaining attacks on its target for at least 6 seconds but no more than 30 seconds. 30 seconds after the combo spell started, if any damage or status effect is inflicted on the target. The spell does not count.";
                        message.react("\✅")
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
                        bot.channels.get("346881478094749697").send(chalembed);
                        message.channel.send("Embed Created and Posted. You are free to resend the embed again after changing certain information.")
                        break;
                    case "help":
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
                        break;
                    case "name":
                        challengename = message.content.substring(config.prefix.length).slice(10)
                        message.react("\✅")
                        break;
                    case "rules":
                        challengerules = message.content.substring(config.prefix.length).slice(11)
                        message.react("\✅")
                        break;
                    case "instruct":
                        challengeinstructions = message.content.substring(config.prefix.length).slice(14)
                        message.react("\✅")
                        break;
                    case "theme":
                        challengetheme = message.content.substring(config.prefix.length).slice(11)
                        message.react("\✅")
                        break;
                    case "time":
                        challengetime = message.content.substring(config.prefix.length).slice(10)
                        message.react("\✅")
                        break;
                    case "preview":
                        message.channel.send("This is how it currently looks")
                        message.channel.send(chalembed)
                        break;
                  }
              }
            else
              {
                message.channel.send("Error: Invalid User or System is being used.")
                message.react("\❌")
              }
              break;

        case "admin":
          if (message.author.id == ownerid || message.author.id == 112742095978008576 || message.author.id == 71448444065021952 || message.author.id == 255207721001811968 || message.author.id == 192884388747280384 || message.author.id == 152242536381939713)
            {
							if (args[1].toLowerCase() == "talk") {
								var array = [];
								for (i = 0; i < args.length; i++) array[i] = args[i];
								var channel = array[2].toLowerCase();
								array.shift();
								array.shift();
								array.shift();
								bot.channels.get(channel).send(array.join(" "));
							}
              if (args[1].toLowerCase() == "fake")
                {
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
                          .addField("Commands","?commandlist | Dyno Commands\n~cmds | Professor Ryze Commands\n ⤷ Alternatively, you can mention the bot.")
                          .addField("Rules","View the discord rules on the #welcome channel\n\nWhen using the support channels, there are some special terms you'll need to get acquainted with.\n\nRead them by using ~rules support.\nTo gain access to the support channels, you must **?acceptrules** the rules.")
                        message.author.send(embed);
                        break;
                    }
                }
              if (args[1].toLowerCase() == "issue")
                {
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
                        bot.channels.get("398259282899894272").send(messagecontent)

                        var issuecount = issueData.count;

                        Object.keys(issueData.users).forEach(function(user)
                        {
                          if (issueData.users[user].issues.includes(issuecount)) {
                            var found = bot.users.find(val => val.id == user)

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
                            var found = bot.users.find(val => val.id == user)

                            found.send("Your bug report was declined!")
                            }
                        })
                        message.channel.send("Bug report was declined!")
                        message.react("\🛑")
                        break;
                    }
                }
              if (args[1].toLowerCase() == "download")
                {
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
              if (args[1].toLowerCase() == "markdown")
                {
                  var messageid = args[2]
                  var start = "```yml\n"
                  var end = "```"
                  message.channel.fetchMessage(messageid)
                    .then(message =>
                    {
                      message.reply(`Your code looks ugly when you don't use proper markdown. I sent you a link to the page.`)
                      message.channel.send("Here, I make it better. I even added colors too!")
                      message.author.send(`https://support.discordapp.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-`)
                      bot.channels.get(channel).send(`${start}${message.content}${end}`)
                    })
                }
              if (args[1].toLowerCase() == "paste" && args[2] != "" && args[3] != "")
                {
                  var messageid = args[2]
                  var targetchannel = args[3]

                  message.channel.fetchMessage(messageid)
                    .then(message =>
                    {
                      bot.channels.get(targetchannel).send(message.content)
                    })
                    .catch(console.error);
                }
              if (args[1].toLowerCase() == "format")
                {
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
              if (args[1].toLowerCase() == "challengebuilder" && args[2].toLowerCase() == "start")
                {
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
    	            bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " started the project builder system.")
                }
            }
          else
            {
              message.channel.send("Sorry, but thats an admin-only cmd.")
              bot.channels.get("392391057490444291").send(`${message.author.username} tried to use an admin command.`)
            }
          break;

	      case "cmds":
          var embed = new Discord.RichEmbed()
            .setTitle("Command List")
            .setColor(092030)
            .setAuthor("Professor Ryze - MagicSpells ~help and test bot")
            .setThumbnail("https://i.imgur.com/vzbca9G.jpg")
            .setDescription("Here is a list of available commands. **Base Commands** don't do anything on their own. You need to add a secondary argument to use it.")
            .setFooter("Created and Currently Maintained by Rifle D. Luffy#1852 from the Official MS Discord.", "https://i.imgur.com/vzbca9G.jpg")
            .addField("\🔗 Links", "~list | **Base Command**\n ⤷ ~list nisovin | Displays links from the MS nisovin page\n ⤷ ~list github | Displays links from the MS github page\n ⤷ ~list tutorial | Lunks to various tutorials for MS users\n~invite | **Base Command**\n ⤷ ~invite bot | Bot's Invite Link\n ⤷ ~invite msdiscord | **Official MagicSpells Discord** Link\n ⤷ ~invite botdiscord | Development and Help Center for the bot")
            .addField("\↩️ Fetch File","~fetch | **Base Command**\n ⤷ ~fetch [filename] | Provides Direct Links to files from the Github Page.\n**[Only Retrieves .java files]**")
            .addField("\📚 Rules","~rules | **Base Command**\n ⤷ ~rules support | Lists the rules for the usage of support channels.")
            .addField(":beetle: Sumbit a Bug Report","~reportbug | **Base Command**\n ⤷ ~reportbug start | Starts the bug report builder\n ⤷ ~reportbug help | Displays an important message related to the reportbug command.")
            .addField("\📋 Suggest Ideas or Fixes", "~suggest [message] | Sent to development discord.")
          message.channel.send(embed);
          bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
          break;

	      case "suggest": //suggest commands
	        if (args[1].toLowerCase() != "")
	          {
	            message.channel.send("Your suggestion was sent to the Professor Ryze Development Discord. Thank You!")
	            bot.channels.get("385498891744706571").send(message.author.username + "/" + message.author.id + " suggested " + suggestargs)
	            break;
	          }
	        if (args[1].toLowerCase() == "")
	          {
	            message.channel.send("You need to add something after ~suggest if you want to suggest something.")
	            bot.channels.get("392391057490444291").send(message.author.username + "/" + message.author.id + " asked " + message.content)
	            break;
	          }
	        break;

	        // invite command

	      case "invite":

	        switch(args[1].toLowerCase())
	          {
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
