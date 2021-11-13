import { Response, Request } from 'express';
import Nota, { NotaI } from '../models/Nota';
import Grupo, { GrupoI } from '../models/Grupo';


class notesRouteController {

    public async createNote (req: Request, res: Response): Promise<any> {
        
        try {

            const { userId, descripcion, notas, groupId } = req.body;
        
            const nota: NotaI = await new Nota({userId, descripcion, notas});
    
            const noteSave = await nota.save();
    
            const getGroup: GrupoI = await Grupo.findById({_id: groupId});
    
            getGroup.notas.push(noteSave);
            getGroup.save();
    
            res.status(200).json({message: 'Todo correcto'});

        } catch (err) {
            res.status(400).json({message: 'Paso un error'});
        }

    };

    public async getNote (req: Request, res: Response): Promise<any> {
        
        try {

            const { userId, groupId, permisos } = req.body;

            const getGroupNote: GrupoI = await Grupo.findById({_id: groupId});


            if (permisos) {

                var notes = [];
                for (let item of getGroupNote.notas) {
                    const getNote = await Nota.findById({_id: item});
                    notes.push(getNote);
                }

                res.status(200).json(notes);
                return;

            }

            var notesUser = [];
            for (let j of getGroupNote.notas) {

                const getNoteData: NotaI = await Nota.findById({_id: j});

                if (getNoteData.userId == userId) {
                    notesUser.push(getNoteData);
                }

            }

            res.status(200).json(notesUser);

        } catch (err) {
            res.status(400).json({ErrorNote: 'No se encontraron notas'});
        }

    };

    public async editNote (req: Request, res: Response): Promise<any> {

        try {

            const { userId, descripcion, noteId, notas } = req.body;

            const getNote: NotaI = await Nota.findByIdAndUpdate({_id: noteId}, {userId, descripcion, notas});
    
            await getNote.save();
    
            res.status(200).json({message: 'Grupo actualizado con exito'});

        } catch (err) {
            res.status(400).json({message: 'Error al actualizar el grupo'});
        }

    };

    public async deleteNote (req: Request, res: Response): Promise<any> {

        try {

            const { noteId, groupId } = req.body;
    
            const getGroup: GrupoI = await Grupo.findById({_id: groupId});
    
            var count = 0;
            for (let i of getGroup.notas) {
    
                if (i == noteId) {
                    getGroup.notas.splice(count, 1);
                }
                
                count++
            }
            
            await Nota.findByIdAndDelete({_id: noteId});
            await getGroup.save();
    
            res.status(200).json({message: 'Nota eliminada con exito'});

        } catch (err) {

            res.status(400).json({message: 'Error al eliminar la nota'});

        }

    };

    public async getOneNote (req: Request, res: Response): Promise<any> {

        try {

            const { noteId } = req.body;

            const getNote: NotaI = await Nota.findById({_id: noteId});
    
            res.status(200).json(getNote);

        } catch (err) {

            res.status(400).json({message: 'Error al pedir la nota'});

        }

    };

}


const notesRoute = new notesRouteController;
export default notesRoute