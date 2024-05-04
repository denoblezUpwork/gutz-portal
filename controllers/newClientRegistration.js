var TAG = '[GUTZ-PORTAL-INSURANCE]'

const { default: mongoose } = require('mongoose');
const Logger = require('../helper/logger')
const clientsInformation = require('../models/clientRecords');
const {v4: uuidv4} = require('uuid');
const uuid = uuidv4();


/* Add new client */
exports.addPruClient = async (req, res) => {
    var ACTION = '[NEW-CLIENT-REGISTRATION]'

    const firstArray = req.body.personalInformation.firstName[0];
    const secondArray = req.body.personalInformation.middleName[0];
    const user = firstArray + secondArray + req.body.personalInformation.lastName.split(" ").join("");
    const capitallize = user.toUpperCase();
    const username = capitallize

    try {
        const newClient = new clientsInformation ({
            username,
            id: uuid,
            "personalInformation": {
                "firstName": req.body.personalInformation.firstName,
                "middleName": req.body.personalInformation.middleName,
                "lastName": req.body.personalInformation.lastName,
                "birthDate": req.body.personalInformation.birthDate,
                "mobileNumber": req.body.personalInformation.mobileNumber,
                "emailAddress": req.body.personalInformation.emailAddress,
                "address": req.body.personalInformation.address,
                "civilStatus": req.body.personalInformation.civilStatus,
                "placeOfBirth": req.body.personalInformation.placeOfBirth
            },
            "workInformation": {
                "idType": req.body.workInformation.idType,
                "idNumber": req.body.workInformation.idNumber,
                "occupation": req.body.workInformation.occupation,
                "natureOfWork": req.body.workInformation.natureOfWork,
                "employerName": req.body.workInformation.employerName,
                "companyAddress": req.body.workInformation.companyAddress,
                "zipCode": req.body.workInformation.zipCode,
            },
            "familyInformation": {
                "nameOfFather": req.body.familyInformation.nameOfFather,
                "ageofFather": req.body.familyInformation.ageofFather,
                "nameOfMother": req.body.familyInformation.nameOfMother,
                "ageOfMother": req.body.familyInformation.ageOfMother,
            },
            "beneficiary": req.body.beneficiary
        })
        /* Save new client Data */
        const savedData = await newClient.save();
        let resp = {
                message: "Successfully save new client" + " " + capitallize,
                uuid: uuid,
                trace: 'GUTZ-PRU'
        }
        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Successfuly save new client(s) record(s)."});
        res.status(201).json(resp)
    }catch(error){
        Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', {message: error.message});
        res.status(500).json({ error: error.message });
    }
}
/* Get All Client*/
exports.getAllClient = async (req, res) => {
    var ACTION  = '[RETRIEVE-ALL-CLIENTS-RECORDS]'
        
    try{
        const getAllClients = await clientsInformation.find({}).sort({createdAt: -1})

        if(getAllClients.length <= 0){
            Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "No Record(s) found"});
            var response = {
                'message': 'No Record(s) Found on our database.',
                'uuid': uuid,
                'trace': 'GUTZ-PRU'
            }
            res.status(404).json(response)
        }
        let records = getAllClients;
        let totalRecords = records.length;
        let resp = records.map(record => {
            let newRec = {
                id :record.id,
                username : record.username,
                personalInformation: record.personalInformation,
                workInformation: record.workInformation,
                familyInformation: record.familyInformation,
                beneficiary: record.beneficiary
            }
            return newRec
        })
        var response = {
            records: resp,
            totalRecords: totalRecords
        }
        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', {message: "Successfully Retrieve all clients records"});
        res.status(200).json(response);
    }catch(error){
        Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', {message: error.message});
        res.status(500).json({ error: error.message });
    }
}  
/* Get Client record by username*/
exports.getById = async (req, res) => {
    var ACTION = '[GET-CLIENT-RECORD-BY-ID]';

    const { id } = req.params;
    try {
        const getClientById = await clientsInformation.findOne({ id });
        if (!getClientById) {
            Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "No such record(s) found." });
            return res.status(404).json({ message: 'No such record(s) found' });
        }
        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Successfully retrieve record(s)." });
        // Construct response object directly from getClientByUsername
        const response = {
            records: {
                id: getClientById.id,
                username: getClientById.username,
                personalInformation: getClientById.personalInformation
            }
        };
        res.status(200).json(response);
    } catch (error) {
        Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', {message: error.message});
        res.status(500).json({ error: error.message });
    }
};
/* Delete Client by username*/
exports.deleteById = async (req, res) => {
    var ACTION = '[DELETE-CLIENT-RECORD]'
    try {
        const { id } = req.params;

        // Delete document by username
        const deletedUser = await clientsInformation.findOneAndDelete({ id });

        if (!deletedUser) {
            Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "No such record(s) found." });
            return res.status(404).json({ message: 'No such user found' });
        }
        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Successfully deleted user" });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', {message: error.message});
        res.status(500).json({ error: error.message });
    }
};

/*Update by Id*/
exports.updateById = async (req, res) => {
    var ACTION = '[UPDATE-CLIENT-INFORMATION]';

    try {
        const { username } = req.params;
        const updateData = req.body;

       // Find document by username and update
        const updateUser = await clientsInformation.findOneAndUpdate({ username }, updateData, { new: true });

        if (!updateUser) {
            return res.status(404).json({ message: 'Client record(s) not found' });
        }

        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Successfully updated user" });
        res.status(200).json({ message: 'Successfully update record(s)'});
    } catch (error) {
        Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: error.message });
        res.status(500).json({ error: error.message });
    }
};


