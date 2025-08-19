const express = require('express')
const path = require('path')
require('dotenv').config()
const mongoose = require('mongoose');
const app = express()
const port = 3000
const clientRoute = require('./routes/client/index.route');
const adminRoute = require('./routes/admin/index.route');
const databaseConfig = require('./config/database.config');

databaseConfig.connect();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoute);
app.use('/', clientRoute)

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
})