import User from "../model/UserModel.js";
import  bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const getUsers = async(req,res) => {
    try {
        const response = await User.findAll({
            attributes:['id','name','email']
        });
        res.status(200).json(response);
    }catch(error){
        console.log(error.message);
    }
}

export const getUsersById = async(req,res) => {
    try {
        const response = await User.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    }catch(error){
        console.log(error.message);
    }
}

export const createUser = async(req,res) => {
    try {
        await User.create(req.body);
        res.status(201).json({msg : "User Created"});
    }catch(error){
        console.log(error.message);
    }
}

export const updateUser = async(req,res) => {
    try {
        await User.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(201).json({msg : "User Updated"});
    }catch(error){
        console.log(error.message);
    }
}

export const deleteUser = async(req,res) => {
    try {
        await User.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(201).json({msg : "User Deleted"});
    }catch(error){
        console.log(error.message);
    }
}

export const Register = async(req, res) => {
    const { name, email ,password, confirmPassword ,gender} = req.body;
    if(password !== confirmPassword )return res.status(400).json({msg: "Password dan Confirm Password tidak cocok "});

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        await User.create({
            name:name,
            email:email,
            password: hashPassword,
            gender:gender
        });
        res.json({msg: "register Berhasil"});
    } catch (error) {
        console.log(error);
    }
}

export const Login = async(req,res) => {
    try {
        const response = await User.findAll({
            where:{
                email: req.body.email
            }
        });


        const match = await bcrypt.compare(req.body.password, response[0].password);
        if(!match) return res.status(400).json({msg:"Wrong  Password"});
        const userId = response[0].id;
        const name = response[0].name;
        const email = response[0].email;
        // const gender = response[0].gender;

        const accessToken = jwt.sign({userId, name , email},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId, name , email},process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });

        await User.update({refresh_token: refreshToken},{
            where : {
                id : userId
            }
        });

        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge : 24 * 60 * 60 * 1000
            //secure:true untuk https
        });
        res.json({accessToken});
    } catch (error) {
        res.status(404).json({msg: "Email tidak ditemukan"});
        
    
    }
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);
        //mencari user yang memiliki refresh token yang sama dengan yang ada di cookie 
        const user = await User.findAll({
            where : {
                refresh_token : refreshToken
            }
        });

        if(!user[0]) return res.sendStatus(204);
        const userId = user[0].id;
        await User.update({refresh_token: null},{
            where:{
                id:userId
            }
        });
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
}
