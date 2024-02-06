const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const DeviceSchema = require('../models/Device.js');
const Device = mongoose.model('Device', DeviceSchema);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    console.log('POST @ /v1/auth/register');
    try {
        const { userId, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            userId,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ message: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'fail' });
    }
});

router.post('/add-device', async (req, res) => {
    console.log('POST @ /v1/auth/add-device');
    try {
        const { userId, password, deviceId, deviceName } = req.body;
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed, user does not exist!' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Authentication failed, incorrect password!' });
        }
        const device = new Device({ deviceId: deviceId, name: deviceName });
        user.devices.push(device);
        await user.save();
        return res.status(200).json({ message: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occured, try again later...' });
    }
});

router.post('/login', async (req, res) => {
    console.log('POST @ /v1/auth/login');
    try {
        const { userId, password, deviceId } = req.body;
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(200).json({ message: 'Authentication failed, user does not exist!' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(200).json({ message: 'Authentication failed, incorrect password!' });
        }
        for(let device of user.devices) {
            if(device.deviceId===deviceId) {
                return res.status(200).json({ message: `success` });
            }
        }
        return res.status(200).json({ message: `Device doesn't exist` });
        // const token = jwt.sign({ verificationId: user._id }, process.env.JWTKEY, {
        //     expiresIn: '1h',
        // });
    } catch (error) {
        res.status(500).json({ message: 'Login failed, try again later...' });
    }
});

module.exports = router;