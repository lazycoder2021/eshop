const mongoose = require('mongoose'); 

const reviewSchema = mongoose.Schema({
    review: {
        type: String, 
        required: true
    }, 
    createdAt: {
        type: Number,
        default: Date.now()
    }, 
    productId: {
        type: String, 
        required: true
    }, 
    userId: {
        type: String, 
        required: true
    }
})

const Review = mongoose.model('Review', reviewSchema); 

module.exports = Review; 


