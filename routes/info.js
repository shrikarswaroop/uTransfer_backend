const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const DeviceSchema = require('../models/Device.js');
const Device = mongoose.model('Device', DeviceSchema);

router.get('/devices', async (req, res) => {
    console.log('GET @ /v1/info/devices');
    try {
        let user = await User.findOne({ userId: req.query.userId });
        let bufferStatus = {};
        for (let device of user.devices) {
            if (device.deviceId === req.query.deviceId) {
                for (let buffer of device.bufferArray) {
                    bufferStatus[buffer.source] = buffer.read ? 'clean' : 'dirty';
                }
            }
        }
        let deviceData = [];

        for (let device of user.devices) {
            deviceData.push({
                deviceId: `${req.query.userId}.${device.deviceId}`,
                deviceName: device.name,
                status: bufferStatus[device.deviceId] ?? 'unknown'
            })

        }
        res.status(200).json(deviceData);
    } catch (error) {
        console.log(error);
    }
});

router.get('/message', async (req, res) => {
    console.log('GET @ /v1/info/message');
    try {
        let user = await User.findOne({ userId: req.query.userId });
        let deviceIndex = 0, bufferIndex = 0;
        for (let device of user.devices) {
            if (device.deviceId === req.query.readerId) {
                for (let buffer of device.bufferArray) {
                    if (buffer.source === req.query.sourceId) {
                        if (!user.devices[deviceIndex].bufferArray[bufferIndex].read) {
                            user.devices[deviceIndex].bufferArray[bufferIndex].read = true;
                            await user.save();
                        }
                        res.status(200).json({ message: buffer.data });
                        return;
                    }
                    bufferIndex++;
                }
            }
            deviceIndex++;
        }
        res.status(200).json({ message: 'dne' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error' });
    }
});

module.exports = router;