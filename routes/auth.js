const async = require('async');
const express = require('express');

const User = require('../model/User');
const generate_token = require('../lib/auth').generate_token;
const router = express.Router();
const get_access_info = require('../lib/yiban').get_access_info;
const get_user_info = require('../lib/yiban').get_user_info;
const serverInternalError = require('../lib/errors').serverInternalError;
const databaseError = require('../lib/errors').databaseError;
const forbiddenError = require('../lib/errors').forbiddenError;

router.post('/login_yb', (req, res) => {
    async.waterfall(
        [
            function authUser(callback) {
                get_access_info(req.body.code, (err, access_info) => {
                    if (err) return callback(forbiddenError());
                    callback(null, access_info);
                });
            },
            function findUser(access_info, callback) {
                User.findOne({yb_uid: access_info.userid}, (err, user) => {
                    if (err) return callback(serverInternalError());
                    callback(null, user, access_info);
                });
            },
            function saveUser(user, access_info, callback) {
                if (!user) User({yb_uid: access_info.userid}).save((err) => {
                    if (err) return callback(databaseError());
                    callback(null, access_info);
                });
                else callback(null, access_info);
            },
            function getInfo(access_info, callback) {
                get_user_info(access_info.access_token, (err, info) => {
                    if (err) return callback(err);
                    callback(null, info, access_info);
                });
            },
            function saveInfo(info, access_info, callback) {
                User.findOne({yb_uid: access_info.userid}, (err, user) => {
                    if (!user || err) return callback(serverInternalError());
                    user.info = info;
                    user.access_token = access_info.access_token;
                    user.save((err) => {
                        if (err) return callback(databaseError());
                        callback(null, access_info, info, user._id);
                    });
                });
            },
        ],
        (err, access_info, info, user_id) => {
            if (err) {
                res.status(err.statusCode);
                return res.json({
                    success: false,
                    msg: err.message,
                });
            }
            info.expires = access_info.expires;
            generate_token(info, (err, token) => {
                if (err) {
                    res.status(err.statusCode);
                    return res.json({
                        success: false,
                        msg: err.message,
                    });
                }
                res.json({success: true, id: user_id, access_token: access_info.access_token, token, info});
            });
        }
    )
});


module.exports = router;
