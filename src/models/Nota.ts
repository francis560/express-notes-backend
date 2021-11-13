import { Schema, model, Document, ObjectId } from 'mongoose';


export interface NotaI extends Document {

    descripcion: string;
    notas: any;
    userId: ObjectId;

};


const noteSchema = new Schema({

    descripcion: { type: String, required: true },
    userId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    notas: { type: Object, required: true }

}, {
    timestamps: true
});



export default model<NotaI>('Nota', noteSchema);