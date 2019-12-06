const Discord = require("discord.js")
const ytdl = require('ytdl-core');
const client = new Discord.Client()

const botToken = "NjUyNDg3ODYxOTM2OTc5OTY5.XepKtw.xP3A9Fs8dOW6bg5YlvQIwakJTvY"
const generalChannelID = "652487611494957079"
const pemexPic = new Discord.Attachment("https://lastfm.freetls.fastly.net/i/u/ar0/793a89505685565e9fea2c404523163c.jpg")
const serverQueue = queue.get(message.guild.id)

const queue = new Map()



client.on("ready", () => {
    console.log("Connected as " + client.user.tag)
    client.user.setActivity("P E M E X", { type: "LISTENING" })

    client.guilds.forEach((guild) => {
        console.log(guild.name)
        guild.channels.forEach((channel) => {
            console.log(` - ${channel.name} ${channel.type} ${channel.id}`)
        })

        //General channel id: 652487611494957079
    })
    let generalChannel = client.channels.get(generalChannelID)
    generalChannel.send("Ayo, Lil Mexico, pass the gas!")
    generalChannel.send(pemexPic)
})

client.on("message", (recievedMessage) => {
    if(recievedMessage.author == client.user)
    {
        return
    }
    //botprefix
    if(recievedMessage.content.startsWith("!")) {
        processCommand(recievedMessage)
    }
})

function processCommand(recievedMessage) {
    let fullCommand = recievedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1)

    if(primaryCommand == "help")
    {
        helpCommand(arguments, recievedMessage)
    }
    else if(primaryCommand == "multiply")
    {
        multiplyCommand(arguments, recievedMessage)
    }
    else if(primaryCommand == "play")
    {
        playMusicCommand(arguments,recievedMessage)
    }
    else if(primaryCommand == "skip")
    {
        skipMusicCommand(arguments, recievedMessage)
    }
    else if(primaryCommand == "stop")
    {
        stopMusicCommand(arguments, recievedMessage)
    }
    else{
        recievedMessage.channel.send("Unknown command. Try `!help` or `!multiply`")
    }


}

function multiplyCommand(arguments, recievedMessage){
    if(arguments.length < 2){
        recievedMessage.channel.send("Not enough arguments. Try `!multiply 2 10`")
        return
    }
    let product = 1
    arguments.forEach((value) => {
        product = product * parseFloat(value)
    })
    recievedMessage.channel.send("The product of " + arguments + " is " + product.toString())
}

function helpCommand(arguments, recievedMessage){
    if(arguments.length == 0){
        recievedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    }
    else{
        recievedMessage.channel.send("It looks like you need help with " + arguments)
    }
}

function playMusicCommand(arguments, recievedMessage) {
    execute(recievedMessage, serverQueue)
    return
}
function skipMusicCommand(arguments, recievedMessage) {
    skip(recievedMessage, serverQueue)
    return
}
function stopMusicCommand(arguments, recievedMessage) {
    stop(recievedMessage, serverQueue)
    return
}


client.login(botToken)