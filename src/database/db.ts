import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'db05.assesi.com.br',
  user: 'mkt_0800_u',
  password: 'C@a#156cAm@rA_32',
  database: 'mkt_0800',
  waitForConnections: true,
  connectionLimit: 10,
});