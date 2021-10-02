require('dotenv').config()
const axios = require('axios')
const readline = require('readline')
const chalk = require('chalk')
const endpoints = require('./assets/endpoints.json')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What is your account name?', async(answer) => {
  console.log(chalk.red(`Fetching account linked or named ${answer}`));
  const platforms = ["epic","psn", "xbl"] 
  let epic, xbox, psn;
  await axios({
    url : endpoints.fnapicom.accountid,
    method : "get",
    params : {
      name : answer.toString(),
      platform : platforms["epic"]
    },
    headers : {
      'x-api-key' : process.env.FNAPICOM
    }
  })
  .catch(e => {
    console.log(e)
  })
  .then(async(req) => {
    //Interpret data
    console.log(req.data)
    epic = req.data
  })  
  await sleep(1000)
  await axios({
    url : endpoints.fnapicom.accountid,
    method : "get",
    params : {
      name : answer.toString(),
      platform : platforms["psn"]
    },
    headers : {
      'x-api-key' : process.env.FNAPICOM
    }
  })
  .catch(e => {
    console.log(e)
  })
  .then(async(req) => {
    //Interpret data
    console.log(req.data)
    psn = req.data
  })  
  sleep(1000)
  await axios({
    url : endpoints.fnapicom.accountid,
    method : "get",
    params : {
      name : answer.toString(),
      platform : platforms["xbl"]
    },
    headers : {
      'x-api-key' : process.env.FNAPICOM
    }
  })
  .catch(e => {
    console.log(e)
  })
  .then(async(req) => {
    //Interpret data
    console.log(req.data)
    xbl = req.data
  })  
  sleep(2000)
  
})

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}