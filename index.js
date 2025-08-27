const express = require('express')
const path = require('path')
require('dotenv').config();
const app = express()
const cookieParser = require('cookie-parser');
const port = 3000
const clientRoute = require('./routes/client/index.route');
const adminRoute = require('./routes/admin/index.route');
const variableConfig = require('./config/variable.config')
const databaseConfig = require('./config/database.config');

databaseConfig.connect();
//
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use(cookieParser());

app.locals.pathAdmin = variableConfig.pathAdmin;
global.pathAdmin = variableConfig.pathAdmin;

app.use(`/${variableConfig.pathAdmin}`, adminRoute);
app.use('/', clientRoute)

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
})