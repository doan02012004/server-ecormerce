import dotenv from 'dotenv'
dotenv.config()

export const env = {
    PORT: process.env.PORT,
    MONGODB_URI:process.env.MONGODB_URI,
    DB_NAME:process.env.DATABASE_NAME,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET :process.env.CLOUDINARY_API_SECRET,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    TIME_ACCESSTOKEN: process.env.TIME_ACCESSTOKEN,
    TIME_REFRESHTOKEN: process.env.TIME_REFRESHTOKEN,
    DOMAIN_ORIGIN :  process.env.DOMAIN_ORIGIN,
}