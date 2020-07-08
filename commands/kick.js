module.exports = {
	name: "Kick",
	description: "Kick a user from the server.",
	guildOnly: true,
	execute(message, args) {
		message.channel.send("Pong.");
	},
};
