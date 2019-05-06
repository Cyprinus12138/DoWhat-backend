const mongoose = require('mongoose');

mongoose.Promise = Promise;


const connect = url => {
    mongoose.connect(url);
};

const connectDb = (url, retry, callback) => {
    connect(url);

    mongoose.connection.on('connected', () => {
        console.log(`Mongoose connection open to ${url}`);
        callback(null);
    });

    mongoose.connection.on('error', err => {
        console.log(`Mongoose connection error: ${err}`);
        callback(err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose connection disconnected.');
        if (retry) {
            console.log('Trying to reconnect...');
            setTimeout(() => connect(url), 5000);
        } else {
            callback(null);
        }
    });
};

exports.connectDb = connectDb;
