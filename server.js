var express = require('express')
var app = express()

var posts = [
  {message:'ke'}
]

app.get('/posts',(req,res)=>{
  res.send(posts)
})


app.listen(3000)