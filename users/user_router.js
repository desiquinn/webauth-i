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
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user= user;
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

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(error => {
            if(error) {
                res.status(500).json({message: 'unable to logout'})
            } else {
            res.status(200).json({message: 'bye'})
            }
        });
    } else {
        res.status(200).json({message: 'already logged out'})
    }
})

// router.get('/hash', (req, res) => {
//     const name = req.query.name;

//     const hash = bcrypt.hashSync(name, 10);
//     res.send(`The hash for ${name} is ${hash}`)
// })

//middleware

function validation( req, res, next) {

    if (req.session && req.session.user) {
        next();
    } else {
        res.status(403).json({ message: 'You Shall Not Pass' });
    }
}


module.exports = router;