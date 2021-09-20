require('dotenv').config()
const axios = require('axios')
const { post } = require('axios')
const package = require('./package.json')
const chalk = require('chalk')
const embeds = require('./assets/embeds.json')
const endpoints = require('./assets/endpoints.json')

axios({
    url : package.urls.api.identity,
    method : "get"
})
.then(identity => {
    
    axios({
        url : process.env.WEBHOOK,
        method : "post",
        headers : {
            'Content-Type': 'application/json'
        },
        params : {
            wait : true
        },
        data : {
            username : identity.data.user.name,
            avatar_url : identity.data.user.avatar,
            embeds : [embeds[0]]
        }
    })
    .then(async(data) => {
        console.log(chalk.green.bold("Webhook valid, starting api checks"))
        const initm = await axios({
            url : process.env.WEBHOOK,
            method : "post",
            headers : {
                'Content-Type': 'application/json'
            },
            params : {
                wait : true
            },
            data : {
                username : identity.data.user.name,
                avatar_url : identity.data.user.avatar,
                embeds : [embeds[1]]
            }
        })
        const initcom = await axios({url : endpoints.fnapicom.check, method : "get"})
        .catch(e => {
            console.log(e.toJSON())
            embeds[1].description = "Fortnite API COM : :x:"
            console.log(chalk.red("Fortnite API COM down"))
        })
        if(initcom){
            embeds[1].description = "Fortnite API COM : :white_check_mark:"
            console.log(chalk.green("Fortnite API COM | OK"))
        }
        axios({
            url : process.env.WEBHOOK + `/messages/${initm.data.id}`,
            method : "patch",
            headers : {
                'Content-Type': 'application/json'
            },
            params : {
                wait : true
            },
            data : {
                username : identity.data.user.name,
                avatar_url : identity.data.user.avatar,
                embeds : [embeds[1]]
            }
        })
    })
    .catch(e => {
        return console.log(chalk.red("An error occured during the webhook test. | Please review your config, if you believe this is an error try again later. If this error still occurs, please open an issue on Github"))
    })
})
