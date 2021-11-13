import { Response, Request } from 'express';
import User, { UserI } from '../models/User';
import { signupValidation, signinValidation } from '../libs/joi';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';



class AuthController {

    public async signupTeacher (req: Request, res: Response): Promise<any> {
        // Validation
        const { error } = signupValidation(req.body);
        if (error) return res.status(400).json(error.message);

        // Email Validation
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) return res.status(400).json({emailError: 'Email already exists'});

        // Saving a new User
        try {
            const newUser: UserI = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                iconProfile: ' ',
                permisos: true
            });
            newUser.password = await newUser.encrypPassword(newUser.password);
            const savedUser = await newUser.save();

            const token: string = jwt.sign({ _id: savedUser._id }, process.env['TOKEN_SECRET'] || '', {
                expiresIn: 60 * 60 * 24
            });
            res.header('auth-token', token).json( {'token': token} );
            //res.header('auth-token', token).json(savedUser);
        } catch (e) {
            res.status(400).json(e);
        }
    };


    public async signupStudent (req: Request, res: Response): Promise<any> {
        // Validation
        const { error } = signupValidation(req.body);
        if (error) return res.status(400).json(error.message);

        // Email Validation
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) return res.status(400).json({emailError: 'Email already exists'});

        // Saving a new User
        try {
            const newUser: UserI = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                iconProfile: ' ',
                permisos: false
            });
            newUser.password = await newUser.encrypPassword(newUser.password);
            const savedUser = await newUser.save();

            const token: string = jwt.sign({ _id: savedUser._id }, process.env['TOKEN_SECRET'] || '', {
                expiresIn: 60 * 60 * 24
            });
            res.header('auth-token', token).json( {'token': token} );
            //res.header('auth-token', token).json(savedUser);
        } catch (e) {
            res.status(400).json(e);
        }
    };

    
    public async signin (req: Request, res: Response): Promise<any> {

        const { error } = signinValidation(req.body);
        if (error) return res.status(400).json(error.message);

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({errorMessage: 'El correo o la contraseña son incorrectos'});

        const correctPassword = await user.validatePassword(req.body.password);
        if (!correctPassword) return res.status(400).json({passwordError: 'La contraseña es incorrecta'});

        // Create a Token
        const token: string = jwt.sign({ _id: user._id }, process.env['TOKEN_SECRET'] || '');
        res.header('auth-token', token).json( {'token': token} );

    };


    public async profile (req: any, res: Response): Promise<any> {

        const user = await User.findById(req.userId, { password: 0 });
        if (!user) {
            return res.status(404).json('No User found');
        }
        res.json(user);

    };
    

    public async updateAccount (req: Request, res: Response): Promise<any> {

        const { _id, username, email, password } = req.body;

        const emailExists: UserI = await User.findOne({ email: req.body.email });
        if (emailExists) return res.status(400).json({emailError: 'Email already exists'});

        try {
            
            if (email == '' || email == ' ') {
                const userUpdate: UserI = await User.findById(_id);
                userUpdate.username = username;
                const pass = userUpdate.password;

                if (password !== '' || password !== ' ') {
                    userUpdate.password = password;
                    userUpdate.password = await userUpdate.encrypPassword(userUpdate.password);
                }

                if  (password == '' || password == ' ') {
                    userUpdate.password = pass;
                }
                

                const saveUserUpdate = await userUpdate.save();

                const token: string = jwt.sign({ _id: saveUserUpdate._id }, process.env['TOKEN_SECRET'] || '', {
                    expiresIn: 60 * 60 * 24
                });
                
                res.status(200).json( { 'token': token } );
                return;
            }


            // const userUpdate: UserI = await User.findByIdAndUpdate(_id, { username, email, password });
            // userUpdate.password = await userUpdate.encrypPassword(userUpdate.password);
            // const saveUserUpdate = await userUpdate.save();

            const userUpdate: UserI = await User.findById(_id);
            userUpdate.username = username;
            userUpdate.email = email;
            const pass = userUpdate.password;

            if (password !== '' || password !== ' ') {
                userUpdate.password = password;
                userUpdate.password = await userUpdate.encrypPassword(userUpdate.password);
            }

            if  (password == '' || password == ' ') {
                userUpdate.password = pass;
            }

            const saveUserUpdate = await userUpdate.save();

            const token: string = jwt.sign({ _id: saveUserUpdate._id }, process.env['TOKEN_SECRET'] || '', {
                expiresIn: 60 * 60 * 24
            });
            
            res.status(200).json( { 'token': token } );
  
        
        } catch (err) {
            res.status(400).json(err);
        }


    }


    public async iconProfile (req: Request, res: Response): Promise<any> {

        const { _id, iconProfile } = req.body;
        
        const getUser: UserI = await User.findById(_id);

        getUser.iconProfile = iconProfile;

        await getUser.save();

        res.status(200).json({message: 'Icono actualizado con exito'});

    }


    public async recoverPassword (req: Request, res: Response): Promise<any> {

        const { correo, code } = req.body;

        const emailExists = await User.findOne({ email: correo });
        if (emailExists == null) return res.status(400).json({emailError: 'Este correo electrónico no esta registrado'});

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "cuentaparatest72@gmail.com",
                pass: "ukpjmpxkoxvxzehq"
            }
        });

        const mailOptions = {
            from: "francispinales94@gmail.com",
            to: `${correo}`,
            subject: `${code} es el código de recuperación de tu cuenta`,
            html: `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <title>${code} es el código de recuperación de tu cuenta</title>
                <link rel="preconnect" href="https://fonts.gstatic.com">
                <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Open+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">
                <style>
                    .contenedor {
                        height: 100vh;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
            
                    .brand {
                        color: #e8654a;
                        font-family: 'Fredoka One', cursive;
                    }
            
                    .brand span {
                        color: #0278ae;
                    }
            
                    hr {
                        border: 1px solid rgba(128, 128, 128, 0.199);;
                    }
            
                    .code {
                        border: 1px solid #e8654a;
                        width: 20%;
                        text-align: center;
                        padding: 2px 18px;
                        border-radius: 7px;
                        background-color: #e8644a0e;
                        margin-top: 25px;
                    }
            
                    .code p {
                        font-family: 'Open Sans', sans-serif;
                        font-weight: 600;
                        letter-spacing: 2px;
                        color: #000;
                    }
            
                    .text p {
                        font-family: 'Open Sans', sans-serif;
                        font-weight: 400;
                        font-size: 15px;
                        color: #222222;
                    }
            
                    .foo {
                        font-family: 'Open Sans', sans-serif;
                        color: rgba(128, 128, 128, 0.801);
                        font-weight: 400;
                        font-size: 13px;
                    }
            
                    @media (max-width: 626px) {
                        .contenedor {
                            padding: 5px;
                        }
            
                        .code {
                            width: 30%;
                        }
                    }
                </style>
            </head>
            <body>
                
                <div class="contenedor">
            
                    <div>
            
                        <div class="brand">
                            <img width="150px" src="https://res.cloudinary.com/dqvcp9dby/image/upload/v1617628970/Express_Notes-removebg-preview_hxx902.png">
                        </div>
            
                        <hr style="margin-bottom: 25px;">
            
                        <div class="text">
                            <p>Hola, ${emailExists.username}:</p>
                        </div>
            
                        <div class="text">
                            <p>Recibimos una solicitud para restablecer tu contraseña de Express Notes.<br style="margin-bottom: 6px;">Ingresa el siguiente código para restablecer la contraseña:</p>
                        </div>
            
                        <div class="code">
                            <p>${code}</p>
                        </div>
            
                        <hr style="margin-top: 35px;">
            
                        <p class="foo">Se envió este mensaje a ${correo} por pedido tuyo.</p>
            
                    </div>
            
                </div>
            
            </body>
            </html>`
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).json({error: err.message});
            } else {
                res.status(200).json({message: 'enviado con exito', email: emailExists.username, _id: emailExists._id});
            }
        });


    }

}



const auth = new AuthController;
export default auth
