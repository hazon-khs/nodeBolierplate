const express = require('express');
const app = express();
const port = 3000;
const { User } = require("./models/User");
const cookie = require('cookie-parser');

app.use(express.urlencoded({extends:true}));
app.use(express.json());
app.use(cookie());
const config = require('./config/key');

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>{
    console.log("MongoDB Connected Success!!")
}).catch(err=>{
    console.log(err)
});

app.get("/", (req, res) => res.send("Hello world!! Come On!!"));
app.post("/register", (req, res)=>{
    //회원가입할때 필요한 정보들을 클라이언트에서 가져오면
    //그것들을 데이터 베이스에 넣어 준다.

    const user = new User(req.body);

    user.save((err, doc)=>{
        if(err) return res.json({success:false, err})
        return res.status(200).json({success:true})
    });

});

app.post('/login', (req, res)=>{

    console.log(req.body);
    //요청된 이메일을 데이터 베이스에서 찾는다.
    User.findOne({email:req.body.email}, (err, userInfo)=>{
       if(!userInfo) return res.json({loginSuccess:false,message:"유저가 존재하지 않습니다."}); 

            //비밀번호가 동일한지 체크한다.
            userInfo.comparePassword(req.body.password, (err, isMatch)=>{
                console.log(isMatch);
                if(!isMatch) return res.json({loginSuccess:false, message:"비밀번호가 일치하지 않습니다."});

                userInfo.generateToken((err, user)=>{
                    if(err) return res.status(400).send(err);

                    //생성된 토큰을 저장합니다.
                    res.cookie("x_auth", user.token)
                    .status(200)
                    .json({loginSuccess:true, userId: user._id});
                });
            });
    });

});

app.listen(port, () => console.log(`Example app listing port : ${port}!`));