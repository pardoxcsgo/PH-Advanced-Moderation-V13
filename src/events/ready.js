let serverSettings = require("../models/serverSettings")
const data = require("../models/yasaklıtag.js")
const sunucu = require("../models/sunucu-bilgi.js")
const { joinVoiceChannel } = require("@discordjs/voice");
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {

    require("../modules/unmutes.js")(this.client)
    require("../modules/vunmutes.js")(this.client)
    require("../modules/zamanlayıcı.js")(this.client)
    let guild = this.client.guilds.cache.get(this.client.config.guildID)
    await guild.members.fetch().then(e => console.log('Üyeler fetchlendi.'))
    
  
    let server = await serverSettings.findOne({}, async (err, doc) => {

      if(!doc) {
        new serverSettings({ guildID: this.client.config.guildID }).save()
      }
  
      })

        let am = await data.findOne({}, async (err, res) => {
          if(!res) {
            new data({ guild: this.client.config.guildID }).save()
          }
        })
        const VoiceChannel = this.client.channels.cache.get(server.BotVoiceChannel);
        joinVoiceChannel({
          channelId: VoiceChannel.id,
          guildId: VoiceChannel.guild.id,
          adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
          selfDeaf: true
        });

        setInterval(() => {
          const can = Math.floor(Math.random() * (this.client.config.botStatus.length));
          this.client.user.setActivity(`${this.client.config.botStatus[can]}`, {
            type: "WATCHING"});
        }, 10000);
          this.client.user.setStatus("dnd");
    this.client.logger.log(`${this.client.user.tag}, kullanıma hazır ${this.client.users.cache.size} kullanıcı, ${this.client.guilds.cache.size} sunucu.`, "ready");
    this.client.logger.log(`${this.client.lastPunishment} ceza tanımlandı!`, "ready")
  }
};
