const Student = require('./Student');
const mongoose = require('mongoose');

// Thêm useNewUrlParser và useUnifiedTopology vào options
const accountSchema = new mongoose.Schema({
    _id: {
        type: String,
        ref: Student,
        require: true
    },
    pass: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    }
});
const Accounts = mongoose.model("Account", accountSchema);
module.exports = Accounts;