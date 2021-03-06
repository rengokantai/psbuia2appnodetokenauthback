var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var jwt = require('jwt-simple')
var app = express()
//var bcrypt = require('bcrypt-nodejs')

var User = require('./models/User.js')
var Post= require('./models/Post.js')
var auth = require('./auth.js')
mongoose.Promise = Promise

var posts = [
  {message:'ke'}
]

app.use(cors())
app.use(bodyParser.json())

function checkAuthenticated(req,res,next){
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

app.get('/posts/:id',async(req,res)=>{
  var author=req.params.id
  var posts = await Post.find({author})
  res.send(posts)
})

app.post('/post',auth.checkAuthenticated,(req,res)=>{
  var postData = req.body
  postData.author = req.userId
  var post = new Post(postData)
  post.save((err,result)=>{
    if(err){
       console.error('error')
       return res.status(500).send({message:'error'})
    }
    res.sendStatus(200)
  })
})

app.get('/users',auth.checkAuthenticated,async (req,res)=>{
  try{
  console.log(req.userId)
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

//app.post('/register',auth.register)

//app.post('/login',auth.login)

mongoose.connect('mongodb://root:root@ds155325.mlab.com:55325/psbuia2appnodetokenauthback',{useMongoClient:true},(err)=>{
  if(!err){
    console.log('success')
  }
})
app.use('/auth',auth.router)
app.listen(3000)