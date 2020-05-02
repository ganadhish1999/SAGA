# Setup instructions (local)
If you don't already, install [Node](https://nodejs.org/en/) and [PostgreSQL](https://www.postgresql.org/download/) on your computer.

## NPM Packages
Run the following command:
```bash
npm i
```

## Set up PostgreSQL database
1. Open psql shell, login as a user
2. Create a new database in the psql shell.
```sql
CREATE DATABASE DBNAME;
```
3. To connect to this database, run this in psql.
```bash
\c DBNAME
```
4. Get a sample database from the `forum.sql` file (with the data) by the following command on bash:
```bash
psql -d DBNAME -U USERNAME -f forum.sql
```
  Alternatively, to create an empty database, run SQL commands from the file `create_tables.sql`. Do this in psql:
```
\i <absolute path of create_tables.sql in your PC>
```

5. Check the database by running the following psql command
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
