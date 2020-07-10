module.exports = {
	name: "avatar",
	description: "Display avatar image",
	aliases: ["icon", "pfp"],
	cooldown: 5,
	execute(message, args) {
		message.channel.send("Avatar script");
	},
};
