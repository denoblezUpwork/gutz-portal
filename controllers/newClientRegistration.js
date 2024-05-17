var TAG = '[GUTZ-PORTAL-INSURANCE]'

const { default: mongoose } = require('mongoose');
const Logger = require('../helper/logger')
const clientsInformation = require('../models/clientRecords');
const {v4: uuidv4} = require('uuid');
const uuid = uuidv4();


exports.addPruClient = async (req, res) => {
    var ACTION = '[NEW-CLIENT-REGISTRATION]';
    const uuid = req.headers['x-request-id']; // Assuming you have a unique request ID

    try {
        var email = req.body.personalInformation.contactInformation.emailAddress;

        // Generate password
        function generatePassword(length = 8) {
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
            let password = "";
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }
            return password;
        }
        var newPassword = generatePassword(20); // Change to generatePassword(20) instead of generatePassword[20]

        // Check if the email already exists
        let existingClient = await clientsInformation.findOne({ "personalInformation.contactInformation.emailAddress": email });
        if (existingClient) {
            // If email exists, respond with an error message
            let resp = {
                code: "F",
                message: "Client with the same email already exists.",
                uuid: uuid,
                trace: 'GUTZ-PRU'
            };
            Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Client with the same email already exists." });
            return res.status(400).json(resp);
        }

        // Custom validation for beneficiary age
        const beneficiaries = req.body.insuranceCoverageDetails.beneficiaries;
        let hasUnderageBeneficiary = false;

        if (beneficiaries && beneficiaries.length > 0) {
            const now = new Date();
            const cutoffDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());

            for (const beneficiary of beneficiaries) {
                const dob = new Date(beneficiary.dateOfBirth);
                if (dob > cutoffDate) {
                    hasUnderageBeneficiary = true;
                    console.warn(`Beneficiary with date of birth ${beneficiary.dateOfBirth} is below 18 years old.`);
                    break; // Stop the loop once an underage beneficiary is found
                }
            }
        }

        // Construct new client object
        const newClient = new clientsInformation({
            "personalInformation": {
                "fullName": req.body.personalInformation.fullName,
                "dateOfBirth": req.body.personalInformation.dateOfBirth,
                "gender": req.body.personalInformation.gender,
                "maritalStatus": req.body.personalInformation.maritalStatus,
                "contactInformation": {
                    "address": req.body.personalInformation.contactInformation.address,
                    "city": req.body.personalInformation.contactInformation.city,
                    "stateProvince": req.body.personalInformation.contactInformation.stateProvince,
                    "zipPostalCode": req.body.personalInformation.contactInformation.zipPostalCode,
                    "emailAddress": req.body.personalInformation.contactInformation.emailAddress,
                    "phoneNumber": req.body.personalInformation.contactInformation.phoneNumber
                }
            },
            "employmentInformation": {
                "employmentStatus": req.body.employmentInformation.employmentStatus,
                "employer": req.body.employmentInformation.employer,
                "occupation": req.body.employmentInformation.occupation,
            },
            "insuranceCoverageDetails": {
                "sharePercentage": req.body.insuranceCoverageDetails.sharePercentage,
                "beneficiaries": req.body.insuranceCoverageDetails.beneficiaries
            },
            "medicalHistory": {
                "smoke": req.body.medicalHistory.smoke,
                "preExistingConditions": req.body.medicalHistory.preExistingConditions,
                "surgeriesInPast5Years": req.body.medicalHistory.surgeriesInPast5Years,
                "specificConditions": req.body.medicalHistory.specificConditions,
                "specificSurgeries": req.body.medicalHistory.specificSurgeries
            },
            "password": newPassword
        });

        /* Save new client Data */
        const savedData = await newClient.save();

        let resp;
        if (hasUnderageBeneficiary) {
            resp = {
                message: "Successfully save new client, Hi! " + email + ". Your password is " + newPassword,
                details: {
                    message: "Warning: Below 18 years old beneficiary will get all the benefits until they turn 18 years old.",
                },
                uuid: uuid,
                trace: 'INSURANCE'
            };
        } else {
            resp = {
                message: "Successfully save new client, Hi! " + email + ". Your password is " + newPassword,
                uuid: uuid,
                trace: 'INSURANCE'
            };
        }

        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Successfully save new client(s) record(s)." });
        res.status(201).json(resp);
    } catch (error) {
        console.log('=====', error)
        /* Handle Error */
        const errMsg = {
            "code": "F",
            "description": "An error occurred while processing your request. Please try again later.",
            "details": {
                "message": error.message,
                "uuid": uuid
            }
        }
        res.status(500).json(errMsg);
    }
}




