// Tệp index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

const app = express();
dotenv.config();

mongoose.connect('mongodb://0.0.0.0:27017/web')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// ROUTES
app.use("/", authRoute);
app.use("/", userRoute);

app.listen(8000, () => {
    console.log("Server is running");
});
