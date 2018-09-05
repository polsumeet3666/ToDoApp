var userSchema = require('../models/userSchema');
var md5 = require('md5');
var _ = require('underscore');

function createUser(user) {
    return new Promise((resolve, reject) => {
        //db creation logic

        user.password = md5(user.password);
        user = _.omit(user, 'repassword');
        if (mongoClient) {
            let userModel = mongoClient.model('user', userSchema);
            let userObj = new userModel(user);
            //console.log(userObj);
            userObj.save((err, result) => {
                if (err) {
                    console.log('error in creating error');
                    reject(err);
                }
                //console.log(result);
                resolve(result);
            })
        }
        else {
            console.log('mongoclient is empty');
            reject(new Error('Mongoclient is empty'));

        }
    });
}

function userLogin(user) {
    return new Promise((resolve, reject) => {
        user.password = md5(user.password);
        if (mongoClient) {
            let userModel = mongoClient.model('user', userSchema);
            //console.log(user);
            userModel.findOne(user, (err, result) => {
                if (err) {
                    console.log('login error ' + err);
                    reject(err);
                }

                if (result) {
                    console.log('login success for ');
                    //console.log(result);
                    resolve(result);
                }
                else {
                    console.log('no record found');
                    reject(err);
                }

            });
        }
        else {
            console.log('mongoclient is empty');
            reject(new Error('Mongoclient is empty'));

        }

    });
}



module.exports = {
    createUser,
    userLogin
}