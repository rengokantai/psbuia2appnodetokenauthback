var bcrypt = require('bcrypt-nodejs')
var jwt = require('jwt-simple')
var express = require('express')
var router = express.Router()
var User = require('./models/User.js')


 router.post( '/register',(req,res)=>{
  var userData = req.body
  var user = new User(userData);
  user.save((err,newUser)=>{
    if(err){
       return res.status(500).send({message:'error saving user'})
    }
    //res.sendStatus(200)
        var payload = {sub:newUser._id}
    var token = jwt.encode(payload,'rengokantai')
    res.status(200).send({token:token});
  })
})
 router.post( '/login',async(req,res)=>{
  var loginData = req.body
  var user = await User.findOne({
    email:loginData.email
  })
  if(!user){
    return res.status(401).send({message:'user invalid'})
  }

  bcrypt.compare(loginData.pwd,user.pwd,(err,isMatch)=>{
    if(!isMatch)
      return res.status(401).send({message:'wrong pass'})
    
    createSendToken(res)

  })

  // if(loginData.pwd!=user.pwd){
  //   return res.status(401).send({message:'user invalid'})
  // }
  
})


function createSendToken(res){
    var payload = {sub:user._id}
    var token = jwt.encode(payload,'rengokantai')
  
    //res.status(200).send({token:token});
    res.status(200).send({token:token});
}


var auth = {
  router,
  checkAuthenticated:(req,res,next)=>{
  if(!req.header('authorization')){
    return res.status(401).send({message:'Unauthorized. Missing Auth Header'})
  }
    var token = req.header('authorization').split(' ')[1]

    var payload = jwt.decode(token,'rengokantai')

    if(!payload){
      return res.status(401).send({message:'header invalid'})
    }

    req.userId = payload.sub

    next()
    console.log(token)
}

}
module.exports=auth