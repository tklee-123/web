const Student = require('./Student');
const mongoose = require('mongoose');

// Thêm useNewUrlParser và useUnifiedTopology vào options
const internship_resultSchema = new mongoose.Schema({
    _id: {
        type: String,
        ref: Student,
        require: true
    },
    name: {
        type: String
    },
    birthday: {
        type: String
    },
    sex: {
        type: String
    },
    major: {
        type: String
    },
    phone:{
        type: String
    },
    position: {
        type: String,
        require: true
    },
    business: {
        type: String,
        require: true
    }
});
const InternshipResult = mongoose.model("Internship_Result", internship_resultSchema);
module.exports = InternshipResult;