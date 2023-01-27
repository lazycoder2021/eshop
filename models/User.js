const mongoose = require('mongoose'); 

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    }, 
    email: {
        type: String,
        required: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    verify: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }, 
    rid: {
        type: String,
    },
    lid: {
        type: String,
    }
})

const User = mongoose.model('User', userSchema); 

module.exports = User; 
