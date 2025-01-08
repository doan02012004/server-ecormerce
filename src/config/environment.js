import dotenv from 'dotenv'
dotenv.config()

export const env = {
    PORT: process.env.PORT,
    MONGODB_URI:process.env.MONGODB_URI,
    DB_NAME:process.env.DATABASE_NAME
}