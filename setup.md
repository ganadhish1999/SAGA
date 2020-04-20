# Setup instructions

## NPM Packages
Run the following command:
```bash
npm i
```

## Set up PostgreSQL database
1. Open psql shell, login as a user
2. Create a new database
```sql
CREATE DATABASE forum;
```
3. Connect to this database
```bash
\c forum
```
4. Run SQL commands from the file `create_tables.sql`:
```
\i <absolute path of create_tables.sql in your PC>
```

5. Check the database by 
```bash
\d
```
