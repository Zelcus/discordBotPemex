const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token, channel_id, pemex_link } = require("./pemexConfig.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const queue = new Map();
const pemexPic = new Discord.Attachment(pemex_link);

//This runs as soon as you open the js file.
client.once("ready", () => {
	client.user.setActivity("P E M E X", { type: "LISTENING" });
	let generalChannel = client.channels.get(channel_id);
	generalChannel.send("Ayo, Lil Mexico, pass the gas!", pemexPic);
});

client.on("message", (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch {
		console.error(error);
		message.reply("There was an error trying to execute the command...");
	}
});

client.login(token);
