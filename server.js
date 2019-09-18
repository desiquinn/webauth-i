const express = require('express');
const userRouter = require('./users/user_router.js');
const helmet = require('helmet');
const cors = require('cors');

const session = require('express-session');
const KnexSessionStore = require("connect-session-knex")(session);
const connection = require('./database/config.js'); 

const server = express();

const sessionConfig = {
    name: 'dutchchoco',
    secret: process.env.SESSION_SECRET || 'keep it secret',
    cookie: {
        maxAge: 1000 * 60 * 60, 
        secure: false, 
        httpOnly: true, 
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: connection,
        tablename: 'knexsessions',
        sidfieldname: 'sessionid',
        createtable: true,
        clearInterval: 1000 * 60 * 30,
    }),
};

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionConfig));
server.use('/api', userRouter );

module.exports = server;