const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id: {
        type: String,
        required: true, // Assuming id is required
        unique: true,   // Assuming id should be unique
      },
      name: {
        type: String,
        maxlength: 64,
        default: null,
      },
      email: {
        type: String,
        maxlength: 128,
        unique: true,
        required: true, 
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
      password: {
        type: String,
        maxlength: 64,
        required: true, 
      },
      created_at: {
        type: Date,
        default: Date.now,
      }
    });

 module.exports = mongoose.model('User', userSchema);