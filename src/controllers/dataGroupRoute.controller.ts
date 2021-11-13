import { Response, Request } from 'express';
import User, { UserI } from '../models/User';
import Grupo, { GrupoI } from '../models/Grupo';
import { v4 as uuid } from 'uuid';


class dataGroupRouteController {

    public async createGroup (req: Request, res: Response): Promise<any> {
        
        const { _id, name, materias } = req.body;

        const user: UserI = await User.findById(_id)

        const grupo: GrupoI = new Grupo({ name, materias, adminGroup: _id, coProfesor: ' ' });

        grupo.codigo = uuid();

        grupo.integrantes.push(user._id);

        const saveGroup = await grupo.save();

        user.grupos.push(saveGroup);

        await user.save();

        res.status(200).json({save: "grupo guardado con exito"});
    };

    public async getGroupData (req: Request, res: Response): Promise<any> {
        
        const { _id } = req.body;

        const getUser: UserI = await User.findById(_id);

        var groups = [];

        for (let i of getUser.grupos) {
            
            var getGroup = await Grupo.findById(i);
            groups.push(getGroup);
            
        }
        
        res.json(groups);
    };

    public async deleteGroupData (req: Request, res: Response): Promise<any> {
        
        try {

            const { _id, groupId } = req.body;
            
            var getGroup = await Grupo.findById({_id: groupId});
            
    
            for (let i of getGroup.integrantes) {
                
    
                var getUser = await User.findById({_id: i});
    
                var count = 0;
                for (let j of getUser.grupos) {
    
                    if (j == groupId) {
                        getUser.grupos.splice(count, 1);
                        await getUser.save();
                    }
    
                    count++
                }
                
            }
            
            
            await Grupo.findByIdAndDelete({_id: groupId});
    
            res.status(200).json({ delete: "Grupo eliminado con exito" });

        } catch (err) {

            res.status(400).json({ message: "Error al eliminar el grupo" });

        }
        
    };

    public async exitGroup (req: Request, res: Response): Promise<any> {
        
        try {

            const { _id, groupId } = req.body;
            
            var getUser: UserI = await User.findById(_id);
            var getGroup: GrupoI = await Grupo.findById( { _id: groupId } );
    
            var count = 0;
            for (let i of getUser.grupos) {
    
                if (i == groupId) {
                    getUser.grupos.splice(count, 1);
                    await getUser.save();
                }
                
                count++
            }
            
    
            var count2 = 0;
            for (let l of getGroup.integrantes) {
    
                if (`${ l }` == `${ _id }`) {
                    getGroup.integrantes.splice(count2, 1);
                    await getGroup.save();
                }
                
                count2++
            }
    
            res.status(200).json({ delete: "Saliste del grupo con exito" });

        } catch (err) {

            res.status(400).json({ message: "Error al salir del grupo" });

        }

        
    };

    public async updateGroupData (req: Request, res: Response): Promise<any> {
       
        try {

            const { _id, name, materias } = req.body;
            
            const getGroup: GrupoI = await Grupo.findByIdAndUpdate(_id, {name, materias});
    
            await getGroup.save();
    
    
            res.status(200).json({ update: "Grupo actualizado con exito" });

        } catch (err) {

            res.status(400).json({ message: "Error al actualizar el grupo" });

        }


    };

    public async groupJoin (req: Request, res: Response): Promise<any> {
        
        try {
            
            const { _id, groupCode } = req.body;
            
            const getGroup: GrupoI = await Grupo.findOne({codigo: groupCode});
            const getUser: UserI = await User.findById(_id);


            for (let i of getUser.grupos) {

                const getGroupId: GrupoI = await Grupo.findById(i);

                if (`${getGroup._id}` == `${getGroupId._id}`) {
                    res.status(200).json(getGroup);
                    return
                }         

            }


            getUser.grupos.push(getGroup._id);
            getGroup.integrantes.push(getUser._id);

            await getUser.save();
            await getGroup.save();


            res.status(200).json(getGroup);

        } catch (err) {

            res.status(400).json({groupError: 'Grupo no encontrado'});

        }

    };

    public async getGroupMembers (req: Request, res: Response): Promise<any> {
        
        try {
            
            const { groupId } = req.body;
    
            const getGroup: GrupoI = await Grupo.findById({_id: groupId});
    
    
            var dataMembers: any[] = []
            for (let i of getGroup.integrantes) {
    
                const getDataMembers = await User.findById({_id: i});
                dataMembers.push(getDataMembers);
    
            }
    
    
            res.status(200).json(dataMembers);

        } catch (err) {

            res.status(400).json({ message: "Error al pedir los miembros del grupo" });

        }
    };

    public async coProfesor (req: Request, res: Response): Promise<any> {
        
        try {
            
            const { coProfesorValue, groupId } = req.body;
    
            const getGroup: GrupoI = await Grupo.findById({_id: groupId});
    
            getGroup.coProfesor = coProfesorValue;

            await getGroup.save();
    
            res.status(200).json({message: "Asistente agregado con exito"});

        } catch (err) {

            res.status(400).json({ message: "Error al agregar al asistente" });

        }
    };
}


const dataGroupRoute = new dataGroupRouteController;
export default dataGroupRoute











//     "grupos": [6],
//     "_id": "6006d4f9129ff823b7ddf5ab",
//     "username": "ramon",
//     "email": "ramon1234@gmail.com",
//     "permisos": true,
//     "createdAt": "2021-01-19T12:47:54.005Z",
//     "updatedAt": "2021-01-19T12:47:54.005Z",
//     "__v": 0
