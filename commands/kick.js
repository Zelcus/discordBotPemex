module.exports = {
	name: "kick",
	description: "Kick a user from the server.",
	guildOnly: true,
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply(
				"You need to tag a user in order to kick 'em gringo!"
			);
		}
		const taggedUser = message.mentions.users.first();
		message.channel.send(`You wanted to kick: ${taggedUser.username}`);
	},
};
