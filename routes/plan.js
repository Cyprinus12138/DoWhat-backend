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

router.route('/:planId')
    .all((req, res, next) => {
        if (!req.yb_uid) {
            let err = forbiddenError();
            res.status(err.statusCode);
            return res.json({
                success: false,
                msg: err.message
            });
        }
        next();
    })
    .put((req, res) => {
        async.waterfall(
            [
                function getPlan(callback) {
                    Plan.findById(req.params.planId, (err, plan) => {
                        if (err) return callback(err);
                        callback(null, plan);
                    });
                },
                function modifyPlan(plan, callback) {
                    plan.content = req.body.content;
                    plan.title = req.body.title;
                    plan.targetTime = req.body.targetTime;
                    plan.isAlarm = req.body.isAlarm;
                    plan.save((err) => {
                        if (err) return callback(err);
                    });
                    callback(null, plan);
                },
            ],
            function (err, plan) {
                if (err) {
                    res.status(err.statusCode | 500);
                    return res.json({
                        success: false,
                        msg: err.message,
                    });
                }
                res.json({
                    success: true,
                    plan,
                });
            }
        )
    })
    .delete((req, res) => {
        async.waterfall(
            [
                function getPlan(callback) {
                    Plan.findById(req.params.planId, (err, plan) => {
                        if (err) return callback(err);
                        callback(null, plan);
                    });
                },
                function removePlan(plan, callback) {
                    plan.remove((err) => {
                        if (err) return callback(err);
                    });
                    callback(null);
                }
            ],
            function (err) {
                if (err) {
                    res.status(err.statusCode | 500);
                    return res.json({
                        success: false,
                        msg: err.message,
                    });
                }
                res.json({
                    success: true,
                });
            }
        )
    });

module.exports = router;
