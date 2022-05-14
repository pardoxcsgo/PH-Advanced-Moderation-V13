const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const kayıtlar = require("../../models/kayıtlar.js")
let serverSettings = require("../../models/serverSettings");
class taglıalım extends Command {
    constructor(client) {
        super(client, {
            name: "taglıalım",
            usage: ".taglıalım aç/kapat",
            category: "BotOwner",
            description: "Taglı alımı açıp kapatmaya yarar.",
            aliases: ["taglıalım","taglialim","taglıalim","taglialım","taglı-alım"]
        });
    }

    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if(!server.BotOwner.includes(message.author.id)) return
       
        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setCustomId('Open')
            .setLabel("Aç")
            .setStyle('SUCCESS'),
            new Discord.MessageButton()
            .setCustomId('Off')
            .setLabel("Kapat")
            .setStyle('DANGER'),
            new Discord.MessageButton()
            .setCustomId('CANCEL')
            .setLabel("İptal")
            .setStyle('DANGER'),
        );
     
    const embed = new Discord.MessageEmbed()
    .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
    .setColor("RANDOM")
    .setDescription(`
Bu komut sunucu içerisindeki taglı alımı açıp kapatmanıza yarar
Unutma üye sayısı 5bin ve 5binden fazla olan bir sunucuda taglı alımı aktifleştiremezsin.
\`\`\`diff
- Taglı alım modu şuan (${server.TaggedMode ? `Açık` : `kapalı`})
\`\`\`
`)

    let msg = await message.channel.send({ embeds: [embed], components: [row] })

    var filter = (button) => button.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 60000 })

    collector.on("collect", async(button) => {
        if(button.customId === "Open") {
            row.components[0].setDisabled(true)
            msg.edit({ components: [row] })

            if(message.guild.members.cache.size >= 5000) return button.reply("5 bin üyeden fazla biye üye sayısına sahip olan sunucuda taglı alım modunu aktifleştiremezsin. Mevcut üye sayısı "+message.guild.members.cache.size+"")
            if (server && server.TaggedMode === true) return button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} Taglı alım zaten açık!`)
            server.TaggedMode = true;
            server.save();
            button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} Taglı alım modu başarıyla aktif edildi! Kayıtlı olup tagı olmayan kullanıcılar kayıtsıza atılacak. (Boost, Vip üyeler hariç)`)
        
        } else if(button.customId === "Off") {
            row.components[1].setDisabled(true)
            msg.edit({ components: [row] })

            if (server && server.TaggedMode === false) return button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} Taglı alım zaten kapalı!`)
                server.TaggedMode = false;
                server.save();
                button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} Taglı alım modu başarıyla kapatıldı!`)
        
            } else if(button.customId === "CANCEL") {
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(true)
                row.components[2].setDisabled(true)

                msg.edit({ components: [row] })

                button.reply("İşlem iptal edildi!")

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

module.exports = taglıalım;
