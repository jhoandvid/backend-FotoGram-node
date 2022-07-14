import { Request, Response, Router } from "express";
import { Usuario, IUsuario } from '../models/usuario.model';
import bcrypt from 'bcrypt'
import Token from "../classes/token";
import { verificaToken } from '../middlewares/autenticacon';
const userRoutes=Router();

//Login

userRoutes.post('/login', (req:Request, res:Response)=>{

    const body=req.body;

    Usuario.findOne({email:body.email}, (err:any, userDB:IUsuario)=>{
        
        if(err) throw err;
    
        if(!userDB){
            return res.json({
                ok:false,
                mensaje:'Usuario/Contraseña no son correctos'
            });
        }

        if(userDB.compararPassword(body.password)){

            const tokenUser=Token.getJwtToken({
                _id:userDB._id,
                nombre:userDB.nombre,
                email:userDB.email,
                avatar:userDB.avatar
            });

            res.json({
                ok:true,
                token: tokenUser
            });
        }else{
            res.json({
                ok:false,
                mensaje:'Usuario/Contraseña no son correctos ***'
            });
        }
        

    
    })
    
});


//Crear un usuario
userRoutes.post('/create',(req:Request, res:Response)=>{

    const user={
        nombre:req.body.nombre,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password,10),
        avatar:req.body.avatar
    };

    
    Usuario.create(user).then(userDB=>{

        const tokenUser=Token.getJwtToken({
            _id:userDB._id,
            nombre:userDB.nombre,
            email:userDB.email,
            avatar:userDB.avatar
        });

        res.json({
            ok:true,
            token: tokenUser
        });


    }).catch(err=>{
        res.json({
            ok:false,
            err,

        });
        })  
    })

    //Actualizar usuario
    userRoutes.post('/update', verificaToken, (req:any, res:Response)=>{

        const user={
            nombre:req.body.nombre || req.usuario.nombre,
            email:req.body.email || req.usuario.email,
            avatar:req.body.avatar|| req.usuario.avatar
        }


        Usuario.findByIdAndUpdate(req.usuario._id, user, {new:true}, (err, userDB)=>{
            if(err) throw err;

            if(!userDB){
                return res.json({
                    ok:false,
                    mensaje:'No existe un usuario con ese ID'
                });
            }

            const tokenUser=Token.getJwtToken({
                _id:userDB._id,
                nombre:userDB.nombre,
                email:userDB.email,
                avatar:userDB.avatar
            });


            res.json({
                ok:true,
                token:tokenUser
                
            })



        })

       

       

    

    });

   




/* userRoutes.get('/prueba', (req:Request, res:Response)=>{

        res.json({
            ok:true,
            mensaje:'Todo Funciona bien'
        })

}) */

userRoutes.get('/', [verificaToken], (req:any, res:Response)=>{
    const usuario=req.usuario;

            res.json({
                ok:true,
                usuario
            });
});


export default userRoutes;