const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    result: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        require: true
    }

}, {
    timestamps: true
});


module.exports = mongoose.model('History', historySchema);
