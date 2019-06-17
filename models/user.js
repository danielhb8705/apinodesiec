
const mysql = require('mysql');
const config = require('../config');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const con = mysql.createConnection(config.db);

var userModel = {};

userModel.createUser = function(userInfo){
    const username = userInfo.username;
    const password = userInfo.password;
    var displayName = userInfo.displayName;
    var token = userInfo.token;
    if(!displayName){
        displayName = '';
    }
    if(!token){
        token = '';
    }
    return new Promise((resolve,reject) => {
        try {
            if(con){
                // Create hash
                
                const hashedPassword =
                crypto.createHash('sha256')
                .update(password)
                .digest('hex');
                
               //var hashedPassword = bcrypt.hashSync(password, 8);
    
                const sql = "insert into users (username,password,displayName,token) values (" + 
                con.escape(username) + ",'" + hashedPassword + "'," + con.escape(displayName) + "," 
                + con.escape(token) + ")";
                con.query(sql, function (error, result) {
                    if (error) {
                        if(error.code === 'ER_DUP_ENTRY'){
                            reject({
                                result: false,
                                data: 'The username already exists'
                            });
                        } else {
                            reject({
                                result: false,
                                data: error
                            });
                        }                        
                    } else {
                        // create a token
                        const user_id = result.insertId;
                        var token = jwt.sign({ id: user_id }, 
                            process.env.APP_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        const info = {
                            displayName: displayName
                        }
                        resolve({
                            result: true,
                            token: token,
                            data: info
                        });
                    }   
                });
            }
        }
        catch(error) {
            console.error(error);
            reject({
                result: false,
                data: error
            });
        }
    });
        
}

userModel.getUser = function(user_id){
    return new Promise((resolve,reject) => {
        try {
            if(con){
    
                const sql = "select user_id,username,token,displayName from users where user_id = " + con.escape(user_id);
                con.query(sql, function (err, result) {
                    if (err) {
                        reject({
                            result: false,
                            data: error
                        });
                    } else {
                        if(result[0]){
                            const info = {
                                id: result[0]["user_id"],
                                token: result[0]["token"],
                                displayName: result[0]["displayName"]
                            }
                            resolve({
                                result: true,
                                data: info
                            });
                        } else {
                            resolve({
                                result: false,
                                data: 'No user found'
                            });
                        }
                    }   
                });
            }
          }
        catch(error) {
            console.error(error);
            reject({
                result: false,
                data: error
            });
        }
    });
}
userModel.login = function(username, password){
    return new Promise((resolve,reject) => {
        try {
            if(con){
                // Create hash
                
                const hashedPassword =
                crypto.createHash('sha256')
                .update(password)
                .digest('hex');
                
               //var hashedPassword = bcrypt.hashSync(password, 8);
    
                const sql = "select user_id,username,password,token,displayName from users where username = " + con.escape(username);
                con.query(sql, function (error, result) {
                    if (error) {
                        if(error.code === "ECONNREFUSED"){
                            reject({
                                result: false,
                                data: 'No database service'
                            }); 
                        } else {
                            reject({
                                result: false,
                                data: error
                            });
                        }
                    } else {
                        if(result[0]){
                            var passwordIsValid = false;
                            if(hashedPassword === result[0]["password"]){
                                passwordIsValid = true;
                            }
                            //var passwordIsValid = bcrypt.compareSync(hashedPassword, result[0]['password']);
                            if (!passwordIsValid){
                                resolve({
                                    result: false,
                                    token: null,
                                    data: 'Wrong password'
                                });
                            }
                            // create a token
                            const user_id = result[0]["user_id"];
                            const token = jwt.sign({ id: user_id}, 
                                process.env.APP_SECRET, 
                                {expiresIn: 86400}
                            );
                            const info = {
                                NOMBRE: result[0]["displayName"],
								EMAIL:	result[0]['username']
								
                            }
                            resolve({
                                result: true,
                                token: token,
                                data: info
                            });
                        } else {
                            resolve({
                                result: false,
                                token: null,
                                data: 'No user found'
                            });
                        }
                    }   
                });
            }
          }
        catch(error) {
            console.error(error);
            reject({
                result: false,
                data: error
            });
        }
    });
}
userModel.loginSmartsheet = function(email){
    return new Promise((resolve,reject) => {
        try {
            if(con){    
                const sql = "select user_id,username,token,displayName from users where username = " + con.escape(email);
                con.query(sql, function (error, result) {
                    if (error) {
                        if(error.code === "ECONNREFUSED"){
                            reject({
                                result: false,
                                data: 'No database service'
                            }); 
                        } else {
                            reject({
                                result: false,
                                data: error
                            });
                        }
                    } else {
                        if(result[0]){
                            var userIsValid = false;
                            if(email === result[0]["username"]){
                                userIsValid = true;
                            }
                            //var passwordIsValid = bcrypt.compareSync(hashedPassword, result[0]['password']);
                            if (!userIsValid){
                                resolve({
                                    result: false,
                                    token: null,
                                    data: 'Wrong user'
                                });
                            }
                            // create a token
                            const user_id = result[0]["user_id"];
                            const token = jwt.sign({ id: user_id}, 
                                process.env.APP_SECRET, 
                                {expiresIn: 86400}
                            );
                            const info = {
                                user_id: user_id,
                                displayName: result[0]["displayName"]
                            }
                            resolve({
                                result: true,
                                token: token,
                                data: info
                            });
                        } else {
                            resolve({
                                result: false,
                                token: null,
                                data: 'No user found'
                            });
                        }
                    }   
                });
            }
          }
        catch(error) {
            console.error(error);
            reject({
                result: false,
                data: error
            });
        }
    });
}
userModel.createAccess = function(user_id,access) {
    return new Promise((resolve,reject) => {
        try {
            if(con){    
                const sql = "update users set access = " + con.escape(access) + "where user_id = " + con.escape(user_id);
                con.query(sql, function (err, result) {
                    if (err) {
                        reject({
                            result: false,
                            data: error
                        });
                    } else {
                        resolve({
                            result: true,
                            data: result
                        });
                    }   
                });
            }
          }
        catch(error) {
            console.error(error);
            reject({
                result: false,
                data: error
            });
        }
    });
}
userModel.verifyAccess = function(access) {
    return new Promise((resolve,reject) => {
        try {
            if(con){
                const sql = "select user_id,username,password,token,displayName from users where access = " + con.escape(access);
                con.query(sql, function (error, result) {
                    if (error) {
                        if(error.code === "ECONNREFUSED"){
                            reject({
                                result: false,
                                data: 'No database service'
                            }); 
                        } else {
                            reject({
                                result: false,
                                data: error
                            });
                        }
                    } else {
                        if(result[0]){   
                            const sql = "update users set access = '' where user_id = " + con.escape(result[0]["user_id"]);
                            con.query(sql, function (error1, result1) {
                                if (error) {
                                    if(error.code === "ECONNREFUSED"){
                                        reject({
                                            result: false,
                                            data: 'No database service'
                                        }); 
                                    } else {
                                        reject({
                                            result: false,
                                            data: error
                                        });
                                    }
                                } else {
                                    // create a token
                                    const user_id = result[0]["user_id"];
                                    const token = jwt.sign({ id: user_id}, 
                                        process.env.APP_SECRET, 
                                        {expiresIn: 86400}
                                    );
                                    const info = {
                                        displayName: result[0]["displayName"]
                                    }
                                    resolve({
                                        result: true,
                                        token: token,
                                        data: info
                                    });
                                }
                            });
                        } else {
                            resolve({
                                result: false,
                                token: null,
                                data: 'No user found'
                            });
                        }
                    }   
                });
            }
          }
        catch(error) {
            console.error(error);
            reject({
                result: false,
                data: error
            });
        }
    });
}

module.exports = userModel;