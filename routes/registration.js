const express = require('express');

const router = express.Router()

//Get All Client Records
router.get('/', (req, res) => {
    res.json({msg: 'Get all records.'})
});

//Get a Single Client Record
router.get('/:id', (req, res) => {
    res.json({msg: 'Get Single record'})
});


//Post a new client record
router.post('/', (req, res) => {
    res.json({msg: 'Register new Client'})
});

//delete a new client record
router.delete('/:id', (req, res) => {
    res.json({msg: 'delete Client'})
});

//update a new client record
router.patch('/:id', (req, res) => {
    res.json({msg: 'Update  Client'})
})

module.exports = router;