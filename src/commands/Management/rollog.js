const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const roller = require("../../models/rollog.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")

class Rollog2 extends Command {
    constructor(client) {
        super(client, {
            name: "rollog",
            usage: "",
            aliases: ["rol-log", "rollogs", "rol-logs"]
        });
    }

    async run(message, args, level) {
        if (!message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const Veri = await roller.findOne({ user: Member.id });
        if (!Veri) return this.client.yolla("<@" + Member.id + "> kişisinin rol bilgisi veritabanında bulunmadı.", message.author, message.channel)
        let page = 1;
        let rol = Veri.roller.sort((a, b) => b.tarih - a.tarih)
       // let liste = rol.map(x => `${x.state == "Ekleme" ? this.client.ok : this.client.no} Rol: <@&${x.rol}> Yetkili: <@${x.mod}>\nTarih: ${moment(x.tarih).format("LLL")}`)
       let liste = rol.map(x => `\`[${moment(x.tarih).format("LLL")}, ${x.state}]\` <@${x.mod}>: <@&${x.rol}>`)
       var msg = await message.channel.send({ embeds: [new Discord.MessageEmbed().setDescription(`
${Member} kişisinin toplam da verilmiş-alınmış ${Veri.roller.length} rollere ait bilgisi bulunmakta, rollerin bilgileri aşağıda belirttim.

${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}`).setColor("RANDOM").setAuthor({ name: Member.user.tag, iconURL: Member.user.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${Member.id}` })]})
        if (liste.length > 10) {
            await msg.react(`⬅️`);
            await msg.react(`➡️`);
            let collector = msg.createReactionCollector((react, user) => ["⬅️", "➡️"].some(e => e == react.emoji.name) && user.id == message.member.id, { time: 200000 });
            collector.on("collect", (react) => {
                if (react.emoji.name == "➡️") {
                    if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
                    page += 1;
                    let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    msg.edit({ embeds: [new Discord.MessageEmbed().setColor("RANDOM").setDescription(`
${Member} kişisinin toplam da verilmiş-alınmış ${Veri.roller.length} rollere ait bilgisi bulunmakta, rollerin bilgileri aşağıda belirttim.
                    
${rollogVeri}`).setAuthor({ name: Member.user.tag, iconURL: Member.user.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${Member.id}` })]})
                    react.users.remove(message.author.id)
                }
                if (react.emoji.name == "⬅️") {
                    if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
                    page -= 1;
                    let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    msg.edit({ embeds: [new Discord.MessageEmbed().setColor("RANDOM").setDescription(`${Member} kişisinin toplam da verilmiş-alınmış ${Veri.roller.length} rollere ait bilgisi bulunmakta, rollerin bilgileri aşağıda belirttim.
                    
${rollogVeri}`).setAuthor({ name: Member.user.tag, iconURL: Member.user.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${Member.id}` })]})
                    react.users.remove(message.author.id)
                }
            })
        }
    }
}
module.exports = Rollog2;
