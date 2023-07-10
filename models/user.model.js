const mongoose = require("mongoose");
// Define the User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}






