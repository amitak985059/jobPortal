const express = require('express');
const app = express();  
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');   
dotenv.config();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


const connectDB = require('./db/db');
connectDB();

app.get('/', (req, res) =>{
    res.send('hello works')
})

// routes
const userRoutes = require('./routes/user.routes');
app.use('/users', userRoutes);

const jobRoutes = require('./routes/job.routes');
app.use('/jobs', jobRoutes);

const contactRoutes = require('./routes/contact.routes');
app.use('/contactus', contactRoutes);

module.exports = app;