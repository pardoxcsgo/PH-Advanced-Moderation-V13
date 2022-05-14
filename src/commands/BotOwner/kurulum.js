const Command = require("../../base/Command.js");
const Discord = require("discord.js")
let serverSettings = require("../../models/serverSettings");

class BotKurulum extends Command {
  constructor (client) {
    super(client, {
      name: "botkurulum",
      usage: ".botkurulum",
      category: "BotOwner",
      description: "Bot için gerekli emoji ve log kanallarının kurulumunu sağlar.",
      aliases: ["botkurulum","logkur","log-kur", "logkurulum","emojikur","emojikurulum", "emoji-kur","kurulum"]
    });
  }

  async run (message, args, perm) { 
    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });
    if(!server.BotOwner.includes(message.author.id)) return
    
    const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
        .setCustomId('EmojiKur')
        .setLabel("Emoji Kurulum")
        .setStyle('PRIMARY'),
      new Discord.MessageButton()
        .setCustomId('LogKur')
        .setLabel("Log Kurulum")
        .setStyle('PRIMARY'),
      new Discord.MessageButton()
        .setCustomId('CANCEL')
        .setLabel("İptal")
        .setStyle('DANGER'),
    );
    
    let msg = await message.channel.send({ components: [row], content: "Emoji ve log kurulumlarını tamamlamak için aşağıda bulunan buttonlara tıklayınız!" })

    var filter = (button) => button.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 30000 })

    collector.on('collect', async (button) => {
      if (button.customId === "EmojiKur") {
        row.components[0].setDisabled(true) 
        msg.edit({ components: [row] }); 

        let zade_vunmute = "https://cdn.discordapp.com/emojis/933325556722847786.webp?size=96&quality=lossless";
        let zade_slotgif = "https://cdn.discordapp.com/emojis/926963384556093520.gif?size=96&quality=lossless";
        let zade_patlican = "https://cdn.discordapp.com/emojis/926963384623181874.webp?size=96&quality=lossless";
        let canzade_unmute = "https://cdn.discordapp.com/emojis/933325273632489512.webp?size=96&quality=lossless";
        let coin = "https://cdn.discordapp.com/emojis/926963384623173633.webp?size=96&quality=lossless";
        let coinflip = "https://cdn.discordapp.com/emojis/926963384786763796.gif?size=96&quality=lossless";
        let no_zade = "https://cdn.discordapp.com/emojis/929716459461042248.webp?size=96&quality=lossless";
        let yes_zade = "https://cdn.discordapp.com/emojis/929716459809177651.webp?size=96&quality=lossless";
        let zade_kalp = "https://cdn.discordapp.com/emojis/926963384774197298.webp?size=96&quality=lossless";
        let zade_kiraz = "https://cdn.discordapp.com/emojis/926963384350539797.webp?size=96&quality=lossless";
        let zade_mute = "https://cdn.discordapp.com/emojis/929716460010500106.webp?size=96&quality=lossless";
        let zade_para = "https://cdn.discordapp.com/emojis/926963384937762916.gif?size=96&quality=lossless";
    
        button.reply("Emoji kurulumu başlatılıyor.")
        message.guild.emojis.create(zade_vunmute, "zade_vunmute").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(zade_slotgif, "zade_slotgif").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(zade_patlican, "zade_patlican").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(canzade_unmute, "canzade_unmute").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(coin, "coin").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(coinflip, "coinflip").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(no_zade, "no_zade").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(yes_zade, "yes_zade").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(zade_kalp, "zade_kalp").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(zade_kiraz, "zade_kiraz").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(zade_mute, "zade_mute").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
        message.guild.emojis.create(zade_para, "zade_para").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
     
        return;

      } else if (button.customId === "LogKur") {
        row.components[1].setDisabled(true) 
        msg.edit({ components: [row] }); 
     
        button.reply(`Bot loglarının kurulumuna başlanıyor.`)
        const parent = await message.guild.channels.create('Zade Logs', { type: 'GUILD_CATEGORY' });
     await message.guild.channels.create('join-family', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('leave-family', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('yetkili-tag-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('yasaklı-tag', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('booster-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('command-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('command-block', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('moderation-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('rol-yönet-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('register-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('cezai-işlem-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('yasak-kaldırma-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('stream-denetleme-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('stream-cezalı-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('basit-nickname', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('voice-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('nickname-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('message-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('discord-user-log', { type: 'GUILD_TEXT', parent: parent.id });
    await message.guild.channels.create('invite-tracker', { type: 'GUILD_TEXT', parent: parent.id });
    message.channel.send(`Bot loglarının kurulumu başarıyla tamamlanmıştır.`)
  
  } else if (button.customId === "CANCEL") {
        row.components[0].setDisabled(true) 
        row.components[1].setDisabled(true) 
        row.components[2].setDisabled(true) 
        msg.edit({ components: [row] }); 

        button.reply("İşlem iptal edildi")
      }
    })
    collector.on("end", async(button) => {
      row.components[0].setDisabled(true) 
    row.components[1].setDisabled(true) 
    row.components[2].setDisabled(true) 
    msg.edit({ components: [row] }); 
    })
  }
}
module.exports = BotKurulum;