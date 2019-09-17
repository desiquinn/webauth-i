const db = require('../database/config.js');

module.exports = {
    add, 
    find,
    findBy,
    findById,

};


function find() {
    return db('users')
        .select('id', 'username', 'password');
};

function add(user) {
    return db('users')
        .insert(user, 'id')
        .then(([id]) => {
            return findById(id);
        })
};

function findById(id) {
    return db('users')
        .where({id})
        .first()
};

function findBy(filter) {
    return db('users')
        .where(filter)

};
