const mongoose = require('mongoose');
const Schema = mongoose.Schema


const clientSchema = new Schema({
    username:{
        type: String,
        require: true
    },
    id:{
        type: String,
        require: true
    },
    personalInformation: {
        firstName: String,
        middleName: String,
        lastName: String,
        birthDate: Date,
        mobileNumber: String,
        emailAddress: { type: String, unique: true },
        address: String,
        civilStatus: String,
        placeOfBirth: String
    },
    workInformation: {
        idType: String,
        idNumber: String,
        occupation: String,
        natureOfWork: String,
        employerName: String,
        companyAddress: String,
        zipCode: String
    },
    familyInformation: {
        nameOfFather: String,
        ageofFather: Number,
        nameOfMother: String,
        ageOfMother: Number
    },
    beneficiary: [{
        fullName: String,
        birthDate: Date,
        relationshipToInsured: String,
        percentOfShare: Number,
        cityOfBirth: String,
        mobileNumber: String,
        emailAddress: String
    }],
},{timestamps: true})

module.exports = mongoose.model('clientsInformation', clientSchema)