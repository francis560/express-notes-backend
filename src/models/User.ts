import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';




export interface UserI extends Document {

    username: string;
    email: string;
    password: string;
    grupos: any[];
    permisos: boolean;
    iconProfile: string;
    encrypPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
    
};



const userSchema = new Schema({

    username: { type: String, required: true, min: 4, lowercase: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    grupos: [{ type: Schema.Types.ObjectId, ref: 'Grupo' }],
    permisos: { type: Boolean, required: true },
    iconProfile: { type: String, required: true }

}, {
    timestamps: true
});



userSchema.methods.encrypPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};




export default model<UserI>('User', userSchema);