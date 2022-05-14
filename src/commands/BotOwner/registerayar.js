const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const kayıtlar = require("../../models/kayıtlar.js")
let serverSettings = require("../../models/serverSettings");
class TeyitAyar extends Command {
  constructor(client) {
      super(client, {
          name: "teyitmod",
          usage: ".teyitmod",
          category: "BotOwner",
          description: "Teyitmodunu değiştirmeyi sağlar.",
          aliases: ["teyitmod"]
      });
  }
  async run(message, args, client) {
    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });
  if(!server.BotOwner.includes(message.author.id)) return

const row = new Discord.MessageActionRow()
.addComponents(
  new Discord.MessageButton()
  .setCustomId('GenderRegister')
  .setLabel("Normal Teyit")
  .setStyle('PRIMARY'),
  new Discord.MessageButton()
    .setCustomId('ButtonRegister')
    .setLabel("Button Teyit")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('ZadeRegisterSystem')
    .setLabel("Etiketsiz Teyit")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('CANCEL')
    .setLabel("İptal")
    .setStyle('DANGER'))


   const embed = new Discord.MessageEmbed()
 
   .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
   .setColor("RANDOM")
   .setTitle(`Bu komut teyit modları arasında geçiş yapmanızı sağlar. Teyit modları:`)
   .setDescription(`
**1- Normal teyit (.e @Zade Can 22)**
**2- Buttonlu teyit (.isim @Zade Can 22 - Button seçim)**
**3- Etiketsiz teyit (.isim @Zade Can 22 - .e)**
\`\`\`Şuanki teyit modu: ${server.ZadeRegisterSystem ? "Etiketsiz teyit." :  "Normal teyit."} ${server.ButtonRegister? "Buttonlu teyit." : "" }\`\`\``)
 

let msg = await message.channel.send({ embeds: [embed], components: [row] })

var filter = (button) => button.user.id === message.author.id;
const collector = msg.createMessageComponentCollector({ filter, time: 30000 })

    collector.on("collect", async (button) => {
       
      if(button.customId === "GenderRegister") {

      row.components[0].setDisabled(true)
      msg.edit({ components: [row] })

      server.GenderRegister = true;
      server.ZadeRegisterSystem = false;
      server.ButtonRegister = false;
      server.save();
      button.reply("Teyit modu cinsiyet olarak değiştirildi. Artık \`.e @Zade Can 22\` ile kayıt yapılabilecek")

      } else if(button.customId === "ButtonRegister") {
        row.components[1].setDisabled(true)
        msg.edit({ components: [row] })
          
        server.ButtonRegister = true;
        server.ZadeRegisterSystem = false;
        server.GenderRegister = false;
        server.save();

        button.reply("Teyit modu buttonlu olarak değiştirildi. Artık \`.isim @Zade Can 22 - Button seçim\` ile kayıt yapılabilecek")

      } else if(button.customId === "ZadeRegisterSystem") {
        row.components[2].setDisabled(true)
        msg.edit({ components: [row] })
          
        server.ZadeRegisterSystem = true;
        server.ButtonRegister = false;
        server.GenderRegister = false;
        server.save();

        button.reply("Teyit modu etiketsiz olarak değiştirildi. Artık \`.isim @Zade Can 22 - .e\` ile kayıt yapılabilecek")

        } else if(button.customId === "CANCEL") {
        row.components[0].setDisabled(true)
        row.components[1].setDisabled(true)
        row.components[2].setDisabled(true)
        row.components[3].setDisabled(true)
        msg.edit({ components: [row] })

        button.reply("İşlem iptal edildi.")


      }
    })

    collector.on("end", async (button, reason) => {

      row.components[0].setDisabled(true)
      row.components[1].setDisabled(true)
      row.components[2].setDisabled(true)
      row.components[3].setDisabled(true)
      msg.edit({ components: [row] })
    })
  }

}


module.exports = TeyitAyar;