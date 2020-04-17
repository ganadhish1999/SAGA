const {Client} = require('pg');
const {connectionString} = require("../config/keys");

	const getUserDetails = async (username) => {
	try {
		const client = new Client({connectionString});
		client.connect();
		let query =
			'SELECT username, first_name, last_name FROM users \
WHERE username=$1;';
		let params = [username]
		var userResult = await client.query(query, params);
		client.end();
		if(userResult.rowCount != 0)
			 return null, userResult.rows[0];
		else
			throw new Error('Some problem with the database');
		
	}
	catch(err) {
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
	getUserDetails
}