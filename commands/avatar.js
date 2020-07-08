module.exports = {
	name: "ping",
	description: "Ping!",
	aliases: ["icon", "pfp"],
	cooldown: 5,
	execute(message, args) {
		message.channel.send("Pong.");
	},
};
