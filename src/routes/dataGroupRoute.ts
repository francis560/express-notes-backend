import { Router } from 'express';
import dataGroup from '../controllers/dataGroupRoute.controller';
const dataGroupRoute: Router = Router();



dataGroupRoute.post('/groupCreate', dataGroup.createGroup);

dataGroupRoute.post('/getGroupData', dataGroup.getGroupData);

dataGroupRoute.post('/deleteGroupData', dataGroup.deleteGroupData);

dataGroupRoute.post('/exitGroup', dataGroup.exitGroup);

dataGroupRoute.post('/updateGroupData', dataGroup.updateGroupData);

dataGroupRoute.post('/groupJoin', dataGroup.groupJoin);

dataGroupRoute.post('/getGroupMembers', dataGroup.getGroupMembers);

dataGroupRoute.post('/coProfesor', dataGroup.coProfesor);


export default dataGroupRoute