/* Get All Client*/
exports.getAllClient = async (req, res) => {
    var ACTION = '[RETRIEVE-ALL-CLIENTS-RECORDS]';
    
    try {
        const getAllClients = await clientsInformation.find({}).sort({ createdAt: -1 });

        if (getAllClients.length <= 0) {
            const response = {
                message: 'No Record(s) Found on our database.',
                uuid: uuid, // Make sure uuid is defined
                trace: 'GUTZ-PRU'
            };
            Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: response.message });
            return res.status(404).json(response);
        }

        const totalRecords = getAllClients.length;
        const records = getAllClients.map(record => ({
            "personalInformation": {
                "id": record._id,
                "fullName": record.personalInformation.fullName,
                "dateOfBirth": record.personalInformation.dateOfBirth,
                "gender": record.personalInformation.gender,
                "maritalStatus": record.personalInformation.maritalStatus,
                "contactInformation": {
                    "address": record.personalInformation.contactInformation.address,
                    "city": record.personalInformation.contactInformation.city,
                    "stateProvince": record.personalInformation.contactInformation.stateProvince,
                    "zipPostalCode": record.personalInformation.contactInformation.zipPostalCode,
                    "emailAddress": record.personalInformation.contactInformation.emailAddress,
                    "phoneNumber": record.personalInformation.contactInformation.phoneNumber
                }
            },
            "employmentInformation": record.employmentInformation,
            "insuranceCoverageDetails": record.insuranceCoverageDetails,
            "medicalHistory": record.medicalHistory
        }));

        const response = {
            records: records,
            totalRecords: totalRecords        
        };
        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Successfully Retrieve all clients records" });
        return res.status(200).json(response);
    } catch (error) {
        Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: error.message });
        const errMsg = {
            code: "F",
            description: "An error occurred while processing your request. Please try again later.",
            details: {
                message: error.message,
                uuid: uuid // Make sure uuid is defined
            }
        };
        return res.status(500).json(errMsg);
    }
};

/* Get Client record by username*/
exports.getByEmail = async (req, res) => {
    var ACTION = '[GET-CLIENT-RECORD-BY-ID]';

    const { email } = req.params;
    try {
        const getClientByEmail = await clientsInformation.findOne({ "personalInformation.contactInformation.emailAddress": email });
        if (!getClientByEmail) {
            Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "No such record(s) found." });
            return res.status(404).json({ message: 'No such record(s) found' });
        }
        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Successfully retrieve record(s)." });
        // Construct response object directly from getClientByUsername
        const response = {
            record: {
                id: getClientByEmail._id,
                email: getClientByEmail.personalInformation.contactInformation.emailAddress,
            }
        };
        res.status(200).json(response);
    } catch (error) {
        Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', {message: error.message});
        res.status(500).json({ error: error.message });
    }
};
/* Delete Client by username*/
exports.deleteByEmail = async (req, res) => {
    var ACTION = '[DELETE-CLIENT-RECORD]'
    try {
        const { email } = req.params;

        // Delete document by username
        const deletedUser = await clientsInformation.findOneAndDelete({ "personalInformation.contactInformation.emailAddress": email });

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

/*Update by email*/
exports.updateByEmail = async (req, res) => {
    var ACTION = '[UPDATE-CLIENT-INFORMATION]';

    try {
        const { email } = req.params;
        const updateData = req.body;

       // Find document by username and update
        const updateUser = await clientsInformation.findOneAndUpdate({ "personalInformation.contactInformation.emailAddress": email }, updateData, { new: true });

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

/* Update password*/
exports.updatePassword = async (req, res) => {
    var ACTION = '[UPDATE-CLIENT-PASSWORD-BY-EMAIL]';

    try {
        const { email } = req.params;
        const { oldPassword, newPassword } = req.body;

        // Find the client by email
        const client = await clientsInformation.findOne({ "personalInformation.contactInformation.emailAddress": email });

        // Check if the client exists
        if (!client) {
            return res.status(404).json({ message: 'Client record(s) not found' });
        }

        // Verify old password
        if (client.password !== oldPassword) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Update the password
        client.password = newPassword;
        const updatedClient = await client.save();

        Logger.log('info', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: "Successfully updated client password" });
        res.status(200).json({ message: 'Successfully updated password' });
    } catch (error) {
        Logger.log('error', TAG + ACTION + '[REFID:' + uuid + '] response: ', { message: error.message });
        res.status(500).json({ error: error.message });
    }
};



