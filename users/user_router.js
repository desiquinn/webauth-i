const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./user_model.js');

const router = express.Router();



router.post('/register', (req, res) => {
    let {username, password} = req.body;
    const hash = bcrypt.hashSync(password);

    db.add({username, password: hash})
        .then(saved => {
            res.status(200).json(saved)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({Error: "Unable to register user"})
        })
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
    
    Users.findBy({ username })
        .first()
        .then(user => {
            if (user) {
                res.status(200).json(user.username);
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.get('/users', (req, res) => {
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

function validation() {

}


module.exports = router;