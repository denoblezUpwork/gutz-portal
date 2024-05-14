const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4(), // Generate UUID for new documents
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})



/* Static sign up method*/
userSchema.statics.signup = async function(email, password) {

    /* Validatio */
    if(!email || !password){
        throw Error('All field(s) must be filled.')
    }
    if(!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('must provide a strong password')
    }

    try {
        const exists = await this.findOne({ email });
        if (exists) {
            throw new Error('Email already in use');
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await this.create({ email, password: hash });
        return user;
        
    } catch (error) {
        throw error;
    }
};

/* Statuc Schema user login method */
userSchema.statics.login = async function ( email, password){

    if(!email || !password){
        throw Error('All Field(s) must be filled')
    }

    const user = await this.findOne({ email })
    if(!user){
        throw Error('Incorrect Email')
    }

    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error('Incorrect Password')
    }

    return user


}



module.exports = mongoose.model('User', userSchema)
