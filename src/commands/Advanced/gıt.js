const Discord = require("discord.js");
const Command = require("../../base/Command.js");
class Git extends Command {
    constructor(client) {
        super(client, {
            name: "git",
            aliases: ["go"]
        });
    }
    async run(message, args, data) {
        let kullanici = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!message.member.voice.channel) return this.client.yolla("Bir kullanıcının odasına gitmek için ilk önce kendiniz ses kanalına girmelisiniz.", message.author, message.channel)
        if(!kullanici) return this.client.yolla("Odasına gitmek istedğiniz kullanıcıyı belirtmeniz gerekir", message.author, message.channel)
        if(!kullanici.voice.channel) return this.client.yolla("Odasına gitmek istediğiniz kullanıcı ses kanallarında bulunmuyor", message.author, message.channel)
        if(message.member.voice.channel.id === kullanici.voice.channel.id) return this.client.yolla("Odasına gitmek istediğinizi kullanıcı ile aynı odada bulunuyorsunuz!", message.author, message.channel)
        const filter = (reaction, user) => {
        return (["yes_zade", "no_zade"].includes(reaction.emoji.name) && user.id === kullanici.id);
    };
        let teklif = new Discord.MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${message.author} adlı kullanıcı sizin sesli kanalınıza gelmek istiyor kabul ediyor musunuz?`)
        .setColor("RANDOM")
        let mesaj = await message.channel.send({ embeds: [teklif]})
        await mesaj.react(this.client.emojis.cache.find(x => x.name === "yes_zade"));
        await mesaj.react(this.client.emojis.cache.find(x => x.name === "no_zade"));
        mesaj.awaitReactions({filter, 
            max: 1,
            time: 60000,
            errors: ["time"]
            })
            .then(collected => {
            const reaction = collected.first();
            if (reaction.emoji.name === "yes_zade") {
        let kabul = new Discord.MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${message.author} başarıyla **${kullanici.voice.channel.name}** adlı kanala gittiniz.`)
        .setColor("RANDOM")
        message.channel.send({ embeds: [kabul] }).then(msg => { setTimeout(() => { msg.delete(); }, 10000); })
        message.member.voice.setChannel(kullanici.voice.channel);
            } else {
        let redd = new Discord.MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${message.author} Sesli kanalına gitmek istediğiniz üye teklifinizi geri çevirdi!`)
        .setColor("RANDOM")
        message.channel.send({ embeds: [redd] }).then(msg => { setTimeout(() => { msg.delete(); }, 10000); })
            }
      }); 
    }
}
module.exports = Git;