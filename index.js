const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const useRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');
const app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use('/user', useRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);


module.exports = app;