const baseCmd = require("../../base/Command");
const moment = require("moment");
const kayıtlar = require("../../models/kayıtlar.js")
const data = require("../../models/cezalar.js")
let serverSettings = require("../../models/serverSettings");
const isimler = require("../../models/isimler.js")
const Discord = require("discord.js")
class İsim extends baseCmd {
  constructor(client) {
      super(client, {
          name: "isim",
          usage: ".isim [@user][isim][yaş]",
          category: "Register",
          description: "Belirttiğiniz kişinin ismini değiştirirsiniz.",
          aliases: ["nick"]
      });
  }
  async run(message, args, client) {

    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });

		if (!message.member.roles.cache.some(r => server.RegisterAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
    if (!server.RegisterSystem) return message.channel.send(`
🔒 Kayıtlar bir yönetici tarafından __geçici bir süreliğine kapatılmıştır.__ Lütfen bu süreçte beklemede kalın. Anlayışla karşıladığınız için teşekkürler!`)

  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!member) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel);
  const nick = args.slice(1).filter(arg => isNaN(arg)).map(arg => arg[0].toUpperCase() + arg.slice(1).toLowerCase()).join(" ");
  if (!nick) return this.client.yolla("Yeni ismi belirtin.", message.author, message.channel);
  if (nick && (await this.client.chatKoruma(nick))) return this.client.yolla('Üyenin kullanıcı ismine reklam veya küfür yazamazsınız lütfen geçerli bir isim girip yeniden deneyiniz.', message.author, message.channel)
  const age = args.slice(1).filter(arg => !isNaN(arg))[0] ?? undefined;
  if (!age || isNaN(age)) return this.client.yolla("Geçerli bir yaş belirtin.", message.author, message.channel);
 if (message.guild.members.cache.has(member.id) && message.member.roles.highest.position <= message.guild.members.cache.get(member.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
  if(nick.length > 30) return client.reply(message, "isim ya da yaş ile birlikte toplam 30 karakteri geçecek bir isim giremezsin.")
  if (age < 15) return this.client.yolla(`Kayıt ettiğin üyenin yaşı 15'(t(d)(a(e)n küçük olamaz.`, message.author, message.channel);
  if (age > 99) return this.client.yolla(`Kayıt ettiğin üyenin yaşı iki basamakdan büyük olamaz.`,message.author, message.channel);
  if (!member.manageable) return this.client.yolla(`Kullanıcı benden yüksek bir pozisyona sahip o yüzden ismini değiştiremiyorum.`, message.author, message.channel)

  await data.find({ user: member.id }).sort({ ihlal: "descending" }).exec(async (err, res) => {
    if(!res) return this.client.yolla(`${member} kullanıcısının ceza bilgisi bulunmuyor.`, message.author, message.channel)

        let filterArr = res.map(x => (x.ceza))
        let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
        let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
        let jail = filterArr.filter(x => x == "Cezalı").length || 0
        let ban = filterArr.filter(x => x == "Yasaklı").length || 0
        let warn = filterArr.filter(x => x == "Uyarı").length || 0
        let puan = await this.client.punishPoint(member.id)
        let cezasayı = await this.client.cezasayı(member.id)

        let durum;
        if(cezasayı < 5) durum = "Çok Güvenli";
        if(cezasayı >= 5 && cezasayı < 10) durum = "Güvenli";
        if(cezasayı >= 10 && cezasayı < 15) durum = "Şüpheli";
        if(cezasayı >= 15 && cezasayı < 20) durum = "Tehlikeli";
        if(cezasayı >= 20) durum = "Çok Tehlikeli";
  if (
    puan >= 50 &&
    !message.member.roles.cache.some(role => message.guild.roles.cache.get(`${server.SeniorOfficial}`).rawPosition <= role.rawPosition)
  ) {
    const embed = new Discord.MessageEmbed()
.setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
.setColor("RANDOM")
.setDescription(`
🚫 ${member.toString()} kişisinin toplam `+puan+` ceza puanı 
olduğu için kayıt işlemi iptal edildi. Sunucumuzda tüm 
işlemlerin kayıt altına alındığını unutmayın. Sorun Teşkil eden, 
sunucunun huzurunu bozan ve kurallara uymayan kullanıcılar 
sunucumuza kayıt olamazlar. 
Belirtilen üye toplamda ${ban} adet ban, ${jail} adet cezalı,
${chatMute} adet chat-mute, ${voiceMute} adet voice-mute, ${warn} adet uyarı olmak üzere toplam da ${cezasayı} ceza almış.
       
Eğer konu hakkında bir şikayetiniz var ise <@&${server.SeniorOfficial}>
rolü ve üstlerine ulaşabilirsiniz.
`)
    return message.channel.send({ embeds: [embed] })
  }


  const newnick = `${member.user.username.includes(server.Tag) ? server.Tag : (server.SecondaryTag ? server.SecondaryTag : (server.SecondaryTag || ""))} ${nick} | ${age}`;
  await member.setNickname(newnick);

let registerModel = await isimler.findOne({
  user: member.user.id,
  isimler: []
});
if (!registerModel) registerModel = await isimler.findOne({
    user: member.user.id,
    isimler: []
  });

 /* isimler.findOne({user: member.id}, async(err, res) => { 
      const memeaç = new Discord.MessageEmbed()
      .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
      .setDescription(`${!res ? `${member} üyesinin ismi başarıyla "${nick} | ${age}" ismine değiştirildi` : `
${member} üyesinin ismi başarıyla "${nick} | ${age}" ismine değiştirildi, bu üye daha önce bu isimlerle kayıt olmuş.
      
${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} Kişinin toplamda **${res.isimler.length}** isim kayıtı bulundu.
${res.isimler.map(x => `\`• ${x.isim}\` (${x.state})`).join("\n")}

Kişinin önceki isimlerine \`!isimler @üye\` komutuyla bakarak kayıt işlemini gerçekleştirmeniz önerilir.`}`)
.setFooter({ text: "Üyenin ceza puanı "+puan+" (" + durum + ")"})
.setColor("RANDOM")//  - (${x.yetkili.replace(message.author.id, `<@${x.yetkili}>`).replace(`Yok`,`Yok`)})
message.channel.send({ embeds: [memeaç] })//.then(m => {setTimeout(() => { m.delete(); }, 10000);}).then(m => message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)))
       if(message.channel.id === server.RegisterChat) {
           if(!this.client.kayıtlar.has(message.author.id)) {
               this.client.kayıtlar.set(message.author.id, member.id)
           }
       }
  
    
})  
*/
  if(server.GenderRegister) {
    isimler.findOne({user: member.id}, async(err, res) => { 
    if(!res) {
    let arr = []
    arr.push({isim: newnick, state: "İsim Değiştirme", yetkili: message.author.id})
    let newData = new isimler({ 
    user: member.id,
    isimler: arr
  })
  newData.save().catch(e => console.log(e))
} else {
  res.isimler.push({isim: newnick, state: "İsim Değiştirme", yetkili: message.author.id})
  res.save().catch(e => console.log(e))
}
      const amaç = new Discord.MessageEmbed()
        .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
        .setDescription(`${!res ? `${member} üyesinin ismi başarıyla "${nick} | ${age}" ismine değiştirildi` : `
${member} üyesinin ismi başarıyla "${nick} | ${age}" ismine değiştirildi, bu üye daha önce bu isimlerle kayıt olmuş.
        
${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} Kişinin toplamda **${res.isimler.length}** isim kayıtı bulundu.
${res.isimler.map(x => `\`• ${x.isim}\` (${x.state})`).join("\n")}
  
Kişinin önceki isimlerine \`!isimler @üye\` komutuyla bakarak kayıt işlemini gerçekleştirmeniz önerilir.`}`)
  .setFooter({ text: "Üyenin ceza puanı "+puan+" (" + durum + ")"})
  .setColor("RANDOM")//  - (${x.yetkili.replace(message.author.id, `<@${x.yetkili}>`).replace(`Yok`,`Yok`)})
        message.channel.send({ embeds: [amaç] })
  if(message.channel.id === server.RegisterChat) {
             if(!this.client.kayıtlar.has(message.author.id)) {
                 this.client.kayıtlar.set(message.author.id, member.id)
             }
            }
          })
        } 

        if(server.ButtonRegister) {

         isimler.findOne({user: member.id}, async(err, res) => { 
  const memeaç = new Discord.MessageEmbed()
  .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
  .setDescription(`${!res ? `${member} üyesinin ismi başarıyla "${nick} | ${age}" ismine değiştirildi` : `
${member} üyesinin ismi başarıyla "${nick} | ${age}" ismine değiştirildi, bu üye daha önce bu isimlerle kayıt olmuş.
  
${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} Kişinin toplamda **${res.isimler.length}** isim kayıtı bulundu.
${res.isimler.map(x => `\`• ${x.isim}\` (${x.state})`).join("\n")}

Kişinin önceki isimlerine \`!isimler @üye\` komutuyla bakarak kayıt işlemini gerçekleştirmeniz önerilir.`}`)
.setFooter({ text: "Üyenin ceza puanı "+puan+" (" + durum + ")"})
.setColor("RANDOM")//  - (${x.yetkili.replace(message.author.id, `<@${x.yetkili}>`).replace(`Yok`,`Yok`)})
  
if(message.channel.id === server.RegisterChat) {
       if(!this.client.kayıtlar.has(message.author.id)) {
           this.client.kayıtlar.set(message.author.id, member.id)
       }
   }

const row = new Discord.MessageActionRow()
  .addComponents(
    new Discord.MessageButton()
      .setCustomId('Erkek')
      .setLabel("Erkek")
      .setStyle('PRIMARY'),
    new Discord.MessageButton()
      .setCustomId('Kadın')
      .setLabel("Kadın")
      .setStyle('PRIMARY'),
    new Discord.MessageButton()
      .setCustomId('CANCEL')
      .setLabel("İptal")
      .setStyle('DANGER'),
  );
let msg = await message.channel.send({ components: [row], embeds: [memeaç] })

var filter = (button) => button.user.id === message.author.id;
const collector = msg.createMessageComponentCollector({ filter, time: 30000 })

collector.on('end', async (button, reason) => {
row.components[0].setDisabled(true) 
row.components[1].setDisabled(true) 
row.components[2].setDisabled(true) 
msg.edit({ components: [row] }); 

  isimler.findOne({user: member.id}, async(err,res) => {
    if(!res) {
    let arr = []
    arr.push({isim: newnick, state: "İsim Değiştirme", yetkili: message.author.id})
    let newData = new isimler({ 
    user: member.id,
    isimler: arr
  })
  newData.save().catch(e => console.log(e))
} else {
  res.isimler.push({isim: newnick, state: "İsim Değiştirme", yetkili: message.author.id})
  res.save().catch(e => console.log(e))
}
})


});
collector.on('collect', async (button, user) => {

  if (button.customId === "Erkek") {
    row.components[0].setDisabled(true) 
    row.components[1].setDisabled(true) 
    row.components[2].setDisabled(true) 
    msg.edit({ components: [row] });

    if (server && server.TaggedMode === true) {
        if(!member.user.username.includes(server.Tag) && !member.premiumSince && !member.roles.cache.has(server.VipRole)) return this.client.yolla("Şuanlık bu sunucuda sunucuda taglı alım mevcuttur ( "+server.Tag+" ) tagını alarak kayıt olabilirsin, bir süre sonra tagsız alıma geçildiğinde gelmeyi de tercih edebilirsin.", message.author, message.channel)
      }
      await kayıtlar.findOne({ user: message.author.id }, async (err, res) => {
        if (res) {
          if (res.kayıtlar.includes(member.id)) {
            res.erkek = res.erkek
            res.save().catch(e => console.log(e))
          } else {
            res.kayıtlar.push(member.id)
            res.erkek = res.erkek + 1
            res.toplam = res.toplam + 1
            res.save().catch(e => console.log(e))
          }
        } else if (!res) {
          let arr = []
          arr.push(member.id)
          const data = new kayıtlar({
            user: message.author.id,
            erkek: 1,
            kadın: 0,
            toplam: 1,
            kayıtlar: arr
          })
          data.save().catch(e => console.log(e))
        }
      })
      
      if(member.roles.cache.has(server.ManRole[0]) || member.roles.cache.has(server.WomanRole[0])) {
        if(this.client.kayıtlar.has(message.author.id)) {
            this.client.kayıtlar.delete(message.author.id)
        }
        return button.reply("<@"+member+"> kullanıcısı zaten sunucumuza kayıtlı olduğundan dolayı kayıt işlemi iptal edildi!")
    }
  
  
   
      if(!member.roles.cache.has(server.ManRole[0])) {
        setTimeout(() => {
          member.roles.add(server.ManRole)
        }, 2000)
        member.roles.remove(server.UnregisteredRole)
       const embed = new Discord.MessageEmbed()
       .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
       .setColor("RANDOM")
       .setDescription(`${member.toString()} üyesine ${server.ManRole.map(x => `<@&${x}>`)} rolleri verildi.`)
       .setFooter({ text: "Üyenin ceza puanı "+puan+" (" + durum + ")"});
  
       button.reply({ embeds: [embed] })

       message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name))
        this.client.channels.cache.get(server.GeneralChat).send("<@"+member+"> adlı üye aramıza yeni katıldı bir hoş geldin diyelim ve senle birlikte topluluğumuz **"+message.guild.memberCount+"** kişi oldu!").then(msg => { setTimeout(() => { msg.delete(); }, 10000); })
    
      isimler.findOne({user: member.id}, async(err,res) => {
        if(!res) {
        let arr = []
        arr.push({isim: member.displayName, state: ""+server.ManRole.map(x => `<@&${x}>`)+"", yetkili: message.author.id})
        let newData = new isimler({ 
          user: member.id,
          isimler: arr
        })
        newData.save().catch(e => console.log(e))
      } else {
        res.isimler.push({isim: member.displayName, state: ""+server.ManRole.map(x => `<@&${x}>`)+"", yetkili: message.author.id})
        res.save().catch(e => console.log(e))
      }
    })
  }

} else if (button.customId === "CANCEL") {

    row.components[0].setDisabled(true) 
    row.components[1].setDisabled(true) 
    row.components[2].setDisabled(true) 
    msg.edit({ components: [row] });

    const embed = new Discord.MessageEmbed()
    .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
    .setColor("RANDOM")
    .setDescription(`${member.toString()} adlı kullanıcının kayıt işlemi iptal edildi.`);
    button.reply({ embeds: [embed] })

  isimler.findOne({user: member.id}, async(err,res) => {
    if(!res) {
    let arr = []
    arr.push({isim: newnick, state: "İsim Değiştirme", yetkili: message.author.id})
    let newData = new isimler({ 
    user: member.id,
    isimler: arr
  })
  newData.save().catch(e => console.log(e))
} else {
  res.isimler.push({isim: newnick, state: "İsim Değiştirme", yetkili: message.author.id})
  res.save().catch(e => console.log(e))
}
})


  } else if (button.customId === "Kadın") {
    row.components[0].setDisabled(true) 
    row.components[1].setDisabled(true) 
    row.components[2].setDisabled(true) 
    msg.edit({ components: [row] });

    if (server && server.TaggedMode === true) {
        if(!member.user.username.includes(server.Tag) && !member.premiumSince && !member.roles.cache.has(server.VipRole)) return this.client.yolla("Şuanlık bu sunucuda sunucuda taglı alım mevcuttur ( "+server.Tag+" ) tagını alarak kayıt olabilirsin, bir süre sonra tagsız alıma geçildiğinde gelmeyi de tercih edebilirsin.", message.author, message.channel)
      }
      await kayıtlar.findOne({ user: message.author.id }, async (err, res) => {
        if (res) {
          if (res.kayıtlar.includes(member.id)) {
            res.kadın = res.kadın
            res.save().catch(e => console.log(e))
          } else {
            res.kayıtlar.push(member.id)
            res.kadın = res.kadın + 1
            res.toplam = res.toplam + 1
            res.save().catch(e => console.log(e))
          }
        } else if (!res) {
          let arr = []
          arr.push(member.id)
          const data = new kayıtlar({
            user: message.author.id,
            erkek: 0,
            kadın: 1,
            toplam: 1,
            kayıtlar: arr
          })
          data.save().catch(e => console.log(e))
        }
      })
      if(member.roles.cache.has(server.ManRole[0]) || member.roles.cache.has(server.WomanRole[0])) {
        if(this.client.kayıtlar.has(message.author.id)) {
            this.client.kayıtlar.delete(message.author.id)
        }
        return button.reply("<@"+member+"> kullanıcısı zaten sunucumuza kayıtlı olduğundan dolayı kayıt işlemi iptal edildi!")
    }
  
      if(!member.roles.cache.has(server.WomanRole[0])) {
        setTimeout(() => {
          member.roles.add(server.WomanRole)
        }, 2000)
        member.roles.remove(server.WomanRole)
       const embed = new Discord.MessageEmbed()
       .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
       .setColor("RANDOM")
       .setDescription(`${member.toString()} üyesine ${server.WomanRole.map(x => `<@&${x}>`)} rolleri verildi.`)
       .setFooter({ text: "Üyenin ceza puanı "+puan+" ("+ durum + ")"});
       button.reply({ embeds: [embed] })
       message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name))
        this.client.channels.cache.get(server.GeneralChat).send("<@"+member+"> adlı üye aramıza yeni katıldı bir hoş geldin diyelim ve senle birlikte topluluğumuz **"+message.guild.memberCount+"** kişi oldu!").then(msg => { setTimeout(() => { msg.delete(); }, 10000); })
    
  
      isimler.findOne({user: member.id}, async(err,res) => {
        if(!res) {
        let arr = []
        arr.push({isim: member.displayName, state: "<"+server.WomanRole.map(x => `<@&${x}>`) +"", yetkili: message.author.id})
        let newData = new isimler({
          user: member.id,
          isimler: arr
        })
        newData.save().catch(e => console.log(e))
      } else {
        res.isimler.push({isim: member.displayName, state: ""+server.WomanRole.map(x => `<@&${x}>`) +"", yetkili: message.author.id})
        res.save().catch(e => console.log(e))
      }
      })
    }
}
});
         })
}

if (server.ZadeRegisterSystem) {


  isimler.findOne({user: member.id}, async(err, res) => { 
    const memeaç = new Discord.MessageEmbed()
    .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
    .setDescription(`${!res ? `${member} üyesinin ismi başarıyla "${nick} | ${age}" ismine değiştirildi` : `
${member} üyesinin ismi başarıyla "${nick} | ${age}" ismine değiştirildi, bu üye daha önce bu isimlerle kayıt olmuş.
    
${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} Kişinin toplamda **${res.isimler.length}** isim kayıtı bulundu.
${res.isimler.map(x => `\`• ${x.isim}\` (${x.state})`).join("\n")}

Kişinin önceki isimlerine \`!isimler @üye\` komutuyla bakarak kayıt işlemini gerçekleştirmeniz önerilir.`}`)
.setFooter({ text: "Üyenin ceza puanı "+puan+" (" + durum + ")"})
.setColor("RANDOM")//  - (${x.yetkili.replace(message.author.id, `<@${x.yetkili}>`).replace(`Yok`,`Yok`)})
message.channel.send({ embeds: [memeaç] })//.then(m => {setTimeout(() => { m.delete(); }, 10000);}).then(m => message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)))
     if(message.channel.id === server.RegisterChat) {
         if(!this.client.kayıtlar.has(message.author.id)) {
             this.client.kayıtlar.set(message.author.id, member.id)
         }
     }

  
})  


const filter = e => e.author.id === message.author.id && ["erkek", "kadın", "iptal", "e" , "k"].some(cevap => e.content.toLowerCase().includes(cevap));
const onay = await message.channel.awaitMessages({ filter, max: 1, time: 1000 * 30 });
  if (onay.size < 1) {
    isimler.findOne({user: member.id}, async(err,res) => {
      if(!res) {
      let arr = []
      arr.push({isim: newnick, state: "İsim Değiştirme", yetkili: message.author.id})
      let newData = new isimler({ 
      user: member.id,
      isimler: arr
    })
    newData.save().catch(e => console.log(e))
  } else {
    res.isimler.push({isim: newnick, state: "İsim Değiştirme", yetkili: message.author.id})
    res.save().catch(e => console.log(e))
  }
})

    return  

  }

  const onayContent = onay.first().content.toLowerCase();
  if (onayContent.includes(`.e`) || onayContent.includes(`!e`) || onayContent.includes(`!erkek`) || onayContent.includes(`.erkek`)) {
    if (server && server.TaggedMode === true) {
      if(!member.user.username.includes(server.Tag) && !member.premiumSince && !member.roles.cache.has(server.VipRole)) return this.client.yolla("Şuanlık bu sunucuda sunucuda taglı alım mevcuttur ( "+server.Tag+" ) tagını alarak kayıt olabilirsin, bir süre sonra tagsız alıma geçildiğinde gelmeyi de tercih edebilirsin.", message.author, message.channel)
    }
    await kayıtlar.findOne({ user: message.author.id }, async (err, res) => {
      if (res) {
        if (res.kayıtlar.includes(member.id)) {
          res.erkek = res.erkek
          res.save().catch(e => console.log(e))
        } else {
          res.kayıtlar.push(member.id)
          res.erkek = res.erkek + 1
          res.toplam = res.toplam + 1
          res.save().catch(e => console.log(e))
        }
      } else if (!res) {
        let arr = []
        arr.push(member.id)
        const data = new kayıtlar({
          user: message.author.id,
          erkek: 1,
          kadın: 0,
          toplam: 1,
          kayıtlar: arr
        })
        data.save().catch(e => console.log(e))
      }
    })
    
    if(member.roles.cache.has(server.ManRole[0]) || member.roles.cache.has(server.WomanRole[0])) {
      if(this.client.kayıtlar.has(message.author.id)) {
          this.client.kayıtlar.delete(message.author.id)
      }
      return this.client.yolla("<@"+member+"> kullanıcısı zaten sunucumuza kayıtlı olduğundan dolayı kayıt işlemi iptal edildi!", message.author, message.channel)
  }


 
    if(!member.roles.cache.has(server.ManRole[0])) {
      setTimeout(() => {
        member.roles.add(server.ManRole)
      }, 2000)
      member.roles.remove(server.UnregisteredRole)
     const embed = new Discord.MessageEmbed()
     .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
     .setColor("RANDOM")
     .setDescription(`${member.toString()} üyesine ${server.ManRole.map(x => `<@&${x}>`)} rolleri verildi.`)
     .setFooter({ text: "Üyenin ceza puanı "+puan+" (" + durum + ")"});
   message.channel.send({ embeds: [embed] })//.then(x => {setTimeout(() => { x.delete(); }, 5000);})

     message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name))
      this.client.channels.cache.get(server.GeneralChat).send("<@"+member+"> adlı üye aramıza yeni katıldı bir hoş geldin diyelim ve senle birlikte topluluğumuz **"+message.guild.memberCount+"** kişi oldu!").then(msg => { setTimeout(() => { msg.delete(); }, 10000); })
  
    isimler.findOne({user: member.id}, async(err,res) => {
      if(!res) {
      let arr = []
      arr.push({isim: member.displayName, state: ""+server.ManRole.map(x => `<@&${x}>`)+"", yetkili: message.author.id})
      let newData = new isimler({ 
        user: member.id,
        isimler: arr
      })
      newData.save().catch(e => console.log(e))
    } else {
      res.isimler.push({isim: member.displayName, state: ""+server.ManRole.map(x => `<@&${x}>`)+"", yetkili: message.author.id})
      res.save().catch(e => console.log(e))
    }
  })
}
  
  }

  if (onayContent.includes(`.k`) || onayContent.includes(`!k`) || onayContent.includes(`!kadın`) || onayContent.includes(`.kadın`)) {
    if (server && server.TaggedMode === true) {
      if(!member.user.username.includes(server.Tag) && !member.premiumSince && !member.roles.cache.has(server.VipRole)) return this.client.yolla("Şuanlık bu sunucuda sunucuda taglı alım mevcuttur ( "+server.Tag+" ) tagını alarak kayıt olabilirsin, bir süre sonra tagsız alıma geçildiğinde gelmeyi de tercih edebilirsin.", message.author, message.channel)
    }
    await kayıtlar.findOne({ user: message.author.id }, async (err, res) => {
      if (res) {
        if (res.kayıtlar.includes(member.id)) {
          res.kadın = res.kadın
          res.save().catch(e => console.log(e))
        } else {
          res.kayıtlar.push(member.id)
          res.kadın = res.kadın + 1
          res.toplam = res.toplam + 1
          res.save().catch(e => console.log(e))
        }
      } else if (!res) {
        let arr = []
        arr.push(member.id)
        const data = new kayıtlar({
          user: message.author.id,
          erkek: 0,
          kadın: 1,
          toplam: 1,
          kayıtlar: arr
        })
        data.save().catch(e => console.log(e))
      }
    })
    if(member.roles.cache.has(server.ManRole[0]) || member.roles.cache.has(server.WomanRole[0])) {
      if(this.client.kayıtlar.has(message.author.id)) {
          this.client.kayıtlar.delete(message.author.id)
      }
      return this.client.yolla("<@"+member+"> kullanıcısı zaten sunucumuza kayıtlı olduğundan dolayı kayıt işlemi iptal edildi!", message.author, message.channel)
  }


  
    if(!member.roles.cache.has(server.WomanRole[0])) {
      setTimeout(() => {
        member.roles.add(server.WomanRole)
      }, 2000)
      member.roles.remove(server.UnregisteredRole)
     const embed = new Discord.MessageEmbed()
     .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
     .setColor("RANDOM")
     .setDescription(`${member.toString()} üyesine ${server.WomanRole.map(x => `<@&${x}>`)} rolleri verildi.`)
     .setFooter({ text: "Üyenin ceza puanı "+puan+" ("+ durum + ")"});
   message.channel.send({ embeds: [embed] })//.then(x => {setTimeout(() => { x.delete(); }, 5000);}) 
     message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name))
      this.client.channels.cache.get(server.GeneralChat).send("<@"+member+"> adlı üye aramıza yeni katıldı bir hoş geldin diyelim ve senle birlikte topluluğumuz **"+message.guild.memberCount+"** kişi oldu!").then(msg => { setTimeout(() => { msg.delete(); }, 10000); })
  

    isimler.findOne({user: member.id}, async(err,res) => {
      if(!res) {
      let arr = []
      arr.push({isim: member.displayName, state: "<"+server.WomanRole.map(x => `<@&${x}>`) +"", yetkili: message.author.id})
      let newData = new isimler({
        user: member.id,
        isimler: arr
      })
      newData.save().catch(e => console.log(e))
    } else {
      res.isimler.push({isim: member.displayName, state: ""+server.WomanRole.map(x => `<@&${x}>`) +"", yetkili: message.author.id})
      res.save().catch(e => console.log(e))
    }
    })
  }

  }

  if (onayContent.includes(`.iptal`) || onayContent.includes(`!iptal`)) {
    const embed = new Discord.MessageEmbed()
      .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
      .setColor("RANDOM")
      .setDescription(`${member.toString()} adlı kullanıcının kayıt işlemi iptal edildi.`);
      message.channel.send({ embeds: [embed] });
 
    isimler.findOne({user: member.id}, async(err,res) => {
      if(!res) {
      let arr = []
      arr.push({isim: newnick, state: "İsim Değiştirme", yetkili: message.author.id})
      let newData = new isimler({ 
      user: member.id,
      isimler: arr
    })
    newData.save().catch(e => console.log(e))
  } else {
    res.isimler.push({isim: newnick, state: "İsim Değiştirme", yetkili: message.author.id})
    res.save().catch(e => console.log(e))
  }
})
  }
  }
})


}
}


module.exports = İsim;