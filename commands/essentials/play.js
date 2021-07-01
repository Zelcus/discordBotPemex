module.exports = {
    name: "play",
    description: "Play a song either from and URL or Search word",
    guildOnly: true,
    cooldown: 5,
    execute(message, args) {
        if (message.member.voice.channel) {
            message.channel.send(`playing ${args}`);
            const ytdl = require("ytdl-core");

            message.member.voice.channel.join().then((connection) => {
                const stream = ytdl("<youtubelink>", {
                    filter: "audioonly",
                });
                const dispatcher = connection.play(stream);

                dispatcher.on("finish", () => voiceChannel.leave());
            });
        } else {
            message.channel.send("You must join a voice channel");
        }
    },
};
