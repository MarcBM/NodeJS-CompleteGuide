// Core Node Modules
const path = require('path');
// NPM Modules
const express = require('express');
// Custom Modules
const userRoutes = require('./routes/users');
const timeRoutes = require('./routes/time');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', userRoutes);
app.use(timeRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);