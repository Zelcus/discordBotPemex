module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        const Discord = require("discord.js");
        const { pemex_link, channel_id } = require("../config.json");
        const pemexPic = new Discord.Attachment(pemex_link);
        client.user.setActivity("P E M E X", { type: "LISTENING" });
        const generalChannel = client.channels.get(channel_id);
        generalChannel.send("Ayo, Lil Mexico, pass the gas!", pemexPic);
    },
};
