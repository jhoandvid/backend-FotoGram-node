import {Schema, model, Document} from 'mongoose'
import bcrypt from 'bcrypt';

const usuarioSchema=new Schema<IUsuario>({
    nombre:{
        type:String,
        required:[true, 'El nombre es necesario'],

    },

    avatar:{
        type:String,
        default:'av-1.png'
    },
    email:{
        type:String,
        unique:[true, 'adsassssssssss'],
        required:[true, 'El correo es necesario']
    },
    password:{
        type:String,
        required:[true, 'La contraseña es necesaria']
    }
}); 


usuarioSchema.method('compararPassword', function(password:string=''):boolean{
    if(bcrypt.compareSync(password, this.password)){
        return true;
    }else{
        return false
    }
})

export interface IUsuario extends Document{
    nombre:string,
    email:string,
    password:string,
    avatar:string,
    compararPassword(password:string):boolean;
}


export const Usuario=model<IUsuario>('Usuario', usuarioSchema);