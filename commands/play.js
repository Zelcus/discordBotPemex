module.exports = {
    name: "play",
    description: "Play a song either from and URL or Search word",
    guildOnly: true,
    cooldown: 5,
    execute(message, args) {
        if (message.member.voice.channel) {
            message.channel.send(`playing ${args}`);
            const connection = message.member.voice.channel.join();
        } else {
            message.channel.send("You must join a voice channel");
        }
    },
};
