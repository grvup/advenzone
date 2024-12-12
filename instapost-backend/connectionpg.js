const {Pool} = require('pg');
require ('dotenv').config();

const pgPool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PG_PORT,
});

pgPool.on('connect',()=>{
    console.log('connected to Postgres');
});

pgPool.on('error',(err)=>{
    console.log('PostgreSQL connection error:',err);
})

module.exports = pgPool;