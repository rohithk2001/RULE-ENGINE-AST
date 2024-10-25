const mongoose = require('mongoose');

// Connect to MongoDB (use your MongoDB URI if needed)
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/ruleEngineDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected (ruleEngineDB)');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);  // Exit the process if connection fails
    }
};

// Export the connection function
module.exports = connectDB;
