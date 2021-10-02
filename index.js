const Discord = require('discord.js')
require('dotenv').config()
const axios = require('axios')
const clock = require('date-events')()
const servers = require('./servers.json')
const fs = require('fs')


const client = new Discord.Client({
    intents : ['GUILD_MESSAGES', "GUILDS", "GUILD_INTEGRATIONS"]
})
clock.on("minute", async() => {
    let messageexists = true;
    let message;
    const channel = await client.channels.cache.get(process.env.channelid)
    const messagereq = await channel.messages.fetch({limit : 1})
    const messages = messagereq.first()
    if(!messages){ messageexists = false}
    else{
        
        if(messages.author.id === client.user.id){
            message = messages
        } else {
            messageexists = false
        }
    }
    let serversdata = []
    servers.forEach(async(server) => {
        const time = new Date().getMilliseconds()
        let check = true;
        
        await axios({
            method : "get",
            url : server
        })
        .catch(e => {
            let check = false;
        })
        .then(async(data) => {
            if(!data){
                check = false
            }
            const end = new Date().getMilliseconds()
            const ms = end - time
            const object = {
                server : server,
                check : check,
                ping : ms
            }
            serversdata.push(object)
            await fs.writeFile('./data.json', JSON.stringify(serversdata), err => {
                if (err) {
                  console.error(err)
                  return
                }
                //file written successfully
              })
        })
        
    })
    const file = await fs.readFileSync('data.json', err => {
        if (err) {
          console.error(err)
          return
        }
    })
    let json = JSON.parse(file)
   
    const embed = require('./embed.json')
    embed.description = "";
    json.forEach(async(serv) => {
        let emoji;
        if(serv.check){
            emoji = "✅"
        } else {
            emoji = " ❌"
        }
        embed.description = embed.description + `**${serv.server}** : ${emoji} | Ping : ${serv.ping}ms\n`
    })
    if(messageexists){
        messages.edit({embeds : [embed]})
    } else {
        channel.send({embeds : [embed]})
    }

})
client.on("ready", async() => {
    console.log(`${client.user.username} est en ligne!`)
})
client.login(process.env.token)