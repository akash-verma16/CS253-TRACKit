const mongoose = require('mongoose');

// Load environment variables into the process object
require('dotenv').config();

const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log('Database connected');
    })
    .catch(()=>{
        console.log('Database connection failed');
        console.error(err);
        process.exit(1);
    })
}

module.exports = dbConnect;