const pool = require('../config/db');

const getUserDetailsByUsername = async (username) => {
	try {
		var client = await pool.connect();
		let query =
			'SELECT username, first_name, last_name FROM users \
WHERE username=$1;';
		let params = [username]
		var userResult = await client.query(query, params);
		client.release();
		if(userResult.rowCount != 0)
			 return userResult.rows[0];
		else
			throw new Error('Some problem with the database');
		
	}
	catch(err) {
        client.release();
		console.error(err);
	}
	
	
};

const getUserDetailsById = async (id) => {
	try {
		var client = await pool.connect();
		let query =
			'SELECT username, first_name, last_name FROM users \
WHERE user_id=$1;';
		let params = [Number(id)]
		var userResult = await client.query(query, params);
		client.release();
		if(userResult.rowCount != 0)
			 return userResult.rows[0];
		else
			throw new Error('Some problem with the database');
		
	}
	catch(err) {
        client.release();
		console.error(err);
	}
	
}

/*
getUserDetails('akshatshcah21', (err, user) => {
	if(err)	console.error(err);
	else console.log(user);
});
*/

module.exports = {
	getUserDetailsByUsername,
	getUserDetailsById
}