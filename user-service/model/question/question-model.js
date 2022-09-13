import mongoose from 'mongoose';

var Schema = mongoose.Schema
let QuestionModelSchema = new Schema({
    difficulty: {
        type: String,
        required: true
    }, 
    question: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export default mongoose.model('QuestionModel', QuestionModelSchema)