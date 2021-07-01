const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports = {
    name: "play",
    description: "Play a song either from and URL or Search word",
    guildOnly: false,
    cooldown: 5,
    async execute(message, args) {
        console.log(message.member);
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.channel.send(
                "You need to be in a channel to execute this command"
            );
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (
            !permissions.has("CONNECT") ||
            !permissions.has("SPEAK") ||
            !args.length
        ) {
            return message.channel.send(
                "You do not have the right permissions to do this."
            );
        }
        const connection = await voiceChannel.join();
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);
            return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
        };
        const video = await videoFinder(args.join(" "));
        if (video) {
            const stream = ytdl(video.url, { filter: "audioonly" });
            connection.play(stream, { seek: 0, volume: 1 }).on("finish", () => {
                voiceChannel.leave();
            });

            await message.reply(`Now playing ${video.title}`);
        } else {
            message.channel.send("No video results found");
        }
    },
};
