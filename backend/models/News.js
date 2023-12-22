const mongoose = require('mongoose');
const Business = require("./Business")
// Thêm useNewUrlParser và useUnifiedTopology vào options
mongoose.connect('mongodb://0.0.0.0:27017/web', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const newsSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    business: {
        type: String,
        ref: Business,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    start_time: {
        type: String,
        require: true
    },
    end_time: {
        type: String,
        require: true
    },
    describe: {
        type: String,
        require: true
    },
    require: {
        type: String,
        require: true
    },
    profit: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    }
});

const News = mongoose.model("News", newsSchema);

module.exports = News;