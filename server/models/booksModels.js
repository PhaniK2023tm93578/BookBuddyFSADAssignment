const { Pool } = require('pg');

const PG_URI = 'postgres://YourUserName:YourPassword@localhost:5432/YourDatabase';

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
