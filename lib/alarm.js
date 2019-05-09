const Plan = require("../model/Plan");


console.log("Alarm server is loaded.");

setInterval(() => {
Plan.find({isAlarm: true}, (err, plans) => {

})
}, 1000 * 60 * 5);
