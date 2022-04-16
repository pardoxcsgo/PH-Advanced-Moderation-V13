const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const serverData = require('../../models/serverSettings')
const { max } = require("moment");
class Setup2 extends Command {
    constructor(client) {
        super(client, {
            name: "setup2",
            aliases: ["kur2"]
        });
    }
    async run(message, args, data) {

        if(!this.client.config.botOwners.includes(message.author.id)) return
        let choose = args[0]

        if(choose === "yardım") {
            let komutlarEmbed = new Discord.MessageEmbed()
  .addField(`
\`\`\`INVITE-BOT SETTINGS\`\`\``,`
!kur botowner <@BotOwner>
!kur tag <Tag>
!Kur secondaryyag <İkinciTag>
!kur link <SunucuLinki>
!kur guildowners <@SunucuKurucuları>
`)//5
.addField(`
\`\`\`CHANNEL SETTINGS\`\`\``, `
!kur generalchat <#ChatKanalı>
!kur registerchat <#RegisterKanalı>
!kur registerlog <#RegisterLogKanalı>
!kur rolyönetlog <#RolYönetLog>
!kur komutblocklog <#KomutBlokLog>
!kur joinfamilylog <#JoinFamilyLog>
!kur leavefamilylog <#LeaveFamilyLog>
!kur authleavelog <#YetkiliLeaveLog>
!kur voicemutelog <#VoiceMuteLog>
!kur removepunishment <#SağTıkCezaKaldırmaLog>
!kur bannedtaglog <#YasaklıTagLog>
!kur registerparent <#RegisterParent>
!kur publicparent <#PublicParent>
!kur banlog <#BanLog>
!kur jailLog <#JailLog>
!kur cezapuan <#CezaPuan>
!kur chatmutelog <#ChatMuteLog>
!kur unbanlog <#UnbanLog>
!kur sağtıkrollog <#SağTıkRolYönetLog>
!kur streampunitivelog <#StreamCezalıLog>
!kur streamchannels <#StreamKanalları>
`)//21
.addField(`
\`\`\`ROLE SETTINGS\`\`\``,`
!kur kayıtsızrolü <@KayıtsızRolü>
!kur kadınrolü <@KadınRolü>
!kur erkekrolü <@ErkekRolü>
!kur viprolü <@VipRolü>
!kur boosterrolü <@BoosterRolü>
!kur yasaklıtagrolü <@YasaklıTagRolü>
!kur şüphelirolü <@ŞüpheliHesapRolü>
!kur familyrole <@TaglıRolü>
!kur chatmutedrole <@ChatMuteRolü>
!kur karantinarole <@CezalıRolü>
!kur adsrole <@ReklamcıRolü>
!kur warnroleone <@1.UyarıRolü>
!kur warnroletwo <@2.UyarıRolü>
!kur joinmeetrole <@KatıldıRolü>
!kur warnrolethree <@3.UyarıRolü>
!kur streampunitiverole <@StreamCezalıRolü>
`)//15
.addField(`
\`\`\`PERM SETTINGS\`\`\``, `
!kur registerauth <@RegisterSorumlusu>
!kur ustyetkili <@EnÜstYetkili>
!kur botcommandrole <@BotKomutRolü>
!kur moveauth <@TransportRolü>
!kur jailauth <@JailAuth>
!kur banauth <@BanAuth>
!kur chatmuteauth <@ChatMuteAuth>
!kur rolemanageauth <@RolManageAuth>
!kur voicemuteauth <@VoiceMuteAuth>
`)//9
            .setColor('00b5ff')
            message.channel.send({ embeds: [komutlarEmbed] })
                }

        if(choose === "data-aç") {
            new serverData({ guildID: message.guild.id }).save()
            message.channel.send(`Data kuruldu`)
        }

        if(!choose) {
            let ayar = await serverData.findOne({guildID: message.guild.id})
            let embed = new Discord.MessageEmbed()
            .setTitle(`Ayarlar`, message.author.avatarURL({dynamic: true}))
           .addField(`
\`\`\`INVITE-BOT SETTINGS\`\`\``, `
**Bot-Owner:** (${ayar.BotOwner.length > 0 ? `${ayar.BotOwner.map(x => `<@${x}>`).join(",")}` : "\`YOK\`"})
**Tag:** (${ayar.Tag ? ayar.Tag : "\`YOK\`"}) / (${ayar.SecondaryTag ? ayar.SecondaryTag : "\`YOK\`"})
**Welcome-Channel:** (${ayar.RegisterChat.length ? `<#${ayar.RegisterChat}>` : "\`YOK\`"})
**Kurallar-Kanal:** (${ayar.RulesChannel.length ? `<#${ayar.RulesChannel}>` : "\`YOK\`"})
**Bot-Voice-Channel:** (${ayar.BotVoiceChannel.length ? `<#${ayar.BotVoiceChannel}>` : "\`YOK\`"})
**Invite-Log:** (${ayar.InviteLog.length ? `<#${ayar.InviteLog}>` : "\`YOK\`"})
`)
            .setColor('RANDOM')
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            message.channel.send({ embeds: [embed] })
        }

        
        let canzade = await serverData.findOne({guildID: message.guild.id})

        if(["ruleskanal", "rules","ruleschat","ruleschannel"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu rules kanalını belirtmelisin`, message.author, message.channel)
            canzade.RulesChannel = log.id, await canzade.save(),
            this.client.yolla(`Sunucu rules kanalı başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        
        if(["invite", "invitelog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu invite log belirtmelisin`, message.author, message.channel)
            canzade.InviteLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu invite log başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };
    }
}

    module.exports = Setup2;
