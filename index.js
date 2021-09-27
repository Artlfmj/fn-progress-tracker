require('dotenv').config()
const axios = require('axios')
const { post } = require('axios')
const package = require('./package.json')
const chalk = require('chalk')
const embeds = require('./assets/embeds.json')
const endpoints = require('./assets/endpoints.json')
const { MessageEmbed } = require('discord.js')

// Identity request
axios({
    url : endpoints.github.identity,
    method : "get"
})
.then(identity => {
    //Webhook check
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
    .catch(e => {
        return console.log(chalk.red("An error occured during the webhook test. | Please review your config, if you believe this is an error try again later. If this error still occurs, please open an issue on Github"))
    })
    .then(async(data) => {
        console.log(chalk.green.bold("Webhook valid, starting api checks"))
        // Api checks
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
        let check = true;
        const initcom = await axios({url : endpoints.fnapicom.check, method : "get"})
        .catch(e => {
            console.log(e.toJSON())
            embeds[1].description = "Fortnite API COM : :x:"
            console.log(chalk.red("Fortnite API COM down"))
            check = false
        })
        if(initcom){
            embeds[1].description = "Fortnite API COM : :white_check_mark:"
            console.log(chalk.green("Fortnite API COM | OK"))
        }
        const initio = await axios({url : endpoints.fnapiio.check, method : "get"})
        .catch(e => {
            console.log(e.toJSON())
            embeds[1].description = embeds[1].description + "\nFortnite API Io : :x:"
            console.log(chalk.red("Fortnite API Io down"))
            check = false
        })
        if(initio){
            embeds[1].description = embeds[1].description + "\nFortnite API Io : :white_check_mark:"
            console.log(chalk.green("Fortnite API Io | OK"))
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
        const initiokey = await axios({url : endpoints.fnapiio.check, method : "get", headers : {Authorization : process.env.FNAPIIO}})
        
        if(initiokey.data.result){
            embeds[1].description = embeds[1].description + "\nFortnite API Io Key : :white_check_mark:"
            console.log(chalk.green("Fortnite API Io key | OK"))
        } else {
            
            embeds[1].description = embeds[1].description + "\nFortnite API Io Key: :x:"
            console.log(chalk.red("Fortnite API Io key is invalid"))
            check = false
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
        if(check){
            const bugs = await axios({
                method : "get",
                url : endpoints.github['emergency-notices']
            })
            console.log(bugs.data)
            if(bugs.data){
                let embs = []
                for(const bug of bugs.data){
                    
                    let emb = {
                        image : {}
                    };
                    emb.title = "BUG DETECTED : " + bug.name,
                    emb.description = bug.description,
                    emb.image.url = bug.image
                    emb.color = 16711680
                    embs.push(emb)
                }
                if(embs.length){
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
                            embeds : embs
                        }
                    })
                }
                const releases = await axios({
                    url : endpoints.github.releases,
                    method : "get"
                })
                
                
            }
        }
        else {
            // Checks message update
            embeds[1].description = embeds[1].description + "\nOne of the checks was not fufilled. Please check console to see what strops the program from running"
            await axios({
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
            return console.log(chalk.bold.red("One of the checks was not fufilled. Please check console to see what strops the program from running"))
        }
    })
    
})
