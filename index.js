const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connecting to database
connectDB();

app.use(express.json()); //helps accept json data into API

// Define Routes
app.use('/', require('./routes/index'));
app.use('/api/url', require('./routes/url'));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));