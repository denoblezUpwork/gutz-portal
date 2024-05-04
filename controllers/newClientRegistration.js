var TAG = '[GUTZ-PORTAL-INSURANCE]'

const { default: mongoose } = require('mongoose');
const Logger = require('../helper/logger')
const clientsInformation = require('../models/clientRecords');
const {v4: uuidv4} = require('uuid');
const uuid = uuidv4();


//insert new pru client record
exports.addPruClient = async (req, res) => {
    var ACTION = '[NEW-CLIENT-REGISTRATION]'

    const firstArray = req.body.personalInformation.firstName[0];
    const secondArray = req.body.personalInformation.middleName[0];
    const user = firstArray+secondArray+ req.body.personalInformation.lastName.split(" ").join("");
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
        console.log(req.body.beneficiary)
        /* Save new client Data */
        const savedData = await newClient.save();
        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Successfuly save new client(s) record(s)."});
        let resp = {
                message: "Successfully save new client" + " " + capitallize,
                uuid: uuid,
                trace: 'GUTZ-PRU'
        }
        res.status(201).json(resp)
    }catch(error){
        console.error('Error saving data:', error);
    }
}

/* Get All Client*/
exports.getAllClient = async (req, res) => {
        var ACTION  = '[RETRIEVE-ALL-CLIENTS-RECORDS]'

        const getAllClients = await clientsInformation.find({}).sort({createdAt: -1})
        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', {message: "Successfully Retrieve all clients records"});
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
        res.status(200).json(response);
}  

/* Get Client record by username*/
exports.getByUsername = async (req, res) => {
    var ACTION = '[GET-CLIENT-RECORD-BY-USERNAME]';

    const { username } = req.params;
    try {
        const getClientByUsername = await clientsInformation.findOne({ username });
        if (!getClientByUsername) {
            Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "No such record(s) found." });
            return res.status(404).json({ message: 'No such record(s) found' });
        }
        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Successfully retrieve record(s)." });
        // Construct response object directly from getClientByUsername
        const response = {
            records: {
                id: getClientByUsername.id,
                username: getClientByUsername.username,
                personalInformation: getClientByUsername.personalInformation,
                workInformation: getClientByUsername.workInformation,
                familyInformation: getClientByUsername.familyInformation,
                beneficiary: getClientByUsername.beneficiary
            }
        };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching client by username:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

