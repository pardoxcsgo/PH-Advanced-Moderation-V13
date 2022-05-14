const isimler = require("../models/isimler.js")
let serverSettings = require("../models/serverSettings");
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    let server = await serverSettings.findOne({
   
    });
   if(member.roles.cache.has(server.UnregisteredRole[0])) return
   isimler.findOne({user: member.id}, async(err,res) => {
    if(!res) {
    let arr = []
    arr.push({isim: member.displayName, state: "Sunucudan Ayrılma", yetkili: "Yok"})
    let newData = new isimler({
      user: member.id,
      isimler: arr
    })
    newData.save().catch(e => console.log(e))
  } else {
    res.isimler.push({isim: member.displayName, state: "Sunucudan Ayrılma", yetkili: "Yok"})
    res.save().catch(e => console.log(e))
  }
  })
  }
};
