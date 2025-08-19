const mongoose = require('mongoose');
module.exports.connect = () => {
    try {
        mongoose.connect(process.env.DATABASE);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}