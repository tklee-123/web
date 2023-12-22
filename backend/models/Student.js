const mongoose = require('mongoose');

// Thêm useNewUrlParser và useUnifiedTopology vào options
const studentSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    major: {
        type: String,
        require: true
    },
    gpa: {
        type: Number,
        require: true
    }
});
const Students = mongoose.model("Student", studentSchema);
module.exports = Students;