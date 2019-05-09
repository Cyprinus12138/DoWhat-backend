const jwt = require('jsonwebtoken');
const serverInternalError = require('./errors').serverInternalError;
const forbiddenError = require('./errors').forbiddenError;
const User = require('../model/User');


function generate_token(data, callback) {
    let yb_uid = null;
    let expires = null;
    if (data.yb_userid) yb_uid = data.yb_userid;
    if (data.userid) yb_uid = data.userid;
    if (data.yb_uid) yb_uid = data.yb_uid;
    if (data.expire_in) expires = data.expire_in;
    if (data.expires) expires = data.expires;
    if (!yb_uid || !expires) return callback(serverInternalError('JWT 签名失败'));
    jwt.sign(
        {yb_uid},
        process.env.SUPER_SECRET,
        {expiresIn: parseInt(expires)},
        (err, token) => {
            if (err) callback(serverInternalError('JWT 签名失败'));
            callback(null, token);
        }
    );
}


function verify_token(token, callback) {
    jwt.verify(token, process.env.SUPER_SECRET, (err, decoded) => {
        if (err) return callback(err);
        let yb_uid = decoded.yb_uid;
        User.findOne({yb_uid}, (err, user) => {
            if (err || !user) callback(forbiddenError());
            return callback(null, yb_uid, user._id);
        });
    });
}


function verify_token_midware(req, res, next) {
    if(!req.header('token') && req.body && !req.body.token) return next();
    if(!req.header('token') && req.query && !req.query.token) return next();
    let token = "";
    if(req.header('token')) token = req.header('token');
    else if (req.body && req.body.token) token = req.body.token;
    else if (req.query && req.query.token) token = req.query.token;
    verify_token(token, (err, data) => {
            if (err) {
                req.yb_uid = null;
                return next();
            }
            req.yb_uid = data.yb_uid;
            next();
        }
    )
}

exports.generate_token = generate_token;
exports.verify_token = verify_token;
exports.verify_token_midware = verify_token_midware;
