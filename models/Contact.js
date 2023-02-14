const mongoose = require('mongoose'); 

const contactSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    }, 
    name: {
        type: String,
        required: true
    }, 
    message: {
        type: String, 
        required: true
    }
})

const Contact = mongoose.model('Contact', contactSchema); 

module.exports = Contact; 