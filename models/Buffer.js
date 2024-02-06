const mongoose = require('mongoose');

const BufferSchema = new mongoose.Schema({
    source: { type: String, unique: true, required: true },
    data: { type: String },
    read: { type: Boolean, default: false }
});

module.exports = BufferSchema;

