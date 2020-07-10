module.exports = {
	name: "play",
	description: "Play a song either from and URL or Search word",
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		message.channel.send(`playing ${args}`);
	},
};
