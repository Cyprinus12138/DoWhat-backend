function badRequestError(msg) {
    const err = new Error(msg || '不合理的请求');
    err.statusCode = 400;
    return err;
}

function unauthorizedError(msg) {
    const err = new Error(msg || '尚未登录，无权操作');
    err.statusCode = 401;
    return err;
}

function forbiddenError(msg) {
    const err = new Error(msg || '没有足够的权限');
    err.statusCode = 403;
    return err;
}

function notFoundError(msg) {
    const err = new Error(msg || '找不到内容');
    err.statusCode = 404;
    return err;
}

function serverInternalError(msg) {
    const err = new Error(msg || '服务器内部出错');
    err.statusCode = 500;
    return err;
}

function databaseError(err) {
    console.log(err);
    return serverInternalError('数据库操作失败');
}

exports.badRequestError = badRequestError;
exports.unauthorizedError = unauthorizedError;
exports.forbiddenError = forbiddenError;
exports.notFoundError = notFoundError;
exports.serverInternalError = serverInternalError;
exports.databaseError = databaseError;
