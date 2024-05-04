const express = require('express');

const router = express.Router()
const Controller = require('../controllers/newClientRegistration');

//Get All Client Records
router.get('/', Controller.getAllClient);

//Get a Single Client Record
router.get('/:username', Controller.getByUsername);


//Post a new client record
router.post('/', Controller.addPruClient);

//delete a new client record
router.delete('/:id', (req, res) => {
    res.json({msg: 'delete Client'})
});

//update a new client record
router.patch('/:id', (req, res) => {
    res.json({msg: 'Update  Client'})
})

module.exports = router;