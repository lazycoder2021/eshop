const mongoose = require('mongoose'); 

const wishlistitems = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    }, 
    productId: {
        type: String, 
        required: true
    }
    
})




const wishlistSchema = new mongoose.Schema({
    wishlisttotal: [wishlistitems], 
    userId: {
        type: String, 
        required: true
    }
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema); 

module.exports = Wishlist; 
