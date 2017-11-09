var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()

var User = require('./models/User.js')

var posts = [
  {message:'ke'}
]

app.use(cors())
app.use(bodyParser.json())

app.get('/posts',(req,res)=>{
  res.send(posts)
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

mongoose.connect('mongodb://root:root@ds155325.mlab.com:55325/psbuia2appnodetokenauthback',{useMongoClient:true},(err)=>{
  if(!err){
    console.log('success')
  }
})

app.listen(3000)