require("dotenv").config();

const express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    responseTime = require('response-time');

const app = express();
app.use(express.json());
app.use(cors());
app.use(responseTime());
app.use('/', require('./src/api/routes'));

app.get('/', (req, res) => {
    return res.status(200).send({ message: 'Server is working!!' });
});

// Find 404 and hand over to error handler
app.use((req, res, next) => {
    next(createError(404));
});

//For handleing internal errors
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});

mongoose.connect(process.env.DB_URI).then(() => {
    const port = process.env.SERVER_PORT;

    app.listen(port, function () {
        console.log(`Server started on port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});

