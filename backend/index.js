// Tệp index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const { exec } = require('child_process');

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

app.get('/runcode', (req, res) => {
    exec('python D:\\web\\backend\\algorithms\\demo.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing the Python script: ${error}`);
        return res.status(500).send('Internal Server Error');
      }
  
      try {
        const jsonData = JSON.parse(stdout);
        res.json(jsonData);
      } catch (parseError) {
        console.error(`Error parsing JSON: ${parseError}`);
        res.send(stdout.replace(/\n/g, '<br>'));
      }
    });
  });

app.listen(8000, () => {
    console.log("Server is running");
});
