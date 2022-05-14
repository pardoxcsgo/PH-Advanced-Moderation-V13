const Discord = require("discord.js");
const mutedUser = require("../models/voicemute.js")
const ms = require("ms")
let serverSettings = require("../models/serverSettings");
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
module.exports = class {
    constructor(client) {
      this.client = client;
    }
  
    async run(member , muteType) {
        let server = await serverSettings.findOne({
   
        });
        await member.guild.fetchAuditLogs({type: "MEMBER_MUTE_UPDATE"}).then(async (audit) => {
            let ayar = audit.entries.first()
            let yapan = ayar.executor
            let sunucu = member.guild
            if (yapan.id == this.client.user.id) return;
            if(server.GuildOwner.includes(yapan.id)) return
            mutedUser.findOne({user: member.id}, async (err, doc) => {
                if (!doc) return
                if (doc.muted == true) {
                    if (muteType == "server-muted") {
                        const embed = new Discord.MessageEmbed()
                        .setAuthor({ name: yapan.tag, iconURL: yapan.displayAvatarURL({ dynamic: true })})
                        .setDescription(`
${member} adlı kullanıcının ses susturması bitmeden mutesi sağ tık ile açıldı.

Susturmayı açan yetkili: ${yapan} (\`${yapan.tag}\` - \`${yapan.id}\`)
Cezayı uygulayan yetkili <@${doc.yetkili}> - (\`${doc.yetkili}\`)`)
                        .setThumbnail(yapan.displayAvatarURL({dynamic: true}))
                        .setFooter({ text: "Bitmesine kalan süre: "+moment(doc.endDate).format("h:mm:ss")+""})
                        this.client.channels.cache.get(server.RightClickRemovePunishmentLog).send({embeds: [embed]})
                        if (member.voice.setMute(true)) {
                            member.voice.setMute(true)
                            yapan.send(`${member} adlı kullanıcının ses susturması bitmeden mutesini sağ tık ile açtığınız için kullanıcıyı yeniden susturdum. Lütfen ceza süreleri bitmeden herhangi bir sağ tık işlemi uygulamayın.`).catch(e => console.log(e))
                        }
                    }       
                }
            })
        })
    }
};