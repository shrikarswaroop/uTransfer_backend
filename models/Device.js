const mongoose = require('mongoose');
const BufferSchema = require('./Buffer.js')

const DeviceSchema = new mongoose.Schema({
    deviceId: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    bufferArray: [BufferSchema]
});

module.exports = DeviceSchema;

