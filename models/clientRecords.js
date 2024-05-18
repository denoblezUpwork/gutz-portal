const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const clientSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4()// Generate UUID for new documents
    },
    personalInformation:{
        fullName: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: String,
            validate: {
                validator: function(v) {
                    // Validate date format (MM/DD/YYYY)
                    return /^\d{2}\/\d{2}\/\d{4}$/.test(v);
                },
                message: props => `${props.value} is not a valid date in MM/DD/YYYY format!`
            },
            required: true
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true,
            validate: {
                validator: function(value) {
                    return ['Male', 'Female', 'Other'].includes(value);
                },
                message: props => `${props.value} is not a valid gender. Gender must be Male, Female, or Other.`
            }
        },
        maritalStatus: {
            type: String,
            enum: ['Single', 'Married', 'Divorced', 'Widowed'],
            required: true,
            validate: {
                validator: function(value) {
                    return ['Single', 'Married', 'Divorced', 'Widowed'].includes(value);
                },
                message: props => `${props.value} is not a valid marital status. Marital status must be Single, Married, Divorced, or Widowed.`
            }
        },
        contactInformation: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            stateProvince: { type: String, required: true },
            zipPostalCode: { type: String, required: true },
            emailAddress: { type: String, required: true },
            phoneNumber: {
                type: String,
                required: true,
                validate: {
                    validator: function(value) {
                        // Validate phone number format (+63XXXXXXXXXX or 09XXXXXXXXX)
                        return /^(?:\+63|09)\d{10}$/.test(value);
                    },
                    message: props => `${props.value} is not a valid phone number. Phone number must start with '+63' or '09' followed by 9 digits.`
                }
            }
        }
    },
    employmentInformation: {
        employmentStatus: {
            type: String,
            enum: ['Employed', 'Self-Employed', 'Unemployed', 'Retired'],
            required: true,
            validate: {
                validator: function(value) {
                    return ['Employed', 'Self-Employed', 'Unemployed', 'Retired'].includes(value);
                },
                message: props => `${props.value} is not a valid employment status. Employment status must be one of: Employed, Self-Employed, Unemployed, or Retired.`
            }
        },
        employer: { type: String },
        occupation: { type: String }
    },
    insuranceCoverageDetails: {
        beneficiaries: [{
            name: String,
            dateOfBirth: String,
            sharePercentage: {
                type: Number,
                required: true,
                min: 0,
                max: 100
            }
        }]
    },
    medicalHistory: {
        smoke: { type: String, enum: ['Yes', 'No'], required: true },
        preExistingConditions: { type: String, enum: ['Yes', 'No'], required: true, validate: {
            validator: function(value) {
                return ['Yes', 'No'].includes(value);
            },
            message: props => `${props.value} is not a valid value for preExistingConditions. Please provide either 'Yes' or 'No'.`
        } },
        surgeriesInPast5Years: { type: String, enum: ['Yes', 'No'], required: true, validate: {
            validator: function(value) {
                return ['Yes', 'No'].includes(value);
            },
            message: props => `${props.value} is not a valid value for surgeriesInPast5Years. Please provide either 'Yes' or 'No'.`
        } },
        specificSurgeries: { type: String },
        specificConditions: { type: String }
    },
    password: { type: String, required: true,  maxlength: [50, 'Password must be at most 50 characters long'] }
}, { timestamps: true });

// Custom validator for beneficiary age
clientSchema.path('insuranceCoverageDetails.beneficiaries').validate(function(beneficiaries) {
    if (!beneficiaries || beneficiaries.length === 0) {
        return true; // Allow other validations to catch missing fields
    }

    // Check all beneficiaries' age and issue a warning if any is below 18
    const now = new Date();
    const cutoffDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());

    for (const beneficiary of beneficiaries) {
        const dob = new Date(beneficiary.dateOfBirth);
        if (dob > cutoffDate) {
            console.warn(`Beneficiary with date of birth ${beneficiary.dateOfBirth} is below 18 years old.`);
        }
    }

    return true; // Proceed with saving the document
}, 'Warning: One or more beneficiaries are below 18 years old.');


module.exports = mongoose.model('clientsInformation', clientSchema);
