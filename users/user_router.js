const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./user_model.js');

const router = express.Router();



router.post('/register', (req, res) => {
    const {username, password} = req.body;
    const hash = bcrypt.hashSync(password, 8);

    db.add({username, password: hash})
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({Error: "Unable to register user"})
        })
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    db.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json(`${user.username} logged in`);
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.get('/users', validation, (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({Error: "Unable to return list of users"})
        })
});

router.get('/hash', (req, res) => {
    const name = req.query.name;

    const hash = bcrypt.hashSync(name, 10);
    res.send(`The hash for ${name} is ${hash}`)
})

//middleware

function validation( req, res, next) {
    const {username, password} = req.headers;

    db.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                next();
            } else {
                res.status(403).json({ message: 'Not Aunthorized' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
}


module.exports = router;