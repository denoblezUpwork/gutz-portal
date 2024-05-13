require ('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const HttpError = require('../Backend/helper/error');
const pruRoutes = require('./routes/registration');
const userRoutes = require('./routes/user');
/* express app */
const app = express();

/* middleware that read json*/
app.use(express.json())



app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
})

/* Route */
app.use('/portal/api',  pruRoutes);
app.use('/portal/api/user',  userRoutes)

/* Error handler on not existing route or invalid */
app.use((req, res, next) =>{
    const error = new HttpError('Could not find this route.', 404)
    throw error
})

app.use((error, req, res, next) => {
    if(res.headerSent) {
        return(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'Unknonw Error occurred'})
})


/* Connect to DB */
mongoose.connect(process.env.DBCONN)
    .then(() => {
    
    })
    .catch((error) => {
        console.log(error)
    })

/* listen for request */
app.listen(process.env.PORT, () => {
    console.log('connected to db & listening on port', process.env.PORT)
});