
import pool from './pool';

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create Users Table
 */
const createUsersTable = () => {
  const userCreateQuery = `CREATE TABLE IF NOT EXISTS users
  (user_id SERIAL PRIMARY KEY, firstname VARCHAR(100), 
  lastname VARCHAR(100), othernames VARCHAR(100), 
  email VARCHAR(100) UNIQUE NOT NULL, 
  username VARCHAR(50) NOT NULL, password VARCHAR(200) NOT NULL,
  registered DATE NOT NULL, isAdmin BOOL DEFAULT(false))`;

  pool.query(userCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
   * Create Parcels Table
   */
const createParcelsTable = () => {
  const parcelCreateQuery = `CREATE TABLE IF NOT EXISTS parcels
    (parcel_id SERIAL PRIMARY KEY, placedBy INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    parcelName VARCHAR(300) NOT NULL, weight float NOT NULL, 
    weightmetric VARCHAR(50) NOT NULL, sentOn DATE NOT NULL, 
    deliveredOn DATE, status VARCHAR(50), fromAddress VARCHAR(500) NOT NULL, 
    toAddress VARCHAR(500) NOT NULL, currentLocation VARCHAR(500))`;

  pool.query(parcelCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
   * Drop Users Table
   */
const dropUsersTable = () => {
  const usersDropQuery = 'DROP TABLE IF EXISTS users returning *';
  pool.query(usersDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};


/**
   * Drop Parcels Table
   */
const dropParcelsTable = () => {
  const parcelsDropQuery = 'DROP TABLE IF EXISTS parcels returning *';
  pool.query(parcelsDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};


/**
   * Create All Tables
   */
const createAllTables = () => {
  createUsersTable();
  createParcelsTable();
};


/**
   * Drop All Tables
   */
const dropAllTables = () => {
  dropUsersTable();
  dropParcelsTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


export {
  createUsersTable,
  createParcelsTable,
  createAllTables,
  dropUsersTable,
  dropParcelsTable,
  dropAllTables,
};

require('make-runnable');
