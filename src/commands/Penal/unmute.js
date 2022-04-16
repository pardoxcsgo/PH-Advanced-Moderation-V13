
    const Command = require("../../base/Command.js");
    const data = require("../../models/cezalar.js")
    const ms = require("ms")
    const moment = require("moment")
    require("moment-duration-format")
    const Discord = require("discord.js")
    moment.locale("tr")
    const mutes = require("../../models/voicemute.js")
    let serverSettings = require("../../models/serverSettings");
    const sunucu = require("../../models/sunucu-bilgi.js")
    const wmute = require("../../models/waitMute.js")
    class Unmute extends Command {
        constructor(client) {
            super(client, {
                name: "unmute",
                aliases: ["unmute","unvmute","vunmute"]
            });
        }

        async run(message, args, perm) {
            let server = await serverSettings.findOne({
                guildID: message.guild.id
            });

            if (!message.member.roles.cache.some(r => server.ChatMuteAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
            await message.react(`${this.client.emojis.cache.find(x => x.name === "canzade_unmute")}`);
            await message.react(`${this.client.emojis.cache.find(x => x.name === "zade_vunmute")}`);
            const filter = (reaction, user) => {return ["canzade_unmute", "zade_vunmute"].includes(reaction.emoji.name) && user.id === message.author.id;};
            const collector = message.createReactionCollector({filter, max: 1,time: 30000,error: ['time']});
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!target) return message.reply("Lütfen bir kullanıcı belirleyiniz");
            collector.on("collect", async (reaction) => {
                message.reactions.removeAll();
                message.react(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)}`);
                if(reaction.emoji.name == "canzade_unmute") {
                    if (target.roles.cache.has(`${server.ChatMuteRole}`)) {
                  //      if(target.roles.cache.has(server.ChatMuteRole)) return message.reply("Belirttiğin kullanıcının geçerli bir chatmute cezası bulunmamakta!");
                        await target.roles.remove(server.ChatMuteRole).then(async (user) => {message.channel.send(`Başarılı bir şekilde <@${user.id}> adlı kullanıcının mutesini kaldırdınız.`)});
                    } else return;
                } else if (reaction.emoji.name == "zade_vunmute") {
                    if (target.voice.serverMute == true) {
                        await message.channel.send(`Başarılı bir şekilde <@${target.id}> adlı kullanıcının ses mutesini kaldırdınız.`);        
                        await target.voice.setMute(false).catch(() => {});
                    } else return;
                };
            });
           
        }
    }
    module.exports = Unmute;
