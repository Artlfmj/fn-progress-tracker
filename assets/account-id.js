const axios = require('axios')
const readline = require('readline')
const chalk = require('chalk')
const endpoints = require('./endpoints.json')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What is your account name?', async(answer) => {
  console.log(chalk.red(`Fetching account linked or named ${answer}`));
  const platforms = ["epic","psn", "xbl"] 
  for(const platform of platforms){
    axios({
      url : endpoints.fnapicom.accountid,
      method : "get",
      params : {
        name : answer.toString(),
        platform : platform
      },
      headers : {
        'x-api-key' : process.env.FNAPICOM
      }
    })
    .catch(e => {
      const json = e.toJson();
      
    })
    .then(async(req) => {
      //Interpret data
    })  
   }
})
