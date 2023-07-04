const express = require("express")

const app = express()

const Port = process.env.PORT || 9000
app.listen(Port, ()=>{
    console.log(`Server is Running at Port No ${Port}`)
})