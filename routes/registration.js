const express = require('express');

const router = express.Router()
const Controller = require('../controllers/newClientRegistration');

//Get All Client Records
router.get('/', Controller.getAllClient);
//Get a Single Client Record
router.get('/:email', Controller.getByEmail);
//Post a new client record
router.post('/', Controller.addPruClient);
//delete a new client record
router.delete('/:email', Controller.deleteByEmail);
//update a new client record
router.patch('/:email', Controller.updateByEmail)
//update password
router.put('/clients/:email/password', Controller.updatePassword)

module.exports = router;