const Command = require("../../base/Command.js");
const data = require("../../models/cezalar.js")
let serverSettings = require("../../models/serverSettings");
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const { table } = require('table');
class Cezalar extends Command {
    constructor(client) {
        super(client, {
            name: "cezalar",
            aliases: ["cezalar", "ihlaller"]
        });
    }

    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
		if (!message.member.roles.cache.some(r => server.JailAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Ceza bilgilerine bakmak istediğin kullanıcyı belirtmelisin", message.author, message.channel)
        await data.find({ user: user.id }).sort({ ihlal: "descending" }).exec(async (err, res) => {
            if(!res) return this.client.yolla(`${user} kullanıcısının ceza bilgisi bulunmuyor.`, message.author, message.channel)
            let datax = [
                ["ID", "Tarih", "Ceza", "Sebep"]
            ];

            let dataxe = [
                ["ID", "Ceza", "Tarih", "Bitiş", "Yetkili", "Sebep"]
            ];

            let config = {
                border: {
                    topBody: ``,
                    topJoin: ``,
                    topLeft: ``,
                    topRight: ``,

                    bottomBody: ``,
                    bottomJoin: ``,
                    bottomLeft: ``,
                    bottomRight: ``,

                    bodyLeft: `│`,
                    bodyRight: `│`,
                    bodyJoin: `│`,

                    joinBody: ``,
                    joinLeft: ``,
                    joinRight: ``,
                    joinJoin: ``
                }
            };
            res.map(x => {
                datax.push([x.ihlal, x.tarih, x.ceza, x.sebep])
            })
            let cezaSayi = datax.length - 1
            if(cezaSayi == 0) return this.client.yolla(`${user} kullanıcısının ceza bilgisi bulunmuyor.`, message.author, message.channel)

            res.map(x => {
                dataxe.push([x.ihlal, x.ceza, x.tarih, x.bitiş, this.client.users.cache.get(x.yetkili).tag, x.sebep])
            })

            let out = table(dataxe, config)
            let outi = table(datax.slice(0, 15), config)
            message.channel.send("<@" + user.id + "> kullanıcısının toplam " + cezaSayi + " cezası bulunmakta son 15 ceza aşağıda belirtilmiştir. Tüm ceza bilgi dosyasını indirmek için 🚫 emojisine, ceza sayılarına bakmak için ❔ emojisine basabilirsin.Tekli bir cezaya bakmak için `!ceza ID` komutunu uygulayınız. ```fix\n" + outi + "\n``` ").then(async msg => {

                let reactions = ['🚫', '❔'];
                for(let reaction of reactions) await msg.react(reaction);
                
                const first= msg.createReactionCollector((reaction, user) => reaction.emoji.name == "🚫" && user.id == message.author.id, { time: 30000 });
                                const second = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❔" && user.id == message.author.id, { time: 30000 });
                
                first.on('collect', async reaction => {
                            message.channel.send(`${user} kullanıcısının toplam ${datax.length - 1} cezası aşağıdaki belgede yazmaktadır.`, { files: [{ attachment: Buffer.from(out), name: `${user.user.username}_cezalar.txt` }] }).then(msg => {
                                setTimeout(() => { msg.delete(); }, 15000);
                            })    })
                            second.on('collect', async reaction => {
                            let filterArr = res.map(x => (x.ceza))
                            let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
                            let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
                            let jail = filterArr.filter(x => x == "Cezalı").length || 0
                            let ban = filterArr.filter(x => x == "Yasaklı").length || 0
                            let puan = await this.client.punishPoint(user.id)
                            msg.edit("" + user.user.tag + " kullanıcısının ceza bilgileri aşağıda belirtilmiştir:\n\nChat Mute: " + chatMute + " kez.\nSes Mute: " + voiceMute + " kez.\nCezalı Bilgisi: "+ jail + " kez.\nBan Bilgisi: " + ban + " kez.\n\nKullanıcı toplamda " + cezaSayi + " kez kural ihlali yapmış, kullanıcının ceza puanı "+puan+".", {code: "js"})
                        })
                    
                    } )  
        })
    }
}

module.exports = Cezalar;