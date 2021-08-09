const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')

const usersRouter = require('./routes/users');
const filesRouter = require('./routes/files');

require('dotenv').config()

const app = express();

app.use(morgan('tiny'))
app.use(bodyParser.json())

app.use('/users' , usersRouter);
app.use('/files' , filesRouter);

app.listen(process.env.PORT , () => {
    console.log("Server Running at port 9000");
})