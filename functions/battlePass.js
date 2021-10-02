const clock = require('date-events')()
module.exports = async (cl) => {
    clock.on('second', async (second) => {
        console.log(second)  
    })
}