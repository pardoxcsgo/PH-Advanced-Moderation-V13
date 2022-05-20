const Command = require("../../base/Command.js");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
const Discord = require("discord.js")
let serverSettings = require("../../models/serverSettings");
const mutes = require("../../models/voicemute.js")
const sunucu = require("../../models/sunucu-bilgi.js")
const wmute = require("../../models/waitMute.js")
class VMute extends Command {
    constructor(client) {
        super(client, {
            name: "vmute",
            usage: ".vmute [@user][süre][sebep]",
            category: "Authorized",
            description: "Belirttiğiniz kişiye voice mute atarsınız.",
            aliases: ["vmute", "voicemute", "voice-mute"]
        });
    }

    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
		if (!message.member.roles.cache.some(r => server.VoiceMuteAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Susturmak istediğin kullanıcıyı bulamadım.", message.author, message.channel)
        if (user.id == message.author.id) return this.client.yolla("Kullanıcılar kendilerine ceza-i işlem uygulayamaz.", message.author, message.channel)
        if (!message.member.roles.cache.get(server.GuildOwner)) {
            if (user.permissions.has("MANAGE_ROLES")) return this.client.yolla("Yöneticilere ceza-i işlem uygulayamazsın.", message.author, message.channel)
        if (user.roles.cache.has(server.BotCommandRole)) return this.client.yolla("Yetkililer birbirlerine ceza işlemi uygulayamazlar.", message.author, message.channel)
        if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
        }
        if (user.voice.serverMute == true) return this.client.yolla("Kullanıcı zaten susturulmuş durumda.", message.author, message.channel)
       
        let id = await data.countDocuments().exec();
       
        const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
        .setDescription(`
${user}, kişisinin uyguladığı davranışlara göre aşağıdaki buttonlardan seçim yaparak voice mute cezası uygulayın.

${Discord.Formatters.codeBlock("diff", `
1️⃣ Chatteki olayı sese yansıtmak / konuyu uzatmak
2️⃣ Küfür, Ortam bozma, Troll, Soundpad
3️⃣ Flood, Spam
4️⃣ Dizi veya filmler hakkında spoiler vermek
5️⃣ Tartışmak, kavga etmek veya rahatsızlık çıkarmak, kışkırtmak
6️⃣ Ailevi küfür
7️⃣ Siyaset
8️⃣ Ortamı (${message.guild.name}) kötülemek
9️⃣ Taciz, Kadın üyelere sarkmak
❎ İptal
`)}
`)
       
const row = new Discord.MessageActionRow()
.addComponents(
  new Discord.MessageButton()
    .setCustomId('1')
    .setLabel("1")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('2')
    .setLabel("2")
    .setStyle('PRIMARY'),      
  new Discord.MessageButton()
    .setCustomId('3')
    .setLabel("3")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('4')
    .setLabel("4")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('5')
    .setLabel("5")
    .setStyle('PRIMARY'))

    const row2 = new Discord.MessageActionRow()
    .addComponents(
     new Discord.MessageButton()
    .setCustomId('6')
    .setLabel("6")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('7')
    .setLabel("7")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('8')
    .setLabel("8")
    .setStyle('PRIMARY'),      
  new Discord.MessageButton()
    .setCustomId('9')
    .setLabel("9")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('İptal')
    .setEmoji("❎")
    .setStyle('SUCCESS'),
);       
       var msg = await message.channel.send({ embeds: [embed], components: [row, row2]})
       var filter = (button) => button.user.id === message.author.id;
       const collector = msg.createMessageComponentCollector({ filter, time: 30000 })

       collector.on("collect", async(button) => {
        row.components[0].setDisabled(true)
        row.components[1].setDisabled(true)
        row.components[2].setDisabled(true)
        row.components[3].setDisabled(true)
        row.components[4].setDisabled(true)

        row2.components[0].setDisabled(true)
        row2.components[1].setDisabled(true)
        row2.components[2].setDisabled(true)
        row2.components[3].setDisabled(true)
        row2.components[4].setDisabled(true)


        msg.edit({ components: [row, row2] })

        if(button.customId === "1") {

            let time = 1000 * 60 * 15;
            let sebep = "Chatteki olayı sese yansıtmak / konuyu uzatmak"
            let cıkaralım = time + Date.parse(new Date());
            let şuanki = moment(Date.parse(new Date())).format("LLL");
            let sonraki = moment(cıkaralım).format("LLL");

             if(user.voice.channel) {
        user.voice.setMute(true)
        await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.mute_name)} <@${user.id}> ${await this.client.turkishDate(time)} boyunca **${sebep}** sebebiyle ses kanallarında susturuldu. (Ceza Numarası: \`#${id + 1}\`)`)
        const mutelendi = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor("32CD32")
            .setFooter({ text: `Ceza Numarası: #${id + 1}`})
            .setDescription(`
${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu

• Ses Mute atılma tarihi: ${şuanki}
• Ses Mute bitiş tarihi: ${sonraki}
• Ses Mute sebebi: ${sebep}
`)
            await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 10}** ulaştınız.`).catch(e => { })
            await this.client.channels.cache.get(server.VoiceMuteLog).send({embeds: [mutelendi]})
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + time,
                start: Date.now(),
                sebep: sebep
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: id + 1,
                ceza: "Voice Mute",
                sebep: sebep,
                tarih: moment(Date.parse(new Date())).format("LLL"),
                bitiş: moment(Date.parse(new Date()) + time).format("LLL")
            })
            newData.save().catch(e => console.error(e))
        })
    } else {
        await wmute.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin ${await this.client.turkishDate(time)} sürelik (**${sebep}**) ses mutesi başlatılamadı kullanıcı sese bağlanınca otomatik olarak cezası başlayacak. (Ceza Numarası: \`#${id + 1}\`)`)
            const newWmute = new wmute({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                sebep: sebep,
                date: time,
                cezano: id + 1
            })
            newWmute.save().catch(e => console.log(e))
        } else {
            return button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin veritabanında halihazırda başlayacak bir cezası mevcut.`)
        }
        })
    }

        } else if(button.customId === "2") {

            let time = 1000 * 60 * 20;
            let sebep = "Küfür, Ortam bozma, Troll, Soundpad"
            let cıkaralım = time + Date.parse(new Date());
            let şuanki = moment(Date.parse(new Date())).format("LLL");
            let sonraki = moment(cıkaralım).format("LLL");

             if(user.voice.channel) {
        user.voice.setMute(true)
        await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.mute_name)} <@${user.id}> ${await this.client.turkishDate(time)} boyunca **${sebep}** sebebiyle ses kanallarında susturuldu. (Ceza Numarası: \`#${id + 1}\`)`)
        const mutelendi = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor("32CD32")
            .setFooter({ text: `Ceza Numarası: #${id + 1}`})
            .setDescription(`
${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu

• Ses Mute atılma tarihi: ${şuanki}
• Ses Mute bitiş tarihi: ${sonraki}
• Ses Mute sebebi: ${sebep}
`)
            await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 10}** ulaştınız.`).catch(e => { })
            await this.client.channels.cache.get(server.VoiceMuteLog).send({embeds: [mutelendi]})
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + time,
                start: Date.now(),
                sebep: sebep
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: id + 1,
                ceza: "Voice Mute",
                sebep: sebep,
                tarih: moment(Date.parse(new Date())).format("LLL"),
                bitiş: moment(Date.parse(new Date()) + time).format("LLL")
            })
            newData.save().catch(e => console.error(e))
        })
    } else {
        await wmute.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin ${await this.client.turkishDate(time)} sürelik (**${sebep}**) ses mutesi başlatılamadı kullanıcı sese bağlanınca otomatik olarak cezası başlayacak. (Ceza Numarası: \`#${id + 1}\`)`)
            const newWmute = new wmute({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                sebep: sebep,
                date: time,
                cezano: id + 1
            })
            newWmute.save().catch(e => console.log(e))
        } else {
            return button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin veritabanında halihazırda başlayacak bir cezası mevcut.`)
        }
        })
    }

        } else if(button.customId === "3") {
            
            let time = 1000 * 60 * 25;
            let sebep = "Flood, Spam"
            let cıkaralım = time + Date.parse(new Date());
            let şuanki = moment(Date.parse(new Date())).format("LLL");
            let sonraki = moment(cıkaralım).format("LLL");

             if(user.voice.channel) {
        user.voice.setMute(true)
        await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.mute_name)} <@${user.id}> ${await this.client.turkishDate(time)} boyunca **${sebep}** sebebiyle ses kanallarında susturuldu. (Ceza Numarası: \`#${id + 1}\`)`)
        const mutelendi = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor("32CD32")
            .setFooter({ text: `Ceza Numarası: #${id + 1}`})
            .setDescription(`
${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu

• Ses Mute atılma tarihi: ${şuanki}
• Ses Mute bitiş tarihi: ${sonraki}
• Ses Mute sebebi: ${sebep}
`)
            await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 10}** ulaştınız.`).catch(e => { })
            await this.client.channels.cache.get(server.VoiceMuteLog).send({embeds: [mutelendi]})
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + time,
                start: Date.now(),
                sebep: sebep
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: id + 1,
                ceza: "Voice Mute",
                sebep: sebep,
                tarih: moment(Date.parse(new Date())).format("LLL"),
                bitiş: moment(Date.parse(new Date()) + time).format("LLL")
            })
            newData.save().catch(e => console.error(e))
        })
    } else {
        await wmute.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin ${await this.client.turkishDate(time)} sürelik (**${sebep}**) ses mutesi başlatılamadı kullanıcı sese bağlanınca otomatik olarak cezası başlayacak. (Ceza Numarası: \`#${id + 1}\`)`)
            const newWmute = new wmute({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                sebep: sebep,
                date: time,
                cezano: id + 1
            })
            newWmute.save().catch(e => console.log(e))
        } else {
            return button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin veritabanında halihazırda başlayacak bir cezası mevcut.`)
        }
        })
    }
            
        } else if(button.customId === "4") {

            let time = 1000 * 60 * 10;
            let sebep = "Dizi veya filmler hakkında spoiler vermek"
            let cıkaralım = time + Date.parse(new Date());
            let şuanki = moment(Date.parse(new Date())).format("LLL");
            let sonraki = moment(cıkaralım).format("LLL");

             if(user.voice.channel) {
        user.voice.setMute(true)
        await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.mute_name)} <@${user.id}> ${await this.client.turkishDate(time)} boyunca **${sebep}** sebebiyle ses kanallarında susturuldu. (Ceza Numarası: \`#${id + 1}\`)`)
        const mutelendi = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor("32CD32")
            .setFooter({ text: `Ceza Numarası: #${id + 1}`})
            .setDescription(`
${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu

• Ses Mute atılma tarihi: ${şuanki}
• Ses Mute bitiş tarihi: ${sonraki}
• Ses Mute sebebi: ${sebep}
`)
            await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 10}** ulaştınız.`).catch(e => { })
            await this.client.channels.cache.get(server.VoiceMuteLog).send({embeds: [mutelendi]})
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + time,
                start: Date.now(),
                sebep: sebep
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: id + 1,
                ceza: "Voice Mute",
                sebep: sebep,
                tarih: moment(Date.parse(new Date())).format("LLL"),
                bitiş: moment(Date.parse(new Date()) + time).format("LLL")
            })
            newData.save().catch(e => console.error(e))
        })
    } else {
        await wmute.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin ${await this.client.turkishDate(time)} sürelik (**${sebep}**) ses mutesi başlatılamadı kullanıcı sese bağlanınca otomatik olarak cezası başlayacak. (Ceza Numarası: \`#${id + 1}\`)`)
            const newWmute = new wmute({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                sebep: sebep,
                date: time,
                cezano: id + 1
            })
            newWmute.save().catch(e => console.log(e))
        } else {
            return button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin veritabanında halihazırda başlayacak bir cezası mevcut.`)
        }
        })
    }
            
        } else if(button.customId === "5") {

            let time = 1000 * 60 * 20;
            let sebep = "Tartışmak, kavga etmek veya rahatsızlık çıkarmak, kışkırtmak"
            let cıkaralım = time + Date.parse(new Date());
            let şuanki = moment(Date.parse(new Date())).format("LLL");
            let sonraki = moment(cıkaralım).format("LLL");

             if(user.voice.channel) {
        user.voice.setMute(true)
        await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.mute_name)} <@${user.id}> ${await this.client.turkishDate(time)} boyunca **${sebep}** sebebiyle ses kanallarında susturuldu. (Ceza Numarası: \`#${id + 1}\`)`)
        const mutelendi = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor("32CD32")
            .setFooter({ text: `Ceza Numarası: #${id + 1}`})
            .setDescription(`
${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu

• Ses Mute atılma tarihi: ${şuanki}
• Ses Mute bitiş tarihi: ${sonraki}
• Ses Mute sebebi: ${sebep}
`)
            await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 10}** ulaştınız.`).catch(e => { })
            await this.client.channels.cache.get(server.VoiceMuteLog).send({embeds: [mutelendi]})
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + time,
                start: Date.now(),
                sebep: sebep
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: id + 1,
                ceza: "Voice Mute",
                sebep: sebep,
                tarih: moment(Date.parse(new Date())).format("LLL"),
                bitiş: moment(Date.parse(new Date()) + time).format("LLL")
            })
            newData.save().catch(e => console.error(e))
        })
    } else {
        await wmute.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin ${await this.client.turkishDate(time)} sürelik (**${sebep}**) ses mutesi başlatılamadı kullanıcı sese bağlanınca otomatik olarak cezası başlayacak. (Ceza Numarası: \`#${id + 1}\`)`)
            const newWmute = new wmute({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                sebep: sebep,
                date: time,
                cezano: id + 1
            })
            newWmute.save().catch(e => console.log(e))
        } else {
            return button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin veritabanında halihazırda başlayacak bir cezası mevcut.`)
        }
        })
    }
            
        } else if(button.customId === "6") {

            let time = 1000 * 60 * 30;
            let sebep = "Ailevi küfür"
            let cıkaralım = time + Date.parse(new Date());
            let şuanki = moment(Date.parse(new Date())).format("LLL");
            let sonraki = moment(cıkaralım).format("LLL");

             if(user.voice.channel) {
        user.voice.setMute(true)
        await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.mute_name)} <@${user.id}> ${await this.client.turkishDate(time)} boyunca **${sebep}** sebebiyle ses kanallarında susturuldu. (Ceza Numarası: \`#${id + 1}\`)`)
        const mutelendi = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor("32CD32")
            .setFooter({ text: `Ceza Numarası: #${id + 1}`})
            .setDescription(`
${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu

• Ses Mute atılma tarihi: ${şuanki}
• Ses Mute bitiş tarihi: ${sonraki}
• Ses Mute sebebi: ${sebep}
`)
            await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 10}** ulaştınız.`).catch(e => { })
            await this.client.channels.cache.get(server.VoiceMuteLog).send({embeds: [mutelendi]})
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + time,
                start: Date.now(),
                sebep: sebep
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: id + 1,
                ceza: "Voice Mute",
                sebep: sebep,
                tarih: moment(Date.parse(new Date())).format("LLL"),
                bitiş: moment(Date.parse(new Date()) + time).format("LLL")
            })
            newData.save().catch(e => console.error(e))
        })
    } else {
        await wmute.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin ${await this.client.turkishDate(time)} sürelik (**${sebep}**) ses mutesi başlatılamadı kullanıcı sese bağlanınca otomatik olarak cezası başlayacak. (Ceza Numarası: \`#${id + 1}\`)`)
            const newWmute = new wmute({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                sebep: sebep,
                date: time,
                cezano: id + 1
            })
            newWmute.save().catch(e => console.log(e))
        } else {
            return button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin veritabanında halihazırda başlayacak bir cezası mevcut.`)
        }
        })
    }
            
        } else if(button.customId === "7") {

            let time = 1000 * 60 * 20;
            let sebep = "Siyaset"
            let cıkaralım = time + Date.parse(new Date());
            let şuanki = moment(Date.parse(new Date())).format("LLL");
            let sonraki = moment(cıkaralım).format("LLL");

             if(user.voice.channel) {
        user.voice.setMute(true)
        await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.mute_name)} <@${user.id}> ${await this.client.turkishDate(time)} boyunca **${sebep}** sebebiyle ses kanallarında susturuldu. (Ceza Numarası: \`#${id + 1}\`)`)
        const mutelendi = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor("32CD32")
            .setFooter({ text: `Ceza Numarası: #${id + 1}`})
            .setDescription(`
${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu

• Ses Mute atılma tarihi: ${şuanki}
• Ses Mute bitiş tarihi: ${sonraki}
• Ses Mute sebebi: ${sebep}
`)
            await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 10}** ulaştınız.`).catch(e => { })
            await this.client.channels.cache.get(server.VoiceMuteLog).send({embeds: [mutelendi]})
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + time,
                start: Date.now(),
                sebep: sebep
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: id + 1,
                ceza: "Voice Mute",
                sebep: sebep,
                tarih: moment(Date.parse(new Date())).format("LLL"),
                bitiş: moment(Date.parse(new Date()) + time).format("LLL")
            })
            newData.save().catch(e => console.error(e))
        })
    } else {
        await wmute.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin ${await this.client.turkishDate(time)} sürelik (**${sebep}**) ses mutesi başlatılamadı kullanıcı sese bağlanınca otomatik olarak cezası başlayacak. (Ceza Numarası: \`#${id + 1}\`)`)
            const newWmute = new wmute({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                sebep: sebep,
                date: time,
                cezano: id + 1
            })
            newWmute.save().catch(e => console.log(e))
        } else {
            return button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin veritabanında halihazırda başlayacak bir cezası mevcut.`)
        }
        })
    }
            
        } else if(button.customId === "8") {

            let time = 1000 * 60 * 20;
            let sebep = `Ortamı (${message.guild.name}) kötülemek`
            let cıkaralım = time + Date.parse(new Date());
            let şuanki = moment(Date.parse(new Date())).format("LLL");
            let sonraki = moment(cıkaralım).format("LLL");

             if(user.voice.channel) {
        user.voice.setMute(true)
        await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.mute_name)} <@${user.id}> ${await this.client.turkishDate(time)} boyunca **${sebep}** sebebiyle ses kanallarında susturuldu. (Ceza Numarası: \`#${id + 1}\`)`)
        const mutelendi = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor("32CD32")
            .setFooter({ text: `Ceza Numarası: #${id + 1}`})
            .setDescription(`
${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu

• Ses Mute atılma tarihi: ${şuanki}
• Ses Mute bitiş tarihi: ${sonraki}
• Ses Mute sebebi: ${sebep}
`)
            await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 10}** ulaştınız.`).catch(e => { })
            await this.client.channels.cache.get(server.VoiceMuteLog).send({embeds: [mutelendi]})
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + time,
                start: Date.now(),
                sebep: sebep
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: id + 1,
                ceza: "Voice Mute",
                sebep: sebep,
                tarih: moment(Date.parse(new Date())).format("LLL"),
                bitiş: moment(Date.parse(new Date()) + time).format("LLL")
            })
            newData.save().catch(e => console.error(e))
        })
    } else {
        await wmute.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin ${await this.client.turkishDate(time)} sürelik (**${sebep}**) ses mutesi başlatılamadı kullanıcı sese bağlanınca otomatik olarak cezası başlayacak. (Ceza Numarası: \`#${id + 1}\`)`)
            const newWmute = new wmute({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                sebep: sebep,
                date: time,
                cezano: id + 1
            })
            newWmute.save().catch(e => console.log(e))
        } else {
            return button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin veritabanında halihazırda başlayacak bir cezası mevcut.`)
        }
        })
    }
            
        } else if(button.customId === "9") {

            let time = 1000 * 60 * 45;
            let sebep = `Taciz, Kadın üyelere sarkmak`
            let cıkaralım = time + Date.parse(new Date());
            let şuanki = moment(Date.parse(new Date())).format("LLL");
            let sonraki = moment(cıkaralım).format("LLL");

             if(user.voice.channel) {
        user.voice.setMute(true)
        await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.mute_name)} <@${user.id}> ${await this.client.turkishDate(time)} boyunca **${sebep}** sebebiyle ses kanallarında susturuldu. (Ceza Numarası: \`#${id + 1}\`)`)
        const mutelendi = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor("32CD32")
            .setFooter({ text: `Ceza Numarası: #${id + 1}`})
            .setDescription(`
${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu

• Ses Mute atılma tarihi: ${şuanki}
• Ses Mute bitiş tarihi: ${sonraki}
• Ses Mute sebebi: ${sebep}
`)
            await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 10}** ulaştınız.`).catch(e => { })
            await this.client.channels.cache.get(server.VoiceMuteLog).send({embeds: [mutelendi]})
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + time,
                start: Date.now(),
                sebep: sebep
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: id + 1,
                ceza: "Voice Mute",
                sebep: sebep,
                tarih: moment(Date.parse(new Date())).format("LLL"),
                bitiş: moment(Date.parse(new Date()) + time).format("LLL")
            })
            newData.save().catch(e => console.error(e))
        })
    } else {
        await wmute.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                await button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin ${await this.client.turkishDate(time)} sürelik (**${sebep}**) ses mutesi başlatılamadı kullanıcı sese bağlanınca otomatik olarak cezası başlayacak. (Ceza Numarası: \`#${id + 1}\`)`)
            const newWmute = new wmute({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                sebep: sebep,
                date: time,
                cezano: id + 1
            })
            newWmute.save().catch(e => console.log(e))
        } else {
            return button.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin veritabanında halihazırda başlayacak bir cezası mevcut.`)
        }
        })
    }
            
        } else if(button.customId === "İptal") {
            button.reply("Ceza işlemi İptal edildi.")
        }

       })

       collector.on("end", async(button) => {

        msg.delete()
       })

    }
}

module.exports = VMute;
