const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.js');
const protectedRoute = require('./routes/protected.js');
const infoRoutes = require('./routes/info.js');
const createRoutes = require('./routes/create.js');
var cors = require('cors')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
mongoose.connect(process.env.ATLAS_URI)

app.use(cors(
    {
        credentials: true,
        origin: 'http://localhost:3000'
    }
));

app.use(express.json());
app.use('/v1/auth', authRoutes);
app.use('/v1/protected', protectedRoute);
app.use('/v1/info', infoRoutes);
app.use('/v1/create', createRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});