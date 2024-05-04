const express = require('express');

const router = express.Router()
const Controller = require('../controllers/newClientRegistration');

//Get All Client Records
router.get('/', Controller.getAllClient);
//Get a Single Client Record
router.get('/:id', Controller.getById);
//Post a new client record
router.post('/', Controller.addPruClient);
//delete a new client record
router.delete('/:id', Controller.deleteById);
//update a new client record
router.patch('/:username', Controller.updateById)

module.exports = router;