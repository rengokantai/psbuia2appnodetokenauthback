var express = require('express')
var cors = require('cors')
var app = express()

var posts = [
  {message:'ke'}
]

app.use(cors())

app.get('/posts',(req,res)=>{
  res.send(posts)
})
import { ApiService} from './api.service';

app.listen(3000)