const express = require('express');
const async = require('async');
const User = require('../model/User');
const Plan = require('../model/Plan');
const forbiddenError = require('../lib/errors').forbiddenError;

const router = express.Router();

router.get('/plans', (req, res) => {
    const page = !(req.query.page > 0) ? 1 : parseInt(req.query.page);
    const limit = !req.query.limit ? 5 : parseInt(req.query.limit);
    if (!req.yb_uid) {
        let err = forbiddenError();
        res.status(err.statusCode);
        return res.json({
            success: false,
            msg: err.message,
        });
    }
    async.waterfall(
        [
            function getUser(callback) {
                User.findOne({yb_uid: req.yb_uid}, (err, user) => {
                    if (err) return callback(err);
                    callback(null, user);
                });
            },
            function getPlans(user, callback) {
                Plan.find({owner: user._id}).skip((page - 1) * limit)
                    .limit(limit)
                    .exec((err, plans) => {
                        if (err) return callback(err);
                        callback(null, plans);
                    });
            },
        ],
        function (err, plans) {
            if (err) {
                res.status(err.statusCode | 500);
                return res.json({
                    success: false,
                    msg: err.message,
                });
            }
            res.json({
                success: true,
                plans
            });
        }
    )

});

module.exports = router;
