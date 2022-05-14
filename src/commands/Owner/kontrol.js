const Command = require("../../base/Command.js");
const Discord = require("discord.js");
let serverSettings = require("../../models/serverSettings");
class Rolsüzver extends Command {
    constructor(client) {
        super(client, {
            name: "kontrol",
            usage: ".kontrol",
            category: "Owner",
            description: "Sunucudaki rolleri düzgün olmayan kullanıcıları düzeltmenize yarar.",
            aliases: ["kontrol"]
        });
    }
    async run(message, args, data) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if(!server.BotOwner.includes(message.author.id) && !server.GuildOwner.includes(message.author.id)) return
  
        let rolsuz = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)
        let tagolan = message.guild.members.cache.filter(s => s.user.username.includes(server.Tag) && !s.roles.cache.has(`${server.FamilyRole}`))           
        let tagolmayan =  message.guild.members.cache.filter(s => s.roles.cache.has(`${server.FamilyRole}`) && !s.user.username.includes(server.Tag))

        const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('taglı')
            .setLabel("Taglı kontrol")
            .setStyle('PRIMARY'),
            new Discord.MessageButton()
            .setCustomId('rolsüz')
            .setLabel("Rolsüz kontrol")
            .setStyle('PRIMARY'),      
          new Discord.MessageButton()
            .setCustomId('CANCEL')
            .setLabel("İptal")
            .setStyle('DANGER'),
        );       
      
        const embed = new Discord.MessageEmbed()
       .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
       .setColor("RANDOM")
       .setDescription(`
\`${message.guild.name}\` sunucusundaki kontrolleri yapmak için aşağıdaki buttonları kullanman yeterli olacaktır.
`)
.addFields(
{ name: "Tagı olup rolü olmayan", value: `
\`\`\`fix
${tagolan.size} kişi
\`\`\`
`, inline: true },
{ name: "Tagı olmayıp rolü olan", value: `
\`\`\`fix
${tagolmayan.size} kişi
\`\`\`
`, inline: true },
{ name: "Hiç Bir Rolü bulunmayan", value: `
\`\`\`fix
${rolsuz.size} kişi
\`\`\`
`, inline: true }
)  

  let msg = await message.channel.send({ embeds: [embed], components: [row] })
  var filter = (button) => button.user.id === message.author.id;
  const collector = msg.createMessageComponentCollector({ filter, time: 30000 })

  collector.on("collect", async (button) => {
      if(button.customId === "taglı") {
          row.components[0].setDisabled(true);
          msg.edit({ components: [row] })

        message.guild.members.cache.filter(s => s.user.username.includes(server.Tag) && !s.roles.cache.has(server.FamilyRole)).map(x=> x.roles.add(server.FamilyRole))                
        message.guild.members.cache.filter(s => s.roles.cache.has(`${server.FamilyRole}`) && !s.user.username.includes(server.Tag)).map(x=> x.roles.remove(server.FamilyRole) )
       button.reply(`Tagı olup rolü olmayan ${tagolan.size} kişiye taglı rolünü verdim. Tagı olmayıp rolü olan ${tagolmayan.size} kişiden taglı rolünü aldım.`)

      }  else if(button.customId === "rolsüz") {
        row.components[1].setDisabled(true);
        msg.edit({ components: [row] })
        rolsuz.forEach(r => {
            r.roles.add(server.UnregisteredRole)
        })
        button.reply(`Sunucuda herhangi bir role sahip olmayan ${rolsuz.size} kişiye kayıtsız rolünü verdim.`)
      } else if(button.customId === "CANCEL") {
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        row.components[2].setDisabled(true);
        msg.edit({ components: [row] })
        button.reply("İşlem iptal edildi!")

      }
  })

    }

}
module.exports = Rolsüzver;