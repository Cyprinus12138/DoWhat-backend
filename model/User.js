const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = Schema({
    yb_uid : String,
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    },
    info: Object,
    access_token: String,
    online: Boolean,
}, {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
