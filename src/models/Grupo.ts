import { any } from '@hapi/joi';
import { Schema, model, Document } from 'mongoose';




export interface GrupoI extends Document {

    name: string;
    materia: string[];
    integrantes: any[];
    notas: any[];
    codigo: string;
    adminGroup: string;
    coProfesor: string;

};


const grupoSchema = new Schema({

    name: { type: String, required: true },
    materias: [{ type: String, required: true }],
    integrantes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    notas: [{ type: Schema.Types.ObjectId, ref: 'Nota' }],
    codigo: { type: String, required: true },
    adminGroup: { type: String, required: true },
    coProfesor: { type: String, required: true }

}, {
    timestamps: true
});



export default model<GrupoI>('Grupo', grupoSchema);