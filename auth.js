var bcrypt = require('bcrypt-nodejs')
var jwt = require('jwt-simple')
var express = require('express')
var router = express.Router()
var User = require('./models/User.js')


 router.post( '/register',(req,res)=>{
  var userData = req.body
  var user = new User(userData);
  user.save((err,result)=>{
    if(err){
       console.log('error')
    }
    res.sendStatus(200)
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

    var payload = {sub:user._id}
    var token = jwt.encode(payload,'rengokantai')
  
    //res.status(200).send({token:token});
    res.status(200).send({token:token});
  })

  // if(loginData.pwd!=user.pwd){
  //   return res.status(401).send({message:'user invalid'})
  // }
  
})
module.exports=router