const Student = require('./Student'); 
const mongoose = require('mongoose');

// Thêm useNewUrlParser và useUnifiedTopology vào options
mongoose.connect('mongodb://0.0.0.0:27017/web', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const timeWorkProgressSchema = mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    progress: {
        type: String,
        required: true
    }
});

const reportSchema = mongoose.Schema({
    _id: {
        type: String,
        ref: Student, // Make sure to use the correct model name here
        required: true
    },
    reports: [timeWorkProgressSchema]
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
const Reports = mongoose.model("Report", reportSchema);
module.exports = Reports;