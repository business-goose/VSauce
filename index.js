var discord = require("discord.js")
var request = require("request")
var fs = require("fs")
var configuration = require("./config.json")
var client = new discord.Client();
var sets = require("./setUrls.json")
var text;

if (!fs.existsSync("sets")) fs.mkdirSync("sets");

console.log("Client on standby\nDownloading definitions, please wait...")
sets.forEach(function(url, index) {
    request(url, function(err, res, body) {
        fs.writeFileSync(__dirname + "/sets/" + index, body)
    })
})

client.login(configuration.token)

client.on("ready", function() {
    console.log("Hey VSauce, Micheal Here.")
    var things = fs.readdirSync(__dirname + "/sets")

    things.forEach(function(thing) {
        text += " " + fs.readFileSync(__dirname + "/sets/" + thing).toString()
    })
})

client.on("message", async function(msg) {
    if (msg.author.id != client.user.id && msg.content.toLowerCase().includes("vsauce") && !msg.author.bot) {
        var words = msg.content.toLowerCase().replace(/vsauce/gm, "").split(" ")
        for (i = 0; i < words.length; i++) {
            if (words[i] == "") {
                words.splice(i, 1)
            }
        }
        var split = text.split(" ")
        var message = "";

        await split.forEach(function(value, i) {
            var a = Math.floor(Math.random() * words.length)
            if (split[i] == words[a]) {
                if (Math.floor(Math.random() * 100) >= 50) {
                    message += " " + split[i];
                    for (var x = 0; x < Math.floor(Math.random() * 5); x++) {
                        message += ` ${((Math.floor(Math.random() * 5) == 4) ? split[i+x] : split[i-x])}`
                    }
                }
            }
        })
        var chunks = message.match(/(.|[\r\n]){1,2000}/g);
        if (chunks) {
            chunks.forEach(function(value, index) {
                msg.channel.send(value).catch(() => {})
            })
        } else {
			msg.channel.send(msg.content.replace(/vsauce/gm,""))
        }
        if (msg.author.id != client.user.id) {
            text += msg.content
            fs.appendFileSync(__dirname + "/sets/" + msg.author.id + ".txt", msg.content + "\n")
        }
    }
})