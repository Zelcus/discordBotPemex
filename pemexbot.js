const Discord = require("discord.js");
const { prefix, token, channel_id, pemex_link } = require("./pemexConfig.json");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const fs = require("fs");
const { query, items } = require("./pemexSearcher.json");

const client = new Discord.Client();
const queue = new Map();
const pemexPic = new Discord.Attachment(pemex_link);

//This runs as soon as you open the js file.
client.once("ready", () => {
  client.user.setActivity("P E M E X", { type: "LISTENING" });
  let generalChannel = client.channels.get(channel_id);
  generalChannel.send("Ayo, Lil Mexico, pass the gas!", pemexPic);
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) {
    return;
  }

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}delete`)) {
    deleteSong(message, serverQueue);
    return;
  } else {
    message.channel.send("You need to enter a valid command homie!");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voiceChannel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }
  ytsr.getFilters(args[1], function (err, filters) {
    if (err) {
      console.log("whoops");
      console.log(err);
    } else {
      filter = filters.get("Type").find((o) => o.name === "Video");
      ytsr.getFilters(filter.ref, function (err, filters) {
        if (err) throw err;
        filter = filters
          .get("Duration")
          .find((o) => o.name.startsWith("Short"));
        var options = {
          limit: 1,
          nextpageRef: filter.ref,
        };
        ytsr(null, options, function (err, searchResults) {
          if (err) throw err;
          var jsonData = JSON.stringify(searchResults);
          fs.writeFile("pemexSearcher.json", jsonData, function (err) {
            if (err) {
              console.log(err);
            }
          });
        });
      });
    }
  });
  const songInfo = await ytdl.getInfo(items[0].link);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url,
  };
  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voiceChannel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voiceChannel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  serverQueue.connection.dispatcher.end();
}

function deleteSong(message, serverQueue) {
  queue.delete(guild.id);
  return message.channel.send(
    "You deleted " + `${song.title}` + "from the playlist"
  );
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();

    return;
  }

  const dispatcher = serverQueue.connection
    .playStream(ytdl(song.url))
    .on("end", () => {
      console.log("Music ended!");
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    })
    .on("error", (error) => {
      console.error(error);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

client.login(token);
