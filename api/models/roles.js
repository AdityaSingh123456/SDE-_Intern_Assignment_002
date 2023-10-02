const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const roleSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true, // Primary key, so it's required
      unique: true   // It's unique
    },
    name: {
      type: String,
      maxlength: 64, // Maximum length of 64 characters
      unique: true  // It's unique
    },
    created_at: {
      type: Date,
      default: Date.now // Default to the current date and time
    },
    updated_at: {
      type: Date,
      default: Date.now // Default to the current date and time
    }
  });

roleSchema.plugin(mongoosePaginate);
  module.exports = mongoose.model('Role', roleSchema);