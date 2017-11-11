var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var app = express()
//var bcrypt = require('bcrypt-nodejs')

var User = require('./models/User.js')
var auth = require('./auth.js')
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

//app.post('/register',auth.register)

//app.post('/login',auth.login)

mongoose.connect('mongodb://root:root@ds155325.mlab.com:55325/psbuia2appnodetokenauthback',{useMongoClient:true},(err)=>{
  if(!err){
    console.log('success')
  }
})
app.use('/auth',auth)
app.listen(3000)