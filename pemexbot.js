const Discord = require('discord.js');
const {
    prefix,
    token,
    channel_id
} = require('./config.json');
const ytdl = require('ytdl-core');

const client = new Discord.Client();

const queue = new Map();
const pemexPic = new Discord.Attachment("https://lastfm.freetls.fastly.net/i/u/ar0/793a89505685565e9fea2c404523163c.jpg")


client.once('ready', () => {
    console.log("Connected as " + client.user.tag)
    client.user.setActivity("P E M E X", { type: "LISTENING" })
    //General channel id: 652487611494957079

    let generalChannel = client.channels.get(channel_id)
    generalChannel.send("Ayo, Lil Mexico, pass the gas!")
    generalChannel.send(pemexPic)
})


client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
        console.log(serverQueue)
        return;
    } 
    else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
    } 
    else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
    } 
    else if (message.content.startsWith(`${prefix}delete`))
    {
        deleteSong(message,serverQueue);
        return;
    }
    else {
        message.channel.send('You need to enter a valid command homie!')
    }
});

async function execute(message, serverQueue) {
    const args = message.content.split(' ');

    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('I need the permissions to join and speak in your voice channel!');
    }

    const songInfo = await ytdl.getInfo(args[1]);
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
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }

}

function skip(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    serverQueue.connection.dispatcher.end();
}
function deleteSong(message, serverQueue)
{
    queue.delete(guild.id);
    return message.channel.send("You deleted " + `${song.title}` + "from the playlist")
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();

        return;
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () => {
            console.log('Music ended!');
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
            return message.channel.send('You have to be in a voice channel to stop the music!')
        })
        .on('error', error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

client.login(token);


// const Discord = require("discord.js");
// const {
//     prefix,
//     token,
//     channel_id
// } = require("./config.json");

// const ytdl = require("ytdl-core");
// const client = new Discord.Client()
// client.login(token)


// const queue = new Map();


// client.once("ready", () => {
//     console.log("Connected as " + client.user.tag)
//     client.user.setActivity("P E M E X", { type: "LISTENING" })

//     client.guilds.forEach((guild) => {
//         console.log(guild.name)
//         guild.channels.forEach((channel) => {
//             console.log(` - ${channel.name} ${channel.type} ${channel.id}`)
//         })

//         //General channel id: 652487611494957079
//     })
//     let generalChannel = client.channels.get(channel_id)
//     generalChannel.send("Ayo, Lil Mexico, pass the gas!")
//     generalChannel.send(pemexPic)
// })

// client.on("message", async recievedMessage => {
//     if (recievedMessage.author == client.user) {
//         return
//     }

//     // recievedMessage.channel.send("Message recieved, " + recievedMessage.author.toString() + ": " + recievedMessage.content)
//     if (!recievedMessage.content.startsWith(prefix)) {
//         return
//     }
//     const serverQueue = queue.get(recievedMessage.guild.id);
//     if (recievedMessage.content.startsWith(`${prefix}play`)) {
//         execute(recievedMessage, serverQueue);
//         return;
//     }
//     else if (recievedMessage.content.startsWith(`${prefix}skip`)) {
//         skip(recievedMessage, serverQueue);
//         return;
//     }
//     else if (recievedMessage.content.startsWith(`${prefix}stop`)) {
//         stop(recievedMessage, serverQueue);
//         return;
//     }
//     else {
//         recievedMessage.channel.send('You need to enter a valid command!')
//     }

//     async function execute(recievedMessage, serverQueue) {
//         const args = recievedMessage.content.split(" ");
//         const voiceChannel = message.member.voiceChannel;
//         if (!voiceChannel) {
//             return message.channel.send("You need to be in a voice channel to play music!");
//         }
//         const permissions = voiceChannel.permissionsFor(recievedMessage.client.user);
//         if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
//             return message.channel.send('I need the permissions to join and   speak in your voice channel!');
//         }
//     }
//     const songInfo = await ytdl.getInfo(args[1]);
//     const song = {
//         title: songInfo.title,
//         url: songInfo.video_url,
//     };

//     if (!serverQueue) {

//     }
//     else {
//         serverQueue.songs.push(song);
//         console.log(serverQueue.songs);
//         return recievedMessage.channel.send(`${song.title} has been added to the queue!`);
//     }

//     // Creating the contract for our queue
//     const queueContruct = {
//         textChannel: message.channel,
//         voiceChannel: voiceChannel,
//         connection: null,
//         songs: [],
//         volume: 5,
//         playing: true,
//     };
//     // Setting the queue using our contract
//     queue.set(message.guild.id, queueContruct);
//     // Pushing the song to our songs array
//     queueContruct.songs.push(song);

//     try {
//         // Here we try to join the voicechat and save our connection into our object.
//         var connection = await voiceChannel.join();
//         queueContruct.connection = connection;
//         // Calling the play function to start a song
//         play(recievedMessage.guild, queueContruct.songs[0]);
//     } catch (err) {
//         // Printing the error message if the bot fails to join the voicechat
//         console.log(err);
//         queue.delete(recievedMessage.guild.id);
//         return recievedMessage.channel.send(err);
//     }

//     function play(guild, song) {
//         const serverQueue = queue.get(guild.id);
//         if (!song) {
//             serverQueue.voiceChannel.leave();
//             queue.delete(guild.id);
//             return;
//         }
//     }
//     const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
//         .on('end', () => {
//             console.log('Music ended!');
//             // Deletes the finished song from the queue
//             serverQueue.songs.shift();
//             // Calls the play function again with the next song
//             play(guild, serverQueue.songs[0]);
//         })
//         .on('error', error => {
//             console.error(error);
//         });
//     dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

//     function processCommand(recievedMessage) {
//         let fullCommand = recievedMessage.content.substr(1)
//         let splitCommand = fullCommand.split(" ")
//         let primaryCommand = splitCommand[0]
//         let arguments = splitCommand.slice(1)

//         if (primaryCommand == "help") {
//             helpCommand(arguments, recievedMessage)
//         }
//         else if (primaryCommand == "multiply") {
//             multiplyCommand(arguments, recievedMessage)
//         }
//         else {
//             recievedMessage.channel.send("Unknown command. Try `!help` or `!multiply`")
//         }


//     }

//     function multiplyCommand(arguments, recievedMessage) {
//         if (arguments.length < 2) {
//             recievedMessage.channel.send("Not enough arguments. Try `!multiply 2 10`")
//             return
//         }
//         let product = 1
//         arguments.forEach((value) => {
//             product = product * parseFloat(value)
//         })
//         recievedMessage.channel.send("The product of " + arguments + " is " + product.toString())
//     }

//     function helpCommand(arguments, recievedMessage) {
//         if (arguments.length == 0) {
//             recievedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
//         }
//         else {
//             recievedMessage.channel.send("It looks like you need help with " + arguments)
//         }
//     }

