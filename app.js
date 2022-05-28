const Server = require("./models/Server")
require("dotenv").config()
console.clear()
console.log(`Program runing at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} `)
require("./models/Server")
const hbs = require("hbs")
hbs.registerPartials(__dirname + "/views/partials" , (arg)=> {})

const params = {
    port: process.env.PORT,
    ownName: process.env.OWN
}

const program = new Server(params)



