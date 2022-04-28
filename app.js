const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const bodyparser = require('body-parser');
let cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cookieParser());

// ------------------------ CNX TO DB -----------------------------

mongoose.connect(

    process.env.DB_CONNECTION,
    (err) =>{
        if (err) {
            console.log(err);
        }
        console.log('Connected to MongoDB');
    }

);

// ------------------------ client routes ------------------------

    const client = require('./src/routes/client.routes');
    app.use('/api/client', client); 

// ------------------------ Port ------------------------

app.listen(process.env.PORT, () => {
    console.log(`up and running at http://localhost:${process.env.PORT}`);
})
