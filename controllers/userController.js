var TAG = '[GUTZ-PORTAL-INSURANCE]'

const { default: mongoose } = require('mongoose');
const Logger = require('../helper/logger')
const jwt = require('jsonwebtoken');

const clientsInformation = require('../models/clientRecords');
const User = require('../models/userRecord');

const {v4: uuidv4} = require('uuid');
const uuid = uuidv4();

/* Create Token with secret */
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRETKEY, { expiresIn: '1d'})
}


exports.loginUser = async(req, res) => {
    var ACTION = '[GUTZ-PORTAL-LOGIN]'
    
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        /* Create token */
        const token = createToken(user._id)

        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Login success" });
        res.status(200).json({email, token})
    } catch (error) {
        Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "error" });
        res.status(400).json({error: error.message})
    }
}

exports.signupUser = async (req, res) => {
    var ACTION ='[USER-SIGN-UP]'

    const {email, password} = req.body

    try {
        const user = await User.signup(email, password)
        /* Create token */
        const token = createToken(user._id)

        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Success sign up new client" });
        res.status(200).json({email, token})
    } catch (error) {
        Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "error" });
        res.status(400).json({error: error.message})
    }
}




