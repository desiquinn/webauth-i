const express = require('express');
const userRouter = require('./users/user_router.js')

const server = express();

server.use(express.json());
server.use('/api', userRouter );

module.exports = server;