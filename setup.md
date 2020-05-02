# Setup instructions (local)
If you don't already, install [Node](https://nodejs.org/en/) and [PostgreSQL](https://www.postgresql.org/download/) on your computer.

## NPM Packages
Run the following command:
```bash
npm i
```

## Set up PostgreSQL database
1. Open psql shell, login as a user
2. Create a new database
```sql
CREATE DATABASE DBNAME;
```
3. Connect to this database
```bash
\c DBNAME
```
4. Run SQL commands from the file `create_tables.sql`:
```
\i <absolute path of create_tables.sql in your PC>
```
5. Check the database by 
```bash
\d
```
6. Change the value of the `connectionString` option in `config/db.js` to connect to your local database.
```
postgres://USERNAME:PASSWORD@localhost:5432/DBNAME
```
7. Run the app by the following command
```bash
npm start
```

