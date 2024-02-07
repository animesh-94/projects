require('dotenv').config();
const http = require('http');
const app = require('./index');

// const server = http.createServer();
app.listen(process.env.PORT);