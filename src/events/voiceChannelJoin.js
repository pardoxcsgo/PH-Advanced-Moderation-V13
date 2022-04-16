let database = require("../models/voicemute.js")
const mutes = require("../models/waitMute.js")
const Discord = require("discord.js");
let serverSettings = require("../models/serverSettings");
const moment = require("moment")
require("moment-duration-format")
const ms = require("ms");
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(member, channel) {
        let server = await serverSettings.findOne({
   
        });
        if (member.user.bot) return;
        if(!this.client.channelTime.has(member.id)) {
        this.client.channelTime.set(member.id, {channel: channel.id, time: Date.now()})
        }
        await mutes.findOne({ user: member.id }, async (err, res) => {
            if (!res) return
            await database.findOne({ user: member.id }, async (err, doc) => {
                if (!doc) {
                    const newData = new database({
                        user: member.id,
                        muted: true,
                        yetkili: res.yetkili,
                        endDate: Date.now() + res.date,
                        start: Date.now(),
                        sebep: res.sebep
                    })
                    newData.save().catch(e => console.log(e))
                }
            })
            member.voice.setMute(true, res.sebep)
            let userx = this.client.users.cache.get(res.yetkili)
            let sonraki = Date.parse(new Date()) + res.date
            const mutelendi = new Discord.MessageEmbed()
                .setAuthor({ name: userx.tag, iconURL: userx.displayAvatarURL({ dynamic: true })})
                .setColor("32CD32")
                .setFooter({ text: `Ceza Numarası: #${res.cezano}`})
                .setDescription(`
${member} (\`${member.user.tag}\` - \`${member.id}\`) kişisinin ${await this.client.turkishDate(res.date)} süresi boyunca ses mute cezası otomatik olarak başlatıldı.

• Susturulma sebebi: \`${res.sebep}\`\n• Ses Mute atılma tarihi: \`${moment(Date.parse(new Date())).format("LLL")}\`
• Ses Mute bitiş tarihi: \`${moment(sonraki).format("LLL")}\``)
            await this.client.channels.cache.get(server.VoiceMuteLog).send({ embeds: [mutelendi]})
            await mutes.deleteOne({ user: member.id }, async (err) => {
                if (err) { console.log("Silinemedi.") }
            })
        })

  }
};
