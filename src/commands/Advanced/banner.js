

  const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const axios = require('axios')
class banner extends Command {
    constructor(client) {
        super(client, {
            name: "banner",
            aliases: ["user-banner","kbanner"]
        });
    }
 async run(message, args, data) {
 // let user = args.length > 0 ? message.mentions.users.first() || await this.client.users.fetch(args[0]) || message.author : message.author  
 let user = message.mentions.users.first() || this.client.users.cache.get(args[0]) || (args[0] && args[0].length ? this.client.users.cache.find(x => x.username.match(new RegExp(args.join(" "), "mgi"))) : null) || null;
if (!user) 
  try { user = await this.client.users.fetch(args[0]); }
  catch (err) { user = message.author; } 
  const can = await this.client.api.users(user.id).get();

  if(can.banner) {
     message.channel.send(`https://cdn.discordapp.com/banners/${can.id}/${can.banner}?size=512`)
  }
  else this.client.yolla("Belirttiğiniz kullanıcının banneri bulunmamaktadır!", message.author, message.channel);

}
}

module.exports = banner;