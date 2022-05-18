const Command = require("../../base/Command.js")
const Discord = require("discord.js")
let serverSettings = require("../../models/serverSettings");
class Koruma extends Command {
    constructor(client) {
        super(client, {
            name: "Koruma",
            usage: ".koruma",
            category: "Owner",
            description: "Yetkilerdeki izinleri açıp kapatmaya yarar.",
            aliases: ["koruma"]
        });
    }

    async run(message, args, perm) {
     
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if(!server.BotOwner.includes(message.author.id) && !server.GuildOwner.includes(message.author.id)) return
   
       
       const cancık = new Discord.MessageEmbed()
       .setColor("RANDOM")
       .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
       .setDescription(`
${message.author}, Sunucudaki yetkileri açıp kapatmak için aşağıdaki butonları seçin. Kapatıp açılacak yetkiler sırasıyla:

<@&${server.ManagementRoles[0]}>: [8](https://discordapi.com/permissions.html#8)
<@&${server.ManagementRoles[1]}>: [402784260](https://discordapi.com/permissions.html#402784260)
<@&${server.ManagementRoles[2]}>: [268436608](https://discordapi.com/permissions.html#268436608)
<@&${server.ManagementRoles[3]}>: [128](https://discordapi.com/permissions.html#128)
<@&${server.ManagementRoles[4]}>: [128](https://discordapi.com/permissions.html#128)

olarak belirlenmiştir.`)

        const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('Aç')
            .setLabel("Aç")
            .setStyle('PRIMARY'),
            new Discord.MessageButton()
            .setCustomId('Kapat')
            .setLabel("Kapat")
            .setStyle('DANGER'),      
          new Discord.MessageButton()
            .setCustomId('İptal')
            .setLabel("İptal")
            .setStyle('DANGER'),
        );       
               var msg = await message.channel.send({ embeds: [cancık], components: [row]})
               var filter = (button) => button.user.id === message.author.id;
               const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
  
          
          collector.on("collect", async(button) => {

            if(button.customId === "Aç") {

            row.components[0].setDisabled(true)

            msg.edit({ components: [row] })

            message.guild.roles.cache.get(server.ManagementRoles[0]).setPermissions([Discord.Permissions.FLAGS.ADMINISTRATOR]);//Führer
            message.guild.roles.cache.get(server.ManagementRoles[1]).setPermissions([Discord.Permissions.FLAGS.MANAGE_ROLES, Discord.Permissions.FLAGS.BAN_MEMBERS, Discord.Permissions.FLAGS.MANAGE_NICKNAMES, Discord.Permissions.FLAGS.MENTION_EVERYONE]);//Owner 
            message.guild.roles.cache.get(server.ManagementRoles[2]).setPermissions([Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.MANAGE_CHANNELS, Discord.Permissions.FLAGS.VIEW_AUDIT_LOG]);//CEO
            message.guild.roles.cache.get(server.ManagementRoles[3]).setPermissions([Discord.Permissions.FLAGS.VIEW_AUDIT_LOG]);//Bael
            message.guild.roles.cache.get(server.ManagementRoles[4]).setPermissions([Discord.Permissions.FLAGS.VIEW_AUDIT_LOG]);//Çift Yıldız
            
             const aç = new Discord.MessageEmbed()
         .setColor("RANDOM")
         .setDescription(`**Açılan Yetkiler Sırasıyla Aşağıda Belirtilmiştir.**\n
<@&${server.ManagementRoles[0]}>: [8](https://discordapi.com/permissions.html#8)
<@&${server.ManagementRoles[1]}>: [402784260](https://discordapi.com/permissions.html#402784260)
<@&${server.ManagementRoles[2]}>: [268436608](https://discordapi.com/permissions.html#268436608)
<@&${server.ManagementRoles[3]}>: [128](https://discordapi.com/permissions.html#128)
<@&${server.ManagementRoles[4]}>: [128](https://discordapi.com/permissions.html#128)
        `)
            button.reply({ embeds: [aç]})

            } else if(button.customId === "Kapat") {
             row.components[1].setDisabled(true)
             msg.edit({ components: [row] })

            message.guild.roles.cache.get(server.ManagementRoles[0]).setPermissions([]);//Führer
            message.guild.roles.cache.get(server.ManagementRoles[1]).setPermissions([]);//Owner
            message.guild.roles.cache.get(server.ManagementRoles[2]).setPermissions([]);//CEO
            message.guild.roles.cache.get(server.ManagementRoles[3]).setPermissions([]);//Bael
            message.guild.roles.cache.get(server.ManagementRoles[4]).setPermissions([]);//Çift Yıldız

             const kapat = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`**Kapatılan Yetkiler Sırasıyla Aşağıda Belirtilmiştir.**\n
<@&${server.ManagementRoles[0]}>: [PERMLER](https://discordapi.com/permissions.html#PERMLER)
<@&${server.ManagementRoles[1]}>: [PERMLER](https://discordapi.com/permissions.html#PERMLER)
<@&${server.ManagementRoles[2]}>: [PERMLER](https://discordapi.com/permissions.html#PERMLER)
<@&${server.ManagementRoles[3]}>: [PERMLER](https://discordapi.com/permissions.html#PERMLER)
<@&${server.ManagementRoles[4]}>: [PERMLER](https://discordapi.com/permissions.html#PERMLER)
           `)
               button.reply({ embeds: [kapat]})

            } else if(button.customId === "İptal") {
              row.components[0].setDisabled(true)
              row.components[1].setDisabled(true)
              row.components[2].setDisabled(true)

              msg.edit({ components: [row] })

              button.reply("İşlem iptal edildi")
            }

          })
          
          collector.on("end", async(button) => {
              row.components[0].setDisabled(true)
              row.components[1].setDisabled(true)
              row.components[2].setDisabled(true)

              msg.edit({ components: [row] })

          })

        }
}

module.exports = Koruma;
