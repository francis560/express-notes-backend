import express, { Application } from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import auth from './routes/auth';
import dataGroupRoute from './routes/dataGroupRoute';
import notesRoutes from './routes/notesRoute';
const app: Application = express();




app.use(express.json());
app.use(cors({ origin: "https://express-notes.vercel.app/" }));
app.use(morgan('dev'));
app.use(express.urlencoded( {extended: true} ));
app.use(express.static(path.join(__dirname, 'public')));




app.set('port', process.env.PORT || 4200);


import './database';

app.use('/api', auth);
app.use('/api', dataGroupRoute);
app.use('/api', notesRoutes);




export default app
