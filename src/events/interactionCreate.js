const Discord = require("discord.js")
const { table } = require('table');
const cezalar = require("../models/cezalar.js")
const mutes = require("../models/chatmute.js")
const notlar = require("../models/notlar.js")
const vmutes = require("../models/voicemute.js")
const db = require("../models/vrcRoleCommands")
const cezalar2 = require("../models/cezalı.js")
const isimler = require("../models/isimler.js")
const moment = require("moment")

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run (interaction) {
    
    if(interaction.customId === "memberJoinedServer") {
      interaction.reply({ content: `${moment(interaction.member.joinedAt).format("LLL")}`, ephemeral: true })
  
    } else if(interaction.customId === "historyName") {
    
      isimler.findOne({user: interaction.user.id}, async(err, res) => {
        if(!res) return interaction.reply({ content: "Geçmiş isimleriniz bulunamadı.", ephemeral: true })
        const zaa = new Discord.MessageEmbed()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setDescription(`
  Toplam da ${res.isimler.length} isim kayıtınız bulundu:
        
  ${res.isimler.map(x => `\`• ${x.isim}\` (${x.state})`).join("\n")}`)
        .setColor("RANDOM")
        interaction.reply({ embeds: [zaa], ephemeral: true })
    }) 
    } else if(interaction.customId === "activePenalties") {
  
      let mute = ""
      let vmute = ""
      let cezalı = ""
      await cezalar2.findOne({ user: interaction.user.id }, async (err, doc) => {
          if (!doc) {
              cezalı = "```"+"Veritabanında aktif cezalı bilgisi bulunmamakta."+"```"
          } else {
              if (doc.ceza == false) {
                  cezalı = "```"+"Veritabanında aktif chat mute bilgisi bulunmamakta."+"```"
              } else if (doc.ceza == true) {
                  cezalı = "```"+"Cezalı Atan Yetkili: "+ this.client.users.cache.get(doc.yetkili).tag +"\nCeza Sebebi: " + doc.sebep + "\nCeza Tarihi: " + doc.tarih + "\nCeza Bitiş: Bilinmiyor."+"```"
              }
          }
      })
      await mutes.findOne({ user: interaction.user.id }, async (err, doc) => {
          if (!doc) {
              mute = "```"+"Veritabanında aktif chat mute bilgisi bulunmamakta."+"```"
          } else {
              if (doc.muted == false) {
                  mute = "```"+"Veritabanında aktif chat mute bilgisi bulunmamakta."+"```"
              } else if (doc.muted == true) {
                  mute = "```"+"Mute Atan Yetkili: "+ this.client.users.cache.get(doc.yetkili).tag +"\nMute Sebebi: " + doc.sebep + "\nMute Başlangıç: " + moment(doc.start).format("LLL") + "\nMute Bitiş: " + moment(doc.endDate).format("LLL") +"```"
              }
          }
      })
      await vmutes.findOne({ user: interaction.user.id }, async (err, doc) => {
          if (!doc) {
              vmute = "```"+"Veritabanında aktif ses mute bilgisi bulunmamakta."+"```"
          } else {
              if (doc.muted == false) {
                  vmute = "```"+"Veritabanında aktif voice mute bilgisi bulunmamakta."+"```"
              } else if (doc.muted == true) {
                  vmute = "```"+"Mute Atan Yetkili: "+ this.client.users.cache.get(doc.yetkili).tag +" \nMute Sebebi: " + doc.sebep + "\nMute Başlangıç: " + moment(doc.start).format("LLL") + "\nMute Bitiş: " + moment(doc.endDate).format("LLL") +"```"
              }
          }
      })
      let uu = this.client.users.cache.get(interaction.user.id)
      const embed = new Discord.MessageEmbed()
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          .setColor("RANDOM")
          .setDescription("<@" + interaction.user.id + "> ceza bilgileriniz aşağıda belirtilmiştir.")
          .setThumbnail(uu.displayAvatarURL({ dynamic: true }))
          .addFields(
              { name: '❯ Cezalı Bilgisi', value: cezalı || "```"+"Veritabanında aktif cezalı bilgisi bulunmamakta."+"```"},
              { name: '❯ Chat Mute Bilgisi:', value: mute || "```"+"Veritabanında aktif chat mute bilgisi bulunmamakta."+"```" },
              { name: '❯ Ses Mute Bilgisi:', value: vmute || "```"+"Veritabanında aktif voice mute bilgisi bulunmamakta."+"```" },
          ).setFooter({ text: "Üyenin devam etmekde olan aktif bir cezası yok ise önceden almış olduğu tüm cezalara bakmak için !ceza @Zade/Can komutunuz kullanın"})
              await interaction.reply({ embeds: [embed], ephemeral: true })
  
    } else if(interaction.customId === "penaltyPoints") {
  
      let puan = await this.client.punishPoint(interaction.user.id)
          interaction.reply({ content: `${interaction.user}: `+puan+` ceza puanı`, ephemeral: true }) 
    
     } else if(interaction.customId === "historyPenalties") {
  
      await cezalar.find({ user: interaction.user.id }).sort({ ihlal: "descending" }).exec(async (err, res) => {
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
        if(cezaSayi == 0) return interaction.reply({ content: `${interaction.user} ceza bilginiz bulunmuyor.`, ephemeral: true })
  
        res.map(x => {
            dataxe.push([x.ihlal, x.ceza, x.tarih, x.bitiş, this.client.users.cache.get(x.yetkili).tag, x.sebep])
        })
  
        let outi = table(datax.slice(0, 15), config)
        interaction.reply({content: "<@" + interaction.user.id + "> toplam " + cezaSayi + " cezanız bulunmakta son 15 ceza aşağıda belirtilmiştir. ```fix\n" + outi + "\n``` ", ephemeral: true })
  
      })
  
     } else if(interaction.customId === "notes") {
  
      await notlar.findOne({user: interaction.user.id}, async(err, res) => {
        if(!res) return interaction.reply({ content: "Veritabanında ceza notunuz bulunmamaktadır.", ephemeral: true })
        const notes = new Discord.MessageEmbed()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`🚫 <@${interaction.user.id}> ceza notlarınız aşağıda belirtilmiştir.\n\n${res.notlar.map(x => `- Not Bırakan <@${x.yetkili}> | (\`${x.yetkili}\`)\n- Not: \`${x.not}\``).join("\n\n")}`, { split: true})
        .setColor("RANDOM")
        let notlarıms = res.notlar.map(x => `• Not Bırakan Yetkili: <@${x.yetkili}> | (\`${x.yetkili}\`)\n• Not: \`${x.not}\``)
        const MAX_CHARS = 3 + 2 + notlar.length + 3;
        if (MAX_CHARS < 2000) {
            const cann = new Discord.MessageEmbed()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`🚫 <@${interaction.user.id}> ceza notlarınız çok fazla olduğundan dolayı son 10 not aşağıda belirtilmiştir.\n\n${notlarıms.reverse().join("\n\n")}`)
            .setColor("RANDOM")
            interaction.reply({ embeds: [cann], ephemeral: true })
        } else {
          interaction.reply({ embeds: [notes], ephemeral: true })    
        } 
      })
  
     } else if(interaction.customId === "penaltiesNumber") {
  
      await cezalar.find({user: interaction.user.id}).sort({ ihlal: "descending" }).exec(async (err, res) => {
        let filterArr = []
        res.map(x => filterArr.push(x.ceza))
        let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
        let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
        let jail = filterArr.filter(x => x == "Cezalı").length || 0
        let puan = await this.client.punishPoint(interaction.user.id)
        let cezasayı = await this.client.cezasayı(interaction.user.id)
        let warn = filterArr.filter(x => x == "Uyarı").length || 0
  
  
  let durum;
  if(cezasayı < 5) durum = "Çok Güvenli";
  if(cezasayı >= 5 && cezasayı < 10) durum = "Güvenli";
  if(cezasayı >= 10 && cezasayı < 15) durum = "Şüpheli";
  if(cezasayı >= 15 && cezasayı < 20) durum = "Tehlikeli";
  if(cezasayı >= 20) durum = "Çok Tehlikeli";
  
  const embed = new Discord.MessageEmbed()
  .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
  .setDescription("🚫 <@"+interaction.user.id+"> sahip olduğunuz ceza sayıları aşağıda belirtilmiştir.\n\n**"+chatMute+"** Chat Mute, **"+voiceMute+"** Voice Mute, **"+jail+"** Cezalı ve **"+warn+"** Uyarı bulundu.")
  .setFooter({ text: "Toplam Ceza Puanı: " + puan + " (" + durum +")"})
  .setColor("RANDOM")
  interaction.reply({ embeds: [embed], ephemeral: true })
  
  })
  
     } else if(interaction.customId === "memberRoles") {
      const roles = interaction.member.roles.cache.filter(role => role.id !== interaction.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
      const rolleri = []
      if (roles.length > 50) {
          const lent = roles.length - 50
          let itemler = roles.slice(0, 50)
          itemler.map(x => rolleri.push(x))
          rolleri.push(`${lent} daha...`)
      } else {
          roles.map(x => rolleri.push(x))
      }
  
    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription("Üzerinizdeki roller aşağıda belirtilmiştir. (" + roles.length + " tane): "+"\n " + rolleri.join(", ") + " ")
  await interaction.reply({ embeds: [embed], ephemeral: true})
  
     } else if(interaction.customId === "createdAt") {
      await interaction.reply({ content: "Hesap oluşturulma tarihiniz: " + moment(interaction.user.createdTimestamp).format("LLL") + "", ephemeral: true })
  
     }
     if(interaction.customId === "commandshelp") {
 
        if(interaction.values[0] === "üye") {
          interaction.reply({ content: 
      `\`\`\`Tüm üye komutlarının listesi;\n${this.client.commands.filter(x => x.help.category !== "-" && x.help.category == "Global").map(x => [this.client.prefix] + x.help.usage).join('\n')}\`\`\``, ephemeral: true })
      } else if(interaction.values[0] === "teyit") {
          interaction.reply({ content: 
      `\`\`\`Tüm teyit komutlarının listesi;\n${this.client.commands.filter(x => x.help.category !== "-" && x.help.category == "Register").map(x => [this.client.prefix] + x.help.usage).join('\n')}\`\`\``, ephemeral: true })
      } else if(interaction.values[0] === "yetkili") {
          interaction.reply({ content: 
      `\`\`\`Tüm yetkili komutlarının listesi;\n${this.client.commands.filter(x => x.help.category !== "-" && x.help.category == "Authorized").map(x => [this.client.prefix] + x.help.usage).join('\n')}\`\`\``, ephemeral: true })
      } else if(interaction.values[0] === "yönetim") {
          interaction.reply({ content: 
      `\`\`\`Tüm yönetim komutlarının listesi;\n${this.client.commands.filter(x => x.help.category !== "-" && x.help.category == "Management").map(x => [this.client.prefix] + x.help.usage).join('\n')}\`\`\``, ephemeral: true })
      } else if(interaction.values[0] === "kurucu") {
          interaction.reply({ content: 
      `\`\`\`Tüm kurucu komutlarının listesi;\n${this.client.commands.filter(x => x.help.category !== "-" && x.help.category == "Owner").map(x => [this.client.prefix] + x.help.usage).join('\n')}\`\`\``, ephemeral: true })
      } else if(interaction.values[0] === "yetenek") {
          let res = await db.find({})
          let komutlar = res.map(x => `- ${x.cmdName}`).join("\n")
          interaction.reply({ content: 
      `\`\`\`Tüm yetenek komutlarının listesi;\n${komutlar.length ? komutlar : "Özel komut eklenmemiş."}\`\`\``, ephemeral: true })
      } 
        }
  
    }
}