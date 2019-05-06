const request = require('request');
const forbiddenError = require('./errors').forbiddenError;
const serverInternalError = require('./errors').serverInternalError;

function get_access_info(code, callback) {
    request.post('https://openapi.yiban.cn/oauth/access_token', (err, httpResponse, body) => {
        if(err) return callback(err);
        if(JSON.parse(body).access_token)
            callback(null, JSON.parse(body));
        else
            callback(forbiddenError());
    }).form({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URL,
    });
}

function get_user_info(access_token, callback) {
    request.get('https://openapi.yiban.cn/user/me', (err, httpResponse, body) => {
        if (JSON.parse(body).status ==="success") callback(null, JSON.parse(body).info);
        else callback(serverInternalError());
    }).qs({access_token: access_token});
}

function if_valid_token(access_token, callback) {
    request.post('https://openapi.yiban.cn/oauth/token_info', (err, httpResponse, body) => {
        if(err) return callback(err);
        if(JSON.parse(body).status ==="200")
            callback(null, JSON.parse(body));
        else
            callback(null, false);
    }).form({
        client_id: process.env.CLIENT_ID,
        access_token
    });
}

exports.get_access_info = get_access_info;
exports.get_user_info = get_user_info;
exports.if_valid_token = if_valid_token;

    