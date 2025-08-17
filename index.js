const express = require('express')
const path = require('path')
require('dotenv').config()
const mongoose = require('mongoose');
const app = express()
const port = 3000
const indexRoute = require('./routes/client/index.route')

mongoose.connect(process.env.DATABASE);

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoute)

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
})
