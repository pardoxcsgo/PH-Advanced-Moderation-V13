const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const isimler = require("../../models/isimler.js")
const roller = require("../../models/rollog.js")
const notes = require("../../models/notlar.js")
const data = require("../../models/cezalar.js")
const uyarılar = require("../../models/uyar.js")
let serverSettings = require("../../models/serverSettings");

class Sıfırla extends Command {
  constructor (client) {
    super(client, {
      name: "sıfırla",
      usage: ".sıfırla [üye]",
      category: "Owner",
      description: "Belirttiğiniz kullanıcının data verilerini sıfırlamaya yarar.",
      aliases: ["sıfırla"]
    });
  }

  async run (message, args, perm) { 
    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });
    if(!server.BotOwner.includes(message.author.id) && !server.GuildOwner.includes(message.author.id)) return
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return this.client.yolla("Bir kullanıcı belirtmelisin.", message.author, message.channel)

    const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
        .setCustomId('registersıfırla')
        .setLabel("Kayıt Verileri")
        .setStyle('PRIMARY'),
      new Discord.MessageButton()
        .setCustomId('penaltiessıfırla')
        .setLabel("Cezalar")
        .setStyle('SECONDARY'),
        new Discord.MessageButton()
        .setCustomId('uyarısıfırla')
        .setLabel("Uyarılar")
        .setStyle('SECONDARY'),
        new Discord.MessageButton()
        .setCustomId('notlarsıfırla')
        .setLabel("Notlar")
        .setStyle('SUCCESS'),
        new Discord.MessageButton()
        .setCustomId('rollogsıfırla')
        .setLabel("Rol verileri")
        .setStyle('PRIMARY'),
    );
    const row2 = new Discord.MessageActionRow()
    .addComponents(new Discord.MessageButton()
    .setCustomId('CANCEL')
    .setLabel("İptal")
    .setStyle('DANGER'),);
    
   const embed = new Discord.MessageEmbed()
   .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
   .setColor("RANDOM")
   .setDescription(`${message.author} Merhaba! Bu panel kullanıcının veritabanında bulunan verilerini silmeye yarar! ${member} kullanıcısının hangi verilerini silmek istiyorsan o buttona tıklaman yeterli.
\`\`\`diff
- Kayıt verileri (İsimler)
- Cezalar (Ceza Puan, Chat-Voice Mute, Cezalı, Ban)
- Uyarılar (Kullanıcıya verilen uyarılar)
- Notlar (Yetkililer tarafından bırakılan notlar)
- Rol Verileri (Kullanıcıya bot veya sağ tık ile verilmiş, alınmış tüm loglanmış roller) \`\`\`
Bu işlemi sadece bot sahipleri gerçekleştirebilir.
   `)

    let msg = await message.channel.send({ embeds: [embed], components: [row, row2] })

    var filter = (button) => button.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 60000 })

    collector.on('collect', async button => {

        if(button.customId === "registersıfırla") {
            row.components[0].setDisabled(true);
            msg.edit({ components: [row, row2] }); 
            await isimler.deleteMany({ user: member.user.id })
         button.reply(`${member} kullanıcısının kayıt verileri sıfırlandı!`)

        } else if(button.customId === "penaltiessıfırla") {
            row.components[1].setDisabled(true) 
            msg.edit({ components: [row, row2] }); 
            await data.deleteMany({ user: member.user.id })
            button.reply(`${member} kullanıcısının ceza verileri sıfırlandı!`)
         } 
         else if(button.customId === "uyarısıfırla") {
              row.components[2].setDisabled(true);
              msg.edit({ components: [row, row2] }); 
              await uyarılar.deleteMany({ user: member.user.id })
              button.reply(`${member} kullanıcısının uyarı verileri sıfırlandı!`)
        }
         else if(button.customId === "notlarsıfırla") {
        row.components[3].setDisabled(true);
        msg.edit({ components: [row, row2] }); 
        await notes.deleteMany({ user: member.user.id })
        button.reply(`${member} kullanıcısının not verileri sıfırlandı!`)
    }  
    else if(button.customId === "rollogsıfırla") {
        row.components[4].setDisabled(true);
        msg.edit({ components: [row, row2] }); 
        await roller.deleteMany({ user: member.user.id })
        button.reply(`${member} kullanıcısının rol verileri sıfırlandı!`)
    } 
    else if(button.customId === "CANCEL") {
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        row.components[2].setDisabled(true);
        row.components[3].setDisabled(true);
        row.components[4].setDisabled(true);
        row2.components[0].setDisabled(true);

        msg.edit({ components: [row, row2] }); 
    
        button.reply(`İşlem iptal edildi!`);
    } 
    })

     collector.on("end", async (button) => {
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        row.components[2].setDisabled(true);
        row.components[3].setDisabled(true);
        row.components[4].setDisabled(true);
        row2.components[0].setDisabled(true);
        msg.edit({ components: [row, row2] }); 
     })

  }
}

module.exports = Sıfırla;