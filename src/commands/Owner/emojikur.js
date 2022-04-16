const Command = require("../../base/Command.js");
const moment = require("moment")
require("moment-duration-format")
let serverSettings = require("../../models/serverSettings");

class Eval extends Command {
  constructor (client) {
    super(client, {
      name: "emoji",
      description: "Evaluates arbitrary Javascript.",
      category:"System",
      usage: "eval <expression>",
      aliases: ["emoji"]
    });
  }

  async run (message, args, perm) { 
    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });
    if(!server.BotOwner.includes(message.author.id)) return
    if(args[0] === "kur" || args[0] === "kurulum") {

        let zade_vunmute = "https://cdn.discordapp.com/emojis/933325556722847786.webp?size=96&quality=lossless";
        let zade_slotgif = "https://cdn.discordapp.com/emojis/926963384556093520.gif?size=96&quality=lossless";
        let zade_patlican = "https://cdn.discordapp.com/emojis/926963384623181874.webp?size=96&quality=lossless";
        let canzade_unmute = "https://cdn.discordapp.com/emojis/933325273632489512.webp?size=96&quality=lossless";
        let coin = "https://cdn.discordapp.com/emojis/926963384623173633.webp?size=96&quality=lossless";
        let coinflip = "https://cdn.discordapp.com/emojis/926963384786763796.gif?size=96&quality=lossless";
        let no_zade = "https://cdn.discordapp.com/emojis/929716459461042248.webp?size=96&quality=lossless";
        let yes_zade = "https://cdn.discordapp.com/emojis/929716459809177651.webp?size=96&quality=lossless";
        let zade_kalp = "https://cdn.discordapp.com/emojis/926963384774197298.webp?size=96&quality=lossless";
        let zade_kiraz = "https://cdn.discordapp.com/emojis/926963384350539797.webp?size=96&quality=lossless";
        let zade_mute = "https://cdn.discordapp.com/emojis/929716460010500106.webp?size=96&quality=lossless";
        let zade_para = "https://cdn.discordapp.com/emojis/926963384937762916.gif?size=96&quality=lossless";
    
        message.guild.emojis.create(zade_vunmute, "zade_vunmute").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(zade_slotgif, "zade_slotgif").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(zade_patlican, "zade_patlican").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(canzade_unmute, "canzade_unmute").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(coin, "coin").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(coinflip, "coinflip").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(no_zade, "no_zade").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(yes_zade, "yes_zade").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(zade_kalp, "zade_kalp").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(zade_kiraz, "zade_kiraz").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(zade_mute, "zade_mute").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(zade_para, "zade_para").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
     
        return;
    }
  }
}

module.exports = Eval;