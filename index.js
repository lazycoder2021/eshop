const express = require('express'); 
const app = express();
const router = require('./routes/routes'); 
const mongoose = require('mongoose'); 
require('dotenv').config({}); 
const { v4: uuidv4 } = require('uuid')
const fileUpload = require("express-fileupload");
const cors = require('cors'); 
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieparser = require('cookie-parser');







app.use(express.json());
app.use(express.static('public')); 
app.use(
    fileUpload({
       useTempFiles: true,
    })
);
app.use(cors());
app.use(cookieparser())

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, collection: 'sessions' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))




app.use('/', router); 

/*
app.get('/test', function (req, res) {
    console.log(req.session.id)
    res.send('testing route')
})
*/







mongoose.set('strictQuery', false);




app.listen(process.env.PORT, function () {
    console.log('server -- up and running...')

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('db connected')
        })
        .catch((e) => {
            console.log(e)
        })
})
