import mongoose from 'mongoose';

var Schema = mongoose.Schema
let UserModelSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    role: {
        type: Array,

    }
})

export default mongoose.model('UserModel', UserModelSchema)
