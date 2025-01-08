
import exitHook from 'exit-hook'
import { env } from './config/environment.js'
import { app } from './app.js'
import mongoose from 'mongoose'

let server;
const START_SERVER = () => {
    const Port = env.PORT
    server = app.listen(Port, () => {
        console.log('Server is running on Port', Port)
    })

    exitHook(() => {
        if (server) {
            server.close(()=>{
                console.log('Exit app')

            })
        }
    })
}

(async () => {
    try {
        await mongoose.connect(env.MONGODB_URI)
        console.log('Connected mongodb Compass')
        START_SERVER()
    } catch (error) {
        console.log('Connect fail mongodb Compass', error.messsage)
        process.exit(0)
    }
})()
