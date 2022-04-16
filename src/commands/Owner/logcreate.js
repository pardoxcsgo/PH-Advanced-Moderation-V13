const Command = require("../../base/Command.js");
const Discord = require("discord.js")
let serverSettings = require("../../models/serverSettings");

class logChannel extends Command {
  constructor(client) {
    super(client, {
      name: "log",
      usage: "log-kur",
      aliases: ["logkur"]
    });
  }
  async run(message, args, level) {
     if(!this.client.config.botOwners.includes(message.author.id)) return
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
    message.channel.send(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} Bot loglarının kurulumu başarıyla tamamlanmıştır.`)
  }
}
  module.exports = logChannel;
