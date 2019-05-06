const async = require("async");
const express = require('express');
const forbiddenError = require('../lib/errors').forbiddenError;
const Plan = require('../model/Plan');
const User = require('../model/User');

const router = express.Router();

router.post('/new', (req, res) => {
    if (!req.yb_uid) {
        let err = forbiddenError();
        res.status(err.statusCode);
        res.json({
            success: false,
            msg: err.message
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
            function newPlan(user, callback) {
                let plan = new Plan(req.body);
                plan.owner = user._id;
                plan.save((err) => {
                    if (err) return callback(err);
                });
                callback(null, plan._id);
            },
        ],
        function (err, planId) {
            if (err) {
                res.status(err.statusCode | 500);
                return res.json({
                    success: false,
                    msg: err.message,
                });
            }
            res.json({
                success: true,
                id: planId,
            });
        }
    );

});


module.exports = router;
