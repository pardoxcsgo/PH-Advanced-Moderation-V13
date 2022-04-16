const Command = require("../../base/Command.js");
const Discord = require("discord.js")
class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            aliases: ["av", "pp"]
        });
    }
//
    async run(message, args, data) {
//if(!message.member.permissions.has("VIEW_AUDIT_LOG")) return
let user = message.mentions.users.first() || this.client.users.cache.get(args[0]) || (args[0] && args[0].length ? this.client.users.cache.find(x => x.username.match(new RegExp(args.join(" "), "mgi"))) : null) || null;
if (!user) 
  try { user = await this.client.users.fetch(args[0]); }
  catch (err) { user = message.author; }
let embed = new Discord.MessageEmbed()
.setDescription(`**${user.tag}** adlı kullanıcının profil fotoğrafı!`)
.setImage(user.displayAvatarURL({dynamic: true, size: 2048}))
.setFooter({ text: `${message.author.tag} tarafından istendi!` })
message.channel.send({ embeds: [embed] })
//message.channel.send(`${user.tag} ${user.displayAvatarURL({ dynamic: true, size: 4096 })}`)
    }
}//${user.displayAvatarURL({ dynamic: true, size: 4096 })}

module.exports = Avatar;
