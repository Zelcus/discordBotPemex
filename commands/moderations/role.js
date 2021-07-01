module.exports = {
	name: "role",
	description:
		"Give user a role in the first argument and name what the role in the second argument.",
	args: true,
	usage: "<user> <role>",
	execute(message, args) {
		if (args[0] === "foo") {
			return message.channel.send("bar");
		}

		message.channel.send(
			`Arguments: ${args}\nArguments length: ${args.length}`
		);
	},
};
