require ('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const pruRoutes = require('./routes/registration');

/* express app */
const app = express();

/* middleware that read json*/
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
})

/* Route */
app.use('/portal/api',  pruRoutes)

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