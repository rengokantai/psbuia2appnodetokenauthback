var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var jwt = require('jwt-simple')
var app = express()
var bcrypt = require('bcrypt-nodejs')

var User = require('./models/User.js')

mongoose.Promise = Promise

var posts = [
  {message:'ke'}
]

app.use(cors())
app.use(bodyParser.json())

app.get('/posts',(req,res)=>{
  res.send(posts)
})

app.get('/users',async (req,res)=>{
  try{
  var users = await User.find({},'-pwd -__v')
  res.send(users)
  } catch(error){
    console.error(error)
    res.sendStatus(500)
  }
})

app.get('/profile/:id',async (req,res)=>{
  try{
  var user = await User.findById(req.params.id,'-pwd -__v')
  res.send(user)
  } catch(error){
    console.error(error)
    res.sendStatus(500)
  }
})

app.post('/register',(req,res)=>{
  var userData = req.body
  var user = new User(userData);
  user.save((err,result)=>{
    if(err){
       console.log('error')
    }
    res.sendStatus(200)
  })
  
})

app.post('/login',async(req,res)=>{
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

    var payload = {}
    var token = jwt.encode(payload,'rengokantai')
  
    //res.status(200).send({token:token});
    res.status(200).send({message:'ok'});
  })

  // if(loginData.pwd!=user.pwd){
  //   return res.status(401).send({message:'user invalid'})
  // }
  
})

mongoose.connect('mongodb://root:root@ds155325.mlab.com:55325/psbuia2appnodetokenauthback',{useMongoClient:true},(err)=>{
  if(!err){
    console.log('success')
  }
})

app.listen(3000)