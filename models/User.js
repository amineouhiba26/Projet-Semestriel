const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide'],
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['CLIENT', 'ADMIN'],
    required: true,
    uppercase: true,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
