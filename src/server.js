import express from 'express'
import exitHook from 'exit-hook'
import { CLOSE_DB, CONNECT_DB } from './config/mongodb.js'
import { evn } from './config/environment.js'


const START_SERVER = () =>{
    const app = express()
    const Port = evn.PORT
    app.listen(Port, ()=>{
        console.log('Server is running on Port', Port)
    })
    
    exitHook(()=>{
        console.log('Exit app')
        CLOSE_DB()
    })
}

(async()=>{
   try {
    await CONNECT_DB()
    console.log('Connected mongodb Compass')
    START_SERVER()
   } catch (error) {
    console.log('Connect fail mongodb Compass')
    process.exit(0)
   }
})()
