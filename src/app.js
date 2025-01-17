import express from 'express'
import cors from 'cors'
import routes from './routes/v1/index.js'
import { errorHandler } from './middlewares/error.js';
 const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());

// v1 api routes
app.use('/api/v1', routes);

// middlewares xử lý lỗi tập trung 
app.use(errorHandler)

export default app