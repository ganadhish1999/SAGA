const { Pool } = require('pg');
var config = {
	connectionString: process.env.DATABASE_URL,
  	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
}
const pool = new Pool(config);



module.exports = pool;

