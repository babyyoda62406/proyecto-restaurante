const express = require("express")
const path = require("path")
const { v4: uudiv4 } = require('uuid')
const fileUpload = require("express-fileupload")


const { append } = require("express/lib/response")
//const bodyParser = require("body-parser")
const { saveData, readData } = require("../helpers/db_handler")

class Server {

    constructor(arg) {
        this._app = express()
        this._port = arg.port
        this._ownName = arg.ownName
        this._dbUser = this.readDB("db/tbuser.json")
        this._dbPlate = this.readDB("db/tbplate.json")
        this._dbReserve = this.readDB("db/tbreserve.json")
        this._dbMSG = this.readDB("db/tbmsg.json")
        this.middleware()
        this.load_get()
        this.load_post()
        this.run()
    }

    middleware() {
        // Motor de renderizado HBS
        this._app.set('view engine', 'hbs')

        // Configuracion del directorio publico 
        this._app.use(express.static("public"))

        // Lectura y parseo del body
        this._app.use(express.json())
        this._app.use(express.urlencoded({ extended: true }))

        // Configuracion de express-fileUpload
        this._app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/'
        }))
    }

    readDB(arg) {
        let bundle = readData(arg)
        return bundle
    }

    writeDB(url, data) {
        fs.writeFileSync(url, JSON.stringify(data))
    }

    load_get() {

        this._app.get("/", (req, res) => {
            res.render("index", {
                Nombre_Restaurante: this._ownName
            })
        })

        this._app.get("/news", (req, res) => {
            res.render("news", {
                Nombre_Restaurante: this._ownName
            })
        })

        this._app.get("/contact", (req, res) => {
            res.render("contact", {
                Nombre_Restaurante: this._ownName
            })
        })

        this._app.get("/meet", (req, res) => {
            res.json(this._dbPlate)
        })

        this._app.get("/loadDelete", (req, res) => {
            res.json(this._dbPlate)
        })
        
        this._app.get("/getMsg" , (req , res)=>{
            res.status(200).json(this._dbMSG)
        })
        this._app.get("/getReserve" , (req, res)=> {
            res.status(200).json(this._dbReserve)
        })

    }

    getTimeServer() {//Devuelve la hora del servidor estandarizada
        let th = new Date().getHours()
        let tm = new Date().getMinutes()
        let ts = new Date().getSeconds()
        th = (th > 9) ? th : '0' + String(th)
        tm = (tm > 9) ? tm : '0' + String(tm)
        ts = (ts > 9) ? ts : '0' + String(ts)
        return `${th}:${tm}:${ts}`
    }

    load_post() {

        this._app.post("/login", (req, res) => { //Login
            let validate = false
            let userName = req.body.ipNameAdmin
            let userPass = req.body.ipKeyAdmin
            //console.log(`Usuario: ${userName} \nClave: ${userPass}`)
            this._dbUser.map(arg => {
                if (arg.user == userName && arg.key == userPass)
                    validate = true
            })

            if (validate) {
                res.render("admin", {
                    admin: userName
                })
            }
            else {
                res.redirect("/")
            }
        })

        this._app.post("/addPlate", (req, res) => { //Add Plate
            //console.log(req.body)
            //Carga del archivo
            if (!req.files.ipCoverPlate) {
                res.status(404).json({ "msg": "Problemas al cargar el archivo" })
            }
            const { ipCoverPlate } = req.files

            let fileName = ipCoverPlate.name
            fileName = fileName.split('.')
            fileName = fileName[fileName.length - 1]
            fileName = uudiv4() + '.' + fileName

            const uploadPath = path.join(__dirname, "../public/upload", fileName)

            ipCoverPlate.mv(uploadPath, err => {
                if (err)
                    console.log(err)
                else {

                }
                //console.log(`File was uploaded to `+ uploadPath)
            })


            //COnfiguracion de la entrada en BD
            let time_solution = ""
            if (req.body.ipDesayuno == "on") time_solution = "D"
            if (req.body.ipAlmuerzo == "on") time_solution += "A"
            if (req.body.ipComida == "on") time_solution += "C"
            const load = {
                "id": uudiv4(),
                "name": req.body.ipNamePlate,
                "time": time_solution,
                "price": req.body.ipPricePlate,
                "file": fileName
            }
            //console.log(`>> ${this._dbPlate} <<`)
            this._dbPlate.push(load)
            this.writeDB('db/tbplate.json', this._dbPlate)

            res.status("200").json({ "msg": "Plato Creado" })
        })

        this._app.post("/deletePlate", (req, res) => {//Delete Plate
            const { id, time } = req.body
            const trash = this._dbPlate.filter(arg => arg.id == id)[0]
            if (trash.time.length == 1) {
                let deleteName = trash.file
                const deletePath = path.join(__dirname, "../public/upload", deleteName)
                if (fs.existsSync(deletePath)) {
                    fs.unlinkSync(deletePath)
                }
                this._dbPlate = this._dbPlate.filter(arg => arg.id != id)
                this.writeDB('db/tbplate.json', this._dbPlate)
                res.status(200).json({ "msg": "Plato Eliminado" })
            }
            else {
                this._dbPlate = this._dbPlate.filter(arg => arg.id != id)
                let timeBegin = trash.time
                let timeEnd = ""
                for (let i = 0; i < timeBegin.length; i++) {
                    if (timeBegin[i] != time) {
                        timeEnd += timeBegin[i]
                    }
                }
                trash.time = timeEnd
                this._dbPlate.push(trash)
                this.writeDB('db/tbplate.json', this._dbPlate)
                res.status(200).json({ "msg": "Plato Eliminado" })
            }
        })

        this._app.post("/editPate", (req, res) => {//Edit Plate
            let time_solution = ""
            if (req.body.ipDesayuno == "on") time_solution = "D"
            if (req.body.ipAlmuerzo == "on") time_solution += "A"
            if (req.body.ipComida == "on") time_solution += "C"
            let trash = this._dbPlate.filter(arg => arg.id == req.body.ipID)[0]
            const load = {
                "id": req.body.ipID,
                "name": req.body.ipNamePlate,
                "time": time_solution,
                "price": req.body.ipPricePlate,
                "file": trash.file
            }
            //console.log(`>> ${this._dbPlate} <<`)
            this._dbPlate = this._dbPlate.filter(arg => arg.id != req.body.ipID)
            this._dbPlate.push(load)
            this.writeDB('db/tbplate.json', this._dbPlate)


            res.status("200").json({ "msg": "Plato Editado" })
        })

        this._app.post("/saveMe",     (req, res) => {//Reservar
            const { name, email, phone, people, date, timeN, message } = req.body
            const load = { "id": uudiv4(), name, email, phone, people, date, timeN, message }
            this._dbReserve.push(load)
            this.writeDB("db/tbreserve.json", this._dbReserve)

            res.status(200).json({ "msg": "Reservación creada" })

        })

        this._app.post("/contactMSG", (req, res) => {// Recibir Mensaje
            const { contact_name, contact_phone, contact_email, contact_message } = req.body

            const load = { "id": uudiv4() , "time":this.getTimeServer() , contact_name, contact_phone, contact_email, contact_message }
            this._dbMSG.push(load)
            this.writeDB("db/tbmsg.json", this._dbMSG)

            res.status(200).json({ "msg": "Mensaje enviado" })
        })

        this._app.post("/deleteMsg",  (req, res)=>{//Eliminar Mensaje
            const {id}  = req.body 
            this._dbMSG = this._dbMSG.filter(arg => arg.id!=id)
            this.writeDB("db/tbmsg.json" , this._dbMSG)
            res.status(200).json({"msg":"Delete is success"})
            
        })

        this._app.post("/deleteRsv" , (req, res)=> {//Eliminar Rsv
            const {id}  = req.body 
            this._dbReserve = this._dbReserve.filter(arg => arg.id!=id)
            this.writeDB("db/tbreserve.json" , this._dbReserve)
            res.status(200).json({"msg":"Delete is success"})
        })
    }


    run() {
        this._app.listen(this._port, () => {
            console.log(`Server runing in port ${this._port}`)
        })
    }

}

module.exports = Server 