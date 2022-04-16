const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const kayıtlar = require("../../models/kayıtlar.js")
let serverSettings = require("../../models/serverSettings");
class TeyitAyar extends Command {
  constructor(client) {
      super(client, {
          name: "teyitmod",
          description: "Latency and API response times.",
          usage: "teyitmod",
          aliases: ["teyitmod"]
      });
  }
  async run(message, args, client) {
    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });
  if(!server.BotOwner.includes(message.author.id)) return

    if (!args[0]) return this.client.yolla(`
Yanlış bir argüman kullandınız!  
Teyit formatını değiştirmek için **!teyitmod değiştir**
Mevcut kayıt formatı **${server.GenderRegister ? ".e @Zade Can 22" : ".isim @Zade Can 22 - .e"}**`, message.author, message.channel)

if (args[0] == "değiştir") {
    if(!server.GenderRegister) {
      server.GenderRegister = true;
      server.save();
        this.client.yolla(`
Kayıt formatı başarıyla değiştirildi. 
Artık **${server.GenderRegister ? ".e @Zade Can 22" : ".isim @Zade Can 22 - .e"}** şeklinde kayıt gerçekleştirebilecek!`, message.author, message.channel);
    } 
    else if(server.GenderRegister) {
      server.GenderRegister = false;
      server.save();
      this.client.yolla(`
Kayıt formatı başarıyla değiştirildi. 
Artık **${!server.GenderRegister ? ".isim @Zade Can 22 - .e" : ".e @Zade Can 22"}** şeklinde kayıt gerçekleştirebilecek!`, message.author, message.channel); 
    }
  }
}

}


module.exports = TeyitAyar;