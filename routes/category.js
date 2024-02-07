const express = require('express');
const connection = require('../connection');
const router = express.Router();
let auth = require('../service/authentication');
let checkRole = require('../service/checkrole');

//This is for adding products in the database
//This is a post request
router.post('/add', auth.authenticateToken, checkRole.checkRole, (req,res,next) =>{
    let category = req.body;
    let query = "insert into category (name) values(?)";
    connection.query(query, [category.name], (err,results) =>{

        //If no errors occurs then the product is added in the category database
        //return the message
        if(!err){
            return res.status(200).json({
                meassge: "Category Added Successfully"
            });
        }
        else{
            return res.status(500).json(err);
        }
    });
});

//This API is for displaying the categories added in the database
//This is a get API
router.get('/get', auth.authenticateToken, (req,res,next) =>{
    let query = "select * from category";
    connection.query(query, (err,results) =>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    });
});

//This API for updating the category database to add new categories 
//This is a patch API
router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req,res,next) =>{
    let product = req.body;
    let query = "update category set name=? where id=?";
    connection.query(query, [product.name, product.id], (err, results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(400).json({
                    meassge: "Category not found"
                });
            }
            return res.status(200).json({
                message:"Category Updated successfully"
            })
        }
        else{
            return res.status(500).json(err);
        }
    });
});

module.exports = router;