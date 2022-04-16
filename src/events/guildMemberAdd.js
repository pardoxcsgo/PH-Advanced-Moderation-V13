const cezalar = require("../models/cezalı.js")
const mute = require("../models/chatmute.js")
const data = require("../models/yasaklıtag.js")
let serverSettings = require("../models/serverSettings");
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(member) {
        let server = await serverSettings.findOne({
   
        });
        await data.findOne({ guild: member.guild.id }, async (err, res) => {
        if(res.taglar.some(x => member.user.username.includes(x)) == true) {
            member.roles.add(server.BannedTagRole)
           // member.setNickname('Yasaklı Tag');
            setTimeout(() => {
            member.roles.remove(server.UnregisteredRole)}, 2000);
            member.send("Sunucumuza isminde bulunan yasaklı taglardan birisi ile giriş yaptığın için, erişimin kapatıldı. İsminde ki tagı çıkardıkan sonra sunucumuza erişebileceksin. Sağlıcakla kal!").catch(e => console.log('Mesaj atamıyorum.'))
            return
        }
        if (Date.now() - member.user.createdTimestamp < ms("5d")) return member.roles.set(server.SuspectedRole)
        let mutedDB = await mute.findOne({ user: member.id })
        if (mutedDB && mutedDB.muted == true) member.roles.add(server.ChatMuteRole)
        if (member.user.username.includes(""+server.Tag+"")) member.roles.add(server.FamilyRole)
        let cezalıDB = await cezalar.findOne({ user: member.id })
        if (!cezalıDB) return member.roles.add(server.UnregisteredRole)
        if (cezalıDB && cezalıDB.ceza == true) return await member.roles.set(server.QuarantineRole)
        if (cezalıDB && cezalıDB.ceza == false) return await member.roles.set(server.UnregisteredRole)
    })
    }
};
