const emojiDB = require("./emojiDB.js");
const Discord = require('discord.js');

var bot = new Discord.Client()

module.exports= {
	submit: (client, message, args) => {
		switch (args[1].toLowerCase()) {
			case "spell":
				if (args[2] != "") reason = message.content.slice(13);
				else reason = "UnExplained";

				message.channel.send("Waiting 5s for all files to load.")
				delay(2000)
					.then(() => {
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
									message.react(emojiDB.react("cross"))
								}
							else
								{
									message.channel.send("Spell File Sent!")
									client.channels.get("392961616833937408").send(`${username}/${id} sent a spell file with a reason which is: ${reason}.`)
									message.channel.fetchMessage(message.id)
									.then(message =>
										{
											client.channels.get("392961616833937408").send(link)
										})
								}
						})
						message.react(emojiDB.react("tick"))
					})
				break;
		}
	}
}
