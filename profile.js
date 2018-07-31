const fs = require('fs');
const Discord = require('discord.js');
const fileExists = require('file-exists');

const emojiDB = require("./emojiDB.js");

let exp = JSON.parse(fs.readFileSync(`./exp.json`, 'utf8'));

function writeUserData(id, data) {
  fs.writeFile(`./profiles/${id}.json`, JSON.stringify(data), (err) => {
    if (err) console.error(err)
  });
}

function getNextEXP(level) {
  if (level == 1) return (exp.scaling.is * exp.scaling.c);
  else return (level * exp.scaling.ls + exp.scaling.is * exp.scaling.c);
}

function getCumulativeEXP(level) {
  var total = 0;
  for (i = 1; i <= level; i++) total += getNextEXP(i);
  return total;
}

function generateProfileData(id) {
	var profileData = {
		stats: {
			level: 1,
			exp: 0,
			nextExp: 0,
			notify: false
		},
		profile: {
			rank: "Beginner",
			title: "Typical",
			status: "User"
		},
		ranks: {
	    Beginner: true,
	    Intermediate: true,
	    Advanced: true,
	    Wizard: false
	  },
		status: {
	    User: true,
	    Admin: false,
	    Grader: false,
	    Supervisor: false
	  },
		titles: {
			Typical: true,
	    Adequate: false,
	    Alright: false,
	    Mediorce: false,
	    Experienced: false,
	    Thorough: false,
	    Elaborate: false,
	    Excelled: false,
	    Quality: false,
	    Sedulous: false,
	    Adept: false,
	    Worthy: false,
	    Proficient: false,
	    Methodical: false,
	    Supreme: false,
	    FirstRate: false,
	    Unrivalled: false,
	    Incomparable: false,
	    Supreme: false,
	    Perfect: false,
	    Ultimate: false
		},
		exams: {
			graded: {
				Beginner: {
					total: 0
				},
				Intermediate: {
					total: 0
				},
				Advanced: {
					total: 0
				},
				Wizard: {
					total: 0
				},
				total: 0
			},
			completed: {
				Beginner: {
					total: 0
				},
				Intermediate: {
					total: 0
				},
				Advanced: {
					total: 0
				},
				Wizard: {
					total: 0
				},
				total: 0
			},
			total: 0
		}
	}

	profileData.stats.nextExp = getNextEXP(profileData.stats.level);

	fs.writeFileSync(`./profiles/${id}.json`, JSON.stringify(profileData));
}

function checkEXP(id, profileData) {
	if (profileData.stats.exp >= profileData.stats.nextExp) {
		profileData.stats.exp -= profileData.stats.nextExp;
		profileData.stats.level++;
		profileData.stats.nextExp = getNextEXP(profileData.stats.level);
		profileData.stats.notify = true;
	} else return;
	writeUserData(id, profileData);
}

function updateNextEXP(id) {
	if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
	let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

	profileData.stats.nextExp = getNextEXP(profileData.stats.level);
	checkEXP(id, profileData);
}

function unlockTitles(id, profileData) {
	var level = profileData.stats.level;

	var milestone = Math.floor(level / Object.keys(profileData.titles).length);

	var i = -1;
	Object.keys(profileData.titles).forEach(function(title) {
		if (i == milestone) return;
		profileData.titles[title] = true;
		i++;
	})

	writeUserData(id, profileData);
}

