import mongoose from 'mongoose';

var Schema = mongoose.Schema
let MatchModelSchema = new Schema({
    userOne: {
        type: String,
        required: true,
    },
    userTwo: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true
    },
    textfield: {
        type: String,
        required: true,
        default: "Type something here!"
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
})

export default mongoose.model('MatchModel', MatchModelSchema)