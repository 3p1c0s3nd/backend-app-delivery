const promise = require('bluebird');
const options = {
    promiseLib: promise,
    query: (e) => {}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function(stringValue) {
    return stringValue;
});

const databaseConfig = {
    'host': 'dpg-cqgfc52ju9rs73cd96q0-a',
    'port': 5432,
    'database': 'delivery_db_tfkb',
    'user': 'delivery_db_tfkb_user',
    'password': '8s8DNIqW7fk4voliRqiMGt1Nj0SYdL68'
};

const db = pgp(databaseConfig);

module.exports = db;
