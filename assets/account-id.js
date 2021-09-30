const axios = require('axios')
const readline = require('readline')
const chalk = require('chalk')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What is your account name?', async(answer) => {
  console.log(chalk.red(`Fetching account linked or named ${answer}`))
})
