var TAG = '[GUTZ-PORTAL-INSURANCE]'

const { default: mongoose } = require('mongoose');
const Logger = require('../helper/logger')
const clientsInformation = require('../models/clientRecords');
const User = require('../models/userRecord');

const {v4: uuidv4} = require('uuid');
const uuid = uuidv4();


exports.login = async(req, res) => {
    var ACTION = '[GUTZ-PORTAL-LOGIN]'
    
    const { email, password } = req.body
    try{
        
        const identifiedUser = await clientsInformation.findOne({"personalInformation.contactInformation.emailAddress": email});

        if(!identifiedUser || identifiedUser.password !== password){
            Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Invalid credentials" });
            res.status(401).json({message: 'Could not identify user, email or password is invalid.'})
        }
        res.json({message: 'Logged In'})
    }catch(error){
        Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.signupUser = async (req, res) => {
    var ACTION ='[USER-SIGN-UP]'
    
    const {email, password} = req.body

    try {
        const user = await User.signup(email, password)
        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Success sign up new client" });
        res.status(200).json({email, user})
    } catch (error) {
        Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "error" });
        res.status(400).json({error: error.message})
    }
}




