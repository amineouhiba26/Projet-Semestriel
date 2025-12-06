const mongoose = require('mongoose');
const connectDB = async () => { 
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connecté à la base de données MongoDB');
    }  catch (err) {
        console.error('Erreur de connexion à la base de données MongoDB', err); 
        process.exit(1);
} 
};

module.exports = connectDB;