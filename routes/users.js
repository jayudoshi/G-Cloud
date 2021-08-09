const express = require('express');
const {users, files} = require('../firebase')

const bcrypt = require('bcrypt');
const { getToken, verifyUser } = require('../authenticate');
const cors = require('../cors');
const saltRounds = 10;

const userRouter = express.Router();

userRouter.options('/' , cors.cors , (req,res,next) => {res.sendStatus("200")});
userRouter.get('/' , cors.corsWithOpts , verifyUser , async(req,res,next) => {
    const user = (await users.doc(req.user.username).get()).data()
    console.log(user)
    if(user){
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.send({status: true , status:"Request Successfull" , user:user});
    }
})

userRouter.options('/register' , cors.cors , (req,res,next) => {res.sendStatus("200")});
userRouter.post('/register' , cors.corsWithOpts ,async (req,res,next) => {
    console.log(req.body)
    const snapshot = await users.where('username', '==', req.body.username).get();
    if (snapshot.empty) {
        await users.doc(req.body.username).set({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, saltRounds),
            fname: req.body.fname,
            lname: req.body.lname,
        })
        await files.doc(req.body.username).set({
            username:req.body.username
        })
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.send({success:true , status:"Registered Successfully" , msg:"User Registered Sucessfully !!"});
    }else if(!snapshot.empty){
        res.statusCode = 403;
        res.setHeader('Content-Type','application/json');
        res.send({success:false , status:"UserExistsError" , err:"An User with that username already exists !!"});
    }
})

userRouter.options('/login' , cors.cors , (req,res,next) => {res.sendStatus("200")});
userRouter.post('/login' , cors.corsWithOpts , async(req,res,next) => {
    const user = (await users.doc(req.body.username).get()).data()
    if(!user){
        res.statusCode = 401;
        res.setHeader('Content-Type','application/jsom');
        res.send({success:false , status:"IncorrectUsernameError" , err:"An User with that username does not exists !!"});
    }else{
        const isAuth = await bcrypt.compareSync(req.body.password, user.password);
        if(!isAuth){
            res.statusCode = 401;
            res.setHeader('Content-Type','application/jsom');
            res.send({success:false , status:"IncorrectPasswordError" , err:"Entered password is invlaid !!"});
        }else{
            const token = getToken(user.username)
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.send({success:true , status:"Logged In" , msg:"Logging In!!" , user:user , token:token});
        }
    }
})

module.exports = userRouter;