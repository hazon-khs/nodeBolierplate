const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default:0
    },
    image:{
        type:String,
    },
    token:{
        type:String,
    },
    tokenExp:{
        type:Number,
    }
})

userSchema.pre('save', function(next){

    var user = this;

    if(user.isModified('password')){

        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
            
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword
    console.log(`plainPassword : ${plainPassword} , thisPassword : ${this.password}`);
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        return cb(null, isMatch);
    });   
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'anikkaToken');

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    });
}

const User = mongoose.model('User', userSchema);

module.exports = { User }