const roller = require("../models/rollog.js")
const Discord = require("discord.js")
const isimler = require("../models/isimler.js")
let serverSettings = require("../models/serverSettings");
module.exports = class {
    constructor(client) {
        this.client = client;
    }
    async run(oldMember, newMember) {
        let server = await serverSettings.findOne({
   
        });
        if (oldMember.roles.cache.has(server.BoosterRole) && !newMember.roles.cache.has(server.BoosterRole)) try {
            isimler.findOne({user: newMember.id}, async(err, res) => {
                if(!res) return
              if (!res.isimler) return;
              res = res.isimler.reverse()
              var History = res.splice(0, 1).map(e => e.isim.replace())
              if (oldMember.roles.cache.has(server.BoosterRole) && !newMember.roles.cache.has(server.BoosterRole)) {
                let setName = `${History}`;
                if (newMember.manageable) { await newMember.setNickname(`${setName}`, "Boostunu çektiği/bittiği için kullanıcı adı eski haline çevirildi.") }
              };
            })
          } catch (error) {
            client.logger.error(`Etkinlik: ${module.exports.name} \nHata: ` + error + ``)
          }
         const kanal = this.client.channels.cache.get(server.RightClickRoleManageLog)
        await newMember.guild.fetchAuditLogs({
            type: "MEMBER_ROLE_UPDATE"
        }).then(async (audit) => {
            let ayar = audit.entries.first()
            let hedef = ayar.target
            let yapan = ayar.executor
            if (yapan.bot) return
            newMember.roles.cache.forEach(async role => {
                if (!oldMember.roles.cache.has(role.id)) {
                    const emed = new Discord.MessageEmbed()
                    .setAuthor({ name: hedef.tag, iconURL: hedef.displayAvatarURL({ dynamic: true })})
                        .setColor("RANDOM")
                        .setDescription(`
                        **Rol Eklenen kişi**\n ${hedef} - **${hedef.id}** `)
                        .addField(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} Rolü Ekleyen Kişi`, `${yapan} - **${yapan.id}**`, false)
                        .addField(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} Eklenen Rol`, `${role} - **${role.id}**`, false)
                        .setFooter({ text: yapan.tag, iconURL: yapan.displayAvatarURL({ dynamic: true })})
                        .setTimestamp()
                        kanal.send({embeds: [emed]})
                    roller.findOne({
                        user: hedef.id
                    }, async (err, res) => {
                        if (!res) {
                            let arr = []
                            arr.push({
                                rol: role.id,
                                mod: yapan.id,
                                tarih: Date.parse(new Date()),
                                state: "Ekleme"
                            })
                            let newData = new roller({
                                user: hedef.id,
                                roller: arr
                            })
                            newData.save().catch(e => console.log(e))
                        } else {
                            res.roller.push({
                                rol: role.id,
                                mod: yapan.id,
                                tarih: Date.parse(new Date()),
                                state: "Ekleme"
                            })
                            res.save().catch(e => console.log(e))
                        }
                    })
                }
            });
            oldMember.roles.cache.forEach(async role => {
                if (!newMember.roles.cache.has(role.id)) {
                    const emeed = new Discord.MessageEmbed()
                    .setAuthor({ name: hedef.tag, iconURL: hedef.displayAvatarURL({ dynamic: true })})
                        .setColor("RANDOM")
                        .setDescription(`
                        **Rolü Alınan kişi** \n${hedef} - **${hedef.id}**`)
                        .addField(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} Rolü Alan Kişi`, `${yapan} - **${yapan.id}**`, false)
                        .addField(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} Alınan Rol`, `${role} - **${role.id}**`, false)
                        .setFooter({text: yapan.tag, iconURL: yapan.displayAvatarURL({ dynamic: true })})
                        .setTimestamp()
                    kanal.send({embeds: [emeed]})
                    roller.findOne({
                        user: hedef.id
                    }, async (err, res) => {
                        if (!res) {
                            let arr = []
                            arr.push({
                                rol: role.id,
                                mod: yapan.id,
                                tarih: Date.parse(new Date()),
                                state: "Kaldırma"
                            })
                            let newData = new roller({
                                user: hedef.id,
                                roller: arr
                            })
                            newData.save().catch(e => console.log(e))
                        } else {
                            res.roller.push({
                                rol: role.id,
                                mod: yapan.id,
                                tarih: Date.parse(new Date()),
                                state: "Kaldırma"
                            })
                            res.save().catch(e => console.log(e))
                        }
                    })
                }
            });
        })
    }
};
