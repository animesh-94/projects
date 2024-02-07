const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

var auth = require('../service/authentication');
var checkRole = require('../service/checkrole');

//This API is for Signup Page 
//This API is a POST request API
router.post('/signup', (req, res) => {
    let user = req.body;
    let query = "select email,password,role,status from user where email=?";
    connection.query(query,[user.email],(err,results) =>{
        if(!err){

            //If the user is new to sign up then this block of code will work
            if(results.length <=0){
                query = "insert into user(name, contact_number, email, password, status, role) values (?,?,?,?,'false','user')"
                connection.query(query,[user.name, user.contact_number, user.email, user.password], (err,results)=>{
                    if(!err){
                        return res.status(200).json({
                            message:"Successfully registered"
                        });
                    }
                    else{
                        return res.status(500).json(err);
                    }
                })
            }

            //If the user is already loggined and tries to login with the same email then error meassage is thrown
            else{
                return res.status(400).json({
                    message:"Email Already Exist"
                });
            }
        }
        else{
            return res.status(500).json(err);
        }
    });
});


//This API is for login to the system only for admin
//This API is a POST request API
//This block of code will give a JWT token if the user is authentic
router.post('/login', (req,res) =>{
    let user = req.body;
    let query = "select email,password,status,role from user where email=?";
    connection.query(query, [user.email], (err,results) =>{
        if(!err){

            //If the email field is empty or the password is wrong then this block of code will exicute
             if(results.length <=0 || results[0].password != user.password){
                return res.status(401).json({
                    message:"Incoorect user or password"
                });
             }

             //If the status is false i.e you are not an admin hence this block of code will run and will throw an error
             else if(results[0].status === 'false'){
                return res.status(401).json({
                    meassge:"Wait for Admin Approval"
                });
             }

             //If the password matches with the password that is given at the signup then a JWT token is return 
             else if(results[0].password == user.password){
                const response = {email : results[0].email, role: results[0].role};
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: '12h'});
                res.status(200).json({token: accessToken});
             }
             else{
                return res.status(400).json({
                    message:"Something went wrong.Please try again later"
                });
             }
        }
        else{
            return res.status(500).json(err);
        }
    });
});

//This API is for retriving the user data from the database
//This is a GET request API
router.get('/get', auth.authenticateToken,checkRole.checkRole, (req,res) =>{
    let query = "select id, name, contact_number, email, status from user where role='user'";
    connection.query(query, (err,results) =>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    });
});

//This API is for updating the status from false to true in order to access the system functionality
//This is a PATCH request API
//It is only going to update the status of a certain block in database with the specified ID number
router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req,res) =>{
    let user = req.body;
    query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (req,results) =>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({
                    message: "User not Found"
                });
            }
            return res.status(200).json({
                message: "User Updated Successfully"
            });
        }
        else{
            return res.status(500).json(err);
        }
    });
});

router.get('/checkToken', auth.authenticateToken, checkRole.checkRole, (req,res) =>{
    return res.status(200).json({
        message:"true"
    });
});


module.exports = router;