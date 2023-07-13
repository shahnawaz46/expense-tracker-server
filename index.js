import express from 'express'
import cors from 'cors'
import expenseRouter from './src/routes/expense.router.js'

// database connection
import Connection from './src/db/Connection.js'
Connection() 

// making app for middlewares and routes
const app = express()

// middlewares
app.use(express.json())
app.use(cors({origin:true}))

// routes middlewares
app.use("/api", expenseRouter)

const Port = process.env.PORT || 9000
app.listen(Port, ()=>{
    console.log(`Server is Running at Port No ${Port}`)
})