module.exports = {
  generateProfile: (client, message, args, id) => {
    if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);

    var user = client.users.find(val => val.id == id);

    let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		if (profileData.stats.notify) {
			message.reply("You leveled UP! Congradulations");
		}

    var examString = "";

		var json = profileData.exams.graded;
		delete json.total;

    Object.keys(json).forEach(function(category) {
      var total = json[category].total;
      if (total == 0) return;
      examString += `Graded ${total} ${category} exam(s)\n`;
    })

		var json = profileData.exams.completed;
		delete json.total;

    Object.keys(json).forEach(function(category) {
      var total = json[category].total;
      if (total == 0) return;

      examString += `Completed ${total} ${category} exam(s)\n`;

      var categoryJSON = json[category];

      var totalScore = 0;
      var totalExams = 0;
      Object.keys(categoryJSON).forEach(function(exam) {
        totalScore += exam.score;
      })

      examString += `with an average of ${totalScore/totalExams}\n`;
    })

    if (examString == "") examString += "You haven't done any exams..."

		var color = [0,0,0];

		switch (profileData.profile.status) {
			case "User":
				color = [92,176,194];
				break;
			case "Admin":
				color = [128,0,128];
				break;
			case "Grader":
				color = [204,121,251];
				break;
			case "Supervisor":
				color = [0,255,0];
				break;
		}

		var notification = ""
		if (profileData.stats.notify) notification = "\👏";

    var profile = new Discord.RichEmbed()
			.setTitle("Profile Screen")
			.setColor(color)
      .addField(`Your Profile`,`${user.username}\nThe ${profileData.profile.title} ${profileData.profile.rank} ${profileData.profile.status}`)
      .addField("Level and Experience", `Level: ${profileData.stats.level}${notification}\nExperience: ${profileData.stats.exp} / ${profileData.stats.nextExp}`)
      .addField(`Exam Data`, `${examString}`)
      .setThumbnail(message.author.avatarURL)
      .setFooter("Maintained by Rifle D. Luffy#1852", "https://i.imgur.com/zEOYDNJ.png")
      .setTimestamp()
    message.channel.send(profile);
		profileData.stats.notify = false;
		writeUserData(id, profileData);
  },
	addStatus: (id, status) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		if (!Object.keys(profileData.status).includes(status)) return;

		profileData.ranks[status] = true;
		writeUserData(id, profileData);
	},
	setStatus: (id, status) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		if (!Object.keys(profileData.status).includes(status)) return;
		if (!Object.keys(profileData.status)[status]) return;

		profileData.profile.status = status;
		writeUserData(id, profileData);
	},
	removeStatus: (id, status) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		profileData.ranks[status] = false;
		profileData.profile.status = "User";
		writeUserData(id, profileData);
	},
	addRank: (id, rank) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		if (!Object.keys(profileData.ranks).includes(rank)) return;

		profileData.ranks[rank] = true;
		writeUserData(id, profileData);
	},
	setRank: (id, rank) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		if (!Object.keys(profileData.ranks).includes(rank)) return;
		if (!Object.keys(profileData.ranks)[rank]) return;

		profileData.profile.rank = status;
		writeUserData(id, profileData);
	},
	removeRank: (id, rank) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		profileData.ranks[rank] = false;
		profileData.profile.rank = "Beginner";
		writeUserData(id, profileData);
	},
	addTitle: (id, title) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		if (!Object.keys(profileData.titles).includes(title)) return;

		profileData.ranks[title] = true;
		writeUserData(id, profileData);
	},
	setTitle: (id, title) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		if (!Object.keys(profileData.titles).includes(title)) return;
		if (!Object.keys(profileData.titles)[title]) return;

		profileData.profile.title = title;
		writeUserData(id, profileData);
	},
	removeTitle: (id, title) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		profileData.titles[title] = false;
		profileData.profile.title = "Typical";
		writeUserData(id, profileData);
	},
	addEXP: (id, amount) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		profileData.stats.exp += amount;
		checkEXP(id, profileData);
	},
	removeEXP: (id, amount) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		profileData.stats.exp -= amount;
		checkEXP(id, profileData);
	},
	setEXP: (id, amount) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		profileData.stats.exp = amount;
		checkEXP(id, profileData);
	},
	addLevel: (id, amount) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		profileData.stats.level += amount;
		checkEXP(id, profileData);
	},
	removeLevel: (id, amount) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		profileData.stats.level -= amount;
		checkEXP(id, profileData);
	},
	setLevel: (id, amount) => {
		if (!fileExists.sync(`./profiles/${id}.json`)) generateProfileData(id);
		let profileData = JSON.parse(fs.readFileSync(`./profiles/${id}.json`, 'utf8'));

		profileData.stats.level = amount;
		checkEXP(id, profileData);
	},
}
