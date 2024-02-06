const mongoose = require('mongoose');
const DeviceSchema = require('./Device.js')

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    devices: [DeviceSchema]
});

module.exports = mongoose.model('User', userSchema);
