const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlanSchema = Schema({
    owner: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    },
    targetTime: String,
    title: String,
    content: String,
    info: Object,
    access_token: String,
    online: Boolean,
}, {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
});

const PlanModel = mongoose.model('Plan', PlanSchema);

module.exports = PlanModel;
