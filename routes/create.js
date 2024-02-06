const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const BufferSchema = require('../models/Buffer.js');
const Buffer = mongoose.model('Buffer', BufferSchema);

router.post('/message', async (req, res) => {
    console.log('POST @ /v1/create/message');
    try {
        let user = await User.findOne({ userId: req.body.userId });
        let deviceIndex = 0, bufferIndex = 0;
        for (let device of user.devices) {
            if (device.deviceId === req.body.receiverId) {
                let bufferDoesExist = false;
                for (let buffer of device.bufferArray) {
                    if (buffer.source === req.body.senderId) {
                        bufferDoesExist = true;
                        user.devices[deviceIndex].bufferArray[bufferIndex].data = req.body.data;
                        user.devices[deviceIndex].bufferArray[bufferIndex].read = false;
                        await user.save();
                        return res.status(200).json({ message: 'success' });
                    }
                    bufferIndex++;
                }
                if (!bufferDoesExist) {
                    user.devices[deviceIndex].bufferArray.push(new Buffer({
                        source: req.body.senderId,
                        data: req.body.message,
                        read: false
                    }));
                    await user.save();
                    return res.status(200).json({ message: 'success' });
                }
            }
            deviceIndex++;
        }
        res.status(500).json({ message: 'error' });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;