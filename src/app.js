import express from 'express'
import cors from 'cors'
import routes from './routes/v1/index.js'
import cookies from 'cookie-parser'
import { errorHandler } from './middlewares/error.js';
import { env } from './config/environment.js';
 const app = express();


app.use(cookies())
// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors({
    origin:env.DOMAIN_ORIGIN,
    credentials:true
}));

// v1 api routes
app.use('/api/v1', routes);

// middlewares xử lý lỗi tập trung 
app.use(errorHandler)

export default app