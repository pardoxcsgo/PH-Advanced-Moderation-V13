const Command = require("../../base/Command.js");
const moment = require("moment")
require("moment-duration-format")
let serverSettings = require("../../models/serverSettings");

class Eval extends Command {
  constructor (client) {
    super(client, {
      name: "reload",
      usage: ".reload",
      category: "BotOwner",
      description: "Botu yeniden başlatır.",
      aliases: ["reload", "reboot"]
    });
  }

  async run (message, args, perm) { 
    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });
    if(!server.BotOwner.includes(message.author.id)) return
   /* if(params[0]) {
        let customId  = params[0].toLowerCase()
        try {
          delete require.cache[require.resolve(`./${customId}.js`)]
          client.commands.delete(customId)
          const pull = require(`./${customId}.js`)
          client.commands.set(customId, pull)
        } catch(e) {
          return message.channel.send(`Bir hata oluştu ve **${customId}** adlı komut reloadlanamadı.`)
        }
    
        message.channel.send(`__**${customId}**__ adlı komut yeniden başlatılıyor!`).then(x => {setTimeout(() => { x.delete(); }, 5000);}).catch(() => { })
    
       return
      }*/
      message.channel.send(`__**Bot**__ yeniden başlatılıyor!`).then(msg => {
        console.log('[BOT] Yeniden başlatılıyor...')
        process.exit(0);


      });
    
  }
}

module.exports = Eval;