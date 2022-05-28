fs  = require('fs')

const saveData   =  (data , url) => {
    fs.writeFileSync(url , JSON.stringify(data))  
}

const readData =  (url) => {
    try{
        return JSON.parse(fs.readFileSync(url , {encoding: 'utf-8'}))
    }
    catch(error){
        return error 
    }
}

module.exports= {
    saveData, 
    readData
}