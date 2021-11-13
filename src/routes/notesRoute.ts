import { Router } from 'express';
import notesRouteController from '../controllers/notesRoute.controller';
const notesRoute: Router = Router();



notesRoute.post('/createNote', notesRouteController.createNote);

notesRoute.post('/getNote', notesRouteController.getNote);

notesRoute.post('/editNote', notesRouteController.editNote);

notesRoute.post('/deleteNote', notesRouteController.deleteNote);

notesRoute.post('/getOneNote', notesRouteController.getOneNote);


export default notesRoute