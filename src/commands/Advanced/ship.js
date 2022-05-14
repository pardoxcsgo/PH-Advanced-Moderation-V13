const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const Canvas = require("canvas")
let serverSettings = require("../../models/serverSettings");
class Ship extends Command {
    constructor(client) {
        super(client, {
            name: "ship",
            usage: ".ship",
            category: "Global",
            description: "Rastgele bir kişiyle sizi shipler.",
            aliases: ["ship"]
        });
    }

    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });

        const sayı = Math.floor(Math.random() * 100);
        
        let mesaj;
        if(sayı > 75 && sayı < 100) mesaj = `❤️ 🔥 Siz çok yakıştınız sanki ? (**%${sayı}**)`
        if(sayı > 55 && sayı < 75) mesaj = `😉 Yani fazla şey demimde bi deneyin yani (**%${sayı}**)`
        if(sayı > 0 && sayı < 55) mesaj = `🤮 Sizden olmaz başkasını dene valla. (**%${sayı}**)`

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext("2d")
        const bg = await Canvas.loadImage("https://cdn.discordapp.com/attachments/731112308134248469/949078364445081620/hearts.png")
        ctx.drawImage(bg, 0, 0, 700, 250)
        ctx.font = "75px Sans-serif"
        ctx.fillStyle = "#f0f0f0"

        const messageAuthor = await Canvas.loadImage(message.author.displayAvatarURL({ format: "png" }))
        ctx.drawImage(messageAuthor, 100, 25, 200, 200)

        const heart = await Canvas.loadImage("https://cdn.discordapp.com/attachments/927571230134009856/975157787002826762/zadekalp.png")
        const broken = await Canvas.loadImage("https://cdn.discordapp.com/attachments/927571230134009856/975157787678093342/zadekirikkalp.png")
        const think = await Canvas.loadImage("https://cdn.discordapp.com/attachments/731112308134248469/949237394736037938/thnk.png")

        if(message.member.roles.cache.has(server.ManRole[0])) {
           
        const member = message.guild.members.cache.filter(uye => uye.roles.cache.has(server.WomanRole[0])).random()

        const targetMention = await Canvas.loadImage(member.displayAvatarURL({ format: "png" }))
        ctx.drawImage(targetMention, 400, 25, 200, 200)



        if(sayı > 55 && sayı > 75) {
            ctx.drawImage(heart, 275, 60, 150, 150)
            let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "hearts.png")
            let embed = new Discord.MessageEmbed()
            .setDescription(`${mesaj}`)
            .setImage(`attachment://hearts.png`)
            .setColor('RANDOM')
            message.channel.send({ content: "<@" + member.id + ">", embeds: [embed], files: [attachment] })
            return
        }

        if(sayı > 55 && sayı < 75) {
            ctx.drawImage(think, 275, 60, 150, 150)
            let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "hearts.png")
            let embed = new Discord.MessageEmbed()
            .setDescription(`${mesaj}`)
            .setImage(`attachment://hearts.png`)
            .setColor('RANDOM')
            message.channel.send({ content: "<@" + member.id + ">", embeds: [embed], files: [attachment] })
            return
        }

        if(sayı > 0 && sayı < 55) {
            ctx.drawImage(broken, 275, 60, 150, 150)
            let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "hearts.png")
            let embed = new Discord.MessageEmbed()
            .setDescription(`${mesaj}`)
            .setImage(`attachment://hearts.png`)
            .setColor('RANDOM')
            message.channel.send({ content: "<@" + member.id + ">", embeds: [embed], files: [attachment] })
            return;
        }
    } else if(message.member.roles.cache.has(server.WomanRole[0])) {
        const member = message.guild.members.cache.filter(uye => uye.roles.cache.has(server.ManRole[0])).random()

        const targetMention = await Canvas.loadImage(member.displayAvatarURL({ format: "png" }))
        ctx.drawImage(targetMention, 400, 25, 200, 200)

        if(sayı > 55 && sayı > 75) {
            ctx.drawImage(heart, 275, 60, 150, 150)
            let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "hearts.png")
            let embed = new Discord.MessageEmbed()
            .setDescription(`${mesaj}`)
            .setImage(`attachment://hearts.png`)
            .setColor('RANDOM')
            message.channel.send({ content: "<@" + member.id + ">", embeds: [embed], files: [attachment] })
            return
        }

        if(sayı > 55 && sayı < 75) {
            ctx.drawImage(think, 275, 60, 150, 150)
            let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "hearts.png")
            let embed = new Discord.MessageEmbed()
            .setDescription(`${mesaj}`)
            .setImage(`attachment://hearts.png`)
            .setColor('RANDOM')
            message.channel.send({ content: "<@" + member.id + ">", embeds: [embed], files: [attachment] })
            return
        }

        if(sayı > 0 && sayı < 55) {
            ctx.drawImage(broken, 275, 60, 150, 150)
            let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "hearts.png")
            let embed = new Discord.MessageEmbed()
            .setDescription(`${mesaj}`)
            .setImage(`attachment://hearts.png`)
            .setColor('RANDOM')
            message.channel.send({ content: "<@" + member.id + ">", embeds: [embed], files: [attachment] })
            return;
        }
    }
    
    }
}

module.exports = Ship;
