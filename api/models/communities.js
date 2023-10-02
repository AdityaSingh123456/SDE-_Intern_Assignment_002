const mongoose = require('mongoose');

const communitySchema = mongoose.Schema({
    
    id: {
      type: String,
      required: true,
      unique: true,
      index: true, // Add an index for better query performance
    },
    name: {
      type: String,
      maxlength: 128,
      required: true,
      unique:true
    },
    slug: {
      type: String,
      maxlength: 255,
      unique: true,
    },
    owner: {
      type: String,
      ref: 'User', 
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
      required: true,
    },
    updated_at: {
      type: Date,
      default: Date.now,
      required: true,
    },
  });


  module.exports = mongoose.model('Community', communitySchema);