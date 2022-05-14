const Command = require("../../base/Command.js");
const Discord = require("discord.js")
class Cihaz extends Command {
    constructor(client) {
        super(client, {
            name: "cihaz",
            usage: ".cihaz [@user]",
            category: "Authorized",
            description: "Belirttiğiniz kişinin hangi platformdan giriş yaptığını görürsünüz.",
            aliases: ["cıhaz"]
        });
    }

    async run(message, args, data) {
        if (!message.member.permissions.has("VIEW_AUDIT_LOG")) return
        let member = message.mentions.users.first() || this.client.users.cache.get(args[0])
        if (!args[0]) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        if (!member) return this.client.yolla("Belirttiğin üyeyi bulamıyorum.", message.author, message.channel)
        if (member.presence && member.presence.status == "offline") return this.client.yolla(`\`${member.tag}\` kullanıcısı çevrimdışı olduğundan dolayı cihaz bilgisini tespit edemiyorum.`, message.author, message.channel)
        let cihaz = ""
        let ha = Object.keys(member.presence.status)
        if (ha[0] == "mobile") cihaz = "Mobil Telefon"
        if (ha[0] == "desktop") cihaz = "Masaüstü Uygulama"
        if (ha[0] == "web") cihaz = "İnternet Tarayıcısı"
        message.channel.send(`\`${member.tag}\` üyesinin şu anda kullandığı cihaz: \`${cihaz}\``)

    }
}

module.exports = Cihaz;
