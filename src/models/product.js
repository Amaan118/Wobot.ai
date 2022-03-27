const mongoose = require('mongoose');

const prodSchema = mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    quantity: {
        type: String
    },
    price: {
        type: Number
    },
    _createdBy: {
        type: String
    }
});


const Product = mongoose.model("wobot_product", prodSchema, "wobot_product");

module.exports = Product;