import { MongoClient, ServerApiVersion } from "mongodb";
import { evn } from "./environment.js";

const MONGODB_URI = evn.MONGODB_URI
const DB_NAME = evn.DB_NAME
let apiDatabaseInstance = null
const mongoClient = new MongoClient(MONGODB_URI,{
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

export const CONNECT_DB = async() =>{
    await mongoClient.connect()
    apiDatabaseInstance = mongoClient.db(DB_NAME)
}

export const CLOSE_DB = async() =>{
    await mongoClient.close()
}

export const GET_DB = ()=>{
    if(!apiDatabaseInstance) throw new Error('Must connect Database first')
    return apiDatabaseInstance
}

