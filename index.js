const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://anikka:anikka123@cluster0.8dzsg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>{
    console.log("MongoDB Connected Success!!")
}).catch(err=>{
    console.log(err)
})

app.get("/", (req, res) => res.send("Hello world!!"))
app.listen(port, () => console.log(`Example app listing port : ${port}!`))