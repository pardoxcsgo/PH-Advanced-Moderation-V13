const Command = require("../../base/Command.js")
const { MessageEmbed } = require("discord.js")
let serverSettings = require("../../models/serverSettings");
const fs = require("fs")
class Kanal extends Command {
    constructor(client) {
        super(client, {
            name: "kanal",
            aliases: ["kanal", "kilit"]
        });
    }
    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
if(!message.member.roles.cache.has(server.GuildOwner) && !message.member.permissions.has("ADMINISTRATOR")) return

if (!args[0]) return this.client.yolla(`
Yanlış bir argüman kullandınız  
!kanal kilit/aç = Komutu kullandığınız kanaldaki mesaj gönderme izinlerini kapatıp, açar.
!kanal register kilit/aç = Register kategorisindeki tüm kanallara mesaj gönderme, ses kanalına bağlanma yetkisini ve teyit sistemini kapatır, açar.
`, message.author, message.channel)

  let channels = message.guild.channels.cache.filter(ch => ch.parentId == server.RegisterParent);
 
  if (args[0] == "kilit") {
    message.channel.permissionOverwrites.edit(message.guild.id, {
        SEND_MESSAGES: false
    }).then(async() => {
        await this.client.yolla("Kanal başarıyla kilitlendi.", message.author, message.channel)
    })
}

if (args[0] == "aç") {
    message.channel.permissionOverwrites.edit(message.guild.id, {
        SEND_MESSAGES: true
    }).then(async() => {
        await this.client.yolla("Kanalın kilidi başarıyla açıldı.", message.author, message.channel)
    })
  }
  if (args[0] === "register")  {
  if (args[1] == "aç") {
{
    server.RegisterSystem = true;
    server.save();

        channels.forEach(ch => {
          ch.permissionOverwrites.edit(`${server.UnregisteredRole}`, {
              SEND_MESSAGES: true,
              CONNECT: true
          });
      });
    
        this.client.yolla("Teyit kanalları ve teyit sistemi açıldı.", message.author, message.channel)  
      
} 
  }
  if (args[1] == "kilit") { 
    server.RegisterSystem = false;
    server.save();
    channels.forEach(ch => {
        ch.permissionOverwrites.edit(`${server.UnregisteredRole}`, {
            SEND_MESSAGES: false,
            CONNECT: false
        });
    });
  
    this.client.yolla("Teyit kanalları ve teyit sistemi kapatıldı.", message.author, message.channel)  
}
  }


}


}



module.exports = Kanal;
