const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  hashedPassword: String,
  fullName: String,
  email: String,
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (this.isModified('hashedPassword')) {
    this.hashedPassword = await bcrypt.hash(this.hashedPassword, 10);
  }
  next();
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.hashedPassword);
};

module.exports = mongoose.model('User', userSchema);