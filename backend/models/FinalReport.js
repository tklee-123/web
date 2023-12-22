const Student = require('./Student'); 
const mongoose = require('mongoose');

// Thêm useNewUrlParser và useUnifiedTopology vào options
mongoose.connect('mongodb://0.0.0.0:27017/web', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const finalReportSchema = mongoose.Schema({
    "_id": {
        type: String,
        ref: Student,
        require: true
    },
    "project": {
        type: String,
        require: true
    },
    "result": {
        type: Number,
        require: true
    }
});

const FinalReport = mongoose.model('FinalReport', finalReportSchema);
module.exports = FinalReport;