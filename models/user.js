const mongoose  =   require('mongoose');
const bcrypt    =   require('bcrypt');
const saltRounds = 10;

const userSchema    =   new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    accessToken:{
        type: String,
        default: 'abc'
    },
    isTokenValid:{
        type: Boolean,
        default:false
    }
},{
    timestamps: true
});

userSchema.methods.generateHash =  function(password){
    try {
        const hash = bcrypt.hashSync(password, saltRounds);
        return hash;
    } catch (error) {
        console.log(error);
    }
}
userSchema.methods.comparePasswords =   function(password,hashedPassword){
    try {
        return bcrypt.compareSync(password,hashedPassword);
    } catch (error) {
        console.log(error);
    }
}
const User  =   mongoose.model('User',userSchema);

module.exports  =   User;